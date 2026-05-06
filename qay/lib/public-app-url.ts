function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

export function getPublicAppUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    '';

  if (configured) {
    return trimTrailingSlash(configured);
  }

  if (typeof window !== 'undefined') {
    return trimTrailingSlash(window.location.origin);
  }

  return '';
}

export function buildPublicAppUrl(path: string): string {
  const baseUrl = getPublicAppUrl();
  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
