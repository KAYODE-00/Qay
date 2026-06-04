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

type GenerateAiHtmlResult = {
  html: string;
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

export const QAY_AI_HTML_SYSTEM_PROMPT = `You are QAY's AI website designer.
Generate one complete, premium HTML + Tailwind page or fragment that QAY will import into editable layers.

Return ONLY HTML. No markdown fences, no explanations, no repeated prompt text.

Rules:
- Use a complete HTML document for full pages: <!DOCTYPE html>, html, head, body.
- Use semantic HTML and Tailwind classes. Put the main page background/text classes on <body>.
- Use editable real copy, not the user's instruction text.
- Use strong visual hierarchy, exact palettes from the user, polished spacing, and responsive layouts.
- Infer the website type from the user's request and stay in that lane. Do not mix unrelated site types unless the user explicitly asks for a hybrid.
- Do not reuse one fixed layout. Choose the layout architecture to fit the prompt: editorial, dashboard-like, bento, split-screen, magazine, sidebar, grid, product-led, event schedule, portfolio case-study, restaurant menu, service business, community, auth/membership, or another suitable structure.
- Use relative internal links such as "/about".
- Style navigation and CTA links as buttons with Tailwind classes; do not leave bare blue/default links.
- Use absolute image URLs only, preferably Unsplash URLs with width and quality params.
- Do not include JavaScript, event handlers, onclick, external scripts, GSAP scripts, or application/qay-interactions scripts.
- Interactions must use only these native QAY data attributes:
  data-qay-animate="fade-in|slide-up|slide-left|slide-right|scale-in|scroll-reveal|luxe-reveal|luxe-asym-reveal|line-grow|stagger-children|sidebar-slide|luxe-dock-reveal"
  data-qay-hover="lift|scale|scale-btn|luxe-lift|img-zoom|border-gold|glow"
  data-qay-click="toggle"
  data-qay-target="#element-id"
  data-qay-class="hidden"
  data-qay-duration="0.6"
  data-qay-hover-duration="0.25"
  data-qay-y="32"
  data-qay-x="0"
  data-qay-ease="power2.out"
- Mobile menus must be implemented by toggling "hidden":
  <button data-qay-click="toggle" data-qay-target="#mobile-menu" data-qay-class="hidden">...</button>
  <div id="mobile-menu" class="hidden fixed ... flex ...">...</div>
- For image zoom, put data-qay-hover="img-zoom" on an overflow-hidden wrapper that contains one img.
- Use data-qay-* tastefully on hero content, cards, timeline rows, image wrappers, and buttons.
- Ecommerce/storefront hooks:
  data-qay-commerce="product-grid" on the product listing section or grid wrapper.
  data-qay-commerce="product-card" on each product card.
  data-qay-commerce="product-image" on product image wrappers.
  data-qay-commerce="product-title" on product title text.
  data-qay-commerce="product-description" on product description text.
  data-qay-commerce="product-price" on product price text.
  data-qay-commerce="add-to-cart" on add-to-cart buttons.
  data-qay-commerce="cart-button" on cart buttons.
  data-qay-commerce="cart-drawer" on cart drawer/panel wrappers.
  data-qay-commerce="cart-items" inside cart drawers.
  data-qay-commerce="cart-count" for standalone cart count text.
  data-qay-commerce="checkout-button" on checkout buttons.
  data-qay-product-handle="sample-handle" and data-qay-product-id="sample-product-id" when useful.
- If the user asks for ecommerce, store, shop, products, cart, collection, checkout, boutique, fashion, perfume, food ordering, marketplace, or catalog:
  create a premium storefront with nav, hero, featured collections/products, product cards, cart button, trust/shipping block, product detail or collection section, newsletter/contact footer.
  Use the commerce hooks above. Keep checkout links as styled buttons but do not add JavaScript.
- If the user asks for an auth-protected site, membership site, portal, login, signup, dashboard, private community, course, SaaS app, or client portal:
  include public marketing pages only if requested, and also generate dedicated auth pages using data-qay-page wrappers for Login, Sign up, Forgot password, and Reset password when useful.
  Auth forms must use QAY auth hooks:
    data-qay-site-auth-form="signin|signup|forgot-password|reset-password"
    data-qay-site-auth-error
    data-qay-site-auth-success
  Login page slug must be "login"; sign up slug must be "signup"; forgot password slug must be "forgot-password"; reset password slug must be "reset-password".
  Keep auth page links relative: /login, /signup, /forgot-password, /reset-password.
- For multi-page sites, mirror QAY's import flow: Homepage first, then every extra page as a separate direct sibling wrapper with data-qay-page and data-qay-slug. Do not nest page wrappers inside another page.
- Do not rely on custom CSS classes for layout or interaction behavior. Tailwind utilities must carry the design.
- A small <style> tag is allowed only for font-family helper classes such as .serif; do not put animations or toggles in CSS.
- Never output a single paragraph containing the prompt.`;

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
  const flatLayers = layers.flatMap(function flatten(layer): Layer[] {
    return [layer, ...(Array.isArray(layer.children) ? layer.children.flatMap(flatten) : [])];
  });
  const classText = flatLayers
    .map((layer) => Array.isArray(layer.classes) ? layer.classes.join(' ') : layer.classes || '')
    .join(' ');
  const visualStructureCount = [
    /\bgrid\b/.test(classText),
    /\bflex\b/.test(classText),
    /\bmax-w-/.test(classText),
    /\b(px|py|p)-/.test(classText),
    /\bborder/.test(classText),
    /\b(bg|text)-\[#/.test(classText) || /\b(bg|text)-(black|white|zinc|neutral|slate|stone)/.test(classText),
  ].filter(Boolean).length;
  const repeatedGrayCards = (classText.match(/bg-gray-100/g) || []).length;

  if (sectionLikeCount < 2 || layerTexts.length < 4) {
    throw new Error('AI response was not a usable design. Please try again.');
  }

  if (flatLayers.length < 14 || visualStructureCount < 4 || repeatedGrayCards > 4) {
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

function extractHtml(text: string) {
  const stripped = text.trim()
    .replace(/^```(?:html)?/i, '')
    .replace(/```$/i, '')
    .trim();

  const bodyMatch = stripped.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const html = (bodyMatch?.[1] || stripped).trim();

  if (!/<[a-z][\s\S]*>/i.test(html)) {
    throw new Error('AI response did not include importable HTML.');
  }

  if (html.length < 400) {
    throw new Error('AI response was too small to be a usable design.');
  }

  if (/^<div>\s*<p>[\s\S]*act as an/i.test(html) || /visual\s*&?\s*aesthetic guidelines/i.test(html)) {
    throw new Error('AI echoed the prompt instead of returning a usable design.');
  }

  return html;
}

function buildHtmlPrompt({ prompt, mode = 'page', selectedLayers = [] }: GenerateAiLayersInput) {
  if (mode === 'selected') {
    return `Create a polished HTML/Tailwind replacement fragment for the selected QAY layer(s).

User request:
${prompt}

Current selected layer JSON, for content/context only:
${JSON.stringify(selectedLayers, null, 2)}

Return only the replacement HTML fragment.`;
  }

  return `Create a complete premium HTML/Tailwind page for QAY import.

User request:
${prompt}

Silent checklist:
- The output is actual website HTML, not the prompt.
- The output is a complete HTML document with body classes for the page background and base text color.
- The page has the sections needed for the requested website type, usually nav, hero, 2-4 focused sections, and footer for marketing/content sites.
- The layout is not copied from any reference example. It is purpose-built for the exact site type and prompt.
- The site type is not mixed with unrelated patterns unless the user requested that hybrid.
- The design has strong composition, responsive grids, premium spacing, and meaningful copy.
- Text and images are represented as normal HTML elements.
- Interactions use only QAY data attributes. No interaction script, GSAP script, or custom JavaScript.
- CTA links and nav links are visually styled as buttons or deliberate navigation items, never browser-default links.
- Use the full QAY motion vocabulary when appropriate:
  data-qay-animate="fade-in|slide-up|slide-left|slide-right|scale-in|scroll-reveal|luxe-reveal|luxe-asym-reveal|line-grow|stagger-children|sidebar-slide|luxe-dock-reveal"
  data-qay-hover="lift|scale|scale-btn|luxe-lift|img-zoom|border-gold|glow"
  data-qay-click="toggle" with data-qay-target and data-qay-class="hidden"
  Optional tuning: data-qay-duration, data-qay-hover-duration, data-qay-y, data-qay-x, data-qay-ease.
- If this is an ecommerce/storefront request, include QAY commerce hooks:
  data-qay-commerce="product-grid" on product grids,
  data-qay-commerce="product-card" on cards,
  data-qay-commerce="product-image" on image wrappers,
  data-qay-commerce="product-title" on titles,
  data-qay-commerce="product-description" on descriptions,
  data-qay-commerce="product-price" on prices,
  data-qay-commerce="add-to-cart" on add-to-cart buttons,
  data-qay-commerce="cart-button" on cart buttons,
  data-qay-commerce="cart-drawer" on cart drawer wrappers,
  data-qay-commerce="cart-items" inside cart drawers,
  data-qay-commerce="checkout-button" on checkout buttons,
  data-qay-product-handle and data-qay-product-id on product cards/buttons when useful.
- Ecommerce pages should include product grid, product cards, cart button, product detail/featured section, trust/shipping row, and footer. Use placeholder products until Medusa is connected.
- If this is an auth-protected, membership, SaaS, portal, course, or private-community request, include auth pages when useful:
  <div data-qay-page="Login" data-qay-slug="login">...<form data-qay-site-auth-form="signin">...</form>...</div>
  <div data-qay-page="Sign up" data-qay-slug="signup">...<form data-qay-site-auth-form="signup">...</form>...</div>
  <div data-qay-page="Forgot password" data-qay-slug="forgot-password">...<form data-qay-site-auth-form="forgot-password">...</form>...</div>
  <div data-qay-page="Reset password" data-qay-slug="reset-password">...<form data-qay-site-auth-form="reset-password">...</form>...</div>
  Auth forms should include email/password inputs, a submit button, data-qay-site-auth-error, data-qay-site-auth-success, and relative links between auth pages.
- If the request needs multiple pages, put each page inside a direct wrapper:
  <div data-qay-page="Homepage" data-qay-slug="/">...</div>
  <div data-qay-page="Shop" data-qay-slug="shop">...</div>
  <div data-qay-page="Product" data-qay-slug="product">...</div>
  <div data-qay-page="Login" data-qay-slug="login">...</div>
  <div data-qay-page="Sign up" data-qay-slug="signup">...</div>
  <div data-qay-page="About" data-qay-slug="about">...</div>
  <div data-qay-page="Contact" data-qay-slug="contact">...</div>
- This must match the QAY import dialog flow: Homepage first, each additional page as its own sibling wrapper, all pages returned together in one HTML response.
- Do not put a full HTML document inside each wrapper. Put the page body content inside each wrapper.
- Use multi-page wrappers only when they are useful. Generate at most 5 pages.

  Return only HTML.`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function inferSiteTitle(prompt: string) {
  const cleaned = prompt
    .replace(/act as an? .+?\./i, '')
    .replace(/build|create|design|website|site|landing page|portfolio/gi, ' ')
    .replace(/[#*_`>"':;!?()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(Boolean).slice(0, 5);
  return words.length ? words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'QAY Studio';
}

function isCommercePrompt(prompt: string) {
  return /\b(e-?commerce|store|shop|cart|checkout|product|products|catalog|collection|boutique|fashion|perfume|food ordering|marketplace|medusa)\b/i.test(prompt);
}

function localFallbackHtml(input: GenerateAiLayersInput) {
  const title = escapeHtml(inferSiteTitle(input.prompt));
  const description = escapeHtml(
    input.prompt
      .replace(/\s+/g, ' ')
      .slice(0, 180)
      .trim() || 'A polished digital experience built with QAY.'
  );

  if (input.mode === 'selected') {
    return `<section class="rounded-3xl border border-black/10 bg-[#F6F3ED] p-8 text-[#11141A]" data-qay-animate="slide-up">
  <p class="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-black/50">Refined block</p>
  <h2 class="max-w-2xl text-3xl font-semibold tracking-normal md:text-5xl">${title}</h2>
  <p class="mt-4 max-w-xl text-base leading-7 text-black/65">${description}</p>
</section>`;
  }

  if (isCommercePrompt(input.prompt)) {
    return `<main class="min-h-screen bg-[#0D0D0D] text-[#F8F4EC]">
  <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6" data-qay-animate="fade-in">
    <a href="/" class="text-sm font-semibold uppercase tracking-[0.28em]">${title}</a>
    <div class="hidden items-center gap-6 text-sm text-white/65 md:flex">
      <a href="/shop" class="transition hover:text-white">Shop</a>
      <a href="/about" class="transition hover:text-white">About</a>
      <a href="/contact" class="transition hover:text-white">Contact</a>
    </div>
    <button type="button" class="rounded-full border border-white/15 px-4 py-2 text-sm text-white" data-qay-commerce="cart-button" data-qay-hover="scale">Cart (0)</button>
  </nav>
  <section class="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-28">
    <div data-qay-animate="slide-up" data-qay-y="36">
      <p class="mb-5 inline-flex rounded-full border border-[#C9A84C]/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">New collection</p>
      <h1 class="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-normal md:text-7xl lg:text-8xl">${title}</h1>
      <p class="mt-8 max-w-2xl text-lg leading-8 text-white/65">${description}</p>
      <div class="mt-10 flex flex-wrap gap-3">
        <a href="/shop" class="rounded-full bg-[#F8F4EC] px-6 py-3 text-sm font-semibold text-[#0D0D0D]" data-qay-hover="scale-btn">Shop the drop</a>
        <a href="/about" class="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white" data-qay-hover="scale">Our story</a>
      </div>
    </div>
    <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40" data-qay-hover="img-zoom" data-qay-animate="scale-in">
      <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&auto=format&q=85" alt="Featured product" class="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
    </div>
  </section>
  <section class="border-y border-white/10 bg-[#F8F4EC] px-6 py-20 text-[#111111]" data-qay-commerce="product-grid">
    <div class="mx-auto flex max-w-7xl flex-col gap-10">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Featured products</p>
          <h2 class="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Built to sell beautifully.</h2>
        </div>
        <a href="/shop" class="self-start rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black md:self-end">View all products</a>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        <article class="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white" data-qay-commerce="product-card" data-qay-product-handle="signature-product" data-qay-product-id="sample-product-1" data-qay-animate="scroll-reveal" data-qay-hover="luxe-lift">
          <div class="overflow-hidden bg-[#efe8da]" data-qay-commerce="product-image" data-qay-hover="img-zoom">
            <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&auto=format&q=85" alt="Signature product" class="aspect-[4/5] w-full object-cover" />
          </div>
          <div class="p-5">
            <h3 class="text-2xl font-semibold" data-qay-commerce="product-title">Signature product</h3>
            <p class="mt-2 text-sm leading-6 text-black/55">A premium product description that can later map to your Medusa catalog.</p>
            <div class="mt-5 flex items-center justify-between gap-4">
              <span class="font-semibold" data-qay-commerce="product-price">$49</span>
              <button type="button" class="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">Add to cart</button>
            </div>
          </div>
        </article>
        <article class="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white md:translate-y-8" data-qay-commerce="product-card" data-qay-product-handle="premium-bundle" data-qay-product-id="sample-product-2" data-qay-animate="scroll-reveal" data-qay-hover="luxe-lift">
          <div class="overflow-hidden bg-[#efe8da]" data-qay-commerce="product-image" data-qay-hover="img-zoom">
            <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&auto=format&q=85" alt="Premium bundle" class="aspect-[4/5] w-full object-cover" />
          </div>
          <div class="p-5">
            <h3 class="text-2xl font-semibold" data-qay-commerce="product-title">Premium bundle</h3>
            <p class="mt-2 text-sm leading-6 text-black/55">Bundle storytelling, variant notes, or limited inventory messaging.</p>
            <div class="mt-5 flex items-center justify-between gap-4">
              <span class="font-semibold" data-qay-commerce="product-price">$89</span>
              <button type="button" class="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-2">Add to cart</button>
            </div>
          </div>
        </article>
        <article class="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white" data-qay-commerce="product-card" data-qay-product-handle="limited-drop" data-qay-product-id="sample-product-3" data-qay-animate="scroll-reveal" data-qay-hover="luxe-lift">
          <div class="overflow-hidden bg-[#efe8da]" data-qay-commerce="product-image" data-qay-hover="img-zoom">
            <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&auto=format&q=85" alt="Limited drop" class="aspect-[4/5] w-full object-cover" />
          </div>
          <div class="p-5">
            <h3 class="text-2xl font-semibold" data-qay-commerce="product-title">Limited drop</h3>
            <p class="mt-2 text-sm leading-6 text-black/55">A launch-ready card that imports as editable QAY layers.</p>
            <div class="mt-5 flex items-center justify-between gap-4">
              <span class="font-semibold" data-qay-commerce="product-price">$129</span>
              <button type="button" class="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-3">Add to cart</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
  <section class="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-3">
    <div class="rounded-3xl border border-white/10 p-6" data-qay-animate="scroll-reveal"><h2 class="text-xl font-semibold">Fast checkout path</h2><p class="mt-3 text-sm leading-6 text-white/60">Checkout buttons are ready for Medusa wiring once connected.</p></div>
    <div class="rounded-3xl border border-white/10 p-6" data-qay-animate="scroll-reveal"><h2 class="text-xl font-semibold">Shipping clarity</h2><p class="mt-3 text-sm leading-6 text-white/60">Use this block for shipping, returns, and trust promises.</p></div>
    <div class="rounded-3xl border border-white/10 p-6" data-qay-animate="scroll-reveal"><h2 class="text-xl font-semibold">Catalog-ready</h2><p class="mt-3 text-sm leading-6 text-white/60">Product hooks survive import and can be mapped to Medusa later.</p></div>
  </section>
  <footer class="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-10 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
    <p>© ${new Date().getFullYear()} ${title}</p>
    <a href="/contact" class="text-white">Contact</a>
  </footer>
</main>`;
  }

  return `<main class="min-h-screen bg-[#11141A] text-[#F6F3ED]">
  <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6" data-qay-animate="fade-in">
    <a href="/" class="text-sm font-semibold uppercase tracking-[0.26em]">${title}</a>
    <div class="hidden items-center gap-6 text-sm text-white/70 md:flex">
      <a href="/work" class="transition hover:text-white">Work</a>
      <a href="/about" class="transition hover:text-white">About</a>
      <a href="/contact" class="transition hover:text-white">Contact</a>
    </div>
  </nav>
  <section class="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:items-end md:py-28">
    <div data-qay-animate="slide-up" data-qay-y="36">
      <p class="mb-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/65">Built with QAY</p>
      <h1 class="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-normal md:text-7xl lg:text-8xl">${title}</h1>
      <p class="mt-8 max-w-2xl text-lg leading-8 text-white/68">${description}</p>
      <div class="mt-10 flex flex-wrap gap-3">
        <a href="/contact" class="rounded-full bg-[#F6F3ED] px-6 py-3 text-sm font-semibold text-[#11141A] transition hover:-translate-y-0.5" data-qay-hover="lift">Start a project</a>
        <a href="/about" class="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10" data-qay-hover="lift">Learn more</a>
      </div>
    </div>
    <div class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30" data-qay-animate="scale-in">
      <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85" alt="Modern workspace" class="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
    </div>
  </section>
  <section class="border-y border-white/10 bg-[#F6F3ED] px-6 py-20 text-[#11141A]">
    <div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
      <article class="rounded-3xl border border-black/10 bg-white p-7" data-qay-animate="scroll-reveal" data-qay-hover="lift">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">01</p>
        <h2 class="mt-8 text-2xl font-semibold">Strategy first</h2>
        <p class="mt-3 leading-7 text-black/60">Clear positioning, focused pages, and a structure that helps visitors act quickly.</p>
      </article>
      <article class="rounded-3xl border border-black/10 bg-[#11141A] p-7 text-white md:translate-y-8" data-qay-animate="scroll-reveal" data-qay-hover="lift">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">02</p>
        <h2 class="mt-8 text-2xl font-semibold">Premium visuals</h2>
        <p class="mt-3 leading-7 text-white/60">Editorial spacing, sharp contrast, and motion details that keep the experience polished.</p>
      </article>
      <article class="rounded-3xl border border-black/10 bg-white p-7" data-qay-animate="scroll-reveal" data-qay-hover="lift">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">03</p>
        <h2 class="mt-8 text-2xl font-semibold">Ready to edit</h2>
        <p class="mt-3 leading-7 text-black/60">Text, links, images, and sections import as editable layers inside the QAY editor.</p>
      </article>
    </div>
  </section>
  <section class="mx-auto max-w-7xl px-6 py-20">
    <div class="grid gap-6 md:grid-cols-[0.75fr_1.25fr]">
      <h2 class="text-4xl font-semibold tracking-normal md:text-6xl" data-qay-animate="slide-up">Built for momentum.</h2>
      <div class="space-y-4">
        <div class="rounded-3xl border border-white/10 p-6" data-qay-animate="scroll-reveal">
          <p class="text-sm uppercase tracking-[0.2em] text-white/40">Launch</p>
          <p class="mt-3 text-xl text-white/78">A focused homepage with clean navigation and conversion-ready actions.</p>
        </div>
        <div class="rounded-3xl border border-white/10 p-6" data-qay-animate="scroll-reveal">
          <p class="text-sm uppercase tracking-[0.2em] text-white/40">Scale</p>
          <p class="mt-3 text-xl text-white/78">Add pages, CMS content, media, forms, and client edits from one workspace.</p>
        </div>
      </div>
    </div>
  </section>
  <footer class="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-10 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
    <p>© ${new Date().getFullYear()} ${title}</p>
    <a href="/contact" class="text-white transition hover:text-[#F6F3ED]">Contact</a>
  </footer>
</main>`;
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

export async function generateQayAiHtml(input: GenerateAiLayersInput): Promise<GenerateAiHtmlResult> {
  try {
    const providerResult = await callWithFallbackDetailed<string>(
      buildHtmlPrompt(input),
      QAY_AI_HTML_SYSTEM_PROMPT,
      (text) => extractHtml(text)
    );

    return {
      html: providerResult.value || extractHtml(providerResult.text),
      provider: providerResult.provider,
      model: providerResult.model,
    };
  } catch (error) {
    console.warn('[QAY AI] Providers failed for HTML generation; using local fallback.', error);

    return {
      html: localFallbackHtml(input),
      provider: 'qay',
      model: 'local-fallback',
    };
  }
}
