import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getDraftLayers, upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { getAssetsByIds } from '@/lib/repositories/assetRepository';
import { getFormSummaries } from '@/lib/repositories/formSubmissionRepository';
import { getTopItemsWithValuesPerCollection } from '@/lib/repositories/collectionItemRepository';
import { setValuesByFieldName } from '@/lib/repositories/collectionItemValueRepository';
import { isValidUUID } from '@/lib/utils';
import type { Asset, CollectionFieldType, Layer, Page, PageLayers } from '@/types';
import type { QaySite } from '@/qay/types';
import { getTiptapTextContent } from '@/lib/mcp/utils';
import { withResolvedQayLiveUrl } from './site-url';

export type ClientAccessibleSite = Pick<
  QaySite,
  'id' | 'name' | 'slug' | 'custom_domain' | 'domain_verified' | 'publish_status' | 'thumbnail_url' | 'updated_at' | 'live_url'
> & {
  access_role: 'owner' | 'member';
};

export type ClientPageSummary = Pick<
  Page,
  'id' | 'name' | 'slug' | 'is_index' | 'updated_at' | 'page_folder_id'
>;

export type ClientEditableField = {
  fieldId: string;
  layerId: string;
  label: string;
  kind: 'text' | 'richText' | 'image' | 'video';
  value: string;
};

export type ClientCmsSummary = {
  collectionId: string;
  name: string;
  slug: string | null;
  fieldCount: number;
  itemCount: number;
  fields: Array<{ id: string; name: string; type: CollectionFieldType | null }>;
  items: Array<{ itemId: string; values: Record<string, string | null> }>;
};

export type ClientFormSummary = {
  formId: string;
  name: string;
  pageName: string;
  pageSlug: string;
  submissionCount: number;
  newCount: number;
  latestSubmission: string | null;
};

export type ClientSiteContent = {
  site: ClientAccessibleSite;
  pages: ClientPageSummary[];
  selectedPage: ClientPageSummary | null;
  editableFields: ClientEditableField[];
  draftLayers: PageLayers | null;
};

export type ClientPendingInvite = {
  id: string;
  site_id: string;
  email: string;
  token: string;
  role: string;
  expires_at: string | null;
  created_at: string | null;
  site: Pick<QaySite, 'id' | 'name' | 'slug' | 'thumbnail_url'> | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isLayerInSite(page: Page, siteId: string) {
  const settings = isRecord(page.settings) ? page.settings : {};
  return settings.qay_site_id === siteId;
}

function extractTextFromTiptap(node: unknown): string {
  if (!node) return '';

  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromTiptap).join('');
  }

  if (!isRecord(node)) {
    return '';
  }

  const type = typeof node.type === 'string' ? node.type : null;
  const text = typeof node.text === 'string' ? node.text : '';
  const content = Array.isArray(node.content) ? node.content : [];
  const childText = content.map(extractTextFromTiptap).join(type === 'paragraph' ? '' : ' ');

  if (type === 'paragraph' || type === 'heading' || type === 'blockquote') {
    return [text, childText].filter(Boolean).join('').trim();
  }

  return [text, childText].filter(Boolean).join(' ').trim();
}

function getVariableContent(variable: unknown, assetMap: Record<string, Asset>): string | null {
  if (!isRecord(variable)) {
    return null;
  }

  const data = isRecord(variable.data) ? variable.data : {};

  if ((variable.type === 'dynamic_text' || variable.type === 'static_text') && typeof data.content === 'string') {
    return data.content;
  }

  if (variable.type === 'asset' && typeof data.asset_id === 'string') {
    return assetMap[data.asset_id]?.public_url ?? null;
  }

  return null;
}

function collectAssetIds(layers: Layer[]): string[] {
  const ids = new Set<string>();
  const walk = (items: Layer[]) => {
    for (const layer of items) {
      const variables = layer.variables as any;
      const imageSrc = variables?.image?.src;
      const backgroundSrc = variables?.backgroundImage?.src;
      const videoSrc = variables?.video?.src;

      for (const variable of [imageSrc, backgroundSrc, videoSrc]) {
        const data = isRecord(variable?.data) ? variable.data : null;
        if (variable?.type === 'asset' && typeof data?.asset_id === 'string' && isValidUUID(data.asset_id)) {
          ids.add(data.asset_id);
        }
      }

      if (layer.children?.length) {
        walk(layer.children);
      }
    }
  };

  walk(layers);
  return Array.from(ids);
}

