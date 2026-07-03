import { callWithFallbackDetailed } from '@/qay/lib/ai/providers';
import { getLibraryForType } from '@/qay/lib/section-library';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '@/qay/lib/section-library/types';
import type { AssemblyResult, QmSection, QmTheme, SectionType, SiteType } from '@/qay/lib/section-library/types';
import { extractUserColors } from './translate-prompt';

export function detectSiteType(prompt: string): SiteType {
  const normalized = prompt.toLowerCase();
  if (/\b(store|shop|ecommerce|e-commerce)\b/i.test(normalized)) {
    return 'ecommerce';
  }
  let bestMatch: SiteType = 'agency';
  let bestScore = 0;

  for (const [siteType, keywords] of Object.entries(SITE_TYPE_KEYWORDS)) {
    const score = keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = siteType as SiteType;
    }
  }

  return bestMatch;
}

export async function pickTheme(prompt: string, themes: QmTheme[]) {
  const normalized = prompt.toLowerCase();
  const scored = themes
    .map((theme) => ({
      theme,
      score: theme.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || b.theme.rank - a.theme.rank);

  return scored[0]?.theme || themes[0];
}

export function pickSection(
  prompt: string,
  sectionType: SectionType,
  availableSections: QmSection[]
): QmSection | undefined {
  if (!availableSections.length) return undefined

  const normalized = prompt.toLowerCase()

  const scored = availableSections.map((section, index) => ({
    section,
    index,
    score: section.keywords.reduce(
      (total, keyword) =>
        total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0),
      0
    ),
  }))

  // Sort by: score DESC, then rank DESC, then index ASC
  // This is fully deterministic — same prompt always picks same section
  scored.sort((a, b) =>
    b.score - a.score ||
    b.section.rank - a.section.rank ||
    ((a.section as any).index !== undefined && (b.section as any).index !== undefined
      ? (a.section as any).index - (b.section as any).index
      : a.index - b.index)
  )

  return scored[0]?.section
}

function extractBusinessName(prompt: string) {
  const quoted = prompt.match(/["'“”‘’]([^"'“”‘’]{2,80})["'“”‘’]/)?.[1];
  if (quoted) return quoted.trim();

  const called = prompt.match(/\b(?:called|named|brand called|brand named|for)\s+([A-Z][A-Za-z0-9&'. -]{2,60})/)?.[1];
  if (called) return called.replace(/\b(that|which|with|and)\b.*$/i, '').trim();

  return '';
}

function deterministicCopy(prompt: string, siteType: SiteType): Record<string, string> {
  const name = extractBusinessName(prompt);
  const brand = name || (
    siteType === 'restaurant' ? 'Maison Kairo'
      : siteType === 'ecommerce' ? 'ARYKTEEMAH'
        : 'QAY Studio'
  );
  const industryCopy: Partial<Record<SiteType, { title: string; subtitle: string; about: string }>> = {
    agency: {
      title: `${brand} turns unclear offers into brands people remember.`,
      subtitle: 'Strategy, identity, web design, and launch systems for teams that need sharper positioning and better conversion.',
      about: `${brand} works from audience insight to visual system, then turns the strategy into pages, assets, and launch details that feel finished.`,
    },
    saas: {
      title: `${brand} helps teams see the work, automate the handoff, and move faster.`,
      subtitle: 'A focused product website for workflows, dashboards, integrations, pricing, and proof that speaks to modern operators.',
      about: `${brand} brings messy team processes into one calmer operating system with analytics, automations, permissions, and clear next steps.`,
    },
    portfolio: {
      title: `${brand} presents selected work with clarity, texture, and point of view.`,
      subtitle: 'A portfolio built around case studies, craft, process, proof, and a direct path for the right collaborators to reach out.',
      about: `${brand} balances visual taste with practical outcomes, showing not only what was made but why the work mattered.`,
    },
    law: {
      title: `${brand} gives clients steady counsel when the stakes are high.`,
      subtitle: 'A confident legal website for practice areas, attorney trust, consultation requests, and proof of disciplined representation.',
      about: `${brand} combines careful preparation, direct communication, and courtroom-ready strategy for clients who need serious legal support.`,
    },
    medical: {
      title: `${brand} makes healthcare feel clearer, calmer, and easier to access.`,
      subtitle: 'A patient-first website for services, practitioners, appointments, location details, and trustworthy care information.',
      about: `${brand} helps patients understand their options, book confidently, and feel supported before they arrive.`,
    },
    hotel: {
      title: `${brand} creates stays that feel considered from arrival to checkout.`,
      subtitle: 'A hospitality website for rooms, amenities, gallery, booking prompts, guest reviews, and location storytelling.',
      about: `${brand} blends comfort, service, and place into a stay guests can picture before they book.`,
    },
    'real-estate': {
      title: `${brand} helps buyers find the right property with less noise.`,
      subtitle: 'A real estate website for listings, agent proof, neighborhood expertise, property galleries, and qualified inquiries.',
      about: `${brand} pairs local knowledge with clear presentation so buyers, sellers, and renters know what to do next.`,
    },
    education: {
      title: `${brand} helps learners build skills they can prove.`,
      subtitle: 'A course and academy website for programs, instructors, outcomes, pricing, student proof, and enrollment.',
      about: `${brand} turns learning goals into structured paths with practical modules, support, and measurable progress.`,
    },
    event: {
      title: `${brand} gives the event a reason to be on the calendar.`,
      subtitle: 'An event website for date, venue, speakers, schedule, RSVP, tickets, sponsors, and the energy of the room.',
      about: `${brand} brings people together around a clear agenda, strong venue details, and a simple path to attend.`,
    },
    beauty: {
      title: `${brand} makes booking beauty services feel polished and personal.`,
      subtitle: 'A salon and spa website for services, gallery, specialists, packages, reviews, and appointment requests.',
      about: `${brand} combines technique, hospitality, and a refined client experience from booking to final look.`,
    },
    fitness: {
      title: `${brand} helps members train with structure, energy, and accountability.`,
      subtitle: 'A fitness website for programs, class schedules, trainers, pricing, testimonials, and booking.',
      about: `${brand} turns motivation into repeatable training through coaching, community, and visible progress.`,
    },
    church: {
      title: `${brand} welcomes people into worship, community, and service.`,
      subtitle: 'A ministry website for service times, groups, events, leadership, giving, and first-time visitors.',
      about: `${brand} helps people find belonging, take next steps, and stay connected through the week.`,
    },
    blog: {
      title: `${brand} publishes stories with a clear editorial voice.`,
      subtitle: 'A publication website for featured articles, categories, newsletter capture, author trust, and readable archives.',
      about: `${brand} gives readers a consistent place for sharp ideas, useful context, and original perspective.`,
    },
    nonprofit: {
      title: `${brand} turns attention into action that reaches people.`,
      subtitle: 'A nonprofit website for mission storytelling, donations, volunteers, impact metrics, campaigns, and trust.',
      about: `${brand} makes the need clear, the work visible, and the next act of support easy to take.`,
    },
    construction: {
      title: `${brand} builds with discipline, documentation, and visible standards.`,
      subtitle: 'A construction website for services, project galleries, safety proof, estimates, team credibility, and commercial leads.',
      about: `${brand} keeps clients informed from scope to handoff with clean project management and dependable crews.`,
    },
    'tech-startup': {
      title: `${brand} explains a technical product without losing the human reason to care.`,
      subtitle: 'A startup website for product positioning, proof, integrations, waitlists, pricing, and investor-ready clarity.',
      about: `${brand} connects technical depth to a clear use case so buyers understand the value quickly.`,
    },
    photography: {
      title: `${brand} frames moments with atmosphere, patience, and intent.`,
      subtitle: 'A photography website for galleries, services, booking, testimonials, portfolio proof, and contact.',
      about: `${brand} creates images that feel honest, composed, and useful for personal, editorial, and commercial stories.`,
    },
    music: {
      title: `${brand} gives the sound a home for releases, shows, and fans.`,
      subtitle: 'A music website for tour dates, releases, gallery, newsletter, press details, and listening CTAs.',
      about: `${brand} brings the artist world together: sound, visuals, dates, story, and the next way to listen.`,
    },
  };

  if (siteType === 'restaurant') {
    return {
      'brand-name': brand,
      'hero-title': `${brand} serves food with memory, heat, and occasion.`,
      'hero-subtitle': 'A polished dining experience with signature plates, warm service, and a menu shaped by local ingredients.',
      'menu-title': 'Dishes guests come back for',
      'about-title': 'A kitchen rooted in place.',
      'about-copy': `${brand} turns familiar flavors into a full evening: sharp seasoning, careful sourcing, generous portions, and service that makes the room feel personal.`,
      'contact-title': 'Reserve your table',
      'footer-brand': brand,
    };
  }

  if (siteType === 'ecommerce') {
    const isStreetwear = /streetwear|urban|clothing|fashion|hoodie|t-?shirt|jogger|cap|sneaker|afro|youth|drop|hype/i.test(prompt);

    if (isStreetwear) {
      return {
        'brand-name': brand,
        'hero-eyebrow': 'Urban luxury streetwear',
        'hero-title': `Welcome to ${brand}`,
        'hero-subtitle': 'Wear the culture. Own the streets.',
        'features-title': 'Drops built for movement, attitude, and everyday flex',
        'about-title': `${brand} carries street culture from the block to the world.`,
        'about-copy': `${brand} blends Afro-fusion energy, luxury streetwear silhouettes, and limited-drop urgency for customers who dress like the city is watching.`,
        'contact-title': `Reach ${brand}`,
        'footer-brand': brand,
      };
    }

    return {
      'brand-name': brand,
      'hero-title': `${brand} creates objects with presence.`,
      'hero-subtitle': 'A curated online store for pieces that feel considered, tactile, and worth returning to.',
      'footer-brand': brand,
    };
  }

  const copy = industryCopy[siteType];
  if (copy) {
    return {
      'brand-name': brand,
      'hero-title': copy.title,
      'hero-subtitle': copy.subtitle,
      'about-title': `Why ${brand} works`,
      'about-copy': copy.about,
      'features-title': `What ${brand} does best`,
      'contact-title': `Start with ${brand}`,
      'footer-brand': brand,
    };
  }

  return {
    'brand-name': brand,
    'hero-title': `${brand} is built to look clear, credible, and ready to launch.`,
    'hero-subtitle': 'A focused website with strong positioning, useful sections, and editable content for the next stage.',
    'about-title': 'A sharper way to show the work.',
    'about-copy': `${brand} gets a complete page structure with copy, visuals, calls to action, and room to grow.`,
    'footer-brand': brand,
  };
}

function materializeThemeVariables(html: string, cssVariables: Record<string, string>) {
  return Object.entries(cssVariables).reduce((current, [key, value]) => (
    current.replaceAll(`var(${key})`, value)
  ), html);
}

function colorLuminance(hex: string) {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(full)) return 1;
  const [r, g, b] = [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16) / 255);
  const srgb = [r, g, b].map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function isDarkColor(hex?: string) {
  return Boolean(hex && colorLuminance(hex) < 0.42);
}

const PROMPT_COLOR_MAP: Record<string, string> = {
  'neon green': '#39ff14',
  'neon pink': '#ff6ec7',
  'neon blue': '#3b82ff',
  'deep grey': '#171717',
  'deep gray': '#171717',
  charcoal: '#111111',
  black: '#050505',
  white: '#ffffff',
  cream: '#fff7ed',
  ivory: '#fffaf0',
  gold: '#d4af37',
  amber: '#f59e0b',
  yellow: '#eab308',
  green: '#22c55e',
  emerald: '#10b981',
  blue: '#2563eb',
  navy: '#0f172a',
  indigo: '#4f46e5',
  purple: '#7c3aed',
  violet: '#8b5cf6',
  red: '#ef4444',
  crimson: '#dc143c',
  pink: '#ec4899',
  orange: '#f97316',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  gray: '#6b7280',
  grey: '#6b7280',
  slate: '#475569',
  beige: '#f5f5dc',
  brown: '#92400e',
  burgundy: '#800020',
};

function findPromptColor(value: string) {
  const hex = value.match(/#[0-9a-fA-F]{3,8}/)?.[0];
  if (hex) return hex;
  const lower = value.toLowerCase();
  const match = Object.keys(PROMPT_COLOR_MAP)
    .sort((a, b) => b.length - a.length)
    .find((name) => new RegExp(`\\b${name.replace(/\s+/g, '\\s+')}\\b`, 'i').test(lower));
  return match ? PROMPT_COLOR_MAP[match] : undefined;
}

function extractPromptColorIntent(prompt: string) {
  const intent: { background?: string; surface?: string; primary?: string; accent?: string } = {};
  const labelPatterns: Array<[keyof typeof intent, RegExp]> = [
    ['background', /\b(?:background|bg)\s*:\s*([^\n.;]+)/i],
    ['primary', /\bprimary\s*:\s*([^\n.;]+)/i],
    ['accent', /\baccent\s*:\s*([^\n.;]+)/i],
    ['surface', /\b(?:surface|card)\s*:\s*([^\n.;]+)/i],
  ];

  for (const [key, pattern] of labelPatterns) {
    const color = findPromptColor(prompt.match(pattern)?.[1] || '');
    if (color) intent[key] = color;
  }

  const lower = prompt.toLowerCase();
  if (!intent.background && /\b(dark|black|obsidian|midnight|noir)\b/i.test(prompt)) {
    intent.background = findPromptColor(lower.includes('deep grey') || lower.includes('deep gray') ? 'deep grey' : 'black');
  }
  if (!intent.background && /\b(light|white|clean|minimal|airy|bright)\b/i.test(prompt)) {
    intent.background = '#ffffff';
  }
  if (!intent.accent) {
    const accentLine = prompt.match(/\baccent\s*:\s*([^\n]+)/i)?.[1] || prompt;
    const wantsBold = /\b(neon|street|urban|bold|hype|youthful)\b/i.test(prompt);
    if (wantsBold && /\bneon green\b/i.test(accentLine)) {
      intent.accent = PROMPT_COLOR_MAP['neon green'];
    } else {
      intent.accent = findPromptColor(accentLine);
    }
  }

  return intent;
}

function inferPromptFonts(prompt: string, siteType: SiteType): Record<string, string> {
  const p = prompt.toLowerCase();
  const explicitHeading = prompt.match(/(?:heading\s+font|font|typeface)\s*:\s*([A-Za-z0-9\s]+?)(?:\s+and|\s*,|\.|\n|$)/i)?.[1]?.trim();
  const explicitBody = prompt.match(/body\s+font\s*:\s*([A-Za-z0-9\s]+?)(?:\s+and|\s*,|\.|\n|$)/i)?.[1]?.trim();
  if (explicitHeading || explicitBody) {
    return {
      '--qm-heading-font': explicitHeading ? `'${explicitHeading}', sans-serif` : 'Inter, sans-serif',
      '--qm-body-font': explicitBody ? `'${explicitBody}', sans-serif` : 'Inter, sans-serif',
    };
  }
  if (/\b(streetwear|urban|hype|bold|youthful)\b/.test(p)) {
    return { '--qm-heading-font': "'Bebas Neue', Inter, sans-serif", '--qm-body-font': 'Inter, sans-serif' };
  }
  if (/\b(editorial|magazine|medium|elegant|luxury|premium)\b/.test(p) || siteType === 'blog') {
    return { '--qm-heading-font': "'Inter', 'Plus Jakarta Sans', sans-serif", '--qm-body-font': "'Inter', sans-serif" };
  }
  if (/\b(restaurant|hotel|wedding|beauty)\b/.test(p)) {
    return { '--qm-heading-font': "'Playfair Display', Georgia, serif", '--qm-body-font': "'DM Sans', sans-serif" };
  }
  return { '--qm-heading-font': "'Inter', sans-serif", '--qm-body-font': "'Inter', sans-serif" };
}

function buildBrandCssVariables(prompt: string, siteType: SiteType, theme: QmTheme): Record<string, string> {
  const userColors = extractUserColors(prompt);
  const colorIntent = extractPromptColorIntent(prompt);
  const inferredColors = inferPromptPalette(prompt, siteType);
  const background = colorIntent.background || userColors?.background || inferredColors['--qm-bg'] || theme.css_variables['--qm-bg'] || '#ffffff';
  const dark = isDarkColor(background);
  const text = dark ? '#f8fafc' : '#0a0a0a';
  const muted = dark ? '#a1a1aa' : '#5f6368';
  const surface = colorIntent.surface || inferredColors['--qm-surface'] || (dark ? '#111111' : '#ffffff');
  const accent = colorIntent.accent || userColors?.accent || inferredColors['--qm-accent'] || theme.css_variables['--qm-accent'] || (dark ? '#ffffff' : '#111111');

  return {
    ...theme.css_variables,
    ...inferredColors,
    ...inferPromptFonts(prompt, siteType),
    '--qm-bg': background,
    '--qm-surface': surface,
    '--qm-primary': colorIntent.primary || userColors?.primary || theme.css_variables['--qm-primary'] || text,
    '--qm-text': text,
    '--qm-text-muted': muted,
    '--qm-accent': accent,
    '--qm-accent-text': isDarkColor(accent) ? '#ffffff' : '#050505',
    '--qm-border': dark ? 'rgba(255,255,255,0.13)' : 'rgba(10,10,10,0.12)',
  };
}

function normalizePromptBrandClasses(html: string) {
  return html.replace(/class="([^"]*)"/g, (_match, className: string) => {
    let next = ` ${className} `;
    next = next
      .replace(/\s(?:dark:)?bg-(?:white|black|zinc|neutral|slate|gray|stone)-(?:50|100|900|950)\b/g, ' bg-[var(--qm-bg)]')
      .replace(/\s(?:dark:)?bg-(?:white|black)\b/g, ' bg-[var(--qm-bg)]')
      .replace(/\s(?:dark:)?text-(?:white|black|zinc|neutral|slate|gray|stone)-(?:50|100|900|950)\b/g, ' text-[var(--qm-text)]')
      .replace(/\s(?:dark:)?text-(?:white|black)\b/g, ' text-[var(--qm-text)]')
      .replace(/\stext-(?:zinc|neutral|slate|gray|stone)-(?:300|400|500|600|700|800)\b/g, ' text-[var(--qm-text-muted)]')
      .replace(/\sdark:text-(?:zinc|neutral|slate|gray|stone)-(?:100|200|300|400|500)\b/g, ' text-[var(--qm-text-muted)]')
      .replace(/\sborder-(?:zinc|neutral|slate|gray|stone|black|white)(?:-\d{2,3})?(?:\/\d+)?\b/g, ' border-[var(--qm-border)]')
      .replace(/\stext-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}\b/g, ' text-[var(--qm-accent)]')
      .replace(/\sdark:text-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}\b/g, ' text-[var(--qm-accent)]')
      .replace(/\sbg-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}\b/g, ' bg-[var(--qm-accent)]')
      .replace(/\sring-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}\b/g, ' ring-[var(--qm-accent)]');
    next = next.replace(/\s+/g, ' ').trim();
    return `class="${next}"`;
  });
}

