import { notFound, redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { fetchHomepage, fetchErrorPage, splitPageData, reassemblePageData, slimPageData } from '@/lib/page-fetcher';
import type { PageData } from '@/lib/page-fetcher';
import PageRenderer from '@/components/PageRenderer';
import PasswordForm from '@/components/PasswordForm';
import { generatePageMetadata, fetchGlobalPageSettings } from '@/lib/generate-page-metadata';
import { parseAuthCookie, getPasswordProtection, fetchFoldersForAuth } from '@/lib/page-auth';
import { getSiteBaseUrl } from '@/lib/url-utils';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayRenderHostSubdomain, getQayRenderSiteBaseUrl, getQayRenderSiteId } from '@/qay/lib/render-site';
import { generatePreviewCss } from '@/qay/lib/preview-css';
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

async function fetchCachedGlobalSettings() {
  try {
    return await unstable_cache(
      async () => fetchGlobalPageSettings(),
      ['data-for-global-settings'],
      { tags: ['all-pages'], revalidate: false }
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
  if (renderSubdomain && !qaySiteId) {
    notFound();
  }
  // Cache-first homepage path; pagination is served through internal dynamic routes.
  const data = await fetchPublishedHomepage(qaySiteId);
  const siteScopedCss = data
    ? await generatePreviewCss(data.pageLayers.layers || [], data.components)
    : undefined;

  // If no published homepage exists, show default landing page
  if (!data || !data.pageLayers) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="relative isolate flex min-h-screen overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14),transparent_36%,rgba(255,255,255,0.08)_64%,transparent)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
            <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_38%)]" />
            <div className="absolute inset-0 bg-[#0a0a0a]/70" />
          </div>

          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
            <header className="flex items-center justify-between">
              <QayLogo />
              <nav className="flex items-center gap-2">
                <a
                  href="/dashboard"
                  className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Dashboard
                </a>
                <a
                  href="/signup"
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  Get started
                </a>
              </nav>
            </header>

            <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1fr_0.88fr]">
              <div className="max-w-3xl">
                <p className="mb-4 text-sm uppercase tracking-[0.24em] text-white/50">Client sites, cleanly isolated</p>
                <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal md:text-7xl">
                  Build, invite, and hand off websites from one calm workspace.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">
                  QAY gives every project its own editor context, invite list, media library, and client access layer.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="/signup"
                    className="rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    Get started
                  </a>
                  <a
                    href="/dashboard"
                    className="rounded-md border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Dashboard
                  </a>
                </div>
              </div>

              <div className="rounded-lg border border-white/12 bg-white/[0.04] p-4 shadow-2xl shadow-black/40">
                <div className="rounded-md border border-white/10 bg-black/60">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-sm text-white/70">QAY dashboard</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {['Studio launch', 'Client portal', 'Campaign page', 'Product microsite'].map((name, index) => (
                      <div key={name} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                        <div className="mb-8 h-20 rounded bg-white/[0.06]" />
                        <div className="text-sm font-medium">{name}</div>
                        <div className="mt-1 text-xs text-white/45">{index % 2 === 0 ? 'Published' : 'Draft'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Load all global settings early so error pages also get global custom code
  const globalSettings = await fetchCachedGlobalSettings();

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
              redirectUrl: '/',
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
              redirectUrl="/"
              isPublished={true}
            />
          </div>
        </div>
      );
    }
  }

  // Render homepage
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
  // Fetch page and global settings in parallel
  const [data, globalSettings] = await Promise.all([
    fetchPublishedHomepage(qaySiteId),
    fetchCachedGlobalSettings(),
  ]);

  if (!data) {
    return {
      title: 'Ycode',
      description: 'Built with Ycode',
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
