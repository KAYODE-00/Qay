import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getFaqTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);

  const layouts = [
    // 0. Sleek details accordion cards
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-4xl">
        <div class="text-center max-w-2xl mx-auto mb-16" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}">COMMON QUESTIONS</p>
          <h2 class="mt-4 text-3xl font-black sm:text-4xl md:text-5xl" data-qm="faq-title">Frequently Asked Questions</h2>
        </div>
        <div class="space-y-4">
          <details class="group rounded-2xl border ${style.border} ${style.bgInner} p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary class="flex justify-between items-center gap-4 text-lg font-bold">
              <span>How do I customize a section?</span>
              <span class="text-zinc-400 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p class="mt-4 text-sm leading-relaxed ${style.textMuted}">
              You can open the editor panel inside QAY and directly type or code HTML sections. Custom attributes like data-qay-animate and data-qay-hover make adding GSAP animations simple.
            </p>
          </details>
          <details class="group rounded-2xl border ${style.border} ${style.bgInner} p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary class="flex justify-between items-center gap-4 text-lg font-bold">
              <span>Are these layouts responsive?</span>
              <span class="text-zinc-400 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p class="mt-4 text-sm leading-relaxed ${style.textMuted}">
              Yes, all templates are built using mobile-first Tailwind utility classes. They adjust smoothly from compact mobile views to wide desktop layouts.
            </p>
          </details>
        </div>
      </div>
    </section>`,

    // 1. Two-Column FAQ Grid
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">RESOURCES</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="faq-title">Got questions?</h2>
          </div>
          <p class="text-base ${style.textMuted} lg:pt-8">
            Here are some quick details to help you understand how QAY assemblies work. For further support, contact our Lekki team.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8" ${style.hover}>
            <h3 class="text-lg font-bold">Can I export the code?</h3>
            <p class="mt-4 text-sm leading-relaxed ${style.textMuted}">
              Absolutely. When you save your site, you can view the fully assembled HTML package or connect it to your database.
            </p>
          </article>
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8" ${style.hover}>
            <h3 class="text-lg font-bold">What is the hosting setup?</h3>
            <p class="mt-4 text-sm leading-relaxed ${style.textMuted}">
              Your pages compile to highly optimized NextJS pages which host beautifully on Vercel, Netlify, or standard VPS instances.
            </p>
          </article>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