function promptFontLinks(theme: QmTheme) {
  const themeFamilies = theme.google_fonts.map((font) => `family=${font}`);
  const promptFamilies = [
    'family=Inter:wght@400;500;600;700;800;900',
    'family=Bebas+Neue',
    'family=Playfair+Display:wght@500;600;700;800',
    'family=DM+Sans:wght@400;500;700',
    'family=Plus+Jakarta+Sans:wght@500;600;700;800',
  ];
  const families = [...new Set([...themeFamilies, ...promptFamilies])];
  return `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?${families.join('&')}&display=swap" rel="stylesheet">`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replaceTextZones(html: string, replacements: Record<string, string>) {
  let updated = html;
  for (const [zone, text] of Object.entries(replacements)) {
    const pattern = new RegExp(`(data-qm="${zone}"[^>]*>)[^<]*(<)`, 'g');
    updated = updated.replace(pattern, `$1${escapeHtml(text)}$2`);
  }
  return updated;
}

function withSemanticZoneAliases(replacements: Record<string, string>, prompt: string, siteType: SiteType) {
  const name = extractBusinessName(prompt);
  const brand = replacements['brand-name'] || name || 'QAY Studio';
  const title = replacements['hero-title'] || `${brand} is ready for launch.`;
  const subtitle = replacements['hero-subtitle'] || 'A polished, responsive website with strong copy, useful sections, and a clear next step.';
  const about = replacements['about-copy'] || replacements['about-text'] || `${brand} combines a clear story, trusted details, and practical reasons to take action.`;
  const sectionTitle = replacements['features-title'] || replacements['menu-title'] || `What ${brand} does best`;

  const typeEyebrow: Record<SiteType, string> = {
    ecommerce: 'Featured collection',
    restaurant: 'Signature experience',
    portfolio: 'Selected work',
    agency: 'Core services',
    saas: 'Product highlights',
    blog: 'Latest thinking',
    law: 'Practice focus',
    medical: 'Care services',
    beauty: 'Treatment menu',
    education: 'Learning paths',
    event: 'Event highlights',
    fitness: 'Training focus',
    hotel: 'Stay experience',
    church: 'Community life',
    nonprofit: 'Mission work',
    photography: 'Featured sessions',
    music: 'Latest releases',
    'real-estate': 'Featured properties',
    construction: 'Project highlights',
    'tech-startup': 'Product momentum',
  };

  return {
    ...replacements,
    'footer-brand-name': replacements['footer-brand-name'] || replacements['footer-brand'] || brand,
    'footer-brand': replacements['footer-brand'] || replacements['footer-brand-name'] || brand,
    'footer-tagline': replacements['footer-tagline'] || subtitle,
    'footer-email': replacements['footer-email'] || `hello@${slugify(brand)}.com`,
    'footer-location': replacements['footer-location'] || 'Serving clients worldwide',
    'about-text': replacements['about-text'] || about,
    'about-copy': replacements['about-copy'] || about,
    'section-title': replacements['section-title'] || sectionTitle,
    'section-subtitle': replacements['section-subtitle'] || subtitle,
    'section-eyebrow': replacements['section-eyebrow'] || typeEyebrow[siteType] || 'Featured',
    'gallery-title': replacements['gallery-title'] || 'Selected releases',
    'gallery-eyebrow': replacements['gallery-eyebrow'] || 'Work highlights',
    'hero-eyebrow': replacements['hero-eyebrow'] || typeEyebrow[siteType] || 'Now live',
    'hero-cta-primary': replacements['hero-cta-primary'] || primaryCtaForSiteType(siteType),
    'hero-cta-secondary': replacements['hero-cta-secondary'] || secondaryCtaForSiteType(siteType),
    'testimonial-1-text': replacements['testimonial-1-text'] || `"${brand} gave the project the clarity, polish, and confidence we needed."`,
    'testimonial-1-author': replacements['testimonial-1-author'] || 'Client partner',
    'testimonial-2-text': replacements['testimonial-2-text'] || `"Every section feels intentional, fast, and easy for visitors to understand."`,
    'testimonial-2-author': replacements['testimonial-2-author'] || 'Project lead',
    'testimonial-3-text': replacements['testimonial-3-text'] || `"The final site feels tailored to the brand instead of dropped from a template."`,
    'testimonial-3-author': replacements['testimonial-3-author'] || 'Founder',
    'hero-title': title,
    'hero-subtitle': subtitle,
  };
}

function primaryCtaForSiteType(siteType: SiteType) {
  if (siteType === 'ecommerce') return 'Shop now';
  if (siteType === 'restaurant') return 'Book a table';
  if (siteType === 'portfolio') return 'See the work';
  if (siteType === 'blog') return 'Start reading';
  if (siteType === 'event') return 'Reserve a spot';
  if (siteType === 'hotel') return 'Book a stay';
  if (siteType === 'nonprofit') return 'Donate now';
  return 'Get started';
}

function secondaryCtaForSiteType(siteType: SiteType) {
  if (siteType === 'ecommerce') return 'Explore collection';
  if (siteType === 'restaurant') return 'View menu';
  if (siteType === 'portfolio') return 'Start a project';
  if (siteType === 'blog') return 'Subscribe';
  if (siteType === 'event') return 'View schedule';
  if (siteType === 'hotel') return 'Explore rooms';
  if (siteType === 'nonprofit') return 'See our impact';
  return 'Learn more';
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'brand';
}

async function aiCopyOverrides(html: string, prompt: string, siteType: SiteType) {
  const zones: Record<string, string> = {};
  for (const match of html.matchAll(/data-qm="([^"]+)"[^>]*>([^<]*)</g)) {
    zones[match[1]] = match[2].trim();
  }

  if (!Object.keys(zones).length || prompt.length > 2800 || process.env.QAY_SECTION_ASSEMBLER_AI_COPY === 'false') return {};

  try {
    const result = await callWithFallbackDetailed<Record<string, string>>(
      `User prompt: "${prompt}"\nSite type: ${siteType}\n\nRewrite these website text zones with concise, specific copy for the requested brand. Return only JSON.\n${JSON.stringify(zones, null, 2)}`,
      'Return only a JSON object of text replacements. No markdown.',
      (text) => JSON.parse(text.trim().replace(/^```json\n?/i, '').replace(/\n?```$/i, ''))
    );
    return result.value || {};
  } catch (error) {
    console.warn('[QAY Section Assembler] AI copy personalization skipped:', error);
    return {};
  }
}

