import { ArrowLeft } from 'lucide-react';
import { requireClient } from '@/qay/lib/auth-guard';
import { getQayAccountProfile } from '@/qay/lib/account';
import { AccountModeSettingsForm } from '@/qay/components/account/AccountSettingsForm';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';

export default async function ClientAccountModePage() {
  const user = await requireClient();
  const profile = await getQayAccountProfile(user);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar />

        <section className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-2xl">
            <a href="/client/settings" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />
              Settings
            </a>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Workspace mode</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Choose the dashboard that fits how you use QAY.
            </p>

            <div className="mt-8">
              <AccountModeSettingsForm profile={profile} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
