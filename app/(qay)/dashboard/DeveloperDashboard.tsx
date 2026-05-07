'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Bell, ExternalLink, Grid2X2, LayoutTemplate, List, MoreVertical, Plus, Settings, Trash2, UserPlus } from 'lucide-react';
import { QayLogo } from '@/qay/components/QayLogo';
import { QayThemeToggle } from '@/qay/components/QayThemeToggle';
import type { QaySite } from '@/qay/types';

type DashboardProps = {
  initialSites: QaySite[];
  userEmail: string;
};

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatRelativeDate(value: string | null) {
  if (!value) return 'Updated recently';

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000));

  if (diffDays === 0) return 'Updated today';
  if (diffDays === 1) return 'Updated yesterday';
  if (diffDays < 30) return `Updated ${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DeveloperDashboard({ initialSites, userEmail }: DashboardProps) {
  const [sites, setSites] = useState(initialSites);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const label = userEmail || 'QAY';
    return label.slice(0, 2).toUpperCase();
  }, [userEmail]);

  function openEditor(siteId: string) {
    window.location.assign(`/dashboard/sites/${siteId}/editor`);
  }

  async function createSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/qay/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: siteName, slug: siteSlug || siteName }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to create site');
        return;
      }

      window.location.assign(`/dashboard/sites/${payload.data.id}/editor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create site');
    } finally {
      setIsCreating(false);
    }
  }

  async function deleteSite(siteId: string) {
    const confirmed = window.confirm('Delete this site? This cannot be undone.');
    if (!confirmed) return;

    const previousSites = sites;
    setSites((current) => current.filter((site) => site.id !== siteId));

    try {
      const response = await fetch(`/api/qay/sites/${siteId}`, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok) {
        setSites(previousSites);
        window.alert(payload.error || 'Unable to delete site');
      }
    } catch (err) {
      setSites(previousSites);
      window.alert(err instanceof Error ? err.message : 'Unable to delete site');
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <QayLogo />

          <div className="flex items-center gap-2">
            <a
              href="/dashboard/templates"
              className="hidden h-10 items-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground sm:inline-flex"
            >
              <LayoutTemplate className="size-4" />
              Templates
            </a>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              <Plus className="size-4" />
              New site
            </button>
            <QayThemeToggle />
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <Bell className="size-4" />
            </button>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">My Sites</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create, manage, and open your sites.</p>
          </div>

          <div className="flex rounded-md border border-border bg-muted p-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView('grid')}
              className={`flex size-9 items-center justify-center rounded ${view === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Grid2X2 className="size-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView('list')}
              className={`flex size-9 items-center justify-center rounded ${view === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        <div className={view === 'grid' ? 'mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'mt-8 space-y-3'}>
          {sites.map((site) => (
            <article
              key={site.id}
              className={view === 'grid'
                ? 'rounded-lg border border-border bg-card p-4'
                : 'flex items-center gap-4 rounded-lg border border-border bg-card p-4'}
            >
              <div className={view === 'grid'
                ? 'flex aspect-video items-center justify-center rounded-md border border-border bg-muted'
                : 'flex h-20 w-32 shrink-0 items-center justify-center rounded-md border border-border bg-muted'}
              >
                {site.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={site.thumbnail_url} alt="" className="h-full w-full rounded-md object-cover" />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{site.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className={view === 'grid' ? 'mt-4' : 'min-w-0 flex-1'}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-medium">{site.name}</h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`size-2 rounded-full ${site.publish_status === 'published' ? 'bg-emerald-500' : 'bg-muted-foreground/35'}`} />
                      <span>{site.publish_status === 'published' ? 'Live' : 'Draft'}</span>
                      <span>{formatRelativeDate(site.updated_at)}</span>
                    </div>
                  </div>

                  <details className="relative">
                    <summary className="flex size-8 cursor-pointer list-none items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
                      <MoreVertical className="size-4" />
                    </summary>
                    <div className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-border bg-popover p-1 shadow-xl">
                      <a
                        href={site.live_url || `/api/qay/sites/${site.id}/open`}
                        target={site.live_url ? '_blank' : undefined}
                        rel={site.live_url ? 'noreferrer' : undefined}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <ExternalLink className="size-4" />
                        Open site
                      </a>
                      <a
                        href={`/dashboard/sites/${site.id}/settings`}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Settings className="size-4" />
                        Site settings
                      </a>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <UserPlus className="size-4" />
                        Invite client
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSite(site.id)}
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-red-200 hover:bg-red-500/10"
                      >
                        <Trash2 className="size-4" />
                        Delete site
                      </button>
                    </div>
                  </details>
                </div>

                <button
                  type="button"
                  onClick={() => openEditor(site.id)}
                  className="mt-4 h-10 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="mb-3 size-6" />
            <span className="text-sm font-medium">New Site</span>
          </button>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form onSubmit={createSite} className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Create new site</h2>
                <p className="mt-1 text-sm text-muted-foreground">Each site opens in its own editor.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Site name</span>
                <input
                  value={siteName}
                  onChange={(event) => {
                    setSiteName(event.target.value);
                    setSiteSlug((current) => current || makeSlug(event.target.value));
                  }}
                  required
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
                />
              </label>

              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Slug</span>
                <input
                  value={siteSlug}
                  onChange={(event) => setSiteSlug(makeSlug(event.target.value))}
                  required
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
                />
              </label>

              {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

              <button
                type="submit"
                disabled={isCreating}
                className="h-11 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? 'Creating...' : 'Create and open editor'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
