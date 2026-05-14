import 'server-only';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { getQayAdmin } from './supabase-admin';
import { QAY_EDITOR_SITE_COOKIE } from './editor-site';
import { getQayBaseHostname, shouldUsePathBasedQayUrls } from './site-url';
import { buildQayIndexSlug } from './index-slug';

export const QAY_RENDER_SITE_COOKIE = 'qay_render_site_id';

function normalizeRawHost(value: string | null): string | null {
  if (!value) return null;
  return value.split(',')[0]?.trim().toLowerCase() || null;
}

function resolveRequestHost(headerStore: Awaited<ReturnType<typeof headers>>): string | null {
  const forwardedHost = normalizeRawHost(headerStore.get('x-forwarded-host'));
  const directHost = normalizeRawHost(headerStore.get('host'));

  if (directHost?.includes('.localhost')) {
    return directHost;
  }

  return forwardedHost || directHost;
}

function getHostname(rawHost: string): string {
  return rawHost.replace(/:\d+$/, '');
}

function getSubdomain(hostname: string): string | null {
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null;

  if (hostname.endsWith('.localhost')) {
    const localSubdomain = hostname.slice(0, -'.localhost'.length);
    return localSubdomain || null;
  }

  const configuredBaseDomain = getQayBaseHostname();
  if (configuredBaseDomain) {
    const base = configuredBaseDomain.toLowerCase().replace(/^\./, '');
    if (hostname === base) {
      return null;
    }
    if (hostname.endsWith(`.${base}`)) {
      return hostname.slice(0, -(base.length + 1)).split('.').pop() || null;
    }
  }

  const parts = hostname.split('.');
  if (parts.length < 3) return null;

  const first = parts[0];
  return first && first !== 'www' ? first : null;
}

type GetQayRenderSiteIdOptions = {
  preferCookie?: boolean;
};

async function siteHasPublishedHomepage(supabase: any, siteId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('pages')
    .select('id')
    .eq('is_published', true)
    .eq('is_index', true)
    .is('page_folder_id', null)
    .is('deleted_at', null)
    .eq('slug', buildQayIndexSlug(siteId))
    .filter('settings->>qay_site_id', 'eq', siteId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data?.id;
}

async function siteHasPublishedPages(supabase: any, siteId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('pages')
    .select('id')
    .eq('is_published', true)
    .is('deleted_at', null)
    .filter('settings->>qay_site_id', 'eq', siteId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data?.id;
}

async function readQaySiteIdFromCookies() {
  const cookieStore = await cookies();
  return (
    cookieStore.get(QAY_RENDER_SITE_COOKIE)?.value
    || cookieStore.get(QAY_EDITOR_SITE_COOKIE)?.value
    || null
  );
}

export async function getQayRenderSiteBaseUrl(): Promise<string | null> {
  const headerStore = await headers();
  const rawHost = resolveRequestHost(headerStore);
  if (!rawHost) {
    return null;
  }

  const forwardedProto = headerStore.get('x-forwarded-proto');
  const protocol = forwardedProto === 'http' ? 'http' : 'https';
  return `${protocol}://${rawHost}`;
}

export async function getQayRenderHostSubdomain(): Promise<string | null> {
  const headerStore = await headers();
  const rawHost = resolveRequestHost(headerStore);
  if (!rawHost) {
    return null;
  }

  return getSubdomain(getHostname(rawHost));
}

export async function resolveQayPathSiteContext(pathSegments: string[]): Promise<{ siteId: string | null; siteSlug: string | null; remainingSegments: string[] }> {
  if (!pathSegments.length) {
    return { siteId: null, siteSlug: null, remainingSegments: pathSegments };
  }

  const headerStore = await headers();
  const rawHost = normalizeRawHost(headerStore.get('x-forwarded-host') || headerStore.get('host'));
  if (!rawHost) {
    return { siteId: null, siteSlug: null, remainingSegments: pathSegments };
  }

  const hostname = getHostname(rawHost);
  const subdomain = getSubdomain(hostname);
  if (subdomain || !shouldUsePathBasedQayUrls(rawHost)) {
    return { siteId: null, siteSlug: null, remainingSegments: pathSegments };
  }

  const siteSlug = pathSegments[0]?.trim().toLowerCase();
  if (!siteSlug) {
    return { siteId: null, siteSlug: null, remainingSegments: pathSegments };
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_sites')
    .select('id, slug, publish_status')
    .eq('slug', siteSlug)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    return { siteId: null, siteSlug: null, remainingSegments: pathSegments };
  }

  if (data.publish_status !== 'published' && !(await siteHasPublishedPages(supabase, data.id))) {
    return { siteId: null, siteSlug: null, remainingSegments: pathSegments };
  }

  return {
    siteId: data.id,
    siteSlug,
    remainingSegments: pathSegments.slice(1),
  };
}

export async function getQayRenderSiteId(options: GetQayRenderSiteIdOptions = {}): Promise<string | null> {
  const { preferCookie = false } = options;
  const cookieSiteId = await readQaySiteIdFromCookies();

  if (preferCookie && cookieSiteId) {
    return cookieSiteId;
  }

  const headerStore = await headers();
  const rawHost = resolveRequestHost(headerStore);
  if (!rawHost) return null;
  const hostname = getHostname(rawHost);
  const subdomain = getSubdomain(hostname);

  if ((hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) && !subdomain) {
    if (cookieSiteId) {
      return cookieSiteId;
    }
  }

  const supabase = getQayAdmin() as any;
  const findRenderableSite = async (column: 'custom_domain' | 'slug', value: string) => {
    const { data, error } = await supabase
      .from('qay_sites')
      .select('id, publish_status')
      .eq(column, value)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.id) {
      return null;
    }

    if (data.publish_status === 'published') {
      return data.id;
    }

    return (await siteHasPublishedPages(supabase, data.id)) ? data.id : null;
  };

  const byCustomDomain = await findRenderableSite('custom_domain', hostname);
  if (byCustomDomain) {
    return byCustomDomain;
  }

  if (subdomain) {
    const bySlug = await findRenderableSite('slug', subdomain);
    if (bySlug) {
      return bySlug;
    }
  }

  if (!subdomain && cookieSiteId) {
    return cookieSiteId;
  }

  return null;
}
