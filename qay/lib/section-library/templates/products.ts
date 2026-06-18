import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getProductsTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const cartIcon = ICONS.arrowRight('size-4 ml-1 inline');

  // We can cycle through 3 main layouts, enhanced by getStyleForIndex
  const layouts = [
    // 0. Classic 4-Column Card Grid
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">NEW RELEASES</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl leading-none" data-qm="products-title">The Seasonal Drop</h2>
          </div>
          <a href="/shop" class="inline-flex items-center rounded-xl border ${style.border} px-5 py-3 text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">
            Shop All &rarr;
          </a>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-qay-commerce="product-grid">
          <article class="overflow-hidden ${style.rounded} border ${style.border} ${style.bgInner} flex flex-col justify-between" data-qay-commerce="product-card" data-qay-product-id="prod-1" data-qay-product-handle="product-1" ${style.hover}>
            <div class="overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&q=85" alt="Premium Hoodie" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" data-qay-commerce="product-image" />
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold" data-qay-commerce="product-title">Premium heavy hoodie</h3>
              <p class="mt-2 text-xs ${style.textMuted}" data-qay-commerce="product-description">Heavy cotton oversized fit.</p>
              <div class="mt-6 flex items-center justify-between gap-4">
                <span class="text-lg font-black" data-qay-commerce="product-price">$88</span>
                <button type="button" class="rounded-lg ${style.accentBg} ${style.accentHoverBg} px-4 py-2 text-xs font-bold text-white transition-all shadow-md" data-qay-commerce="add-to-cart" data-qay-product-id="prod-1">
                  Add to cart
                </button>
              </div>
            </div>
          </article>
          <article class="overflow-hidden ${style.rounded} border ${style.border} ${style.bgInner} flex flex-col justify-between" data-qay-commerce="product-card" data-qay-product-id="prod-2" data-qay-product-handle="product-2" ${style.hover}>
            <div class="overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&q=85" alt="Street Tee" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" data-qay-commerce="product-image" />
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold" data-qay-commerce="product-title">Signature boxy tee</h3>
              <p class="mt-2 text-xs ${style.textMuted}" data-qay-commerce="product-description">Organic raw cotton fabrication.</p>
              <div class="mt-6 flex items-center justify-between gap-4">
                <span class="text-lg font-black" data-qay-commerce="product-price">$42</span>
                <button type="button" class="rounded-lg ${style.accentBg} ${style.accentHoverBg} px-4 py-2 text-xs font-bold text-white transition-all shadow-md" data-qay-commerce="add-to-cart" data-qay-product-id="prod-2">
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Split Hero Product Highlight
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
        <div ${style.animate}>
          <div class="flex items-center gap-2 mb-6">
            <span class="h-1.5 w-8 ${style.accentBg} rounded-full"></span>
            <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}" data-qm="products-eyebrow">HOT ITEM</p>
          </div>
          <h2 class="text-4xl font-black sm:text-5xl md:text-6xl leading-tight" data-qm="products-title">
            The Premium Heavyweight Cargo
          </h2>
          <p class="mt-6 text-base ${style.textMuted} max-w-md" data-qm="products-subtitle">
            Crafted for ultimate versatility, utility, and daily movement. Features reinforced pockets, drawstring waist, and relaxed shapes.
          </p>
          <div class="mt-10 flex items-center gap-6" data-qay-commerce="product-card" data-qay-product-id="prod-3" data-qay-product-handle="product-3">
            <span class="text-3xl font-black" data-qay-commerce="product-price">$78</span>
            <button type="button" class="rounded-xl ${style.accentBg} ${style.accentHoverBg} px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105" data-qay-commerce="add-to-cart" data-qay-product-id="prod-3">
              Purchase Now
            </button>
          </div>
        </div>
        <div class="relative overflow-hidden ${style.rounded}" ${style.scroll}>
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&q=85" alt="Cargo Pants" class="aspect-[4/3] w-full object-cover shadow-2xl ${style.rounded}" data-qay-commerce="product-image" />
        </div>
      </div>
    </section>`,

    // 2. Horizontal Scroll Ribbon Layout
    `<section class="${style.bg} px-6 py-20 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 flex items-center justify-between">
          <h2 class="text-2xl font-black uppercase tracking-wider" data-qm="products-title">Trending Now</h2>
          <span class="text-xs uppercase bg-zinc-550/15 ${style.accentText} px-3 py-1 rounded-full font-bold tracking-widest">Active Stock</span>
        </div>
        <div class="flex overflow-x-auto gap-6 pb-8 scrollbar-hide" data-qay-commerce="product-grid">
          <article class="min-w-[290px] w-[290px] rounded-2xl border ${style.border} ${style.bgInner} p-4 shrink-0 flex flex-col justify-between" data-qay-commerce="product-card" data-qay-product-id="prod-4" data-qay-product-handle="product-4">
            <div class="overflow-hidden rounded-xl">
              <img src="https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&auto=format&q=85" alt="Cap" class="aspect-square w-full object-cover" data-qay-commerce="product-image" />
            </div>
            <div class="mt-4">
              <h3 class="font-bold text-base" data-qay-commerce="product-title">Retro strapback cap</h3>
              <p class="mt-2 text-sm font-black ${style.accentText}" data-qay-commerce="product-price">$34</p>
              <button type="button" class="mt-4 w-full rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 py-3 text-xs font-bold transition-all" data-qay-commerce="add-to-cart" data-qay-product-id="prod-4">
                Add to cart
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
