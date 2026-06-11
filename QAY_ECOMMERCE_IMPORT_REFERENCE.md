# QAY Universal Import Reference

Use this when asking any AI to generate import-ready QAY HTML.

This is a compatibility contract, not a design template. The AI must create a fresh layout for the exact site type in the prompt. It must not copy the examples below unless the prompt asks for that exact style.

## Main Goal

Generate real HTML that QAY can import into editable visual-builder layers. The generated site should feel like a finished website, not a demo, wireframe, or repeated template. The copy, layout, colors, imagery, motion, and page count must match the user's requested site type.

QAY can handle many site types, including:

- Portfolio and personal brand sites
- Agency, studio, consultant, and service business sites
- SaaS, app, startup, and product sites
- Restaurants, hotels, events, venues, and hospitality sites
- Blogs, magazines, newsletters, and content sites
- Directories, catalogs, listing sites, and landing pages
- Ecommerce storefronts prepared for Medusa
- Auth-protected, membership, portal, course, and community sites
- Hybrid sites only when the prompt explicitly asks for a hybrid

If the requested site requires backend behavior QAY has not connected yet, create the right editable UI and QAY hooks as placeholders. Do not fake backend logic with JavaScript.

## Output Rules

- Return real HTML only.
- Do not use markdown fences.
- Do not explain.
- Do not echo the prompt.
- Use Tailwind classes for all layout and styling.
- Use semantic HTML where possible: `main`, `nav`, `section`, `article`, `footer`, `form`, `button`, `img`.
- Use relative internal links: `/about`, `/shop`, `/login`.
- Style every link intentionally. Never leave default blue browser links.
- Do not include JavaScript, `onclick`, GSAP scripts, external app scripts, or inline event handlers.
- Do not use custom animation CSS. Use QAY attributes for motion and state.
- A tiny `<style>` block is allowed only for font helper classes such as `.serif`.
- Use real images, preferably Unsplash URLs with width and quality params.
- Do not use blank placeholder boxes, "Feature 1", "Service 1", "Product name", lorem ipsum, or generic filler copy.
- Never mix unrelated website types unless the user asks for that hybrid.

## Import Shape

For a single page, a complete HTML document is okay:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Site title</title>
</head>
<body class="bg-white text-black">
  ...
</body>
</html>
```

For multi-page sites, use direct sibling page wrappers. QAY creates separate pages from these wrappers.

```html
<div data-qay-page="Homepage" data-qay-slug="/">
  <!-- homepage content -->
</div>

<div data-qay-page="About" data-qay-slug="about">
  <!-- about page content -->
</div>

<div data-qay-page="Contact" data-qay-slug="contact">
  <!-- contact page content -->
</div>
```

Rules for pages:

- Keep `Homepage` first.
- Do not nest `data-qay-page` wrappers.
- Do not put a full `<!DOCTYPE html>` document inside every page wrapper.
- Generate multiple pages when the site naturally needs them.
- Keep slugs clean: `about`, `services`, `work`, `shop`, `product`, `contact`, `login`.
- Generate at most 5 pages unless the user asks for more.

Good default page sets:

- Portfolio: Homepage, Work, About, Contact
- Agency/business: Homepage, Services, About, Contact
- SaaS/product: Homepage, Pricing, Login, Sign up
- Ecommerce: Homepage, Shop, Product, Contact
- Restaurant/event: Homepage, Menu or Schedule, Reservations or RSVP, Contact
- Auth/membership: Homepage or Portal, Login, Sign up, Forgot password, Reset password

## Design Quality Rules

The AI must pick a fresh layout architecture based on the prompt. It should vary:

- Hero composition
- Navigation structure
- Section order
- Grid rhythm
- Card shapes and spans
- Image placement
- Palette
- Typography scale
- Motion values
- CTA wording

Good layout architectures include:

- Editorial hero with asymmetric media
- Split-screen product or founder story
- Bento grid
- Magazine layout
- Sidebar navigation
- Product-led ecommerce collection layout
- Dashboard-like SaaS layout
- Portfolio case-study grid
- Immersive event schedule
- Restaurant/menu sections
- Portal/member account layout
- Directory/listing layout
- Documentation/help-center layout

Avoid the repeated generic pattern:

- Centered hero
- Three identical cards
- Generic CTA
- Generic footer

## Copy Rules

All visible text must fit the requested site.

- Use domain-specific words from the requested business or audience.
- Name sections with concrete labels, not only "Features" and "Solutions".
- CTAs must match the goal: `Book a table`, `View collection`, `Start membership`, `See case studies`, `Request a quote`, `Join the waitlist`.
- Product copy should sound like the product category.
- Portfolio copy should mention work, process, case studies, or craft.
- Restaurant/event copy should mention menu, date, venue, reservation, RSVP, or experience.
- SaaS copy should mention product value, workflow, integrations, security, analytics, or pricing.
- Auth/portal copy should mention account access, membership, course, dashboard, client portal, or private area.
- Do not use generic filler like "transform your vision", "unlock your potential", "seamless solutions", "innovative platform", unless the user specifically asks for that wording.

## Images

Use real image URLs when the site is public-facing.

Recommended pattern:

```html
<img
  src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&auto=format&q=85"
  alt="Relevant product or scene"
  class="h-full w-full object-cover"
