import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import type { QaySite } from '@/qay/types';
import { DeveloperDashboard } from './DeveloperDashboard';
import { allowRuntimeQaySchemaChanges, isMissingQaySchemaError, qaySchemaPublicMessage, qaySchemaSetupMessage, runQayCoreMigration } from '@/qay/lib/schema';
import { withResolvedQayLiveUrl } from '@/qay/lib/site-url';
import { getPendingClientInvites } from '@/qay/lib/client-content';
import { getQayAccountProfile } from '@/qay/lib/account';

function DashboardSetupNotice({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <section className="w-full max-w-xl rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">QAY</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-normal">Dashboard is almost ready</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{message}</p>
      </section>
    </main>
  );
}

export default async function DashboardPage() {
  const user = await requireDeveloper();
  let supabase;

  try {
    supabase = getQayAdmin() as any;
  } catch (error) {
    console.error('QAY dashboard configuration failed:', error);
    return <DashboardSetupNotice message="We could not load your dashboard right now. Please try again in a moment." />;
  }

  let { data, error } = await supabase
    .from('qay_sites')
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  if (error && isMissingQaySchemaError(error)) {
    if (!allowRuntimeQaySchemaChanges()) {
      console.error('QAY dashboard unavailable:', qaySchemaSetupMessage());
      return <DashboardSetupNotice message={qaySchemaPublicMessage()} />;
    }

    const migration = await runQayCoreMigration();

    if (!migration.success) {
      console.error('QAY dashboard migration failed:', qaySchemaSetupMessage(migration.error));
      return <DashboardSetupNotice message={qaySchemaPublicMessage()} />;
    }

    const retry = await supabase
      .from('qay_sites')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });

    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error('QAY dashboard load failed:', error.message);
    return <DashboardSetupNotice message="We could not load your dashboard right now. Please try again in a moment." />;
  }

  const pendingInvites = await getPendingClientInvites(user.email);
  const profile = await getQayAccountProfile(user);

  return (
    <DeveloperDashboard
      initialSites={((data ?? []) as QaySite[]).map((site) => withResolvedQayLiveUrl(site))}
      profile={profile}
      pendingInvites={pendingInvites}
    />
  );
}
