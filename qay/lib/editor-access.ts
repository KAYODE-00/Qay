import { notFound, redirect } from 'next/navigation';
import { requireQayAuth } from './auth-guard';
import { getQayAdmin } from './supabase-admin';

export async function requireQayEditorSite(siteIdFromQuery?: string | null): Promise<string> {
  const user = await requireQayAuth();
  const siteId = siteIdFromQuery || null;

  if (!siteId) {
    redirect('/dashboard');
  }

  const supabase = getQayAdmin() as any;
  const { data: ownedSite, error: ownedSiteError } = await supabase
    .from('qay_sites')
    .select('id')
    .eq('id', siteId)
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
        .eq('site_id', siteId)
        .eq('user_id', user.id)
        .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!ownedSite && !membership) {
    notFound();
  }

  return siteId;
}
