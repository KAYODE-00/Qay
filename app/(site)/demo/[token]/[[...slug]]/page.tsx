import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import PasswordForm from '@/components/PasswordForm';
import { fetchErrorPage, fetchHomepage, fetchPageByPath } from '@/lib/page-fetcher';
import { fetchGlobalPageSettings } from '@/lib/generate-page-metadata';
import { parseAuthCookie, getPasswordProtection, fetchFoldersForAuth } from '@/lib/page-auth';
import { generateColorVariablesCss } from '@/lib/repositories/colorVariableRepository';
import { generatePreviewCss } from '@/qay/lib/preview-css';
import { getQayDemoLinkByToken } from '@/qay/lib/demo-links';
import { SiteAuthLogoutInitializer } from '@/qay/components/site-auth/SiteAuthLogoutInitializer';
import { SiteAuthScreen } from '@/qay/components/site-auth/SiteAuthScreen';
import { getQaySiteAuthSettings, getQaySiteVisitor } from '@/qay/lib/site-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getSiteAuthMode(slugPath: string): 'signin' | 'signup' | 'forgot-password' | 'reset-password' {
  if (slugPath === 'signup') return 'signup';
  if (slugPath === 'forgot-password') return 'forgot-password';
  if (slugPath === 'reset-password') return 'reset-password';
  return 'signin';
}

function isSiteAuthUtilityPath(slugPath: string) {
  return ['login', 'signup', 'forgot-password', 'reset-password'].includes(slugPath);
}

type DemoParams = {
  token: string;
  slug?: string[];
};

function expiredDemo() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <section className="max-w-md rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
        <h1 className="text-2xl font-semibold">Demo link expired</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Ask the site owner to generate a fresh demo link.
        </p>
      </section>
    </main>
  );
}

export default async function QayDemoPage({ params }: { params: Promise<DemoParams> }) {
  const { token, slug } = await params;
  const demoLink = await getQayDemoLinkByToken(token);

  if (!demoLink) {
    return expiredDemo();
  }

  const slugPath = slug?.length ? slug.join('/') : '';
  const data = slugPath
    ? await fetchPageByPath(slugPath, false, undefined, undefined, demoLink.site_id)
    : await fetchHomepage(false, undefined, undefined, undefined, undefined, demoLink.site_id);

  const [draftCSS, colorVariablesCss, globalSettings] = await Promise.all([
    data ? generatePreviewCss(data.pageLayers.layers || [], data.components) : Promise.resolve(undefined),
    generateColorVariablesCss(),
    fetchGlobalPageSettings(),
  ]);

  if (!data && isSiteAuthUtilityPath(slugPath)) {
    const siteAuthSettings = await getQaySiteAuthSettings(demoLink.site_id);
    const siteVisitor = siteAuthSettings.enabled ? await getQaySiteVisitor(demoLink.site_id) : null;

    if (siteAuthSettings.enabled && !siteVisitor) {
      return (
        <SiteAuthScreen
          siteId={demoLink.site_id}
          allowSignup={siteAuthSettings.allowSignup}
          isPublished={false}
          previewBasePath={`/demo/${token}`}
          mode={getSiteAuthMode(slugPath)}
        />
      );
    }
  }

  if (!data) {
    const errorPageData = await fetchErrorPage(404, false, undefined, demoLink.site_id);
    if (!errorPageData) notFound();

    return (
      <PageRenderer
        page={errorPageData.page}
        layers={errorPageData.pageLayers.layers || []}
        components={errorPageData.components}
        generatedCss={draftCSS}
        colorVariablesCss={colorVariablesCss || undefined}
        isPreview={true}
        previewBasePath={`/demo/${token}`}
        globalCustomCodeHead={globalSettings.globalCustomCodeHead}
        globalCustomCodeBody={globalSettings.globalCustomCodeBody}
      />
    );
  }

  const siteAuthSettings = await getQaySiteAuthSettings(demoLink.site_id);
  const siteVisitor = siteAuthSettings.enabled ? await getQaySiteVisitor(demoLink.site_id) : null;
  if (siteAuthSettings.enabled && !siteVisitor) {
    return (
      <SiteAuthScreen
        siteId={demoLink.site_id}
        allowSignup={siteAuthSettings.allowSignup}
        isPublished={false}
        previewBasePath={`/demo/${token}`}
        mode={getSiteAuthMode(slugPath)}
      />
    );
  }

  const folders = await fetchFoldersForAuth(false);
  const authCookie = await parseAuthCookie();
  const protection = getPasswordProtection(data.page, folders, authCookie);
  const redirectUrl = `/demo/${token}${slugPath ? `/${slugPath}` : ''}`;

  if (protection.isProtected && !protection.isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md px-4 text-center">
          <h1 className="mb-4 text-2xl font-semibold text-gray-900">Password Protected</h1>
          <p className="mb-8 text-gray-600">Enter the password to continue.</p>
          <PasswordForm
            pageId={protection.protectedBy === 'page' ? protection.protectedById : undefined}
            folderId={protection.protectedBy === 'folder' ? protection.protectedById : undefined}
            redirectUrl={redirectUrl}
            isPublished={false}
          />
        </div>
      </div>
    );
  }

  const pageData = data as any;

  return (
    <>
      <PageRenderer
        page={data.page}
        layers={data.pageLayers.layers || []}
        components={data.components}
        generatedCss={draftCSS}
        colorVariablesCss={colorVariablesCss || undefined}
        collectionItem={pageData.collectionItem}
        collectionFields={pageData.collectionFields}
        pageCollectionSortedItemIds={pageData.pageCollectionSortedItemIds}
        pageCollectionSortedItemSlugs={pageData.pageCollectionSortedItemSlugs}
        locale={data.locale}
        availableLocales={data.availableLocales}
        isPreview={true}
        previewBasePath={`/demo/${token}`}
        translations={data.translations}
        globalCustomCodeHead={globalSettings.globalCustomCodeHead}
        globalCustomCodeBody={globalSettings.globalCustomCodeBody}
      />
      {siteVisitor && <SiteAuthLogoutInitializer siteId={demoLink.site_id} />}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'QAY Demo',
    robots: {
      index: false,
      follow: false,
    },
  };
}
