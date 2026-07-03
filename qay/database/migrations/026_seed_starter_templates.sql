-- Seed 4 high-quality starter templates for the QAY AI builder
-- Each template uses var(--qm-*) CSS variables and data-qm zones

INSERT INTO qay_ai_templates (
  site_type, theme, label, html, pages,
  industry, color_mood, tags, features, zones, pages_meta, cms_hints,
  source, is_approved, is_active, rank
) VALUES

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 1: Urban Streetwear Ecommerce
-- ══════════════════════════════════════════════════════════════════════
(
  'ecommerce',
  'dark',
  'Urban Streetwear Shop',
  $tpl1$
<style>
:root {
  --qm-bg: #000000;
  --qm-surface: #111111;
  --qm-text: #ffffff;
  --qm-text-muted: #a3a3a3;
  --qm-accent: #39ff14;
  --qm-accent-text: #000000;
  --qm-border: rgba(57,255,20,0.18);
  --qm-heading-font: 'Bebas Neue', sans-serif;
  --qm-body-font: 'Inter', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-2xl font-black tracking-[0.15em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">DRIP DISTRICT</a>
      <div class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[var(--qm-text-muted)]">
        <a href="/shop" class="hover:text-[var(--qm-accent)] transition-colors" data-qm="nav-shop">Shop</a>
        <a href="/about" class="hover:text-[var(--qm-accent)] transition-colors" data-qm="nav-about">Story</a>
        <a href="/contact" class="hover:text-[var(--qm-accent)] transition-colors" data-qm="nav-contact">Contact</a>
        <button type="button" data-qay-commerce="cart-button" class="flex items-center gap-2 rounded-full border border-[var(--qm-accent)] px-5 py-2 text-xs font-bold text-[var(--qm-accent)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition-all" data-qm="nav-cart-label">Cart (0)</button>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text)]" data-qay-click="toggle" data-qay-target="#home-mobile-menu" data-qay-class="hidden">☰</button>
    </div>
  </nav>

  <div id="home-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-5 space-y-3 md:hidden">
    <a href="/shop" class="block text-sm font-bold uppercase tracking-widest text-[var(--qm-text-muted)] hover:text-[var(--qm-text)]" data-qm="mobile-nav-shop">Shop</a>
    <a href="/about" class="block text-sm font-bold uppercase tracking-widest text-[var(--qm-text-muted)] hover:text-[var(--qm-text)]">Story</a>
    <a href="/contact" class="block text-sm font-bold uppercase tracking-widest text-[var(--qm-text-muted)] hover:text-[var(--qm-text)]">Contact</a>
  </div>

  <section class="relative overflow-hidden px-6 py-24 md:py-40" data-qay-animate="fade-in">
    <div class="mx-auto max-w-7xl">
      <p class="text-sm font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">New Collection — SS25</p>
      <h1 class="mt-4 max-w-3xl text-[clamp(4rem,12vw,9rem)] font-black uppercase leading-[0.9] tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="hero-headline">Street Is The New Runway</h1>
      <p class="mt-8 max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtext">Curated streetwear for those who move culture forward. Limited drops. Global community.</p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a href="/shop" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-sm font-black uppercase tracking-widest text-[var(--qm-accent-text)] hover:opacity-90 transition-opacity" data-qm="hero-cta-primary">Shop the Drop</a>
        <a href="/about" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[var(--qm-text-muted)] hover:text-[var(--qm-text)] hover:border-[var(--qm-text)] transition-all" data-qm="hero-cta-secondary">Our Story</a>
      </div>
    </div>
    <div class="absolute right-0 top-0 h-full w-1/2 hidden lg:block overflow-hidden">
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=90&auto=format&fit=crop" alt="Streetwear collection hero" class="h-full w-full object-cover opacity-70" data-qm="hero-image" />
    </div>
  </section>

  <section class="px-6 py-16 md:py-24" data-qay-animate="slide-up">
    <div class="mx-auto max-w-7xl">
      <div class="flex items-end justify-between mb-10">
        <h2 class="text-4xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="featured-heading">Featured Drops</h2>
        <a href="/shop" class="text-sm font-bold uppercase tracking-widest text-[var(--qm-accent)] hover:opacity-70 transition-opacity" data-qm="featured-view-all">View All</a>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-qay-commerce="product-grid" data-qay-animate="stagger-children">
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)]" data-qay-commerce="product-card" data-qay-product-id="t1-001">
          <div class="aspect-[3/4] overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom">
            <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&q=85&auto=format&fit=crop" alt="Product 1" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="product-image-1" />
          </div>
          <div class="p-5 space-y-2">
            <h3 class="font-bold text-base uppercase tracking-wide" data-qay-commerce="product-title" data-qm="product-title-1">Phantom Hoodie</h3>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qay-commerce="product-description" data-qm="product-desc-1">Heavyweight 420gsm fleece. Oversized silhouette.</p>
            <div class="flex items-center justify-between pt-1">
              <span class="font-bold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="product-price-1">$145</span>
              <button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-xs font-black uppercase text-[var(--qm-accent-text)] hover:opacity-90 transition-opacity" data-qay-commerce="add-to-cart" data-qay-product-id="t1-001" data-qm="product-cta-1">Add</button>
            </div>
          </div>
        </article>
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)]" data-qay-commerce="product-card" data-qay-product-id="t1-002">
          <div class="aspect-[3/4] overflow-hidden" data-qay-commerce="product-image">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop" alt="Product 2" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="product-image-2" />
          </div>
          <div class="p-5 space-y-2">
            <h3 class="font-bold text-base uppercase tracking-wide" data-qay-commerce="product-title" data-qm="product-title-2">Stealth Cargo Pant</h3>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qay-commerce="product-description" data-qm="product-desc-2">10-pocket tactical fit. Water-resistant nylon.</p>
            <div class="flex items-center justify-between pt-1">
              <span class="font-bold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="product-price-2">$175</span>
              <button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-xs font-black uppercase text-[var(--qm-accent-text)] hover:opacity-90 transition-opacity" data-qay-commerce="add-to-cart" data-qay-product-id="t1-002" data-qm="product-cta-2">Add</button>
            </div>
          </div>
        </article>
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)]" data-qay-commerce="product-card" data-qay-product-id="t1-003">
          <div class="aspect-[3/4] overflow-hidden" data-qay-commerce="product-image">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85&auto=format&fit=crop" alt="Product 3" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="product-image-3" />
          </div>
          <div class="p-5 space-y-2">
            <h3 class="font-bold text-base uppercase tracking-wide" data-qay-commerce="product-title" data-qm="product-title-3">Blacked Out Tee</h3>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qay-commerce="product-description" data-qm="product-desc-3">Supima cotton. Drop-shoulder fit. Screen printed.</p>
            <div class="flex items-center justify-between pt-1">
              <span class="font-bold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="product-price-3">$65</span>
              <button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-xs font-black uppercase text-[var(--qm-accent-text)] hover:opacity-90 transition-opacity" data-qay-commerce="add-to-cart" data-qay-product-id="t1-003" data-qm="product-cta-3">Add</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="px-6 py-16 md:py-24 bg-[var(--qm-surface)]" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-7xl">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div class="space-y-5">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="about-eyebrow">The Movement</p>
          <h2 class="text-5xl font-black uppercase leading-tight" style="font-family:var(--qm-heading-font)" data-qm="about-headline">Born in the Streets. Built for the Bold.</h2>
          <p class="text-base leading-8 text-[var(--qm-text-muted)]" data-qm="about-body">We don't follow trends. We set them. Every piece is a statement, every drop a cultural moment. Join the movement that's redefining what streetwear means globally.</p>
          <a href="/about" class="inline-flex font-bold uppercase tracking-widest text-sm text-[var(--qm-accent)] hover:opacity-70 transition-opacity" data-qm="about-link">Read Our Story →</a>
        </div>
        <div class="aspect-[4/3] overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop" alt="Brand story" class="h-full w-full object-cover" data-qm="about-image" />
        </div>
      </div>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-6 py-10 text-sm text-[var(--qm-text-muted)]">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 items-center">
      <span class="text-xl font-black uppercase tracking-[0.15em]" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="footer-brand">DRIP DISTRICT</span>
      <div class="flex gap-6 text-xs font-bold uppercase tracking-widest">
        <a href="/shop" class="hover:text-[var(--qm-text)] transition-colors" data-qm="footer-shop">Shop</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors" data-qm="footer-about">Story</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition-colors" data-qm="footer-contact">Contact</a>
      </div>
      <p class="text-xs" data-qm="footer-copy">© 2025 Drip District. All rights reserved.</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Shop" data-qay-slug="/shop">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-2xl font-black tracking-[0.15em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">DRIP DISTRICT</a>
      <button type="button" data-qay-commerce="cart-button" class="rounded-full border border-[var(--qm-accent)] px-5 py-2 text-xs font-bold text-[var(--qm-accent)]" data-qm="shop-cart-label">Cart (0)</button>
    </div>
  </nav>
  <section class="mx-auto max-w-7xl px-6 py-16">
    <h1 class="text-6xl font-black uppercase mb-10" style="font-family:var(--qm-heading-font)" data-qm="shop-heading">All Products</h1>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-qay-commerce="product-grid" data-qay-animate="stagger-children">
      <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)]" data-qay-commerce="product-card" data-qay-product-id="t1-001">
        <div class="aspect-[3/4] overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&q=85&auto=format&fit=crop" alt="Phantom Hoodie" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="shop-product-image-1" /></div>
        <div class="p-4 space-y-1"><h2 class="font-bold text-sm uppercase" data-qay-commerce="product-title" data-qm="shop-product-title-1">Phantom Hoodie</h2><div class="flex justify-between items-center pt-1"><span class="font-bold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="shop-product-price-1">$145</span><button type="button" class="rounded-full bg-[var(--qm-accent)] px-3 py-1.5 text-xs font-black text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="t1-001">Add</button></div></div>
      </article>
      <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)]" data-qay-commerce="product-card" data-qay-product-id="t1-002">
        <div class="aspect-[3/4] overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop" alt="Stealth Cargo" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="shop-product-image-2" /></div>
        <div class="p-4 space-y-1"><h2 class="font-bold text-sm uppercase" data-qay-commerce="product-title" data-qm="shop-product-title-2">Stealth Cargo Pant</h2><div class="flex justify-between items-center pt-1"><span class="font-bold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="shop-product-price-2">$175</span><button type="button" class="rounded-full bg-[var(--qm-accent)] px-3 py-1.5 text-xs font-black text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="t1-002">Add</button></div></div>
      </article>
      <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)]" data-qay-commerce="product-card" data-qay-product-id="t1-003">
        <div class="aspect-[3/4] overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85&auto=format&fit=crop" alt="Blacked Out Tee" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="shop-product-image-3" /></div>
        <div class="p-4 space-y-1"><h2 class="font-bold text-sm uppercase" data-qay-commerce="product-title" data-qm="shop-product-title-3">Blacked Out Tee</h2><div class="flex justify-between items-center pt-1"><span class="font-bold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="shop-product-price-3">$65</span><button type="button" class="rounded-full bg-[var(--qm-accent)] px-3 py-1.5 text-xs font-black text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="t1-003">Add</button></div></div>
      </article>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-xs text-[var(--qm-text-muted)] text-center" data-qm="footer-copy">© 2025 Drip District</footer>
