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
  return [...availableSections]
    .map((section) => ({
      section,
      score: section.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || b.section.rank - a.section.rank)[0]?.section;
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

  return {
    'brand-name': brand,
    'hero-title': `${brand} is built to look clear, credible, and ready to launch.`,
    'hero-subtitle': 'A focused website with strong positioning, useful sections, and editable content for the next stage.',
    'about-title': 'A sharper way to show the work.',
    'about-copy': `${brand} gets a complete page structure with copy, visuals, calls to action, and room to grow.`,
    'footer-brand': brand,
  };
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
  const copied = replaceTextZones(html, { ...deterministic, ...aiOverrides });
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
