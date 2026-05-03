const QAY_INDEX_SLUG_PREFIX = '__qay_index__';

export function buildQayIndexSlug(siteId: string): string {
  return `${QAY_INDEX_SLUG_PREFIX}${siteId}`;
}

export function isQayIndexSlug(slug: string | null | undefined, siteId?: string | null): boolean {
  if (!slug || !siteId) return false;
  return slug === buildQayIndexSlug(siteId);
}

export function stripQayIndexSlug(slug: string, siteId?: string | null): string {
  return isQayIndexSlug(slug, siteId) ? '' : slug;
}

export function getQaySiteIdFromSettings(settings: unknown): string | null {
  const record = settings as Record<string, unknown> | null;
  return typeof record?.qay_site_id === 'string' ? record.qay_site_id : null;
}

export function applyQayIndexSlug(
  slug: string,
  isIndex: boolean,
  pageFolderId: string | null | undefined,
  settings: unknown
): string {
  const siteId = getQaySiteIdFromSettings(settings);
  if (!isIndex || !siteId || (pageFolderId !== null && pageFolderId !== undefined)) {
    return slug;
  }

  const trimmed = typeof slug === 'string' ? slug.trim() : '';
  return !trimmed || isQayIndexSlug(trimmed, siteId) ? buildQayIndexSlug(siteId) : slug;
}

export function normalizeQayPageForResponse<T extends { slug: string; settings?: unknown }>(
  page: T,
  siteId?: string | null
): T {
  if (!siteId) return page;
  return { ...page, slug: stripQayIndexSlug(page.slug, siteId) };
}
