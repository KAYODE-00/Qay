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

    // 2. Vercel-style compact product footer
    `<footer class="border-t border-zinc-200 bg-white px-6 py-14 text-black transition-colors duration-300 dark:border-zinc-800 dark:bg-black dark:text-white">
      <div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1.2fr_1fr] md:items-start">
        <div data-qay-animate="slide-up" data-qay-duration="0.55">
          <p class="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-black dark:border-zinc-800 dark:bg-zinc-950" data-qm="footer-brand">
            <span class="size-2 rounded-full bg-[var(--qm-accent)]"></span>
            QAY Studio
          </p>
          <p class="mt-5 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">Modern sections, clean routing, and polished interactions for serious launches.</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:grid-cols-3" data-qay-animate="stagger-children">
          ${vars.navLinks}
          <a href="/privacy" class="transition hover:text-black dark:hover:text-white">Privacy</a>
          <a href="/terms" class="transition hover:text-black dark:hover:text-white">Terms</a>
        </div>
        <form class="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950" data-qay-animate="scale-in" data-qay-duration="0.6" data-qay-ease="back.out(1.2)">
          <p class="px-2 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Updates</p>
          <div class="flex overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <input type="email" placeholder="Email address" class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
            <button type="button" class="bg-black px-4 text-xs font-black text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black">Join</button>
          </div>
        </form>
      </div>
      <div class="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-zinc-100 pt-6 text-xs text-zinc-400 dark:border-zinc-900 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright 2026 QAY Studio. All rights reserved.</p>
        <p>Built with precision, motion, and restraint.</p>
      </div>
    </footer>`,

    // 3. Oversized marquee footer
    `<footer class="overflow-hidden bg-black px-6 py-20 text-white">
      <div class="mx-auto max-w-7xl">
        <div class="border-b border-white/10 pb-10" data-qay-scroll="slide" data-qay-scroll-start="top bottom" data-qay-scroll-end="bottom top" data-qay-x="-72">
          <p class="whitespace-nowrap text-[clamp(4rem,14vw,12rem)] font-black uppercase leading-none tracking-tighter text-white" data-qm="footer-brand">QAY Studio</p>
        </div>
        <div class="grid gap-10 pt-10 md:grid-cols-[1fr_1fr_1fr]">
          <p class="max-w-sm text-sm leading-6 text-white/55">A bold footer for fashion, portfolio, music, event, and agency websites that need a confident closing moment.</p>
          <div class="grid gap-3 text-sm font-semibold text-white/60">${vars.navLinks}</div>
          <div class="flex flex-col gap-4 md:items-end">
            <a href="/contact" class="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:scale-[1.03]" data-qay-hover="scale-btn">${vars.cta}</a>
            <p class="text-xs text-white/40">Copyright 2026. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>`,

    // 4. Glass dock footer
    `<footer class="bg-zinc-50 px-6 py-16 text-black dark:bg-zinc-950 dark:text-white">
      <div class="mx-auto max-w-7xl rounded-[2rem] border border-zinc-200 bg-white/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-zinc-800 dark:bg-white/[0.04]" data-qay-animate="luxe-reveal" data-qay-duration="0.9" data-qay-y="36" data-qay-ease="expo.out">
        <div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p class="text-2xl font-black tracking-tight" data-qm="footer-brand">QAY Studio</p>
            <p class="mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">A calm glass footer for SaaS, dashboards, technical products, and modern professional sites.</p>
          </div>
          <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-6 py-3 text-sm font-black text-[var(--qm-accent-text)] transition hover:-translate-y-0.5">${vars.cta}</a>
        </div>
        <div class="mt-8 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          ${vars.navLinks}
          <span class="ml-auto text-xs">Copyright 2026</span>
        </div>
      </div>
    </footer>`,

    // 5. Split contact footer
    `<footer class="bg-white px-6 py-20 text-black dark:bg-black dark:text-white">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-950" data-qay-animate="slide-right" data-qay-duration="0.75" data-qay-x="-44">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-zinc-400">Next step</p>
          <h2 class="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-7xl" data-qm="footer-brand">QAY Studio</h2>
          <p class="mt-6 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">End the page with a direct conversion path, social proof, and the most useful route links.</p>
          <a href="/contact" class="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:scale-[1.03] dark:bg-white dark:text-black" data-qay-hover="scale-btn">${vars.cta}</a>
        </div>
        <div class="grid content-between gap-6 rounded-[2rem] border border-zinc-200 p-8 dark:border-zinc-800" data-qay-animate="slide-left" data-qay-duration="0.75" data-qay-x="44">
          <div class="grid gap-3 text-lg font-black">${vars.navLinks}</div>
          <div class="grid gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <p>hello@example.com</p>
            <p>Lagos, Nigeria</p>
            <p>Copyright 2026. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>`
  ];

  return templates[index % templates.length];
}