/>
```

Rules:

- Use images relevant to the site type.
- Use descriptive `alt`.
- Use stable dimensions with Tailwind: `aspect-[4/5]`, `h-[420px]`, `min-h-[520px]`, `object-cover`.
- Do not use dark blurred stock backgrounds when users need to inspect products or work.
- For ecommerce, product cards should have product-like images.
- For portfolio, use work/case-study style images.
- For restaurant/hotel/event, use venue, food, or experience images.

## Color and Theme

Use palettes that fit the prompt. Do not default to one fixed dark/gold design.

Good palette guidance:

- Luxury: charcoal, cream, restrained gold, deep green, burgundy, off-white.
- SaaS: clean neutrals with one confident accent.
- Restaurant: warm but not muddy; strong food/venue contrast.
- Portfolio: editorial neutrals, sharp contrast, tasteful accent.
- Ecommerce: product-first backgrounds, strong buy buttons, clear pricing contrast.
- Wellness: calm but not washed out; readable text.
- Tech/dashboard: quiet surfaces, dense but organized layout.

If the prompt asks for light/dark support, use Tailwind `dark:` variants:

```html
<main class="bg-white text-black dark:bg-[#0D0D0D] dark:text-white">
  ...
</main>
```

Do not add JavaScript theme toggles. QAY controls the actual app theme.

## QAY Motion and Transition Attributes

Use QAY motion attributes directly on editable elements. The importer maps them to editor animations where possible. Published pages also initialize supported runtime hover/toggle effects.

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

Use entrance animations on:

- Hero headings
- Hero media
- Major section intros
- Product cards
- Case-study cards
- Timeline rows
- Pricing cards
- Auth panels

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

Runtime-supported special hover effects:

- `img-zoom`: put on an overflow-hidden wrapper around one image.
- `border-gold`: animates border color on hover.

Importer/editor hover effects:

- `lift`
- `scale`
- `scale-btn`
- `luxe-lift`
- `glow`

Image zoom pattern:

```html
<div class="overflow-hidden rounded-xl" data-qay-hover="img-zoom" data-qay-hover-duration="0.4">
  <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&auto=format&q=85" class="w-full object-cover" alt="Product" />
