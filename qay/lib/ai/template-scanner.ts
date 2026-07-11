import { getQayAdmin } from '../supabase-admin';
import { callWithFallback } from './providers';

export interface ScanResult {
  category: string;
  // 'restaurant' | 'ecommerce' | 'portfolio' | 'agency' |
  // 'saas' | 'law' | 'medical' | 'education' | 'event' |
  // 'real-estate' | 'beauty' | 'fitness' | 'church' | 'blog' |
  // 'hotel' | 'nonprofit' | 'photography' | 'music' | 'other'

  subcategory: string | null;
  // e.g. 'fine-dining' | 'streetwear' | 'freelancer' | null

  theme: string;
  // 'dark-luxury' | 'warm-classic' | 'bold-color' |
  // 'minimal-light' | 'minimal-dark' | 'editorial'

  features: string[];
  // ['cms-menu', 'cms-blog', 'cms-portfolio', 'cms-products',
  //  'contact-form', 'auth-protected', 'ecommerce',
  //  'reservations', 'booking']

  hasAuth: boolean;
  hasEcommerce: boolean;
  hasCms: boolean;

  suggestedName: string;
  // e.g. "Warm Nigerian Restaurant"

  scanSummary: string;
  // e.g. "4-page restaurant site with menu CMS and contact form"

  confidence: 'high' | 'medium' | 'low';

  cmsSchema: Array<{
    name: string;
    slug: string;
    fields: Array<{ name: string; type: string }>;
  }>;

  pageSlugs: string[];
}