</main>
</div>

<div data-qay-page="About" data-qay-slug="/about">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-2xl font-black tracking-[0.15em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">DRIP DISTRICT</a><div class="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-[var(--qm-text-muted)]"><a href="/shop" class="hover:text-[var(--qm-accent)] transition-colors">Shop</a><a href="/contact" class="hover:text-[var(--qm-accent)] transition-colors">Contact</a></div></div></nav>
  <section class="mx-auto max-w-5xl px-6 py-24 space-y-12" data-qay-animate="fade-in">
    <div class="space-y-5"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="about-page-eyebrow">The Story</p><h1 class="text-6xl font-black uppercase leading-tight" style="font-family:var(--qm-heading-font)" data-qm="about-page-headline">We Started in a Garage. We Changed a Culture.</h1></div>
    <div class="grid md:grid-cols-2 gap-10">
      <p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="about-body-1">Founded by two friends who couldn't find clothes that matched their vision, Drip District was built on the idea that streetwear is not just fashion — it's language. It tells the world who you are before you speak.</p>
      <p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="about-body-2">Every piece goes through a 9-step quality process. We work with independent factories, pay living wages, and use sustainable fabrics wherever possible. This isn't performative. It's the only way we know how to work.</p>
    </div>
    <div class="aspect-[21/9] overflow-hidden rounded-3xl"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85&auto=format&fit=crop" alt="Team" class="w-full h-full object-cover" data-qm="about-team-image" /></div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-xs text-[var(--qm-text-muted)] text-center" data-qm="footer-copy">© 2025 Drip District</footer>
</main>
</div>

<div data-qay-page="Contact" data-qay-slug="/contact">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-2xl font-black tracking-[0.15em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">DRIP DISTRICT</a></div></nav>
  <section class="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center" data-qay-animate="slide-up">
    <div class="space-y-5"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="contact-eyebrow">Contact</p><h1 class="text-6xl font-black uppercase leading-tight" style="font-family:var(--qm-heading-font)" data-qm="contact-headline">Let's Talk.</h1><p class="text-base leading-8 text-[var(--qm-text-muted)]" data-qm="contact-body">Stockist enquiries, collaborations, or just want to say something? We're listening.</p></div>
    <form class="space-y-4 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Your name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)]" /><input name="email" type="email" placeholder="Email address" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)]" /><textarea name="message" rows="4" placeholder="Message" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] resize-none"></textarea><button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] py-3 text-sm font-black uppercase tracking-widest text-[var(--qm-accent-text)] hover:opacity-90 transition-opacity" data-qm="contact-submit">Send Message</button></form>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-xs text-[var(--qm-text-muted)] text-center" data-qm="footer-copy">© 2025 Drip District</footer>
