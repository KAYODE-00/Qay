import { callWithFallback } from './providers';
import { type TemplateDecision } from './template-detector';

const LAYOUT_TRANSFORMS: Record<number, Array<{ find: RegExp; replace: string }>> = {
  1: [],
  2: [
    { find: /class="([^"]*\b(?:flex|grid)\b[^"]*)"([^>]*data-qm="hero-section")/g, replace: 'class="$1 lg:flex-row-reverse"$2' },
    { find: /class="([^"]*\b(?:flex|grid)\b[^"]*)"([^>]*data-qm="about-section")/g, replace: 'class="$1 lg:flex-row-reverse"$2' },
    {
      find: /<(section|div)([^>]*)data-qm="about-section"([^>]*)>/g,
      replace: '<$1$2data-qm="about-section"$3 style="flex-direction:row-reverse">',
    },
  ],
  3: [
    { find: /rounded-none/g, replace: 'rounded-2xl' },
    { find: /rounded-sm\b/g, replace: 'rounded-xl' },
    { find: /rounded-md\b/g, replace: 'rounded-2xl' },
  ],
  4: [
    { find: /class="([^"]*\b(?:flex|grid)\b[^"]*)"([^>]*data-qm="hero-section")/g, replace: 'class="$1 lg:flex-row-reverse"$2' },
    { find: /rounded-none/g, replace: 'rounded-3xl' },
    { find: /rounded-lg\b/g, replace: 'rounded-3xl' },
    {
      find: /style="([^"]*padding:[^"]*)"([^>]*data-qay-commerce="add-to-cart"|[^>]*data-qm="[^"]*cta[^"]*")/g,
      replace: 'style="$1; border-radius:100px"$2',
    },
  ],
};

const COLOR_PALETTES: Record<string, Record<string, string>> = {
  'dark-luxury': palette('#0a0905', '#14120d', '#f5ede0', '#9b8a75', '#c9a84c', '#0a0905', 'rgba(201,168,76,0.15)'),
  'dark-bold': palette('#000000', '#111111', '#ffffff', '#a3a3a3', '#39ff14', '#000000', 'rgba(57,255,20,0.2)'),
  'dark-minimal': palette('#0d0d0d', '#1a1a1a', '#e8e8e8', '#8a8a8a', '#ffffff', '#0d0d0d', 'rgba(255,255,255,0.1)'),
  'dark-purple': palette('#0d0a14', '#171024', '#f4edff', '#a897c9', '#8b5cf6', '#ffffff', 'rgba(139,92,246,0.18)'),
  'dark-blue': palette('#080c14', '#0d1220', '#e0eaff', '#86a3d1', '#3b82f6', '#ffffff', 'rgba(59,130,246,0.18)'),
  'dark-green': palette('#080e0a', '#0f1a12', '#e0f5e8', '#7fab8a', '#22c55e', '#041008', 'rgba(34,197,94,0.18)'),
  'light-minimal': palette('#ffffff', '#f8f8f6', '#111111', '#71717a', '#111111', '#ffffff', 'rgba(0,0,0,0.08)'),
  'light-luxury': palette('#faf9f7', '#f3f0ea', '#1a1a0a', '#8a7a5a', '#b8922a', '#ffffff', 'rgba(26,26,10,0.1)'),
  'light-blue': palette('#ffffff', '#f0f6ff', '#111827', '#62748e', '#2563eb', '#ffffff', 'rgba(37,99,235,0.14)'),
  'light-green': palette('#ffffff', '#f0fdf4', '#102015', '#627468', '#16a34a', '#ffffff', 'rgba(22,163,74,0.14)'),
  'light-purple': palette('#ffffff', '#faf5ff', '#1f1235', '#75648c', '#7c3aed', '#ffffff', 'rgba(124,58,237,0.14)'),
  'warm-terracotta': palette('#fdf6ec', '#fff9f0', '#2c1810', '#8a6a5a', '#c2601f', '#ffffff', 'rgba(44,24,16,0.1)'),
  'warm-cream': palette('#fefcf5', '#f8f4e8', '#2a2015', '#8a7a60', '#8b6914', '#ffffff', 'rgba(42,32,21,0.1)'),
  'bold-vibrant': palette('#0a0a0a', '#111111', '#ffffff', '#aaaaaa', '#ff3d3d', '#ffffff', 'rgba(255,61,61,0.2)'),
  'fresh-modern': palette('#ffffff', '#f0f4ff', '#111827', '#6b7280', '#4f46e5', '#ffffff', 'rgba(79,70,229,0.15)'),
};

