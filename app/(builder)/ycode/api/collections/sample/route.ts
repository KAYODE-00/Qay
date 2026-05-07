import { NextRequest, NextResponse } from 'next/server';
import { createSampleCollection } from '@/lib/services/sampleCollectionService';
import { getAllCollections } from '@/lib/repositories/collectionRepository';
import { getSampleCollectionById } from '@/lib/sample-collections';
import { noCache } from '@/lib/api-response';
import {
  attachCollectionToQaySite,
  filterCollectionsForQaySite,
  getQaySiteIdFromCollectionRequest,
  requireQayCollectionOwner,
} from '@/qay/lib/collection-access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /ycode/api/collections/sample
 * Create a sample collection from a predefined template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sampleId } = body;
    const siteId = getQaySiteIdFromCollectionRequest(request);

    if (!sampleId || typeof sampleId !== 'string') {
      return noCache({ error: 'Missing required field: sampleId' }, 400);
    }

    // Validate sample exists
    if (!getSampleCollectionById(sampleId)) {
      return noCache({ error: `Sample collection "${sampleId}" not found` }, 404);
    }

    // Get existing collection names to avoid duplicates
    const existing = await getAllCollections({ is_published: false, deleted: false });
    const scopedExisting = siteId ? await filterCollectionsForQaySite(siteId, existing) : existing;
    const existingNames = scopedExisting.map(c => c.name);

    const result = await createSampleCollection(sampleId, existingNames);

    if (siteId) {
      const user = await requireQayCollectionOwner(siteId);
      await attachCollectionToQaySite(siteId, result.collection.id, user.id);
    }

    return noCache({ data: result }, 201);
  } catch (error) {
    console.error('Error creating sample collection:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to create sample collection' },
      500
    );
  }
}