</main>
</div>
$tpl1$,
  '[{"name":"Home","slug":"/"},{"name":"Shop","slug":"/shop"},{"name":"About","slug":"/about"},{"name":"Contact","slug":"/contact"}]'::jsonb,
  'ecommerce', 'dark-bold',
  ARRAY['streetwear','urban','ecommerce','dark','bold','neon-accent','multi-page','shop','fashion','commerce','add-to-cart','product-grid','bebas-neue','black-background'],
  '{"hasCms":false,"hasCommerce":true,"hasAuth":false,"hasMultiPage":true,"pageCount":4}'::jsonb,
  '{"brand-name":"DRIP DISTRICT","hero-eyebrow":"New Collection — SS25","hero-headline":"Street Is The New Runway","hero-subtext":"Curated streetwear for those who move culture forward.","hero-cta-primary":"Shop the Drop","product-title-1":"Phantom Hoodie","product-price-1":"$145"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/shop","name":"Shop","purpose":"ecommerce"},{"slug":"/about","name":"About","purpose":"about"},{"slug":"/contact","name":"Contact","purpose":"contact"}]'::jsonb,
  '{"collectionType":"products","sampleItems":[{"title":"Phantom Hoodie","subtitle":"Heavyweight 420gsm fleece","price":"$145"},{"title":"Stealth Cargo Pant","subtitle":"10-pocket tactical fit","price":"$175"},{"title":"Blacked Out Tee","subtitle":"Supima cotton drop-shoulder","price":"$65"}]}'::jsonb,
  'qay', true, true, 90
),

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 2: Premium Law Firm
-- ══════════════════════════════════════════════════════════════════════
(
  'law',
  'luxury',
  'Premium Law Firm',
  $tpl2$
<style>
:root {
  --qm-bg: #0a0905;
  --qm-surface: #14120d;
  --qm-text: #f5ede0;
  --qm-text-muted: #9b8a75;
  --qm-accent: #c9a84c;
  --qm-accent-text: #0a0905;
  --qm-border: rgba(201,168,76,0.15);
  --qm-heading-font: 'Cormorant Garamond', serif;
  --qm-body-font: 'DM Sans', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-8 py-5 backdrop-blur-xl" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-xl font-light tracking-[0.25em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">Chambers & Cole</a>
      <div class="hidden md:flex items-center gap-10 text-sm text-[var(--qm-text-muted)] tracking-widest">
        <a href="/practice-areas" class="hover:text-[var(--qm-text)] transition-colors uppercase text-xs tracking-[0.2em]" data-qm="nav-practice">Practice Areas</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors uppercase text-xs tracking-[0.2em]" data-qm="nav-about">About</a>
        <a href="/contact" class="rounded border border-[var(--qm-accent)] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--qm-accent)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition-all" data-qm="nav-cta">Consultation</a>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text-muted)]" data-qay-click="toggle" data-qay-target="#law-mobile-menu" data-qay-class="hidden">Menu</button>
    </div>
  </nav>

  <div id="law-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-8 py-6 space-y-4 md:hidden">
    <a href="/practice-areas" class="block text-xs uppercase tracking-[0.2em] text-[var(--qm-text-muted)]" data-qm="mobile-nav-practice">Practice Areas</a>
    <a href="/about" class="block text-xs uppercase tracking-[0.2em] text-[var(--qm-text-muted)]">About</a>
    <a href="/contact" class="block text-xs uppercase tracking-[0.2em] text-[var(--qm-accent)]">Consultation</a>
  </div>

  <section class="relative min-h-[90vh] flex items-center px-8 py-24" data-qay-animate="fade-in">
    <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <p class="text-xs font-medium uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Established 1998 · Lagos & London</p>
        <h1 class="text-[clamp(3rem,6vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em]" style="font-family:var(--qm-heading-font)" data-qm="hero-headline">Counsel Defined by Integrity. Results Built on Excellence.</h1>
        <p class="text-base leading-8 text-[var(--qm-text-muted)] max-w-lg" data-qm="hero-subtext">For over two decades, our chambers have delivered decisive legal strategy for Africa's most complex commercial matters.</p>
        <div class="flex flex-wrap gap-4">
          <a href="/contact" class="rounded border border-[var(--qm-accent)] px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--qm-accent)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition-all" data-qm="hero-cta-primary">Request Consultation</a>
          <a href="/practice-areas" class="rounded border border-[var(--qm-border)] px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--qm-text-muted)] hover:text-[var(--qm-text)] hover:border-[var(--qm-text-muted)] transition-all" data-qm="hero-cta-secondary">Our Practice</a>
        </div>
      </div>
      <div class="aspect-[4/5] overflow-hidden rounded-sm">
        <img src="https://images.unsplash.com/photo-1521791055366-0d553872952f?w=1200&q=90&auto=format&fit=crop" alt="Law firm" class="h-full w-full object-cover" data-qm="hero-image" />
      </div>
    </div>
  </section>

  <section class="px-8 py-20 bg-[var(--qm-surface)]" data-qay-animate="slide-up">
    <div class="mx-auto max-w-7xl">
      <p class="text-xs font-medium uppercase tracking-[0.4em] text-[var(--qm-accent)] mb-3" data-qm="practice-eyebrow">Practice Areas</p>
      <h2 class="text-4xl font-light leading-tight mb-12" style="font-family:var(--qm-heading-font)" data-qm="practice-heading">We Advise On</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <article class="rounded border border-[var(--qm-border)] p-8 hover:border-[var(--qm-accent)] transition-colors space-y-3">
          <h3 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="practice-area-1">Corporate & M&A</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="practice-desc-1">Complex transactions, mergers, acquisitions, and joint ventures across African and international markets.</p>
        </article>
        <article class="rounded border border-[var(--qm-border)] p-8 hover:border-[var(--qm-accent)] transition-colors space-y-3">
          <h3 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="practice-area-2">Commercial Litigation</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="practice-desc-2">High-value dispute resolution, arbitration, and enforcement of judgments across multiple jurisdictions.</p>
        </article>
        <article class="rounded border border-[var(--qm-border)] p-8 hover:border-[var(--qm-accent)] transition-colors space-y-3">
          <h3 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="practice-area-3">Energy & Infrastructure</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="practice-desc-3">Oil & gas contracts, power sector transactions, and regulatory compliance for energy companies.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="px-8 py-20" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-7xl grid md:grid-cols-3 gap-8 text-center">
      <div class="space-y-2"><p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-1-number">25+</p><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-text-muted)]" data-qm="stat-1-label">Years of Practice</p></div>
      <div class="space-y-2"><p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-2-number">$2.4B</p><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-text-muted)]" data-qm="stat-2-label">Transactions Advised</p></div>
      <div class="space-y-2"><p class="text-5xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-3-number">18</p><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-text-muted)]" data-qm="stat-3-label">Partner Attorneys</p></div>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-8 py-10">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 text-xs text-[var(--qm-text-muted)] tracking-widest uppercase">
      <span style="font-family:var(--qm-heading-font);font-size:1.1rem;color:var(--qm-accent);font-weight:300;letter-spacing:0.2em" data-qm="footer-brand">Chambers & Cole</span>
      <div class="flex gap-8"><a href="/practice-areas" class="hover:text-[var(--qm-text)] transition-colors">Practice</a><a href="/about" class="hover:text-[var(--qm-text)] transition-colors">About</a><a href="/contact" class="hover:text-[var(--qm-text)] transition-colors">Contact</a></div>
      <p data-qm="footer-copy">© 2025 Chambers & Cole. All rights reserved.</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Practice Areas" data-qay-slug="/practice-areas">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-8 py-5 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-xl font-light tracking-[0.25em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">Chambers & Cole</a><a href="/contact" class="rounded border border-[var(--qm-accent)] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[var(--qm-accent)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition-all" data-qm="nav-cta">Consultation</a></div></nav>
  <section class="mx-auto max-w-5xl px-8 py-24" data-qay-animate="fade-in">
    <p class="text-xs uppercase tracking-[0.4em] text-[var(--qm-accent)] mb-4" data-qm="areas-eyebrow">Our Expertise</p>
    <h1 class="text-6xl font-light mb-16" style="font-family:var(--qm-heading-font)" data-qm="areas-heading">Practice Areas</h1>
    <div class="space-y-px">
      <article class="border-t border-[var(--qm-border)] py-8 grid md:grid-cols-[1fr_2fr] gap-8 hover:bg-[var(--qm-surface)] transition-colors px-6 rounded">
        <h2 class="text-2xl font-light" style="font-family:var(--qm-heading-font)" data-qm="area-full-1">Corporate & M&A</h2>
        <p class="text-sm leading-8 text-[var(--qm-text-muted)]" data-qm="area-full-desc-1">From initial structuring through post-closing integration, we advise on all phases of complex transactions. Our team has closed deals across 12 African markets and maintains relationships with leading international counsel.</p>
      </article>
      <article class="border-t border-[var(--qm-border)] py-8 grid md:grid-cols-[1fr_2fr] gap-8 hover:bg-[var(--qm-surface)] transition-colors px-6 rounded">
        <h2 class="text-2xl font-light" style="font-family:var(--qm-heading-font)" data-qm="area-full-2">Commercial Litigation</h2>
        <p class="text-sm leading-8 text-[var(--qm-text-muted)]" data-qm="area-full-desc-2">We represent clients in high-stakes commercial disputes before Nigerian courts and international arbitral tribunals. Our record of successful outcomes speaks to our depth of courtroom experience.</p>
      </article>
      <article class="border-t border-b border-[var(--qm-border)] py-8 grid md:grid-cols-[1fr_2fr] gap-8 hover:bg-[var(--qm-surface)] transition-colors px-6 rounded">
        <h2 class="text-2xl font-light" style="font-family:var(--qm-heading-font)" data-qm="area-full-3">Energy & Infrastructure</h2>
        <p class="text-sm leading-8 text-[var(--qm-text-muted)]" data-qm="area-full-desc-3">Advising government entities, IOCs, and independent power producers on oil & gas contracts, power purchase agreements, and DFI financing arrangements.</p>
      </article>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-8 py-8 text-xs text-[var(--qm-text-muted)] text-center tracking-widest uppercase" data-qm="footer-copy">© 2025 Chambers & Cole</footer>
