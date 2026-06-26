import { NextResponse } from 'next/server';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import {
  buildProductDetailPageHtml,
  buildProductGridElementHtml,
  createQayProduct,
  deleteQayProduct,
  listQayProducts,
  updateQayProduct,
} from '@/qay/lib/product-cms';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || !access.user) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const data = await listQayProducts(siteId, access.user.id);
    return NextResponse.json({
      data: {
        ...data,
        productGridHtml: buildProductGridElementHtml(data.collectionId),
        productDetailPageHtml: buildProductDetailPageHtml(data.collectionId),
      },
    });
  } catch (error) {
    console.error('[QAY products GET] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || !access.user) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const result = await createQayProduct(siteId, access.user.id, body?.product || body || {});
    return NextResponse.json({
      data: {
        ...result,
        productGridHtml: buildProductGridElementHtml(result.collectionId),
        productDetailPageHtml: buildProductDetailPageHtml(result.collectionId),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[QAY products POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || !access.user) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const productId = typeof body?.id === 'string' ? body.id : typeof body?.product?.id === 'string' ? body.product.id : '';
    if (!productId) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    }

    const result = await updateQayProduct(siteId, access.user.id, productId, body?.product || body || {});
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('[QAY products PATCH] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || !access.user) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const url = new URL(request.url);
    const productId = typeof body?.id === 'string' ? body.id : url.searchParams.get('id') || '';
    if (!productId) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    }

    await deleteQayProduct(siteId, access.user.id, productId);
    return NextResponse.json({ data: { id: productId, deleted: true } });
  } catch (error) {
    console.error('[QAY products DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
