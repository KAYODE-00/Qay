import type { Layer, Page, PageFolder, PageSettings } from '@/types';
import { getQayAdmin } from './supabase-admin';
import { canUsePageIdInQaySite, getPageQaySiteId, getRecordQaySiteId } from './page-access';
import { generatePageMetadataHash } from '@/lib/hash-utils';
import { buildQayIndexSlug, isQayIndexSlug } from './index-slug';
import { getDraftLayers, upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { deletePage, duplicatePage } from '@/lib/repositories/pageRepository';
import { deletePageFolder } from '@/lib/repositories/pageFolderRepository';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function siteSettings(siteId: string, current?: Record<string, unknown> | null): Record<string, unknown> {
  return {
    ...(current ?? {}),
    qay_site_id: siteId,
  };
}

async function listAllSitePages(siteId: string): Promise<Page[]> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('is_published', false)
    .is('deleted_at', null)
    .order('order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch site pages: ${error.message}`);
  }

  return (data ?? []).filter((page: Page) => {
    if (page.error_page !== null) return false;
    return getPageQaySiteId(page) === siteId;
  });
}

async function listAllSiteFolders(siteId: string): Promise<PageFolder[]> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('page_folders')
    .select('*')
    .eq('is_published', false)
    .is('deleted_at', null)
    .order('order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch site folders: ${error.message}`);
  }

  return (data ?? []).filter((folder: PageFolder) => getRecordQaySiteId(folder) === siteId);
}

function findNextOrder(items: Array<{ order?: number | null }>): number {
  return items.reduce((max, item) => Math.max(max, item.order ?? 0), -1) + 1;
}

async function ensureSiteOwnsPage(siteId: string, pageId: string) {
  const allowed = await canUsePageIdInQaySite(siteId, pageId, false);
  if (!allowed) {
    throw new Error('Page not found for this site');
  }
}

async function getFolderForSite(siteId: string, folderId: string): Promise<PageFolder | null> {
  const folders = await listAllSiteFolders(siteId);
  return folders.find((folder) => folder.id === folderId) ?? null;
}

async function getPageForSite(siteId: string, pageId: string): Promise<Page | null> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .eq('is_published', false)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch page: ${error.message}`);
  }

  if (!data || data.error_page !== null || getPageQaySiteId(data) !== siteId) {
    return null;
  }

  return data as Page;
}

export async function listQayMcpPages(siteId: string): Promise<Page[]> {
  return listAllSitePages(siteId);
}

export async function getQayMcpPage(siteId: string, pageId: string): Promise<Page | null> {
  return getPageForSite(siteId, pageId);
}

export async function getQayMcpPagesByFolder(siteId: string, folderId: string | null): Promise<Page[]> {
  const pages = await listAllSitePages(siteId);
  return pages.filter((page) => (page.page_folder_id ?? null) === folderId);
}

export async function createQayMcpPage(siteId: string, input: {
  name: string;
  slug: string;
  page_folder_id: string | null;
  is_index: boolean;
  is_dynamic: boolean;
}): Promise<Page> {
  const supabase = getQayAdmin() as any;
  const pages = await listAllSitePages(siteId);
  const folderId = input.page_folder_id ?? null;
  const siblings = pages.filter((page) => (page.page_folder_id ?? null) === folderId);
  const settings = siteSettings(siteId);
  const slug = input.is_index ? buildQayIndexSlug(siteId) : slugify(input.slug || input.name) || `page-${Date.now()}`;

  const { data, error } = await supabase
    .from('pages')
    .insert({
      name: input.name,
      slug,
      is_published: false,
      page_folder_id: folderId,
      order: findNextOrder(siblings),
      depth: 0,
      is_index: input.is_index,
      is_dynamic: input.is_dynamic,
      error_page: null,
      settings,
      content_hash: generatePageMetadataHash({
        name: input.name,
        slug,
        settings,
        is_index: input.is_index,
        is_dynamic: input.is_dynamic,
        error_page: null,
      }),
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create site page: ${error.message}`);
  }

  await upsertDraftLayers(data.id, [{ id: 'body', name: 'body', classes: '', children: [] }]);
  return data as Page;
}

