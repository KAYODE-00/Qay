import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getAboutTemplate(index: number, vars: TemplateVariables): string {
  const templates = [
    // 0. Story Split with Scroll-scrub Expand
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        <div data-qay-animate="slide-up">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-400" data-qm="about-eyebrow">OUR ORIGIN</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="about-title">
            The story behind the craft.
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="about-copy">
            We focus on absolute quality, combining dynamic animations with clean layout structures. Built for performance and designed to make a confident first impression.
          </p>
        </div>
        <div class="overflow-hidden rounded-3xl" data-qay-scroll="expand" data-qay-scroll-start="top bottom" data-qay-scroll-end="center center" data-qay-scale="0.85">
          <img src="${vars.galleryImage}" alt="Our team" class="aspect-video w-full object-cover shadow-2xl rounded-3xl" />
        </div>
      </div>
    </section>`,

    // 1. Stats Counter Grid (Dark/Light compatible)
    `<section class="bg-white dark:bg-zinc-900 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="text-center max-w-3xl mx-auto mb-16" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-rose-500" data-qm="about-eyebrow">BY THE NUMBERS</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="about-title">
            Engineered to achieve results.
          </h2>
          <p class="mt-6 text-lg text-zinc-500 dark:text-zinc-400" data-qm="about-copy">
            A visual setup engineered to build trust and show off numbers that matter.
          </p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
          <div class="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50 dark:bg-zinc-950 text-center" data-qay-hover="lift">
            <span class="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">99%</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold text-zinc-400">Client Satisfaction</p>
          </div>
          <div class="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50 dark:bg-zinc-950 text-center" data-qay-hover="lift">
            <span class="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">2.4M</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold text-zinc-400">Users Reached</p>
          </div>
          <div class="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50 dark:bg-zinc-950 text-center" data-qay-hover="lift">
            <span class="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">100+</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold text-zinc-400">Global Launches</p>
          </div>
          <div class="border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50 dark:bg-zinc-950 text-center" data-qay-hover="lift">
            <span class="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">12+</span>
            <p class="mt-3 text-xs uppercase tracking-wider font-bold text-zinc-400">Industry Awards</p>
          </div>
        </div>
      </div>
    </section>`,

    // 2. Bento Style About Grid
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-20 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900 p-8 md:p-12 shadow-sm" data-qay-animate="slide-up">
            <h2 class="text-3xl font-black leading-tight sm:text-5xl" data-qm="about-title">
              Attention in every pixel.
            </h2>
            <p class="mt-6 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="about-copy">
              We design components to fit together seamlessly. Our setups ensure absolute speed, customizable layouts, and animations that adapt to the scroll.
            </p>
          </div>
          <div class="overflow-hidden rounded-3xl relative flex flex-col justify-end p-8 min-h-[300px] shadow-sm group" data-qay-hover="glow">
            <img src="${vars.heroImage}" alt="" class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent"></div>
            <div class="relative z-10 text-white">
              <h3 class="text-lg font-bold">Workspace</h3>
              <p class="mt-2 text-xs text-zinc-300"> Lagos setup hosting our creative builders collective.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 3. Centered Narrative with Floating Stat Accent
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-4xl text-center" data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400" data-qm="about-eyebrow">OUR VISION</p>
        <h2 class="mt-4 text-4xl font-black sm:text-6xl tracking-tight leading-none" data-qm="about-title">Leading the path of modern design.</h2>
        <p class="mt-8 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-light" data-qm="about-copy">
          We strip away complexity to let details shine. Our collective crafts unique layout grids, seamless entrance states, and precise scroll events to give your digital product an editorial presence.
        </p>
        <div class="mt-12 inline-flex items-center gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4" data-qay-hover="glow">
          <div class="h-10 w-10 rounded-full bg-violet-600/10 flex items-center justify-center">
            ${ICONS.shield('size-5 text-violet-600 dark:text-violet-400')}
          </div>
          <div class="text-left">
            <h4 class="text-sm font-bold">Trusted globally</h4>
            <p class="text-xs text-zinc-500">Over 500+ premium teams deploy our sections daily.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 4. Asymmetrical Editorial Split
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 lg:items-center">
        <div class="lg:col-span-5 relative" data-qay-scroll="parallax" data-qay-y="30">
          <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="aspect-[3/4] w-full object-cover rounded-[2rem] shadow-xl" />
          <div class="absolute -bottom-6 -right-6 h-24 w-24 rounded-[2rem] bg-indigo-600 dark:bg-indigo-500 flex flex-col justify-center items-center text-white p-3 shadow-lg">
            <p class="text-2xl font-black">10Y</p>
            <p class="text-[9px] uppercase tracking-widest text-center opacity-85">Experience</p>
          </div>
        </div>
        <div class="lg:col-span-7 lg:pl-8" data-qay-animate="slide-right">
          <p class="text-xs font-bold uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400" data-qm="about-eyebrow">CRAFT & PURPOSE</p>
          <h2 class="mt-4 text-4xl font-extrabold sm:text-6xl tracking-tight leading-none" data-qm="about-title">Beautiful interfaces that speak details.</h2>
          <p class="mt-6 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="about-copy">
            Every boundary, layout, and letter style is chosen to present your story. We balance white space with solid composition so readers focus on the main statement, maximizing attention retention.
          </p>
          <div class="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8 grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-bold text-lg">Absolute Clarity</h4>
              <p class="text-sm text-zinc-500 mt-1">Direct communication styles without user fatigue.</p>
            </div>
            <div>
              <h4 class="font-bold text-lg">Performance First</h4>
              <p class="text-sm text-zinc-500 mt-1">Lightweight layouts that load under 100ms.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 5. Dark Premium Accent split
    `<section class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 lg:items-center relative z-10">
        <div data-qay-animate="slide-up">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-amber-400" data-qm="about-eyebrow">ELITE AGENCY</p>
          <h2 class="mt-4 text-4xl font-black sm:text-5xl" data-qm="about-title">Exceptional standards. No compromise.</h2>
          <p class="mt-6 text-lg text-zinc-400 leading-relaxed" data-qm="about-copy">
            We target top-tier results by rejecting standard templates. Our team crafts high-fidelity websites featuring gorgeous details, optimized layout shifts, and deep aesthetic balance.
          </p>
          <ul class="mt-8 space-y-4">
            <li class="flex items-center gap-3">${ICONS.check('text-amber-400')} <span class="text-sm text-zinc-300">Custom tailor-made typography scales</span></li>
            <li class="flex items-center gap-3">${ICONS.check('text-amber-400')} <span class="text-sm text-zinc-300">Smooth GSAP-driven scroll animation states</span></li>
            <li class="flex items-center gap-3">${ICONS.check('text-amber-400')} <span class="text-sm text-zinc-300">Rigorous dark and light visual testing</span></li>
          </ul>
        </div>
        <div class="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-800 p-2" data-qay-scroll="expand" data-qay-scale="0.9">
          <img src="${vars.galleryImage}" alt="Executive space" class="aspect-[4/3] w-full object-cover rounded-[2rem] opacity-90 hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </section>`,

    // 6. Asymmetric Core Pillars Bento Grid
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-20 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400" data-qm="about-eyebrow">WHAT WE STAND FOR</p>
          <h2 class="mt-4 text-4xl font-black" data-qm="about-title">Core values guiding our process.</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-qay-animate="stagger-children">
          <div class="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-8 shadow-sm" data-qay-hover="lift">
            <div class="size-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-600 dark:text-violet-400">${ICONS.shield('size-6 text-violet-600 dark:text-violet-400')}</div>
            <h3 class="text-xl font-bold mt-6">Safety & Trust</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="about-copy">Every interface is built using production-grade security standards and optimized layouts for stability.</p>
          </div>
          <div class="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-8 shadow-sm lg:col-span-2" data-qay-hover="lift">
            <div class="size-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">${ICONS.globe('size-6 text-indigo-600 dark:text-indigo-400')}</div>
            <h3 class="text-xl font-bold mt-6">Global Scale</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">Our section libraries are distributed globally via high-speed CDNs. Delivering rapid loading speeds to millions of users across 120+ countries daily with absolute visual continuity.</p>
          </div>
          <div class="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-8 shadow-sm lg:col-span-2" data-qay-hover="lift">
            <div class="size-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">${ICONS.user('size-6 text-emerald-600 dark:text-emerald-400')}</div>
            <h3 class="text-xl font-bold mt-6">Human Centered</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">We think about the end-user first. Designing interactive animations that provide haptic feedback, reduce visual load, and keep visitors emotionally connected to your vision.</p>
          </div>
          <div class="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-8 shadow-sm" data-qay-hover="lift">
            <div class="size-12 rounded-2xl bg-rose-600/10 flex items-center justify-center text-rose-600 dark:text-rose-400">${ICONS.lock('size-6 text-rose-600 dark:text-rose-400')}</div>
            <h3 class="text-xl font-bold mt-6">Absolute Integrity</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">Honest communication, predictable pricing models, and bulletproof clean code you can customize anytime.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 7. Editorial Magazine Layout
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid lg:grid-cols-3 gap-12 items-start" data-qay-animate="slide-up">
          <div class="lg:col-span-2">
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400" data-qm="about-eyebrow">DESIGN PHILOSOPHY</p>
            <h2 class="mt-4 text-5xl sm:text-7xl font-black tracking-tight leading-none" data-qm="about-title">Fusing art with technical precision.</h2>
          </div>
          <div class="lg:pt-6">
            <p class="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed" data-qm="about-copy">
              We design spaces that elevate. Our signature templates leverage extreme grid alignment, high-contrast layouts, and clean responsive CSS so your text commands immediate focus.
            </p>
          </div>
        </div>
        <div class="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="overflow-hidden rounded-3xl aspect-[3/4]" data-qay-scroll="parallax" data-qay-y="20">
            <img src="${vars.heroImage}" alt="Detail 1" class="size-full object-cover rounded-3xl" />
          </div>
          <div class="overflow-hidden rounded-3xl aspect-[3/4] translate-y-8" data-qay-scroll="parallax" data-qay-y="-20">
            <img src="${vars.galleryImage}" alt="Detail 2" class="size-full object-cover rounded-3xl" />
          </div>
          <div class="overflow-hidden rounded-3xl aspect-[3/4] col-span-2 md:col-span-1" data-qay-scroll="parallax" data-qay-y="40">
            <img src="${vars.heroImage}" alt="Detail 3" class="size-full object-cover rounded-3xl" />
          </div>
        </div>
      </div>
    </section>`,

    // 8. Visual Timeline Journey
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <div class="text-center mb-16" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-rose-500" data-qm="about-eyebrow">OUR PATHWAY</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="about-title">How we got here.</h2>
          <p class="mt-4 text-zinc-500 dark:text-zinc-400" data-qm="about-copy">A quick look at the milestones defining our dedication to digital quality.</p>
        </div>
        <div class="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-32 space-y-12" data-qay-animate="stagger-children">
          <div class="relative pl-8 md:pl-16">
            <span class="absolute -left-3 top-1.5 size-6 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-rose-500"></span>
            <div class="flex flex-col md:flex-row md:items-baseline gap-2">
              <span class="text-2xl font-black tracking-tight text-rose-500">2021</span>
              <h3 class="text-lg font-bold">The Groundwork</h3>
            </div>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">Founded in Lagos, Nigeria by a small collective of designers seeking to build premium section variants without boilerplate code.</p>
          </div>
          <div class="relative pl-8 md:pl-16">
            <span class="absolute -left-3 top-1.5 size-6 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-rose-500"></span>
            <div class="flex flex-col md:flex-row md:items-baseline gap-2">
              <span class="text-2xl font-black tracking-tight text-rose-500">2023</span>
              <h3 class="text-lg font-bold">Scaling Internationally</h3>
            </div>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">Released our core library, attracting thousands of developers. Formed partnerships with high-profile Webflow and Next.js teams.</p>
          </div>
          <div class="relative pl-8 md:pl-16">
            <span class="absolute -left-3 top-1.5 size-6 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-rose-500"></span>
            <div class="flex flex-col md:flex-row md:items-baseline gap-2">
              <span class="text-2xl font-black tracking-tight text-rose-500">Present</span>
              <h3 class="text-lg font-bold">AI Guided Creation</h3>
            </div>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">Expanding variants dynamically using premium layouts, supporting custom themes, responsive grids, and advanced GSAP triggers.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 9. Frosted Glass Overlay Panel
    `<section class="relative min-h-[80vh] flex items-center justify-end overflow-hidden bg-zinc-950 text-white">
      <div class="absolute inset-0 overflow-hidden">
        <img src="${vars.galleryImage}" alt="Our workshop" class="size-full object-cover opacity-60 scale-105" data-qay-scroll="parallax" data-qay-y="40" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-6 w-full flex justify-start">
        <div class="max-w-xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl" data-qay-animate="scale-in">
          <p class="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400" data-qm="about-eyebrow">OUR PERSPECTIVE</p>
          <h2 class="mt-4 text-3xl sm:text-5xl font-black leading-tight" data-qm="about-title">Making pixels feel real.</h2>
          <p class="mt-6 text-sm sm:text-base text-zinc-300 leading-relaxed" data-qm="about-copy">
            We operate at the interface of software engineering and visual arts. Glassmorphic details overlaying beautiful photography create a tactile feel that keeps users reading.
          </p>
          <div class="mt-8 flex gap-4">
            <span class="rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-400">Tactile UI</span>
            <span class="rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-400">Glassmorphism</span>
          </div>
        </div>
      </div>
    </section>`,

    // 10. Leadership Profile & Quote Split
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 lg:items-center">
        <div data-qay-animate="slide-right">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400" data-qm="about-eyebrow">FOUNDER'S NOTE</p>
          <h2 class="mt-4 text-4xl font-extrabold" data-qm="about-title">Simplicity is the ultimate premium.</h2>
          <div class="mt-8 relative pl-6 border-l-2 border-violet-600 dark:border-violet-400 italic text-zinc-600 dark:text-zinc-300">
            ${ICONS.quote('absolute -left-2 -top-4 size-10 text-violet-600/10 dark:text-violet-400/10')}
            <p class="text-lg leading-relaxed relative z-10" data-qm="about-copy">
              "We noticed that most digital sections feel generic. We built this template set to bring elite, agency-level layout architecture directly to Next.js projects."
            </p>
          </div>
          <div class="mt-6">
            <p class="text-sm font-bold">Kayode Adebayo</p>
            <p class="text-xs text-zinc-400">Creative Director, Qay</p>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-3xl" data-qay-scroll="expand">
          <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="aspect-[4/3] w-full object-cover rounded-3xl shadow-xl" />
        </div>
      </div>
    </section>`,

    // 11. Dark Neon Stat Panel
    `<section class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.1),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 lg:items-center relative z-10">
        <div class="lg:col-span-7" data-qay-animate="slide-up">
          <span class="rounded-full bg-cyan-500/10 border border-cyan-500/25 px-4 py-1.5 text-xs font-bold text-cyan-400 uppercase tracking-widest" data-qm="about-eyebrow">NEON STACK</span>
          <h2 class="mt-6 text-4xl font-black sm:text-6xl" data-qm="about-title">Illuminating digital craftsmanship.</h2>
          <p class="mt-6 text-base text-zinc-400 leading-relaxed" data-qm="about-copy">
            By blending cyberpunk neon borders with layout grids, we produce web sections that immediately grab visual priority and draw eyes down the page.
          </p>
        </div>
        <div class="lg:col-span-5 grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
          <div class="rounded-2xl border border-cyan-500/20 bg-zinc-900/60 p-6 shadow-[0_0_30px_rgba(6,182,212,0.05)]" data-qay-hover="lift">
            <p class="text-3xl font-black text-cyan-400">99.9%</p>
            <h4 class="text-sm font-bold mt-1">Uptime</h4>
            <p class="text-xs text-zinc-500 mt-1">High speed content delivery network.</p>
          </div>
          <div class="rounded-2xl border border-cyan-500/20 bg-zinc-900/60 p-6 shadow-[0_0_30px_rgba(6,182,212,0.05)]" data-qay-hover="lift">
            <p class="text-3xl font-black text-cyan-400">24h</p>
            <h4 class="text-sm font-bold mt-1">Resolution</h4>
            <p class="text-xs text-zinc-500 mt-1">Round-the-clock developer support.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 12. Minimal Outline Grid
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-800 transition-colors">
      <div class="mx-auto max-w-7xl">
        <div class="border-b border-zinc-200 dark:border-zinc-800 pb-12 mb-12 grid md:grid-cols-3 gap-8 items-end" data-qay-animate="slide-up">
          <div class="md:col-span-2">
            <p class="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400" data-qm="about-eyebrow">GRID STRUCTURE</p>
            <h2 class="mt-4 text-4xl sm:text-6xl font-black tracking-tight" data-qm="about-title">Honest architecture.</h2>
          </div>
          <div class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed" data-qm="about-copy">
            We use fine line outlines to structure visual info. No heavy fills, no unnecessary gradients. Just pristine typography placed inside exact grids.
          </div>
        </div>
        <div class="grid md:grid-cols-3 border border-zinc-200 dark:border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 rounded-3xl overflow-hidden">
          <div class="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" data-qay-hover="scale">
            <span class="text-xs font-bold text-zinc-400">01 / BRANDING</span>
            <h3 class="text-xl font-bold mt-4">Identity Scales</h3>
            <p class="text-sm text-zinc-500 mt-2">Creating matching font patterns and color structures for standard systems.</p>
          </div>
          <div class="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" data-qay-hover="scale">
            <span class="text-xs font-bold text-zinc-400">02 / CODE</span>
            <h3 class="text-xl font-bold mt-4">Next.js Ready</h3>
            <p class="text-sm text-zinc-500 mt-2">Zero-config templates built on Next.js structures, supporting Server Components.</p>
          </div>
          <div class="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" data-qay-hover="scale">
            <span class="text-xs font-bold text-zinc-400">03 / MOTION</span>
            <h3 class="text-xl font-bold mt-4">GSAP Physics</h3>
            <p class="text-sm text-zinc-500 mt-2">Custom scroll scrubbing properties that emulate real-world physics and ease curves.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 13. Programmatic Styling Container
    (() => {
      const s = getStyleForIndex(index);
      return `<section class="${s.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl rounded-3xl ${s.bgInner} ${s.border} p-8 md:p-16" ${s.animate}>
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.3em] ${s.accentText}" data-qm="about-eyebrow">MODERN ADAPTABILITY</p>
            <h2 class="mt-4 text-4xl font-extrabold leading-tight" data-qm="about-title">Programmatically matched theme patterns.</h2>
            <p class="mt-6 text-base ${s.textMuted} leading-relaxed" data-qm="about-copy">
              This variant changes its color accents, border styles, and animations programmatically based on its placement index inside the Qay system.
            </p>
          </div>
          <div class="relative overflow-hidden rounded-2xl" ${s.scroll}>
            <img src="${vars.galleryImage}" alt="Workspace" class="w-full aspect-video object-cover rounded-2xl" />
          </div>
        </div>
      </div>
    </section>`;
    })(),

    // 14. Interactive Feature Accents
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 lg:items-center">
        <div class="relative overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-900" data-qay-scroll="expand">
          <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="aspect-[4/3] w-full object-cover rounded-[1.8rem]" />
        </div>
        <div data-qay-animate="slide-right">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400" data-qm="about-eyebrow">OUR METHOD</p>
          <h2 class="mt-4 text-4xl font-black" data-qm="about-title">Structured for elite delivery.</h2>
          <p class="mt-6 text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8" data-qm="about-copy">
            We follow a three-stage roadmap to ensure zero friction between designer concepts and browser runtime implementation.
          </p>
          <div class="space-y-4">
            <div class="border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 class="font-bold text-lg flex justify-between items-center text-zinc-800 dark:text-zinc-150"><span>01 / Blueprint Mapping</span> <span class="text-emerald-500">→</span></h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Translating your user pathways into crisp layout schematics.</p>
            </div>
            <div class="border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 class="font-bold text-lg flex justify-between items-center text-zinc-800 dark:text-zinc-150"><span>02 / High-Fidelity Build</span> <span class="text-emerald-500">→</span></h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Injecting optimized Tailwind styling classes and clean DOM components.</p>
            </div>
            <div>
              <h3 class="font-bold text-lg flex justify-between items-center text-zinc-800 dark:text-zinc-150"><span>03 / Kinetic Animations</span> <span class="text-emerald-500">→</span></h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Wiring scroll triggers to produce delightful parallax or entrance states.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 15. Minimalist 3-Column Card Grid
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="max-w-3xl mb-16" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400" data-qm="about-eyebrow">WHAT DRIVES US</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="about-title">Committed to visual excellence.</h2>
          <p class="mt-6 text-zinc-500 dark:text-zinc-400" data-qm="about-copy">We structure our deliverables to address your business values directly and scale seamlessly.</p>
        </div>
        <div class="grid gap-8 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="bg-white dark:bg-zinc-900 border-t-4 border-indigo-600 dark:border-indigo-400 rounded-2xl p-8 shadow-sm" data-qay-hover="lift">
            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">STAGE 1</span>
            <h3 class="text-xl font-bold mt-4">Precision Graphics</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">Crisp lines and layout alignments designed specifically to frame your imagery perfectly.</p>
          </div>
          <div class="bg-white dark:bg-zinc-900 border-t-4 border-emerald-600 dark:border-emerald-400 rounded-2xl p-8 shadow-sm" data-qay-hover="lift">
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">STAGE 2</span>
            <h3 class="text-xl font-bold mt-4">Liquid Layouts</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">Components that shift seamlessly across mobile, tablet, and ultra-wide screens.</p>
          </div>
          <div class="bg-white dark:bg-zinc-900 border-t-4 border-rose-600 dark:border-rose-400 rounded-2xl p-8 shadow-sm" data-qay-hover="lift">
            <span class="text-xs font-bold text-rose-600 dark:text-rose-400">STAGE 3</span>
            <h3 class="text-xl font-bold mt-4">Optimized Core</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">Lightweight CSS loading rules designed to bypass browser delay triggers.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 16. Magazine Overlap Spread
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 relative" data-qay-scroll="parallax" data-qay-y="20">
          <img src="${vars.galleryImage}" alt="Production" class="aspect-[16/10] w-full object-cover rounded-3xl shadow-xl" />
        </div>
        <div class="lg:col-span-5 lg:-ml-16 relative z-10" data-qay-animate="slide-right">
          <div class="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-10 shadow-2xl">
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400" data-qm="about-eyebrow">THE ARCHITECTURE</p>
            <h2 class="mt-4 text-3xl font-black tracking-tight leading-tight" data-qm="about-title">Structured overlap.</h2>
            <p class="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="about-copy">
              A visually engaging negative-margin layout breaks the standard grid gridlock, drawing user interest to text content overlapping primary brand photography.
            </p>
          </div>
        </div>
      </div>
    </section>`,

    // 17. Clustered Multi-Image Grid
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="text-center max-w-3xl mx-auto mb-16" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-amber-500" data-qm="about-eyebrow">OUR ECOSYSTEM</p>
          <h2 class="mt-4 text-4xl font-black tracking-tight" data-qm="about-title">Surrounded by creativity.</h2>
          <p class="mt-6 text-zinc-500 dark:text-zinc-400" data-qm="about-copy">A workspace tailored to foster deep focus, collaborative critique, and pixel refinement.</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl overflow-hidden aspect-square shadow-sm" data-qay-hover="img-zoom">
            <img src="${vars.heroImage}" alt="Detail A" class="size-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          <div class="rounded-2xl overflow-hidden aspect-square shadow-sm lg:translate-y-8" data-qay-hover="img-zoom">
            <img src="${vars.galleryImage}" alt="Detail B" class="size-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          <div class="rounded-2xl overflow-hidden aspect-square shadow-sm" data-qay-hover="img-zoom">
            <img src="${vars.heroImage}" alt="Detail C" class="size-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          <div class="rounded-2xl overflow-hidden aspect-square shadow-sm lg:translate-y-8" data-qay-hover="img-zoom">
            <img src="${vars.galleryImage}" alt="Detail D" class="size-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
        </div>
      </div>
    </section>`,

    // 18. Editorial Sidebar Split
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300 border-b border-zinc-200 dark:border-zinc-800">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-4 lg:sticky lg:top-8" data-qay-animate="slide-right">
          <p class="text-xs font-bold uppercase tracking-[0.4em] text-rose-500" data-qm="about-eyebrow">PERSISTENT DETAILS</p>
          <h2 class="mt-4 text-4xl font-extrabold tracking-tight" data-qm="about-title">Why choose our workflow?</h2>
          <div class="mt-6 flex items-center gap-3">
            <span class="h-0.5 w-12 bg-rose-500"></span>
            <span class="text-xs uppercase font-bold tracking-widest text-zinc-400">DESIGN MANUAL</span>
          </div>
        </div>
        <div class="lg:col-span-8 space-y-8" data-qay-animate="slide-up">
          <p class="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-light" data-qm="about-copy">
            We operate at the interface of software engineering and visual arts. Glassmorphic details overlaying beautiful photography create a tactile feel that keeps users reading.
          </p>
          <div class="grid sm:grid-cols-2 gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <h4 class="font-bold text-lg text-rose-500">99% Delivery Rate</h4>
              <p class="text-sm text-zinc-500 mt-2 leading-relaxed">Our templates load instantaneously, bypassing the layout shifts common in old themes.</p>
            </div>
            <div>
              <h4 class="font-bold text-lg text-rose-500">Fluid Scaling</h4>
              <p class="text-sm text-zinc-500 mt-2 leading-relaxed">Every grid adjusts to high-density displays, preserving design fidelity everywhere.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 19. High-Contrast Asymmetric Grid
    (() => {
      const s = getStyleForIndex(19);
      return `<section class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center" data-qay-animate="slide-up">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.4em] ${s.accentText}" data-qm="about-eyebrow">FINAL CHAPTER</p>
            <h2 class="mt-4 text-4xl sm:text-6xl font-black leading-none" data-qm="about-title">Engineered to elevate brands.</h2>
            <p class="mt-6 text-lg ${s.textMuted} leading-relaxed" data-qm="about-copy">
              We close the loop between beautiful design mockups and actual clean production output. Trust us to build your next high-impact landing page.
            </p>
            <div class="mt-10">
              <a href="/contact" class="rounded-full bg-white text-zinc-950 hover:bg-zinc-200 px-8 py-4 text-sm font-bold transition-all shadow-lg inline-flex">${vars.cta}</a>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-3xl overflow-hidden aspect-[3/4]" ${s.scroll}>
              <img src="${vars.galleryImage}" alt="Workspace details" class="size-full object-cover" />
            </div>
            <div class="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-end min-h-[200px]" data-qay-hover="glow">
              <p class="text-4xl font-black ${s.accentText}">99%</p>
              <p class="text-xs text-zinc-400 mt-2 uppercase tracking-widest font-bold">Accuracy rate in coding layouts.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
    })(),
  ];

  return templates[index % templates.length];
}
