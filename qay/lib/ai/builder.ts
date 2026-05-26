import type { Breakpoint, InteractionApplyStyles, InteractionTween, Layer, LayerInteraction, TweenProperties } from '@/types';
import { generateId } from '@/lib/utils';
import { createDynamicTextVariable, createStaticTextVariable } from '@/lib/variable-utils';
import { callWithFallbackDetailed } from '@/qay/lib/ai/providers';
import { layersContainPromptLeak } from '@/qay/lib/ai/prompt-leak';

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
  'heading',
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

type AiInteractionTrigger = LayerInteraction['trigger'];

const ALLOWED_INTERACTION_TRIGGERS = new Set<AiInteractionTrigger>(['click', 'hover', 'scroll-into-view', 'while-scrolling', 'load']);
const ALLOWED_TWEEN_KEYS = new Set(['x', 'y', 'rotation', 'scale', 'skewX', 'skewY', 'autoAlpha', 'display', 'width', 'height']);
const ALLOWED_BREAKPOINTS = new Set(['mobile', 'tablet', 'desktop']);

export const QAY_AI_BUILDER_SYSTEM_PROMPT = `You are a website builder AI for QAY.
Generate valid Ycode layer JSON from the user's description.
You are also an elite frontend engineer, brand designer, and motion designer. The generated page must feel production-ready, intentional, and visually specific to the user's prompt.

Layer JSON shape:
{
  "id": "lyr_[8 random chars]",
  "name": "div" | "heading" | "text" | "richText" | "image" | "button" | "section" | "nav" | "footer",
  "settings": { "tag": "div" | "h1" | "p" | "a" | "img" | "button" },
  "classes": "Tailwind classes",
  "children": [],
  "variables": {
    "text": { "type": "dynamic_text", "data": { "content": "text here" } }
  },
  "interactions": []
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
- Prefer polished, production-ready copy and spacing.
- Add tasteful interactions where useful. Use Ycode's interactions array only, never JavaScript.

Design quality rules:
- Treat the user's visual/aesthetic instructions as mandatory, especially palette, mood, layout style, typography scale, and section structure.
- Never generate a plain stack of generic gray boxes, bare grids, or boilerplate cards unless the user explicitly asks for that.
- Use strong composition: max-width containers, asymmetric grids, editorial whitespace, subtle borders, layered sections, and varied card sizes.
- Use real hierarchy and art direction: oversized hero type, precise max-widths, purposeful negative space, alternating section rhythms, and cards that differ in span/scale.
- Prefer premium palettes with exact arbitrary Tailwind colors such as bg-[#11141A], text-[#F6F3ED], border-white/10, and bg-white/5 when requested.
- Use high-quality spacing: generous section padding, consistent gaps, and responsive constraints. Avoid viewport-scaled font sizes.
- Use high-contrast text/background pairs. If the user specifies colors, use those exact hex values in Tailwind arbitrary values, for example bg-[#11141A].
- For premium dark/light sites, avoid default blue links. Use black, white, bone, charcoal, or the user's requested accent colors.
- Use headings with "name": "heading" and text with "name": "text" so QAY can edit them.
- Every text-like layer must have variables.text content; buttons and links should also have editable text.
- Buttons/links should include settings.href or variables.link where relevant, but keep internal routes relative.
- Prefer semantic sections and clear hierarchy over shallow wrappers.

Interaction JSON:
{
  "id": "int_[8 random chars]",
  "trigger": "load" | "hover" | "scroll-into-view" | "while-scrolling" | "click",
  "timeline": {
    "breakpoints": ["mobile", "tablet", "desktop"],
    "repeat": 0,
    "yoyo": false,
    "scrollStart": "top 80%",
    "toggleActions": "play none none none"
  },
  "tweens": [{
    "id": "anm_[8 random chars]",
    "layer_id": "target layer id",
    "position": 0,
    "duration": 0.6,
    "ease": "power2.out",
    "from": { "y": "24px", "autoAlpha": "0" },
    "to": { "y": "0px", "autoAlpha": "100" },
    "apply_styles": { "y": "on-load", "autoAlpha": "on-load" }
  }]
}

Interaction rules:
- Add load or scroll-into-view interactions to hero headings, major cards, and timeline rows.
- Add hover interactions to buttons/cards sparingly with small scale or y movement.
- Use only safe tween keys: x, y, rotation, scale, skewX, skewY, autoAlpha, display, width, height.
- Target existing layer ids only. If unsure, target the layer that owns the interaction.
- Keep motion subtle and premium: 0.35s to 0.8s, power1.out or power2.out, y 12px-40px, autoAlpha 0 to 100.
- Do not animate every single layer.

Portfolio/site-specific guidance:
- If the user asks for a portfolio, create a distinctive hero, bento project showcase, skills/architecture matrix, public-build log, and contact footer.
- Project cards should not all look identical; vary span, density, alignment, and emphasis.
- Timeline/log sections should look like a journal or changelog, not a plain bullet list.
- Add small premium details like status dots, eyebrow labels, metadata rows, mono-style badges, and crisp divider lines.`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function inferTag(name: string) {
  if (name === 'heading') return 'h2';
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

function collectLayerIdsFromRaw(input: unknown, ids = new Set<string>()) {
  if (!isRecord(input)) return ids;

  const id = toStringValue(input.id).trim();
  if (id) ids.add(id);

  if (Array.isArray(input.children)) {
    input.children.forEach((child) => collectLayerIdsFromRaw(child, ids));
  }

  return ids;
}

function sanitizeTweenProperties(value: unknown): TweenProperties {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(([key, entry]) =>
      ALLOWED_TWEEN_KEYS.has(key) &&
      (typeof entry === 'string' || entry === null)
    )
  ) as TweenProperties;
}

