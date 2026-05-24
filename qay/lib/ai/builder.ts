import type { Layer } from '@/types';
import { generateId } from '@/lib/utils';
import { createDynamicTextVariable, createStaticTextVariable } from '@/lib/variable-utils';
import { callWithFallbackDetailed } from '@/qay/lib/ai/providers';

export type AiBuilderMode = 'page' | 'selected';

type GenerateAiLayersInput = {
  prompt: string;
  mode?: AiBuilderMode;
  selectedLayers?: Layer[];
};

type GenerateAiLayersResult = {
  layers: Layer[];
  provider: string;
  model: string;
};

const ALLOWED_LAYER_NAMES = new Set([
  'div',
  'text',
  'richText',
  'image',
  'button',
  'section',
  'nav',
  'footer',
  'link',
  'icon',
  'video',
]);

export const QAY_AI_BUILDER_SYSTEM_PROMPT = `You are a website builder AI for QAY.
Generate valid Ycode layer JSON from the user's description.

Layer JSON shape:
{
  "id": "lyr_[8 random chars]",
  "name": "div" | "text" | "image" | "button" | "section" | "nav" | "footer",
  "settings": { "tag": "div" | "h1" | "p" | "a" | "img" | "button" },
  "classes": "Tailwind classes",
  "children": [],
  "variables": {
    "text": { "type": "dynamic_text", "data": { "content": "text here" } }
  }
}

Rules:
- Return ONLY a valid JSON array of layers. No prose and no markdown fences.
- Use only Tailwind CSS classes.
- Use responsive classes such as sm:, md:, and lg: where useful.
- For full page generation, always include nav, hero, 2 or 3 content sections, and footer inside one root div layer.
- For selected-layer redesign, return one replacement layer for each selected layer, in the same order.
- Keep links as relative paths when linking to other pages, for example "/about".
- Images should use Unsplash URLs such as "https://images.unsplash.com/photo-...?...".
- Do not include scripts, event handlers, external JavaScript, or dangerous HTML.
- Prefer polished, production-ready copy and spacing.`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function inferTag(name: string) {
  if (name === 'text') return 'p';
  if (name === 'button') return 'button';
  if (name === 'image') return 'img';
  if (name === 'nav') return 'nav';
  if (name === 'footer') return 'footer';
  if (name === 'section') return 'section';
  return 'div';
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function sanitizeClasses(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').join(' ');
  }

  return toStringValue(value);
}

function sanitizePlainObject(value: unknown) {
  if (!isRecord(value)) return undefined;

  return Object.fromEntries(
    Object.entries(value).filter(([key, entry]) => {
      if (key.toLowerCase().startsWith('on')) return false;
      if (typeof entry === 'function') return false;
      return true;
    })
  );
}

function normalizeTextVariable(value: unknown) {
  if (isRecord(value) && isRecord(value.data)) {
    const content = value.data.content;
    if (typeof content === 'string') {
      return createDynamicTextVariable(content);
    }
  }

  if (typeof value === 'string') {
    return createDynamicTextVariable(value);
  }

  return undefined;
}

function normalizeVariables(value: unknown, layerName: string) {
  const variables = isRecord(value) ? { ...value } : {};
  const text = normalizeTextVariable(variables.text);

  if (text) {
    variables.text = text;
  }

  if (!text && (layerName === 'text' || layerName === 'button')) {
    variables.text = createDynamicTextVariable(layerName === 'button' ? 'Button' : 'Text');
  }

  if (layerName === 'image') {
    const image = isRecord(variables.image) ? variables.image : {};
    const src =
      normalizeTextVariable(image.src) ||
      normalizeTextVariable(variables.src) ||
      createStaticTextVariable('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80');
    const alt = normalizeTextVariable(image.alt) || createDynamicTextVariable('Generated image');
    variables.image = { ...image, src, alt };
  }

  return variables;
}

function normalizeLayer(input: unknown, usedIds: Set<string>): Layer {
  const raw = isRecord(input) ? input : {};
  const rawName = toStringValue(raw.name, 'div');
  const name = ALLOWED_LAYER_NAMES.has(rawName) ? rawName : 'div';
  const id = toStringValue(raw.id).trim() || generateId('lyr');
  const safeId = usedIds.has(id) ? generateId('lyr') : id;
  usedIds.add(safeId);

  const settings = sanitizePlainObject(raw.settings) || {};
  const attributes = sanitizePlainObject(raw.attributes);
  const children = Array.isArray(raw.children)
    ? raw.children.map((child) => normalizeLayer(child, usedIds))
    : undefined;

  return {
    id: safeId,
    name,
    customName: toStringValue(raw.customName) || undefined,
    settings: {
      tag: toStringValue((settings as { tag?: unknown }).tag, inferTag(name)),
      ...settings,
    },
    attributes,
    classes: sanitizeClasses(raw.classes),
    design: sanitizePlainObject(raw.design),
    variables: normalizeVariables(raw.variables, name) as Layer['variables'],
    children,
  };
}

function extractJsonArray(text: string) {
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = trimmed.indexOf('[');
  const end = trimmed.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI response did not contain a JSON layer array.');
  }

  return JSON.parse(trimmed.slice(start, end + 1));
}

export function normalizeAiLayers(value: unknown): Layer[] {
  if (!Array.isArray(value)) {
    throw new Error('AI response must be a JSON array of layers.');
  }

  const usedIds = new Set<string>();
  const layers = value.map((layer) => normalizeLayer(layer, usedIds));

  if (layers.length === 0) {
    throw new Error('AI response did not include any layers.');
  }

  return layers;
}

function buildPrompt({ prompt, mode = 'page', selectedLayers = [] }: GenerateAiLayersInput) {
  if (mode === 'selected') {
    return `Redesign the selected Ycode layer(s) below based on this instruction:

${prompt}

Selected layer JSON:
${JSON.stringify(selectedLayers, null, 2)}

Return a JSON array with exactly ${Math.max(selectedLayers.length, 1)} replacement layer(s).`;
  }

  return `Build a complete QAY website page from this prompt:

${prompt}`;
}

export async function generateQayAiLayers(input: GenerateAiLayersInput): Promise<GenerateAiLayersResult> {
  const providerResult = await callWithFallbackDetailed(
    buildPrompt(input),
    QAY_AI_BUILDER_SYSTEM_PROMPT
  );
  const parsed = extractJsonArray(providerResult.text);
  const layers = normalizeAiLayers(parsed);

  return {
    layers,
    provider: providerResult.provider,
    model: providerResult.model,
  };
}
