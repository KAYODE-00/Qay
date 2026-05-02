import { NextRequest } from 'next/server';
import { getAllAssetFolders, createAssetFolder } from '@/lib/repositories/assetFolderRepository';
import { noCache } from '@/lib/api-response';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { filterAssetFoldersForQaySite, linkAssetFolderToQaySite } from '@/qay/lib/media-isolation';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/asset-folders
 *
 * Get all asset folders
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    const folders = await getAllAssetFolders();
    const scopedFolders = qaySiteId
      ? await filterAssetFoldersForQaySite(qaySiteId, folders)
      : folders;

    return noCache({
      data: scopedFolders,
    });
  } catch (error) {
    console.error('[GET /ycode/api/asset-folders] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch asset folders' },
      500
    );
  }
}

/**
 * POST /ycode/api/asset-folders
 *
 * Create a new asset folder
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    const body = await request.json();
    const { name, asset_folder_id = null, depth = 0, order = 0 } = body;

    // Validate required fields
    if (!name) {
      return noCache(
        { error: 'Name is required' },
        400
      );
    }

    // Sanitize asset_folder_id: filter out temp IDs
    const sanitizedParentFolderId = asset_folder_id && asset_folder_id.startsWith('temp-')
      ? null
      : asset_folder_id;

    // Create folder (always as draft)
    const folder = await createAssetFolder({
      name,
      asset_folder_id: sanitizedParentFolderId,
      depth,
      order,
      is_published: false,
    });

    if (qaySiteId) {
      await linkAssetFolderToQaySite(qaySiteId, folder.id);
    }

    return noCache({
      data: folder,
    });
  } catch (error) {
    console.error('[POST /ycode/api/asset-folders] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to create asset folder' },
      500
    );
  }
}
