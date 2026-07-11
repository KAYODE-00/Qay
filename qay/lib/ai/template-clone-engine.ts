import type { TemplateDecision } from './template-detector';
import type { TemplateMeta } from './template-ingestor';
import { callWithFallback } from './providers';

// ─── Color palettes (matches template-modifier palettes) ──────────────────────

const COLOR_PALETTES: Record<string, Record<string, string>> = {
  'dark-luxury': {
    '--qm-bg': '#0a0905',
    '--qm-surface': '#14120d',
    '--qm-text': '#f5ede0',
    '--qm-text-muted': '#9b8a75',
    '--qm-accent': '#c9a84c',
    '--qm-accent-text': '#0a0905',
    '--qm-border': 'rgba(201,168,76,0.15)',
  },
  'dark-bold': {
    '--qm-bg': '#000000',
    '--qm-surface': '#111111',
    '--qm-text': '#ffffff',
    '--qm-text-muted': '#a3a3a3',
    '--qm-accent': '#39ff14',
    '--qm-accent-text': '#000000',
    '--qm-border': 'rgba(57,255,20,0.2)',
  },
  'dark-minimal': {
    '--qm-bg': '#0d0d0d',
    '--qm-surface': '#1a1a1a',
    '--qm-text': '#e8e8e8',
    '--qm-text-muted': '#8a8a8a',
    '--qm-accent': '#ffffff',
    '--qm-accent-text': '#0d0d0d',
    '--qm-border': 'rgba(255,255,255,0.1)',
  },
  'light-minimal': {
    '--qm-bg': '#ffffff',
    '--qm-surface': '#f8f8f6',
    '--qm-text': '#111111',
    '--qm-text-muted': '#71717a',
    '--qm-accent': '#111111',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(0,0,0,0.08)',
  },
  'light-luxury': {
    '--qm-bg': '#faf9f7',
    '--qm-surface': '#f3f0ea',
    '--qm-text': '#1a1a0a',
    '--qm-text-muted': '#8a7a5a',
    '--qm-accent': '#b8922a',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(26,26,10,0.1)',
  },
  'warm-classic': {
    '--qm-bg': '#fdf6ec',
    '--qm-surface': '#fff9f0',
    '--qm-text': '#2c1810',
    '--qm-text-muted': '#8a6a5a',
    '--qm-accent': '#c2601f',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(44,24,16,0.1)',
  },
  'bold-vibrant': {
    '--qm-bg': '#0a0a0a',
    '--qm-surface': '#111111',
    '--qm-text': '#ffffff',
    '--qm-text-muted': '#aaaaaa',
    '--qm-accent': '#ff3d3d',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(255,61,61,0.2)',
  },
  'fresh-modern': {
    '--qm-bg': '#ffffff',
    '--qm-surface': '#f0f4ff',
    '--qm-text': '#111827',
    '--qm-text-muted': '#6b7280',
    '--qm-accent': '#4f46e5',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(79,70,229,0.15)',
  },
  'dark-blue': {
    '--qm-bg': '#080c14',
    '--qm-surface': '#0d1220',
    '--qm-text': '#e0eaff',
    '--qm-text-muted': '#93a4c8',
    '--qm-accent': '#3b82f6',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(59,130,246,0.18)',
  },
  'light-blue': {
    '--qm-bg': '#ffffff',
    '--qm-surface': '#f0f6ff',
    '--qm-text': '#111827',
    '--qm-text-muted': '#62748e',
    '--qm-accent': '#2563eb',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(37,99,235,0.14)',
  },
  'dark-yellow': {
    '--qm-bg': '#120f05',
    '--qm-surface': '#1c1708',
    '--qm-text': '#fff8dc',
    '--qm-text-muted': '#b8a76d',
    '--qm-accent': '#eab308',
    '--qm-accent-text': '#111111',
    '--qm-border': 'rgba(234,179,8,0.18)',
  },
  'light-yellow': {
    '--qm-bg': '#fffbeb',
    '--qm-surface': '#fff7d6',
    '--qm-text': '#1c1605',
    '--qm-text-muted': '#75662b',
    '--qm-accent': '#ca8a04',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(202,138,4,0.16)',
  },
};

