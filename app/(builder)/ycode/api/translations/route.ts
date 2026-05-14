import { NextRequest, NextResponse } from 'next/server';
import { getTranslationsByLocale } from '@/lib/repositories/translationRepository';
import { createTranslation } from '@/lib/repositories/translationRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';

/**
 * GET /ycode/api/translations
 * Get translations (filtered by locale_id and optionally is_published)
 * Query params: locale_id (required), is_published (optional, defaults to false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const localeId = searchParams.get('locale_id');
    const isPublished = searchParams.get('is_published') === 'true';
    const qaySiteId = getQaySiteIdFromRequest(request);

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    if (!localeId) {
      return NextResponse.json(
        { error: 'Missing required parameter: locale_id' },
        { status: 400 }
      );
    }

    const translations = await getTranslationsByLocale(localeId, isPublished, qaySiteId);

    return NextResponse.json({ data: translations });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

/**
 * POST /ycode/api/translations
 * Create a new translation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale_id, source_type, source_id, content_key, content_type, content_value, is_completed } = body;
    const qaySiteId = getQaySiteIdFromRequest(request);

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Validate required fields (content_value can be empty string to indicate "use original")
    if (!locale_id || !source_type || !source_id || !content_key || !content_type || content_value === undefined || content_value === null) {
      return NextResponse.json(
        { error: 'Missing required fields: locale_id, source_type, source_id, content_key, content_type, content_value' },
        { status: 400 }
      );
    }

    const translation = await createTranslation({
      locale_id,
      source_type,
      source_id,
      content_key,
      content_type,
      content_value,
      is_completed: is_completed ?? false,
      qay_site_id: qaySiteId,
    }, qaySiteId);

    return NextResponse.json({ data: translation }, { status: 201 });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create translation' },
      { status: 500 }
    );
  }
}