async function personalizeSections(html: string, prompt: string, siteType: SiteType, theme: QmTheme) {
  const deterministic = withSemanticZoneAliases(deterministicCopy(prompt, siteType), prompt, siteType);
  const aiOverrides = await aiCopyOverrides(html, prompt, siteType);
  const finalCssVariables = buildBrandCssVariables(prompt, siteType, theme);

  const copied = materializeThemeVariables(
    replaceTextZones(html, { ...deterministic, ...aiOverrides }),
    finalCssVariables
  );

  const brandName = extractBusinessName(prompt) || (siteType === 'ecommerce' ? 'Baddo World' : 'QAY Studio');
  
  // Run full copywriting personalization on the materialized body
  const personalized = normalizePromptBrandClasses(
    await personalizeSectionsFullHtml(copied, prompt, siteType, brandName)
  );
  
  const cssVars = Object.entries(finalCssVariables).map(([key, value]) => `  ${key}: ${value};`).join('\n');
  const fontLinks = promptFontLinks(theme);

  return `${fontLinks}
<style>
:root {
${cssVars}
}
body {
  background: var(--qm-bg);
  color: var(--qm-text);
  font-family: var(--qm-body-font);
}
</style>
${personalized}`;
}

async function personalizeSectionsFullHtml(html: string, prompt: string, siteType: SiteType, brandName: string) {
  try {
    const systemPrompt = `You are an expert copywriter and content personalization engine for the QAY website builder.
You will receive the user's original website prompt, the site type, brand name, and a fully styled HTML template.
Your ONLY job is to rewrite ALL visible text content and image URLs on this template to make it hyper-specific to the user's brand, industry, and the brand's purpose.

## What to Personalize
- ALL headings (h1-h6): Make them compelling, specific, and on-brand
- ALL paragraphs: Write real, detailed copy — no placeholder text
- ALL button/link text: Use action-oriented, industry-specific CTAs
- ALL list items, table cells, card titles, card descriptions
- ALL prices: Use realistic prices for the industry
- ALL product/service names: Use specific, believable names (e.g. for a phone store, use actual smartphone models, charger models, wireless accessories, etc.)
- ALL menu items (for restaurants): Use real dish names with descriptions
- ALL team member names and roles: Use realistic names and titles
- ALL testimonial quotes and attribution: Write believable, specific reviews
- ALL image alt attributes: Make them descriptive and relevant
- Copyright year and company references: Use the brand name

## Image Personalization Guidelines
- Rewrite the \`src\` attribute of any \`<img>\` tags to use highly relevant, professional, high-quality Unsplash image URLs that match the brand and page.
- For a phone/mobile store: use images of modern smartphones, mobile screens, smart accessories, phone store interior, or people using phones.
- Example high-quality Unsplash image IDs you can use or adapt (format: \`https://images.unsplash.com/photo-<id>?w=800&auto=format&q=85\`):
  * Smartphones/accessories: photo-1511707171634-5f897ff02aa9, photo-1598327105666-5b89351aff97, photo-1565849906663-bd23445e2b20, photo-1573148195900-7845dcb9b127, photo-1512941937669-90a1b58e7e9c, photo-1580910051074-3eb694886505, photo-1517336714731-489689fd1ca8
  * Tech store/retail: photo-1468495244123-6c6c332eeece, photo-1607082348824-0a96f2a4b9da, photo-1511512578047-dfb367046420, photo-1519389950473-47ba0277781c
- Ensure all rewritten image src URLs are valid Unsplash image URLs.

## STRICT Rules
- NEVER change ANY HTML tags, CSS classes, inline styles, IDs, or data-* attributes.
- NEVER alter any data-qay-*, data-qm, data-qay-commerce, or structural attributes.
- Keep text length roughly similar to the template to preserve layout.
- Return ONLY the final HTML. No markdown code fences, no explanations, no commentary.`;

    const userMessage = `User prompt: "${prompt}"
Site type: ${siteType}
Brand name: ${brandName}

HTML template to personalize:
"""
${html}
"""`;

    const result = await callWithFallbackDetailed<string>(
      userMessage,
      systemPrompt,
      (text) => {
        const cleaned = text.trim().replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim();
        if (!/<[a-z][\s\S]*>/i.test(cleaned)) {
          throw new Error('Invalid HTML returned');
        }
        return cleaned;
      }
    );

    return result.value || html;
  } catch (err) {
    console.warn('[QAY AI] Full HTML personalization failed, using raw:', err);
    return html;
  }
}

