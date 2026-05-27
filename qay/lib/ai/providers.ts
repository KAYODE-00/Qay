type ProviderResult<T = unknown> = {
  text: string;
  provider: string;
  model: string;
  value?: T;
};

type AiProvider = {
  name: string;
  model: string;
  apiKey: string | undefined;
  available: () => boolean;
  call: (prompt: string, system: string) => Promise<string>;
  canRepairJson?: boolean;
};

const DEFAULT_AI_TIMEOUT_MS = Number(process.env.QAY_AI_PROVIDER_TIMEOUT_MS || 18000);
const HTML_AI_TIMEOUT_MS = Number(process.env.QAY_AI_HTML_PROVIDER_TIMEOUT_MS || 12000);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function requestTimeoutMs(system: string) {
  return wantsPlainHtml(system) ? HTML_AI_TIMEOUT_MS : DEFAULT_AI_TIMEOUT_MS;
}

function maxOutputTokens(system: string) {
  return wantsPlainHtml(system) ? 3600 : 6000;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number, providerName: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      const timeoutError = new Error(`${providerName} timed out after ${Math.round(timeoutMs / 1000)}s`) as Error & { status?: number };
      timeoutError.status = 503;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

async function assertOk(response: Response) {
  if (response.ok) return null;

  const body = await readJsonResponse(response);
  const message =
    body?.error?.message ||
    body?.message ||
    body?.raw ||
    `AI provider request failed with status ${response.status}`;
  const error = new Error(message) as Error & { status?: number };
  error.status = response.status;
  throw error;
}

function collectGeminiText(parts: Array<{ text?: string }> | undefined) {
  return (parts || []).map((part) => part.text || '').join('\n').trim();
}

function wantsPlainHtml(system: string) {
  return /return\s+only\s+html/i.test(system);
}

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';

function sortProvidersForRequest(providers: AiProvider[], system: string) {
  if (!wantsPlainHtml(system)) return providers;

  const fastHtmlOrder = ['groq', 'openrouter', 'gemini', 'openai', 'claude'];
  return [...providers].sort((a, b) => {
    const aIndex = fastHtmlOrder.indexOf(a.name);
    const bIndex = fastHtmlOrder.indexOf(b.name);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}

export const PROVIDERS: AiProvider[] = [
  {
    name: 'claude',
    model: 'claude-sonnet-4-20250514',
    apiKey: process.env.ANTHROPIC_API_KEY,
    available: () => Boolean(process.env.ANTHROPIC_API_KEY),
    call: async (prompt: string, system: string) => {
      const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxOutputTokens(system),
          temperature: 0.35,
          system,
          messages: [{ role: 'user', content: prompt }],
        }),
      }, requestTimeoutMs(system), 'Claude');

      await assertOk(response);
      const body = await readJsonResponse(response);
      const text = (body.content || [])
        .filter((part: { type?: string; text?: string }) => part.type === 'text')
        .map((part: { text?: string }) => part.text || '')
        .join('\n')
        .trim();

      if (!text) throw new Error('Claude returned an empty response.');
      return text;
    },
  },
  {
    name: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
    available: () => Boolean(process.env.OPENAI_API_KEY),
    call: async (prompt: string, system: string) => {
      const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: maxOutputTokens(system),
          temperature: 0.35,
          ...(!wantsPlainHtml(system) ? { response_format: { type: 'json_object' } } : {}),
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
        }),
      }, requestTimeoutMs(system), 'OpenAI');

      await assertOk(response);
      const body = await readJsonResponse(response);
      const text = body?.choices?.[0]?.message?.content?.trim();

      if (!text) throw new Error('OpenAI returned an empty response.');
      return text;
    },
  },
  {
    name: 'groq',
    model: GROQ_MODEL,
    apiKey: process.env.GROQ_API_KEY,
    available: () => Boolean(process.env.GROQ_API_KEY),
    canRepairJson: true,
    call: async (prompt: string, system: string) => {
      const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: maxOutputTokens(system),
          temperature: 0.35,
          ...(!wantsPlainHtml(system) ? { response_format: { type: 'json_object' } } : {}),
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
        }),
      }, requestTimeoutMs(system), 'Groq');

      await assertOk(response);
      const body = await readJsonResponse(response);
      const text = body?.choices?.[0]?.message?.content?.trim();

      if (!text) throw new Error('Groq returned an empty response.');
      return text;
    },
  },
  {
    name: 'openrouter',
    model: OPENROUTER_MODEL,
    apiKey: process.env.OPENROUTER_API_KEY,
    available: () => Boolean(process.env.OPENROUTER_API_KEY),
    canRepairJson: true,
    call: async (prompt: string, system: string) => {
      const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
          'http-referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://qay.app',
          'x-title': 'QAY AI Builder',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          max_tokens: maxOutputTokens(system),
          temperature: 0.35,
          ...(!wantsPlainHtml(system) ? { response_format: { type: 'json_object' } } : {}),
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
        }),
      }, requestTimeoutMs(system), 'OpenRouter');

      await assertOk(response);
      const body = await readJsonResponse(response);
      const text = body?.choices?.[0]?.message?.content?.trim();

      if (!text) throw new Error('OpenRouter returned an empty response.');
      return text;
    },
  },
  {
    name: 'gemini',
    model: GEMINI_MODEL,
    apiKey: process.env.GEMINI_API_KEY,
    available: () => Boolean(process.env.GEMINI_API_KEY),
    call: async (prompt: string, system: string) => {
      const response = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY || '')}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: system }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: maxOutputTokens(system),
              ...(!wantsPlainHtml(system) ? { responseMimeType: 'application/json' } : {}),
            },
          }),
        },
        requestTimeoutMs(system),
        'Gemini'
      );

      await assertOk(response);
      const body = await readJsonResponse(response);
      const text = collectGeminiText(body?.candidates?.[0]?.content?.parts);

      if (!text) throw new Error('Gemini returned an empty response.');
      return text;
    },
  },
];

