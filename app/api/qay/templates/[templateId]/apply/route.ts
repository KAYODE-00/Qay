import { NextRequest, NextResponse } from 'next/server';
import { applyTemplate } from '@/lib/services/templateService';
import { getKnexClient, closeKnexClient } from '@/lib/knex-client';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { ensureQayPageSiteUniqueness } from '@/qay/lib/page-site-uniqueness';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function tagImportedTemplateData(siteId: string) {
  const knex = await getKnexClient();
  const siteSettings = JSON.stringify({ qay_site_id: siteId });

  try {
    if (await knex.schema.hasTable('pages')) {
      await knex('pages')
        .whereNull('deleted_at')
        .whereNull('error_page')
        .whereRaw("(settings->>'qay_site_id') IS NULL")
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
          slug: knex.raw(
            "case when is_index = true and page_folder_id is null then ? else slug end",
            [buildQayIndexSlug(siteId)]
          ),
        });
    }

    if (await knex.schema.hasTable('page_folders')) {
      await knex('page_folders')
        .whereNull('deleted_at')
        .whereRaw("(settings->>'qay_site_id') IS NULL")
        .update({
          settings: knex.raw("coalesce(settings, '{}'::jsonb) || ?::jsonb", [siteSettings]),
        });
    }

    if (
      await knex.schema.hasTable('assets') &&
      await knex.schema.hasTable('qay_site_assets')
    ) {
      const assets = await knex('assets')
        .whereNull('deleted_at')
        .where('source', 'like', 'template:%')
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
      await knex.schema.hasTable('qay_site_asset_folders')
    ) {
      const folders = await knex('asset_folders')
        .whereNull('deleted_at')
        .select('id');

      if (folders.length > 0) {
        await knex('qay_site_asset_folders')
          .insert(folders.map((folder) => ({ qay_site_id: siteId, asset_folder_id: folder.id })))
          .onConflict(['qay_site_id', 'asset_folder_id'])
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

  // QAY site ids are not Ycode cloud tenant ids. Passing siteId as tenantId makes
  // the template service generate tenant_id SQL for tables that do not have it.
  const result = await applyTemplate(templateId);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Failed to apply template' },
      { status: 500 }
    );
  }

  await tagImportedTemplateData(siteId);

  await supabase
    .from('qay_sites')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', siteId);

  return NextResponse.json({
    success: true,
    templateName: result.templateName,
    siteId,
  });
}
