import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { listQaySiteApps } from '@/qay/lib/integration-scope';

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
    const data = await listQaySiteApps(siteId);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch apps' }, { status: 500 });
  }
}
