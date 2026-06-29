import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'portfolio-theme-gallery-mono',
    site_type: 'portfolio',
    theme_id: 'gallery-mono',
    label: 'Gallery Mono',
    keywords: ['portfolio', 'designer', 'developer', 'photographer', 'artist', 'minimal', 'gallery', 'case studies'],
    css_variables: {
      '--qm-bg': '#0a0a0a',
      '--qm-surface': '#121212',
      '--qm-text': '#f4f4f0',
      '--qm-text-muted': '#a1a1aa',
      '--qm-accent': '#d8ff4f',
      '--qm-accent-text': '#0a0a0a',
      '--qm-border': 'rgba(255,255,255,0.1)',
      '--qm-heading-font': '"Space Grotesk", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Space+Grotesk:wght@500;600;700', 'Inter:wght@400;500;600;700'],
    is_dark: true,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  {
    id: 'portfolio-nav-luxe',
    site_type: 'portfolio',
    section_type: 'nav',
    theme_id: 'gallery-mono',
    keywords: ['nav', 'portfolio', 'minimal', 'work', 'header'],
    preview_description: 'Sleek minimal portfolio nav with floating appearance and mobile toggle.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-bold tracking-tight hover:opacity-80 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Mira Okafor</a>
    <div class="hidden gap-8 text-xs font-semibold uppercase tracking-wider md:flex">
      <a href="/work" class="hover:text-[var(--qm-accent)] transition" data-qm="portfolio-nav-luxe-a-1">Work</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition" data-qm="portfolio-nav-luxe-a-2">About</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition" data-qm="portfolio-nav-luxe-a-3">Contact</a>
    </div>
    <button type="button" class="border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#portfolio-mobile-menu" data-qay-class="hidden" data-qm="portfolio-nav-luxe-button-1">Menu</button>
  </div>
  <div id="portfolio-mobile-menu" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/work" class="text-sm font-semibold uppercase tracking-wider" data-qm="portfolio-nav-luxe-a-4">Work</a>
    <a href="/about" class="text-sm font-semibold uppercase tracking-wider" data-qm="portfolio-nav-luxe-a-5">About</a>
    <a href="/contact" class="text-sm font-semibold uppercase tracking-wider" data-qm="portfolio-nav-luxe-a-6">Contact</a>
  </div>
</nav>`,
  },
  {
    id: 'portfolio-hero-luxe',
    site_type: 'portfolio',
    section_type: 'hero',
    theme_id: 'gallery-mono',
    keywords: ['hero', 'portfolio', 'designer', 'bento', 'cinematic', 'asymmetric'],
    preview_description: 'Large nameplate hero with asymmetric bento image grid and custom entrance reveals.',
    rank: 98,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 md:py-24 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
    <div data-qay-animate="luxe-reveal" data-qay-duration="1.15" class="space-y-6">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="hero-eyebrow">
        <span class="size-1.5 rounded-full bg-[var(--qm-accent)] animate-ping"></span>
        Available for selective projects
      </div>
      <h1 class="text-5xl font-bold leading-[0.88] tracking-tight md:text-7xl lg:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        Interfaces with purpose. Stories with a pulse.
      </h1>
      <p class="max-w-lg text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)]" data-qm="hero-subtitle">
        I shape custom visual systems and interactive applications for early-stage fintech, commerce, and digital publishing. Focused on utility, execution, and movement.
      </p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/work" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] shadow-xl hover:scale-105 transition duration-200" data-qm="hero-cta-primary">See case studies</a>
        <a href="/contact" class="rounded-xl border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200" data-qm="hero-cta-secondary">Start Conversation</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="space-y-4">
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&auto=format&q=85" alt="Creative studio work" class="h-full w-full object-cover" data-qm="hero-image" />
        </div>
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 aspect-square flex flex-col justify-between" data-qay-hover="scale">
          <h3 class="text-3xl font-bold uppercase leading-[0.9]" style="font-family:var(--qm-heading-font)">Aesthetic &<br/>Performance</h3>
          <span class="text-[9px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="portfolio-hero-luxe-span-1">Webflow & Framer Certified</span>
        </div>
      </div>
      <div class="space-y-4 pt-8">
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-accent)] text-[var(--qm-accent-text)] p-6 aspect-square flex flex-col justify-between" data-qay-hover="scale">
          <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
          <span class="text-xs font-bold uppercase tracking-wider" data-qm="portfolio-hero-luxe-span-2">Frontend engineering</span>
        </div>
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&q=85" alt="Studio workspace" class="h-full w-full object-cover" data-qm="portfolio-hero-luxe-image-2" />
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'portfolio-skills-bento',
    site_type: 'portfolio',
    section_type: 'features',
    theme_id: 'gallery-mono',
    keywords: ['skills', 'services', 'craft', 'bento', 'design'],
    preview_description: 'Bento-style grid displaying creative skills, tools, and technical competencies.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="max-w-3xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="section-eyebrow">Core capabilities</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="section-title">Visual Craft & Systems</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Card 1 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="portfolio-skills-bento-span-1">01 / BRAND</span>
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-skills-bento-h3-1">Identity & Art</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="portfolio-skills-bento-p-2">Logo marks, tailored typography, palettes, and brand guidelines for launches.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="portfolio-skills-bento-span-2">Read case &rarr;</span>
      </article>

      <!-- Card 2 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="portfolio-skills-bento-span-3">02 / PRODUCT</span>
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-skills-bento-h3-2">UI/UX Systems</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="portfolio-skills-bento-p-3">Interactive mockups, design libraries, and user flows engineered for conversion.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="portfolio-skills-bento-span-4">Read case &rarr;</span>
      </article>

      <!-- Card 3 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="portfolio-skills-bento-span-5">03 / WEBFLOW</span>
          <h3 class="text-xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-skills-bento-h3-3">Creative Dev</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="portfolio-skills-bento-p-4">Semantic layout, interactive animations, and responsive site deployments.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="portfolio-skills-bento-span-6">Read case &rarr;</span>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'portfolio-about-luxe',
    site_type: 'portfolio',
    section_type: 'about',
    theme_id: 'gallery-mono',
    keywords: ['about', 'bio', 'process', 'creative'],
    preview_description: 'Creative process story with offset layouts and large typographic headings.',
    rank: 86,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-6xl grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
    <div class="space-y-4" data-qay-animate="slide-right">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="about-eyebrow">Creative Philosophy</p>
      <h2 class="text-4xl md:text-5xl font-bold uppercase leading-[0.95]" style="font-family:var(--qm-heading-font)" data-qm="about-title">
        WE FIND FORM IN THE MESSY MIDDLE.
      </h2>
    </div>
    <div class="space-y-6 text-sm md:text-base text-[var(--qm-text-muted)] leading-relaxed" data-qay-animate="slide-up">
      <p data-qm="about-text">The most interesting solutions are rarely the first ones we find. I specialize in taking raw concepts, complicated product logic, and loose brand ideas and assembling them into structured sites people actually enjoy navigating.</p>
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="portfolio-about-luxe-p-2">Discovery &bull; Figma Drafting &bull; Staging &bull; Live Launch</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'portfolio-gallery-bento',
    site_type: 'portfolio',
    section_type: 'gallery',
    theme_id: 'gallery-mono',
    keywords: ['gallery', 'bento', 'projects', 'featured', 'case-studies'],
    preview_description: 'Bento-style project showcase featuring large layout sizes and hover zooms.',
    rank: 96,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="gallery-eyebrow">Selected Work</p>
        <h2 class="mt-4 text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">FEATURED RELEASES</h2>
      </div>
      <a href="/work" class="rounded-full border border-[var(--qm-border)] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-bg)] transition duration-200" data-qm="portfolio-gallery-bento-a-1">View All Work</a>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Project 1 (Large span) -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] md:col-span-2 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="overflow-hidden relative group" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&q=85" alt="Ledger North dashboard case study" class="h-80 w-full object-cover" data-qm="portfolio-gallery-bento-image-1" />
        </div>
        <div class="p-6 space-y-2">
          <span class="text-[9px] font-black uppercase tracking-widest text-[var(--qm-accent)]" data-qm="portfolio-gallery-bento-span-1">Product UI / FinTech</span>
          <h3 class="text-2xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-gallery-bento-h3-1">Ledger North Workspace</h3>
          <p class="text-xs text-[var(--qm-text-muted)]" data-qm="portfolio-gallery-bento-p-2">Fintech command center and onboarding workflows for scaling teams.</p>
        </div>
      </article>

      <!-- Project 2 -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="overflow-hidden relative group" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=900&auto=format&q=85" alt="Plain Goods brand design" class="h-80 w-full object-cover" data-qm="portfolio-gallery-bento-image-2" />
        </div>
        <div class="p-6 space-y-2">
          <span class="text-[9px] font-black uppercase tracking-widest text-[var(--qm-accent)]" data-qm="portfolio-gallery-bento-span-2">Identity / E-commerce</span>
          <h3 class="text-2xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-gallery-bento-h3-2">Plain Goods Shop</h3>
          <p class="text-xs text-[var(--qm-text-muted)]" data-qm="portfolio-gallery-bento-p-3">Concept store brand system and responsive storefront layout.</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'portfolio-services-luxe',
    site_type: 'portfolio',
    section_type: 'services',
    theme_id: 'gallery-mono',
    keywords: ['services', 'timeline', 'process', 'skills'],
    preview_description: 'Services timeline detailing creative packaging and deliverable types.',
    rank: 82,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-t border-[var(--qm-border)]">
  <div class="mx-auto max-w-5xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="portfolio-services-luxe-p-1">Services</p>
      <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="portfolio-services-luxe-h2-1">HOW WE COLLABORATE</h2>
    </div>
    <div class="space-y-4" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" data-qay-hover="scale">
        <div>
          <span class="text-[10px] font-bold text-[var(--qm-accent)] uppercase tracking-wider" data-qm="portfolio-services-luxe-span-1">01 / PROTOTYPING</span>
          <h3 class="text-xl font-bold mt-1 uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-services-luxe-h3-1">Figma Drafts & UX Architecture</h3>
        </div>
        <p class="text-xs text-[var(--qm-text-muted)] max-w-md" data-qm="portfolio-services-luxe-p-2">Complete interactive wireframes, user testing inputs, and component libraries structured for handoff.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" data-qay-hover="scale">
        <div>
          <span class="text-[10px] font-bold text-[var(--qm-accent)] uppercase tracking-wider" data-qm="portfolio-services-luxe-span-2">02 / CODE</span>
          <h3 class="text-xl font-bold mt-1 uppercase" style="font-family:var(--qm-heading-font)" data-qm="portfolio-services-luxe-h3-2">Responsive Webflow & React Dev</h3>
        </div>
        <p class="text-xs text-[var(--qm-text-muted)] max-w-md" data-qm="portfolio-services-luxe-p-3">Tailored layout structures, native interactions, custom script integrations, and responsive debugging.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'portfolio-testimonial',
    site_type: 'portfolio',
    section_type: 'testimonials',
    theme_id: 'gallery-mono',
    keywords: ['testimonial', 'reviews', 'client', 'trust'],
    preview_description: 'Clean typographic quote with customer tag and accent colors.',
    rank: 78,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-5xl text-center space-y-6" data-qay-animate="slide-up">
    <blockquote class="text-3xl md:text-5xl font-bold leading-tight uppercase" style="font-family:var(--qm-heading-font); letter-spacing:-0.02em" data-qm="testimonial-1-text">
      "The layout hit because it was beautiful, yes, but mostly because it was structured with extreme logic."
    </blockquote>
    <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="testimonial-1-author">Product Director &bull; Ledger North</p>
  </div>
</section>`,
  },
  {
    id: 'portfolio-stats-luxe',
    site_type: 'portfolio',
    section_type: 'stats',
    theme_id: 'gallery-mono',
    keywords: ['stats', 'metrics', 'proof', 'experience'],
    preview_description: 'Minimal statistics strip with numeric highlights.',
    rank: 80,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl grid gap-4 sm:grid-cols-3" data-qay-animate="stagger-children">
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] text-center space-y-1" data-qay-hover="scale">
      <p class="text-5xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="portfolio-stats-luxe-p-1">8+</p>
      <p class="text-[10px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="portfolio-stats-luxe-p-2">Years in Digital Product</p>
    </div>
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] text-center space-y-1" data-qay-hover="scale">
      <p class="text-5xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="portfolio-stats-luxe-p-3">40+</p>
      <p class="text-[10px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="portfolio-stats-luxe-p-4">Platforms Crafted & Launched</p>
    </div>
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] text-center space-y-1" data-qay-hover="scale">
      <p class="text-5xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="portfolio-stats-luxe-p-5">25k+</p>
      <p class="text-[10px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="portfolio-stats-luxe-p-6">Lines of Custom Frontend Code</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'portfolio-contact-luxe',
    site_type: 'portfolio',
    section_type: 'contact',
    theme_id: 'gallery-mono',
    keywords: ['contact', 'hire', 'conversation', 'form'],
    preview_description: 'Elegant contact banner featuring standard input grids and descriptive headers.',
    rank: 84,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-t border-[var(--qm-border)]">
  <div class="mx-auto max-w-5xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/60 rounded-3xl p-8 md:p-12 space-y-8" data-qay-animate="slide-up">
    <div class="space-y-4">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="portfolio-contact-luxe-p-1">Contact / Bookings</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase leading-none" style="font-family:var(--qm-heading-font)" data-qm="portfolio-contact-luxe-h2-1">HAVE AN CONCEPT TO SHAPE?</h2>
      <p class="text-xs text-[var(--qm-text-muted)] max-w-md" data-qm="portfolio-contact-luxe-p-2">Drop a brief note with your timeline and goals, and I'll reply in 24 hours.</p>
    </div>
    <form class="grid gap-4 sm:grid-cols-2">
      <input type="text" name="name" placeholder="Name" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-4 py-3 text-xs uppercase font-bold tracking-wider outline-none focus:border-[var(--qm-accent)]" required />
      <input type="email" name="email" placeholder="Email" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-4 py-3 text-xs uppercase font-bold tracking-wider outline-none focus:border-[var(--qm-accent)]" required />
      <textarea name="message" placeholder="Project details" class="sm:col-span-2 h-28 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-4 py-3 text-xs uppercase font-bold tracking-wider outline-none focus:border-[var(--qm-accent)]" required></textarea>
      <button type="submit" class="sm:col-span-2 rounded-xl bg-[var(--qm-accent)] py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] tracking-wider hover:opacity-90 active:scale-95 transition" data-qm="portfolio-contact-luxe-button-1">Send message</button>
    </form>
  </div>
</section>`,
  },
  {
    id: 'portfolio-footer-luxe',
    site_type: 'portfolio',
    section_type: 'footer',
    theme_id: 'gallery-mono',
    keywords: ['footer', 'portfolio', 'links'],
    preview_description: 'Sleek portfolio footer with brand statement and links.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <p class="font-bold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand-name">Mira Okafor</p>
    <div class="flex gap-6 text-xs uppercase font-semibold tracking-wider">
      <a href="/work" class="hover:text-[var(--qm-accent)] transition" data-qm="portfolio-footer-luxe-a-1">Work</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition" data-qm="portfolio-footer-luxe-a-2">About</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition" data-qm="portfolio-footer-luxe-a-3">Contact</a>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)]/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[9px] uppercase tracking-wider">
    <p data-qm="portfolio-footer-luxe-p-1">&copy; 2026 MIRA OKAFOR. ALL RIGHTS RESERVED.</p>
    <p data-qm="footer-tagline">BUILT ON QAY FRAMEWORK</p>
  </div>
</footer>`,
  },
];
