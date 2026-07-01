export interface TemplateDecision {
  siteType: string;
  theme: string;
  businessName: string | null;
  colors: { primary?: string; accent?: string; bg?: string } | null;
  fonts: { heading?: string; body?: string } | null;
  imageUrls: string[];
  layoutVariant: number;
  isDark: boolean;
  isLuxury: boolean;
  isBold: boolean;
  location: string | null;
}

const SITE_SIGNALS: Record<string, string[]> = {
  ecommerce: ['shop', 'store', 'sell', 'cart', 'checkout', 'product', 'fashion', 'clothing', 'brand', 'boutique', 'merch', 'apparel', 'streetwear', 'collection', 'perfume', 'skincare', 'jewelry', 'phone', 'phones', 'smartphone', 'gadgets', 'electronics', 'devices'],
  restaurant: ['restaurant', 'food', 'menu', 'dining', 'cafe', 'chef', 'cuisine', 'bistro', 'kitchen', 'jollof', 'suya', 'eatery', 'catering', 'bar'],
  portfolio: ['portfolio', 'my work', 'projects', 'case studies', 'freelance', 'hire me', 'designer', 'developer', 'photographer'],
  agency: ['agency', 'studio', 'branding', 'creative agency', 'marketing agency', 'design studio', 'consulting'],
  saas: ['saas', 'software', 'app', 'platform', 'dashboard', 'tool', 'automation', 'workflow', 'subscription', 'b2b'],
  blog: ['blog', 'newsletter', 'publication', 'editorial', 'articles', 'posts', 'writing', 'magazine', 'content'],
  law: ['law firm', 'attorney', 'barrister', 'legal', 'solicitor', 'litigation', 'counsel'],
  medical: ['clinic', 'hospital', 'doctor', 'dentist', 'medical', 'health center', 'physician'],
  beauty: ['salon', 'spa', 'barber', 'makeup', 'nail', 'lash', 'beauty', 'hair'],
  education: ['course', 'academy', 'school', 'bootcamp', 'training', 'tutor', 'learn', 'coaching', 'admissions', 'campus', 'curriculum', 'students', 'college', 'university'],
  event: ['event', 'wedding', 'conference', 'concert', 'rsvp', 'tickets', 'festival', 'ceremony'],
  'real-estate': ['real estate', 'property', 'properties', 'listing', 'listings', 'homes', 'realty', 'realtor', 'apartment', 'housing', 'mortgage'],
  fitness: ['gym', 'fitness', 'yoga', 'crossfit', 'trainer', 'workout', 'sports club'],
  hotel: ['hotel', 'resort', 'lodge', 'accommodation', 'rooms', 'booking'],
  church: ['church', 'ministry', 'worship', 'congregation', 'gospel', 'mosque', 'temple'],
  nonprofit: ['charity', 'nonprofit', 'ngo', 'foundation', 'donate', 'cause', 'mission'],
  photography: ['photography', 'photographer', 'photo shoots', 'portraits', 'shoots'],
  music: ['band', 'musician', 'dj', 'album', 'tour', 'beats', 'record', 'artist'],
};

const THEME_SIGNALS: Record<string, string[]> = {
  dark: ['dark', 'black', 'obsidian', 'midnight', 'noir', 'moody', 'dramatic', 'night'],
  luxury: ['luxury', 'premium', 'high-end', 'exclusive', 'bespoke', 'elite', 'upscale', 'fine', 'sophisticated'],
  bold: ['bold', 'vibrant', 'energetic', 'urban', 'street', 'hype', 'loud', 'neon', 'colorful'],
  warm: ['warm', 'cozy', 'rustic', 'traditional', 'homey', 'classic', 'heritage', 'vintage'],
  minimal: ['minimal', 'clean', 'simple', 'airy', 'sleek', 'stripped', 'monochrome', 'whitespace'],
  light: ['light', 'white', 'bright', 'fresh', 'soft', 'pastel', 'open'],
};

function scoreSignals(prompt: string, signals: Record<string, string[]>) {
  const scores: Record<string, number> = {};
  for (const [type, keywords] of Object.entries(signals)) {
    for (const keyword of keywords) {
      if (prompt.includes(keyword)) {
        scores[type] = (scores[type] || 0) + 1;
      }
    }
  }
  return scores;
}