function sanitizeApplyStyles(value: unknown): InteractionApplyStyles {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(([key, entry]) =>
      ALLOWED_TWEEN_KEYS.has(key) &&
      (entry === 'on-load' || entry === 'on-trigger')
    )
  ) as InteractionApplyStyles;
}

function sanitizeSplitText(value: unknown): InteractionTween['splitText'] {
  if (!isRecord(value)) return undefined;
  const type = toStringValue(value.type);
  if (type !== 'chars' && type !== 'words' && type !== 'lines') return undefined;
  const stagger = isRecord(value.stagger) && typeof value.stagger.amount === 'number'
    ? { amount: value.stagger.amount }
    : { amount: 0.35 };

  return { type, stagger };
}

function sanitizeTimeline(value: unknown, trigger: AiInteractionTrigger) {
  const raw = isRecord(value) ? value : {};
  const breakpoints = Array.isArray(raw.breakpoints)
    ? raw.breakpoints.filter((breakpoint): breakpoint is Breakpoint =>
      typeof breakpoint === 'string' && ALLOWED_BREAKPOINTS.has(breakpoint)
    )
    : (['mobile', 'tablet', 'desktop'] as Breakpoint[]);

  return {
    breakpoints: breakpoints.length ? breakpoints : (['mobile', 'tablet', 'desktop'] as Breakpoint[]),
    repeat: typeof raw.repeat === 'number' ? raw.repeat : 0,
    yoyo: typeof raw.yoyo === 'boolean' ? raw.yoyo : false,
    ...(trigger === 'scroll-into-view' || trigger === 'while-scrolling'
      ? { scrollStart: toStringValue(raw.scrollStart, trigger === 'while-scrolling' ? 'top bottom' : 'top 80%') }
      : {}),
    ...(trigger === 'scroll-into-view'
      ? { toggleActions: toStringValue(raw.toggleActions, 'play none none none') }
      : {}),
    ...(trigger === 'while-scrolling'
      ? {
        scrollEnd: toStringValue(raw.scrollEnd, 'bottom top'),
        scrub: typeof raw.scrub === 'number' || typeof raw.scrub === 'boolean' ? raw.scrub : 1,
      }
      : {}),
  };
}

