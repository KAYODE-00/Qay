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
  ecommerce: ['shop', 'store', 'sell', 'cart', 'checkout', 'product', 'fashion', 'clothing', 'brand', 'boutique', 'merch', 'apparel', 'streetwear', 'collection', 'perfume', 'skincare', 'jewelry'],
  restaurant: ['restaurant', 'food', 'menu', 'dining', 'cafe', 'chef', 'cuisine', 'bistro', 'kitchen', 'jollof', 'suya', 'eatery', 'catering', 'bar'],
  portfolio: ['portfolio', 'my work', 'projects', 'case studies', 'freelance', 'hire me', 'designer', 'developer', 'photographer'],
  agency: ['agency', 'studio', 'branding', 'creative agency', 'marketing agency', 'design studio', 'consulting'],
  saas: ['saas', 'software', 'app', 'platform', 'dashboard', 'tool', 'automation', 'workflow', 'subscription', 'b2b'],
  blog: ['blog', 'newsletter', 'publication', 'editorial', 'articles', 'posts', 'writing', 'magazine', 'content'],
  law: ['law firm', 'attorney', 'barrister', 'legal', 'solicitor', 'litigation', 'counsel'],
  medical: ['clinic', 'hospital', 'doctor', 'dentist', 'medical', 'health center', 'physician'],
  beauty: ['salon', 'spa', 'barber', 'makeup', 'nail', 'lash', 'beauty', 'hair'],
  education: ['course', 'academy', 'school', 'bootcamp', 'training', 'tutor', 'learn', 'coaching'],
  event: ['event', 'wedding', 'conference', 'concert', 'rsvp', 'tickets', 'festival', 'ceremony'],
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

  const nameMatch = prompt.match(/(?:called|named)\s+["']?([A-Za-z][A-Za-z0-9\s'&.-]{1,40})["']?/i)
    || prompt.match(/"([^"]{2,40})"/)
    || prompt.match(/'([^']{2,40})'/);
  const businessName = nameMatch ? nameMatch[1].trim() : null;

  const hexes = prompt.match(/#[0-9a-fA-F]{6}/g) || [];
  const colors = hexes.length > 0
    ? { primary: hexes[0], accent: hexes[1], bg: hexes[2] }
    : null;

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
