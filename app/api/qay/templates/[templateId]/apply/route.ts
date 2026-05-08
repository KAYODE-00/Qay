import { NextRequest, NextResponse } from 'next/server';
import {
  copyTemplateAssetsToUserStorage,
  fetchProcessedTemplateApplyPayload,
  runPendingMigrationsForTemplate,
} from '@/lib/services/templateService';
import { getKnexClient, closeKnexClient } from '@/lib/knex-client';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { ensureQayPageSiteUniqueness } from '@/qay/lib/page-site-uniqueness';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function stripQayUnsafeTemplateStatements(sql: string): string {
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

function slugifyTemplatePage(value: string | null | undefined) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'page';
}

async function normalizeImportedPageSlugs(
  knex: Awaited<ReturnType<typeof getKnexClient>>,
  siteId: string,
  importedAfterIso: string
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
    const isImported = !!page.created_at && page.created_at >= importedAfterIso;
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

    if (nextSlug !== page.slug || nextIsIndex !== page.is_index) {
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
  siteId: string,
  importedAfterIso: string
) {
  if (!(await knex.schema.hasTable('pages'))) return;

  const pages = await knex('pages')
    .whereNull('deleted_at')
    .whereRaw("coalesce(settings->>'qay_site_id', '') = ?", [siteId])
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
      const aImported = !!a.created_at && a.created_at >= importedAfterIso;
      const bImported = !!b.created_at && b.created_at >= importedAfterIso;
      if (aImported !== bImported) {
        return aImported ? 1 : -1;
      }
      return `${a.created_at ?? ''}:${a.id}`.localeCompare(`${b.created_at ?? ''}:${b.id}`);
    });

    const keeper = sorted[0];
    const duplicates = sorted.slice(1);

    for (const duplicate of duplicates) {
      const isImported = !!duplicate.created_at && duplicate.created_at >= importedAfterIso;
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

      const nextIsIndex = false;
      let baseSlug = slugifyTemplatePage(duplicate.name || duplicate.slug);
      if (keeper.slug === baseSlug) {
        baseSlug = `${baseSlug}-2`;
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
            page.qay_site_id === siteId
        )
      ) {
        candidate = `${baseSlug}-${counter++}`;
      }

      await knex('pages')
        .where('id', duplicate.id)
        .where('is_published', duplicate.is_published)
        .update({
          slug: candidate,
          is_index: nextIsIndex,
          updated_at: knex.fn.now(),
        });
    }
  }
}

