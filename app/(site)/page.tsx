import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { fetchHomepage, fetchErrorPage, splitPageData, reassemblePageData, slimPageData } from '@/lib/page-fetcher';
import type { PageData } from '@/lib/page-fetcher';
import PageRenderer from '@/components/PageRenderer';
import PasswordForm from '@/components/PasswordForm';
import { generatePageMetadata, fetchPageRenderSettings } from '@/lib/generate-page-metadata';
import { parseAuthCookie, getPasswordProtection, fetchFoldersForAuth } from '@/lib/page-auth';
import { getSiteBaseUrl } from '@/lib/url-utils';
import { QayLogo } from '@/qay/components/QayLogo';
import { SiteAuthLogoutInitializer } from '@/qay/components/site-auth/SiteAuthLogoutInitializer';
import { SiteAuthScreen } from '@/qay/components/site-auth/SiteAuthScreen';
import { getQayRenderHostSubdomain, getQayRenderSiteBaseUrl, getQayRenderSiteId } from '@/qay/lib/render-site';
import { generatePreviewCss } from '@/qay/lib/preview-css';
import { recordQayPageView } from '@/qay/lib/analytics';
import { getQaySiteAuthSettings, getQaySiteVisitor } from '@/qay/lib/site-auth';
import { QayLandingImage } from '@/qay/components/QayLandingImage';
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
      <main className="min-h-screen bg-background text-foreground">
        <style>{`
          @keyframes qayRise {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes qayFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes qayFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(-1deg); }
          }
          @keyframes qaySweep {
            0% { transform: translateX(-35%); opacity: 0; }
            18%, 70% { opacity: 1; }
            100% { transform: translateX(35%); opacity: 0; }
          }
          @keyframes qayViewRise {
            from { opacity: 0; transform: translateY(72px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes qayViewScale {
            from { transform: scale(0.86); border-radius: 32px; }
            to { transform: scale(1); border-radius: 12px; }
          }
          @keyframes qayViewSlide {
            from { transform: translateX(-10%); }
            to { transform: translateX(10%); }
          }
          @keyframes qayViewFade {
            0% { opacity: 0.35; }
            45%, 70% { opacity: 1; }
            100% { opacity: 0.55; }
          }
          .qay-animate-rise { animation: qayRise 700ms cubic-bezier(0.19, 1, 0.22, 1) both; }
          .qay-animate-fade { animation: qayFade 900ms ease both; }
          .qay-animate-float { animation: qayFloat 6s ease-in-out infinite; }
          .qay-animate-delay-1 { animation-delay: 100ms; }
          .qay-animate-delay-2 { animation-delay: 220ms; }
          .qay-animate-delay-3 { animation-delay: 340ms; }
          .qay-hero-sweep::after {
            content: "";
            position: absolute;
            inset: 14% -18%;
            background: linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent);
            animation: qaySweep 5.8s ease-in-out infinite;
            pointer-events: none;
          }
          .qay-scroll-rise {
            animation: qayViewRise both;
            animation-timeline: view();
            animation-range: entry 8% cover 42%;
          }
          .qay-scroll-scale {
            animation: qayViewScale both;
            animation-timeline: view();
            animation-range: entry 0% cover 48%;
          }
          .qay-scroll-slide {
            animation: qayViewSlide both linear;
            animation-timeline: view();
            animation-range: entry 0% exit 100%;
          }
          .qay-scroll-fade {
            animation: qayViewFade both linear;
            animation-timeline: view();
            animation-range: entry 0% exit 100%;
          }
          @media (prefers-reduced-motion: reduce) {
            .qay-animate-rise,
            .qay-animate-fade,
            .qay-animate-float,
            .qay-hero-sweep::after,
            .qay-scroll-rise,
            .qay-scroll-scale,
            .qay-scroll-slide,
            .qay-scroll-fade {
              animation: none;
            }
          }
        `}</style>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(0,0,0,0.06),transparent_34%,rgba(0,0,0,0.025)_68%,transparent)]" />
          <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16">
            <header className="qay-animate-fade flex items-center justify-between gap-6">
              <Link href="/" aria-label="QAY home">
                <QayLogo theme="dark" imageClassName="h-11 w-auto" />
              </Link>
              <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
                <a href="#features" className="transition hover:text-foreground">Features</a>
                <a href="#templates" className="transition hover:text-foreground">Templates</a>
                <a href="#workflow" className="transition hover:text-foreground">Workflow</a>
                <Link href="/compare" className="transition hover:text-foreground">Compare</Link>
                <Link href="/pricing" className="transition hover:text-foreground">Pricing</Link>
                <Link href="/feedback" className="transition hover:text-foreground">Feedback</Link>
                <Link href="/help" className="transition hover:text-foreground">Help</Link>
              </nav>
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
                  Sign in
                </Link>
                <Link href="/signup" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90">
                  Start free
                </Link>
              </div>
            </header>

            <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr]">
              <div className="max-w-3xl">
                <p className="qay-animate-rise mb-5 text-sm uppercase tracking-[0.26em] text-muted-foreground">Launch-ready sites, client handoff, ecommerce</p>
                <h1 className="qay-animate-rise qay-animate-delay-1 text-5xl font-semibold leading-[0.98] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                  QAY builds the site. You keep the control.
                </h1>
                <p className="qay-animate-rise qay-animate-delay-2 mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
                  A focused website workspace for freelancers and small teams: start from polished designs, customize visually, publish confidently, invite clients, and manage every project from one calm dashboard.
                </p>
                <div className="qay-animate-rise qay-animate-delay-3 mt-9 flex flex-wrap gap-3">
                  <Link href="/signup" className="rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-foreground/90">
                    Create your first site
                  </Link>
                  <Link href="/dashboard" className="rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-accent">
                    Open dashboard
                  </Link>
                </div>
                <div className="qay-animate-fade qay-animate-delay-3 mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-border pt-6">
                  {[
                    ['Ready designs', 'Build faster'],
                    ['2 published', 'Free plan'],
                    ['Per-site data', 'Clean handoff'],
                  ].map(([value, label]) => (
                    <div key={value}>
                      <div className="text-sm font-medium text-foreground">{value}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="qay-animate-rise qay-animate-delay-2 relative">
                <div className="qay-hero-sweep relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  <div className="relative h-56 overflow-hidden bg-muted sm:h-72">
                    <QayLandingImage className="qay-animate-float mx-auto h-full w-full object-contain p-8 opacity-95 sm:p-10" />
                  </div>
                  <div className="border-t border-border p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Studio launch</div>
                        <div className="mt-1 text-xs text-muted-foreground">Imported HTML, AI polish, client review</div>
                      </div>
                      <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200">Published</span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {['Design', 'CMS', 'Analytics'].map((item) => (
                        <div key={item} className="rounded-md border border-border bg-background p-3">
                          <div className="h-12 rounded bg-muted" />
                          <div className="mt-3 text-xs text-muted-foreground">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-4 hidden w-56 rounded-lg border border-border bg-card p-4 shadow-sm md:block">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Client mode</div>
                  <div className="mt-3 text-sm text-foreground/80">Approve text, images, and CMS edits without exposing builder controls.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">What is inside</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Everything needed to ship client sites from one workspace.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['AI design assistant', 'Start with polished page drafts, improve selected sections, and keep creative momentum inside each site.'],
              ['Ready-to-use sections', 'Use strong layouts for shops, agencies, portfolios, SaaS, restaurants, hotels, clinics, real estate, and more.'],
              ['Visual editor', 'Edit layout, content, media, forms, CMS, integrations, and site settings without handing clients the whole builder.'],
              ['Medusa ecommerce', 'Create storefronts with product cards, cart flows, checkout-ready pages, and a path to serious commerce.'],
              ['Client dashboard', 'Let clients review assigned sites and update approved content without breaking the design.'],
              ['Publishing controls', 'Preview, publish, connect domains, manage slugs, and keep every site organized.'],
              ['Business workspace', 'Keep design, handoff, billing, feedback, ecommerce, and publishing together for real client work.'],
            ].map(([title, body]) => (
              <article key={title} className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-lg font-medium text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="templates" className="overflow-hidden border-y border-border bg-[#070707] text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
            <div className="qay-scroll-rise grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">Template demos</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  Show clients polished directions before the first revision.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-white/60 lg:justify-self-end">
                Browse permanent QAY demo links for starter designs, then turn the right one into a project with plan-based publishing and client preview controls.
              </p>
            </div>
            <div className="no-scrollbar mt-12 flex gap-5 overflow-x-auto pb-4">
              {[
                {
                  title: 'Streetwear shop',
                  tag: 'Ecommerce',
                  copy: 'Editorial product cards, cart-ready sections, bold CTAs, and drop-focused storytelling.',
                  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&auto=format&q=85',
                },
                {
                  title: 'Creative studio',
                  tag: 'Agency',
                  copy: 'Asymmetric hero, selected work, client proof, sharp process blocks, and conversion contact flow.',
                  image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&auto=format&q=85',
                },
                {
                  title: 'Clinic and wellness',
                  tag: 'Medical',
                  copy: 'Trust-led service cards, booking CTA, practitioner story, reviews, hours, and location content.',
                  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&auto=format&q=85',
                },
              ].map((template, index) => (
                <article
                  key={template.title}
                  className="qay-scroll-rise min-w-[82vw] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 sm:min-w-[430px] lg:min-w-[390px]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="qay-scroll-scale h-72 overflow-hidden bg-white/5">
                    <img
                      src={template.image} alt={`${template.title} template preview`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold">{template.title}</h3>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">{template.tag}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/58">{template.copy}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="qay-scroll-slide mt-8 flex min-w-max gap-4 text-[clamp(2.8rem,9vw,8rem)] font-semibold leading-none text-white/10">
              <span>Modern templates</span>
              <span>Permanent demos</span>
              <span>QAY branded previews</span>
            </div>
            <div className="qay-scroll-fade mt-10 flex flex-wrap gap-3">
              <Link href="/dashboard/templates" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
                Browse templates
              </Link>
              <Link href="/signup" className="rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Start from a template
              </Link>
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-border bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Workflow</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">From idea to published URL without the usual mess.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['01', 'Create from AI, a proven section set, a template, or a blank canvas.'],
                ['02', 'Edit with the builder while site data stays isolated by project.'],
                ['03', 'Invite clients for review, approvals, and content updates.'],
                ['04', 'Publish, connect a domain, and watch analytics from dashboard.'],
              ].map(([step, text]) => (
                <div key={step} className="rounded-lg border border-border bg-card p-5">
                  <div className="text-sm tracking-[0.22em] text-muted-foreground">{step}</div>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              ['QAY vs Framer', 'Choose QAY when client operations, ecommerce, auth, feedback, and editable handoff matter as much as visual polish.', '/compare/framer'],
              ['QAY vs Wix', 'Choose QAY when you want a cleaner professional workspace for custom client projects, not a crowded all-in-one template lane.', '/compare/wix'],
              ['QAY vs others', 'See why QAY is built for freelancers and agencies who need generation, editing, handoff, and business control together.', '/compare'],
            ].map(([title, body, href]) => (
              <Link
                key={title} href={href}
                className="rounded-lg border border-border bg-card p-5 transition hover:bg-accent"
              >
                <h3 className="text-lg font-medium text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </Link>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-card text-card-foreground">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Ready when you are</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Start free. Upgrade only when the work needs it.</h2>
              </div>
              <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
                <Link href="/signup" className="rounded-md bg-foreground px-5 py-3 text-center text-sm font-medium text-background transition hover:bg-foreground/90">
                  Start building
                </Link>
                <Link href="/pricing" className="rounded-md border border-border px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-accent">
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 text-sm text-muted-foreground sm:px-10 lg:px-16">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <QayLogo theme="dark" imageClassName="h-9 w-auto" />
              <div className="flex flex-wrap gap-5">
                <Link href="/compare" className="transition hover:text-foreground">Compare</Link>
                <Link href="/pricing" className="transition hover:text-foreground">Pricing</Link>
                <Link href="/feedback" className="transition hover:text-foreground">Feedback</Link>
                <Link href="/help" className="transition hover:text-foreground">Help</Link>
              </div>
            </div>
            <div className="grid gap-3 border-t border-border pt-6 md:grid-cols-3">
              <p>Ecommerce powered by Medusa.</p>
              <p>Editor powered by Ycode.</p>
              <p className="md:text-right">QAY helps freelancers and agencies create, manage, sell, and hand off better client websites.</p>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  // Load all global settings early so error pages also get global custom code
  const globalSettings = await fetchCachedGlobalSettings(qaySiteId);
  const siteAuthSettings = qaySiteId ? await getQaySiteAuthSettings(qaySiteId) : null;
  const siteVisitor = siteAuthSettings?.enabled && qaySiteId ? await getQaySiteVisitor(qaySiteId) : null;

  if (siteAuthSettings?.enabled && qaySiteId && !siteVisitor) {
    return <SiteAuthScreen
      siteId={qaySiteId} allowSignup={siteAuthSettings.allowSignup}
      isPublished={true} mode="signin"
           />;
  }

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
    <>
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
      {qaySiteId && siteVisitor && <SiteAuthLogoutInitializer siteId={qaySiteId} />}
    </>
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

  const siteAuthSettings = qaySiteId ? await getQaySiteAuthSettings(qaySiteId) : null;
  const metadataSiteVisitor = siteAuthSettings?.enabled && qaySiteId ? await getQaySiteVisitor(qaySiteId) : null;
  if (siteAuthSettings?.enabled && qaySiteId && !metadataSiteVisitor) {
    return {
      title: 'Protected Site',
      description: 'Sign in to view this site.',
      robots: { index: false, follow: false },
    };
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
