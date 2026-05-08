import { NextRequest, NextResponse } from 'next/server';
import {
  copyTemplateAssetsToUserStorage,
  fetchProcessedTemplateApplyPayload,
  getTemplate,
  runPendingMigrationsForTemplate,
} from '@/lib/services/templateService';
import { getKnexClient, closeKnexClient } from '@/lib/knex-client';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { ensureQayPageSiteUniqueness } from '@/qay/lib/page-site-uniqueness';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ImportedPageRecord = {
  id: string;
  name: string | null;
  slug: string;
  is_index: boolean;
  is_published: boolean;
  page_folder_id: string | null;
  error_page: number | null;
  created_at: string | null;
};

type DuplicatePageSlotRecord = ImportedPageRecord & {
  deleted_at: string | null;
  qay_site_id: string | null;
};

type LayerStyleRecord = {
  id: string;
  name: string;
  is_published: boolean;
  created_at: string | null;
};

type ImportedRowIds = {
  pages: string[];
  pageFolders: string[];
  layerStyles: string[];
  assets: string[];
  assetFolders: string[];
  collections: string[];
  fonts: string[];
};

function stripQayUnsafeTemplateStatements(sql: string) {
  return sql
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim().toLowerCase();
      if (!trimmed.startsWith('insert into ')) {
        return true;
      }

      return !(
        trimmed.startsWith('insert into locales ') ||
        trimmed.startsWith('insert into translations ')
      );
    })
    .join('\n');
}

function slugifyTemplatePage(value: string | null | undefined) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'page';
}

async function restorePageSiteUniqueIndex(knex: Awaited<ReturnType<typeof getKnexClient>>) {
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_is_published_folder_unique
    ON pages(
      slug,
      is_published,
      COALESCE(page_folder_id, '00000000-0000-0000-0000-000000000000'::uuid),
      COALESCE(error_page, 0),
      COALESCE(settings->>'qay_site_id', '__ycode_global__')
    )
    WHERE deleted_at IS NULL
  `);
}

async function dropLayerStyleNameConstraint(knex: Awaited<ReturnType<typeof getKnexClient>>) {
  if (!(await knex.schema.hasTable('layer_styles'))) return;
  await knex.raw('ALTER TABLE layer_styles DROP CONSTRAINT IF EXISTS layer_styles_name_is_published_unique');
}

async function restoreLayerStyleNameConstraint(knex: Awaited<ReturnType<typeof getKnexClient>>) {
  if (!(await knex.schema.hasTable('layer_styles'))) return;
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'layer_styles_name_is_published_unique'
      ) THEN
        ALTER TABLE layer_styles
        ADD CONSTRAINT layer_styles_name_is_published_unique
        UNIQUE (name, is_published);
      END IF;
    END $$;
  `);
}

async function loadExistingIds(knex: Awaited<ReturnType<typeof getKnexClient>>, table: string) {
  if (!(await knex.schema.hasTable(table))) return new Set<string>();
  const query = knex(table).select('id');
  if (await knex.schema.hasColumn(table, 'deleted_at')) {
    query.whereNull('deleted_at');
  }
  const rows = await query;
  return new Set(rows.map((row: { id: string }) => row.id));
}

async function collectImportedRowIds(
  knex: Awaited<ReturnType<typeof getKnexClient>>,
  before: Record<string, Set<string>>
): Promise<ImportedRowIds> {
  const findNewIds = async (table: string) => {
    if (!(await knex.schema.hasTable(table))) return [];
    const query = knex(table).select('id');
    if (await knex.schema.hasColumn(table, 'deleted_at')) {
      query.whereNull('deleted_at');
    }
    const rows = await query;
    const previous = before[table] || new Set<string>();
    return rows
      .map((row: { id: string }) => row.id)
      .filter((id: string) => !previous.has(id));
  };

  return {
    pages: await findNewIds('pages'),
    pageFolders: await findNewIds('page_folders'),
    layerStyles: await findNewIds('layer_styles'),
    assets: await findNewIds('assets'),
    assetFolders: await findNewIds('asset_folders'),
    collections: await findNewIds('collections'),
    fonts: await findNewIds('fonts'),
  };
}