const FONT_PAIRINGS: Record<string, { heading: string; body: string; url: string }> = {
  luxury: { heading: 'Cormorant Garamond', body: 'DM Sans', url: 'Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500' },
  bold: { heading: 'Bebas Neue', body: 'Barlow', url: 'Bebas+Neue&family=Barlow:wght@300;400;500;600' },
  street: { heading: 'Barlow Condensed', body: 'Barlow', url: 'Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500' },
  warm: { heading: 'Playfair Display', body: 'Lato', url: 'Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700' },
  modern: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', url: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  minimal: { heading: 'Inter', body: 'Inter', url: 'Inter:wght@300;400;500;600;700;800' },
  tech: { heading: 'Space Grotesk', body: 'Inter', url: 'Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500' },
  editorial: { heading: 'Libre Baskerville', body: 'Source Sans 3', url: 'Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600' },
  pro: { heading: 'Montserrat', body: 'Open Sans', url: 'Montserrat:wght@400;600;700&family=Open+Sans:wght@300;400;600' },
};

const PHOTOS: Record<string, string[]> = {
  ecommerce: [
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85&auto=format&fit=crop',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85&auto=format&fit=crop',
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=85&auto=format&fit=crop',
  ],
  agency: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=85&auto=format&fit=crop',
  ],
  saas: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop',
  ],
  law: [
    'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=85&auto=format&fit=crop',
  ],
  medical: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec7?w=1200&q=85&auto=format&fit=crop',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522337360826-0255e6a85986?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=85&auto=format&fit=crop',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85&auto=format&fit=crop',
  ],
  education: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85&auto=format&fit=crop',
  ],
  event: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976447-4039a888d695?w=1200&q=85&auto=format&fit=crop',
  ],
  photography: [
    'https://images.unsplash.com/photo-1502920917128-1aa500764649?w=1200&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=85&auto=format&fit=crop',
  ],
};

const PROTECTED_ZONES = [
  'cart-button',
  'cart-count',
  'cart-drawer',
  'cart-items',
  'cart-close',
  'checkout-button',
  'add-to-cart',
  'product-card',
  'product-image',
  'product-title',
  'product-price',
];

export async function modifyTemplate(
  templateHtml: string,
  prompt: string,
  decision: TemplateDecision
): Promise<string> {
  let html = templateHtml;

  for (const transform of LAYOUT_TRANSFORMS[decision.layoutVariant] || []) {
    html = html.replace(transform.find, transform.replace);
  }

  const paletteVars = decision.colors
    ? buildCustomPalette(decision.colors, decision.isDark)
    : COLOR_PALETTES[resolvePaletteKey(decision)] || COLOR_PALETTES['light-minimal'];
  const fonts = pickFontPair(decision);

  html = injectCssVars(html, paletteVars, fonts, decision);
  html = replaceImages(html, decision);
  html = await fillTextZones(html, prompt, decision);

  return html;
}

async function fillTextZones(
  html: string,
  prompt: string,
  decision: TemplateDecision
): Promise<string> {
  const zones: Record<string, string> = {};
  const zoneRegex = /data-qm="([^"]+)"[^>]*>([^<]{0,300})</g;
  let match: RegExpExecArray | null;

  while ((match = zoneRegex.exec(html)) !== null) {
    const name = match[1];
    const currentText = match[2].trim();
    if (isProtectedZone(name)) continue;
    if (name.includes('image') || name.includes('img') || name.includes('photo')) continue;
    if (!currentText || currentText.length < 2) continue;
    zones[name] = currentText;
  }

  if (Object.keys(zones).length === 0) return html;

  const systemPrompt = `You write website copy. Respond ONLY with a valid JSON object.
No markdown. No explanation. No code fences.
Keys = zone names. Values = new text for that zone.
Rules:
- Use the exact business name from the prompt if given
- Write specific copy for this exact business type and location
- Keep text length similar to the original placeholder
- CTAs must be action-specific: "Book a Table", "Shop Collection", "Get Started"
- Stats must be realistic numbers for this business
- Testimonials must sound like real customers, specific to the industry
- Never write "Your tagline here" or generic filler
- For brand-name zones: use the business name exactly`;

  const userMessage = `Business: "${prompt}"
Type: ${decision.siteType}
Name: ${decision.businessName || 'from prompt'}
Location: ${decision.location || 'not specified'}
Mood: ${(decision.themeSignals || []).join(', ') || 'professional'}

Replace these text zones with real copy for this business:
${JSON.stringify(zones, null, 2)}

Return ONLY a JSON object.`;

  try {
    const raw = await callWithFallback(userMessage, systemPrompt);
    const text = typeof raw === 'string'
      ? raw
      : typeof (raw as any)?.text === 'string'
        ? (raw as any).text
        : JSON.stringify(raw);
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return html;
    return applyTextZones(html, parsed as Record<string, string>);
  } catch (err) {
    console.warn('[QAY modifier] Text fill failed, using defaults:', err);
    return html;
  }
}

