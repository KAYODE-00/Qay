export function getEditorBasePath(pathname?: string | null) {
  return pathname?.startsWith('/qay/editor') ? '/qay/editor' : '/ycode';
}

export function toCurrentEditorPath(path: string, pathname?: string | null, siteId?: string | null) {
  const editorBasePath = getEditorBasePath(pathname);
  const editorPath = path.startsWith('/ycode') ? path.replace('/ycode', editorBasePath) : path;

  if (!siteId) {
    return editorPath;
  }

  const [pathOnly, query = ''] = editorPath.split('?');
  const params = new URLSearchParams(query);
  if (!params.has('site')) {
    params.set('site', siteId);
  }

  const nextQuery = params.toString();
  return nextQuery ? `${pathOnly}?${nextQuery}` : pathOnly;
}