function getLayerEditableValues(layer: Layer, assetMap: Record<string, Asset>): ClientEditableField[] {
  const fields: ClientEditableField[] = [];
  const label = layer.customName || layer.name || 'Content';
  const variables = layer.variables as any;
  const imageValue = getVariableContent(variables?.image?.src, assetMap);
  const backgroundValue = getVariableContent(variables?.backgroundImage?.src, assetMap);
  const videoValue = getVariableContent(variables?.video?.src, assetMap);

  if (imageValue !== null) {
    fields.push({
      fieldId: `${layer.id}:image`,
      layerId: layer.id,
      label: `${label} image`,
      kind: 'image',
      value: imageValue,
    });
  }

  if (backgroundValue !== null) {
    fields.push({
      fieldId: `${layer.id}:backgroundImage`,
      layerId: layer.id,
      label: `${label} background`,
      kind: 'image',
      value: backgroundValue,
    });
  }

  if (videoValue !== null) {
    fields.push({
      fieldId: `${layer.id}:video`,
      layerId: layer.id,
      label: `${label} video`,
      kind: 'video',
      value: videoValue,
    });
  }

  const textVariable = layer.variables?.text;
  if (!textVariable || !('type' in textVariable)) {
    return fields;
  }

  if (textVariable.type === 'dynamic_text' || (textVariable as any).type === 'static_text') {
    const value = typeof (textVariable as any).data?.content === 'string' ? (textVariable as any).data.content : '';
    fields.push({
      fieldId: `${layer.id}:text`,
      layerId: layer.id,
      label,
      kind: 'text',
      value,
    });
    return fields;
  }

  if (textVariable.type === 'dynamic_rich_text') {
    const rawContent = textVariable.data?.content;
    const value = extractTextFromTiptap(rawContent);
    const isRichText = layer.name === 'richText';

    fields.push({
      fieldId: `${layer.id}:text`,
      layerId: layer.id,
      label,
      kind: isRichText ? 'richText' : 'text',
      value,
    });
  }

  return fields;
}

export async function extractEditableFields(layers: Layer[]): Promise<ClientEditableField[]> {
  const fields: ClientEditableField[] = [];
  const assetIds = collectAssetIds(layers);
  let assetMap: Record<string, Asset> = {};

  if (assetIds.length > 0) {
    try {
      assetMap = await getAssetsByIds(assetIds, false);
    } catch (error) {
      console.warn('[ClientContent] Unable to resolve asset-backed editable fields:', error);
    }
  }

  const walk = (items: Layer[]) => {
    for (const layer of items) {
      fields.push(...getLayerEditableValues(layer, assetMap));

      if (layer.children?.length) {
        walk(layer.children);
      }
    }
  };

  walk(layers);
  return fields;
}

function updateVariableContent(variable: unknown, nextValue: string) {
  if (!isRecord(variable)) {
    return variable;
  }

  if (variable.type === 'dynamic_text' || variable.type === 'static_text') {
    return {
      ...variable,
      data: {
        ...(isRecord(variable.data) ? variable.data : {}),
        content: nextValue,
      },
    };
  }

  if (variable.type === 'asset') {
    return {
      type: 'dynamic_text',
      data: { content: nextValue },
    };
  }

  return variable;
}

function updateLayerContent(layers: Layer[], updates: Map<string, string>): Layer[] {
  return layers.map((layer) => {
    const nextLayer: Layer = {
      ...layer,
      children: layer.children ? updateLayerContent(layer.children, updates) : layer.children,
    };

    const textValue = updates.get(`${layer.id}:text`) ?? updates.get(layer.id);
    const imageValue = updates.get(`${layer.id}:image`);
    const backgroundImageValue = updates.get(`${layer.id}:backgroundImage`);
    const videoValue = updates.get(`${layer.id}:video`);

    if (textValue === undefined && imageValue === undefined && backgroundImageValue === undefined && videoValue === undefined) {
      return nextLayer;
    }

    let updatedLayer = nextLayer;
    const existingText = nextLayer.variables?.text;
    if (textValue !== undefined && existingText?.type === 'dynamic_rich_text') {
      updatedLayer = {
        ...updatedLayer,
        variables: {
          ...updatedLayer.variables,
          text: {
            ...existingText,
            data: {
              ...existingText.data,
              content: getTiptapTextContent(textValue),
            },
          },
        },
      };
    } else if (textValue !== undefined && existingText) {
      updatedLayer = {
        ...updatedLayer,
        variables: {
          ...updatedLayer.variables,
          text: updateVariableContent(existingText, textValue) as any,
        },
      };
    }

    const existingImage = (updatedLayer.variables as any)?.image;
    const imageSrc = existingImage?.src;
    if (imageValue !== undefined && existingImage && imageSrc) {
      updatedLayer = {
        ...updatedLayer,
        variables: {
          ...updatedLayer.variables,
          image: {
            ...existingImage,
            src: updateVariableContent(imageSrc, imageValue),
          },
        },
      };
    }

    const existingBackgroundImage = (updatedLayer.variables as any)?.backgroundImage;
    const backgroundSrc = existingBackgroundImage?.src;
    if (backgroundImageValue !== undefined && existingBackgroundImage && backgroundSrc) {
      updatedLayer = {
        ...updatedLayer,
        variables: {
          ...updatedLayer.variables,
          backgroundImage: {
            ...existingBackgroundImage,
            src: updateVariableContent(backgroundSrc, backgroundImageValue),
          },
        },
      };
    }

    const existingVideo = (updatedLayer.variables as any)?.video;
    const videoSrc = existingVideo?.src;
    if (videoValue !== undefined && existingVideo && videoSrc) {
      updatedLayer = {
        ...updatedLayer,
        variables: {
          ...updatedLayer.variables,
          video: {
            ...existingVideo,
            src: updateVariableContent(videoSrc, videoValue),
          },
        },
      };
    }

    return updatedLayer;
  });
}