function pageWrapper(name: string, slug: string, html: string) {
  return `<div data-qay-page="${name}" data-qay-slug="${slug}">\n${html.trim()}\n</div>`;
}

function shouldGenerateMultiPage(prompt: string, siteType: SiteType) {
  const explicitMultiPage = /\b(create|include|add|design|build)\s+(?:pages?|dedicated\s+pages?|separate\s+pages?)\b|\b(blog page|article page|product page|shop page|checkout page|about page|contact page|privacy policy|terms of service|categories|authors|404 page|login page|signup page)\b/i.test(prompt);
  if (explicitMultiPage) return true;
  // Only return false if user explicitly asks for one single page and does not also ask for pages.
  if (/\bsingle[- ]page\b|\bone[- ]page\b|\blanding page only\b|\bone page only\b/i.test(prompt)) return false;
  return true;
}

function inferPromptPalette(prompt: string, siteType: SiteType): Record<string, string> {
  const p = prompt.toLowerCase();
  const wantsDark = /\b(dark|black|midnight|obsidian|noir|moody)\b/.test(p);
  const wantsLight = /\b(light|white|clean|minimal|apple|notion|medium|linear|elegant)\b/.test(p);
  const wantsLuxury = /\b(luxury|premium|high-end|bespoke|exclusive|elegant)\b/.test(p);
  const wantsBold = /\b(bold|neon|vibrant|street|urban|hype|youthful)\b/.test(p);

  if (wantsDark && wantsLuxury) {
    return {
      '--qm-bg': '#070707',
      '--qm-surface': '#111111',
      '--qm-text': '#f8f7f2',
      '--qm-text-muted': '#a1a1aa',
      '--qm-accent': '#f5d06f',
      '--qm-accent-text': '#070707',
      '--qm-border': 'rgba(255,255,255,0.12)',
    };
  }

  if (wantsDark) {
    return {
      '--qm-bg': '#08090a',
      '--qm-surface': '#111315',
      '--qm-text': '#f8fafc',
      '--qm-text-muted': '#9ca3af',
      '--qm-accent': wantsBold ? '#b6ff00' : '#ffffff',
      '--qm-accent-text': '#08090a',
      '--qm-border': 'rgba(255,255,255,0.12)',
    };
  }

  if (siteType === 'blog' && wantsLight) {
    return {
      '--qm-bg': '#fbfaf7',
      '--qm-surface': '#ffffff',
      '--qm-text': '#111111',
      '--qm-text-muted': '#62615c',
      '--qm-accent': '#111111',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(17,17,17,0.10)',
    };
  }

  if (wantsLuxury) {
    return {
      '--qm-bg': '#f8f4ec',
      '--qm-surface': '#fffdf8',
      '--qm-text': '#17130c',
      '--qm-text-muted': '#766b5b',
      '--qm-accent': '#9b6b1d',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(23,19,12,0.12)',
    };
  }

  if (wantsBold) {
    return {
      '--qm-bg': '#ffffff',
      '--qm-surface': '#f6f7f2',
      '--qm-text': '#080808',
      '--qm-text-muted': '#4b5563',
      '--qm-accent': '#39ff14',
      '--qm-accent-text': '#050505',
      '--qm-border': 'rgba(8,8,8,0.12)',
    };
  }

  return {};
}