const FONT_PAIRINGS: Record<string, { heading: string; body: string; googleUrl: string }> = {
  'dark-luxury': { heading: 'Cormorant Garamond', body: 'DM Sans', googleUrl: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;700' },
  'dark-bold': { heading: 'Bebas Neue', body: 'Inter', googleUrl: 'Bebas+Neue&family=Inter:wght@300;400;500;600;700' },
  'dark-minimal': { heading: 'Inter', body: 'Inter', googleUrl: 'Inter:wght@300;400;500;600;700;800' },
  'light-minimal': { heading: 'Inter', body: 'Inter', googleUrl: 'Inter:wght@300;400;500;600;700;800' },
  'light-luxury': { heading: 'Cormorant Garamond', body: 'DM Sans', googleUrl: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;700' },
  'warm-classic': { heading: 'Playfair Display', body: 'Lato', googleUrl: 'Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700' },
  'bold-vibrant': { heading: 'Barlow Condensed', body: 'Barlow', googleUrl: 'Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;700' },
  'fresh-modern': { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', googleUrl: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
};

const INDUSTRY_PHOTOS: Record<string, string[]> = {
  ecommerce: ['1441986300917-64674bd600d8', '1558655146-9f40138edfeb', '1523293182086-7651a899d37f', '1445205170230-053b83016050'],
  restaurant: ['1414235077428-338989a2e8c0', '1504674900247-0877df9cc836', '1517248135467-4c7edcad34c4', '1555396273-367ea4eb4db5'],
  saas: ['1551288049-bebda4e38f71', '1460925895917-afdab827c52f', '1518770660439-4636190af475', '1553877522-43269d4ea984'],
  agency: ['1497366216548-37526070297c', '1522202176988-66273c2fd55f', '1486312338219-ce68d2c6f44d', '1552664730-d307ca884978'],
  law: ['1521791055366-0d553872952f', '1450101499163-c8848c66ca85', '1589829545856-d10d557cf95f', '1497366216548-37526070297c'],
  medical: ['1576091160399-112ba8d25d1d', '1551190822-a9333d879b1f', '1559839734-2b71ea197ec7', '1530497610245-22d4b49e8d13'],
  beauty: ['1522337360788-8b13dee7a37e', '1522335789203-aabd1fc54bc9', '1560869713-7d0a29430803', '1487412947147-5cebf100d293'],
  fitness: ['1534438327276-14e5300c3a48', '1571019613454-1cb2f99b2d8b', '1583454110551-21f2fa2afe61', '1540497077202-7c8a3999166f'],
  hotel: ['1566073771259-6a8506099945', '1582719508461-905c673771fd', '1520250497591-112533b97f9a', '1551882547-ff40c599fb64'],
  education: ['1522202176988-66273c2fd55f', '1541178735493-479c1a27ed24', '1523050854058-8df90110c9f1', '1427504494785-3a9ca7044f45'],
  photography: ['1502920917128-1aa500764649', '1516035069371-29a1b244cc32', '1554196827-a5e1b6a7a65f', '1493863641943-9b68992a8d07'],
  music: ['1493225457124-a3eb161ffa5f', '1514320291840-2e0a9bf2a9ae', '1501386760449-53cafc6f3459', '1511671782779-c97d3d27a1d4'],
  nonprofit: ['1488521787991-ed7bbaae773c', '1469571486292-b53601020a1a', '1491438590914-bc09fcaaf77a', '1509099836639-18ba1795216d'],
  portfolio: ['1551434678-e076c223a692', '1460925895917-afdab827c52f', '1558618666-fcd25c85cd64', '1518005020951-eccb494ad742'],
};

// ─── Color & font application ─────────────────────────────────────────────────

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '').slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(c)) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function clampColor(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(255, Math.max(0, value));
}

function adjustColor(hex: string, amount: number): string {
  const c = hex.replace('#', '').slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(c)) return hex;
  const r = clampColor(parseInt(c.slice(0, 2), 16) + amount);
  const g = clampColor(parseInt(c.slice(2, 4), 16) + amount);
  const b = clampColor(parseInt(c.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function buildPromptPalette(decision: TemplateDecision): Record<string, string> {
  const bg = decision.colors?.bg || (decision.isDark ? '#0a0a0a' : '#ffffff');
  const accent = decision.colors?.accent || decision.colors?.primary || (isColorDark(bg) ? '#f8fafc' : '#111111');
  const bgIsDark = isColorDark(bg);
  const accentIsDark = isColorDark(accent);
  return {
    '--qm-bg': bg,
    '--qm-surface': bgIsDark ? adjustColor(bg, 12) : adjustColor(bg, -8),
    '--qm-text': bgIsDark ? '#f8fafc' : '#111111',
    '--qm-text-muted': bgIsDark ? '#cbd5e1' : '#4b5563',
    '--qm-accent': accent,
    '--qm-accent-text': accentIsDark ? '#ffffff' : '#111111',
    '--qm-border': bgIsDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)',
  };
}

function pickPalette(decision: TemplateDecision): Record<string, string> {
  if (decision.colors) {
    return buildPromptPalette(decision);
  }

  const signals = decision.themeSignals || [];
  const has = (signal: string) => signals.includes(signal);
  const key = decision.isDark && decision.isLuxury ? 'dark-luxury'
    : decision.isDark && decision.isBold ? 'dark-bold'
      : decision.isDark && has('blue') ? 'dark-blue'
        : decision.isDark && has('yellow') ? 'dark-yellow'
          : decision.isDark ? 'dark-minimal'
            : decision.isLuxury ? 'light-luxury'
              : decision.isBold ? 'bold-vibrant'
                : decision.theme === 'warm' ? 'warm-classic'
                  : decision.theme === 'minimal' ? 'light-minimal'
                    : has('blue') ? 'light-blue'
                      : has('yellow') ? 'light-yellow'
                        : 'fresh-modern';

  return COLOR_PALETTES[key] || COLOR_PALETTES['light-minimal'];
}

export function applyColorScheme(html: string, decision: TemplateDecision): string {
  const palette = pickPalette(decision);
  const cssVarLines = Object.entries(palette)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  if (/:root\s*\{[^}]*\}/.test(html)) {
    return html.replace(/:root\s*\{[^}]*\}/, `:root {\n${cssVarLines}\n}`);
  }
  return html.replace(/(<head[^>]*>)/i, `$1\n<style>:root {\n${cssVarLines}\n}</style>`);
}