async function getAccessibleSite(siteId: string, userId: string): Promise<ClientAccessibleSite | null> {
  const supabase = getQayAdmin() as any;

  const { data: ownedSite, error: ownedError } = await supabase
    .from('qay_sites')
    .select('id, name, slug, custom_domain, domain_verified, publish_status, thumbnail_url, updated_at, live_url')
    .eq('id', siteId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (ownedError) {
    throw new Error(ownedError.message);
  }

  if (ownedSite) {
    return { ...withResolvedQayLiveUrl(ownedSite), access_role: 'owner' };
  }

  const { data: membership, error: memberError } = await supabase
    .from('qay_site_members')
    .select('site_id')
    .eq('site_id', siteId)
    .eq('user_id', userId)
    .maybeSingle();

  if (memberError) {
    throw new Error(memberError.message);
  }

  if (!membership) {
    return null;
  }

  const { data: site, error: siteError } = await supabase
    .from('qay_sites')
    .select('id, name, slug, custom_domain, domain_verified, publish_status, thumbnail_url, updated_at, live_url')
    .eq('id', siteId)
    .maybeSingle();

  if (siteError) {
    throw new Error(siteError.message);
  }

  return site ? { ...withResolvedQayLiveUrl(site), access_role: 'member' } : null;
}

export async function getClientAccessibleSites(userId: string): Promise<ClientAccessibleSite[]> {
  const supabase = getQayAdmin() as any;

  const [{ data: ownedSites, error: ownedError }, { data: memberships, error: memberError }] = await Promise.all([
    supabase
      .from('qay_sites')
      .select('id, name, slug, custom_domain, domain_verified, publish_status, thumbnail_url, updated_at, live_url')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false }),
    supabase
      .from('qay_site_members')
      .select('site_id')
      .eq('user_id', userId),
  ]);

  if (ownedError) {
    throw new Error(ownedError.message);
  }

  if (memberError) {
    throw new Error(memberError.message);
  }

  const memberSiteIds = Array.from(new Set((memberships ?? []).map((item: { site_id: string }) => item.site_id)));
  let memberSites: ClientAccessibleSite[] = [];

  if (memberSiteIds.length > 0) {
    const { data, error } = await supabase
      .from('qay_sites')
      .select('id, name, slug, custom_domain, domain_verified, publish_status, thumbnail_url, updated_at, live_url')
      .in('id', memberSiteIds)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    memberSites = (data ?? []).map((site: ClientAccessibleSite) => ({
      ...withResolvedQayLiveUrl(site),
      access_role: 'member',
    }));
  }

  const owned = (ownedSites ?? []).map((site: ClientAccessibleSite) => ({
    ...withResolvedQayLiveUrl(site),
    access_role: 'owner',
  }));
  const combined = [...owned, ...memberSites];
  const deduped = new Map<string, ClientAccessibleSite>();

  for (const site of combined) {
    if (!deduped.has(site.id) || site.access_role === 'owner') {
      deduped.set(site.id, site);
    }
  }

  return Array.from(deduped.values()).sort((a, b) => {
    const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return bTime - aTime;
  });
}

