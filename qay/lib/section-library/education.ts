import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'education-theme-fresh-modern',
    site_type: 'education',
    theme_id: 'fresh-modern',
    label: 'Fresh Modern',
    keywords: ['education', 'academy', 'learning', 'courses', 'modern', 'bright', 'engaging', 'online', 'school'],
    css_variables: {
      '--qm-bg': '#f7f8fc',
      '--qm-surface': '#ffffff',
      '--qm-text': '#141834',
      '--qm-text-muted': '#5c6080',
      '--qm-accent': '#4f46e5',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(20,24,52,0.08)',
      '--qm-heading-font': '"Outfit", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Outfit:wght@400;500;600;700;800', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ─── NAV ─── */
  {
    id: 'education-nav-fresh',
    site_type: 'education',
    section_type: 'nav',
    theme_id: 'fresh-modern',
    keywords: ['navigation', 'education', 'academy', 'modern', 'sticky'],
    preview_description: 'Fresh modern navigation with rounded CTA and clean typography for online academy.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">
      <span class="text-[var(--qm-accent)]">&#9670;</span> Elevate Academy
    </a>
    <div class="hidden items-center gap-7 text-sm font-medium text-[var(--qm-text-muted)] md:flex" style="font-family:var(--qm-body-font)">
      <a href="/courses" class="transition hover:text-[var(--qm-text)]">Courses</a>
      <a href="/pricing" class="transition hover:text-[var(--qm-text)]">Pricing</a>
      <a href="/instructors" class="transition hover:text-[var(--qm-text)]">Instructors</a>
      <a href="/about" class="transition hover:text-[var(--qm-text)]">About</a>
      <a href="/login" class="text-[var(--qm-accent)] transition hover:opacity-80">Log In</a>
      <a href="/signup" class="rounded-full bg-[var(--qm-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="nav-cta">Start Free Trial</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-xl border border-[var(--qm-border)] text-sm md:hidden" data-qay-click="toggle" data-qay-target="#education-mobile-menu" data-qay-class="hidden" aria-controls="education-mobile-menu" aria-expanded="false">&#9776;</button>
  </div>
  <div id="education-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-sm font-medium text-[var(--qm-text)] shadow-2xl md:hidden">
    <a href="/courses">Courses</a><a href="/pricing">Pricing</a><a href="/instructors">Instructors</a><a href="/about">About</a>
    <a href="/login" class="text-[var(--qm-accent)]">Log In</a>
    <a href="/signup" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-center text-[var(--qm-accent-text)]">Start Free Trial</a>
  </div>
</nav>`,
  },

  /* ─── HERO ─── */
  {
    id: 'education-hero-fresh',
    site_type: 'education',
    section_type: 'hero',
    theme_id: 'fresh-modern',
    keywords: ['hero', 'education', 'academy', 'learning', 'engaging', 'bright', 'gradient'],
    preview_description: 'Vibrant hero with gradient accent, floating cards, trust badges, and student imagery.',
    rank: 96,
    html: `<section class="relative overflow-hidden bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)] md:py-28">
  <!-- Background decorative gradient -->
  <div class="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--qm-accent)]/10 blur-3xl"></div>
  <div class="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-[var(--qm-accent)]/5 blur-3xl"></div>
  <div class="relative mx-auto max-w-7xl">
    <div class="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div data-qay-animate="slide-right" data-qay-duration="1.0">
        <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">
          <span>&#127775;</span>
          <span data-qm="hero-badge">Trusted by 50,000+ students worldwide</span>
        </div>
        <h1 class="mt-7 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Learn Without Limits, Grow Without Boundaries</h1>
        <p class="mt-6 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">Master in-demand skills with expert-led courses, hands-on projects, and a supportive community. Start your journey today.</p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="/signup" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-center text-sm font-semibold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/25 transition hover:opacity-90" data-qay-hover="scale" data-qm="hero-cta-primary">Start Learning for Free</a>
          <a href="/courses" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-center text-sm font-semibold transition hover:bg-[var(--qm-surface)]" data-qm="hero-cta-secondary">Browse Courses</a>
        </div>
        <div class="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--qm-text-muted)]" data-qay-animate="stagger-children">
          <div class="flex items-center gap-2">
            <span class="text-[var(--qm-accent)]">&#10003;</span>
            <span data-qm="hero-feature-1">500+ courses</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[var(--qm-accent)]">&#10003;</span>
            <span data-qm="hero-feature-2">Expert instructors</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[var(--qm-accent)]">&#10003;</span>
            <span data-qm="hero-feature-3">Certificate included</span>
          </div>
        </div>
      </div>
      <div class="relative" data-qay-animate="slide-up" data-qay-duration="1.1">
        <div class="overflow-hidden rounded-3xl shadow-2xl" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&q=85" alt="Students collaborating on laptops in a modern learning space" class="h-[480px] w-full object-cover" data-qm="hero-image" />
        </div>
        <!-- Floating card -->
        <div class="absolute -bottom-6 -left-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-xl" data-qay-animate="scale-in">
          <p class="text-3xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">4.9</p>
          <p class="text-xs text-[var(--qm-text-muted)]">&#11088;&#11088;&#11088;&#11088;&#11088; Rating</p>
          <p class="mt-1 text-xs font-medium text-[var(--qm-text)]">12,000+ reviews</p>
        </div>
        <!-- Top floating card -->
        <div class="absolute -right-4 -top-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-5 py-4 shadow-xl" data-qay-animate="scale-in">
          <p class="text-sm font-bold text-[var(--qm-text)]">&#127891; 50,000+</p>
          <p class="text-xs text-[var(--qm-text-muted)]">Graduates</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── FEATURES ─── */
  {
    id: 'education-features-fresh',
    site_type: 'education',
    section_type: 'features',
    theme_id: 'fresh-modern',
    keywords: ['features', 'benefits', 'education', 'learning', 'bento', 'cards'],
    preview_description: 'Bento grid features section with gradient icon cards and engaging descriptions.',
    rank: 93,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Why Choose Us</div>
      <h2 class="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="features-title">Everything You Need to Succeed</h2>
      <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--qm-text-muted)]" data-qm="features-subtitle">Our platform is built to accelerate your learning with world-class tools and experiences.</p>
    </div>
    <div class="mt-16 grid gap-5 md:grid-cols-3">
      <!-- Feature 1 - Large -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/20 hover:shadow-lg md:col-span-2" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#127891;</div>
        <h3 class="mt-6 text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-1-title">Expert-Led Courses</h3>
        <p class="mt-3 max-w-xl text-base leading-7 text-[var(--qm-text-muted)]" data-qm="feature-1-desc">Learn from industry professionals with real-world experience. Our instructors bring years of expertise from top companies and institutions worldwide.</p>
        <div class="mt-6 overflow-hidden rounded-2xl">
          <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&q=85" alt="Instructor teaching in classroom" class="h-52 w-full object-cover" data-qm="feature-1-image" />
        </div>
      </div>
      <!-- Feature 2 -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/20 hover:shadow-lg" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128187;</div>
        <h3 class="mt-6 text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-2-title">Hands-On Projects</h3>
        <p class="mt-3 text-base leading-7 text-[var(--qm-text-muted)]" data-qm="feature-2-desc">Apply what you learn with real-world projects. Build a portfolio that impresses employers and clients.</p>
      </div>
      <!-- Feature 3 -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/20 hover:shadow-lg" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#127942;</div>
        <h3 class="mt-6 text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-3-title">Certificates</h3>
        <p class="mt-3 text-base leading-7 text-[var(--qm-text-muted)]" data-qm="feature-3-desc">Earn recognized certificates upon completion. Share your achievements on LinkedIn and boost your career.</p>
      </div>
      <!-- Feature 4 -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 transition hover:border-[var(--qm-accent)]/20 hover:shadow-lg" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128101;</div>
        <h3 class="mt-6 text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-4-title">Community</h3>
        <p class="mt-3 text-base leading-7 text-[var(--qm-text-muted)]" data-qm="feature-4-desc">Join a vibrant community of learners. Collaborate, network, and grow together with peers worldwide.</p>
      </div>
      <!-- Feature 5 - Large -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-gradient-to-br from-[var(--qm-accent)] to-[#7c3aed] p-8 text-white md:col-span-2" data-qay-hover="luxe-lift">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl">&#9889;</div>
        <h3 class="mt-6 text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-5-title">AI-Powered Learning Paths</h3>
        <p class="mt-3 max-w-xl text-base leading-7 text-white/80" data-qm="feature-5-desc">Our intelligent system adapts to your pace and interests. Get personalized course recommendations, track your progress, and receive smart reminders to keep you on track.</p>
        <a href="/courses" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:opacity-80">Explore Courses &rarr;</a>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── PRICING ─── */
  {
    id: 'education-pricing-fresh',
    site_type: 'education',
    section_type: 'pricing',
    theme_id: 'fresh-modern',
    keywords: ['pricing', 'plans', 'subscription', 'education', 'tiers'],
    preview_description: 'Three-tier pricing cards with highlighted popular plan, feature lists, and rounded design.',
    rank: 92,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-6xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Pricing Plans</div>
      <h2 class="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="pricing-title">Simple, Transparent Pricing</h2>
      <p class="mx-auto mt-4 max-w-xl text-base text-[var(--qm-text-muted)]" data-qm="pricing-subtitle">Choose the plan that fits your learning goals. Upgrade or cancel anytime.</p>
    </div>
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      <!-- Free Tier -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:shadow-lg" data-qay-hover="luxe-lift">
        <p class="text-sm font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="plan-1-name">Starter</p>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-5xl font-extrabold" style="font-family:var(--qm-heading-font)" data-qm="plan-1-price">Free</span>
        </div>
        <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="plan-1-desc">Perfect for exploring the platform</p>
        <div class="my-8 h-px bg-[var(--qm-border)]"></div>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-1-feature-1">5 free courses</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-1-feature-2">Community access</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-1-feature-3">Basic quizzes</span></li>
          <li class="flex items-center gap-3 text-[var(--qm-text-muted)]"><span>&#8211;</span> <span>Certificates</span></li>
          <li class="flex items-center gap-3 text-[var(--qm-text-muted)]"><span>&#8211;</span> <span>Mentor support</span></li>
        </ul>
        <a href="/signup" class="mt-8 block rounded-full border-2 border-[var(--qm-border)] py-3.5 text-center text-sm font-semibold transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]" data-qm="plan-1-cta">Get Started</a>
      </div>
      <!-- Pro Tier (Popular) -->
      <div class="relative rounded-3xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-8 shadow-xl shadow-[var(--qm-accent)]/10" data-qay-hover="luxe-lift">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--qm-accent)] px-4 py-1 text-xs font-bold text-[var(--qm-accent-text)]">Most Popular</div>
        <p class="text-sm font-semibold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="plan-2-name">Pro</p>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-5xl font-extrabold" style="font-family:var(--qm-heading-font)" data-qm="plan-2-price">$29</span>
          <span class="text-sm text-[var(--qm-text-muted)]">/month</span>
        </div>
        <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="plan-2-desc">For serious learners ready to level up</p>
        <div class="my-8 h-px bg-[var(--qm-border)]"></div>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-2-feature-1">All 500+ courses</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-2-feature-2">Completion certificates</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-2-feature-3">Project reviews</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-2-feature-4">Priority support</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-2-feature-5">Offline access</span></li>
        </ul>
        <a href="/signup" class="mt-8 block rounded-full bg-[var(--qm-accent)] py-3.5 text-center text-sm font-semibold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/25 transition hover:opacity-90" data-qay-hover="scale" data-qm="plan-2-cta">Start Pro Trial</a>
      </div>
      <!-- Enterprise Tier -->
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:shadow-lg" data-qay-hover="luxe-lift">
        <p class="text-sm font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="plan-3-name">Enterprise</p>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-5xl font-extrabold" style="font-family:var(--qm-heading-font)" data-qm="plan-3-price">$99</span>
          <span class="text-sm text-[var(--qm-text-muted)]">/month</span>
        </div>
        <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="plan-3-desc">For teams and organizations</p>
        <div class="my-8 h-px bg-[var(--qm-border)]"></div>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-3-feature-1">Everything in Pro</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-3-feature-2">Team management</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-3-feature-3">Custom learning paths</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-3-feature-4">Dedicated mentor</span></li>
          <li class="flex items-center gap-3"><span class="text-[var(--qm-accent)]">&#10003;</span> <span data-qm="plan-3-feature-5">API access &amp; SSO</span></li>
        </ul>
        <a href="/contact" class="mt-8 block rounded-full border-2 border-[var(--qm-border)] py-3.5 text-center text-sm font-semibold transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]" data-qm="plan-3-cta">Contact Sales</a>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── TEAM ─── */
  {
    id: 'education-team-fresh',
    site_type: 'education',
    section_type: 'team',
    theme_id: 'fresh-modern',
    keywords: ['team', 'instructors', 'educators', 'profiles', 'education'],
    preview_description: 'Instructor grid with rounded photos, specialty badges, and social links.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Our Instructors</div>
      <h2 class="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">Learn From the Best</h2>
      <p class="mx-auto mt-4 max-w-xl text-base text-[var(--qm-text-muted)]" data-qm="team-subtitle">Our instructors are top professionals with decades of combined real-world experience.</p>
    </div>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="group rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center transition hover:shadow-lg hover:border-[var(--qm-accent)]/20" data-qay-hover="luxe-lift">
        <div class="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--qm-accent)]/10">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&q=85" alt="Instructor portrait" class="h-full w-full object-cover" data-qm="team-1-image" />
        </div>
        <h3 class="mt-5 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-1-name">Dr. Marcus Chen</h3>
        <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-1-role">Data Science Lead</p>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-1-bio">Former Google engineer with 15+ years in ML and AI research.</p>
        <div class="mt-4 inline-flex rounded-full bg-[var(--qm-accent)]/5 px-3 py-1 text-xs font-medium text-[var(--qm-accent)]">42 courses</div>
      </div>
      <div class="group rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center transition hover:shadow-lg hover:border-[var(--qm-accent)]/20" data-qay-hover="luxe-lift">
        <div class="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--qm-accent)]/10">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&q=85" alt="Instructor portrait" class="h-full w-full object-cover" data-qm="team-2-image" />
        </div>
        <h3 class="mt-5 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-2-name">Elena Rodriguez</h3>
        <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-2-role">UX Design Expert</p>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-2-bio">Award-winning designer who has led products at Figma and Airbnb.</p>
        <div class="mt-4 inline-flex rounded-full bg-[var(--qm-accent)]/5 px-3 py-1 text-xs font-medium text-[var(--qm-accent)]">28 courses</div>
      </div>
      <div class="group rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center transition hover:shadow-lg hover:border-[var(--qm-accent)]/20" data-qay-hover="luxe-lift">
        <div class="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--qm-accent)]/10">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&q=85" alt="Instructor portrait" class="h-full w-full object-cover" data-qm="team-3-image" />
        </div>
        <h3 class="mt-5 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-3-name">James Okafor</h3>
        <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-3-role">Business Strategy</p>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-3-bio">MBA from Harvard. Consultant for Fortune 500 companies for 12 years.</p>
        <div class="mt-4 inline-flex rounded-full bg-[var(--qm-accent)]/5 px-3 py-1 text-xs font-medium text-[var(--qm-accent)]">35 courses</div>
      </div>
      <div class="group rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center transition hover:shadow-lg hover:border-[var(--qm-accent)]/20" data-qay-hover="luxe-lift">
        <div class="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--qm-accent)]/10">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&q=85" alt="Instructor portrait" class="h-full w-full object-cover" data-qm="team-4-image" />
        </div>
        <h3 class="mt-5 text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-4-name">Priya Sharma</h3>
        <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="team-4-role">Web Development</p>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="team-4-bio">Full-stack engineer and open-source contributor. Built apps used by millions.</p>
        <div class="mt-4 inline-flex rounded-full bg-[var(--qm-accent)]/5 px-3 py-1 text-xs font-medium text-[var(--qm-accent)]">51 courses</div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── TESTIMONIALS ─── */
  {
    id: 'education-testimonials-fresh',
    site_type: 'education',
    section_type: 'testimonials',
    theme_id: 'fresh-modern',
    keywords: ['testimonials', 'reviews', 'students', 'social proof', 'education'],
    preview_description: 'Student testimonials in a staggered card grid with ratings, photos, and course badges.',
    rank: 91,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">Student Stories</div>
      <h2 class="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="testimonials-title">What Our Students Say</h2>
    </div>
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 transition hover:shadow-lg" data-qay-hover="luxe-lift">
        <div class="text-sm text-[var(--qm-accent)]">&#11088;&#11088;&#11088;&#11088;&#11088;</div>
        <p class="mt-4 text-base leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-1-quote">"Elevate Academy completely changed my career trajectory. I went from zero coding knowledge to landing a developer role in just 6 months."</p>
        <div class="mt-6 flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&q=85" alt="Student" class="h-10 w-10 rounded-full object-cover" data-qm="testimonial-1-image" />
          <div>
            <p class="text-sm font-semibold" data-qm="testimonial-1-name">Jessica Park</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="testimonial-1-role">Software Developer at Stripe</p>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 transition hover:shadow-lg md:-mt-4" data-qay-hover="luxe-lift">
        <div class="text-sm text-[var(--qm-accent)]">&#11088;&#11088;&#11088;&#11088;&#11088;</div>
        <p class="mt-4 text-base leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-2-quote">"The project-based learning approach is brilliant. I didn't just learn theory &mdash; I built real products that I now showcase in my portfolio."</p>
        <div class="mt-6 flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&q=85" alt="Student" class="h-10 w-10 rounded-full object-cover" data-qm="testimonial-2-image" />
          <div>
            <p class="text-sm font-semibold" data-qm="testimonial-2-name">Michael Torres</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="testimonial-2-role">Freelance UX Designer</p>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 transition hover:shadow-lg" data-qay-hover="luxe-lift">
        <div class="text-sm text-[var(--qm-accent)]">&#11088;&#11088;&#11088;&#11088;&#11088;</div>
        <p class="mt-4 text-base leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-3-quote">"The best investment I've made in my professional growth. The instructors genuinely care about your success and the community is incredibly supportive."</p>
        <div class="mt-6 flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&q=85" alt="Student" class="h-10 w-10 rounded-full object-cover" data-qm="testimonial-3-image" />
          <div>
            <p class="text-sm font-semibold" data-qm="testimonial-3-name">Aisha Bello</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="testimonial-3-role">Data Analyst at McKinsey</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─── FAQ ─── */
  {
    id: 'education-faq-fresh',
    site_type: 'education',
    section_type: 'faq',
    theme_id: 'fresh-modern',
    keywords: ['faq', 'questions', 'answers', 'help', 'education'],
    preview_description: 'Clean accordion FAQ with rounded cards and expandable answers.',
    rank: 89,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="scroll-reveal">
  <div class="mx-auto max-w-3xl">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--qm-accent)]">FAQ</div>
      <h2 class="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="faq-title">Frequently Asked Questions</h2>
      <p class="mx-auto mt-4 max-w-lg text-base text-[var(--qm-text-muted)]" data-qm="faq-subtitle">Everything you need to know about Elevate Academy.</p>
    </div>
    <div class="mt-12 space-y-4" data-qay-animate="stagger-children">
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-5">
        <summary class="flex cursor-pointer items-center justify-between text-base font-semibold">
          <span data-qm="faq-1-question">How does the free trial work?</span>
          <span class="text-xl text-[var(--qm-accent)] transition group-open:rotate-45">+</span>
        </summary>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="faq-1-answer">You get full access to all Pro features for 7 days. No credit card required. If you love it, upgrade to continue. If not, you keep access to our free courses.</p>
      </details>
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-5">
        <summary class="flex cursor-pointer items-center justify-between text-base font-semibold">
          <span data-qm="faq-2-question">Are the certificates recognized by employers?</span>
          <span class="text-xl text-[var(--qm-accent)] transition group-open:rotate-45">+</span>
        </summary>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="faq-2-answer">Yes! Our certificates are recognized by over 1,000 companies worldwide. They include verifiable credentials that you can add to LinkedIn and share with potential employers.</p>
      </details>
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-5">
        <summary class="flex cursor-pointer items-center justify-between text-base font-semibold">
          <span data-qm="faq-3-question">Can I learn at my own pace?</span>
          <span class="text-xl text-[var(--qm-accent)] transition group-open:rotate-45">+</span>
        </summary>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="faq-3-answer">Absolutely. All courses are self-paced with lifetime access. Watch lessons whenever it fits your schedule, replay as needed, and complete projects on your timeline.</p>
      </details>
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-5">
        <summary class="flex cursor-pointer items-center justify-between text-base font-semibold">
          <span data-qm="faq-4-question">What if I need help during a course?</span>
          <span class="text-xl text-[var(--qm-accent)] transition group-open:rotate-45">+</span>
        </summary>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="faq-4-answer">Pro and Enterprise members get access to instructor Q&amp;A, community forums, and dedicated mentor support. Our average response time is under 4 hours.</p>
      </details>
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-5">
        <summary class="flex cursor-pointer items-center justify-between text-base font-semibold">
          <span data-qm="faq-5-question">Do you offer refunds?</span>
          <span class="text-xl text-[var(--qm-accent)] transition group-open:rotate-45">+</span>
        </summary>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="faq-5-answer">Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund &mdash; no questions asked.</p>
      </details>
    </div>
  </div>
</section>`,
  },

  /* ─── CTA ─── */
  {
    id: 'education-cta-fresh',
    site_type: 'education',
    section_type: 'cta',
    theme_id: 'fresh-modern',
    keywords: ['cta', 'call to action', 'signup', 'education', 'gradient'],
    preview_description: 'Vibrant gradient CTA section with bold typography and dual action buttons.',
    rank: 91,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24" data-qay-animate="scale-in">
  <div class="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--qm-accent)] via-[#6366f1] to-[#7c3aed] p-12 text-center text-white md:p-20">
    <h2 class="text-4xl font-extrabold tracking-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="cta-title">Ready to Transform Your Future?</h2>
    <p class="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/80" data-qm="cta-subtitle">Join 50,000+ students already leveling up their skills. Start your free trial today and experience the difference.</p>
    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a href="/signup" class="rounded-full bg-white px-9 py-4 text-sm font-bold text-[var(--qm-accent)] shadow-lg transition hover:opacity-90" data-qay-hover="scale" data-qm="cta-primary">Start Free Trial</a>
      <a href="/courses" class="rounded-full border-2 border-white/30 px-9 py-4 text-sm font-semibold text-white transition hover:bg-white/10" data-qm="cta-secondary">Browse Courses</a>
    </div>
    <p class="mt-6 text-sm text-white/60">No credit card required &bull; Cancel anytime &bull; 30-day guarantee</p>
  </div>
</section>`,
  },

  /* ─── FOOTER ─── */
  {
    id: 'education-footer-fresh',
    site_type: 'education',
    section_type: 'footer',
    theme_id: 'fresh-modern',
    keywords: ['footer', 'education', 'links', 'academy'],
    preview_description: 'Clean modern footer with multi-column links, newsletter signup, and social proof.',
    rank: 88,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-5 py-16 text-[var(--qm-text)]" data-qay-animate="fade-in">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-5">
      <div class="md:col-span-2">
        <p class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="footer-brand"><span class="text-[var(--qm-accent)]">&#9670;</span> Elevate Academy</p>
        <p class="mt-4 max-w-sm text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="footer-tagline">Empowering learners worldwide with expert-led courses, hands-on projects, and a community that supports your growth.</p>
        <div class="mt-6">
          <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Subscribe to our newsletter</p>
          <div class="mt-3 flex max-w-sm gap-2">
            <input type="email" placeholder="Your email" class="flex-1 rounded-full border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--qm-accent)]" />
            <button class="rounded-full bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90">Subscribe</button>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Learning</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/courses" class="transition hover:text-[var(--qm-text)]">All Courses</a>
          <a href="/paths" class="transition hover:text-[var(--qm-text)]">Learning Paths</a>
          <a href="/certificates" class="transition hover:text-[var(--qm-text)]">Certificates</a>
          <a href="/mentors" class="transition hover:text-[var(--qm-text)]">Mentorship</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Company</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/about" class="transition hover:text-[var(--qm-text)]">About Us</a>
          <a href="/careers" class="transition hover:text-[var(--qm-text)]">Careers</a>
          <a href="/blog" class="transition hover:text-[var(--qm-text)]">Blog</a>
          <a href="/press" class="transition hover:text-[var(--qm-text)]">Press</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Support</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/help" class="transition hover:text-[var(--qm-text)]">Help Center</a>
          <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
          <a href="/privacy" class="transition hover:text-[var(--qm-text)]">Privacy</a>
          <a href="/terms" class="transition hover:text-[var(--qm-text)]">Terms</a>
        </div>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-xs text-[var(--qm-text-muted)] md:flex-row">
      <p data-qm="footer-copy">&copy; 2024 Elevate Academy. All rights reserved.</p>
      <p>Made with &#10084; for learners everywhere</p>
    </div>
  </div>
</footer>`,
  },
];
