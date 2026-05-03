import { notFound, redirect } from 'next/navigation';
import { requireQayAuth } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { ensureQayPageSiteUniqueness } from '@/qay/lib/page-site-uniqueness';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QaySiteEditorGatePage({ params }: PageProps) {
  const user = await requireQayAuth();
  const { id } = await params;
  const supabase = getQayAdmin() as any;

  const { data: ownedSite, error: ownedSiteError } = await supabase
    .from('qay_sites')
    .select('id, name, slug')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (ownedSiteError) {
    throw new Error(ownedSiteError.message);
  }

  const { data: membership, error: membershipError } = ownedSite
    ? { data: null, error: null }
    : await supabase
        .from('qay_site_members')
        .select('id')
        .eq('site_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!ownedSite && !membership) {
    notFound();
  }

  await ensureQayPageSiteUniqueness();

  const { data: existingPage, error: existingPageError } = await supabase
    .from('pages')
    .select('id, is_index, page_folder_id, created_at, settings')
    .eq('is_published', false)
    .is('deleted_at', null)
    .filter('settings->>qay_site_id', 'eq', id)
    .is('error_page', null)
    .order('order', { ascending: true })
    .order('created_at', { ascending: true });

  if (existingPageError) {
    throw new Error(existingPageError.message);
  }

  const sitePages = existingPage ?? [];
  const homePage = sitePages.find((page: { is_index: boolean; page_folder_id: string | null }) => (
    page.is_index && page.page_folder_id === null
  ));
  const fallbackRootPage = sitePages.find((page: { page_folder_id: string | null }) => page.page_folder_id === null);
  let pageId = homePage?.id ?? fallbackRootPage?.id ?? sitePages[0]?.id;

  if (!homePage && fallbackRootPage?.id) {
    const { error: repairHomePageError } = await supabase
      .from('pages')
      .update({
        slug: buildQayIndexSlug(id),
        is_index: true,
        page_folder_id: null,
        settings: { ...((fallbackRootPage.settings as Record<string, unknown> | null) || {}), qay_site_id: id },
        updated_at: new Date().toISOString(),
      })
      .eq('id', fallbackRootPage.id)
      .eq('is_published', false)
      .is('deleted_at', null);

    if (repairHomePageError) {
      throw new Error(repairHomePageError.message);
    }
  }

  if (!pageId) {
    const { data: createdPage, error: createPageError } = await supabase
      .from('pages')
      .insert({
        name: 'Home',
        slug: buildQayIndexSlug(id),
        page_folder_id: null,
        order: 0,
        depth: 0,
        is_index: true,
        is_dynamic: false,
        error_page: null,
        settings: { qay_site_id: id },
        is_published: false,
      })
      .select('id')
      .single();

    if (createPageError) {
      throw new Error(createPageError.message);
    }

    pageId = createdPage.id;

    const { error: createLayersError } = await supabase
      .from('page_layers')
      .insert({
        page_id: pageId,
        layers: [
          {
            id: 'body',
            name: 'body',
            classes: '',
            children: [],
          },
        ],
        is_published: false,
      });

    if (createLayersError) {
      throw new Error(createLayersError.message);
    }
  }

  redirect(`/ycode/layers/${pageId}?site=${id}&view=desktop&tab=design&layer=body`);
}
