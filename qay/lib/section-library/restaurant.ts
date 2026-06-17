import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'restaurant-theme-luxury-dark',
    site_type: 'restaurant',
    theme_id: 'luxury-dark',
    label: 'Luxury Dark',
    keywords: ['luxury', 'fine dining', 'premium', 'dark', 'elegant', 'upscale', 'sophisticated', 'exclusive', 'chef'],
    css_variables: {
      '--qm-bg': '#0a0905',
      '--qm-surface': '#14120d',
      '--qm-text': '#f5ede0',
      '--qm-text-muted': '#a89478',
      '--qm-accent': '#c9a84c',
      '--qm-accent-text': '#0a0905',
      '--qm-border': 'rgba(201,168,76,0.16)',
      '--qm-heading-font': '"Cormorant Garamond", serif',
      '--qm-body-font': '"DM Sans", sans-serif',
    },
    google_fonts: ['Cormorant+Garamond:wght@400;500;600;700', 'DM+Sans:wght@400;500;700'],
    is_dark: true,
    rank: 95,
  },
  {
    id: 'restaurant-theme-tropical-fresh',
    site_type: 'restaurant',
    theme_id: 'tropical-fresh',
    label: 'Tropical Fresh',
    keywords: ['nigerian', 'african', 'jollof', 'tropical', 'colorful', 'vibrant', 'local', 'casual', 'street food'],
    css_variables: {
      '--qm-bg': '#fffaf0',
      '--qm-surface': '#ffffff',
      '--qm-text': '#1d1808',
      '--qm-text-muted': '#74613d',
      '--qm-accent': '#e58a19',
      '--qm-accent-text': '#1d1808',
      '--qm-border': 'rgba(29,24,8,0.12)',
      '--qm-heading-font': '"Plus Jakarta Sans", sans-serif',
      '--qm-body-font': '"Plus Jakarta Sans", sans-serif',
    },
    google_fonts: ['Plus+Jakarta+Sans:wght@400;500;600;700;800'],
    is_dark: false,
    rank: 90,
  },
];

