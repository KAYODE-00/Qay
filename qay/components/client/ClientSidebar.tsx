'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, BarChart3, Database, FileText, Inbox, LayoutDashboard, PenSquare, Rocket, Settings } from 'lucide-react';
import { QayLogo } from '@/qay/components/QayLogo';
import type { QayAccountProfile } from '@/qay/lib/account';
import { AccountAvatar } from '@/qay/components/account/AccountAvatar';

type ClientSidebarProps = {
  siteId?: string;
  siteName?: string;
  profile?: QayAccountProfile;
};

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, href: (siteId: string) => `/client/${siteId}` },
  { key: 'editor', label: 'Content', icon: PenSquare, href: (siteId: string) => `/client/${siteId}/editor` },
  { key: 'cms', label: 'CMS', icon: Database, href: (siteId: string) => `/client/${siteId}/cms` },
  { key: 'forms', label: 'Forms', icon: Inbox, href: (siteId: string) => `/client/${siteId}/forms` },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, href: (siteId: string) => `/client/${siteId}/analytics` },
];

export function ClientSidebar({ siteId, siteName, profile }: ClientSidebarProps) {
  const pathname = usePathname();
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  async function publishSite() {
    if (!siteId) return;

    setPublishing(true);
    setPublishMessage(null);

    try {
      const response = await fetch(`/ycode/api/publish?site=${siteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishAll: true }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setPublishMessage(payload?.error || 'Unable to publish');
        return;
      }

      setPublishMessage('Published');
    } catch (error) {
      setPublishMessage(error instanceof Error ? error.message : 'Unable to publish');
    } finally {
      setPublishing(false);
    }
  }

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

        <div className="space-y-1">
          {siteId ? (
            navItems.map((item) => {
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
            })
          ) : (
            <div className="rounded-md border border-border bg-background/70 px-3 py-3 text-sm text-muted-foreground">
              Pick a shared site to review pages and leave content updates.
            </div>
          )}
          <Link
            href="/client/settings"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
              pathname.startsWith('/client/settings')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>
      </nav>

      <div className="space-y-3 border-t border-border px-4 py-4 text-xs text-muted-foreground">
        {siteId && (
          <div>
            <button
              type="button"
              onClick={publishSite}
              disabled={publishing}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Rocket className="size-4" />
              {publishing ? 'Publishing...' : 'Publish site'}
            </button>
            {publishMessage && (
              <p className="mt-2 text-xs text-muted-foreground">{publishMessage}</p>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <FileText className="size-4" />
          Changes save to the site draft only.
        </div>
        {profile && (
          <div className="flex items-center gap-2 border-t border-border pt-3">
            <AccountAvatar profile={profile} className="size-9" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{profile.full_name || profile.email}</p>
              <p className="truncate text-[11px] text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
