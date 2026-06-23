'use client';

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft, Code2, ExternalLink, Home, LayoutTemplate, Plus, Search, Settings, Sparkles } from 'lucide-react';
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
  preview_url?: string | null;
  thumbnail_url?: string | null;
  source_label?: string | null;
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
  context?: 'dashboard' | 'editor';
  showSourceTemplates?: boolean;
};

const SITE_TYPE_FILTERS = [
  { id: 'ecommerce', name: 'Ecommerce', keywords: ['ecommerce', 'shop', 'store', 'commerce', 'product', 'fashion', 'boutique'] },
  { id: 'restaurant', name: 'Restaurant', keywords: ['restaurant', 'cafe', 'food', 'menu', 'dining', 'bar'] },
  { id: 'hotel', name: 'Hotel', keywords: ['hotel', 'resort', 'booking', 'hospitality', 'suite'] },
  { id: 'real-estate', name: 'Real estate', keywords: ['real estate', 'property', 'listing', 'realty', 'home', 'apartment'] },
  { id: 'medical', name: 'Medical', keywords: ['medical', 'clinic', 'health', 'wellness', 'doctor', 'therapy'] },
  { id: 'law', name: 'Law', keywords: ['law', 'legal', 'attorney', 'lawyer', 'firm'] },
  { id: 'portfolio', name: 'Portfolio', keywords: ['portfolio', 'designer', 'photographer', 'artist', 'creative'] },
  { id: 'agency', name: 'Agency', keywords: ['agency', 'studio', 'consulting', 'marketing', 'branding'] },
  { id: 'saas', name: 'SaaS', keywords: ['saas', 'software', 'startup', 'app', 'platform'] },
  { id: 'education', name: 'Education', keywords: ['education', 'school', 'course', 'academy', 'learning'] },
  { id: 'event', name: 'Event', keywords: ['event', 'conference', 'wedding', 'festival', 'concert'] },
  { id: 'blog', name: 'Blog', keywords: ['blog', 'magazine', 'newsletter', 'editorial'] },
];

function templateMatchesSiteType(template: Template, categoryName: string, siteTypeId: string) {
  const filter = SITE_TYPE_FILTERS.find((item) => item.id === siteTypeId);
  if (!filter) return false;

  const haystack = `${template.name} ${template.description} ${categoryName}`.toLowerCase();
  return filter.keywords.some((keyword) => haystack.includes(keyword));
}

function getTemplateSourceLabel(template: Pick<Template, 'id' | 'name'>) {
  return `${template.id} ${template.name}`.toLowerCase().includes('qay') ? 'Made by QAY' : 'Made from Ycode';
}

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

