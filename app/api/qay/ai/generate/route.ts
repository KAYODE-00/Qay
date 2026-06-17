import { NextResponse } from 'next/server';
import type { Layer } from '@/types';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { assembleFromDecision } from '@/qay/lib/ai/assemble-from-decision';
import { generateQayAiHtml, generateQayAiLayers, type AiBuilderMode } from '@/qay/lib/ai/builder';
import { AiProviderFailureError, AiProviderLimitsError } from '@/qay/lib/ai/providers';
import { translatePromptToDecision } from '@/qay/lib/ai/translate-prompt';

export const runtime = 'nodejs';

type GenerateRequestBody = {
  prompt?: string;
  mode?: AiBuilderMode;
  output?: 'layers' | 'html';
  selectedLayers?: Layer[];
};

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

export async function POST(request: Request) {
  try {
    await getQayAuthUser();

    const body = (await request.json()) as GenerateRequestBody;
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

    if (prompt.length < 4) {
      return NextResponse.json({ error: 'Describe the design you want.' }, { status: 400 });
    }

    const mode = body.mode === 'selected' ? 'selected' : 'page';
    const selectedLayers = Array.isArray(body.selectedLayers) ? body.selectedLayers : [];

    if (mode === 'selected' && selectedLayers.length === 0) {
      return NextResponse.json({ error: 'Select a layer before asking AI to redesign it.' }, { status: 400 });
    }

    if (body.output === 'html' && mode === 'page') {
      try {
        const decision = await translatePromptToDecision(prompt);
        const { html, pages } = await assembleFromDecision(decision);
        console.log('[QAY AI generate] Generated section-library-v2 HTML:', html);

        return NextResponse.json({
          data: {
            html,
            pages,
            siteType: decision.siteType,
            navMode: decision.navMode,
            sectionPicks: decision.sectionPicks,
            provider: 'section-library-v2',
            model: 'prompt-translator',
          },
        });
      } catch (err) {
        console.warn('[AI Generate] Falling back to free-form generation:', err);
      }
    }

    const result = body.output === 'html'
      ? await generateQayAiHtml({ prompt, mode, selectedLayers })
      : await generateQayAiLayers({ prompt, mode, selectedLayers });

    if (body.output === 'html' && 'html' in result) {
      console.log('[QAY AI generate] Generated HTML:', result.html);
    } else if ('layers' in result) {
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
