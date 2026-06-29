import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'ecommerce-theme-urban-streetwear',
    site_type: 'ecommerce',
    theme_id: 'urban-streetwear',
    label: 'Urban Streetwear',
    keywords: ['streetwear', 'urban', 'clothing', 'fashion', 'hoodie', 't-shirt', 'jogger', 'cap', 'afro', 'youth', 'drop', 'hype', 'black', 'neon', 'gold'],
    css_variables: {
      '--qm-bg': '#050505',
      '--qm-surface': '#111111',
      '--qm-text': '#f7f7f2',
      '--qm-text-muted': '#a1a1aa',
      '--qm-accent': '#d7ff2f',
      '--qm-accent-text': '#050505',
      '--qm-border': 'rgba(255,255,255,0.14)',
      '--qm-heading-font': '"Bebas Neue", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Bebas+Neue', 'Inter:wght@400;500;600;700;800;900'],
    is_dark: true,
    rank: 99,
  },
  {
    id: 'ecommerce-theme-luxury-dark',
    site_type: 'ecommerce',
    theme_id: 'luxury-dark',
    label: 'Luxury Dark',
    keywords: ['luxury', 'premium', 'perfume', 'jewelry', 'dark', 'elegant', 'exclusive', 'high-end'],
    css_variables: {
      '--qm-bg': '#0d0d0d',
      '--qm-surface': '#151515',
      '--qm-text': '#f8f4ec',
      '--qm-text-muted': '#a79f91',
      '--qm-accent': '#c9a84c',
      '--qm-accent-text': '#0d0d0d',
      '--qm-border': 'rgba(255,255,255,0.1)',
      '--qm-heading-font': '"Cormorant Garamond", serif',
      '--qm-body-font': '"DM Sans", sans-serif',
    },
    google_fonts: ['Cormorant+Garamond:wght@400;500;600;700', 'DM+Sans:wght@400;500;700'],
    is_dark: true,
    rank: 95,
  },
  {
    id: 'ecommerce-theme-clean-minimal',
    site_type: 'ecommerce',
    theme_id: 'clean-minimal',
    label: 'Clean Minimal',
    keywords: ['clean', 'minimal', 'modern', 'skincare', 'fashion', 'white', 'fresh', 'simple'],
    css_variables: {
      '--qm-bg': '#fbfaf7',
      '--qm-surface': '#ffffff',
      '--qm-text': '#111111',
      '--qm-text-muted': '#6b655d',
      '--qm-accent': '#111111',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(17,17,17,0.12)',
      '--qm-heading-font': '"Inter", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Inter:wght@400;500;600;700;800'],
    is_dark: false,
    rank: 90,
  },
];

const cartDrawer = `<aside data-qay-commerce="cart-drawer" class="hidden fixed right-4 top-24 z-50 w-[min(420px,calc(100vw-32px))] rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/95 backdrop-blur-xl p-6 text-[var(--qm-text)] shadow-2xl transition-all duration-300">
  <div class="flex items-center justify-between pb-4 border-b border-[var(--qm-border)]">
    <div class="flex items-center gap-2.5">
      <span class="size-2 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
      <h2 class="text-lg font-bold tracking-wider uppercase" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-theme-clean-minimal-h2-1">Cart</h2>
    </div>
    <button type="button" data-qay-commerce="cart-close" class="rounded-full border border-[var(--qm-border)] px-4 py-1.5 text-xs font-bold uppercase transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]" data-qm="ecommerce-theme-clean-minimal-button-1">Close</button>
  </div>
  <div data-qay-commerce="cart-items" class="py-8 min-h-24 text-center text-sm text-[var(--qm-text-muted)] flex flex-col justify-center items-center gap-3">
    <svg class="size-8 text-[var(--qm-text-muted)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
    <span data-qm="ecommerce-theme-clean-minimal-span-1">Your cart is empty.</span>
  </div>
  <div class="pt-4 border-t border-[var(--qm-border)] space-y-3">
    <a href="/checkout" data-qay-commerce="checkout-button" class="block w-full rounded-xl bg-[var(--qm-accent)] py-4 text-center text-sm font-bold uppercase text-[var(--qm-accent-text)] transition hover:opacity-90" data-qm="ecommerce-theme-clean-minimal-a-1">Checkout</a>
    <button type="button" data-qay-commerce="cart-cancel" class="w-full rounded-xl border border-[var(--qm-border)] py-4 text-sm font-bold uppercase transition hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)]" data-qm="ecommerce-theme-clean-minimal-button-2">Cancel</button>
  </div>
</aside>`;

