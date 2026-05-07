import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { createQaySiteWebhook, listQaySiteWebhooks } from '@/qay/lib/integration-scope';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    const data = await listQaySiteWebhooks(siteId);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch webhooks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const body = await request.json().catch(() => null);
    const siteId = typeof body?.siteId === 'string' ? body.siteId : '';
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can create webhooks' }, { status: 403 });
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const url = typeof body?.url === 'string' ? body.url.trim() : '';
    const events = Array.isArray(body?.events) ? body.events : [];
    if (!name || !url || events.length === 0) {
      return NextResponse.json({ error: 'Name, URL, and at least one event are required' }, { status: 400 });
    }
    const data = await createQaySiteWebhook(siteId, {
      name,
      url,
      events,
      filters: body?.filters || null,
      generateSecret: Boolean(body?.generateSecret),
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create webhook' }, { status: 500 });
  }
}
