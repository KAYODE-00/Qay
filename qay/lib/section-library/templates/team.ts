import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getTeamTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const arrowIcon = ICONS.arrowRight('size-4 ml-1 inline');

  const layouts = [
    // 0. Three-Column Avatar Profile Cards
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">CREATIVE BUILDERS</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="team-title">Meet the team</h2>
          </div>
          <p class="text-base ${style.textMuted} md:pt-6">
            A small collection of developers, designers, and strategic operators building visual tools to make web production faster.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-6" ${style.hover}>
            <div class="overflow-hidden ${style.rounded} aspect-square bg-zinc-150 relative">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&q=80" alt="Lead Designer" class="size-full object-cover transition duration-300 hover:scale-103" />
            </div>
            <h3 class="mt-6 text-xl font-bold">Sophia Martinez</h3>
            <p class="text-xs font-bold uppercase tracking-wider ${style.accentText} mt-1">Lead Brand Designer</p>
          </article>
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-6" ${style.hover}>
            <div class="overflow-hidden ${style.rounded} aspect-square bg-zinc-150 relative">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&q=80" alt="Technical Architect" class="size-full object-cover transition duration-300 hover:scale-103" />
            </div>
            <h3 class="mt-6 text-xl font-bold">Marcus Johnson</h3>
            <p class="text-xs font-bold uppercase tracking-wider ${style.accentText} mt-1">Technical Architect</p>
          </article>
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-6" ${style.hover}>
            <div class="overflow-hidden ${style.rounded} aspect-square bg-zinc-150 relative">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&q=80" alt="Product Lead" class="size-full object-cover transition duration-300 hover:scale-103" />
            </div>
            <h3 class="mt-6 text-xl font-bold">Amara Okafor</h3>
            <p class="text-xs font-bold uppercase tracking-wider ${style.accentText} mt-1">Product Lead</p>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Minimal Profile Rows
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-3xl font-black mb-16 text-center" ${style.animate}>Leadership</h2>
        <div class="space-y-4">
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div class="flex items-center gap-4">
              <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-sm font-bold uppercase ${style.accentText}">SM</span>
              <div>
                <h3 class="font-bold text-lg">Sophia Martinez</h3>
                <p class="text-xs ${style.textMuted} mt-0.5">Lagos Studio Coordinator</p>
              </div>
            </div>
            <span class="text-xs uppercase font-bold tracking-widest ${style.accentText}">Partner</span>
          </div>
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div class="flex items-center gap-4">
              <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-sm font-bold uppercase ${style.accentText}">MJ</span>
              <div>
                <h3 class="font-bold text-lg">Marcus Johnson</h3>
                <p class="text-xs ${style.textMuted} mt-0.5">Platform Core Developer</p>
              </div>
            </div>
            <span class="text-xs uppercase font-bold tracking-widest ${style.accentText}">Partner</span>
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
