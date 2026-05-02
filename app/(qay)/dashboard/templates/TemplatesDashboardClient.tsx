'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Code2, ExternalLink, LayoutTemplate, Plus } from 'lucide-react';
import ImportHtmlDialog from '@/app/(builder)/ycode/components/ImportHtmlDialog';
import { QayLogo } from '@/qay/components/QayLogo';
import type { QaySite } from '@/qay/types';

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

type Props = {
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

export function TemplatesDashboardClient({ initialSites, userEmail }: Props) {
  const router = useRouter();
  const [sites, setSites] = useState(initialSites);
  const [selectedSiteId, setSelectedSiteId] = useState(initialSites[0]?.id ?? '');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? null;
  const initials = (userEmail || 'QAY').slice(0, 2).toUpperCase();

  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/templates');
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Failed to load templates');
        }

        setTemplates(payload.templates ?? []);
        setCategories(payload.categories ?? []);
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

  async function applyTemplate(template: Template, siteId: string) {
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

      router.push(`/dashboard/sites/${siteId}/editor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply template');
    } finally {
      setIsApplying(false);
      setSelectedTemplate(null);
    }
  }

  function handleUseTemplate(template: Template) {
    setNotice(null);
    setError(null);

    if (!selectedSiteId) {
      setSelectedTemplate(template);
      setIsCreateOpen(true);
      setNotice('Create a site first, then QAY will apply this template to it.');
      return;
    }

    setSelectedTemplate(template);
  }

  async function createSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsApplying(true);
    setError(null);

    try {
      const response = await fetch('/api/qay/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: siteName, slug: siteSlug || siteName }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create site');
      }

      const site = payload.data as QaySite;
      setSites((current) => [site, ...current]);
      setSelectedSiteId(site.id);
      setIsCreateOpen(false);
      setSiteName('');
      setSiteSlug('');

      if (selectedTemplate) {
        await applyTemplate(selectedTemplate, site.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create site');
      setIsApplying(false);
    }
  }

  function handleImportHtml(html: string) {
    if (!selectedSite) {
      setNotice('Create or select a site before importing HTML.');
      setIsCreateOpen(true);
      return;
    }

    window.localStorage.setItem(
      `qay:pending-html-import:${selectedSite.id}`,
      JSON.stringify({ html, createdAt: new Date().toISOString() })
    );
    setNotice(`HTML is saved for ${selectedSite.name}. Open the editor and import it into the layer you choose.`);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <QayLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden h-10 items-center rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Dashboard
            </Link>
            <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/80">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Templates</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Start a QAY site from a template or keep HTML ready for import into the editor.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={selectedSiteId}
              onChange={(event) => setSelectedSiteId(event.target.value)}
              className="h-10 min-w-56 rounded-md border border-white/15 bg-black px-3 text-sm text-white outline-none focus:border-white"
            >
              <option value="">Select site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              <Plus className="size-4" />
              New site
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

        {(notice || error) && (
          <div className={`mt-5 rounded-md border px-4 py-3 text-sm ${
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
        ) : filteredTemplates.length === 0 ? (
          <div className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-center">
            <LayoutTemplate className="size-8 text-white/35" />
            <p className="mt-3 text-sm text-white/60">No templates found in this category.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <article key={template.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[72/85] overflow-hidden bg-white/[0.04]">
                  {template.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={template.preview} alt="" className="h-full w-full object-cover object-top" />
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
                    Use this
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedTemplate && !isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#101010] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold tracking-normal">Apply {selectedTemplate.name}</h2>
            <p className="mt-2 text-sm text-white/55">
              This will apply the template to {selectedSite?.name ?? 'the selected site'} and open its editor.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                disabled={isApplying}
                className="h-10 rounded-md border border-white/10 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => selectedSiteId && applyTemplate(selectedTemplate, selectedSiteId)}
                disabled={isApplying || !selectedSiteId}
                className="h-10 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form onSubmit={createSite} className="w-full max-w-md rounded-lg border border-white/10 bg-[#101010] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Create site</h2>
                <p className="mt-1 text-sm text-white/55">
                  {selectedTemplate ? `QAY will apply ${selectedTemplate.name} after creation.` : 'Create a site for templates or HTML imports.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-white/50 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm text-white/75">
                <span>Site name</span>
                <input
                  value={siteName}
                  onChange={(event) => {
                    setSiteName(event.target.value);
                    setSiteSlug((current) => current || makeSlug(event.target.value));
                  }}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>
              <label className="block space-y-2 text-sm text-white/75">
                <span>Slug</span>
                <input
                  value={siteSlug}
                  onChange={(event) => setSiteSlug(makeSlug(event.target.value))}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>
              <button
                type="submit"
                disabled={isApplying}
                className="h-11 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? 'Creating...' : selectedTemplate ? 'Create and apply' : 'Create site'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ImportHtmlDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportHtml}
      />
    </main>
  );
}
