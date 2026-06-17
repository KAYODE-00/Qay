import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'event-theme-dark-luxe',
    site_type: 'event',
    theme_id: 'dark-luxe',
    label: 'Dark Luxe',
    keywords: ['event', 'wedding', 'conference', 'concert', 'festival', 'party', 'venue', 'dark', 'luxe', 'premium'],
    css_variables: {
      '--qm-bg': '#0e0e12',
      '--qm-surface': '#18181f',
      '--qm-text': '#f0eee8',
      '--qm-text-muted': '#8a8880',
      '--qm-accent': '#c084fc',
      '--qm-accent-text': '#0e0e12',
      '--qm-border': 'rgba(240,238,232,0.10)',
      '--qm-heading-font': '"Syne", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Syne:wght@400;500;600;700;800', 'Inter:wght@400;500;600;700'],
    is_dark: true,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  /* ─── NAV ─── */
  {
    id: 'event-nav-luxe',
    site_type: 'event',
    section_type: 'nav',
    theme_id: 'dark-luxe',
    keywords: ['navigation', 'event', 'dark', 'luxe', 'sticky', 'glassmorphism'],
    preview_description: 'Dark glassmorphic navigation with electric accent CTA for premium events.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-5 py-4 text-[var(--qm-text)] backdrop-blur-xl" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">
      <span class="text-[var(--qm-accent)]">&#10022;</span> Momentus
    </a>
    <div class="hidden items-center gap-7 text-sm font-medium text-[var(--qm-text-muted)] md:flex" style="font-family:var(--qm-body-font)">
      <a href="/events" class="transition hover:text-[var(--qm-text)]">Events</a>
      <a href="/schedule" class="transition hover:text-[var(--qm-text)]">Schedule</a>
      <a href="/speakers" class="transition hover:text-[var(--qm-text)]">Speakers</a>
      <a href="/gallery" class="transition hover:text-[var(--qm-text)]">Gallery</a>
      <a href="/tickets" class="rounded-full bg-[var(--qm-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90 hover:shadow-lg hover:shadow-[var(--qm-accent)]/25" data-qay-hover="scale" data-qm="nav-cta">Get Tickets</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm md:hidden" data-qay-click="toggle" data-qay-target="#event-mobile-menu" data-qay-class="hidden" aria-controls="event-mobile-menu" aria-expanded="false">&#9776;</button>
  </div>
  <div id="event-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-sm font-medium text-[var(--qm-text)] shadow-2xl backdrop-blur-xl md:hidden">
    <a href="/events">Events</a><a href="/schedule">Schedule</a><a href="/speakers">Speakers</a><a href="/gallery">Gallery</a>
    <a href="/tickets" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-center text-[var(--qm-accent-text)]">Get Tickets</a>
  </div>
</nav>`,
  },

  /* ─── HERO ─── */
  {
    id: 'event-hero-luxe',
    site_type: 'event',
    section_type: 'hero',
    theme_id: 'dark-luxe',
    keywords: ['hero', 'event', 'dark', 'dramatic', 'concert', 'electric', 'immersive'],
    preview_description: 'Full-bleed dark hero with dramatic imagery, glowing accent text, countdown-style details, and floating glass cards.',
    rank: 97,
    html: `<section class="relative min-h-[800px] overflow-hidden bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <!-- Background image with gradient overlay -->
  <img src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1800&auto=format&q=85" alt="Dramatic concert stage with purple lights" class="absolute inset-0 h-full w-full object-cover opacity-40" data-qm="hero-image" />
  <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-[var(--qm-bg)]/60 to-transparent"></div>
  <div class="absolute inset-0 bg-gradient-to-r from-[var(--qm-bg)]/80 to-transparent"></div>
  <!-- Decorative glow -->
  <div class="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--qm-accent)]/15 blur-[120px]"></div>
  <div class="relative mx-auto flex max-w-7xl flex-col justify-end px-5 pb-20 pt-40 md:pb-28 md:pt-52">
    <div data-qay-animate="luxe-reveal" data-qay-duration="1.2">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/30 bg-[var(--qm-accent)]/10 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)] backdrop-blur">
        <span class="h-2 w-2 animate-pulse rounded-full bg-[var(--qm-accent)]"></span>
        <span data-qm="hero-badge">Live Event &bull; December 15, 2024</span>
      </div>
      <h1 class="mt-7 max-w-4xl text-6xl font-extrabold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Where Moments Become Memories</h1>
      <p class="mt-7 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">An unforgettable evening of world-class performances, immersive installations, and connections that last a lifetime.</p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <a href="/tickets" class="rounded-full bg-[var(--qm-accent)] px-9 py-4 text-center text-sm font-bold text-[var(--qm-accent-text)] shadow-xl shadow-[var(--qm-accent)]/30 transition hover:opacity-90" data-qay-hover="scale" data-qm="hero-cta-primary">Get Your Tickets</a>
        <a href="/schedule" class="rounded-full border border-[var(--qm-border)] bg-white/5 px-9 py-4 text-center text-sm font-semibold backdrop-blur transition hover:bg-white/10" data-qm="hero-cta-secondary">View Schedule</a>
      </div>
    </div>
    <!-- Floating event details -->
    <div class="mt-14 grid gap-4 sm:grid-cols-3 md:max-w-2xl" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-white/5 p-5 backdrop-blur-md">
        <p class="text-xs uppercase tracking-wider text-[var(--qm-accent)]">Date</p>
        <p class="mt-2 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="event-date">Dec 15, 2024</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-white/5 p-5 backdrop-blur-md">
        <p class="text-xs uppercase tracking-wider text-[var(--qm-accent)]">Venue</p>
        <p class="mt-2 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="event-venue">Grand Arena NYC</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-white/5 p-5 backdrop-blur-md">
        <p class="text-xs uppercase tracking-wider text-[var(--qm-accent)]">Capacity</p>
        <p class="mt-2 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="event-capacity">5,000 Guests</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── SCHEDULE ─── */
  {
    id: 'event-schedule-luxe',
    site_type: 'event',
    section_type: 'schedule',
    theme_id: 'dark-luxe',
    keywords: ['schedule', 'timeline', 'agenda', 'event', 'program', 'sessions'],
    preview_description: 'Dark timeline schedule with glowing time markers, session cards, and speaker details.',
    rank: 93,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-5xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Event Schedule</div>
      <h2 class="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="schedule-title">The Program</h2>
      <p class="mx-auto mt-4 max-w-lg text-base text-[var(--qm-text-muted)]" data-qm="schedule-subtitle">A curated lineup of performances, talks, and experiences across the evening.</p>
    </div>
    <div class="mt-16 space-y-6">
      <!-- Session 1 -->
      <div class="group flex gap-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 transition hover:border-[var(--qm-accent)]/30 md:p-8" data-qay-hover="luxe-lift">
        <div class="hidden shrink-0 text-right md:block md:w-28">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="schedule-1-time">6:00 PM</p>
          <p class="mt-1 text-xs text-[var(--qm-text-muted)]">Doors Open</p>
        </div>
        <div class="hidden h-auto w-px bg-gradient-to-b from-[var(--qm-accent)] to-[var(--qm-accent)]/20 md:block"></div>
        <div class="flex-1">
          <p class="text-sm text-[var(--qm-accent)] md:hidden" data-qm="schedule-1-time-mobile">6:00 PM</p>
          <h3 class="mt-1 text-xl font-bold md:mt-0" style="font-family:var(--qm-heading-font)" data-qm="schedule-1-title">Welcome Reception &amp; Cocktails</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="schedule-1-desc">Arrive and settle in with craft cocktails, ambient music, and immersive light installations in the grand foyer.</p>
          <div class="mt-4 inline-flex rounded-full border border-[var(--qm-border)] px-3 py-1 text-xs text-[var(--qm-text-muted)]">&#127928; Ambient Sounds</div>
        </div>
      </div>
      <!-- Session 2 -->
      <div class="group flex gap-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 transition hover:border-[var(--qm-accent)]/30 md:p-8" data-qay-hover="luxe-lift">
        <div class="hidden shrink-0 text-right md:block md:w-28">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="schedule-2-time">7:00 PM</p>
          <p class="mt-1 text-xs text-[var(--qm-text-muted)]">Main Stage</p>
        </div>
        <div class="hidden h-auto w-px bg-gradient-to-b from-[var(--qm-accent)] to-[var(--qm-accent)]/20 md:block"></div>
        <div class="flex-1">
          <p class="text-sm text-[var(--qm-accent)] md:hidden">7:00 PM</p>
          <h3 class="mt-1 text-xl font-bold md:mt-0" style="font-family:var(--qm-heading-font)" data-qm="schedule-2-title">Opening Keynote: The Future of Experience</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="schedule-2-desc">A visionary talk on how technology is reshaping live events and human connection.</p>
          <div class="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] px-3 py-1 text-xs text-[var(--qm-text-muted)]">&#127908; Dr. Maya Johnson</div>
        </div>
      </div>
      <!-- Session 3 -->
      <div class="group flex gap-6 rounded-2xl border border-[var(--qm-accent)]/20 bg-gradient-to-r from-[var(--qm-accent)]/5 to-[var(--qm-bg)] p-6 md:p-8" data-qay-hover="luxe-lift">
        <div class="hidden shrink-0 text-right md:block md:w-28">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="schedule-3-time">8:30 PM</p>
          <p class="mt-1 text-xs text-[var(--qm-accent)]">Headliner</p>
        </div>
        <div class="hidden h-auto w-px bg-gradient-to-b from-[var(--qm-accent)] to-[var(--qm-accent)]/20 md:block"></div>
        <div class="flex-1">
          <p class="text-sm text-[var(--qm-accent)] md:hidden">8:30 PM &bull; Headliner</p>
          <h3 class="mt-1 text-xl font-bold md:mt-0" style="font-family:var(--qm-heading-font)" data-qm="schedule-3-title">Live Performance: Aurora Nights</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="schedule-3-desc">A breathtaking live performance combining orchestral music, visual projections, and immersive sound design.</p>
          <div class="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--qm-accent)]">&#11088; Featured Performance</div>
        </div>
      </div>
      <!-- Session 4 -->
      <div class="group flex gap-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 transition hover:border-[var(--qm-accent)]/30 md:p-8" data-qay-hover="luxe-lift">
        <div class="hidden shrink-0 text-right md:block md:w-28">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="schedule-4-time">10:00 PM</p>
          <p class="mt-1 text-xs text-[var(--qm-text-muted)]">Afterparty</p>
        </div>
        <div class="hidden h-auto w-px bg-gradient-to-b from-[var(--qm-accent)] to-[var(--qm-accent)]/20 md:block"></div>
        <div class="flex-1">
          <p class="text-sm text-[var(--qm-accent)] md:hidden">10:00 PM</p>
          <h3 class="mt-1 text-xl font-bold md:mt-0" style="font-family:var(--qm-heading-font)" data-qm="schedule-4-title">After Dark: DJ Set &amp; Lounge</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="schedule-4-desc">The night continues with an exclusive DJ set, open bar, and rooftop lounge under the stars.</p>
          <div class="mt-4 inline-flex rounded-full border border-[var(--qm-border)] px-3 py-1 text-xs text-[var(--qm-text-muted)]">&#127926; DJ Lumina</div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── TEAM / SPEAKERS ─── */
  {
    id: 'event-team-luxe',
    site_type: 'event',
    section_type: 'team',
    theme_id: 'dark-luxe',
    keywords: ['team', 'speakers', 'performers', 'event', 'profiles', 'dark'],
    preview_description: 'Speaker/performer grid with dramatic photos, glow borders, and role badges on dark background.',
    rank: 92,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Featured Lineup</div>
      <h2 class="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">Meet the Stars</h2>
      <p class="mx-auto mt-4 max-w-lg text-base text-[var(--qm-text-muted)]" data-qm="team-subtitle">World-class performers, speakers, and creators bringing magic to the stage.</p>
    </div>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] transition hover:border-[var(--qm-accent)]/40 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&q=85" alt="Speaker portrait" class="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="team-1-image" />
          <div class="absolute inset-x-0 top-0 h-72 bg-gradient-to-t from-[var(--qm-surface)] to-transparent"></div>
        </div>
        <div class="relative -mt-12 p-6">
          <div class="inline-flex rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--qm-accent)]">Keynote Speaker</div>
          <h3 class="mt-3 text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-1-name">Dr. Maya Johnson</h3>
          <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="team-1-role">Futurist &amp; Technology Evangelist</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] transition hover:border-[var(--qm-accent)]/40 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&q=85" alt="Performer portrait" class="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="team-2-image" />
          <div class="absolute inset-x-0 top-0 h-72 bg-gradient-to-t from-[var(--qm-surface)] to-transparent"></div>
        </div>
        <div class="relative -mt-12 p-6">
          <div class="inline-flex rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--qm-accent)]">Headliner</div>
          <h3 class="mt-3 text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-2-name">Aurora Nights</h3>
          <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="team-2-role">Orchestral &amp; Electronic Performer</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] transition hover:border-[var(--qm-accent)]/40 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&q=85" alt="Speaker portrait" class="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="team-3-image" />
          <div class="absolute inset-x-0 top-0 h-72 bg-gradient-to-t from-[var(--qm-surface)] to-transparent"></div>
        </div>
        <div class="relative -mt-12 p-6">
          <div class="inline-flex rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--qm-accent)]">Speaker</div>
          <h3 class="mt-3 text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-3-name">Carlos Rivera</h3>
          <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="team-3-role">Creative Director, Studio X</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] transition hover:border-[var(--qm-accent)]/40 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <div class="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&q=85" alt="DJ portrait" class="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="team-4-image" />
          <div class="absolute inset-x-0 top-0 h-72 bg-gradient-to-t from-[var(--qm-surface)] to-transparent"></div>
        </div>
        <div class="relative -mt-12 p-6">
          <div class="inline-flex rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--qm-accent)]">DJ</div>
          <h3 class="mt-3 text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-4-name">DJ Lumina</h3>
          <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="team-4-role">Electronic &amp; Ambient DJ</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── GALLERY ─── */
  {
    id: 'event-gallery-luxe',
    site_type: 'event',
    section_type: 'gallery',
    theme_id: 'dark-luxe',
    keywords: ['gallery', 'event', 'photos', 'dark', 'bento', 'immersive'],
    preview_description: 'Asymmetric Bento gallery with hover zoom, gradient overlays, and event imagery on dark background.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="md:flex md:items-end md:justify-between" data-qay-animate="slide-up">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Past Highlights</div>
        <h2 class="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">Relive The Magic</h2>
      </div>
      <p class="mt-4 max-w-md text-base text-[var(--qm-text-muted)] md:mt-0" data-qm="gallery-subtitle">Moments captured from our previous events.</p>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2" data-qay-animate="stagger-children">
      <div class="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&q=85" alt="Crowd at a concert with colorful lights" class="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-1-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)]/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="gallery-1-title">Momentus 2023</p>
          <p class="text-sm text-[var(--qm-text-muted)]" data-qm="gallery-1-type">Annual Gala &bull; 3,000 attendees</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&q=85" alt="Event venue with dramatic lighting" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-2-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)]/90 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="font-bold" style="font-family:var(--qm-heading-font)" data-qm="gallery-2-title">Stage Design</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&q=85" alt="Conference networking session" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" data-qm="gallery-3-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)]/90 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p class="font-bold" style="font-family:var(--qm-heading-font)" data-qm="gallery-3-title">Networking</p>
        </div>
      </div>
    </div>
    <!-- Bottom row -->
    <div class="mt-4 grid gap-4 md:grid-cols-4" data-qay-animate="stagger-children">
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&q=85" alt="Conference presentation" class="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="gallery-4-image" />
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&auto=format&q=85" alt="Celebration with confetti" class="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="gallery-5-image" />
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&q=85" alt="VIP lounge setup" class="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="gallery-6-image" />
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&q=85" alt="Crowd at outdoor festival" class="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105" data-qm="gallery-7-image" />
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── STATS ─── */
  {
    id: 'event-stats-luxe',
    site_type: 'event',
    section_type: 'stats',
    theme_id: 'dark-luxe',
    keywords: ['stats', 'numbers', 'impact', 'event', 'glow'],
    preview_description: 'Glowing stats section with oversized numbers, accent gradients, and event impact metrics.',
    rank: 91,
    html: `<section class="relative overflow-hidden bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <!-- Decorative glow -->
  <div class="absolute left-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[var(--qm-accent)]/8 blur-[100px]"></div>
  <div class="absolute right-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[var(--qm-accent)]/5 blur-[100px]"></div>
  <div class="relative mx-auto max-w-6xl">
    <div class="text-center" data-qay-animate="slide-up">
      <h2 class="text-5xl font-extrabold tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="stats-title">Numbers That Inspire</h2>
    </div>
    <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 text-center transition hover:border-[var(--qm-accent)]/30 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <p class="text-6xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-1-value">50+</p>
        <div class="mx-auto mt-4 h-0.5 w-10 bg-gradient-to-r from-transparent via-[var(--qm-accent)] to-transparent" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm text-[var(--qm-text-muted)]" data-qm="stat-1-label">Events Produced</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 text-center transition hover:border-[var(--qm-accent)]/30 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <p class="text-6xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-2-value">100K+</p>
        <div class="mx-auto mt-4 h-0.5 w-10 bg-gradient-to-r from-transparent via-[var(--qm-accent)] to-transparent" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm text-[var(--qm-text-muted)]" data-qm="stat-2-label">Total Attendees</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 text-center transition hover:border-[var(--qm-accent)]/30 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <p class="text-6xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-3-value">200+</p>
        <div class="mx-auto mt-4 h-0.5 w-10 bg-gradient-to-r from-transparent via-[var(--qm-accent)] to-transparent" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm text-[var(--qm-text-muted)]" data-qm="stat-3-label">Featured Artists</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 text-center transition hover:border-[var(--qm-accent)]/30 hover:shadow-xl hover:shadow-[var(--qm-accent)]/5" data-qay-hover="luxe-lift">
        <p class="text-6xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-4-value">15</p>
        <div class="mx-auto mt-4 h-0.5 w-10 bg-gradient-to-r from-transparent via-[var(--qm-accent)] to-transparent" data-qay-animate="line-grow"></div>
        <p class="mt-4 text-sm text-[var(--qm-text-muted)]" data-qm="stat-4-label">Countries Reached</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── CONTACT ─── */
  {
    id: 'event-contact-luxe',
    site_type: 'event',
    section_type: 'contact',
    theme_id: 'dark-luxe',
    keywords: ['contact', 'tickets', 'booking', 'event', 'dark', 'form'],
    preview_description: 'Dark contact section with split layout, ticket form, and glassmorphic venue details.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="scroll-reveal">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Get In Touch</div>
        <h2 class="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="contact-title">Let's Create Something Extraordinary</h2>
        <p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="contact-subtitle">Planning an event? Want to partner with us? We'd love to hear from you.</p>
        <div class="mt-10 space-y-6">
          <div class="flex items-start gap-4 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128205;</span>
            <div>
              <p class="font-semibold" data-qm="contact-venue-label">Venue</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-venue">Grand Arena NYC, 450 West 33rd St, New York</p>
            </div>
          </div>
          <div class="flex items-start gap-4 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128231;</span>
            <div>
              <p class="font-semibold" data-qm="contact-email-label">Email</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-email">hello@momentusevents.com</p>
            </div>
          </div>
          <div class="flex items-start gap-4 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5">
            <span class="mt-1 text-xl text-[var(--qm-accent)]">&#128222;</span>
            <div>
              <p class="font-semibold" data-qm="contact-phone-label">Phone</p>
              <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-phone">+1 (555) 789-0123</p>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 md:p-10">
        <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="form-title">Send Us a Message</h3>
        <p class="mt-2 text-sm text-[var(--qm-text-muted)]">We'll get back to you within 24 hours.</p>
        <form class="mt-8 space-y-5">
          <div class="grid gap-5 md:grid-cols-2">
            <input type="text" placeholder="Full Name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)]" />
            <input type="email" placeholder="Email Address" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)]" />
          </div>
          <select class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3.5 text-sm text-[var(--qm-text-muted)] outline-none transition focus:border-[var(--qm-accent)]">
            <option>Inquiry Type</option>
            <option>Ticket Information</option>
            <option>Sponsorship</option>
            <option>Partnership</option>
            <option>General Question</option>
          </select>
          <textarea rows="4" placeholder="Your message..." class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3.5 text-sm text-[var(--qm-text)] outline-none transition placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)]"></textarea>
          <button type="submit" class="w-full rounded-full bg-[var(--qm-accent)] py-4 text-sm font-bold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/25 transition hover:opacity-90" data-qay-hover="scale">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── FOOTER ─── */
  {
    id: 'event-footer-luxe',
    site_type: 'event',
    section_type: 'footer',
    theme_id: 'dark-luxe',
    keywords: ['footer', 'event', 'dark', 'links', 'luxe'],
    preview_description: 'Dark luxe footer with accent glow border, multi-column links, and social proof.',
    rank: 88,
    html: `<footer class="relative overflow-hidden border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text-muted)]" data-qay-animate="fade-in">
  <!-- Top glow line -->
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--qm-accent)]/50 to-transparent"></div>
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-4">
      <div>
        <p class="text-xl font-bold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand"><span class="text-[var(--qm-accent)]">&#10022;</span> Momentus</p>
        <p class="mt-4 text-sm leading-6" data-qm="footer-tagline">Creating unforgettable moments through world-class events, performances, and experiences.</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Event</p>
        <div class="mt-4 flex flex-col gap-3 text-sm">
          <a href="/schedule" class="transition hover:text-[var(--qm-text)]">Schedule</a>
          <a href="/speakers" class="transition hover:text-[var(--qm-text)]">Speakers</a>
          <a href="/gallery" class="transition hover:text-[var(--qm-text)]">Gallery</a>
          <a href="/tickets" class="transition hover:text-[var(--qm-text)]">Tickets</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Company</p>
        <div class="mt-4 flex flex-col gap-3 text-sm">
          <a href="/about" class="transition hover:text-[var(--qm-text)]">About Us</a>
          <a href="/partners" class="transition hover:text-[var(--qm-text)]">Partners</a>
          <a href="/press" class="transition hover:text-[var(--qm-text)]">Press Kit</a>
          <a href="/careers" class="transition hover:text-[var(--qm-text)]">Careers</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Connect</p>
        <div class="mt-4 space-y-3 text-sm">
          <p data-qm="footer-email">hello@momentusevents.com</p>
          <p data-qm="footer-phone">+1 (555) 789-0123</p>
          <p data-qm="footer-address">New York, NY</p>
        </div>
        <div class="mt-6 flex gap-4 text-lg">
          <a href="#" class="transition hover:text-[var(--qm-accent)]" aria-label="Instagram">&#128247;</a>
          <a href="#" class="transition hover:text-[var(--qm-accent)]" aria-label="Twitter">&#128172;</a>
          <a href="#" class="transition hover:text-[var(--qm-accent)]" aria-label="YouTube">&#127909;</a>
        </div>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-xs md:flex-row">
      <p data-qm="footer-copy">&copy; 2024 Momentus Events. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="/privacy" class="transition hover:text-[var(--qm-text)]">Privacy</a>
        <a href="/terms" class="transition hover:text-[var(--qm-text)]">Terms</a>
        <a href="/cookies" class="transition hover:text-[var(--qm-text)]">Cookies</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
