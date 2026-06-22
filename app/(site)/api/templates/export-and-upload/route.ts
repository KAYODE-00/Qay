import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { submitUserTemplate } from '@/qay/lib/user-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const siteId = typeof body?.siteId === 'string' ? body.siteId : '';
    const templateName = typeof body?.templateName === 'string' ? body.templateName.trim() : '';
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    const category = typeof body?.category === 'string' ? body.category.trim() : 'General';
    const pricingMode = body?.pricingMode === 'paid' ? 'paid' : 'free';
    const templateUrl = typeof body?.templateUrl === 'string' ? body.templateUrl.trim() : '';
    const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl.trim() : '';
    const intendedPrice = typeof body?.intendedPrice === 'number'
      ? body.intendedPrice
      : typeof body?.intendedPrice === 'string'
        ? Number(body.intendedPrice)
        : null;

    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    if (templateName.length < 2) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const data = await submitUserTemplate({
      ownerId: user.id,
      siteId,
      name: templateName,
      description,
      category,
      pricingMode,
      intendedPrice: Number.isFinite(intendedPrice) ? intendedPrice : null,
      thumbnailUrl: imageUrl,
      previewUrl: templateUrl,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[QAY templates export-and-upload POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export template' },
      { status: 500 }
    );
  }
}
