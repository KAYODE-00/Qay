import { callWithFallback } from './providers';
import { detectTemplateChoice, type TemplateDecision } from './template-detector';

const LAYOUT_TRANSFORMS: Record<number, Array<{ find: RegExp; replace: string }>> = {
  1: [],
  2: [
    { find: /class="([^"]*\b(?:flex|grid)\b[^"]*)"([^>]*data-qm="hero-section")/g, replace: 'class="$1 lg:flex-row-reverse"$2' },
    { find: /class="([^"]*\b(?:flex|grid)\b[^"]*)"([^>]*data-qm="about-section")/g, replace: 'class="$1 lg:flex-row-reverse"$2' },
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
  ],
};

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
};

const FONT_PAIRINGS: Record<string, { heading: string; body: string; googleUrl: string }> = {
  luxury: { heading: 'Cormorant Garamond', body: 'DM Sans', googleUrl: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;700' },
  bold: { heading: 'Bebas Neue', body: 'Inter', googleUrl: 'Bebas+Neue&family=Inter:wght@300;400;500;600;700' },
  minimal: { heading: 'Inter', body: 'Inter', googleUrl: 'Inter:wght@300;400;500;600;700;800' },
  warm: { heading: 'Playfair Display', body: 'Lato', googleUrl: 'Playfair+Display:wght@400;700&family=Lato:wght@300;400;700' },
  modern: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', googleUrl: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  street: { heading: 'Barlow Condensed', body: 'Barlow', googleUrl: 'Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;700' },
};

const PHOTOS: Record<string, string[]> = {
  ecommerce: ['1441986300917-64674bd600d8', '1558655146-9f40138edfeb', '1523293182086-7651a899d37f', '1445205170230-053b83016050'],
  restaurant: ['1414235077428-338989a2e8c0', '1504674900247-0877df9cc836', '1517248135467-4c7edcad34c4', '1555396273-367ea4eb4db5'],
  portfolio: ['1551434678-e076c223a692', '1460925895917-afdab827c52f', '1558618666-fcd25c85cd64', '1518005020951-eccb494ad742'],
  agency: ['1497366216548-37526070297c', '1522202176988-66273c2fd55f', '1486312338219-ce68d2c6f44d', '1552664730-d307ca884978'],
  saas: ['1551288049-bebda4e38f71', '1460925895917-afdab827c52f', '1518770660439-4636190af475', '1553877522-43269d4ea984'],
  blog: ['1486312338219-ce68d2c6f44d', '1505682634904-d7c8d95cdc50', '1455390582262-044cdead277a', '1488190211105-8b0e65b80b4e'],
  beauty: ['1522337360788-8b13dee7a37e', '1522335789203-aabd1fc54bc9', '1560869713-7d0a29430803', '1487412947147-5cebf100d293'],
  fitness: ['1534438327276-14e5300c3a48', '1571019613454-1cb2f99b2d8b', '1583454110551-21f2fa2afe61', '1540497077202-7c8a3999166f'],
  law: ['1521791055366-0d553872952f', '1497366216548-37526070297c', '1589829545856-d10d557cf95f', '1450101499163-c8848c66ca85'],
  medical: ['1576091160399-112ba8d25d1d', '1559839734-2b71ea197ec7', '1551190822-a9333d879b1f', '1530497610245-22d4b49e8d13'],
  event: ['1519741497674-611481863552', '1465495976447-4039a888d695', '1501281668745-f7f57925be31', '1511795409834-ef04bbd61622'],
  education: ['1522202176988-66273c2fd55f', '1541178735493-479c1a27ed24', '1523050854058-8df90110c9f1', '1427504494785-3a9ca7044f45'],
  hotel: ['1566073771259-6a8506099945', '1582719508461-905c673771fd', '1520250497591-112533b97f9a', '1551882547-ff40c599fb64'],
  photography: ['1502920917128-1aa500764649', '1516035069371-29a1b244cc32', '1554196827-a5e1b6a7a65f', '1493863641943-9b68992a8d07'],
  church: ['1438232575197-8526304cfb1e', '1467545285967-0de4797e3f7e', '1519389950473-47ba0277781c', '1460627390041-532a28402358'],
  nonprofit: ['1488521787991-ed7bbaae773c', '1469571486292-b53601020a1a', '1491438590914-bc09fcaaf77a', '1509099836639-18ba1795216d'],
  music: ['1493225457124-a3eb161ffa5f', '1514320291840-2e0a9bf2a9ae', '1501386760449-53cafc6f3459', '1511671782779-c97d3d27a1d4'],
};

export async function modifyTemplate(
  templateHtml: string,
  prompt: string,
  decision: ReturnType<typeof detectTemplateChoice>
): Promise<string> {
  let html = templateHtml;

  for (const transform of LAYOUT_TRANSFORMS[decision.layoutVariant] || []) {
    html = html.replace(transform.find, transform.replace);
  }

  html = applyPalette(html, decision);
  html = applyFonts(html, decision);

  const zones = extractTextZones(html);
  if (Object.keys(zones).length > 0) {
    html = applyTextZones(html, await fillTextZones(zones, prompt, decision));
  }

  return swapImages(html, decision);
}

function choosePalette(decision: TemplateDecision) {
  if (decision.colors) {
    return {
      '--qm-bg': decision.colors.bg || (decision.isDark ? '#0a0a0a' : '#ffffff'),
      '--qm-surface': decision.isDark ? '#111111' : '#f8f8f6',
      '--qm-text': decision.isDark ? '#f5f5f5' : '#111111',
      '--qm-text-muted': decision.isDark ? '#a3a3a3' : '#666666',
      '--qm-accent': decision.colors.accent || decision.colors.primary || '#111111',
      '--qm-accent-text': decision.isDark ? '#000000' : '#ffffff',
      '--qm-border': decision.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    };
  }

  const paletteKey = decision.isDark && decision.isLuxury ? 'dark-luxury'
    : decision.isDark && decision.isBold ? 'dark-bold'
      : decision.isDark ? 'dark-minimal'
        : decision.isLuxury ? 'light-luxury'
          : decision.isBold ? 'bold-vibrant'
            : decision.theme === 'warm' ? 'warm-classic'
              : decision.theme === 'minimal' ? 'light-minimal'
                : 'fresh-modern';
  return COLOR_PALETTES[paletteKey] || COLOR_PALETTES['light-minimal'];
}

function applyPalette(html: string, decision: TemplateDecision) {
  const cssVarLines = Object.entries(choosePalette(decision))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  if (/:root\s*\{[^}]*\}/.test(html)) {
    return html.replace(/:root\s*\{[^}]*\}/, `:root {\n${cssVarLines}\n}`);
  }

  return html.replace(/(<head[^>]*>)/i, `$1\n<style>:root {\n${cssVarLines}\n}</style>`);
}

