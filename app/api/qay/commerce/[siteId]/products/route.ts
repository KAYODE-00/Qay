import { NextResponse } from 'next/server';
import { fetchMedusaProducts, normalizeMedusaCommerceSettings } from '@/qay/lib/commerce/medusa';
import { listPublicQaySiteSettings } from '@/qay/lib/site-settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;

    if (!siteId) {
      return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    }

    const settings = await listPublicQaySiteSettings(siteId, ['commerce_medusa']);
    const medusaSettings = normalizeMedusaCommerceSettings(settings.commerce_medusa);
    const products = await fetchMedusaProducts(medusaSettings);

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('[QAY commerce public products] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load products' },
      { status: 502 }
    );
  }
}
