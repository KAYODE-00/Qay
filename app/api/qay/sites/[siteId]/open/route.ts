import { NextRequest, NextResponse } from 'next/server';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { QAY_RENDER_SITE_COOKIE } from '@/qay/lib/render-site';

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

  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set(QAY_RENDER_SITE_COOKIE, siteId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
