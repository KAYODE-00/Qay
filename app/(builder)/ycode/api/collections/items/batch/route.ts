import { NextRequest, NextResponse } from 'next/server';
import { getTopItemsWithValuesPerCollection, enrichItemsWithStatus } from '@/lib/repositories/collectionItemRepository';
import { getFieldsByCollectionId } from '@/lib/repositories/collectionFieldRepository';
import { findStatusFieldId } from '@/lib/collection-field-utils';
import { noCache } from '@/lib/api-response';
import { getQaySiteIdFromCollectionRequest, listQaySiteCollectionIds } from '@/qay/lib/collection-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /ycode/api/collections/items/batch
 * Get top N items with values for multiple collections in 2 optimized queries
 * Body: { collectionIds: string[], limit?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionIds, limit = 10 } = body;
    const siteId = getQaySiteIdFromCollectionRequest(request);

    if (!collectionIds || !Array.isArray(collectionIds)) {
      return noCache({ error: 'collectionIds must be an array' }, 400);
    }

    const allowedIds = siteId ? new Set(await listQaySiteCollectionIds(siteId)) : null;
    const scopedCollectionIds = allowedIds
      ? collectionIds.filter((id: string) => allowedIds.has(id))
      : collectionIds;

    if (scopedCollectionIds.length === 0) {
      return noCache({ data: { items: {} } });
    }

    // Fetch items and fields in parallel
    const [result, ...fieldSets] = await Promise.all([
      getTopItemsWithValuesPerCollection(scopedCollectionIds, false, limit),
      ...scopedCollectionIds.map(id => getFieldsByCollectionId(id, false)),
    ]);

    // Enrich each collection's items with computed status values
    await Promise.all(
      scopedCollectionIds.map((collectionId, index) => {
        const items = result[collectionId]?.items || [];
        return enrichItemsWithStatus(items, collectionId, findStatusFieldId(fieldSets[index]));
      })
    );

    return noCache({ data: { items: result } });
  } catch (error) {
    console.error('Error fetching batch items:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch batch items' },
      500
    );
  }
}