function sanitizeInteractions(value: unknown, ownerLayerId: string, validLayerIds: Set<string>) {
  if (!Array.isArray(value)) return undefined;

  const interactions = value
    .filter(isRecord)
    .map((rawInteraction) => {
      const trigger = toStringValue(rawInteraction.trigger, 'scroll-into-view');
      const safeTrigger: AiInteractionTrigger = ALLOWED_INTERACTION_TRIGGERS.has(trigger as AiInteractionTrigger)
        ? trigger as AiInteractionTrigger
        : 'scroll-into-view';
      const tweens = Array.isArray(rawInteraction.tweens)
        ? rawInteraction.tweens.filter(isRecord).map((rawTween): InteractionTween => {
          const rawLayerId = toStringValue(rawTween.layer_id, ownerLayerId);
          const layerId = validLayerIds.has(rawLayerId) ? rawLayerId : ownerLayerId;

          return {
            id: toStringValue(rawTween.id).trim() || generateId('anm'),
            layer_id: layerId,
            position: typeof rawTween.position === 'number' || typeof rawTween.position === 'string' ? rawTween.position : 0,
            duration: typeof rawTween.duration === 'number' ? Math.min(Math.max(rawTween.duration, 0.1), 3) : 0.6,
            ease: toStringValue(rawTween.ease, 'power2.out'),
            from: sanitizeTweenProperties(rawTween.from),
            to: sanitizeTweenProperties(rawTween.to),
            apply_styles: sanitizeApplyStyles(rawTween.apply_styles),
            ...(sanitizeSplitText(rawTween.splitText) ? { splitText: sanitizeSplitText(rawTween.splitText) } : {}),
          };
        }) : [];

      return {
        id: toStringValue(rawInteraction.id).trim() || generateId('int'),
        trigger: safeTrigger,
        timeline: sanitizeTimeline(rawInteraction.timeline, safeTrigger),
        tweens,
      };
    })
    .filter((interaction) => interaction.tweens.length > 0);

  return interactions.length > 0 ? interactions : undefined;
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

  if (!text && (layerName === 'heading' || layerName === 'text' || layerName === 'button' || layerName === 'richText')) {
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

function shouldEnableTextEditing(layerName: string, settings: Record<string, unknown>) {
  const tag = toStringValue(settings.tag).toLowerCase();

  return (
    layerName === 'heading' ||
    layerName === 'text' ||
    layerName === 'button' ||
    layerName === 'richText' ||
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button'].includes(tag)
  );
}

function normalizeLayer(input: unknown, usedIds: Set<string>, validLayerIds: Set<string>): Layer {
  const raw = isRecord(input) ? input : {};
  const rawName = toStringValue(raw.name, 'div');
  const name = ALLOWED_LAYER_NAMES.has(rawName) ? rawName : 'div';
  const id = toStringValue(raw.id).trim() || generateId('lyr');
  const safeId = usedIds.has(id) ? generateId('lyr') : id;
  usedIds.add(safeId);

  const settings = sanitizePlainObject(raw.settings) || {};
  const attributes = sanitizePlainObject(raw.attributes);
  const restrictions = sanitizePlainObject(raw.restrictions) || {};
  const children = Array.isArray(raw.children)
    ? raw.children.map((child) => normalizeLayer(child, usedIds, validLayerIds))
    : undefined;
  const normalizedSettings = {
    tag: toStringValue((settings as { tag?: unknown }).tag, inferTag(name)),
    ...settings,
  };

  return {
    id: safeId,
    name,
    customName: toStringValue(raw.customName) || undefined,
    settings: normalizedSettings,
    attributes,
    classes: sanitizeClasses(raw.classes),
    design: sanitizePlainObject(raw.design),
    restrictions: {
      ...restrictions,
      ...(shouldEnableTextEditing(name, normalizedSettings) ? { editText: true } : {}),
    },
    variables: normalizeVariables(raw.variables, name) as Layer['variables'],
    interactions: sanitizeInteractions(raw.interactions, safeId, validLayerIds),
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

  const json = trimmed.slice(start, end + 1);

  try {
    return JSON.parse(json);
  } catch (strictError) {
    const repaired = json
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/([{,]\s*)([A-Za-z_$][\w$-]*)(\s*:)/g, '$1"$2"$3')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");

    try {
      return JSON.parse(repaired);
    } catch {
      const message = strictError instanceof Error ? strictError.message : 'Invalid JSON';
      throw new Error(`AI returned invalid layer JSON. Please try again. Details: ${message}`);
    }
  }
}

export function normalizeAiLayers(value: unknown): Layer[] {
  if (!Array.isArray(value)) {
    throw new Error('AI response must be a JSON array of layers.');
  }

  const usedIds = new Set<string>();
  const validLayerIds = value.reduce((ids, layer) => collectLayerIdsFromRaw(layer, ids), new Set<string>());
  const layers = value.map((layer) => normalizeLayer(layer, usedIds, validLayerIds));

  if (layers.length === 0) {
    throw new Error('AI response did not include any layers.');
  }

  if (layersContainPromptLeak(layers)) {
    throw new Error('AI echoed the prompt instead of returning a usable design.');
  }

  return layers;
}

function getLayerText(layer: Layer): string[] {
  const variables = layer.variables as Record<string, unknown> | undefined;
  const textVariable = variables?.text;
  const textContent =
    isRecord(textVariable) && isRecord(textVariable.data) && typeof textVariable.data.content === 'string'
      ? textVariable.data.content
      : '';

  return [
    textContent,
    ...(Array.isArray(layer.children) ? layer.children.flatMap((child) => getLayerText(child)) : []),
  ].filter(Boolean);
}

function normalizeComparisonText(value: string) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, ' and ')
    .replace(/&quot;|&#034;|&#34;/g, ' ')
    .replace(/&#039;|&#39;|&apos;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[#*_`>"'’“”.,:;!?()[\]{}-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function promptOverlapScore(promptText: string, combinedText: string) {
  const promptWords = Array.from(new Set(promptText.split(' ').filter((word) => word.length > 5)));
  if (promptWords.length === 0) return 0;

  const matchedWords = promptWords.filter((word) => combinedText.includes(word));
  return matchedWords.length / promptWords.length;
}

function hasAnyInteractions(layers: Layer[]): boolean {
  return layers.some((layer) => Boolean(layer.interactions?.length) || (layer.children ? hasAnyInteractions(layer.children) : false));
}

function addDefaultInteractions(layers: Layer[]) {
  let entranceCount = 0;

  const enhance = (layer: Layer, depth = 0): Layer => {
    const children = layer.children?.map((child) => enhance(child, depth + 1));
    const shouldAnimateEntrance =
      entranceCount < 8 &&
      depth > 0 &&
      ['heading', 'text', 'section', 'div', 'footer'].includes(layer.name);
    const shouldAnimateHover = layer.name === 'button' || layer.name === 'link';
    const interactions: LayerInteraction[] = [...(layer.interactions || [])];

    if (shouldAnimateEntrance) {
      entranceCount += 1;
      interactions.push({
        id: generateId('int'),
        trigger: entranceCount <= 2 ? 'load' : 'scroll-into-view',
        timeline: {
          breakpoints: ['mobile', 'tablet', 'desktop'],
          repeat: 0,
          yoyo: false,
          ...(entranceCount > 2 ? { scrollStart: 'top 85%', toggleActions: 'play none none none' } : {}),
        },
        tweens: [{
          id: generateId('anm'),
          layer_id: layer.id,
          position: 0,
          duration: layer.name === 'heading' ? 0.75 : 0.55,
          ease: 'power2.out',
          from: { y: layer.name === 'heading' ? '32px' : '20px', autoAlpha: '0' },
          to: { y: '0px', autoAlpha: '100' },
          apply_styles: { y: 'on-load', autoAlpha: 'on-load' },
        }],
      });
    }

    if (shouldAnimateHover) {
      interactions.push({
        id: generateId('int'),
        trigger: 'hover',
        timeline: {
          breakpoints: ['mobile', 'tablet', 'desktop'],
          repeat: 0,
          yoyo: true,
        },
        tweens: [{
          id: generateId('anm'),
          layer_id: layer.id,
          position: 0,
          duration: 0.25,
          ease: 'power1.out',
          from: { y: '0px', scale: '1' },
          to: { y: '-2px', scale: '1.02' },
          apply_styles: { y: 'on-trigger', scale: 'on-trigger' },
        }],
      });
    }

    return {
      ...layer,
      ...(children ? { children } : {}),
      ...(interactions.length ? { interactions } : {}),
    };
  };

  return layers.map((layer) => enhance(layer));
}

function assertUsableAiLayers(layers: Layer[], userPrompt: string, mode: AiBuilderMode) {
  const promptText = normalizeComparisonText(userPrompt);
  const layerTexts = layers.flatMap((layer) => getLayerText(layer));
  const combinedText = normalizeComparisonText(layerTexts.join(' '));

  if (
    layersContainPromptLeak(layers, userPrompt) ||
    (promptText.length > 300 && combinedText.includes(promptText.slice(0, 180))) ||
    (promptText.length > 500 && promptOverlapScore(promptText, combinedText) > 0.62)
  ) {
    throw new Error('AI echoed the prompt instead of returning a usable design.');
  }

  if (mode === 'selected') return;

  const sectionLikeCount = layers
    .flatMap(function flatten(layer): Layer[] {
      return [layer, ...(Array.isArray(layer.children) ? layer.children.flatMap(flatten) : [])];
    })
    .filter((layer) => ['nav', 'section', 'footer'].includes(layer.name)).length;

  if (sectionLikeCount < 2 || layerTexts.length < 4) {
    throw new Error('AI response was not a usable design. Please try again.');
  }
}

function buildPrompt({ prompt, mode = 'page', selectedLayers = [] }: GenerateAiLayersInput) {
  if (mode === 'selected') {
    return `Redesign the selected Ycode layer(s) below based on this instruction:

${prompt}

Selected layer JSON:
${JSON.stringify(selectedLayers, null, 2)}

Before returning JSON, silently plan a premium composition that follows the user's visual instructions. Do not expose the plan.
Return a JSON array with exactly ${Math.max(selectedLayers.length, 1)} replacement layer(s).`;
  }

  return `Build a complete QAY website page from this prompt:

${prompt}

Silent quality checklist before returning JSON:
- Does the design visibly match the requested aesthetic and palette?
- Does the layout have a premium hero and distinctive section rhythm?
- Are project/cards/feature sections varied, not copy-pasted boxes?
- Is the typography hierarchy strong on desktop and mobile?
- Are all headings, paragraphs, links, and buttons editable QAY text layers?
- Are there tasteful load/scroll/hover interactions on important hero and section elements?
- Did you avoid generic gray cards, default blue links, and flat unstyled stacks?
- Would this look acceptable as a production website without manual redesign?

Return only the final valid JSON layer array.`;
}

export async function generateQayAiLayers(input: GenerateAiLayersInput): Promise<GenerateAiLayersResult> {
  const providerResult = await callWithFallbackDetailed<Layer[]>(
    buildPrompt(input),
    QAY_AI_BUILDER_SYSTEM_PROMPT,
    (text) => {
      const parsed = extractJsonArray(text);
      const layers = normalizeAiLayers(parsed);
      assertUsableAiLayers(layers, input.prompt, input.mode || 'page');
      return layers;
    }
  );
  const normalizedLayers = providerResult.value || normalizeAiLayers(extractJsonArray(providerResult.text));
  const layers = (input.mode || 'page') === 'page' && !hasAnyInteractions(normalizedLayers)
    ? addDefaultInteractions(normalizedLayers)
    : normalizedLayers;

  return {
    layers,
    provider: providerResult.provider,
    model: providerResult.model,
  };
}
