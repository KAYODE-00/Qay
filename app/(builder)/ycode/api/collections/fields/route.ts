import { NextRequest, NextResponse } from 'next/server';
import { getAllFields } from '@/lib/repositories/collectionFieldRepository';
import { noCache } from '@/lib/api-response';
import { filterFieldsForQaySite, getQaySiteIdFromCollectionRequest } from '@/qay/lib/collection-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/collections/fields
 * Get all fields for all collections (draft version)
 */
export async function GET(request: NextRequest) {
  try {
    // Always get draft fields in the builder
    const fields = await getAllFields(false);
    const siteId = getQaySiteIdFromCollectionRequest(request);
    const data = siteId ? await filterFieldsForQaySite(siteId, fields) : fields;

    return noCache({ data });
  } catch (error) {
    console.error('Error fetching all collection fields:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch fields' },
      500
    );
  }
}