export async function scanProjectForTemplate(siteId: string): Promise<ScanResult> {
  const admin = getQayAdmin() as any;

  // Step 1: Gather project data (no AI — pure DB reads)

  // Get site info
  const { data: site } = await admin
    .from('qay_sites')
    .select('*')
    .eq('id', siteId)
    .single();

  // Get pages (draft preferred, fallback to published)
  const { data: allPages } = await admin
    .from('pages')
    .select('id, slug, name, is_published')
    .filter('settings->>qay_site_id', 'eq', siteId)
    .is('deleted_at', null)
    .order('is_published', { ascending: true }) // false first
    .order('order', { ascending: true });

  const uniquePagesMap = new Map<string, any>();
  for (const page of allPages || []) {
    const slug = page.slug || '/';
    if (!uniquePagesMap.has(slug) || page.is_published === false) {
      uniquePagesMap.set(slug, page);
    }
  }
  const pages = Array.from(uniquePagesMap.values());
  const pageIds = pages.map((page: any) => page.id).filter(Boolean);
  const { data: layerRows } = pageIds.length > 0
    ? await admin
      .from('page_layers')
      .select('page_id, layers')
      .in('page_id', pageIds)
      .eq('is_published', false)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    : { data: [] };

  const layerMap = new Map<string, unknown>();
  for (const row of layerRows || []) {
    if (!layerMap.has(row.page_id)) {
      layerMap.set(row.page_id, row.layers || []);
    }
  }

  // Get CMS collections links
  const { data: links } = await admin
    .from('qay_site_collections')
    .select('collection_id')
    .eq('site_id', siteId);

  const collectionIds = (links || []).map((l: any) => l.collection_id);

  let collections: any[] = [];
  let fields: any[] = [];

  if (collectionIds.length > 0) {
    const { data: cols } = await admin
      .from('collections')
      .select('id, name')
      .in('id', collectionIds)
      .eq('is_published', false)
      .is('deleted_at', null);

    const { data: flds } = await admin
      .from('collection_fields')
      .select('id, collection_id, name, type, key')
      .in('collection_id', collectionIds)
      .eq('is_published', false)
      .is('deleted_at', null);

    collections = cols || [];
    fields = flds || [];
  }

  // Step 2: Build a SUMMARY to send to AI (not full HTML)
  const pageSlugs = pages.map((p: any) => p.slug || '/');
  const cmsSchema = collections.map((c: any) => {
    const cFields = fields.filter((f: any) => f.collection_id === c.id);
    return {
      name: c.name,
      slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      fields: cFields.map((f: any) => ({
        name: f.name,
        type: f.type || 'text',
      })).slice(0, 8),
    };
  });

  // Detect features from HTML content (pure code, no AI)
  const allHtml = pages.map((p: any) => JSON.stringify(layerMap.get(p.id) || [])).join(' ');
  const hasEcommerce = /data-qay-commerce=|cart-button|checkout-button|product-card/i.test(allHtml);
  const hasAuth = /data-qay-site-auth-form=|data-qay-site-auth=/i.test(allHtml);
  const hasCms = collections.length > 0;
  const hasContactForm = /data-qm=".*(?:email|message|name|contact).*"|form/i.test(allHtml);
  const hasReservations = /reserv|booking|rsvp/i.test(allHtml);

  // Detect theme from CSS variables in HTML
  const bgMatch = allHtml.match(/--qm-bg:\s*([^;}\s]+)/);
  const bgColor = bgMatch?.[1]?.trim() || '#ffffff';
  const isDark = isDarkColor(bgColor);

  // Build summary for AI (short, focused)
  const summary = `
Pages (${pageSlugs.length}): ${pageSlugs.join(', ')}

CMS Collections (${cmsSchema.length}):
${cmsSchema.map(c => `- ${c.name}: fields: ${c.fields.map((f: any) => f.name).join(', ')}`).join('\n') || 'None'}

Detected features:
- Ecommerce (cart/products): ${hasEcommerce}
- Auth protection (login/signup): ${hasAuth}
- CMS collections: ${hasCms}
- Contact form: ${hasContactForm}
- Reservations/booking: ${hasReservations}

Color scheme: ${isDark ? 'dark background' : 'light background'} (${bgColor})

Section types found in HTML:
${detectSectionTypes(allHtml).join(', ')}
`.trim();

  // Step 3: ONE small AI call to categorize
  const systemPrompt = `You categorize website templates.
Respond ONLY with valid JSON. No markdown. No explanation.`;

  const userMessage = `Analyze this website project and categorize it:

${summary}

Return this JSON:
{
  "category": "restaurant|ecommerce|portfolio|agency|saas|law|medical|education|event|real-estate|beauty|fitness|church|blog|hotel|nonprofit|photography|music|other",
  "subcategory": "fine-dining|streetwear|freelancer|null (be specific or null)",
  "theme": "dark-luxury|dark-bold|dark-minimal|warm-classic|light-minimal|light-luxury|bold-color|editorial|fresh-modern",
  "suggestedName": "short human-readable template name like 'Warm Nigerian Restaurant'",
  "scanSummary": "one sentence describing what this template is",
  "confidence": "high|medium|low"
}`;

  let aiResult: any = {};
  try {
    const raw = await callWithFallback(userMessage, systemPrompt);
    const text = typeof raw === 'string' ? raw : (raw as any)?.text || '';
    const cleaned = text.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    aiResult = JSON.parse(cleaned);
  } catch (err) {
    console.warn('[QAY template-scanner] AI classification failed:', err);
    aiResult = {
      category: hasEcommerce ? 'ecommerce' : hasCms ? 'blog' : 'agency',
      subcategory: null,
      theme: isDark ? 'dark-minimal' : 'light-minimal',
      suggestedName: site?.name || 'Custom Site Template',
      scanSummary: `${pages.length}-page custom website template`,
      confidence: 'low',
    };
  }

  // Detect features array
  const features: string[] = [];
  if (hasEcommerce) features.push('ecommerce');
  if (hasAuth) features.push('auth-protected');
  if (hasContactForm) features.push('contact-form');
  if (hasReservations) features.push('reservations');
  cmsSchema.forEach(c => {
    const slug = c.slug?.toLowerCase() || c.name?.toLowerCase() || '';
    if (slug.includes('menu')) features.push('cms-menu');
    else if (slug.includes('blog') || slug.includes('post')) features.push('cms-blog');
    else if (slug.includes('product')) features.push('cms-products');
    else if (slug.includes('portfolio') || slug.includes('project')) features.push('cms-portfolio');
    else if (slug.includes('team') || slug.includes('staff')) features.push('cms-team');
    else features.push(`cms-${slug}`);
  });

  return {
    category: aiResult.category || 'other',
    subcategory: aiResult.subcategory || null,
    theme: aiResult.theme || (isDark ? 'dark-minimal' : 'light-minimal'),
    features,
    hasAuth,
    hasEcommerce,
    hasCms,
    suggestedName: aiResult.suggestedName || site?.name || 'Custom Template',
    scanSummary: aiResult.scanSummary || `${pages.length}-page template`,
    confidence: aiResult.confidence || 'medium',
    cmsSchema,
    pageSlugs,
  };
}

function detectSectionTypes(html: string): string[] {
  const types: string[] = [];
  if (/data-qm="hero/.test(html)) types.push('hero');
  if (/data-qm="nav/.test(html) || /data-qm="brand-name/.test(html)) types.push('nav');
  if (/data-qm="footer/.test(html)) types.push('footer');
  if (/data-qm="product/.test(html)) types.push('products');
  if (/data-qm="about/.test(html)) types.push('about');
  if (/data-qm="testimonial/.test(html)) types.push('testimonials');
  if (/data-qm="dish|menu/.test(html)) types.push('menu');
  if (/data-qm="pricing/.test(html)) types.push('pricing');
  if (/data-qm="feature/.test(html)) types.push('features');
  if (/data-qm="team/.test(html)) types.push('team');
  if (/data-qm="gallery/.test(html)) types.push('gallery');
  if (/data-qm="stat/.test(html)) types.push('stats');
  return types;
}

function isDarkColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
