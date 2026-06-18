import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getMenuTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const arrowIcon = ICONS.arrowRight('size-4 ml-1 inline');

  const layouts = [
    // 0. Three-Column Category Menu
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}">FRESH INGREDIENTS</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl lg:text-6xl leading-none" data-qm="menu-title">Curated Plates</h2>
          </div>
          <p class="max-w-2xl text-base ${style.textMuted} lg:pt-10">
            A seasonal menu focusing on local ingredients, dynamic cooking methods, and striking presentations.
          </p>
        </div>
        <div class="grid gap-6 lg:grid-cols-3">
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8" ${style.hover}>
            <p class="text-sm font-bold uppercase tracking-wider ${style.accentText}">Starters</p>
            <div class="mt-8 space-y-6">
              <div class="flex justify-between gap-4 border-b border-zinc-200/20 pb-4">
                <div>
                  <h3 class="font-bold text-lg">Crispy Prawns</h3>
                  <p class="mt-1 text-xs ${style.textMuted}">Chili citrus glaze, toasted sesame seeds.</p>
                </div>
                <span class="font-bold text-lg">$19</span>
              </div>
              <div class="flex justify-between gap-4">
                <div>
                  <h3 class="font-bold text-lg">Whipped Ricotta</h3>
                  <p class="mt-1 text-xs ${style.textMuted}">Sourdough, local honey, wild herbs.</p>
                </div>
                <span class="font-bold text-lg">$15</span>
              </div>
            </div>
          </article>
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8" ${style.hover}>
            <p class="text-sm font-bold uppercase tracking-wider ${style.accentText}">Mains</p>
            <div class="mt-8 space-y-6">
              <div class="flex justify-between gap-4 border-b border-zinc-200/20 pb-4">
                <div>
                  <h3 class="font-bold text-lg">Dry Aged Ribeye</h3>
                  <p class="mt-1 text-xs ${style.textMuted}">Brown butter herb jus, roasted marrow.</p>
                </div>
                <span class="font-bold text-lg">$42</span>
              </div>
              <div class="flex justify-between gap-4">
                <div>
                  <h3 class="font-bold text-lg">Line Caught Sea Bass</h3>
                  <p class="mt-1 text-xs ${style.textMuted}">Citrus salad, roasted green chili salsa.</p>
                </div>
                <span class="font-bold text-lg">$36</span>
              </div>
            </div>
          </article>
          <article class="rounded-3xl ${style.accentBg} p-8 text-white flex flex-col justify-between" ${style.hover}>
            <div>
              <p class="text-sm font-bold uppercase tracking-wider opacity-75">Chef's Special</p>
              <h3 class="mt-12 text-3xl font-black leading-tight">Taste the whole experience with our Chef's Tasting Menu.</h3>
            </div>
            <a href="/contact" class="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition hover:scale-102">
              Book Tasting ${arrowIcon}
            </a>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Grid List Menu
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[380px_1fr]">
        <aside class="rounded-3xl ${style.bgInner} border ${style.border} p-8 self-start" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">KITCHEN LIST</p>
          <h2 class="mt-4 text-3xl font-black leading-tight" data-qm="menu-title">An edited collection of plates</h2>
          <p class="mt-5 text-sm leading-relaxed ${style.textMuted}">
            Every item is hand-selected and prepared from scratch each morning. Clean presentations and rich seasoning.
          </p>
        </aside>
        <div class="space-y-4">
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 transition duration-300 hover:shadow-md">
            <div class="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 class="text-lg font-bold">Pan-Seared Scallops</h3>
                <p class="mt-2 text-sm ${style.textMuted}">Squash puree, crispy pancetta, sage brown butter.</p>
              </div>
              <p class="text-xl font-black ${style.accentText}">$24</p>
            </div>
          </div>
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 transition duration-300 hover:shadow-md">
            <div class="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 class="text-lg font-bold">Heritage Pork Chop</h3>
                <p class="mt-2 text-sm ${style.textMuted}">Apple fennel compote, charred broccolini.</p>
              </div>
              <p class="text-xl font-black ${style.accentText}">$34</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 2. Immersive Split Tasting Menu
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="overflow-hidden ${style.rounded} border ${style.border} ${style.bgInner}">
          <div class="grid lg:grid-cols-2">
            <div class="overflow-hidden relative min-h-[400px]">
              <img src="${vars.galleryImage}" alt="Tasting Room" class="absolute inset-0 size-full object-cover transition duration-700 hover:scale-103" />
            </div>
            <div class="p-8 md:p-16 flex flex-col justify-center">
              <span class="text-xs font-bold uppercase tracking-widest ${style.accentText}">TASTING FLIGHT</span>
              <h2 class="mt-4 text-3xl font-black md:text-5xl" data-qm="menu-title">Five courses, one evening.</h2>
              <div class="mt-8 space-y-6">
                <p class="border-b ${style.border} pb-4 flex gap-4 text-base"><span class="font-bold text-zinc-400">01</span> Citrus Hamachi Crudo</p>
                <p class="border-b ${style.border} pb-4 flex gap-4 text-base"><span class="font-bold text-zinc-400">02</span> Hand Cut Tagliolini & Truffles</p>
                <p class="border-b ${style.border} pb-4 flex gap-4 text-base"><span class="font-bold text-zinc-400">03</span> Dry Aged Duck Breast</p>
                <p class="border-b ${style.border} pb-4 flex gap-4 text-base"><span class="font-bold text-zinc-400">04</span> Selection of Farmhouse Cheese</p>
              </div>
              <p class="mt-10 text-3xl font-black" data-qm="menu-price">$110 per guest</p>
            </div>
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
