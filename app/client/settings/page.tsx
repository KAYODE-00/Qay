import { requireClient } from '@/qay/lib/auth-guard';
import { getQayAccountProfile } from '@/qay/lib/account';
import { AccountSettingsForm } from '@/qay/components/account/AccountSettingsForm';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';

export default async function ClientSettingsPage() {
  const user = await requireClient();
  const profile = await getQayAccountProfile(user);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar />

        <section className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Account</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Change your account details or switch between client and developer mode.
            </p>

            <div className="mt-8">
              <AccountSettingsForm profile={profile} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