</div>
```

### Motion Tuning

The AI should choose varied values inside these ranges. Do not repeat the same values everywhere.

```html
data-qay-duration="0.35 to 1.4"
data-qay-hover-duration="0.15 to 0.5"
data-qay-y="-80 to 80"
data-qay-x="-100 to 100"
data-qay-ease="power1.out | power2.out | power3.out | expo.out | back.out(1.2)"
```

Good defaults:

- Hero title: duration `0.8` to `1.4`, y `36` to `80`, ease `power3.out` or `expo.out`.
- Section/card reveal: duration `0.45` to `0.9`, y `16` to `48`, ease `power2.out`.
- Side panels: duration `0.6` to `1.0`, x `-80` to `80`, ease `power2.out`.
- Buttons/hover: hover duration `0.15` to `0.35`, subtle scale/lift only.
- Luxury/editorial reveal: duration `0.9` to `1.4`, y `24` to `64`, ease `expo.out` or `back.out(1.2)`.

## QAY State and Toggle Hooks

Use this for mobile menus, drawers, modals, accordions, dropdowns, filter panels, and simple UI state.

```html
<button
  type="button"
  data-qay-click="toggle"
  data-qay-target="#mobile-menu"
  data-qay-class="hidden"
  aria-expanded="false"
  aria-controls="mobile-menu"
>
  Menu
</button>

<div id="mobile-menu" class="hidden fixed inset-0 z-50 flex flex-col bg-black text-white">
  ...
</div>
```

Rules:

- `data-qay-target` must point to an element id.
- The target should include `hidden` in its class list when closed.
- Use `data-qay-class="hidden"` unless QAY specifically supports another class.
- The target must also include its intended display class such as `flex`, `grid`, or `block`.
- Use unique ids: `mobile-menu`, `cart-panel`, `faq-1`, `booking-modal`, `filter-drawer`.
- Do not use `onclick`.

## Ecommerce Hooks

Use these only for ecommerce/storefront prompts.

```html
data-qay-commerce="product-grid"
data-qay-commerce="product-card"
data-qay-commerce="product-image"
data-qay-commerce="product-title"
data-qay-commerce="product-description"
data-qay-commerce="product-price"
data-qay-commerce="add-to-cart"
data-qay-commerce="remove-from-cart"
data-qay-commerce="cart-button"
data-qay-commerce="cart-drawer"
data-qay-commerce="cart-items"
data-qay-commerce="cart-count"
data-qay-commerce="cart-close"
data-qay-commerce="cart-cancel"
data-qay-commerce="checkout-button"
data-qay-product-id="sample-product-id"
data-qay-product-handle="sample-product-handle"
data-qay-variant-id="sample-variant-id"
data-qay-cart-label="Cart"
```

Runtime behavior:

- `cart-button` opens/closes the cart drawer.
- `cart-button` text becomes `Cart (count)` unless `data-qay-cart-label` changes the label.
- `cart-count` becomes just the numeric count.
- `add-to-cart` increments the matching product.
- `remove-from-cart` decrements/removes the matching product.
- Cart is stored per site id in local storage.
- `cart-items` is replaced with current cart rows at runtime.
- `checkout-button` creates a Medusa cart, adds cart line items by variant id, and redirects to the configured storefront checkout URL.
- Product cards may be hydrated from connected Medusa products by position.
- `data-qay-variant-id` is optional in generated sample HTML. QAY adds it automatically when real Medusa products hydrate the card.

Every ecommerce page should include:

- Header/nav with cart button
- Product grid or featured products
- Product cards
- Visible Add to cart buttons
- Hidden cart drawer/modal
- Cart items container
- Close/cancel button
- Checkout button
- Trust/shipping/returns block
- Footer

Required product card:

```html
<article
  data-qay-commerce="product-card"
  data-qay-product-id="sample-product-1"
  data-qay-product-handle="signature-product"
  data-qay-variant-id="sample-variant-1"
>
  <div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&auto=format&q=85" alt="Signature product" />
  </div>
  <h2 data-qay-commerce="product-title">Signature product</h2>
  <p data-qay-commerce="product-description">A short product description.</p>
  <span data-qay-commerce="product-price">$49</span>
  <button type="button" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">
    Add to cart
  </button>
  <button type="button" data-qay-commerce="remove-from-cart" data-qay-product-id="sample-product-1">
    Remove
  </button>
</article>
```

Required cart drawer:

```html
<button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart">Cart (0)</button>

