import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { listQaySiteSettings } from '@/qay/lib/site-settings';
import { fetchMedusaProducts, normalizeMedusaCommerceSettings } from '@/qay/lib/commerce/medusa';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getQayAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const settings = await listQaySiteSettings(siteId, ['commerce_medusa']);
  const medusaSettings = normalizeMedusaCommerceSettings(settings.commerce_medusa);

  try {
    const products = await fetchMedusaProducts(medusaSettings);
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('[QAY commerce] Failed to fetch Medusa products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 502 }
    );
  }
}
