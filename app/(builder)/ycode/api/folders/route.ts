import { NextRequest, NextResponse } from 'next/server';
import { getAllPageFolders, createPageFolder } from '@/lib/repositories/pageFolderRepository';
import { noCache } from '@/lib/api-response';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/folders
 *
 * Get all draft folders (for the builder)
 */
export async function GET(request: NextRequest) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    // Only return draft folders for the builder
    const folders = await getAllPageFolders({ is_published: false });
    const scopedFolders = qaySiteId
      ? folders.filter((folder) => {
          const settings = folder.settings as Record<string, unknown> | null;
          return settings?.qay_site_id === qaySiteId;
        })
      : folders;

    return noCache({
      data: scopedFolders,
    });
  } catch (error) {
    console.error('[GET /ycode/api/folders] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch folders' },
      500
    );
  }
}

/**
 * POST /ycode/api/folders
 *
 * Create a new folder
 */
export async function POST(request: NextRequest) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    const body = await request.json();
    const { name, slug, page_folder_id = null, depth = 0, order = 0, settings = {} } = body;

    // Validate required fields
    if (!name || !slug) {
      return noCache(
        { error: 'Name and slug are required' },
        400
      );
    }

    // Sanitize page_folder_id: filter out temp IDs (can't be UUIDs) - treat as root, will update when parent is saved
    const sanitizedParentFolderId = page_folder_id && page_folder_id.startsWith('temp-')
      ? null
      : page_folder_id;

    // Increment sibling orders if inserting (safe to call when appending - only updates order >= startOrder)
    const { incrementSiblingOrders } = await import('@/lib/services/pageService');
    await incrementSiblingOrders(order, depth, sanitizedParentFolderId);

    const scopedSettings = qaySiteId
      ? { ...settings, qay_site_id: qaySiteId }
      : settings;

    // Create folder (use sanitized parent folder ID)
    const folder = await createPageFolder({
      name,
      slug,
      page_folder_id: sanitizedParentFolderId,
      depth,
      order,
      settings: scopedSettings,
      is_published: false,
    });

    return noCache({
      data: folder,
    });
  } catch (error) {
    console.error('[POST /ycode/api/folders] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to create folder' },
      500
    );
  }
}
