import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'fitness-theme-neon-dark',
    site_type: 'fitness',
    theme_id: 'neon-dark',
    label: 'Neon Dark',
    keywords: ['gym', 'fitness', 'dark', 'energetic', 'neon', 'premium', 'workout', 'training', 'athlete', 'bold'],
    css_variables: {
      '--qm-bg': '#0f0f13',
      '--qm-surface': '#1a1a22',
      '--qm-text': '#f2f0e8',
      '--qm-text-muted': '#8a8680',
      '--qm-accent': '#22d3ee',
      '--qm-accent-text': '#0f0f13',
      '--qm-border': 'rgba(242,240,232,0.10)',
      '--qm-heading-font': '"Oswald", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Oswald:wght@400;500;600;700', 'Inter:wght@400;500;600;700'],
    is_dark: true,
    rank: 95,
  },
];

export const sections: QmSection[] = [
  /* ── NAV ── */
  {
    id: 'fitness-nav-neon',
    site_type: 'fitness',
    section_type: 'nav',
    theme_id: 'neon-dark',
    keywords: ['nav', 'gym', 'dark', 'neon', 'booking', 'sticky'],
    preview_description: 'Dark sticky navigation with neon accent CTA and mobile drawer for Iron Axis gym.',
    rank: 95,
    html: `<nav class="sticky top-0 z-50 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur-lg" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between">
    <a href="/" class="text-2xl font-bold uppercase tracking-[0.2em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Iron Axis</a>
    <div class="hidden items-center gap-8 text-sm font-medium md:flex" style="font-family:var(--qm-body-font)">
      <a href="#programs" class="text-[var(--qm-text-muted)] transition hover:text-[var(--qm-accent)]">Programs</a>
      <a href="#schedule" class="text-[var(--qm-text-muted)] transition hover:text-[var(--qm-accent)]">Schedule</a>
      <a href="#coaches" class="text-[var(--qm-text-muted)] transition hover:text-[var(--qm-accent)]">Coaches</a>
      <a href="#pricing" class="text-[var(--qm-text-muted)] transition hover:text-[var(--qm-accent)]">Pricing</a>
      <a href="/join" class="bg-[var(--qm-accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="nav-cta">Start Training</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center border border-[var(--qm-border)] text-xs uppercase tracking-wider md:hidden" data-qay-click="toggle" data-qay-target="#fitness-mobile-menu" data-qay-class="hidden" aria-controls="fitness-mobile-menu" aria-expanded="false">Menu</button>
  </div>
  <div id="fitness-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-sm text-[var(--qm-text)] shadow-2xl backdrop-blur-lg md:hidden">
    <a href="#programs" class="py-2">Programs</a>
    <a href="#schedule" class="py-2">Schedule</a>
    <a href="#coaches" class="py-2">Coaches</a>
    <a href="#pricing" class="py-2">Pricing</a>
    <a href="/join" class="mt-2 bg-[var(--qm-accent)] px-5 py-3 text-center font-bold uppercase text-[var(--qm-accent-text)]">Start Training</a>
  </div>
</nav>`,
  },

  /* ── HERO ── */
  {
    id: 'fitness-hero-neon',
    site_type: 'fitness',
    section_type: 'hero',
    theme_id: 'neon-dark',
    keywords: ['hero', 'gym', 'dark', 'neon', 'dramatic', 'athlete', 'split', 'energetic'],
    preview_description: 'Full-impact split hero with dramatic gym imagery, neon accents, and stat badges for Iron Axis.',
    rank: 96,
    html: `<section class="relative min-h-[800px] bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
    <div class="flex flex-col justify-center px-6 py-24 md:px-14 lg:py-32" data-qay-animate="slide-right" data-qay-duration="1.0">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/30 bg-[var(--qm-accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">
        <span class="inline-block size-2 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
        Now accepting new members
      </div>
      <h1 class="mt-8 text-5xl font-bold uppercase leading-[0.92] md:text-7xl lg:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Forge your <span class="text-[var(--qm-accent)]">strongest</span> chapter yet.</h1>
      <p class="mt-8 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">Elite strength training, functional conditioning, and expert coaching in a facility built for athletes who refuse to plateau.</p>
      <div class="mt-10 flex flex-col gap-3 sm:flex-row">
        <a href="/join" class="bg-[var(--qm-accent)] px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-[var(--qm-accent-text)] transition hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]" data-qay-hover="scale" data-qm="hero-cta-primary">Start Free Trial</a>
        <a href="#programs" class="border border-[var(--qm-border)] px-8 py-4 text-center text-sm font-medium uppercase tracking-wider text-[var(--qm-text)] transition hover:border-[var(--qm-accent)]" data-qm="hero-cta-secondary">View Programs</a>
      </div>
      <div class="mt-14 grid grid-cols-3 gap-6 border-t border-[var(--qm-border)] pt-8" data-qay-animate="stagger-children">
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="hero-stat-1-value">2,400+</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="hero-stat-1-label">Active Members</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="hero-stat-2-value">15+</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="hero-stat-2-label">Expert Coaches</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="hero-stat-3-value">40+</p>
          <p class="mt-1 text-xs uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="hero-stat-3-label">Weekly Classes</p>
        </div>
      </div>
    </div>
    <div class="relative min-h-[600px] overflow-hidden lg:min-h-full" data-qay-hover="img-zoom">
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&q=85" alt="Athletes training with heavy weights in a premium gym facility" class="absolute inset-0 h-full w-full object-cover" data-qm="hero-image" />
      <div class="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--qm-bg)]/60"></div>
      <div class="absolute bottom-6 right-6 rounded-lg border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-5 py-3 backdrop-blur-md" data-qay-animate="scale-in">
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Open 5am &ndash; 11pm</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── FEATURES / PROGRAMS ── */
  {
    id: 'fitness-features-neon',
    site_type: 'fitness',
    section_type: 'features',
    theme_id: 'neon-dark',
    keywords: ['features', 'programs', 'bento', 'gym', 'training', 'cards', 'grid'],
    preview_description: 'Bento grid program showcase with glassmorphism cards, neon hover effects, and program images.',
    rank: 94,
    html: `<section id="programs" class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="features-eyebrow">Training programs</p>
        <h2 class="mt-4 text-4xl font-bold uppercase md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="features-title">Built for every level.</h2>
      </div>
      <p class="max-w-md text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="features-subtitle">From beginner foundations to advanced athletic performance, every program is coached, tracked, and designed for results.</p>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- Program 1 — Large card -->
      <div class="group relative row-span-2 overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] lg:col-span-2" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&q=85" alt="Strength training with barbells" class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="feature-1-image" />
        <div class="p-8">
          <span class="text-2xl">&#127947;</span>
          <h3 class="mt-3 text-2xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="feature-1-title">Strength &amp; Power</h3>
          <p class="mt-3 max-w-lg text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-1-desc">Progressive barbell programming with periodized cycles. Squat, deadlift, bench, and Olympic lifts coached with precision form analysis and tracking.</p>
          <div class="mt-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">
            <span>60 min</span>
            <span class="h-1 w-1 rounded-full bg-[var(--qm-accent)]"></span>
            <span>All levels</span>
            <span class="h-1 w-1 rounded-full bg-[var(--qm-accent)]"></span>
            <span>Coach-led</span>
          </div>
        </div>
      </div>
      <!-- Program 2 -->
      <div class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&auto=format&q=85" alt="High-intensity functional training" class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="feature-2-image" />
        <div class="p-6">
          <span class="text-xl">&#128293;</span>
          <h3 class="mt-2 text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="feature-2-title">HIIT &amp; Conditioning</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="feature-2-desc">Heart-rate-driven intervals that shred fat and build endurance. New workout every day.</p>
        </div>
      </div>
      <!-- Program 3 -->
      <div class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&q=85" alt="Yoga and mobility session" class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="feature-3-image" />
        <div class="p-6">
          <span class="text-xl">&#129495;</span>
          <h3 class="mt-2 text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="feature-3-title">Mobility &amp; Recovery</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="feature-3-desc">Yoga, stretching, and guided recovery to keep you moving well and injury-free.</p>
        </div>
      </div>
      <!-- Program 4 -->
      <div class="rounded-2xl border border-[var(--qm-accent)]/20 bg-gradient-to-br from-[var(--qm-accent)]/10 to-[var(--qm-bg)] p-8 lg:col-span-2" data-qay-hover="luxe-lift">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span class="text-2xl">&#127941;</span>
            <h3 class="mt-3 text-2xl font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="feature-4-title">1-on-1 Coaching</h3>
            <p class="mt-3 max-w-md text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-4-desc">Fully personalized programming, nutrition guidance, and accountability from a dedicated coach who knows your goals inside out.</p>
          </div>
          <a href="/join" class="shrink-0 bg-[var(--qm-accent)] px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-[var(--qm-accent-text)] transition hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]" data-qay-hover="scale" data-qm="feature-4-cta">Book a Session</a>
        </div>
      </div>
      <!-- Program 5 -->
      <div class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&q=85" alt="Boxing and combat training" class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" data-qm="feature-5-image" />
        <div class="p-6">
          <span class="text-xl">&#129354;</span>
          <h3 class="mt-2 text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="feature-5-title">Combat &amp; Boxing</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="feature-5-desc">Bag work, pad drills, and sparring fundamentals that build confidence and conditioning.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── SCHEDULE ── */
  {
    id: 'fitness-schedule-neon',
    site_type: 'fitness',
    section_type: 'schedule',
    theme_id: 'neon-dark',
    keywords: ['schedule', 'classes', 'timetable', 'gym', 'calendar', 'weekly'],
    preview_description: 'Weekly class schedule with neon-highlighted time slots, coach names, and level indicators.',
    rank: 92,
    html: `<section id="schedule" class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="scroll-reveal">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="schedule-eyebrow">Weekly schedule</p>
      <h2 class="mt-4 text-4xl font-bold uppercase md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="schedule-title">Find your session.</h2>
      <p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="schedule-subtitle">Drop in to any class or book your spot in advance. All sessions included in your membership.</p>
    </div>
    <div class="mt-14 overflow-x-auto">
      <div class="min-w-[800px]">
        <!-- Day headers -->
        <div class="grid grid-cols-6 gap-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">
          <div class="p-3">Time</div>
          <div class="p-3">Monday</div>
          <div class="p-3">Tuesday</div>
          <div class="p-3">Wednesday</div>
          <div class="p-3">Thursday</div>
          <div class="p-3">Friday</div>
        </div>
        <!-- 6 AM row -->
        <div class="mt-2 grid grid-cols-6 gap-3" data-qay-animate="stagger-children">
          <div class="flex items-center justify-center rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-sm font-bold text-[var(--qm-accent)]" data-qm="schedule-time-1">6:00 AM</div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-1-1-class">Strength</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-1-1-coach">Coach Rivera</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-1-2-class">HIIT</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-1-2-coach">Coach Blake</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-1-3-class">Strength</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-1-3-coach">Coach Rivera</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-1-4-class">HIIT</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-1-4-coach">Coach Blake</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-1-5-class">Strength</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-1-5-coach">Coach Rivera</p>
          </div>
        </div>
        <!-- 9 AM row -->
        <div class="mt-3 grid grid-cols-6 gap-3" data-qay-animate="stagger-children">
          <div class="flex items-center justify-center rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-sm font-bold text-[var(--qm-accent)]" data-qm="schedule-time-2">9:00 AM</div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-2-1-class">Mobility</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-2-1-coach">Coach Lena</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-2-2-class">Boxing</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-2-2-coach">Coach Diaz</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-2-3-class">Mobility</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-2-3-coach">Coach Lena</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-2-4-class">Boxing</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-2-4-coach">Coach Diaz</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-2-5-class">Yoga Flow</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-2-5-coach">Coach Lena</p>
          </div>
        </div>
        <!-- 12 PM row -->
        <div class="mt-3 grid grid-cols-6 gap-3" data-qay-animate="stagger-children">
          <div class="flex items-center justify-center rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-sm font-bold text-[var(--qm-accent)]" data-qm="schedule-time-3">12:00 PM</div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-3-1-class">Power Lift</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-3-1-coach">Coach Kai</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-3-2-class">Conditioning</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-3-2-coach">Coach Blake</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-3-3-class">Power Lift</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-3-3-coach">Coach Kai</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-3-4-class">Conditioning</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-3-4-coach">Coach Blake</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-3-5-class">Open Gym</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-3-5-coach">All Coaches</p>
          </div>
        </div>
        <!-- 6 PM row -->
        <div class="mt-3 grid grid-cols-6 gap-3" data-qay-animate="stagger-children">
          <div class="flex items-center justify-center rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-sm font-bold text-[var(--qm-accent)]" data-qm="schedule-time-4">6:00 PM</div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-4-1-class">CrossFit</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-4-1-coach">Coach Rivera</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-4-2-class">Strength</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-4-2-coach">Coach Kai</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-4-3-class">Boxing</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-4-3-coach">Coach Diaz</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 p-4 transition hover:border-[var(--qm-accent)]/50" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-4-4-class">CrossFit</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-4-4-coach">Coach Rivera</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
            <p class="text-sm font-bold" data-qm="schedule-4-5-class">Open Gym</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="schedule-4-5-coach">All Coaches</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 text-center">
      <a href="/schedule" class="inline-flex items-center gap-2 border border-[var(--qm-accent)] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[var(--qm-accent)] transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]" data-qay-hover="scale" data-qm="schedule-cta">View Full Schedule &rarr;</a>
    </div>
  </div>
</section>`,
  },

  /* ── TEAM / COACHES ── */
  {
    id: 'fitness-team-neon',
    site_type: 'fitness',
    section_type: 'team',
    theme_id: 'neon-dark',
    keywords: ['team', 'coaches', 'trainers', 'staff', 'profiles', 'grid'],
    preview_description: 'Coach profiles in a staggered grid with specializations and neon hover accents.',
    rank: 90,
    html: `<section id="coaches" class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="team-eyebrow">Expert coaching staff</p>
      <h2 class="mt-4 text-4xl font-bold uppercase md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">Meet your coaches.</h2>
      <p class="mx-auto mt-5 max-w-lg text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="team-subtitle">Certified professionals who train alongside you. Every coach brings competition-tested experience and a genuine passion for your progress.</p>
    </div>
    <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Coach 1 -->
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="relative h-72 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&auto=format&q=85" alt="Fitness coach portrait" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" data-qm="coach-1-image" />
          <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-transparent to-transparent"></div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="coach-1-name">Marcus Rivera</h3>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="coach-1-role">Head Strength Coach</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="coach-1-bio">CSCS certified. 12 years of powerlifting coaching. Former national-level competitor.</p>
        </div>
      </div>
      <!-- Coach 2 -->
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40 lg:mt-8" data-qay-hover="luxe-lift">
        <div class="relative h-72 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&q=85" alt="Female fitness coach" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" data-qm="coach-2-image" />
          <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-transparent to-transparent"></div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="coach-2-name">Lena Okafor</h3>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="coach-2-role">Mobility &amp; Yoga Lead</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="coach-2-bio">RYT-500 yoga instructor specializing in athlete recovery and movement quality.</p>
        </div>
      </div>
      <!-- Coach 3 -->
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="relative h-72 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&q=85" alt="Personal trainer working with client" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" data-qm="coach-3-image" />
          <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-transparent to-transparent"></div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="coach-3-name">Jason Blake</h3>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="coach-3-role">HIIT &amp; Conditioning</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="coach-3-bio">CrossFit L3. Builds savage conditioning programs that make everything else feel easier.</p>
        </div>
      </div>
      <!-- Coach 4 -->
      <div class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] transition hover:border-[var(--qm-accent)]/40 lg:mt-8" data-qay-hover="luxe-lift">
        <div class="relative h-72 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&q=85" alt="Boxing coach in gym" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" data-qm="coach-4-image" />
          <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-transparent to-transparent"></div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="coach-4-name">Sofia Diaz</h3>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="coach-4-role">Combat &amp; Boxing</p>
          <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="coach-4-bio">Pro boxing background with 8 years of combat sports coaching. Makes training addictive.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── TESTIMONIALS ── */
  {
    id: 'fitness-testimonials-neon',
    site_type: 'fitness',
    section_type: 'testimonials',
    theme_id: 'neon-dark',
    keywords: ['testimonials', 'reviews', 'members', 'results', 'transformation'],
    preview_description: 'Member transformation testimonials with before/after stats and glassmorphic cards.',
    rank: 88,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="scroll-reveal">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="testimonials-eyebrow">Member stories</p>
      <h2 class="mt-4 text-4xl font-bold uppercase md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="testimonials-title">Results speak louder.</h2>
    </div>
    <div class="mt-14 grid gap-5 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Testimonial 1 -->
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-1 text-[var(--qm-accent)]">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <blockquote class="mt-5 text-base leading-7 text-[var(--qm-text)]" data-qm="testimonial-1-quote">&ldquo;I came in barely able to squat the bar. Eight months later I hit a 315lb deadlift. The coaching here changed my entire relationship with fitness.&rdquo;</blockquote>
        <div class="mt-6 flex items-center gap-4 border-t border-[var(--qm-border)] pt-6">
          <div class="flex size-12 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-lg font-bold text-[var(--qm-accent)]" data-qm="testimonial-1-avatar">DK</div>
          <div>
            <p class="text-sm font-bold" data-qm="testimonial-1-name">David Kim</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="testimonial-1-detail">Member for 8 months</p>
          </div>
        </div>
      </div>
      <!-- Testimonial 2 -->
      <div class="rounded-2xl border border-[var(--qm-accent)]/20 bg-gradient-to-b from-[var(--qm-accent)]/5 to-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-1 text-[var(--qm-accent)]">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <blockquote class="mt-5 text-base leading-7 text-[var(--qm-text)]" data-qm="testimonial-2-quote">&ldquo;The 6am crew is now my second family. The energy at Iron Axis is unmatched &mdash; every session pushes me to be better than yesterday.&rdquo;</blockquote>
        <div class="mt-6 flex items-center gap-4 border-t border-[var(--qm-border)] pt-6">
          <div class="flex size-12 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-lg font-bold text-[var(--qm-accent)]" data-qm="testimonial-2-avatar">AP</div>
          <div>
            <p class="text-sm font-bold" data-qm="testimonial-2-name">Aisha Patel</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="testimonial-2-detail">Member for 2 years</p>
          </div>
        </div>
      </div>
      <!-- Testimonial 3 -->
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-1 text-[var(--qm-accent)]">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <blockquote class="mt-5 text-base leading-7 text-[var(--qm-text)]" data-qm="testimonial-3-quote">&ldquo;As a former D1 athlete, I was skeptical any gym could match my training needs. Iron Axis exceeded every expectation. World-class facility.&rdquo;</blockquote>
        <div class="mt-6 flex items-center gap-4 border-t border-[var(--qm-border)] pt-6">
          <div class="flex size-12 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-lg font-bold text-[var(--qm-accent)]" data-qm="testimonial-3-avatar">MJ</div>
          <div>
            <p class="text-sm font-bold" data-qm="testimonial-3-name">Marcus Johnson</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="testimonial-3-detail">Member for 14 months</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── PRICING ── */
  {
    id: 'fitness-pricing-neon',
    site_type: 'fitness',
    section_type: 'pricing',
    theme_id: 'neon-dark',
    keywords: ['pricing', 'membership', 'plans', 'gym', 'subscribe'],
    preview_description: 'Three-tier membership pricing with neon-highlighted popular plan, feature lists, and CTAs.',
    rank: 92,
    html: `<section id="pricing" class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-6xl">
    <div class="text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="pricing-eyebrow">Membership plans</p>
      <h2 class="mt-4 text-4xl font-bold uppercase md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="pricing-title">Invest in yourself.</h2>
      <p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="pricing-subtitle">No contracts, no hidden fees. Cancel anytime. Every plan includes full facility access.</p>
    </div>
    <div class="mt-14 grid gap-5 md:grid-cols-3">
      <!-- Starter -->
      <div class="flex flex-col rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="pricing-1-label">Starter</p>
        <div class="mt-5 flex items-baseline gap-1">
          <span class="text-5xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="pricing-1-price">$49</span>
          <span class="text-sm text-[var(--qm-text-muted)]">/month</span>
        </div>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="pricing-1-desc">Perfect for getting started with guided training.</p>
        <ul class="mt-8 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-1-feature-1">Open gym access</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-1-feature-2">3 group classes / week</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-1-feature-3">Locker room access</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-1-feature-4">Fitness assessment</span></li>
        </ul>
        <a href="/join" class="mt-auto pt-8 block border border-[var(--qm-border)] px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-[var(--qm-text)] transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]" data-qm="pricing-1-cta">Get Started</a>
      </div>
      <!-- Pro (Featured) -->
      <div class="relative flex flex-col rounded-2xl border-2 border-[var(--qm-accent)] bg-[var(--qm-bg)] p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]" data-qay-hover="luxe-lift">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--qm-accent)] px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)]">Most Popular</div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="pricing-2-label">Pro</p>
        <div class="mt-5 flex items-baseline gap-1">
          <span class="text-5xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="pricing-2-price">$89</span>
          <span class="text-sm text-[var(--qm-text-muted)]">/month</span>
        </div>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="pricing-2-desc">Unlimited access for committed athletes.</p>
        <ul class="mt-8 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-2-feature-1">Unlimited group classes</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-2-feature-2">Open gym 5am&ndash;11pm</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-2-feature-3">Monthly body composition scan</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-2-feature-4">Recovery zone access</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-2-feature-5">Guest pass (1x/month)</span></li>
        </ul>
        <a href="/join" class="mt-auto pt-8 block bg-[var(--qm-accent)] px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-[var(--qm-accent-text)] transition hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]" data-qay-hover="scale" data-qm="pricing-2-cta">Join Now</a>
      </div>
      <!-- Elite -->
      <div class="flex flex-col rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="pricing-3-label">Elite</p>
        <div class="mt-5 flex items-baseline gap-1">
          <span class="text-5xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="pricing-3-price">$179</span>
          <span class="text-sm text-[var(--qm-text-muted)]">/month</span>
        </div>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="pricing-3-desc">Premium experience with personal coaching included.</p>
        <ul class="mt-8 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-3-feature-1">Everything in Pro</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-3-feature-2">4 personal training sessions/mo</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-3-feature-3">Custom nutrition plan</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-3-feature-4">Priority class booking</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="pricing-3-feature-5">Unlimited guest passes</span></li>
        </ul>
        <a href="/join" class="mt-auto pt-8 block border border-[var(--qm-border)] px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-[var(--qm-text)] transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]" data-qm="pricing-3-cta">Go Elite</a>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── FOOTER ── */
  {
    id: 'fitness-footer-neon',
    site_type: 'fitness',
    section_type: 'footer',
    theme_id: 'neon-dark',
    keywords: ['footer', 'links', 'gym', 'hours', 'location'],
    preview_description: 'Dark gym footer with location info, hours, quick links, and newsletter signup.',
    rank: 85,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)]" data-qay-animate="fade-in">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <!-- Brand -->
      <div>
        <p class="text-2xl font-bold uppercase tracking-[0.15em]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Iron Axis</p>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="footer-tagline">Premium strength &amp; conditioning facility. Train with purpose. Leave stronger.</p>
        <div class="mt-6 flex gap-4 text-[var(--qm-text-muted)]">
          <a href="#" class="transition hover:text-[var(--qm-accent)]" data-qm="footer-social-1">Instagram</a>
          <a href="#" class="transition hover:text-[var(--qm-accent)]" data-qm="footer-social-2">YouTube</a>
          <a href="#" class="transition hover:text-[var(--qm-accent)]" data-qm="footer-social-3">TikTok</a>
        </div>
      </div>
      <!-- Quick Links -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Quick Links</p>
        <div class="mt-5 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="#programs" class="transition hover:text-[var(--qm-text)]">Programs</a>
          <a href="#schedule" class="transition hover:text-[var(--qm-text)]">Class Schedule</a>
          <a href="#coaches" class="transition hover:text-[var(--qm-text)]">Coaches</a>
          <a href="#pricing" class="transition hover:text-[var(--qm-text)]">Membership</a>
          <a href="/join" class="transition hover:text-[var(--qm-text)]">Free Trial</a>
        </div>
      </div>
      <!-- Hours -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Hours</p>
        <div class="mt-5 flex flex-col gap-2 text-sm text-[var(--qm-text-muted)]">
          <p data-qm="footer-hours-1">Mon&ndash;Fri: 5:00am &ndash; 11:00pm</p>
          <p data-qm="footer-hours-2">Saturday: 6:00am &ndash; 9:00pm</p>
          <p data-qm="footer-hours-3">Sunday: 7:00am &ndash; 7:00pm</p>
        </div>
      </div>
      <!-- Location -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-accent)]">Location</p>
        <p class="mt-5 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="footer-address">247 Iron Street, Downtown District<br/>Los Angeles, CA 90015</p>
        <a href="tel:+13105551234" class="mt-3 block text-sm text-[var(--qm-accent)] transition hover:underline" data-qm="footer-phone">(310) 555-1234</a>
      </div>
    </div>
    <div class="mt-14 flex flex-col items-center gap-4 border-t border-[var(--qm-border)] pt-8 text-xs text-[var(--qm-text-muted)] md:flex-row md:justify-between">
      <p data-qm="footer-copyright">&copy; 2025 Iron Axis. All rights reserved.</p>
      <div class="flex gap-5">
        <a href="/privacy" class="transition hover:text-[var(--qm-text)]">Privacy Policy</a>
        <a href="/terms" class="transition hover:text-[var(--qm-text)]">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
