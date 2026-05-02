import { NextRequest } from 'next/server';
import { deleteAssetFolder, updateAssetFolder, getAssetFolderById } from '@/lib/repositories/assetFolderRepository';
import { noCache } from '@/lib/api-response';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { assetFolderBelongsToQaySite } from '@/qay/lib/media-isolation';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/asset-folders/[id]
 *
 * Get an asset folder by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');
    const { id } = await params;

    if (qaySiteId && (!(await canAccessQaySite(qaySiteId)) || !(await assetFolderBelongsToQaySite(qaySiteId, id)))) {
      return noCache({ error: 'Asset folder not found' }, 404);
    }

    const folder = await getAssetFolderById(id);

    if (!folder) {
      return noCache(
        { error: 'Asset folder not found' },
        404
      );
    }

    return noCache(
      { data: folder },
      200
    );
  } catch (error) {
    console.error('[GET /ycode/api/asset-folders/[id]] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch asset folder' },
      500
    );
  }
}

/**
 * PUT /ycode/api/asset-folders/[id]
 *
 * Update an asset folder
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');
    const { id } = await params;
    const body = await request.json();

    if (qaySiteId && (!(await canAccessQaySite(qaySiteId)) || !(await assetFolderBelongsToQaySite(qaySiteId, id)))) {
      return noCache({ error: 'Asset folder not found' }, 404);
    }

    // Validate required fields if provided
    if (body.name !== undefined && typeof body.name !== 'string') {
      return noCache(
        { error: 'Invalid name field' },
        400
      );
    }

    const updatedFolder = await updateAssetFolder(id, body);

    return noCache(
      { data: updatedFolder },
      200
    );
  } catch (error) {
    console.error('[PUT /ycode/api/asset-folders/[id]] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to update asset folder' },
      500
    );
  }
}

/**
 * DELETE /ycode/api/asset-folders/[id]
 *
 * Delete an asset folder and all its contents (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');
    const { id } = await params;

    if (qaySiteId && (!(await canAccessQaySite(qaySiteId)) || !(await assetFolderBelongsToQaySite(qaySiteId, id)))) {
      return noCache({ error: 'Asset folder not found' }, 404);
    }

    // Delete the folder and all its contents
    await deleteAssetFolder(id);

    return noCache(
      { data: { success: true } },
      200
    );
  } catch (error) {
    console.error('[DELETE /ycode/api/asset-folders/[id]] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to delete asset folder' },
      500
    );
  }
}