function canTryNextProvider(error: unknown) {
  const status = (error as { status?: number })?.status;
  const message = getErrorMessage(error).toLowerCase();

  return (
    status === 429 ||
    status === 503 ||
    message.includes('rate') ||
    message.includes('quota') ||
    message.includes('credit') ||
    message.includes('balance') ||
    message.includes('billing') ||
    message.includes('payment') ||
    message.includes('insufficient') ||
    message.includes('too low') ||
    message.includes('upgrade') ||
    message.includes('not found') ||
    message.includes('not supported') ||
    message.includes('did not contain a json') ||
    message.includes('invalid layer json') ||
    message.includes('echoed the prompt') ||
    message.includes('not a usable design') ||
    message.includes('overloaded') ||
    message.includes('timed out') ||
    message.includes('aborted') ||
    message.includes('temporarily unavailable')
  );
}

function isInvalidJsonError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('invalid layer json') ||
    message.includes('did not contain a json') ||
    message.includes('expected') ||
    message.includes('unterminated string') ||
    message.includes('bad control character')
  );
}

function buildJsonRepairPrompt(text: string) {
  return `Repair the following malformed QAY/Ycode layer JSON into one valid JSON array.

Rules:
- Return ONLY the corrected JSON array.
- Do not add prose, markdown, explanations, or comments.
- Preserve as much layer content, classes, variables, settings, children, and interactions as possible.
- Remove trailing commas and complete any unterminated strings safely.

Malformed response:
${text}`;
}

export async function callWithFallbackDetailed<T = unknown>(
  prompt: string,
  system: string,
  validate?: (text: string) => T
): Promise<ProviderResult<T>> {
  const available = sortProvidersForRequest(PROVIDERS.filter((provider) => provider.available()), system);
  const failures: string[] = [];

  for (const provider of available) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const text = await provider.call(prompt, system);
      let value: T | undefined;

      if (validate) {
        try {
          value = validate(text);
        } catch (validationError) {
          if (!provider.canRepairJson || !isInvalidJsonError(validationError)) {
            throw validationError;
          }

          console.warn(`[AI] ${provider.name} returned malformed JSON. Attempting repair...`);
          const repairedText = await provider.call(
            buildJsonRepairPrompt(text),
            'You repair malformed JSON. Return only valid JSON and no prose.'
          );
          value = validate(repairedText);
          console.log(`[AI] Repaired JSON from ${provider.name}`);
          return { text: repairedText, provider: provider.name, model: provider.model, value };
        }
      }

      console.log(`[AI] Success with ${provider.name}`);
      return { text, provider: provider.name, model: provider.model, value };
    } catch (error) {
      failures.push(`${provider.name}: ${getErrorMessage(error)}`);

      if (canTryNextProvider(error)) {
        console.warn(`[AI] ${provider.name} failed: ${getErrorMessage(error)}. Trying next...`);
        continue;
      }

      throw error;
    }
  }

  if (available.length === 0) {
    throw new Error('No AI provider is configured. Add an Anthropic, OpenAI, Groq, OpenRouter, or Gemini API key.');
  }

  throw new Error(`All AI providers failed or are rate limited. ${failures.join(' | ')}`);
}

export async function callWithFallback(prompt: string, system: string): Promise<string> {
  const result = await callWithFallbackDetailed(prompt, system);
  return result.text;
}
