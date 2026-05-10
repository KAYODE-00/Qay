import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getDraftLayers, upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import type { Layer, Page, PageLayers } from '@/types';
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
  layerId: string;
  label: string;
  kind: 'text' | 'richText';
  value: string;
};

export type ClientSiteContent = {
  site: ClientAccessibleSite;
  pages: ClientPageSummary[];
  selectedPage: ClientPageSummary | null;
  editableFields: ClientEditableField[];
  draftLayers: PageLayers | null;
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

function getLayerEditableValue(layer: Layer): ClientEditableField | null {
  const textVariable = layer.variables?.text;
  if (!textVariable || !('type' in textVariable)) {
    return null;
  }

  if (textVariable.type !== 'dynamic_rich_text') {
    return null;
  }

  const rawContent = textVariable.data?.content;
  const value = extractTextFromTiptap(rawContent).trim();

  if (!value) {
    return null;
  }

  const isRichText = layer.name === 'richText';

  return {
    layerId: layer.id,
    label: layer.customName || layer.name || 'Content',
    kind: isRichText ? 'richText' : 'text',
    value,
  };
}

export function extractEditableFields(layers: Layer[]): ClientEditableField[] {
  const fields: ClientEditableField[] = [];

  const walk = (items: Layer[]) => {
    for (const layer of items) {
      const field = getLayerEditableValue(layer);
      if (field) {
        fields.push(field);
      }

      if (layer.children?.length) {
        walk(layer.children);
      }
    }
  };

  walk(layers);
  return fields;
}

function updateLayerContent(layers: Layer[], updates: Map<string, string>): Layer[] {
  return layers.map((layer) => {
    const nextLayer: Layer = {
      ...layer,
      children: layer.children ? updateLayerContent(layer.children, updates) : layer.children,
    };

    const nextValue = updates.get(layer.id);
    if (!nextValue) {
      return nextLayer;
    }

    const existingText = nextLayer.variables?.text;
    if (!existingText || existingText.type !== 'dynamic_rich_text') {
      return nextLayer;
    }

    return {
      ...nextLayer,
      variables: {
        ...nextLayer.variables,
        text: {
          ...existingText,
          data: {
            ...existingText.data,
            content: getTiptapTextContent(nextValue),
          },
        },
      },
    };
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

  const draftLayers = selectedPage ? await getDraftLayers(selectedPage.id) : null;
  const editableFields = draftLayers?.layers ? extractEditableFields(draftLayers.layers) : [];

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
  fieldUpdates: Array<{ layerId: string; value: string }>
): Promise<ClientSiteContent | null> {
  const siteContent = await getClientSiteContent(userId, siteId, pageId);

  if (!siteContent || !siteContent.selectedPage || !siteContent.draftLayers) {
    return null;
  }

  const updates = new Map(
    fieldUpdates
      .filter((item) => typeof item.layerId === 'string' && typeof item.value === 'string')
      .map((item) => [item.layerId, item.value.trim()])
  );

  const nextLayers = updateLayerContent(siteContent.draftLayers.layers, updates);
  await upsertDraftLayers(pageId, nextLayers, {
    generated_css: siteContent.draftLayers.generated_css ?? null,
  });

  return getClientSiteContent(userId, siteId, pageId);
}
