'use client';

import { FormEvent, useState, type ReactNode } from 'react';
import { BarChart3, Bell, Code2, ExternalLink, Grid2X2, Home, LayoutTemplate, Link2, List, MoreVertical, Plus, Settings, Sparkles, Trash2, UserPlus } from 'lucide-react';
import ImportHtmlDialog from '@/app/(builder)/ycode/components/ImportHtmlDialog';
import { QayLogo } from '@/qay/components/QayLogo';
import { QayThemeToggle } from '@/qay/components/QayThemeToggle';
import type { QaySite } from '@/qay/types';
import type { ClientPendingInvite } from '@/qay/lib/client-content';
import { PendingInvites } from '@/qay/components/client/PendingInvites';
import type { QayAccountProfile } from '@/qay/lib/account';
import { AccountAvatar } from '@/qay/components/account/AccountAvatar';
import { PlanRestrictionDialog } from '@/qay/components/billing/PlanRestrictionDialog';
import { htmlToPageImports } from '@/lib/html-layer-converter';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

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
      className={`group/navitem flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl border px-3 transition ${
        active
          ? 'border-foreground/15 bg-foreground text-background shadow-sm'
          : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">{children}</span>
      <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-150 group-hover/navitem:opacity-100">
        {label}
      </span>
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

function SitePreviewFrame({
  site,
  view,
}: {
  site: QaySite;
  view: 'grid' | 'list';
}) {
  return (
    <div
      className={view === 'grid'
        ? 'relative flex aspect-video overflow-hidden rounded-md border border-border bg-muted'
        : 'relative flex h-20 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-muted'}
    >
      <iframe
        title={`${site.name} preview`}
        src={`/dashboard/sites/${site.id}/preview-frame`}
        loading="lazy"
        tabIndex={-1}
        sandbox="allow-same-origin allow-scripts allow-forms"
        className="pointer-events-none h-full w-full bg-background"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/30 to-transparent" />
    </div>
  );
}

export function DeveloperDashboard({ initialSites, profile, pendingInvites = [] }: DashboardProps) {
  const [sites, setSites] = useState(initialSites);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'blank' | 'ai'>('blank');
  const [siteName, setSiteName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImportNameOpen, setIsImportNameOpen] = useState(false);
  const [importSiteName, setImportSiteName] = useState('');
  const [pendingImportHtml, setPendingImportHtml] = useState('');
  const [creationStatus, setCreationStatus] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restriction, setRestriction] = useState<{ title: string; message: string } | null>(null);
  const [demoStatus, setDemoStatus] = useState<string | null>(null);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sitesToDelete, setSitesToDelete] = useState<string[]>([]);

  function toggleSiteSelection(siteId: string) {
    setSelectedSiteIds((current) =>
      current.includes(siteId)
        ? current.filter((id) => id !== siteId)
        : [...current, siteId]
    );
  }

  function selectAllSites() {
    setSelectedSiteIds(sites.map((s) => s.id));
  }

  function clearSelection() {
    setSelectedSiteIds([]);
  }

  function requestDeleteSite(siteId: string) {
    setSitesToDelete([siteId]);
    setDeleteConfirmOpen(true);
  }

  function requestDeleteSelectedSites() {
    if (selectedSiteIds.length === 0) return;
    setSitesToDelete(selectedSiteIds);
    setDeleteConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (sitesToDelete.length === 0) return;

    const previousSites = sites;
    const idsToDelete = [...sitesToDelete];

    // Optimistically remove from state
    setSites((current) => current.filter((site) => !idsToDelete.includes(site.id)));
    // Clear selections if deleted
    setSelectedSiteIds((current) => current.filter((id) => !idsToDelete.includes(id)));

    try {
      const results = await Promise.all(
        idsToDelete.map(async (siteId) => {
          const response = await fetch(`/api/qay/sites/${siteId}`, { method: 'DELETE' });
          const payload = await response.json().catch(() => null);
          return { siteId, ok: response.ok, error: payload?.error || 'Unable to delete site' };
        })
      );

      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        // Re-add failed ones to state
        const failedIds = failed.map((f) => f.siteId);
        const failedSites = previousSites.filter((site) => failedIds.includes(site.id));
        setSites((current) => {
          const unique = new Map();
          [...current, ...failedSites].forEach((s) => unique.set(s.id, s));
          return Array.from(unique.values());
        });
        toast.error(`Failed to delete ${failed.length} site(s): ` + failed.map((f) => f.error).join(', '));
      } else {
        toast.success(`Successfully deleted ${idsToDelete.length} site(s).`);
      }
    } catch (err) {
      setSites(previousSites);
      toast.error(err instanceof Error ? err.message : 'Unable to delete site(s)');
    } finally {
      setSitesToDelete([]);
    }
  }

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
        body: JSON.stringify({ name: siteName, skipDefaultPages: creationMode === 'ai' }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload.code === 'SITE_LIMIT_REACHED') {
          setRestriction({
            title: 'Site limit reached',
            message: payload.error || 'Your current plan cannot create more sites. Upgrade to continue.',
          });
          setIsModalOpen(false);
          return;
        }
        setError(payload.error || 'Unable to create site');
        return;
      }

      if (creationMode === 'ai') {
        setCreationStatus('Building with AI...');
        const aiResponse = await fetch('/api/qay/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, mode: 'page', output: 'html' }),
        });
        const aiPayload = await aiResponse.json();
        const generatedPages = aiPayload.data?.html
          ? htmlToPageImports(aiPayload.data.html, 'Homepage')
          : aiPayload.data?.layers
            ? [{ name: 'Homepage', layers: aiPayload.data.layers }]
            : [];

        if (!aiResponse.ok || generatedPages.length === 0) {
          setError(aiPayload.details || aiPayload.error || 'We could not build this site.');
          return;
        }

        setCreationStatus('Preparing editor...');
        const applyResponse = await fetch(`/api/qay/sites/${payload.data.id}/import-html`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pages: generatedPages, pageName: generatedPages[0]?.name || 'Homepage' }),
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

  function handleImportHtml(html: string, options?: { pageName?: string }) {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const importedName = options?.pageName || titleMatch?.[1]?.replace(/\s+/g, ' ').trim() || 'Imported site';
    setPendingImportHtml(html);
    setImportSiteName(importedName);
    setError(null);
    setIsImportNameOpen(true);
  }

  async function importHtmlIntoNewSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError(null);
    setCreationStatus('Importing site...');

    try {
      const importedName = importSiteName.trim() || 'Imported site';
      const pages = htmlToPageImports(pendingImportHtml, 'Homepage');

      if (pages.length === 0) {
        throw new Error('No valid HTML elements found');
      }

      const siteResponse = await fetch('/api/qay/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: importedName, skipDefaultPages: true }),
      });
      const sitePayload = await siteResponse.json();

      if (!siteResponse.ok) {
        if (sitePayload.code === 'SITE_LIMIT_REACHED') {
          setRestriction({
            title: 'Site limit reached',
            message: sitePayload.error || 'Your current plan cannot create more sites. Upgrade to continue.',
          });
          setIsImportNameOpen(false);
          return;
        }
        throw new Error(sitePayload.error || 'Unable to create site for import');
      }

      const site = sitePayload.data as QaySite;
      const response = await fetch(`/api/qay/sites/${site.id}/import-html`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages, pageName: pages[0]?.name || 'Homepage' }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to import HTML');
      }

      setIsImportNameOpen(false);
      setPendingImportHtml('');
      setImportSiteName('');
      window.location.assign(`/dashboard/sites/${site.id}/editor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import HTML');
    } finally {
      setIsCreating(false);
      setCreationStatus('');
    }
  }

  function deleteSite(siteId: string) {
    requestDeleteSite(siteId);
  }

  async function createDemoLink(siteId: string) {
    setDemoStatus(null);

    try {
      const response = await fetch(`/api/qay/sites/${siteId}/demo-links`, { method: 'POST' });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (payload?.code === 'DEMO_LINK_LIMIT_REACHED') {
          setRestriction({
            title: 'Demo link limit reached',
            message: payload.error || 'Your plan cannot create more active demo links right now.',
          });
          return;
        }

        throw new Error(payload?.error || 'Unable to create demo link');
      }

      const url = payload?.data?.url;
      if (typeof url !== 'string' || !url) {
        throw new Error('Demo link was not returned');
      }

      await navigator.clipboard?.writeText(url);
      setDemoStatus('Demo link copied. Preview and demo visits are not counted in analytics.');
    } catch (err) {
      setDemoStatus(err instanceof Error ? err.message : 'Unable to create demo link');
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <aside className="group fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-start border-r border-border bg-card/95 px-3 py-4 shadow-sm backdrop-blur transition-[width] duration-200 hover:w-56">
        <a
          href="/dashboard" aria-label="Dashboard"
          className="mb-6 flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-background px-3"
        >
          <div className="-ml-1 scale-75">
            <QayLogo />
          </div>
          <span className="whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            Dashboard
          </span>
        </a>
        <nav className="flex w-full flex-1 flex-col items-stretch gap-2">
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
        <AccountAvatar profile={profile} className="size-11 shrink-0" />
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
              onClick={() => setIsImportOpen(true)}
              className="hidden h-10 items-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground sm:inline-flex"
            >
              <Code2 className="size-4" />
              Import HTML
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

        {demoStatus && (
          <p className="mt-6 rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            {demoStatus}
          </p>
        )}

        <div className={view === 'grid' ? 'mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'mt-8 space-y-3'}>
          {sites.map((site) => (
            <article
              key={site.id}
              className={view === 'grid'
                ? 'relative group rounded-lg border border-border bg-card p-4'
                : 'flex items-center gap-4 rounded-lg border border-border bg-card p-4 group'}
            >
              {view === 'grid' ? (
                <div className={`absolute left-3 top-3 z-10 transition-opacity duration-200 ${selectedSiteIds.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSiteSelection(site.id);
                    }}
                    className={`flex size-6 items-center justify-center rounded-md border transition-all duration-200 ${
                      selectedSiteIds.includes(site.id)
                        ? 'border-foreground bg-foreground text-background scale-100 shadow-sm'
                        : 'border-border bg-card text-transparent hover:border-foreground/50 hover:scale-105'
                    }`}
                  >
                    {selectedSiteIds.includes(site.id) && (
                      <svg
                        className="size-3.5 stroke-[3]" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth="3" d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center shrink-0 pl-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSiteSelection(site.id);
                    }}
                    className={`flex size-6 items-center justify-center rounded-md border transition-all duration-200 ${
                      selectedSiteIds.includes(site.id)
                        ? 'border-foreground bg-foreground text-background scale-100 shadow-sm'
                        : 'border-border bg-card text-transparent hover:border-foreground/50 hover:scale-105'
                    }`}
                  >
                    {selectedSiteIds.includes(site.id) && (
                      <svg
                        className="size-3.5 stroke-[3]" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth="3" d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              )}
              <SitePreviewFrame site={site} view={view} />

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
                      <a
                        href={`/dashboard/sites/${site.id}/analytics`}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <BarChart3 className="size-4" />
                        Analytics
                      </a>
                      <button
                        type="button"
                        onClick={() => createDemoLink(site.id)}
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Link2 className="size-4" />
                        Copy demo link
                      </button>
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
      <ImportHtmlDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportHtml}
        mode="page"
      />

      {isImportNameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form onSubmit={importHtmlIntoNewSite} className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Name imported site</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your imported site will open as a fresh site.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportNameOpen(false);
                  setPendingImportHtml('');
                  setImportSiteName('');
                }}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Site name</span>
                <input
                  value={importSiteName}
                  onChange={(event) => setImportSiteName(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
                />
              </label>
              {creationStatus && <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">{creationStatus}</p>}
              {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
              <button
                type="submit"
                disabled={isCreating}
                className="h-11 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? 'Importing...' : 'Import and open editor'}
              </button>
            </div>
          </form>
        </div>
      )}
      <PlanRestrictionDialog
        open={Boolean(restriction)}
        onOpenChange={(open) => { if (!open) setRestriction(null); }}
        title={restriction?.title}
        message={restriction?.message}
      />

      {selectedSiteIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center gap-4 rounded-full border border-border bg-card/95 px-6 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out transform translate-y-0">
          <span className="text-xs font-semibold tracking-wide text-foreground/80">
            {selectedSiteIds.length} site{selectedSiteIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            onClick={selectedSiteIds.length === sites.length ? clearSelection : selectAllSites}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            {selectedSiteIds.length === sites.length ? 'Deselect all' : 'Select all'}
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            onClick={requestDeleteSelectedSites}
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 shadow-sm"
          >
            <Trash2 className="size-3.5" />
            Delete Selected
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-full border border-border px-3 py-2 text-xs font-bold transition hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={sitesToDelete.length === 1 ? 'Delete Site' : 'Delete Sites'}
        description={
          sitesToDelete.length === 1
            ? `Delete site "${sites.find((s) => s.id === sitesToDelete[0])?.name || 'this site'}"? This action cannot be undone.`
            : `Delete the ${sitesToDelete.length} selected sites? This action cannot be undone.`
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
      </div>
    </main>
  );
}
