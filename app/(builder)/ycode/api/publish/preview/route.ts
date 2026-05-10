import { NextRequest } from 'next/server';
import { getAllDraftPages, getPublishedPagesByIds, getUnpublishedPagesCount } from '@/lib/repositories/pageRepository';
import { getTotalPublishableItemsCount } from '@/lib/repositories/collectionItemRepository';
import { getUnpublishedCollections } from '@/lib/repositories/collectionRepository';
import { getUnpublishedComponents } from '@/lib/repositories/componentRepository';
import { getUnpublishedLayerStyles } from '@/lib/repositories/layerStyleRepository';
import { getUnpublishedAssets } from '@/lib/repositories/assetRepository';
import { getDeletedDraftCount } from '@/lib/sync-utils';
import { noCache } from '@/lib/api-response';
import { getQaySiteIdFromCollectionRequest, listQaySiteCollectionIds } from '@/qay/lib/collection-access';
import { filterAssetsForQaySite, getSiteAssetIds } from '@/qay/lib/media-isolation';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface PublishPreviewCounts {
  pages: number;
  collections: number;
  collectionItems: number;
  components: number;
  layerStyles: number;
  assets: number;
  total: number;
}

async function countDeletedSitePages(siteId: string): Promise<number> {
  const deletedDrafts = (await getAllDraftPages(true, siteId)).filter((page) => page.deleted_at !== null);
  if (deletedDrafts.length === 0) return 0;

  const publishedPages = await getPublishedPagesByIds(deletedDrafts.map((page) => page.id));
  const publishedIds = new Set(publishedPages.map((page) => page.id));
  return deletedDrafts.filter((page) => publishedIds.has(page.id)).length;
}

async function countDeletedSiteCollections(siteId: string): Promise<number> {
  const collectionIds = await listQaySiteCollectionIds(siteId);
  if (collectionIds.length === 0) return 0;

  const supabase = getQayAdmin() as any;
  const { data: deletedDrafts, error } = await supabase
    .from('collections')
    .select('id')
    .in('id', collectionIds)
    .eq('is_published', false)
    .not('deleted_at', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch deleted site collections: ${error.message}`);
  }

  const deletedIds = (deletedDrafts ?? []).map((row: { id: string }) => row.id);
  if (deletedIds.length === 0) return 0;

  const { count, error: publishedError } = await supabase
    .from('collections')
    .select('id', { count: 'exact', head: true })
    .in('id', deletedIds)
    .eq('is_published', true);

  if (publishedError) {
    throw new Error(`Failed to count deleted published site collections: ${publishedError.message}`);
  }

  return count ?? 0;
}

async function countDeletedSiteCollectionItems(siteId: string): Promise<number> {
  const collectionIds = await listQaySiteCollectionIds(siteId);
  if (collectionIds.length === 0) return 0;

  const supabase = getQayAdmin() as any;
  const { data: deletedDrafts, error } = await supabase
    .from('collection_items')
    .select('id')
    .in('collection_id', collectionIds)
    .eq('is_published', false)
    .not('deleted_at', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch deleted site collection items: ${error.message}`);
  }

  const deletedIds = (deletedDrafts ?? []).map((row: { id: string }) => row.id);
  if (deletedIds.length === 0) return 0;

  const { count, error: publishedError } = await supabase
    .from('collection_items')
    .select('id', { count: 'exact', head: true })
    .in('id', deletedIds)
    .eq('is_published', true);

  if (publishedError) {
    throw new Error(`Failed to count deleted published site collection items: ${publishedError.message}`);
  }

  return count ?? 0;
}

async function countDeletedSiteAssets(siteId: string): Promise<number> {
  const assetIds = Array.from(await getSiteAssetIds(siteId));
  if (assetIds.length === 0) return 0;

  const supabase = getQayAdmin() as any;
  const { data: deletedDrafts, error } = await supabase
    .from('assets')
    .select('id')
    .in('id', assetIds)
    .eq('is_published', false)
    .not('deleted_at', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch deleted site assets: ${error.message}`);
  }

  const deletedIds = (deletedDrafts ?? []).map((row: { id: string }) => row.id);
  if (deletedIds.length === 0) return 0;

  const { count, error: publishedError } = await supabase
    .from('assets')
    .select('id', { count: 'exact', head: true })
    .in('id', deletedIds)
    .eq('is_published', true);

  if (publishedError) {
    throw new Error(`Failed to count deleted published site assets: ${publishedError.message}`);
  }

  return count ?? 0;
}

/**
 * GET /ycode/api/publish/preview
 * Count all pending changes (new, modified, deleted) per entity type.
 */
export async function GET(request: NextRequest) {
  try {
    const qaySiteId = getQaySiteIdFromCollectionRequest(request);

    if (qaySiteId) {
      const siteCollectionIds = await listQaySiteCollectionIds(qaySiteId);
      const [pagesChanged, pagesDeleted, collectionsChanged, collectionsDeleted, itemsChanged, itemsDeleted, assetsChanged, assetsDeleted] = await Promise.all([
        getUnpublishedPagesCount(qaySiteId),
        countDeletedSitePages(qaySiteId),
        getUnpublishedCollections(siteCollectionIds).then((collections) => collections.length),
        countDeletedSiteCollections(qaySiteId),
        getTotalPublishableItemsCount(siteCollectionIds),
        countDeletedSiteCollectionItems(qaySiteId),
        getUnpublishedAssets().then((assets) => filterAssetsForQaySite(qaySiteId, assets)).then((assets) => assets.length),
        countDeletedSiteAssets(qaySiteId),
      ]);

      const pages = pagesChanged + pagesDeleted;
      const collections = collectionsChanged + collectionsDeleted;
      const collectionItems = itemsChanged + itemsDeleted;
      const components = 0;
      const layerStyles = 0;
      const assets = assetsChanged + assetsDeleted;
      const total = pages + collections + collectionItems + components + layerStyles + assets;

      return noCache({
        data: { pages, collections, collectionItems, components, layerStyles, assets, total } satisfies PublishPreviewCounts,
      });
    }

    // Count changed + deleted in parallel for each entity type
    const [
      pagesChanged, pagesDeleted,
      collectionsChanged, collectionsDeleted,
      itemsChanged, itemsDeleted,
      componentsChanged, componentsDeleted,
      layerStylesChanged, layerStylesDeleted,
      assetsChanged, assetsDeleted,
    ] = await Promise.all([
      getUnpublishedPagesCount(),
      getDeletedDraftCount('pages'),
      getUnpublishedCollections().then(c => c.length),
      getDeletedDraftCount('collections'),
      getTotalPublishableItemsCount(),
      getDeletedDraftCount('collection_items'),
      getUnpublishedComponents().then(c => c.length),
      getDeletedDraftCount('components'),
      getUnpublishedLayerStyles().then(s => s.length),
      getDeletedDraftCount('layer_styles'),
      getUnpublishedAssets().then(a => a.length),
      getDeletedDraftCount('assets'),
    ]);

    const pages = pagesChanged + pagesDeleted;
    const collections = collectionsChanged + collectionsDeleted;
    const collectionItems = itemsChanged + itemsDeleted;
    const components = componentsChanged + componentsDeleted;
    const layerStyles = layerStylesChanged + layerStylesDeleted;
    const assets = assetsChanged + assetsDeleted;
    const total = pages + collections + collectionItems + components + layerStyles + assets;

    return noCache({
      data: { pages, collections, collectionItems, components, layerStyles, assets, total } satisfies PublishPreviewCounts,
    });
  } catch (error) {
    console.error('Error fetching publish preview:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch publish preview' },
      500
    );
  }
}
