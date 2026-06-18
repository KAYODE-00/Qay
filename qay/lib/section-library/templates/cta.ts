import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getCtaTemplate(index: number, vars: TemplateVariables): string {
  const templates = [
    // 0. Clean gradient card CTA
    `<section class="bg-white dark:bg-zinc-950 px-6 py-20 transition-colors duration-300">
      <div class="mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-tr from-indigo-900 to-indigo-700 px-8 py-20 text-center text-white shadow-2xl" data-qay-animate="scale-in" data-qay-duration="1.0">
        <h2 class="text-4xl font-black md:text-5xl leading-tight" data-qm="cta-title">
          Ready to elevate your experience?
        </h2>
        <p class="mt-6 text-base md:text-lg text-indigo-100 max-w-xl mx-auto">
          Start building custom layout systems today. Responsive templates, advanced scroll scrub animations, and total editing control.
        </p>
        <div class="mt-10 flex justify-center">
          <a href="/contact" class="rounded-full bg-white px-8 py-4 text-sm font-black text-indigo-950 transition-all hover:scale-105 shadow-xl hover:shadow-white/10 select-none">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 1. Split-screen minimal CTA
    `<section class="bg-zinc-50 dark:bg-zinc-900 px-6 py-20 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid gap-10 md:grid-cols-2 md:items-center p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm" data-qay-animate="slide-up">
        <div>
          <h2 class="text-3xl font-black sm:text-4xl" data-qm="cta-title">
            Take full creative control.
          </h2>
          <p class="mt-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
            Unleash custom animations, icons, and themes. Build directly inside a platform engineered for professionals.
          </p>
        </div>
        <div class="flex md:justify-end">
          <a href="/contact" class="rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 px-8 py-4 text-sm font-bold text-white dark:text-zinc-950 transition-all shadow-md select-none">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 2. Glassmorphic centered panel with background image and blur overlay
    `<section id="${vars.idBase}-cta-2" class="relative overflow-hidden py-32 px-6 bg-zinc-950 text-white">
      <div class="absolute inset-0 z-0">
        <img src="${vars.galleryImage}" alt="" class="w-full h-full object-cover opacity-40 scale-105" data-qay-scroll="parallax" data-qay-y="30" />
        <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/95"></div>
      </div>
      <div class="relative z-10 mx-auto max-w-4xl text-center" data-qay-animate="scale-in" data-qay-duration="0.9">
        <span class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-bold tracking-widest text-indigo-300 uppercase mb-6" data-qm="cta-eyebrow">LIMITED SPOTLIGHT</span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight leading-none" data-qm="cta-title">Accelerate your workflow.</h2>
        <p class="mt-6 text-zinc-300 max-w-xl mx-auto text-base md:text-lg" data-qm="cta-subtitle">
          Join the league of elite digital architects using custom grids and fluid motion design.
        </p>
        <div class="mt-10 flex justify-center gap-4 flex-wrap">
          <a href="/contact" class="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold text-white shadow-lg shadow-indigo-500/20 transition-all" data-qay-hover="glow">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 3. Bento grid newsletter + CTA split
    `<section id="${vars.idBase}-cta-3" class="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 lg:grid-cols-12 items-stretch" data-qay-animate="stagger-children">
          <div class="lg:col-span-7 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 flex flex-col justify-between" data-qay-hover="lift">
            <div>
              <span class="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400" data-qm="cta-eyebrow">MEMBERSHIP</span>
              <h2 class="text-3xl md:text-5xl font-black mt-4 leading-tight" data-qm="cta-title">Start designing without boundaries.</h2>
              <p class="mt-4 text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-md" data-qm="cta-subtitle">
                Get access to all premium variants, update notifications, and specialized developer channels.
              </p>
            </div>
            <div class="mt-8">
              <a href="/contact" class="inline-flex items-center gap-3 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all">
                <span>${vars.cta}</span>
                ${ICONS.arrowRight('size-4 text-white')}
              </a>
            </div>
          </div>
          <div class="lg:col-span-5 rounded-3xl bg-zinc-950 text-white p-8 md:p-12 flex flex-col justify-between border border-zinc-800" data-qay-hover="glow">
            <div>
              <h3 class="text-2xl font-bold">Stay updated</h3>
              <p class="mt-3 text-sm text-zinc-400">Join 15,000+ designers receiving monthly drops.</p>
            </div>
            <form class="mt-8 space-y-3" onSubmit="event.preventDefault();">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">${ICONS.mail('size-5 text-zinc-500')}</span>
                <input type="email" placeholder="Enter your email" class="w-full pl-11 pr-4 py-3 bg-zinc-905 dark:bg-zinc-900 border border-zinc-850 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-700 placeholder-zinc-500 text-white" required />
              </div>
              <button type="submit" class="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl text-sm font-bold transition-all">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>`,

    // 4. Asymmetric full-bleed split image text overlay CTA
    `<section id="${vars.idBase}-cta-4" class="relative overflow-hidden py-32 px-6 bg-zinc-900 text-white">
      <div class="absolute inset-0 z-0">
        <img src="${vars.heroImage}" alt="" class="w-full h-full object-cover opacity-30" data-qay-scroll="parallax" data-qay-y="-35" />
        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"></div>
      </div>
      <div class="relative z-10 mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center" data-qay-animate="slide-up">
        <div>
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-rose-500" data-qm="cta-eyebrow">INNOVATION FIRST</span>
          <h2 class="text-4xl sm:text-6xl font-black mt-4 leading-tight" data-qm="cta-title">Ready to build the future?</h2>
          <p class="mt-6 text-zinc-300 text-base md:text-lg max-w-lg" data-qm="cta-subtitle">
            Leverage optimized Tailwind templates designed for high conversions and breathtaking performance.
          </p>
          <div class="mt-8 flex gap-4">
            <a href="/contact" class="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg" data-qay-hover="lift">
              ${vars.cta}
            </a>
          </div>
        </div>
      </div>
    </section>`,

    // 5. Triple Button Action Card Grid (SaaS Pricing/Product style)
    `<section id="${vars.idBase}-cta-5" class="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-5xl rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-16 shadow-xl text-center" data-qay-animate="scale-in">
        <h2 class="text-3xl md:text-5xl font-black tracking-tight" data-qm="cta-title">Select your path forward.</h2>
        <p class="mt-4 text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm md:text-base" data-qm="cta-subtitle">
          Whether you are an individual builder or scaling an enterprise team, we have the ideal template license for you.
        </p>
        <div class="mt-12 grid sm:grid-cols-3 gap-4">
          <div class="border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between" data-qay-hover="lift">
            <div>
              <h3 class="text-lg font-bold">Standard</h3>
              <p class="text-xs text-zinc-400 mt-1">For simple landing projects</p>
            </div>
            <a href="/contact" class="mt-6 block w-full py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Get Started
            </a>
          </div>
          <div class="border-2 border-indigo-605 dark:border-indigo-400 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-md flex flex-col justify-between relative" data-qay-hover="luxe-lift">
            <span class="absolute -top-3 right-6 bg-indigo-650 dark:bg-indigo-500 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">POPULAR</span>
            <div>
              <h3 class="text-lg font-bold">Professional</h3>
              <p class="text-xs text-indigo-500 mt-1">Unlimited custom designs</p>
            </div>
            <a href="/contact" class="mt-6 block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md">
              ${vars.cta}
            </a>
          </div>
          <div class="border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between" data-qay-hover="lift">
            <div>
              <h3 class="text-lg font-bold">Enterprise</h3>
              <p class="text-xs text-zinc-400 mt-1">Dedicated custom support</p>
            </div>
            <a href="/contact" class="mt-6 block w-full py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Talk to Sales
            </a>
          </div>
        </div>
      </div>
    </section>`,

    // 6. Minimal whitespace heavy editorial magazine style
    `<section id="${vars.idBase}-cta-6" class="py-24 px-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl border-y border-zinc-200 dark:border-zinc-800 py-16 grid lg:grid-cols-12 gap-8 items-center" data-qay-animate="slide-up">
        <div class="lg:col-span-8">
          <span class="text-xs font-serif italic text-zinc-400 dark:text-zinc-500">Editorial Vision</span>
          <h2 class="text-4xl sm:text-6xl font-serif mt-2 tracking-tight leading-tight" data-qm="cta-title">
            Shape your digital perspective.
          </h2>
          <p class="mt-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl" data-qm="cta-subtitle">
            We balance pure composition with minimal details to make sure users stay engaged. Focus on details, elevate the brand presentation.
          </p>
        </div>
        <div class="lg:col-span-4 flex lg:justify-end">
          <a href="/contact" class="group flex items-center gap-4 text-lg font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
            <span>${vars.cta}</span>
            <span class="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-full group-hover:translate-x-2 transition-transform duration-300">${ICONS.arrowRight('size-5')}</span>
          </a>
        </div>
      </div>
    </section>`,

    // 7. Dark neon glowing border tech CTA
    `<section id="${vars.idBase}-cta-7" class="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="mx-auto max-w-5xl rounded-[2rem] border border-cyan-500/30 bg-zinc-900/60 p-8 md:p-12 shadow-[0_0_50px_rgba(6,182,212,0.1)] text-center relative z-10" data-qay-animate="scale-in">
        <span class="px-3 py-1 bg-cyan-950 border border-cyan-800 text-[10px] uppercase font-mono tracking-widest text-cyan-400 rounded-full">SYSTEM: READY</span>
        <h2 class="text-3xl md:text-5xl font-black tracking-tight mt-6" data-qm="cta-title">Powering elite performance.</h2>
        <p class="mt-4 text-sm text-zinc-400 max-w-lg mx-auto" data-qm="cta-subtitle">
          Zero layout shifts, optimal loading states, and precise scroll physics integrated directly into your workspace.
        </p>
        <div class="mt-8 flex justify-center">
          <a href="/contact" class="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:scale-105">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 8. Elegant split layout with image on left, copy on right
    `<section id="${vars.idBase}-cta-8" class="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div class="overflow-hidden rounded-3xl" data-qay-scroll="expand">
          <img src="${vars.galleryImage}" alt="Workspace" class="aspect-[4/3] w-full object-cover rounded-3xl hover:scale-105 transition-transform duration-505" />
        </div>
        <div class="space-y-6" data-qay-animate="slide-right">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-indigo-650 dark:text-indigo-400" data-qm="cta-eyebrow">COLLABORATE</p>
          <h2 class="text-3xl md:text-5xl font-black leading-tight" data-qm="cta-title">Let's create something remarkable.</h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed" data-qm="cta-subtitle">
            Deploy customized grids, premium typography layers, and responsive visual flow blocks in just a few minutes.
          </p>
          <div class="pt-4 flex items-center gap-6">
            <a href="/contact" class="px-8 py-4 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm rounded-2xl shadow-md transition-all">
              ${vars.cta}
            </a>
            <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500">Average response time: 2 hours</span>
          </div>
        </div>
      </div>
    </section>`,

    // 9. 3-column structured grid layout (Title, Copy, Buttons)
    `<section id="${vars.idBase}-cta-9" class="py-24 px-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div class="grid lg:grid-cols-3 gap-8 items-center" data-qay-animate="stagger-children">
          <div>
            <h2 class="text-3xl font-black leading-tight" data-qm="cta-title">Upgrade your design stack.</h2>
            <span class="inline-block mt-3 text-xs font-bold text-emerald-650 dark:text-emerald-400">Cancel subscription anytime</span>
          </div>
          <div>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed" data-qm="cta-subtitle">
              Enjoy lifetime access to 100+ blocks, multiple layout updates, Figma assets, and a fully interactive animation engine.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end lg:items-end">
            <a href="/contact" class="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold text-sm text-center transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100" data-qay-hover="lift">
              ${vars.cta}
            </a>
            <a href="/faq" class="px-6 py-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm text-center transition-all">
              View FAQ
            </a>
          </div>
        </div>
      </div>
    </section>`,

    // 10. Compact floating badge-style bottom notice / banner CTA
    `<section id="${vars.idBase}-cta-10" class="py-12 px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-4xl border border-indigo-200 dark:border-indigo-805 bg-indigo-50/50 dark:bg-indigo-950/20 backdrop-blur-md rounded-2xl p-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6" data-qay-animate="slide-up">
        <div class="flex items-center gap-4">
          <div class="h-10 w-10 rounded-full bg-indigo-600/10 flex items-center justify-center shrink-0">
            ${ICONS.lock('size-5 text-indigo-600 dark:text-indigo-400')}
          </div>
          <div>
            <h3 class="text-sm font-bold text-zinc-850 dark:text-white" data-qm="cta-title">Get full access during our launch week discount.</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Save 40% when purchasing a developer license today.</p>
          </div>
        </div>
        <div class="shrink-0">
          <a href="/contact" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all">
            ${vars.cta}
          </a>
        </div>
      </div>
    </section>`,

    // 11. Corporate banner with social proof / statistics overlay
    `<section id="${vars.idBase}-cta-11" class="py-24 px-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-16">
        <div class="space-y-6" data-qay-animate="slide-right">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400" data-qm="cta-eyebrow">TRUSTED GLOBAL NETWORK</span>
          <h2 class="text-3xl md:text-5xl font-black tracking-tight leading-tight" data-qm="cta-title">Join 10,000+ modern innovators.</h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base" data-qm="cta-subtitle">
            We help creative directors, development shops, and freelance artists launch products that load fast and look pristine.
          </p>
          <div class="pt-2 flex items-center gap-6">
            <a href="/contact" class="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-violet-600/10 transition-all">
              ${vars.cta}
            </a>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-center" data-qay-hover="lift">
            <span class="text-3xl font-black text-violet-650 dark:text-violet-400">99.8%</span>
            <p class="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mt-2">Retention Rate</p>
          </div>
          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-center" data-qay-hover="lift">
            <span class="text-3xl font-black text-violet-650 dark:text-violet-400">12M+</span>
            <p class="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mt-2">API Requests</p>
          </div>
        </div>
      </div>
    </section>`,

    // 12. Style-adaptive programmatic split card layout
    (() => {
      const s = getStyleForIndex(index);
      return `<section id="${vars.idBase}-cta-12" class="${s.bg} py-24 px-6 transition-colors duration-300">
        <div class="mx-auto max-w-7xl rounded-3xl ${s.bgInner} ${s.border} p-8 md:p-16" ${s.animate}>
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="text-xs font-bold uppercase tracking-[0.3em] ${s.accentText}" data-qm="cta-eyebrow">TAILORED CODE</span>
              <h2 class="text-3xl md:text-5xl font-black mt-4 tracking-tight leading-tight" data-qm="cta-title">Adaptable layouts matching your tone.</h2>
              <p class="mt-4 text-sm ${s.textMuted} leading-relaxed" data-qm="cta-subtitle">
                This module scales, transitions, and aligns itself dynamically. Experience design variables built to sync perfectly.
              </p>
              <div class="mt-8">
                <a href="/contact" class="inline-block px-8 py-4 ${s.accentBg} ${s.accentHoverBg} text-white rounded-xl font-bold shadow-md transition-all" ${s.hover}>
                  ${vars.cta}
                </a>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-2xl" ${s.scroll}>
              <img src="${vars.galleryImage}" alt="Style layout" class="w-full aspect-video object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>`;
    })(),

    // 13. Warm Gradient Card with Calendar integration
    `<section id="${vars.idBase}-cta-13" class="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-650 p-[1px] shadow-2xl">
        <div class="bg-white dark:bg-zinc-905 rounded-[2.45rem] px-8 py-16 text-center">
          <div class="flex justify-center gap-1 mb-6">
            ${ICONS.star('size-4 text-amber-500')}
            ${ICONS.star('size-4 text-amber-500')}
            ${ICONS.star('size-4 text-amber-500')}
            ${ICONS.star('size-4 text-amber-500')}
            ${ICONS.star('size-4 text-amber-500')}
          </div>
          <h2 class="text-3xl md:text-5xl font-black tracking-tight" data-qm="cta-title">Schedule a personal workshop.</h2>
          <p class="mt-4 text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto" data-qm="cta-subtitle">
            Let our expert designers show you how to configure dynamic sections, typography scale matrices, and custom theme presets.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/contact" class="px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-all">
              ${vars.cta}
            </a>
            <a href="/calendar" class="flex items-center gap-2 px-6 py-4 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              ${ICONS.calendar('size-5')}
              <span>Book 15min Call</span>
            </a>
          </div>
        </div>
      </div>
    </section>`,

    // 14. Dark Fullscreen Hero-style CTA with radial glowing orb
    `<section id="${vars.idBase}-cta-14" class="relative overflow-hidden py-32 px-6 bg-zinc-950 text-white min-h-[60vh] flex items-center">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_65%)] pointer-events-none"></div>
      <div class="mx-auto max-w-4xl text-center relative z-10" data-qay-animate="fade-in">
        <span class="text-xs font-bold uppercase tracking-[0.4em] text-indigo-400">FINALE</span>
        <h2 class="text-4xl md:text-7xl font-black tracking-tight leading-none mt-4" data-qm="cta-title">
          Crafting the next tier.
        </h2>
        <p class="mt-6 text-zinc-400 max-w-xl mx-auto text-base md:text-lg" data-qm="cta-subtitle">
          Unlock the full section templates list. Start exporting high-fidelity variants built to last.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="/contact" class="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all" data-qay-hover="glow">
            ${vars.cta}
          </a>
          <a href="/docs" class="text-xs uppercase tracking-widest font-bold hover:text-indigo-400 transition-colors">Read Documentation &rarr;</a>
        </div>
      </div>
    </section>`,
  ];

  return templates[index % templates.length];
}
