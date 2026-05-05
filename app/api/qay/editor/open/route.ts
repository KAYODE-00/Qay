import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { QAY_EDITOR_SITE_COOKIE } from '@/qay/lib/editor-site';
import { QAY_RENDER_SITE_COOKIE } from '@/qay/lib/render-site';

export const dynamic = 'force-dynamic';

async function canOpenSiteForUser(siteId: string, userId: string) {
  const supabase = getQayAdmin() as any;
  const { data: ownedSite, error: ownedSiteError } = await supabase
    .from('qay_sites')
    .select('id')
    .eq('id', siteId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (ownedSiteError) {
    throw new Error(ownedSiteError.message);
  }

  if (ownedSite) {
    return true;
  }

  const { data: membership, error: membershipError } = await supabase
    .from('qay_site_members')
    .select('id')
    .eq('site_id', siteId)
    .eq('user_id', userId)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  return Boolean(membership);
}

async function pageBelongsToSite(pageId: string, siteId: string) {
  const supabase = getQayAdmin() as any;
  const { data: page, error } = await supabase
    .from('pages')
    .select('id, error_page, settings')
    .eq('id', pageId)
    .eq('is_published', false)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!page) {
    return false;
  }

  if (page.error_page !== null) {
    return true;
  }

  const settings = page.settings as Record<string, unknown> | null;
  return settings?.qay_site_id === siteId;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const siteId = request.nextUrl.searchParams.get('site');
    const pageId = request.nextUrl.searchParams.get('page');

    if (!siteId || !pageId) {
      return NextResponse.json({ error: 'Missing site or page' }, { status: 400 });
    }

    if (!(await canOpenSiteForUser(siteId, user.id)) || !(await pageBelongsToSite(pageId, siteId))) {
      return NextResponse.json({ error: 'Editor page not found' }, { status: 404 });
    }

    const targetUrl = new URL(`/qay/editor/layers/${pageId}`, request.url);
    targetUrl.searchParams.set('site', siteId);
    targetUrl.searchParams.set('view', request.nextUrl.searchParams.get('view') || 'desktop');
    targetUrl.searchParams.set('tab', request.nextUrl.searchParams.get('tab') || 'design');
    targetUrl.searchParams.set('layer', request.nextUrl.searchParams.get('layer') || 'body');

    const response = NextResponse.redirect(targetUrl);
    response.cookies.set(QAY_EDITOR_SITE_COOKIE, siteId, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set(QAY_RENDER_SITE_COOKIE, siteId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to open QAY editor' },
      { status: 500 }
    );
  }
}
