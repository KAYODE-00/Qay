import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getGalleryTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const arrowIcon = ICONS.arrowRight('size-4 ml-1 inline');

  const layouts = [
    // 0. Bento Grid Gallery with staggered entrance
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">PORTFOLIO SHOTS</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl leading-tight" data-qm="gallery-title">Visual Rhythm</h2>
          </div>
          <p class="max-w-md text-sm ${style.textMuted}">
            A gallery grid showcasing visual layout components in context, using pre-configured styling layers.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-4">
          <article class="overflow-hidden ${style.rounded} md:col-span-2 md:row-span-2 relative group" ${style.hover}>
            <img src="${vars.galleryImage}" alt="Detail Image" class="h-full min-h-[480px] w-full object-cover transition duration-500 group-hover:scale-103" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
              <span class="text-xs uppercase bg-white/10 px-2 py-1 rounded w-max">SCENE 01</span>
              <h3 class="text-xl font-bold mt-2">Finished Assembly</h3>
            </div>
          </article>
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <span class="text-4xl font-black ${style.accentText}">A</span>
            <div>
              <h3 class="text-lg font-bold">Concept Layouts</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Structured components that lock together.</p>
            </div>
          </article>
          <article class="overflow-hidden ${style.rounded} relative group" ${style.hover}>
            <img src="${vars.heroImage}" alt="Action Shot" class="h-64 w-full object-cover transition duration-500 group-hover:scale-103" />
          </article>
          <article class="rounded-3xl ${style.accentBg} p-8 text-white flex flex-col justify-between" ${style.hover}>
            <span class="text-xs font-bold uppercase tracking-wider opacity-75">FEATURED</span>
            <p class="text-xl font-black leading-tight mt-12">Polished sections built to impress immediately.</p>
          </article>
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <span class="text-4xl font-black ${style.accentText}">B</span>
            <div>
              <h3 class="text-lg font-bold">Contrast Rhythms</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Carefully tuned margins and paddings.</p>
            </div>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Asymmetric Masonry Scroll Reveal Gallery
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 text-center max-w-2xl mx-auto" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}">SCENE CAPTURES</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="gallery-title">Capturing raw details in context</h2>
        </div>
        <div class="grid gap-8 md:grid-cols-2">
          <div class="space-y-8">
            <div class="overflow-hidden ${style.rounded} border ${style.border} group" ${style.hover}>
              <img src="${vars.galleryImage}" alt="Detail A" class="h-96 w-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
            <div class="overflow-hidden ${style.rounded} border ${style.border} group" ${style.hover}>
              <img src="${vars.heroImage}" alt="Detail B" class="h-[520px] w-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
          </div>
          <div class="space-y-8 md:pt-16">
            <div class="overflow-hidden ${style.rounded} border ${style.border} group" ${style.hover}>
              <img src="${vars.heroImage}" alt="Detail C" class="h-96 w-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
            <div class="overflow-hidden ${style.rounded} border ${style.border} group" ${style.hover}>
              <img src="${vars.galleryImage}" alt="Detail D" class="h-[480px] w-full object-cover transition duration-500 group-hover:scale-103" />
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 2. High-End Duotone Cards
    `<section class="${style.bg} px-6 py-20 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 md:grid-cols-3">
          <div class="overflow-hidden ${style.rounded} border ${style.border} flex flex-col justify-end min-h-[440px] relative p-8 group" ${style.hover}>
            <img src="${vars.galleryImage}" class="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" alt="Scene A" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div class="relative text-white z-10">
              <span class="text-xs uppercase bg-white/10 px-2 py-1 rounded font-bold">01 / CONCEPT</span>
              <h3 class="text-2xl font-black mt-3">Visual Craft</h3>
            </div>
          </div>
          <div class="overflow-hidden ${style.rounded} border ${style.border} flex flex-col justify-end min-h-[440px] relative p-8 group" ${style.hover}>
            <img src="${vars.heroImage}" class="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" alt="Scene B" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div class="relative text-white z-10">
              <span class="text-xs uppercase bg-white/10 px-2 py-1 rounded font-bold">02 / STUDIO</span>
              <h3 class="text-2xl font-black mt-3">Design Systems</h3>
            </div>
          </div>
          <div class="overflow-hidden ${style.rounded} border ${style.border} flex flex-col justify-end min-h-[440px] relative p-8 group" ${style.hover}>
            <img src="${vars.galleryImage}" class="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" alt="Scene C" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div class="relative text-white z-10">
              <span class="text-xs uppercase bg-white/10 px-2 py-1 rounded font-bold">03 / PRODUCTION</span>
              <h3 class="text-2xl font-black mt-3">Final Assemblies</h3>
            </div>
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
