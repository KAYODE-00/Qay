CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_ai_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_type TEXT NOT NULL,
  theme TEXT NOT NULL,
  label TEXT NOT NULL,
  html TEXT NOT NULL,
  pages JSONB NOT NULL DEFAULT '[]',
  preview_image_url TEXT,
  css_vars JSONB NOT NULL DEFAULT '{}',
  default_fonts JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_qay_ai_templates_unique_seed
  ON qay_ai_templates(site_type, theme, label);

CREATE INDEX IF NOT EXISTS idx_qay_ai_templates_type
  ON qay_ai_templates(site_type, theme, rank DESC);

-- Seed QAY AI templates used by the template-first AI builder.
-- Safe to run more than once.

-- TEMPLATE 1: Dark Luxury Ecommerce
INSERT INTO qay_ai_templates (site_type, theme, label, rank, pages, html) VALUES (
'ecommerce', 'dark-luxury', 'Dark Luxury Store', 100,
'[{"name":"Home","slug":"/"},{"name":"Shop","slug":"shop"},{"name":"About","slug":"about"},{"name":"Contact","slug":"contact"}]',
$HTML$<div data-qay-page="Home" data-qay-slug="/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root {
  --qm-bg: #0a0905;
  --qm-surface: #14120d;
  --qm-text: #f5ede0;
  --qm-text-muted: #9b8a75;
  --qm-accent: #c9a84c;
  --qm-accent-text: #0a0905;
  --qm-border: rgba(201,168,76,0.12);
  --qm-heading-font: 'Cormorant Garamond', serif;
  --qm-body-font: 'DM Sans', sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--qm-bg);color:var(--qm-text);font-family:var(--qm-body-font);-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{font-family:var(--qm-heading-font)}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
</style>

<!-- NAV -->
<nav style="position:sticky;top:0;z-index:50;background:rgba(10,9,5,0.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--qm-border);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between" data-qay-animate="fade-in">
  <div style="display:flex;gap:32px;align-items:center">
    <a href="/shop" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted)">Collection</a>
    <a href="/about" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted)">Atelier</a>
  </div>
  <a href="/" style="font-family:var(--qm-heading-font);font-size:24px;font-weight:400;letter-spacing:0.15em;color:var(--qm-text)" data-qm="brand-name">ARYKTEEMAH</a>
  <div style="display:flex;align-items:center;gap:24px">
    <a href="/contact" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted)">Contact</a>
    <button data-qay-commerce="cart-button" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-accent);background:none;border:1px solid var(--qm-border);padding:8px 20px;cursor:pointer;font-family:var(--qm-body-font)">
      Bag (<span data-qay-commerce="cart-count">0</span>)
    </button>
  </div>
  <button style="display:none" data-qay-click="toggle" data-qay-target="#mob-nav" data-qay-class="hidden" aria-label="Menu">
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none"><rect width="22" height="1.5" fill="var(--qm-text)"/><rect y="6" width="16" height="1.5" fill="var(--qm-text)"/><rect y="12" width="22" height="1.5" fill="var(--qm-text)"/></svg>
  </button>
</nav>
<div id="mob-nav" class="hidden" style="background:var(--qm-bg);border-bottom:1px solid var(--qm-border);display:flex;flex-direction:column">
  <a href="/shop" style="padding:16px 24px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted);border-bottom:1px solid var(--qm-border)">Collection</a>
  <a href="/about" style="padding:16px 24px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted);border-bottom:1px solid var(--qm-border)">Atelier</a>
  <a href="/contact" style="padding:16px 24px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted)">Contact</a>
</div>
<aside data-qay-commerce="cart-drawer" style="display:none;position:fixed;right:0;top:0;bottom:0;width:380px;max-width:calc(100vw - 40px);background:var(--qm-surface);border-left:1px solid var(--qm-border);z-index:200;flex-direction:column">
  <div style="padding:20px 24px;border-bottom:1px solid var(--qm-border);display:flex;justify-content:space-between;align-items:center">
    <h2 style="font-family:var(--qm-heading-font);font-size:20px;font-weight:400" data-qm="cart-title">Your Bag</h2>
    <button data-qay-commerce="cart-close" style="background:none;border:none;cursor:pointer;font-size:22px;color:var(--qm-text-muted)">Ã—</button>
  </div>
  <div data-qay-commerce="cart-items" style="flex:1;overflow-y:auto;padding:20px 24px;font-size:14px;color:var(--qm-text-muted)">Your bag is empty.</div>
  <div style="padding:20px 24px;border-top:1px solid var(--qm-border)">
    <button data-qay-commerce="checkout-button" style="width:100%;padding:16px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;border:none;cursor:pointer;font-family:var(--qm-body-font)">Proceed to Checkout</button>
  </div>
</aside>

<!-- HERO -->
<section style="min-height:92vh;position:relative;overflow:hidden;display:flex;align-items:flex-end" data-qay-animate="fade-in">
  <div style="position:absolute;inset:0" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=85&auto=format&fit=crop" alt="Luxury fragrance" style="width:100%;height:100%;object-fit:cover" data-qm="hero-image"/>
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,9,5,0.85) 0%,rgba(10,9,5,0.2) 60%,transparent 100%)"></div>
  </div>
  <div style="position:relative;z-index:2;padding:80px 40px;width:100%;max-width:800px" data-qay-animate="slide-up" data-qay-duration="1.0" data-qay-ease="expo.out">
    <p style="font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:var(--qm-accent);margin-bottom:20px" data-qm="hero-eyebrow">New Collection 2026</p>
    <h1 style="font-size:clamp(52px,7vw,100px);font-weight:300;line-height:0.95;letter-spacing:-0.01em;color:var(--qm-text);margin-bottom:28px" data-qm="hero-title">Rare<br/><em>Fragrance</em><br/>Reborn.</h1>
    <p style="font-size:16px;line-height:1.7;color:rgba(245,237,224,0.65);max-width:460px;margin-bottom:40px" data-qm="hero-subtitle">Crafted from rare ingredients sourced across three continents. For those who understand that true luxury whispers.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <a href="/shop" style="padding:16px 40px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:11px;letter-spacing:0.25em;text-transform:uppercase" data-qm="hero-cta" data-qay-hover="scale-btn">Discover Collection</a>
      <a href="/about" style="padding:16px 40px;border:1px solid rgba(245,237,224,0.2);color:var(--qm-text);font-size:11px;letter-spacing:0.25em;text-transform:uppercase" data-qm="hero-cta-secondary">Our Story</a>
    </div>
  </div>
</section>

