'use client';

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft, Code2, ExternalLink, Home, LayoutTemplate, Plus, Settings, Sparkles } from 'lucide-react';
import ImportHtmlDialog from '@/app/(builder)/ycode/components/ImportHtmlDialog';
import { htmlToPageImports } from '@/lib/html-layer-converter';
import { QayLogo } from '@/qay/components/QayLogo';
import type { QaySite } from '@/qay/types';
import type { QayAccountProfile } from '@/qay/lib/account';
import { AccountAvatar } from '@/qay/components/account/AccountAvatar';
import { PlanRestrictionDialog } from '@/qay/components/billing/PlanRestrictionDialog';

type Template = {
  id: string;
  name: string;
  description: string;
  preview?: string;
  categoryId: string | null;
  livePreviewUrl: string | null;
};

type Category = {
  id: string;
  name: string;
  order?: number;
};

type UserTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'private' | 'pending_review' | 'approved' | 'rejected';
  pricing_mode: 'free' | 'paid';
  intended_price: number | string | null;
  paid_available: boolean;
  review_score?: number | null;
  review_notes?: string | null;
};

type UserTemplateCounts = {
  total: number;
  pending: number;
  approved: number;
};

type Props = {
  initialSites: QaySite[];
  profile: QayAccountProfile;
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
          ? 'border-white/15 bg-white text-black shadow-sm'
          : 'border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  );
}

