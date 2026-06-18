import { callWithFallbackDetailed } from '@/qay/lib/ai/providers';
import { getLibraryForType } from '@/qay/lib/section-library';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '@/qay/lib/section-library/types';
import type { AssemblyResult, QmSection, QmTheme, SectionType, SiteType } from '@/qay/lib/section-library/types';

export function detectSiteType(prompt: string): SiteType {
  const normalized = prompt.toLowerCase();
  let bestMatch: SiteType = 'agency';
  let bestScore = 0;

  for (const [siteType, keywords] of Object.entries(SITE_TYPE_KEYWORDS)) {
    const score = keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = siteType as SiteType;
    }
  }

  return bestMatch;
}

export async function pickTheme(prompt: string, themes: QmTheme[]) {
  const normalized = prompt.toLowerCase();
  const scored = themes
    .map((theme) => ({
      theme,
      score: theme.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || b.theme.rank - a.theme.rank);

  return scored[0]?.theme || themes[0];
}

export function pickSection(prompt: string, sectionType: SectionType, availableSections: QmSection[]) {
  const normalized = prompt.toLowerCase();
  const scored = [...availableSections]
    .map((section) => ({
      section,
      score: section.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || b.section.rank - a.section.rank);

  if (!scored.length) return undefined;

  const topScore = scored[0].score;
  const pool = scored
    .filter((item) => item.score === topScore)
    .slice(0, Math.min(20, scored.length));
  // Random selection from matching pool — ensures different layouts on each generation
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex]?.section;
}

function extractBusinessName(prompt: string) {
  const quoted = prompt.match(/["'“”‘’]([^"'“”‘’]{2,80})["'“”‘’]/)?.[1];
  if (quoted) return quoted.trim();

  const called = prompt.match(/\b(?:called|named|brand called|brand named|for)\s+([A-Z][A-Za-z0-9&'. -]{2,60})/)?.[1];
  if (called) return called.replace(/\b(that|which|with|and)\b.*$/i, '').trim();

  return '';
}

function deterministicCopy(prompt: string, siteType: SiteType): Record<string, string> {
  const name = extractBusinessName(prompt);
  const brand = name || (
    siteType === 'restaurant' ? 'Maison Kairo'
      : siteType === 'ecommerce' ? 'ARYKTEEMAH'
        : 'QAY Studio'
  );
  const industryCopy: Partial<Record<SiteType, { title: string; subtitle: string; about: string }>> = {
    agency: {
      title: `${brand} turns unclear offers into brands people remember.`,
      subtitle: 'Strategy, identity, web design, and launch systems for teams that need sharper positioning and better conversion.',
      about: `${brand} works from audience insight to visual system, then turns the strategy into pages, assets, and launch details that feel finished.`,
    },
    saas: {
      title: `${brand} helps teams see the work, automate the handoff, and move faster.`,
      subtitle: 'A focused product website for workflows, dashboards, integrations, pricing, and proof that speaks to modern operators.',
      about: `${brand} brings messy team processes into one calmer operating system with analytics, automations, permissions, and clear next steps.`,
    },
    portfolio: {
      title: `${brand} presents selected work with clarity, texture, and point of view.`,
      subtitle: 'A portfolio built around case studies, craft, process, proof, and a direct path for the right collaborators to reach out.',
      about: `${brand} balances visual taste with practical outcomes, showing not only what was made but why the work mattered.`,
    },
    law: {
      title: `${brand} gives clients steady counsel when the stakes are high.`,
      subtitle: 'A confident legal website for practice areas, attorney trust, consultation requests, and proof of disciplined representation.',
      about: `${brand} combines careful preparation, direct communication, and courtroom-ready strategy for clients who need serious legal support.`,
    },
    medical: {
      title: `${brand} makes healthcare feel clearer, calmer, and easier to access.`,
      subtitle: 'A patient-first website for services, practitioners, appointments, location details, and trustworthy care information.',
      about: `${brand} helps patients understand their options, book confidently, and feel supported before they arrive.`,
    },
    hotel: {
      title: `${brand} creates stays that feel considered from arrival to checkout.`,
      subtitle: 'A hospitality website for rooms, amenities, gallery, booking prompts, guest reviews, and location storytelling.',
      about: `${brand} blends comfort, service, and place into a stay guests can picture before they book.`,
    },
    'real-estate': {
      title: `${brand} helps buyers find the right property with less noise.`,
      subtitle: 'A real estate website for listings, agent proof, neighborhood expertise, property galleries, and qualified inquiries.',
      about: `${brand} pairs local knowledge with clear presentation so buyers, sellers, and renters know what to do next.`,
    },
    education: {
      title: `${brand} helps learners build skills they can prove.`,
      subtitle: 'A course and academy website for programs, instructors, outcomes, pricing, student proof, and enrollment.',
      about: `${brand} turns learning goals into structured paths with practical modules, support, and measurable progress.`,
    },
    event: {
      title: `${brand} gives the event a reason to be on the calendar.`,
      subtitle: 'An event website for date, venue, speakers, schedule, RSVP, tickets, sponsors, and the energy of the room.',
      about: `${brand} brings people together around a clear agenda, strong venue details, and a simple path to attend.`,
    },
    beauty: {
      title: `${brand} makes booking beauty services feel polished and personal.`,
      subtitle: 'A salon and spa website for services, gallery, specialists, packages, reviews, and appointment requests.',
      about: `${brand} combines technique, hospitality, and a refined client experience from booking to final look.`,
    },
    fitness: {
      title: `${brand} helps members train with structure, energy, and accountability.`,
      subtitle: 'A fitness website for programs, class schedules, trainers, pricing, testimonials, and booking.',
      about: `${brand} turns motivation into repeatable training through coaching, community, and visible progress.`,
    },
    church: {
      title: `${brand} welcomes people into worship, community, and service.`,
      subtitle: 'A ministry website for service times, groups, events, leadership, giving, and first-time visitors.',
      about: `${brand} helps people find belonging, take next steps, and stay connected through the week.`,
    },
    blog: {
      title: `${brand} publishes stories with a clear editorial voice.`,
      subtitle: 'A publication website for featured articles, categories, newsletter capture, author trust, and readable archives.',
      about: `${brand} gives readers a consistent place for sharp ideas, useful context, and original perspective.`,
    },
    nonprofit: {
      title: `${brand} turns attention into action that reaches people.`,
      subtitle: 'A nonprofit website for mission storytelling, donations, volunteers, impact metrics, campaigns, and trust.',
      about: `${brand} makes the need clear, the work visible, and the next act of support easy to take.`,
    },
    construction: {
      title: `${brand} builds with discipline, documentation, and visible standards.`,
      subtitle: 'A construction website for services, project galleries, safety proof, estimates, team credibility, and commercial leads.',
      about: `${brand} keeps clients informed from scope to handoff with clean project management and dependable crews.`,
    },
    'tech-startup': {
      title: `${brand} explains a technical product without losing the human reason to care.`,
      subtitle: 'A startup website for product positioning, proof, integrations, waitlists, pricing, and investor-ready clarity.',
      about: `${brand} connects technical depth to a clear use case so buyers understand the value quickly.`,
    },
    photography: {
      title: `${brand} frames moments with atmosphere, patience, and intent.`,
      subtitle: 'A photography website for galleries, services, booking, testimonials, portfolio proof, and contact.',
      about: `${brand} creates images that feel honest, composed, and useful for personal, editorial, and commercial stories.`,
    },
    music: {
      title: `${brand} gives the sound a home for releases, shows, and fans.`,
      subtitle: 'A music website for tour dates, releases, gallery, newsletter, press details, and listening CTAs.',
      about: `${brand} brings the artist world together: sound, visuals, dates, story, and the next way to listen.`,
    },
  };

  if (siteType === 'restaurant') {
    return {
      'brand-name': brand,
      'hero-title': `${brand} serves food with memory, heat, and occasion.`,
      'hero-subtitle': 'A polished dining experience with signature plates, warm service, and a menu shaped by local ingredients.',
      'menu-title': 'Dishes guests come back for',
      'about-title': 'A kitchen rooted in place.',
      'about-copy': `${brand} turns familiar flavors into a full evening: sharp seasoning, careful sourcing, generous portions, and service that makes the room feel personal.`,
      'contact-title': 'Reserve your table',
      'footer-brand': brand,
    };
  }

  if (siteType === 'ecommerce') {
    const isStreetwear = /streetwear|urban|clothing|fashion|hoodie|t-?shirt|jogger|cap|sneaker|afro|youth|drop|hype/i.test(prompt);

    if (isStreetwear) {
      return {
        'brand-name': brand,
        'hero-eyebrow': 'Urban luxury streetwear',
        'hero-title': `Welcome to ${brand}`,
        'hero-subtitle': 'Wear the culture. Own the streets.',
        'features-title': 'Drops built for movement, attitude, and everyday flex',
        'about-title': `${brand} carries street culture from the block to the world.`,
        'about-copy': `${brand} blends Afro-fusion energy, luxury streetwear silhouettes, and limited-drop urgency for customers who dress like the city is watching.`,
        'contact-title': `Reach ${brand}`,
        'footer-brand': brand,
      };
    }

    return {
      'brand-name': brand,
      'hero-title': `${brand} creates objects with presence.`,
      'hero-subtitle': 'A curated online store for pieces that feel considered, tactile, and worth returning to.',
      'footer-brand': brand,
    };
  }

  const copy = industryCopy[siteType];
  if (copy) {
    return {
      'brand-name': brand,
      'hero-title': copy.title,
      'hero-subtitle': copy.subtitle,
      'about-title': `Why ${brand} works`,
      'about-copy': copy.about,
      'features-title': `What ${brand} does best`,
      'contact-title': `Start with ${brand}`,
      'footer-brand': brand,
    };
  }

  return {
    'brand-name': brand,
    'hero-title': `${brand} is built to look clear, credible, and ready to launch.`,
    'hero-subtitle': 'A focused website with strong positioning, useful sections, and editable content for the next stage.',
    'about-title': 'A sharper way to show the work.',
    'about-copy': `${brand} gets a complete page structure with copy, visuals, calls to action, and room to grow.`,
    'footer-brand': brand,
  };
}

function materializeThemeVariables(html: string, theme: QmTheme) {
  return Object.entries(theme.css_variables).reduce((current, [key, value]) => (
    current.replaceAll(`var(${key})`, value)
  ), html);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replaceTextZones(html: string, replacements: Record<string, string>) {
  let updated = html;
  for (const [zone, text] of Object.entries(replacements)) {
    const pattern = new RegExp(`(data-qm="${zone}"[^>]*>)[^<]*(<)`, 'g');
    updated = updated.replace(pattern, `$1${escapeHtml(text)}$2`);
  }
  return updated;
}

async function aiCopyOverrides(html: string, prompt: string, siteType: SiteType) {
  const zones: Record<string, string> = {};
  for (const match of html.matchAll(/data-qm="([^"]+)"[^>]*>([^<]*)</g)) {
    zones[match[1]] = match[2].trim();
  }

  if (!Object.keys(zones).length || prompt.length > 2800 || process.env.QAY_SECTION_ASSEMBLER_AI_COPY === 'false') return {};

  try {
    const result = await callWithFallbackDetailed<Record<string, string>>(
      `User prompt: "${prompt}"\nSite type: ${siteType}\n\nRewrite these website text zones with concise, specific copy for the requested brand. Return only JSON.\n${JSON.stringify(zones, null, 2)}`,
      'Return only a JSON object of text replacements. No markdown.',
      (text) => JSON.parse(text.trim().replace(/^```json\n?/i, '').replace(/\n?```$/i, ''))
    );
    return result.value || {};
  } catch (error) {
    console.warn('[QAY Section Assembler] AI copy personalization skipped:', error);
    return {};
  }
}

async function personalizeSections(html: string, prompt: string, siteType: SiteType, theme: QmTheme) {
  const deterministic = deterministicCopy(prompt, siteType);
  const aiOverrides = await aiCopyOverrides(html, prompt, siteType);
  const copied = materializeThemeVariables(
    replaceTextZones(html, { ...deterministic, ...aiOverrides }),
    theme
  );
  const cssVars = Object.entries(theme.css_variables).map(([key, value]) => `  ${key}: ${value};`).join('\n');
  const fontLinks = theme.google_fonts.length
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?${theme.google_fonts.map((font) => `family=${font}`).join('&')}&display=swap" rel="stylesheet">`
    : '';

  return `${fontLinks}
<style>
:root {
${cssVars}
}
body {
  background: var(--qm-bg);
  color: var(--qm-text);
  font-family: var(--qm-body-font);
}
</style>
${copied}`;
}

function pageWrapper(name: string, slug: string, html: string) {
  return `<div data-qay-page="${name}" data-qay-slug="${slug}">\n${html.trim()}\n</div>`;
}

function shouldGenerateMultiPage(prompt: string, siteType: SiteType) {
  // Only return false if user EXPLICITLY requests a single page
  if (/\bsingle[- ]page\b|\bone page\b|\blanding page only\b|\blanding\b/i.test(prompt)) return false;
  // Default to multi-page for all site types
  return true;
}

function productCard(id: string, name: string, price: string, description: string, image: string) {
  const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `<article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-commerce="product-card" data-qay-product-id="${id}" data-qay-product-handle="${handle}" data-qay-hover="luxe-lift"><div class="overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom"><img src="${image}" alt="${name}" class="aspect-[4/5] w-full object-cover" /></div><div class="p-5"><h3 class="text-xl font-black" data-qay-commerce="product-title">${name}</h3><p class="mt-2 text-sm leading-6 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">${description}</p><div class="mt-5 flex items-center justify-between gap-3"><span class="font-black" data-qay-commerce="product-price">${price}</span><button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-3 text-sm font-bold text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="${id}">Add to cart</button></div></div></article>`;
}

function ecommerceExtraPages(theme: QmTheme) {
  const pageClass = `min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] ${theme.is_dark ? 'dark:bg-[#050505] dark:text-white' : 'dark:bg-[#0d0d0d] dark:text-white'}`;
  const heroImage = 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1400&auto=format&q=85';
  const hoodieImage = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&auto=format&q=85';
  const shirtImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&q=85';
  const capImage = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&auto=format&q=85';
  const joggerImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&q=85';
  const nav = `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="text-lg font-black uppercase tracking-[0.18em]" data-qm="brand-name">Baddo World</a><div class="hidden items-center gap-6 text-sm font-bold md:flex"><a href="/shop">Shop</a><a href="/collections">Collections</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/cart" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]">Cart (0)</a></div><button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#store-page-menu" data-qay-class="hidden">Menu</button></div><div id="store-page-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden"><a href="/shop">Shop</a><a href="/collections">Collections</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/cart">Cart</a></div></nav>`;
  const footer = `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-12 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]"><div><p class="text-2xl font-black uppercase tracking-[0.16em]" data-qm="footer-brand">Baddo World</p><p class="mt-4 max-w-sm text-sm leading-6 text-[var(--qm-text-muted)]">Streetwear drops, bold silhouettes, and culture-first essentials built for the city.</p></div><div class="flex flex-col gap-3 text-sm"><a href="/shop">Shop</a><a href="/collections">Collections</a><a href="/about">About</a></div><div class="flex flex-col gap-3 text-sm"><a href="/contact">Contact</a><a href="/checkout">Checkout</a><a href="/login">Account</a></div></div></footer>`;
  const products = `${productCard('sample-product-1', 'Culture Heavy Hoodie', '$88', 'Heavy fleece, oversized hood, gold chest mark.', hoodieImage)}${productCard('sample-product-2', 'Own The Streets Tee', '$42', 'Boxy cotton tee with front and back graphics.', shirtImage)}${productCard('sample-product-3', 'Baddo Cargo Jogger', '$74', 'Relaxed cargo jogger with deep utility pockets.', joggerImage)}${productCard('sample-product-4', 'World Logo Cap', '$34', 'Structured cap with embroidered crest.', capImage)}`;
  const shop = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]"><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5"><p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Filters</p><div class="mt-6 space-y-5 text-sm"><div><p class="font-bold">Category</p><div class="mt-3 flex flex-wrap gap-2"><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">Hoodies</span><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">T-shirts</span><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">Pants</span><span class="rounded-full border border-[var(--qm-border)] px-3 py-1">Caps</span></div></div><div><p class="font-bold">Sort</p><select class="mt-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-3 py-3"><option>Newest</option><option>Price low to high</option><option>Best selling</option></select></div></div></aside><div><h1 class="text-5xl font-black md:text-7xl">Shop the drop</h1><p class="mt-4 max-w-2xl text-[var(--qm-text-muted)]">Hoodies, shirts, joggers, caps, and limited pieces for the next fit check.</p><div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-qay-commerce="product-grid">${products}</div></div></div></section></main>${footer}`;
  const product = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]"><div class="grid gap-4 sm:grid-cols-2"><img src="${hoodieImage}" alt="Culture Heavy Hoodie front" class="h-[520px] w-full rounded-3xl object-cover" /><img src="${heroImage}" alt="Streetwear model wearing hoodie" class="h-[520px] w-full rounded-3xl object-cover" /></div><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7"><p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Limited drop</p><h1 class="mt-4 text-5xl font-black" data-qay-commerce="product-title">Culture Heavy Hoodie</h1><p class="mt-4 text-2xl font-black" data-qay-commerce="product-price">$88</p><p class="mt-5 leading-7 text-[var(--qm-text-muted)]" data-qay-commerce="product-description">Oversized heavyweight fleece cut for cold nights, loud entrances, and street culture in motion.</p><div class="mt-6"><p class="font-bold">Size</p><div class="mt-3 flex gap-2"><button class="rounded-full border border-[var(--qm-border)] px-4 py-2">S</button><button class="rounded-full border border-[var(--qm-border)] px-4 py-2">M</button><button class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-[var(--qm-accent-text)]">L</button><button class="rounded-full border border-[var(--qm-border)] px-4 py-2">XL</button></div></div><div class="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" class="rounded-xl bg-[var(--qm-accent)] px-5 py-4 font-bold text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="sample-product-1">Add to Cart</button><a href="/checkout" class="rounded-xl border border-[var(--qm-border)] px-5 py-4 text-center font-bold">Buy Now</a></div><div class="mt-8 grid gap-3 text-sm text-[var(--qm-text-muted)]"><p>Delivery: ships in 2-5 business days.</p><p>Returns: 14-day exchange on unworn pieces.</p></div></aside></div></section><section class="px-5 pb-20"><div class="mx-auto max-w-7xl"><h2 class="text-3xl font-black">You may also like</h2><div class="mt-6 grid gap-5 md:grid-cols-3" data-qay-commerce="product-grid">${products}</div></div></section></main>${footer}`;
  const cart = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]"><div><h1 class="text-5xl font-black">Cart</h1><div class="mt-8 space-y-4" data-qay-commerce="cart-items"><article class="grid gap-4 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 sm:grid-cols-[120px_1fr_auto]"><img src="${hoodieImage}" alt="Culture Heavy Hoodie" class="h-32 w-full rounded-2xl object-cover" /><div><h2 class="text-xl font-bold">Culture Heavy Hoodie</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Black / Large</p></div><button type="button" data-qay-commerce="remove-from-cart" data-qay-product-id="sample-product-1" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm">Remove</button></article></div></div><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="text-2xl font-black">Order summary</h2><input placeholder="Promo code" class="mt-6 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><div class="mt-6 space-y-3 text-sm"><p class="flex justify-between"><span>Subtotal</span><span>$88</span></p><p class="flex justify-between"><span>Shipping</span><span>$8</span></p><p class="flex justify-between text-xl font-black"><span>Total</span><span>$96</span></p></div><a href="/checkout" data-qay-commerce="checkout-button" class="mt-6 block rounded-xl bg-[var(--qm-accent)] px-5 py-4 text-center font-bold text-[var(--qm-accent-text)]">Checkout</a></aside></div></section></main>${footer}`;
  const checkout = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]"><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Secure checkout</p><h1 class="mt-4 text-5xl font-black">Shipping details</h1><div class="mt-8 grid gap-3 sm:grid-cols-2"><input name="firstName" placeholder="First name" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="lastName" placeholder="Last name" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 sm:col-span-2" /><input name="address" placeholder="Address" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 sm:col-span-2" /></div><div class="mt-6 rounded-2xl border border-[var(--qm-border)] p-4"><p class="font-bold">Payment placeholder</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Stripe / Paystack ready. Connect payment provider before launch.</p></div><button type="submit" class="mt-6 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Place order</button></form><aside class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="text-2xl font-black">Summary</h2><p class="mt-6 rounded-2xl bg-[var(--qm-bg)] p-4 text-sm text-[var(--qm-text-muted)]">Secure checkout. Minimal distraction. Built for Medusa mapping.</p></aside></div></section></main>${footer}`;
  const collections = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto max-w-7xl"><h1 class="text-5xl font-black md:text-7xl">Curated drops</h1><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><img src="${heroImage}" alt="Summer Drop streetwear" class="h-80 w-full object-cover" /><div class="p-6"><h2 class="text-2xl font-black">Summer Drop</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Light layers, loud graphics, and city heat energy.</p></div></article><article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><img src="${hoodieImage}" alt="Baddo Essentials hoodies" class="h-80 w-full object-cover" /><div class="p-6"><h2 class="text-2xl font-black">Baddo Essentials</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Core hoodies, tees, joggers, and caps.</p></div></article><article class="overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)]"><img src="${joggerImage}" alt="Limited Edition drop" class="h-80 w-full object-cover" /><div class="p-6"><h2 class="text-2xl font-black">Limited Edition</h2><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Rare pieces for the fastest hands.</p></div></article></div></div></section></main>${footer}`;
  const about = `${nav}<main class="${pageClass}"><section class="grid min-h-[680px] lg:grid-cols-2"><div class="flex flex-col justify-center px-6 py-20 md:px-16"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Story</p><h1 class="mt-5 text-5xl font-black md:text-7xl" data-qm="about-title">Redefining streetwear culture from the streets to the world.</h1><p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">Baddo World blends Afro-fusion energy, bold cuts, and luxury street attitude for a generation that dresses with confidence.</p></div><img src="${heroImage}" alt="Streetwear brand editorial model" class="h-full min-h-[520px] w-full object-cover" /></section></main>${footer}`;
  const contact = `${nav}<main class="${pageClass}"><section class="px-5 py-16"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div><h1 class="text-5xl font-black md:text-7xl" data-qm="contact-title">Talk to Baddo World</h1><p class="mt-5 text-[var(--qm-text-muted)]">For orders, collaborations, wholesale, styling, and drop questions.</p></div><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea name="message" placeholder="Message" class="h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section></main>${footer}`;

  return [
    pageWrapper('Shop', 'shop', shop),
    pageWrapper('Product', 'product', product),
    pageWrapper('Cart', 'cart', cart),
    pageWrapper('Checkout', 'checkout', checkout),
    pageWrapper('Collections', 'collections', collections),
    pageWrapper('About', 'about', about),
    pageWrapper('Contact', 'contact', contact),
  ].join('\n\n');
}

function genericExtraPages(siteType: SiteType, theme: QmTheme) {
  const pageClass = `min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] ${theme.is_dark ? 'dark:bg-[#050505] dark:text-white' : 'dark:bg-[#0d0d0d] dark:text-white'}`;
  const nav = `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="text-lg font-black" data-qm="brand-name">QAY Studio</a><div class="hidden items-center gap-6 text-sm font-bold md:flex"><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a></div><button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#generic-page-menu" data-qay-class="hidden">Menu</button></div><div id="generic-page-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden"><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a></div></nav>`;
  const footer = `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-12 text-[var(--qm-text)]"><div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between"><p class="font-black" data-qm="footer-brand">QAY Studio</p><div class="flex gap-5 text-sm text-[var(--qm-text-muted)]"><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a></div></div></footer>`;

  const about = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">About</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl" data-qm="about-title">A focused story with real reasons to believe.</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">This page gives the brand room to explain its origin, approach, audience, standards, and next step.</p></div><div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8"><div class="grid gap-4 sm:grid-cols-2"><div class="rounded-2xl bg-[var(--qm-bg)] p-5"><p class="text-3xl font-black">01</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Clear positioning</p></div><div class="rounded-2xl bg-[var(--qm-bg)] p-5"><p class="text-3xl font-black">02</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Proof and credibility</p></div><div class="rounded-2xl bg-[var(--qm-bg)] p-5 sm:col-span-2"><p class="text-3xl font-black">03</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">A conversion path that feels natural.</p></div></div></div></div></section></main>${footer}`;
  const services = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-7xl"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Services</p><h1 class="mt-5 max-w-4xl text-5xl font-black leading-none md:text-7xl" data-qm="features-title">Offer pages that make the work easy to understand.</h1><div class="mt-10 grid gap-5 md:grid-cols-3" data-qay-animate="stagger-children"><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="lift"><h2 class="text-2xl font-black">Strategy</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Positioning, planning, and the first decision path.</p></article><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="lift"><h2 class="text-2xl font-black">Delivery</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Clear process, timelines, and polished outcomes.</p></article><article class="rounded-3xl bg-[var(--qm-accent)] p-6 text-[var(--qm-accent-text)]"><h2 class="text-2xl font-black">Support</h2><p class="mt-3 text-sm leading-6 opacity-80">Follow-through, updates, and next-step guidance.</p></article></div></div></section></main>${footer}`;
  const contact = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Contact</p><h1 class="mt-5 text-5xl font-black leading-none md:text-7xl" data-qm="contact-title">Start the conversation.</h1><p class="mt-5 text-[var(--qm-text-muted)]">Use this page for leads, bookings, inquiries, support, or partnership requests.</p></div><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea name="message" placeholder="Message" class="h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section></main>${footer}`;
  const pricing = `${nav}<main class="${pageClass}"><section class="px-5 py-20"><div class="mx-auto max-w-7xl"><h1 class="text-5xl font-black md:text-7xl">Choose the right path.</h1><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="font-black">Starter</h2><p class="mt-5 text-4xl font-black">$99</p></article><article class="rounded-3xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-6"><h2 class="font-black">Growth</h2><p class="mt-5 text-4xl font-black">$249</p></article><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h2 class="font-black">Custom</h2><p class="mt-5 text-4xl font-black">Talk</p></article></div></div></section></main>${footer}`;

  const pages = [
    pageWrapper('About', 'about', about),
    pageWrapper(siteType === 'saas' || siteType === 'tech-startup' ? 'Features' : 'Services', siteType === 'saas' || siteType === 'tech-startup' ? 'features' : 'services', services),
    pageWrapper('Contact', 'contact', contact),
  ];

  if (siteType === 'saas' || siteType === 'tech-startup' || siteType === 'education') {
    pages.splice(2, 0, pageWrapper('Pricing', 'pricing', pricing));
  }

  return pages.join('\n\n');
}

export async function assembleSiteFromSections(prompt: string, overrideSiteType?: SiteType): Promise<AssemblyResult> {
  const siteType = overrideSiteType || detectSiteType(prompt);
  const { themes, sections } = await getLibraryForType(siteType);
  const theme = await pickTheme(prompt, themes);
  const sectionOrder = SECTION_ORDER[siteType];
  const sectionsUsed: AssemblyResult['sectionsUsed'] = [];
  const htmlParts: string[] = [];

  for (const sectionType of sectionOrder) {
    const themed = sections.filter((section) => section.section_type === sectionType && section.theme_id === theme.theme_id && section.is_active !== false);
    const fallback = sections.filter((section) => section.section_type === sectionType && section.is_active !== false);
    const available = themed.length ? themed : fallback;
    const picked = pickSection(prompt, sectionType, available);
    if (!picked) continue;

    htmlParts.push(picked.html);
    sectionsUsed.push({ type: sectionType, sectionId: picked.id, keywords: picked.keywords });
  }

  const bodyHtml = htmlParts.join('\n\n');
  const html = await personalizeSections(
    shouldGenerateMultiPage(prompt, siteType)
      ? [
        pageWrapper('Homepage', '/', bodyHtml),
        siteType === 'ecommerce' ? ecommerceExtraPages(theme) : genericExtraPages(siteType, theme),
      ].filter(Boolean).join('\n\n')
      : bodyHtml,
    prompt,
    siteType,
    theme
  );

  return {
    html,
    theme,
    sectionsUsed,
    provider: 'section-library',
    siteType,
  };
}
