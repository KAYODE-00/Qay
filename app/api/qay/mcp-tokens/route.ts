import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { createQaySiteMcpToken, listQaySiteMcpTokens } from '@/qay/lib/mcp-scope';
import { getQaySiteAccess } from '@/qay/lib/site-access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const data = await listQaySiteMcpTokens(siteId);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch site MCP tokens' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const siteId = typeof body?.siteId === 'string' ? body.siteId : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    if (access.role !== 'owner') {
      return NextResponse.json({ error: 'Only the site owner can create MCP connections' }, { status: 403 });
    }

    const data = await createQaySiteMcpToken(siteId, user.id, name);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create site MCP token' },
      { status: 500 }
    );
  }
}
