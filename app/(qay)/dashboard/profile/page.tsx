import type { ReactNode } from 'react';
import { Home, LayoutTemplate, User } from 'lucide-react';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { QayLogo } from '@/qay/components/QayLogo';

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

export default async function DashboardProfilePage() {
  const user = await requireDeveloper();
  const initials = (user.email || 'QAY').slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center border-r border-border bg-card/90 px-3 py-4 shadow-sm backdrop-blur">
        <a
          href="/dashboard" aria-label="Dashboard"
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
          <NavItem
            href="/dashboard/profile" label="Profile"
            active
          >
            <User className="size-5" />
          </NavItem>
        </nav>
        <div className="flex size-11 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground">
          {initials}
        </div>
      </aside>

      <div className="pl-20">
        <header className="border-b border-border bg-card/80">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">QAY Studio</p>
              <h1 className="text-lg font-semibold tracking-normal">Profile</h1>
            </div>
          </div>
        </header>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Account</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
