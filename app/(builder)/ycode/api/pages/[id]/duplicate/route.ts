import { NextRequest } from 'next/server';
import { duplicatePage } from '@/lib/repositories/pageRepository';
import { noCache } from '@/lib/api-response';
import { canUsePageIdInQaySite, getQaySiteIdFromRequest } from '@/qay/lib/page-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /ycode/api/pages/[id]/duplicate
 *
 * Duplicate a page with its draft layers
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);
    const { id } = await params;

    if (qaySiteId && !(await canUsePageIdInQaySite(qaySiteId, id, false))) {
      return noCache(
        { error: 'Page not found' },
        404
      );
    }

    const newPage = await duplicatePage(id);

    return noCache(
      { data: newPage },
      201
    );
  } catch (error) {
    console.error('[POST /ycode/api/pages/[id]/duplicate] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to duplicate page' },
      500
    );
  }
}
