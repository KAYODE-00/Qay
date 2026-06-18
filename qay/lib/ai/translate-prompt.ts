import { callWithFallback } from './providers';
import { getLibraryManifest } from '../section-library/manifest';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '../section-library/types';
import type { SiteDecision, SiteType } from './decision-schema';

const SYSTEM_PROMPT = `You are the prompt-translation layer for QAY, a website builder with a fixed library of professionally pre-designed sections.

You NEVER invent layout, HTML, or visual design. Every navbar, hero, footer, and section already exists as a numbered design in a library.

## Your Job
1. Detect the site type from the user's prompt.
2. Read the available section manifest and pick ONLY section indexes that exist in the manifest for the detected site type.
3. Decide single-page-scroll vs multi-page based on the prompt.
4. Extract OR generate brand details.
5. Generate compelling, realistic text content for every zone.
6. Return ONLY valid JSON matching the SiteDecision schema. No markdown. No commentary.

## CRITICAL: Section Compatibility Rules
You MUST only pick sections that belong to the detected site type. Each site type has specific section types:
- **restaurant**: nav, hero, menu, about, gallery, testimonials, contact, footer — uses MENU sections (dishes, prices, cuisine), NOT product grids or collections
- **ecommerce**: nav, hero, collection, products, about, testimonials, cta, footer — uses PRODUCT sections (product grids, collections, shop), NOT menus or schedules
- **portfolio**: nav, hero, features, about, gallery, testimonials, contact, footer — uses GALLERY and WORK sections
- **agency**: nav, hero, features, about, team, testimonials, cta, footer — uses TEAM and FEATURES sections
- **saas**: nav, hero, features, stats, testimonials, pricing, faq, cta, footer — uses PRICING and FAQ sections
- **law/medical**: nav, hero, services, team, stats, testimonials, contact, footer — uses SERVICES and TEAM sections
- **hotel**: nav, hero, features, gallery, pricing, testimonials, contact, footer — uses ROOM/AMENITY sections
- **fitness**: nav, hero, features, schedule, team, testimonials, pricing, footer — uses SCHEDULE and TRAINER sections
- **event**: nav, hero, schedule, team, gallery, stats, contact, footer — uses SCHEDULE and SPEAKER sections
- **beauty**: nav, hero, services, gallery, team, testimonials, cta, footer — uses TREATMENT/SERVICE sections
- **church**: nav, hero, about, schedule, team, gallery, cta, footer — uses SERMON/EVENT SCHEDULE sections
- **construction**: nav, hero, services, gallery, stats, team, contact, footer — uses PROJECT/SERVICE sections

NEVER assign a "menu" section to an ecommerce site. NEVER assign a "productGrid" or "collection" section to a restaurant. Each section type MUST match the site type's industry.

## Text Content Generation
Generate specific, realistic, compelling copy for ALL text zones:
- Brand name: Use the user's specified name, or generate a memorable, industry-appropriate name
- Hero title: A powerful, specific headline that captures the brand's essence — NOT generic marketing filler
- Hero subtitle: A supporting line that adds detail and emotional depth
- Hero CTA: Action-oriented button text specific to the industry (e.g., "Shop Collection" for ecommerce, "Book a Table" for restaurant, "Get Started" for SaaS)
- Tagline: A memorable brand tagline that feels authentic to the niche
- All text should feel like it was written by a professional copywriter who understands the specific industry

## Color Palette Generation & Balancing
You are responsible for generating a beautiful, professionally balanced color palette for the website:
- **If the user specifies colors** (e.g., "red theme", "neon green and black", "#ff5500", "dark blue background"):
  * Incorporate their chosen color(s) into the palette.
  * You MUST balance the palette to prevent a "color riot" (clashing/overwhelming colors). Do NOT make both primary and accent the same bright color.
  * Assign the user's main color to the 'accent' color.
  * If they requested a dark mode, dark background, or black/navy theme, set the 'background' to a dark color (e.g., '#0a0a0a', '#0f172a') and set the 'primary' text color to a light color (e.g., '#ffffff', '#f1f5f9').
  * If they did not ask for a dark background, keep the 'background' light (e.g. '#ffffff', '#f8fafc', or a very light/soft tint of their primary color, like '#fff5f5' for a red theme) to ensure readability and balance.
  * Set the 'primary' color to a solid, readable text color (e.g. a deep slate '#1e293b' or charcoal '#111111' for light mode).
  * Set the 'secondary' color to a harmonious, muted tone (e.g., '#475569', '#64748b').
  * ALWAYS set 'isUserSupplied' to true.
- **If the user does NOT specify colors**:
  * Generate a beautiful, cohesive color palette that evokes the mood and industry of the brand.
  * Ensure sufficient contrast. The accent color should be vibrant.
  * Set 'isUserSupplied' to true so the system uses your generated palette.
  * Example moods: luxury = deep darks + gold/champagne, tech = navy + cyan, food = warm earth tones, fashion = bold contrast.

## Page Structure
- For single-page prompts or simple sites: use single-page-scroll
- For e-commerce, multi-service businesses, or when user mentions multiple pages: use multi-page
- E-commerce sites should ALWAYS be multi-page with: Homepage, Shop, Product, Cart, Checkout, About, Contact

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

export async function detectSiteTypeWithAi(prompt: string): Promise<SiteType> {
  const p = prompt.toLowerCase();
  if (/\b(store|shop|ecommerce|e-commerce)\b/i.test(p)) {
    return 'ecommerce';
  }
  const localType = detectSiteTypeFast(prompt);
  try {
    const response = await callWithFallback(
      `User prompt: "${prompt}"\n\nChoose the single most appropriate SiteType from this list:\n${JSON.stringify(Object.keys(SECTION_ORDER))}\n\nReturn only the lowercase string matching one of the options. No explanation, no punctuation.`,
      'You are a site classifier. Return only the correct SiteType string.'
    );
    const cleaned = response.trim().toLowerCase().replace(/['"`.]/g, '');
    if (Object.keys(SECTION_ORDER).includes(cleaned)) {
      return cleaned as SiteType;
    }
  } catch (err) {
    console.warn('[AI Classifier] Site classification failed, using fast local match:', err);
  }
  return localType;
}

