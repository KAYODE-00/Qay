import PageRenderer from '@/components/PageRenderer';
import { fetchGlobalPageSettings, fetchPageRenderSettings } from '@/lib/generate-page-metadata';
import { fetchPageByPath } from '@/lib/page-fetcher';
import { generateColorVariablesCss } from '@/lib/repositories/colorVariableRepository';
import { generatePreviewCss } from '@/qay/lib/preview-css';
import { SiteAuthGate } from './SiteAuthGate';
import { SiteAuthFormInitializer } from './SiteAuthFormInitializer';

type SiteAuthMode = 'signin' | 'signup' | 'forgot-password' | 'reset-password';

type SiteAuthScreenProps = {
  siteId: string;
  allowSignup: boolean;
  isPublished: boolean;
  previewBasePath?: string;
  sitePathPrefix?: string;
  mode?: SiteAuthMode;
};

async function fetchDesignedAuthPage(siteId: string, isPublished: boolean, mode: SiteAuthMode) {
  const firstChoice = mode === 'signup'
    ? 'signup'
    : mode === 'forgot-password'
      ? 'forgot-password'
      : mode === 'reset-password'
        ? 'reset-password'
        : 'login';
  const secondChoice = mode === 'signup' ? 'login' : 'signup';

  return (
    await fetchPageByPath(firstChoice, isPublished, undefined, undefined, siteId)
    || await fetchPageByPath(secondChoice, isPublished, undefined, undefined, siteId)
  );
}

function hasDesignedAuthForm(layers: unknown, mode: SiteAuthMode): boolean {
  const stack = Array.isArray(layers) ? [...layers] : [];
  const expectedFormMode = mode === 'signup'
    ? 'signup'
    : mode === 'forgot-password'
      ? 'forgot-password'
      : mode === 'reset-password'
        ? 'reset-password'
        : 'signin';

  while (stack.length > 0) {
    const layer = stack.pop() as any;
    if (!layer || typeof layer !== 'object') continue;

    if (layer.attributes?.['data-qay-site-auth-form'] === expectedFormMode) {
      return true;
    }

    if (Array.isArray(layer.children)) {
      stack.push(...layer.children);
    }
  }

  return false;
}

export async function SiteAuthScreen({ siteId, allowSignup, isPublished, previewBasePath, sitePathPrefix, mode = 'signin' }: SiteAuthScreenProps) {
  const activeMode = !allowSignup && mode === 'signup' ? 'signin' : mode;
  const authPage = await fetchDesignedAuthPage(siteId, isPublished, activeMode);

  if (!authPage || !hasDesignedAuthForm(authPage.pageLayers.layers, activeMode)) {
    return (
      <SiteAuthGate
        siteId={siteId}
        allowSignup={allowSignup}
        defaultMode={activeMode}
      />
    );
  }

  const [generatedCss, colorVariablesCss, globalSettings] = await Promise.all([
    generatePreviewCss(authPage.pageLayers.layers || [], authPage.components),
    isPublished ? Promise.resolve(undefined) : generateColorVariablesCss(),
    isPublished ? fetchPageRenderSettings(siteId) : fetchGlobalPageSettings(),
  ]);

  return (
    <main className="relative min-h-screen">
      <PageRenderer
        page={authPage.page}
        layers={authPage.pageLayers.layers || []}
        components={authPage.components}
        generatedCss={generatedCss || globalSettings.publishedCss || undefined}
        colorVariablesCss={isPublished ? globalSettings.colorVariablesCss || undefined : colorVariablesCss || undefined}
        isPreview={!isPublished}
        previewBasePath={previewBasePath}
        sitePathPrefix={sitePathPrefix}
        locale={authPage.locale}
        availableLocales={authPage.availableLocales}
        translations={authPage.translations}
        globalCustomCodeHead={globalSettings.globalCustomCodeHead}
        globalCustomCodeBody={globalSettings.globalCustomCodeBody}
        ycodeBadge={globalSettings.ycodeBadge}
      />
      <SiteAuthFormInitializer siteId={siteId} />
    </main>
  );
}
