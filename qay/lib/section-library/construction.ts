import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'construction-theme-industrial-bold',
    site_type: 'construction',
    theme_id: 'industrial-bold',
    label: 'Industrial Bold',
    keywords: ['construction', 'building', 'contractor', 'architecture', 'engineering', 'renovation', 'industrial', 'bold', 'premium'],
    css_variables: {
      '--qm-bg': '#f5f3ef',
      '--qm-surface': '#ffffff',
      '--qm-text': '#1a1814',
      '--qm-text-muted': '#6b6358',
      '--qm-accent': '#d4740e',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(26,24,20,0.10)',
      '--qm-heading-font': '"Bebas Neue", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Bebas+Neue:wght@400', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ─── NAV ─── */
  {
    id: 'construction-nav-industrial',
    site_type: 'construction',
    section_type: 'nav',
    theme_id: 'industrial-bold',
    keywords: ['navigation', 'industrial', 'construction', 'bold', 'sticky'],
    preview_description: 'Bold industrial navigation with uppercase links and quote-request CTA.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-2xl uppercase tracking-[0.15em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Apex Structures</a>
    <div class="hidden items-center gap-8 text-sm font-medium uppercase tracking-wider text-[var(--qm-text-muted)] md:flex" style="font-family:var(--qm-body-font)">
      <a href="/services" class="transition hover:text-[var(--qm-text)]">Services</a>
      <a href="/projects" class="transition hover:text-[var(--qm-text)]">Projects</a>
      <a href="/team" class="transition hover:text-[var(--qm-text)]">Team</a>
      <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
      <a href="/quote" class="bg-[var(--qm-accent)] px-6 py-3 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="nav-cta">Get a Quote</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center border border-[var(--qm-border)] text-sm font-bold md:hidden" data-qay-click="toggle" data-qay-target="#construction-mobile-menu" data-qay-class="hidden" aria-controls="construction-mobile-menu" aria-expanded="false">&#9776;</button>
  </div>
  <div id="construction-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-sm font-medium uppercase tracking-wider text-[var(--qm-text)] shadow-2xl md:hidden">
    <a href="/services">Services</a><a href="/projects">Projects</a><a href="/team">Team</a><a href="/contact">Contact</a>
    <a href="/quote" class="bg-[var(--qm-accent)] px-5 py-3 text-center text-[var(--qm-accent-text)]">Get a Quote</a>
  </div>
</nav>`,
  },

  /* ─── HERO ─── */
  {
    id: 'construction-hero-industrial',
    site_type: 'construction',
    section_type: 'hero',
    theme_id: 'industrial-bold',
    keywords: ['hero', 'construction', 'building', 'architecture', 'dramatic', 'split', 'bold'],
    preview_description: 'Split hero with dramatic construction imagery, oversized heading, and Bento stat badges.',
    rank: 96,
    html: `<section class="bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-[1fr_1.2fr]">
    <div class="flex flex-col justify-center px-6 py-20 md:px-14 lg:px-16" data-qay-animate="slide-right" data-qay-duration="1.0">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Building Excellence Since 2003</p>
      <h1 class="mt-6 text-6xl leading-[0.92] tracking-tight md:text-8xl lg:text-[6.5rem]" style="font-family:var(--qm-heading-font)" data-qm="hero-title">We Build Structures That Define Skylines</h1>
      <p class="mt-7 max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">Premium construction and architecture services for commercial, residential, and industrial projects. From blueprint to ribbon-cutting.</p>
      <div class="mt-10 flex flex-col gap-3 sm:flex-row">
        <a href="/quote" class="bg-[var(--qm-accent)] px-8 py-4 text-center text-sm font-semibold uppercase tracking-wider text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="hero-cta-primary">Start Your Project</a>
        <a href="/projects" class="border-2 border-[var(--qm-text)] px-8 py-4 text-center text-sm font-semibold uppercase tracking-wider transition hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)]" data-qm="hero-cta-secondary">View Portfolio</a>
      </div>
      <div class="mt-12 grid grid-cols-3 gap-4" data-qay-animate="stagger-children">
        <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-center">
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-1-value">240+</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-1-label">Projects Done</p>
        </div>
        <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-center">
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-2-value">20+</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-2-label">Years Exp.</p>
        </div>
        <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-center">
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-3-value">98%</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-3-label">On-Time</p>
        </div>
      </div>
    </div>
    <div class="relative min-h-[600px] overflow-hidden lg:min-h-[780px]" data-qay-hover="img-zoom">
      <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400&auto=format&q=85" alt="Modern skyscraper under construction with crane" class="absolute inset-0 h-full w-full object-cover" data-qm="hero-image" />
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)]/30 to-transparent"></div>
    </div>
  </div>