function applyFonts(html: string, decision: TemplateDecision) {
  const fontKey = decision.fonts?.heading ? 'custom'
    : decision.isLuxury ? 'luxury'
      : decision.isBold ? 'street'
        : decision.theme === 'warm' ? 'warm'
          : decision.theme === 'minimal' ? 'minimal'
            : 'modern';
  const fontPair = fontKey === 'custom'
    ? {
      heading: decision.fonts?.heading || 'Inter',
      body: decision.fonts?.body || 'Inter',
      googleUrl: `${encodeURIComponent(decision.fonts?.heading || 'Inter').replace(/%20/g, '+')}:wght@400;600;700&family=${encodeURIComponent(decision.fonts?.body || 'Inter').replace(/%20/g, '+')}:wght@300;400;500;700`,
    }
    : FONT_PAIRINGS[fontKey];

  let nextHtml = html.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*>/g,
    `<link href="https://fonts.googleapis.com/css2?family=${fontPair.googleUrl}&display=swap" rel="stylesheet">`
  );

  if (!/fonts\.googleapis\.com/i.test(nextHtml)) {
    nextHtml = nextHtml.replace(
      /(<head[^>]*>)/i,
      `$1\n<link href="https://fonts.googleapis.com/css2?family=${fontPair.googleUrl}&display=swap" rel="stylesheet">`
    );
  }

  return nextHtml
    .replace(/var\(--qm-heading-font\)/g, `'${fontPair.heading}', sans-serif`)
    .replace(/var\(--qm-body-font\)/g, `'${fontPair.body}', sans-serif`);
}

function extractTextZones(html: string): Record<string, string> {
  const zones: Record<string, string> = {};
  const regex = /data-qm="([^"]+)"[^>]*>([^<]{0,240})</g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const zone = match[1];
    const current = match[2].trim();
    if (!zone.includes('image') && !zone.includes('img') && !zone.includes('photo') && current) {
      zones[zone] = current;
    }
  }
  return zones;
}

async function fillTextZones(
  zones: Record<string, string>,
  prompt: string,
  decision: TemplateDecision
): Promise<Record<string, string>> {
  const systemPrompt = [
    'You write website copy. Respond only with one valid JSON object.',
    'Keys are zone names and values are concise replacement text.',
    'Write specific copy for the described business. No markdown. No explanations. No lorem ipsum.',
  ].join('\n');

  const userPrompt = [
    `Business request: ${prompt}`,
    `Type: ${decision.siteType}`,
    `Name: ${decision.businessName || 'create a fitting business name if needed'}`,
    `Location: ${decision.location || 'not specified'}`,
    `Mood: ${decision.isDark ? 'dark' : 'light'}, ${decision.isLuxury ? 'luxury' : decision.isBold ? 'bold' : 'professional'}`,
    'Replace these zones with real copy while keeping roughly the same length:',
    JSON.stringify(zones, null, 2),
  ].join('\n');

  try {
    const text = await callWithFallback(userPrompt, systemPrompt);
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, string>
      : zones;
  } catch {
    return zones;
  }
}

function applyTextZones(html: string, zones: Record<string, string>) {
  let output = html;
  for (const [zone, text] of Object.entries(zones)) {
    if (!text) continue;
    output = output.replace(
      new RegExp(`(data-qm="${escapeRegExp(zone)}"[^>]*>)[^<]*(<)`, 'g'),
      `$1${escapeHtml(String(text))}$2`
    );
  }
  return output;
}

function swapImages(html: string, decision: TemplateDecision) {
  let imageIndex = 0;
  const providedImages = decision.imageUrls;
  const photos = PHOTOS[decision.siteType] || PHOTOS.agency;

  return html.replace(/(<img\b[^>]*\bsrc=")([^"]*)("[^>]*>)/gi, (full, before: string, _src: string, after: string) => {
    const imageUrl = providedImages.length > 0
      ? providedImages[imageIndex % providedImages.length]
      : `https://images.unsplash.com/photo-${photos[imageIndex % photos.length]}?w=1200&q=85&auto=format&fit=crop`;
    imageIndex += 1;
    return `${before}${imageUrl}${after}`;
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
