import { NextRequest } from 'next/server';
import { duplicatePageFolder, getPageFolderById } from '@/lib/repositories/pageFolderRepository';
import { noCache } from '@/lib/api-response';
import { canUseFolderInQaySite, getQaySiteIdFromRequest } from '@/qay/lib/page-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /ycode/api/folders/[id]/duplicate
 *
 * Duplicate a folder
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);
    const { id } = await params;

    if (qaySiteId) {
      const folder = await getPageFolderById(id);
      if (!(await canUseFolderInQaySite(qaySiteId, folder))) {
        return noCache(
          { error: 'Folder not found' },
          404
        );
      }
    }

    const newFolder = await duplicatePageFolder(id);

    return noCache(
      { data: newFolder },
      201
    );
  } catch (error) {
    console.error('[POST /ycode/api/folders/[id]/duplicate] Error:', error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to duplicate folder' },
      500
    );
  }
}