<!-- PRODUCTS -->
<section style="background:var(--qm-bg);padding:100px 40px" data-qay-animate="scroll-reveal">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:56px">
    <div>
      <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:var(--qm-accent);margin-bottom:8px" data-qm="products-eyebrow">The Edit</p>
      <h2 style="font-size:clamp(32px,4vw,56px);font-weight:300;color:var(--qm-text)" data-qm="products-title">Featured Pieces</h2>
    </div>
    <a href="/shop" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted)" data-qm="products-view-all">View All</a>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:2px" data-qay-animate="stagger-children">
    <article data-qay-commerce="product-card" data-qay-product-id="product-1" data-qay-product-handle="oud-noir" data-qay-variant-id="variant-1">
      <div style="overflow:hidden;position:relative;aspect-ratio:3/4;background:var(--qm-surface)" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=85&auto=format&fit=crop" alt="Oud Noir" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-1"/>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:16px;opacity:0;transition:opacity 0.3s;background:linear-gradient(to top,rgba(10,9,5,0.8),transparent)">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-1" style="width:100%;padding:11px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;border:none;cursor:pointer">Add to Bag</button>
        </div>
      </div>
      <div style="padding:16px 0">
        <h3 data-qay-commerce="product-title" style="font-size:16px;font-weight:400;color:var(--qm-text);margin-bottom:4px" data-qm="product-title-1">Oud Noir</h3>
        <p data-qay-commerce="product-description" style="font-size:12px;color:var(--qm-text-muted);margin-bottom:6px" data-qm="product-desc-1">Dark wood, rose absolute, amber</p>
        <span data-qay-commerce="product-price" style="font-size:14px;color:var(--qm-accent)" data-qm="product-price-1">$285</span>
      </div>
    </article>
    <article data-qay-commerce="product-card" data-qay-product-id="product-2" data-qay-product-handle="rose-absolue" data-qay-variant-id="variant-2">
      <div style="overflow:hidden;position:relative;aspect-ratio:3/4;background:var(--qm-surface)" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=85&auto=format&fit=crop" alt="Rose Absolue" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-2"/>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:16px;opacity:0;transition:opacity 0.3s;background:linear-gradient(to top,rgba(10,9,5,0.8),transparent)">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-2" style="width:100%;padding:11px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;border:none;cursor:pointer">Add to Bag</button>
        </div>
      </div>
      <div style="padding:16px 0">
        <h3 data-qay-commerce="product-title" style="font-size:16px;font-weight:400;color:var(--qm-text);margin-bottom:4px" data-qm="product-title-2">Rose Absolue</h3>
        <p data-qay-commerce="product-description" style="font-size:12px;color:var(--qm-text-muted);margin-bottom:6px" data-qm="product-desc-2">Bulgarian rose, iris, sandalwood</p>
        <span data-qay-commerce="product-price" style="font-size:14px;color:var(--qm-accent)" data-qm="product-price-2">$320</span>
      </div>
    </article>
    <article data-qay-commerce="product-card" data-qay-product-id="product-3" data-qay-product-handle="blanc-ether" data-qay-variant-id="variant-3">
      <div style="overflow:hidden;position:relative;aspect-ratio:3/4;background:var(--qm-surface)" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=85&auto=format&fit=crop" alt="Blanc Ether" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-3"/>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:16px;opacity:0;transition:opacity 0.3s;background:linear-gradient(to top,rgba(10,9,5,0.8),transparent)">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-3" style="width:100%;padding:11px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;border:none;cursor:pointer">Add to Bag</button>
        </div>
      </div>
      <div style="padding:16px 0">
        <h3 data-qay-commerce="product-title" style="font-size:16px;font-weight:400;color:var(--qm-text);margin-bottom:4px" data-qm="product-title-3">Blanc Ã‰ther</h3>
        <p data-qay-commerce="product-description" style="font-size:12px;color:var(--qm-text-muted);margin-bottom:6px" data-qm="product-desc-3">White musk, cedar, bergamot</p>
        <span data-qay-commerce="product-price" style="font-size:14px;color:var(--qm-accent)" data-qm="product-price-3">$265</span>
      </div>
    </article>
    <article data-qay-commerce="product-card" data-qay-product-id="product-4" data-qay-product-handle="encens-sacre" data-qay-variant-id="variant-4">
      <div style="overflow:hidden;position:relative;aspect-ratio:3/4;background:var(--qm-surface)" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=85&auto=format&fit=crop" alt="Encens SacrÃ©" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-4"/>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:16px;opacity:0;transition:opacity 0.3s;background:linear-gradient(to top,rgba(10,9,5,0.8),transparent)">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-4" style="width:100%;padding:11px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;border:none;cursor:pointer">Add to Bag</button>
        </div>
      </div>
      <div style="padding:16px 0">
        <h3 data-qay-commerce="product-title" style="font-size:16px;font-weight:400;color:var(--qm-text);margin-bottom:4px" data-qm="product-title-4">Encens SacrÃ©</h3>
        <p data-qay-commerce="product-description" style="font-size:12px;color:var(--qm-text-muted);margin-bottom:6px" data-qm="product-desc-4">Frankincense, vetiver, patchouli</p>
        <span data-qay-commerce="product-price" style="font-size:14px;color:var(--qm-accent)" data-qm="product-price-4">$310</span>
      </div>
    </article>
  </div>
</section>

<!-- BRAND STORY -->
<section style="background:var(--qm-surface);display:grid;grid-template-columns:1fr 1fr;min-height:60vh" data-qay-animate="scroll-reveal">
  <div style="overflow:hidden" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format&fit=crop" alt="Atelier" style="width:100%;height:100%;object-fit:cover" data-qm="about-image"/>
  </div>
  <div style="display:flex;flex-direction:column;justify-content:center;padding:80px 60px" data-qay-animate="slide-right" data-qay-duration="0.9">
    <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:var(--qm-accent);margin-bottom:24px" data-qm="about-eyebrow">The Atelier</p>
    <h2 style="font-size:clamp(28px,3.5vw,48px);font-weight:300;line-height:1.2;color:var(--qm-text);margin-bottom:24px" data-qm="about-title">Crafted with<br/><em>rare intention.</em></h2>
    <div style="width:40px;height:1px;background:var(--qm-accent);margin-bottom:28px"></div>
    <p style="font-size:15px;line-height:1.85;color:var(--qm-text-muted);margin-bottom:40px" data-qm="about-text">Every fragrance begins as an obsession. We source only what cannot be found in mainstream perfumery â€” ingredients that carry history, culture, and meaning. The result is scent that tells a story only you can finish.</p>
    <a href="/about" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-accent);display:inline-flex;align-items:center;gap:12px" data-qm="about-cta">
      Read Our Story <span style="display:block;width:32px;height:1px;background:var(--qm-accent)"></span>
    </a>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:var(--qm-bg);border-top:1px solid var(--qm-border);padding:60px 40px 32px">
  <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:40px;margin-bottom:48px">
    <div>
      <h3 style="font-size:20px;font-weight:400;letter-spacing:0.1em;color:var(--qm-text);margin-bottom:16px" data-qm="footer-brand">ARYKTEEMAH</h3>
      <p style="font-size:13px;line-height:1.7;color:var(--qm-text-muted);max-width:280px" data-qm="footer-tagline">Rare fragrance for those who understand that true luxury whispers.</p>
    </div>
    <div>
      <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--qm-text-muted);margin-bottom:16px">Shop</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="/shop" style="font-size:13px;color:var(--qm-text)">All Fragrances</a>
        <a href="/shop" style="font-size:13px;color:var(--qm-text)">Collections</a>
        <a href="/shop" style="font-size:13px;color:var(--qm-text)">Gift Sets</a>
      </div>
    </div>
    <div>
      <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--qm-text-muted);margin-bottom:16px">Help</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="/shipping" style="font-size:13px;color:var(--qm-text)">Shipping</a>
        <a href="/returns" style="font-size:13px;color:var(--qm-text)">Returns</a>
        <a href="/contact" style="font-size:13px;color:var(--qm-text)">Contact</a>
      </div>
    </div>
    <div>
      <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--qm-text-muted);margin-bottom:16px" data-qm="footer-newsletter-label">The Inner Circle</p>
      <div style="display:flex;border-bottom:1px solid var(--qm-text-muted)">
        <input type="email" placeholder="Your email" style="flex:1;background:none;border:none;outline:none;font-size:13px;padding:8px 0;color:var(--qm-text);font-family:var(--qm-body-font)"/>
        <button style="background:none;border:none;cursor:pointer;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-accent);padding:8px 0">Join</button>
      </div>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:28px;border-top:1px solid var(--qm-border)">
    <p style="font-size:11px;color:var(--qm-text-muted)" data-qm="footer-copyright">&copy; 2026 Arykteemah. All rights reserved.</p>
    <div style="display:flex;gap:20px">
      <a href="#" style="font-size:11px;color:var(--qm-text-muted)">Privacy</a>
      <a href="#" style="font-size:11px;color:var(--qm-text-muted)">Terms</a>
    </div>
  </div>
