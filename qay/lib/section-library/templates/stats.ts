import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getStatsTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);

  const layouts = [
    // 0. Clean 4-Column Stats Strip
    `<section class="${style.bg} px-6 py-20 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
          <div class="rounded-3xl border ${style.border} ${style.bgInner} p-8 text-center" ${style.hover}>
            <span class="text-5xl font-black tracking-tight ${style.text}">99%</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold ${style.textMuted}">Customer Support</p>
          </div>
          <div class="rounded-3xl border ${style.border} ${style.bgInner} p-8 text-center" ${style.hover}>
            <span class="text-5xl font-black tracking-tight ${style.text}">3.2M</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold ${style.textMuted}">Active Downloads</p>
          </div>
          <div class="rounded-3xl border ${style.border} ${style.bgInner} p-8 text-center" ${style.hover}>
            <span class="text-5xl font-black tracking-tight ${style.text}">150+</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold ${style.textMuted}">Core Integrations</p>
          </div>
          <div class="rounded-3xl border ${style.border} ${style.bgInner} p-8 text-center" ${style.hover}>
            <span class="text-5xl font-black tracking-tight ${style.text}">12</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold ${style.textMuted}">Global Studios</p>
          </div>
        </div>
      </div>
    </section>`,

    // 1. Split-Pane Layout with Stat Highlights
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
        <div ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">TRACK RECORD</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl leading-tight" data-qm="stats-title">
            Numbers that highlight our commitment
          </h2>
          <p class="mt-6 text-base ${style.textMuted} max-w-md">
            We focus on reliable delivery, high performance benchmarks, and beautiful custom styles.
          </p>
        </div>
        <div class="grid gap-6 grid-cols-2">
          <div class="p-6">
            <span class="text-5xl font-black ${style.accentText}">10y</span>
            <h3 class="font-bold text-base mt-2">Studio Experience</h3>
          </div>
          <div class="p-6">
            <span class="text-5xl font-black ${style.accentText}">4.9</span>
            <h3 class="font-bold text-base mt-2">Rating Scale</h3>
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