function productCard(id: string, name: string, price: string, description: string, image: string) {
  const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `<article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-commerce="product-card" data-qay-product-id="${id}" data-qay-product-handle="${handle}" data-qay-hover="luxe-lift"><div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom"><img src="${image}" alt="${name}" class="aspect-[4/5] w-full object-cover" /></div><div class="p-5"><h3 class="text-xl font-black" data-qay-commerce="product-title">${name}</h3><p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">${description}</p><div class="mt-5 flex items-center justify-between gap-3"><span class="font-black" data-qay-commerce="product-price">${price}</span><button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-3 text-sm font-bold text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="${id}">Add to cart</button></div></div></article>`;
}

function ecommerceExtraPages(theme: QmTheme, prompt: string) {
  const pageClass = `min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] dark:bg-[#000000] dark:text-white`;
  const heroImage = 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1400&auto=format&q=85';
  const hoodieImage = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&auto=format&q=85';
  const shirtImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&q=85';
  const capImage = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&auto=format&q=85';
  const joggerImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&q=85';
  const nav = `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="text-lg font-black uppercase tracking-[0.18em]" data-qm="brand-name">Baddo World</a><div class="hidden items-center gap-6 text-sm font-bold md:flex"><a href="/shop">Shop</a><a href="/collections">Collections</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/cart" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]">Cart (0)</a></div><button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#store-page-menu" data-qay-class="hidden">Menu</button></div><div id="store-page-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden"><a href="/shop">Shop</a><a href="/collections">Collections</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/cart">Cart</a></div></nav>`;
  const footer = `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-12 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]"><div><p class="text-2xl font-black uppercase tracking-[0.16em]" data-qm="footer-brand">Baddo World</p><p class="mt-4 max-w-sm text-sm leading-6 text-[var(--qm-text-muted)]">Streetwear drops, bold silhouettes, and culture-first essentials built for the city.</p></div><div class="flex flex-col gap-3 text-sm"><a href="/shop">Shop</a><a href="/collections">Collections</a><a href="/about">About</a></div><div class="flex flex-col gap-3 text-sm"><a href="/contact">Contact</a><a href="/checkout">Checkout</a><a href="/login">Account</a></div></div></footer>`;
  const products = `${productCard('sample-product-1', 'Culture Heavy Hoodie', '$88', 'Heavy fleece, oversized hood, gold chest mark.', hoodieImage)}${productCard('sample-product-2', 'Own The Streets Tee', '$42', 'Boxy cotton tee with front and back graphics.', shirtImage)}${productCard('sample-product-3', 'Baddo Cargo Jogger', '$74', 'Relaxed cargo jogger with deep utility pockets.', joggerImage)}${productCard('sample-product-4', 'World Logo Cap', '$34', 'Structured cap with embroidered crest.', capImage)}`;
  const shop = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]"><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5"><p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Filters</p><div class="mt-6 space-y-5 text-sm"><div><p class="font-bold">Category</p><div class="mt-3 flex flex-wrap gap-2"><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">Hoodies</span><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">T-shirts</span><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">Pants</span><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">Caps</span></div></div><div><p class="font-bold">Sort</p><select class="mt-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-3 py-3"><option>Newest</option><option>Price low to high</option><option>Best selling</option></select></div></div></aside><div><h1 class="text-5xl font-black md:text-7xl">Shop the drop</h1><p class="mt-4 max-w-2xl text-[var(--qm-text-muted)]">Hoodies, shirts, joggers, caps, and limited pieces for the next fit check.</p><div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-qay-commerce="product-grid">${products}</div></div></div></section></main>${footer}`;
  const product = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]"><div class="grid gap-4 sm:grid-cols-2"><img src="${hoodieImage}" alt="Culture Heavy Hoodie front" class="h-[520px] w-full rounded-3xl object-cover" /><img src="${heroImage}" alt="Streetwear model wearing hoodie" class="h-[520px] w-full rounded-3xl object-cover" /></div><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7"><p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Limited drop</p><h1 class="mt-4 text-5xl font-black" data-qay-commerce="product-title">Culture Heavy Hoodie</h1><p class="mt-4 text-2xl font-black" data-qay-commerce="product-price">$88</p><p class="mt-5 leading-7 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">Oversized heavyweight fleece cut for cold nights, loud entrances, and street culture in motion.</p><div class="mt-6"><p class="font-bold">Size</p><div class="mt-3 flex gap-2"><button class="rounded-full border border-[var(--qm-border)] px-4 py-2">S</button><button class="rounded-full border border-[var(--qm-border)] px-4 py-2">M</button><button class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-[var(--qm-accent-text)]">L</button><button class="rounded-full border border-[var(--qm-border)] px-4 py-2">XL</button></div></div><div class="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" class="rounded-xl bg-[var(--qm-accent)] px-5 py-4 font-bold text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">Add to Cart</button><a href="/checkout" class="rounded-xl border border-[var(--qm-border)] px-5 py-4 text-center font-bold">Buy Now</a></div><div class="mt-8 grid gap-3 text-sm text-[var(--qm-text-muted)]"><p>Delivery: ships in 2-5 business days.</p><p>Returns: 14-day exchange on unworn pieces.</p></div></aside></div></section><section class="px-5 pb-20"><div class="mx-auto max-w-7xl"><h2 class="text-3xl font-black">You may also like</h2><div class="mt-6 grid gap-5 md:grid-cols-3" data-qay-commerce="product-grid">${products}</div></div></section></main>${footer}`;
  const cart = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]"><div><h1 class="text-5xl font-black">Cart</h1><div class="mt-8 space-y-4" data-qay-commerce="cart-items"><article class="grid gap-4 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 sm:grid-cols-[120px_1fr_auto]"><img src="${hoodieImage}" alt="Culture Heavy Hoodie" class="h-32 w-full rounded-2xl object-cover" /><div><h2 class="text-xl font-bold">Culture Heavy Hoodie</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Black / Large</p></div><button type="button" data-qay-commerce="remove-from-cart" data-qay-product-id="sample-product-1" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm">Remove</button></article></div></div><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="text-2xl font-black">Order summary</h2><input placeholder="Promo code" class="mt-6 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><div class="mt-6 space-y-3 text-sm"><p class="flex justify-between"><span>Subtotal</span><span>$88</span></p><p class="flex justify-between"><span>Shipping</span><span>$8</span></p><p class="flex justify-between text-xl font-black"><span>Total</span><span>$96</span></p></div><a href="/checkout" data-qay-commerce="checkout-button" class="mt-6 block rounded-xl bg-[var(--qm-accent)] px-5 py-4 text-center font-bold text-[var(--qm-accent-text)]">Checkout</a></aside></div></section></main>${footer}`;
  const checkout = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]"><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Secure checkout</p><h1 class="mt-4 text-5xl font-black">Shipping details</h1><div class="mt-8 grid gap-3 sm:grid-cols-2"><input name="firstName" placeholder="First name" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="lastName" placeholder="Last name" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 sm:col-span-2" /><input name="address" placeholder="Address" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 sm:col-span-2" /></div><div class="mt-6 rounded-2xl border border-[var(--qm-border)] p-4"><p class="font-bold">Payment placeholder</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Connect live checkout before launch.</p></div><button type="submit" class="mt-6 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Place order</button></form><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="text-2xl font-black">Summary</h2><p class="mt-6 rounded-2xl bg-[var(--qm-bg)] p-4 text-sm text-[var(--qm-text-muted)]">Secure checkout. Minimal distraction. Built for Medusa mapping.</p></aside></div></section></main>${footer}`;
  const collections = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto max-w-7xl"><h1 class="text-5xl font-black md:text-7xl">Curated drops</h1><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><img src="${heroImage}" alt="Summer Drop streetwear" class="h-80 w-full object-cover" /><div class="p-6"><h2 class="text-2xl font-black">Summer Drop</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Light layers, loud graphics, and city heat energy.</p></div></article><article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><img src="${hoodieImage}" alt="Baddo Essentials hoodies" class="h-80 w-full object-cover" /><div class="p-6"><h2 class="text-2xl font-black">Baddo Essentials</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Core hoodies, tees, joggers, and caps.</p></div></article><article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><img src="${joggerImage}" alt="Limited Edition drop" class="h-80 w-full object-cover" /><div class="p-6"><h2 class="text-2xl font-black">Limited Edition</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Rare pieces for the fastest hands.</p></div></article></div></div></section></main>${footer}`;
  const about = `${nav}<main class="${pageClass}"><section class="grid min-h-[680px] lg:grid-cols-2"><div class="flex flex-col justify-center px-6 py-20 md:px-16"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Story</p><h1 class="mt-5 text-5xl font-black md:text-7xl" data-qm="about-title">Redefining streetwear culture from the streets to the world.</h1><p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">Baddo World blends Afro-fusion energy, bold cuts, and luxury street attitude for a generation that dresses with confidence.</p></div><img src="${heroImage}" alt="Streetwear brand editorial model" class="h-full min-h-[520px] w-full object-cover" /></section></main>${footer}`;
  const contact = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div><h1 class="text-5xl font-black md:text-7xl" data-qm="contact-title">Talk to Baddo World</h1><p class="mt-5 text-[var(--qm-text-muted)]">For orders, collaborations, wholesale, styling, and drop questions.</p></div><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea name="message" placeholder="Message" class="h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section></main>${footer}`;

  const pages = [
    pageWrapper('Shop', 'shop', shop),
    pageWrapper('Product', 'product', product),
    pageWrapper('Cart', 'cart', cart),
    pageWrapper('Checkout', 'checkout', checkout),
    pageWrapper('Collections', 'collections', collections),
    pageWrapper('About', 'about', about),
    pageWrapper('Contact', 'contact', contact),
  ];

  const hasAuth = /\b(auth|login|register|signup|signin|sign-in|sign-up|protect|member|membership|dashboard)\b/i.test(prompt);
  if (hasAuth) {
    const brandName = extractBusinessName(prompt) || 'Baddo World';
    pages.push(pageWrapper('Login', 'login', buildCustomLoginPage(brandName, '')));
    pages.push(pageWrapper('Register', 'register', buildCustomRegisterPage(brandName, '')));
    pages.push(pageWrapper('Dashboard', 'dashboard', buildCustomDashboardPage(brandName, '')));
  }

  return pages.join('\n\n');
}