export function TemplatesDashboardClient({ profile }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [communityTemplates, setCommunityTemplates] = useState<UserTemplate[]>([]);
  const [userTemplateCounts, setUserTemplateCounts] = useState<UserTemplateCounts>({ total: 0, pending: 0, approved: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImportNameOpen, setIsImportNameOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'blank' | 'ai'>('blank');
  const [siteName, setSiteName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [importSiteName, setImportSiteName] = useState('');
  const [pendingImportHtml, setPendingImportHtml] = useState('');
  const [creationStatus, setCreationStatus] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restriction, setRestriction] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoading(true);
        setError(null);
        const [templateResponse, userTemplateResponse] = await Promise.all([
          fetch('/api/templates'),
          fetch('/api/qay/templates/user', { cache: 'no-store' }),
        ]);
        const payload = await templateResponse.json();

        if (!templateResponse.ok) {
          throw new Error(payload.error || 'Failed to load templates');
        }

        setTemplates(payload.templates ?? []);
        setCategories(payload.categories ?? []);

        if (userTemplateResponse.ok) {
          const userTemplatePayload = await userTemplateResponse.json();
          setUserTemplates(userTemplatePayload.data?.templates ?? []);
          setCommunityTemplates(userTemplatePayload.data?.communityTemplates ?? []);
          setUserTemplateCounts(userTemplatePayload.data?.counts ?? { total: 0, pending: 0, approved: 0 });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') return templates;
    return templates.filter((template) => template.categoryId === selectedCategory);
  }, [selectedCategory, templates]);

  const categoryTabs = useMemo(() => {
    const preferred = ['Blog', 'Portfolio', 'Business', 'SaaS', 'Landing'];
    const known = categories.filter((category) =>
      preferred.some((name) => category.name.toLowerCase().includes(name.toLowerCase()))
    );
    const rest = categories.filter((category) => !known.some((item) => item.id === category.id));
    return [{ id: 'all', name: 'All' }, ...known, ...rest];
  }, [categories]);

  async function applyTemplate(template: Template, siteId: string, redirectTo = `/dashboard/sites/${siteId}/editor`) {
    setIsApplying(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/qay/templates/${template.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to apply template');
      }

      window.location.assign(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply template');
    } finally {
      setIsApplying(false);
      setSelectedTemplate(null);
    }
  }

  async function applyUserTemplate(template: UserTemplate, siteId: string, redirectTo = `/dashboard/sites/${siteId}/editor`) {
    setIsApplying(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/qay/templates/user/${template.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to apply template');
      }

      window.location.assign(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply template');
    } finally {
      setIsApplying(false);
    }
  }

  async function createSiteFromUserTemplate(template: UserTemplate) {
    setIsApplying(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch('/api/qay/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: template.name, skipDefaultPages: true }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload.code === 'SITE_LIMIT_REACHED') {
          setRestriction({
            title: 'Site limit reached',
            message: payload.error || 'Your current plan cannot create more sites. Upgrade to continue.',
          });
          setIsApplying(false);
          return;
        }
        throw new Error(payload.error || 'Unable to create site');
      }

      const site = payload.data as QaySite;
      await applyUserTemplate(template, site.id, `/dashboard/sites/${site.id}/editor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create site');
      setIsApplying(false);
    }
  }

  function handleUseTemplate(template: Template) {
    setNotice(null);
    setError(null);
    setSelectedTemplate(template);
    setSiteName(template.name);
    setCreationMode('blank');
    setIsCreateOpen(true);
    setNotice('Create a new project from this template. It will appear in your dashboard.');
  }

  async function createSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsApplying(true);
    setError(null);
    setCreationStatus(creationMode === 'ai' ? 'Creating site...' : '');

    try {
      const prompt = aiPrompt.trim();

      if (creationMode === 'ai' && !prompt) {
        setError('Describe the site you want QAY to build.');
        setIsApplying(false);
        return;
      }

      const response = await fetch('/api/qay/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: siteName, skipDefaultPages: Boolean(selectedTemplate || creationMode === 'ai') }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload.code === 'SITE_LIMIT_REACHED') {
          setRestriction({
            title: 'Site limit reached',
            message: payload.error || 'Your current plan cannot create more sites. Upgrade to continue.',
          });
          setIsCreateOpen(false);
          setIsApplying(false);
          return;
        }
        throw new Error(payload.error || 'Unable to create site');
      }

      const site = payload.data as QaySite;
      setIsCreateOpen(false);
      setSiteName('');

      if (selectedTemplate) {
        await applyTemplate(selectedTemplate, site.id, `/dashboard/sites/${site.id}/editor`);
      } else if (creationMode === 'ai') {
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
          setIsApplying(false);
          return;
        }

        setCreationStatus('Preparing editor...');
        const importResponse = await fetch(`/api/qay/sites/${site.id}/import-html`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pages: generatedPages, pageName: generatedPages[0]?.name || 'Homepage' }),
        });
        const importPayload = await importResponse.json();

        if (!importResponse.ok) {
          setError(importPayload.error || 'The site was created, but the design could not be applied.');
          setIsApplying(false);
          return;
        }

        setAiPrompt('');
        window.location.assign(`/dashboard/sites/${site.id}/editor`);
      } else {
        window.location.assign(`/dashboard/sites/${site.id}/editor`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create site');
      setIsApplying(false);
    } finally {
      setCreationStatus('');
    }
  }

  function handleImportHtml(html: string, options?: { pageName?: string }) {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const importedName = options?.pageName || titleMatch?.[1]?.replace(/\s+/g, ' ').trim() || 'Imported site';
    setPendingImportHtml(html);
    setImportSiteName(importedName);
    setError(null);
    setNotice(null);
    setIsImportNameOpen(true);
  }

  async function importHtmlIntoNewSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsApplying(true);
    setError(null);
    setNotice(null);

    try {
      const html = pendingImportHtml;
      const pages = htmlToPageImports(html, 'Homepage');

      if (pages.length === 0) {
        throw new Error('No valid HTML elements found');
      }

      const importedName = importSiteName.trim() || 'Imported site';
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
          setIsApplying(false);
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
      setIsApplying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center border-r border-white/10 bg-black/40 px-3 py-4 shadow-sm backdrop-blur">
        <a
          href="/dashboard" aria-label="Dashboard"
          className="mb-6 flex size-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        >
          <div className="scale-75">
            <QayLogo />
          </div>
        </a>
        <nav className="flex flex-1 flex-col items-center gap-2">
          <DashboardNavItem href="/dashboard" label="Sites">
            <Home className="size-5" />
          </DashboardNavItem>
          <DashboardNavItem
            href="/dashboard/templates" label="Templates"
            active
          >
            <LayoutTemplate className="size-5" />
          </DashboardNavItem>
          <DashboardNavItem href="/dashboard/settings" label="Settings">
            <Settings className="size-5" />
          </DashboardNavItem>
        </nav>
        <AccountAvatar profile={profile} className="size-11 border-white/10 bg-white/5 text-white/80" />
      </aside>

      <div className="pl-20">
      <header className="border-b border-white/10 bg-black/40">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/45">QAY Studio</p>
            <h1 className="text-lg font-semibold tracking-normal">Templates</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="hidden h-10 items-center rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
          <ArrowLeft className="size-4" />
          Dashboard
        </a>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Templates</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Clone a template or import pasted HTML into a new QAY project.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(null);
                setCreationMode('blank');
                setIsCreateOpen(true);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              <Plus className="size-4" />
              New site
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(null);
                setCreationMode('ai');
                setIsCreateOpen(true);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              <Sparkles className="size-4" />
              Build with AI
            </button>
            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Code2 className="size-4" />
              Import HTML
            </button>
          </div>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categoryTabs.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`h-9 shrink-0 rounded-md px-4 text-sm transition ${
                selectedCategory === category.id
                  ? 'bg-white text-black'
                  : 'border border-white/10 text-white/65 hover:bg-white/5 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-white/40">My templates</p>
            <p className="mt-1 text-2xl font-semibold">{userTemplateCounts.total}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-white/40">Pending review</p>
            <p className="mt-1 text-2xl font-semibold">{userTemplateCounts.pending}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-white/40">Approved</p>
            <p className="mt-1 text-2xl font-semibold">{userTemplateCounts.approved}</p>
          </div>
        </div>

        {(notice || error) && (
          <div
            className={`mt-5 rounded-md border px-4 py-3 text-sm ${
              error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-white/10 bg-white/[0.04] text-white/70'
            }`}
          >
            {error || notice}
          </div>
        )}

        {isLoading ? (
          <div className="mt-12 flex min-h-72 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm text-white/55">
            Loading templates...
          </div>
        ) : (
          <>
            {(userTemplates.length > 0 || communityTemplates.length > 0) && (
              <div className="mt-8 space-y-8">
                {userTemplates.length > 0 && (
                  <section>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold tracking-normal">My templates</h2>
                        <p className="mt-1 text-sm text-white/45">Templates you saved from your sites.</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {userTemplates.map((template) => (
                        <article key={template.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-white/35">{template.category}</p>
                              <h3 className="mt-1 text-base font-medium">{template.name}</h3>
                            </div>
                            <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/55">
                              {template.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="mt-3 line-clamp-2 text-sm text-white/50">{template.description || 'Reusable QAY template.'}</p>
                          {template.pricing_mode === 'paid' && (
                            <p className="mt-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/45">
                              Price saved for later. Paid template sales are not live yet.
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => createSiteFromUserTemplate(template)}
                            disabled={isApplying}
                            className="mt-4 h-10 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Create project
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {communityTemplates.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold tracking-normal">Community</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {communityTemplates.map((template) => (
                        <article key={template.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs uppercase tracking-wide text-white/35">{template.category}</p>
                          <h3 className="mt-1 text-base font-medium">{template.name}</h3>
                          <p className="mt-3 line-clamp-2 text-sm text-white/50">{template.description || 'Reusable QAY template.'}</p>
                          <button
                            type="button"
                            onClick={() => createSiteFromUserTemplate(template)}
                            disabled={isApplying}
                            className="mt-4 h-10 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Create project
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {filteredTemplates.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <article key={template.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                    <div className="relative aspect-[72/85] overflow-hidden bg-white/[0.04]">
                      {template.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={template.preview} alt=""
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white/20">
                          {template.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-medium">{template.name}</h2>
                          <p className="mt-1 line-clamp-2 text-sm text-white/50">{template.description}</p>
                        </div>
                        {template.livePreviewUrl && (
                          <a
                            href={template.livePreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Preview ${template.name}`}
                            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        disabled={isApplying}
                        className="mt-4 h-10 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Create project
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : userTemplates.length === 0 && communityTemplates.length === 0 ? (
              <div className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-center">
                <LayoutTemplate className="size-8 text-white/35" />
                <p className="mt-3 text-sm text-white/60">No templates yet. Create your own or import a site to get started.</p>
              </div>
            ) : null}
          </>
        )}
      </section>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form onSubmit={createSite} className="w-full max-w-md rounded-lg border border-white/10 bg-[#101010] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">
                  {selectedTemplate ? 'Create project from template' : creationMode === 'ai' ? 'Build with AI' : 'Create site'}
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  {selectedTemplate ? `We'll start a fresh site from ${selectedTemplate.name}.` : creationMode === 'ai' ? 'Describe the site and QAY will draft the first page.' : 'Create a new site for your import.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setSelectedTemplate(null);
                  setCreationMode('blank');
                  setNotice(null);
                }}
                className="rounded-md px-2 py-1 text-sm text-white/50 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {!selectedTemplate && (
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1">
                  <button
                    type="button"
                    onClick={() => setCreationMode('blank')}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${creationMode === 'blank' ? 'bg-white text-black shadow-sm' : 'text-white/55 hover:text-white'}`}
                  >
                    Blank
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreationMode('ai')}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${creationMode === 'ai' ? 'bg-white text-black shadow-sm' : 'text-white/55 hover:text-white'}`}
                  >
                    AI
                  </button>
                </div>
              )}

              <label className="block space-y-2 text-sm text-white/75">
                <span>Site name</span>
                <input
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>
              {creationMode === 'ai' && !selectedTemplate && (
                <label className="block space-y-2 text-sm text-white/75">
                  <span>What should we build?</span>
                  <textarea
                    value={aiPrompt}
                    onChange={(event) => setAiPrompt(event.target.value)}
                    required
                    rows={5}
                    placeholder="A premium portfolio for a full-stack developer with project cards, timeline, and contact section..."
                    className="w-full resize-none rounded-md border border-white/15 bg-black px-3 py-2 text-white outline-none transition focus:border-white"
                  />
                </label>
              )}
              <p className="text-sm text-white/55">A short site URL will be created automatically.</p>
              {creationStatus && (
                <p className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/55">{creationStatus}</p>
              )}
              <button
                type="submit"
                disabled={isApplying}
                className="h-11 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? (creationMode === 'ai' ? 'Building...' : 'Creating...') : selectedTemplate ? 'Create project' : creationMode === 'ai' ? 'Build and open editor' : 'Create site'}
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
          <form onSubmit={importHtmlIntoNewSite} className="w-full max-w-md rounded-lg border border-white/10 bg-[#101010] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Name imported site</h2>
                <p className="mt-1 text-sm text-white/55">Your imported site will open as a fresh site.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportNameOpen(false);
                  setPendingImportHtml('');
                  setImportSiteName('');
                }}
                className="rounded-md px-2 py-1 text-sm text-white/50 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm text-white/75">
                <span>Site name</span>
                <input
                  value={importSiteName}
                  onChange={(event) => setImportSiteName(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>
              <button
                type="submit"
                disabled={isApplying}
                className="h-11 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? 'Importing...' : 'Import and open editor'}
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
      </div>
    </main>
  );
}
