import { NextResponse } from 'next/server';
import type { Layer } from '@/types';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { generateQayAiLayers, type AiBuilderMode } from '@/qay/lib/ai/builder';

export const runtime = 'nodejs';

type GenerateRequestBody = {
  prompt?: string;
  mode?: AiBuilderMode;
  selectedLayers?: Layer[];
};

export async function POST(request: Request) {
  try {
    await getQayAuthUser();

    const body = (await request.json()) as GenerateRequestBody;
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

    if (prompt.length < 4) {
      return NextResponse.json({ error: 'Describe what you want QAY to design.' }, { status: 400 });
    }

    const mode = body.mode === 'selected' ? 'selected' : 'page';
    const selectedLayers = Array.isArray(body.selectedLayers) ? body.selectedLayers : [];

    if (mode === 'selected' && selectedLayers.length === 0) {
      return NextResponse.json({ error: 'Select a layer before asking QAY to redesign it.' }, { status: 400 });
    }

    const result = await generateQayAiLayers({ prompt, mode, selectedLayers });

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'QAY could not generate this design.';
    const status = message.includes('No AI provider is configured') ? 503 : 500;

    console.error('[QAY AI generate] Error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
