import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { applyUserTemplate } from '@/qay/lib/user-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const siteId = typeof body?.siteId === 'string' ? body.siteId : '';

    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    const data = await applyUserTemplate({
      userId: user.id,
      templateId: id,
      siteId,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[QAY user template apply] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply template' },
      { status: 500 }
    );
  }
}
