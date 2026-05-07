import { NextRequest, NextResponse } from 'next/server';
import { getAllCollections, createCollection } from '@/lib/repositories/collectionRepository';
import { noCache } from '@/lib/api-response';
import {
  attachCollectionToQaySite,
  filterCollectionsForQaySite,
  getQaySiteIdFromCollectionRequest,
  requireQayCollectionOwner,
} from '@/qay/lib/collection-access';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /ycode/api/collections
 * Get all collections (draft by default)
 */
export async function GET(request: NextRequest) {
  try {
    // Always get draft collections in the builder
    const siteId = getQaySiteIdFromCollectionRequest(request);
    const collections = await getAllCollections({ is_published: false, deleted: false });
    const data = siteId ? await filterCollectionsForQaySite(siteId, collections) : collections;
    
    return noCache({
      data,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch collections' },
      500
    );
  }
}

/**
 * POST /ycode/api/collections
 * Create a new collection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const siteId = getQaySiteIdFromCollectionRequest(request);
    
    // Validate required fields
    if (!body.name) {
      return noCache(
        { error: 'Missing required field: name' },
        400
      );
    }
    
    const collection = await createCollection({
      name: body.name,
      sorting: body.sorting || null,
      order: body.order ?? 0,
      is_published: false, // Always create as draft
    });

    if (siteId) {
      const user = await requireQayCollectionOwner(siteId);
      await attachCollectionToQaySite(siteId, collection.id, user.id);
    }
    
    return noCache(
      { data: collection },
      201
    );
  } catch (error) {
    console.error('Error creating collection:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to create collection' },
      500
    );
  }
}
