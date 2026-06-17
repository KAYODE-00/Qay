import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'law-theme-prescott-luxe',
    site_type: 'law',
    theme_id: 'prescott-luxe',
    label: 'Prescott Luxe',
    keywords: ['law', 'legal', 'attorney', 'lawyer', 'firm', 'counsel', 'corporate', 'litigation'],
    css_variables: {
      '--qm-bg': '#f6f5f2',
      '--qm-surface': '#ffffff',
      '--qm-text': '#0c121f',
      '--qm-text-muted': '#555f70',
      '--qm-accent': '#1e3a5f',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(12,18,31,0.12)',
      '--qm-heading-font': '"EB Garamond", serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['EB+Garamond:wght@400;500;600;700', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 95,
  },
];

export const sections: QmSection[] = [
  {
    id: 'law-nav-luxe',
    site_type: 'law',
    section_type: 'nav',
    theme_id: 'prescott-luxe',
    keywords: ['nav', 'law', 'header', 'counsel'],
    preview_description: 'Authoritative law firm navigation header with consultation CTA.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/90 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-bold tracking-wider hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">PRESCOTT &amp; STERLING</a>
    <div class="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-widest md:flex">
      <a href="/services" class="hover:text-[var(--qm-accent)] transition">Practice Areas</a>
      <a href="/team" class="hover:text-[var(--qm-accent)] transition">Attorneys</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">Firm Profile</a>
      <a href="/contact" class="rounded-none bg-[var(--qm-accent)] px-5 py-3 text-[10px] font-bold text-[var(--qm-accent-text)] tracking-wider hover:opacity-90 transition duration-200">Request Counsel</a>
    </div>
    <button type="button" class="border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#law-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="law-mobile-menu" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/services" class="text-xs font-bold uppercase tracking-wider">Practice Areas</a>
    <a href="/team" class="text-xs font-bold uppercase tracking-wider">Attorneys</a>
    <a href="/about" class="text-xs font-bold uppercase tracking-wider">Firm Profile</a>
    <a href="/contact" class="rounded-none bg-[var(--qm-accent)] px-4 py-3 text-center text-xs font-bold text-[var(--qm-accent-text)]">Request Counsel</a>
  </div>
</nav>`,
  },
  {
    id: 'law-hero-luxe',
    site_type: 'law',
    section_type: 'hero',
    theme_id: 'prescott-luxe',
    keywords: ['hero', 'law', 'firm', 'luxe-reveal'],
    preview_description: 'Prestigious law firm hero banner with bento grid and editorial serif typography.',
    rank: 98,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 lg:py-24 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div class="space-y-8" data-qay-animate="luxe-reveal" data-qay-duration="1.2">
      <div class="inline-flex items-center gap-2 border-b border-[var(--qm-border)] pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">
        CORPORATE LAW &amp; LITIGATION PROTOCOLS
      </div>
      <h1 class="text-6xl font-light leading-[0.9] md:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        Preeminent Counsel.<br/>Uncompromising Ethics.
      </h1>
      <p class="max-w-lg text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] font-light" data-qm="hero-subtitle">
        We provide sophisticated transactional advice and battle-tested trial defense to global enterprises, investment funds, and high-net-worth individuals.
      </p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/contact" class="rounded-none bg-[var(--qm-accent)] px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--qm-accent-text)] shadow-xl hover:opacity-90 transition duration-200">Schedule Review</a>
        <a href="/services" class="rounded-none border border-[var(--qm-border)] px-8 py-4 text-[11px] font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">Practice Areas</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-none border border-[var(--qm-border)] col-span-2 aspect-[16/10]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&q=85" alt="Attorneys discussing case" class="h-full w-full object-cover" />
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">98%</p>
        <p class="text-[9px] font-bold uppercase tracking-widest text-[var(--qm-text-muted)]">Trial Success</p>
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$4.2B</p>
        <p class="text-[9px] font-bold uppercase tracking-widest text-[var(--qm-text-muted)]">Capital Settled</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'law-services-bento',
    site_type: 'law',
    section_type: 'services',
    theme_id: 'prescott-luxe',
    keywords: ['services', 'practices', 'bento', 'corporate'],
    preview_description: 'Bento-style practice areas matrix detailing legal services.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="max-w-3xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">PRACTICE AREAS</p>
      <h2 class="text-4xl md:text-5xl font-light tracking-tight" style="font-family:var(--qm-heading-font)">THE SPECTRUM OF DEFENSE</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Card 1 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">01 / TRANSACTIONS</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Corporate &amp; M&amp;A</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light leading-relaxed">Advising on high-value mergers, global restructuring, joint ventures, and venture financing agreements.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Consult Practice &rarr;</span>
      </article>

      <!-- Card 2 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">02 / TRIAL</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Commercial Litigation</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light leading-relaxed">Representing stakeholders in complex business disputes, securities litigation, and international arbitration.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Consult Practice &rarr;</span>
      </article>

      <!-- Card 3 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">03 / COMPLIANCE</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Regulatory Defense</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light leading-relaxed">Navigating governmental antitrust investigations, compliance audits, and global data privacy protocols.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Consult Practice &rarr;</span>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'law-team-bento',
    site_type: 'law',
    section_type: 'team',
    theme_id: 'prescott-luxe',
    keywords: ['team', 'partners', 'bento', 'attorneys'],
    preview_description: 'Bento-style team grid with detailed attorney headshots and practice focuses.',
    rank: 80,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">THE PARTNERS</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">LEGAL LEADERSHIP</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Member 1 -->
      <article class="group border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="scale">
        <div class="overflow-hidden aspect-square relative" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&q=85" alt="Senior Partner portrait" class="h-full w-full object-cover grayscale contrast-125" />
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Marcus Prescott</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-bold uppercase tracking-wider mt-1">Senior Managing Partner &bull; Corporate</p>
        </div>
      </article>

      <!-- Member 2 -->
      <article class="group border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="scale">
        <div class="overflow-hidden aspect-square relative" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&q=85" alt="Partner litigation portrait" class="h-full w-full object-cover grayscale contrast-125" />
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Evelyn Sterling</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-bold uppercase tracking-wider mt-1">Lead Litigation Counsel &bull; Trial</p>
        </div>
      </article>

      <!-- Member 3 -->
      <article class="group border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="scale">
        <div class="overflow-hidden aspect-square relative" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&q=85" alt="Partner IP portrait" class="h-full w-full object-cover grayscale contrast-125" />
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">David Vance</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-bold uppercase tracking-wider mt-1">Partner &bull; Intellectual Property</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'law-stats-luxe',
    site_type: 'law',
    section_type: 'stats',
    theme_id: 'prescott-luxe',
    keywords: ['stats', 'metrics', 'proof', 'credibility'],
    preview_description: 'Clean statistics block outlining years of practice, settlements, and success.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-16 text-[var(--qm-text)] border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
    <div class="p-6 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">35+</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Years Active</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Guiding business decisions and courtroom defenses since 1991.</p>
    </div>
    <div class="p-6 border border(--qm-border)] bg-[var(--qm-bg)]/20 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$4B+</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Capital Secured</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Total value recovered or protected across corporate settlements.</p>
    </div>
    <div class="p-6 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">98%</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Case Success</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Percentage of corporate arbitrations resolved in client favor.</p>
    </div>
    <div class="p-6 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-2" data-qay-hover="scale">
      <p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">18</p>
      <h3 class="text-xs font-bold uppercase tracking-wider">Expert Attorneys</h3>
      <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Elite legal minds educated at top national law academies.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'law-testimonials-luxe',
    site_type: 'law',
    section_type: 'testimonials',
    theme_id: 'prescott-luxe',
    keywords: ['testimonials', 'reviews', 'quotes'],
    preview_description: 'Preeminent testimonial quoting institutional trust and partnership.',
    rank: 80,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-4xl text-center space-y-8" data-qay-animate="luxe-reveal">
    <blockquote class="text-3xl md:text-5xl font-light leading-snug tracking-tight" style="font-family:var(--qm-heading-font)">
      "Prescott &amp; Sterling navigated our cross-border acquisition with precision. Their counsel is strategic, calm under pressure, and always aligned with our corporate goals."
    </blockquote>
    <div class="space-y-1">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">Gregory Vance</p>
      <p class="text-[10px] font-semibold text-[var(--qm-text-muted)] uppercase tracking-wider">CEO &bull; Vanguard Capital Holdings</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'law-contact-bento',
    site_type: 'law',
    section_type: 'contact',
    theme_id: 'prescott-luxe',
    keywords: ['contact', 'consultation', 'address', 'bento'],
    preview_description: 'Bento-style contact grid with consultation form and firm coordinates.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-t border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2 lg:items-center">
    <div class="space-y-6" data-qay-animate="slide-right">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">CONSULTATION</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">ACQUIRE STRATEGIC ADVICE</h2>
      <p class="text-sm font-light text-[var(--qm-text-muted)] leading-relaxed">
        Initiate a confidential review of your case. Our administrative partners will direct your inquiry to the appropriate practice leader for evaluation.
      </p>
      <div class="space-y-4 pt-4 text-xs font-bold uppercase tracking-wider border-t border-[var(--qm-border)]">
        <div>
          <span class="text-[9px] text-[var(--qm-text-muted)]">ADDRESS</span>
          <p class="mt-1">45 Wall Street, Suite 1200, New York, NY</p>
        </div>
        <div>
          <span class="text-[9px] text-[var(--qm-text-muted)]">TELEPHONE</span>
          <p class="mt-1">+1 (212) 555-8900</p>
        </div>
      </div>
    </div>
    <form class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/50 space-y-4" data-qay-animate="slide-left">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Full Name</label>
          <input type="text" placeholder="John Doe" class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Company Name</label>
          <input type="text" placeholder="Acme Corp" class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]" />
        </div>
      </div>
      <div class="space-y-1">
        <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Practice Focus</label>
        <select class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]">
          <option>Corporate / Transactions</option>
          <option>Commercial Litigation / Trial</option>
          <option>Regulatory Compliance / Defense</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Brief Description</label>
        <textarea rows="3" placeholder="Outline context..." class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]"></textarea>
      </div>
      <button type="submit" class="w-full bg-[var(--qm-accent)] py-3 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] hover:opacity-90 transition">Request Review</button>
    </form>
  </div>
</section>`,
  },
  {
    id: 'law-footer-luxe',
    site_type: 'law',
    section_type: 'footer',
    theme_id: 'prescott-luxe',
    keywords: ['footer', 'law', 'links'],
    preview_description: 'Authoritative legal footer with brand info, quick navigation, and legal disclaimer.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
    <div class="space-y-4">
      <p class="text-xl font-bold text-[var(--qm-text)] tracking-wider" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">PRESCOTT &amp; STERLING</p>
      <p class="max-w-sm text-xs font-light leading-relaxed">National law firm offering sophisticated transactional guidance, commercial litigation counsel, and regulatory defense protocols.</p>
    </div>
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-text)]">PRACTICES</h4>
      <div class="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider">
        <a href="/corporate" class="hover:text-[var(--qm-text)] transition">Corporate Law</a>
        <a href="/litigation" class="hover:text-[var(--qm-text)] transition">Litigation</a>
        <a href="/regulatory" class="hover:text-[var(--qm-text)] transition">Regulatory</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-text)]">DISCLAIMER</h4>
      <div class="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider">
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Attorney Advertising</a>
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Terms of Use</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest">
    <p>&copy; 2026 PRESCOTT &amp; STERLING. ALL RIGHTS RESERVED.</p>
    <p>ESTABLISHED 1991 &bull; NEW YORK &bull; DC</p>
  </div>
</footer>`,
  },
];
