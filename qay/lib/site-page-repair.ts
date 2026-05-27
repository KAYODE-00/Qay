import { getQayAdmin } from './supabase-admin';
import { buildQayIndexSlug } from './index-slug';

type PageRecord = {
  id: string;
  name: string;
  slug: string;
  is_index: boolean;
  page_folder_id: string | null;
  order: number | null;
  depth: number | null;
  settings: Record<string, unknown> | null;
  created_at?: string | null;
};

function getSiteIdFromSettings(settings: Record<string, unknown> | null | undefined) {
  return typeof settings?.qay_site_id === 'string' ? settings.qay_site_id : null;
}

function mergeSiteSettings(settings: Record<string, unknown> | null | undefined, siteId: string) {
  return { ...(settings || {}), qay_site_id: siteId };
}

async function createSiteHomePage(supabase: any, siteId: string): Promise<PageRecord> {
  const now = new Date().toISOString();
  const settings = { qay_site_id: siteId };

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .insert({
      name: 'Home',
      slug: buildQayIndexSlug(siteId),
      page_folder_id: null,
      order: 0,
      depth: 0,
      is_index: true,
      is_dynamic: false,
      error_page: null,
      settings,
      is_published: false,
      created_at: now,
      updated_at: now,
    })
    .select('id, name, slug, is_index, page_folder_id, order, depth, settings')
    .single();

  if (pageError) {
    throw new Error(pageError.message);
  }

  const { error: layersError } = await supabase
    .from('page_layers')
    .insert({
      page_id: page.id,
      layers: [{ id: 'body', name: 'body', classes: '', children: [] }],
      is_published: false,
      created_at: now,
      updated_at: now,
    });

  if (layersError) {
    throw new Error(layersError.message);
  }

  return page as PageRecord;
}

async function repairPageAsHome(supabase: any, page: PageRecord, siteId: string): Promise<PageRecord> {
  const { data, error } = await supabase
    .from('pages')
    .update({
      slug: buildQayIndexSlug(siteId),
      is_index: true,
      page_folder_id: null,
      settings: mergeSiteSettings(page.settings, siteId),
      updated_at: new Date().toISOString(),
    })
    .eq('id', page.id)
    .eq('is_published', false)
    .is('deleted_at', null)
    .select('id, name, slug, is_index, page_folder_id, order, depth, settings')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PageRecord;
}

export async function ensureQayDraftHomePage(siteId: string): Promise<string> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('pages')
    .select('id, name, slug, is_index, page_folder_id, order, depth, settings, error_page, created_at')
    .eq('is_published', false)
    .is('deleted_at', null)
    .order('order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const regularPages = ((data || []) as Array<PageRecord & { error_page: number | null }>)
    .filter((page) => page.error_page === null);

  const sitePages = regularPages.filter((page) => getSiteIdFromSettings(page.settings) === siteId);
  const homePage = sitePages.find((page) => page.is_index && page.page_folder_id === null);
  if (homePage) {
    if (homePage.slug !== buildQayIndexSlug(siteId) || getSiteIdFromSettings(homePage.settings) !== siteId) {
      const repaired = await repairPageAsHome(supabase, homePage, siteId);
      return repaired.id;
    }

    return homePage.id;
  }

  // Preserve existing site work before creating anything new.
  // If the site already has pages, prefer repairing one of them into the site home page.
  const fallbackSitePage =
    sitePages.find((page) => page.page_folder_id === null)
    ?? sitePages[0];

  if (fallbackSitePage) {
    const repaired = await repairPageAsHome(supabase, fallbackSitePage, siteId);
    return repaired.id;
  }

  // Support the one-page migrated case without grabbing arbitrary shared content.
  if (regularPages.length === 1) {
    const adopted = await repairPageAsHome(supabase, regularPages[0], siteId);
    return adopted.id;
  }

  const created = await createSiteHomePage(supabase, siteId);
  return created.id;
}
