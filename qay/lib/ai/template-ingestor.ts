import type { TemplateDecision } from './template-detector';
import { callWithFallbackDetailed } from './providers';

export interface TemplateMeta {
  industry: string;
  colorMood: string;
  tags: string[];
  features: {
    hasCms: boolean;
    hasCommerce: boolean;
    hasAuth: boolean;
    hasMultiPage: boolean;
    pageCount: number;
  };
  zones: Record<string, string>;
  pagesMeta: Array<{ slug: string; name: string; purpose: string }>;
  cmsHints?: {
    collectionType: string;
    sampleItems: Array<{ title: string; subtitle: string; price?: string }>;
  };
}

// ─── Feature detection ───────────────────────────────────────────────────────

function detectFeatures(html: string) {
  const hasCommerce = /data-qay-commerce=|cart-button|checkout-button|product-card/i.test(html);
  const hasAuth = /data-qay-site-auth-form=|data-qay-site-auth=/i.test(html);
  const hasCms = /data-qay-cms|data-qay-collection|data-qay-blog/i.test(html);

  const pageMatches = [...html.matchAll(/data-qay-page="([^"]+)"/g)];
  const pageCount = pageMatches.length || 1;
  const hasMultiPage = pageCount > 1;

  return { hasCommerce, hasAuth, hasCms, hasMultiPage, pageCount };
}

// ─── Extract pages ───────────────────────────────────────────────────────────

function extractPagesMeta(html: string): Array<{ slug: string; name: string; purpose: string }> {
  const pages: Array<{ slug: string; name: string; purpose: string }> = [];
  const pageRegex = /data-qay-page="([^"]+)"[^>]*data-qay-slug="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = pageRegex.exec(html)) !== null) {
    const name = m[1];
    const slug = m[2].replace(/^\/+/, '') || '/';
    const purpose = inferPagePurpose(slug, name);
    pages.push({ slug, name, purpose });
  }
  return pages;
}

function inferPagePurpose(slug: string, name: string): string {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  if (s === '/' || s === 'home' || n === 'home') return 'homepage';
  if (/shop|store|product|collection/.test(s)) return 'ecommerce';
  if (/about|story|team/.test(s)) return 'about';
  if (/contact|reach/.test(s)) return 'contact';
  if (/blog|article|post/.test(s)) return 'blog';
  if (/price|pricing|plan/.test(s)) return 'pricing';
  if (/login|signin/.test(s)) return 'auth-login';
  if (/signup|register/.test(s)) return 'auth-signup';
  if (/menu|food|dish/.test(s)) return 'menu';
  if (/service/.test(s)) return 'services';
  if (/portfolio|work|project/.test(s)) return 'portfolio';
  return 'general';
}

// ─── Extract text zones ───────────────────────────────────────────────────────

function extractZones(html: string): Record<string, string> {
  const zones: Record<string, string> = {};
  const regex = /data-qm="([^"]+)"[^>]*>([^<]{1,300})</g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const zone = m[1];
    const text = m[2].trim();
    if (text && !zone.includes('image') && !zone.includes('img') && !zone.includes('photo')) {
      zones[zone] = text;
    }
  }
  return zones;
}

// ─── Detect color mood ────────────────────────────────────────────────────────

function detectColorMood(html: string): string {
  const h = html.toLowerCase();
  const isDark = /#0[0-3][0-9a-f]{4}|bg-\[#0|--qm-bg.*#0[0-3]/i.test(html)
    || /dark|black|midnight|obsidian|noir/.test(h);
  const isLuxury = /luxury|premium|cormorant|editorial|bespoke|gold|serif/i.test(h);
  const isBold = /bold|vibrant|neon|urban|street|hype|bebas/i.test(h);
  const isWarm = /warm|rustic|heritage|cream|beige|serif.*display/i.test(h);
  const isMinimal = /minimal|clean|simple|whitespace|mono/i.test(h);

  if (isDark && isLuxury) return 'dark-luxury';
  if (isDark && isBold) return 'dark-bold';
  if (isDark) return 'dark-minimal';
  if (isLuxury) return 'light-luxury';
  if (isBold) return 'bold-vibrant';
  if (isWarm) return 'warm-classic';
  if (isMinimal) return 'light-minimal';
  return 'fresh-modern';
}

// ─── AI tag generation ────────────────────────────────────────────────────────

