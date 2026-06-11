import { NextResponse } from 'next/server';
import { createMedusaCheckout, normalizeMedusaCommerceSettings } from '@/qay/lib/commerce/medusa';
import { listPublicQaySiteSettings } from '@/qay/lib/site-settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const items = Array.isArray(body?.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const settings = await listPublicQaySiteSettings(siteId, ['commerce_medusa']);
    const medusaSettings = normalizeMedusaCommerceSettings(settings.commerce_medusa);
    const checkout = await createMedusaCheckout(medusaSettings, items);

    return NextResponse.json({ data: checkout });
  } catch (error) {
    console.error('[QAY commerce checkout] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start checkout' },
      { status: 502 }
    );
  }
}
