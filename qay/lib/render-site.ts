import 'server-only';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { getQayAdmin } from './supabase-admin';
import { QAY_EDITOR_SITE_COOKIE } from './editor-site';
import { getQayBaseHostname } from './site-url';

export const QAY_RENDER_SITE_COOKIE = 'qay_render_site_id';

function normalizeRawHost(value: string | null): string | null {
  if (!value) return null;
  return value.split(',')[0]?.trim().toLowerCase() || null;
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
  const rawHost = normalizeRawHost(headerStore.get('x-forwarded-host') || headerStore.get('host'));
  if (!rawHost) {
    return null;
  }

  const forwardedProto = headerStore.get('x-forwarded-proto');
  const protocol = forwardedProto === 'http' ? 'http' : 'https';
  return `${protocol}://${rawHost}`;
}

export async function getQayRenderSiteId(options: GetQayRenderSiteIdOptions = {}): Promise<string | null> {
  const { preferCookie = false } = options;
  const cookieSiteId = await readQaySiteIdFromCookies();

  if (preferCookie && cookieSiteId) {
    return cookieSiteId;
  }

  const headerStore = await headers();
  const rawHost = normalizeRawHost(headerStore.get('x-forwarded-host') || headerStore.get('host'));
  if (!rawHost) return null;
  const hostname = getHostname(rawHost);
  const subdomain = getSubdomain(hostname);

  if ((hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) && !subdomain) {
    if (cookieSiteId) {
      return cookieSiteId;
    }
  }

  const supabase = getQayAdmin() as any;

  let query = supabase
    .from('qay_sites')
    .select('id')
    .eq('publish_status', 'published')
    .or(`custom_domain.eq.${hostname}${subdomain ? `,slug.eq.${subdomain}` : ''}`)
    .limit(1);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.id) {
    return data.id;
  }

  if (!subdomain && cookieSiteId) {
    return cookieSiteId;
  }

  return null;
}
