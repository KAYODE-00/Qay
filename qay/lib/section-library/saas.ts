import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'saas-theme-quiet-dashboard',
    site_type: 'saas',
    theme_id: 'quiet-dashboard',
    label: 'Quiet Dashboard',
    keywords: ['saas', 'software', 'dashboard', 'workflow', 'analytics', 'b2b', 'automation', 'clean'],
    css_variables: {
      '--qm-bg': '#f8fafc',
      '--qm-surface': '#ffffff',
      '--qm-text': '#0f172a',
      '--qm-text-muted': '#64748b',
      '--qm-accent': '#6366f1',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(15,23,42,0.08)',
      '--qm-heading-font': '"Outfit", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Outfit:wght@500;600;700;800;900', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  {
    id: 'saas-nav-dashboard',
    site_type: 'saas',
    section_type: 'nav',
    theme_id: 'quiet-dashboard',
    keywords: ['nav', 'saas', 'login', 'signup', 'header'],
    preview_description: 'Futuristic minimal SaaS header with quick links and call-to-action buttons.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">FlowPilot</a>
    <div class="hidden items-center gap-8 text-xs font-semibold md:flex">
      <a href="/features" class="hover:text-[var(--qm-accent)] transition">Features</a>
      <a href="/pricing" class="hover:text-[var(--qm-accent)] transition">Pricing</a>
      <a href="/login" class="hover:text-[var(--qm-accent)] transition">Login</a>
      <a href="/signup" class="rounded-xl bg-[var(--qm-accent)] px-5 py-3 text-xs font-bold text-[var(--qm-accent-text)] shadow-md hover:scale-105 active:scale-98 transition duration-200">Start free</a>
    </div>
    <button type="button" class="rounded-xl border border-[var(--qm-border)] px-4 py-2 text-xs font-bold md:hidden" data-qay-click="toggle" data-qay-target="#saas-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="saas-mobile-menu" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/features" class="text-sm font-semibold">Features</a>
    <a href="/pricing" class="text-sm font-semibold">Pricing</a>
    <a href="/login" class="text-sm font-semibold">Login</a>
    <a href="/signup" class="rounded-xl bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--qm-accent-text)]">Start free</a>
  </div>
</nav>`,
  },
  {
    id: 'saas-hero-luxe',
    site_type: 'saas',
    section_type: 'hero',
    theme_id: 'quiet-dashboard',
    keywords: ['hero', 'dashboard', 'analytics', 'workflow', 'saas', 'luxe-reveal'],
    preview_description: 'High-end SaaS hero with asymmetric layout, big bold typography, and a modern dashboard bento mockup.',
    rank: 98,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 lg:py-28 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div data-qay-animate="luxe-reveal" data-qay-duration="1.1" class="space-y-6">
      <div class="inline-flex items-center gap-2 rounded-full bg-[var(--qm-accent)]/10 px-4 py-1.5 text-xs font-bold text-[var(--qm-accent)]">
        <span class="size-2 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
        Now with Medusa Commerce Binders
      </div>
      <h1 class="text-5xl font-black leading-[0.9] tracking-tight md:text-7xl lg:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        Run client operations from one calm center.
      </h1>
      <p class="max-w-xl text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)]" data-qm="hero-subtitle">
        Automate deal handoffs, synchronize client billing hooks, and give teams one definitive database without another fragile spreadsheet.
      </p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/signup" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] shadow-xl hover:scale-105 active:scale-98 transition duration-200">Start Free Trial</a>
        <a href="/demo" class="rounded-xl border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">Request Demo</a>
      </div>
    </div>
    <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl relative" data-qay-animate="scale-in" data-qay-duration="0.9">
      <!-- Simulated Dashboard Window -->
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[#0c1220] p-6 text-slate-100 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <span class="size-2.5 rounded-full bg-red-500/80"></span>
              <span class="size-2.5 rounded-full bg-yellow-500/80"></span>
              <span class="size-2.5 rounded-full bg-green-500/80"></span>
            </div>
            <span class="text-xs font-semibold text-slate-400">flowpilot.io/dashboard</span>
          </div>
          <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Sync</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-1" data-qay-hover="scale">
            <p class="text-2xl font-black text-slate-100">$84,320</p>
            <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Won This Month</p>
          </div>
          <div class="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-1" data-qay-hover="scale">
            <p class="text-2xl font-black text-[var(--qm-accent)]">19 active</p>
            <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Automations</p>
          </div>
          <div class="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-1" data-qay-hover="scale">
            <p class="text-2xl font-black text-emerald-400">96.8%</p>
            <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">SLA Target Health</p>
          </div>
        </div>
        <!-- Simulated Graph -->
        <div class="h-44 rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between">
          <div class="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            <span>Weekly Operations Volume</span>
            <span class="text-emerald-400">+14% Growth</span>
          </div>
          <div class="h-28 flex items-end gap-3 pt-4">
            <div class="h-[40%] flex-1 bg-slate-800 rounded-t"></div>
            <div class="h-[55%] flex-1 bg-slate-800 rounded-t"></div>
            <div class="h-[75%] flex-1 bg-slate-800 rounded-t"></div>
            <div class="h-[60%] flex-1 bg-slate-800 rounded-t"></div>
            <div class="h-[95%] flex-1 bg-[var(--qm-accent)] rounded-t"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-features-bento',
    site_type: 'saas',
    section_type: 'features',
    theme_id: 'quiet-dashboard',
    keywords: ['features', 'bento', 'grid', 'details', 'saas'],
    preview_description: 'Bento feature layout illustrating dashboard controls and platform features.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="max-w-3xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Deep capabilities</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">BUILT FOR SERIOUS OPERATIONS</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Feature 1 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 p-8 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <div class="size-10 rounded-xl bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 class="text-xl font-bold">Approval Routing</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Move contracts and approvals automatically based on deal values, department, or client tier.</p>
        </div>
        <span class="text-xs font-black uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</span>
      </article>

      <!-- Feature 2 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 p-8 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <div class="size-10 rounded-xl bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold">Revenue Signals</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Identify stalled renewals, delayed payments, and organic expansion opportunities before they slip.</p>
        </div>
        <span class="text-xs font-black uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</span>
      </article>

      <!-- Feature 3 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 p-8 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <div class="size-10 rounded-xl bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <h3 class="text-xl font-bold">API & Logs</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Detailed webhook payloads and real-time execution histories for every connected API hook.</p>
        </div>
        <span class="text-xs font-black uppercase tracking-wider text-[var(--qm-accent)]">Learn more &rarr;</span>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-stats',
    site_type: 'saas',
    section_type: 'stats',
    theme_id: 'quiet-dashboard',
    keywords: ['stats', 'metrics', 'bento', 'proof'],
    preview_description: 'Bento-style stats strip with detailed metrics cards and clean typography.',
    rank: 88,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">38%</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Faster Handoffs</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Average drop in onboarding lag metrics within two weeks.</p>
    </div>
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">12k</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Weekly Workflows</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Active automations executed by high-scale product operations.</p>
    </div>
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">99.99%</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Uptime Target</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Multi-region database replication for high availability.</p>
    </div>
    <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">SOC2</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Compliance</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)]">Independently audited data controls and encryption protocols.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-testimonial',
    site_type: 'saas',
    section_type: 'testimonials',
    theme_id: 'quiet-dashboard',
    keywords: ['testimonial', 'reviews', 'customer', 'trust'],
    preview_description: 'Sleek testimonial card with customer photo, quotation, and company tags.',
    rank: 84,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-5xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 rounded-3xl p-8 md:p-12" data-qay-animate="slide-up">
    <div class="grid gap-8 md:grid-cols-[200px_1fr] md:items-center">
      <div class="overflow-hidden rounded-2xl aspect-square border border-[var(--qm-border)]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&q=85" alt="Director of Operations" class="h-full w-full object-cover" />
      </div>
      <div class="space-y-6">
        <blockquote class="text-2xl md:text-3xl font-black leading-snug tracking-tight" style="font-family:var(--qm-heading-font)">
          "FlowPilot changed our client onboarding from a series of fragile manual tasks into a repeatable pipeline we can audit in seconds."
        </blockquote>
        <div class="space-y-1">
          <p class="text-sm font-bold uppercase tracking-wider">Sandra Adebayo</p>
          <p class="text-xs text-[var(--qm-text-muted)]">VP of Customer Operations · ScaleHQ</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-pricing',
    site_type: 'saas',
    section_type: 'pricing',
    theme_id: 'quiet-dashboard',
    keywords: ['pricing', 'plans', 'bento', 'subscription'],
    preview_description: 'Three-tier pricing table with border highlights and detail lists.',
    rank: 90,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Subscription Plans</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">PRICING THAT SCALES</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Plan 1 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 flex flex-col justify-between space-y-8" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <h3 class="text-lg font-bold">Starter</h3>
          <p class="text-xs text-[var(--qm-text-muted)]">Best for single operators and small business trials.</p>
          <div class="pt-4 border-t border-[var(--qm-border)]">
            <span class="text-4xl font-black" style="font-family:var(--qm-heading-font)">$19</span>
            <span class="text-xs text-[var(--qm-text-muted)]">/ user / mo</span>
          </div>
          <ul class="text-xs space-y-2 pt-4 text-[var(--qm-text-muted)]">
            <li class="flex items-center gap-2">&bull; Up to 500 workflows/mo</li>
            <li class="flex items-center gap-2">&bull; Native slack alerts</li>
            <li class="flex items-center gap-2">&bull; Email support</li>
          </ul>
        </div>
        <a href="/signup" class="block w-full text-center rounded-xl border border-[var(--qm-border)] py-3 text-xs font-bold hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)] transition">Choose Starter</a>
      </article>

      <!-- Plan 2 (Highlighted) -->
      <article class="rounded-3xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-8 flex flex-col justify-between space-y-8 relative" data-qay-hover="luxe-lift">
        <span class="absolute top-4 right-4 rounded-full bg-[var(--qm-accent)] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[var(--qm-accent-text)]">Most Popular</span>
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-[var(--qm-accent)]">Growth</h3>
          <p class="text-xs text-[var(--qm-text-muted)]">Tailored for fast-scaling workspaces and team-wide operations.</p>
          <div class="pt-4 border-t border-[var(--qm-border)]">
            <span class="text-4xl font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)">$49</span>
            <span class="text-xs text-[var(--qm-text-muted)]">/ user / mo</span>
          </div>
          <ul class="text-xs space-y-2 pt-4 text-[var(--qm-text-muted)]">
            <li class="flex items-center gap-2 text-[var(--qm-text)] font-semibold">&bull; Unlimited workflows</li>
            <li class="flex items-center gap-2">&bull; Custom approval rules</li>
            <li class="flex items-center gap-2">&bull; Webhook & API endpoints</li>
            <li class="flex items-center gap-2">&bull; Priority support (6h SLA)</li>
          </ul>
        </div>
        <a href="/signup" class="block w-full text-center rounded-xl bg-[var(--qm-accent)] py-3 text-xs font-bold text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 transition">Choose Growth</a>
      </article>

      <!-- Plan 3 -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 flex flex-col justify-between space-y-8" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <h3 class="text-lg font-bold">Scale</h3>
          <p class="text-xs text-[var(--qm-text-muted)]">For enterprise security, custom SLA, and dedicated staging databases.</p>
          <div class="pt-4 border-t border-[var(--qm-border)]">
            <span class="text-4xl font-black" style="font-family:var(--qm-heading-font)">Custom</span>
          </div>
          <ul class="text-xs space-y-2 pt-4 text-[var(--qm-text-muted)]">
            <li class="flex items-center gap-2">&bull; Dedicated staging databases</li>
            <li class="flex items-center gap-2">&bull; SAML SSO & SOC2 audits</li>
            <li class="flex items-center gap-2">&bull; 24/7 dedicated support representative</li>
          </ul>
        </div>
        <a href="/contact" class="block w-full text-center rounded-xl border border-[var(--qm-border)] py-3 text-xs font-bold hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)] transition">Contact Sales</a>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-faq',
    site_type: 'saas',
    section_type: 'faq',
    theme_id: 'quiet-dashboard',
    keywords: ['faq', 'accordion', 'security', 'questions'],
    preview_description: 'Clean accordions utilizing semantic HTML details tags and focus rings.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-4xl space-y-8">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Questions & Answers</p>
      <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">COMMON INQUIRIES</h2>
    </div>
    <div class="space-y-3" data-qay-animate="stagger-children">
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 p-6 outline-none transition focus-within:border-[var(--qm-accent)]">
        <summary class="flex items-center justify-between font-bold cursor-pointer list-none outline-none">
          <span>Can we import existing CSV files?</span>
          <span class="transition group-open:rotate-45">&plus;</span>
        </summary>
        <p class="mt-4 text-xs text-[var(--qm-text-muted)] leading-relaxed">Yes. FlowPilot supports instant CSV parsing, native HubSpot integrations, and database importing out of the box.</p>
      </details>
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 p-6 outline-none transition focus-within:border-[var(--qm-accent)]">
        <summary class="flex items-center justify-between font-bold cursor-pointer list-none outline-none">
          <span>Is there a webhook delay?</span>
          <span class="transition group-open:rotate-45">&plus;</span>
        </summary>
        <p class="mt-4 text-xs text-[var(--qm-text-muted)] leading-relaxed">No. We process incoming webhook requests instantly and execute target pipeline triggers in under 120ms.</p>
      </details>
      <details class="group rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 p-6 outline-none transition focus-within:border-[var(--qm-accent)]">
        <summary class="flex items-center justify-between font-bold cursor-pointer list-none outline-none">
          <span>How does pricing scale with operators?</span>
          <span class="transition group-open:rotate-45">&plus;</span>
        </summary>
        <p class="mt-4 text-xs text-[var(--qm-text-muted)] leading-relaxed">Our Starter and Growth plans are user-isolated, letting you add and subtract operator seats dynamically.</p>
      </details>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-integrations-bento',
    site_type: 'saas',
    section_type: 'features',
    theme_id: 'quiet-dashboard',
    keywords: ['integrations', 'bento', 'grid', 'saas', 'stripe', 'slack'],
    preview_description: 'Bento-style integrations grid showcasing native support for standard business apps.',
    rank: 86,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-t border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Connected Stack</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">INTEGRATES EVERYWHERE</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-4" data-qay-animate="stagger-children">
      <!-- Slack -->
      <article class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col justify-between h-44" data-qay-hover="scale">
        <div class="size-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">SL</div>
        <div>
          <h3 class="font-bold text-sm">Slack</h3>
          <p class="text-[11px] text-[var(--qm-text-muted)] mt-1">Real-time status updates and execution log alerts.</p>
        </div>
      </article>
      <!-- Stripe -->
      <article class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col justify-between h-44" data-qay-hover="scale">
        <div class="size-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">ST</div>
        <div>
          <h3 class="font-bold text-sm">Stripe</h3>
          <p class="text-[11px] text-[var(--qm-text-muted)] mt-1">Bind customer billing moments directly to client pipelines.</p>
        </div>
      </article>
      <!-- HubSpot -->
      <article class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col justify-between h-44" data-qay-hover="scale">
        <div class="size-8 rounded-xl bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold text-xs">HB</div>
        <div>
          <h3 class="font-bold text-sm">HubSpot</h3>
          <p class="text-[11px] text-[var(--qm-text-muted)] mt-1">Sync pipeline deals and customer contract metrics.</p>
        </div>
      </article>
      <!-- Airtable -->
      <article class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col justify-between h-44" data-qay-hover="scale">
        <div class="size-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">AT</div>
        <div>
          <h3 class="font-bold text-sm">Airtable</h3>
          <p class="text-[11px] text-[var(--qm-text-muted)] mt-1">Store custom execution outputs directly in tables.</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'saas-cta',
    site_type: 'saas',
    section_type: 'cta',
    theme_id: 'quiet-dashboard',
    keywords: ['cta', 'trial', 'signup', 'banner'],
    preview_description: 'Full-bleed indigo gradient call-to-action banner with big heading reveal.',
    rank: 86,
    html: `<section class="bg-gradient-to-r from-[var(--qm-accent)] to-[#4f46e5] px-6 py-24 text-center text-[var(--qm-accent-text)] relative overflow-hidden">
  <div class="relative z-10 mx-auto max-w-4xl space-y-6" data-qay-animate="luxe-reveal" data-qay-duration="1.1">
    <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)">START WITH ONE PIPELINE.<br/>SCALE OPERATIONS.</h2>
    <p class="mx-auto max-w-xl text-sm opacity-85 leading-relaxed">
      Setup takes less than 10 minutes. Invite your team, import your spreadsheet workflows, and bind your core business hooks today.
    </p>
    <a href="/signup" class="mt-8 inline-flex rounded-xl bg-white px-8 py-4 text-xs font-black uppercase text-slate-900 shadow-xl hover:scale-105 active:scale-98 transition duration-200">Start free trial</a>
  </div>
</section>`,
  },
  {
    id: 'saas-footer',
    site_type: 'saas',
    section_type: 'footer',
    theme_id: 'quiet-dashboard',
    keywords: ['footer', 'saas', 'links'],
    preview_description: 'Structured 4-column SaaS footer with categories, credits, and links.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
    <div class="space-y-4">
      <p class="text-2xl font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">FlowPilot</p>
      <p class="max-w-sm text-xs leading-relaxed">A calm command center for business workflows and client pipelines. Built with security and scale in mind.</p>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">PLATFORM</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/features" class="hover:text-[var(--qm-text)] transition">Features</a>
        <a href="/pricing" class="hover:text-[var(--qm-text)] transition">Pricing</a>
        <a href="/demo" class="hover:text-[var(--qm-text)] transition">Watch Demo</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">LEGAL</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Terms of Service</a>
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Privacy Protocol</a>
        <a href="/security" class="hover:text-[var(--qm-text)] transition">Security Controls</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wider">
    <p>&copy; 2026 FLOWPILOT INC. ALL RIGHTS RESERVED.</p>
    <p>SOC2 AUDITED CLOUD PLATFORM</p>
  </div>
</footer>`,
  },
];
