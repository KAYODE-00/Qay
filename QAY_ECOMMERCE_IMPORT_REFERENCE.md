# QAY Universal Import Reference

Use this when asking any AI to generate import-ready QAY HTML.

This is a compatibility contract, not a design template. The AI must create a fresh layout for the exact site type in the prompt. It must not copy the examples below unless the prompt asks for that style.

## What QAY Can Import Well

QAY can import and edit normal website HTML for:

- Portfolio sites
- Agency/business sites
- SaaS/product sites
- Restaurant/event sites
- Blogs/content sites
- Landing pages
- Directories/catalogs
- Ecommerce storefronts prepared for Medusa
- Auth-protected/membership/portal sites prepared for QAY site auth
- Multi-page sites using `data-qay-page`

If the site needs deep backend behavior, use hooks and placeholder UI until the backend is connected. Examples: ecommerce checkout, booking engines, marketplaces, courses, communities, dashboards, and user-generated apps.

## Core Rules

- Return real HTML only.
- Use Tailwind classes for layout and styling.
- Do not output markdown fences or explanations.
- Do not echo the user prompt.
- Do not include JavaScript, `onclick`, GSAP scripts, external app scripts, or `<script type="application/qay-interactions">`.
- Use QAY native attributes for motion and interactions.
- Use stable QAY hooks for ecommerce/auth behavior.
- Use relative internal links: `/about`, `/shop`, `/login`.
- Style links as deliberate nav items or buttons. Never leave default blue browser links.
- Choose the website type from the prompt and stay in that lane.
- Do not mix ecommerce, portfolio, SaaS, auth, restaurant, etc. unless the prompt asks for a hybrid.
- Do not reuse the same layout every time. Pick a fresh architecture based on the site type.

## Layout Guidance

The AI should choose from patterns like:

- Editorial hero with asymmetric media
- Split-screen product or founder story
- Bento grid
- Magazine layout
- Sidebar navigation
- Dashboard-like product page
- Immersive event schedule
- Portfolio case-study grid
- Restaurant/menu sections
- SaaS feature/pricing layout
- Ecommerce collection/product layout
- Auth/membership portal layout

The generated site should include only the sections that make sense for the prompt.

## Multi-Page Import

The import dialog starts with Homepage. Paste the homepage code first, click **Add page** for every extra page, then import all pages together.

AI output should mirror that flow by wrapping each page with `data-qay-page`. QAY will create separate pages. Keep `Homepage` first, then output each additional page as a direct sibling wrapper.

```html
<div data-qay-page="Homepage" data-qay-slug="/">
  <!-- homepage HTML -->
</div>

<div data-qay-page="About" data-qay-slug="about">
  <!-- about page HTML -->
</div>

<div data-qay-page="Contact" data-qay-slug="contact">
  <!-- contact page HTML -->
</div>
```

Do not nest page wrappers inside each other. Do not put a full `<!DOCTYPE html>` document inside every wrapper. For multi-page output, use one grouped HTML response containing all page wrappers.

Useful ecommerce pages:

```html
<div data-qay-page="Shop" data-qay-slug="shop"></div>
<div data-qay-page="Product" data-qay-slug="product"></div>
```

Useful auth pages:

```html
<div data-qay-page="Login" data-qay-slug="login"></div>
<div data-qay-page="Sign up" data-qay-slug="signup"></div>
<div data-qay-page="Forgot password" data-qay-slug="forgot-password"></div>
<div data-qay-page="Reset password" data-qay-slug="reset-password"></div>
```

## Full QAY Motion Vocabulary

Use these attributes directly on elements. QAY maps them into safe editor/render animations.

### Entrance Animations

```html
data-qay-animate="fade-in"
data-qay-animate="slide-up"
data-qay-animate="slide-left"
data-qay-animate="slide-right"
data-qay-animate="scale-in"
data-qay-animate="scroll-reveal"
data-qay-animate="luxe-reveal"
data-qay-animate="luxe-asym-reveal"
data-qay-animate="line-grow"
data-qay-animate="stagger-children"
data-qay-animate="sidebar-slide"
data-qay-animate="luxe-dock-reveal"
```