export const sections: QmSection[] = [
  {
    id: 'ecommerce-nav-luxe',
    site_type: 'ecommerce',
    section_type: 'nav',
    theme_id: 'urban-streetwear',
    keywords: ['nav', 'header', 'glassmorphic', 'sticky', 'logo'],
    preview_description: 'High-end sticky navigation bar with glassmorphic transparency and cart drawer trigger.',
    rank: 98,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-2xl font-black tracking-[0.15em] hover:opacity-80 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">QAY STUDIO</a>
    <div class="hidden items-center gap-8 text-xs font-semibold tracking-wider uppercase md:flex">
      <a href="/shop" class="hover:text-[var(--qm-accent)] transition" data-qm="ecommerce-nav-luxe-a-1">Shop</a>
      <a href="/about" class="hover:text-[var(--qm-accent)] transition" data-qm="ecommerce-nav-luxe-a-2">Story</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition" data-qm="ecommerce-nav-luxe-a-3">Contact</a>
      <button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="rounded-full bg-[var(--qm-accent)] px-5 py-2.5 text-xs font-black uppercase text-[var(--qm-accent-text)] shadow-lg hover:scale-105 transition duration-200" data-qm="ecommerce-nav-luxe-button-1">Cart (0)</button>
    </div>
    <button type="button" class="rounded-lg border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#store-mobile-menu-luxe" data-qay-class="hidden" data-qm="ecommerce-nav-luxe-button-2">Menu</button>
  </div>
  <div id="store-mobile-menu-luxe" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/shop" class="text-sm font-bold uppercase tracking-wider" data-qm="ecommerce-nav-luxe-a-4">Shop</a>
    <a href="/about" class="text-sm font-bold uppercase tracking-wider" data-qm="ecommerce-nav-luxe-a-5">Story</a>
    <a href="/contact" class="text-sm font-bold uppercase tracking-wider" data-qm="ecommerce-nav-luxe-a-6">Contact</a>
    <button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="w-full text-left rounded-xl bg-[var(--qm-accent)] px-4 py-3 text-sm font-bold uppercase text-[var(--qm-accent-text)]" data-qm="ecommerce-nav-luxe-button-3">Cart (0)</button>
  </div>
  ${cartDrawer}
</nav>`,
  },
  {
    id: 'ecommerce-hero-cinematic-bento',
    site_type: 'ecommerce',
    section_type: 'hero',
    theme_id: 'urban-streetwear',
    keywords: ['hero', 'bento', 'cinematic', 'asymmetric', 'fashion'],
    preview_description: 'Premium bento-layout hero section with asymmetric content layouts and text reveal.',
    rank: 99,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 md:py-24 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div data-qay-animate="luxe-asym-reveal" data-qay-duration="1.2" class="space-y-6">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="hero-eyebrow">
        <span class="size-1.5 rounded-full bg-[var(--qm-accent)] animate-ping"></span>
        Limited Drop 017
      </div>
      <h1 class="text-6xl font-black leading-[0.85] tracking-tight md:text-8xl lg:text-9xl uppercase" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        UNFILTERED<br/>PRESENCE.
      </h1>
      <p class="max-w-lg text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)]" data-qm="hero-subtitle">
        Streetwear constructed with architectural geometry, heavy fabrications, and raw detail. Tailored for those who walk in high contrast.
      </p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/shop" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] shadow-xl hover:scale-[1.03] transition duration-300" data-qm="hero-cta-primary">Shop Collection</a>
        <a href="/about" class="rounded-xl border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-300" data-qm="hero-cta-secondary">Our Craft</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children" data-qay-duration="0.95">
      <div class="space-y-4">
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&q=85" alt="Streetwear hoodie close-up" class="h-full w-full object-cover" data-qm="hero-image" />
        </div>
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-square bg-[var(--qm-surface)] p-6 flex flex-col justify-between" data-qay-hover="glow">
          <h3 class="text-3xl font-black uppercase leading-[0.9]" style="font-family:var(--qm-heading-font)">100%<br/>Heavy Cotton</h3>
          <p class="text-[10px] text-[var(--qm-text-muted)] uppercase tracking-wider" data-qm="ecommerce-hero-cinematic-bento-p-1">Garment Dyed & Preshrunk</p>
        </div>
      </div>
      <div class="space-y-4 pt-8">
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-square bg-[var(--qm-accent)] text-[var(--qm-accent-text)] p-6 flex flex-col justify-between" data-qay-hover="scale">
          <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.015a2.993 2.993 0 002.25 1.015c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" /></svg>
          <span class="text-xs font-black uppercase tracking-wider" data-qm="ecommerce-hero-cinematic-bento-span-1">Available Worldwide</span>
        </div>
        <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&q=85" alt="Streetwear styling tee" class="h-full w-full object-cover" data-qm="ecommerce-hero-cinematic-bento-image-2" />
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-collection-bento',
    site_type: 'ecommerce',
    section_type: 'collection',
    theme_id: 'urban-streetwear',
    keywords: ['collection', 'bento', 'categories', 'grid', 'hype'],
    preview_description: 'Stunning Bento grid layout showcasing product collections/categories.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
      <div data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="ecommerce-collection-bento-p-1">Catalog</p>
        <h2 class="mt-4 text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-collection-bento-h2-1">CURATED SELECTIONS</h2>
      </div>
      <p class="text-sm md:text-base text-[var(--qm-text-muted)] max-w-xl" data-qay-animate="fade-in">
        Explore capsules engineered for distinct environments. From high-comfort lounge structures to high-utility outerwear.
      </p>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Item 1 (Big span) -->
      <article class="group relative overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] md:col-span-2 h-96 flex flex-col justify-end p-8" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&q=85" alt="Hoodies and sweats" class="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition duration-500" data-qm="ecommerce-collection-bento-image-1" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-[var(--qm-accent)]" data-qm="ecommerce-collection-bento-span-1">Drop capsule</span>
          <h3 class="text-4xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-collection-bento-h3-1">FLEECE & BASICS</h3>
          <p class="text-xs text-[var(--qm-text-muted)] max-w-md" data-qm="ecommerce-collection-bento-p-2">Oversized silhouettes crafted from 450gsm luxury loopback fleece.</p>
          <a href="/shop" class="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--qm-accent)] tracking-wider" data-qm="ecommerce-collection-bento-a-1">Explore Drop &rarr;</a>
        </div>
      </article>
      <!-- Item 2 -->
      <article class="group relative overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] h-96 flex flex-col justify-end p-8" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&auto=format&q=85" alt="Tees" class="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition duration-500" data-qm="ecommerce-collection-bento-image-2" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-[var(--qm-accent)]" data-qm="ecommerce-collection-bento-span-2">Summer Capsule</span>
          <h3 class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-collection-bento-h3-2">HEAVY TEES</h3>
          <a href="/shop" class="mt-2 inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--qm-accent)] tracking-wider" data-qm="ecommerce-collection-bento-a-2">Explore Drop &rarr;</a>
        </div>
      </article>
      <!-- Item 3 -->
      <article class="group relative overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] h-96 flex flex-col justify-end p-8" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&q=85" alt="Cargo joggers" class="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition duration-500" data-qm="ecommerce-collection-bento-image-3" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-[var(--qm-accent)]" data-qm="ecommerce-collection-bento-span-3">Utility Capsule</span>
          <h3 class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-collection-bento-h3-3">CARGO JOGGERS</h3>
          <a href="/shop" class="mt-2 inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--qm-accent)] tracking-wider" data-qm="ecommerce-collection-bento-a-3">Explore Drop &rarr;</a>
        </div>
      </article>
      <!-- Item 4 (Big span) -->
      <article class="group relative overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] md:col-span-2 h-96 flex flex-col justify-end p-8" data-qay-hover="luxe-lift">
        <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&q=85" alt="Accessories and caps" class="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition duration-500" data-qm="ecommerce-collection-bento-image-4" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-[var(--qm-accent)]" data-qm="ecommerce-collection-bento-span-4">Hardware Drop</span>
          <h3 class="text-4xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-collection-bento-h3-4">ACCESSORIES & CAPS</h3>
          <p class="text-xs text-[var(--qm-text-muted)] max-w-md" data-qm="ecommerce-collection-bento-p-3">Embroidered headwear, heavy metal keychains, and custom accessories.</p>
          <a href="/shop" class="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--qm-accent)] tracking-wider" data-qm="ecommerce-collection-bento-a-4">Explore Drop &rarr;</a>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-products-bento',
    site_type: 'ecommerce',
    section_type: 'products',
    theme_id: 'urban-streetwear',
    keywords: ['products', 'grid', 'bento', 'shopping', 'streetwear', 'add-to-cart'],
    preview_description: 'Framer-level product Bento grid with cards, custom sizes, hover zooms, and Cart buttons.',
    rank: 97,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="section-eyebrow">Capsule 01</p>
        <h2 class="mt-4 text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="section-title">FEATURED PIECES</h2>
      </div>
      <a href="/shop" class="rounded-full border border-[var(--qm-border)] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200" data-qm="ecommerce-products-bento-a-1">View Shop</a>
    </div>
    <div class="grid gap-6 md:grid-cols-4" data-qay-commerce="product-grid" data-qay-animate="stagger-children">
      <!-- Card 1 (Taller, double-height bento look) -->
      <article class="md:col-span-2 md:row-span-2 overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col" data-qay-commerce="product-card" data-qay-product-id="sample-product-1" data-qay-product-handle="culture-heavy-hoodie">
        <div class="overflow-hidden relative flex-1 group" data-qay-commerce="product-image">
          <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&auto=format&q=85" alt="Culture Heavy Hoodie" class="h-full w-full object-cover aspect-[4/5] md:aspect-auto group-hover:scale-105 transition duration-500" data-qm="ecommerce-products-bento-image-1" />
          <span class="absolute top-4 left-4 rounded-full bg-[var(--qm-accent)] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[var(--qm-accent-text)]" data-qm="ecommerce-products-bento-span-1">Drop favorite</span>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-2xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qay-commerce="product-title" data-qm="ecommerce-products-bento-h3-1">Culture Heavy Hoodie</h3>
              <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qay-commerce="product-description" data-qm="ecommerce-products-bento-p-2">Heavyweight loopback fleece, double-lined hood, minimal branding.</p>
            </div>
            <p class="text-2xl font-black text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="ecommerce-products-bento-p-3">$88</p>
          </div>
          <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 active:scale-[0.98] transition" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1" data-qm="ecommerce-products-bento-button-1">Add to cart</button>
        </div>
      </article>

      <!-- Card 2 -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col" data-qay-commerce="product-card" data-qay-product-id="sample-product-2" data-qay-product-handle="own-the-streets-tee">
        <div class="overflow-hidden relative group" data-qay-commerce="product-image" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&q=85" alt="Own The Streets Tee" class="aspect-[4/5] w-full object-cover" data-qm="ecommerce-products-bento-image-2" />
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3 class="text-lg font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qay-commerce="product-title" data-qm="ecommerce-products-bento-h3-2">Street Tee</h3>
            <p class="mt-1 text-[11px] text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-bento-p-4">Boxy cotton build with screen-printed chest detail.</p>
          </div>
          <div class="space-y-3">
            <p class="text-xl font-black text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="ecommerce-products-bento-p-5">$42</p>
            <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-3 text-[10px] font-black uppercase text-[var(--qm-accent-text)] active:scale-[0.98] transition" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-2" data-qm="ecommerce-products-bento-button-2">Add to cart</button>
          </div>
        </div>
      </article>

      <!-- Card 3 -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col" data-qay-commerce="product-card" data-qay-product-id="sample-product-3" data-qay-product-handle="baddo-cargo-jogger">
        <div class="overflow-hidden relative group" data-qay-commerce="product-image" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&q=85" alt="Baddo Cargo Jogger" class="aspect-[4/5] w-full object-cover" data-qm="ecommerce-products-bento-image-3" />
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3 class="text-lg font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qay-commerce="product-title" data-qm="ecommerce-products-bento-h3-3">Cargo Jogger</h3>
            <p class="mt-1 text-[11px] text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-bento-p-6">Tapered leg joggers with deep bellows utility pockets.</p>
          </div>
          <div class="space-y-3">
            <p class="text-xl font-black text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="ecommerce-products-bento-p-7">$74</p>
            <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-3 text-[10px] font-black uppercase text-[var(--qm-accent-text)] active:scale-[0.98] transition" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-3" data-qm="ecommerce-products-bento-button-3">Add to cart</button>
          </div>
        </div>
      </article>

      <!-- Card 4 -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col" data-qay-commerce="product-card" data-qay-product-id="sample-product-4" data-qay-product-handle="world-logo-cap">
        <div class="overflow-hidden relative group" data-qay-commerce="product-image" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&auto=format&q=85" alt="World Logo Cap" class="aspect-[4/5] w-full object-cover" data-qm="ecommerce-products-bento-image-4" />
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3 class="text-lg font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qay-commerce="product-title" data-qm="ecommerce-products-bento-h3-4">Logo Cap</h3>
            <p class="mt-1 text-[11px] text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-bento-p-8">Structured six-panel cap with high-density embroidery.</p>
          </div>
          <div class="space-y-3">
            <p class="text-xl font-black text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="ecommerce-products-bento-p-9">$34</p>
            <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-3 text-[10px] font-black uppercase text-[var(--qm-accent-text)] active:scale-[0.98] transition" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-4" data-qm="ecommerce-products-bento-button-4">Add to cart</button>
          </div>
        </div>
      </article>

      <!-- Card 5 -->
      <article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col" data-qay-commerce="product-card" data-qay-product-id="sample-product-5" data-qay-product-handle="tech-shell-jacket">
        <div class="overflow-hidden relative group" data-qay-commerce="product-image" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&q=85" alt="Tech Shell Jacket" class="aspect-[4/5] w-full object-cover" data-qm="ecommerce-products-bento-image-5" />
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3 class="text-lg font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qay-commerce="product-title" data-qm="ecommerce-products-bento-h3-5">Tech Shell</h3>
            <p class="mt-1 text-[11px] text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-bento-p-10">Waterproof utility outerwear shell with bonded seam details.</p>
          </div>
          <div class="space-y-3">
            <p class="text-xl font-black text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="ecommerce-products-bento-p-11">$145</p>
            <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-3 text-[10px] font-black uppercase text-[var(--qm-accent-text)] active:scale-[0.98] transition" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-5" data-qm="ecommerce-products-bento-button-5">Add to cart</button>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-products-minimalist',
    site_type: 'ecommerce',
    section_type: 'products',
    theme_id: 'clean-minimal',
    keywords: ['products', 'grid', 'minimalist', 'clean', 'skincare', 'add-to-cart'],
    preview_description: 'Premium clean product grid with subtle hover highlights, ideal for skincare, beauty, or minimalist goods.',
    rank: 96,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-[var(--qm-border)] pb-6">
      <div data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-text-muted)]" data-qm="ecommerce-products-minimalist-p-1">Active Formulas</p>
        <h2 class="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight" data-qm="ecommerce-products-minimalist-h2-1">SHOP THE DAILY SYSTEM</h2>
      </div>
      <a href="/shop" class="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:opacity-80 transition">
        Explore formulas <span class="group-hover:translate-x-1 transition duration-200" data-qm="ecommerce-products-minimalist-span-1">&rarr;</span>
      </a>
    </div>
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-qay-commerce="product-grid" data-qay-animate="stagger-children">
      <!-- Product 1 -->
      <article class="group flex flex-col justify-between" data-qay-commerce="product-card" data-qay-product-id="sample-product-6" data-qay-product-handle="oil-cleanser">
        <div class="overflow-hidden rounded-2xl bg-[var(--qm-bg)] border border-[var(--qm-border)] aspect-square relative" data-qay-commerce="product-image">
          <img src="https://images.unsplash.com/photo-1608248597481-496100c80836?w=900&auto=format&q=85" alt="Botanic Oil Cleanser" class="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" data-qm="ecommerce-products-minimalist-image-1" />
        </div>
        <div class="pt-5 space-y-3">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-lg font-bold" data-qay-commerce="product-title" data-qm="ecommerce-products-minimalist-h3-1">Botanic Oil Cleanser</h3>
            <p class="text-lg font-extrabold" data-qay-commerce="product-price" data-qm="ecommerce-products-minimalist-p-2">$38</p>
          </div>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-minimalist-p-3">Organic sesame oil and vitamin E designed for skin resetting.</p>
          <button type="button" class="w-full rounded-full border border-[var(--qm-text)] py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)] transition duration-200" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-6" data-qm="ecommerce-products-minimalist-button-1">Add to cart</button>
        </div>
      </article>

      <!-- Product 2 -->
      <article class="group flex flex-col justify-between" data-qay-commerce="product-card" data-qay-product-id="sample-product-7" data-qay-product-handle="hydration-serum">
        <div class="overflow-hidden rounded-2xl bg-[var(--qm-bg)] border border-[var(--qm-border)] aspect-square relative" data-qay-commerce="product-image">
          <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&auto=format&q=85" alt="Active Hydration Serum" class="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" data-qm="ecommerce-products-minimalist-image-2" />
        </div>
        <div class="pt-5 space-y-3">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-lg font-bold" data-qay-commerce="product-title" data-qm="ecommerce-products-minimalist-h3-2">Active Hydration Serum</h3>
            <p class="text-lg font-extrabold" data-qay-commerce="product-price" data-qm="ecommerce-products-minimalist-p-4">$46</p>
          </div>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-minimalist-p-5">Multi-weight hyaluronic acid complex with rosewater hydrosol.</p>
          <button type="button" class="w-full rounded-full border border-[var(--qm-text)] py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)] transition duration-200" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-7" data-qm="ecommerce-products-minimalist-button-2">Add to cart</button>
        </div>
      </article>

      <!-- Product 3 -->
      <article class="group flex flex-col justify-between" data-qay-commerce="product-card" data-qay-product-id="sample-product-8" data-qay-product-handle="barrier-cream">
        <div class="overflow-hidden rounded-2xl bg-[var(--qm-bg)] border border-[var(--qm-border)] aspect-square relative" data-qay-commerce="product-image">
          <img src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=900&auto=format&q=85" alt="Daily Barrier Cream" class="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" data-qm="ecommerce-products-minimalist-image-3" />
        </div>
        <div class="pt-5 space-y-3">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-lg font-bold" data-qay-commerce="product-title" data-qm="ecommerce-products-minimalist-h3-3">Daily Barrier Cream</h3>
            <p class="text-lg font-extrabold" data-qay-commerce="product-price" data-qm="ecommerce-products-minimalist-p-6">$42</p>
          </div>
          <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qay-commerce="product-description" data-qm="ecommerce-products-minimalist-p-7">Niacinamide and squalane designed to reinforce the lipid barrier.</p>
          <button type="button" class="w-full rounded-full border border-[var(--qm-text)] py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-[var(--qm-text)] hover:text-[var(--qm-bg)] transition duration-200" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-8" data-qm="ecommerce-products-minimalist-button-3">Add to cart</button>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-about-luxe',
    site_type: 'ecommerce',
    section_type: 'about',
    theme_id: 'urban-streetwear',
    keywords: ['about', 'asymmetric', 'story', 'luxury', 'craftsmanship'],
    preview_description: 'Dual-column story section with offset layout, big typographic elements, and scroll-reveal.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
    <div class="space-y-8" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="about-eyebrow">MANUFACTURING MOMENT</p>
      <h2 class="text-5xl md:text-6xl font-black uppercase leading-[0.9]" style="font-family:var(--qm-heading-font)" data-qm="about-title">
        WE DO NOT MERELY SEW.<br/>WE CONSTRUCT.
      </h2>
      <div class="space-y-6 text-sm md:text-base text-[var(--qm-text-muted)] leading-relaxed">
        <p data-qm="about-text">Every piece is built on three pillars: density, structure, and endurance. We source premium yarn weights and dye each capsule in small batches, ensuring specific wash characteristics and rich feel.</p>
        <p data-qm="about-text-secondary">By cutting loops in reverse and securing double-needle stitch runs, the garment retains its structured shape over years of wash cycles.</p>
      </div>
      <div class="grid grid-cols-3 gap-4 border-t border-[var(--qm-border)] pt-8">
        <div>
          <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-about-luxe-p-4">450G</p>
          <p class="text-[9px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="ecommerce-about-luxe-p-5">Average Loopback Fleece</p>
        </div>
        <div>
          <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-about-luxe-p-6">100%</p>
          <p class="text-[9px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="ecommerce-about-luxe-p-7">Organic Cotton Fibers</p>
        </div>
        <div>
          <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-about-luxe-p-8">Lagos</p>
          <p class="text-[9px] uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="ecommerce-about-luxe-p-9">Concept Workshop</p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] h-80" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&q=85" alt="Garment design" class="h-full w-full object-cover" data-qm="about-image" />
      </div>
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] h-80 mt-8" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&q=85" alt="Sewing details" class="h-full w-full object-cover" data-qm="ecommerce-about-luxe-image-2" />
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-testimonials-grid',
    site_type: 'ecommerce',
    section_type: 'testimonials',
    theme_id: 'urban-streetwear',
    keywords: ['testimonials', 'reviews', 'bento', 'trust', 'social-proof'],
    preview_description: 'Elegant Bento grid of client reviews with star indicators and clean borders.',
    rank: 80,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="ecommerce-testimonials-grid-p-1">Collector Feedback</p>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-testimonials-grid-h2-1">LOVED BY COLLECTORS</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Review 1 -->
      <blockquote class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <p class="text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] italic" data-qm="testimonial-1-text">"The weight of the hoodie is insane. It doesn't lose its shape even after heavy machine washing. Worth every penny."</p>
        <div class="flex items-center gap-3 border-t border-[var(--qm-border)] pt-4">
          <div class="size-9 rounded-full bg-[var(--qm-border)] flex items-center justify-center font-bold text-xs">TO</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider" data-qm="testimonial-1-author">Tobi O.</p>
            <p class="text-[10px] text-[var(--qm-text-muted)]" data-qm="ecommerce-testimonials-grid-p-4">Verified Buyer · Midnight Black</p>
          </div>
        </div>
      </blockquote>

      <!-- Review 2 (Highlighted) -->
      <blockquote class="rounded-2xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-6 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <p class="text-sm md:text-base leading-relaxed text-[var(--qm-text)] font-semibold italic" data-qm="testimonial-2-text">"Framer-level aesthetic website, but the physical product is even better. The fabric handles like couture pieces. Unbelievable drop."</p>
        <div class="flex items-center gap-3 border-t border-[var(--qm-border)] pt-4">
          <div class="size-9 rounded-full bg-[var(--qm-accent)] text-[var(--qm-accent-text)] flex items-center justify-center font-bold text-xs">EL</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="testimonial-2-author">Elena K.</p>
            <p class="text-[10px] text-[var(--qm-text-muted)]" data-qm="ecommerce-testimonials-grid-p-7">Verified Buyer · Heavy Hoodie</p>
          </div>
        </div>
      </blockquote>

      <!-- Review 3 -->
      <blockquote class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <p class="text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] italic" data-qm="testimonial-3-text">"Minimalist packaging, fast dispatch, and the fit is perfectly oversized. Definitely scaling my collection with the next drop."</p>
        <div class="flex items-center gap-3 border-t border-[var(--qm-border)] pt-4">
          <div class="size-9 rounded-full bg-[var(--qm-border)] flex items-center justify-center font-bold text-xs">AM</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider" data-qm="testimonial-3-author">Aminu M.</p>
            <p class="text-[10px] text-[var(--qm-text-muted)]" data-qm="ecommerce-testimonials-grid-p-10">Verified Buyer · Utility Jogger</p>
          </div>
        </div>
      </blockquote>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-trust-grid',
    site_type: 'ecommerce',
    section_type: 'stats',
    theme_id: 'urban-streetwear',
    keywords: ['trust', 'shipping', 'guarantees', 'medusa', 'bento'],
    preview_description: 'Bento-style trust and logistics strip with clean icons and detailed copy.',
    rank: 78,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-16 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 space-y-3" data-qay-hover="scale">
      <div class="size-8 rounded-full bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
      </div>
      <h3 class="font-bold text-sm uppercase tracking-wider" data-qm="ecommerce-trust-grid-h3-1">SECURE MEDUSA CART</h3>
      <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="ecommerce-trust-grid-p-1">Integrated directly with Medusa core API for headless cart isolation and reliability.</p>
    </div>
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 space-y-3" data-qay-hover="scale">
      <div class="size-8 rounded-full bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.317-5.072a2.25 2.25 0 00-2.24-2.11H15V4.5a1.125 1.125 0 00-1.125-1.125H3.375a1.125 1.125 0 00-1.125 1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.317-5.072a2.25 2.25 0 00-2.24-2.11H15V14.25m-9 0h9" /></svg>
      </div>
      <h3 class="font-bold text-sm uppercase tracking-wider" data-qm="ecommerce-trust-grid-h3-2">COMPLIMENTARY SHIPPING</h3>
      <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="ecommerce-trust-grid-p-2">Free standard delivery worldwide on all capsule drops and collector orders.</p>
    </div>
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 space-y-3" data-qay-hover="scale">
      <div class="size-8 rounded-full bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662zM12 9v6m3-3H9" /></svg>
      </div>
      <h3 class="font-bold text-sm uppercase tracking-wider" data-qm="ecommerce-trust-grid-h3-3">COLLECTOR EXCLUSIVES</h3>
      <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="ecommerce-trust-grid-p-3">Every capsule drops with dedicated metal hardware hooks and limited pins.</p>
    </div>
    <div class="p-6 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)]/40 space-y-3" data-qay-hover="scale">
      <div class="size-8 rounded-full bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] flex items-center justify-center">
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h3 class="font-bold text-sm uppercase tracking-wider" data-qm="ecommerce-trust-grid-h3-4">EASY RETURNS</h3>
      <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed" data-qm="ecommerce-trust-grid-p-4">Return unworn, unwashed collector pieces within 14 days of receipt.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-cta-luxe',
    site_type: 'ecommerce',
    section_type: 'cta',
    theme_id: 'urban-streetwear',
    keywords: ['cta', 'newsletter', 'immersive', 'subscribe', 'neon'],
    preview_description: 'High-conversion newsletter CTA banner with large header reveal and inline forms.',
    rank: 76,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-24 text-center text-[var(--qm-text)] relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-[var(--qm-accent)]/5 via-transparent to-transparent"></div>
  <div class="relative z-10 mx-auto max-w-3xl space-y-8" data-qay-animate="luxe-reveal" data-qay-duration="1.15">
    <p class="text-xs font-bold uppercase tracking-[0.35em] text-[var(--qm-accent)]" data-qm="ecommerce-cta-luxe-p-1">STAY BEYOND CURVES</p>
    <h2 class="text-5xl md:text-7xl font-black uppercase leading-[0.85]" style="font-family:var(--qm-heading-font)" data-qm="ecommerce-cta-luxe-h2-1">GET FIRST HAND AT THE NEXT DROP.</h2>
    <p class="mx-auto max-w-lg text-sm text-[var(--qm-text-muted)] leading-relaxed">
      Subscribers receive SMS codes and direct links to shop capsules 2 hours before general public release. No spam, just direct access.
    </p>
    <form class="mx-auto max-w-md flex flex-col sm:flex-row gap-3 pt-4">
      <input type="email" name="email" placeholder="ENTER YOUR EMAIL" class="flex-1 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/80 px-5 py-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-text)] placeholder-[var(--qm-text-muted)] outline-none focus:border-[var(--qm-accent)] transition duration-200" required />
      <button type="submit" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-xs font-black uppercase text-[var(--qm-accent-text)] tracking-wider shadow-lg hover:scale-105 active:scale-95 transition duration-200" data-qm="ecommerce-cta-luxe-button-1">SUBSCRIBE</button>
    </form>
  </div>
</section>`,
  },
  {
    id: 'ecommerce-footer-luxe',
    site_type: 'ecommerce',
    section_type: 'footer',
    theme_id: 'urban-streetwear',
    keywords: ['footer', 'luxe', 'brand', 'links', 'socials'],
    preview_description: 'Sophisticated multi-column footer layout with quick navigation, social list, and logo.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
    <div class="space-y-6">
      <p class="text-3xl font-black tracking-widest text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand-name">QAY STUDIO</p>
      <p class="max-w-sm text-xs leading-relaxed" data-qm="footer-tagline">Premium website generation framework featuring custom checkout binders, headless commerce hooks, and visual editing handoffs.</p>
      <div class="flex gap-4">
        <a href="#" class="size-8 rounded-full border border-[var(--qm-border)] flex items-center justify-center text-[var(--qm-text)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition duration-200">
          <svg class="size-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="#" class="size-8 rounded-full border border-[var(--qm-border)] flex items-center justify-center text-[var(--qm-text)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition duration-200">
          <svg class="size-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
      </div>
    </div>
    <div class="space-y-4">
      <h4 class="text-xs font-black uppercase tracking-widest text-[var(--qm-text)]" data-qm="ecommerce-footer-luxe-h4-1">NAVIGATE</h4>
      <div class="flex flex-col gap-3 text-xs">
        <a href="/shop" class="hover:text-[var(--qm-text)] transition" data-qm="ecommerce-footer-luxe-a-1">Shop Capsule</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition" data-qm="ecommerce-footer-luxe-a-2">Our Materials</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition" data-qm="ecommerce-footer-luxe-a-3">Collector Support</a>
      </div>
    </div>
    <div class="space-y-4">
      <h4 class="text-xs font-black uppercase tracking-widest text-[var(--qm-text)]" data-qm="ecommerce-footer-luxe-h4-2">RESOURCES</h4>
      <div class="flex flex-col gap-3 text-xs">
        <a href="/checkout" class="hover:text-[var(--qm-text)] transition" data-qm="ecommerce-footer-luxe-a-4">Checkout Panel</a>
        <a href="/terms" class="hover:text-[var(--qm-text)] transition" data-qm="ecommerce-footer-luxe-a-5">Terms of Sale</a>
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition" data-qm="ecommerce-footer-luxe-a-6">Privacy Protocol</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wider">
    <p data-qm="ecommerce-footer-luxe-p-2">&copy; 2026 QAY STUDIO. ALL RIGHTS RESERVED.</p>
    <p data-qm="ecommerce-footer-luxe-p-3">MEDUSA CORED HEADLESS COMMERCE</p>
  </div>
</footer>`,
  },
];
