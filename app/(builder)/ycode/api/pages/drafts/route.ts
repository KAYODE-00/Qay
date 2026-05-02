import { NextRequest, NextResponse } from 'next/server';
import { getAllDraftPages } from '@/lib/repositories/pageRepository';
import { getAllDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';

/**
 * GET /ycode/api/pages/drafts
 * Get all draft (non-published) page layers in one query
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json(
        { error: 'Not authorized for QAY site' },
        { status: 403 }
      );
    }

    const drafts = await getAllDraftLayers();

    if (qaySiteId) {
      const pages = await getAllDraftPages();
      const scopedPageIds = new Set(
        pages
          .filter((page) => {
            const settings = page.settings as Record<string, unknown> | null;
            return page.error_page !== null || settings?.qay_site_id === qaySiteId;
          })
          .map((page) => page.id)
      );

      return NextResponse.json({
        data: drafts.filter((draft) => scopedPageIds.has(draft.page_id)),
      });
    }

    return NextResponse.json({ data: drafts });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