</footer>
</div>$HTML$
) 
ON CONFLICT (site_type, theme, label) DO UPDATE SET
  rank = EXCLUDED.rank,
  pages = EXCLUDED.pages,
  html = EXCLUDED.html,
  is_active = true;

-- TEMPLATE 2: Bold Streetwear Ecommerce
INSERT INTO qay_ai_templates (site_type, theme, label, rank, pages, html) VALUES (
'ecommerce', 'dark-bold', 'Bold Streetwear Store', 98,
'[{"name":"Home","slug":"/"},{"name":"Shop","slug":"shop"},{"name":"About","slug":"about"}]',
$HTML$<div data-qay-page="Home" data-qay-slug="/">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --qm-bg: #000000;
  --qm-surface: #0f0f0f;
  --qm-text: #ffffff;
  --qm-text-muted: #888888;
  --qm-accent: #39ff14;
  --qm-accent-text: #000000;
  --qm-border: rgba(255,255,255,0.08);
  --qm-heading-font: 'Bebas Neue', sans-serif;
  --qm-body-font: 'Barlow', sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--qm-bg);color:var(--qm-text);font-family:var(--qm-body-font);-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{font-family:var(--qm-heading-font)}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
</style>

<!-- ANNOUNCEMENT BAR -->
<div style="background:var(--qm-accent);color:var(--qm-accent-text);text-align:center;padding:10px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase" data-qm="announcement">Free shipping on orders over $100 â€” Drop live now</div>

<!-- NAV -->
<nav style="background:var(--qm-bg);border-bottom:1px solid var(--qm-border);padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50">
  <a href="/" style="font-family:var(--qm-heading-font);font-size:28px;letter-spacing:0.05em;color:var(--qm-text)" data-qm="brand-name">BADDO WORLD</a>
  <div style="display:flex;gap:32px;align-items:center">
    <a href="/shop" style="font-size:13px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:var(--qm-text-muted)">Shop</a>
    <a href="/collections" style="font-size:13px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:var(--qm-text-muted)">Lookbook</a>
    <a href="/about" style="font-size:13px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:var(--qm-text-muted)">About</a>
    <button data-qay-commerce="cart-button" style="background:var(--qm-accent);color:var(--qm-accent-text);border:none;padding:8px 20px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;font-family:var(--qm-body-font)">
      Cart (<span data-qay-commerce="cart-count">0</span>)
    </button>
  </div>
</nav>
<aside data-qay-commerce="cart-drawer" style="display:none;position:fixed;right:0;top:0;bottom:0;width:380px;background:var(--qm-surface);border-left:1px solid var(--qm-border);z-index:200;flex-direction:column">
  <div style="padding:20px;border-bottom:1px solid var(--qm-border);display:flex;justify-content:space-between">
    <span style="font-family:var(--qm-heading-font);font-size:24px">CART</span>
    <button data-qay-commerce="cart-close" style="background:none;border:none;cursor:pointer;font-size:24px;color:var(--qm-text-muted)">Ã—</button>
  </div>
  <div data-qay-commerce="cart-items" style="flex:1;padding:20px;font-size:14px;color:var(--qm-text-muted)">Your cart is empty.</div>
  <div style="padding:20px;border-top:1px solid var(--qm-border)">
    <button data-qay-commerce="checkout-button" style="width:100%;padding:16px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:none;cursor:pointer;font-family:var(--qm-body-font)">Checkout</button>
  </div>
</aside>

<!-- HERO -->
<section style="min-height:90vh;position:relative;overflow:hidden;display:flex;align-items:center" data-qay-animate="fade-in">
  <div style="position:absolute;right:0;top:0;width:55%;height:100%;clip-path:polygon(12% 0,100% 0,100% 100%,0% 100%)" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85&auto=format&fit=crop" alt="Streetwear" style="width:100%;height:100%;object-fit:cover" data-qm="hero-image"/>
    <div style="position:absolute;inset:0;background:linear-gradient(to right,var(--qm-bg) 0%,transparent 35%)"></div>
  </div>
  <div style="position:relative;z-index:2;padding:60px 40px;max-width:680px" data-qay-animate="slide-up" data-qay-duration="0.8">
    <div style="display:inline-flex;align-items:center;gap:8px;background:var(--qm-accent);color:var(--qm-accent-text);padding:7px 16px;margin-bottom:24px">
      <span style="width:7px;height:7px;border-radius:50%;background:var(--qm-accent-text)"></span>
      <span style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase" data-qm="hero-badge">SS26 Drop â€” Live Now</span>
    </div>
    <h1 style="font-size:clamp(72px,11vw,148px);line-height:0.88;letter-spacing:0.02em;color:var(--qm-text);text-transform:uppercase;margin-bottom:24px" data-qm="hero-title">WEAR THE<br/>CULTURE.</h1>
    <p style="font-size:16px;line-height:1.6;color:var(--qm-text-muted);max-width:400px;margin-bottom:40px" data-qm="hero-subtitle">Own the streets. Represent your world. Designed for those who move different and dress the part.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a href="/shop" style="padding:18px 48px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase" data-qm="hero-cta" data-qay-hover="scale-btn">Shop Now</a>
      <a href="/collections" style="padding:18px 48px;border:2px solid var(--qm-text);color:var(--qm-text);font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase" data-qm="hero-cta-secondary">Lookbook</a>
    </div>
    <div style="display:flex;gap:40px;margin-top:56px;padding-top:32px;border-top:1px solid var(--qm-border)">
      <div><p style="font-size:36px;font-family:var(--qm-heading-font);letter-spacing:0.05em" data-qm="stat-1">15K+</p><p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--qm-text-muted)" data-qm="stat-1-label">Customers</p></div>
      <div><p style="font-size:36px;font-family:var(--qm-heading-font);letter-spacing:0.05em" data-qm="stat-2">48H</p><p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--qm-text-muted)" data-qm="stat-2-label">Delivery</p></div>
      <div><p style="font-size:36px;font-family:var(--qm-heading-font);letter-spacing:0.05em" data-qm="stat-3">100%</p><p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--qm-text-muted)" data-qm="stat-3-label">Authentic</p></div>
    </div>
  </div>
</section>