async function normalizeImportedPageSlugs(
  knex: Awaited<ReturnType<typeof getKnexClient>>,
  siteId: string,
  importedPageIds: Set<string>
) {
  if (!(await knex.schema.hasTable('pages'))) return;

  const pages = await knex('pages')
    .whereNull('deleted_at')
    .whereRaw("coalesce(settings->>'qay_site_id', '') = ?", [siteId])
    .select<ImportedPageRecord[]>(
      'id',
      'name',
      'slug',
      'is_index',
      'is_published',
      'page_folder_id',
      'error_page',
      'created_at'
    )
    .orderBy('created_at', 'asc')
    .orderBy('id', 'asc');

  const seen = new Set<string>();
  let homepageClaimed = false;

  for (const page of pages) {
    const isImported = importedPageIds.has(page.id);
    let nextIsIndex = page.is_index;
    let nextSlug = page.slug || '';

    const isRegularPage = page.error_page === null;
    const isRootPage = page.page_folder_id === null;

    if (isRegularPage && isRootPage && page.is_index) {
      if (!homepageClaimed) {
        nextSlug = buildQayIndexSlug(siteId);
        homepageClaimed = true;
      } else if (isImported) {
        nextIsIndex = false;
        nextSlug = slugifyTemplatePage(page.name || page.slug);
      }
    }

    if (isImported && isRegularPage && !nextIsIndex && nextSlug.trim() === '') {
      nextSlug = slugifyTemplatePage(page.name);
    }

    const keyBase = `${page.is_published}:${page.page_folder_id ?? 'root'}:${page.error_page ?? 0}`;
    let candidateSlug = nextSlug;
    let candidateKey = `${keyBase}:${candidateSlug}`;
    let counter = 2;

    while (seen.has(candidateKey)) {
      const baseSlug = slugifyTemplatePage(nextSlug || page.name || 'page');
      candidateSlug = `${baseSlug}-${counter++}`;
      candidateKey = `${keyBase}:${candidateSlug}`;
      nextIsIndex = false;
    }

    seen.add(candidateKey);

    if (candidateSlug !== page.slug || nextIsIndex !== page.is_index) {
      await knex('pages')
        .where('id', page.id)
        .where('is_published', page.is_published)
        .update({
          slug: candidateSlug,
          is_index: nextIsIndex,
          updated_at: knex.fn.now(),
        });
    }
  }
}

async function resolveDuplicatePageSlots(
  knex: Awaited<ReturnType<typeof getKnexClient>>,
  importedPageIds: Set<string>,
  siteId?: string
) {
  if (!(await knex.schema.hasTable('pages'))) return;

  const query = knex('pages').whereNull('deleted_at');
  if (siteId) {
    query.whereRaw("coalesce(settings->>'qay_site_id', '') = ?", [siteId]);
  }

  const pages = await query
    .select<DuplicatePageSlotRecord[]>(
      'id',
      'name',
      'slug',
      'is_index',
      'is_published',
      'page_folder_id',
      'error_page',
      'created_at',
      'deleted_at',
      knex.raw("settings->>'qay_site_id' as qay_site_id")
    )
    .orderBy('created_at', 'asc')
    .orderBy('id', 'asc');

  const groups = new Map<string, DuplicatePageSlotRecord[]>();
  for (const page of pages) {
    const key = [
      page.slug,
      page.is_published ? 'published' : 'draft',
      page.page_folder_id ?? 'root',
      page.error_page ?? 0,
      page.qay_site_id ?? '__ycode_global__',
    ].join('\t');
    const current = groups.get(key) || [];
    current.push(page);
    groups.set(key, current);
  }

  for (const entries of groups.values()) {
    if (entries.length < 2) continue;

    const sorted = [...entries].sort((a, b) => {
      const aImported = importedPageIds.has(a.id);
      const bImported = importedPageIds.has(b.id);
      if (aImported !== bImported) {
        return aImported ? 1 : -1;
      }
      return `${a.created_at ?? ''}:${a.id}`.localeCompare(`${b.created_at ?? ''}:${b.id}`);
    });

    const keeper = sorted[0];
    const duplicates = sorted.slice(1);

    for (const duplicate of duplicates) {
      const isImported = importedPageIds.has(duplicate.id);
      if (!isImported) {
        continue;
      }

      if (duplicate.error_page !== null) {
        await knex('pages')
          .where('id', duplicate.id)
          .where('is_published', duplicate.is_published)
          .update({
            deleted_at: knex.fn.now(),
            updated_at: knex.fn.now(),
          });
        continue;
      }

      let baseSlug = slugifyTemplatePage(duplicate.name || duplicate.slug);
      if (!baseSlug || baseSlug === keeper.slug) {
        baseSlug = `${slugifyTemplatePage(duplicate.name || 'page')}-2`;
      }

      let candidate = baseSlug;
      let counter = 3;
      while (
        pages.some(
          (page) =>
            page.id !== duplicate.id &&
            page.deleted_at === null &&
            page.slug === candidate &&
            page.is_published === duplicate.is_published &&
            (page.page_folder_id ?? null) === (duplicate.page_folder_id ?? null) &&
            (page.error_page ?? null) === (duplicate.error_page ?? null) &&
            (page.qay_site_id ?? null) === (duplicate.qay_site_id ?? null)
        )
      ) {
        candidate = `${baseSlug}-${counter++}`;
      }

      await knex('pages')
        .where('id', duplicate.id)
        .where('is_published', duplicate.is_published)
        .update({
          slug: candidate,
          is_index: false,
          updated_at: knex.fn.now(),
        });

      duplicate.slug = candidate;
      duplicate.is_index = false;
    }
  }
}