function fallbackSharedNavFooter(siteType: SiteType, brandName: string, navHtml?: string, footerHtml?: string) {
  const baseLinks = siteType === 'blog'
    ? [
      ['Blog', '/blog'],
      ['Categories', '/categories'],
      ['Authors', '/authors'],
      ['About', '/about'],
      ['Contact', '/contact'],
    ]
    : [
      ['About', '/about'],
      ['Services', '/services'],
      ['Contact', '/contact'],
    ];
  const nav = navHtml || `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="text-lg font-black" data-qm="brand-name">${escapeHtml(brandName)}</a><div class="hidden items-center gap-6 text-sm font-bold md:flex">${baseLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}<a href="#newsletter" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]">Subscribe</a></div><button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#shared-page-menu" data-qay-class="hidden">Menu</button></div><div id="shared-page-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden">${baseLinks.map(([label, href]) => `<a href="${href}" class="rounded-xl px-3 py-2 hover:bg-[var(--qm-bg)]">${label}</a>`).join('')}<a href="#newsletter" class="rounded-xl bg-[var(--qm-accent)] px-3 py-3 text-center text-[var(--qm-accent-text)]">Subscribe</a></div></nav>`;
  const footer = footerHtml || `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-12 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]"><div><p class="font-black" data-qm="footer-brand">${escapeHtml(brandName)}</p><p class="mt-3 max-w-sm text-sm text-[var(--qm-text-muted)]">A polished publication built for thoughtful reading and useful ideas.</p></div><div class="flex flex-col gap-3 text-sm">${baseLinks.slice(0, 3).map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</div><div class="flex flex-col gap-3 text-sm"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></div></div></footer>`;
  return { nav, footer };
}

function blogExtraPages(theme: QmTheme, prompt: string, navHtml?: string, footerHtml?: string) {
  const brandName = extractBusinessName(prompt) || 'Metric';
  const pageClass = 'min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] dark:bg-[#050505] dark:text-white';
  const { nav, footer } = fallbackSharedNavFooter('blog', brandName, navHtml, footerHtml);
  const editorialImage = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1400&auto=format&q=85';
  const codeImage = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&q=85';
  const deskImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&q=85';
  const articleCards = [
    ['The Operating System for Better Product Decisions', 'A practical guide to choosing fewer metrics, reading them clearly, and turning insight into weekly action.', 'Product', 'Maya Chen', '8 min read', editorialImage],
    ['Designing Interfaces That Feel Quietly Fast', 'How spacing, loading states, and motion details make a product feel more trustworthy before users notice why.', 'Design', 'Noah Bell', '6 min read', deskImage],
    ['A Founder Guide to Useful Analytics', 'The dashboards, rituals, and review loops that keep young teams focused without drowning them in charts.', 'Industry', 'Iris Cole', '10 min read', codeImage],
  ].map(([title, desc, category, author, readTime, image], index) => `<article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl" data-qay-hover="luxe-lift"><div class="overflow-hidden" data-qay-hover="img-zoom"><img src="${image}" alt="${title}" class="aspect-[16/10] w-full object-cover" /></div><div class="p-5"><div class="flex flex-wrap items-center gap-2 text-xs text-[var(--qm-text-muted)]"><span class="rounded-full border border-[var(--qm-border)] px-2.5 py-1">${category}</span><span>${author}</span><span>${index + 12} Jun</span><span>${readTime}</span></div><h2 class="mt-4 text-2xl font-black leading-tight">${title}</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">${desc}</p><a href="/article" class="mt-5 inline-flex rounded-full bg-[var(--qm-accent)] px-4 py-2 text-sm font-bold text-[var(--qm-accent-text)]">Read more</a></div></article>`).join('');

  const blog = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto max-w-7xl"><div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Blog</p><h1 class="mt-4 text-5xl font-black leading-none md:text-7xl">Read the Metric archive.</h1><p class="mt-5 max-w-2xl text-[var(--qm-text-muted)]">Search articles, tutorials, industry notes, and opinion pieces designed for calm, focused reading.</p></div><div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 shadow-sm"><div class="grid gap-3 md:grid-cols-[1fr_auto_auto]"><input type="search" placeholder="Search articles" class="rounded-2xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm outline-none" /><select class="rounded-2xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm"><option>All categories</option><option>Product</option><option>Design</option><option>Engineering</option></select><select class="rounded-2xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm"><option>Newest</option><option>Trending</option><option>Most read</option></select></div><div class="mt-3 flex flex-wrap gap-2 text-xs">${['AI', 'Product', 'Design', 'Startups', 'Systems', 'Tutorials'].map((tag) => `<span class="rounded-full border border-[var(--qm-border)] px-3 py-1 text-[var(--qm-text-muted)]">${tag}</span>`).join('')}</div></div></div><div class="mt-10 grid gap-5 md:grid-cols-3" data-qay-animate="stagger-children">${articleCards}</div></div></section></main>${footer}`;

  const article = `${nav}<main class="${pageClass}"><article class="px-5 py-16"><div class="mx-auto max-w-4xl"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Product thinking</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl">How Metric turns scattered reading into sharper product judgment.</h1><div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--qm-text-muted)]"><span>By Ada Morgan</span><span>Jun 16, 2026</span><span>9 min read</span><span>Strategy</span></div></div><div class="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[2rem]" data-qay-scroll="shrink" data-qay-scale="0.94"><img src="${editorialImage}" alt="Editorial workspace for Metric article" class="h-[560px] w-full object-cover" /></div><div class="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[240px_1fr]"><aside class="hidden lg:block"><div class="sticky top-28 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 text-sm"><p class="font-bold">Table of contents</p><ol class="mt-4 grid gap-3 text-[var(--qm-text-muted)]"><li>01. The signal problem</li><li>02. Reading rituals</li><li>03. Useful dashboards</li><li>04. Related articles</li></ol></div></aside><div class="prose prose-neutral max-w-none dark:prose-invert"><p class="text-xl leading-9 text-[var(--qm-text-muted)]">Metric exists for people who want thoughtful technology writing without noise. The best reading experiences do not shout; they organize attention.</p><h2>Start with the question, not the chart.</h2><p>Every useful article should leave the reader with a sharper question, a cleaner model, or a practical next step. Metric articles are built around that promise.</p><blockquote class="border-l-4 border-[var(--qm-accent)] pl-5 text-2xl font-semibold">Good publishing makes complex ideas easier to return to.</blockquote><h2>Example code block</h2><pre class="overflow-auto rounded-2xl bg-[#0b0b0b] p-5 text-sm text-white"><code>const readingSignal = articles.filter((post) =&gt; post.value &gt; noise);</code></pre><div class="aspect-video overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><iframe title="Embedded editorial video" class="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe></div><h2>Comments</h2><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5"><input placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea placeholder="Add a thoughtful comment" class="h-32 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-3 rounded-full bg-[var(--qm-accent)] px-5 py-3 font-bold text-[var(--qm-accent-text)]">Post comment</button></form><div class="grid gap-3 border-t border-[var(--qm-border)] pt-8 sm:grid-cols-2"><a href="/article" class="rounded-2xl border border-[var(--qm-border)] p-4">Previous: Better editorial systems</a><a href="/article" class="rounded-2xl border border-[var(--qm-border)] p-4 text-right">Next: The quiet dashboard</a></div></div></div></article></main>${footer}`;

  const about = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">About Metric</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl">A calmer place for modern ideas.</h1><p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]">Metric publishes essays, tutorials, and industry analysis for readers who care about product quality, design taste, and useful technology.</p></div><div class="grid gap-4 sm:grid-cols-2"><div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><p class="text-4xl font-black">120+</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Editorial pieces</p></div><div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><p class="text-4xl font-black">38k</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Monthly readers</p></div></div></div></section></main>${footer}`;
  const contact = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Contact</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl">Pitch a story or ask a question.</h1><p class="mt-5 text-[var(--qm-text-muted)]">For editorial pitches, partnerships, corrections, and reader notes.</p></div><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" type="email" placeholder="Email" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea name="message" placeholder="Message" class="h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section></main>${footer}`;
  const categories = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-7xl"><h1 class="text-5xl font-black md:text-7xl">Categories</h1><div class="mt-10 grid gap-4 md:grid-cols-3">${['Product', 'Design', 'Engineering', 'Industry News', 'Tutorials', 'Ideas'].map((item) => `<a href="/blog" class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 transition hover:-translate-y-1"><h2 class="text-2xl font-black">${item}</h2><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Read the latest Metric essays in ${item.toLowerCase()}.</p></a>`).join('')}</div></div></section></main>${footer}`;
  const authors = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-7xl"><h1 class="text-5xl font-black md:text-7xl">Authors</h1><div class="mt-10 grid gap-5 md:grid-cols-3">${['Maya Chen', 'Noah Bell', 'Iris Cole'].map((name, index) => `<article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><div class="grid size-16 place-items-center rounded-full bg-[var(--qm-accent)] text-xl font-black text-[var(--qm-accent-text)]">${name.split(' ').map((part) => part[0]).join('')}</div><h2 class="mt-5 text-2xl font-black">${name}</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">${['Product editor', 'Design critic', 'Industry analyst'][index]} writing for Metric readers.</p></article>`).join('')}</div></div></section></main>${footer}`;
  const privacy = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-3xl"><h1 class="text-5xl font-black">Privacy Policy</h1><p class="mt-6 text-[var(--qm-text-muted)]">Metric only collects the information needed to operate subscriptions, comments, analytics, and reader support. This page is editable before launch.</p></div></section></main>${footer}`;
  const terms = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-3xl"><h1 class="text-5xl font-black">Terms of Service</h1><p class="mt-6 text-[var(--qm-text-muted)]">These terms describe how readers may use Metric, quote articles, submit comments, and contact the editorial team.</p></div></section></main>${footer}`;
  const notFound = `${nav}<main class="${pageClass}"><section class="grid min-h-[70vh] place-items-center px-5 py-20 text-center"><div><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">404</p><h1 class="mt-4 text-6xl font-black md:text-8xl">This idea moved.</h1><p class="mx-auto mt-5 max-w-xl text-[var(--qm-text-muted)]">The page you are looking for is not in the Metric archive. Try the blog or search by category.</p><a href="/blog" class="mt-8 inline-flex rounded-full bg-[var(--qm-accent)] px-6 py-3 font-bold text-[var(--qm-accent-text)]">Back to articles</a></div></section></main>${footer}`;

  return [
    pageWrapper('Blog', 'blog', blog),
    pageWrapper('Article', 'article', article),
    pageWrapper('About', 'about', about),
    pageWrapper('Contact', 'contact', contact),
    pageWrapper('Categories', 'categories', categories),
    pageWrapper('Authors', 'authors', authors),
    pageWrapper('Privacy Policy', 'privacy', privacy),
    pageWrapper('Terms of Service', 'terms', terms),
    pageWrapper('404', '404', notFound),
  ].join('\n\n');
}