</main>
</div>

<div data-qay-page="Contact" data-qay-slug="/contact">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-8 py-5 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-xl font-light tracking-[0.25em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="brand-name">Chambers & Cole</a></div></nav>
  <section class="mx-auto max-w-5xl px-8 py-24 grid md:grid-cols-2 gap-16 items-center" data-qay-animate="fade-in">
    <div class="space-y-6"><p class="text-xs uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="contact-eyebrow">Get In Touch</p><h1 class="text-5xl font-light leading-tight" style="font-family:var(--qm-heading-font)" data-qm="contact-heading">Request a Consultation</h1><p class="text-base leading-8 text-[var(--qm-text-muted)]" data-qm="contact-body">Our senior partners are available for initial consultations on complex matters. All enquiries are treated with absolute confidentiality.</p><div class="space-y-2 text-sm text-[var(--qm-text-muted)]"><p data-qm="contact-phone">+234 (0) 800 CHAMBERS</p><p data-qm="contact-email">enquiries@chambersandcole.com</p></div></div>
    <form class="space-y-4 rounded border border-[var(--qm-border)] p-8"><input name="name" placeholder="Full name" class="w-full rounded border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="email" type="email" placeholder="Email address" class="w-full rounded border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="company" placeholder="Company / Organisation" class="w-full rounded border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><textarea name="matter" rows="4" placeholder="Briefly describe your matter" class="w-full rounded border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors resize-none"></textarea><button type="submit" class="w-full rounded border border-[var(--qm-accent)] py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-[var(--qm-accent)] hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)] transition-all" data-qm="contact-submit">Submit Enquiry</button></form>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-8 py-8 text-xs text-[var(--qm-text-muted)] text-center tracking-widest uppercase" data-qm="footer-copy">© 2025 Chambers & Cole</footer>
