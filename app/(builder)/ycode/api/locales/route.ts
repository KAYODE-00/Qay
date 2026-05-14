import { NextRequest, NextResponse } from 'next/server';
import { getAllLocales, createLocale } from '@/lib/repositories/localeRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';

/**
 * GET /ycode/api/locales
 * Get all locales
 */
export async function GET(request: NextRequest) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);
    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const locales = await getAllLocales(false, qaySiteId);
    
    return NextResponse.json({ data: locales });
  } catch (error) {
    console.error('Error fetching locales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locales' },
      { status: 500 }
    );
  }
}

/**
 * POST /ycode/api/locales
 * Create a new locale
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, label, is_default } = body;
    const qaySiteId = getQaySiteIdFromRequest(request);

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
    
    if (!code || !label) {
      return NextResponse.json(
        { error: 'Missing required fields: code, label' },
        { status: 400 }
      );
    }
    
    const { locale, locales } = await createLocale({ code, label, is_default, qay_site_id: qaySiteId }, qaySiteId);
    
    return NextResponse.json({ data: { locale, locales } }, { status: 201 });
  } catch (error) {
    console.error('Error creating locale:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create locale' },
      { status: 500 }
    );
  }
}