export async function translatePromptToDecision(
  userPrompt: string,
  forcedSiteType?: SiteType
): Promise<SiteDecision> {
  const siteType = forcedSiteType || await detectSiteTypeWithAi(userPrompt);
  const manifest = await getLibraryManifest(siteType);

  const validSlots = (SECTION_ORDER[siteType] || SECTION_ORDER.agency).map((s) => s === 'nav' ? 'navbar' : s);

  const userMessage = `
SITE TYPE DETECTED: ${siteType}
VALID SECTION TYPES FOR "${siteType}": ${validSlots.join(', ')}

AVAILABLE SECTION DESIGNS (pick by index number ONLY from the list below):
${manifest}

IMPORTANT RULES:
- Your sectionPicks keys MUST only use the section types listed above for "${siteType}".
- Do NOT include section types from other site types (e.g., no "menu" for ecommerce, no "productGrid" for restaurant).
- For each sectionPicks key, the value must be a valid index number from the manifest above.
- Generate compelling, niche-specific text for brand name, tagline, hero title, hero subtitle.
- If user did not specify colors, generate a beautiful cohesive palette and set isUserSupplied to true.

USER REQUEST (read every detail carefully):
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
  if (/\b(store|shop|ecommerce|e-commerce)\b/i.test(p)) {
    return 'ecommerce';
  }
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
  // Only single-page if user explicitly asks
  if (/\bsingle[- ]page\b|\bone page\b|\blanding page only\b|\blanding\b/i.test(prompt)) return 'single-page-scroll';
  // Default everything to multi-page
  return 'multi-page';
}

function defaultPages(siteType: SiteType, navMode: SiteDecision['navMode'], prompt?: string): SiteDecision['pages'] {
  const homeSlots = SECTION_ORDER[siteType] || SECTION_ORDER.agency;
  
  const hasAuth = prompt ? /\b(auth|login|register|signup|signin|sign-in|sign-up|protect|member|membership|dashboard)\b/i.test(prompt) : false;

  const authPages = hasAuth ? [
    { name: 'Login', slug: 'login', sectionSlots: ['navbar', 'login', 'footer'] },
    { name: 'Register', slug: 'register', sectionSlots: ['navbar', 'register', 'footer'] },
    { name: 'Dashboard', slug: 'dashboard', sectionSlots: ['navbar', 'dashboard', 'footer'] },
  ] : [];

  if (navMode === 'single-page-scroll') {
    return [
      { name: 'Homepage', slug: '/', sectionSlots: homeSlots.map((slot) => slot === 'nav' ? 'navbar' : slot) },
      ...authPages
    ];
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
      ...authPages
    ];
  }
  return [
    { name: 'Homepage', slug: '/', sectionSlots: homeSlots.map((slot) => slot === 'nav' ? 'navbar' : slot) },
    { name: 'About', slug: 'about', sectionSlots: ['navbar', 'about', 'footer'] },
    { name: siteType === 'saas' || siteType === 'tech-startup' ? 'Features' : 'Services', slug: siteType === 'saas' || siteType === 'tech-startup' ? 'features' : 'services', sectionSlots: ['navbar', siteType === 'saas' || siteType === 'tech-startup' ? 'features' : 'services', 'footer'] },
    { name: 'Contact', slug: 'contact', sectionSlots: ['navbar', 'contact', 'footer'] },
    ...authPages
  ];
}

export function extractUserColors(prompt: string): Partial<SiteDecision['brand']['colors']> | null {
  const colors: Partial<SiteDecision['brand']['colors']> = {};
  let found = false;

  // Match hex colors like #ff0000, #f00
  const hexMatches = prompt.match(/#[0-9a-fA-F]{3,8}/g);
  if (hexMatches?.length) {
    found = true;
    if (hexMatches.length >= 1) colors.accent = hexMatches[0];
    if (hexMatches.length >= 2) colors.primary = hexMatches[1];
    if (hexMatches.length >= 3) colors.background = hexMatches[2];
  }

  // Match named color keywords with intent
  const colorMap: Record<string, string> = {
    red: '#e53e3e', crimson: '#dc143c', scarlet: '#ff2400',
    blue: '#3b82f6', navy: '#1e3a5f', 'royal blue': '#4169e1', cobalt: '#0047ab',
    green: '#22c55e', emerald: '#059669', lime: '#84cc16', forest: '#228b22',
    purple: '#8b5cf6', violet: '#7c3aed', indigo: '#4f46e5', lavender: '#967bb6',
    pink: '#ec4899', rose: '#f43f5e', magenta: '#ff00ff', coral: '#ff7f50',
    orange: '#f97316', amber: '#f59e0b', tangerine: '#ff9966',
    yellow: '#eab308', gold: '#d4af37', champagne: '#f7e7ce',
    teal: '#14b8a6', cyan: '#06b6d4', turquoise: '#40e0d0', aqua: '#00ffff',
    black: '#111111', white: '#ffffff', cream: '#fffdd0', ivory: '#fffff0',
    gray: '#6b7280', silver: '#c0c0c0', charcoal: '#36454f', slate: '#475569',
    brown: '#92400e', chocolate: '#7b3f00', maroon: '#800000', burgundy: '#800020',
    beige: '#f5f5dc', tan: '#d2b48c', khaki: '#c3b091',
    mint: '#3eb489', sage: '#b2ac88', olive: '#808000',
    peach: '#ffcba4', salmon: '#fa8072',
    'neon green': '#39ff14', 'neon pink': '#ff6ec7', 'neon blue': '#1b03a3',
    'dark mode': '#0a0a0a', 'dark theme': '#0a0a0a',
  };

  const lower = prompt.toLowerCase();
  for (const [name, hex] of Object.entries(colorMap)) {
    if (lower.includes(name)) {
      found = true;
      // Treat as accent color primarily; "dark mode/theme" sets background
      if (name === 'dark mode' || name === 'dark theme') {
        colors.background = hex;
        colors.primary = '#ffffff';
      } else if (name === 'black' && /\b(background|bg)\b/i.test(lower)) {
        colors.background = hex;
      } else if (name === 'white' && /\b(background|bg)\b/i.test(lower)) {
        colors.background = hex;
      } else {
        if (!colors.accent) colors.accent = hex;
        else if (!colors.primary) colors.primary = hex;
      }
    }
  }

  if (found) {
    if (colors.accent && !colors.primary) {
      colors.primary = colors.accent;
    } else if (colors.primary && !colors.accent) {
      colors.accent = colors.primary;
    }
  }

  return found ? colors : null;
}

function normalizeDecision(decision: Partial<SiteDecision>, prompt: string, siteType: SiteType): SiteDecision {
  const brandName = decision.brand?.name || extractBrandName(prompt, siteType);
  const navMode = decision.navMode || detectNavMode(prompt, siteType);

  // Validate sectionPicks: only keep picks that belong to this site type
  const validSectionTypes: Set<string> = new Set(
    (SECTION_ORDER[siteType] || SECTION_ORDER.agency).map((s) => {
      if (s === 'nav') return 'navbar';
      if (s === 'products') return 'productGrid';
      if (s === 'collection') return 'collectionsLanding';
      return s;
    })
  );
  // Also add the raw names so both 'products' and 'productGrid' work
  for (const s of SECTION_ORDER[siteType] || SECTION_ORDER.agency) {
    validSectionTypes.add(s);
  }

  const rawPicks = decision.sectionPicks || {};
  const validatedPicks: Record<string, number> = {};
  for (const [key, value] of Object.entries(rawPicks)) {
    if (validSectionTypes.has(key)) {
      validatedPicks[key] = value;
    } else {
      console.warn(`[QAY AI] Stripped invalid sectionPick "${key}" for site type "${siteType}"`);
    }
  }

  const textContent = {
    'brand-name': brandName,
    'footer-brand': brandName,
    'hero-title': siteType === 'ecommerce' ? `Welcome to ${brandName}` : `${brandName} built with clarity and taste.`,
    'hero-subtitle': decision.brand?.tagline || extractTagline(prompt, brandName, siteType),
    ...decision.textContent,
  };

  // Extract user-specified colors from prompt text via regex as a fallback
  const userColors = extractUserColors(prompt);
  const aiColors = (decision.brand?.colors || {}) as Partial<SiteDecision['brand']['colors']>;

  let mergedColors;
  if (aiColors.isUserSupplied) {
    // Trust the AI generated balanced colors
    mergedColors = {
      ...defaultColors[siteType],
      ...aiColors,
    };
  } else if (userColors) {
    // Fallback to regex-extracted colors, but balance them:
    const accent = userColors.accent || defaultColors[siteType].accent;
    const background = userColors.background || defaultColors[siteType].background;
    
    // If background is dark, ensure primary is light, and vice-versa
    const primary = userColors.primary || (isDark(background) ? '#ffffff' : '#111111');
    const secondary = isDark(background) ? 'rgba(255,255,255,0.68)' : 'rgba(17,17,17,0.62)';

    mergedColors = {
      primary,
      secondary,
      accent,
      background,
      isUserSupplied: true,
    };
  } else {
    // Default fallback
    mergedColors = {
      ...defaultColors[siteType],
      isUserSupplied: false,
    };
  }

  // Enforce auth pages if auth keywords are present
  let pages = decision.pages?.length ? decision.pages : defaultPages(siteType, navMode, prompt);
  const hasAuth = /\b(auth|login|register|signup|signin|sign-in|sign-up|protect|member|membership|dashboard)\b/i.test(prompt);

  if (hasAuth) {
    if (!pages.some(p => p.slug === 'login')) {
      pages.push({ name: 'Login', slug: 'login', sectionSlots: ['navbar', 'login', 'footer'] });
    }
    if (!pages.some(p => p.slug === 'register')) {
      pages.push({ name: 'Register', slug: 'register', sectionSlots: ['navbar', 'register', 'footer'] });
    }
    if (!pages.some(p => p.slug === 'dashboard')) {
      pages.push({ name: 'Dashboard', slug: 'dashboard', sectionSlots: ['navbar', 'dashboard', 'footer'] });
    }
  }

  // Enforce navbar/footer present on all pages
  pages = pages.map((page) => {
    let slots = page.sectionSlots || [];
    slots = slots.map((s) => {
      if (s === 'nav') return 'navbar';
      if (s === 'products') return 'productGrid';
      if (s === 'collection') return 'collectionsLanding';
      return s;
    });

    if (!slots.includes('navbar') && !slots.includes('nav')) {
      slots.unshift('navbar');
    }
    if (!slots.includes('footer')) {
      slots.push('footer');
    }
    return { ...page, sectionSlots: slots };
  });

  return {
    siteType,
    confidence: decision.confidence || 'medium',
    navMode,
    sectionPicks: validatedPicks,
    pages,
    brand: {
      name: brandName,
      tagline: decision.brand?.tagline || extractTagline(prompt, brandName, siteType),
      colors: mergedColors,
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

function safeColor(value: string | undefined, fallback: string) {
  return /^#[0-9a-f]{3,8}$/i.test(value || '') ? value as string : fallback;
}

function isDark(hex: string): boolean {
  const c = safeColor(hex, '#ffffff').replace('#', '');
  const normalized = c.length === 3 ? c.split('').map((char) => `${char}${char}`).join('') : c;
  const r = parseInt(normalized.substring(0, 2), 16) || 0;
  const g = parseInt(normalized.substring(2, 4), 16) || 0;
  const b = parseInt(normalized.substring(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
