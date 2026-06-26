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
    </section>`,

    // 2. Vercel-style command accordion
    `<section class="bg-white px-6 py-24 text-black dark:bg-black dark:text-white">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-24 h-fit" data-qay-animate="slide-right" data-qay-duration="0.8" data-qay-x="-36">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">FAQ</p>
          <h2 class="mt-4 max-w-xl text-4xl font-black tracking-tight md:text-6xl" data-qm="faq-title">Answers with no extra noise.</h2>
          <p class="mt-5 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">A sharp accordion block for technical products, agencies, SaaS, ecommerce, and premium service pages.</p>
        </div>
        <div class="space-y-3" data-qay-animate="stagger-children">
          ${[1, 2, 3, 4].map((item) => `
          <article class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <button type="button" class="flex w-full items-center justify-between gap-5 text-left text-base font-bold" data-qay-click="toggle" data-qay-target="#qay-faq-command-${index}-${item}" data-qay-class="hidden" aria-controls="qay-faq-command-${index}-${item}" aria-expanded="false">
              <span>${['How fast can this launch?', 'Can sections be replaced later?', 'Does this support mobile menus?', 'Can AI generate missing parts?'][item - 1]}</span>
              <span class="grid size-8 place-items-center rounded-full border border-zinc-200 text-sm dark:border-zinc-800">+</span>
            </button>
            <div id="qay-faq-command-${index}-${item}" class="hidden pt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              ${['The page is assembled from ready sections first, then customized for the brand and prompt.', 'Yes. Every section remains editable and can be swapped from the QAY section panel.', 'Yes. Navigation sections include QAY toggle hooks for responsive menus.', 'Yes. If a section is not in the library, QAY can generate only that missing section.'][item - 1]}
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>`,

    // 3. Split image accordion with while-scroll media
    `<section class="bg-zinc-950 px-6 py-24 text-white">
      <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <div class="overflow-hidden rounded-[2rem] border border-white/10" data-qay-scroll="shrink" data-qay-scroll-start="top bottom" data-qay-scroll-end="bottom top" data-qay-scroll-scrub="true" data-qay-scale="1.08" data-qay-hover="img-zoom">
          <img src="${vars.galleryImage}" alt="${vars.heroAlt}" class="h-[640px] w-full object-cover opacity-90" />
        </div>
        <div data-qay-animate="slide-left" data-qay-duration="0.9" data-qay-x="42">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-white/40">Support</p>
          <h2 class="mt-4 text-4xl font-black tracking-tight md:text-6xl" data-qm="faq-title">The important details stay visible.</h2>
          <div class="mt-10 divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.04]">
            ${[1, 2, 3].map((item) => `
            <article class="p-5">
              <button type="button" class="flex w-full items-center justify-between gap-4 text-left font-bold" data-qay-click="toggle" data-qay-target="#qay-faq-split-${index}-${item}" data-qay-class="hidden" aria-controls="qay-faq-split-${index}-${item}" aria-expanded="false">
                <span>${['What makes this section premium?', 'Can I use it for services?', 'Will colors adapt?'][item - 1]}</span>
                <span class="text-white/40">+</span>
              </button>
              <div id="qay-faq-split-${index}-${item}" class="hidden pt-4 text-sm leading-6 text-white/55">
                ${['It combines real image hierarchy, scroll motion, restrained borders, and concise answers.', 'Yes. Replace the copy with service objections, booking details, or product questions.', 'The layout uses neutral contrast and can be recolored through QAY theme variables.'][item - 1]}
              </div>
            </article>`).join('')}
          </div>
        </div>
      </div>
    </section>`,

    // 4. Minimal pill accordion
    `<section class="bg-[#fafafa] px-6 py-24 text-black dark:bg-[#050505] dark:text-white">
      <div class="mx-auto max-w-5xl">
        <div class="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-qay-animate="fade-in" data-qay-duration="0.7">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Help center</p>
            <h2 class="mt-4 text-4xl font-black tracking-tight md:text-6xl" data-qm="faq-title">Quick answers, clean rhythm.</h2>
          </div>
          <a href="/contact" class="rounded-full bg-black px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-black" data-qay-hover="scale-btn">Ask a question</a>
        </div>
        <div class="grid gap-3">
          ${[1, 2, 3, 4, 5].map((item) => `
          <article class="rounded-full border border-zinc-200 bg-white px-5 py-4 shadow-sm transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950">
            <button type="button" class="flex w-full items-center justify-between gap-4 text-left text-sm font-bold" data-qay-click="toggle" data-qay-target="#qay-faq-pill-${index}-${item}" data-qay-class="hidden" aria-controls="qay-faq-pill-${index}-${item}" aria-expanded="false">
              <span>${['Is the design responsive?', 'Can I change the copy?', 'Can this be reused?', 'Does it support animations?', 'Can AI make a custom answer block?'][item - 1]}</span>
              <span>+</span>
            </button>
            <div id="qay-faq-pill-${index}-${item}" class="hidden pt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              ${['Yes. The layout keeps mobile spacing tight and desktop width calm.', 'Yes. All visible text is editable after import.', 'Yes. Save it as a component or section variant.', 'Yes. QAY hooks support entrance, hover, and scroll behavior.', 'Yes. The hybrid builder generates missing pieces only when needed.'][item - 1]}
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>`,

    // 5. Offset cards accordion
    `<section class="overflow-hidden bg-black px-6 py-24 text-white">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8" data-qay-scroll="parallax" data-qay-scroll-start="top bottom" data-qay-scroll-end="bottom top" data-qay-y="-46">
            <p class="text-xs font-bold uppercase tracking-[0.28em] text-white/40">Details</p>
            <h2 class="mt-4 text-4xl font-black tracking-tight md:text-6xl" data-qm="faq-title">Designed for the questions that block conversion.</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2" data-qay-animate="stagger-children">
            ${[1, 2, 3, 4].map((item) => `
            <article class="${item % 2 === 0 ? 'sm:translate-y-8' : ''} rounded-[2rem] border border-white/10 bg-white p-5 text-black" data-qay-hover="luxe-lift">
              <button type="button" class="flex w-full items-center justify-between gap-3 text-left font-black" data-qay-click="toggle" data-qay-target="#qay-faq-offset-${index}-${item}" data-qay-class="hidden" aria-controls="qay-faq-offset-${index}-${item}" aria-expanded="false">
                <span>${['Quality', 'Speed', 'Editing', 'Custom sections'][item - 1]}</span>
                <span>+</span>
              </button>
              <div id="qay-faq-offset-${index}-${item}" class="hidden pt-4 text-sm leading-6 text-zinc-600">
                ${['Library sections keep the first result polished.', 'Focused generation avoids one huge fragile AI response.', 'Every layer stays editable in QAY after import.', 'If a prompt needs a rare block, QAY generates only that block.'][item - 1]}
              </div>
            </article>`).join('')}
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
