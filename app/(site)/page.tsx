import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { fetchHomepage, fetchErrorPage, splitPageData, reassemblePageData, slimPageData } from '@/lib/page-fetcher';
import type { PageData } from '@/lib/page-fetcher';
import PageRenderer from '@/components/PageRenderer';
import PasswordForm from '@/components/PasswordForm';
import { generatePageMetadata, fetchPageRenderSettings } from '@/lib/generate-page-metadata';
import { parseAuthCookie, getPasswordProtection, fetchFoldersForAuth } from '@/lib/page-auth';
import { getSiteBaseUrl } from '@/lib/url-utils';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayRenderHostSubdomain, getQayRenderSiteBaseUrl, getQayRenderSiteId } from '@/qay/lib/render-site';
import { generatePreviewCss } from '@/qay/lib/preview-css';
import { recordQayPageView } from '@/qay/lib/analytics';
import type { Metadata } from 'next';

// Static by default for performance, dynamic only when pagination is requested
export const revalidate = false; // Cache indefinitely until publish invalidates
export const dynamic = 'force-dynamic';

/**
 * Fetch homepage data from database
 * Cached with tag-based revalidation (no time-based stale cache)
 */
async function fetchPublishedHomepage(qaySiteId?: string | null) {
  const siteKey = qaySiteId || 'global';
  const tags = ['all-pages', `site-${siteKey}`, 'route-/'];
  const opts = { tags, revalidate: false as const };

  const [core, layers] = await Promise.all([
    unstable_cache(
      async () => {
        const data = await fetchHomepage(true, undefined, undefined, undefined, undefined, qaySiteId);
        if (!data) return null;
        return splitPageData(data as PageData).core;
      },
      [`core-/${siteKey}`],
      opts
    )(),
    unstable_cache(
      async () => {
        const data = await fetchHomepage(true, undefined, undefined, undefined, undefined, qaySiteId);
        if (!data) return null;
        return splitPageData(data as PageData).layers;
      },
      [`layers-/${siteKey}`],
      opts
    )(),
  ]);

  if (!core) return null;
  return reassemblePageData(core, layers || []);
}

async function fetchCachedGlobalSettings(qaySiteId?: string | null) {
  const siteKey = qaySiteId || 'global';
  try {
    return await unstable_cache(
      async () => fetchPageRenderSettings(qaySiteId),
      [`data-for-global-settings-${siteKey}`],
      { tags: ['all-pages', `site-${siteKey}`], revalidate: false }
    )();
  } catch {
    return {
      googleSiteVerification: null,
      globalCanonicalUrl: null,
      gaMeasurementId: null,
      publishedCss: null,
      colorVariablesCss: null,
      globalCustomCodeHead: null,
      globalCustomCodeBody: null,
      ycodeBadge: true,
      faviconUrl: null,
      webClipUrl: null,
    };
  }
}

async function fetchCachedFoldersForAuth() {
  try {
    return await unstable_cache(
      async () => fetchFoldersForAuth(true),
      ['data-for-auth-folders'],
      { tags: ['all-pages'], revalidate: false }
    )();
  } catch {
    return [];
  }
}

