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

async function tagImportedTemplateData(siteId: string, importedAfter: Date) {
  const knex = await getKnexClient();
  const siteSettings = JSON.stringify({ qay_site_id: siteId });
  const importedAfterIso = importedAfter.toISOString();

  try {
    const pagesHasCreatedAt =
      await knex.schema.hasTable('pages') && await knex.schema.hasColumn('pages', 'created_at');
    if (pagesHasCreatedAt) {
      await knex.raw('DROP INDEX IF EXISTS pages_slug_is_published_folder_unique');

      await knex('pages')
        .whereNull('deleted_at')
        .whereNull('error_page')
        .where('created_at', '>=', importedAfterIso)
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
          slug: knex.raw(
            "case when is_index = true and page_folder_id is null then ? else slug end",
            [buildQayIndexSlug(siteId)]
          ),
        });

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
    } catch {
      // Keep the original template error as the response.
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply template' },
      { status: 500 }
    );
  } finally {
    await closeKnexClient();
  }
}
