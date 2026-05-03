import { NextRequest, NextResponse } from 'next/server';
import { getUnpublishedPages } from '@/lib/repositories/pageRepository';
import { noCache } from '@/lib/api-response';
import { canAccessQaySite } from '@/qay/lib/site-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/pages/unpublished
 * Get all unpublished pages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    const pages = await getUnpublishedPages();
    const scopedPages = qaySiteId
      ? pages.filter((page) => {
          const settings = page.settings as Record<string, unknown> | null;
          return page.error_page !== null || settings?.qay_site_id === qaySiteId;
        })
      : pages;

    return noCache({ data: scopedPages });
  } catch (error) {
    console.error('Error fetching unpublished pages:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch unpublished pages' },
      500
    );
  }
}