</section>`,
  },

  /* ─── SERVICES ─── */
  {
    id: 'construction-services-industrial',
    site_type: 'construction',
    section_type: 'services',
    theme_id: 'industrial-bold',
    keywords: ['services', 'construction', 'architecture', 'bento', 'grid', 'cards'],
    preview_description: 'Bento grid services section with asymmetric cards, icons, and construction imagery.',
    rank: 93,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--qm-accent)]">What We Do</p>
        <h2 class="mt-4 text-5xl tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="services-title">Our Core Services</h2>
      </div>
      <p class="max-w-md text-base leading-7 text-[var(--qm-text-muted)]" data-qm="services-subtitle">From ground-up builds to full-scale renovations, we deliver projects on time and on budget.</p>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2">
      <!-- Large featured card -->
      <div class="relative overflow-hidden border border-[var(--qm-border)] bg-[var(--qm-bg)] md:col-span-2 md:row-span-2" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&q=85" alt="Commercial construction site" class="h-72 w-full object-cover md:h-full" data-qm="service-main-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1814]/90 via-[#1a1814]/40 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <span class="text-4xl">&#127959;</span>
          <h3 class="mt-3 text-3xl text-white" style="font-family:var(--qm-heading-font)" data-qm="service-1-title">Commercial Construction</h3>
          <p class="mt-3 max-w-md text-sm leading-6 text-white/75" data-qm="service-1-desc">Full-scale commercial projects from offices and retail spaces to industrial warehouses. We manage every phase from permits to handover.</p>
        </div>
      </div>
      <!-- Right stacked cards -->
      <div class="border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <span class="text-3xl">&#127968;</span>
        <h3 class="mt-4 text-2xl" style="font-family:var(--qm-heading-font)" data-qm="service-2-title">Residential Builds</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="service-2-desc">Custom homes, luxury estates, and multi-family developments crafted with precision and premium materials.</p>
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <span class="text-3xl">&#128736;</span>
        <h3 class="mt-4 text-2xl" style="font-family:var(--qm-heading-font)" data-qm="service-3-title">Renovation &amp; Retrofit</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="service-3-desc">Modernizing existing structures with updated systems, interior transformations, and structural reinforcements.</p>
      </div>
    </div>
    <!-- Bottom row -->
    <div class="mt-4 grid gap-4 md:grid-cols-3">
      <div class="border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <span class="text-3xl">&#128208;</span>
        <h3 class="mt-4 text-2xl" style="font-family:var(--qm-heading-font)" data-qm="service-4-title">Architecture &amp; Design</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="service-4-desc">Blueprints, 3D modeling, and full architectural plans that balance form with function.</p>
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <span class="text-3xl">&#9881;</span>
        <h3 class="mt-4 text-2xl" style="font-family:var(--qm-heading-font)" data-qm="service-5-title">Project Management</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="service-5-desc">End-to-end oversight ensuring timelines, budgets, and quality standards are met at every milestone.</p>
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <span class="text-3xl">&#128200;</span>
        <h3 class="mt-4 text-2xl" style="font-family:var(--qm-heading-font)" data-qm="service-6-title">Consulting &amp; Estimation</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="service-6-desc">Detailed cost analysis, feasibility studies, and expert consulting before breaking ground.</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── GALLERY ─── */
  {
    id: 'construction-gallery-industrial',
    site_type: 'construction',
    section_type: 'gallery',
    theme_id: 'industrial-bold',
    keywords: ['gallery', 'projects', 'portfolio', 'construction', 'architecture', 'bento'],
    preview_description: 'Bento-style project gallery with asymmetric layout and overlay captions.',
    rank: 92,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--qm-accent)]">Featured Projects</p>
      <h2 class="mt-4 text-5xl tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">Our Portfolio</h2>
      <p class="mx-auto mt-4 max-w-xl text-base text-[var(--qm-text-muted)]" data-qm="gallery-subtitle">A selection of our landmark projects across commercial, residential, and industrial sectors.</p>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-4 md:grid-rows-2" data-qay-animate="stagger-children">
      <div class="group relative overflow-hidden md:col-span-2 md:row-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&q=85" alt="Modern glass office tower" class="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-1-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-xl font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="gallery-1-title">Meridian Tower</p>
          <p class="text-sm text-white/70" data-qm="gallery-1-type">Commercial &bull; 42 Floors</p>
        </div>
      </div>
      <div class="group relative overflow-hidden" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&q=85" alt="Architectural blueprint and model" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-2-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-lg font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="gallery-2-title">Harbor Bridge</p>
          <p class="text-xs text-white/70" data-qm="gallery-2-type">Infrastructure</p>
        </div>
      </div>
      <div class="group relative overflow-hidden" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&q=85" alt="Luxury modern home exterior" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-3-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-lg font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="gallery-3-title">Villa Serena</p>
          <p class="text-xs text-white/70" data-qm="gallery-3-type">Residential &bull; 8,500 sqft</p>
        </div>
      </div>
      <div class="group relative overflow-hidden" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1590486803686-d802c6f5fec4?w=800&auto=format&q=85" alt="Construction crane at sunset" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-4-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-lg font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="gallery-4-title">Industrial Park</p>
          <p class="text-xs text-white/70" data-qm="gallery-4-type">Industrial Complex</p>
        </div>
      </div>
      <div class="group relative overflow-hidden" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&q=85" alt="Modern villa with pool" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-5-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-lg font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="gallery-5-title">The Residences</p>
          <p class="text-xs text-white/70" data-qm="gallery-5-type">Luxury Estate</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── STATS ─── */
  {
    id: 'construction-stats-industrial',
    site_type: 'construction',
    section_type: 'stats',
    theme_id: 'industrial-bold',
    keywords: ['stats', 'numbers', 'impact', 'construction', 'bold'],
    preview_description: 'Full-width stats bar with oversized numbers, accent underlines, and background image overlay.',
    rank: 91,
    html: `<section class="relative overflow-hidden bg-[#1a1814] px-5 py-24 text-white">
  <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&auto=format&q=85" alt="Construction site aerial" class="absolute inset-0 h-full w-full object-cover opacity-15" />
  <div class="relative mx-auto max-w-7xl">
    <div class="text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--qm-accent)]">By The Numbers</p>
      <h2 class="mt-4 text-5xl tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="stats-title">Impact That Speaks</h2>
    </div>
    <div class="mt-16 grid gap-8 md:grid-cols-4" data-qay-animate="stagger-children">
      <div class="text-center">
        <p class="text-6xl font-bold text-[var(--qm-accent)] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="stat-1-value">240+</p>
        <div class="mx-auto mt-4 h-0.5 w-12 bg-[var(--qm-accent)]" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm uppercase tracking-wider text-white/60" data-qm="stat-1-label">Projects Completed</p>
      </div>
      <div class="text-center">
        <p class="text-6xl font-bold text-[var(--qm-accent)] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="stat-2-value">$2.1B</p>
        <div class="mx-auto mt-4 h-0.5 w-12 bg-[var(--qm-accent)]" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm uppercase tracking-wider text-white/60" data-qm="stat-2-label">Total Project Value</p>
      </div>
      <div class="text-center">
        <p class="text-6xl font-bold text-[var(--qm-accent)] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="stat-3-value">850+</p>
        <div class="mx-auto mt-4 h-0.5 w-12 bg-[var(--qm-accent)]" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm uppercase tracking-wider text-white/60" data-qm="stat-3-label">Team Members</p>
      </div>
      <div class="text-center">
        <p class="text-6xl font-bold text-[var(--qm-accent)] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="stat-4-value">98%</p>
        <div class="mx-auto mt-4 h-0.5 w-12 bg-[var(--qm-accent)]" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm uppercase tracking-wider text-white/60" data-qm="stat-4-label">On-Time Delivery</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── TEAM ─── */
  {
    id: 'construction-team-industrial',
    site_type: 'construction',
    section_type: 'team',
    theme_id: 'industrial-bold',
    keywords: ['team', 'leadership', 'engineers', 'construction', 'profiles'],
    preview_description: 'Leadership team grid with photo cards, role labels, and hover accent borders.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="md:flex md:items-end md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--qm-accent)]">Leadership</p>
        <h2 class="mt-4 text-5xl tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">The People Behind The Projects</h2>
      </div>
      <a href="/team" class="mt-4 inline-flex text-sm font-semibold uppercase tracking-wider text-[var(--qm-accent)] transition hover:opacity-80 md:mt-0" data-qm="team-cta">View All &rarr;</a>
    </div>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="group border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&q=85" alt="Team member portrait" class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="team-1-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl" style="font-family:var(--qm-heading-font)" data-qm="team-1-name">James Adeyemi</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-1-role">CEO &amp; Founder</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-1-bio">25 years leading large-scale commercial and infrastructure projects across three continents.</p>
        </div>
      </div>
      <div class="group border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&q=85" alt="Team member portrait" class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="team-2-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl" style="font-family:var(--qm-heading-font)" data-qm="team-2-name">Sarah Chen</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-2-role">Head of Architecture</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-2-bio">Award-winning architect specializing in sustainable design and modern commercial spaces.</p>
        </div>
      </div>
      <div class="group border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&q=85" alt="Team member portrait" class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="team-3-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl" style="font-family:var(--qm-heading-font)" data-qm="team-3-name">David Okafor</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-3-role">Chief Engineer</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-3-bio">Structural engineering expert with a track record of innovative solutions for complex builds.</p>
        </div>
      </div>
      <div class="group border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&q=85" alt="Team member portrait" class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="team-4-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl" style="font-family:var(--qm-heading-font)" data-qm="team-4-name">Amara Johnson</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-4-role">Project Director</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-4-bio">Oversees multi-million dollar projects with meticulous attention to timeline and budget.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── CONTACT ─── */
  {
    id: 'construction-contact-industrial',
    site_type: 'construction',
    section_type: 'contact',
    theme_id: 'industrial-bold',
    keywords: ['contact', 'quote', 'form', 'construction', 'office'],
    preview_description: 'Split contact section with quote form and office details on construction-themed background.',
    rank: 90,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="scroll-reveal">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--qm-accent)]">Get In Touch</p>
        <h2 class="mt-4 text-5xl tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="contact-title">Let's Build Something Remarkable</h2>
        <p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="contact-subtitle">Ready to start your next project? Contact our team for a free consultation and detailed estimate.</p>
        <div class="mt-10 space-y-6">
          <div class="flex items-start gap-4">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128205;</span>
            <div>
              <p class="font-semibold" data-qm="contact-address-label">Head Office</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-address">42 Industrial Avenue, Downtown District, NY 10001</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128222;</span>
            <div>
              <p class="font-semibold" data-qm="contact-phone-label">Phone</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-phone">+1 (555) 234-5678</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128231;</span>
            <div>
              <p class="font-semibold" data-qm="contact-email-label">Email</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-email">info@apexstructures.com</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128336;</span>
            <div>
              <p class="font-semibold" data-qm="contact-hours-label">Working Hours</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-hours">Mon-Fri 7:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 md:p-10">
        <h3 class="text-2xl" style="font-family:var(--qm-heading-font)" data-qm="form-title">Request a Free Quote</h3>
        <p class="mt-2 text-sm text-[var(--qm-text-muted)]">Fill in your project details and we'll respond within 24 hours.</p>
        <form class="mt-8 space-y-5">
          <div class="grid gap-5 md:grid-cols-2">
            <input type="text" placeholder="Your Name" class="w-full border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition focus:border-[var(--qm-accent)]" />
            <input type="email" placeholder="Email Address" class="w-full border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition focus:border-[var(--qm-accent)]" />
          </div>
          <input type="text" placeholder="Phone Number" class="w-full border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition focus:border-[var(--qm-accent)]" />
          <select class="w-full border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3.5 text-sm text-[var(--qm-text-muted)] outline-none transition focus:border-[var(--qm-accent)]">
            <option>Select Project Type</option>
            <option>Commercial Construction</option>
            <option>Residential Build</option>
            <option>Renovation</option>
            <option>Architecture &amp; Design</option>
            <option>Other</option>
          </select>
          <textarea rows="4" placeholder="Tell us about your project..." class="w-full border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition focus:border-[var(--qm-accent)]"></textarea>
          <button type="submit" class="w-full bg-[var(--qm-accent)] py-4 text-sm font-semibold uppercase tracking-wider text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">Submit Request</button>
        </form>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── FOOTER ─── */
  {
    id: 'construction-footer-industrial',
    site_type: 'construction',
    section_type: 'footer',
    theme_id: 'industrial-bold',
    keywords: ['footer', 'construction', 'links', 'contact'],
    preview_description: 'Industrial footer with multi-column links, brand mark, and accent border top.',
    rank: 88,
    html: `<footer class="border-t-4 border-[var(--qm-accent)] bg-[#1a1814] px-5 py-16 text-white/80" data-qay-animate="fade-in">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-4">
      <div>
        <p class="text-2xl uppercase tracking-[0.15em] text-white" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Apex Structures</p>
        <p class="mt-4 text-sm leading-6 text-white/50" data-qm="footer-tagline">Premium construction and architecture services. Building tomorrow's landmarks today.</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Services</p>
        <div class="mt-4 flex flex-col gap-3 text-sm">
          <a href="/services" class="transition hover:text-white">Commercial Construction</a>
          <a href="/services" class="transition hover:text-white">Residential Builds</a>
          <a href="/services" class="transition hover:text-white">Renovation</a>
          <a href="/services" class="transition hover:text-white">Architecture</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Company</p>
        <div class="mt-4 flex flex-col gap-3 text-sm">
          <a href="/projects" class="transition hover:text-white">Projects</a>
          <a href="/team" class="transition hover:text-white">Our Team</a>
          <a href="/about" class="transition hover:text-white">About Us</a>
          <a href="/careers" class="transition hover:text-white">Careers</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Contact</p>
        <div class="mt-4 space-y-3 text-sm">
          <p data-qm="footer-address">42 Industrial Avenue, NY 10001</p>
          <p data-qm="footer-phone">+1 (555) 234-5678</p>
          <p data-qm="footer-email">info@apexstructures.com</p>
        </div>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
      <p data-qm="footer-copy">&copy; 2024 Apex Structures. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="/privacy" class="transition hover:text-white">Privacy Policy</a>
        <a href="/terms" class="transition hover:text-white">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
