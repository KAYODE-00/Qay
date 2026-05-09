import { NextRequest, NextResponse } from 'next/server';
import { getAllDraftPages } from '@/lib/repositories/pageRepository';
import { getAllDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { getAllPageFolders } from '@/lib/repositories/pageFolderRepository';
import { getAllComponents } from '@/lib/repositories/componentRepository';
import { getAllStyles } from '@/lib/repositories/layerStyleRepository';
import { getAllSettings } from '@/lib/repositories/settingsRepository';
import { getAllCollections } from '@/lib/repositories/collectionRepository';
import { getAllLocales } from '@/lib/repositories/localeRepository';
import { getAllAssets } from '@/lib/repositories/assetRepository';
import { getAllAssetFolders } from '@/lib/repositories/assetFolderRepository';
import { getAllFonts } from '@/lib/repositories/fontRepository';
import { getMapboxAccessToken, getGoogleMapsEmbedApiKey } from '@/lib/map-server';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { filterCollectionsForQaySite } from '@/qay/lib/collection-access';
import { filterAssetsForQaySite, filterAssetFoldersForQaySite } from '@/qay/lib/media-isolation';
import { normalizeQayPageForResponse } from '@/qay/lib/index-slug';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';
import { overlaySettingsForQaySite } from '@/qay/lib/site-settings';

/**
 * GET /ycode/api/editor/init
 * Get all initial data for the editor in one request:
 * - All draft (non-published) pages
 * - All draft layers
 * - All page folders
 * - All components
 * - All layer styles
 * - All settings
 * - All collections
 * - All locales
 * - All assets
 * - All asset folders
 * - All fonts
 */
export async function GET(request: NextRequest) {
  try {
    const qaySiteId = getQaySiteIdFromRequest(request);

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json(
        { error: 'Not authorized for QAY site' },
        { status: 403 }
      );
    }

    // Load all data in parallel (only drafts for editor)
    const [pages, drafts, folders, components, styles, settings, collections, locales, assets, assetFolders, fonts, resolvedMapboxToken, resolvedGoogleMapsEmbedKey] = await Promise.all([
      getAllDraftPages(),
      getAllDraftLayers(),
      getAllPageFolders({ is_published: false }),
      getAllComponents(),
      getAllStyles(),
      getAllSettings(),
      getAllCollections(),
      getAllLocales(),
      getAllAssets(),
      getAllAssetFolders(false),
      getAllFonts(),
      getMapboxAccessToken(),
      getGoogleMapsEmbedApiKey(),
    ]);

    const scopedPagesRaw = qaySiteId
      ? pages.filter((page) => {
          const pageSettings = page.settings as Record<string, unknown> | null;
          return pageSettings?.qay_site_id === qaySiteId;
        })
      : pages;
    const scopedPages = Array.from(
      new Map(scopedPagesRaw.map((page) => [`${page.id}:${page.error_page ?? 'page'}`, page])).values()
    ).map((page) => qaySiteId ? normalizeQayPageForResponse(page, qaySiteId) : page);
    const scopedPageIds = new Set(scopedPages.map((page) => page.id));
    const scopedDrafts = qaySiteId
      ? drafts.filter((draft) => scopedPageIds.has(draft.page_id))
      : drafts;
    const scopedFolders = qaySiteId
      ? folders.filter((folder) => {
          const folderSettings = folder.settings as Record<string, unknown> | null;
          return folderSettings?.qay_site_id === qaySiteId;
        })
      : folders;
    const scopedAssets = qaySiteId
      ? await filterAssetsForQaySite(qaySiteId, assets)
      : assets;
    const scopedAssetFolders = qaySiteId
      ? await filterAssetFoldersForQaySite(qaySiteId, assetFolders)
      : assetFolders;
    const scopedCollections = qaySiteId
      ? await filterCollectionsForQaySite(qaySiteId, collections)
      : collections;

    // Inject app-sourced tokens into settings so they're available via settingsByKey
    const scopedSettings = qaySiteId
      ? await overlaySettingsForQaySite(qaySiteId, settings)
      : settings;
    const enrichedSettings = [...scopedSettings];
    const injectedTokens: [string, string, string | null][] = [
      ['app:mapbox:access_token', 'mapbox_access_token', resolvedMapboxToken],
      ['app:google-maps-embed:api_key', 'google_maps_embed_api_key', resolvedGoogleMapsEmbedKey],
    ];
    for (const [id, key, value] of injectedTokens) {
      if (value) {
        enrichedSettings.push({
          id,
          key,
          value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      data: {
        pages: scopedPages,
        drafts: scopedDrafts,
        folders: scopedFolders,
        components,
        styles,
        settings: enrichedSettings,
        collections: scopedCollections,
        locales,
        assets: scopedAssets,
        assetFolders: scopedAssetFolders,
        fonts,
      },
    });
  } catch (error) {
    console.error('Error loading editor data:', error);
    return NextResponse.json(
      { error: 'Failed to load editor data' },
      { status: 500 }
    );
  }
}