</main>
</div>
$tpl2$,
  '[{"name":"Home","slug":"/"},{"name":"Practice Areas","slug":"/practice-areas"},{"name":"Contact","slug":"/contact"}]'::jsonb,
  'law', 'dark-luxury',
  ARRAY['law','law-firm','legal','luxury','dark','gold-accent','cormorant','editorial','serif','multi-page','professional','corporate','litigation','energy'],
  '{"hasCms":false,"hasCommerce":false,"hasAuth":false,"hasMultiPage":true,"pageCount":3}'::jsonb,
  '{"brand-name":"Chambers & Cole","hero-eyebrow":"Established 1998 · Lagos & London","hero-headline":"Counsel Defined by Integrity. Results Built on Excellence.","practice-area-1":"Corporate & M&A","stat-1-number":"25+","stat-2-number":"$2.4B"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/practice-areas","name":"Practice Areas","purpose":"services"},{"slug":"/contact","name":"Contact","purpose":"contact"}]'::jsonb,
  null,
  'qay', true, true, 88
),

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 3: Minimal SaaS Landing
-- ══════════════════════════════════════════════════════════════════════
(
  'saas',
  'light',
  'Minimal SaaS Landing',
  $tpl3$
<style>
:root {
  --qm-bg: #ffffff;
  --qm-surface: #f8f8f6;
  --qm-text: #111111;
  --qm-text-muted: #71717a;
  --qm-accent: #111111;
  --qm-accent-text: #ffffff;
  --qm-border: rgba(0,0,0,0.08);
  --qm-heading-font: 'Inter', sans-serif;
  --qm-body-font: 'Inter', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-white/90 px-6 py-4 backdrop-blur-xl" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <a href="/" class="text-base font-bold tracking-tight" data-qm="brand-name">Flowmatic</a>
      <div class="hidden md:flex items-center gap-8 text-sm text-[var(--qm-text-muted)]">
        <a href="/#features" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-features">Features</a>
        <a href="/pricing" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-pricing">Pricing</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-about">About</a>
        <a href="/login" class="text-sm text-[var(--qm-text-muted)] hover:text-[var(--qm-text)] transition-colors" data-qm="nav-login">Log in</a>
        <a href="/signup" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="nav-cta">Get started free</a>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text)]" data-qay-click="toggle" data-qay-target="#saas-mobile-menu" data-qay-class="hidden">Menu</button>
    </div>
  </nav>

  <div id="saas-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-white px-6 py-5 space-y-3 md:hidden">
    <a href="/pricing" class="block text-sm text-[var(--qm-text-muted)]">Pricing</a>
    <a href="/login" class="block text-sm text-[var(--qm-text-muted)]">Log in</a>
    <a href="/signup" class="block text-sm font-semibold text-[var(--qm-text)]">Get started →</a>
  </div>

  <section class="px-6 py-28 md:py-40 text-center" data-qay-animate="fade-in">
    <div class="mx-auto max-w-4xl space-y-8">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-1.5 text-xs font-medium text-[var(--qm-text-muted)]">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        <span data-qm="hero-badge">Loved by 12,000+ teams worldwide</span>
      </div>
      <h1 class="text-[clamp(3rem,8vw,6rem)] font-bold tracking-[-0.04em] leading-[1.0]" data-qm="hero-headline">Automate the work that slows your team down.</h1>
      <p class="mx-auto max-w-xl text-xl leading-9 text-[var(--qm-text-muted)]" data-qm="hero-subtext">Flowmatic connects your tools, automates your workflows, and gives you back hours every week. No code required.</p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a href="/signup" class="rounded-xl bg-[var(--qm-accent)] px-8 py-4 text-sm font-semibold text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="hero-cta-primary">Start for free</a>
        <a href="/#features" class="rounded-xl border border-[var(--qm-border)] px-8 py-4 text-sm font-semibold text-[var(--qm-text-muted)] hover:text-[var(--qm-text)] hover:border-[var(--qm-text-muted)] transition-all" data-qm="hero-cta-secondary">See how it works</a>
      </div>
      <p class="text-xs text-[var(--qm-text-muted)]" data-qm="hero-footnote">Free 14-day trial · No credit card required · Cancel anytime</p>
    </div>
  </section>

  <section id="features" class="px-6 py-20 bg-[var(--qm-surface)]" data-qay-animate="slide-up">
    <div class="mx-auto max-w-6xl">
      <div class="text-center mb-16 space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--qm-accent)]" data-qm="features-eyebrow">Features</p>
        <h2 class="text-4xl font-bold tracking-tight" data-qm="features-heading">Everything you need in one place.</h2>
        <p class="text-lg text-[var(--qm-text-muted)]" data-qm="features-subtext">Powerful, flexible, and built for modern teams.</p>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        <article class="rounded-2xl border border-[var(--qm-border)] bg-white p-8 space-y-4 hover:shadow-sm transition-shadow">
          <div class="h-10 w-10 rounded-xl bg-[var(--qm-accent)] flex items-center justify-center text-white text-lg">⚡</div>
          <h3 class="text-lg font-semibold" data-qm="feature-1-title">One-click automations</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-1-desc">Connect your existing tools and automate repetitive tasks in minutes — not months. No engineering team needed.</p>
        </article>
        <article class="rounded-2xl border border-[var(--qm-border)] bg-white p-8 space-y-4 hover:shadow-sm transition-shadow">
          <div class="h-10 w-10 rounded-xl bg-[var(--qm-accent)] flex items-center justify-center text-white text-lg">📊</div>
          <h3 class="text-lg font-semibold" data-qm="feature-2-title">Real-time analytics</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-2-desc">Understand exactly where time is lost and which automations are saving you the most. Data-driven decisions made simple.</p>
        </article>
        <article class="rounded-2xl border border-[var(--qm-border)] bg-white p-8 space-y-4 hover:shadow-sm transition-shadow">
          <div class="h-10 w-10 rounded-xl bg-[var(--qm-accent)] flex items-center justify-center text-white text-lg">🔗</div>
          <h3 class="text-lg font-semibold" data-qm="feature-3-title">200+ integrations</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="feature-3-desc">Slack, Notion, HubSpot, Salesforce, Stripe — Flowmatic works with the tools your team already loves.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="px-6 py-20" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-4xl text-center space-y-8">
      <h2 class="text-4xl font-bold tracking-tight" data-qm="social-heading">Trusted by forward-thinking teams</h2>
      <div class="grid gap-5 md:grid-cols-3">
        <blockquote class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-left space-y-4">
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-1-text">"We saved 14 hours a week from day one. The setup was painless and the automations just work."</p>
          <footer class="text-xs font-semibold text-[var(--qm-text)]" data-qm="testimonial-1-author">— Amaka O., Head of Ops, Kora</footer>
        </blockquote>
        <blockquote class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-left space-y-4">
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-2-text">"Finally, a workflow tool that doesn't require a PhD to configure. Our whole team adopted it in a day."</p>
          <footer class="text-xs font-semibold text-[var(--qm-text)]" data-qm="testimonial-2-author">— James W., CTO, BuildNext</footer>
        </blockquote>
        <blockquote class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 text-left space-y-4">
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-3-text">"The ROI was immediate. I recommend Flowmatic to every founder I meet who's struggling with operations."</p>
          <footer class="text-xs font-semibold text-[var(--qm-text)]" data-qm="testimonial-3-author">— Tolu A., Founder, DataBridge</footer>
        </blockquote>
      </div>
    </div>
  </section>

  <section class="px-6 py-20 bg-[var(--qm-accent)]" data-qay-animate="fade-in">
    <div class="mx-auto max-w-3xl text-center space-y-6">
      <h2 class="text-4xl font-bold text-[var(--qm-accent-text)] tracking-tight" data-qm="cta-heading">Ready to reclaim your time?</h2>
      <p class="text-lg text-[var(--qm-accent-text)]/70" data-qm="cta-subtext">Join 12,000+ teams already using Flowmatic to move faster.</p>
      <a href="/signup" class="inline-flex rounded-xl bg-white px-8 py-4 text-sm font-semibold text-[var(--qm-accent)] hover:opacity-90 transition-opacity" data-qm="cta-button">Start free trial</a>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-6 py-10">
    <div class="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--qm-text-muted)]">
      <a href="/" class="font-bold text-[var(--qm-text)]" data-qm="footer-brand">Flowmatic</a>
      <div class="flex flex-wrap gap-6"><a href="/#features" class="hover:text-[var(--qm-text)] transition-colors">Features</a><a href="/pricing" class="hover:text-[var(--qm-text)] transition-colors">Pricing</a><a href="/about" class="hover:text-[var(--qm-text)] transition-colors">About</a><a href="/login" class="hover:text-[var(--qm-text)] transition-colors">Login</a></div>
      <p data-qm="footer-copy">© 2025 Flowmatic. All rights reserved.</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Pricing" data-qay-slug="/pricing">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-white/90 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-6xl items-center justify-between"><a href="/" class="text-base font-bold" data-qm="brand-name">Flowmatic</a><div class="flex gap-4 items-center"><a href="/login" class="text-sm text-[var(--qm-text-muted)]" data-qm="nav-login">Log in</a><a href="/signup" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)]" data-qm="nav-cta">Get started</a></div></div></nav>
  <section class="mx-auto max-w-5xl px-6 py-24" data-qay-animate="fade-in">
    <div class="text-center mb-16 space-y-4"><p class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--qm-text-muted)]" data-qm="pricing-eyebrow">Pricing</p><h1 class="text-5xl font-bold tracking-tight" data-qm="pricing-heading">Simple, transparent pricing.</h1><p class="text-lg text-[var(--qm-text-muted)]" data-qm="pricing-subtext">Start free, scale as you grow. No hidden fees.</p></div>
    <div class="grid gap-5 md:grid-cols-3">
      <article class="rounded-2xl border border-[var(--qm-border)] p-8 space-y-6"><h2 class="text-xl font-semibold" data-qm="plan-1-name">Starter</h2><p class="text-sm text-[var(--qm-text-muted)]" data-qm="plan-1-desc">For individuals and small teams getting started.</p><p class="text-5xl font-bold text-[var(--qm-text)]" data-qm="plan-1-price">$0</p><a href="/signup" class="block w-full rounded-xl border border-[var(--qm-border)] py-3 text-center text-sm font-semibold hover:bg-[var(--qm-surface)] transition-colors" data-qm="plan-1-cta">Get started free</a></article>
      <article class="rounded-2xl border-2 border-[var(--qm-accent)] bg-[var(--qm-accent)] p-8 space-y-6 text-[var(--qm-accent-text)]"><h2 class="text-xl font-semibold" data-qm="plan-2-name">Growth</h2><p class="text-sm opacity-75" data-qm="plan-2-desc">For growing teams who need more power and integrations.</p><p class="text-5xl font-bold" data-qm="plan-2-price">$49<span class="text-base font-normal opacity-75">/mo</span></p><a href="/signup" class="block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-[var(--qm-accent)] hover:opacity-90 transition-opacity" data-qm="plan-2-cta">Start free trial</a></article>
      <article class="rounded-2xl border border-[var(--qm-border)] p-8 space-y-6"><h2 class="text-xl font-semibold" data-qm="plan-3-name">Scale</h2><p class="text-sm text-[var(--qm-text-muted)]" data-qm="plan-3-desc">For enterprises needing custom workflows and SLAs.</p><p class="text-5xl font-bold" data-qm="plan-3-price">$149<span class="text-base font-normal text-[var(--qm-text-muted)]">/mo</span></p><a href="/contact" class="block w-full rounded-xl bg-[var(--qm-accent)] py-3 text-center text-sm font-semibold text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="plan-3-cta">Contact sales</a></article>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 Flowmatic</footer>
