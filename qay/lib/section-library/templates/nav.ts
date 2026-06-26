import type { TemplateVariables } from './types';

export function getNavTemplate(index: number, vars: TemplateVariables): string {
  const isEcommerce = vars.siteType === 'ecommerce';
  
  // Cart icon markup
  const cartIconSvg = `<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`;
  
  // Cart button
  const cartButton = isEcommerce
    ? `<button type="button" data-qay-commerce="cart-button" data-qay-cart-label="Cart" class="flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 px-4 py-2 text-xs font-bold text-white dark:text-zinc-950 transition-all">
        ${cartIconSvg}
        <span>Cart (0)</span>
      </button>`
    : '';

  const templates = [
    // 0. Sticky Glassmorphism Navbar with Lucide-Style SVGs
    `<nav class="sticky top-0 z-40 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 px-6 py-4 text-zinc-900 dark:text-white backdrop-blur-md transition-colors duration-300">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" class="text-xl font-black tracking-tight" data-qm="brand-name">
          QAY Studio
        </a>
        <div class="hidden items-center gap-7 text-sm font-semibold md:flex">
          ${vars.navLinks}
          ${cartButton}
          <a href="/contact" class="rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 px-5 py-2.5 text-xs text-white dark:text-zinc-950 transition-all font-bold">
            ${vars.cta}
          </a>
        </div>
        <div class="flex items-center gap-3 md:hidden">
          ${isEcommerce ? `<button type="button" data-qay-commerce="cart-button" class="p-2 text-zinc-950 dark:text-white">${cartIconSvg}</button>` : ''}
          <button type="button" class="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2.5 text-zinc-950 dark:text-white" data-qay-click="toggle" data-qay-target="#nav-mobile-${vars.idBase}" data-qay-class="hidden">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div id="nav-mobile-${vars.idBase}" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl backdrop-blur-xl md:hidden">
        <div class="flex justify-between items-center mb-4">
          <p class="font-extrabold text-sm uppercase tracking-wider text-zinc-400">Navigation</p>
          <button type="button" class="text-zinc-400 hover:text-zinc-600" data-qay-click="toggle" data-qay-target="#nav-mobile-${vars.idBase}" data-qay-class="hidden">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        ${vars.mobileLinks}
        <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
          ${cartButton}
          <a href="/contact" class="rounded-xl bg-zinc-950 dark:bg-white px-4 py-3.5 text-center text-sm font-bold text-white dark:text-zinc-950 transition-all">
            ${vars.cta}
          </a>
        </div>
      </div>
    </nav>`,

    // 1. Centered logo navbar with border highlights
    `<nav class="sticky top-0 z-40 border-b border-zinc-150 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900 px-6 py-5 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center">
        <div class="hidden gap-6 text-sm font-semibold md:flex">
          ${vars.navLinks}
        </div>
        <div class="md:hidden">
          <button type="button" class="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2" data-qay-click="toggle" data-qay-target="#nav-mobile-${vars.idBase}" data-qay-class="hidden">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        <a href="/" class="text-center text-xl font-black tracking-[0.2em] uppercase" data-qm="brand-name">
          QAY
        </a>
        <div class="flex justify-end items-center gap-3">
          ${cartButton}
          <a href="/contact" class="hidden sm:inline-flex rounded-full bg-zinc-950 dark:bg-white px-5 py-2.5 text-xs text-white dark:text-zinc-950 font-bold hover:opacity-90 transition-all">
            ${vars.cta}
          </a>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div id="nav-mobile-${vars.idBase}" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl backdrop-blur-xl md:hidden">
        <div class="flex justify-between items-center mb-4">
          <p class="font-extrabold text-sm uppercase tracking-wider text-zinc-400">Navigation</p>
          <button type="button" class="text-zinc-400 hover:text-zinc-600" data-qay-click="toggle" data-qay-target="#nav-mobile-${vars.idBase}" data-qay-class="hidden">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        ${vars.mobileLinks}
        <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
          ${cartButton}
          <a href="/contact" class="rounded-xl bg-zinc-950 dark:bg-white px-4 py-3.5 text-center text-sm font-bold text-white dark:text-zinc-950 transition-all">
            ${vars.cta}
          </a>
        </div>
      </div>
    </nav>`,

    // 2. Vercel-style command rail nav
    `<nav class="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 px-5 py-3 text-black backdrop-blur-xl transition-all duration-300 dark:border-zinc-800 dark:bg-black/90 dark:text-white" data-qay-animate="fade-in" data-qay-duration="0.45" data-qay-ease="power2.out">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="/" class="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-black tracking-tight transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600" data-qm="brand-name">
          <span class="size-2 rounded-full bg-[var(--qm-accent)]"></span>
          QAY Studio
        </a>
        <div class="hidden items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-950 md:flex">
          ${vars.navLinks}
        </div>
        <div class="hidden items-center gap-2 md:flex">
          ${cartButton}
          <a href="/contact" class="rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200" data-qay-hover="scale-btn" data-qay-hover-duration="0.2">
            ${vars.cta}
          </a>
        </div>
        <button type="button" class="rounded-full border border-zinc-200 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] dark:border-zinc-800 md:hidden" data-qay-click="toggle" data-qay-target="#nav-command-${vars.idBase}" data-qay-class="hidden">
          Menu
        </button>
      </div>
      <div id="nav-command-${vars.idBase}" class="hidden fixed inset-x-3 top-16 z-50 grid gap-2 rounded-[1.5rem] border border-zinc-200 bg-white p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 md:hidden" data-qay-animate="scale-in" data-qay-duration="0.35" data-qay-ease="back.out(1.2)">
        ${vars.mobileLinks}
        <div class="mt-2 grid gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          ${cartButton}
          <a href="/contact" class="rounded-2xl bg-black px-4 py-3 text-center text-sm font-bold text-white dark:bg-white dark:text-black">${vars.cta}</a>
        </div>
      </div>
    </nav>`,

    // 3. Editorial dock nav
    `<nav class="fixed inset-x-0 top-4 z-50 px-4 text-black dark:text-white" data-qay-animate="luxe-dock-reveal" data-qay-duration="0.7" data-qay-y="-22" data-qay-ease="expo.out">
      <div class="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center rounded-full border border-zinc-200/80 bg-white/75 px-3 py-2 shadow-2xl shadow-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-black/70">
        <a href="/" class="pl-3 text-sm font-black uppercase tracking-[0.18em]" data-qm="brand-name">QAY</a>
        <div class="hidden items-center gap-5 rounded-full bg-zinc-100 px-5 py-2 text-xs font-bold dark:bg-white/10 md:flex">
          ${vars.navLinks}
        </div>
        <div class="flex justify-end gap-2">
          ${cartButton}
          <a href="/contact" class="hidden rounded-full bg-[var(--qm-accent)] px-5 py-2.5 text-xs font-black text-[var(--qm-accent-text)] transition hover:scale-[1.03] sm:inline-flex">${vars.cta}</a>
          <button type="button" class="rounded-full border border-zinc-200 px-4 py-2 text-xs font-black dark:border-white/10 md:hidden" data-qay-click="toggle" data-qay-target="#nav-dock-${vars.idBase}" data-qay-class="hidden">Menu</button>
        </div>
      </div>
      <div id="nav-dock-${vars.idBase}" class="hidden mx-auto mt-3 max-w-md flex-col gap-2 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-zinc-950 md:hidden">
        ${vars.mobileLinks}
        <a href="/contact" class="mt-2 rounded-2xl bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-black text-[var(--qm-accent-text)]">${vars.cta}</a>
      </div>
    </nav>`,

    // 4. Sidebar drawer nav for editorial and portfolio sites
    `<nav class="sticky top-0 z-50 border-b border-zinc-200 bg-white px-5 py-4 text-black dark:border-zinc-800 dark:bg-black dark:text-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <button type="button" class="group inline-flex items-center gap-3 rounded-full border border-zinc-200 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition hover:border-zinc-400 dark:border-zinc-800" data-qay-click="toggle" data-qay-target="#nav-drawer-${vars.idBase}" data-qay-class="hidden">
          <span class="grid gap-1">
            <span class="block h-0.5 w-5 bg-current transition group-hover:w-7"></span>
            <span class="block h-0.5 w-7 bg-current transition group-hover:w-5"></span>
          </span>
          Menu
        </button>
        <a href="/" class="text-base font-black uppercase tracking-[0.24em]" data-qm="brand-name">QAY Studio</a>
        <div class="flex items-center gap-2">
          ${cartButton}
          <a href="/contact" class="rounded-full bg-black px-5 py-2.5 text-xs font-black text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black">${vars.cta}</a>
        </div>
      </div>
      <aside id="nav-drawer-${vars.idBase}" class="hidden fixed bottom-4 left-4 top-20 z-50 w-[min(420px,calc(100vw-32px))] flex-col justify-between rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" data-qay-animate="sidebar-slide" data-qay-duration="0.55" data-qay-x="-70" data-qay-ease="power3.out">
        <div>
          <div class="mb-8 flex items-center justify-between">
            <p class="text-xs font-black uppercase tracking-[0.28em] text-zinc-400">Navigation</p>
            <button type="button" class="rounded-full border border-zinc-200 px-3 py-2 text-xs font-bold dark:border-zinc-800" data-qay-click="toggle" data-qay-target="#nav-drawer-${vars.idBase}" data-qay-class="hidden">Close</button>
          </div>
          <div class="grid gap-2 text-3xl font-black tracking-tight">
            ${vars.mobileLinks}
          </div>
        </div>
        <a href="/contact" class="mt-8 rounded-2xl bg-[var(--qm-accent)] px-5 py-4 text-center text-sm font-black text-[var(--qm-accent-text)]">${vars.cta}</a>
      </aside>
    </nav>`,

    // 5. Floating bottom mobile-first nav
    `<nav class="fixed inset-x-0 bottom-4 z-50 px-4 text-black dark:text-white md:bottom-auto md:top-4" data-qay-animate="slide-up" data-qay-duration="0.65" data-qay-y="28" data-qay-ease="expo.out">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border border-zinc-200 bg-white/85 p-2 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-zinc-800 dark:bg-black/80">
        <a href="/" class="rounded-full px-4 py-2 text-sm font-black" data-qm="brand-name">QAY</a>
        <div class="hidden items-center gap-1 text-xs font-bold md:flex">${vars.navLinks}</div>
        <div class="flex items-center gap-1">
          ${cartButton}
          <button type="button" class="rounded-full border border-zinc-200 px-4 py-2 text-xs font-black dark:border-zinc-800 md:hidden" data-qay-click="toggle" data-qay-target="#nav-floating-${vars.idBase}" data-qay-class="hidden">More</button>
          <a href="/contact" class="rounded-full bg-black px-4 py-2 text-xs font-black text-white dark:bg-white dark:text-black">${vars.cta}</a>
        </div>
      </div>
      <div id="nav-floating-${vars.idBase}" class="hidden mx-auto mb-3 max-w-sm flex-col gap-2 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
        ${vars.mobileLinks}
      </div>
    </nav>`
  ];

  return templates[index % templates.length];
}
