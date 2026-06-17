import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'medical-theme-vitalis',
    site_type: 'medical',
    theme_id: 'vitalis',
    label: 'Vitalis Clinical',
    keywords: ['medical', 'clinic', 'hospital', 'doctor', 'health', 'dental', 'therapy', 'wellness', 'pharmacy', 'teal', 'clean'],
    css_variables: {
      '--qm-bg': '#f4f9fa',
      '--qm-surface': '#ffffff',
      '--qm-text': '#0c1c24',
      '--qm-text-muted': '#5a7080',
      '--qm-accent': '#0d9488',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(12,28,36,0.08)',
      '--qm-heading-font': '"Plus Jakarta Sans", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Plus+Jakarta+Sans:wght@400;500;600;700;800', 'Inter:wght@400;500;600'],
    is_dark: false,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ─────────── NAV ─────────── */
  {
    id: 'medical-nav-luxe',
    site_type: 'medical',
    section_type: 'nav',
    theme_id: 'vitalis',
    keywords: ['nav', 'medical', 'clinic', 'header', 'navigation', 'sticky'],
    preview_description: 'Clean clinical navigation with appointment CTA and glassmorphism blur.',
    rank: 94,
    html: `<nav class="sticky top-0 z-50 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5 hover:opacity-85 transition" data-qm="brand-name">
      <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--qm-accent)] text-sm font-bold text-[var(--qm-accent-text)]">V</span>
      <span class="text-lg font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Vitalis Health</span>
    </a>
    <div class="hidden items-center gap-8 text-[13px] font-semibold md:flex" style="font-family:var(--qm-body-font)">
      <a href="/services" class="hover:text-[var(--qm-accent)] transition">Services</a>
      <a href="/team" class="hover:text-[var(--qm-accent)] transition">Our Team</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">About</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition">Contact</a>
      <a href="/book" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] shadow-md hover:shadow-lg hover:scale-105 active:scale-[0.98] transition duration-200">Book Appointment</a>
    </div>
    <button type="button" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2 text-sm font-semibold md:hidden" data-qay-click="toggle" data-qay-target="#medical-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="medical-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/services" class="text-sm font-semibold py-1">Services</a>
    <a href="/team" class="text-sm font-semibold py-1">Our Team</a>
    <a href="/about" class="text-sm font-semibold py-1">About</a>
    <a href="/contact" class="text-sm font-semibold py-1">Contact</a>
    <a href="/book" class="mt-2 rounded-xl bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--qm-accent-text)]">Book Appointment</a>
  </div>
</nav>`,
  },

  /* ─────────── HERO ─────────── */
  {
    id: 'medical-hero-luxe',
    site_type: 'medical',
    section_type: 'hero',
    theme_id: 'vitalis',
    keywords: ['hero', 'medical', 'clinic', 'health', 'bento', 'appointment', 'luxe-reveal'],
    preview_description: 'Asymmetric clinical hero with Bento stat cards, calming imagery, and smooth entrance animations.',
    rank: 96,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 lg:py-28 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
    <div class="space-y-7" data-qay-animate="luxe-reveal" data-qay-duration="1.1">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-accent)]">
        <span class="h-1.5 w-1.5 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
        Now Accepting New Patients
      </div>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        Modern Care,<br/>Built Around <span class="text-[var(--qm-accent)]">You</span>.
      </h1>
      <p class="max-w-lg text-base leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">
        At Vitalis Health, we combine advanced diagnostics with compassionate care. From routine checkups to specialist consultations &mdash; your health journey starts here.
      </p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a href="/book" class="rounded-xl bg-[var(--qm-accent)] px-7 py-3.5 text-sm font-bold text-[var(--qm-accent-text)] shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition duration-200">Book Appointment &rarr;</a>
        <a href="/services" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-7 py-3.5 text-sm font-semibold hover:bg-[var(--qm-bg)] transition duration-200">Our Services</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] col-span-2 aspect-[16/10]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&auto=format&q=85" alt="Modern medical clinic interior with clean design" class="h-full w-full object-cover" />
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">15k+</p>
        <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Patients Treated</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">98%</p>
        <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Satisfaction Rate</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── SERVICES ─────────── */
  {
    id: 'medical-services-bento',
    site_type: 'medical',
    section_type: 'services',
    theme_id: 'vitalis',
    keywords: ['services', 'medical', 'bento', 'specialties', 'departments', 'care'],
    preview_description: 'Bento grid service cards with icons, descriptions, and hover lifts for each medical department.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="max-w-2xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Our Services</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Comprehensive Care, One Roof</h2>
      <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed max-w-xl" style="font-family:var(--qm-body-font)">From preventive screenings to specialized treatment plans, our multi-disciplinary team provides personalized healthcare for every stage of life.</p>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Service 1: Primary Care - spans 2 cols -->
      <article class="md:col-span-2 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 flex flex-col md:flex-row gap-6 md:items-center" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#x1F3E5;</div>
        <div class="space-y-2 flex-1">
          <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)">Primary Care</h3>
          <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed">Routine physicals, chronic disease management, and preventive screenings. Your first step to a healthier life with a dedicated physician.</p>
        </div>
        <a href="/services" class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)] shrink-0">Learn more &rarr;</a>
      </article>

      <!-- Service 2: Cardiology -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-4" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#x2764;&#xFE0F;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)">Cardiology</h3>
        <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed">Advanced cardiac diagnostics, stress tests, and heart health monitoring with experienced cardiologists.</p>
        <a href="/services" class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</a>
      </article>

      <!-- Service 3: Pediatrics -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-4" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#x1F476;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)">Pediatrics</h3>
        <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed">Compassionate care for infants through adolescents &mdash; vaccinations, growth monitoring, and developmental checkups.</p>
        <a href="/services" class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</a>
      </article>

      <!-- Service 4: Diagnostics -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-4" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#x1F52C;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)">Diagnostics &amp; Lab</h3>
        <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed">Same-day blood work, imaging, and pathology reports with our in-house state-of-the-art laboratory.</p>
        <a href="/services" class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</a>
      </article>

      <!-- Service 5: Wellness -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-accent)] p-8 space-y-4 text-[var(--qm-accent-text)]" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl">&#x1F33F;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)">Wellness Programs</h3>
        <p class="text-sm opacity-85 leading-relaxed">Holistic wellness packages including nutrition counseling, mental health support, and lifestyle coaching.</p>
        <a href="/services" class="text-xs font-bold uppercase tracking-wider opacity-85">Explore programs &rarr;</a>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ─────────── TEAM ─────────── */
  {
    id: 'medical-team-bento',
    site_type: 'medical',
    section_type: 'team',
    theme_id: 'vitalis',
    keywords: ['team', 'doctors', 'physicians', 'medical', 'bento', 'portraits', 'staff'],
    preview_description: 'Premium physician team grid with portrait photos, specialties, and smooth hover transitions.',
    rank: 88,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="text-center max-w-2xl mx-auto space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Meet Our Doctors</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Expert Care, Trusted Hands</h2>
      <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed" style="font-family:var(--qm-body-font)">Board-certified physicians dedicated to delivering the highest standard of clinical care.</p>
    </div>
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
      <!-- Doctor 1 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&q=85" alt="Dr. Sarah Chen portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">Dr. Sarah Chen</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Internal Medicine</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">15+ years experience</p>
        </div>
      </article>

      <!-- Doctor 2 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&q=85" alt="Dr. James Okafor portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">Dr. James Okafor</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Cardiology</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">12+ years experience</p>
        </div>
      </article>

      <!-- Doctor 3 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&q=85" alt="Dr. Emily Rivera portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">Dr. Emily Rivera</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Pediatrics</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">10+ years experience</p>
        </div>
      </article>

      <!-- Doctor 4 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&q=85" alt="Dr. Michael Adesanya portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">Dr. Michael Adesanya</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Orthopedics</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">18+ years experience</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ─────────── STATS ─────────── */
  {
    id: 'medical-stats-luxe',
    site_type: 'medical',
    section_type: 'stats',
    theme_id: 'vitalis',
    keywords: ['stats', 'metrics', 'medical', 'trust', 'numbers', 'proof'],
    preview_description: 'Clinical trust metrics with large stat numbers, descriptive labels, and clean card layout.',
    rank: 86,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-y border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="max-w-xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Our Impact</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Numbers That Speak to Trust</h2>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">15k+</p>
        <h3 class="text-sm font-bold">Patients Treated</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Trusted by thousands of families across the community since 2009.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">30+</p>
        <h3 class="text-sm font-bold">Specialists</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Board-certified physicians across cardiology, pediatrics, and more.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">98%</p>
        <h3 class="text-sm font-bold">Satisfaction Rate</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Based on annual patient surveys and Google Health reviews.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">24/7</p>
        <h3 class="text-sm font-bold">Emergency Line</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Round-the-clock urgent care and telemedicine consultations.</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── TESTIMONIALS ─────────── */
  {
    id: 'medical-testimonials-luxe',
    site_type: 'medical',
    section_type: 'testimonials',
    theme_id: 'vitalis',
    keywords: ['testimonials', 'reviews', 'medical', 'patients', 'trust', 'proof'],
    preview_description: 'Patient testimonials with quote cards, avatars, and staggered reveal animations.',
    rank: 85,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="text-center max-w-2xl mx-auto space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Patient Stories</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">What Our Patients Say</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Testimonial 1 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <div class="flex gap-1 text-[var(--qm-accent)]">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"The team at Vitalis made me feel safe from the very first visit. Dr. Chen took the time to explain every test and treatment option. I have never felt more cared for at a clinic."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-[var(--qm-border)]">
          <div class="h-10 w-10 rounded-full bg-[var(--qm-accent)]/10 flex items-center justify-center text-sm font-bold text-[var(--qm-accent)]">AM</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Amara Mitchell</p>
            <p class="text-[11px] text-[var(--qm-text-muted)]">Patient since 2021</p>
          </div>
        </div>
      </article>

      <!-- Testimonial 2 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <div class="flex gap-1 text-[var(--qm-accent)]">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"After my cardiac scare, Dr. Okafor and the cardiology team provided outstanding follow-up care. The clinic is modern, clean, and genuinely world-class."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-[var(--qm-border)]">
          <div class="h-10 w-10 rounded-full bg-[var(--qm-accent)]/10 flex items-center justify-center text-sm font-bold text-[var(--qm-accent)]">DK</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">David Kim</p>
            <p class="text-[11px] text-[var(--qm-text-muted)]">Patient since 2019</p>
          </div>
        </div>
      </article>

      <!-- Testimonial 3 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-accent)] p-8 space-y-5 text-[var(--qm-accent-text)] flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <div class="flex gap-1 text-white/80">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
          <p class="text-sm leading-relaxed opacity-90">"My kids love coming to Vitalis! Dr. Rivera is incredibly patient and makes every visit fun. The pediatric wing is bright, welcoming, and designed for families."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-white/20">
          <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">LS</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Lisa Santos</p>
            <p class="text-[11px] opacity-75">Patient since 2020</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ─────────── CONTACT ─────────── */
  {
    id: 'medical-contact-luxe',
    site_type: 'medical',
    section_type: 'contact',
    theme_id: 'vitalis',
    keywords: ['contact', 'medical', 'appointment', 'form', 'location', 'phone'],
    preview_description: 'Clinical contact section with appointment form, location info, and operating hours grid.',
    rank: 84,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
    <div class="space-y-8" data-qay-animate="slide-right">
      <div class="space-y-4">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Get in Touch</p>
        <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Book Your Visit Today</h2>
        <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed max-w-md" style="font-family:var(--qm-body-font)">Schedule an appointment online or contact us directly. Walk-ins welcome during regular hours.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2">
          <p class="text-lg">&#x1F4CD;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Location</h4>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">142 Wellness Boulevard, Suite 300<br/>Victoria Island, Lagos</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2">
          <p class="text-lg">&#x1F4DE;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Phone</h4>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">+234 (0) 812 345 6789<br/>Emergency: +234 (0) 800 VITALIS</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2">
          <p class="text-lg">&#x1F552;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Hours</h4>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Mon &ndash; Fri: 8AM &ndash; 6PM<br/>Sat: 9AM &ndash; 2PM</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2">
          <p class="text-lg">&#x2709;&#xFE0F;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Email</h4>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">hello@vitalishealth.com<br/>appointments@vitalishealth.com</p>
        </div>
      </div>
    </div>
    <div data-qay-animate="slide-up">
      <form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-5">
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)">Request an Appointment</h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">First Name</label>
            <input type="text" placeholder="John" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--qm-accent)] transition" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Last Name</label>
            <input type="text" placeholder="Doe" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--qm-accent)] transition" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Email Address</label>
          <input type="email" placeholder="john@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--qm-accent)] transition" />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Department</label>
          <select class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--qm-accent)] transition">
            <option>Primary Care</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Diagnostics</option>
            <option>Wellness</option>
          </select>
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Message</label>
          <textarea rows="3" placeholder="Tell us about your needs..." class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm outline-none resize-none focus:border-[var(--qm-accent)] transition"></textarea>
        </div>
        <button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] px-6 py-3.5 text-sm font-bold text-[var(--qm-accent-text)] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition duration-200">Submit Request &rarr;</button>
      </form>
    </div>
  </div>
