import { randomUUID } from 'crypto';
import { getQayAdmin } from '../supabase-admin';
import { detectTemplateChoice } from '../ai/template-detector';
import { buildQayIndexSlug } from '../index-slug';
import { generatePageLayersHash } from '@/lib/hash-utils';

export interface CloneResult {
  siteId: string;
  siteName: string;
  pages: Array<{ name: string; slug: string }>;
  cmsCollections: Array<{ name: string; id: string }>;
}

export async function cloneProjectFromTemplate(
  templateId: string,
  userId: string,
  prompt: string,
  variation?: number
): Promise<CloneResult> {
  const admin = getQayAdmin() as any;

  // Step 1: Load full template data
  const { data: template } = await admin
    .from('qay_ai_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (!template) throw new Error('Template not found');

  const decision = detectTemplateChoice(prompt, variation);

  // Step 2: Create the new site
  const siteName = decision.businessName || extractNameFromPrompt(prompt) || 'My Site';
  const siteSlug = `${slugify(siteName)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: newSite, error: siteError } = await admin
    .from('qay_sites')
    .insert({
      owner_id: userId,
      name: siteName,
      slug: siteSlug,
    })
    .select('id, name, slug')
    .single();

  if (siteError || !newSite) throw new Error('Failed to create site: ' + (siteError?.message || 'unknown error'));

  const siteId = newSite.id;

  if (!template.source_site_id) {
    throw new Error('Template does not have a source project to deep clone');
  }

  const cloneResult = await cloneSourceProject({
    admin,
    sourceSiteId: template.source_site_id,
    targetSiteId: siteId,
    userId,
  });

  if (template.has_auth) {
    await admin.from('qay_site_auth').insert({
      site_id: siteId,
      enabled: true,
    }).catch(() => {});
  }

  await admin.from('qay_template_usage').insert({
    template_id: templateId,
    cloned_site_id: siteId,
    user_id: userId,
    prompt,
  }).catch(() => {});

  return {
    siteId,
    siteName,
    pages: cloneResult.pages,
    cmsCollections: cloneResult.cmsCollections,
  };
}

async function cloneSourceProject({
  admin,
  sourceSiteId,
  targetSiteId,
  userId,
}: {
  admin: any;
  sourceSiteId: string;
  targetSiteId: string;
  userId: string;
}): Promise<Pick<CloneResult, 'pages' | 'cmsCollections'>> {
  const { data: sourcePages, error: pagesError } = await admin
    .from('pages')
    .select('id, name, slug, "order", depth, page_folder_id, is_index, is_dynamic, error_page, settings')
    .filter('settings->>qay_site_id', 'eq', sourceSiteId)
    .eq('is_published', false)
    .is('deleted_at', null)
    .order('order', { ascending: true });

  if (pagesError) throw new Error('Failed to read template pages: ' + pagesError.message);
  if (!sourcePages?.length) throw new Error('Template source project has no editable pages');

  const sourcePageIds = sourcePages.map((page: any) => page.id);
  const { data: sourceLayerRows, error: layersError } = await admin
    .from('page_layers')
    .select('page_id, layers')
    .in('page_id', sourcePageIds)
    .eq('is_published', false)
    .is('deleted_at', null);

  if (layersError) throw new Error('Failed to read template page layers: ' + layersError.message);

  const layerByPageId = new Map<string, any>();
  for (const layerRow of sourceLayerRows || []) {
    layerByPageId.set(layerRow.page_id, normalizeLayers(layerRow.layers));
  }

  const pageIdMap = new Map<string, string>();
  const pages: Array<{ name: string; slug: string }> = [];

  for (let index = 0; index < sourcePages.length; index++) {
    const sourcePage = sourcePages[index];
    const newPageId = randomUUID();
    pageIdMap.set(sourcePage.id, newPageId);

    const isIndex = Boolean(sourcePage.is_index) || sourcePage.slug === '' || sourcePage.slug === '/';
    const slug = isIndex ? buildQayIndexSlug(targetSiteId) : normalizePageSlug(sourcePage.slug || sourcePage.name || `page-${index + 1}`);
    const settings = {
      ...(typeof sourcePage.settings === 'object' && sourcePage.settings ? sourcePage.settings : {}),
      qay_site_id: targetSiteId,
    };

    const { error: insertPageError } = await admin.from('pages').insert({
      id: newPageId,
      name: sourcePage.name,
      slug,
      order: typeof sourcePage.order === 'number' ? sourcePage.order : index,
      depth: sourcePage.depth || 0,
      page_folder_id: null,
      is_index: isIndex,
      is_published: false,
      is_dynamic: Boolean(sourcePage.is_dynamic),
      error_page: sourcePage.error_page || null,
      settings,
    });

    if (insertPageError) throw new Error('Failed to clone template page: ' + insertPageError.message);

    const layers = layerByPageId.get(sourcePage.id) || [{
      id: 'body',
      name: 'body',
      classes: '',
      children: [],
    }];

    const { error: insertLayersError } = await admin.from('page_layers').insert({
      id: randomUUID(),
      page_id: newPageId,
      layers,
      is_published: false,
      content_hash: generatePageLayersHash({ layers, generated_css: null }),
    });

    if (insertLayersError) throw new Error('Failed to clone template layers: ' + insertLayersError.message);

    pages.push({ name: sourcePage.name, slug });
  }

  const cmsCollections = await cloneSourceCms({
    admin,
    sourceSiteId,
    targetSiteId,
    userId,
  });

  return { pages, cmsCollections };
}

async function cloneSourceCms({
  admin,
  sourceSiteId,
  targetSiteId,
  userId,
}: {
  admin: any;
  sourceSiteId: string;
  targetSiteId: string;
  userId: string;
}): Promise<Array<{ name: string; id: string }>> {
  const { data: sourceLinks, error: linkError } = await admin
    .from('qay_site_collections')
    .select('collection_id')
    .eq('site_id', sourceSiteId);

  if (linkError) throw new Error('Failed to read template CMS links: ' + linkError.message);
  const sourceCollectionIds = (sourceLinks || []).map((link: any) => link.collection_id).filter(Boolean);
  if (sourceCollectionIds.length === 0) return [];

  const { data: sourceCollections, error: collectionsError } = await admin
    .from('collections')
    .select('*')
    .in('id', sourceCollectionIds)
    .eq('is_published', false)
    .is('deleted_at', null);

  if (collectionsError) throw new Error('Failed to read template CMS collections: ' + collectionsError.message);

  const collectionIdMap = new Map<string, string>();
  const cmsCollections: Array<{ name: string; id: string }> = [];

  for (const collection of sourceCollections || []) {
    const newCollectionId = randomUUID();
    collectionIdMap.set(collection.id, newCollectionId);

    const { error: insertCollectionError } = await admin.from('collections').insert({
      id: newCollectionId,
      name: collection.name,
      uuid: randomUUID(),
      sorting: collection.sorting,
      order: collection.order || 0,
      is_published: false,
    });

    if (insertCollectionError) throw new Error('Failed to clone CMS collection: ' + insertCollectionError.message);

    const { error: insertLinkError } = await admin.from('qay_site_collections').insert({
      site_id: targetSiteId,
      collection_id: newCollectionId,
      created_by: userId,
    });

    if (insertLinkError) throw new Error('Failed to link cloned CMS collection: ' + insertLinkError.message);
    cmsCollections.push({ name: collection.name, id: newCollectionId });
  }

  const { data: sourceFields, error: fieldsError } = await admin
    .from('collection_fields')
    .select('*')
    .in('collection_id', sourceCollectionIds)
    .eq('is_published', false)
    .is('deleted_at', null);

  if (fieldsError) throw new Error('Failed to read template CMS fields: ' + fieldsError.message);

  const fieldIdMap = new Map<string, string>();
  const fieldRows = (sourceFields || []).flatMap((field: any) => {
    const collectionId = collectionIdMap.get(field.collection_id);
    if (!collectionId) return [];
    const newFieldId = randomUUID();
    fieldIdMap.set(field.id, newFieldId);
    return [{
      id: newFieldId,
      collection_id: collectionId,
      reference_collection_id: field.reference_collection_id ? collectionIdMap.get(field.reference_collection_id) || null : null,
      name: field.name,
      key: field.key,
      type: field.type,
      default: field.default,
      fillable: field.fillable,
      order: field.order || 0,
      hidden: field.hidden,
      is_computed: field.is_computed,
      data: field.data || {},
      is_published: false,
    }];
  });

  if (fieldRows.length > 0) {
    const { error } = await admin.from('collection_fields').insert(fieldRows);
    if (error) throw new Error('Failed to clone CMS fields: ' + error.message);
  }

  const { data: sourceItems, error: itemsError } = await admin
    .from('collection_items')
    .select('*')
    .in('collection_id', sourceCollectionIds)
    .eq('is_published', false)
    .is('deleted_at', null);

  if (itemsError) throw new Error('Failed to read template CMS items: ' + itemsError.message);

  const itemIdMap = new Map<string, string>();
  const itemRows = (sourceItems || []).flatMap((item: any) => {
    const collectionId = collectionIdMap.get(item.collection_id);
    if (!collectionId) return [];
    const newItemId = randomUUID();
    itemIdMap.set(item.id, newItemId);
    return [{
      id: newItemId,
      collection_id: collectionId,
      manual_order: item.manual_order || 0,
      is_publishable: item.is_publishable,
      is_published: false,
    }];
  });

  if (itemRows.length > 0) {
    const { error } = await admin.from('collection_items').insert(itemRows);
    if (error) throw new Error('Failed to clone CMS items: ' + error.message);
  }

  const sourceItemIds = (sourceItems || []).map((item: any) => item.id);
  if (sourceItemIds.length > 0) {
    const { data: sourceValues, error: valuesError } = await admin
      .from('collection_item_values')
      .select('*')
      .in('item_id', sourceItemIds)
      .eq('is_published', false)
      .is('deleted_at', null);

    if (valuesError) throw new Error('Failed to read template CMS values: ' + valuesError.message);

    const valueRows = (sourceValues || []).flatMap((value: any) => {
      const itemId = itemIdMap.get(value.item_id);
      const fieldId = fieldIdMap.get(value.field_id);
      if (!itemId || !fieldId) return [];
      return [{
        id: randomUUID(),
        item_id: itemId,
        field_id: fieldId,
        value: value.value,
        is_published: false,
      }];
    });

    if (valueRows.length > 0) {
      const { error } = await admin.from('collection_item_values').insert(valueRows);
      if (error) throw new Error('Failed to clone CMS values: ' + error.message);
    }
  }

  return cmsCollections;
}

function normalizeLayers(layers: unknown): any[] {
  if (Array.isArray(layers)) return layers;
  if (typeof layers === 'string') {
    try {
      const parsed = JSON.parse(layers);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizePageSlug(slug: string): string {
  return slug
    .replace(/^\/+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'page';
}

function extractNameFromPrompt(prompt: string): string | null {
  const match = prompt.match(/(?:called|named)\s+["']?([A-Za-z][A-Za-z0-9\s'&.-]{1,40})["']?/i);
  return match?.[1]?.trim() || null;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