</main>
</div>
$tpl3$,
  '[{"name":"Home","slug":"/"},{"name":"Pricing","slug":"/pricing"}]'::jsonb,
  'saas', 'light-minimal',
  ARRAY['saas','software','platform','minimal','clean','light','inter','pricing','multi-page','auth','login','signup','automations','b2b','tech-startup'],
  '{"hasCms":false,"hasCommerce":false,"hasAuth":true,"hasMultiPage":true,"pageCount":2}'::jsonb,
  '{"brand-name":"Flowmatic","hero-headline":"Automate the work that slows your team down.","hero-subtext":"Flowmatic connects your tools, automates your workflows.","hero-cta-primary":"Start for free","feature-1-title":"One-click automations","plan-2-name":"Growth","plan-2-price":"$49"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/pricing","name":"Pricing","purpose":"pricing"}]'::jsonb,
  null,
  'qay', true, true, 85
),

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 4: Lagos Restaurant
-- ══════════════════════════════════════════════════════════════════════
(
  'restaurant',
  'warm',
  'Lagos Restaurant',
  $tpl4$
<style>
:root {
  --qm-bg: #fdf6ec;
  --qm-surface: #fff9f0;
  --qm-text: #2c1810;
  --qm-text-muted: #8a6a5a;
  --qm-accent: #c2601f;
  --qm-accent-text: #ffffff;
  --qm-border: rgba(44,24,16,0.1);
  --qm-heading-font: 'Playfair Display', serif;
  --qm-body-font: 'Lato', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-sm" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-2xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Ìlú Kitchen</a>
      <div class="hidden md:flex items-center gap-8 text-sm text-[var(--qm-text-muted)]">
        <a href="/menu" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-menu">Menu</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-about">Our Story</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-contact">Contact</a>
        <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] hover:opacity-90 transition-opacity" data-qm="nav-reservation">Reserve a Table</a>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text)]" data-qay-click="toggle" data-qay-target="#restaurant-mobile-menu" data-qay-class="hidden">Menu</button>
    </div>
  </nav>

  <div id="restaurant-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-5 space-y-3 md:hidden">
    <a href="/menu" class="block text-sm text-[var(--qm-text-muted)]" data-qm="mobile-nav-menu">Menu</a>
    <a href="/about" class="block text-sm text-[var(--qm-text-muted)]">Our Story</a>
    <a href="/contact" class="block text-sm font-semibold text-[var(--qm-accent)]">Reserve a Table</a>
  </div>

  <section class="relative min-h-[88vh] flex items-center" data-qay-animate="fade-in">
    <div class="absolute inset-0">
      <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=90&auto=format&fit=crop" alt="Restaurant hero" class="h-full w-full object-cover" data-qm="hero-image" />
      <div class="absolute inset-0 bg-gradient-to-r from-[var(--qm-text)]/80 to-[var(--qm-text)]/20"></div>
    </div>
    <div class="relative px-8 md:px-16 max-w-3xl space-y-6 text-[var(--qm-bg)]">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-[var(--qm-accent)] bg-[var(--qm-bg)] w-fit px-4 py-1.5 rounded-full" data-qm="hero-eyebrow">Est. 2019 · Lagos Island</p>
      <h1 class="text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[1.05] tracking-[-0.02em]" style="font-family:var(--qm-heading-font)" data-qm="hero-headline">Where Lagos Comes to Eat.</h1>
      <p class="text-xl leading-9 text-[var(--qm-bg)]/80 max-w-lg" data-qm="hero-subtext">Contemporary West African cuisine rooted in tradition. Bold flavors, warm hospitality, unforgettable experiences.</p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-sm font-bold text-white hover:opacity-90 transition-opacity" data-qm="hero-cta-reservation">Book a Table</a>
        <a href="/menu" class="rounded-full border border-[var(--qm-bg)] px-8 py-4 text-sm font-bold text-[var(--qm-bg)] hover:bg-[var(--qm-bg)] hover:text-[var(--qm-text)] transition-all" data-qm="hero-cta-menu">View Menu</a>
      </div>
    </div>
  </section>

  <section class="px-6 py-20" data-qay-animate="slide-up">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-14 space-y-3">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="menu-preview-eyebrow">Tonight's Specials</p>
        <h2 class="text-4xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="menu-preview-heading">Crafted with Intention</h2>
        <p class="text-base text-[var(--qm-text-muted)]" data-qm="menu-preview-subtext">Every dish tells a story of Nigerian heritage, reimagined for the modern palate.</p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <article class="overflow-hidden rounded-3xl bg-[var(--qm-surface)] border border-[var(--qm-border)] group">
          <div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85&auto=format&fit=crop" alt="Dish 1" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="dish-image-1" /></div>
          <div class="p-6 space-y-2"><h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="dish-name-1">Egusi Bisque</h3><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="dish-desc-1">Wild mushroom, roasted pumpkin, smoked crayfish cream. Served with puff puff croutons.</p><p class="font-bold text-[var(--qm-accent)]" data-qm="dish-price-1">₦8,500</p></div>
        </article>
        <article class="overflow-hidden rounded-3xl bg-[var(--qm-surface)] border border-[var(--qm-border)] group">
          <div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85&auto=format&fit=crop" alt="Dish 2" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="dish-image-2" /></div>
          <div class="p-6 space-y-2"><h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="dish-name-2">Suya-Spiced Ribeye</h3><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="dish-desc-2">400g dry-aged ribeye, suya rub, ofada jollof risotto, garden egg confit.</p><p class="font-bold text-[var(--qm-accent)]" data-qm="dish-price-2">₦35,000</p></div>
        </article>
        <article class="overflow-hidden rounded-3xl bg-[var(--qm-surface)] border border-[var(--qm-border)] group">
          <div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85&auto=format&fit=crop" alt="Dish 3" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="dish-image-3" /></div>
          <div class="p-6 space-y-2"><h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="dish-name-3">Pounded Yam & Oha</h3><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="dish-desc-3">Artisanal pounded yam, oha leaf soup, assorted proteins, palm oil emulsion.</p><p class="font-bold text-[var(--qm-accent)]" data-qm="dish-price-3">₦14,500</p></div>
        </article>
      </div>
      <div class="text-center mt-10"><a href="/menu" class="inline-flex rounded-full border border-[var(--qm-accent)] px-8 py-4 text-sm font-bold text-[var(--qm-accent)] hover:bg-[var(--qm-accent)] hover:text-white transition-all" data-qm="menu-see-full">See Full Menu</a></div>
    </div>
  </section>

  <section class="px-6 py-20 bg-[var(--qm-surface)]" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
      <div class="aspect-[4/5] overflow-hidden rounded-3xl"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop" alt="Restaurant interior" class="h-full w-full object-cover" data-qm="story-image" /></div>
      <div class="space-y-6">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="story-eyebrow">Our Story</p>
        <h2 class="text-4xl font-bold leading-tight" style="font-family:var(--qm-heading-font)" data-qm="story-heading">Food is Memory. Memory is Home.</h2>
        <p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="story-body">Ìlú Kitchen was born from a simple conviction: that West African cuisine deserves a seat at the global fine dining table. We cook with the same ingredients our grandmothers used, but with the techniques and intention of a world-class kitchen.</p>
        <a href="/about" class="inline-flex font-bold text-sm text-[var(--qm-accent)] hover:opacity-70 transition-opacity" data-qm="story-link">Read our full story →</a>
      </div>
    </div>
  </section>

  <section class="px-6 py-20 text-center bg-[var(--qm-accent)]" data-qay-animate="fade-in">
    <div class="mx-auto max-w-2xl space-y-6">
      <h2 class="text-4xl font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="reservation-heading">Ready for an Unforgettable Evening?</h2>
      <p class="text-lg text-white/80" data-qm="reservation-subtext">We take reservations for lunch and dinner, Tuesday through Sunday.</p>
      <a href="/contact" class="inline-flex rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--qm-accent)] hover:opacity-90 transition-opacity" data-qm="reservation-cta">Reserve Your Table</a>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-6 py-10">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--qm-text-muted)]">
      <a href="/" class="text-xl font-bold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Ìlú Kitchen</a>
      <div class="flex flex-wrap gap-6"><a href="/menu" class="hover:text-[var(--qm-text)] transition-colors">Menu</a><a href="/about" class="hover:text-[var(--qm-text)] transition-colors">Story</a><a href="/contact" class="hover:text-[var(--qm-text)] transition-colors">Reservations</a></div>
      <p data-qm="footer-copy">© 2025 Ìlú Kitchen · Lagos Island</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Menu" data-qay-slug="/menu">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-sm"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Ìlú Kitchen</a><a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-6 py-2.5 text-sm font-semibold text-white" data-qm="nav-reservation">Reserve</a></div></nav>
  <section class="mx-auto max-w-4xl px-6 py-24" data-qay-animate="fade-in">
    <div class="mb-16 space-y-3"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="menu-page-eyebrow">The Menu</p><h1 class="text-6xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="menu-page-heading">What We Cook</h1></div>
    <div class="space-y-12">
      <div><h2 class="text-2xl font-bold mb-6 border-b border-[var(--qm-border)] pb-3" style="font-family:var(--qm-heading-font)" data-qm="menu-section-starters">Starters</h2><div class="space-y-4"><div class="flex justify-between items-start gap-4"><div><h3 class="font-bold" data-qm="menu-item-1">Egusi Bisque</h3><p class="text-sm text-[var(--qm-text-muted)]" data-qm="menu-item-desc-1">Wild mushroom, roasted pumpkin, smoked crayfish cream</p></div><span class="font-bold text-[var(--qm-accent)] shrink-0" data-qm="menu-item-price-1">₦8,500</span></div><div class="flex justify-between items-start gap-4"><div><h3 class="font-bold" data-qm="menu-item-2">Boli & Epa</h3><p class="text-sm text-[var(--qm-text-muted)]" data-qm="menu-item-desc-2">Roasted plantain, peanut sauce, chilli oil</p></div><span class="font-bold text-[var(--qm-accent)] shrink-0" data-qm="menu-item-price-2">₦6,000</span></div></div></div>
      <div><h2 class="text-2xl font-bold mb-6 border-b border-[var(--qm-border)] pb-3" style="font-family:var(--qm-heading-font)" data-qm="menu-section-mains">Main Courses</h2><div class="space-y-4"><div class="flex justify-between items-start gap-4"><div><h3 class="font-bold" data-qm="menu-item-3">Suya-Spiced Ribeye</h3><p class="text-sm text-[var(--qm-text-muted)]" data-qm="menu-item-desc-3">400g dry-aged ribeye, ofada jollof risotto, garden egg confit</p></div><span class="font-bold text-[var(--qm-accent)] shrink-0" data-qm="menu-item-price-3">₦35,000</span></div><div class="flex justify-between items-start gap-4"><div><h3 class="font-bold" data-qm="menu-item-4">Pounded Yam & Oha</h3><p class="text-sm text-[var(--qm-text-muted)]" data-qm="menu-item-desc-4">Artisanal pounded yam, oha leaf soup, assorted proteins</p></div><span class="font-bold text-[var(--qm-accent)] shrink-0" data-qm="menu-item-price-4">₦14,500</span></div></div></div>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 Ìlú Kitchen</footer>
</main>
</div>

<div data-qay-page="Contact" data-qay-slug="/contact">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-sm"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Ìlú Kitchen</a></div></nav>
  <section class="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center" data-qay-animate="fade-in">
    <div class="space-y-6"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="contact-eyebrow">Reservations & Enquiries</p><h1 class="text-5xl font-bold leading-tight" style="font-family:var(--qm-heading-font)" data-qm="contact-heading">Join Us for Dinner.</h1><p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="contact-body">We serve lunch and dinner Tuesday–Sunday. Private dining rooms available for events of 10–50 guests.</p><div class="space-y-2 text-sm text-[var(--qm-text-muted)]"><p data-qm="contact-address">12 Adeola Odeku Street, Victoria Island, Lagos</p><p data-qm="contact-hours">Tues–Sun: 12pm–3pm · 6pm–11pm</p><p data-qm="contact-phone">+234 (0) 803 ILU-KITCHEN</p></div></div>
    <form class="space-y-4 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Full name" class="w-full rounded-xl border border-[var(--qm-border)] bg-white px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="email" type="email" placeholder="Email address" class="w-full rounded-xl border border-[var(--qm-border)] bg-white px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="date" type="date" class="w-full rounded-xl border border-[var(--qm-border)] bg-white px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><select name="guests" class="w-full rounded-xl border border-[var(--qm-border)] bg-white px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors"><option value="">Number of guests</option><option>1–2</option><option>3–4</option><option>5–8</option><option>9+</option></select><textarea name="notes" rows="3" placeholder="Dietary requirements or special requests" class="w-full rounded-xl border border-[var(--qm-border)] bg-white px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors resize-none"></textarea><button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity" data-qm="contact-submit">Request Reservation</button></form>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 Ìlú Kitchen · Lagos Island</footer>
</main>
</div>
$tpl4$,
  '[{"name":"Home","slug":"/"},{"name":"Menu","slug":"/menu"},{"name":"Contact","slug":"/contact"}]'::jsonb,
  'restaurant', 'warm-classic',
  ARRAY['restaurant','food','menu','dining','nigerian','west-african','afro','lagos','warm','playfair','serif','multi-page','reservation','cuisine','elegant'],
  '{"hasCms":false,"hasCommerce":false,"hasAuth":false,"hasMultiPage":true,"pageCount":3}'::jsonb,
  '{"brand-name":"Ìlú Kitchen","hero-eyebrow":"Est. 2019 · Lagos Island","hero-headline":"Where Lagos Comes to Eat.","hero-subtext":"Contemporary West African cuisine rooted in tradition.","hero-cta-reservation":"Book a Table","dish-name-1":"Egusi Bisque","dish-price-1":"₦8,500"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/menu","name":"Menu","purpose":"menu"},{"slug":"/contact","name":"Contact","purpose":"contact"}]'::jsonb,
  '{"collectionType":"menu items","sampleItems":[{"title":"Egusi Bisque","subtitle":"Wild mushroom, smoked crayfish","price":"₦8,500"},{"title":"Suya-Spiced Ribeye","subtitle":"400g dry-aged, ofada jollof","price":"₦35,000"},{"title":"Pounded Yam & Oha","subtitle":"Artisanal pounded yam, assorted proteins","price":"₦14,500"},{"title":"Boli & Epa","subtitle":"Roasted plantain, peanut sauce","price":"₦6,000"}]}'::jsonb,
  'qay', true, true, 83
);