</section>`,
  },

  /* ─────────── FOOTER ─────────── */
  {
    id: 'medical-footer-luxe',
    site_type: 'medical',
    section_type: 'footer',
    theme_id: 'vitalis',
    keywords: ['footer', 'medical', 'clinic', 'links', 'copyright'],
    preview_description: 'Multi-column clinical footer with brand, navigation, and emergency contact info.',
    rank: 82,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
    <div class="space-y-5">
      <div class="flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--qm-accent)] text-sm font-bold text-[var(--qm-accent-text)]">V</span>
        <p class="text-xl font-extrabold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Vitalis Health</p>
      </div>
      <p class="max-w-sm text-xs leading-relaxed">Modern, patient-centered healthcare for the whole family. Trusted by 15,000+ patients across the community.</p>
      <p class="text-xs text-[var(--qm-accent)] font-semibold">Emergency Line: +234 (0) 800 VITALIS</p>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Services</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/services" class="hover:text-[var(--qm-text)] transition">Primary Care</a>
        <a href="/services" class="hover:text-[var(--qm-text)] transition">Cardiology</a>
        <a href="/services" class="hover:text-[var(--qm-text)] transition">Pediatrics</a>
        <a href="/services" class="hover:text-[var(--qm-text)] transition">Diagnostics</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Clinic</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/team" class="hover:text-[var(--qm-text)] transition">Our Doctors</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition">About Us</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition">Contact</a>
        <a href="/book" class="hover:text-[var(--qm-text)] transition">Appointments</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Legal</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Privacy Policy</a>
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Terms of Service</a>
        <a href="/hipaa" class="hover:text-[var(--qm-text)] transition">HIPAA Notice</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
    <p>&copy; 2026 Vitalis Health. All rights reserved.</p>
    <p>Committed to excellence in patient care &bull; Since 2009</p>
  </div>
</footer>`,
  },
];
