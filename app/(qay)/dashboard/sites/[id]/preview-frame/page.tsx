import PageRenderer from '@/components/PageRenderer';
import { fetchGlobalPageSettings } from '@/lib/generate-page-metadata';
import { fetchHomepage } from '@/lib/page-fetcher';
import { generateColorVariablesCss } from '@/lib/repositories/colorVariableRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { generatePreviewCss } from '@/qay/lib/preview-css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PreviewFramePageProps = {
  params: Promise<{ id: string }>;
};

function PreviewFrameMessage({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <section className="max-w-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">QAY Preview</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">{message}</p>
      </section>
    </main>
  );
}

export default async function DashboardSitePreviewFramePage({ params }: PreviewFramePageProps) {
  const { id } = await params;

  if (!id || !(await canAccessQaySite(id))) {
    return <PreviewFrameMessage title="Preview unavailable" message="You do not have access to this site." />;
  }

  const data = await fetchHomepage(false, undefined, undefined, undefined, undefined, id);

  if (!data?.pageLayers) {
    return <PreviewFrameMessage title="No homepage yet" message="Open the editor and create a homepage to preview it here." />;
  }

  const [draftCSS, colorVariablesCss, globalSettings] = await Promise.all([
    generatePreviewCss(data.pageLayers.layers || [], data.components),
    generateColorVariablesCss(),
    fetchGlobalPageSettings(),
  ]);

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
      previewBasePath={`/dashboard/sites/${id}/preview-frame`}
      translations={data.translations}
      globalCustomCodeHead={globalSettings.globalCustomCodeHead}
      globalCustomCodeBody={globalSettings.globalCustomCodeBody}
    />
  );
}
