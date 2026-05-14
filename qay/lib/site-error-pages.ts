import { DEFAULT_ERROR_PAGES } from '@/lib/page-utils';
import { createPage } from '@/lib/repositories/pageRepository';
import { upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { getQayAdmin } from './supabase-admin';

export async function ensureQayDraftErrorPages(siteId: string): Promise<void> {
  const supabase = getQayAdmin() as any;
  const { data: existingPages, error: existingPagesError } = await supabase
    .from('pages')
    .select('error_page, settings')
    .eq('is_published', false)
    .is('deleted_at', null)
    .not('error_page', 'is', null);

  if (existingPagesError) {
    throw new Error(existingPagesError.message);
  }

  const existingCodes = new Set(
    ((existingPages || []) as Array<{ error_page: number | null; settings: Record<string, unknown> | null }>)
      .filter((page) => page.settings?.qay_site_id === siteId && page.error_page !== null)
      .map((page) => page.error_page as number)
  );

  for (const [index, config] of DEFAULT_ERROR_PAGES.entries()) {
    if (existingCodes.has(config.code)) {
      continue;
    }

    const page = await createPage({
      name: config.name,
      slug: '',
      is_published: false,
      page_folder_id: null,
      order: 1000 + index,
      depth: 0,
      is_index: false,
      is_dynamic: false,
      error_page: config.code,
      settings: {
        ...(config.settings || {}),
        qay_site_id: siteId,
      } as any,
    });

    const layers = JSON.parse(config.layers) as unknown[];
    await upsertDraftLayers(page.id, layers as any[]);
  }
}
