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
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-semibold tracking-[0.18em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Maison Kairo</a>
    <div class="hidden items-center gap-7 text-sm text-[var(--qm-text-muted)] md:flex">
      <a href="/menu" class="transition hover:text-[var(--qm-text)]">Menu</a>
      <a href="/about" class="transition hover:text-[var(--qm-text)]">Chef</a>
      <a href="/contact" class="transition hover:text-[var(--qm-text)]">Visit</a>
      <a href="/reservations" class="bg-[var(--qm-accent)] px-5 py-3 text-sm font-medium text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale-btn">Book a table</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center border border-[var(--qm-border)] md:hidden" data-qay-click="toggle" data-qay-target="#restaurant-mobile-menu" data-qay-class="hidden" aria-controls="restaurant-mobile-menu" aria-expanded="false">Menu</button>
  </div>
  <div id="restaurant-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 text-sm text-[var(--qm-text)] shadow-2xl md:hidden">
    <a href="/menu">Menu</a><a href="/about">Chef</a><a href="/contact">Visit</a><a href="/reservations" class="bg-[var(--qm-accent)] px-4 py-3 text-center text-[var(--qm-accent-text)]">Book a table</a>
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
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-lg font-extrabold" data-qm="brand-name">Buka Garden</a>
    <div class="hidden items-center gap-6 text-sm font-medium md:flex">
      <a href="/menu" class="hover:text-[var(--qm-accent)]">Menu</a><a href="/about" class="hover:text-[var(--qm-accent)]">Story</a><a href="/contact" class="hover:text-[var(--qm-accent)]">Location</a>
      <a href="/reservations" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]" data-qay-hover="scale-btn">Reserve</a>
    </div>
    <button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#restaurant-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="restaurant-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden">
    <a href="/menu">Menu</a><a href="/about">Story</a><a href="/contact">Location</a><a href="/reservations" class="rounded-full bg-[var(--qm-accent)] px-4 py-3 text-center text-[var(--qm-accent-text)]">Reserve</a>
  </div>
</nav>`,
  },
  {
    id: 'restaurant-hero-split',
    site_type: 'restaurant',
    section_type: 'hero',
    theme_id: 'luxury-dark',
    keywords: ['luxury', 'split', 'chef', 'fine dining', 'dramatic', 'image-heavy'],
    preview_description: 'Split hero with dining image, reservation CTA, and proof stats.',
    rank: 96,
    html: `<section class="grid min-h-[720px] bg-[var(--qm-bg)] text-[var(--qm-text)] lg:grid-cols-[0.9fr_1.1fr]">
  <div class="flex flex-col justify-center px-6 py-20 md:px-14 lg:px-20" data-qay-animate="slide-right" data-qay-duration="1.0">
    <p class="text-xs uppercase tracking-[0.35em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Chef-led dining in Victoria Island</p>
    <h1 class="mt-6 text-5xl font-semibold leading-[0.95] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">A quieter kind of luxury, served course by course.</h1>
    <p class="mt-7 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Seasonal West African ingredients, open-fire technique, and a tasting room built for memorable evenings.</p>
    <div class="mt-10 flex flex-col gap-3 sm:flex-row">
      <a href="/reservations" class="bg-[var(--qm-accent)] px-7 py-4 text-center font-medium text-[var(--qm-accent-text)]" data-qay-hover="scale-btn" data-qm="hero-cta-primary">Book a table</a>
      <a href="/menu" class="border border-[var(--qm-border)] px-7 py-4 text-center text-[var(--qm-text)]" data-qm="hero-cta-secondary">View tasting menu</a>
    </div>
  </div>
  <div class="relative min-h-[520px] overflow-hidden" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&q=85" alt="Elegant restaurant dining room" class="absolute inset-0 h-full w-full object-cover" data-qm="hero-image" />
  </div>
