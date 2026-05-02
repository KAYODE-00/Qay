import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import type { QaySite } from '@/qay/types';
import { DeveloperDashboard } from './DeveloperDashboard';

export default async function DashboardPage() {
  const user = await requireDeveloper();
  const supabase = getQayAdmin() as any;

  const { data, error } = await supabase
    .from('qay_sites')
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <DeveloperDashboard initialSites={(data ?? []) as QaySite[]} userEmail={user.email ?? ''} />;
}
