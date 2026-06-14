import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
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

const cartDrawer = `<aside data-qay-commerce="cart-drawer" class="hidden fixed right-4 top-20 z-50 flex w-[min(390px,calc(100vw-32px))] flex-col gap-5 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 text-[var(--qm-text)] shadow-2xl">
  <div class="flex items-center justify-between gap-4"><h2 class="text-xl font-semibold">Cart</h2><button type="button" data-qay-commerce="cart-close" class="border border-[var(--qm-border)] px-3 py-2 text-sm">Close</button></div>
  <div data-qay-commerce="cart-items" class="min-h-20 text-sm text-[var(--qm-text-muted)]">Your cart is empty.</div>
  <button type="button" data-qay-commerce="checkout-button" class="bg-[var(--qm-accent)] px-5 py-3 font-medium text-[var(--qm-accent-text)]">Checkout</button>
  <button type="button" data-qay-commerce="cart-cancel" class="border border-[var(--qm-border)] px-5 py-3 text-sm">Cancel</button>
</aside>`;

export const sections: QmSection[] = [
  {
    id: 'ecommerce-nav-luxury',
    site_type: 'ecommerce',
    section_type: 'nav',
    theme_id: 'luxury-dark',
    keywords: ['luxury', 'cart', 'drawer', 'minimal'],
    preview_description: 'Luxury ecommerce nav with cart button and mobile menu.',
    rank: 96,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-semibold tracking-[0.18em]" style="font-family:var(--qm-heading-font)" data-qm="brand-name">ARYKTEEMAH</a>
    <div class="hidden items-center gap-7 text-sm text-[var(--qm-text-muted)] md:flex"><a href="/shop" class="hover:text-[var(--qm-text)]">Shop</a><a href="/about" class="hover:text-[var(--qm-text)]">Story</a><a href="/contact" class="hover:text-[var(--qm-text)]">Contact</a><button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="border border-[var(--qm-border)] px-4 py-2 text-[var(--qm-text)]">Cart (0)</button></div>
    <button type="button" class="border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#store-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="store-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden"><a href="/shop">Shop</a><a href="/about">Story</a><a href="/contact">Contact</a><button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="border border-[var(--qm-border)] px-4 py-3 text-left">Cart (0)</button></div>
  ${cartDrawer}
</nav>`,
  },
  {
    id: 'ecommerce-nav-clean',
    site_type: 'ecommerce',
    section_type: 'nav',
    theme_id: 'clean-minimal',
    keywords: ['clean', 'minimal', 'cart', 'fashion'],
    preview_description: 'Clean ecommerce nav with cart drawer.',
    rank: 92,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="text-lg font-bold" data-qm="brand-name">North Edit</a><div class="hidden items-center gap-6 text-sm font-medium md:flex"><a href="/shop">Shop</a><a href="/about">Materials</a><a href="/contact">Support</a><button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]">Cart (0)</button></div><button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#store-mobile-menu" data-qay-class="hidden">Menu</button></div><div id="store-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden"><a href="/shop">Shop</a><a href="/about">Materials</a><a href="/contact">Support</a><button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="rounded-full bg-[var(--qm-accent)] px-4 py-3 text-left text-[var(--qm-accent-text)]">Cart (0)</button></div>${cartDrawer}</nav>`,
  },
  {
    id: 'ecommerce-hero-editorial',
    site_type: 'ecommerce',
    section_type: 'hero',
    theme_id: 'luxury-dark',
    keywords: ['perfume', 'luxury', 'editorial', 'product', 'dark'],
    preview_description: 'Editorial luxury product hero with large image.',
    rank: 96,
    html: `<section class="grid min-h-[720px] bg-[var(--qm-bg)] text-[var(--qm-text)] lg:grid-cols-[0.85fr_1.15fr]"><div class="flex flex-col justify-center px-6 py-20 md:px-16" data-qay-animate="slide-right"><p class="text-xs uppercase tracking-[0.35em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">New extrait collection</p><h1 class="mt-6 text-5xl font-semibold leading-[0.95] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Fragrance with ceremony, smoke, and silk.</h1><p class="mt-7 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Layered perfumes blended for evenings, rituals, and rooms that remember you.</p><div class="mt-10 flex flex-col gap-3 sm:flex-row"><a href="/shop" class="bg-[var(--qm-accent)] px-7 py-4 text-center font-medium text-[var(--qm-accent-text)]">Shop collection</a><a href="/product" class="border border-[var(--qm-border)] px-7 py-4 text-center">Explore notes</a></div></div><div class="relative min-h-[520px] overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1595425964071-2c1ec4fd2764?w=1400&auto=format&q=85" alt="Luxury perfume bottle on dark surface" class="absolute inset-0 h-full w-full object-cover" data-qm="hero-image" /></div></section>`,
  },
  {
    id: 'ecommerce-hero-clean',
    site_type: 'ecommerce',
    section_type: 'hero',
    theme_id: 'clean-minimal',
    keywords: ['clean', 'minimal', 'skincare', 'fashion', 'product'],
    preview_description: 'Minimal product hero with clean image and shop CTA.',
    rank: 91,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-14 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-text-muted)]">Responsible essentials</p><h1 class="mt-5 text-5xl font-extrabold leading-[0.95] md:text-7xl" data-qm="hero-title">Quiet pieces for daily rituals.</h1><p class="mt-6 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]">Clean silhouettes, thoughtful materials, and products made to earn their place.</p><a href="/shop" class="mt-9 inline-flex rounded-full bg-[var(--qm-accent)] px-7 py-4 font-bold text-[var(--qm-accent-text)]">Shop new arrivals</a></div><div class="overflow-hidden rounded-[2rem]" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1400&auto=format&q=85" alt="Minimal skincare products on a clean surface" class="h-[560px] w-full object-cover" /></div></div></section>`,
  },
  {
    id: 'ecommerce-collection-luxury',
    site_type: 'ecommerce',
    section_type: 'collection',
    theme_id: 'luxury-dark',
    keywords: ['collection', 'editorial', 'product-grid', 'luxury'],
    preview_description: 'Editorial collection intro.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-[0.7fr_1.3fr]"><h2 class="text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)">The private edit</h2><p class="text-lg leading-8 text-[var(--qm-text-muted)]">A compact collection of best-selling pieces, selected for first-time buyers and loyal collectors.</p></div></section>`,
  },
  {
    id: 'ecommerce-products-luxury',
    site_type: 'ecommerce',
    section_type: 'products',
    theme_id: 'luxury-dark',
    keywords: ['products', 'perfume', 'cart', 'add-to-cart', 'grid'],
    preview_description: 'Three product cards with QAY commerce hooks.',
    rank: 95,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><div class="grid gap-5 md:grid-cols-3" data-qay-commerce="product-grid">
  <article class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4" data-qay-commerce="product-card" data-qay-product-id="sample-product-1" data-qay-product-handle="midnight-oud"><div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1595425964071-2c1ec4fd2764?w=900&auto=format&q=85" alt="Midnight Oud perfume" class="h-[360px] w-full object-cover" /></div><h3 class="mt-5 text-2xl font-semibold" data-qay-commerce="product-title">Midnight Oud</h3><p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">Oud, black tea, amber smoke, and soft vanilla.</p><p class="mt-4 text-[var(--qm-accent)]" data-qay-commerce="product-price">$128</p><div class="mt-5 flex gap-2"><button type="button" class="flex-1 bg-[var(--qm-accent)] px-4 py-3 text-sm font-medium text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">Add to cart</button><button type="button" class="border border-[var(--qm-border)] px-4 py-3 text-sm" data-qay-commerce="remove-from-cart" data-qay-product-id="sample-product-1">Remove</button></div></article>
  <article class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4" data-qay-commerce="product-card" data-qay-product-id="sample-product-2" data-qay-product-handle="rose-saffron"><div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=900&auto=format&q=85" alt="Rose Saffron perfume" class="h-[360px] w-full object-cover" /></div><h3 class="mt-5 text-2xl font-semibold" data-qay-commerce="product-title">Rose Saffron</h3><p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">Velvet rose, saffron, citrus peel, and musk.</p><p class="mt-4 text-[var(--qm-accent)]" data-qay-commerce="product-price">$118</p><div class="mt-5 flex gap-2"><button type="button" class="flex-1 bg-[var(--qm-accent)] px-4 py-3 text-sm font-medium text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-2">Add to cart</button><button type="button" class="border border-[var(--qm-border)] px-4 py-3 text-sm" data-qay-commerce="remove-from-cart" data-qay-product-id="sample-product-2">Remove</button></div></article>
  <article class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4" data-qay-commerce="product-card" data-qay-product-id="sample-product-3" data-qay-product-handle="silk-musk"><div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=900&auto=format&q=85" alt="Silk Musk perfume bottle" class="h-[360px] w-full object-cover" /></div><h3 class="mt-5 text-2xl font-semibold" data-qay-commerce="product-title">Silk Musk</h3><p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">White musk, iris, cedar, and warm skin notes.</p><p class="mt-4 text-[var(--qm-accent)]" data-qay-commerce="product-price">$104</p><div class="mt-5 flex gap-2"><button type="button" class="flex-1 bg-[var(--qm-accent)] px-4 py-3 text-sm font-medium text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-3">Add to cart</button><button type="button" class="border border-[var(--qm-border)] px-4 py-3 text-sm" data-qay-commerce="remove-from-cart" data-qay-product-id="sample-product-3">Remove</button></div></article>
</div></div></section>`,
  },
  {
    id: 'ecommerce-about-luxury',
    site_type: 'ecommerce',
    section_type: 'about',
    theme_id: 'luxury-dark',
    keywords: ['brand-story', 'craft', 'luxury'],
    preview_description: 'Brand story section for premium store.',
    rank: 80,
    html: `<section class="grid bg-[var(--qm-surface)] text-[var(--qm-text)] lg:grid-cols-2"><div class="min-h-[480px] overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&auto=format&q=85" alt="Perfume ingredients and glass bottle" class="h-full w-full object-cover" /></div><div class="flex flex-col justify-center px-6 py-20 md:px-16"><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)]">Craft</p><h2 class="mt-5 text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)">Small batches, serious presence.</h2><p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]">Each release is blended in limited runs, macerated slowly, and packed with refill-aware materials.</p></div></section>`,
  },
  {
    id: 'ecommerce-trust-luxury',
    site_type: 'ecommerce',
    section_type: 'testimonials',
    theme_id: 'luxury-dark',
    keywords: ['trust', 'reviews', 'shipping'],
    preview_description: 'Trust and review strip.',
    rank: 78,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-4 md:grid-cols-3"><div class="border border-[var(--qm-border)] p-6"><p class="font-semibold">Complimentary samples</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Every order ships with two discovery vials.</p></div><div class="border border-[var(--qm-border)] p-6"><p class="font-semibold">Secure checkout</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Medusa-ready cart and checkout integration.</p></div><div class="border border-[var(--qm-border)] p-6"><p class="font-semibold">4.9 average rating</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Loved by collectors in Lagos, London, and Accra.</p></div></div></section>`,
  },
  {
    id: 'ecommerce-cta-luxury',
    site_type: 'ecommerce',
    section_type: 'cta',
    theme_id: 'luxury-dark',
    keywords: ['newsletter', 'cta', 'drop'],
    preview_description: 'Collection drop CTA.',
    rank: 76,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-center text-[var(--qm-text)]"><h2 class="mx-auto max-w-3xl text-4xl font-semibold md:text-6xl" style="font-family:var(--qm-heading-font)">Get first access to the next extrait drop.</h2><a href="/shop" class="mt-8 inline-flex bg-[var(--qm-accent)] px-7 py-4 font-medium text-[var(--qm-accent-text)]">Shop bestsellers</a></section>`,
  },
  {
    id: 'ecommerce-footer',
    site_type: 'ecommerce',
    section_type: 'footer',
    theme_id: 'luxury-dark',
    keywords: ['footer', 'store', 'commerce'],
    preview_description: 'Store footer with links.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-10 text-sm text-[var(--qm-text-muted)]"><div class="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between"><p data-qm="footer-brand">ARYKTEEMAH</p><div class="flex gap-5"><a href="/shop">Shop</a><a href="/contact">Support</a><a href="/checkout">Checkout</a></div></div></footer>`,
  },
];