</section>`,
  },
  {
    id: 'restaurant-hero-tropical',
    site_type: 'restaurant',
    section_type: 'hero',
    theme_id: 'tropical-fresh',
    keywords: ['nigerian', 'tropical', 'jollof', 'bright', 'casual', 'local'],
    preview_description: 'Bright Nigerian restaurant hero with food image and location details.',
    rank: 94,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-12 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
    <div data-qay-animate="slide-up" data-qay-duration="0.85">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Lagos heat, homestyle heart</p>
      <h1 class="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] md:text-7xl" data-qm="hero-title">Smoky jollof, suya nights, and Sunday rice without the wait.</h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">A lively neighborhood kitchen serving Nigerian classics with fast service, fresh peppers, and family-sized platters.</p>
      <div class="mt-9 flex flex-col gap-3 sm:flex-row"><a href="/menu" class="rounded-full bg-[var(--qm-accent)] px-7 py-4 text-center font-bold text-[var(--qm-accent-text)]">See menu</a><a href="/contact" class="rounded-full border border-[var(--qm-border)] px-7 py-4 text-center font-bold">Find us</a></div>
    </div>
    <div class="overflow-hidden rounded-[2rem]" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1400&auto=format&q=85" alt="Colorful rice and grilled food platter" class="h-[560px] w-full object-cover" data-qm="hero-image" /></div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-menu-featured',
    site_type: 'restaurant',
    section_type: 'menu',
    theme_id: 'luxury-dark',
    keywords: ['menu', 'dishes', 'fine dining', 'prices'],
    preview_description: 'Featured menu cards with dish descriptions and pricing.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-6xl">
    <p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)]">Signature plates</p>
    <h2 class="mt-4 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="menu-title">The evening edit</h2>
    <div class="mt-12 grid gap-4 md:grid-cols-3">
      <article class="border border-[var(--qm-border)] p-6" data-qay-hover="lift"><h3 class="text-xl font-semibold" data-qm="dish-1-name">Pepper-crusted snapper</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="dish-1-desc">Grilled red snapper, uda butter, charred lime, garden herbs.</p><p class="mt-6 text-[var(--qm-accent)]" data-qm="dish-1-price">$32</p></article>
      <article class="border border-[var(--qm-border)] p-6" data-qay-hover="lift"><h3 class="text-xl font-semibold" data-qm="dish-2-name">Smoked short rib suya</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="dish-2-desc">Twelve-hour beef, peanut spice, pickled onion, yam crisp.</p><p class="mt-6 text-[var(--qm-accent)]" data-qm="dish-2-price">$38</p></article>
      <article class="border border-[var(--qm-border)] p-6" data-qay-hover="lift"><h3 class="text-xl font-semibold" data-qm="dish-3-name">Plantain mille-feuille</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]" data-qm="dish-3-desc">Caramelized plantain, vanilla cream, toasted coconut.</p><p class="mt-6 text-[var(--qm-accent)]" data-qm="dish-3-price">$16</p></article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-menu-tropical',
    site_type: 'restaurant',
    section_type: 'menu',
    theme_id: 'tropical-fresh',
    keywords: ['menu', 'jollof', 'nigerian', 'platters', 'casual'],
    preview_description: 'Bright Nigerian menu cards with casual pricing.',
    rank: 91,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <h2 class="text-4xl font-extrabold md:text-6xl" data-qm="menu-title">Order the table favorites</h2>
    <div class="mt-10 grid gap-5 md:grid-cols-3">
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6"><h3 class="text-xl font-bold" data-qm="dish-1-name">Party jollof bowl</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Smoky rice, grilled chicken, fried plantain, house slaw.</p><p class="mt-5 font-bold text-[var(--qm-accent)]">$18</p></article>
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6"><h3 class="text-xl font-bold" data-qm="dish-2-name">Suya platter</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Beef skewers, yaji spice, onions, tomato, pepper sauce.</p><p class="mt-5 font-bold text-[var(--qm-accent)]">$24</p></article>
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6"><h3 class="text-xl font-bold" data-qm="dish-3-name">Egusi comfort pot</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Melon seed stew, greens, pounded yam, slow cooked beef.</p><p class="mt-5 font-bold text-[var(--qm-accent)]">$22</p></article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'restaurant-about-story',
    site_type: 'restaurant',
    section_type: 'about',
    theme_id: 'luxury-dark',
    keywords: ['chef', 'story', 'split', 'heritage'],
    preview_description: 'Chef story with split image and editorial copy.',
    rank: 88,
    html: `<section class="grid bg-[var(--qm-bg)] text-[var(--qm-text)] lg:grid-cols-2">
  <div class="min-h-[520px] overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&auto=format&q=85" alt="Chef plating food in a restaurant kitchen" class="h-full w-full object-cover" /></div>
  <div class="flex flex-col justify-center px-6 py-20 md:px-16" data-qay-animate="scroll-reveal"><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)]">Our story</p><h2 class="mt-5 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="about-title">Heritage, handled with restraint.</h2><p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">Our kitchen works with small farms, coastal fishers, and spice merchants to build a menu that feels rooted, precise, and deeply generous.</p></div>
