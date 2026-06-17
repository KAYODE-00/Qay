import type { SiteDecision } from './decision-schema';
import { loadLibrary, normalizeDecisionSlot } from '../section-library/manifest';
import type { SectionDesign } from '../section-library/manifest';
import { callWithFallbackDetailed } from './providers';

export async function assembleFromDecision(decision: SiteDecision, prompt?: string): Promise<{
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

  let rawHtml = '';
  let pageNames: string[] = [];

  if (decision.navMode === 'single-page-scroll') {
    const page = decision.pages[0] || { name: 'Homepage', slug: '/', sectionSlots: ['navbar', 'hero', 'footer'] };
    const body = page.sectionSlots.map(pickSection).join('\n\n');
    rawHtml = `${themeCss}\n${injectContentAndImages(body)}`;
    pageNames = [page.name];
  } else {
    const pageBlocks: string[] = [];
    for (const page of decision.pages) {
      const sectionsHtml = page.sectionSlots.map(pickSection).join('\n\n');
      pageBlocks.push(`<div data-qay-page="${escapeAttribute(page.name)}" data-qay-slug="${escapeAttribute(page.slug)}">\n${injectContentAndImages(sectionsHtml)}\n</div>`);
      pageNames.push(page.name);
    }
    rawHtml = `${themeCss}\n${pageBlocks.join('\n\n')}`;
  }

  const html = (prompt && prompt.length > 5) ? await personalizeAssembledHtml(rawHtml, decision, prompt) : rawHtml;

  return { html, pages: pageNames };
}

async function personalizeAssembledHtml(html: string, decision: SiteDecision, prompt: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert copywriter and content personalization engine for the QAY website builder.
You will receive the user's original website prompt, the site type, brand details, and a fully styled HTML template.
Your ONLY job is to rewrite ALL visible text content to make it hyper-specific to the user's brand and industry.

## What to Personalize
- ALL headings (h1-h6): Make them compelling, specific, and on-brand
- ALL paragraphs: Write real, detailed copy — no placeholder text
- ALL button/link text: Use action-oriented, industry-specific CTAs
- ALL list items, table cells, card titles, card descriptions
- ALL prices: Use realistic prices for the industry
- ALL product/service names: Use specific, believable names
- ALL menu items (for restaurants): Use real dish names with descriptions
- ALL team member names and roles: Use realistic names and titles
- ALL testimonial quotes and attribution: Write believable, specific reviews
- ALL image alt attributes: Make them descriptive and relevant
- Copyright year and company references: Use the brand name

## Industry-Specific Copy Guidelines
- **Restaurant**: Use appetizing food descriptions, real dish names, cooking techniques, ingredient details
- **E-commerce**: Use product-focused copy, collection names, shopping CTAs ("Shop Now", "Add to Cart")
- **SaaS/Tech**: Use feature-benefit language, metrics, integration mentions
- **Law/Medical**: Use professional, trustworthy language with credentials
- **Portfolio/Agency**: Use creative, confident language about capabilities
- **Hotel**: Use hospitality language about experiences, amenities, bookings
- **Fitness**: Use motivational, energetic language about programs and results

## STRICT Rules
- NEVER change ANY HTML tags, CSS classes, inline styles, IDs, or data-* attributes
- NEVER alter any data-qay-*, data-qm, data-qay-commerce, or structural attributes
- NEVER change image src URLs
- Keep text length roughly similar to the template to preserve layout
- Return ONLY the final HTML. No markdown code fences, no explanations, no commentary.`;

    const userMessage = `User prompt: "${prompt}"
Site type: ${decision.siteType}
Brand name: ${decision.brand.name}
Tagline: ${decision.brand.tagline}

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
    console.warn('[QAY AI] Assembled HTML copy personalization failed, using raw template:', err);
    return html;
  }
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