export function applyFontPairing(html: string, decision: TemplateDecision): string {
  const moodKey = decision.isDark && decision.isLuxury ? 'dark-luxury'
    : decision.isDark && decision.isBold ? 'dark-bold'
      : decision.isDark ? 'dark-minimal'
        : decision.isLuxury ? 'light-luxury'
          : decision.isBold ? 'bold-vibrant'
            : decision.theme === 'warm' ? 'warm-classic'
              : 'fresh-modern';

  const fontPair = decision.fonts?.heading
    ? {
      heading: decision.fonts.heading,
      body: decision.fonts.body || 'Inter',
      googleUrl: `${encodeURIComponent(decision.fonts.heading).replace(/%20/g, '+')}:wght@400;600;700&family=${encodeURIComponent(decision.fonts.body || 'Inter').replace(/%20/g, '+')}:wght@300;400;500;700`,
    }
    : FONT_PAIRINGS[moodKey] || FONT_PAIRINGS['fresh-modern'];

  let out = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*>/g,
    `<link href="https://fonts.googleapis.com/css2?family=${fontPair.googleUrl}&display=swap" rel="stylesheet">`
  );
  if (!/fonts\.googleapis\.com/i.test(out)) {
    out = out.replace(
      /(<head[^>]*>)/i,
      `$1\n<link href="https://fonts.googleapis.com/css2?family=${fontPair.googleUrl}&display=swap" rel="stylesheet">`
    );
  }

  return out
    .replace(/var\(--qm-heading-font\)/g, `'${fontPair.heading}', sans-serif`)
    .replace(/var\(--qm-body-font\)/g, `'${fontPair.body}', sans-serif`);
}

// ─── Zone personalization ─────────────────────────────────────────────────────

function extractTextZones(html: string): Record<string, string> {
  const zones: Record<string, string> = {};
  const regex = /data-qm="([^"]+)"[^>]*>([^<]{1,300})</g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const zone = m[1];
    const text = m[2].trim();
    if (text && !zone.includes('image') && !zone.includes('img') && !zone.includes('photo')) {
      zones[zone] = text;
    }
  }
  return zones;
}

