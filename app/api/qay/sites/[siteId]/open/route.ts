import { NextRequest, NextResponse } from 'next/server';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { QAY_RENDER_SITE_COOKIE } from '@/qay/lib/render-site';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQaySiteLiveUrl } from '@/qay/lib/site-url';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;

  if (!(await canAccessQaySite(siteId))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const supabase = getQayAdmin() as any;
  const { data: site } = await supabase
    .from('qay_sites')
    .select('slug, custom_domain, domain_verified, publish_status')
    .eq('id', siteId)
    .maybeSingle();

  const liveUrl = site ? getQaySiteLiveUrl(site) : null;
  if (liveUrl) {
    return NextResponse.redirect(new URL(liveUrl));
  }

  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set(QAY_RENDER_SITE_COOKIE, siteId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
