import { NextResponse } from 'next/server';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import {
  buildProductDetailPageHtml,
  buildProductGridElementHtml,
  bulkCreateQayProducts,
  type QayProductInput,
} from '@/qay/lib/product-cms';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

function parseCsv(text: string): QayProductInput[] {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim().toLowerCase().replace(/\s+/g, '_'));
  return rows.slice(1).map((cells) => (
    Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])) as QayProductInput
  ));
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { siteId } = await context.params;
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || !access.user) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let products: QayProductInput[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'CSV file is required' }, { status: 400 });
      }
      products = parseCsv(await file.text());
    } else {
      const body = await request.json().catch(() => null);
      if (Array.isArray(body?.products)) products = body.products;
      if (typeof body?.csv === 'string') products = parseCsv(body.csv);
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'No products found to import' }, { status: 400 });
    }

    const result = await bulkCreateQayProducts(siteId, access.user.id, products.slice(0, 1000));
    return NextResponse.json({
      data: {
        ...result,
        imported: result.products.length,
        productGridHtml: buildProductGridElementHtml(result.collectionId),
        productDetailPageHtml: buildProductDetailPageHtml(result.collectionId),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[QAY products bulk import] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import products' },
      { status: 500 }
    );
  }
}
