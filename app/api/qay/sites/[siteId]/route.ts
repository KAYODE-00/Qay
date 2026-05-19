import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { isQayBaseHost, withResolvedQayLiveUrl } from '@/qay/lib/site-url';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

async function getOwnedSite(siteId: string, userId: string) {
  const supabase = getQayAdmin() as any;

  return supabase
    .from('qay_sites')
    .select('*')
    .eq('id', siteId)
    .eq('owner_id', userId)
    .maybeSingle();
}

export async function GET(_request: Request, context: RouteContext) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const { data, error } = await getOwnedSite(siteId, user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  return NextResponse.json({ data: withResolvedQayLiveUrl(data) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const existing = await getOwnedSite(siteId, user.id);

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  if (!existing.data) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body?.name === 'string') {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }
    updates.name = name;
  }

  if (typeof body?.slug === 'string') {
    const slug = slugify(body.slug);
    if (!slug) {
      return NextResponse.json({ error: 'Site slug is required' }, { status: 400 });
    }
    updates.slug = slug;
  }

  if (typeof body?.custom_domain === 'string' || body?.custom_domain === null) {
    const customDomain = body.custom_domain
      ? body.custom_domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
      : null;
    if (customDomain && isQayBaseHost(customDomain)) {
      return NextResponse.json(
        { error: 'Use a custom domain that is different from the QAY app domain.' },
        { status: 400 }
      );
    }

    updates.custom_domain = customDomain;
    updates.domain_verified = false;
  }

  if (typeof body?.publish_status === 'string') {
    updates.publish_status = body.publish_status;
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_sites')
    .update(updates)
    .eq('id', siteId)
    .eq('owner_id', user.id)
    .select()
    .single();

  if (error) {
    const isDuplicate = error.code === '23505';
    const errorText = `${error.message || ''} ${error.details || ''}`;
    const duplicateMessage = errorText.includes('custom_domain')
      ? 'This custom domain already exists.'
      : errorText.includes('slug')
        ? 'This site URL already exists.'
        : 'That site URL or domain is already in use.';

    return NextResponse.json(
      { error: isDuplicate ? duplicateMessage : error.message },
      { status: isDuplicate ? 409 : 500 }
    );
  }

  const resolvedSite = withResolvedQayLiveUrl(data);

  if (resolvedSite.publish_status === 'published' && resolvedSite.live_url !== data.live_url) {
    await supabase
      .from('qay_sites')
      .update({ live_url: resolvedSite.live_url, updated_at: updates.updated_at })
      .eq('id', siteId)
      .eq('owner_id', user.id);
  }

  return NextResponse.json({ data: resolvedSite });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const existing = await getOwnedSite(siteId, user.id);

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  if (!existing.data) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const supabase = getQayAdmin() as any;
  const { error } = await supabase
    .from('qay_sites')
    .delete()
    .eq('id', siteId)
    .eq('owner_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { id: siteId } });
}
