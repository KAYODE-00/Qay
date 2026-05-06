import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import PasswordForm from '@/components/PasswordForm';
import { fetchPageByPath, fetchErrorPage } from '@/lib/page-fetcher';
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

export default async function QayPreviewPage({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const qaySiteId = await getQayRenderSiteId({ preferCookie: true });
  const data = await fetchPageByPath(slugPath, false, undefined, undefined, qaySiteId);

  const [draftCSS, colorVariablesCss, globalSettings] = await Promise.all([
    fetchPreviewDraftCss(),
    generateColorVariablesCss(),
    fetchGlobalPageSettings(),
  ]);

  if (!data) {
    const errorPageData = await fetchErrorPage(404, false);

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
          previewBasePath="/qay/preview"
          globalCustomCodeHead={globalSettings.globalCustomCodeHead}
          globalCustomCodeBody={globalSettings.globalCustomCodeBody}
        />
      );
    }

    notFound();
  }

  const {
    page,
    pageLayers,
    components,
    collectionItem,
    collectionFields,
    pageCollectionSortedItemIds,
    pageCollectionSortedItemSlugs,
    locale,
    availableLocales,
    translations,
  } = data;

  const folders = await fetchFoldersForAuth(false);
  const authCookie = await parseAuthCookie();
  const protection = getPasswordProtection(page, folders, authCookie);

  if (protection.isProtected && !protection.isUnlocked) {
    const errorPageData = await fetchErrorPage(401, false);

    if (errorPageData) {
      const { page: errorPage, pageLayers: errorPageLayers, components: errorComponents } = errorPageData;

      return (
        <PageRenderer
          page={errorPage}
          layers={errorPageLayers.layers || []}
          components={errorComponents}
          generatedCss={draftCSS}
          colorVariablesCss={colorVariablesCss || undefined}
          isPreview={true}
          previewBasePath="/qay/preview"
          globalCustomCodeHead={globalSettings.globalCustomCodeHead}
          globalCustomCodeBody={globalSettings.globalCustomCodeBody}
          passwordProtection={{
            pageId: protection.protectedBy === 'page' ? protection.protectedById : undefined,
            folderId: protection.protectedBy === 'folder' ? protection.protectedById : undefined,
            redirectUrl: `/qay/preview/${slugPath}`,
            isPublished: false,
          }}
        />
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Password Protected</h2>
          <p className="text-gray-600 mb-8">Enter the password to continue.</p>
          <PasswordForm
            pageId={protection.protectedBy === 'page' ? protection.protectedById : undefined}
            folderId={protection.protectedBy === 'folder' ? protection.protectedById : undefined}
            redirectUrl={`/qay/preview/${slugPath}`}
            isPublished={false}
          />
        </div>
      </div>
    );
  }

  return (
    <PageRenderer
      page={page}
      layers={pageLayers.layers || []}
      components={components}
      generatedCss={draftCSS}
      colorVariablesCss={colorVariablesCss || undefined}
      collectionItem={collectionItem}
      collectionFields={collectionFields}
      pageCollectionSortedItemIds={pageCollectionSortedItemIds}
      pageCollectionSortedItemSlugs={pageCollectionSortedItemSlugs}
      locale={locale}
      availableLocales={availableLocales}
      isPreview={true}
      previewBasePath="/qay/preview"
      translations={translations}
      globalCustomCodeHead={globalSettings.globalCustomCodeHead}
      globalCustomCodeBody={globalSettings.globalCustomCodeBody}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string | string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const qaySiteId = await getQayRenderSiteId({ preferCookie: true });
  const data = await fetchPageByPath(slugPath, false, undefined, undefined, qaySiteId);

  if (!data) {
    return {
      title: 'Preview - Page Not Found',
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
    collectionItem: data.collectionItem,
  });
}
