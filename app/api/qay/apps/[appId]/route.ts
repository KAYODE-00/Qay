import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { deleteQaySiteAppSettings, getQaySiteAppSettings, saveQaySiteAppSettings } from '@/qay/lib/integration-scope';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ appId: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    const { appId } = await context.params;
    const data = await getQaySiteAppSettings(siteId, appId);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch app settings' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ appId: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can update app settings' }, { status: 403 });
    const body = await request.json().catch(() => ({}));
    const { appId } = await context.params;
    const data = await saveQaySiteAppSettings(siteId, appId, body);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save app settings' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ appId: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can delete app settings' }, { status: 403 });
    const { appId } = await context.params;
    await deleteQaySiteAppSettings(siteId, appId);
    return NextResponse.json({ data: { deleted: true, appId } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete app settings' }, { status: 500 });
  }
}
