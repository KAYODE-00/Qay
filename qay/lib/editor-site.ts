export const QAY_EDITOR_SITE_COOKIE = 'qay_editor_site_id';
export const QAY_EDITOR_SITE_STORAGE_KEY = 'qay_editor_site_id';

function persistQayEditorSiteId(siteId: string | null) {
  if (typeof window === 'undefined' || !siteId) {
    return;
  }

  try {
    window.sessionStorage.setItem(QAY_EDITOR_SITE_STORAGE_KEY, siteId);
  } catch {
    // Ignore storage failures in restricted contexts.
  }
}

export function readQayEditorSiteIdFromBrowser(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const fromQuery = new URLSearchParams(window.location.search).get('site');
  if (fromQuery) {
    persistQayEditorSiteId(fromQuery);
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

  return null;
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