export async function updateQayMcpPage(siteId: string, pageId: string, updates: {
  name?: string;
  slug?: string;
  page_folder_id?: string | null;
  settings?: PageSettings;
}): Promise<Page> {
  const current = await getPageForSite(siteId, pageId);
  if (!current) {
    throw new Error('Page not found for this site');
  }

  const supabase = getQayAdmin() as any;
  const nextSettings = siteSettings(siteId, {
    ...(current.settings as Record<string, unknown> | null),
    ...((updates.settings as Record<string, unknown> | null) ?? {}),
  });
  const nextSlug = current.is_index ? buildQayIndexSlug(siteId) : updates.slug !== undefined
    ? slugify(updates.slug) || current.slug
    : current.slug;

  const payload = {
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.page_folder_id !== undefined ? { page_folder_id: updates.page_folder_id ?? null } : {}),
    settings: nextSettings,
    slug: nextSlug,
  };

  const { data, error } = await supabase
    .from('pages')
    .update({
      ...payload,
      content_hash: generatePageMetadataHash({
        name: payload.name ?? current.name,
        slug: payload.slug ?? current.slug,
        settings: nextSettings,
        is_index: current.is_index,
        is_dynamic: current.is_dynamic,
        error_page: current.error_page,
      }),
    })
    .eq('id', pageId)
    .eq('is_published', false)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update site page: ${error.message}`);
  }

  return data as Page;
}

export async function updateQayMcpPageSettings(siteId: string, pageId: string, settings: PageSettings): Promise<Page> {
  return updateQayMcpPage(siteId, pageId, { settings });
}

export async function deleteQayMcpPage(siteId: string, pageId: string): Promise<void> {
  await ensureSiteOwnsPage(siteId, pageId);
  await deletePage(pageId);
}

export async function duplicateQayMcpPage(siteId: string, pageId: string): Promise<Page> {
  await ensureSiteOwnsPage(siteId, pageId);
  const duplicated = await duplicatePage(pageId);
  const updated = await updateQayMcpPage(siteId, duplicated.id, {
    settings: siteSettings(siteId, duplicated.settings as Record<string, unknown> | null) as PageSettings,
  });

  if (isQayIndexSlug(updated.slug, siteId)) {
    await updateQayMcpPage(siteId, updated.id, {
      slug: `${slugify(updated.name)}-${Date.now()}`,
    });
  }

  return updated;
}

export async function listQayMcpFolders(siteId: string): Promise<PageFolder[]> {
  return listAllSiteFolders(siteId);
}

export async function createQayMcpFolder(siteId: string, input: {
  name: string;
  slug: string;
  page_folder_id: string | null;
}): Promise<PageFolder> {
  const supabase = getQayAdmin() as any;
  const pages = await getQayMcpPagesByFolder(siteId, input.page_folder_id ?? null);
  const folders = await listAllSiteFolders(siteId);
  const siblingFolders = folders.filter((folder) => (folder.page_folder_id ?? null) === (input.page_folder_id ?? null));
  const parent = input.page_folder_id ? folders.find((folder) => folder.id === input.page_folder_id) : null;

  const { data, error } = await supabase
    .from('page_folders')
    .insert({
      name: input.name,
      slug: slugify(input.slug || input.name) || `folder-${Date.now()}`,
      page_folder_id: input.page_folder_id ?? null,
      depth: parent ? parent.depth + 1 : 0,
      order: Math.max(findNextOrder(pages), findNextOrder(siblingFolders)) - 1,
      is_published: false,
      settings: siteSettings(siteId),
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create site folder: ${error.message}`);
  }

  return data as PageFolder;
}

export async function updateQayMcpFolder(siteId: string, folderId: string, updates: {
  name?: string;
  slug?: string;
  settings?: Record<string, unknown>;
}): Promise<PageFolder> {
  const current = await getFolderForSite(siteId, folderId);
  if (!current) {
    throw new Error('Folder not found for this site');
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('page_folders')
    .update({
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.slug !== undefined ? { slug: slugify(updates.slug) || current.slug } : {}),
      ...(updates.settings !== undefined
        ? { settings: siteSettings(siteId, { ...(current.settings ?? {}), ...updates.settings }) }
        : {}),
    })
    .eq('id', folderId)
    .eq('is_published', false)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update site folder: ${error.message}`);
  }

  return data as PageFolder;
}

export async function deleteQayMcpFolder(siteId: string, folderId: string): Promise<void> {
  const folder = await getFolderForSite(siteId, folderId);
  if (!folder) {
    throw new Error('Folder not found for this site');
  }

  await deletePageFolder(folderId);
}

export async function getQayMcpDraftLayers(siteId: string, pageId: string): Promise<Layer[]> {
  await ensureSiteOwnsPage(siteId, pageId);
  const record = await getDraftLayers(pageId);
  return (record?.layers as Layer[]) || [];
}

export async function saveQayMcpDraftLayers(siteId: string, pageId: string, layers: Layer[]): Promise<void> {
  await ensureSiteOwnsPage(siteId, pageId);
  await upsertDraftLayers(pageId, layers);
}
