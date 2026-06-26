import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORIES = new Set([
  'navigation',
  'hero',
  'cards',
  'accordion',
  'carousel',
  'buttons',
  'forms',
  'testimonials',
  'pricing',
  'gallery',
  'icons',
  'stats',
  'timeline',
  'team',
  'footer',
  'cta',
  'parallax',
  'backgrounds',
  'misc',
]);

const FALLBACK_COMPONENTS = [
  {
    id: 'builtin-qay-glass-hero',
    submitted_by: null,
    category: 'hero',
    name: 'Glass Editorial Hero',
    description: 'A premium hero block with image, CTA, and soft glass surface.',
    html: '<section class="relative overflow-hidden bg-[#070707] px-6 py-24 text-white" data-qay-animate="fade-in"><div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"><div class="space-y-6" data-qay-animate="slide-up" data-qay-duration="0.8"><p class="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Featured launch</p><h1 class="max-w-3xl text-5xl font-semibold leading-none md:text-7xl">Build a brand moment that feels alive.</h1><p class="max-w-xl text-base leading-7 text-white/65">A polished section for premium landing pages, product launches, and editorial websites.</p><a href="#start" class="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black" data-qay-hover="scale-btn">Start building</a></div><div class="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl" data-qay-hover="luxe-lift"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&q=85" alt="Premium workspace" class="h-[460px] w-full rounded-2xl object-cover" /></div></div></section>',
    preview_image_url: null,
    tags: ['dark', 'hero', 'animated', 'premium'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 100,
  },
  {
    id: 'builtin-qay-bento-cards',
    submitted_by: null,
    category: 'cards',
    name: 'Animated Bento Cards',
    description: 'A responsive bento grid for features, services, or product proof.',
    html: '<section class="bg-white px-6 py-20 text-black"><div class="mx-auto max-w-6xl"><div class="mb-10 max-w-2xl" data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">System highlights</p><h2 class="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Organized, sharp, and easy to scan.</h2></div><div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children"><article class="rounded-2xl border border-black/10 bg-black p-6 text-white md:col-span-2" data-qay-hover="lift"><h3 class="text-2xl font-semibold">Command center</h3><p class="mt-4 text-sm leading-6 text-white/65">Use this card for the biggest product or service promise.</p></article><article class="rounded-2xl border border-black/10 bg-[#f4f4f1] p-6" data-qay-hover="lift"><h3 class="font-semibold">Fast setup</h3><p class="mt-3 text-sm text-black/60">Clean supporting detail with a compact rhythm.</p></article><article class="rounded-2xl border border-black/10 bg-[#eef4ff] p-6" data-qay-hover="lift"><h3 class="font-semibold">Live previews</h3><p class="mt-3 text-sm text-black/60">Ideal for product cards, metrics, and benefit blocks.</p></article><article class="rounded-2xl border border-black/10 bg-[#f7efe4] p-6 md:col-span-2" data-qay-hover="lift"><h3 class="font-semibold">Built for conversion</h3><p class="mt-3 text-sm text-black/60">A wide card for proof, testimonials, or workflow summaries.</p></article></div></div></section>',
    preview_image_url: null,
    tags: ['light', 'cards', 'bento', 'animated'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 90,
  },
];

function cleanString(value: unknown, max = 120) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function cleanCategory(value: unknown) {
  const category = cleanString(value, 48).toLowerCase();
  return CATEGORIES.has(category) ? category : 'misc';
}

function cleanTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanString(item, 32).toLowerCase()).filter(Boolean).slice(0, 12);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => cleanString(item, 32).toLowerCase()).filter(Boolean).slice(0, 12);
  }
  return [];
}

function validateHtml(html: string) {
  if (html.length < 20) return 'HTML is too short.';
  if (html.length > 50000) return 'HTML is too large.';
  if (/<script\b/i.test(html)) return 'Script tags are not allowed.';
  if (/\son[a-z]+\s*=/i.test(html)) return 'Inline event handlers are not allowed.';
  if (!/\bclass\s*=/i.test(html)) return 'Add Tailwind classes before submitting.';
  return null;
}

function scoreComponent(html: string) {
  let score = 45;
  if (/\bdata-qay-animate=/.test(html)) score += 15;
  if (/\bdata-qay-hover=/.test(html)) score += 10;
  if (/<(section|article|nav|footer|form)\b/i.test(html)) score += 10;
  if (/\b(sm|md|lg|xl):/.test(html)) score += 10;
  if (/<img\b/i.test(html)) score += 5;
  if (/\brounded-|shadow-|border\b/.test(html)) score += 5;
  return Math.min(score, 100);
}

export async function GET(request: Request) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const url = new URL(request.url);
    const category = cleanCategory(url.searchParams.get('category') || 'misc');
    const search = cleanString(url.searchParams.get('search'), 80).toLowerCase();
    const supabase = getQayAdmin() as any;

    const { data, error } = await supabase
      .from('qay_components')
      .select('id, submitted_by, category, name, description, html, preview_image_url, tags, is_public, is_builtin, is_approved, uses_count, rank, created_at')
      .or(`and(is_approved.eq.true,is_public.eq.true),submitted_by.eq.${user.id}`)
      .order('rank', { ascending: false })
      .limit(120);

    if (error) {
      console.warn('[QAY components] Falling back to built-ins:', error.message || error);
    }

    const rows = (Array.isArray(data) && data.length > 0 ? data : FALLBACK_COMPONENTS)
      .filter((component) => !category || category === 'misc' || component.category === category)
      .filter((component) => {
        if (!search) return true;
        const haystack = `${component.name} ${component.description || ''} ${(component.tags || []).join(' ')}`.toLowerCase();
        return haystack.includes(search);
      });

    return NextResponse.json({
      data: {
        categories: Array.from(CATEGORIES),
        components: rows,
      },
    });
  } catch (error) {
    console.error('[QAY components GET] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load components' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const html = typeof body?.html === 'string' ? body.html.trim() : '';
    const validationError = validateHtml(html);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const score = scoreComponent(html);
    const supabase = getQayAdmin() as any;
    const { data, error } = await supabase
      .from('qay_components')
      .insert({
        submitted_by: user.id,
        category: cleanCategory(body?.category),
        name: cleanString(body?.name, 120) || 'Untitled component',
        description: cleanString(body?.description, 500),
        html,
        preview_image_url: cleanString(body?.previewImageUrl, 1000) || null,
        tags: cleanTags(body?.tags),
        is_public: body?.isPublic !== false,
        is_builtin: false,
        is_approved: score >= 75,
        uses_count: 0,
        rank: score,
      })
      .select('id, category, name, is_approved, rank')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[QAY components POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit component' },
      { status: 500 }
    );
  }
}
