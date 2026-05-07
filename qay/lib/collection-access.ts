import type { Collection, CollectionField } from '@/types';
import { getQayAdmin } from './supabase-admin';
import { canAccessQaySite, getQaySiteAccess } from './site-access';

export function getQaySiteIdFromCollectionRequest(request: Request): string | null {
  const { searchParams } = new URL(request.url);
  return searchParams.get('site');
}

export async function listQaySiteCollectionIds(siteId: string): Promise<string[]> {
  if (!(await canAccessQaySite(siteId))) {
    return [];
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_collections')
    .select('collection_id')
    .eq('site_id', siteId);

  if (error) {
    throw new Error(`Failed to list site collections: ${error.message}`);
  }

  return (data ?? []).map((row: { collection_id: string }) => row.collection_id);
}

export async function canUseCollectionInQaySite(siteId: string, collectionId: string): Promise<boolean> {
  if (!(await canAccessQaySite(siteId))) {
    return false;
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_collections')
    .select('collection_id')
    .eq('site_id', siteId)
    .eq('collection_id', collectionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to verify site collection access: ${error.message}`);
  }

  return Boolean(data);
}

export async function requireQayCollectionOwner(siteId: string) {
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed || access.role !== 'owner' || !access.user) {
    throw new Error('Only the site owner can manage CMS for this site');
  }
  return access.user;
}

export async function attachCollectionToQaySite(siteId: string, collectionId: string, userId?: string): Promise<void> {
  const supabase = getQayAdmin() as any;
  const { error } = await supabase
    .from('qay_site_collections')
    .insert({
      site_id: siteId,
      collection_id: collectionId,
      created_by: userId ?? null,
    });

  if (error) {
    throw new Error(`Failed to attach collection to site: ${error.message}`);
  }
}

export async function filterCollectionsForQaySite(siteId: string, collections: Collection[]): Promise<Collection[]> {
  const allowedIds = new Set(await listQaySiteCollectionIds(siteId));
  return collections.filter((collection) => allowedIds.has(collection.id));
}

export async function filterFieldsForQaySite(siteId: string, fields: CollectionField[]): Promise<CollectionField[]> {
  const allowedIds = new Set(await listQaySiteCollectionIds(siteId));
  return fields.filter((field) => allowedIds.has(field.collection_id));
}

export async function assertCollectionIdsBelongToQaySite(siteId: string, collectionIds: string[]): Promise<void> {
  const allowedIds = new Set(await listQaySiteCollectionIds(siteId));
  const invalid = collectionIds.find((id) => !allowedIds.has(id));
  if (invalid) {
    throw new Error(`Collection ${invalid} does not belong to this site`);
  }
}