function escapeRegex(v: string) { return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function escapeHtml(v: string) {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function personalizeZones(
  html: string,
  decision: TemplateDecision,
  prompt: string,
  pageName: string
): Promise<string> {
  const zones = extractTextZones(html);
  if (Object.keys(zones).length === 0) return html;

  const systemPrompt = [
    'You are a professional copywriter for websites.',
    'You receive a list of text zones and a business description.',
    'Respond with ONLY a valid JSON object. No markdown. No explanation.',
    'Keys are zone names. Values are replacement text strings.',
    'Keep text concise — similar length to the original.',
    'Write real, specific copy for this exact business and page.',
    'Never use lorem ipsum or generic filler.',
    `For brand name zones: use the exact business name from the prompt if given.`,
    'For CTA zones: use action-oriented text specific to the industry.',
    'For testimonials: write believable, specific customer reviews with names.',
  ].join('\n');

  const userPrompt = [
    `Business: "${prompt}"`,
    `Name: ${decision.businessName || 'detect from prompt'}`,
    `Industry: ${decision.isBold ? 'bold' : decision.isLuxury ? 'luxury' : 'professional'}`,
    `Page: ${pageName}`,
    '',
    'Rewrite these zones:',
    JSON.stringify(zones, null, 2),
    '',
    'Return ONLY JSON.',
  ].join('\n');

  try {
    const raw = await callWithFallback(userPrompt, systemPrompt);
    // callWithFallback returns a string — handle both string and object
    const text = typeof raw === 'string' ? raw : (raw as any)?.text || JSON.stringify(raw);
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    const replacements = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : zones;

    let out = html;
    for (const [zone, newText] of Object.entries(replacements)) {
      if (typeof newText !== 'string' || !newText.trim()) continue;
      out = out.replace(
        new RegExp(`(data-qm="${escapeRegex(zone)}"[^>]*>)[^<]*(<?)`, 'g'),
        `$1${escapeHtml(newText.slice(0, 500))}$2`
      );
    }
    return out;
  } catch (err) {
    console.warn('[QAY modifier] Text zone fill failed:', err);
    return html; // Keep placeholder text — still looks good
  }
}

// ─── Image swapping ───────────────────────────────────────────────────────────

export function swapImages(html: string, industry: string, userImages: string[]): string {
  const photos = INDUSTRY_PHOTOS[industry] || INDUSTRY_PHOTOS.agency;
  let idx = 0;

  return html.replace(/(<img\b[^>]*\bsrc=")([^"]*)("[^>]*>)/gi, (_full, before, _src, after) => {
    const url = userImages.length > 0
      ? userImages[idx % userImages.length]
      : `https://images.unsplash.com/photo-${photos[idx % photos.length]}?w=1200&q=85&auto=format&fit=crop`;
    idx++;
    return `${before}${url}${after}`;
  });
}

// ─── CMS seeding ──────────────────────────────────────────────────────────────

async function seedCmsContent(
  html: string,
  decision: TemplateDecision,
  meta: TemplateMeta
): Promise<string> {
  if (!meta.cmsHints?.sampleItems?.length) return html;

  // Replace placeholder product/item titles in commerce grids
  let out = html;
  meta.cmsHints.sampleItems.forEach((item, i) => {
    const n = i + 1;
    // Replace product titles
    out = out.replace(
      new RegExp(`(data-qm="shop-product-title-${n}"[^>]*>)[^<]*(<)`, 'g'),
      `$1${escapeHtml(item.title)}$2`
    );
    out = out.replace(
      new RegExp(`(data-qm="shop-product-description-${n}"[^>]*>)[^<]*(<)`, 'g'),
      `$1${escapeHtml(item.subtitle || '')}$2`
    );
    if (item.price) {
      out = out.replace(
        new RegExp(`(data-qm="shop-product-price-${n}"[^>]*>)[^<]*(<)`, 'g'),
        `$1${escapeHtml(item.price)}$2`
      );
    }
  });

  return out;
}

// ─── Reference aesthetic extraction ──────────────────────────────────────────

async function extractReferenceAesthetic(
  prompt: string,
  currentDecision: TemplateDecision,
  referenceImageUrl?: string,
  referenceUrl?: string,
): Promise<Partial<TemplateDecision>> {
  // Build the AI message based on what reference type we have
  let referenceContext = '';

  if (referenceImageUrl) {
    referenceContext = `Reference image: ${referenceImageUrl}
Analyze this image and describe its design aesthetic.`;
  } else if (referenceUrl) {
    referenceContext = `Reference website: ${referenceUrl}
The user wants their site to look similar to this website.`;
  }

  const systemPrompt = `You analyze design references and extract aesthetic information.
Respond ONLY with a valid JSON object. No markdown. No explanation.`;

  const userMessage = `${referenceContext}

The user wants to build: "${prompt}"

Based on the reference, extract the design aesthetic and return this JSON:
{
  "isDark": true or false,
  "isLuxury": true or false,
  "isBold": true or false,
  "primaryColor": "#hexcode or null if unclear",
  "accentColor": "#hexcode or null if unclear",
  "backgroundColor": "#hexcode or null if unclear",
  "mood": "one of: luxury, bold, minimal, warm, editorial, modern, street",
  "reasoning": "one sentence explaining your analysis"
}

Only extract colors if you are confident in them.
Return null for colors you cannot determine.`;

  try {
    const raw = await callWithFallback(userMessage, systemPrompt);
    const text = typeof raw === 'string' ? raw : (raw as any)?.text || '';
    const cleaned = text.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    console.log('[QAY modifier] Reference aesthetic extracted:', parsed.reasoning);

    // Build color override if AI found confident colors
    const colors = (parsed.primaryColor || parsed.accentColor || parsed.backgroundColor)
      ? {
        primary: parsed.primaryColor || undefined,
        accent: parsed.accentColor || undefined,
        bg: parsed.backgroundColor || undefined,
      }
      : null;

    return {
      isDark: typeof parsed.isDark === 'boolean' ? parsed.isDark : currentDecision.isDark,
      isLuxury: typeof parsed.isLuxury === 'boolean' ? parsed.isLuxury : currentDecision.isLuxury,
      isBold: typeof parsed.isBold === 'boolean' ? parsed.isBold : currentDecision.isBold,
      colors: colors || currentDecision.colors,
    };
  } catch (err) {
    console.warn('[QAY modifier] Reference extraction failed, using prompt signals:', err);
    return {}; // Keep original decision unchanged
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function cloneAndPersonalize(
  templateHtml: string,
  prompt: string,
  decision: TemplateDecision,
  meta?: TemplateMeta,
  referenceImageUrl?: string,
  referenceUrl?: string,
): Promise<string> {
  // If reference provided — extract aesthetic and override decision
  let effectiveDecision = decision;
  if (referenceImageUrl || referenceUrl) {
    const referenceDecision = await extractReferenceAesthetic(
      prompt,
      decision,
      referenceImageUrl,
      referenceUrl,
    );
    // Override decision colors and mood with reference findings
    if (referenceDecision.colors) {
      effectiveDecision = { ...effectiveDecision, colors: referenceDecision.colors };
    }
    if (referenceDecision.isDark !== undefined && referenceDecision.isDark !== decision.isDark) {
      effectiveDecision = { ...effectiveDecision, isDark: referenceDecision.isDark };
    }
    if (referenceDecision.isLuxury !== undefined && referenceDecision.isLuxury !== decision.isLuxury) {
      effectiveDecision = { ...effectiveDecision, isLuxury: referenceDecision.isLuxury };
    }
    if (referenceDecision.isBold !== undefined && referenceDecision.isBold !== decision.isBold) {
      effectiveDecision = { ...effectiveDecision, isBold: referenceDecision.isBold };
    }
  }

  // 1. Apply color scheme from user prompt / detected mood
  let html = applyColorScheme(templateHtml, effectiveDecision);

  // 2. Apply font pairing based on mood
  html = applyFontPairing(html, effectiveDecision);

  // 3. Swap images
  const industry = meta?.industry || effectiveDecision.siteType || (effectiveDecision.isBold ? 'ecommerce' : 'agency');
  html = swapImages(html, industry, effectiveDecision.imageUrls || []);

  // 4. Personalize text zones per page
  const pageRegex = /data-qay-page="([^"]+)"/g;
  const pageNames: string[] = [];
  let pm: RegExpExecArray | null;
  while ((pm = pageRegex.exec(html)) !== null) pageNames.push(pm[1]);

  if (pageNames.length > 0) {
    // Multi-page: personalize each page block separately
    const pageSections = html.split(/(?=<div[^>]+data-qay-page=")/);
    const personalized = await Promise.all(
      pageSections.map((section) => {
        const nameMatch = section.match(/data-qay-page="([^"]+)"/);
        const pageName = nameMatch?.[1] || 'Home';
        return personalizeZones(section, effectiveDecision, prompt, pageName);
      })
    );
    html = personalized.join('');
  } else {
    // Single-page
    html = await personalizeZones(html, effectiveDecision, prompt, 'Homepage');
  }

  // 5. Seed CMS content if available
  if (meta?.features.hasCommerce || meta?.features.hasCms) {
    html = await seedCmsContent(html, effectiveDecision, meta);
  }

  return html;
}
