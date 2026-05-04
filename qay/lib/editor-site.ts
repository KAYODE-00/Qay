export const QAY_EDITOR_SITE_COOKIE = 'qay_editor_site_id';
export const QAY_EDITOR_SITE_STORAGE_KEY = 'qay_editor_site_id';

export function readQayEditorSiteIdFromBrowser(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const fromQuery = new URLSearchParams(window.location.search).get('site');
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const fromSession = window.sessionStorage.getItem(QAY_EDITOR_SITE_STORAGE_KEY);
    if (fromSession) {
      return fromSession;
    }
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${QAY_EDITOR_SITE_COOKIE}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
}

export function appendQayEditorSiteParam(endpoint: string): string {
  if (typeof window === 'undefined' || !endpoint.startsWith('/ycode/api/')) {
    return endpoint;
  }

  const siteId = readQayEditorSiteIdFromBrowser();
  if (!siteId) {
    return endpoint;
  }

  const [path, query = ''] = endpoint.split('?');
  const params = new URLSearchParams(query);
  if (!params.has('site')) {
    params.set('site', siteId);
  }

  const nextQuery = params.toString();
  return nextQuery ? `${path}?${nextQuery}` : path;
}
