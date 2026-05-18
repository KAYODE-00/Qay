import { notFound, redirect } from 'next/navigation';
import { requireQayAuth } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { ensureQayPageSiteUniqueness } from '@/qay/lib/page-site-uniqueness';
import { ensureQayDraftHomePage } from '@/qay/lib/site-page-repair';

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
      .select('id, role')
      .eq('site_id', id)
      .eq('user_id', user.id)
      .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!ownedSite && !membership) {
    notFound();
  }

  const { data: profile, error: profileError } = await supabase
    .from('qay_user_profiles')
    .select('account_type')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const memberRole = typeof membership?.role === 'string' ? membership.role : null;
  if (profile?.account_type === 'client' || memberRole === 'client' || memberRole === 'viewer') {
    redirect(`/client/${id}/editor`);
  }

  await ensureQayPageSiteUniqueness();
  const pageId = await ensureQayDraftHomePage(id);

  redirect(`/api/qay/editor/open?site=${id}&siteSlug=${ownedSite?.slug ?? ''}&page=${pageId}&view=desktop&tab=design&layer=body`);
}
