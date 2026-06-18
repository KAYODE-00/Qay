import type { TemplateVariables } from './types';

export function getFooterTemplate(index: number, vars: TemplateVariables): string {
  const templates = [
    // 0. Modern Multi-Column Footer
    `<footer class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-16 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div class="space-y-6">
          <p class="text-2xl font-black tracking-tight" data-qm="footer-brand">QAY Studio</p>
          <p class="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            A premium responsive web system built to execute with high performance and bespoke layouts.
          </p>
        </div>
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Navigation</h4>
          <div class="flex flex-col gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            ${vars.navLinks}
          </div>
        </div>
        <div class="space-y-5">
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Connect</h4>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Sign up for updates and product releases.</p>
          <form class="flex gap-2">
            <input type="email" placeholder="your@email.com" class="h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 text-xs flex-1 outline-none focus:border-zinc-400" />
            <button type="button" class="h-10 rounded-xl bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-xs font-bold text-white dark:text-zinc-950 px-4 transition-all">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div class="mx-auto mt-16 flex max-w-7xl flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-8 text-[11px] font-medium text-zinc-400">
        <p>&copy; 2026 QAY Studio. All rights reserved.</p>
        <p class="mt-2 sm:mt-0 flex items-center gap-1">
          <span>Crafted in Lagos</span>
          <span class="text-red-500">❤️</span>
        </p>
      </div>
    </footer>`,

    // 1. Huge Bold Text Display Footer (Dribbble design inspired)
    `<footer class="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-20 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl flex flex-col justify-between items-center gap-16">
        <div class="flex flex-wrap justify-center gap-10 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          ${vars.navLinks}
          <a href="/privacy" class="hover:text-zinc-950 dark:hover:text-white">Privacy</a>
          <a href="/terms" class="hover:text-zinc-950 dark:hover:text-white">Terms</a>
        </div>
        <div class="w-full text-center border-t border-zinc-200/50 dark:border-zinc-800/50 pt-16">
          <p class="text-[clamp(3rem,12vw,9rem)] font-black tracking-tighter opacity-10 leading-none select-none uppercase" data-qm="footer-brand">
            QAY STUDIO
          </p>
          <p class="mt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
            &copy; 2026 QAY STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>`,
  ];

  return templates[index % templates.length];
}