async function resolveAllDuplicatePageSlots(
  knex: Awaited<ReturnType<typeof getKnexClient>>,
  importedAfterIso: string
) {
  if (!(await knex.schema.hasTable('pages'))) return;

  const pages = await knex('pages')
    .whereNull('deleted_at')
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
      const aImported = !!a.created_at && a.created_at >= importedAfterIso;
      const bImported = !!b.created_at && b.created_at >= importedAfterIso;
      if (aImported !== bImported) {
        return aImported ? 1 : -1;
      }
      return `${a.created_at ?? ''}:${a.id}`.localeCompare(`${b.created_at ?? ''}:${b.id}`);
    });

    const keeper = sorted[0];
    const duplicates = sorted.slice(1);

    for (const duplicate of duplicates) {
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

async function tagImportedTemplateData(siteId: string, importedAfter: Date) {
  const knex = await getKnexClient();
  const siteSettings = JSON.stringify({ qay_site_id: siteId });
  const importedAfterIso = importedAfter.toISOString();
  const styleSuffix = ` (${siteId.slice(0, 6)})`;

  try {
    const pagesHasCreatedAt =
      await knex.schema.hasTable('pages') && await knex.schema.hasColumn('pages', 'created_at');
    if (pagesHasCreatedAt) {
      await knex.raw('DROP INDEX IF EXISTS pages_slug_is_published_folder_unique');

      await knex('pages')
        .whereNull('deleted_at')
        .where('created_at', '>=', importedAfterIso)
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
          slug: knex.raw(
            "case when error_page is null and is_index = true and page_folder_id is null then ? else slug end",
            [buildQayIndexSlug(siteId)]
          ),
        });

      await normalizeImportedPageSlugs(knex, siteId, importedAfterIso);
      await resolveDuplicatePageSlots(knex, siteId, importedAfterIso);
      await resolveAllDuplicatePageSlots(knex, importedAfterIso);
      await restorePageSiteUniqueIndex(knex);
    }

    const pageFoldersHasCreatedAt =
      await knex.schema.hasTable('page_folders') && await knex.schema.hasColumn('page_folders', 'created_at');
    if (pageFoldersHasCreatedAt) {
      await knex('page_folders')
        .whereNull('deleted_at')
        .where('created_at', '>=', importedAfterIso)
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
        });
    }

    const layerStylesHasCreatedAt =
      await knex.schema.hasTable('layer_styles') && await knex.schema.hasColumn('layer_styles', 'created_at');
    if (layerStylesHasCreatedAt) {
      await knex('layer_styles')
        .whereNull('deleted_at')
        .where('created_at', '>=', importedAfterIso)
        .update({
          name: knex.raw("name || ?", [styleSuffix]),
        });
    }

    if (
      await knex.schema.hasTable('assets') &&
      await knex.schema.hasTable('qay_site_assets')
    ) {
      let assetsQuery = knex('assets')
        .whereNull('deleted_at')
        .where('source', 'like', 'template:%');

      if (await knex.schema.hasColumn('assets', 'created_at')) {
        assetsQuery = assetsQuery.where('created_at', '>=', importedAfterIso);
      }

      const assets = await assetsQuery.select('id');

      if (assets.length > 0) {
        await knex('qay_site_assets')
          .insert(assets.map((asset) => ({ qay_site_id: siteId, asset_id: asset.id })))
          .onConflict(['qay_site_id', 'asset_id'])
          .ignore();
      }
    }

    if (
      await knex.schema.hasTable('asset_folders') &&
      await knex.schema.hasTable('qay_site_asset_folders')
    ) {
      let foldersQuery = knex('asset_folders').whereNull('deleted_at');

      if (await knex.schema.hasColumn('asset_folders', 'created_at')) {
        foldersQuery = foldersQuery.where('created_at', '>=', importedAfterIso);
      }

      const folders = await foldersQuery.select('id');

      if (folders.length > 0) {
        await knex('qay_site_asset_folders')
          .insert(folders.map((folder) => ({ qay_site_id: siteId, asset_folder_id: folder.id })))
          .onConflict(['qay_site_id', 'asset_folder_id'])
          .ignore();
      }
    }

    if (
      await knex.schema.hasTable('collections') &&
      await knex.schema.hasTable('qay_site_collections')
    ) {
      let collectionsQuery = knex('collections')
        .whereNull('deleted_at')
        .where('is_published', false);

      if (await knex.schema.hasColumn('collections', 'created_at')) {
        collectionsQuery = collectionsQuery.where('created_at', '>=', importedAfterIso);
      }

      const collections = await collectionsQuery.select('id');

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

    if (await knex.schema.hasTable('fonts')) {
      await knex('fonts')
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
  const importedAt = new Date();
  const knex = await getKnexClient();

  try {
    const { template, sql } = await fetchProcessedTemplateApplyPayload(templateId);
    const importSql = stripQayUnsafeTemplateStatements(sql.insert);

    await knex.transaction(async (trx) => {
      await trx.raw('DROP INDEX IF EXISTS pages_slug_is_published_folder_unique');
      await dropLayerStyleNameConstraint(trx);
      await trx.raw(importSql);
    });

    await tagImportedTemplateData(siteId, importedAt);
    await copyTemplateAssetsToUserStorage(knex, importedAt);
    await runPendingMigrationsForTemplate(knex, template.lastMigration);

    await supabase
      .from('qay_sites')
      .update({ updated_at: new Date().toISOString() })
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
