import type { SiteDecision } from './decision-schema';
import { loadLibrary, normalizeDecisionSlot } from '../section-library/manifest';
import type { SectionDesign } from '../section-library/manifest';

export async function assembleFromDecision(decision: SiteDecision): Promise<{
  html: string;
  pages: string[];
}> {
  const lib = await loadLibrary(decision.siteType);
  const colors = decision.brand.colors;
  const fonts = decision.brand.fonts;

  const themeCss = `
<style>
:root {
  --qm-bg: ${safeColor(colors.background, '#ffffff')};
  --qm-surface: ${isDark(colors.background) ? '#111111' : '#ffffff'};
  --qm-primary: ${safeColor(colors.primary, '#111111')};
  --qm-secondary: ${safeColor(colors.secondary, '#555555')};
  --qm-accent: ${safeColor(colors.accent, '#111111')};
  --qm-accent-text: ${isDark(colors.accent) ? '#ffffff' : '#111111'};
  --qm-border: ${isDark(colors.background) ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.14)'};
  --qm-text: ${isDark(colors.background) ? '#f5f5f0' : '#111111'};
  --qm-text-muted: ${isDark(colors.background) ? 'rgba(245,245,240,0.68)' : 'rgba(17,17,17,0.62)'};
  --qm-heading-font: '${escapeCssString(fonts.heading || 'Inter')}', sans-serif;
  --qm-body-font: '${escapeCssString(fonts.body || 'Inter')}', sans-serif;
}
body { background: var(--qm-bg); color: var(--qm-text); font-family: var(--qm-body-font); margin:0; }
h1,h2,h3,h4,h5,h6 { font-family: var(--qm-heading-font); }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.heading || 'Inter')}:wght@400;600;700;800;900&family=${encodeURIComponent(fonts.body || 'Inter')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
`;

  function pickSection(sectionType: string): string {
    const slot = normalizeDecisionSlot(sectionType);
    const pool = lib[slot] as SectionDesign[] | undefined;
    if (!pool?.length) return '';
    const rawIndex = decision.sectionPicks[slot] ?? decision.sectionPicks[sectionType] ?? 0;
    const index = Number.isFinite(Number(rawIndex)) ? Number(rawIndex) : 0;
    return pool.find((item) => item.index === index)?.html || pool[index % pool.length]?.html || pool[0].html;
  }

  function injectContentAndImages(html: string): string {
    let out = html;
    for (const [zone, value] of Object.entries(decision.textContent)) {
      out = out.replace(
        new RegExp(`(data-qm="${escapeRegex(zone)}"[^>]*>)[^<]*(<)`, 'g'),
        `$1${escapeHtml(value)}$2`
      );
    }
    for (const [zone, url] of Object.entries(decision.brand.images)) {
      if (!url) continue;
      out = out.replace(
        new RegExp(`(data-qm="${escapeRegex(zone)}"[^>]*?\\ssrc=")[^"]*(")`, 'g'),
        `$1${escapeAttribute(url)}$2`
      );
    }
    return out;
  }

  if (decision.navMode === 'single-page-scroll') {
    const page = decision.pages[0] || { name: 'Homepage', slug: '/', sectionSlots: ['navbar', 'hero', 'footer'] };
    const body = page.sectionSlots.map(pickSection).join('\n\n');
    return { html: `${themeCss}\n${injectContentAndImages(body)}`, pages: [page.name] };
  }

  const pageBlocks: string[] = [];
  const pageNames: string[] = [];
  for (const page of decision.pages) {
    const sectionsHtml = page.sectionSlots.map(pickSection).join('\n\n');
    pageBlocks.push(`<div data-qay-page="${escapeAttribute(page.name)}" data-qay-slug="${escapeAttribute(page.slug)}">\n${injectContentAndImages(sectionsHtml)}\n</div>`);
    pageNames.push(page.name);
  }

  return { html: `${themeCss}\n${pageBlocks.join('\n\n')}`, pages: pageNames };
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function escapeCssString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
