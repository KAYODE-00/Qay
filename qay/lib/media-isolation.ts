import type { Asset, AssetFolder } from '@/types';
import { getQayAdmin } from './supabase-admin';

export async function getSiteAssetIds(siteId: string): Promise<Set<string>> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_assets')
    .select('asset_id')
    .eq('qay_site_id', siteId);

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((row: { asset_id: string }) => row.asset_id));
}

export async function getSiteAssetFolderIds(siteId: string): Promise<Set<string>> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_asset_folders')
    .select('asset_folder_id')
    .eq('qay_site_id', siteId);

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((row: { asset_folder_id: string }) => row.asset_folder_id));
}

export async function filterAssetsForQaySite(siteId: string, assets: Asset[]): Promise<Asset[]> {
  const assetIds = await getSiteAssetIds(siteId);
  return assets.filter((asset) => assetIds.has(asset.id));
}

export async function filterAssetFoldersForQaySite(siteId: string, folders: AssetFolder[]): Promise<AssetFolder[]> {
  const folderIds = await getSiteAssetFolderIds(siteId);
  return folders.filter((folder) => folderIds.has(folder.id));
}

export async function linkAssetToQaySite(siteId: string, assetId: string): Promise<void> {
  const supabase = getQayAdmin() as any;
  const { error } = await supabase
    .from('qay_site_assets')
    .upsert(
      { qay_site_id: siteId, asset_id: assetId },
      { onConflict: 'qay_site_id,asset_id' }
    );

  if (error) {
    throw new Error(error.message);
  }
}

export async function linkAssetFolderToQaySite(siteId: string, folderId: string): Promise<void> {
  const supabase = getQayAdmin() as any;
  const { error } = await supabase
    .from('qay_site_asset_folders')
    .upsert(
      { qay_site_id: siteId, asset_folder_id: folderId },
      { onConflict: 'qay_site_id,asset_folder_id' }
    );

  if (error) {
    throw new Error(error.message);
  }
}

export async function assetBelongsToQaySite(siteId: string, assetId: string): Promise<boolean> {
  const assetIds = await getSiteAssetIds(siteId);
  return assetIds.has(assetId);
}

export async function assetFolderBelongsToQaySite(siteId: string, folderId: string): Promise<boolean> {
  const folderIds = await getSiteAssetFolderIds(siteId);
  return folderIds.has(folderId);
}