function injectCssVars(
  html: string,
  paletteVars: Record<string, string>,
  fonts: { heading: string; body: string; url: string },
  decision: TemplateDecision
): string {
  const cssVarLines = Object.entries(paletteVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  const fontVarLines = [
    `  --qm-heading-font: '${fonts.heading}', serif;`,
    `  --qm-body-font: '${fonts.body}', sans-serif;`,
  ].join('\n');
  const newRoot = `:root {\n${cssVarLines}\n${fontVarLines}\n${buildRadiusVars(decision.layoutVariant)}\n}`;
  const fontLinks = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=${fonts.url}&display=swap" rel="stylesheet">`;

  let out = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>\s*/g, '');
  out = out.replace(/:root\s*\{[\s\S]*?\}/, newRoot);

  if (!out.includes(':root {')) {
    out = /<style[^>]*>/i.test(out)
      ? out.replace(/<style[^>]*>/i, (tag) => `${tag}\n${newRoot}\n`)
      : `<style>\n${newRoot}\nbody{background:var(--qm-bg);color:var(--qm-text);font-family:var(--qm-body-font)}\nh1,h2,h3,h4,h5,h6{font-family:var(--qm-heading-font)}\n</style>\n${out}`;
  }

  if (/<head[^>]*>/i.test(out)) {
    return out.replace(/<head([^>]*)>/i, `<head$1>\n${fontLinks}`);
  }

  return `${fontLinks}\n${out}`;
}

function buildCustomPalette(colors: { primary?: string; accent?: string; bg?: string }, isDark: boolean): Record<string, string> {
  const bg = colors.bg || (isDark ? '#0a0a0a' : '#ffffff');
  const accent = colors.accent || colors.primary || '#111111';
  const darkBg = isColorDark(bg);
  return palette(
    bg,
    darkBg ? lighten(bg, 8) : darken(bg, 3),
    darkBg ? '#f0ede6' : '#111111',
    darkBg ? '#9b9691' : '#666666',
    accent,
    isColorDark(accent) ? '#ffffff' : '#000000',
    darkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  );
}

function resolvePaletteKey(decision: TemplateDecision): string {
  const signals = decision.themeSignals || [];
  const has = (signal: string) => signals.includes(signal);
  if (decision.isDark && decision.isLuxury) return 'dark-luxury';
  if (decision.isDark && decision.isBold) return 'dark-bold';
  if (decision.isDark && has('purple')) return 'dark-purple';
  if (decision.isDark && has('blue')) return 'dark-blue';
  if (decision.isDark && has('green')) return 'dark-green';
  if (decision.isDark) return 'dark-minimal';
  if (decision.isLuxury && has('warm')) return 'warm-cream';
  if (decision.isLuxury) return 'light-luxury';
  if (decision.isBold) return 'bold-vibrant';
  if (has('warm')) return 'warm-terracotta';
  if (has('minimal')) return 'light-minimal';
  if (has('blue')) return 'light-blue';
  if (has('green')) return 'light-green';
  if (has('purple')) return 'light-purple';
  return 'light-minimal';
}

