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
  {
    id: 'builtin-qay-command-nav',
    submitted_by: null,
    category: 'navigation',
    name: 'Command Menu Navigation',
    description: 'A responsive premium nav with a working QAY hamburger menu hook.',
    html: '<nav class="relative z-40 border-b border-white/10 bg-[#090909] px-5 py-4 text-white"><div class="mx-auto flex max-w-6xl items-center justify-between gap-4"><a href="/" class="text-sm font-black uppercase tracking-[0.24em] text-white">QAY Studio</a><div class="hidden items-center gap-7 text-sm text-white/70 md:flex"><a href="/work" class="transition hover:text-white">Work</a><a href="/services" class="transition hover:text-white">Services</a><a href="/pricing" class="transition hover:text-white">Pricing</a><a href="/contact" class="rounded-full bg-white px-4 py-2 font-semibold text-black">Start</a></div><button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-bold uppercase tracking-[0.18em] text-white md:hidden" data-qay-click="toggle" data-qay-target="#qay-built-nav-menu" data-qay-class="hidden" aria-controls="qay-built-nav-menu" aria-expanded="false">Menu</button></div><div id="qay-built-nav-menu" class="hidden mx-auto mt-4 max-w-6xl rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white backdrop-blur md:hidden"><div class="grid gap-3"><a href="/work" class="rounded-xl px-3 py-2 hover:bg-white/10">Work</a><a href="/services" class="rounded-xl px-3 py-2 hover:bg-white/10">Services</a><a href="/pricing" class="rounded-xl px-3 py-2 hover:bg-white/10">Pricing</a><a href="/contact" class="rounded-xl bg-white px-3 py-2 font-semibold text-black">Start project</a></div></div></nav>',
    preview_image_url: null,
    tags: ['navigation', 'menu', 'responsive', 'dark'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 88,
  },
  {
    id: 'builtin-qay-working-accordion',
    submitted_by: null,
    category: 'accordion',
    name: 'Working FAQ Accordion',
    description: 'A clean FAQ block using QAY toggle hooks, no JavaScript.',
    html: '<section class="bg-[#f7f4ef] px-6 py-20 text-[#16120d]"><div class="mx-auto max-w-3xl"><p class="text-xs font-bold uppercase tracking-[0.24em] text-[#9b6f2c]">Questions</p><h2 class="mt-4 text-4xl font-semibold tracking-tight md:text-6xl" data-qay-animate="slide-up">Clear answers before they ask.</h2><div class="mt-10 space-y-3"><article class="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"><button type="button" class="flex w-full items-center justify-between gap-4 text-left text-lg font-semibold" data-qay-click="toggle" data-qay-target="#qay-faq-1" data-qay-class="hidden" aria-controls="qay-faq-1" aria-expanded="false"><span>Can I customize this section?</span><span class="text-2xl">+</span></button><div id="qay-faq-1" class="hidden pt-4 text-sm leading-6 text-black/60">Yes. The text, spacing, colors, and every visible layer stay editable after import.</div></article><article class="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"><button type="button" class="flex w-full items-center justify-between gap-4 text-left text-lg font-semibold" data-qay-click="toggle" data-qay-target="#qay-faq-2" data-qay-class="hidden" aria-controls="qay-faq-2" aria-expanded="false"><span>Does it work on mobile?</span><span class="text-2xl">+</span></button><div id="qay-faq-2" class="hidden pt-4 text-sm leading-6 text-black/60">The layout is responsive and the interaction uses QAY state hooks instead of fragile inline scripts.</div></article><article class="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"><button type="button" class="flex w-full items-center justify-between gap-4 text-left text-lg font-semibold" data-qay-click="toggle" data-qay-target="#qay-faq-3" data-qay-class="hidden" aria-controls="qay-faq-3" aria-expanded="false"><span>Can AI reuse this?</span><span class="text-2xl">+</span></button><div id="qay-faq-3" class="hidden pt-4 text-sm leading-6 text-black/60">Yes. It can be inserted as a reusable accordion block for service, SaaS, ecommerce, and help pages.</div></article></div></div></section>',
    preview_image_url: null,
    tags: ['accordion', 'faq', 'working', 'toggle'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 86,
  },
  {
    id: 'builtin-qay-live-aurora-background',
    submitted_by: null,
    category: 'backgrounds',
    name: 'Live Aurora Background',
    description: 'A moving CSS aurora background for premium hero or CTA sections.',
    html: '<section class="relative min-h-[520px] overflow-hidden bg-[#080a14] px-6 py-24 text-white"><style>@keyframes qayAuroraMove{0%{transform:translate3d(-8%,4%,0) scale(1)}50%{transform:translate3d(10%,-6%,0) scale(1.12)}100%{transform:translate3d(-8%,4%,0) scale(1)}}.qay-aurora-live{animation:qayAuroraMove 12s ease-in-out infinite alternate}</style><div class="qay-aurora-live absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/35 blur-3xl"></div><div class="qay-aurora-live absolute right-0 top-16 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl"></div><div class="qay-aurora-live absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl"></div><div class="relative mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal"><p class="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200/80">Live background</p><h2 class="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">Motion that feels expensive, without scripts.</h2><p class="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/65">Drop this behind a launch hero, pricing CTA, waitlist, or campaign page.</p></div></section>',
    preview_image_url: null,
    tags: ['background', 'animated', 'aurora', 'dark'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 84,
  },
  {
    id: 'builtin-qay-scroll-gallery',
    submitted_by: null,
    category: 'carousel',
    name: 'Scroll Snap Gallery Rail',
    description: 'A touch-friendly horizontal gallery for products, work, venues, or events.',
    html: '<section class="bg-white px-6 py-20 text-black"><div class="mx-auto max-w-6xl"><div class="flex flex-col justify-between gap-5 md:flex-row md:items-end" data-qay-animate="slide-up"><div><p class="text-xs font-bold uppercase tracking-[0.24em] text-black/40">Gallery</p><h2 class="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">A rail built for swiping.</h2></div><a href="#gallery" class="inline-flex rounded-full border border-black/15 px-5 py-3 text-sm font-semibold">View all</a></div><div class="mt-10 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><article class="min-w-[280px] snap-start overflow-hidden rounded-3xl bg-black text-white" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&q=85" alt="Editorial display" class="h-80 w-full object-cover" /><div class="p-5"><h3 class="font-semibold">Editorial display</h3><p class="mt-2 text-sm text-white/60">Use for collections, case studies, or rooms.</p></div></article><article class="min-w-[280px] snap-start overflow-hidden rounded-3xl bg-[#f2efe8]" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&q=85" alt="Atmospheric interior" class="h-80 w-full object-cover" /><div class="p-5"><h3 class="font-semibold">Atmospheric interior</h3><p class="mt-2 text-sm text-black/60">Great for hospitality and lifestyle pages.</p></div></article><article class="min-w-[280px] snap-start overflow-hidden rounded-3xl bg-[#eaf2ff]" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&auto=format&q=85" alt="Modern architecture" class="h-80 w-full object-cover" /><div class="p-5"><h3 class="font-semibold">Modern architecture</h3><p class="mt-2 text-sm text-black/60">A polished visual card with mobile swipe.</p></div></article></div></div></section>',
    preview_image_url: null,
    tags: ['carousel', 'gallery', 'snap', 'images'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 82,
  },
  {
    id: 'builtin-qay-lead-form',
    submitted_by: null,
    category: 'forms',
    name: 'Premium Lead Form',
    description: 'A polished contact and lead capture form for service pages.',
    html: '<section class="bg-[#101010] px-6 py-20 text-white"><div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.24em] text-white/40">Contact</p><h2 class="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Start the conversation with context.</h2><p class="mt-5 max-w-md text-sm leading-6 text-white/60">Use this form for agencies, consultants, studios, clinics, or any lead-driven business.</p></div><form class="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur" data-qay-animate="scale-in"><div class="grid gap-4 md:grid-cols-2"><label class="grid gap-2 text-sm text-white/70">Name<input name="name" class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Your name" /></label><label class="grid gap-2 text-sm text-white/70">Email<input name="email" type="email" class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="you@example.com" /></label></div><label class="mt-4 grid gap-2 text-sm text-white/70">Project brief<textarea name="message" rows="5" class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Tell us what you want to build"></textarea></label><button type="submit" class="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-black" data-qay-hover="scale-btn">Send request</button></form></div></section>',
    preview_image_url: null,
    tags: ['form', 'lead', 'contact', 'dark'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 80,
  },
  {
    id: 'builtin-qay-pricing-switch',
    submitted_by: null,
    category: 'pricing',
    name: 'Conversion Pricing Cards',
    description: 'A two-tier pricing section with strong visual hierarchy.',
    html: '<section class="bg-[#f8f7f3] px-6 py-20 text-black"><div class="mx-auto max-w-6xl"><div class="mx-auto max-w-2xl text-center" data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.24em] text-black/40">Pricing</p><h2 class="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Simple plans with room to grow.</h2></div><div class="mt-10 grid gap-4 md:grid-cols-2"><article class="rounded-3xl border border-black/10 bg-white p-6 shadow-sm" data-qay-hover="lift"><p class="text-sm font-semibold text-black/50">Starter</p><div class="mt-4 flex items-end gap-2"><span class="text-5xl font-semibold">$15</span><span class="pb-2 text-sm text-black/50">/mo</span></div><ul class="mt-6 space-y-3 text-sm text-black/65"><li>10 published sites</li><li>AI site generation</li><li>Template gallery access</li><li>Community components</li></ul><a href="/pricing" class="mt-6 inline-flex w-full justify-center rounded-2xl border border-black/15 px-5 py-3 font-semibold">Choose Starter</a></article><article class="rounded-3xl bg-black p-6 text-white shadow-2xl" data-qay-hover="luxe-lift"><p class="text-sm font-semibold text-white/50">Pro</p><div class="mt-4 flex items-end gap-2"><span class="text-5xl font-semibold">$25</span><span class="pb-2 text-sm text-white/50">/mo</span></div><ul class="mt-6 space-y-3 text-sm text-white/65"><li>20 published sites</li><li>Priority AI generations</li><li>Advanced sections</li><li>Export and publish tools</li></ul><a href="/pricing" class="mt-6 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-black">Choose Pro</a></article></div></div></section>',
    preview_image_url: null,
    tags: ['pricing', 'plans', 'conversion', 'light'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 78,
  },
  {
    id: 'builtin-qay-footer-mega',
    submitted_by: null,
    category: 'footer',
    name: 'Mega Footer',
    description: 'A structured footer with brand, links, newsletter, and social placeholders.',
    html: '<footer class="bg-[#070707] px-6 py-16 text-white"><div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"><div><a href="/" class="text-lg font-black uppercase tracking-[0.24em]">QAY</a><p class="mt-5 max-w-sm text-sm leading-6 text-white/55">A polished footer for modern websites with room for brand story, legal links, and conversion.</p></div><div><h3 class="text-sm font-semibold">Company</h3><div class="mt-4 grid gap-3 text-sm text-white/55"><a href="/about">About</a><a href="/work">Work</a><a href="/contact">Contact</a></div></div><div><h3 class="text-sm font-semibold">Resources</h3><div class="mt-4 grid gap-3 text-sm text-white/55"><a href="/blog">Blog</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div><form><h3 class="text-sm font-semibold">Updates</h3><div class="mt-4 flex overflow-hidden rounded-full border border-white/10 bg-white/5"><input name="email" type="email" class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none" placeholder="Email address" /><button type="submit" class="bg-white px-4 text-sm font-semibold text-black">Join</button></div></form></div><div class="mx-auto mt-10 flex max-w-6xl items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40"><span>Copyright 2026 QAY</span><span>Built for fast launches</span></div></footer>',
    preview_image_url: null,
    tags: ['footer', 'newsletter', 'dark', 'links'],
    is_public: true,
    is_builtin: true,
    is_approved: true,
    uses_count: 0,
    rank: 76,
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

    const databaseRows = Array.isArray(data) ? data : [];
    const fallbackIds = new Set(FALLBACK_COMPONENTS.map((component) => component.id));
    const rows = [
      ...FALLBACK_COMPONENTS,
      ...databaseRows.filter((component) => !fallbackIds.has(component.id)),
    ]
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
