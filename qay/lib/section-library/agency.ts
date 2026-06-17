import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'agency-theme-brutal-editorial',
    site_type: 'agency',
    theme_id: 'brutal-editorial',
    label: 'Brutal Editorial',
    keywords: ['agency', 'studio', 'branding', 'creative', 'bold', 'editorial', 'strategy', 'design'],
    css_variables: {
      '--qm-bg': '#f3f1e8',
      '--qm-surface': '#ffffff',
      '--qm-text': '#0c0c0c',
      '--qm-text-muted': '#655e51',
      '--qm-accent': '#ff4c2c',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(12,12,12,0.12)',
      '--qm-heading-font': '"Archivo", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Archivo:wght@500;600;700;800;900', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  {
    id: 'agency-nav-luxe',
    site_type: 'agency',
    section_type: 'nav',
    theme_id: 'brutal-editorial',
    keywords: ['nav', 'agency', 'studio', 'menu', 'cta', 'header'],
    preview_description: 'Brutalist agency navigation header with quick links and call brief trigger.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-black uppercase tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Northline Studio</a>
    <div class="hidden items-center gap-8 text-xs font-bold uppercase tracking-wider md:flex">
      <a href="/work" class="hover:text-[var(--qm-accent)] transition">Work</a>
      <a href="/services" class="hover:text-[var(--qm-accent)] transition">Services</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">Team</a>
      <a href="/contact" class="rounded-xl bg-[var(--qm-accent)] px-5 py-3 text-xs font-bold text-[var(--qm-accent-text)] shadow-md hover:scale-105 active:scale-98 transition duration-200">Start brief</a>
    </div>
    <button type="button" class="rounded-xl border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#agency-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="agency-mobile-menu" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/work" class="text-sm font-bold uppercase tracking-wider">Work</a>
    <a href="/services" class="text-sm font-bold uppercase tracking-wider">Services</a>
    <a href="/about" class="text-sm font-bold uppercase tracking-wider">Team</a>
    <a href="/contact" class="rounded-xl bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--qm-accent-text)]">Start brief</a>
  </div>
</nav>`,
  },
  {
    id: 'agency-hero-luxe',
    site_type: 'agency',
    section_type: 'hero',
    theme_id: 'brutal-editorial',
    keywords: ['hero', 'case-study', 'bento', 'branding', 'creative', 'luxe-reveal'],
    preview_description: 'High-contrast agency hero featuring bento portfolio tiles and asymmetric entrance reveals.',
    rank: 98,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 lg:py-28 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div class="space-y-6" data-qay-animate="luxe-reveal" data-qay-duration="1.15">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">
        <span class="size-1.5 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
        CREATIVE DIRECTION & BRAND STRATEGY
      </div>
      <h1 class="text-6xl font-black leading-[0.85] tracking-tight md:text-8xl lg:text-9xl uppercase" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        WE MAKE BRANDS<br/>STAND TALL.
      </h1>
      <p class="max-w-lg text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)]" data-qm="hero-subtitle">
        We collaborate with forward-looking founders to turn raw ideas, business goals, and visual assets into structured identities that command market attention.
      </p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/contact" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] shadow-xl hover:scale-105 active:scale-98 transition duration-200">Start a brief</a>
        <a href="/work" class="rounded-xl border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">Our portfolio</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] col-span-2 aspect-[16/10]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&auto=format&q=85" alt="Creative studio board design" class="h-full w-full object-cover" />
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-1" data-qay-hover="scale">
        <p class="text-4xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">42%</p>
        <p class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Average conversion lift</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-1" data-qay-hover="scale">
        <p class="text-4xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">18</p>
        <p class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Brands shipped this year</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'agency-features-bento',
    site_type: 'agency',
    section_type: 'features',
    theme_id: 'brutal-editorial',
    keywords: ['services', 'strategy', 'bento', 'branding', 'web-design'],
    preview_description: 'Bento-style service matrix mapping brand strategy, code, and campaign systems.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="max-w-3xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Services Matrix</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">WHAT WE CONSTRUCT</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Card 1 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">01 / STRATEGY</span>
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Brand Identity</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Positioning, guidelines, assets, naming, and visual systems built for launches.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</span>
      </article>

      <!-- Card 2 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">02 / INTERACTION</span>
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Web Experiences</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Headless storefronts, conversion paths, and landing portals with rich motion.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</span>
      </article>

      <!-- Card 3 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">03 / LAUNCH</span>
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Campaign Systems</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Launch assets, high-conversion templates, and visual campaigns that hit targets.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</span>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'agency-about-luxe',
    site_type: 'agency',
    section_type: 'about',
    theme_id: 'brutal-editorial',
    keywords: ['about', 'strategy', 'process', 'creative', 'agency'],
    preview_description: 'Process-led about section with clear metric points and thin borders.',
    rank: 86,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
    <div class="space-y-4" data-qay-animate="slide-right">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Methodology</p>
      <h2 class="text-4xl md:text-5xl font-bold uppercase leading-[0.95]" style="font-family:var(--qm-heading-font)">
        STRATEGY FIRST.<br/>DESIGN WITH TEETH.
      </h2>
    </div>
    <div class="space-y-6" data-qay-animate="slide-up">
      <p class="text-sm md:text-base text-[var(--qm-text-muted)] leading-relaxed" data-qm="about-copy">
        We start with the buyers, the competitors, and the value proposition. Once the messaging architecture is locked, we construct the visual systems and web layouts around what visitors need to believe before they act.
      </p>
      <div class="grid gap-3 sm:grid-cols-3 pt-4">
        <span class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-text)] flex flex-col justify-between h-20"><span>01 Audit</span></span>
        <span class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-text)] flex flex-col justify-between h-20"><span>02 System</span></span>
        <span class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-text)] flex flex-col justify-between h-20"><span>03 Launch</span></span>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'agency-team-bento',
    site_type: 'agency',
    section_type: 'team',
    theme_id: 'brutal-editorial',
    keywords: ['team', 'bento', 'members', 'grid', 'portraits'],
    preview_description: 'Bento-style team grid with detailed headshots, titles, and hover transitions.',
    rank: 80,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-t border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">The Core Team</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">PEOPLE BEHIND THE IDEAS</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Member 1 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="scale">
        <div class="overflow-hidden aspect-square relative" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&q=85" alt="Ada Miles portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Ada Miles</h3>
          <p class="text-xs text-[var(--qm-text-muted)] mt-1">Creative Director & Co-Founder</p>
        </div>
      </article>

      <!-- Member 2 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="scale">
        <div class="overflow-hidden aspect-square relative" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&q=85" alt="Jon Bell portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Jon Bell</h3>
          <p class="text-xs text-[var(--qm-text-muted)] mt-1">Lead Brand Strategist</p>
        </div>
      </article>

      <!-- Member 3 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="scale">
        <div class="overflow-hidden aspect-square relative" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&q=85" alt="Mira Cole portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Mira Cole</h3>
          <p class="text-xs text-[var(--qm-text-muted)] mt-1">Lead Digital Architect</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'agency-gallery-bento',
    site_type: 'agency',
    section_type: 'gallery',
    theme_id: 'brutal-editorial',
    keywords: ['gallery', 'bento', 'projects', 'agency-work'],
    preview_description: 'Bento-style gallery showcasing selected case study assets.',
    rank: 96,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Releases</p>
        <h2 class="mt-4 text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">SELECTED BRAND WORK</h2>
      </div>
      <a href="/work" class="rounded-full border border-[var(--qm-border)] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">View Catalog</a>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Project 1 (Large span) -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] md:col-span-2 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="overflow-hidden relative group" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&auto=format&q=85" alt="Visual identity case study" class="h-80 w-full object-cover" />
        </div>
        <div class="p-6 space-y-2">
          <span class="text-[9px] font-black uppercase tracking-widest text-[var(--qm-accent)]">Branding / Identity</span>
          <h3 class="text-2xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Northline Workspace</h3>
          <p class="text-xs text-[var(--qm-text-muted)]">Complete brand transformation, launch campaign, and custom web architecture.</p>
        </div>
      </article>

      <!-- Project 2 -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="overflow-hidden relative group" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&q=85" alt="Photography details" class="h-80 w-full object-cover" />
        </div>
        <div class="p-6 space-y-2">
          <span class="text-[9px] font-black uppercase tracking-widest text-[var(--qm-accent)]">Campaign / Direction</span>
          <h3 class="text-2xl font-bold uppercase" style="font-family:var(--qm-heading-font)">Capsule Shoot</h3>
          <p class="text-xs text-[var(--qm-text-muted)]">Concept photoshoot direction and streetwear marketing materials.</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'agency-testimonials',
    site_type: 'agency',
    section_type: 'testimonials',
    theme_id: 'brutal-editorial',
    keywords: ['testimonial', 'reviews', 'client', 'proof'],
    preview_description: 'Sleek testimonial layout with customer details.',
    rank: 80,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-5xl text-center space-y-6" data-qay-animate="slide-up">
    <blockquote class="text-3xl md:text-5xl font-black uppercase leading-tight tracking-tight" style="font-family:var(--qm-heading-font)">
      "They translated our complicated product logic into a brand that resonated immediately."
    </blockquote>
    <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Founder &bull; Series A SaaS Client</p>
  </div>
</section>`,
  },
  {
    id: 'agency-stats-luxe',
    site_type: 'agency',
    section_type: 'stats',
    theme_id: 'brutal-editorial',
    keywords: ['stats', 'metrics', 'bento', 'proof'],
    preview_description: 'Stats metrics grid showcasing conversion lift, brands shipped, years active, and awards.',
    rank: 82,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">+42%</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Conversion Lift</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Average brand launch performance metrics improvement.</p>
    </div>
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">18+</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Brands Shipped</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Custom identities, guidelines, and websites built this year.</p>
    </div>
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">10y</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Active Operations</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Working with founders globally across Lagos, London, and SF.</p>
    </div>
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">9</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Design Awards</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Audited and recognized by top web builder collectives.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'agency-cta',
    site_type: 'agency',
    section_type: 'cta',
    theme_id: 'brutal-editorial',
    keywords: ['cta', 'strategy', 'brief', 'call'],
    preview_description: 'Bold call-to-action banner with high-impact layout and uppercase typography.',
    rank: 82,
    html: `<section class="bg-[var(--qm-accent)] px-6 py-24 text-center text-[var(--qm-accent-text)] relative overflow-hidden">
  <div class="relative z-10 mx-auto max-w-4xl space-y-6" data-qay-animate="luxe-reveal" data-qay-duration="1.1">
    <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none" style="font-family:var(--qm-heading-font)">BRING THE UGLY BRIEF.<br/>WE WILL SHARPEN IT.</h2>
    <p class="mx-auto max-w-xl text-sm opacity-85 leading-relaxed">
      A short note or contract brief is enough to start. We will schedule a strategy call to map your audience, competitors, and core messaging hooks.
    </p>
    <a href="/contact" class="mt-8 inline-flex rounded-xl bg-[var(--qm-text)] px-8 py-4 text-xs font-black uppercase text-[var(--qm-bg)] shadow-xl hover:scale-105 active:scale-98 transition duration-200">Book Strategy Call &rarr;</a>
  </div>
</section>`,
  },
  {
    id: 'agency-footer',
    site_type: 'agency',
    section_type: 'footer',
    theme_id: 'brutal-editorial',
    keywords: ['footer', 'agency', 'links'],
    preview_description: 'Multi-column agency footer with quick links and copyright notices.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
    <div class="space-y-4">
      <p class="text-2xl font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Northline Studio</p>
      <p class="max-w-sm text-xs leading-relaxed">Brutalist branding and custom digital web experiences for startup founders and scaling businesses.</p>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">NAVIGATE</h4>
      <div class="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider">
        <a href="/work" class="hover:text-[var(--qm-text)] transition">Work</a>
        <a href="/services" class="hover:text-[var(--qm-text)] transition">Services</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition">Contact</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">LEGAL</h4>
      <div class="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider">
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Terms of Service</a>
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Privacy Protocol</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wider">
    <p>&copy; 2026 NORTHLINE STUDIO. ALL RIGHTS RESERVED.</p>
    <p>ESTABLISHED 2016 &bull; LAGOS &bull; LONDON</p>
  </div>
</footer>`,
  },
];