async function resolveDuplicateLayerStyleNames(
  knex: Awaited<ReturnType<typeof getKnexClient>>,
  importedLayerStyleIds: Set<string>,
  siteId: string
) {
  if (!(await knex.schema.hasTable('layer_styles'))) return;

  const styles = await knex('layer_styles')
    .whereNull('deleted_at')
    .select<LayerStyleRecord[]>('id', 'name', 'is_published', 'created_at')
    .orderBy('created_at', 'asc')
    .orderBy('id', 'asc');

  const groups = new Map<string, LayerStyleRecord[]>();
  for (const style of styles) {
    const key = `${style.name}\t${style.is_published ? 'published' : 'draft'}`;
    const current = groups.get(key) || [];
    current.push(style);
    groups.set(key, current);
  }

  for (const entries of groups.values()) {
    if (entries.length < 2) continue;

    const sorted = [...entries].sort((a, b) => {
      const aImported = importedLayerStyleIds.has(a.id);
      const bImported = importedLayerStyleIds.has(b.id);
      if (aImported !== bImported) {
        return aImported ? 1 : -1;
      }
      return `${a.created_at ?? ''}:${a.id}`.localeCompare(`${b.created_at ?? ''}:${b.id}`);
    });

    const keeper = sorted[0];
    const duplicates = sorted.slice(1);

    for (const duplicate of duplicates) {
      let baseName = duplicate.name;
      if (importedLayerStyleIds.has(duplicate.id)) {
        baseName = `${duplicate.name} (${siteId.slice(0, 6)})`;
      }

      let candidate = baseName;
      let counter = 2;
      while (
        styles.some(
          (style) =>
            style.id !== duplicate.id &&
            style.name === candidate &&
            style.is_published === duplicate.is_published
        )
      ) {
        candidate = `${baseName} ${counter++}`;
      }

      if (candidate === duplicate.name && duplicate.id !== keeper.id) {
        candidate = `${baseName} ${counter++}`;
      }

      await knex('layer_styles')
        .where('id', duplicate.id)
        .where('is_published', duplicate.is_published)
        .update({
          name: candidate,
          updated_at: knex.fn.now(),
        });

      duplicate.name = candidate;
    }
  }
}

