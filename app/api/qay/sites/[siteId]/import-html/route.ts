import { NextRequest, NextResponse } from 'next/server';
import { getKnexClient, closeKnexClient } from '@/lib/knex-client';
import { upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';
import { ensureQayDraftErrorPages } from '@/qay/lib/site-error-pages';
import type { Layer } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function layersAsPageBody(importedLayers: Layer[]): Layer[] {
  return [
    {
      id: 'body',
      name: 'body',
      classes: '',
      children: importedLayers,
    } as Layer,
  ];
}

type ImportPagePayload = {
  name?: unknown;
  slug?: unknown;
  layers?: unknown;
};

type NormalizedImportPage = {
  name?: unknown;
  slug?: unknown;
  layers: Layer[];
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

async function createImportedPage(siteId: string, pageNameInput: unknown, pageSlugInput?: unknown) {
  const knex = await getKnexClient();

  try {
    const pages = await knex('pages')
      .whereNull('deleted_at')
      .whereNull('error_page')
      .where('is_published', false)
      .select('id', 'name', 'slug', 'settings', 'is_index', 'page_folder_id', 'created_at')
      .orderBy('is_index', 'desc')
      .orderBy('created_at', 'asc');

    const sitePages = pages.filter((page) => page.settings?.qay_site_id === siteId);
    const isFirstSitePage = sitePages.length === 0;
    const pageName = typeof pageNameInput === 'string' && pageNameInput.trim()
      ? pageNameInput.trim().slice(0, 80)
      : isFirstSitePage
        ? 'Homepage'
        : 'Imported page';
    const requestedSlug = typeof pageSlugInput === 'string' ? slugify(pageSlugInput) : '';
    const baseSlug = requestedSlug || slugify(pageName) || 'imported-page';
    const existingSlugs = new Set(sitePages.map((page) => page.slug));
    let slug = isFirstSitePage ? buildQayIndexSlug(siteId) : baseSlug;
    let suffix = 2;

    while (!isFirstSitePage && existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const [page] = await knex('pages')
      .insert({
        name: pageName,
        slug,
        order: sitePages.length,
        depth: 0,
        is_index: isFirstSitePage,
        is_dynamic: false,
        error_page: null,
        settings: { qay_site_id: siteId },
        is_published: false,
      })
      .returning(['id']);

    return page.id as string;
  } finally {
    await closeKnexClient();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await params;
  const body = await request.json().catch(() => null);
  const layers = Array.isArray(body?.layers) ? body.layers as Layer[] : [];
  const pages = Array.isArray(body?.pages)
    ? body.pages
      .map((page: ImportPagePayload) => ({
        name: page?.name,
        slug: page?.slug,
        layers: Array.isArray(page?.layers) ? page.layers as Layer[] : [],
      }))
      .filter((page: NormalizedImportPage) => page.layers.length > 0)
    : [];
  const pageName = body?.pageName;

  if (layers.length === 0 && pages.length === 0) {
    return NextResponse.json({ error: 'No HTML layers to import' }, { status: 400 });
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

  const importedPages = pages.length > 0
    ? pages
    : [{ name: pageName, slug: undefined, layers }];
  const createdPages: Array<{ id: string; name: unknown }> = [];

  for (const page of importedPages) {
    const pageId = await createImportedPage(siteId, page.name, page.slug);
    await upsertDraftLayers(pageId, layersAsPageBody(page.layers));
    createdPages.push({ id: pageId, name: page.name });
  }
  await ensureQayDraftErrorPages(siteId);

  return NextResponse.json({
    success: true,
    pageId: createdPages[0]?.id,
    pages: createdPages,
    siteId,
  });
}
