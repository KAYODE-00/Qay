import { NextRequest } from 'next/server';
import { getPageById, updatePage, deletePage } from '@/lib/repositories/pageRepository';
import { deleteTranslationsInBulk } from '@/lib/repositories/translationRepository';
import { noCache } from '@/lib/api-response';
import { ensureQayPageSiteUniqueness } from '@/qay/lib/page-site-uniqueness';
import { canUsePageInQaySite, getQaySiteIdFromRequest } from '@/qay/lib/page-access';
import { applyQayIndexSlug, normalizeQayPageForResponse } from '@/qay/lib/index-slug';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/pages/[id]
 *
 * Get a specific page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);
    const { id } = await params;
    // For GET requests, return draft version (what users edit)
    const page = await getPageById(id, false, qaySiteId);

    if (!page) {
      return noCache(
        { error: 'Page not found' },
        404
      );
    }

    if (qaySiteId && !(await canUsePageInQaySite(qaySiteId, page))) {
      return noCache(
        { error: 'Page not found' },
        404
      );
    }

    return noCache({
      data: qaySiteId ? normalizeQayPageForResponse(page, qaySiteId) : page,
    });
  } catch (error) {
    console.error('Failed to fetch page:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch page' },
      500
    );
  }
}

/**
 * PUT /ycode/api/pages/[id]
 *
 * Update a page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);
    const { id } = await params;
    const body = await request.json();

    // Get current draft page to check its state
    // Repository update functions only update draft versions
    const currentPage = await getPageById(id, false, qaySiteId);
    if (!currentPage) {
      return noCache(
        { error: 'Page not found' },
        404
      );
    }

    if (qaySiteId && !(await canUsePageInQaySite(qaySiteId, currentPage))) {
      return noCache(
        { error: 'Page not found' },
        404
      );
    }

    const currentSettings = currentPage.settings as Record<string, unknown> | null;
    const bodySettings = body.settings as Record<string, unknown> | undefined;
    if (qaySiteId || currentSettings?.qay_site_id || bodySettings?.qay_site_id) {
      await ensureQayPageSiteUniqueness();
    }

    // Determine if the page is/will be an error page, index page, or dynamic page
    const isErrorPage = body.error_page !== undefined
      ? (body.error_page !== null)
      : (currentPage.error_page !== null);

    const isIndexPage = body.is_index !== undefined
      ? body.is_index
      : currentPage.is_index;

    const isDynamicPage = body.is_dynamic !== undefined
      ? body.is_dynamic
      : currentPage.is_dynamic;

    const updatePayload = { ...body };
    if (qaySiteId) {
      updatePayload.settings = {
        ...(currentPage.settings || {}),
        ...(updatePayload.settings || {}),
        qay_site_id: qaySiteId,
      };
    }

    // Error pages and index pages must have empty slugs in the editor UI.
    // QAY root index pages are persisted with a hidden site-specific slug.
    if (isErrorPage || isIndexPage) {
      if (updatePayload.slug !== undefined && updatePayload.slug.trim() !== '') {
        const pageType = isErrorPage ? 'Error' : 'Index';
        return noCache(
          { error: `${pageType} pages must have an empty slug` },
          400
        );
      }
      updatePayload.slug = isErrorPage
        ? ''
        : applyQayIndexSlug('', isIndexPage, updatePayload.page_folder_id ?? currentPage.page_folder_id, updatePayload.settings);
    }

    // Dynamic pages should have "*" as slug (allow updates to "*")
    if (isDynamicPage && updatePayload.slug !== undefined && updatePayload.slug !== '*') {
      updatePayload.slug = '*';
    }

    // Pass all updates to the repository (it will handle further validation)
    const page = await updatePage(id, updatePayload);

    return noCache({
      data: qaySiteId ? normalizeQayPageForResponse(page, qaySiteId) : page,
    });
  } catch (error) {
    console.error('Failed to update page:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to update page' },
      500
    );
  }
}

/**
 * DELETE /ycode/api/pages/[id]
 *
 * Delete a page and its associated translations
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);
    const { id } = await params;

    if (qaySiteId) {
      const currentPage = await getPageById(id, false, qaySiteId);
      if (!(await canUsePageInQaySite(qaySiteId, currentPage))) {
        return noCache(
          { error: 'Page not found' },
          404
        );
      }
    }

    // Delete the page
    await deletePage(id);

    // Delete all translations for this page
    await deleteTranslationsInBulk('page', id);

    return noCache({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete page:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to delete page' },
      500
    );
  }
}
