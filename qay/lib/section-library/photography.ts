import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'photography-theme-iris-warm',
    site_type: 'photography',
    theme_id: 'iris-warm',
    label: 'Iris Warm',
    keywords: ['photography', 'studio', 'minimal', 'dark', 'warm', 'portrait', 'editorial', 'camera', 'lens'],
    css_variables: {
      '--qm-bg': '#0f0f0f',
      '--qm-surface': '#1a1a1a',
      '--qm-text': '#f0ece4',
      '--qm-text-muted': '#8a8478',
      '--qm-accent': '#e8a87c',
      '--qm-accent-text': '#0f0f0f',
      '--qm-border': 'rgba(240,236,228,0.10)',
      '--qm-heading-font': '"DM Serif Display", serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['DM+Serif+Display:wght@400', 'Inter:wght@400;500;600;700'],
    is_dark: true,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ───────────────────── NAV ───────────────────── */
  {
    id: 'photography-nav-iris',
    site_type: 'photography',
    section_type: 'nav',
    theme_id: 'iris-warm',
    keywords: ['nav', 'minimal', 'studio', 'booking', 'dark'],
    preview_description: 'Minimal dark photography nav with warm accent booking CTA and mobile drawer.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl tracking-[0.15em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Iris Studio</a>
    <div class="hidden items-center gap-8 text-sm font-medium text-[var(--qm-text-muted)] md:flex">
      <a href="/gallery" class="transition hover:text-[var(--qm-text)]">Gallery</a>
      <a href="/about" class="transition hover:text-[var(--qm-text)]">About</a>
      <a href="/services" class="transition hover:text-[var(--qm-text)]">Services</a>
      <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
      <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-6 py-3 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">Book a Shoot</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm md:hidden" data-qay-click="toggle" data-qay-target="#photography-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="photography-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-sm shadow-2xl md:hidden">
    <a href="/gallery">Gallery</a><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a>
    <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-center font-semibold text-[var(--qm-accent-text)]">Book a Shoot</a>
  </div>
</nav>`,
  },

  /* ───────────────────── HERO ───────────────────── */
  {
    id: 'photography-hero-iris',
    site_type: 'photography',
    section_type: 'hero',
    theme_id: 'iris-warm',
    keywords: ['hero', 'fullscreen', 'editorial', 'portrait', 'cinematic', 'dramatic'],
    preview_description: 'Cinematic full-bleed hero with editorial typography, gradient overlay, and asymmetric image grid.',
    rank: 97,
    html: `<section class="relative min-h-[90vh] overflow-hidden bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <div class="absolute inset-0 z-0">
    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1800&auto=format&q=85" alt="Dramatic portrait photography with natural light" class="h-full w-full object-cover opacity-40" data-qm="hero-bg-image" />
    <div class="absolute inset-0 bg-gradient-to-t from-[var(--qm-bg)] via-[var(--qm-bg)]/60 to-transparent"></div>
  </div>
  <div class="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40 md:px-10">
    <div data-qay-animate="luxe-reveal">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Professional Photography Studio</p>
      <h1 class="mt-6 max-w-4xl text-5xl leading-[0.92] md:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">We capture light, mood, and the stories in between.</h1>
      <p class="mt-8 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Portrait, editorial, and commercial photography crafted with intention. Every frame designed to feel timeless.</p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-center font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="hero-cta-primary">Book Your Session</a>
        <a href="/gallery" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-center font-medium text-[var(--qm-text)] transition hover:border-[var(--qm-accent)]" data-qm="hero-cta-secondary">View Portfolio</a>
      </div>
    </div>
    <div class="mt-16 grid grid-cols-3 gap-3 md:gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&auto=format&q=85" alt="Portrait shoot" class="h-32 w-full object-cover md:h-48" /></div>
      <div class="overflow-hidden rounded-xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&auto=format&q=85" alt="Landscape photography" class="h-32 w-full object-cover md:h-48" /></div>
      <div class="overflow-hidden rounded-xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&q=85" alt="Nature and wildlife" class="h-32 w-full object-cover md:h-48" /></div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── GALLERY ───────────────────── */
  {
    id: 'photography-gallery-iris',
    site_type: 'photography',
    section_type: 'gallery',
    theme_id: 'iris-warm',
    keywords: ['gallery', 'bento', 'masonry', 'portfolio', 'images', 'grid'],
    preview_description: 'Bento grid gallery with asymmetric image layout, hover zoom effects, and warm category labels.',
    rank: 95,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-qay-animate="slide-up">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Selected Work</p>
        <h2 class="mt-4 text-4xl md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">A curated lens on life</h2>
      </div>
      <div class="flex gap-3 text-sm text-[var(--qm-text-muted)]">
        <span class="rounded-full border border-[var(--qm-accent)] px-4 py-2 text-[var(--qm-accent)]">All</span>
        <span class="rounded-full border border-[var(--qm-border)] px-4 py-2 transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]">Portraits</span>
        <span class="rounded-full border border-[var(--qm-border)] px-4 py-2 transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]">Editorial</span>
        <span class="rounded-full border border-[var(--qm-border)] px-4 py-2 transition hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)]">Landscape</span>
      </div>
    </div>
    <div class="mt-12 grid gap-4 md:grid-cols-4 md:grid-rows-2" data-qay-animate="stagger-children">
      <div class="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&auto=format&q=85" alt="Portrait photography with dramatic lighting" class="h-[320px] w-full object-cover md:h-full" data-qm="gallery-img-1" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        <p class="absolute bottom-4 left-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">Portrait Series &mdash; Studio</p>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&q=85" alt="Golden hour landscape" class="h-[240px] w-full object-cover" data-qm="gallery-img-2" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        <p class="absolute bottom-4 left-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">Golden Hour</p>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&q=85" alt="Wedding photography" class="h-[240px] w-full object-cover" data-qm="gallery-img-3" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        <p class="absolute bottom-4 left-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">Wedding Day</p>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&q=85" alt="Editorial fashion shoot" class="h-[240px] w-full object-cover" data-qm="gallery-img-4" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        <p class="absolute bottom-4 left-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">Editorial</p>
      </div>
      <div class="group relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&auto=format&q=85" alt="Camera and lens studio setup" class="h-[240px] w-full object-cover" data-qm="gallery-img-5" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        <p class="absolute bottom-4 left-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">Behind the Lens</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── ABOUT ───────────────────── */
  {
    id: 'photography-about-iris',
    site_type: 'photography',
    section_type: 'about',
    theme_id: 'iris-warm',
    keywords: ['about', 'story', 'photographer', 'split', 'editorial'],
    preview_description: 'Split about section with photographer portrait, editorial copy, and experience stats.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
    <div class="relative min-h-[560px] overflow-hidden" data-qay-hover="img-zoom">
      <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&auto=format&q=85" alt="Photographer in studio with camera gear" class="h-full w-full object-cover" data-qm="about-image" />
      <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--qm-surface)]/30"></div>
    </div>
    <div class="flex flex-col justify-center px-6 py-20 md:px-14" data-qay-animate="slide-left">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">About the Artist</p>
      <h2 class="mt-5 text-4xl leading-[0.95] md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="about-title">Eyes trained on the extraordinary within the ordinary.</h2>
      <p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">Iris Studio was founded on a simple belief: every person, every moment, every light shift has a story worth preserving. With over a decade behind the lens, we blend technical precision with artistic intuition to create images that resonate long after the shutter clicks.</p>
      <div class="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--qm-border)] pt-8" data-qay-animate="stagger-children">
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]" data-qm="about-stat-1">12+</p>
          <p class="mt-1 text-xs uppercase tracking-widest text-[var(--qm-text-muted)]">Years</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]" data-qm="about-stat-2">800+</p>
          <p class="mt-1 text-xs uppercase tracking-widest text-[var(--qm-text-muted)]">Sessions</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-[var(--qm-accent)]" data-qm="about-stat-3">15</p>
          <p class="mt-1 text-xs uppercase tracking-widest text-[var(--qm-text-muted)]">Awards</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── SERVICES ───────────────────── */
  {
    id: 'photography-services-iris',
    site_type: 'photography',
    section_type: 'services',
    theme_id: 'iris-warm',
    keywords: ['services', 'packages', 'offerings', 'bento', 'pricing'],
    preview_description: 'Bento grid service cards with image accents, warm borders, and hover lift effects.',
    rank: 90,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-2xl" data-qay-animate="slide-up">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">What We Offer</p>
      <h2 class="mt-4 text-4xl md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="services-title">Tailored to your vision</h2>
      <p class="mt-5 text-lg text-[var(--qm-text-muted)]">From intimate portraits to large-scale commercial campaigns, each session is designed around your creative brief.</p>
    </div>
    <div class="mt-14 grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="mb-6 flex size-14 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-2xl">&#128247;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-1-name">Portrait Sessions</h3>
        <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="service-1-desc">Individual, couple, or family portraits in studio or on location. Natural light or dramatic setups crafted to your personality.</p>
        <p class="mt-6 text-sm font-semibold text-[var(--qm-accent)]" data-qm="service-1-price">From $350</p>
        <div class="absolute -bottom-1 -right-1 h-24 w-24 rounded-tl-[3rem] bg-[var(--qm-accent)]/5 transition group-hover:bg-[var(--qm-accent)]/10"></div>
      </article>
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="mb-6 flex size-14 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-2xl">&#127905;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-2-name">Commercial &amp; Editorial</h3>
        <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="service-2-desc">Brand campaigns, product photography, and editorial spreads. Full art direction, styling consultation, and retouching included.</p>
        <p class="mt-6 text-sm font-semibold text-[var(--qm-accent)]" data-qm="service-2-price">From $1,200</p>
        <div class="absolute -bottom-1 -right-1 h-24 w-24 rounded-tl-[3rem] bg-[var(--qm-accent)]/5 transition group-hover:bg-[var(--qm-accent)]/10"></div>
      </article>
      <article class="group relative overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 transition hover:border-[var(--qm-accent)]/40" data-qay-hover="luxe-lift">
        <div class="mb-6 flex size-14 items-center justify-center rounded-xl bg-[var(--qm-accent)]/10 text-2xl">&#128141;</div>
        <h3 class="text-xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="service-3-name">Wedding &amp; Events</h3>
        <p class="mt-3 text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="service-3-desc">Full-day coverage with a second shooter, same-day previews, and a curated gallery delivered within two weeks.</p>
        <p class="mt-6 text-sm font-semibold text-[var(--qm-accent)]" data-qm="service-3-price">From $2,500</p>
        <div class="absolute -bottom-1 -right-1 h-24 w-24 rounded-tl-[3rem] bg-[var(--qm-accent)]/5 transition group-hover:bg-[var(--qm-accent)]/10"></div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── TESTIMONIALS ───────────────────── */
  {
    id: 'photography-testimonials-iris',
    site_type: 'photography',
    section_type: 'testimonials',
    theme_id: 'iris-warm',
    keywords: ['testimonials', 'reviews', 'clients', 'trust', 'social-proof'],
    preview_description: 'Elegant editorial testimonial section with large quote typography and client grid.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Kind Words</p>
      <p class="mt-8 text-4xl text-[var(--qm-accent)]">&ldquo;</p>
      <blockquote class="mt-2 text-3xl leading-snug md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="testimonial-quote">She didn&rsquo;t just take photos &mdash; she made us feel seen. Every image felt like the truest version of our family.</blockquote>
      <p class="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--qm-text-muted)]" data-qm="testimonial-author">Amara &amp; David &bull; Family Portrait Session</p>
    </div>
    <div class="mt-16 grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="luxe-lift">
        <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-2-quote">&ldquo;The brand shoot exceeded every expectation. Our conversion rate went up 40% after updating imagery.&rdquo;</p>
        <p class="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="testimonial-2-author">Priya M. &bull; Founder, Aura Skincare</p>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="luxe-lift">
        <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-3-quote">&ldquo;Our wedding photos feel like a film. The storytelling, the light, the quiet moments &mdash; absolutely perfect.&rdquo;</p>
        <p class="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="testimonial-3-author">Sarah &amp; James &bull; Wedding</p>
      </article>
      <article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="luxe-lift">
        <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-4-quote">&ldquo;I've worked with many photographers. Iris Studio is the only one that captures the emotion behind the image.&rdquo;</p>
        <p class="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="testimonial-4-author">Lekan A. &bull; Creative Director</p>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ───────────────────── CONTACT ───────────────────── */
  {
    id: 'photography-contact-iris',
    site_type: 'photography',
    section_type: 'contact',
    theme_id: 'iris-warm',
    keywords: ['contact', 'booking', 'form', 'schedule', 'inquiry'],
    preview_description: 'Split contact section with booking form, studio details, and warm accent styling.',
    rank: 88,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
    <div data-qay-animate="slide-right">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--qm-accent)]">Let&rsquo;s Create</p>
      <h2 class="mt-5 text-4xl md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="contact-title">Ready to tell your story?</h2>
      <p class="mt-5 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="contact-copy">Share a few details about your project and we&rsquo;ll respond within 24 hours with a custom session plan.</p>
      <div class="mt-10 space-y-5 border-t border-[var(--qm-border)] pt-8">
        <div class="flex items-start gap-3">
          <span class="text-lg text-[var(--qm-accent)]">&#9993;</span>
          <div>
            <p class="text-sm font-medium">Email</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-email">hello@irisstudio.com</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-lg text-[var(--qm-accent)]">&#128205;</span>
          <div>
            <p class="text-sm font-medium">Studio</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-address">42 Light Street, Arts District, NY 10013</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-lg text-[var(--qm-accent)]">&#128222;</span>
          <div>
            <p class="text-sm font-medium">Phone</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="contact-phone">+1 (555) 234-5678</p>
          </div>
        </div>
      </div>
    </div>
    <form class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-animate="slide-left">
      <div class="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Your Name" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none" />
        <input name="email" placeholder="Email Address" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none" />
      </div>
      <select name="service" class="mt-4 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none">
        <option>Select a Service</option>
        <option>Portrait Session</option>
        <option>Commercial / Editorial</option>
        <option>Wedding / Event</option>
      </select>
      <textarea name="message" placeholder="Tell us about your vision..." class="mt-4 h-32 w-full resize-none rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none"></textarea>
      <button type="submit" class="mt-6 w-full rounded-full bg-[var(--qm-accent)] px-6 py-4 font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">Send Inquiry</button>
    </form>
  </div>
</section>`,
  },

  /* ───────────────────── FOOTER ───────────────────── */
  {
    id: 'photography-footer-iris',
    site_type: 'photography',
    section_type: 'footer',
    theme_id: 'iris-warm',
    keywords: ['footer', 'links', 'social', 'copyright', 'studio'],
    preview_description: 'Minimal dark footer with brand, navigation links, social icons, and copyright.',
    rank: 85,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-14 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div>
        <p class="text-xl tracking-[0.15em]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Iris Studio</p>
        <p class="mt-3 max-w-xs text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="footer-tagline">Professional photography that captures light, mood, and the stories that matter most.</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]">Navigate</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/gallery" class="transition hover:text-[var(--qm-text)]">Gallery</a>
          <a href="/about" class="transition hover:text-[var(--qm-text)]">About</a>
          <a href="/services" class="transition hover:text-[var(--qm-text)]">Services</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]">Connect</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Instagram</a>
          <a href="#" class="transition hover:text-[var(--qm-text)]">Pinterest</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[var(--qm-accent)]">Studio</p>
        <p class="mt-4 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="footer-address">42 Light Street<br/>Arts District, NY 10013</p>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-xs text-[var(--qm-text-muted)] md:flex-row">
      <p>&copy; 2025 Iris Studio. All rights reserved.</p>
      <div class="flex gap-5">
        <a href="#" class="transition hover:text-[var(--qm-text)]">Privacy</a>
        <a href="#" class="transition hover:text-[var(--qm-text)]">Terms</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