<!-- PRODUCTS -->
<section style="background:var(--qm-bg);padding:80px 32px" data-qay-animate="scroll-reveal">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:40px">
    <h2 style="font-size:clamp(40px,6vw,80px);letter-spacing:0.03em;text-transform:uppercase" data-qm="products-title">New Drops</h2>
    <a href="/shop" style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-accent)" data-qm="products-view-all">View All â†’</a>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1px;background:var(--qm-border)" data-qay-animate="stagger-children">
    <article data-qay-commerce="product-card" data-qay-product-id="product-1" data-qay-product-handle="hoodie-001" data-qay-variant-id="variant-1" style="background:var(--qm-bg)">
      <div style="overflow:hidden;position:relative;aspect-ratio:4/5" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=85&auto=format&fit=crop" alt="Hoodie" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-1"/>
        <div style="position:absolute;top:12px;left:12px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px" data-qm="product-badge-1">New</div>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);opacity:0;transition:opacity 0.25s;display:flex;align-items:center;justify-content:center">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-1" style="padding:14px 32px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:none;cursor:pointer">Add to Cart</button>
        </div>
      </div>
      <div style="padding:16px">
        <h3 data-qay-commerce="product-title" style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px" data-qm="product-title-1">Oversized Hood</h3>
        <span data-qay-commerce="product-price" style="font-size:15px;font-weight:600;color:var(--qm-accent)" data-qm="product-price-1">$85</span>
      </div>
    </article>
    <article data-qay-commerce="product-card" data-qay-product-id="product-2" data-qay-product-handle="tee-002" data-qay-variant-id="variant-2" style="background:var(--qm-bg)">
      <div style="overflow:hidden;position:relative;aspect-ratio:4/5" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=85&auto=format&fit=crop" alt="Tee" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-2"/>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);opacity:0;transition:opacity 0.25s;display:flex;align-items:center;justify-content:center">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-2" style="padding:14px 32px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:none;cursor:pointer">Add to Cart</button>
        </div>
      </div>
      <div style="padding:16px">
        <h3 data-qay-commerce="product-title" style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px" data-qm="product-title-2">Logo Tee</h3>
        <span data-qay-commerce="product-price" style="font-size:15px;font-weight:600;color:var(--qm-accent)" data-qm="product-price-2">$45</span>
      </div>
    </article>
    <article data-qay-commerce="product-card" data-qay-product-id="product-3" data-qay-product-handle="jogger-003" data-qay-variant-id="variant-3" style="background:var(--qm-bg)">
      <div style="overflow:hidden;position:relative;aspect-ratio:4/5" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85&auto=format&fit=crop" alt="Jogger" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-3"/>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);opacity:0;transition:opacity 0.25s;display:flex;align-items:center;justify-content:center">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-3" style="padding:14px 32px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:none;cursor:pointer">Add to Cart</button>
        </div>
      </div>
      <div style="padding:16px">
        <h3 data-qay-commerce="product-title" style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px" data-qm="product-title-3">Cargo Jogger</h3>
        <span data-qay-commerce="product-price" style="font-size:15px;font-weight:600;color:var(--qm-accent)" data-qm="product-price-3">$95</span>
      </div>
    </article>
    <article data-qay-commerce="product-card" data-qay-product-id="product-4" data-qay-product-handle="cap-004" data-qay-variant-id="variant-4" style="background:var(--qm-bg)">
      <div style="overflow:hidden;position:relative;aspect-ratio:4/5" data-qay-hover="img-zoom">
        <img data-qay-commerce="product-image" src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=85&auto=format&fit=crop" alt="Cap" style="width:100%;height:100%;object-fit:cover" data-qm="product-image-4"/>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);opacity:0;transition:opacity 0.25s;display:flex;align-items:center;justify-content:center">
          <button data-qay-commerce="add-to-cart" data-qay-product-id="product-4" style="padding:14px 32px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:none;cursor:pointer">Add to Cart</button>
        </div>
      </div>
      <div style="padding:16px">
        <h3 data-qay-commerce="product-title" style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px" data-qm="product-title-4">5-Panel Cap</h3>
        <span data-qay-commerce="product-price" style="font-size:15px;font-weight:600;color:var(--qm-accent)" data-qm="product-price-4">$35</span>
      </div>
    </article>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:var(--qm-text);color:var(--qm-bg);padding:80px 32px 32px">
  <div style="text-align:center;padding-bottom:60px;border-bottom:1px solid rgba(0,0,0,0.15)">
    <h2 style="font-size:clamp(48px,9vw,120px);letter-spacing:0.02em;text-transform:uppercase;line-height:0.9;margin-bottom:32px" data-qm="footer-cta-title">JOIN THE MOVEMENT.</h2>
    <a href="/shop" style="display:inline-block;padding:18px 48px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase" data-qm="footer-cta">Shop All Drops</a>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:32px">
    <p style="font-size:14px;font-family:var(--qm-heading-font);letter-spacing:0.08em" data-qm="footer-brand">BADDO WORLD</p>
    <p style="font-size:11px;opacity:0.5" data-qm="footer-copyright">&copy; 2026 All rights reserved.</p>
    <div style="display:flex;gap:20px">
      <a href="#" style="font-size:11px;opacity:0.5">IG</a>
      <a href="#" style="font-size:11px;opacity:0.5">TK</a>
      <a href="#" style="font-size:11px;opacity:0.5">ð•</a>
    </div>
  </div>
</footer>
</div>$HTML$
) 
ON CONFLICT (site_type, theme, label) DO UPDATE SET
  rank = EXCLUDED.rank,
  pages = EXCLUDED.pages,
  html = EXCLUDED.html,
  is_active = true;

-- TEMPLATE 3: Warm Nigerian Restaurant
INSERT INTO qay_ai_templates (site_type, theme, label, rank, pages, html) VALUES (
'restaurant', 'warm-classic', 'Warm Nigerian Restaurant', 100,
'[{"name":"Home","slug":"/"},{"name":"Menu","slug":"menu"},{"name":"About","slug":"about"},{"name":"Contact","slug":"contact"}]',
$HTML$<div data-qay-page="Home" data-qay-slug="/">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
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
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--qm-bg);color:var(--qm-text);font-family:var(--qm-body-font);-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{font-family:var(--qm-heading-font)}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
</style>

