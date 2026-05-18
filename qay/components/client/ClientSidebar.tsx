'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BarChart3, Database, FileText, Inbox, LayoutDashboard, PenSquare, Settings } from 'lucide-react';
import { QayLogo } from '@/qay/components/QayLogo';

type ClientSidebarProps = {
  siteId?: string;
  siteName?: string;
};

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, href: (siteId: string) => `/client/${siteId}` },
  { key: 'editor', label: 'Content', icon: PenSquare, href: (siteId: string) => `/client/${siteId}/editor` },
  { key: 'cms', label: 'CMS', icon: Database, href: (siteId: string) => `/client/${siteId}/cms` },
  { key: 'forms', label: 'Forms', icon: Inbox, href: (siteId: string) => `/client/${siteId}/forms` },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, href: (siteId: string) => `/client/${siteId}/analytics` },
];

export function ClientSidebar({ siteId, siteName }: ClientSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full max-w-xs flex-col border-r border-border bg-card/80">
      <div className="border-b border-border px-5 py-5">
        <QayLogo />
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client mode</p>
        <p className="mt-2 text-sm text-foreground">{siteName || 'Your shared sites'}</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <Link
          href="/client"
          className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          All sites
        </Link>

        {siteId ? (
          <div className="space-y-1">
            {navItems.map((item) => {
              const href = item.href(siteId);
              const active = pathname === href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.key}
                  href={href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-md border border-border bg-background/70 px-3 py-3 text-sm text-muted-foreground">
              Pick a shared site to review pages and leave content updates.
            </div>
            <Link
              href="/client/settings"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                pathname === '/client/settings'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Settings className="size-4" />
              Settings
            </Link>
          </div>
        )}
      </nav>

      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileText className="size-4" />
          Changes save to the site draft only.
        </div>
      </div>
    </aside>
  );
}
