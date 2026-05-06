import Link from 'next/link';
import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import PasswordForm from '@/components/PasswordForm';
import { fetchHomepage, fetchErrorPage } from '@/lib/page-fetcher';
import { fetchGlobalPageSettings, generatePageMetadata } from '@/lib/generate-page-metadata';
import { parseAuthCookie, getPasswordProtection, fetchFoldersForAuth } from '@/lib/page-auth';
import { generateColorVariablesCss } from '@/lib/repositories/colorVariableRepository';
import { getSettingsByKeys } from '@/lib/repositories/settingsRepository';
import { getQayRenderSiteId } from '@/qay/lib/render-site';

async function fetchPreviewDraftCss() {
  const settings = await getSettingsByKeys(['draft_css', 'published_css']);
  return (settings.draft_css as string) || (settings.published_css as string) || undefined;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QayPreviewHomePage() {
  const qaySiteId = await getQayRenderSiteId({ preferCookie: true });
  const data = await fetchHomepage(false, undefined, undefined, undefined, undefined, qaySiteId);

  if (!data || !data.pageLayers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
        <div className="text-center p-8">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">QAY Preview</h1>
          <p className="text-zinc-300 mb-8">No homepage found for this site yet.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const [draftCSS, colorVariablesCss, globalSettings] = await Promise.all([
    fetchPreviewDraftCss(),
    generateColorVariablesCss(),
    fetchGlobalPageSettings(),
  ]);

  const folders = await fetchFoldersForAuth(false);
  const authCookie = await parseAuthCookie();
  const protection = getPasswordProtection(data.page, folders, authCookie);

  if (protection.isProtected && !protection.isUnlocked) {
    const errorPageData = await fetchErrorPage(401, false);

    if (errorPageData) {
      const { page, pageLayers, components } = errorPageData;

      return (
        <PageRenderer
          page={page}
          layers={pageLayers.layers || []}
          components={components}
          generatedCss={draftCSS}
          colorVariablesCss={colorVariablesCss || undefined}
          isPreview={true}
          globalCustomCodeHead={globalSettings.globalCustomCodeHead}
          globalCustomCodeBody={globalSettings.globalCustomCodeBody}
          passwordProtection={{
            pageId: protection.protectedBy === 'page' ? protection.protectedById : undefined,
            folderId: protection.protectedBy === 'folder' ? protection.protectedById : undefined,
            redirectUrl: '/qay/preview',
            isPublished: false,
          }}
        />
      );
    }

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', color: '#111' }}>Password Protected</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Enter the password to continue.</p>
        <PasswordForm
          pageId={protection.protectedBy === 'page' ? protection.protectedById : undefined}
          folderId={protection.protectedBy === 'folder' ? protection.protectedById : undefined}
          redirectUrl="/qay/preview"
          isPublished={false}
        />
      </div>
    );
  }

  return (
    <PageRenderer
      page={data.page}
      layers={data.pageLayers.layers || []}
      components={data.components}
      generatedCss={draftCSS}
      colorVariablesCss={colorVariablesCss || undefined}
      locale={data.locale}
      availableLocales={data.availableLocales}
      isPreview={true}
      previewBasePath="/qay/preview"
      translations={data.translations}
      globalCustomCodeHead={globalSettings.globalCustomCodeHead}
      globalCustomCodeBody={globalSettings.globalCustomCodeBody}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const qaySiteId = await getQayRenderSiteId({ preferCookie: true });
  const data = await fetchHomepage(false, undefined, undefined, undefined, undefined, qaySiteId);

  if (!data) {
    return {
      title: 'Preview - QAY',
      description: 'Preview - Built with QAY',
    };
  }

  const folders = await fetchFoldersForAuth(false);
  const authCookie = await parseAuthCookie();
  const protection = getPasswordProtection(data.page, folders, authCookie);

  if (protection.isProtected && !protection.isUnlocked) {
    return {
      title: 'Preview - Password Protected',
      description: 'This page is password protected.',
      robots: { index: false, follow: false },
    };
  }

  return generatePageMetadata(data.page, {
    isPreview: true,
    fallbackTitle: 'Homepage',
  });
}
