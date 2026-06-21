import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'tech-startup-theme-neural',
    site_type: 'tech-startup',
    theme_id: 'neural',
    label: 'NeuralStack Dark',
    keywords: ['startup', 'tech', 'ai', 'futuristic', 'dark', 'developer', 'api', 'infrastructure', 'innovation'],
    css_variables: {
      '--qm-bg': '#09090f',
      '--qm-surface': '#12121a',
      '--qm-text': '#e8e6e0',
      '--qm-text-muted': '#6a6880',
      '--qm-accent': '#6366f1',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(232,230,224,0.08)',
      '--qm-heading-font': '"Space Grotesk", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Space+Grotesk:wght@400;500;600;700', 'Inter:wght@400;500;600;700'],
    is_dark: true,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  /* ───────────────────── NAV ───────────────────── */
  {
    id: 'tech-startup-nav-neural',
    site_type: 'tech-startup',
    section_type: 'nav',
    theme_id: 'neural',
    keywords: ['nav', 'futuristic', 'startup', 'waitlist', 'dark'],
    preview_description: 'Dark futuristic startup navigation with gradient accent CTA and glassmorphism mobile drawer.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/90 px-5 py-4 text-[var(--qm-text)] backdrop-blur-xl" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="flex items-center gap-2 text-lg font-bold tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">
      <span class="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--qm-accent)] to-purple-500 text-sm font-bold text-white">N</span>
      NeuralStack
    </a>
    <div class="hidden items-center gap-8 text-sm font-medium text-[var(--qm-text-muted)] md:flex">
      <a href="/features" class="transition hover:text-[var(--qm-text)]">Features</a>
      <a href="/pricing" class="transition hover:text-[var(--qm-text)]">Pricing</a>
      <a href="/docs" class="transition hover:text-[var(--qm-text)]">Docs</a>
      <a href="/blog" class="transition hover:text-[var(--qm-text)]">Blog</a>
      <a href="#" class="rounded-lg border border-[var(--qm-border)] px-5 py-2.5 text-[var(--qm-text)] transition hover:border-[var(--qm-accent)]">Log In</a>
      <a href="/waitlist" class="rounded-lg bg-gradient-to-r from-[var(--qm-accent)] to-purple-500 px-5 py-2.5 font-semibold text-white transition hover:opacity-90" data-qay-hover="scale">Get Started</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-lg border border-[var(--qm-border)] text-sm md:hidden" data-qay-click="toggle" data-qay-target="#tech-startup-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="tech-startup-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/95 p-6 text-sm shadow-2xl backdrop-blur-xl md:hidden">
    <a href="/features">Features</a><a href="/pricing">Pricing</a><a href="/docs">Docs</a><a href="/blog">Blog</a>
    <a href="#" class="rounded-lg border border-[var(--qm-border)] px-4 py-3 text-center">Log In</a>
    <a href="/waitlist" class="rounded-lg bg-gradient-to-r from-[var(--qm-accent)] to-purple-500 px-4 py-3 text-center font-semibold text-white">Get Started</a>
  </div>
</nav>`,
  },

  /* ───────────────────── HERO ───────────────────── */
  {
    id: 'tech-startup-hero-neural',
    site_type: 'tech-startup',
    section_type: 'hero',
    theme_id: 'neural',
    keywords: ['hero', 'futuristic', 'ai', 'gradient', 'waitlist', 'developer-tools'],
    preview_description: 'Futuristic tech startup hero with gradient glow, code snippet preview, trust logos, and dual CTAs.',
    rank: 98,
    html: `<section class="relative overflow-hidden bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)] md:py-32">
  <div class="absolute left-1/2 top-0 -translate-x-1/2">
    <div class="h-[600px] w-[800px] rounded-full bg-[var(--qm-accent)]/8 blur-[120px]"></div>
  </div>
  <div class="absolute right-0 top-1/4">
    <div class="h-[400px] w-[400px] rounded-full bg-purple-500/6 blur-[100px]"></div>
  </div>
  <div class="relative z-10 mx-auto max-w-7xl">
    <div class="mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal">
      <div class="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/30 bg-[var(--qm-accent)]/10 px-4 py-2 text-xs font-medium text-[var(--qm-accent)]">
        <span class="flex size-2 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
        Now in Public Beta &mdash; Try it free
      </div>
      <h1 class="text-5xl font-bold leading-[0.95] md:text-7xl lg:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Ship AI features <span class="bg-gradient-to-r from-[var(--qm-accent)] to-purple-400 bg-clip-text text-transparent">10x faster</span></h1>
      <p class="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">NeuralStack gives your engineering team production-ready AI infrastructure &mdash; from model serving to vector search &mdash; so you can focus on building, not plumbing.</p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="/waitlist" class="rounded-xl bg-gradient-to-r from-[var(--qm-accent)] to-purple-500 px-8 py-4 font-bold text-white shadow-lg shadow-[var(--qm-accent)]/25 transition hover:shadow-[var(--qm-accent)]/40" data-qay-hover="scale" data-qm="hero-cta-primary">Start Building Free</a>
        <a href="/docs" class="rounded-xl border border-[var(--qm-border)] px-8 py-4 font-medium text-[var(--qm-text)] transition hover:border-[var(--qm-accent)]/50" data-qm="hero-cta-secondary">Read the Docs &rarr;</a>
      </div>
    </div>
    <div class="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] shadow-2xl shadow-[var(--qm-accent)]/5" data-qay-animate="slide-up">
      <div class="flex items-center gap-2 border-b border-[var(--qm-border)] px-4 py-3">
        <span class="size-3 rounded-full bg-red-500/60"></span>
        <span class="size-3 rounded-full bg-yellow-500/60"></span>
        <span class="size-3 rounded-full bg-green-500/60"></span>
        <span class="ml-4 text-xs text-[var(--qm-text-muted)]">app.ts</span>
      </div>
      <div class="p-6 text-sm leading-7">
        <p class="text-[var(--qm-text-muted)]">// Deploy an AI pipeline in 3 lines</p>
        <p><span class="text-purple-400">import</span> { <span class="text-[var(--qm-accent)]">NeuralStack</span> } <span class="text-purple-400">from</span> <span class="text-green-400">'@neuralstack/sdk'</span></p>
        <p>&nbsp;</p>
        <p><span class="text-purple-400">const</span> <span class="text-[var(--qm-accent)]">ai</span> = <span class="text-purple-400">new</span> <span class="text-[var(--qm-accent)]">NeuralStack</span>({ <span class="text-[var(--qm-text)]">model</span>: <span class="text-green-400">'gpt-4o'</span> })</p>
        <p><span class="text-purple-400">const</span> result = <span class="text-purple-400">await</span> <span class="text-[var(--qm-accent)]">ai</span>.<span class="text-yellow-300">run</span>(<span class="text-green-400">'Analyze this dataset'</span>, data)</p>
      </div>
    </div>
    <div class="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-8 text-sm text-[var(--qm-text-muted)]" data-qay-animate="fade-in">
      <span>Trusted by teams at</span>
      <span class="font-bold text-[var(--qm-text)]/50">Vercel</span>
      <span class="font-bold text-[var(--qm-text)]/50">Linear</span>
      <span class="font-bold text-[var(--qm-text)]/50">Notion</span>
      <span class="font-bold text-[var(--qm-text)]/50">Payments</span>
      <span class="font-bold text-[var(--qm-text)]/50">Supabase</span>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── FEATURES ───────────────────── */
  {
    id: 'tech-startup-features-neural',
    site_type: 'tech-startup',
    section_type: 'features',
    theme_id: 'neural',
    keywords: ['features', 'bento', 'product', 'ai', 'infrastructure', 'developer'],
    preview_description: 'Futuristic Bento grid feature showcase with gradient borders, glassmorphism cards, and asymmetric layout.',
    rank: 95,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-3xl text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Platform Features</p>
      <h2 class="mt-4 text-4xl font-bold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="features-title">Everything you need to ship AI</h2>
      <p class="mx-auto mt-5 max-w-xl text-lg text-[var(--qm-text-muted)]">A complete developer platform for building, deploying, and scaling AI-powered applications.</p>
    </div>
    <div class="mt-16 grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/30 md:col-span-2" data-qay-hover="luxe-lift">
        <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--qm-accent)]/5 blur-[60px] transition group-hover:bg-[var(--qm-accent)]/10"></div>
        <div class="relative z-10">
          <div class="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--qm-accent)] to-purple-500 text-xl text-white">&#9889;</div>
          <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-1-title">Model Orchestration</h3>
          <p class="mt-4 max-w-lg text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-1-desc">Route requests across multiple AI models with automatic failover, load balancing, and cost optimization. One API, infinite models.</p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs text-[var(--qm-accent)]">GPT-4o</span>
            <span class="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">Claude</span>
            <span class="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">Llama 3</span>
            <span class="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">Gemini</span>
          </div>
        </div>
      </article>
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
        <div class="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-purple-500/5 blur-[40px] transition group-hover:bg-purple-500/10"></div>
        <div class="relative z-10">
          <div class="mb-5 flex size-12 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-xl">&#128269;</div>
          <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-2-title">Vector Search</h3>
          <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-2-desc">Semantic search across millions of embeddings with sub-millisecond latency. Built for RAG at scale.</p>
        </div>
      </article>
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/30" data-qay-hover="luxe-lift">
        <div class="relative z-10">
          <div class="mb-5 flex size-12 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-xl">&#128274;</div>
          <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-3-title">Guardrails</h3>
          <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-3-desc">Content moderation, PII detection, and output validation built into every request. Ship responsibly.</p>
        </div>
      </article>
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/30 md:col-span-2" data-qay-hover="luxe-lift">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl text-white">&#128200;</div>
            <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-4-title">Observability Dashboard</h3>
            <p class="mt-3 max-w-md text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-4-desc">Real-time analytics, cost tracking, latency monitoring, and usage insights. Know exactly how your AI performs in production.</p>
          </div>
          <div class="shrink-0 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4 text-center">
            <p class="text-3xl font-bold text-[var(--qm-accent)]">99.99%</p>
            <p class="mt-1 text-xs text-[var(--qm-text-muted)]">uptime SLA</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── STATS ───────────────────── */
  {
    id: 'tech-startup-stats-neural',
    site_type: 'tech-startup',
    section_type: 'stats',
    theme_id: 'neural',
    keywords: ['stats', 'metrics', 'proof', 'numbers', 'traction'],
    preview_description: 'Dark glassmorphism stats bar with gradient accents, key metrics, and animated counters.',
    rank: 90,
    html: `<section class="relative overflow-hidden bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]">
  <div class="absolute left-0 top-0 h-full w-full">
    <div class="absolute left-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[var(--qm-accent)]/5 blur-[80px]"></div>
    <div class="absolute right-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-purple-500/5 blur-[80px]"></div>
  </div>
  <div class="relative z-10 mx-auto max-w-7xl">
    <div class="mx-auto max-w-2xl text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">By the Numbers</p>
      <h2 class="mt-4 text-4xl font-bold md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="stats-title">Built for serious scale</h2>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-4" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 p-8 text-center backdrop-blur" data-qay-hover="luxe-lift">
        <p class="bg-gradient-to-r from-[var(--qm-accent)] to-purple-400 bg-clip-text text-5xl font-bold text-transparent" data-qm="stat-1-value">2M+</p>
        <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="stat-1-label">API Calls / Day</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 p-8 text-center backdrop-blur" data-qay-hover="luxe-lift">
        <p class="bg-gradient-to-r from-[var(--qm-accent)] to-purple-400 bg-clip-text text-5xl font-bold text-transparent" data-qm="stat-2-value">4,200+</p>
        <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="stat-2-label">Developer Teams</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 p-8 text-center backdrop-blur" data-qay-hover="luxe-lift">
        <p class="bg-gradient-to-r from-[var(--qm-accent)] to-purple-400 bg-clip-text text-5xl font-bold text-transparent" data-qm="stat-3-value">&lt;50ms</p>
        <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="stat-3-label">Avg. Latency</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/80 p-8 text-center backdrop-blur" data-qay-hover="luxe-lift">
        <p class="bg-gradient-to-r from-[var(--qm-accent)] to-purple-400 bg-clip-text text-5xl font-bold text-transparent" data-qm="stat-4-value">$18M</p>
        <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="stat-4-label">Series A Raised</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── PRICING ───────────────────── */
  {
    id: 'tech-startup-pricing-neural',
    site_type: 'tech-startup',
    section_type: 'pricing',
    theme_id: 'neural',
    keywords: ['pricing', 'plans', 'tiers', 'subscription', 'billing'],
    preview_description: 'Three-tier pricing with gradient-highlighted Pro plan, feature lists, and futuristic card styling.',
    rank: 92,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-2xl text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Pricing</p>
      <h2 class="mt-4 text-4xl font-bold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="pricing-title">Start free, scale infinitely</h2>
      <p class="mx-auto mt-5 max-w-lg text-lg text-[var(--qm-text-muted)]">Transparent pricing with no hidden fees. Pay for what you use.</p>
    </div>
    <div class="mt-14 grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-text-muted)]">Starter</p>
        <p class="mt-4 text-5xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="price-1-amount">$0</p>
        <p class="mt-1 text-sm text-[var(--qm-text-muted)]">Free forever</p>
        <div class="my-8 h-px bg-[var(--qm-border)]"></div>
        <ul class="space-y-3 text-sm text-[var(--qm-text-muted)]">
          <li>&#10003; &nbsp;10K API calls / month</li>
          <li>&#10003; &nbsp;1 project</li>
          <li>&#10003; &nbsp;Community support</li>
          <li>&#10003; &nbsp;Basic analytics</li>
        </ul>
        <a href="/waitlist" class="mt-8 block rounded-xl border border-[var(--qm-border)] px-6 py-3 text-center font-semibold transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]">Get Started</a>
      </article>
      <article class="relative rounded-2xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-8 shadow-lg shadow-[var(--qm-accent)]/10" data-qay-hover="luxe-lift">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--qm-accent)] to-purple-500 px-4 py-1 text-xs font-bold text-white">Most Popular</div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]">Pro</p>
        <p class="mt-4 text-5xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="price-2-amount">$49</p>
        <p class="mt-1 text-sm text-[var(--qm-text-muted)]">per month</p>
        <div class="my-8 h-px bg-[var(--qm-border)]"></div>
        <ul class="space-y-3 text-sm text-[var(--qm-text-muted)]">
          <li>&#10003; &nbsp;500K API calls / month</li>
          <li>&#10003; &nbsp;Unlimited projects</li>
          <li>&#10003; &nbsp;Priority support</li>
          <li>&#10003; &nbsp;Advanced analytics</li>
          <li>&#10003; &nbsp;Custom models</li>
          <li>&#10003; &nbsp;Team collaboration</li>
        </ul>
        <a href="/waitlist" class="mt-8 block rounded-xl bg-gradient-to-r from-[var(--qm-accent)] to-purple-500 px-6 py-3 text-center font-bold text-white transition hover:opacity-90" data-qay-hover="scale">Start Pro Trial</a>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-text-muted)]">Enterprise</p>
        <p class="mt-4 text-5xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="price-3-amount">Custom</p>
        <p class="mt-1 text-sm text-[var(--qm-text-muted)]">tailored to your needs</p>
        <div class="my-8 h-px bg-[var(--qm-border)]"></div>
        <ul class="space-y-3 text-sm text-[var(--qm-text-muted)]">
          <li>&#10003; &nbsp;Unlimited API calls</li>
          <li>&#10003; &nbsp;Dedicated infrastructure</li>
          <li>&#10003; &nbsp;24/7 SLA support</li>
          <li>&#10003; &nbsp;SSO &amp; SAML</li>
          <li>&#10003; &nbsp;Custom SLAs</li>
          <li>&#10003; &nbsp;On-prem deployment</li>
        </ul>
        <a href="/contact" class="mt-8 block rounded-xl border border-[var(--qm-border)] px-6 py-3 text-center font-semibold transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]">Contact Sales</a>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── TESTIMONIALS ───────────────────── */
  {
    id: 'tech-startup-testimonials-neural',
    site_type: 'tech-startup',
    section_type: 'testimonials',
    theme_id: 'neural',
    keywords: ['testimonials', 'reviews', 'developers', 'trust', 'social-proof'],
    preview_description: 'Developer testimonial grid with avatar, role, company, and glassmorphism card styling.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-2xl text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Developer Love</p>
      <h2 class="mt-4 text-4xl font-bold md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="testimonials-title">Trusted by builders worldwide</h2>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--qm-accent)] to-purple-500 text-sm font-bold text-white">AK</div>
          <div>
            <p class="font-semibold text-sm" data-qm="testimonial-1-author">Ava Kim</p>
            <p class="text-xs text-[var(--qm-text-muted)]">CTO, Streamline</p>
          </div>
        </div>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-1-quote">&ldquo;NeuralStack cut our AI integration time from 3 months to 2 weeks. The model orchestration layer is genuinely game-changing.&rdquo;</p>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-bold text-white">JR</div>
          <div>
            <p class="font-semibold text-sm" data-qm="testimonial-2-author">Jordan Rivera</p>
            <p class="text-xs text-[var(--qm-text-muted)]">Lead Engineer, Finova</p>
          </div>
        </div>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-2-quote">&ldquo;The observability dashboard alone is worth it. We finally have full visibility into cost, latency, and model performance across our entire stack.&rdquo;</p>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="luxe-lift">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white">SC</div>
          <div>
            <p class="font-semibold text-sm" data-qm="testimonial-3-author">Sam Chen</p>
            <p class="text-xs text-[var(--qm-text-muted)]">Founder, DocuAI</p>
          </div>
        </div>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-3-quote">&ldquo;We evaluated 6 platforms. NeuralStack was the only one where the DX matched the marketing. Clean APIs, great docs, responsive support.&rdquo;</p>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── CTA ───────────────────── */
  {
    id: 'tech-startup-cta-neural',
    site_type: 'tech-startup',
    section_type: 'cta',
    theme_id: 'neural',
    keywords: ['cta', 'waitlist', 'conversion', 'gradient', 'signup'],
    preview_description: 'Bold gradient CTA section with glowing accent, waitlist form, and futuristic styling.',
    rank: 90,
    html: `<section class="relative overflow-hidden bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="absolute inset-0">
    <div class="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--qm-accent)]/8 blur-[120px]"></div>
  </div>
  <div class="relative z-10 mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal">
    <div class="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--qm-accent)]/20 bg-[var(--qm-accent)]/5 px-4 py-2 text-xs font-medium text-[var(--qm-accent)]">&#9889; Limited Beta Access</div>
    <h2 class="mt-8 text-4xl font-bold md:text-6xl lg:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="cta-title">Ready to build the <span class="bg-gradient-to-r from-[var(--qm-accent)] to-purple-400 bg-clip-text text-transparent">future</span>?</h2>
    <p class="mx-auto mt-6 max-w-xl text-lg text-[var(--qm-text-muted)]" data-qm="cta-subtitle">Join thousands of developers shipping AI features faster with NeuralStack. Start free, no credit card required.</p>
    <div class="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
      <input type="email" placeholder="you@company.com" class="flex-1 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-5 py-4 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none" />
      <a href="/waitlist" class="shrink-0 rounded-xl bg-gradient-to-r from-[var(--qm-accent)] to-purple-500 px-8 py-4 font-bold text-white shadow-lg shadow-[var(--qm-accent)]/25 transition hover:shadow-[var(--qm-accent)]/40" data-qay-hover="scale">Get Early Access</a>
    </div>
    <p class="mt-4 text-xs text-[var(--qm-text-muted)]">Free tier includes 10K API calls/mo &bull; No credit card required &bull; Cancel anytime</p>
  </div>
</section>`,
  },

  /* ───────────────────── FOOTER ───────────────────── */
  {
    id: 'tech-startup-footer-neural',
    site_type: 'tech-startup',
    section_type: 'footer',
    theme_id: 'neural',
    keywords: ['footer', 'links', 'developer', 'startup', 'docs'],
    preview_description: 'Dark futuristic footer with multi-column navigation, status indicator, and gradient brand mark.',
    rank: 85,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-14 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
      <div>
        <div class="flex items-center gap-2">
          <span class="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--qm-accent)] to-purple-500 text-sm font-bold text-white">N</span>
          <span class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">NeuralStack</span>
        </div>
        <p class="mt-3 max-w-xs text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="footer-tagline">AI infrastructure for modern engineering teams. Build smarter, ship faster.</p>
        <div class="mt-5 flex items-center gap-2 text-xs text-green-400">
          <span class="size-2 rounded-full bg-green-400 animate-pulse"></span>
          All systems operational
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-text-muted)]">Product</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/features" class="transition hover:text-[var(--qm-text)]">Features</a>
          <a href="/pricing" class="transition hover:text-[var(--qm-text)]">Pricing</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Changelog</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Roadmap</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-text-muted)]">Developers</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/docs" class="transition hover:text-[var(--qm-text)]">Documentation</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">API Reference</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">SDKs</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Status</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-text-muted)]">Company</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="#" class="transition hover:text-[var(--qm-text)]">About</a>
          <a href="/blog" class="transition hover:text-[var(--qm-text)]">Blog</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Careers</a>
          <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-text-muted)]">Legal</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="#" class="transition hover:text-[var(--qm-text)]">Privacy</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Terms</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Security</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">DPA</a>
        </div>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-xs text-[var(--qm-text-muted)] md:flex-row">
      <p>&copy; 2025 NeuralStack, Inc. All rights reserved.</p>
      <div class="flex gap-5">
        <a href="#" class="transition hover:text-[var(--qm-text)]">Twitter</a>
        <a href="#" class="transition hover:text-[var(--qm-text)]">GitHub</a>
        <a href="#" class="transition hover:text-[var(--qm-text)]">Discord</a>
        <a href="#" class="transition hover:text-[var(--qm-text)]">LinkedIn</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
