'use client';

import { FormEvent, useState, type ReactNode } from 'react';
import { Bell, ExternalLink, Grid2X2, Home, LayoutTemplate, List, MoreVertical, Plus, Settings, Sparkles, Trash2, UserPlus } from 'lucide-react';
import { QayLogo } from '@/qay/components/QayLogo';
import { QayThemeToggle } from '@/qay/components/QayThemeToggle';
import type { QaySite } from '@/qay/types';
import type { ClientPendingInvite } from '@/qay/lib/client-content';
import { PendingInvites } from '@/qay/components/client/PendingInvites';
import type { QayAccountProfile } from '@/qay/lib/account';
import { AccountAvatar } from '@/qay/components/account/AccountAvatar';

type DashboardProps = {
  initialSites: QaySite[];
  profile: QayAccountProfile;
  pendingInvites?: ClientPendingInvite[];
};

function DashboardNavItem({
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

export function DeveloperDashboard({ initialSites, profile, pendingInvites = [] }: DashboardProps) {
  const [sites, setSites] = useState(initialSites);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'blank' | 'ai'>('blank');
  const [siteName, setSiteName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [creationStatus, setCreationStatus] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openEditor(siteId: string) {
    window.location.assign(`/dashboard/sites/${siteId}/editor`);
  }

  async function createSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError(null);
    setCreationStatus(creationMode === 'ai' ? 'Creating site...' : '');

    try {
      const prompt = aiPrompt.trim();

      if (creationMode === 'ai' && !prompt) {
        setError('Describe the site you want QAY to build.');
        return;
      }

      const response = await fetch('/api/qay/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: siteName }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to create site');
        return;
      }

      if (creationMode === 'ai') {
        setCreationStatus('Building with AI...');
        const aiResponse = await fetch('/api/qay/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, mode: 'page' }),
        });
        const aiPayload = await aiResponse.json();

        if (!aiResponse.ok || !aiPayload.data?.layers) {
          setError(aiPayload.error || 'We could not build this site.');
          return;
        }

        setCreationStatus('Preparing editor...');
        const applyResponse = await fetch(`/api/qay/ai/sites/${payload.data.id}/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layers: aiPayload.data.layers }),
        });
        const applyPayload = await applyResponse.json();

        if (!applyResponse.ok) {
          setError(applyPayload.error || 'The site was created, but the design could not be applied.');
          return;
        }
      }

      window.location.assign(`/dashboard/sites/${payload.data.id}/editor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create site');
    } finally {
      setIsCreating(false);
      setCreationStatus('');
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
          <DashboardNavItem
            href="/dashboard" label="Sites"
            active
          >
            <Home className="size-5" />
          </DashboardNavItem>
          <DashboardNavItem href="/dashboard/templates" label="Templates">
            <LayoutTemplate className="size-5" />
          </DashboardNavItem>
          <DashboardNavItem href="/dashboard/settings" label="Settings">
            <Settings className="size-5" />
          </DashboardNavItem>
        </nav>
        <AccountAvatar profile={profile} className="size-11" />
      </aside>

      <div className="pl-20">
      <header className="border-b border-border bg-card/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">QAY Studio</p>
            <h1 className="text-lg font-semibold tracking-normal">Dashboard</h1>
          </div>
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
              onClick={() => {
                setCreationMode('ai');
                setIsModalOpen(true);
              }}
              className="hidden h-10 items-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground sm:inline-flex"
            >
              <Sparkles className="size-4" />
              Build with AI
            </button>
            <button
              type="button"
              onClick={() => {
                setCreationMode('blank');
                setIsModalOpen(true);
              }}
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
          </div>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
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

        {pendingInvites.length > 0 && (
          <div className="mt-8">
            <PendingInvites invites={pendingInvites} />
          </div>
        )}

        <div className={view === 'grid' ? 'mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'mt-8 space-y-3'}>
          {sites.map((site) => (
            <article
              key={site.id}
              className={view === 'grid'
                ? 'rounded-lg border border-border bg-card p-4'
                : 'flex items-center gap-4 rounded-lg border border-border bg-card p-4'}
            >
              <div
                className={view === 'grid'
                  ? 'flex aspect-video items-center justify-center rounded-md border border-border bg-muted'
                  : 'flex h-20 w-32 shrink-0 items-center justify-center rounded-md border border-border bg-muted'}
              >
                {site.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={site.thumbnail_url} alt=""
                    className="h-full w-full rounded-md object-cover"
                  />
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
            onClick={() => {
              setCreationMode('blank');
              setIsModalOpen(true);
            }}
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
                <h2 className="text-xl font-semibold tracking-normal">
                  {creationMode === 'ai' ? 'Build with AI' : 'Create new site'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {creationMode === 'ai' ? 'Describe the site and we’ll draft the first page.' : 'Start with a blank site and customize it your way.'}
                </p>
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
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setCreationMode('blank')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${creationMode === 'blank' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Blank
                </button>
                <button
                  type="button"
                  onClick={() => setCreationMode('ai')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${creationMode === 'ai' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  AI
                </button>
              </div>

              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Site name</span>
                <input
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
                />
              </label>

              {creationMode === 'ai' && (
                <label className="block space-y-2 text-sm text-muted-foreground">
                  <span>What should we build?</span>
                  <textarea
                    value={aiPrompt}
                    onChange={(event) => setAiPrompt(event.target.value)}
                    required={creationMode === 'ai'}
                    rows={5}
                    placeholder="A premium landing page for a fitness coach with booking, testimonials, pricing, and a bold hero..."
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus:border-ring"
                  />
                </label>
              )}

              <p className="text-sm text-muted-foreground">
                {creationMode === 'ai' ? 'You can refine the layout and content after the first draft is ready.' : 'A short site URL will be created automatically.'}
              </p>

              {creationStatus && <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">{creationStatus}</p>}

              {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

              <button
                type="submit"
                disabled={isCreating}
                className="h-11 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? (creationMode === 'ai' ? 'Building...' : 'Creating...') : creationMode === 'ai' ? 'Build and open editor' : 'Create and open editor'}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </main>
  );
}
