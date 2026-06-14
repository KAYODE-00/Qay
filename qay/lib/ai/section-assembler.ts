import { callWithFallbackDetailed } from '@/qay/lib/ai/providers';
import { getLibraryForType } from '@/qay/lib/section-library';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '@/qay/lib/section-library/types';
import type { AssemblyResult, QmSection, QmTheme, SectionType, SiteType } from '@/qay/lib/section-library/types';

export function detectSiteType(prompt: string): SiteType {
  const normalized = prompt.toLowerCase();
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

export function pickSection(prompt: string, sectionType: SectionType, availableSections: QmSection[]) {
  const normalized = prompt.toLowerCase();
  const scored = [...availableSections]
    .map((section) => ({
      section,
      score: section.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || b.section.rank - a.section.rank);

  if (!scored.length) return undefined;

  const topScore = scored[0].score;
  const pool = scored
    .filter((item) => item.score === topScore)
    .slice(0, Math.min(5, scored.length));
  const hash = Array.from(`${normalized}:${sectionType}`).reduce((total, char) => total + char.charCodeAt(0), 0);
  return pool[hash % pool.length]?.section;
}

function extractBusinessName(prompt: string) {
  const quoted = prompt.match(/["'“”]([^"'“”]{2,80})["'“”]/)?.[1];
  if (quoted) return quoted.trim();

  const called = prompt.match(/\b(?:called|named|for)\s+([A-Z][A-Za-z0-9&'. -]{2,60})/)?.[1];
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

function materializeThemeVariables(html: string, theme: QmTheme) {
  return Object.entries(theme.css_variables).reduce((current, [key, value]) => (
    current.replaceAll(`var(${key})`, value)
  ), html);
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

async function aiCopyOverrides(html: string, prompt: string, siteType: SiteType) {
  const zones: Record<string, string> = {};
  for (const match of html.matchAll(/data-qm="([^"]+)"[^>]*>([^<]*)</g)) {
    zones[match[1]] = match[2].trim();
  }

  if (!Object.keys(zones).length || process.env.QAY_SECTION_ASSEMBLER_AI_COPY === 'false') return {};

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
  const deterministic = deterministicCopy(prompt, siteType);
  const aiOverrides = await aiCopyOverrides(html, prompt, siteType);
  const copied = materializeThemeVariables(
    replaceTextZones(html, { ...deterministic, ...aiOverrides }),
    theme
  );
  const cssVars = Object.entries(theme.css_variables).map(([key, value]) => `  ${key}: ${value};`).join('\n');
  const fontLinks = theme.google_fonts.length
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?${theme.google_fonts.map((font) => `family=${font}`).join('&')}&display=swap" rel="stylesheet">`
    : '';

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
${copied}`;
}

export async function assembleSiteFromSections(prompt: string, overrideSiteType?: SiteType): Promise<AssemblyResult> {
  const siteType = overrideSiteType || detectSiteType(prompt);
  const { themes, sections } = await getLibraryForType(siteType);
  const theme = await pickTheme(prompt, themes);
  const sectionOrder = SECTION_ORDER[siteType];
  const sectionsUsed: AssemblyResult['sectionsUsed'] = [];
  const htmlParts: string[] = [];

  for (const sectionType of sectionOrder) {
    const themed = sections.filter((section) => section.section_type === sectionType && section.theme_id === theme.theme_id && section.is_active !== false);
    const fallback = sections.filter((section) => section.section_type === sectionType && section.is_active !== false);
    const available = themed.length ? themed : fallback;
    const picked = pickSection(prompt, sectionType, available);
    if (!picked) continue;

    htmlParts.push(picked.html);
    sectionsUsed.push({ type: sectionType, sectionId: picked.id, keywords: picked.keywords });
  }

  const html = await personalizeSections(htmlParts.join('\n\n'), prompt, siteType, theme);

  return {
    html,
    theme,
    sectionsUsed,
    provider: 'section-library',
    siteType,
  };
}
