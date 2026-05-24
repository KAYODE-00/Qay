type ProviderResult = {
  text: string;
  provider: string;
  model: string;
};

type AiProvider = {
  name: string;
  model: string;
  apiKey: string | undefined;
  available: () => boolean;
  call: (prompt: string, system: string) => Promise<string>;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
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

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';

export const PROVIDERS: AiProvider[] = [
  {
    name: 'claude',
    model: 'claude-sonnet-4-20250514',
    apiKey: process.env.ANTHROPIC_API_KEY,
    available: () => Boolean(process.env.ANTHROPIC_API_KEY),
    call: async (prompt: string, system: string) => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 6000,
          temperature: 0.35,
          system,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          temperature: 0.35,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
        }),
      });

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
    call: async (prompt: string, system: string) => {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.35,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
        }),
      });

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
    call: async (prompt: string, system: string) => {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
          'http-referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://qay.app',
          'x-title': 'QAY AI Builder',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          temperature: 0.35,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
        }),
      });

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
      const response = await fetch(
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
              maxOutputTokens: 6000,
            },
          }),
        }
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
    message.includes('overloaded') ||
    message.includes('temporarily unavailable')
  );
}

export async function callWithFallbackDetailed(prompt: string, system: string): Promise<ProviderResult> {
  const available = PROVIDERS.filter((provider) => provider.available());
  const failures: string[] = [];

  for (const provider of available) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const text = await provider.call(prompt, system);
      console.log(`[AI] Success with ${provider.name}`);
      return { text, provider: provider.name, model: provider.model };
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
