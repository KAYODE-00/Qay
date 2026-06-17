import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'beauty-theme-rose-luxe',
    site_type: 'beauty',
    theme_id: 'rose-luxe',
    label: 'Rose Luxe',
    keywords: ['luxury', 'salon', 'spa', 'elegant', 'feminine', 'blush', 'rose', 'beauty', 'premium', 'sophisticated'],
    css_variables: {
      '--qm-bg': '#fdf6f6',
      '--qm-surface': '#ffffff',
      '--qm-text': '#2d1a24',
      '--qm-text-muted': '#8a6670',
      '--qm-accent': '#c85578',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(45,26,36,0.10)',
      '--qm-heading-font': '"Cormorant Garamond", serif',
      '--qm-body-font': '"DM Sans", sans-serif',
    },
    google_fonts: ['Cormorant+Garamond:wght@400;500;600;700', 'DM+Sans:wght@400;500;700'],
    is_dark: false,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  /* ── NAV ── */
  {
    id: 'beauty-nav-luxe',
    site_type: 'beauty',
    section_type: 'nav',
    theme_id: 'rose-luxe',
    keywords: ['luxury', 'salon', 'booking', 'elegant', 'navigation'],
    preview_description: 'Elegant beauty salon navigation with booking CTA and rose-gold accent.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur-md" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-2xl font-semibold italic tracking-wide" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Luma Beauty</a>
    <div class="hidden items-center gap-8 text-sm font-medium md:flex" style="font-family:var(--qm-body-font)">
      <a href="/services" class="transition hover:text-[var(--qm-accent)]">Services</a>
      <a href="/gallery" class="transition hover:text-[var(--qm-accent)]">Gallery</a>
      <a href="/team" class="transition hover:text-[var(--qm-accent)]">Stylists</a>
      <a href="/contact" class="transition hover:text-[var(--qm-accent)]">Contact</a>
      <a href="/book" class="rounded-full bg-[var(--qm-accent)] px-6 py-3 text-sm font-medium text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/20 transition hover:opacity-90" data-qay-hover="scale">Book Now</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-xs md:hidden" data-qay-click="toggle" data-qay-target="#beauty-mobile-menu" data-qay-class="hidden" aria-controls="beauty-mobile-menu" aria-expanded="false">Menu</button>
  </div>
  <div id="beauty-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/services" class="py-2">Services</a><a href="/gallery" class="py-2">Gallery</a><a href="/team" class="py-2">Stylists</a><a href="/contact" class="py-2">Contact</a>
    <a href="/book" class="mt-2 rounded-full bg-[var(--qm-accent)] px-5 py-3 text-center text-[var(--qm-accent-text)]">Book Now</a>
  </div>
</nav>`,
  },

  /* ── HERO ── */
  {
    id: 'beauty-hero-luxe',
    site_type: 'beauty',
    section_type: 'hero',
    theme_id: 'rose-luxe',
    keywords: ['luxury', 'salon', 'spa', 'hero', 'split', 'elegant', 'booking'],
    preview_description: 'Stunning split hero with salon imagery, elegant serif headline, and dual CTA buttons with glassmorphism accents.',
    rank: 96,
    html: `<section class="relative min-h-[780px] bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1fr_1.1fr]">
    <div class="flex flex-col justify-center px-6 py-20 md:px-14 lg:py-28" data-qay-animate="slide-right" data-qay-duration="1.0">
      <p class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">&#10022; Luxury Salon &amp; Spa</p>
      <h1 class="mt-7 text-5xl font-semibold leading-[1.05] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Where beauty meets artistry, and you leave radiant.</h1>
      <p class="mt-7 max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">Expert stylists, premium products, and a serene atmosphere designed to make every visit feel like a personal retreat.</p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <a href="/book" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-center font-medium text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/25 transition hover:shadow-xl" data-qay-hover="scale" data-qm="hero-cta-primary">Book Your Session</a>
        <a href="/services" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-center font-medium text-[var(--qm-text)] transition hover:bg-[var(--qm-surface)]" data-qm="hero-cta-secondary">View Services</a>
      </div>
      <div class="mt-12 flex items-center gap-8 text-sm text-[var(--qm-text-muted)]" data-qay-animate="fade-in" data-qay-delay="0.5">
        <div><span class="block text-2xl font-semibold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)">12+</span> Years of Excellence</div>
        <div class="h-8 w-px bg-[var(--qm-border)]"></div>
        <div><span class="block text-2xl font-semibold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)">5k+</span> Happy Clients</div>
        <div class="h-8 w-px bg-[var(--qm-border)]"></div>
        <div><span class="block text-2xl font-semibold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)">4.9</span> Star Rating</div>
      </div>
    </div>
    <div class="relative min-h-[560px] lg:min-h-full">
      <div class="absolute inset-0 grid grid-cols-2 gap-3 p-4">
        <div class="relative overflow-hidden rounded-3xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&q=85" alt="Woman receiving luxury hair styling" class="h-full w-full object-cover" data-qm="hero-image-1" /></div>
        <div class="relative mt-12 overflow-hidden rounded-3xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&q=85" alt="Spa facial treatment in serene setting" class="h-full w-full object-cover" data-qm="hero-image-2" /></div>
      </div>
      <div class="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/20 bg-white/70 p-5 backdrop-blur-xl" data-qay-animate="slide-up" data-qay-delay="0.8">
        <p class="text-sm font-medium text-[var(--qm-text)]">&#127942; Award-winning salon &mdash; Voted Best Luxury Salon 2025</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── SERVICES ── */
  {
    id: 'beauty-services-luxe',
    site_type: 'beauty',
    section_type: 'services',
    theme_id: 'rose-luxe',
    keywords: ['services', 'treatments', 'spa', 'hair', 'bento', 'grid', 'pricing'],
    preview_description: 'Bento grid service cards with treatment images, descriptions and pricing for salon and spa offerings.',
    rank: 94,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="services-eyebrow">Our Expertise</p>
      <h2 class="mt-4 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="services-title">Signature Treatments</h2>
      <p class="mx-auto mt-5 max-w-2xl text-lg text-[var(--qm-text-muted)]" data-qm="services-subtitle">Every service is a curated experience, tailored to bring out your natural radiance.</p>
    </div>
    <div class="mt-16 grid gap-5 md:grid-cols-3">
      <div class="group relative overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] md:row-span-2" data-qay-hover="luxe-lift">
        <div class="h-64 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&q=85" alt="Professional hair styling session" class="h-full w-full object-cover" /></div>
        <div class="p-7">
          <span class="inline-block rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--qm-accent)]">Most Popular</span>
          <h3 class="mt-4 text-2xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-1-name">Hair Styling &amp; Color</h3>
          <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="service-1-desc">From precision cuts to balayage and creative color, our master stylists craft looks that turn heads.</p>
          <p class="mt-5 text-xl font-semibold text-[var(--qm-accent)]" data-qm="service-1-price">From $85</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128134;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-2-name">Luxury Facials</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="service-2-desc">Deep cleansing, hydration therapy, and anti-aging treatments using premium skincare lines.</p>
        <p class="mt-4 text-lg font-semibold text-[var(--qm-accent)]" data-qm="service-2-price">From $120</p>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128�;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-3-name">Bridal Packages</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="service-3-desc">Complete bridal beauty &mdash; hair, makeup, nails, and a trial session to ensure your perfect day look.</p>
        <p class="mt-4 text-lg font-semibold text-[var(--qm-accent)]" data-qm="service-3-price">From $350</p>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128133;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-4-name">Nail Artistry</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="service-4-desc">Gel extensions, artistic nail designs, luxury manicures and pedicures in a relaxing environment.</p>
        <p class="mt-4 text-lg font-semibold text-[var(--qm-accent)]" data-qm="service-4-price">From $55</p>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-7 md:col-span-2" data-qay-hover="luxe-lift">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#127804;</div>
            <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-5-name">Full Spa Retreat</h3>
            <p class="mt-3 max-w-md text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="service-5-desc">A half-day escape with massage, facial, body scrub, and aromatherapy &mdash; the ultimate self-care indulgence.</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-semibold text-[var(--qm-accent)]" data-qm="service-5-price">$280</p>
            <a href="/book" class="mt-3 inline-flex rounded-full bg-[var(--qm-accent)] px-6 py-3 text-sm font-medium text-[var(--qm-accent-text)]" data-qay-hover="scale">Book Retreat</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── GALLERY ── */
  {
    id: 'beauty-gallery-luxe',
    site_type: 'beauty',
    section_type: 'gallery',
    theme_id: 'rose-luxe',
    keywords: ['gallery', 'portfolio', 'before-after', 'salon', 'transformations', 'bento'],
    preview_description: 'Masonry-style bento gallery showcasing salon transformations and spa ambience with hover zoom effects.',
    rank: 92,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center" data-qay-animate="luxe-reveal">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Our Portfolio</p>
      <h2 class="mt-4 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">Beauty in Every Detail</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-4 md:grid-rows-3" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-2xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&auto=format&q=85" alt="Stylist creating elegant updo hairstyle" class="h-full min-h-[320px] w-full object-cover" data-qm="gallery-image-1" /></div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&auto=format&q=85" alt="Professional makeup application" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-2" /></div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&q=85" alt="Luxury beauty products display" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-3" /></div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&q=85" alt="Relaxing spa facial treatment" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-4" /></div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&q=85" alt="Nail art design closeup" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-5" /></div>
      <div class="relative overflow-hidden rounded-2xl md:col-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1000&auto=format&q=85" alt="Serene salon interior with modern decor" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-6" />
        <div class="absolute inset-0 flex items-center justify-center bg-[var(--qm-accent)]/20 backdrop-blur-sm">
          <a href="/gallery" class="rounded-full bg-[var(--qm-surface)] px-6 py-3 text-sm font-medium text-[var(--qm-text)] shadow-xl transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]" data-qay-hover="scale">View Full Gallery &rarr;</a>
        </div>
      </div>
      <div class="overflow-hidden rounded-2xl md:col-span-2" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1000&auto=format&q=85" alt="Woman with gorgeous highlighted hair" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-7" /></div>
    </div>
  </div>
</section>`,
  },

  /* ── TEAM ── */
  {
    id: 'beauty-team-luxe',
    site_type: 'beauty',
    section_type: 'team',
    theme_id: 'rose-luxe',
    keywords: ['team', 'stylists', 'artists', 'staff', 'professionals'],
    preview_description: 'Elegant team showcase with stylist photos, specialties, and experience in a clean card layout.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Our Artists</p>
        <h2 class="mt-4 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">Meet the Talent Behind the Mirror</h2>
      </div>
      <a href="/team" class="shrink-0 rounded-full border border-[var(--qm-border)] px-6 py-3 text-sm font-medium transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">Meet the Full Team &rarr;</a>
    </div>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&q=85" alt="Lead hair stylist portrait" class="h-full w-full object-cover" data-qm="team-1-image" /></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold" style="font-family:var(--qm-heading-font)" data-qm="team-1-name">Amara Okafor</h3>
          <p class="mt-1 text-sm font-medium text-[var(--qm-accent)]" data-qm="team-1-role">Lead Stylist</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-1-bio">15 years of editorial experience. Specialist in color theory and balayage techniques.</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&auto=format&q=85" alt="Makeup artist portrait" class="h-full w-full object-cover" data-qm="team-2-image" /></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold" style="font-family:var(--qm-heading-font)" data-qm="team-2-name">Isabelle Chen</h3>
          <p class="mt-1 text-sm font-medium text-[var(--qm-accent)]" data-qm="team-2-role">Makeup Director</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-2-bio">Celebrity makeup artist with a refined eye for enhancing natural beauty.</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&q=85" alt="Spa therapist portrait" class="h-full w-full object-cover" data-qm="team-3-image" /></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold" style="font-family:var(--qm-heading-font)" data-qm="team-3-name">Priya Venkatesh</h3>
          <p class="mt-1 text-sm font-medium text-[var(--qm-accent)]" data-qm="team-3-role">Spa Therapist</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-3-bio">Certified holistic therapist specializing in deep tissue and aromatherapy treatments.</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&q=85" alt="Nail artist portrait" class="h-full w-full object-cover" data-qm="team-4-image" /></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold" style="font-family:var(--qm-heading-font)" data-qm="team-4-name">Kira Nakamura</h3>
          <p class="mt-1 text-sm font-medium text-[var(--qm-accent)]" data-qm="team-4-role">Nail Artist</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-4-bio">Known for intricate nail art and custom gel designs. Instagram favorite with 50k+ followers.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── TESTIMONIALS ── */
  {
    id: 'beauty-testimonials-luxe',
    site_type: 'beauty',
    section_type: 'testimonials',
    theme_id: 'rose-luxe',
    keywords: ['testimonials', 'reviews', 'clients', 'trust', 'beauty'],
    preview_description: 'Elegant client testimonials with large serif quotes, star ratings, and glassmorphism cards.',
    rank: 92,
    html: `<section class="relative bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="absolute inset-0 opacity-30" style="background:radial-gradient(ellipse at 30% 50%, var(--qm-accent), transparent 70%)"></div>
  <div class="relative mx-auto max-w-7xl">
    <div class="mb-14 text-center" data-qay-animate="luxe-reveal">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Client Love</p>
      <h2 class="mt-4 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="testimonials-title">Words That Make Us Blush</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/80 p-8 backdrop-blur-lg" data-qay-hover="luxe-lift">
        <div class="mb-4 text-[var(--qm-accent)]">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <blockquote class="text-lg leading-relaxed" style="font-family:var(--qm-heading-font)" data-qm="testimonial-1-quote">&ldquo;I walked in feeling exhausted and walked out feeling like a completely new person. The facial was heavenly and my hair has never looked this good.&rdquo;</blockquote>
        <div class="mt-6 flex items-center gap-4">
          <div class="h-12 w-12 overflow-hidden rounded-full bg-[var(--qm-accent)]/10"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&q=85" alt="Client photo" class="h-full w-full object-cover" /></div>
          <div>
            <p class="font-semibold" data-qm="testimonial-1-name">Sarah Mitchell</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="testimonial-1-info">Regular Client &bull; 3 years</p>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/80 p-8 backdrop-blur-lg md:translate-y-6" data-qay-hover="luxe-lift">
        <div class="mb-4 text-[var(--qm-accent)]">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <blockquote class="text-lg leading-relaxed" style="font-family:var(--qm-heading-font)" data-qm="testimonial-2-quote">&ldquo;Amara understood my vision instantly. The balayage was flawless and I&rsquo;ve been getting compliments non-stop. Already booked my next appointment!&rdquo;</blockquote>
        <div class="mt-6 flex items-center gap-4">
          <div class="h-12 w-12 overflow-hidden rounded-full bg-[var(--qm-accent)]/10"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&q=85" alt="Client photo" class="h-full w-full object-cover" /></div>
          <div>
            <p class="font-semibold" data-qm="testimonial-2-name">Diana Torres</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="testimonial-2-info">Bridal Client</p>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/80 p-8 backdrop-blur-lg" data-qay-hover="luxe-lift">
        <div class="mb-4 text-[var(--qm-accent)]">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <blockquote class="text-lg leading-relaxed" style="font-family:var(--qm-heading-font)" data-qm="testimonial-3-quote">&ldquo;The full spa retreat was the most relaxing 4 hours of my life. Every detail was perfect &mdash; the ambience, the products, the care. Absolutely worth it.&rdquo;</blockquote>
        <div class="mt-6 flex items-center gap-4">
          <div class="h-12 w-12 overflow-hidden rounded-full bg-[var(--qm-accent)]/10"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&q=85" alt="Client photo" class="h-full w-full object-cover" /></div>
          <div>
            <p class="font-semibold" data-qm="testimonial-3-name">James Adeyemi</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="testimonial-3-info">First-time Visitor</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── CTA ── */
  {
    id: 'beauty-cta-luxe',
    site_type: 'beauty',
    section_type: 'cta',
    theme_id: 'rose-luxe',
    keywords: ['cta', 'booking', 'appointment', 'action', 'salon'],
    preview_description: 'Stunning full-width CTA section with gradient overlay, elegant typography, and prominent booking button.',
    rank: 93,
    html: `<section class="relative overflow-hidden bg-[var(--qm-accent)] px-5 py-28 text-[var(--qm-accent-text)]">
  <div class="absolute inset-0 opacity-20" style="background:radial-gradient(circle at 20% 80%, #fff, transparent 50%), radial-gradient(circle at 80% 20%, #fff, transparent 40%)"></div>
  <div class="relative mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-white/70" data-qm="cta-eyebrow">Your Transformation Awaits</p>
    <h2 class="mt-6 text-4xl font-semibold leading-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="cta-title">Ready to Discover Your Most Radiant Self?</h2>
    <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80" data-qm="cta-subtitle">Book your session today and experience the luxury of personalized beauty care crafted just for you.</p>
    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a href="/book" class="rounded-full bg-[var(--qm-surface)] px-10 py-4 text-lg font-medium text-[var(--qm-accent)] shadow-2xl transition hover:shadow-xl" data-qay-hover="scale" data-qm="cta-button-primary">Book Your Session</a>
      <a href="tel:+1234567890" class="rounded-full border border-white/30 px-8 py-4 font-medium text-[var(--qm-accent-text)] transition hover:bg-white/10" data-qm="cta-button-secondary">Call Us &rarr;</a>
    </div>
    <p class="mt-8 text-sm text-white/60" data-qm="cta-note">Free consultation &bull; Flexible scheduling &bull; Premium products only</p>
  </div>
</section>`,
  },

  /* ── FOOTER ── */
  {
    id: 'beauty-footer-luxe',
    site_type: 'beauty',
    section_type: 'footer',
    theme_id: 'rose-luxe',
    keywords: ['footer', 'links', 'salon', 'hours', 'contact'],
    preview_description: 'Premium beauty salon footer with brand name, navigation links, hours, and social indicators.',
    rank: 90,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-4">
      <div class="md:col-span-1">
        <a href="/" class="text-2xl font-semibold italic" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Luma Beauty</a>
        <p class="mt-4 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="footer-tagline">Luxury salon &amp; spa &mdash; where beauty is an art form and every visit is an experience.</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Services</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/services" class="transition hover:text-[var(--qm-text)]">Hair Styling</a>
          <a href="/services" class="transition hover:text-[var(--qm-text)]">Spa Treatments</a>
          <a href="/services" class="transition hover:text-[var(--qm-text)]">Makeup</a>
          <a href="/services" class="transition hover:text-[var(--qm-text)]">Nail Artistry</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Studio</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/team" class="transition hover:text-[var(--qm-text)]">Our Stylists</a>
          <a href="/gallery" class="transition hover:text-[var(--qm-text)]">Gallery</a>
          <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
          <a href="/book" class="transition hover:text-[var(--qm-text)]">Book Online</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Hours</p>
        <div class="mt-4 flex flex-col gap-2 text-sm text-[var(--qm-text-muted)]">
          <p>Mon&ndash;Fri: 9am &ndash; 8pm</p>
          <p>Saturday: 9am &ndash; 6pm</p>
          <p>Sunday: 10am &ndash; 5pm</p>
        </div>
        <p class="mt-5 text-sm text-[var(--qm-text-muted)]" data-qm="footer-address">123 Beauty Lane, Downtown</p>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-sm text-[var(--qm-text-muted)] md:flex-row">
      <p data-qm="footer-copyright">&copy; 2025 Luma Beauty. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="/privacy" class="transition hover:text-[var(--qm-text)]">Privacy</a>
        <a href="/terms" class="transition hover:text-[var(--qm-text)]">Terms</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
