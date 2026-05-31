import { NextResponse } from 'next/server';
import type { Layer } from '@/types';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { generateQayAiHtml, generateQayAiLayers, type AiBuilderMode } from '@/qay/lib/ai/builder';
import { AiProviderLimitsError } from '@/qay/lib/ai/providers';

export const runtime = 'nodejs';

type GenerateRequestBody = {
  prompt?: string;
  mode?: AiBuilderMode;
  output?: 'layers' | 'html';
  selectedLayers?: Layer[];
};

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

    const result = body.output === 'html'
      ? await generateQayAiHtml({ prompt, mode, selectedLayers })
      : await generateQayAiLayers({ prompt, mode, selectedLayers });

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not generate this design.';
    const isProviderLimits = error instanceof AiProviderLimitsError;
    const status = message.includes('No AI provider is configured') || isProviderLimits ? 503 : 500;
    const isDev = process.env.NODE_ENV !== 'production';

    if (isProviderLimits) {
      console.error('[QAY AI generate] All AI provider limits reached:', error.failures);
    } else {
      console.error('[QAY AI generate] Error:', error);
    }

    return NextResponse.json(
      {
        error: message.includes('No AI provider is configured')
          ? 'AI is not configured yet. Add at least one AI provider key to use this.'
          : isProviderLimits
            ? 'All AI providers are out of usable quota or rate limited. Add credits, wait for limits to reset, or add another provider key.'
          : 'AI is busy. Try again shortly.',
        ...(isProviderLimits ? {
          code: 'AI_PROVIDER_LIMITS_REACHED',
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
