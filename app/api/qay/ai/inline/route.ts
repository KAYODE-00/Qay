import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { AiProviderFailureError, AiProviderLimitsError, callWithFallbackDetailed } from '@/qay/lib/ai/providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type InlineAiScope = 'text' | 'section' | 'page-append';

type InlineAiRequest = {
  prompt?: string;
  scope?: InlineAiScope;
  currentHtml?: string;
  siteContext?: string;
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:html|text)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function sanitizeHtml(html: string) {
  return stripCodeFence(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '');
}

function assertSectionHtml(html: string, scope: InlineAiScope) {
  const lower = html.toLowerCase();
  if (!html.includes('<') || !html.includes('>')) {
    throw new Error('Inline AI did not return HTML.');
  }
  if (lower.includes('<html') || lower.includes('<body') || lower.includes('<!doctype')) {
    throw new Error('Inline AI must return scoped HTML, not a full page document.');
  }
  if (/<script\b/i.test(html) || /\son[a-z]+\s*=/i.test(html)) {
    throw new Error('Inline AI returned unsupported script behavior.');
  }
  if (scope === 'page-append') {
    const sectionLikeCount = (html.match(/<(section|nav|footer|article|aside|div)\b/gi) || []).length;
    if (sectionLikeCount < 1) {
      throw new Error('Inline AI did not return a usable section.');
    }
  }
}

function normalizeScope(value: unknown): InlineAiScope {
  return value === 'text' || value === 'section' || value === 'page-append' ? value : 'page-append';
}

function buildTextPrompt(currentText: string, instruction: string, siteContext: string) {
  return [
    `Instruction: ${instruction}`,
    siteContext ? `Site context: ${siteContext}` : '',
    `Current text: ${currentText}`,
    '',
    'Rewrite only the selected text. Return plain text only.',
  ].filter(Boolean).join('\n');
}

function buildSectionPrompt(currentHtml: string, instruction: string, siteContext: string) {
  return [
    `Instruction: ${instruction}`,
    siteContext ? `Site context: ${siteContext}` : '',
    'Selected section HTML:',
    currentHtml,
    '',
    'Modify only this section. Keep existing QAY data attributes and useful Tailwind classes. Return only the updated section HTML.',
  ].filter(Boolean).join('\n');
}

function buildAppendPrompt(instruction: string, siteContext: string) {
  return [
    `Requested new section: ${instruction}`,
    siteContext ? `Site context: ${siteContext}` : '',
    '',
    'Generate exactly one new editable website section. Use Tailwind classes, semantic HTML, and data-qay-animate where useful. Return only section HTML.',
  ].filter(Boolean).join('\n');
}

function providerStatus(error: unknown) {
  if (error instanceof AiProviderLimitsError) return 503;
  if (error instanceof AiProviderFailureError) return 503;
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('no ai provider')) return 503;
  if (message.includes('inline ai')) return 422;
  return 500;
}

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as InlineAiRequest | null;
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    const currentHtml = typeof body?.currentHtml === 'string' ? body.currentHtml.trim() : '';
    const siteContext = typeof body?.siteContext === 'string' ? body.siteContext.trim().slice(0, 1200) : '';
    const scope = normalizeScope(body?.scope);

    if (prompt.length < 3) {
      return NextResponse.json({ error: 'Tell AI what to change.' }, { status: 400 });
    }

    if ((scope === 'text' || scope === 'section') && currentHtml.length === 0) {
      return NextResponse.json({ error: 'Current HTML is required for the selected scope.' }, { status: 400 });
    }

    if (scope === 'text') {
      const currentText = stripHtml(currentHtml);
      const result = await callWithFallbackDetailed(
        buildTextPrompt(currentText, prompt, siteContext),
        [
          'You rewrite selected website copy.',
          'Return plain text only.',
          'No markdown, no quotes, no HTML, no explanations.',
          'Keep the result concise and specific to the site context.',
        ].join('\n')
      );

      return NextResponse.json({
        data: {
          type: 'text',
          content: stripHtml(result.text),
          provider: result.provider,
          model: result.model,
        },
      });
    }

    const system = [
      'You are QAY inline AI for a visual website builder.',
      'Return only HTML.',
      'Use Tailwind classes.',
      'Do not return markdown fences or explanations.',
      'Do not include scripts, onclick handlers, external scripts, or unsupported behavior.',
      'Use QAY attributes such as data-qay-animate, data-qay-hover, and data-qay-click only when useful.',
      'Never regenerate a whole website unless the user selected a whole website section.',
    ].join('\n');

    const result = await callWithFallbackDetailed(
      scope === 'section'
        ? buildSectionPrompt(currentHtml, prompt, siteContext)
        : buildAppendPrompt(prompt, siteContext),
      system
    );
    const html = sanitizeHtml(result.text);
    assertSectionHtml(html, scope);

    return NextResponse.json({
      data: {
        type: 'html',
        content: html,
        provider: result.provider,
        model: result.model,
      },
    });
  } catch (error) {
    const status = providerStatus(error);
    const message = error instanceof Error ? error.message : 'Inline AI is unavailable.';

    if (error instanceof AiProviderLimitsError || error instanceof AiProviderFailureError) {
      console.error('[QAY inline AI] Provider failures:', error.failures);
    } else {
      console.error('[QAY inline AI] Error:', error);
    }

    return NextResponse.json(
      {
        error: error instanceof AiProviderLimitsError
          ? 'All AI providers are out of usable quota or rate limited.'
          : error instanceof AiProviderFailureError
            ? 'All configured AI providers failed.'
            : status === 422
              ? message
              : 'Inline AI is busy. Try again shortly.',
        ...(error instanceof AiProviderLimitsError || error instanceof AiProviderFailureError ? {
          providers: error.failures.map((failure) => ({
            provider: failure.provider,
            message: failure.message,
          })),
        } : {}),
        ...(process.env.NODE_ENV !== 'production' ? { details: message } : {}),
      },
      { status }
    );
  }
}
