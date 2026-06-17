import { callWithFallback } from './providers';
import { getLibraryManifest } from '../section-library/manifest';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '../section-library/types';
import type { SiteDecision, SiteType } from './decision-schema';

const SYSTEM_PROMPT = `You are the prompt-translation layer for QAY, a website builder with a fixed library of professionally pre-designed sections.

You NEVER invent layout, HTML, or visual design. Every navbar, hero, footer, and section already exists as a numbered design in a library.

Your only job:
1. Detect intent from the user's prompt.
2. Read the available section manifest and pick section indexes.
3. Decide single-page-scroll vs multi-page.
4. Extract user-supplied brand name, colors, fonts, and image URLs exactly when present.
5. Generate specific text content only for missing copy zones.
6. Return ONLY valid JSON matching the SiteDecision schema. No markdown. No commentary.

Long briefs must be read in full. Map explicit page lists, product names, colors, slogans, CTAs, and features into the JSON.`;

const defaultColors: Record<SiteType, SiteDecision['brand']['colors']> = {
  ecommerce: { primary: '#0b0b0b', secondary: '#2b2b2b', accent: '#b6ff00', background: '#f7f5ee', isUserSupplied: false },
  restaurant: { primary: '#1d3d2f', secondary: '#7a2e18', accent: '#c2601f', background: '#fdf6ec', isUserSupplied: false },
  law: { primary: '#0c1326', secondary: '#1f2937', accent: '#b8922a', background: '#f8f7f2', isUserSupplied: false },
  medical: { primary: '#0d7377', secondary: '#3d6b4f', accent: '#49b6a8', background: '#f7fbfb', isUserSupplied: false },
  hotel: { primary: '#173b33', secondary: '#5e4b32', accent: '#c9a84c', background: '#f7f1e6', isUserSupplied: false },
  'real-estate': { primary: '#10231f', secondary: '#53645d', accent: '#b98b45', background: '#f4f0e8', isUserSupplied: false },
  portfolio: { primary: '#111111', secondary: '#5a5a5a', accent: '#ff4d2d', background: '#ffffff', isUserSupplied: false },
  agency: { primary: '#111111', secondary: '#4b5563', accent: '#2563eb', background: '#f8f8f6', isUserSupplied: false },
  saas: { primary: '#1e293b', secondary: '#64748b', accent: '#4f46e5', background: '#ffffff', isUserSupplied: false },
  education: { primary: '#1d4ed8', secondary: '#334155', accent: '#fbbf24', background: '#f8fbff', isUserSupplied: false },
  event: { primary: '#080c14', secondary: '#273449', accent: '#38bdf8', background: '#f8fafc', isUserSupplied: false },
  beauty: { primary: '#3d2434', secondary: '#8d536b', accent: '#d8a7b1', background: '#fff7f8', isUserSupplied: false },
  fitness: { primary: '#111827', secondary: '#374151', accent: '#22c55e', background: '#f7f7f2', isUserSupplied: false },
  church: { primary: '#263348', secondary: '#6b7280', accent: '#c9a84c', background: '#f8f5ef', isUserSupplied: false },
  blog: { primary: '#111111', secondary: '#57534e', accent: '#ef4444', background: '#fffdf8', isUserSupplied: false },
  nonprofit: { primary: '#164e63', secondary: '#475569', accent: '#f97316', background: '#f8fafc', isUserSupplied: false },
  construction: { primary: '#1f2937', secondary: '#4b5563', accent: '#f59e0b', background: '#f7f5ef', isUserSupplied: false },
  'tech-startup': { primary: '#0f172a', secondary: '#334155', accent: '#06b6d4', background: '#f8fafc', isUserSupplied: false },
  photography: { primary: '#111111', secondary: '#57534e', accent: '#d97706', background: '#f7f3ec', isUserSupplied: false },
  music: { primary: '#111827', secondary: '#4b5563', accent: '#a855f7', background: '#faf5ff', isUserSupplied: false },
};

const defaultFonts = {
  heading: 'Inter',
  body: 'Inter',
  isUserSupplied: false,
};