<!-- NAV -->
<nav style="background:var(--qm-bg);border-bottom:1px solid var(--qm-border);position:sticky;top:0;z-index:50">
  <div style="padding:0 40px">
    <div style="display:flex;align-items:center;justify-content:center;padding:12px 0;border-bottom:1px solid var(--qm-border)">
      <a href="/" style="font-family:var(--qm-heading-font);font-size:28px;font-weight:700;letter-spacing:0.05em;color:var(--qm-text)" data-qm="brand-name">Mama Titi's Kitchen</a>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:40px;padding:12px 0">
      <a href="/menu" style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-text-muted)">Menu</a>
      <a href="/about" style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-text-muted)">Our Story</a>
      <a href="/contact" style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-text-muted)">Find Us</a>
      <a href="/contact" style="padding:8px 24px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:11px;letter-spacing:0.15em;text-transform:uppercase" data-qm="nav-cta">Reserve a Table</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section style="min-height:88vh;position:relative;overflow:hidden;display:flex;align-items:center" data-qay-animate="fade-in">
  <div style="position:absolute;inset:0" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=85&auto=format&fit=crop" alt="Nigerian cuisine" style="width:100%;height:100%;object-fit:cover" data-qm="hero-image"/>
    <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(44,24,16,0.88) 0%,rgba(44,24,16,0.4) 60%,transparent 100%)"></div>
  </div>
  <div style="position:relative;z-index:2;padding:80px 60px;max-width:680px" data-qay-animate="slide-up" data-qay-duration="1.0">
    <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:var(--qm-accent);margin-bottom:20px" data-qm="hero-eyebrow">Authentic Nigerian Cuisine Â· Victoria Island</p>
    <h1 style="font-size:clamp(48px,6vw,84px);font-weight:400;line-height:1.05;color:#fdf6ec;margin-bottom:24px" data-qm="hero-title">The taste of<br/><em>home,</em><br/>elevated.</h1>
    <p style="font-size:16px;line-height:1.75;color:rgba(253,246,236,0.75);max-width:440px;margin-bottom:40px" data-qm="hero-subtitle">Rooted in West African tradition, crafted for the modern Lagos table. Every dish tells a story of heritage, family, and fire.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <a href="/contact" style="padding:16px 40px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:12px;letter-spacing:0.2em;text-transform:uppercase" data-qm="hero-cta" data-qay-hover="scale-btn">Book a Table</a>
      <a href="/menu" style="padding:16px 40px;border:1px solid rgba(253,246,236,0.3);color:#fdf6ec;font-size:12px;letter-spacing:0.2em;text-transform:uppercase" data-qm="hero-cta-secondary">View Menu</a>
    </div>
    <div style="display:flex;gap:40px;margin-top:48px">
      <div><p style="font-size:32px;font-weight:700;color:#fdf6ec" data-qm="stat-1">37</p><p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(253,246,236,0.6)" data-qm="stat-1-label">Years Open</p></div>
      <div><p style="font-size:32px;font-weight:700;color:#fdf6ec" data-qm="stat-2">24</p><p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(253,246,236,0.6)" data-qm="stat-2-label">Signature Dishes</p></div>
      <div><p style="font-size:32px;font-weight:700;color:#fdf6ec" data-qm="stat-3">4.9</p><p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(253,246,236,0.6)" data-qm="stat-3-label">Rating</p></div>
    </div>
  </div>
</section>

<!-- FEATURED DISHES -->
<section style="background:var(--qm-bg);padding:100px 40px" data-qay-animate="scroll-reveal">
  <div style="text-align:center;margin-bottom:60px">
    <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:var(--qm-accent);margin-bottom:12px" data-qm="menu-eyebrow">Our Signatures</p>
    <h2 style="font-size:clamp(36px,5vw,60px);font-weight:400;color:var(--qm-text)" data-qm="menu-title">What We're Known For</h2>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:32px" data-qay-animate="stagger-children">
    <div style="background:var(--qm-surface);border:1px solid var(--qm-border)" data-qay-hover="luxe-lift">
      <div style="overflow:hidden;aspect-ratio:4/3" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=85&auto=format&fit=crop" alt="Jollof Rice" style="width:100%;height:100%;object-fit:cover" data-qm="dish-image-1"/>
      </div>
      <div style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <h3 style="font-size:20px;font-weight:400" data-qm="dish-title-1">Party Jollof Rice</h3>
          <span style="font-size:15px;color:var(--qm-accent);font-weight:700" data-qm="dish-price-1">â‚¦3,500</span>
        </div>
        <p style="font-size:13px;color:var(--qm-text-muted);line-height:1.65" data-qm="dish-desc-1">Slow-cooked over firewood with tomatoes, peppers, and our secret spice blend. The dish that started it all.</p>
      </div>
    </div>
    <div style="background:var(--qm-surface);border:1px solid var(--qm-border)" data-qay-hover="luxe-lift">
      <div style="overflow:hidden;aspect-ratio:4/3" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=85&auto=format&fit=crop" alt="Egusi Soup" style="width:100%;height:100%;object-fit:cover" data-qm="dish-image-2"/>
      </div>
      <div style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <h3 style="font-size:20px;font-weight:400" data-qm="dish-title-2">Egusi Soup</h3>
          <span style="font-size:15px;color:var(--qm-accent);font-weight:700" data-qm="dish-price-2">â‚¦4,200</span>
        </div>
        <p style="font-size:13px;color:var(--qm-text-muted);line-height:1.65" data-qm="dish-desc-2">Ground melon seeds in a rich palm oil base with assorted meats and stockfish. Grandmother's recipe, unchanged.</p>
      </div>
    </div>
    <div style="background:var(--qm-surface);border:1px solid var(--qm-border)" data-qay-hover="luxe-lift">
      <div style="overflow:hidden;aspect-ratio:4/3" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=85&auto=format&fit=crop" alt="Suya" style="width:100%;height:100%;object-fit:cover" data-qm="dish-image-3"/>
      </div>
      <div style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <h3 style="font-size:20px;font-weight:400" data-qm="dish-title-3">Premium Suya</h3>
          <span style="font-size:15px;color:var(--qm-accent);font-weight:700" data-qm="dish-price-3">â‚¦3,800</span>
        </div>
        <p style="font-size:13px;color:var(--qm-text-muted);line-height:1.65" data-qm="dish-desc-3">Skewered beef seasoned with our house yaji spice, grilled over charcoal. Served with sliced onions and tomatoes.</p>
      </div>
    </div>
  </div>
  <div style="text-align:center;margin-top:48px">
    <a href="/menu" style="padding:14px 40px;border:1px solid var(--qm-text);color:var(--qm-text);font-size:12px;letter-spacing:0.2em;text-transform:uppercase;display:inline-block" data-qm="menu-view-all" data-qay-hover="scale-btn">View Full Menu</a>
  </div>
</section>

<!-- ABOUT PREVIEW -->
<section style="background:var(--qm-surface);display:grid;grid-template-columns:1fr 1fr;min-height:56vh" data-qay-animate="scroll-reveal">
  <div style="display:flex;flex-direction:column;justify-content:center;padding:80px 60px" data-qay-animate="slide-right">
    <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:var(--qm-accent);margin-bottom:20px" data-qm="about-eyebrow">Est. 1987</p>
    <h2 style="font-size:clamp(28px,4vw,48px);font-weight:400;line-height:1.2;color:var(--qm-text);margin-bottom:20px" data-qm="about-title">Feeding Lagos<br/>for <em>37 years.</em></h2>
    <div style="width:40px;height:2px;background:var(--qm-accent);margin-bottom:24px"></div>
    <p style="font-size:15px;line-height:1.85;color:var(--qm-text-muted);margin-bottom:32px" data-qm="about-text">Mama Titi opened her first kitchen on a Thursday with nothing but a clay pot, firewood, and recipes passed down through four generations. Today her children carry her legacy forward â€” with the same recipes, the same fire, the same love.</p>
    <a href="/about" style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-accent);display:inline-flex;align-items:center;gap:12px" data-qm="about-cta">
      Read Our Story <span style="display:block;width:32px;height:1px;background:var(--qm-accent)"></span>
    </a>
  </div>
  <div style="overflow:hidden" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85&auto=format&fit=crop" alt="Restaurant interior" style="width:100%;height:100%;object-fit:cover" data-qm="about-image"/>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:var(--qm-text);color:var(--qm-bg);padding:60px 40px 28px">
  <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;margin-bottom:48px">
    <div>
      <h3 style="font-size:24px;font-weight:400;margin-bottom:12px" data-qm="footer-brand">Mama Titi's Kitchen</h3>
      <p style="font-size:13px;line-height:1.7;opacity:0.65;max-width:280px" data-qm="footer-tagline">Authentic Nigerian cuisine with heart and history. Victoria Island, Lagos.</p>
      <p style="font-size:13px;margin-top:16px;opacity:0.65" data-qm="footer-email">hello@mamatiti.com</p>
    </div>
    <div>
      <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;opacity:0.5;margin-bottom:16px">Navigate</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="/menu" style="font-size:13px;opacity:0.8">Menu</a>
        <a href="/about" style="font-size:13px;opacity:0.8">Our Story</a>
        <a href="/contact" style="font-size:13px;opacity:0.8">Reservations</a>
      </div>
    </div>
    <div>
      <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;opacity:0.5;margin-bottom:16px">Hours</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <p style="font-size:13px;opacity:0.8" data-qm="footer-hours-1">Monâ€“Fri: 11am â€“ 10pm</p>
        <p style="font-size:13px;opacity:0.8" data-qm="footer-hours-2">Satâ€“Sun: 10am â€“ 11pm</p>
        <p style="font-size:13px;color:var(--qm-accent);margin-top:4px" data-qm="footer-location">4 Ozumba Mbadiwe Ave, VI</p>
      </div>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1)">
    <p style="font-size:11px;opacity:0.4" data-qm="footer-copyright">&copy; 2026 Mama Titi's Kitchen</p>
    <div style="display:flex;gap:20px">
      <a href="#" style="font-size:11px;opacity:0.4">Privacy</a>
      <a href="#" style="font-size:11px;opacity:0.4">Terms</a>
    </div>
  </div>
