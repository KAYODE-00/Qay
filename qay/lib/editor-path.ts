import { readQayEditorSiteIdFromBrowser, readQayEditorSiteSlugFromBrowser } from '@/qay/lib/editor-site';

export function getEditorBasePath(pathname?: string | null) {
  return pathname?.startsWith('/qay/editor') ? '/qay/editor' : '/ycode';
}

export function toCurrentEditorPath(path: string, pathname?: string | null, siteId?: string | null) {
  const editorBasePath = getEditorBasePath(pathname);
  const editorPath = path.startsWith('/ycode') ? path.replace('/ycode', editorBasePath) : path;
  const currentSiteId = siteId || (typeof window !== 'undefined' ? readQayEditorSiteIdFromBrowser() : null);
  const currentSiteSlug = typeof window !== 'undefined' ? readQayEditorSiteSlugFromBrowser() : null;

  const [pathOnly, query = ''] = editorPath.split('?');
  const params = new URLSearchParams(query);

  if (currentSiteId && !params.has('site')) {
    params.set('site', currentSiteId);
  }

  if (currentSiteSlug && !params.has('siteSlug')) {
    params.set('siteSlug', currentSiteSlug);
  }

  const nextQuery = params.toString();
  return nextQuery ? `${pathOnly}?${nextQuery}` : pathOnly;
}