### Hover Animations

```html
data-qay-hover="lift"
data-qay-hover="scale"
data-qay-hover="scale-btn"
data-qay-hover="luxe-lift"
data-qay-hover="img-zoom"
data-qay-hover="border-gold"
data-qay-hover="glow"
```

For image zoom, put the hover attribute on an overflow-hidden wrapper:

```html
<div class="overflow-hidden" data-qay-hover="img-zoom">
  <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&auto=format&q=85" class="w-full object-cover" alt="Product" />
</div>
```

### Click/Toggles

Use this for mobile nav, drawers, dropdowns, modals, accordions, and cart panels.

```html
<button data-qay-click="toggle" data-qay-target="#mobile-menu" data-qay-class="hidden">
  Menu
</button>

<div id="mobile-menu" class="hidden fixed inset-0 z-50 flex flex-col">
  ...
</div>
```

### Motion Tuning

These are optional. The AI should choose values inside these ranges based on the design, section weight, and motion direction. Do not reuse the same values everywhere.

```html
data-qay-duration="0.35 to 1.4"
data-qay-hover-duration="0.15 to 0.5"
data-qay-y="-80 to 80"
data-qay-x="-100 to 100"
data-qay-ease="power1.out | power2.out | power3.out | expo.out | back.out(1.2)"
```

Good defaults by use:

- Hero title: duration `0.8` to `1.4`, y `32` to `80`, ease `power3.out` or `expo.out`.
- Section/card reveal: duration `0.45` to `0.9`, y `16` to `48`, ease `power2.out`.
- Side panels: duration `0.6` to `1.0`, x `-80` to `80`, ease `power2.out`.
- Buttons/hover: hover duration `0.15` to `0.35`, subtle scale/lift only.
- Luxury/editorial reveal: duration `0.9` to `1.4`, y `24` to `64`, ease `expo.out` or `back.out(1.2)`.

## Ecommerce Hooks

Use these only for ecommerce/storefront prompts.

Every ecommerce product card must include a visible, styled Add to cart button. Do not rely on the whole card being clickable. The button must use `type="button"`, `data-qay-commerce="add-to-cart"`, and the same `data-qay-product-id` as its product card.

```html
data-qay-commerce="product-grid"
data-qay-commerce="product-card"
data-qay-commerce="product-image"
data-qay-commerce="product-title"
data-qay-commerce="product-description"
data-qay-commerce="product-price"
data-qay-commerce="add-to-cart"
data-qay-commerce="cart-button"
data-qay-commerce="cart-drawer"
data-qay-commerce="cart-items"
data-qay-commerce="cart-count"
data-qay-commerce="checkout-button"
data-qay-product-id="sample-product-id"
data-qay-product-handle="sample-product-handle"
```

These hooks are preserved by the importer and will be used for Medusa mapping.

Required product card structure:

```html
<article data-qay-commerce="product-card" data-qay-product-id="sample-product-1" data-qay-product-handle="signature-product">
  <div data-qay-commerce="product-image">
    <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&auto=format&q=85" alt="Signature product" />
  </div>
  <h2 data-qay-commerce="product-title">Signature product</h2>
  <p data-qay-commerce="product-description">Short product description.</p>
  <span data-qay-commerce="product-price">$49</span>
  <button type="button" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">
    Add to cart
  </button>
</article>
```

## Auth Hooks

Use these only when the prompt asks for auth-protected, membership, SaaS, portal, course, private community, login, sign up, or user account flows.

```html
<form data-qay-site-auth-form="signin">
  <input name="email" type="email" placeholder="you@example.com" />
  <input name="password" type="password" placeholder="Password" />
  <button type="submit">Sign in</button>
  <p data-qay-site-auth-error hidden></p>
</form>
```

Supported form modes:

```html
data-qay-site-auth-form="signin"
data-qay-site-auth-form="signup"
data-qay-site-auth-form="forgot-password"
data-qay-site-auth-form="reset-password"
```

