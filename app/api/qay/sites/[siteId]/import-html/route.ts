import { NextRequest, NextResponse } from 'next/server';
import { getKnexClient, closeKnexClient } from '@/lib/knex-client';
import { getDraftLayers, upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import type { Layer } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function appendToBody(layers: Layer[], importedLayers: Layer[]): Layer[] {
  let appended = false;

  const nextLayers = layers.map((layer) => {
    if (layer.id === 'body') {
      appended = true;
      return {
        ...layer,
        children: [...(layer.children ?? []), ...importedLayers],
      };
    }

    return layer;
  });

  if (appended) {
    return nextLayers;
  }

  return [
    {
      id: 'body',
      name: 'body',
      classes: '',
      children: importedLayers,
    } as Layer,
    ...nextLayers,
  ];
}

async function findOrCreateImportPage(siteId: string) {
  const knex = await getKnexClient();

  try {
    const pages = await knex('pages')
      .whereNull('deleted_at')
      .whereNull('error_page')
      .where('is_published', false)
      .select('id', 'name', 'settings', 'is_index', 'created_at')
      .orderBy('is_index', 'desc')
      .orderBy('created_at', 'asc');

    const sitePages = pages.filter((page) => page.settings?.qay_site_id === siteId);
    const existing = sitePages[0];
    if (existing) {
      return existing.id as string;
    }

    const isFirstSitePage = sitePages.length === 0;
    const slug = isFirstSitePage ? 'index' : `import-${Date.now().toString(36)}`;
    const [page] = await knex('pages')
      .insert({
        name: isFirstSitePage ? 'Homepage' : 'Imported HTML',
        slug,
        order: 0,
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

  if (layers.length === 0) {
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

  const pageId = await findOrCreateImportPage(siteId);
  const draft = await getDraftLayers(pageId);
  const currentLayers = draft?.layers?.length
    ? draft.layers
    : [{ id: 'body', name: 'body', classes: '', children: [] } as Layer];

  await upsertDraftLayers(pageId, appendToBody(currentLayers, layers));

  return NextResponse.json({
    success: true,
    pageId,
    siteId,
  });
}