export const sections: QmSection[] = [
  {
    id: 'restaurant-nav-drawer',
    site_type: 'restaurant',
    section_type: 'nav',
    theme_id: 'luxury-dark',
    keywords: ['drawer', 'luxury', 'reservation', 'minimal'],
    preview_description: 'Luxury restaurant navigation with reservation CTA and mobile drawer.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-semibold tracking-[0.18em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">MAISON KAIRO</a>
    <div class="hidden items-center gap-8 text-xs font-bold uppercase tracking-wider md:flex">
      <a href="/menu" class="hover:text-[var(--qm-accent)] transition">Menu</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">Chef</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition">Visit</a>
      <a href="/reservations" class="bg-[var(--qm-accent)] px-6 py-3 text-xs font-bold text-[var(--qm-accent-text)] tracking-widest transition hover:opacity-90">Book Table</a>
    </div>
    <button type="button" class="border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#restaurant-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="restaurant-mobile-menu" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/menu" class="text-sm font-bold uppercase tracking-wider">Menu</a>
    <a href="/about" class="text-sm font-bold uppercase tracking-wider">Chef</a>
    <a href="/contact" class="text-sm font-bold uppercase tracking-wider">Visit</a>
    <a href="/reservations" class="bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--qm-accent-text)]">Book Table</a>
  </div>
</nav>`,
  },
  {
    id: 'restaurant-nav-warm',
    site_type: 'restaurant',
    section_type: 'nav',
    theme_id: 'tropical-fresh',
    keywords: ['warm', 'casual', 'reservation', 'colorful'],
    preview_description: 'Bright food brand navigation with rounded reservation button.',
    rank: 92,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold uppercase tracking-tight" data-qm="brand-name">BUKA GARDEN</a>
    <div class="hidden items-center gap-8 text-xs font-bold uppercase tracking-wider md:flex">
      <a href="/menu" class="hover:text-[var(--qm-accent)] transition">Menu</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">Story</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition">Location</a>
      <a href="/reservations" class="rounded-full bg-[var(--qm-accent)] px-6 py-3 text-xs font-bold text-[var(--qm-accent-text)] tracking-wider transition hover:opacity-90">Reserve</a>
    </div>
    <button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#restaurant-mobile-menu-warm" data-qay-class="hidden">Menu</button>
  </div>
  <div id="restaurant-mobile-menu-warm" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/menu" class="text-sm font-bold uppercase tracking-wider">Menu</a>
    <a href="/about" class="text-sm font-bold uppercase tracking-wider">Story</a>
    <a href="/contact" class="text-sm font-bold uppercase tracking-wider">Location</a>
    <a href="/reservations" class="rounded-full bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--qm-accent-text)]">Reserve</a>
  </div>
</nav>`,
  },
  {
    id: 'restaurant-hero-split',
    site_type: 'restaurant',
    section_type: 'hero',
    theme_id: 'luxury-dark',
    keywords: ['luxury', 'split', 'chef', 'fine dining', 'luxe-reveal'],
    preview_description: 'Split luxury hero with dining image, reservation CTA, and elegant typography.',
    rank: 96,
    html: `<section class="grid min-h-[640px] bg-[var(--qm-bg)] text-[var(--qm-text)] lg:grid-cols-2 overflow-hidden">
  <div class="flex flex-col justify-center px-8 py-20 lg:px-16 space-y-6" data-qay-animate="luxe-reveal" data-qay-duration="1.15">
    <p class="text-xs uppercase tracking-[0.35em] text-[var(--qm-accent)] font-semibold" data-qm="hero-eyebrow">CHEF-LED DINING IN VICTORIA ISLAND</p>
    <h1 class="text-5xl font-light leading-[0.95] md:text-7xl lg:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">A quieter kind of luxury, served course by course.</h1>
    <p class="max-w-md text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] font-light" data-qm="hero-subtitle">Seasonal West African ingredients, open-fire technique, and a tasting room built for memorable evenings.</p>
    <div class="pt-4 flex flex-wrap gap-4">
      <a href="/reservations" class="bg-[var(--qm-accent)] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] hover:opacity-90 transition duration-200" data-qm="hero-cta-primary">Book a table</a>
      <a href="/menu" class="border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200" data-qm="hero-cta-secondary">View Tasting Menu</a>
    </div>
  </div>
  <div class="relative min-h-[420px] overflow-hidden" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&q=85" alt="Elegant restaurant dining room" class="h-full w-full object-cover" data-qm="hero-image" />
  </div>
</section>`,
  },
  {
    id: 'restaurant-hero-tropical',
    site_type: 'restaurant',
    section_type: 'hero',
    theme_id: 'tropical-fresh',
    keywords: ['nigerian', 'tropical', 'jollof', 'luxe-asym-reveal'],
    preview_description: 'Bright Nigerian restaurant hero with food image and asymmetric entry reveal.',
    rank: 94,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div class="space-y-6" data-qay-animate="luxe-asym-reveal">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">LAGOS HEAT, HOMESTYLE HEART</p>
      <h1 class="text-5xl font-black leading-[0.9] md:text-7xl" data-qm="hero-title">Smoky jollof, suya nights, and Sunday rice without the wait.</h1>
      <p class="max-w-lg text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] font-medium" data-qm="hero-subtitle">A lively neighborhood kitchen serving Nigerian classics with fast service, fresh peppers, and family platters.</p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/menu" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 transition">See Menu</a>
        <a href="/contact" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition">Find Us</a>
      </div>
    </div>
    <div class="overflow-hidden rounded-3xl border border-[var(--qm-border)] aspect-square" data-qay-hover="img-zoom">
      <img src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1400&auto=format&q=85" alt="Rice and grilled chicken platter" class="h-full w-full object-cover" data-qm="hero-image" />
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-menu-featured',
    site_type: 'restaurant',
    section_type: 'menu',
    theme_id: 'luxury-dark',
    keywords: ['menu', 'dishes', 'bento', 'fine-dining'],
    preview_description: 'Featured menu cards in a Bento grid with elegant spacing.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="space-y-4" data-qay-animate="slide-up">
      <p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)] font-semibold">SIGNATURE PLATES</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">THE EVENING TASTING</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Dish 1 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Pepper-Crusted Snapper</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed font-light">Charred lime, wild pepper butter, local aromatic leaves, slow-cooked heritage grains.</p>
        </div>
        <p class="text-xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$32</p>
      </article>

      <!-- Dish 2 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Smoked Short Rib Suya</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed font-light">Twelve-hour beef ribs, heritage yaji spice marinade, pickled shallots, crispy yam chips.</p>
        </div>
        <p class="text-xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$38</p>
      </article>

      <!-- Dish 3 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-3">
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Plantain Mille-Feuille</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed font-light">Caramelized sweet plantains, toasted coconut chips, house vanilla bean pod cream infusion.</p>
        </div>
        <p class="text-xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$16</p>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-menu-tropical',
    site_type: 'restaurant',
    section_type: 'menu',
    theme_id: 'tropical-fresh',
    keywords: ['menu', 'jollof', 'nigerian', 'bento'],
    preview_description: 'Bright Nigerian menu cards in a colorful bento layout.',
    rank: 91,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="max-w-3xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">FAVORITES</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight">ORDER THE TABLE PLATTERS</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Item 1 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] flex flex-col justify-between" data-qay-hover="scale">
        <div class="space-y-3">
          <h3 class="text-2xl font-black uppercase tracking-tight">Party Jollof Bowl</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed font-semibold">Fire-wood smoky rice, flame-grilled chicken, deep-fried sweet plantains, house salad.</p>
        </div>
        <p class="text-lg font-bold text-[var(--qm-accent)] mt-6">$18</p>
      </article>

      <!-- Item 2 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] flex flex-col justify-between" data-qay-hover="scale">
        <div class="space-y-3">
          <h3 class="text-2xl font-black uppercase tracking-tight">Suya Platter</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed font-semibold">Tender beef skewers dusted in yaji pepper spice, sliced red onions, tomatoes, and home chili sauce.</p>
        </div>
        <p class="text-lg font-bold text-[var(--qm-accent)] mt-6">$24</p>
      </article>

      <!-- Item 3 -->
      <article class="p-8 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] flex flex-col justify-between" data-qay-hover="scale">
        <div class="space-y-3">
          <h3 class="text-2xl font-black uppercase tracking-tight">Egusi Comfort Pot</h3>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed font-semibold">Rich melon seed stew cooked with indigenous greens, dry fish, served with pounded yam.</p>
        </div>
        <p class="text-lg font-bold text-[var(--qm-accent)] mt-6">$22</p>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-about-story',
    site_type: 'restaurant',
    section_type: 'about',
    theme_id: 'luxury-dark',
    keywords: ['about', 'story', 'chef', 'bento'],
    preview_description: 'Editorial chef profile story with bento image layouts.',
    rank: 88,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
    <div class="space-y-6" data-qay-animate="slide-right">
      <p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)] font-semibold">OUR STORY</p>
      <h2 class="text-4xl md:text-6xl font-light leading-none" style="font-family:var(--qm-heading-font)">Heritage, handled with absolute restraint.</h2>
      <p class="text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] font-light">
        Our kitchen collaborates directly with indigenous smallholder farms, coastal fishers, and spice merchants to curate a tasting experience that feels deeply rooted, visually precise, and generous.
      </p>
      <div class="grid grid-cols-2 gap-4 pt-4 text-xs font-bold uppercase tracking-widest text-[var(--qm-text)]">
        <div class="p-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] h-20 flex flex-col justify-between">
          <span>01 / COAL</span>
        </div>
        <div class="p-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] h-20 flex flex-col justify-between">
          <span>02 / HERITAGE</span>
        </div>
      </div>
    </div>
    <div class="overflow-hidden border border-[var(--qm-border)] aspect-[4/3]" data-qay-hover="img-zoom" data-qay-animate="slide-left">
      <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&auto=format&q=85" alt="Chef preparing luxury dish" class="h-full w-full object-cover" />
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-gallery',
    site_type: 'restaurant',
    section_type: 'gallery',
    theme_id: 'luxury-dark',
    keywords: ['gallery', 'dining', 'bento', 'ambience'],
    preview_description: 'Bento-style photo gallery showcasing restaurant spaces.',
    rank: 80,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] border-t border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)] font-semibold">THE SPACE</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">ATMOSPHERE &amp; DETAIL</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3 animate-fade-in" data-qay-animate="stagger-children">
      <div class="overflow-hidden border border-[var(--qm-border)] md:col-span-2 aspect-[16/10]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&q=85" alt="Restaurant dining room" class="h-full w-full object-cover" />
      </div>
      <div class="grid gap-6">
        <div class="overflow-hidden border border-[var(--qm-border)] aspect-video md:aspect-square" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&q=85" alt="Chef finishing plate" class="h-full w-full object-cover" />
        </div>
        <div class="overflow-hidden border border-[var(--qm-border)] aspect-video md:aspect-square" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&q=85" alt="Elegant cocktails on table" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-testimonials',
    site_type: 'restaurant',
    section_type: 'testimonials',
    theme_id: 'luxury-dark',
    keywords: ['testimonials', 'reviews', 'proof'],
    preview_description: 'Minimal high-impact testimonial quote.',
    rank: 78,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-4xl text-center space-y-8" data-qay-animate="luxe-reveal">
    <blockquote class="text-3xl md:text-5xl font-light leading-snug tracking-tight" style="font-family:var(--qm-heading-font)">
      "A dining room that understands occasion, serving firewood-baked food that honors where it came from."
    </blockquote>
    <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">LAGOS TABLE REVIEW &bull; 2025</p>
  </div>