Useful supporting hooks:

```html
data-qay-site-auth-error
data-qay-site-auth-success
data-qay-site-auth="logout"
```

Auth page slugs should be:

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

## Prompt To Give Another AI

Copy this and add your site request at the end:

```text
You are generating import-ready HTML for QAY, a visual website builder.

Return only real HTML. Do not use markdown fences. Do not explain.

Use Tailwind classes for all design. Do not use JavaScript, onclick handlers, GSAP scripts, external app scripts, or application/qay-interactions scripts.

Infer the website type from my request and stay in that lane. Do not mix unrelated website types unless I explicitly request a hybrid. Do not reuse a fixed example layout. Choose a fresh layout architecture that fits the prompt.

Use QAY motion attributes where appropriate:
data-qay-animate="fade-in|slide-up|slide-left|slide-right|scale-in|scroll-reveal|luxe-reveal|luxe-asym-reveal|line-grow|stagger-children|sidebar-slide|luxe-dock-reveal"
data-qay-hover="lift|scale|scale-btn|luxe-lift|img-zoom|border-gold|glow"
data-qay-click="toggle"
data-qay-target="#element-id"
data-qay-class="hidden"

Optional motion tuning. Choose varied values per element:
data-qay-duration: 0.35 to 1.4
data-qay-hover-duration: 0.15 to 0.5
data-qay-y: -80 to 80
data-qay-x: -100 to 100
data-qay-ease: power1.out, power2.out, power3.out, expo.out, or back.out(1.2)

If this is ecommerce, use:
data-qay-commerce="product-grid|product-card|product-image|product-title|product-description|product-price|add-to-cart|cart-button|cart-drawer|cart-items|cart-count|checkout-button"
data-qay-product-id="sample-product-id"
data-qay-product-handle="sample-product-handle"

Every product card must include a visible styled button:
<button type="button" data-qay-commerce="add-to-cart" data-qay-product-id="same-product-id">Add to cart</button>

If this is auth/membership/portal/SaaS/private community, generate dedicated auth pages if useful:
<div data-qay-page="Login" data-qay-slug="login">...</div>
<div data-qay-page="Sign up" data-qay-slug="signup">...</div>
<div data-qay-page="Forgot password" data-qay-slug="forgot-password">...</div>
<div data-qay-page="Reset password" data-qay-slug="reset-password">...</div>

Auth forms must use:
data-qay-site-auth-form="signin|signup|forgot-password|reset-password"
data-qay-site-auth-error
data-qay-site-auth-success

For multi-page sites, wrap every page:
<div data-qay-page="Homepage" data-qay-slug="/">...</div>
<div data-qay-page="About" data-qay-slug="about">...</div>

Now generate: [DESCRIBE THE WEBSITE HERE]
```

## Tiny Examples

These examples show hooks only. They are not layout templates.

### Mobile Menu

```html
<button class="md:hidden" data-qay-click="toggle" data-qay-target="#mobile-menu" data-qay-class="hidden">Menu</button>
<div id="mobile-menu" class="hidden fixed inset-0 z-50 flex flex-col bg-black text-white md:hidden"></div>
```

### Product Card

```html
<article data-qay-commerce="product-card" data-qay-product-id="sample-product-1" data-qay-product-handle="signature-product">
  <div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&auto=format&q=85" alt="Signature product" />
  </div>
  <h2 data-qay-commerce="product-title">Signature product</h2>
  <p data-qay-commerce="product-description">A short product description.</p>
  <span data-qay-commerce="product-price">$49</span>
  <button type="button" class="rounded-md bg-black px-4 py-2 text-sm font-medium text-white" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">Add to cart</button>
</article>
```

### Login Form

```html
<form data-qay-site-auth-form="signin">
  <input name="email" type="email" placeholder="you@example.com" />
  <input name="password" type="password" placeholder="Password" />
  <button type="submit">Sign in</button>
  <p data-qay-site-auth-error hidden></p>
  <a href="/forgot-password">Forgot password?</a>
</form>
```
