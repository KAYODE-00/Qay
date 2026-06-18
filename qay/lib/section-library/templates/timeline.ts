import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getTimelineTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);

  const layouts = [
    // 0. Alternating timeline nodes
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <div class="text-center max-w-2xl mx-auto mb-16" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}">PROJECT TIMELINE</p>
          <h2 class="mt-4 text-3xl font-black sm:text-4xl md:text-5xl" data-qm="timeline-title">The Roadmap</h2>
        </div>
        
        <div class="relative border-l-2 ${style.border} ml-4 sm:ml-32 space-y-12 py-4">
          <!-- Step 1 -->
          <div class="relative pl-8">
            <span class="absolute -left-[11px] top-1.5 flex size-5 rounded-full ${style.accentBg} border-4 ${style.border}"></span>
            <div class="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-start">
              <span class="text-xs font-bold uppercase tracking-wider ${style.accentText} sm:-ml-36 sm:text-right pt-1">Phase 01</span>
              <div>
                <h3 class="text-lg font-bold">Discovery & Strategy</h3>
                <p class="mt-2 text-sm leading-relaxed ${style.textMuted}">
                  Aligning on specific requirements, architectural outlines, design inspiration, and milestones.
                </p>
              </div>
            </div>
          </div>
          <!-- Step 2 -->
          <div class="relative pl-8">
            <span class="absolute -left-[11px] top-1.5 flex size-5 rounded-full ${style.accentBg} border-4 ${style.border}"></span>
            <div class="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-start">
              <span class="text-xs font-bold uppercase tracking-wider ${style.accentText} sm:-ml-36 sm:text-right pt-1">Phase 02</span>
              <div>
                <h3 class="text-lg font-bold">Component Design</h3>
                <p class="mt-2 text-sm leading-relaxed ${style.textMuted}">
                  Refactoring section presets, setting up complex scroll scrub timelines, and configuring light/dark styles.
                </p>
              </div>
            </div>
          </div>
          <!-- Step 3 -->
          <div class="relative pl-8">
            <span class="absolute -left-[11px] top-1.5 flex size-5 rounded-full ${style.accentBg} border-4 ${style.border}"></span>
            <div class="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-start">
              <span class="text-xs font-bold uppercase tracking-wider ${style.accentText} sm:-ml-36 sm:text-right pt-1">Phase 03</span>
              <div>
                <h3 class="text-lg font-bold">Full Page Handoff</h3>
                <p class="mt-2 text-sm leading-relaxed ${style.textMuted}">
                  Assembling final pages, compiling with absolute type safety, and deploying live instances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 1. Simple Card Timeline
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-3xl font-black mb-12 text-center" ${style.animate}>Execution Path</h2>
        <div class="space-y-6">
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex gap-6">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border ${style.border} font-bold ${style.accentText}">01</span>
            <div>
              <h3 class="font-bold text-lg">Define Project Intent</h3>
              <p class="text-sm ${style.textMuted} mt-2">Establish the main layout goal and colors.</p>
            </div>
          </div>
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex gap-6">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border ${style.border} font-bold ${style.accentText}">02</span>
            <div>
              <h3 class="font-bold text-lg">Iterative Polishing</h3>
              <p class="text-sm ${style.textMuted} mt-2">Fine-tune animations, mobile responsiveness, and text.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