</footer>
</div>$HTML$
) 
ON CONFLICT (site_type, theme, label) DO UPDATE SET
  rank = EXCLUDED.rank,
  pages = EXCLUDED.pages,
  html = EXCLUDED.html,
  is_active = true;

-- TEMPLATE 4: Minimal Portfolio
INSERT INTO qay_ai_templates (site_type, theme, label, rank, pages, html) VALUES (
'portfolio', 'dark-minimal', 'Dark Minimal Portfolio', 100,
'[{"name":"Home","slug":"/"},{"name":"Work","slug":"work"},{"name":"About","slug":"about"},{"name":"Contact","slug":"contact"}]',
$HTML$<div data-qay-page="Home" data-qay-slug="/">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --qm-bg: #0d0d0d;
  --qm-surface: #1a1a1a;
  --qm-text: #e8e8e8;
  --qm-text-muted: #666666;
  --qm-accent: #ffffff;
  --qm-accent-text: #0d0d0d;
  --qm-border: rgba(255,255,255,0.08);
  --qm-heading-font: 'Space Grotesk', sans-serif;
  --qm-body-font: 'Space Grotesk', sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--qm-bg);color:var(--qm-text);font-family:var(--qm-body-font);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
</style>

<!-- NAV -->
<nav style="padding:28px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--qm-border)" data-qay-animate="fade-in">
  <a href="/" style="font-size:16px;font-weight:600;letter-spacing:-0.02em" data-qm="brand-name">Kay Abdulwahab</a>
  <div style="display:flex;gap:32px;align-items:center">
    <a href="/work" style="font-size:13px;color:var(--qm-text-muted)">Work</a>
    <a href="/about" style="font-size:13px;color:var(--qm-text-muted)">About</a>
    <a href="/contact" style="font-size:13px;color:var(--qm-text-muted)">Contact</a>
    <a href="mailto:hello@kay.dev" style="padding:8px 20px;border:1px solid var(--qm-border);font-size:12px;letter-spacing:0.05em" data-qm="nav-cta">Hire me</a>
  </div>
</nav>

<!-- HERO -->
<section style="padding:100px 40px 80px;max-width:1100px;margin:0 auto" data-qay-animate="slide-up" data-qay-duration="0.9">
  <div style="margin-bottom:48px">
    <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-text-muted);margin-bottom:24px" data-qm="hero-eyebrow">Frontend Developer & SaaS Builder</p>
    <h1 style="font-size:clamp(52px,7vw,100px);font-weight:700;letter-spacing:-0.04em;line-height:0.92;color:var(--qm-text);margin-bottom:32px" data-qm="hero-title">I build fast,<br/>beautiful<br/>products.</h1>
    <p style="font-size:17px;line-height:1.7;color:var(--qm-text-muted);max-width:520px;margin-bottom:40px" data-qm="hero-subtitle">Self-taught developer from Abeokuta. I turn ideas into real products using React, Next.js, Supabase, and a healthy obsession with design quality.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <a href="/work" style="padding:14px 32px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:13px;font-weight:600;letter-spacing:-0.01em" data-qm="hero-cta" data-qay-hover="scale-btn">View My Work</a>
      <a href="/contact" style="padding:14px 32px;border:1px solid var(--qm-border);font-size:13px;font-weight:500;color:var(--qm-text-muted)" data-qm="hero-cta-secondary">Get In Touch</a>
    </div>
  </div>
</section>

<!-- PROJECTS GRID -->
<section style="padding:0 40px 100px;max-width:1100px;margin:0 auto" data-qay-animate="scroll-reveal">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:32px">
    <h2 style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:var(--qm-text-muted)" data-qm="projects-title">Selected Work</h2>
    <a href="/work" style="font-size:12px;color:var(--qm-text-muted)" data-qm="projects-view-all">All projects â†’</a>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px" data-qay-animate="stagger-children">
    <div style="background:var(--qm-surface);overflow:hidden;group" data-qay-hover="lift">
      <div style="overflow:hidden;aspect-ratio:16/10" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=85&auto=format&fit=crop" alt="QAY Builder" style="width:100%;height:100%;object-fit:cover" data-qm="project-image-1"/>
      </div>
      <div style="padding:28px 32px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <h3 style="font-size:18px;font-weight:600;letter-spacing:-0.02em" data-qm="project-title-1">QAY Builder</h3>
          <span style="font-size:11px;color:var(--qm-text-muted)" data-qm="project-year-1">2024â€“25</span>
        </div>
        <p style="font-size:13px;color:var(--qm-text-muted);line-height:1.6;margin-bottom:16px" data-qm="project-desc-1">AI-powered website builder with section library, client mode, and Medusa ecommerce integration.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">Next.js</span>
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">Supabase</span>
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">Tailwind</span>
        </div>
      </div>
    </div>
    <div style="background:var(--qm-surface);overflow:hidden" data-qay-hover="lift">
      <div style="overflow:hidden;aspect-ratio:16/10" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85&auto=format&fit=crop" alt="Project 2" style="width:100%;height:100%;object-fit:cover" data-qm="project-image-2"/>
      </div>
      <div style="padding:28px 32px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <h3 style="font-size:18px;font-weight:600;letter-spacing:-0.02em" data-qm="project-title-2">DevOS Platform</h3>
          <span style="font-size:11px;color:var(--qm-text-muted)" data-qm="project-year-2">2025</span>
        </div>
        <p style="font-size:13px;color:var(--qm-text-muted);line-height:1.6;margin-bottom:16px" data-qm="project-desc-2">Cloud-native developer environment with real-time collaboration, versioning, and one-click deployment.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">React</span>
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">Cloudflare</span>
        </div>
      </div>
    </div>
    <div style="background:var(--qm-surface);overflow:hidden;grid-column:1/-1" data-qay-hover="lift">
      <div style="display:grid;grid-template-columns:1fr 1fr">
        <div style="overflow:hidden;aspect-ratio:16/9" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=900&q=85&auto=format&fit=crop" alt="Project 3" style="width:100%;height:100%;object-fit:cover" data-qm="project-image-3"/>
        </div>
        <div style="padding:40px;display:flex;flex-direction:column;justify-content:center">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">
            <h3 style="font-size:22px;font-weight:600;letter-spacing:-0.02em" data-qm="project-title-3">Invoice Generator</h3>
            <span style="font-size:11px;color:var(--qm-text-muted)" data-qm="project-year-3">2025</span>
          </div>
          <p style="font-size:14px;color:var(--qm-text-muted);line-height:1.65;margin-bottom:24px" data-qm="project-desc-3">Professional invoicing tool for Nigerian freelancers. PDF export, client management, payment tracking.</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">Next.js</span>
            <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">TypeScript</span>
            <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--qm-border);color:var(--qm-text-muted)">Supabase</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:var(--qm-surface);border-top:1px solid var(--qm-border);padding:48px 40px">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div>
      <h3 style="font-size:18px;font-weight:600;letter-spacing:-0.02em;margin-bottom:4px" data-qm="footer-brand">Kay Abdulwahab</h3>
      <p style="font-size:13px;color:var(--qm-text-muted)" data-qm="footer-role">Frontend Developer Â· Abeokuta, Nigeria</p>
    </div>
    <div style="display:flex;gap:24px">
      <a href="https://github.com/KAYODE-00" style="font-size:12px;color:var(--qm-text-muted)" data-qm="footer-github">GitHub</a>
      <a href="#" style="font-size:12px;color:var(--qm-text-muted)" data-qm="footer-twitter">Twitter</a>
      <a href="mailto:hello@kay.dev" style="font-size:12px;color:var(--qm-text-muted)" data-qm="footer-email">Email</a>
    </div>
  </div>
