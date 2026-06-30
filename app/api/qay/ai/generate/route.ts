import { NextResponse } from 'next/server';
import type { Layer } from '@/types';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { assembleFromDecision } from '@/qay/lib/ai/assemble-from-decision';
import { generateQayAiHtml, generateQayAiLayers, type AiBuilderMode } from '@/qay/lib/ai/builder';
import { AiProviderFailureError, AiProviderLimitsError } from '@/qay/lib/ai/providers';
import { buildPalettePrompt, enforcePaletteOnHtml, pickPalette } from '@/qay/lib/ai/pick-palette';
import { buildQayPromptFromTemplate, enhancePromptForQay } from '@/qay/lib/ai/prompt-library';
import { detectTemplateChoice } from '@/qay/lib/ai/template-detector';
import { modifyTemplate } from '@/qay/lib/ai/template-modifier';
import { translatePromptToDecision } from '@/qay/lib/ai/translate-prompt';

export const runtime = 'nodejs';

type GenerateRequestBody = {
  prompt?: string;
  mode?: AiBuilderMode;
  output?: 'layers' | 'html';
  selectedLayers?: Layer[];
  variation?: number;
  promptTemplateId?: string;
};

function detectGenerationCapabilities(prompt: string) {
  const p = prompt.toLowerCase();
  const auth = /\b(auth|login|register|signup|signin|sign-in|sign-up|protect|protected|member|membership|portal|dashboard|account)\b/i.test(p);
  const commerce = /\b(ecommerce|e-commerce|shop|store|cart|checkout|product|sell|commerce)\b/i.test(p);
  const cms = /\b(cms|blog|article|articles|author|authors|category|categories|post|posts|directory|listing|listings|collection|collections)\b/i.test(p);

  return {
    auth,
    commerce,
    cms,
    utilityPages: true,
  };
}

function shouldUseContentPages(prompt: string, siteType?: string) {
  if (siteType === 'blog') return true;
  if (siteType === 'real-estate') return false;
  return /\b(cms|blog|article|articles|author|authors|category|categories|post|posts|publication|newsletter|directory)\b/i.test(prompt);
}

function shouldKeepGeneratedPage(pageName: string, pageSlug: string, prompt: string, siteType?: string) {
  const slug = pageSlug.replace(/^\/+/, '').toLowerCase();
  const name = pageName.toLowerCase();
  const wantsContentPages = shouldUseContentPages(prompt, siteType);
  const wantsPolicyPages = /\b(privacy policy|terms of service|legal pages?|policy pages?)\b/i.test(prompt);

  if (['404', 'not-found', 'error-404'].includes(slug) || /\b404\b|not found/.test(name)) return false;
  if (!wantsContentPages && (['blog', 'article', 'articles', 'categories', 'authors', 'author', 'posts', 'post'].includes(slug) || /\b(blog|article|author|categories|posts)\b/.test(name))) return false;
  if (!wantsPolicyPages && (['privacy', 'privacy-policy', 'terms', 'terms-of-service'].includes(slug) || /\b(privacy|terms)\b/.test(name))) return false;
  if (siteType !== 'ecommerce' && ['shop', 'product', 'cart', 'checkout', 'collections'].includes(slug)) return false;
  return true;
}

function findPageWrapperEnd(html: string, startIndex: number) {
  const tagRegex = /<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = startIndex;
  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[0];
    if (tag.startsWith('</')) {
      depth -= 1;
      if (depth === 0) return tagRegex.lastIndex;
    } else if (!tag.endsWith('/>')) {
      depth += 1;
    }
  }

  return -1;
}

function sanitizeGeneratedHtmlPages(html: string, prompt: string, siteType?: string) {
  const wrapperRegex = /<div\b[^>]*data-qay-page=["']([^"']+)["'][^>]*data-qay-slug=["']([^"']*)["'][^>]*>/gi;
  let result = '';
  let cursor = 0;
  let match: RegExpExecArray | null;
  let removedAny = false;

  while ((match = wrapperRegex.exec(html)) !== null) {
    const start = match.index;
    const end = findPageWrapperEnd(html, start);
    if (end === -1) continue;

    result += html.slice(cursor, start);
    if (shouldKeepGeneratedPage(match[1], match[2], prompt, siteType)) {
      result += html.slice(start, end);
    } else {
      removedAny = true;
    }
    cursor = end;
    wrapperRegex.lastIndex = end;
  }

  if (!removedAny) return html;
  return `${result}${html.slice(cursor)}`.trim();
}

function isAiQualityError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('ai response')
    || normalized.includes('qay mobile menu')
    || normalized.includes('required qay')
    || normalized.includes('all ai providers failed')
    || normalized.includes('did not include importable html')
    || normalized.includes('not a usable design')
    || normalized.includes('copy did not match')
    || normalized.includes('missing required')
  );
}

function normalizeTemplatePages(value: unknown) {
  return Array.isArray(value) ? value : [];
}

async function generateFromAiTemplate(prompt: string, variation?: number) {
  const decision = detectTemplateChoice(prompt, variation);
  const admin = getQayAdmin() as any;
  const { data, error } = await admin
    .from('qay_ai_templates')
    .select('id, site_type, theme, label, html, pages, rank')
    .eq('site_type', decision.siteType)
    .eq('is_active', true)
    .order('rank', { ascending: false })
    .limit(8);

  if (error) {
    console.warn('[QAY AI generate] Template lookup failed, falling back:', error.message || error);
    return null;
  }

  const templates = Array.isArray(data) ? data : [];
  const template = templates.find((item: any) => item.theme === decision.theme)
    || templates.find((item: any) => item.theme === 'light')
    || templates[0];

  if (!template?.html) {
    return null;
  }

  const html = await modifyTemplate(String(template.html), prompt, decision);
  return {
    html,
    pages: normalizeTemplatePages(template.pages),
    siteType: decision.siteType,
    theme: decision.theme,
    templateId: template.id,
    templateLabel: template.label,
    provider: 'template-modifier',
    model: 'qay-ai-template',
  };
}