async function tagImportedTemplateData(siteId: string, importedIds: ImportedRowIds) {
  const knex = await getKnexClient();
  const siteSettings = JSON.stringify({ qay_site_id: siteId });
  const importedPageIds = new Set(importedIds.pages);
  const importedLayerStyleIds = new Set(importedIds.layerStyles);

  try {
    if (await knex.schema.hasTable('pages') && importedIds.pages.length > 0) {
      await knex.raw('DROP INDEX IF EXISTS pages_slug_is_published_folder_unique');

      await knex('pages')
        .whereNull('deleted_at')
        .whereIn('id', importedIds.pages)
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
          slug: knex.raw(
            "case when error_page is null and is_index = true and page_folder_id is null then ? else slug end",
            [buildQayIndexSlug(siteId)]
          ),
        });

      await normalizeImportedPageSlugs(knex, siteId, importedPageIds);
      await resolveDuplicatePageSlots(knex, importedPageIds, siteId);
      await resolveDuplicatePageSlots(knex, importedPageIds);
      await restorePageSiteUniqueIndex(knex);
    }

    if (await knex.schema.hasTable('page_folders') && importedIds.pageFolders.length > 0) {
      await knex('page_folders')
        .whereNull('deleted_at')
        .whereIn('id', importedIds.pageFolders)
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
        });
    }

    if (await knex.schema.hasTable('layer_styles')) {
      await resolveDuplicateLayerStyleNames(knex, importedLayerStyleIds, siteId);
    }

    if (
      await knex.schema.hasTable('assets') &&
      await knex.schema.hasTable('qay_site_assets') &&
      importedIds.assets.length > 0
    ) {
      const assets = await knex('assets')
        .whereNull('deleted_at')
        .whereIn('id', importedIds.assets)
        .select('id');

      if (assets.length > 0) {
        await knex('qay_site_assets')
          .insert(assets.map((asset) => ({ qay_site_id: siteId, asset_id: asset.id })))
          .onConflict(['qay_site_id', 'asset_id'])
          .ignore();
      }
    }

    if (
      await knex.schema.hasTable('asset_folders') &&
      await knex.schema.hasTable('qay_site_asset_folders') &&
      importedIds.assetFolders.length > 0
    ) {
      const folders = await knex('asset_folders')
        .whereNull('deleted_at')
        .whereIn('id', importedIds.assetFolders)
        .select('id');

      if (folders.length > 0) {
        await knex('qay_site_asset_folders')
          .insert(folders.map((folder) => ({ qay_site_id: siteId, asset_folder_id: folder.id })))
          .onConflict(['qay_site_id', 'asset_folder_id'])
          .ignore();
      }
    }

    if (
      await knex.schema.hasTable('collections') &&
      await knex.schema.hasTable('qay_site_collections') &&
      importedIds.collections.length > 0
    ) {
      const collections = await knex('collections')
        .whereNull('deleted_at')
        .where('is_published', false)
        .whereIn('id', importedIds.collections)
        .select('id');

      if (collections.length > 0) {
        await knex('qay_site_collections')
          .insert(collections.map((collection) => ({
            site_id: siteId,
            collection_id: collection.id,
          })))
          .onConflict('collection_id')
          .ignore();
      }
    }

    if (await knex.schema.hasTable('fonts') && importedIds.fonts.length > 0) {
      await knex('fonts')
        .whereIn('id', importedIds.fonts)
        .where('url', 'like', '{{ASSET_URL:%')
        .update({
          url: null,
          storage_path: null,
          updated_at: knex.fn.now(),
        });
    }
  } finally {
    await closeKnexClient();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { templateId } = await params;
  const body = await request.json().catch(() => null);
  const siteId = typeof body?.siteId === 'string' ? body.siteId : '';

  if (!siteId) {
    return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
  }

  const supabase = getQayAdmin() as any;
  const { data: site, error: siteError } = await supabase
    .from('qay_sites')
    .select('id')
    .eq('id', siteId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (siteError) {
    return NextResponse.json({ error: siteError.message }, { status: 500 });
  }

  if (!site) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  await ensureQayPageSiteUniqueness();
  const knex = await getKnexClient();

  try {
    const existingIds = {
      pages: await loadExistingIds(knex, 'pages'),
      page_folders: await loadExistingIds(knex, 'page_folders'),
      layer_styles: await loadExistingIds(knex, 'layer_styles'),
      assets: await loadExistingIds(knex, 'assets'),
      asset_folders: await loadExistingIds(knex, 'asset_folders'),
      collections: await loadExistingIds(knex, 'collections'),
      fonts: await loadExistingIds(knex, 'fonts'),
    };

    const [payload, templateDetails] = await Promise.all([
      fetchProcessedTemplateApplyPayload(templateId),
      getTemplate(templateId).catch(() => null),
    ]);
    const { template, sql } = payload;
    const importSql = stripQayUnsafeTemplateStatements(sql.insert);

    await knex.transaction(async (trx) => {
      await trx.raw('DROP INDEX IF EXISTS pages_slug_is_published_folder_unique');
      await dropLayerStyleNameConstraint(trx);
      await trx.raw(importSql);
    });

    const importedIds = await collectImportedRowIds(knex, existingIds);
    await tagImportedTemplateData(siteId, importedIds);
    await copyTemplateAssetsToUserStorage(knex);
    await runPendingMigrationsForTemplate(knex, template.lastMigration);

    await supabase
      .from('qay_sites')
      .update({
        updated_at: new Date().toISOString(),
        thumbnail_url: templateDetails?.preview || null,
      })
      .eq('id', siteId);

    return NextResponse.json({
      success: true,
      templateName: template.name,
      siteId,
    });
  } catch (error) {
    try {
      await restorePageSiteUniqueIndex(knex);
      await restoreLayerStyleNameConstraint(knex);
    } catch {
      // Keep the original template error as the response.
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply template' },
      { status: 500 }
    );
  } finally {
    try {
      await restoreLayerStyleNameConstraint(knex);
    } catch {
      // Do not mask the main response path.
    }
    await closeKnexClient();
  }
}
