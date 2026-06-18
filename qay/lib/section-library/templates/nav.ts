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
  ];

  return templates[index % templates.length];
}
