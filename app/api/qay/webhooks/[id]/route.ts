import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { deleteQaySiteWebhook, updateQaySiteWebhook } from '@/qay/lib/integration-scope';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can update webhooks' }, { status: 403 });
    const body = await request.json().catch(() => ({}));
    const { id } = await context.params;
    const data = await updateQaySiteWebhook(siteId, id, body);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update webhook' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can delete webhooks' }, { status: 403 });
    const { id } = await context.params;
    await deleteQaySiteWebhook(siteId, id);
    return NextResponse.json({ data: { deleted: true, id } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete webhook' }, { status: 500 });
  }
}
