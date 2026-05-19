import type { ReactNode } from 'react';
import { Home, LayoutTemplate, Settings } from 'lucide-react';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayAccountProfile } from '@/qay/lib/account';
import { AccountSettingsForm } from '@/qay/components/account/AccountSettingsForm';
import { AccountAvatar } from '@/qay/components/account/AccountAvatar';

function NavItem({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className={`flex size-11 items-center justify-center rounded-xl border transition ${
        active
          ? 'border-foreground/15 bg-foreground text-background shadow-sm'
          : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  );
}

export default async function DashboardSettingsPage() {
  const user = await requireDeveloper();
  const profile = await getQayAccountProfile(user);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center border-r border-border bg-card/90 px-3 py-4 shadow-sm backdrop-blur">
        <a
          href="/dashboard"
          aria-label="Dashboard"
          className="mb-6 flex size-11 items-center justify-center overflow-hidden rounded-xl border border-border bg-background"
        >
          <div className="scale-75">
            <QayLogo />
          </div>
        </a>
        <nav className="flex flex-1 flex-col items-center gap-2">
          <NavItem href="/dashboard" label="Sites">
            <Home className="size-5" />
          </NavItem>
          <NavItem href="/dashboard/templates" label="Templates">
            <LayoutTemplate className="size-5" />
          </NavItem>
          <NavItem href="/dashboard/settings" label="Settings" active>
            <Settings className="size-5" />
          </NavItem>
        </nav>
        <AccountAvatar profile={profile} className="size-11" />
      </aside>

      <div className="pl-20">
        <header className="border-b border-border bg-card/80">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">QAY Studio</p>
              <h1 className="text-lg font-semibold tracking-normal">Settings</h1>
            </div>
          </div>
        </header>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <AccountSettingsForm profile={profile} role="developer" />

            <div className="space-y-4">
              <a
                href="/dashboard/settings/account-mode"
                className="block rounded-lg border border-border bg-card p-5 transition hover:bg-accent"
              >
                <p className="text-sm font-medium text-foreground">Workspace mode</p>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">
                  Switch between developer and client dashboards from a separate account area.
                </p>
              </a>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-medium text-foreground">Developer settings</p>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">
                  Site settings, integrations, domains, redirects, and publishing stay inside each site.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
