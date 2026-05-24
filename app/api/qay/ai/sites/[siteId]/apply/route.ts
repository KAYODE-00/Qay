import { NextResponse } from 'next/server';
import type { Layer } from '@/types';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { normalizeAiLayers } from '@/qay/lib/ai/builder';
import { ensureQayDraftHomePage } from '@/qay/lib/site-page-repair';
import { upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';

type ApplyAiSiteBody = {
  layers?: Layer[];
};

function wrapLayersForPage(layers: Layer[]): Layer[] {
  return [
    {
      id: 'body',
      name: 'body',
      classes: '',
      children: layers,
    } as Layer,
  ];
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { siteId } = await params;
    const body = (await request.json().catch(() => null)) as ApplyAiSiteBody | null;
    const generatedLayers = normalizeAiLayers(body?.layers || []);

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

    const pageId = await ensureQayDraftHomePage(siteId);
    await upsertDraftLayers(pageId, wrapLayersForPage(generatedLayers));

    await supabase
      .from('qay_sites')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', siteId);

    return NextResponse.json({ data: { siteId, pageId } });
  } catch (error) {
    console.error('[QAY AI site apply] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to apply AI design' },
      { status: 500 }
    );
  }
}
