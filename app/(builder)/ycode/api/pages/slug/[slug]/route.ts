import { NextRequest, NextResponse } from 'next/server';
import { getPageBySlug } from '@/lib/repositories/pageRepository';
import { getPublishedLayers } from '@/lib/repositories/pageLayersRepository';
import { noCache } from '@/lib/api-response';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';

/**
 * GET /ycode/api/pages/slug/[slug]
 *
 * Get a page by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const qaySiteId = getQaySiteIdFromRequest(request);
    const page = await getPageBySlug(slug, undefined, qaySiteId);

    if (!page) {
      return noCache(
        { error: 'Page not found' },
        404
      );
    }

    return noCache({
      data: page,
    });
  } catch (error) {
    console.error('Failed to fetch page:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch page' },
      500
    );
  }
}