async function fetchCachedErrorPage(errorCode: 401, qaySiteId?: string | null) {
  const siteKey = qaySiteId || 'global';
  return unstable_cache(
    async () => {
      const data = await fetchErrorPage(errorCode, true, undefined, qaySiteId);
      return data ? slimPageData(data) : null;
    },
    [`error-${errorCode}-${siteKey}`],
    { tags: ['all-pages', `site-${siteKey}`], revalidate: false }
  )();
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const oauthCode = typeof resolvedSearchParams.code === 'string' ? resolvedSearchParams.code : null;
  const oauthNext = typeof resolvedSearchParams.next === 'string' ? resolvedSearchParams.next : '/dashboard';

  if (oauthCode) {
    const callbackParams = new URLSearchParams({ code: oauthCode, next: oauthNext });
    redirect(`/ycode/api/auth/callback?${callbackParams.toString()}`);
  }

  const renderSubdomain = await getQayRenderHostSubdomain();
  const qaySiteId = await getQayRenderSiteId();
  const authRedirectPath = renderSubdomain ? `/${renderSubdomain}` : '/';
  if (renderSubdomain && !qaySiteId) {
    notFound();
  }
  // Cache-first homepage path; pagination is served through internal dynamic routes.
  // The bare QAY app domain must never fall back to a global published site.
  const data = qaySiteId ? await fetchPublishedHomepage(qaySiteId) : null;
  const siteScopedCss = data
    ? await generatePreviewCss(data.pageLayers.layers || [], data.components)
    : undefined;

  // If no published homepage exists, show default landing page
  if (!data || !data.pageLayers) {
    return (
      <main className="min-h-screen bg-[#070707] text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:38px_38px]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_34%,rgba(255,255,255,0.05)_68%,transparent)]" />
          <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16">
            <header className="flex items-center justify-between gap-6">
              <a href="/" aria-label="QAY home">
                <QayLogo theme="dark" imageClassName="h-11 w-auto" />
              </a>
              <nav className="hidden items-center gap-8 text-sm text-white/62 md:flex">
                <a href="#features" className="transition hover:text-white">Features</a>
                <a href="#workflow" className="transition hover:text-white">Workflow</a>
                <a href="/pricing" className="transition hover:text-white">Pricing</a>
                <a href="/help" className="transition hover:text-white">Help</a>
              </nav>
              <div className="flex items-center gap-2">
                <a href="/login" className="rounded-md border border-white/12 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10 hover:text-white">
                  Sign in
                </a>
                <a href="/signup" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90">
                  Start free
                </a>
              </div>
            </header>

            <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr]">
              <div className="max-w-3xl">
                <p className="mb-5 text-sm uppercase tracking-[0.26em] text-white/48">AI builder, visual editor, client handoff</p>
                <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                  QAY builds the site. You keep the control.
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/66">
                  A focused website workspace for freelancers and small teams: generate, import, edit, publish, invite clients, and manage every site without mixing projects together.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="/signup" className="rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90">
                    Create your first site
                  </a>
                  <a href="/dashboard" className="rounded-md border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                    Open dashboard
                  </a>
                </div>
                <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {[
                    ['AI + import', 'Build faster'],
                    ['2 published', 'Free plan'],
                    ['Per-site data', 'Clean handoff'],
                  ].map(([value, label]) => (
                    <div key={value}>
                      <div className="text-sm font-medium text-white">{value}</div>
                      <div className="mt-1 text-xs text-white/45">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-lg border border-white/12 bg-[#101010] shadow-2xl shadow-black/50">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=82"
                    alt="Modern workspace used as a QAY site preview"
                    className="h-48 w-full object-cover opacity-80 sm:h-64"
                  />
                  <div className="border-t border-white/10 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Studio launch</div>
                        <div className="mt-1 text-xs text-white/45">Imported HTML, AI polish, client review</div>
                      </div>
                      <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200">Published</span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {['Design', 'CMS', 'Analytics'].map((item) => (
                        <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                          <div className="h-12 rounded bg-white/[0.06]" />
                          <div className="mt-3 text-xs text-white/58">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-4 hidden w-56 rounded-lg border border-white/12 bg-black/86 p-4 shadow-xl shadow-black/40 backdrop-blur md:block">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/42">Client mode</div>
                  <div className="mt-3 text-sm text-white/78">Approve text, images, and CMS edits without exposing builder controls.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/42">What is inside</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">Everything needed to ship client sites from one workspace.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['AI builder', 'Generate full pages, refine selected sections, and keep prompt history per site.'],
              ['HTML importer', 'Bring in Tailwind HTML and map clean layouts into editable QAY layers.'],
              ['Visual editor', 'Edit layout, content, media, forms, CMS, integrations, and site settings.'],
              ['Client dashboard', 'Let clients see only published/assigned sites and edit approved content.'],
              ['Publishing controls', 'Preview, publish, connect domains, manage slugs, and track site URLs.'],
              ['Analytics', 'View page views and site activity from the developer dashboard.'],
            ].map(([title, body]) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/42">Workflow</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">From idea to published URL without the usual mess.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['01', 'Create from AI, a template, blank canvas, or imported code.'],
                ['02', 'Edit with the builder while site data stays isolated by project.'],
                ['03', 'Invite clients for review, approvals, and content updates.'],
                ['04', 'Publish, connect a domain, and watch analytics from dashboard.'],
              ].map(([step, text]) => (
                <div key={step} className="rounded-lg border border-white/10 bg-black/35 p-5">
                  <div className="text-sm tracking-[0.22em] text-white/36">{step}</div>
                  <p className="mt-5 text-sm leading-6 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
          <div className="rounded-lg border border-white/10 bg-white text-black">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-black/45">Ready when you are</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Start free. Upgrade only when the work needs it.</h2>
              </div>
              <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
                <a href="/signup" className="rounded-md bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-black/85">
                  Start building
                </a>
                <a href="/pricing" className="rounded-md border border-black/15 px-5 py-3 text-center text-sm font-medium text-black transition hover:bg-black/5">
                  View pricing
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Load all global settings early so error pages also get global custom code
  const globalSettings = await fetchCachedGlobalSettings(qaySiteId);

  // Check password protection for homepage.
  // First evaluate without cookies() so non-protected pages can stay cacheable.
  const folders = await fetchCachedFoldersForAuth();
  const protectionCheck = getPasswordProtection(data.page, folders, null);

  // If homepage is protected, read auth cookie and re-check unlock state.
  if (protectionCheck.isProtected) {
    const authCookie = await parseAuthCookie();
    const protection = getPasswordProtection(data.page, folders, authCookie);

    // If homepage is protected and not unlocked, show 401 error page
    if (!protection.isUnlocked) {
      const errorPageData = await fetchCachedErrorPage(401, qaySiteId);

      if (errorPageData) {
        const { page: errorPage, pageLayers: errorPageLayers, components: errorComponents } = errorPageData;

        return (
          <PageRenderer
            page={errorPage}
            layers={errorPageLayers.layers || []}
            components={errorComponents}
            generatedCss={siteScopedCss || globalSettings.publishedCss || undefined}
            globalCustomCodeHead={globalSettings.globalCustomCodeHead}
            globalCustomCodeBody={globalSettings.globalCustomCodeBody}
            passwordProtection={{
              pageId: protection.protectedBy === 'page' ? protection.protectedById : undefined,
              folderId: protection.protectedBy === 'folder' ? protection.protectedById : undefined,
              redirectUrl: authRedirectPath,
              isPublished: true,
            }}
          />
        );
      }

      // Inline fallback if no custom 401 page exists
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md px-4">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">401</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Password Protected</h2>
            <p className="text-gray-600 mb-8">Enter the password to continue.</p>
            <PasswordForm
              pageId={protection.protectedBy === 'page' ? protection.protectedById : undefined}
              folderId={protection.protectedBy === 'folder' ? protection.protectedById : undefined}
              redirectUrl={authRedirectPath}
              isPublished={true}
            />
          </div>
        </div>
      );
    }
  }

  // Render homepage
  const headerStore = await headers();
  await recordQayPageView(qaySiteId, '/', headerStore.get('referer'));

  return (
    <PageRenderer
      page={data.page}
      layers={data.pageLayers.layers || []}
      components={data.components}
      generatedCss={siteScopedCss || globalSettings.publishedCss || undefined}
      colorVariablesCss={globalSettings.colorVariablesCss || undefined}
      locale={data.locale}
      availableLocales={data.availableLocales}
      translations={data.translations}
      gaMeasurementId={globalSettings.gaMeasurementId}
      globalCustomCodeHead={globalSettings.globalCustomCodeHead}
      globalCustomCodeBody={globalSettings.globalCustomCodeBody}
      ycodeBadge={globalSettings.ycodeBadge}
    />
  );
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const renderSubdomain = await getQayRenderHostSubdomain();
  const qaySiteId = await getQayRenderSiteId();
  if (renderSubdomain && !qaySiteId) {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false },
    };
  }
  const siteBaseUrl = qaySiteId
    ? await getQayRenderSiteBaseUrl()
    : null;
  if (!qaySiteId) {
    return {
      title: 'QAY - AI Website Builder for Freelancers and Agencies',
      description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
      alternates: {
        canonical: '/',
      },
      icons: {
        icon: '/icon.png',
        apple: '/icon.png',
      },
      openGraph: {
        type: 'website',
        siteName: 'QAY',
        title: 'QAY - AI Website Builder for Freelancers and Agencies',
        description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
        images: [{ url: '/icon.png', width: 512, height: 512, alt: 'QAY' }],
      },
      twitter: {
        card: 'summary',
        title: 'QAY - AI Website Builder for Freelancers and Agencies',
        description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
        images: ['/icon.png'],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  // Fetch page and global settings in parallel
  const [data, globalSettings] = await Promise.all([
    fetchPublishedHomepage(qaySiteId),
    fetchCachedGlobalSettings(qaySiteId),
  ]);

  if (!data) {
    return {
      title: 'QAY',
      description: 'Built with QAY',
    };
  }

  // Check password protection - don't leak metadata for protected pages.
  // First check without cookies() to avoid forcing dynamic metadata for public pages.
  const folders = await fetchCachedFoldersForAuth();
  const protectionCheck = getPasswordProtection(data.page, folders, null);

  if (protectionCheck.isProtected) {
    const authCookie = await parseAuthCookie();
    const protection = getPasswordProtection(data.page, folders, authCookie);
    if (!protection.isUnlocked) {
      return {
        title: 'Password Protected',
        description: 'This page is password protected.',
        robots: { index: false, follow: false },
      };
    }
  }

  const { meta, baseUrl } = await unstable_cache(
    async () => ({
      meta: await generatePageMetadata(data.page, {
        fallbackTitle: 'Home',
        pagePath: '/',
        globalSeoSettings: globalSettings,
      }),
      baseUrl: siteBaseUrl || getSiteBaseUrl({ globalCanonicalUrl: globalSettings.globalCanonicalUrl }),
    }),
    [`data-for-route-/-meta-${qaySiteId || 'global'}`],
    { tags: ['all-pages', `site-${qaySiteId || 'global'}`, 'route-/'], revalidate: false }
  )();

  if (baseUrl) {
    try { meta.metadataBase = new URL(baseUrl); } catch { /* invalid URL */ }
  }

  return meta;
}