export async function POST(request: Request) {
  try {
    await getQayAuthUser();

    const body = (await request.json()) as GenerateRequestBody;
    const rawPrompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const prompt = enhancePromptForQay(buildQayPromptFromTemplate(body.promptTemplateId || '', rawPrompt));
    const capabilities = detectGenerationCapabilities(prompt);

    if (rawPrompt.length < 4 && !body.promptTemplateId) {
      return NextResponse.json({ error: 'Describe the design you want.' }, { status: 400 });
    }

    const mode = body.mode === 'selected' ? 'selected' : 'page';
    const selectedLayers = Array.isArray(body.selectedLayers) ? body.selectedLayers : [];
    const hexMatches = prompt.match(/#[0-9a-fA-F]{6}/g) || [];
    const paletteChoice = pickPalette(prompt, hexMatches.length
      ? { primary: hexMatches[0], accent: hexMatches[1], bg: hexMatches[2] }
      : undefined);
    const enhancedPrompt = buildPalettePrompt(prompt, paletteChoice);

    if (mode === 'selected' && selectedLayers.length === 0) {
      return NextResponse.json({ error: 'Select a layer before asking AI to redesign it.' }, { status: 400 });
    }

    if (body.output === 'html' && mode === 'page') {
      try {
        const templateResult = await generateFromAiTemplate(prompt, body.variation);
        if (templateResult) {
          const sanitized = sanitizeGeneratedHtmlPages(templateResult.html, prompt, templateResult.siteType);
          const html = enforcePaletteOnHtml(sanitized, paletteChoice);
          console.log('[QAY AI generate] Generated template-modifier HTML:', html);
          return NextResponse.json({
            data: {
              ...templateResult,
              html,
              palette: paletteChoice.paletteKey,
              capabilities,
            },
          });
        }
      } catch (templateError) {
        console.warn('[QAY AI generate] Template modifier unavailable, falling back:', templateError);
      }

      try {
        const decision = await translatePromptToDecision(prompt);
        const { html: rawHtml, pages, stats } = await assembleFromDecision(decision, prompt);
        const sanitized = sanitizeGeneratedHtmlPages(rawHtml, prompt, decision.siteType);
        const html = enforcePaletteOnHtml(sanitized, paletteChoice);
        console.log('[QAY AI generate] Generated section-library-v2 HTML:', html);

        return NextResponse.json({
          data: {
            html,
            pages,
            palette: paletteChoice.paletteKey,
            siteType: decision.siteType,
            navMode: decision.navMode,
            sectionPicks: decision.sectionPicks,
            stats,
            capabilities,
            provider: 'hybrid-section-assembler',
            model: 'prompt-translator',
          },
        });
      } catch (err) {
        console.warn('[AI Generate] Falling back to free-form generation:', err);
      }
    }

    const result = body.output === 'html'
      ? await generateQayAiHtml({ prompt: enhancedPrompt, mode, selectedLayers })
      : await generateQayAiLayers({ prompt, mode, selectedLayers });

    if (body.output === 'html' && 'html' in result) {
      result.html = enforcePaletteOnHtml(sanitizeGeneratedHtmlPages(result.html, prompt), paletteChoice);
      (result as typeof result & { palette?: string }).palette = paletteChoice.paletteKey;
      (result as typeof result & { capabilities?: ReturnType<typeof detectGenerationCapabilities> }).capabilities = capabilities;
      console.log('[QAY AI generate] Generated HTML:', result.html);
    } else if ('layers' in result) {
      (result as typeof result & { capabilities?: ReturnType<typeof detectGenerationCapabilities> }).capabilities = capabilities;
      console.log('[QAY AI generate] Generated layer JSON:', JSON.stringify(result.layers, null, 2));
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not generate this design.';
    const isProviderLimits = error instanceof AiProviderLimitsError;
    const isProviderFailure = error instanceof AiProviderFailureError;
    const isQualityError = isAiQualityError(message);
    const status = message.includes('No AI provider is configured') || isProviderLimits || isProviderFailure
      ? 503
      : isQualityError
        ? 422
        : 500;
    const isDev = process.env.NODE_ENV !== 'production';

    if (isProviderLimits || isProviderFailure) {
      console.error('[QAY AI generate] AI provider failures:', error.failures);
    } else {
      console.error('[QAY AI generate] Error:', error);
    }

    return NextResponse.json(
      {
        error: message.includes('No AI provider is configured')
          ? 'AI is not configured yet. Add at least one AI provider key to use this.'
          : isProviderLimits
            ? 'All AI providers are out of usable quota or rate limited. Add credits, wait for limits to reset, or add another provider key.'
            : isProviderFailure
              ? 'All configured AI providers failed. Check the browser console or server logs for provider details.'
              : isQualityError
                ? message
                : 'AI is busy. Try again shortly.',
        ...(isProviderLimits || isProviderFailure ? {
          code: isProviderLimits ? 'AI_PROVIDER_LIMITS_REACHED' : 'AI_PROVIDERS_FAILED',
          providers: error.failures.map((failure) => ({
            provider: failure.provider,
            message: failure.message,
          })),
        } : {}),
        ...(isDev ? { details: message } : {}),
      },
      { status }
    );
  }
}