function genericExtraPages(siteType: SiteType, theme: QmTheme, prompt: string, navHtml?: string, footerHtml?: string) {
  const pageClass = `min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] dark:bg-[#000000] dark:text-white`;
  const brandName = extractBusinessName(prompt) || 'QAY Studio';
  const { nav, footer } = fallbackSharedNavFooter(siteType, brandName, navHtml, footerHtml);

  const about = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">About</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl" data-qm="about-title">A focused story with real reasons to believe.</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">This page gives the brand room to explain its origin, approach, audience, standards, and next step.</p></div><div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8"><div class="grid gap-4 sm:grid-cols-2"><div class="rounded-2xl bg-[var(--qm-bg)] p-5"><p class="text-3xl font-black">01</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Clear positioning</p></div><div class="rounded-2xl bg-[var(--qm-bg)] p-5"><p class="text-3xl font-black">02</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Proof and credibility</p></div><div class="rounded-2xl bg-[var(--qm-bg)] p-5 sm:col-span-2"><p class="text-3xl font-black">03</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">A conversion path that feels natural.</p></div></div></div></div></section></main>${footer}`;
  const services = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-7xl"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Services</p><h1 class="mt-5 max-w-4xl text-5xl font-black leading-none md:text-7xl" data-qm="features-title">Offer pages that make the work easy to understand.</h1><div class="mt-10 grid gap-5 md:grid-cols-3" data-qay-animate="stagger-children"><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="lift"><h2 class="text-2xl font-black">Strategy</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Positioning, planning, and the first decision path.</p></article><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="lift"><h2 class="text-2xl font-black">Delivery</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Clear process, timelines, and polished outcomes.</p></article><article class="rounded-3xl bg-[var(--qm-accent)] p-6 text-[var(--qm-accent-text)]"><h2 class="text-2xl font-black">Support</h2><p class="mt-3 text-sm leading-6 opacity-80">Follow-through, updates, and next-step guidance.</p></article></div></div></section></main>${footer}`;
  const contact = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Contact</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl" data-qm="contact-title">Start the conversation.</h1><p class="mt-5 text-[var(--qm-text-muted)]">Use this page for leads, bookings, inquiries, support, or partnership requests.</p></div><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea name="message" placeholder="Message" class="h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section></main>${footer}`;
  const pricing = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-7xl"><h1 class="text-5xl font-black md:text-7xl">Choose the right path.</h1><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="font-black">Starter</h2><p class="mt-5 text-4xl font-black">$99</p></article><article class="rounded-3xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-6"><h2 class="font-black">Growth</h2><p class="mt-5 text-4xl font-black">$249</p></article><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="font-black">Custom</h2><p class="mt-5 text-4xl font-black">Talk</p></article></div></div></section></main>${footer}`;

  const pages = [
    pageWrapper('About', 'about', about),
    pageWrapper(siteType === 'saas' || siteType === 'tech-startup' ? 'Features' : 'Services', siteType === 'saas' || siteType === 'tech-startup' ? 'features' : 'services', services),
    pageWrapper('Contact', 'contact', contact),
  ];

  if (siteType === 'saas' || siteType === 'tech-startup' || siteType === 'education') {
    pages.splice(2, 0, pageWrapper('Pricing', 'pricing', pricing));
  }

  const hasAuth = /\b(auth|login|register|signup|signin|sign-in|sign-up|protect|member|membership|dashboard)\b/i.test(prompt);
  if (hasAuth) {
    const brandName = extractBusinessName(prompt) || 'QAY Studio';
    pages.push(pageWrapper('Login', 'login', buildCustomLoginPage(brandName, '')));
    pages.push(pageWrapper('Register', 'register', buildCustomRegisterPage(brandName, '')));
    pages.push(pageWrapper('Dashboard', 'dashboard', buildCustomDashboardPage(brandName, '')));
  }

  return pages.join('\n\n');
}