async function generateTagsWithAi(
  htmlSummary: string,
  features: TemplateMeta['features'],
  zones: Record<string, string>
): Promise<{ tags: string[]; industry: string; colorMood: string }> {
  const systemPrompt = [
    'You analyze website HTML and output structured metadata JSON.',
    'Respond ONLY with a valid JSON object. No markdown. No explanation.',
    'The JSON must have exactly these keys:',
    '  "industry": string (one of: ecommerce, restaurant, saas, agency, portfolio, law, medical, blog, beauty, fitness, hotel, real-estate, church, education, event, music, photography, nonprofit, construction, tech-startup)',
    '  "colorMood": string (one of: dark-luxury, dark-bold, dark-minimal, light-minimal, light-luxury, warm-classic, bold-vibrant, fresh-modern)',
    '  "tags": string[] (10-20 specific keywords describing the design, industry, mood, and features)',
  ].join('\n');

  const sampleZones = Object.entries(zones).slice(0, 8).map(([k, v]) => `${k}: "${v}"`).join('\n');
  const userPrompt = [
    'Analyze this website template and output metadata JSON.',
    '',
    `Features detected: commerce=${features.hasCommerce}, cms=${features.hasCms}, auth=${features.hasAuth}, pages=${features.pageCount}`,
    '',
    'Sample text zones from the template:',
    sampleZones,
    '',
    'HTML summary (first 2000 chars):',
    htmlSummary.slice(0, 2000),
  ].join('\n');

  try {
    const result = await callWithFallbackDetailed<{
      industry: string;
      colorMood: string;
      tags: string[];
    }>(userPrompt, systemPrompt, (text) => {
      const cleaned = text.trim().replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed.industry || !Array.isArray(parsed.tags)) throw new Error('Invalid shape');
      return parsed;
    });
    return result.value || { industry: 'agency', colorMood: 'light-minimal', tags: [] };
  } catch {
    return { industry: 'agency', colorMood: detectColorMood(htmlSummary), tags: [] };
  }
}

// ─── CMS hints generation ─────────────────────────────────────────────────────

async function generateCmsHints(
  industry: string,
  zones: Record<string, string>
): Promise<TemplateMeta['cmsHints']> {
  const systemPrompt = [
    'You generate realistic sample catalog items for a website CMS.',
    'Respond ONLY with a valid JSON object. No markdown. No explanation.',
    'The JSON must have:',
    '  "collectionType": string (e.g. "products", "menu items", "blog posts", "listings")',
    '  "sampleItems": array of 4 objects with "title", "subtitle", "price" (optional)',
  ].join('\n');

  const userPrompt = `Generate 4 sample CMS catalog items for a ${industry} website. Make them specific and realistic.`;

  try {
    const result = await callWithFallbackDetailed<TemplateMeta['cmsHints']>(
      userPrompt,
      systemPrompt,
      (text) => {
        const cleaned = text.trim().replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
        const parsed = JSON.parse(cleaned);
        if (!parsed.collectionType || !Array.isArray(parsed.sampleItems)) throw new Error('Invalid shape');
        return parsed;
      }
    );
    return result.value || undefined;
  } catch {
    return undefined;
  }
}

// ─── Main ingestor ────────────────────────────────────────────────────────────

export async function ingestTemplate(html: string): Promise<TemplateMeta> {
  const features = detectFeatures(html);
  const pagesMeta = extractPagesMeta(html);
  const zones = extractZones(html);
  const colorMoodGuess = detectColorMood(html);

  // Run AI tag generation (lightweight — only sends HTML summary, not full HTML)
  const aiMeta = await generateTagsWithAi(html, features, zones);

  // Add feature-based tags
  const featureTags: string[] = [];
  if (features.hasCommerce) featureTags.push('ecommerce', 'shop', 'cart', 'add-to-cart');
  if (features.hasCms) featureTags.push('cms', 'blog', 'dynamic-content');
  if (features.hasAuth) featureTags.push('auth', 'login', 'membership');
  if (features.hasMultiPage) featureTags.push('multi-page');

  const tags = [...new Set([...aiMeta.tags, ...featureTags, aiMeta.industry, aiMeta.colorMood])].filter(Boolean);

  // Generate CMS hints if applicable
  const cmsHints = features.hasCms || features.hasCommerce
    ? await generateCmsHints(aiMeta.industry, zones)
    : undefined;

  return {
    industry: aiMeta.industry || 'agency',
    colorMood: aiMeta.colorMood || colorMoodGuess,
    tags,
    features,
    zones,
    pagesMeta,
    cmsHints,
  };
}

// ─── Helper: estimate if HTML is a valid template ────────────────────────────

export function validateTemplateHtml(html: string): { valid: boolean; reason?: string } {
  if (html.length < 200) return { valid: false, reason: 'HTML is too short.' };
  if (!/<[a-z][\s\S]*>/i.test(html)) return { valid: false, reason: 'No valid HTML tags found.' };
  if (/<script\b[^>]*>[\s\S]*?<\/script>/i.test(html)) return { valid: false, reason: 'HTML cannot contain <script> tags.' };
  if (/\bon[a-z]+\s*=/i.test(html)) return { valid: false, reason: 'HTML cannot contain inline event handlers.' };
  if (!/data-qm=/i.test(html)) return { valid: false, reason: 'Template must contain at least one data-qm zone.' };
  if (!/var\(--qm-/i.test(html)) return { valid: false, reason: 'Template must use QAY CSS variables (var(--qm-...)).' };
  return { valid: true };
}
