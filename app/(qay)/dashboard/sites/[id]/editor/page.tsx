import { notFound, redirect } from 'next/navigation';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QaySiteEditorGatePage({ params }: PageProps) {
  const user = await requireDeveloper();
  const { id } = await params;
  const supabase = getQayAdmin() as any;

  const { data, error } = await supabase
    .from('qay_sites')
    .select('id, name, slug')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  const { data: existingPage, error: existingPageError } = await supabase
    .from('pages')
    .select('id')
    .eq('is_published', false)
    .is('deleted_at', null)
    .filter('settings->>qay_site_id', 'eq', id)
    .order('order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingPageError) {
    throw new Error(existingPageError.message);
  }

  let pageId = existingPage?.id;

  if (!pageId) {
    const { data: createdPage, error: createPageError } = await supabase
      .from('pages')
      .insert({
        name: 'Home',
        slug: `qay-${id}`,
        page_folder_id: null,
        order: 0,
        depth: 0,
        is_index: false,
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