export async function assembleSiteFromSections(prompt: string, overrideSiteType?: SiteType): Promise<AssemblyResult> {
  const siteType = overrideSiteType || detectSiteType(prompt);
  const { themes, sections } = await getLibraryForType(siteType);
  const theme = await pickTheme(prompt, themes);
  const sectionOrder = SECTION_ORDER[siteType];
  const sectionsUsed: AssemblyResult['sectionsUsed'] = [];
  const htmlParts: string[] = [];
  let pickedNavHtml = '';
  let pickedFooterHtml = '';

  // Ensure navbar is at the beginning
  const finalOrder = [...sectionOrder];
  if (finalOrder[0] !== 'nav') {
    const navIndex = finalOrder.indexOf('nav');
    if (navIndex > -1) {
      finalOrder.splice(navIndex, 1);
    }
    finalOrder.unshift('nav');
  }
  // Ensure footer is at the end
  if (finalOrder[finalOrder.length - 1] !== 'footer') {
    const footerIndex = finalOrder.indexOf('footer');
    if (footerIndex > -1) {
      finalOrder.splice(footerIndex, 1);
    }
    finalOrder.push('footer');
  }

  for (const sectionType of finalOrder) {
    const themed = sections.filter((section) => section.section_type === sectionType && section.theme_id === theme.theme_id && section.is_active !== false);
    const fallback = sections.filter((section) => section.section_type === sectionType && section.is_active !== false);
    const available = themed.length ? themed : fallback;
    const picked = pickSection(prompt, sectionType, available);
    if (!picked) continue;

    htmlParts.push(picked.html);
    if (sectionType === 'nav') pickedNavHtml = picked.html;
    if (sectionType === 'footer') pickedFooterHtml = picked.html;
    sectionsUsed.push({ type: sectionType, sectionId: picked.id, keywords: picked.keywords });
  }

  const bodyHtml = htmlParts.join('\n\n');
  const extraPages = siteType === 'ecommerce'
    ? ecommerceExtraPages(theme, prompt)
    : siteType === 'blog'
      ? blogExtraPages(theme, prompt, pickedNavHtml, pickedFooterHtml)
      : genericExtraPages(siteType, theme, prompt, pickedNavHtml, pickedFooterHtml);
  const html = await personalizeSections(
    shouldGenerateMultiPage(prompt, siteType)
      ? [
        pageWrapper('Homepage', '/', bodyHtml),
        extraPages,
      ].filter(Boolean).join('\n\n')
      : bodyHtml,
    prompt,
    siteType,
    theme
  );

  return {
    html,
    theme,
    sectionsUsed,
    provider: 'section-library',
    siteType,
  };
}

function buildCustomLoginPage(brandName: string, tagline: string) {
  return `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">${brandName}</a>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="/register" class="hover:text-[var(--qm-accent)] transition">Register</a>
    </div>
  </div>
</nav>
<main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] flex items-center justify-center py-20 px-5">
  <div class="w-full max-w-md rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 shadow-2xl space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="login-title">Welcome Back</h1>
      <p class="text-xs text-[var(--qm-text-muted)]" data-qm="login-subtitle">Enter your details to access your account dashboard</p>
    </div>
    <form class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
        <input type="email" required placeholder="name@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Password</label>
        <input type="password" required placeholder="••••••••" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div class="flex items-center justify-between text-xs">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="rounded border-[var(--qm-border)] text-[var(--qm-accent)] focus:ring-[var(--qm-accent)]" />
          <span>Remember me</span>
        </label>
        <a href="#" class="text-[var(--qm-accent)] hover:underline font-semibold">Forgot password?</a>
      </div>
      <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-4 text-xs font-black uppercase tracking-wider text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 active:scale-98 transition duration-200">Sign In</button>
    </form>
    <p class="text-center text-xs text-[var(--qm-text-muted)]">
      Don't have an account? <a href="/register" class="text-[var(--qm-accent)] hover:underline font-semibold">Sign up</a>
    </p>
  </div>
</main>
<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <p class="font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">${brandName}</p>
    <p class="text-[10px] uppercase tracking-wider">&copy; 2026 ${brandName}. ALL RIGHTS RESERVED.</p>
  </div>
</footer>`;
}

function buildCustomRegisterPage(brandName: string, tagline: string) {
  return `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">${brandName}</a>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="/login" class="hover:text-[var(--qm-accent)] transition">Login</a>
    </div>
  </div>
</nav>
<main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] flex items-center justify-center py-20 px-5">
  <div class="w-full max-w-md rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 shadow-2xl space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="register-title">Create Account</h1>
      <p class="text-xs text-[var(--qm-text-muted)]" data-qm="register-subtitle">Sign up to get started and manage your member dashboard</p>
    </div>
    <form class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
        <input type="text" required placeholder="John Doe" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
        <input type="email" required placeholder="name@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Password</label>
        <input type="password" required placeholder="••••••••" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div class="flex items-center text-xs">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" required class="rounded border-[var(--qm-border)] text-[var(--qm-accent)]" />
          <span>I agree to the <a href="#" class="text-[var(--qm-accent)] hover:underline">Terms & Privacy Policy</a></span>
        </label>
      </div>
      <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-4 text-xs font-black uppercase tracking-wider text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 active:scale-98 transition duration-200">Create Account</button>
    </form>
    <p class="text-center text-xs text-[var(--qm-text-muted)]">
      Already have an account? <a href="/login" class="text-[var(--qm-accent)] hover:underline font-semibold">Sign in</a>
    </p>
  </div>
</main>
<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <p class="font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">${brandName}</p>
    <p class="text-[10px] uppercase tracking-wider">&copy; 2026 ${brandName}. ALL RIGHTS RESERVED.</p>
  </div>
</footer>`;
}

function buildCustomDashboardPage(brandName: string, tagline: string) {
  return `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">${brandName}</a>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="/login" class="hover:text-[var(--qm-accent)] transition">Log Out</a>
    </div>
  </div>
</nav>
<main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] py-10 px-5">
  <div class="mx-auto max-w-7xl space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--qm-border)] pb-6">
      <div class="space-y-1">
        <h1 class="text-4xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="dashboard-title">Workspace Console</h1>
        <p class="text-xs text-[var(--qm-text-muted)]" data-qm="dashboard-subtitle">Real-time control panel, membership state, and activity logs.</p>
      </div>
      <div class="flex gap-3">
        <button class="rounded-xl border border-[var(--qm-border)] px-4 py-2 text-xs font-bold hover:bg-[var(--qm-surface)] transition">Settings</button>
        <button class="rounded-xl bg-[var(--qm-accent)] px-4 py-2 text-xs font-bold text-[var(--qm-accent-text)] shadow hover:opacity-90 transition">New Action</button>
      </div>
    </div>
    
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-1-val">2,480</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-1-lbl">Active Members</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-2-val">$14,820</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-2-lbl">Monthly Revenue</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-3-val">99.98%</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-3-lbl">System Health</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-4-val">3 Active</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-4-lbl">API Binders</p>
      </div>
    </div>
    
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 lg:col-span-2 space-y-4">
        <h3 class="font-bold text-lg" data-qm="logs-title">Activity Logs</h3>
        <div class="divide-y divide-[var(--qm-border)]">
          <div class="py-3 flex justify-between text-xs">
            <span class="font-mono text-[var(--qm-text-muted)]">03:22:19</span>
            <span data-qm="log-1">User authentication success</span>
            <span class="text-emerald-500 font-bold">OK</span>
          </div>
          <div class="py-3 flex justify-between text-xs">
            <span class="font-mono text-[var(--qm-text-muted)]">02:54:11</span>
            <span data-qm="log-2">Payment provider sync success</span>
            <span class="text-emerald-500 font-bold">OK</span>
          </div>
          <div class="py-3 flex justify-between text-xs">
            <span class="font-mono text-[var(--qm-text-muted)]">02:08:44</span>
            <span data-qm="log-3">Auto-deploy trigger</span>
            <span class="text-[var(--qm-accent)] font-bold">PENDING</span>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-4">
        <h3 class="font-bold text-lg" data-qm="profile-title">Account Profile</h3>
        <div class="flex items-center gap-4">
          <div class="size-12 rounded-full bg-[var(--qm-accent)] text-[var(--qm-accent-text)] flex items-center justify-center font-black">AD</div>
          <div>
            <p class="text-sm font-bold" data-qm="profile-name">Admin Member</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="profile-email">admin@qay.studio</p>
          </div>
        </div>
        <div class="pt-4 border-t border-[var(--qm-border)]">
          <span class="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider" data-qm="subscription-badge">Active Subscription</span>
        </div>
      </div>
    </div>
  </div>
</main>
<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <p class="font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">${brandName}</p>
    <p class="text-[10px] uppercase tracking-wider">&copy; 2026 ${brandName}. ALL RIGHTS RESERVED.</p>
  </div>
</footer>`;
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

function escapeCssString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