function topScore(scores: Record<string, number>, fallback: string) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
}

function stableLayoutVariant(prompt: string) {
  let hash = 0;
  for (let i = 0; i < prompt.length; i += 1) {
    hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 4) + 1;
}

const PROMPT_COLOR_NAMES: Record<string, string> = {
  'neon green': '#39ff14',
  'neon blue': '#3b82ff',
  'deep grey': '#171717',
  'deep gray': '#171717',
  charcoal: '#111111',
  black: '#050505',
  white: '#ffffff',
  cream: '#fff7ed',
  ivory: '#fffaf0',
  gold: '#d4af37',
  yellow: '#eab308',
  amber: '#f59e0b',
  blue: '#2563eb',
  navy: '#0f172a',
  indigo: '#4f46e5',
  purple: '#7c3aed',
  violet: '#8b5cf6',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  red: '#ef4444',
  crimson: '#dc143c',
  pink: '#ec4899',
  orange: '#f97316',
  burgundy: '#800020',
  slate: '#475569',
  gray: '#6b7280',
  grey: '#6b7280',
  beige: '#f5f5dc',
  brown: '#92400e',
};

function isColorDark(hex: string) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3 ? value.split('').map((char) => `${char}${char}`).join('') : value.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return false;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function findNamedColor(value: string) {
  const lower = value.toLowerCase();
  const hex = lower.match(/#[0-9a-f]{3,8}/i)?.[0];
  if (hex) return hex;
  const name = Object.keys(PROMPT_COLOR_NAMES)
    .sort((a, b) => b.length - a.length)
    .find((item) => new RegExp(`\\b${item.replace(/\s+/g, '\\s+')}\\b`, 'i').test(lower));
  return name ? PROMPT_COLOR_NAMES[name] : undefined;
}

function colorMentions(prompt: string) {
  const mentions: Array<{ color: string; name: string; index: number }> = [];
  for (const match of prompt.matchAll(/#[0-9a-fA-F]{3,8}/g)) {
    mentions.push({ color: match[0], name: match[0], index: match.index || 0 });
  }
  for (const [name, color] of Object.entries(PROMPT_COLOR_NAMES)) {
    const regex = new RegExp(`\\b${name.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    for (const match of prompt.matchAll(regex)) {
      mentions.push({ color, name, index: match.index || 0 });
    }
  }

  return mentions
    .sort((a, b) => a.index - b.index)
    .filter((item, index, list) => list.findIndex((other) => other.color.toLowerCase() === item.color.toLowerCase()) === index);
}

function promptAllowsLightDarkSupport(prompt: string) {
  return /\b(white\s*\/\s*dark|light\s*\/\s*dark|dark mode toggle|dark mode support|both light and dark|light and dark mode)\b/i.test(prompt);
}

function extractPromptColors(prompt: string) {
  const mentions = colorMentions(prompt);
  const colors: { primary?: string; accent?: string; bg?: string } = {};
  colors.primary = findNamedColor(prompt.match(/\bprimary\s*:\s*([^\n.;]+)/i)?.[1] || '');
  colors.accent = findNamedColor(prompt.match(/\baccent\s*:\s*([^\n.;]+)/i)?.[1] || '');
  colors.bg = findNamedColor(prompt.match(/\b(?:background|bg)\s*:\s*([^\n.;]+)/i)?.[1] || '');

  if (!colors.bg) {
    const backgroundIntent = prompt.match(/\b([a-z ]{3,32})\s+(?:for|as)\s+(?:the\s+)?(?:background|bg)\b/i)
      || prompt.match(/\b(?:background|bg)\s+(?:should\s+be|is|as|with|use)?\s*([a-z ]{3,32})\b/i);
    const target = backgroundIntent?.[1]?.trim().toLowerCase();
    if (target) {
      colors.bg = mentions.find((mention) => target.includes(mention.name) || mention.name.includes(target))?.color;
    }
  }

  if (!colors.bg && mentions.length >= 2 && !promptAllowsLightDarkSupport(prompt)) {
    colors.bg = mentions.find((mention) => isColorDark(mention.color))?.color;
  }

  if (!colors.bg && /\b(black|dark|midnight|obsidian|noir|deep grey|deep gray)\b/i.test(prompt) && !promptAllowsLightDarkSupport(prompt)) {
    colors.bg = findNamedColor(prompt);
  }

  if (!colors.accent) {
    colors.accent = mentions.find((mention) => mention.color.toLowerCase() !== colors.bg?.toLowerCase())?.color;
  }

  if (!colors.primary && colors.bg) {
    colors.primary = isColorDark(colors.bg) ? '#f8fafc' : '#111111';
  }

  return colors.primary || colors.accent || colors.bg ? colors : null;
}

function cleanBusinessName(value: string) {
  return value
    .replace(/\s+(?:using|use|with|for|that|which|and|where|to)\b[\s\S]*$/i, '')
    .replace(/[.,:;]+$/g, '')
    .trim();
}

export function detectTemplateChoice(prompt: string, variationOverride?: number): TemplateDecision {
  const p = prompt.toLowerCase();
  const siteScores = scoreSignals(p, SITE_SIGNALS);
  const siteType = topScore(siteScores, 'agency');
  const themeScores = scoreSignals(p, THEME_SIGNALS);
  let theme = topScore(themeScores, 'light');

  const isDark = (themeScores.dark || 0) > 0;
  const isLuxury = (themeScores.luxury || 0) > 0;
  const isBold = (themeScores.bold || 0) > 0;
  if (isDark && isLuxury) theme = 'luxury';
  if (isBold) theme = 'bold';

  const nameMatch = prompt.match(/(?:called|named|brand called|brand named|company called|company named)\s+["']?([A-Za-z][A-Za-z0-9\s'&.-]{1,50})["']?/i)
    || prompt.match(/\bfor\s+(?:a\s+|an\s+|the\s+)?(?:company|brand|business|site|school|restaurant|store|agency|portfolio)?\s*["']?([A-Za-z][A-Za-z0-9\s'&.-]{1,50})["']?/i)
    || prompt.match(/"([^"]{2,40})"/)
    || prompt.match(/'([^']{2,40})'/);
  const businessName = nameMatch ? cleanBusinessName(nameMatch[1]) : null;

  const hexes = prompt.match(/#[0-9a-fA-F]{6}/g) || [];
  const namedColors = extractPromptColors(prompt);
  const colors = hexes.length > 0
    ? { primary: hexes[0], accent: hexes[1], bg: hexes[2] }
    : namedColors;

  const headingFont = prompt.match(/(?:heading\s+font|font|typeface)[:\s]+([A-Za-z\s]+?)(?:\s+and|\s*,|\.|$)/i)?.[1]?.trim();
  const bodyFont = prompt.match(/(?:body\s+font)[:\s]+([A-Za-z\s]+?)(?:\s+and|\s*,|\.|$)/i)?.[1]?.trim();
  const fonts = headingFont || bodyFont ? { heading: headingFont, body: bodyFont } : null;

  const imageUrls = prompt.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>]*)?/gi) || [];

  let location: string | null = null;
  const cities = ['lagos', 'abuja', 'port harcourt', 'accra', 'nairobi', 'london', 'new york', 'dubai', 'kano'];
  for (const city of cities) {
    if (p.includes(city)) {
      location = city;
      break;
    }
  }
  const locMatch = prompt.match(/(?:based in|located in|in)\s+([A-Za-z\s,]{3,30}?)(?:\s+(?:that|which|for)|\.|,|$)/i);
  if (locMatch && !location) location = locMatch[1].trim();

  const requestedVariant = Number(variationOverride);
  const layoutVariant = Number.isInteger(requestedVariant) && requestedVariant >= 1 && requestedVariant <= 4
    ? requestedVariant
    : stableLayoutVariant(prompt);

  return {
    siteType,
    theme,
    businessName,
    colors,
    fonts,
    imageUrls,
    layoutVariant,
    isDark,
    isLuxury,
    isBold,
    location,
  };
}