</section>`,
  },
  {
    id: 'restaurant-contact',
    site_type: 'restaurant',
    section_type: 'contact',
    theme_id: 'luxury-dark',
    keywords: ['contact', 'location', 'hours', 'address'],
    preview_description: 'Hours, location coordinates, and booking prompt in a bento layout.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2">
    <div class="space-y-6" data-qay-animate="slide-right">
      <p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)] font-semibold">VISIT</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">DINNER BEGINS AT DUSK.</h2>
      <p class="text-sm font-light text-[var(--qm-text-muted)] leading-relaxed" data-qm="contact-address">
        18 Adeola Odeku Street, Victoria Island, Lagos, Nigeria
      </p>
      <div class="space-y-4 pt-4 border-t border-[var(--qm-border)] text-xs font-bold uppercase tracking-wider">
        <div>
          <span class="text-[9px] text-[var(--qm-text-muted)]">TELEPHONE</span>
          <p class="mt-1">+234 (1) 555-4321</p>
        </div>
        <div>
          <span class="text-[9px] text-[var(--qm-text-muted)]">ELECTRONIC MAIL</span>
          <p class="mt-1">welcome@maisonkairo.com</p>
        </div>
      </div>
    </div>
    <div class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-animate="slide-left">
      <div class="space-y-4">
        <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">OPERATIONAL HOURS</h3>
        <div class="space-y-2 text-xs text-[var(--qm-text-muted)] leading-relaxed font-semibold">
          <p>TUESDAY &mdash; THURSDAY &bull; 5:00 PM &mdash; 10:00 PM</p>
          <p>FRIDAY &mdash; SATURDAY &bull; 5:00 PM &mdash; MIDNIGHT</p>
          <p>SUNDAY BRUNCH &bull; 1:00 PM &mdash; 8:00 PM</p>
        </div>
      </div>
      <a href="/reservations" class="bg-[var(--qm-accent)] py-3 text-center text-xs font-bold uppercase tracking-widest text-[var(--qm-accent-text)] transition hover:opacity-90">Book Strategy Session</a>
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-footer',
    site_type: 'restaurant',
    section_type: 'footer',
    theme_id: 'luxury-dark',
    keywords: ['footer', 'links', 'restaurant'],
    preview_description: 'Luxury restaurant footer with quick links and copyright.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
    <p class="text-lg font-semibold tracking-[0.15em] text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">MAISON KAIRO</p>
    <div class="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-widest">
      <a href="/menu" class="hover:text-[var(--qm-text)] transition">Menu</a>
      <a href="/reservations" class="hover:text-[var(--qm-text)] transition">Reservations</a>
      <a href="/contact" class="hover:text-[var(--qm-text)] transition">Contact</a>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest">
    <p>&copy; 2026 MAISON KAIRO. ALL RIGHTS RESERVED.</p>
    <p>ESTABLISHED 2018 &bull; LAGOS &bull; PARIS</p>
  </div>
</footer>`,
  },
];