<aside data-qay-commerce="cart-drawer" class="hidden fixed right-4 top-20 z-50 w-[min(380px,calc(100vw-32px))] rounded-xl border border-black/10 bg-white p-5 text-black shadow-2xl dark:border-white/10 dark:bg-[#111111] dark:text-white">
  <div class="flex items-center justify-between gap-3">
    <h2>Cart</h2>
    <button type="button" data-qay-commerce="cart-close">Close</button>
  </div>
  <div data-qay-commerce="cart-items">Your cart is empty.</div>
  <button type="button" data-qay-commerce="checkout-button">Checkout</button>
  <button type="button" data-qay-commerce="cart-cancel">Cancel</button>
</aside>
```

## Auth Hooks

Use these when the prompt asks for:

- Auth-protected site
- Login/sign up
- Membership
- Portal
- Course
- Private community
- Client dashboard
- SaaS account flow

Supported auth form modes:

```html
data-qay-site-auth-form="signin"
data-qay-site-auth-form="signup"
data-qay-site-auth-form="forgot-password"
data-qay-site-auth-form="reset-password"
```

Supported message hooks:

```html
data-qay-site-auth-error
data-qay-site-auth-success
```

Supported logout hook:

```html
data-qay-site-auth="logout"
```

Auth form requirements:

- `signin`: inputs named `email`, `password`.
- `signup`: inputs named `name` or `fullName`, `email`, `password`.
- `forgot-password`: input named `email`.
- `reset-password`: input named `password`.
- Use `button type="submit"`.
- Include error and success message elements.
- Use links between auth pages.
- Do not point these forms to the QAY builder auth routes.

Auth page slugs:

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

Example:

```html
<form data-qay-site-auth-form="signin" class="space-y-4">
  <input name="email" type="email" placeholder="you@example.com" class="w-full rounded-lg border px-4 py-3" />
  <input name="password" type="password" placeholder="Password" class="w-full rounded-lg border px-4 py-3" />
  <button type="submit" class="w-full rounded-lg bg-black px-4 py-3 text-white">Sign in</button>
  <p data-qay-site-auth-error hidden class="text-sm text-red-600"></p>
  <p data-qay-site-auth-success hidden class="text-sm text-green-600"></p>
  <a href="/forgot-password" class="text-sm underline">Forgot password?</a>
</form>
```

Logout:

```html
<button type="button" data-qay-site-auth="logout">Log out</button>
```

## Forms and Basic Inputs

Normal static forms can be included as editable UI, but they should not claim backend behavior unless QAY has a hook for it.

For contact forms:

- Use `form`, `label`, `input`, `textarea`, `button`.
- Keep labels visible or accessible.
- Do not use JavaScript submission.
- Use realistic field names: `name`, `email`, `company`, `message`.

## What the Importer Preserves

The importer keeps:

- Tailwind classes
- `id`
- `role`
- `aria-label`
- `aria-expanded`
- `aria-controls`
- All `data-qay-*` attributes
- Text content
- Images
- Links and buttons
- Inputs/forms
- Supported QAY interactions

The importer strips or ignores:

- Scripts
- Inline event handlers
- External scripts
- Unsupported custom behavior
- Most non-QAY data attributes

## Prompt To Give Another AI

Copy this and add your site request at the end:

```text
You are generating import-ready HTML for QAY, a visual website builder.

Return only real HTML. Do not use markdown fences. Do not explain.

Use Tailwind classes for all design. Do not use JavaScript, onclick handlers, GSAP scripts, external app scripts, or application/qay-interactions scripts.

Infer the website type from my request and stay in that lane. Do not mix unrelated website types unless I explicitly request a hybrid.

The QAY reference is a compatibility contract, not a layout template. Do not copy examples. Choose a fresh layout architecture that fits the prompt.

The site must be visually strong, responsive, polished, and specific to the requested niche. Use real copy that belongs to the business/site type. Avoid generic filler like "transform your vision", "unlock your potential", "seamless solutions", "Feature 1", "Service 1", or lorem ipsum.

Use relevant Unsplash images with width/quality params and descriptive alt text unless the prompt asks for a text-only internal tool.

