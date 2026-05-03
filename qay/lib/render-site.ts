import 'server-only';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { getQayAdmin } from './supabase-admin';

export const QAY_RENDER_SITE_COOKIE = 'qay_render_site_id';

function normalizeHost(value: string | null): string | null {
  if (!value) return null;
  return value.split(',')[0]?.trim().toLowerCase().replace(/:\d+$/, '') || null;
}

function getSubdomain(host: string): string | null {
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return null;

  const configuredBaseDomain = process.env.NEXT_PUBLIC_QAY_BASE_DOMAIN || process.env.QAY_BASE_DOMAIN;
  if (configuredBaseDomain) {
    const base = configuredBaseDomain.toLowerCase().replace(/^\./, '');
    if (host.endsWith(`.${base}`)) {
      return host.slice(0, -(base.length + 1)).split('.').pop() || null;
    }
  }

  const parts = host.split('.');
  if (parts.length < 3) return null;

  const first = parts[0];
  return first && first !== 'www' ? first : null;
}

export async function getQayRenderSiteId(): Promise<string | null> {
  const headerStore = await headers();
  const host = normalizeHost(headerStore.get('x-forwarded-host') || headerStore.get('host'));
  if (!host) return null;

  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const cookieStore = await cookies();
    const cookieSiteId = cookieStore.get(QAY_RENDER_SITE_COOKIE)?.value;
    if (cookieSiteId) {
      return cookieSiteId;
    }
  }

  const subdomain = getSubdomain(host);
  const supabase = getQayAdmin() as any;

  let query = supabase
    .from('qay_sites')
    .select('id')
    .or(`custom_domain.eq.${host}${subdomain ? `,slug.eq.${subdomain}` : ''}`)
    .limit(1);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}
