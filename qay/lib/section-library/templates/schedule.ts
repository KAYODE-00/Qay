import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getScheduleTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const calendarIcon = ICONS.calendar(style.accentText);
  const clockIcon = ICONS.clock(style.accentText);

  const layouts = [
    // 0. Tabular Class / Event Schedule
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">EVENT CALENDAR</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="schedule-title">Daily Schedule</h2>
          </div>
          <p class="max-w-md text-sm ${style.textMuted}">
            Browse times, tracks, and guest speakers for upcoming sessions. Fully interactive responsive layout.
          </p>
        </div>
        
        <div class="space-y-4">
          <!-- Session 1 -->
          <article class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex flex-col md:flex-row md:items-center justify-between gap-6" ${style.hover}>
            <div class="flex flex-col md:flex-row gap-6 md:items-center">
              <div class="flex items-center gap-2 text-sm font-bold ${style.accentText} shrink-0 bg-zinc-150/10 dark:bg-zinc-900/50 border ${style.border} px-4 py-2.5 rounded-xl">
                ${clockIcon}
                <span>09:00 AM &ndash; 10:30 AM</span>
              </div>
              <div>
                <h3 class="text-lg font-bold">Keynote: Future of visual builders</h3>
                <p class="mt-1 text-xs ${style.textMuted}">Speaker: Sophia Martinez, lekki lead designer</p>
              </div>
            </div>
            <a href="/contact" class="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-5 py-2.5 text-xs font-bold text-center self-start md:self-auto select-none transition-all">
              Reserve Seat
            </a>
          </article>
          <!-- Session 2 -->
          <article class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex flex-col md:flex-row md:items-center justify-between gap-6" ${style.hover}>
            <div class="flex flex-col md:flex-row gap-6 md:items-center">
              <div class="flex items-center gap-2 text-sm font-bold ${style.accentText} shrink-0 bg-zinc-150/10 dark:bg-zinc-900/50 border ${style.border} px-4 py-2.5 rounded-xl">
                ${clockIcon}
                <span>11:00 AM &ndash; 12:30 PM</span>
              </div>
              <div>
                <h3 class="text-lg font-bold">Workshop: Advanced GSAP triggers</h3>
                <p class="mt-1 text-xs ${style.textMuted}">Speaker: Marcus Johnson, technical architect</p>
              </div>
            </div>
            <a href="/contact" class="rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-5 py-2.5 text-xs font-bold text-center self-start md:self-auto select-none transition-all">
              Reserve Seat
            </a>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Sleek Calendar Event Cards Grid
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-3xl font-black mb-16 text-center" ${style.animate}>Upcoming Events</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <div class="flex items-center gap-2 text-xs font-bold ${style.accentText} uppercase tracking-wider mb-6">
                ${calendarIcon}
                <span>June 20, 2026</span>
              </div>
              <h3 class="text-xl font-bold">Tech Meetup Lagos</h3>
              <p class="mt-4 text-sm leading-relaxed ${style.textMuted}">
                Join builders at Lekki Studio to discussNext.js 16 updates and visual visual systems.
              </p>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-3 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">
              RSVP Event
            </a>
          </article>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