</footer>
</div>$HTML$
) 
ON CONFLICT (site_type, theme, label) DO UPDATE SET
  rank = EXCLUDED.rank,
  pages = EXCLUDED.pages,
  html = EXCLUDED.html,
  is_active = true;

-- TEMPLATE 5: Modern SaaS
INSERT INTO qay_ai_templates (site_type, theme, label, rank, pages, html) VALUES (
'saas', 'light-blue', 'Modern SaaS Product', 100,
'[{"name":"Home","slug":"/"},{"name":"Pricing","slug":"pricing"},{"name":"About","slug":"about"}]',
$HTML$<div data-qay-page="Home" data-qay-slug="/">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --qm-bg: #ffffff;
  --qm-surface: #f0f4ff;
  --qm-text: #111827;
  --qm-text-muted: #6b7280;
  --qm-accent: #4f46e5;
  --qm-accent-text: #ffffff;
  --qm-border: rgba(79,70,229,0.12);
  --qm-heading-font: 'Plus Jakarta Sans', sans-serif;
  --qm-body-font: 'Plus Jakarta Sans', sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--qm-bg);color:var(--qm-text);font-family:var(--qm-body-font);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
</style>

<!-- NAV -->
<nav style="background:var(--qm-bg);border-bottom:1px solid var(--qm-border);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50" data-qay-animate="fade-in">
  <div style="display:flex;align-items:center;gap:8px">
    <div style="width:28px;height:28px;background:var(--qm-accent);border-radius:6px;display:flex;align-items:center;justify-content:center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
    </div>
    <span style="font-size:16px;font-weight:700;letter-spacing:-0.02em" data-qm="brand-name">FlowAI</span>
  </div>
  <div style="display:flex;gap:32px;align-items:center">
    <a href="#features" style="font-size:14px;color:var(--qm-text-muted)">Features</a>
    <a href="/pricing" style="font-size:14px;color:var(--qm-text-muted)">Pricing</a>
    <a href="/about" style="font-size:14px;color:var(--qm-text-muted)">About</a>
    <a href="/login" style="font-size:14px;color:var(--qm-text-muted)">Sign in</a>
    <a href="/signup" style="padding:10px 24px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:13px;font-weight:600;border-radius:8px" data-qm="nav-cta" data-qay-hover="scale-btn">Start free â†’</a>
  </div>
</nav>

<!-- HERO -->
<section style="padding:100px 40px 80px;text-align:center;max-width:900px;margin:0 auto" data-qay-animate="slide-up" data-qay-duration="0.8">
  <div style="display:inline-flex;align-items:center;gap:8px;background:var(--qm-surface);border:1px solid var(--qm-border);border-radius:100px;padding:6px 16px;margin-bottom:32px">
    <span style="width:6px;height:6px;border-radius:50%;background:var(--qm-accent)"></span>
    <span style="font-size:12px;font-weight:500;color:var(--qm-accent)" data-qm="hero-badge">Now with AI â€” 10x faster workflows</span>
  </div>
  <h1 style="font-size:clamp(48px,6vw,80px);font-weight:800;letter-spacing:-0.04em;line-height:1.0;color:var(--qm-text);margin-bottom:24px" data-qm="hero-title">Automate your<br/>entire workflow<br/>with AI.</h1>
  <p style="font-size:18px;line-height:1.65;color:var(--qm-text-muted);max-width:560px;margin:0 auto 40px" data-qm="hero-subtitle">Stop wasting hours on repetitive tasks. FlowAI connects your tools, automates your processes, and gives you back time to build what matters.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:48px">
    <a href="/signup" style="padding:16px 40px;background:var(--qm-accent);color:var(--qm-accent-text);font-size:15px;font-weight:600;border-radius:10px" data-qm="hero-cta" data-qay-hover="scale-btn">Start for free</a>
    <a href="#features" style="padding:16px 40px;border:1.5px solid var(--qm-border);color:var(--qm-text);font-size:15px;font-weight:500;border-radius:10px" data-qm="hero-cta-secondary">See how it works</a>
  </div>
  <p style="font-size:12px;color:var(--qm-text-muted)" data-qm="hero-proof">No credit card required Â· Free forever plan Â· 5 min setup</p>
</section>