</section>`,
  },
  {
    id: 'restaurant-gallery',
    site_type: 'restaurant',
    section_type: 'gallery',
    theme_id: 'luxury-dark',
    keywords: ['gallery', 'images', 'dining', 'ambience'],
    preview_description: 'Three-image atmosphere gallery.',
    rank: 80,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-20"><div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
  <div class="overflow-hidden md:col-span-2" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1300&auto=format&q=85" alt="Restaurant bar and dining room" class="h-[420px] w-full object-cover" /></div>
  <div class="grid gap-5"><img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&auto=format&q=85" alt="Chef preparing dish" class="h-[200px] w-full object-cover" /><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&auto=format&q=85" alt="Restaurant table setting" class="h-[200px] w-full object-cover" /></div>
</div></section>`,
  },
  {
    id: 'restaurant-testimonials',
    site_type: 'restaurant',
    section_type: 'testimonials',
    theme_id: 'luxury-dark',
    keywords: ['reviews', 'testimonials', 'trust'],
    preview_description: 'Editorial review quote section.',
    rank: 78,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal"><p class="text-5xl text-[var(--qm-accent)]">"</p><blockquote class="mt-4 text-3xl leading-tight md:text-5xl" style="font-family:var(--qm-heading-font)" data-qm="testimonial-quote">A room that understands occasion, with food that remembers where it came from.</blockquote><p class="mt-8 text-sm uppercase tracking-[0.25em] text-[var(--qm-text-muted)]" data-qm="testimonial-author">Lagos Table Review</p></div></section>`,
  },
  {
    id: 'restaurant-contact',
    site_type: 'restaurant',
    section_type: 'contact',
    theme_id: 'luxury-dark',
    keywords: ['hours', 'location', 'reservation', 'contact'],
    preview_description: 'Hours and location contact block.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
  <div><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)]">Visit</p><h2 class="mt-4 text-4xl font-semibold" style="font-family:var(--qm-heading-font)" data-qm="contact-title">Dinner starts at dusk.</h2><p class="mt-5 text-[var(--qm-text-muted)]" data-qm="contact-address">18 Adeola Odeku Street, Victoria Island, Lagos</p></div>
  <div class="border border-[var(--qm-border)] p-6"><p class="font-medium">Hours</p><p class="mt-4 text-sm leading-7 text-[var(--qm-text-muted)]">Tue-Thu 5pm-10pm<br/>Fri-Sat 5pm-midnight<br/>Sun 1pm-8pm</p><a href="/reservations" class="mt-6 inline-flex bg-[var(--qm-accent)] px-6 py-3 text-[var(--qm-accent-text)]">Reserve now</a></div>
</div></section>`,
  },
  {
    id: 'restaurant-footer',
    site_type: 'restaurant',
    section_type: 'footer',
    theme_id: 'luxury-dark',
    keywords: ['footer', 'links', 'restaurant'],
    preview_description: 'Restaurant footer with simple links.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-10 text-sm text-[var(--qm-text-muted)]"><div class="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between"><p data-qm="footer-brand">Maison Kairo</p><div class="flex gap-5"><a href="/menu">Menu</a><a href="/reservations">Reservations</a><a href="/contact">Contact</a></div></div></footer>`,
  },
];
