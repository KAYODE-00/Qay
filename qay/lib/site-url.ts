import type { QaySite } from '@/qay/types';

function normalizeHostLike(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^\./, '')
      .toLowerCase();
  }
}

function getConfiguredOrigin(): URL | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || null;

  if (!raw) {
    if (typeof window !== 'undefined') {
      try {
        return new URL(window.location.origin);
      } catch {
        return null;
      }
    }

    return null;
  }

  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function hasExplicitQayBaseDomain(): boolean {
  return !!normalizeHostLike(
    process.env.NEXT_PUBLIC_QAY_BASE_DOMAIN || process.env.QAY_BASE_DOMAIN
  );
}

export function getQayBaseHostname(): string | null {
  const explicit = normalizeHostLike(
    process.env.NEXT_PUBLIC_QAY_BASE_DOMAIN || process.env.QAY_BASE_DOMAIN
  );

  if (explicit) {
    return explicit.split(':')[0]?.toLowerCase() ?? null;
  }

  return getConfiguredOrigin()?.hostname.toLowerCase() ?? null;
}

export function getQayBaseHost(): string | null {
  const explicit = normalizeHostLike(
    process.env.NEXT_PUBLIC_QAY_BASE_DOMAIN || process.env.QAY_BASE_DOMAIN
  );

  if (explicit) {
    return explicit;
  }

  return getConfiguredOrigin()?.host.toLowerCase() ?? null;
}

export function shouldUsePathBasedQayUrls(baseHost = getQayBaseHost()): boolean {
  if (!baseHost) {
    return false;
  }

  if (hasExplicitQayBaseDomain()) {
    return false;
  }

  return baseHost.endsWith('.vercel.app');
}

export function getQaySiteBaseUrl(
  site: Pick<QaySite, 'slug' | 'custom_domain' | 'domain_verified'>
): string | null {
  const customDomain = normalizeHostLike(site.custom_domain);
  if (customDomain && site.domain_verified) {
    return `${getQayProtocol()}://${customDomain}`;
  }

  const baseHost = getQayBaseHost();
  if (!baseHost || !site.slug?.trim()) {
    return null;
  }

  if (shouldUsePathBasedQayUrls(baseHost)) {
    return `${getQayProtocol()}://${baseHost}/${site.slug.trim().toLowerCase()}`;
  }

  return `${getQayProtocol()}://${site.slug.trim().toLowerCase()}.${baseHost}`;
}

function getQayProtocol(): 'http' | 'https' {
  const configuredOrigin = getConfiguredOrigin();
  if (configuredOrigin) {
    return configuredOrigin.protocol === 'http:' ? 'http' : 'https';
  }

  if (typeof window !== 'undefined') {
    return window.location.protocol === 'http:' ? 'http' : 'https';
  }

  const baseHost = getQayBaseHost();
  if (baseHost?.includes('localhost') || /^\d+\.\d+\.\d+\.\d+(?::\d+)?$/.test(baseHost || '')) {
    return 'http';
  }

  return 'https';
}

export function getQaySiteHost(
  site: Pick<QaySite, 'slug' | 'custom_domain' | 'domain_verified'>
): string | null {
  const customDomain = normalizeHostLike(site.custom_domain);
  if (customDomain && site.domain_verified) {
    return customDomain;
  }

  const baseHost = getQayBaseHost();
  if (!baseHost || !site.slug?.trim()) {
    return null;
  }

  if (shouldUsePathBasedQayUrls(baseHost)) {
    return baseHost;
  }

  return `${site.slug.trim().toLowerCase()}.${baseHost}`;
}

export function getQaySiteLiveUrl(
  site: Pick<QaySite, 'slug' | 'custom_domain' | 'domain_verified' | 'publish_status'>
): string | null {
  if (site.publish_status !== 'published') {
    return null;
  }

  return getQaySiteBaseUrl(site);
}

export function withResolvedQayLiveUrl<T extends Pick<QaySite, 'slug' | 'custom_domain' | 'domain_verified' | 'publish_status' | 'live_url'>>(
  site: T
): T {
  return {
    ...site,
    live_url: getQaySiteLiveUrl(site),
  };
}