export async function getPendingClientInvites(email: string | null | undefined): Promise<ClientPendingInvite[]> {
  if (!email) {
    return [];
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_invites')
    .select('id, site_id, email, token, role, expires_at, created_at, site:qay_sites(id, name, slug, thumbnail_url)')
    .ilike('email', email)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((invite: any) => ({
    ...invite,
    site: Array.isArray(invite.site) ? invite.site[0] ?? null : invite.site ?? null,
  }));
}

export async function getClientSiteContent(userId: string, siteId: string, pageId?: string | null): Promise<ClientSiteContent | null> {
  const supabase = getQayAdmin() as any;
  const site = await getAccessibleSite(siteId, userId);

  if (!site) {
    return null;
  }

  const { data: rawPages, error: pagesError } = await supabase
    .from('pages')
    .select('*')
    .eq('is_published', false)
    .is('deleted_at', null)
    .is('error_page', null)
    .filter('settings->>qay_site_id', 'eq', siteId)
    .order('order', { ascending: true })
    .order('created_at', { ascending: true });

  if (pagesError) {
    throw new Error(pagesError.message);
  }

  const pages = ((rawPages ?? []) as Page[])
    .filter((page) => isLayerInSite(page, siteId))
    .map((page) => ({
      id: page.id,
      name: page.name,
      slug: page.slug,
      is_index: page.is_index,
      updated_at: page.updated_at,
      page_folder_id: page.page_folder_id,
    }));

  const selectedPage = pages.find((page) => page.id === pageId)
    ?? pages.find((page) => page.is_index && page.page_folder_id === null)
    ?? pages[0]
    ?? null;

  let draftLayers: PageLayers | null = null;
  let editableFields: ClientEditableField[] = [];

  if (selectedPage) {
    try {
      draftLayers = await getDraftLayers(selectedPage.id);
      editableFields = draftLayers?.layers ? await extractEditableFields(draftLayers.layers) : [];
    } catch (error) {
      console.error('[ClientContent] Failed to load editable page content:', error);
    }
  }

  return {
    site,
    pages,
    selectedPage,
    editableFields,
    draftLayers,
  };
}

export async function updateClientPageContent(
  userId: string,
  siteId: string,
  pageId: string,
  fieldUpdates: Array<{ fieldId?: string; layerId: string; value: string }>
): Promise<ClientSiteContent | null> {
  const siteContent = await getClientSiteContent(userId, siteId, pageId);

  if (!siteContent || !siteContent.selectedPage || !siteContent.draftLayers) {
    return null;
  }

  const updates = new Map(
    fieldUpdates
      .filter((item) => typeof (item.fieldId ?? item.layerId) === 'string' && typeof item.value === 'string')
      .map((item) => [item.fieldId ?? item.layerId, item.value])
  );

  const nextLayers = updateLayerContent(siteContent.draftLayers.layers, updates);
  await upsertDraftLayers(pageId, nextLayers, {
    generated_css: siteContent.draftLayers.generated_css ?? null,
  });

  return getClientSiteContent(userId, siteId, pageId);
}

export async function getClientSiteCms(userId: string, siteId: string): Promise<{
  site: ClientAccessibleSite;
  collections: ClientCmsSummary[];
} | null> {
  const supabase = getQayAdmin() as any;
  const site = await getAccessibleSite(siteId, userId);

  if (!site) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from('qay_site_collections')
    .select('collection_id')
    .eq('site_id', siteId);

  if (linksError) {
    if (linksError.code === 'PGRST205' || linksError.message?.includes('qay_site_collections')) {
      return { site, collections: [] };
    }
    throw new Error(linksError.message);
  }

  const collectionIds: string[] = Array.from(new Set<string>(
    (links ?? [])
      .map((link: { collection_id: string }) => link.collection_id)
      .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
  ));

  if (collectionIds.length === 0) {
    return { site, collections: [] };
  }

  const [{ data: collections, error: collectionsError }, { data: fields, error: fieldsError }, { data: items, error: itemsError }] = await Promise.all([
    supabase
      .from('collections')
      .select('id, name')
      .in('id', collectionIds)
      .eq('is_published', false)
      .is('deleted_at', null)
      .order('name', { ascending: true }),
    supabase
      .from('collection_fields')
      .select('id, collection_id, name, type')
      .in('collection_id', collectionIds)
      .eq('is_published', false)
      .is('deleted_at', null)
      .order('order', { ascending: true }),
    supabase
      .from('collection_items')
      .select('id, collection_id')
      .in('collection_id', collectionIds)
      .eq('is_published', false)
      .is('deleted_at', null),
  ]);

  if (collectionsError) throw new Error(collectionsError.message);
  if (fieldsError) throw new Error(fieldsError.message);
  if (itemsError) throw new Error(itemsError.message);

  const fieldsByCollection = new Map<string, Array<{ id: string; name: string; type: CollectionFieldType | null }>>();
  for (const field of fields ?? []) {
    const list = fieldsByCollection.get(field.collection_id) ?? [];
    list.push({ id: field.id, name: field.name, type: field.type ?? null });
    fieldsByCollection.set(field.collection_id, list);
  }

  const itemCounts = new Map<string, number>();
  for (const item of items ?? []) {
    itemCounts.set(item.collection_id, (itemCounts.get(item.collection_id) ?? 0) + 1);
  }

  const itemsByCollection = await getTopItemsWithValuesPerCollection(collectionIds, false, 25);

  return {
    site,
    collections: (collections ?? []).map((collection: any) => {
      const collectionFields = fieldsByCollection.get(collection.id) ?? [];
      const collectionItems = itemsByCollection[collection.id]?.items ?? [];
      return {
        collectionId: collection.id,
        name: collection.name,
        slug: null,
        fieldCount: collectionFields.length,
        itemCount: itemCounts.get(collection.id) ?? 0,
        fields: collectionFields,
        items: collectionItems.map((item) => ({
          itemId: item.id,
          values: item.values,
        })),
      };
    }),
  };
}

export async function updateClientCmsItem(
  userId: string,
  siteId: string,
  collectionId: string,
  itemId: string,
  values: Record<string, string>
): Promise<{ site: ClientAccessibleSite; collections: ClientCmsSummary[] } | null> {
  const cms = await getClientSiteCms(userId, siteId);

  if (!cms) {
    return null;
  }

  const collection = cms.collections.find((item) => item.collectionId === collectionId);
  const collectionItem = collection?.items.find((item) => item.itemId === itemId);

  if (!collection || !collectionItem) {
    return null;
  }

  const fieldTypes = Object.fromEntries(
    collection.fields
      .filter((field): field is { id: string; name: string; type: CollectionFieldType } => Boolean(field.type))
      .map((field) => [field.id, field.type])
  );

  const allowedFieldIds = new Set(collection.fields.map((field) => field.id));
  const cleanValues = Object.fromEntries(
    Object.entries(values).filter(([fieldId, value]) => allowedFieldIds.has(fieldId) && typeof value === 'string')
  );

  await setValuesByFieldName(itemId, collectionId, cleanValues, fieldTypes, false);

  return getClientSiteCms(userId, siteId);
}

function findFormLayers(pages: ClientPageSummary[], layersByPage: Map<string, Layer[]>): ClientFormSummary[] {
  const forms: ClientFormSummary[] = [];

  const walk = (page: ClientPageSummary, layers: Layer[]) => {
    for (const layer of layers) {
      const settings = isRecord(layer.settings) ? layer.settings : {};
      const layerAny = layer as any;
      const isForm = layer.name === 'form' || settings.tag === 'form' || isRecord(layerAny.variables?.form);

      if (isForm) {
        const formId = typeof settings.formId === 'string'
          ? settings.formId
          : typeof settings.id === 'string'
            ? settings.id
            : layer.id;
        forms.push({
          formId,
          name: layer.customName || layer.name || 'Form',
          pageName: page.name,
          pageSlug: page.slug,
          submissionCount: 0,
          newCount: 0,
          latestSubmission: null,
        });
      }

      if (layer.children?.length) {
        walk(page, layer.children);
      }
    }
  };

  for (const page of pages) {
    walk(page, layersByPage.get(page.id) ?? []);
  }

  return forms;
}

export async function getClientSiteForms(userId: string, siteId: string): Promise<{
  site: ClientAccessibleSite;
  forms: ClientFormSummary[];
} | null> {
  const content = await getClientSiteContent(userId, siteId);

  if (!content) {
    return null;
  }

  const layersByPage = new Map<string, Layer[]>();
  await Promise.all(content.pages.map(async (page) => {
    const draftLayers = await getDraftLayers(page.id);
    if (draftLayers?.layers) {
      layersByPage.set(page.id, draftLayers.layers);
    }
  }));

  const forms = findFormLayers(content.pages, layersByPage);
  const summaries = await getFormSummaries(siteId).catch(() => []);
  const summariesByForm = new Map(summaries.map((summary) => [summary.form_id, summary]));

  return {
    site: content.site,
    forms: forms.map((form) => {
      const summary = summariesByForm.get(form.formId);
      return {
        ...form,
        submissionCount: summary?.submission_count ?? 0,
        newCount: summary?.new_count ?? 0,
        latestSubmission: summary?.latest_submission ?? null,
      };
    }),
  };
}
