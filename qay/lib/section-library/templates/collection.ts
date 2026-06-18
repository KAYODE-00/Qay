import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getCollectionTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const arrowIcon = ICONS.arrowRight('size-4 ml-1 inline');

  const layouts = [
    // 0. Three-Column Capsule Drop Cards
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <h2 class="text-4xl font-black md:text-5xl lg:text-6xl leading-none" data-qm="collection-title">Curated Drops</h2>
          <p class="text-base ${style.textMuted} md:pt-6">
            Explore seasonal apparel drops made with premium, sustainable fabrics and cut for high-contrast daily wear.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article class="group overflow-hidden ${style.rounded} border ${style.border} ${style.bgInner}" ${style.hover}>
            <div class="overflow-hidden relative aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&auto=format&q=85" alt="Summer Capsule" class="size-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
            <div class="p-6">
              <span class="text-xs font-bold uppercase tracking-widest ${style.accentText}">DROP 01</span>
              <h3 class="mt-2 text-2xl font-black">Summer Capsule</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Lightweight fabrics designed for heat.</p>
            </div>
          </article>
          <article class="group overflow-hidden ${style.rounded} border ${style.border} ${style.bgInner} md:translate-y-8" ${style.hover}>
            <div class="overflow-hidden relative aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&q=85" alt="Core Apparel" class="size-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
            <div class="p-6">
              <span class="text-xs font-bold uppercase tracking-widest ${style.accentText}">CORE</span>
              <h3 class="mt-2 text-2xl font-black">Essential Apparel</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Daily heavy fleece and vintage tees.</p>
            </div>
          </article>
          <article class="group overflow-hidden ${style.rounded} border ${style.border} ${style.bgInner}" ${style.hover}>
            <div class="overflow-hidden relative aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&q=85" alt="Utility Fit" class="size-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
            <div class="p-6">
              <span class="text-xs font-bold uppercase tracking-widest ${style.accentText}">LIMITED</span>
              <h3 class="mt-2 text-2xl font-black">Utility Cargo Capsule</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Multi-pocket pants and outerwear drops.</p>
            </div>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Immersive Full-Width Grid
    `<section class="relative min-h-[500px] bg-zinc-950 text-white flex items-center overflow-hidden">
      <div class="absolute inset-0 size-full overflow-hidden" data-qay-scroll="parallax" data-qay-y="60">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&q=85" alt="Collection Drop" class="absolute inset-0 size-full object-cover opacity-50 scale-105" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
        <div class="max-w-xl space-y-6" ${style.animate}>
          <span class="text-xs uppercase bg-white/10 px-3.5 py-1.5 rounded-full font-black tracking-widest text-white">SEASONAL CAPSULE</span>
          <h2 class="text-4xl font-black sm:text-5xl md:text-6xl tracking-tight leading-none" data-qm="collection-title">The Vintage Athletic Drop</h2>
          <p class="text-zinc-300 text-base leading-relaxed">
            Inspired by classic track collections. Made with pre-shrunk organic loopback terry and heavy rib cuffs.
          </p>
          <a href="/shop" class="inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-xs font-bold text-zinc-950 hover:bg-zinc-100 transition shadow-lg">
            Discover Drop ${arrowIcon}
          </a>
        </div>
      </div>
    </section>`,

    // 2. Circular Category Caps
    `<section class="${style.bg} px-6 py-20 transition-colors duration-300">
      <div class="mx-auto max-w-7xl text-center">
        <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}" data-qm="collection-eyebrow">CAPSULES</p>
        <h2 class="mt-4 text-3xl font-black sm:text-4xl md:text-5xl" data-qm="collection-title">Shop by capsule type</h2>
        <div class="mt-16 grid gap-8 grid-cols-2 md:grid-cols-4">
          <a href="/shop" class="group block">
            <div class="aspect-square rounded-full overflow-hidden border ${style.border} ${style.bgInner} flex items-center justify-center p-6 transition duration-300 group-hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&q=85" class="aspect-square w-full object-cover rounded-full group-hover:scale-105 transition duration-300" alt="Hoodies" />
            </div>
            <p class="mt-4 text-xs font-bold uppercase tracking-wider">Hoodies</p>
          </a>
          <a href="/shop" class="group block">
            <div class="aspect-square rounded-full overflow-hidden border ${style.border} ${style.bgInner} flex items-center justify-center p-6 transition duration-300 group-hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&auto=format&q=85" class="aspect-square w-full object-cover rounded-full group-hover:scale-105 transition duration-300" alt="Tees" />
            </div>
            <p class="mt-4 text-xs font-bold uppercase tracking-wider">Tees</p>
          </a>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
