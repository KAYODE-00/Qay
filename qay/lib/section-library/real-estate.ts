import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'real-estate-theme-prestige',
    site_type: 'real-estate',
    theme_id: 'prestige',
    label: 'Prestige Homes',
    keywords: ['real estate', 'luxury', 'property', 'homes', 'listing', 'realtor', 'apartment', 'housing', 'clean'],
    css_variables: {
      '--qm-bg': '#f7f6f2',
      '--qm-surface': '#ffffff',
      '--qm-text': '#141c14',
      '--qm-text-muted': '#5a6a58',
      '--qm-accent': '#1b4332',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(20,28,20,0.10)',
      '--qm-heading-font': '"Cormorant Garamond", serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Cormorant+Garamond:wght@400;500;600;700', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ───────────────────── NAV ───────────────────── */
  {
    id: 'real-estate-nav-prestige',
    site_type: 'real-estate',
    section_type: 'nav',
    theme_id: 'prestige',
    keywords: ['nav', 'luxury', 'listings', 'clean', 'real-estate'],
    preview_description: 'Clean luxury real estate navigation with forest green accent and property listing CTA.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-semibold tracking-[0.1em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Prestige Homes</a>
    <div class="hidden items-center gap-8 text-sm font-medium text-[var(--qm-text-muted)] md:flex">
      <a href="/listings" class="transition hover:text-[var(--qm-accent)]">Listings</a>
      <a href="/about" class="transition hover:text-[var(--qm-accent)]">About</a>
      <a href="/agents" class="transition hover:text-[var(--qm-accent)]">Our Agents</a>
      <a href="/contact" class="transition hover:text-[var(--qm-accent)]">Contact</a>
      <a href="/listings" class="rounded-lg bg-[var(--qm-accent)] px-6 py-3 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">View Listings</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-lg border border-[var(--qm-border)] text-sm md:hidden" data-qay-click="toggle" data-qay-target="#real-estate-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="real-estate-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-sm shadow-2xl md:hidden">
    <a href="/listings">Listings</a><a href="/about">About</a><a href="/agents">Our Agents</a><a href="/contact">Contact</a>
    <a href="/listings" class="rounded-lg bg-[var(--qm-accent)] px-5 py-3 text-center font-semibold text-[var(--qm-accent-text)]">View Listings</a>
  </div>
</nav>`,
  },

  /* ───────────────────── HERO ───────────────────── */
  {
    id: 'real-estate-hero-prestige',
    site_type: 'real-estate',
    section_type: 'hero',
    theme_id: 'prestige',
    keywords: ['hero', 'luxury', 'property', 'split', 'search', 'elegant'],
    preview_description: 'Luxury real estate hero with full-bleed property image, editorial headline, search prompt, and trust stats.',
    rank: 97,
    html: `<section class="relative min-h-[88vh] overflow-hidden bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <div class="absolute inset-0">
    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&auto=format&q=85" alt="Luxury modern home with pool at twilight" class="h-full w-full object-cover" data-qm="hero-bg-image" />
    <div class="absolute inset-0 bg-gradient-to-r from-[var(--qm-bg)] via-[var(--qm-bg)]/80 to-transparent"></div>
  </div>
  <div class="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-20 md:px-10">
    <div class="max-w-2xl" data-qay-animate="luxe-reveal">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Luxury Real Estate</p>
      <h1 class="mt-6 text-5xl leading-[0.92] md:text-7xl lg:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Find a home that reflects who you are.</h1>
      <p class="mt-8 max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Prestige Homes curates exceptional properties in the most sought-after neighborhoods. Let our expert agents guide you to your perfect residence.</p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <a href="/listings" class="rounded-lg bg-[var(--qm-accent)] px-8 py-4 text-center font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="hero-cta-primary">Browse Properties</a>
        <a href="/contact" class="rounded-lg border border-[var(--qm-accent)] px-8 py-4 text-center font-semibold text-[var(--qm-accent)] transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]" data-qm="hero-cta-secondary">Schedule Viewing</a>
      </div>
      <div class="mt-14 flex gap-10 border-t border-[var(--qm-border)] pt-8" data-qay-animate="stagger-children">
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]">500+</p>
          <p class="mt-1 text-xs uppercase tracking-widest text-[var(--qm-text-muted)]">Properties Sold</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]">$2.1B</p>
          <p class="mt-1 text-xs uppercase tracking-widest text-[var(--qm-text-muted)]">Total Volume</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]">98%</p>
          <p class="mt-1 text-xs uppercase tracking-widest text-[var(--qm-text-muted)]">Client Satisfaction</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── FEATURES ───────────────────── */
  {
    id: 'real-estate-features-prestige',
    site_type: 'real-estate',
    section_type: 'features',
    theme_id: 'prestige',
    keywords: ['features', 'why-us', 'services', 'bento', 'value-prop'],
    preview_description: 'Bento grid feature cards showcasing real estate services with forest green accents and asymmetric layout.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-2xl" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Why Prestige</p>
      <h2 class="mt-4 text-4xl md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="features-title">Real estate, elevated</h2>
      <p class="mt-5 text-lg text-[var(--qm-text-muted)]">A concierge approach to buying, selling, and investing in premium properties.</p>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2" data-qay-animate="stagger-children">
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 md:row-span-2" data-qay-hover="luxe-lift">
        <div class="mb-6 flex size-14 items-center justify-center rounded-xl bg-[var(--qm-accent)] text-2xl text-[var(--qm-accent-text)]">&#127968;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="feature-1-title">Curated Listings</h3>
        <p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-1-desc">We don&rsquo;t list everything &mdash; we list the best. Every property is hand-selected to meet our standards of quality, location, and value. From penthouses to historic estates, only exceptional homes make the cut.</p>
        <div class="mt-8 overflow-hidden rounded-xl" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&q=85" alt="Modern luxury home exterior" class="h-48 w-full object-cover" />
        </div>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-4 flex size-14 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-2xl">&#128270;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="feature-2-title">Market Intelligence</h3>
        <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-2-desc">Real-time analytics, neighborhood insights, and pricing data to help you make informed decisions with confidence.</p>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-4 flex size-14 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-2xl">&#129309;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="feature-3-title">White-Glove Service</h3>
        <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-3-desc">From first viewing to final closing, your dedicated agent handles every detail so you can focus on what matters.</p>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-accent)] p-8 text-[var(--qm-accent-text)] md:col-span-2" data-qay-hover="luxe-lift">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="feature-4-title">Nationwide Network</h3>
            <p class="mt-3 max-w-md text-sm leading-7 opacity-80" data-qm="feature-4-desc">Access off-market listings and exclusive deals through our network of 200+ partner agencies across the country.</p>
          </div>
          <a href="/listings" class="shrink-0 rounded-lg bg-[var(--qm-accent-text)] px-6 py-3 text-center font-semibold text-[var(--qm-accent)] transition hover:opacity-90">Explore Now &rarr;</a>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── GALLERY ───────────────────── */
  {
    id: 'real-estate-gallery-prestige',
    site_type: 'real-estate',
    section_type: 'gallery',
    theme_id: 'prestige',
    keywords: ['gallery', 'properties', 'listings', 'bento', 'images', 'luxury-homes'],
    preview_description: 'Bento grid property gallery with featured listings, pricing badges, and hover zoom effects.',
    rank: 93,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-qay-animate="slide-up">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Featured Properties</p>
        <h2 class="mt-4 text-4xl md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">Handpicked for distinction</h2>
      </div>
      <a href="/listings" class="text-sm font-semibold text-[var(--qm-accent)] transition hover:opacity-80">View All Properties &rarr;</a>
    </div>
    <div class="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2" data-qay-animate="stagger-children">
      <div class="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&q=85" alt="Modern luxury villa with infinity pool" class="h-[320px] w-full object-cover md:h-full" data-qm="gallery-img-1" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <span class="rounded-full bg-[var(--qm-accent)] px-3 py-1 text-xs font-semibold text-[var(--qm-accent-text)]">Featured</span>
          <h3 class="mt-3 text-2xl font-semibold text-white" style="font-family:var(--qm-heading-font)">Coastal Villa Estate</h3>
          <p class="mt-1 text-sm text-white/70">5 Bed &bull; 4 Bath &bull; 6,200 sqft</p>
          <p class="mt-2 text-xl font-bold text-white">$4,850,000</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&q=85" alt="Modern apartment interior" class="h-[260px] w-full object-cover" data-qm="gallery-img-2" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <h3 class="text-lg font-semibold text-white" style="font-family:var(--qm-heading-font)">Midtown Penthouse</h3>
          <p class="mt-1 text-xs text-white/70">3 Bed &bull; 2 Bath &bull; 2,800 sqft</p>
          <p class="mt-1 font-bold text-white">$2,100,000</p>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&q=85" alt="Classic stone house with garden" class="h-[260px] w-full object-cover" data-qm="gallery-img-3" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <h3 class="text-lg font-semibold text-white" style="font-family:var(--qm-heading-font)">Garden Estate</h3>
          <p class="mt-1 text-xs text-white/70">4 Bed &bull; 3 Bath &bull; 4,100 sqft</p>
          <p class="mt-1 font-bold text-white">$3,200,000</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── TEAM ───────────────────── */
  {
    id: 'real-estate-team-prestige',
    site_type: 'real-estate',
    section_type: 'team',
    theme_id: 'prestige',
    keywords: ['team', 'agents', 'realtors', 'people', 'staff'],
    preview_description: 'Elegant agent team grid with professional photos, titles, and sales stats.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="text-center" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Our Agents</p>
      <h2 class="mt-4 text-4xl md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">Experts who know every neighborhood</h2>
      <p class="mx-auto mt-5 max-w-2xl text-lg text-[var(--qm-text-muted)]">Our licensed agents bring deep local knowledge, negotiation skills, and a client-first approach to every transaction.</p>
    </div>
    <div class="mt-14 grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&q=85" alt="Real estate agent portrait" class="h-72 w-full object-cover" data-qm="agent-1-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="agent-1-name">Marcus Williams</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="agent-1-role">Senior Luxury Agent</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="agent-1-desc">Specializing in waterfront properties with $180M+ in career sales.</p>
        </div>
      </article>
      <article class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&q=85" alt="Female real estate agent" class="h-72 w-full object-cover" data-qm="agent-2-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="agent-2-name">Elena Rodriguez</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="agent-2-role">Lead Acquisitions Agent</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="agent-2-desc">Top 1% agent nationally with expertise in historic homes and estates.</p>
        </div>
      </article>
      <article class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&q=85" alt="Real estate agent professional" class="h-72 w-full object-cover" data-qm="agent-3-image" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="agent-3-name">James Okonkwo</h3>
          <p class="mt-1 text-sm text-[var(--qm-accent)]" data-qm="agent-3-role">Investment Specialist</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="agent-3-desc">Commercial and residential portfolio management with 15+ years of experience.</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── TESTIMONIALS ───────────────────── */
  {
    id: 'real-estate-testimonials-prestige',
    site_type: 'real-estate',
    section_type: 'testimonials',
    theme_id: 'prestige',
    keywords: ['testimonials', 'reviews', 'clients', 'trust', 'homebuyers'],
    preview_description: 'Premium testimonials with large editorial quote and client review cards in clean layout.',
    rank: 88,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div data-qay-animate="luxe-reveal">
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Client Stories</p>
        <p class="mt-8 text-4xl text-[var(--qm-accent)]">&ldquo;</p>
        <blockquote class="mt-2 text-3xl leading-snug md:text-4xl" style="font-family:var(--qm-heading-font)" data-qm="testimonial-quote">Prestige Homes found us a property we didn&rsquo;t even know existed. Their off-market connections and personalized approach made all the difference.</blockquote>
        <div class="mt-8 flex items-center gap-4">
          <div class="size-12 overflow-hidden rounded-full bg-[var(--qm-accent)]/10">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&q=85" alt="Client portrait" class="h-full w-full object-cover" />
          </div>
          <div>
            <p class="font-semibold" data-qm="testimonial-author">Alexandra Chen</p>
            <p class="text-sm text-[var(--qm-text-muted)]">Homebuyer &bull; Waterfront Estate</p>
          </div>
        </div>
      </div>
      <div class="space-y-4" data-qay-animate="stagger-children">
        <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="luxe-lift">
          <div class="flex gap-1 text-[var(--qm-accent)]">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-2-quote">&ldquo;Sold our family home in 12 days at 8% over asking price. Marcus and his team handled everything with professionalism.&rdquo;</p>
          <p class="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="testimonial-2-author">Robert &amp; Maria S.</p>
        </article>
        <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="luxe-lift">
          <div class="flex gap-1 text-[var(--qm-accent)]">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-3-quote">&ldquo;As first-time buyers we felt completely guided through the process. Every question was answered before we even had to ask.&rdquo;</p>
          <p class="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="testimonial-3-author">Tunde &amp; Amina K.</p>
        </article>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── CONTACT ───────────────────── */
  {
    id: 'real-estate-contact-prestige',
    site_type: 'real-estate',
    section_type: 'contact',
    theme_id: 'prestige',
    keywords: ['contact', 'inquiry', 'form', 'viewing', 'consultation'],
    preview_description: 'Clean contact section with inquiry form, office details, and forest green accent styling.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
    <div data-qay-animate="slide-right">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Get in Touch</p>
      <h2 class="mt-5 text-4xl md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="contact-title">Start your property journey</h2>
      <p class="mt-5 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="contact-copy">Whether you&rsquo;re buying, selling, or investing, our team is ready to provide a complimentary consultation tailored to your goals.</p>
      <div class="mt-10 space-y-5 border-t border-[var(--qm-border)] pt-8">
        <div class="flex items-start gap-3">
          <span class="text-lg text-[var(--qm-accent)]">&#128205;</span>
          <div>
            <p class="text-sm font-medium">Main Office</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-address">250 Park Avenue, Suite 1200, New York, NY 10177</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-lg text-[var(--qm-accent)]">&#9993;</span>
          <div>
            <p class="text-sm font-medium">Email</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-email">info@prestigehomes.com</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-lg text-[var(--qm-accent)]">&#128222;</span>
          <div>
            <p class="text-sm font-medium">Phone</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-phone">+1 (212) 555-0180</p>
          </div>
        </div>
      </div>
    </div>
    <form class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-animate="slide-left">
      <div class="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Full Name" class="rounded-lg border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none" />
        <input name="email" placeholder="Email Address" class="rounded-lg border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none" />
      </div>
      <input name="phone" placeholder="Phone Number" class="mt-4 w-full rounded-lg border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none" />
      <select name="interest" class="mt-4 w-full rounded-lg border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none">
        <option>I&rsquo;m interested in...</option>
        <option>Buying a Property</option>
        <option>Selling a Property</option>
        <option>Investment Consultation</option>
        <option>Property Valuation</option>
      </select>
      <textarea name="message" placeholder="Tell us about your ideal property..." class="mt-4 h-28 w-full resize-none rounded-lg border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none"></textarea>
      <button type="submit" class="mt-6 w-full rounded-lg bg-[var(--qm-accent)] px-6 py-4 font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">Request Consultation</button>
    </form>
  </div>
</section>`,
  },

  /* ───────────────────── FOOTER ───────────────────── */
  {
    id: 'real-estate-footer-prestige',
    site_type: 'real-estate',
    section_type: 'footer',
    theme_id: 'prestige',
    keywords: ['footer', 'links', 'social', 'copyright', 'office'],
    preview_description: 'Clean luxury footer with brand, navigation columns, office info, and legal links.',
    rank: 85,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-accent)] px-5 py-14 text-[var(--qm-accent-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div>
        <p class="text-xl font-semibold tracking-[0.1em]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Prestige Homes</p>
        <p class="mt-3 max-w-xs text-sm leading-6 opacity-70" data-qm="footer-tagline">Curating exceptional properties and delivering white-glove real estate service since 2005.</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest opacity-60">Properties</p>
        <div class="mt-4 flex flex-col gap-3 text-sm opacity-80">
          <a href="/listings" class="transition hover:opacity-100">All Listings</a>
          <a href="#" class="transition hover:opacity-100">New Developments</a>
          <a href="#" class="transition hover:opacity-100">Luxury Rentals</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest opacity-60">Company</p>
        <div class="mt-4 flex flex-col gap-3 text-sm opacity-80">
          <a href="/about" class="transition hover:opacity-100">About Us</a>
          <a href="/agents" class="transition hover:opacity-100">Our Agents</a>
          <a href="/contact" class="transition hover:opacity-100">Contact</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest opacity-60">Office</p>
        <p class="mt-4 text-sm leading-6 opacity-80" data-qm="footer-address">250 Park Avenue<br/>Suite 1200<br/>New York, NY 10177</p>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 text-xs opacity-60 md:flex-row">
      <p>&copy; 2025 Prestige Homes. All rights reserved.</p>
      <div class="flex gap-5">
        <a href="#" class="transition hover:opacity-100">Privacy Policy</a>
        <a href="#" class="transition hover:opacity-100">Terms of Service</a>
        <a href="#" class="transition hover:opacity-100">Fair Housing</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