function pickFontPair(decision: TemplateDecision): { heading: string; body: string; url: string } {
  if (decision.explicitFonts?.heading || decision.fonts?.heading) {
    const heading = decision.explicitFonts?.heading || decision.fonts?.heading || 'Inter';
    const body = decision.explicitFonts?.body || decision.fonts?.body || 'Inter';
    return {
      heading,
      body,
      url: `${heading.replace(/ /g, '+')}:wght@400;600;700&family=${body.replace(/ /g, '+')}:wght@400;500`,
    };
  }

  const signals = decision.themeSignals || [];
  if (decision.isLuxury) return FONT_PAIRINGS.luxury;
  if (decision.isBold && signals.includes('street')) return FONT_PAIRINGS.street;
  if (decision.isBold) return FONT_PAIRINGS.bold;
  if (signals.includes('warm')) return FONT_PAIRINGS.warm;
  if (signals.includes('minimal')) return FONT_PAIRINGS.minimal;
  if (['saas', 'tech-startup'].includes(decision.siteType)) return FONT_PAIRINGS.tech;
  if (['law', 'medical', 'nonprofit'].includes(decision.siteType)) return FONT_PAIRINGS.pro;
  if (['blog', 'photography'].includes(decision.siteType)) return FONT_PAIRINGS.editorial;
  return FONT_PAIRINGS.modern;
}

function replaceImages(html: string, decision: TemplateDecision): string {
  const explicitImages = decision.explicitImageUrls?.length ? decision.explicitImageUrls : decision.imageUrls;
  if (explicitImages.length > 0) {
    let urlIndex = 0;
    return html.replace(
      /(<img\b(?=[^>]*data-qm="[^"]*(?:image|img|photo|banner)[^"]*")[^>]*\bsrc=")[^"]*(")/gi,
      (_full, before, after) => {
        const url = explicitImages[urlIndex % explicitImages.length];
        urlIndex += 1;
        return `${before}${escapeAttribute(url)}${after}`;
      }
    );
  }

  const photos = PHOTOS[decision.siteType] || PHOTOS.agency;
  let photoIndex = 0;
  return html.replace(/src="https:\/\/images\.unsplash\.com\/[^"]+"/g, () => {
    const src = `src="${photos[photoIndex % photos.length]}"`;
    photoIndex += 1;
    return src;
  });
}

function applyTextZones(html: string, filledZones: Record<string, string>): string {
  let out = html;
  for (const [zone, newText] of Object.entries(filledZones)) {
    if (isProtectedZone(zone)) continue;
    if (typeof newText !== 'string' || !newText.trim()) continue;
    try {
      const escaped = escapeRegex(zone);
      out = out.replace(
        new RegExp(`(data-qm="${escaped}"[^>]*>)[^<]*(</?)`, 'g'),
        (_, open, close) => `${open}${escapeHtml(newText.slice(0, 500))}${close}`
      );
    } catch {
      // Skip invalid zone names rather than risking functional markup.
    }
  }
  return out;
}

function buildRadiusVars(variant: number): string {
  const radiusMap: Record<number, string> = {
    1: '  --qm-radius: 0px;\n  --qm-radius-card: 4px;\n  --qm-radius-btn: 2px;',
    2: '  --qm-radius: 4px;\n  --qm-radius-card: 12px;\n  --qm-radius-btn: 8px;',
    3: '  --qm-radius: 8px;\n  --qm-radius-card: 20px;\n  --qm-radius-btn: 12px;',
    4: '  --qm-radius: 12px;\n  --qm-radius-card: 24px;\n  --qm-radius-btn: 100px;',
  };
  return radiusMap[variant] || radiusMap[1];
}

function palette(
  bg: string,
  surface: string,
  text: string,
  muted: string,
  accent: string,
  accentText: string,
  border: string
) {
  return {
    '--qm-bg': bg,
    '--qm-surface': surface,
    '--qm-text': text,
    '--qm-text-muted': muted,
    '--qm-accent': accent,
    '--qm-accent-text': accentText,
    '--qm-border': border,
  };
}

function isProtectedZone(zone: string) {
  return PROTECTED_ZONES.some((protectedZone) => zone.includes(protectedZone));
}

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function lighten(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const r = clamp(parseInt(c.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(c.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(c.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function darken(hex: string, amount: number): string {
  return lighten(hex, -amount);
}

function clamp(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(255, Math.max(0, value));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}
