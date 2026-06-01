import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { listUserTemplates, submitUserTemplate } from '@/qay/lib/user-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ data: await listUserTemplates(user.id) });
  } catch (error) {
    console.error('[QAY user templates GET] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const siteId = typeof body?.siteId === 'string' ? body.siteId : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    const category = typeof body?.category === 'string' ? body.category.trim() : 'General';
    const pricingMode = body?.pricingMode === 'paid' ? 'paid' : 'free';
    const thumbnailUrl = typeof body?.thumbnailUrl === 'string' ? body.thumbnailUrl.trim() : '';
    const intendedPrice = typeof body?.intendedPrice === 'number'
      ? body.intendedPrice
      : typeof body?.intendedPrice === 'string'
        ? Number(body.intendedPrice)
        : null;

    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const data = await submitUserTemplate({
      ownerId: user.id,
      siteId,
      name,
      description,
      category,
      pricingMode,
      intendedPrice: Number.isFinite(intendedPrice) ? intendedPrice : null,
      thumbnailUrl,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[QAY user templates POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save template' },
      { status: 500 }
    );
  }
}