Use QAY motion attributes where appropriate:
data-qay-animate="fade-in|slide-up|slide-left|slide-right|scale-in|scroll-reveal|luxe-reveal|luxe-asym-reveal|line-grow|stagger-children|sidebar-slide|luxe-dock-reveal"
data-qay-hover="lift|scale|scale-btn|luxe-lift|img-zoom|border-gold|glow"

Optional motion tuning. Choose varied values per element:
data-qay-duration: 0.35 to 1.4
data-qay-hover-duration: 0.15 to 0.5
data-qay-y: -80 to 80
data-qay-x: -100 to 100
data-qay-ease: power1.out, power2.out, power3.out, expo.out, or back.out(1.2)

Use QAY state/toggle hooks for mobile menus, modals, drawers, dropdowns, accordions, and filters:
data-qay-click="toggle"
data-qay-target="#element-id"
data-qay-class="hidden"
The target must have a matching id, include hidden when closed, and include its display class such as flex, grid, or block.

If this is ecommerce, include product cards, add-to-cart buttons, remove buttons where useful, cart button, hidden cart drawer/modal, cart items container, close/cancel button, checkout button, and trust/shipping content. Use:
data-qay-commerce="product-grid|product-card|product-image|product-title|product-description|product-price|add-to-cart|remove-from-cart|cart-button|cart-drawer|cart-items|cart-count|cart-close|cart-cancel|checkout-button"
data-qay-product-id="sample-product-id"
data-qay-product-handle="sample-product-handle"
data-qay-variant-id="sample-variant-id"
data-qay-cart-label="Cart"

Every ecommerce product card must include:
<button type="button" data-qay-commerce="add-to-cart" data-qay-product-id="same-product-id">Add to cart</button>

If this is auth/membership/portal/SaaS/private community, generate dedicated auth pages when useful:
<div data-qay-page="Login" data-qay-slug="login">...</div>
<div data-qay-page="Sign up" data-qay-slug="signup">...</div>
<div data-qay-page="Forgot password" data-qay-slug="forgot-password">...</div>
<div data-qay-page="Reset password" data-qay-slug="reset-password">...</div>

Auth forms must use:
data-qay-site-auth-form="signin|signup|forgot-password|reset-password"
data-qay-site-auth-error
data-qay-site-auth-success
data-qay-site-auth="logout" for logout buttons

For multi-page sites, wrap every page:
<div data-qay-page="Homepage" data-qay-slug="/">...</div>
<div data-qay-page="About" data-qay-slug="about">...</div>

Generate multiple pages when the request naturally needs them. Keep Homepage first. Do not nest page wrappers.

Now generate: [DESCRIBE THE WEBSITE HERE]
```

## Tiny Hook Examples

These examples show hooks only. They are not layout templates.

### Mobile Menu

```html
<button class="md:hidden" data-qay-click="toggle" data-qay-target="#mobile-menu" data-qay-class="hidden">Menu</button>
<div id="mobile-menu" class="hidden fixed inset-0 z-50 flex flex-col bg-black text-white md:hidden"></div>
```

### Ecommerce Card

```html
<article data-qay-commerce="product-card" data-qay-product-id="sample-product-1" data-qay-product-handle="signature-product" data-qay-variant-id="sample-variant-1">
  <div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom">
    <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&auto=format&q=85" alt="Signature product" />
  </div>
  <h2 data-qay-commerce="product-title">Signature product</h2>
  <p data-qay-commerce="product-description">A short product description.</p>
  <span data-qay-commerce="product-price">$49</span>
  <button type="button" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">Add to cart</button>
</article>
```

### Auth Form

```html
<form data-qay-site-auth-form="signin">
  <input name="email" type="email" placeholder="you@example.com" />
  <input name="password" type="password" placeholder="Password" />
  <button type="submit">Sign in</button>
  <p data-qay-site-auth-error hidden></p>
  <p data-qay-site-auth-success hidden></p>
  <a href="/forgot-password">Forgot password?</a>
</form>
```
