import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getHeroTemplate(index: number, vars: TemplateVariables): string {
  const templates = [
    // 0. Immersive image background with zoom-out load animation
    `<section class="relative min-h-screen flex items-center overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0 size-full overflow-hidden">
        <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover opacity-60" data-qay-animate="zoom-out" data-qay-duration="1.8" data-qay-ease="power2.out"/>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 py-32 w-full text-center" data-qay-animate="slide-up" data-qay-duration="1.0">
        <p class="text-xs font-bold uppercase tracking-[0.4em] text-amber-500 mb-5" data-qm="hero-eyebrow">PREMIUM EXPERIENCE</p>
        <h1 class="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl leading-none" data-qm="hero-title">
          Designed with taste. Built to perform.
        </h1>
        <p class="mx-auto mt-8 max-w-2xl text-lg text-zinc-300 font-medium" data-qm="hero-subtitle">
          Enjoy smooth animations, responsive grids, and personalized design tailored to your vision.
        </p>
        <div class="mt-12 flex justify-center gap-4">
          <a href="/contact" class="rounded-full bg-amber-500 hover:bg-amber-600 px-8 py-4 text-sm font-black text-black transition-all hover:scale-105 shadow-lg shadow-amber-500/20">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 1. Split hero with scroll expand
    `<section class="bg-white dark:bg-zinc-900 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        <div data-qay-animate="slide-right" data-qay-duration="0.9">
          <div class="flex items-center gap-2 mb-5">
            <span class="h-1.5 w-10 bg-indigo-600 rounded-full"></span>
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400" data-qm="hero-eyebrow">MODERN DIRECTION</p>
          </div>
          <h1 class="text-5xl font-black leading-tight sm:text-6xl md:text-7xl" data-qm="hero-title">
            Stunning layout. Absolute control.
          </h1>
          <p class="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg" data-qm="hero-subtitle">
            Every section shifts smoothly as you scroll. Fully interactive, responsive, and easy to custom code.
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <a href="/contact" class="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/25">
              ${vars.cta}
            </a>
            <a href="/about" class="rounded-xl border border-zinc-200 dark:border-zinc-800 px-8 py-4 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
              Learn More
            </a>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-3xl" data-qay-scroll="expand" data-qay-scroll-start="top bottom" data-qay-scroll-end="center center" data-qay-scale="0.85">
          <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="aspect-[4/3] w-full object-cover rounded-3xl shadow-2xl" />
        </div>
      </div>
    </section>`,

    // 2. Parallax background layout
    `<section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-900 text-white">
      <div class="absolute inset-0 size-full overflow-hidden" data-qay-scroll="parallax" data-qay-y="80">
        <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="absolute inset-0 size-full object-cover opacity-50 scale-110" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950"></div>
      <div class="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center" data-qay-animate="scale-in" data-qay-duration="1.2">
        <p class="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400 mb-6" data-qm="hero-eyebrow">PARALLAX MOTION</p>
        <h1 class="text-4xl font-extrabold sm:text-6xl md:text-7xl leading-none" data-qm="hero-title">
          Motion that feels alive.
        </h1>
        <p class="mt-6 text-base sm:text-lg text-zinc-300 max-w-xl mx-auto" data-qm="hero-subtitle">
          Watch this background image shift speed as you scroll down. Reverses completely on scroll up.
        </p>
        <div class="mt-10">
          <a href="/contact" class="rounded-full bg-emerald-500 hover:bg-emerald-600 px-8 py-4 text-sm font-black text-zinc-950 transition-all hover:scale-105 shadow-lg shadow-emerald-500/25">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 3. Modern Bento Grid Hero
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-20 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 shadow-sm" data-qay-animate="slide-up">
            <span class="rounded-full bg-violet-600/10 px-3.5 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-400" data-qm="hero-eyebrow">BENTO EDITION</span>
            <h1 class="mt-8 text-4xl font-black leading-tight sm:text-6xl" data-qm="hero-title">
              Crafting premium brand experiences.
            </h1>
            <p class="mt-6 max-w-xl text-lg text-zinc-500 dark:text-zinc-400" data-qm="hero-subtitle">
              Interactive cells built to engage visitors and drive results.
            </p>
            <a href="/contact" class="mt-8 inline-flex rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-6 py-3.5 text-sm font-bold text-white dark:text-zinc-950 transition-all">
              ${vars.cta}
            </a>
          </div>
          <div class="overflow-hidden rounded-3xl relative flex flex-col justify-end p-8 min-h-[320px] shadow-sm group" data-qay-hover="glow">
            <img src="${vars.galleryImage}" alt="" class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div class="relative z-10 text-white">
              <h3 class="text-xl font-bold">Visual Integrity</h3>
              <p class="mt-2 text-xs text-zinc-300">Beautiful assets selected specifically for your niche.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 4. Centered text with floating image behind (opacity overlay)
    `<section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="w-[70%] max-w-3xl object-cover rounded-3xl opacity-15 dark:opacity-10 blur-sm scale-110" data-qay-scroll="parallax" data-qay-y="40"/>
      </div>
      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center" data-qay-animate="fade-in" data-qay-duration="1.0">
        <p class="text-xs font-bold uppercase tracking-[0.4em] text-rose-500 mb-6" data-qm="hero-eyebrow">FLOATING CANVAS</p>
        <h1 class="text-5xl font-black sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight" data-qm="hero-title">
          Your story, front and center.
        </h1>
        <p class="mt-8 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto" data-qm="hero-subtitle">
          A floating image backdrop creates depth while your message takes center stage.
        </p>
        <div class="mt-10 flex justify-center gap-4">
          <a href="/contact" class="rounded-full bg-rose-500 hover:bg-rose-600 px-8 py-4 text-sm font-black text-white transition-all hover:scale-105 shadow-lg shadow-rose-500/20">${vars.cta}</a>
        </div>
      </div>
    </section>`,

    // 5. Video-style hero with play button CTA
    `<section class="relative min-h-screen flex items-center overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0">
        <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover opacity-50" data-qay-animate="zoom-out" data-qay-duration="2.0"/>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/50 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 py-32 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div data-qay-animate="slide-up" data-qay-duration="0.9">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-6" data-qm="hero-eyebrow">WATCH THE STORY</p>
          <h1 class="text-5xl font-black sm:text-7xl leading-none" data-qm="hero-title">See it in motion.</h1>
          <p class="mt-6 text-lg text-zinc-300 max-w-lg" data-qm="hero-subtitle">Press play and experience the difference.</p>
          <a href="/contact" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 px-6 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-sky-500/20">${vars.cta}</a>
        </div>
        <div class="flex items-center justify-center">
          <button class="group relative flex items-center justify-center size-28 md:size-36 rounded-full border-2 border-white/30 hover:border-white/60 backdrop-blur-sm bg-white/10 transition-all hover:scale-110" data-qay-animate="scale-in" data-qay-duration="1.0">
            <svg class="size-12 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span class="absolute inset-0 rounded-full border border-white/20 animate-ping"></span>
          </button>
        </div>
      </div>
    </section>`,

    // 6. Split hero with vertical text on the left
    `<section class="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen flex overflow-hidden transition-colors">
      <div class="hidden lg:flex items-center justify-center w-20 border-r border-zinc-200 dark:border-zinc-800 shrink-0">
        <p class="text-xs font-bold uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180 text-zinc-400" data-qm="hero-eyebrow">SCROLL DOWN</p>
      </div>
      <div class="flex-1 grid lg:grid-cols-2 gap-0">
        <div class="flex flex-col justify-center px-8 md:px-16 py-24" data-qay-animate="slide-right" data-qay-duration="0.9">
          <h1 class="text-5xl font-black sm:text-6xl lg:text-7xl leading-[0.95]" data-qm="hero-title">Vertical elegance meets bold design.</h1>
          <p class="mt-8 text-lg text-zinc-500 dark:text-zinc-400 max-w-md" data-qm="hero-subtitle">A unique sidebar orientation draws the eye and sets the tone.</p>
          <div class="mt-10 flex gap-4">
            <a href="/contact" class="rounded-xl bg-zinc-950 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-zinc-950 hover:opacity-90 transition-all">${vars.cta}</a>
          </div>
        </div>
        <div class="relative min-h-[400px] lg:min-h-0" data-qay-scroll="expand" data-qay-scroll-start="top bottom" data-qay-scroll-end="center center" data-qay-scale="0.9">
          <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="absolute inset-0 size-full object-cover"/>
        </div>
      </div>
    </section>`,

    // 7. Dark glassmorphic hero with frosted panels
    `<section class="relative min-h-screen flex items-center overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0"><img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover opacity-30 blur-[2px]"/></div>
      <div class="absolute inset-0 bg-zinc-950/60"></div>
      <div class="relative z-10 mx-auto max-w-6xl px-6 py-32 w-full grid md:grid-cols-5 gap-6" data-qay-animate="slide-up" data-qay-duration="1.0">
        <div class="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
          <p class="text-xs font-bold uppercase tracking-[0.4em] text-violet-400 mb-6" data-qm="hero-eyebrow">GLASS EDITION</p>
          <h1 class="text-4xl font-black sm:text-6xl leading-tight" data-qm="hero-title">Frosted clarity in every pixel.</h1>
          <p class="mt-6 text-base text-zinc-300 max-w-md" data-qm="hero-subtitle">Glassmorphic panels give depth and sophistication to your hero.</p>
          <a href="/contact" class="mt-8 inline-flex rounded-xl bg-violet-600 hover:bg-violet-700 px-8 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-violet-600/25">${vars.cta}</a>
        </div>
        <div class="md:col-span-2 grid gap-6">
          <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col justify-center" data-qay-hover="lift">
            <p class="text-3xl font-black text-violet-400">99%</p>
            <p class="mt-1 text-sm text-zinc-400">Client satisfaction</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col justify-center" data-qay-hover="lift">
            <p class="text-3xl font-black text-violet-400">24/7</p>
            <p class="mt-1 text-sm text-zinc-400">Always available</p>
          </div>
        </div>
      </div>
    </section>`,

    // 8. Fullscreen hero with bottom-anchored content
    `<section class="relative min-h-screen flex flex-col justify-end overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0">
        <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover opacity-55" data-qay-scroll="parallax" data-qay-y="60"/>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-40 w-full" data-qay-animate="slide-up" data-qay-duration="0.8">
        <div class="max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-4" data-qm="hero-eyebrow">ANCHORED BELOW</p>
          <h1 class="text-5xl font-black sm:text-7xl lg:text-8xl leading-none" data-qm="hero-title">Ground level impact.</h1>
          <p class="mt-6 text-lg text-zinc-300 max-w-xl" data-qm="hero-subtitle">Content anchored to the bottom creates cinematic presence and scroll intrigue.</p>
        </div>
        <div class="mt-8 flex items-center justify-between flex-wrap gap-6">
          <a href="/contact" class="rounded-full bg-amber-500 hover:bg-amber-600 px-8 py-4 text-sm font-black text-black transition-all hover:scale-105 shadow-lg shadow-amber-500/20">${vars.cta}</a>
          <p class="text-sm text-zinc-500">Scroll to explore ↓</p>
        </div>
      </div>
    </section>`,

    // 9. Diagonal split (text/image at angle)
    `<section class="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      <div class="absolute inset-y-0 right-0 w-1/2 hidden lg:block [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]">
        <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover" data-qay-animate="zoom-out" data-qay-duration="1.6"/>
      </div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full" data-qay-animate="slide-up" data-qay-duration="0.9">
        <div class="max-w-xl">
          <div class="flex items-center gap-3 mb-6">
            <span class="size-2 rounded-full bg-emerald-500"></span>
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400" data-qm="hero-eyebrow">ANGULAR DESIGN</p>
          </div>
          <h1 class="text-5xl font-black sm:text-7xl leading-none" data-qm="hero-title">Cut through the noise.</h1>
          <p class="mt-6 text-lg text-zinc-500 dark:text-zinc-400 max-w-md" data-qm="hero-subtitle">A diagonal clip creates bold visual tension between text and imagery.</p>
          <div class="mt-10 flex gap-4">
            <a href="/contact" class="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-600/25">${vars.cta}</a>
          </div>
        </div>
      </div>
      <div class="lg:hidden mt-8 px-6"><img src="${vars.heroImage}" alt="${vars.heroAlt}" class="w-full rounded-2xl object-cover aspect-video"/></div>
    </section>`,

    // 10. Stacked headline with horizontal rule accent
    `<section class="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white px-6 py-32 transition-colors">
      <div class="mx-auto max-w-5xl" data-qay-animate="slide-up" data-qay-duration="0.8">
        <p class="text-xs font-bold uppercase tracking-[0.5em] text-zinc-400 mb-8" data-qm="hero-eyebrow">EDITORIAL</p>
        <h1 class="text-6xl font-black sm:text-8xl lg:text-9xl leading-[0.85] tracking-tighter" data-qm="hero-title">
          Less noise. More craft.
        </h1>
        <div class="my-10 h-1 w-24 bg-zinc-900 dark:bg-white rounded-full"></div>
        <div class="grid md:grid-cols-2 gap-12 items-end">
          <p class="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="hero-subtitle">
            A stacked composition with typographic precision and elegant horizontal rule accents.
          </p>
          <div class="flex md:justify-end">
            <a href="/contact" class="rounded-full border-2 border-zinc-900 dark:border-white px-8 py-4 text-sm font-bold hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all">${vars.cta}</a>
          </div>
        </div>
      </div>
    </section>`,

    // 11. Hero with floating badge/stat cards overlaying image
    `<section class="relative min-h-[85vh] flex items-center overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0"><img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover opacity-40" data-qay-animate="zoom-out" data-qay-duration="1.8"/></div>
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full" data-qay-animate="slide-up" data-qay-duration="0.9">
        <div class="max-w-2xl">
          <p class="text-xs font-bold uppercase tracking-[0.4em] text-sky-400 mb-5" data-qm="hero-eyebrow">BY THE NUMBERS</p>
          <h1 class="text-5xl font-black sm:text-7xl leading-none" data-qm="hero-title">Results that speak volumes.</h1>
          <p class="mt-6 text-lg text-zinc-300 max-w-lg" data-qm="hero-subtitle">Floating cards highlight your key achievements directly in the hero section.</p>
          <a href="/contact" class="mt-8 inline-flex rounded-xl bg-sky-500 hover:bg-sky-600 px-8 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-sky-500/25">${vars.cta}</a>
        </div>
        <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4" data-qay-animate="stagger-children" data-qay-duration="0.6">
          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5" data-qay-hover="lift"><p class="text-2xl font-black text-sky-400">250+</p><p class="text-xs text-zinc-400 mt-1">Projects</p></div>
          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5" data-qay-hover="lift"><p class="text-2xl font-black text-sky-400">98%</p><p class="text-xs text-zinc-400 mt-1">Satisfaction</p></div>
          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5" data-qay-hover="lift"><p class="text-2xl font-black text-sky-400">15+</p><p class="text-xs text-zinc-400 mt-1">Years</p></div>
          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5" data-qay-hover="lift"><p class="text-2xl font-black text-sky-400">24/7</p><p class="text-xs text-zinc-400 mt-1">Support</p></div>
        </div>
      </div>
    </section>`,

    // 12. Minimal hero with massive typography only
    `<section class="min-h-screen flex items-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white px-6 transition-colors">
      <div class="mx-auto max-w-7xl w-full py-24" data-qay-animate="fade-in" data-qay-duration="1.2">
        <h1 class="text-[clamp(3rem,10vw,12rem)] font-black leading-[0.85] tracking-tighter" data-qm="hero-title">
          Bold.<br/>Minimal.<br/>Yours.
        </h1>
        <div class="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <p class="text-xl text-zinc-400 max-w-md leading-relaxed" data-qm="hero-subtitle">
            Massive type commands attention. No images, no distractions — just pure typographic impact.
          </p>
          <a href="/contact" class="shrink-0 rounded-full bg-zinc-900 dark:bg-white px-10 py-5 text-sm font-black text-white dark:text-zinc-950 hover:opacity-80 transition-all">${vars.cta}</a>
        </div>
      </div>
    </section>`,

    // 13. Hero with animated gradient background
    `<section class="relative min-h-screen flex items-center overflow-hidden text-white" style="background:linear-gradient(135deg,#0f172a,#581c87,#0e7490,#0f172a);background-size:400% 400%;animation:qm-gradient 12s ease infinite">
      <style>@keyframes qm-gradient{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}</style>
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center" data-qay-animate="scale-in" data-qay-duration="1.0">
        <p class="text-xs font-bold uppercase tracking-[0.4em] text-violet-300 mb-6" data-qm="hero-eyebrow">LIVING COLOR</p>
        <h1 class="text-5xl font-black sm:text-7xl lg:text-8xl leading-none" data-qm="hero-title">
          Gradients that breathe.
        </h1>
        <p class="mt-8 text-lg text-white/70 max-w-2xl mx-auto" data-qm="hero-subtitle">
          An animated gradient background creates a vivid, ever-changing atmosphere.
        </p>
        <div class="mt-12 flex justify-center gap-4">
          <a href="/contact" class="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 text-sm font-bold transition-all hover:scale-105">${vars.cta}</a>
        </div>
      </div>
    </section>`,

    // 14. Split hero with image on left, stacked text on right
    (() => {
      const s = getStyleForIndex(14);
      return `<section class="${s.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div class="relative overflow-hidden ${s.rounded}" ${s.scroll}>
          <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="aspect-[3/4] w-full object-cover ${s.rounded} shadow-2xl"/>
        </div>
        <div ${s.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.3em] ${s.accentText} mb-5" data-qm="hero-eyebrow">IMAGE FORWARD</p>
          <h1 class="text-5xl font-black sm:text-6xl lg:text-7xl leading-[0.95]" data-qm="hero-title">Image leads. Words follow.</h1>
          <p class="mt-6 text-lg ${s.textMuted} max-w-lg" data-qm="hero-subtitle">A left-aligned image creates visual gravity while stacked text guides the narrative.</p>
          <div class="mt-10">
            <a href="/contact" class="${s.rounded} ${s.accentBg} px-8 py-4 text-sm font-bold text-white transition-all shadow-lg inline-flex">${vars.cta}</a>
          </div>
        </div>
      </div>
    </section>`;
    })(),

    // 15. Bento hero with 3 image tiles + text area
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-20 text-zinc-900 dark:text-white transition-colors">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-4 md:grid-cols-4 md:grid-rows-2" data-qay-animate="stagger-children" data-qay-duration="0.5">
          <div class="md:col-span-2 md:row-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 flex flex-col justify-center">
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-6" data-qm="hero-eyebrow">BENTO MOSAIC</p>
            <h1 class="text-4xl font-black sm:text-5xl lg:text-6xl leading-tight" data-qm="hero-title">Three tiles. One story.</h1>
            <p class="mt-5 text-base text-zinc-500 dark:text-zinc-400 max-w-md" data-qm="hero-subtitle">Bento tiles showcase your work alongside a commanding headline.</p>
            <a href="/contact" class="mt-8 inline-flex self-start rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white transition-all">${vars.cta}</a>
          </div>
          <div class="rounded-2xl overflow-hidden min-h-[200px] group" data-qay-hover="img-zoom">
            <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover transition-transform duration-500 group-hover:scale-110"/>
          </div>
          <div class="rounded-2xl overflow-hidden min-h-[200px] group" data-qay-hover="img-zoom">
            <img src="${vars.galleryImage}" alt="" class="size-full object-cover transition-transform duration-500 group-hover:scale-110"/>
          </div>
          <div class="md:col-span-2 rounded-2xl overflow-hidden min-h-[200px] relative group" data-qay-hover="img-zoom">
            <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover transition-transform duration-500 group-hover:scale-110"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <p class="absolute bottom-4 left-4 text-white text-sm font-bold">Explore our work →</p>
          </div>
        </div>
      </div>
    </section>`,

    // 16. Hero with sidebar navigation visible
    `<section class="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen flex transition-colors">
      <aside class="hidden lg:flex flex-col justify-between w-64 border-r border-zinc-200 dark:border-zinc-800 p-8 shrink-0">
        <div>
          <p class="text-sm font-black uppercase tracking-wide mb-8" data-qm="hero-eyebrow">MENU</p>
          <nav class="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">${vars.navLinks}</nav>
        </div>
        <p class="text-xs text-zinc-400">© 2025</p>
      </aside>
      <div class="flex-1 flex items-center px-8 md:px-16 py-24">
        <div class="max-w-3xl" data-qay-animate="slide-right" data-qay-duration="0.9">
          <h1 class="text-5xl font-black sm:text-7xl lg:text-8xl leading-none tracking-tight" data-qm="hero-title">Navigate with purpose.</h1>
          <p class="mt-8 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl" data-qm="hero-subtitle">A persistent sidebar creates app-like navigation within your site.</p>
          <div class="mt-10 flex gap-4">
            <a href="/contact" class="rounded-xl bg-zinc-900 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-zinc-950 hover:opacity-90 transition-all">${vars.cta}</a>
          </div>
          <div class="mt-16 rounded-2xl overflow-hidden" data-qay-scroll="expand" data-qay-scroll-start="top bottom" data-qay-scroll-end="center center" data-qay-scale="0.9">
            <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="w-full aspect-video object-cover rounded-2xl"/>
          </div>
        </div>
      </div>
    </section>`,

    // 17. Dark hero with neon accent border glow
    `<section class="relative min-h-screen flex items-center bg-zinc-950 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-20"><img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover"/></div>
      <div class="relative z-10 mx-auto max-w-5xl px-6 py-32 w-full" data-qay-animate="slide-up" data-qay-duration="1.0">
        <div class="rounded-3xl border border-cyan-500/30 bg-zinc-900/60 backdrop-blur-xl p-10 md:p-16 shadow-[0_0_80px_-12px_rgba(6,182,212,0.3)]">
          <p class="text-xs font-bold uppercase tracking-[0.5em] text-cyan-400 mb-6" data-qm="hero-eyebrow">NEON GLOW</p>
          <h1 class="text-5xl font-black sm:text-7xl leading-none" data-qm="hero-title">Glow in the dark.</h1>
          <p class="mt-6 text-lg text-zinc-300 max-w-xl" data-qm="hero-subtitle">Neon-accented borders create a futuristic vibe that demands attention.</p>
          <div class="mt-10 flex flex-wrap gap-4">
            <a href="/contact" class="rounded-full bg-cyan-500 hover:bg-cyan-600 px-8 py-4 text-sm font-black text-zinc-950 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30">${vars.cta}</a>
            <a href="/about" class="rounded-full border border-cyan-500/40 px-8 py-4 text-sm font-bold text-cyan-400 hover:bg-cyan-500/10 transition-all">Learn More</a>
          </div>
        </div>
      </div>
    </section>`,

    // 18. Hero with horizontal scrolling text marquee
    `<section class="relative min-h-screen flex flex-col justify-center overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0"><img src="${vars.heroImage}" alt="${vars.heroAlt}" class="size-full object-cover opacity-20"/></div>
      <div class="relative z-10">
        <div class="mx-auto max-w-4xl px-6 mb-12 text-center" data-qay-animate="fade-in" data-qay-duration="0.8">
          <p class="text-xs font-bold uppercase tracking-[0.4em] text-amber-400 mb-6" data-qm="hero-eyebrow">INFINITE MOTION</p>
          <p class="text-lg text-zinc-400 max-w-xl mx-auto" data-qm="hero-subtitle">A scrolling marquee creates dynamic energy and visual rhythm.</p>
        </div>
        <div class="overflow-hidden whitespace-nowrap py-4">
          <div class="inline-flex animate-[qm-marquee_20s_linear_infinite]" data-qm="hero-title">
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8">DESIGN</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8 text-amber-500">•</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8">CREATE</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8 text-amber-500">•</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8">INSPIRE</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8 text-amber-500">•</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8">DESIGN</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8 text-amber-500">•</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8">CREATE</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8 text-amber-500">•</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8">INSPIRE</span>
            <span class="text-7xl sm:text-9xl font-black tracking-tight px-8 text-amber-500">•</span>
          </div>
        </div>
        <style>@keyframes qm-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}</style>
        <div class="mx-auto max-w-4xl px-6 mt-12 text-center">
          <a href="/contact" class="rounded-full bg-amber-500 hover:bg-amber-600 px-8 py-4 text-sm font-black text-black transition-all hover:scale-105 inline-flex">${vars.cta}</a>
        </div>
      </div>
    </section>`,

    // 19. Editorial hero with magazine-style typography
    (() => {
      const s = getStyleForIndex(19);
      return `<section class="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white px-6 py-24 transition-colors">
      <div class="mx-auto max-w-7xl">
        <div class="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-12 flex items-end justify-between">
          <p class="text-xs font-bold uppercase tracking-[0.3em] ${s.accentText}" data-qm="hero-eyebrow">THE EDITORIAL</p>
          <p class="text-xs text-zinc-400 hidden sm:block">Issue No. 01</p>
        </div>
        <div class="grid lg:grid-cols-12 gap-8 items-start" data-qay-animate="slide-up" data-qay-duration="0.9">
          <div class="lg:col-span-7">
            <h1 class="text-6xl sm:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Magazine quality.</h1>
            <div class="mt-10 flex gap-4">
              <a href="/contact" class="${s.rounded} ${s.accentBg} px-8 py-4 text-sm font-bold text-white transition-all inline-flex">${vars.cta}</a>
            </div>
          </div>
          <div class="lg:col-span-5">
            <div class="overflow-hidden ${s.rounded} mb-6" ${s.hover}>
              <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="w-full aspect-[4/5] object-cover"/>
            </div>
            <p class="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">Editorial layouts borrow from print design — oversized headings, deliberate whitespace, and a refined sense of hierarchy.</p>
          </div>
        </div>
      </div>
    </section>`;
    })(),
  ];

  return templates[index % templates.length];
}