export async function translatePromptToDecision(
  userPrompt: string,
  forcedSiteType?: SiteType
): Promise<SiteDecision> {
  const siteType = forcedSiteType || detectSiteTypeFast(userPrompt);
  const manifest = await getLibraryManifest(siteType);

  const userMessage = `
SITE TYPE DETECTED: ${siteType}

AVAILABLE SECTION DESIGNS FOR "${siteType}" (pick by index):
${manifest}

USER REQUEST (read in full, map every explicit detail):
"""
${userPrompt}
"""

Respond with ONLY the JSON SiteDecision object.`;

  const text = await callWithFallback(userMessage, SYSTEM_PROMPT);
  const cleaned = text.trim()
    .replace(/^```json\n?/i, '')
    .replace(/^```\n?/i, '')
    .replace(/\n?```$/i, '');
  return normalizeDecision(JSON.parse(cleaned) as Partial<SiteDecision>, userPrompt, siteType);
}

export function detectSiteTypeFast(prompt: string): SiteType {
  const p = prompt.toLowerCase();
  const scores: Partial<Record<SiteType, number>> = {};

  for (const [type, keywords] of Object.entries(SITE_TYPE_KEYWORDS) as Array<[SiteType, string[]]>) {
    for (const keyword of keywords) {
      if (p.includes(keyword.toLowerCase())) {
        scores[type] = (scores[type] || 0) + 1;
      }
    }
  }

  if (/\b(clothing|streetwear|shop|store|cart|checkout|product|fashion|brand|collection|apparel)\b/i.test(prompt)) {
    scores.ecommerce = (scores.ecommerce || 0) + 3;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] as SiteType || 'agency';
}

function extractBrandName(prompt: string, siteType: SiteType) {
  const quoted = prompt.match(/["“”']([^"“”']{2,80})["“”']/)?.[1];
  if (quoted) return quoted.trim();

  const called = prompt.match(/\b(?:called|named|brand called|brand named|for)\s+([A-Z][A-Za-z0-9&'. -]{2,60})/)?.[1];
  if (called) return called.replace(/\b(that|which|with|and)\b.*$/i, '').trim();

  return siteType === 'ecommerce' ? 'Baddo World' : 'QAY Studio';
}

function extractTagline(prompt: string, brandName: string, siteType: SiteType) {
  const quotedTagline = prompt.match(/\b(?:tagline|subtext|slogan)\s*:\s*["“”']?([^"\n“”']{4,120})/i)?.[1];
  if (quotedTagline) return quotedTagline.trim();
  if (siteType === 'ecommerce' && /streetwear|clothing|fashion/i.test(prompt)) return 'Wear the culture. Own the streets.';
  return `${brandName} built with clarity, taste, and momentum.`;
}

function detectNavMode(prompt: string, siteType: SiteType): SiteDecision['navMode'] {
  if (/\bsingle[- ]page\b|\bone page\b|\blanding page only\b/i.test(prompt)) return 'single-page-scroll';
  if (siteType === 'ecommerce') return 'multi-page';
  if (/\b(homepage|shop|product|cart|checkout|about page|contact page|pricing page|login|signup|pages?)\b/i.test(prompt)) return 'multi-page';
  return 'single-page-scroll';
}

function defaultPages(siteType: SiteType, navMode: SiteDecision['navMode']): SiteDecision['pages'] {
  const homeSlots = SECTION_ORDER[siteType] || SECTION_ORDER.agency;
  if (navMode === 'single-page-scroll') {
    return [{ name: 'Homepage', slug: '/', sectionSlots: homeSlots.map((slot) => slot === 'nav' ? 'navbar' : slot) }];
  }
  if (siteType === 'ecommerce') {
    return [
      { name: 'Homepage', slug: '/', sectionSlots: ['navbar', 'hero', 'collectionsLanding', 'productGrid', 'brandStory', 'testimonials', 'newsletter', 'footer'] },
      { name: 'Shop', slug: 'shop', sectionSlots: ['navbar', 'productGrid', 'footer'] },
      { name: 'Product', slug: 'product', sectionSlots: ['navbar', 'productDetail', 'productGrid', 'footer'] },
      { name: 'Cart', slug: 'cart', sectionSlots: ['navbar', 'cart', 'footer'] },
      { name: 'Checkout', slug: 'checkout', sectionSlots: ['navbar', 'checkout', 'footer'] },
      { name: 'About', slug: 'about', sectionSlots: ['navbar', 'brandStory', 'footer'] },
      { name: 'Contact', slug: 'contact', sectionSlots: ['navbar', 'contact', 'footer'] },
    ];
  }
  return [
    { name: 'Homepage', slug: '/', sectionSlots: homeSlots.map((slot) => slot === 'nav' ? 'navbar' : slot) },
    { name: 'About', slug: 'about', sectionSlots: ['navbar', 'about', 'footer'] },
    { name: siteType === 'saas' || siteType === 'tech-startup' ? 'Features' : 'Services', slug: siteType === 'saas' || siteType === 'tech-startup' ? 'features' : 'services', sectionSlots: ['navbar', siteType === 'saas' || siteType === 'tech-startup' ? 'features' : 'services', 'footer'] },
    { name: 'Contact', slug: 'contact', sectionSlots: ['navbar', 'contact', 'footer'] },
  ];
}

function normalizeDecision(decision: Partial<SiteDecision>, prompt: string, siteType: SiteType): SiteDecision {
  const brandName = decision.brand?.name || extractBrandName(prompt, siteType);
  const navMode = decision.navMode || detectNavMode(prompt, siteType);
  const textContent = {
    'brand-name': brandName,
    'footer-brand': brandName,
    'hero-title': siteType === 'ecommerce' ? `Welcome to ${brandName}` : `${brandName} built with clarity and taste.`,
    'hero-subtitle': decision.brand?.tagline || extractTagline(prompt, brandName, siteType),
    ...decision.textContent,
  };

  return {
    siteType,
    confidence: decision.confidence || 'medium',
    navMode,
    sectionPicks: decision.sectionPicks || {},
    pages: decision.pages?.length ? decision.pages : defaultPages(siteType, navMode),
    brand: {
      name: brandName,
      tagline: decision.brand?.tagline || extractTagline(prompt, brandName, siteType),
      colors: {
        ...defaultColors[siteType],
        ...(decision.brand?.colors || {}),
        isUserSupplied: Boolean(decision.brand?.colors?.isUserSupplied),
      },
      fonts: {
        ...defaultFonts,
        ...(decision.brand?.fonts || {}),
        isUserSupplied: Boolean(decision.brand?.fonts?.isUserSupplied),
      },
      images: decision.brand?.images || {},
    },
    textContent,
    notes: decision.notes || [],
  };
}
