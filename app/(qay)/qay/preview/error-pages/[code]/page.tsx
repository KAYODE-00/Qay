import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import { fetchErrorPage } from '@/lib/page-fetcher';
import { fetchGlobalPageSettings, generatePageMetadata } from '@/lib/generate-page-metadata';
import { generateColorVariablesCss } from '@/lib/repositories/colorVariableRepository';
import { getSettingsByKeys } from '@/lib/repositories/settingsRepository';

async function fetchPreviewDraftCss() {
  const settings = await getSettingsByKeys(['draft_css']);
  return (settings.draft_css as string) || undefined;
}

interface ErrorPagePreviewProps {
  params: Promise<{ code: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QayErrorPagePreview({ params }: ErrorPagePreviewProps) {
  const { code } = await params;
  const errorCode = parseInt(code, 10);
  const pageData = await fetchErrorPage(errorCode, false);

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid error page</h1>
          <p className="text-gray-600 mb-6">The {errorCode} error page cannot be customized.</p>
        </div>
      </div>
    );
  }

  const { page, pageLayers, components, locale, availableLocales, translations } = pageData;
  const [draftCSS, colorVariablesCss, globalSettings] = await Promise.all([
    fetchPreviewDraftCss(),
    generateColorVariablesCss(),
    fetchGlobalPageSettings(),
  ]);

  return (
    <PageRenderer
      page={page}
      layers={pageLayers.layers || []}
      components={components}
      generatedCss={draftCSS}
      colorVariablesCss={colorVariablesCss || undefined}
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

export async function generateMetadata({ params }: ErrorPagePreviewProps): Promise<Metadata> {
  const { code } = await params;
  const errorCode = parseInt(code, 10);
  const pageData = await fetchErrorPage(errorCode, false);

  if (!pageData) {
    return {
      title: `[Preview] ${errorCode} error page`,
      description: `Preview of ${errorCode} error page`,
    };
  }

  return generatePageMetadata(pageData.page, {
    isPreview: true,
  });
}