<!-- FEATURES -->
<section id="features" style="background:var(--qm-surface);padding:100px 40px" data-qay-animate="scroll-reveal">
  <div style="text-align:center;margin-bottom:64px">
    <h2 style="font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-0.03em;margin-bottom:16px" data-qm="features-title">Everything you need to move faster</h2>
    <p style="font-size:16px;color:var(--qm-text-muted);max-width:480px;margin:0 auto" data-qm="features-subtitle">Built for teams who are tired of switching between 12 different apps just to finish one task.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;max-width:1100px;margin:0 auto" data-qay-animate="stagger-children">
    <div style="background:var(--qm-bg);border:1px solid var(--qm-border);border-radius:16px;padding:32px" data-qay-hover="lift">
      <div style="width:44px;height:44px;background:rgba(79,70,229,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">âš¡</div>
      <h3 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px" data-qm="feature-title-1">AI Automation</h3>
      <p style="font-size:14px;line-height:1.65;color:var(--qm-text-muted)" data-qm="feature-desc-1">Describe what you want automated in plain English. Our AI builds the workflow for you in seconds.</p>
    </div>
    <div style="background:var(--qm-bg);border:1px solid var(--qm-border);border-radius:16px;padding:32px" data-qay-hover="lift">
      <div style="width:44px;height:44px;background:rgba(79,70,229,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">ðŸ”—</div>
      <h3 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px" data-qm="feature-title-2">500+ Integrations</h3>
      <p style="font-size:14px;line-height:1.65;color:var(--qm-text-muted)" data-qm="feature-desc-2">Connect Slack, Notion, Gmail, Airtable, Stripe, and 495 more tools your team already uses.</p>
    </div>
    <div style="background:var(--qm-bg);border:1px solid var(--qm-border);border-radius:16px;padding:32px" data-qay-hover="lift">
      <div style="width:44px;height:44px;background:rgba(79,70,229,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">ðŸ“Š</div>
      <h3 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px" data-qm="feature-title-3">Real-time Analytics</h3>
      <p style="font-size:14px;line-height:1.65;color:var(--qm-text-muted)" data-qm="feature-desc-3">See exactly what's running, what's saved you time, and where there's room to optimize further.</p>
    </div>
    <div style="background:var(--qm-bg);border:1px solid var(--qm-border);border-radius:16px;padding:32px" data-qay-hover="lift">
      <div style="width:44px;height:44px;background:rgba(79,70,229,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">ðŸ”</div>
      <h3 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px" data-qm="feature-title-4">Enterprise Security</h3>
      <p style="font-size:14px;line-height:1.65;color:var(--qm-text-muted)" data-qm="feature-desc-4">SOC 2 compliant, end-to-end encrypted, with role-based permissions for every team member.</p>
    </div>
    <div style="background:var(--qm-bg);border:1px solid var(--qm-border);border-radius:16px;padding:32px" data-qay-hover="lift">
      <div style="width:44px;height:44px;background:rgba(79,70,229,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">ðŸ‘¥</div>
      <h3 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px" data-qm="feature-title-5">Team Collaboration</h3>
      <p style="font-size:14px;line-height:1.65;color:var(--qm-text-muted)" data-qm="feature-desc-5">Share workflows, leave comments, and hand off processes between teammates without breaking anything.</p>
    </div>
    <div style="background:linear-gradient(135deg,var(--qm-accent),#7c3aed);border-radius:16px;padding:32px" data-qay-hover="lift">
      <p style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);margin-bottom:12px" data-qm="feature-cta-eyebrow">Ready to start?</p>
      <h3 style="font-size:22px;font-weight:800;color:white;margin-bottom:16px;letter-spacing:-0.02em" data-qm="feature-cta-title">Free forever.<br/>No credit card.</h3>
      <a href="/signup" style="display:inline-block;padding:12px 28px;background:white;color:var(--qm-accent);font-size:13px;font-weight:700;border-radius:8px" data-qm="feature-cta">Get started â†’</a>
    </div>
  </div>
</section>

<!-- SOCIAL PROOF -->
<section style="padding:100px 40px;text-align:center" data-qay-animate="scroll-reveal">
  <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--qm-text-muted);margin-bottom:40px" data-qm="proof-eyebrow">Trusted by 12,000+ teams worldwide</p>
  <div style="display:flex;justify-content:center;gap:60px;flex-wrap:wrap;margin-bottom:64px;opacity:0.4">
    <span style="font-size:20px;font-weight:800;letter-spacing:-0.02em" data-qm="logo-1">Notion</span>
    <span style="font-size:20px;font-weight:800;letter-spacing:-0.02em" data-qm="logo-2">Linear</span>
    <span style="font-size:20px;font-weight:800;letter-spacing:-0.02em" data-qm="logo-3">Vercel</span>
    <span style="font-size:20px;font-weight:800;letter-spacing:-0.02em" data-qm="logo-4">Stripe</span>
    <span style="font-size:20px;font-weight:800;letter-spacing:-0.02em" data-qm="logo-5">Figma</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:900px;margin:0 auto">
    <div style="background:var(--qm-surface);border:1px solid var(--qm-border);border-radius:16px;padding:28px;text-align:left" data-qay-hover="lift">
      <p style="font-size:14px;line-height:1.7;color:var(--qm-text);margin-bottom:20px" data-qm="testimonial-1">"We cut our reporting time from 4 hours to 15 minutes. I wish we'd found this years ago."</p>
      <p style="font-size:13px;font-weight:600" data-qm="testimonial-1-author">Sarah K.</p>
      <p style="font-size:12px;color:var(--qm-text-muted)" data-qm="testimonial-1-role">Head of Ops, Acme Inc.</p>
    </div>
    <div style="background:var(--qm-surface);border:1px solid var(--qm-border);border-radius:16px;padding:28px;text-align:left" data-qay-hover="lift">
      <p style="font-size:14px;line-height:1.7;color:var(--qm-text);margin-bottom:20px" data-qm="testimonial-2">"The AI actually understood what I wanted and built it. I was genuinely shocked."</p>
      <p style="font-size:13px;font-weight:600" data-qm="testimonial-2-author">James O.</p>
      <p style="font-size:12px;color:var(--qm-text-muted)" data-qm="testimonial-2-role">Founder, Buildwise</p>
    </div>
    <div style="background:var(--qm-surface);border:1px solid var(--qm-border);border-radius:16px;padding:28px;text-align:left" data-qay-hover="lift">
      <p style="font-size:14px;line-height:1.7;color:var(--qm-text);margin-bottom:20px" data-qm="testimonial-3">"Replaced three separate tools and saved us $800/month. Setup took under an hour."</p>
      <p style="font-size:13px;font-weight:600" data-qm="testimonial-3-author">Amara N.</p>
      <p style="font-size:12px;color:var(--qm-text-muted)" data-qm="testimonial-3-role">CTO, Kora Digital</p>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:var(--qm-text);color:white;padding:60px 40px 32px">
  <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px">
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
        <div style="width:24px;height:24px;background:var(--qm-accent);border-radius:5px"></div>
        <span style="font-size:15px;font-weight:700" data-qm="footer-brand">FlowAI</span>
      </div>
      <p style="font-size:13px;line-height:1.7;opacity:0.6;max-width:260px" data-qm="footer-tagline">Automate the repetitive. Focus on what matters. Built for modern teams.</p>
    </div>
    <div>
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.4;margin-bottom:16px">Product</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="#" style="font-size:13px;opacity:0.7" data-qm="footer-link-1">Features</a>
        <a href="/pricing" style="font-size:13px;opacity:0.7" data-qm="footer-link-2">Pricing</a>
        <a href="#" style="font-size:13px;opacity:0.7" data-qm="footer-link-3">Changelog</a>
      </div>
    </div>
    <div>
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.4;margin-bottom:16px">Company</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="/about" style="font-size:13px;opacity:0.7" data-qm="footer-link-4">About</a>
        <a href="#" style="font-size:13px;opacity:0.7" data-qm="footer-link-5">Blog</a>
        <a href="#" style="font-size:13px;opacity:0.7" data-qm="footer-link-6">Careers</a>
      </div>
    </div>
    <div>
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.4;margin-bottom:16px">Legal</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <a href="#" style="font-size:13px;opacity:0.7">Privacy</a>
        <a href="#" style="font-size:13px;opacity:0.7">Terms</a>
        <a href="#" style="font-size:13px;opacity:0.7">Security</a>
      </div>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1)">
    <p style="font-size:12px;opacity:0.35" data-qm="footer-copyright">&copy; 2026 FlowAI. All rights reserved.</p>
    <p style="font-size:12px;opacity:0.35">Made with QAY</p>
  </div>
</footer>
</div>$HTML$
) 
ON CONFLICT (site_type, theme, label) DO UPDATE SET
  rank = EXCLUDED.rank,
  pages = EXCLUDED.pages,
  html = EXCLUDED.html,
  is_active = true;


