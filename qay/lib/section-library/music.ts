import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'music-theme-echoline',
    site_type: 'music',
    theme_id: 'echoline',
    label: 'Echoline Dark',
    keywords: ['music', 'artist', 'band', 'dj', 'producer', 'album', 'tour', 'beats', 'record label', 'dark', 'neon'],
    css_variables: {
      '--qm-bg': '#0a0a10',
      '--qm-surface': '#14141e',
      '--qm-text': '#f0eee4',
      '--qm-text-muted': '#7a7670',
      '--qm-accent': '#f43f5e',
      '--qm-accent-text': '#0a0a10',
      '--qm-border': 'rgba(240,238,228,0.10)',
      '--qm-heading-font': '"Space Grotesk", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Space+Grotesk:wght@400;500;600;700', 'Inter:wght@400;500;600'],
    is_dark: true,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  /* ─────────── NAV ─────────── */
  {
    id: 'music-nav-luxe',
    site_type: 'music',
    section_type: 'nav',
    theme_id: 'echoline',
    keywords: ['nav', 'music', 'artist', 'header', 'navigation', 'dark'],
    preview_description: 'Dark moody navigation with neon accent CTA and glassmorphism blur.',
    rank: 94,
    html: `<nav class="sticky top-0 z-50 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/85 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2 hover:opacity-85 transition" data-qm="brand-name">
      <span class="text-xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)">ECHO<span class="text-[var(--qm-accent)]">LINE</span></span>
    </a>
    <div class="hidden items-center gap-8 text-[13px] font-medium md:flex" style="font-family:var(--qm-body-font)">
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">About</a>
      <a href="/schedule" class="hover:text-[var(--qm-accent)] transition">Tour Dates</a>
      <a href="/gallery" class="hover:text-[var(--qm-accent)] transition">Gallery</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition">Contact</a>
      <a href="/listen" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-bold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/25 hover:shadow-[var(--qm-accent)]/40 hover:scale-105 active:scale-[0.98] transition duration-200">Listen Now</a>
    </div>
    <button type="button" class="rounded-xl border border-[var(--qm-border)] px-4 py-2 text-sm font-semibold md:hidden" data-qay-click="toggle" data-qay-target="#music-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="music-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/about" class="text-sm font-medium py-1">About</a>
    <a href="/schedule" class="text-sm font-medium py-1">Tour Dates</a>
    <a href="/gallery" class="text-sm font-medium py-1">Gallery</a>
    <a href="/contact" class="text-sm font-medium py-1">Contact</a>
    <a href="/listen" class="mt-2 rounded-xl bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--qm-accent-text)]">Listen Now</a>
  </div>
</nav>`,
  },

  /* ─────────── HERO ─────────── */
  {
    id: 'music-hero-luxe',
    site_type: 'music',
    section_type: 'hero',
    theme_id: 'echoline',
    keywords: ['hero', 'music', 'artist', 'concert', 'dark', 'neon', 'luxe-reveal'],
    preview_description: 'Cinematic dark hero with large concert imagery, neon glow CTA, and staggered stat cards.',
    rank: 97,
    html: `<section class="relative bg-[var(--qm-bg)] text-[var(--qm-text)] overflow-hidden">
  <!-- Background image with overlay -->
  <div class="absolute inset-0">
    <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&auto=format&q=85" alt="Concert stage with dramatic lighting" class="h-full w-full object-cover opacity-30" />
    <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-[var(--qm-bg)]/70 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[var(--qm-bg)] via-transparent to-transparent"></div>
  </div>
  <div class="relative z-10 px-6 py-28 lg:py-40">
    <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
      <div class="space-y-8" data-qay-animate="luxe-reveal" data-qay-duration="1.2">
        <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] bg-[var(--qm-surface)]/50 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-accent)]">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
          New Album Out Now
        </div>
        <h1 class="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
          Feel The<br/><span class="text-[var(--qm-accent)]">Frequency.</span>
        </h1>
        <p class="max-w-lg text-base leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">
          Echoline blends electronic textures with raw vocals &mdash; crafting soundscapes that move bodies and shake rooms. Stream the latest project or catch us on tour.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="/listen" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-sm font-bold text-[var(--qm-accent-text)] shadow-xl shadow-[var(--qm-accent)]/30 hover:shadow-[var(--qm-accent)]/50 hover:scale-105 active:scale-[0.98] transition duration-200">Stream Now &#x25B6;</a>
          <a href="/schedule" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/30 backdrop-blur-sm px-8 py-4 text-sm font-semibold hover:bg-[var(--qm-surface)]/50 transition duration-200">Tour Dates &rarr;</a>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3" data-qay-animate="stagger-children">
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/40 backdrop-blur-md p-5 space-y-1" data-qay-hover="scale">
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">2.4M</p>
          <p class="text-[11px] font-medium uppercase tracking-wider text-[var(--qm-text-muted)]">Monthly Streams</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/40 backdrop-blur-md p-5 space-y-1" data-qay-hover="scale">
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">28</p>
          <p class="text-[11px] font-medium uppercase tracking-wider text-[var(--qm-text-muted)]">Cities on Tour</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/40 backdrop-blur-md p-5 space-y-1 col-span-2" data-qay-hover="scale">
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">MIDNIGHT VOLTAGE</p>
          <p class="text-[11px] font-medium uppercase tracking-wider text-[var(--qm-text-muted)]">Latest Album &bull; 12 Tracks &bull; 2026</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── ABOUT ─────────── */
  {
    id: 'music-about-luxe',
    site_type: 'music',
    section_type: 'about',
    theme_id: 'echoline',
    keywords: ['about', 'music', 'artist', 'story', 'bio', 'dark'],
    preview_description: 'Artist bio section with asymmetric layout, studio imagery, and moody editorial feel.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
    <div class="overflow-hidden rounded-3xl border border-[var(--qm-border)] aspect-[4/5]" data-qay-animate="slide-right" data-qay-hover="img-zoom">
      <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&q=85" alt="Artist in recording studio with moody lighting" class="h-full w-full object-cover" />
    </div>
    <div class="space-y-6" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">The Story</p>
      <h2 class="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight" style="font-family:var(--qm-heading-font)">
        Born From<br/>Late-Night Sessions.
      </h2>
      <p class="text-sm md:text-base text-[var(--qm-text-muted)] leading-relaxed max-w-lg" data-qm="about-copy" style="font-family:var(--qm-body-font)">
        Echoline started as a solo experiment in a Lagos bedroom studio &mdash; layering synths over field recordings at 3AM. What began as raw demos quickly grew into a sound that resonated across continents. Three albums, two continental tours, and millions of streams later, the mission remains the same: make music that you feel before you hear.
      </p>
      <div class="grid grid-cols-3 gap-4 pt-4">
        <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4 text-center" data-qay-hover="scale">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">3</p>
          <p class="text-[10px] font-medium uppercase tracking-wider text-[var(--qm-text-muted)] mt-1">Albums</p>
        </div>
        <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4 text-center" data-qay-hover="scale">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">120+</p>
          <p class="text-[10px] font-medium uppercase tracking-wider text-[var(--qm-text-muted)] mt-1">Shows</p>
        </div>
        <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4 text-center" data-qay-hover="scale">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">8M+</p>
          <p class="text-[10px] font-medium uppercase tracking-wider text-[var(--qm-text-muted)] mt-1">Streams</p>
        </div>
      </div>
      <div class="pt-2">
        <a href="/about" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--qm-accent)] hover:underline transition">Full bio &rarr;</a>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── SCHEDULE ─────────── */
  {
    id: 'music-schedule-luxe',
    site_type: 'music',
    section_type: 'schedule',
    theme_id: 'echoline',
    keywords: ['schedule', 'tour', 'dates', 'concerts', 'live', 'tickets', 'music'],
    preview_description: 'Tour dates schedule with city, venue, date, and ticket CTA in a dark card-based layout.',
    rank: 90,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="flex flex-col md:flex-row justify-between gap-6 md:items-end" data-qay-animate="slide-up">
      <div class="space-y-4">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">On the Road</p>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)">Upcoming Shows</h2>
      </div>
      <a href="/schedule" class="rounded-full border border-[var(--qm-border)] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">All dates &rarr;</a>
    </div>
    <div class="space-y-3" data-qay-animate="stagger-children">
      <!-- Show 1 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 hover:border-[var(--qm-accent)]/40 transition duration-300" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-5">
          <div class="text-center min-w-[60px]">
            <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">JUL</p>
            <p class="text-3xl font-bold" style="font-family:var(--qm-heading-font)">12</p>
          </div>
          <div class="h-12 w-px bg-[var(--qm-border)] hidden md:block"></div>
          <div>
            <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)">Lagos &mdash; Eko Convention Centre</h3>
            <p class="text-xs text-[var(--qm-text-muted)]">Midnight Voltage Tour &bull; Doors open 7PM</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-accent)]">On Sale</span>
          <a href="/tickets" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-xs font-bold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/20 hover:scale-105 active:scale-[0.98] transition">Get Tickets</a>
        </div>
      </div>

      <!-- Show 2 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 hover:border-[var(--qm-accent)]/40 transition duration-300" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-5">
          <div class="text-center min-w-[60px]">
            <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">JUL</p>
            <p class="text-3xl font-bold" style="font-family:var(--qm-heading-font)">26</p>
          </div>
          <div class="h-12 w-px bg-[var(--qm-border)] hidden md:block"></div>
          <div>
            <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)">London &mdash; Brixton Academy</h3>
            <p class="text-xs text-[var(--qm-text-muted)]">Midnight Voltage Tour &bull; Doors open 8PM</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-accent)]">On Sale</span>
          <a href="/tickets" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-xs font-bold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/20 hover:scale-105 active:scale-[0.98] transition">Get Tickets</a>
        </div>
      </div>

      <!-- Show 3 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 hover:border-[var(--qm-accent)]/40 transition duration-300" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-5">
          <div class="text-center min-w-[60px]">
            <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">AUG</p>
            <p class="text-3xl font-bold" style="font-family:var(--qm-heading-font)">09</p>
          </div>
          <div class="h-12 w-px bg-[var(--qm-border)] hidden md:block"></div>
          <div>
            <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)">Berlin &mdash; Berghain</h3>
            <p class="text-xs text-[var(--qm-text-muted)]">Midnight Voltage Tour &bull; Doors open 10PM</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-[var(--qm-text-muted)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Coming Soon</span>
          <a href="/tickets" class="rounded-xl border border-[var(--qm-border)] px-5 py-2.5 text-xs font-bold hover:bg-[var(--qm-surface)] transition">Notify Me</a>
        </div>
      </div>

      <!-- Show 4 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 hover:border-[var(--qm-accent)]/40 transition duration-300" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-5">
          <div class="text-center min-w-[60px]">
            <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">SEP</p>
            <p class="text-3xl font-bold" style="font-family:var(--qm-heading-font)">01</p>
          </div>
          <div class="h-12 w-px bg-[var(--qm-border)] hidden md:block"></div>
          <div>
            <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)">New York &mdash; Brooklyn Steel</h3>
            <p class="text-xs text-[var(--qm-text-muted)]">Midnight Voltage Tour &bull; Doors open 8PM</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-[var(--qm-text-muted)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Coming Soon</span>
          <a href="/tickets" class="rounded-xl border border-[var(--qm-border)] px-5 py-2.5 text-xs font-bold hover:bg-[var(--qm-surface)] transition">Notify Me</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── GALLERY ─────────── */
  {
    id: 'music-gallery-bento',
    site_type: 'music',
    section_type: 'gallery',
    theme_id: 'echoline',
    keywords: ['gallery', 'music', 'concert', 'photos', 'bento', 'live', 'performance'],
    preview_description: 'Bento-style photo gallery with concert shots, vinyl, and studio images in a dark atmospheric grid.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="flex flex-col md:flex-row justify-between gap-6 md:items-end" data-qay-animate="slide-up">
      <div class="space-y-4">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Captured Moments</p>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)">Live &amp; In Studio</h2>
      </div>
    </div>
    <div class="grid gap-3 grid-cols-2 md:grid-cols-4 md:grid-rows-2" data-qay-animate="stagger-children">
      <!-- Large image spanning 2 cols + 2 rows -->
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] col-span-2 row-span-2 aspect-square md:aspect-auto" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&q=85" alt="Artist performing live on stage with dramatic red lighting" class="h-full w-full object-cover" />
      </div>
      <!-- Top right -->
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&q=85" alt="Vinyl record spinning on turntable" class="h-full w-full object-cover aspect-square" />
      </div>
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&auto=format&q=85" alt="Concert crowd with hands raised" class="h-full w-full object-cover aspect-square" />
      </div>
      <!-- Bottom right -->
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&q=85" alt="Studio mixing board close-up" class="h-full w-full object-cover aspect-square" />
      </div>
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] relative" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&auto=format&q=85" alt="Microphone with stage lights" class="h-full w-full object-cover aspect-square" />
        <div class="absolute inset-0 bg-[var(--qm-accent)]/20 flex items-center justify-center">
          <span class="rounded-full bg-[var(--qm-accent)] px-5 py-2 text-xs font-bold text-[var(--qm-accent-text)]">View All</span>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── TESTIMONIALS ─────────── */
  {
    id: 'music-testimonials-luxe',
    site_type: 'music',
    section_type: 'testimonials',
    theme_id: 'echoline',
    keywords: ['testimonials', 'reviews', 'music', 'press', 'quotes', 'fans'],
    preview_description: 'Press quotes and fan testimonials with moody dark cards and neon accent highlights.',
    rank: 86,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">What They Say</p>
      <h2 class="text-4xl md:text-5xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)">Press &amp; Fan Love</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Press Quote 1 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <p class="text-3xl text-[var(--qm-accent)]">&#x275D;</p>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"Echoline does not make music you listen to. They make music you surrender to. Midnight Voltage is a masterclass in modern electronic composition."</p>
        </div>
        <div class="pt-2 border-t border-[var(--qm-border)]">
          <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">CLASH Magazine</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">Album Review &bull; 2026</p>
        </div>
      </article>

      <!-- Fan Quote -->
      <article class="rounded-3xl border border-[var(--qm-accent)]/30 bg-[var(--qm-accent)]/5 p-8 space-y-5 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <p class="text-3xl text-[var(--qm-accent)]">&#x275D;</p>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"Saw them at Brixton Academy last year. The energy was unreal. Every song hit different live. Already got tickets for the Midnight Voltage tour."</p>
        </div>
        <div class="pt-2 border-t border-[var(--qm-border)]">
          <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">@jessabeats</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">Fan &bull; London</p>
        </div>
      </article>

      <!-- Press Quote 2 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <p class="text-3xl text-[var(--qm-accent)]">&#x275D;</p>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"One of the most exciting acts to emerge from the African electronic scene. Their production quality rivals any major label release worldwide."</p>
        </div>
        <div class="pt-2 border-t border-[var(--qm-border)]">
          <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Pitchfork</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">Feature &bull; 2025</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ─────────── CTA ─────────── */
  {
    id: 'music-cta-luxe',
    site_type: 'music',
    section_type: 'cta',
    theme_id: 'echoline',
    keywords: ['cta', 'music', 'stream', 'subscribe', 'newsletter', 'neon'],
    preview_description: 'High-impact CTA with neon glow, gradient background, and newsletter signup.',
    rank: 88,
    html: `<section class="relative bg-[var(--qm-surface)] px-6 py-28 text-center text-[var(--qm-text)] overflow-hidden">
  <!-- Decorative glow -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[var(--qm-accent)]/10 blur-[120px]"></div>
  <div class="relative z-10 mx-auto max-w-3xl space-y-8" data-qay-animate="luxe-reveal" data-qay-duration="1.1">
    <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Stay Connected</p>
    <h2 class="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]" style="font-family:var(--qm-heading-font)">
      Never Miss a <span class="text-[var(--qm-accent)]">Beat</span>.
    </h2>
    <p class="mx-auto max-w-xl text-sm text-[var(--qm-text-muted)] leading-relaxed" style="font-family:var(--qm-body-font)">
      Get early access to new releases, exclusive behind-the-scenes content, tour pre-sale codes, and merch drops. No spam &mdash; just music.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <input type="email" placeholder="your@email.com" class="flex-1 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-3.5 text-sm outline-none focus:border-[var(--qm-accent)] transition placeholder:text-[var(--qm-text-muted)]" />
      <button type="button" class="rounded-xl bg-[var(--qm-accent)] px-8 py-3.5 text-sm font-bold text-[var(--qm-accent-text)] shadow-xl shadow-[var(--qm-accent)]/25 hover:shadow-[var(--qm-accent)]/40 hover:scale-105 active:scale-[0.98] transition duration-200 whitespace-nowrap">Join the List &rarr;</button>
    </div>
    <p class="text-[11px] text-[var(--qm-text-muted)]">12,000+ fans subscribed &bull; Unsubscribe anytime</p>
  </div>
</section>`,
  },

  /* ─────────── FOOTER ─────────── */
  {
    id: 'music-footer-luxe',
    site_type: 'music',
    section_type: 'footer',
    theme_id: 'echoline',
    keywords: ['footer', 'music', 'artist', 'links', 'dark', 'socials'],
    preview_description: 'Dark atmospheric footer with brand, navigation, streaming links, and social media.',
    rank: 82,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
    <div class="space-y-5">
      <p class="text-2xl font-bold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">ECHO<span class="text-[var(--qm-accent)]">LINE</span></p>
      <p class="max-w-sm text-xs leading-relaxed">Electronic textures, raw vocals, and sonic landscapes that move bodies. Independent music from Lagos to the world.</p>
      <div class="flex gap-4 text-[var(--qm-text)] text-sm">
        <a href="https://instagram.com" class="hover:text-[var(--qm-accent)] transition" aria-label="Instagram">&#x1F4F7;</a>
        <a href="https://twitter.com" class="hover:text-[var(--qm-accent)] transition" aria-label="Twitter">&#x1F426;</a>
        <a href="https://youtube.com" class="hover:text-[var(--qm-accent)] transition" aria-label="YouTube">&#x1F3AC;</a>
        <a href="https://tiktok.com" class="hover:text-[var(--qm-accent)] transition" aria-label="TikTok">&#x1F3B5;</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Navigate</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/about" class="hover:text-[var(--qm-text)] transition">About</a>
        <a href="/schedule" class="hover:text-[var(--qm-text)] transition">Tour Dates</a>
        <a href="/gallery" class="hover:text-[var(--qm-text)] transition">Gallery</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition">Contact</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Listen</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="https://spotify.com" class="hover:text-[var(--qm-text)] transition">Spotify</a>
        <a href="https://music.apple.com" class="hover:text-[var(--qm-text)] transition">Apple Music</a>
        <a href="https://soundcloud.com" class="hover:text-[var(--qm-text)] transition">SoundCloud</a>
        <a href="https://audiomack.com" class="hover:text-[var(--qm-text)] transition">Audiomack</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Legal</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Privacy Policy</a>
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Terms</a>
        <a href="/press" class="hover:text-[var(--qm-text)] transition">Press Kit</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
    <p>&copy; 2026 Echoline. All rights reserved.</p>
    <p>Independent music &bull; Lagos &bull; London &bull; Berlin</p>
  </div>
</footer>`,
  },
];