export function TemplatesDashboardClient({ profile, context = 'dashboard', showSourceTemplates = false }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [communityTemplates, setCommunityTemplates] = useState<UserTemplate[]>([]);
  const [userTemplateCounts, setUserTemplateCounts] = useState<UserTemplateCounts>({ total: 0, pending: 0, approved: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedUserTemplate, setSelectedUserTemplate] = useState<UserTemplate | null>(null);
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoading(true);
        setError(null);
        const [userTemplateResponse, sourceTemplateResponse] = await Promise.all([
          fetch('/api/qay/templates/user', { cache: 'no-store' }),
          showSourceTemplates ? fetch('/api/templates', { cache: 'no-store' }) : Promise.resolve(null),
        ]);

        const nextCategories: Category[] = [];

        if (sourceTemplateResponse?.ok) {
          const sourcePayload = await sourceTemplateResponse.json();
          setTemplates(sourcePayload.templates ?? []);
          nextCategories.push(...(sourcePayload.categories ?? []));
        } else {
          setTemplates([]);
        }

        if (userTemplateResponse.ok) {
          const userTemplatePayload = await userTemplateResponse.json();
          const ownTemplates = userTemplatePayload.data?.templates ?? [];
          const sharedTemplates = userTemplatePayload.data?.communityTemplates ?? [];
          setUserTemplates(ownTemplates);
          setCommunityTemplates(sharedTemplates);
          setUserTemplateCounts(userTemplatePayload.data?.counts ?? { total: 0, pending: 0, approved: 0 });
          const categoryNames = Array.from(new Set<string>(
            [...ownTemplates, ...sharedTemplates]
              .map((template: UserTemplate) => template.category)
              .filter((name): name is string => Boolean(name))
          ));
          nextCategories.push(...categoryNames.map((name) => ({ id: name, name })));
        }

        const dedupedCategories = new Map<string, Category>();
        for (const category of nextCategories) {
          const key = category.id || category.name;
          if (!dedupedCategories.has(key)) {
            dedupedCategories.set(key, category);
          }
        }
        setCategories(Array.from(dedupedCategories.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplates();
  }, [showSourceTemplates]);

  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (selectedCategory !== 'all') {
      if (selectedCategory.startsWith('site:')) {
        const siteTypeId = selectedCategory.replace('site:', '');
        const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
        result = templates.filter((template) => templateMatchesSiteType(
          template,
          template.categoryId ? categoryNameById.get(template.categoryId) || '' : '',
          siteTypeId
        ));
      } else {
        result = templates.filter((template) => template.categoryId === selectedCategory);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
    }
    return result;
  }, [categories, selectedCategory, templates, searchQuery]);

  const filteredUserTemplates = useMemo(() => {
    let result = userTemplates;
    if (selectedCategory !== 'all') {
      if (selectedCategory.startsWith('site:')) {
        const siteTypeId = selectedCategory.replace('site:', '');
        const filter = SITE_TYPE_FILTERS.find((item) => item.id === siteTypeId);
        if (filter) {
          result = result.filter((template) => {
            const haystack = `${template.name} ${template.description || ''} ${template.category || ''}`.toLowerCase();
            return filter.keywords.some((keyword) => haystack.includes(keyword));
          });
        }
      } else {
        const cat = categories.find((c) => c.id === selectedCategory);
        if (cat) {
          result = result.filter((template) => template.category.toLowerCase() === cat.name.toLowerCase());
        }
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
    }
    return result;
  }, [userTemplates, selectedCategory, searchQuery, categories]);

  const filteredCommunityTemplates = useMemo(() => {
    let result = communityTemplates;
    if (selectedCategory !== 'all') {
      if (selectedCategory.startsWith('site:')) {
        const siteTypeId = selectedCategory.replace('site:', '');
        const filter = SITE_TYPE_FILTERS.find((item) => item.id === siteTypeId);
        if (filter) {
          result = result.filter((template) => {
            const haystack = `${template.name} ${template.description || ''} ${template.category || ''}`.toLowerCase();
            return filter.keywords.some((keyword) => haystack.includes(keyword));
          });
        }
      } else {
        const cat = categories.find((c) => c.id === selectedCategory);
        if (cat) {
          result = result.filter((template) => template.category.toLowerCase() === cat.name.toLowerCase());
        }
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
    }
    return result;
  }, [communityTemplates, selectedCategory, searchQuery, categories]);

  const categoryTabs = useMemo(() => {
    const preferred = [
      'Ecommerce',
      'Shop',
      'Store',
      'Restaurant',
      'Hotel',
      'Real Estate',
      'Law',
      'Legal',
      'Medical',
      'Health',
      'Portfolio',
      'Agency',
      'Business',
      'SaaS',
      'Startup',
      'Education',
      'Event',
      'Blog',
      'Landing',
    ];
    const known = categories.filter((category) =>
      preferred.some((name) => category.name.toLowerCase().includes(name.toLowerCase()))
    );
    const rest = categories.filter((category) => !known.some((item) => item.id === category.id));
    const categoryNameSet = new Set(categories.map((category) => category.name.toLowerCase()));
    const siteTypeTabs = SITE_TYPE_FILTERS
      .filter((filter) => !categoryNameSet.has(filter.name.toLowerCase()))
      .map((filter) => ({ id: `site:${filter.id}`, name: filter.name }));

    return [{ id: 'all', name: 'All' }, ...siteTypeTabs, ...known, ...rest];
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
      setSelectedUserTemplate(null);
    }
  }

  function handleUseUserTemplate(template: UserTemplate) {
    setError(null);
    setNotice(null);
    setSelectedTemplate(null);
    setSelectedUserTemplate(template);
    setSiteName(template.name);
    setCreationMode('blank');
    setIsCreateOpen(true);
    setNotice('Create a new project from this template. It will appear in your dashboard.');
  }

  function handleUseTemplate(template: Template) {
    setNotice(null);
    setError(null);
    setSelectedTemplate(template);
    setSelectedUserTemplate(null);
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
        body: JSON.stringify({ name: siteName, skipDefaultPages: Boolean(selectedTemplate || selectedUserTemplate || creationMode === 'ai') }),
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
      } else if (selectedUserTemplate) {
        await applyUserTemplate(selectedUserTemplate, site.id, `/dashboard/sites/${site.id}/editor`);
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

  const isEditorContext = context === 'editor';
  const homeHref = isEditorContext ? '/qay/editor' : '/dashboard';
  const templatesHref = isEditorContext ? '/qay/editor/settings/templates' : '/dashboard/templates';
  const settingsHref = isEditorContext ? '/qay/editor/settings' : '/dashboard/settings';
  const headerKicker = isEditorContext ? 'QAY Editor' : 'QAY Studio';
  const backLabel = isEditorContext ? 'Editor' : 'Dashboard';
  const introCopy = isEditorContext
    ? showSourceTemplates
      ? 'Saved templates and admin source templates stay available here, ready to reuse in this editor.'
      : 'Saved QAY templates stay available here, ready to reuse in this editor.'
    : showSourceTemplates
      ? 'Clone submitted templates, review source templates, or import pasted HTML into a new QAY project.'
      : 'Clone a submitted template or import pasted HTML into a new QAY project.';

  return (
    <main className="min-h-screen bg-black text-white">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center border-r border-white/10 bg-black/40 px-3 py-4 shadow-sm backdrop-blur">
        <a
          href={homeHref} aria-label={backLabel}
          className="mb-6 flex size-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        >
          <div className="scale-75">
            <QayLogo />
          </div>
        </a>
        <nav className="flex flex-1 flex-col items-center gap-2">
          <DashboardNavItem href={homeHref} label={backLabel}>
            <Home className="size-5" />
          </DashboardNavItem>
          <DashboardNavItem
            href={templatesHref} label="Templates"
            active
          >
            <LayoutTemplate className="size-5" />
          </DashboardNavItem>
          <DashboardNavItem href={settingsHref} label="Settings">
            <Settings className="size-5" />
          </DashboardNavItem>
        </nav>
        <AccountAvatar profile={profile} className="size-11 border-white/10 bg-white/5 text-white/80" />
      </aside>

      <div className="pl-20">
      <header className="border-b border-white/10 bg-black/40">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/45">{headerKicker}</p>
            <h1 className="text-lg font-semibold tracking-normal">Templates</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={homeHref}
              className="hidden h-10 items-center rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              {backLabel}
            </a>
          </div>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <a href={homeHref} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
          <ArrowLeft className="size-4" />
          {backLabel}
        </a>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Templates</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              {introCopy}
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

            <div className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-2">
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

        <div className="mt-5 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search templates by name..."
              className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
            />
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
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
            {(filteredUserTemplates.length > 0 || filteredCommunityTemplates.length > 0) && (
              <div className="mt-8 space-y-8">
                {filteredUserTemplates.length > 0 && (
                  <section>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold tracking-normal">My templates</h2>
                        <p className="mt-1 text-sm text-white/45">Templates you saved from your sites.</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredUserTemplates.map((template) => (
                        <article key={template.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                          <div className="relative aspect-[72/48] overflow-hidden bg-white/[0.04]">
                            {template.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={template.thumbnail_url}
                                alt=""
                                className="h-full w-full object-cover object-top"
                              />
                            ) : template.preview_url ? (
                              <iframe
                                title={`${template.name} preview`}
                                src={template.preview_url}
                                loading="lazy"
                                tabIndex={-1}
                                sandbox="allow-same-origin allow-scripts allow-forms"
                                className="pointer-events-none absolute left-0 top-0 h-[222%] w-[222%] origin-top-left scale-[0.45] bg-white"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white/20">
                                {template.name.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="p-4">
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
                          {template.preview_url && (
                            <a
                              href={template.preview_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                            >
                              <ExternalLink className="size-4" />
                              Open template
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleUseUserTemplate(template)}
                            disabled={isApplying}
                            className="mt-3 h-10 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Create project
                          </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {filteredCommunityTemplates.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold tracking-normal">Community</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCommunityTemplates.map((template) => (
                        <article key={template.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                          <div className="relative aspect-[72/48] overflow-hidden bg-white/[0.04]">
                            {template.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={template.thumbnail_url}
                                alt=""
                                className="h-full w-full object-cover object-top"
                              />
                            ) : template.preview_url ? (
                              <iframe
                                title={`${template.name} preview`}
                                src={template.preview_url}
                                loading="lazy"
                                tabIndex={-1}
                                sandbox="allow-same-origin allow-scripts allow-forms"
                                className="pointer-events-none absolute left-0 top-0 h-[222%] w-[222%] origin-top-left scale-[0.45] bg-white"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white/20">
                                {template.name.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                          <p className="text-xs uppercase tracking-wide text-white/35">{template.category}</p>
                          <h3 className="mt-1 text-base font-medium">{template.name}</h3>
                          <p className="mt-3 line-clamp-2 text-sm text-white/50">{template.description || 'Reusable QAY template.'}</p>
                          {template.preview_url && (
                            <a
                              href={template.preview_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                            >
                              <ExternalLink className="size-4" />
                              Open template
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleUseUserTemplate(template)}
                            disabled={isApplying}
                            className="mt-3 h-10 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Create project
                          </button>
                          </div>
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
                          <a href="/" className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/45 transition hover:border-white/20 hover:text-white">
                            {getTemplateSourceLabel(template)} · QAY
                          </a>
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
            ) : filteredUserTemplates.length === 0 && filteredCommunityTemplates.length === 0 ? (
              <div className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-center">
                <LayoutTemplate className="size-8 text-white/35" />
                <p className="mt-3 text-sm text-white/60">
                  {searchQuery ? 'No templates found matching filters.' : 'No templates yet. Create your own or import a site to get started.'}
                </p>
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
                  {selectedTemplate || selectedUserTemplate ? 'Create project from template' : creationMode === 'ai' ? 'Build with AI' : 'Create site'}
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  {selectedTemplate || selectedUserTemplate
                    ? `We'll start a fresh site from ${(selectedTemplate || selectedUserTemplate)?.name}.`
                    : creationMode === 'ai'
                      ? 'Describe the site and QAY will draft the first page.'
                      : 'Create a new site for your import.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setSelectedTemplate(null);
                  setSelectedUserTemplate(null);
                  setCreationMode('blank');
                  setNotice(null);
                }}
                className="rounded-md px-2 py-1 text-sm text-white/50 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {!selectedTemplate && !selectedUserTemplate && (
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
              {creationMode === 'ai' && !selectedTemplate && !selectedUserTemplate && (
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
                {isApplying ? (creationMode === 'ai' ? 'Building...' : 'Creating...') : selectedTemplate || selectedUserTemplate ? 'Create project' : creationMode === 'ai' ? 'Build and open editor' : 'Create site'}
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
