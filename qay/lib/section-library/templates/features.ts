import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getFeaturesTemplate(index: number, vars: TemplateVariables): string {
  const templates = [
    // 0. Bento-style features layout
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 text-center max-w-2xl mx-auto" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-indigo-650 dark:text-indigo-400" data-qm="features-eyebrow">FEATURES</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="features-title">
            Designed to perform.
          </h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
          <article class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm md:row-span-2" data-qay-hover="lift">
            <span class="text-4xl font-black text-indigo-650 dark:text-indigo-400">01</span>
            <h3 class="mt-8 text-xl font-bold" data-qm="feature-title">Asymmetric Bento Grid</h3>
            <p class="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="feature-copy">
              Clean modular structures built with beautiful spacing that adapt elegantly to any screen size.
            </p>
          </article>
          <article class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm" data-qay-hover="lift">
            <h3 class="text-xl font-bold" data-qm="feature-title">Interactive Hover System</h3>
            <p class="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="feature-copy">
              Interactive feedback using micro-animations like lift, scale, and glow.
            </p>
          </article>
          <article class="rounded-3xl bg-zinc-900 dark:bg-zinc-800 p-8 text-white shadow-sm" data-qay-hover="scale">
            <h3 class="text-xl font-bold text-amber-400" data-qm="feature-title">Premium Typography</h3>
            <p class="mt-4 text-sm leading-relaxed opacity-90" data-qm="feature-copy">
              Google Fonts configured automatically to fit the brand theme variables.
            </p>
          </article>
          <article class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm md:col-span-2" data-qay-hover="lift">
            <h3 class="text-xl font-bold" data-qm="feature-title">Tailwind CSS Utility Code</h3>
            <p class="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="feature-copy">
              Sleek layout blocks that output direct inline styles and standard responsive utility classes.
            </p>
          </article>
        </div>
      </div>
    </section>`,

    // 1. List style features layout
    `<section class="bg-white dark:bg-zinc-900 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid gap-16 lg:grid-cols-[1fr_2fr]">
        <div class="space-y-6" data-qay-animate="slide-right">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-rose-500" data-qm="features-eyebrow">CAPABILITIES</p>
          <h2 class="text-4xl font-black leading-tight md:text-5xl" data-qm="features-title">
            Engineered for growth.
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="features-copy">
            Choose layout templates loaded with SVG icons, clean themes, and scroll triggers.
          </p>
        </div>
        <div class="space-y-4" data-qay-animate="stagger-children">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg">
            <div class="flex items-start gap-4">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 font-bold">A</span>
              <div>
                <h3 class="text-lg font-bold" data-qm="service-title">Clean Code Conversion</h3>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1" data-qm="service-copy">Converts HTML blocks directly to responsive layer nodes.</p>
              </div>
            </div>
            <a href="/contact" class="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-center select-none shrink-0">
              ${vars.cta}
            </a>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg">
            <div class="flex items-start gap-4">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 font-bold">B</span>
              <div>
                <h3 class="text-lg font-bold" data-qm="service-title">Dark & Light Styling</h3>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1" data-qm="service-copy">Full support for color mode toggles across elements.</p>
              </div>
            </div>
            <a href="/contact" class="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-center select-none shrink-0">
              ${vars.cta}
            </a>
          </div>
        </div>
      </div>
    </section>`,

    // 2. Split layout with large side image left and 2x2 grid right
    `<section id="${vars.idBase}-feat-2" class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-16 items-center">
        <div class="lg:col-span-5 relative" data-qay-scroll="parallax" data-qay-y="20">
          <img src="${vars.heroImage}" alt="" class="aspect-[4/5] w-full object-cover rounded-[2rem] shadow-2xl" />
        </div>
        <div class="lg:col-span-7 space-y-8" data-qay-animate="slide-right">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400" data-qm="features-eyebrow">ELITE DEVELOPMENT</p>
            <h2 class="text-3xl md:text-5xl font-black mt-4 leading-tight" data-qm="features-title">Optimized features built for power.</h2>
          </div>
          <div class="grid sm:grid-cols-2 gap-6" data-qay-animate="stagger-children">
            <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800" data-qay-hover="lift">
              <h3 class="font-bold text-lg" data-qm="feature-title">Liquid Scaling</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Every element adapts perfectly to mobile viewports without design degradation.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800" data-qay-hover="lift">
              <h3 class="font-bold text-lg" data-qm="feature-title">Kinetic Triggers</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Wire elegant GSAP scroll animations seamlessly directly via simple attributes.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800" data-qay-hover="lift">
              <h3 class="font-bold text-lg" data-qm="feature-title">Figma Equivalence</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Code alignments match your design coordinates down to the exact pixel.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800" data-qay-hover="lift">
              <h3 class="font-bold text-lg" data-qm="feature-title">Zero Bloat</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Super lightweight CSS structure ensures load times always stay sub-100ms.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 3. Asymmetric Magazine/Editorial Grid (Luxury theme, fine borders)
    `<section id="${vars.idBase}-feat-3" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl border-y border-zinc-200 dark:border-zinc-800 py-16">
        <div class="grid lg:grid-cols-3 gap-12 items-start" data-qay-animate="slide-up">
          <div class="lg:col-span-2">
            <span class="text-xs font-serif italic text-zinc-450 dark:text-zinc-500">Design Perspective</span>
            <h2 class="text-4xl md:text-6xl font-serif mt-4 tracking-tight leading-none" data-qm="features-title">Pure geometry meets digital performance.</h2>
          </div>
          <div class="lg:pt-6">
            <p class="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed" data-qm="features-copy">
              We focus on whitespace and fine outline geometry to bring focus to primary visual assets. Stripping away complexity, we create landing grids that frame details perfectly.
            </p>
          </div>
        </div>
        <div class="mt-16 grid gap-6 md:grid-cols-3 border border-zinc-250/80 dark:border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 rounded-3xl overflow-hidden">
          <div class="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" data-qay-hover="scale">
            <span class="text-xs font-mono text-zinc-450">01 / PERSPECTIVE</span>
            <h3 class="text-xl font-serif mt-4" data-qm="feature-title">Editorial Tone</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Elevated typography scale coordinates aligned neatly to preserve visual hierarchy limits.</p>
          </div>
          <div class="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" data-qay-hover="scale">
            <span class="text-xs font-mono text-zinc-450">02 / STRUCTURE</span>
            <h3 class="text-xl font-serif mt-4" data-qm="feature-title">Asymmetric Grids</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Layouts that break the standard grid lock, giving sections a bespoke, custom-designed feel.</p>
          </div>
          <div class="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" data-qay-hover="scale">
            <span class="text-xs font-mono text-zinc-450">03 / MOTION</span>
            <h3 class="text-xl font-serif mt-4" data-qm="feature-title">Liquid Flow</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Smooth transitions designed specifically to reduce visual load and maximize attention retention.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 4. 4-column Bento grid with custom SVG icons (lock, shield, globe, user)
    `<section id="${vars.idBase}-feat-4" class="bg-zinc-900 text-white px-6 py-24 relative overflow-hidden transition-colors duration-300">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.06),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-16 max-w-2xl" data-qay-animate="fade-in">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">ENTERPRISE CAPABILITIES</span>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">Engineered to scale secure systems.</h2>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
          <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between" data-qay-hover="glow">
            <div class="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">${ICONS.lock('size-5 text-indigo-400')}</div>
            <div class="mt-12">
              <h3 class="text-lg font-bold" data-qm="feature-title">End-to-End Encryption</h3>
              <p class="text-xs text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Secure keys encrypt your layout properties, keeping client structures completely private.</p>
            </div>
          </div>
          <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between" data-qay-hover="glow">
            <div class="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">${ICONS.shield('size-5 text-indigo-400')}</div>
            <div class="mt-12">
              <h3 class="text-lg font-bold" data-qm="feature-title">Threat Mitigation</h3>
              <p class="text-xs text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Continuous server audit checks protect exported template routes against data intrusion.</p>
            </div>
          </div>
          <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between" data-qay-hover="glow">
            <div class="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">${ICONS.globe('size-5 text-indigo-400')}</div>
            <div class="mt-12">
              <h3 class="text-lg font-bold" data-qm="feature-title">Global Network CDN</h3>
              <p class="text-xs text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Static section blocks are cached globally, rendering under 80ms on any mobile link.</p>
            </div>
          </div>
          <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between" data-qay-hover="glow">
            <div class="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">${ICONS.user('size-5 text-indigo-400')}</div>
            <div class="mt-12">
              <h3 class="text-lg font-bold" data-qm="feature-title">Multi-Tenant Access</h3>
              <p class="text-xs text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Coordinate sections seamlessly across workspaces using standard member roles.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 5. Glassmorphic service grid over gradient background
    `<section id="${vars.idBase}-feat-5" class="bg-zinc-950 text-white py-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-650/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-16 text-center max-w-2xl mx-auto" data-qay-animate="fade-in">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">SERVICES</span>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">Tailored tech integrations.</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl" data-qay-hover="glow">
            <h3 class="text-xl font-bold" data-qm="service-title">UI Design presetting</h3>
            <p class="text-sm text-zinc-350 mt-4 leading-relaxed" data-qm="service-copy">Bespoke UI styling setups programmatically tuned to coordinate accents, typography scale, and margins.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl" data-qay-hover="glow">
            <h3 class="text-xl font-bold" data-qm="service-title">Kinetic animations</h3>
            <p class="text-sm text-zinc-350 mt-4 leading-relaxed" data-qm="service-copy">Adding high-impact, lightweight scroll events using GSAP triggers that perform gracefully.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl" data-qay-hover="glow">
            <h3 class="text-xl font-bold" data-qm="service-title">Optimization audits</h3>
            <p class="text-sm text-zinc-350 mt-4 leading-relaxed" data-qm="service-copy">Rigorous visual diagnostics to fix design inconsistencies, loading shifts, and dark mode defects.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 6. Sticky split: text stays sticky left, large features scroll right
    `<section id="${vars.idBase}-feat-6" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-5 lg:sticky lg:top-10 space-y-6" data-qay-animate="slide-right">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">BENEFITS</span>
          <h2 class="text-3xl md:text-5xl font-black leading-tight" data-qm="features-title">Built differently to solve problems.</h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed" data-qm="features-copy">
            We bypass traditional template restrictions to offer visual systems with deep adaptability.
          </p>
        </div>
        <div class="lg:col-span-7 space-y-8" data-qay-animate="stagger-children">
          <div class="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800" data-qay-hover="lift">
            <img src="${vars.galleryImage}" alt="" class="aspect-video w-full object-cover rounded-2xl mb-6 shadow-md" />
            <h3 class="text-xl font-bold" data-qm="feature-title">01 / Dynamic theme scaling</h3>
            <p class="text-sm text-zinc-550 dark:text-zinc-450 mt-2 leading-relaxed" data-qm="feature-copy">Our templates map style variables inside layout scripts, so toggling indices programmatically shifts color matrices immediately.</p>
          </div>
          <div class="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800" data-qay-hover="lift">
            <h3 class="text-xl font-bold" data-qm="feature-title">02 / Seamless responsive alignment</h3>
            <p class="text-sm text-zinc-550 dark:text-zinc-450 mt-2 leading-relaxed" data-qm="feature-copy">Using strict mobile-first CSS classes makes sure elements scale fluidly across tablet, mobile, and ultra-wide displays.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 7. Horizontal scroll rail layout for features
    `<section id="${vars.idBase}-feat-7" class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4" data-qay-animate="fade-in">
          <div>
            <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">EXPLORE</span>
            <h2 class="text-3xl md:text-5xl font-black mt-2" data-qm="features-title">Core capabilities grid.</h2>
          </div>
          <span class="text-xs text-zinc-450 font-bold uppercase tracking-widest hidden sm:inline-block">Swipe horizontally &rarr;</span>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-none" data-qay-animate="stagger-children">
          <div class="min-w-[300px] md:min-w-[380px] snap-start border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm" data-qay-hover="lift">
            <span class="text-xs font-mono text-zinc-450">01 / STRUCTURAL</span>
            <h3 class="text-lg font-bold mt-4" data-qm="feature-title">Tailwind CSS Preset</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Pristine utility syntax exports directly to production-ready Next.js routes.</p>
          </div>
          <div class="min-w-[300px] md:min-w-[380px] snap-start border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm" data-qay-hover="lift">
            <span class="text-xs font-mono text-zinc-450">02 / INTERACTION</span>
            <h3 class="text-lg font-bold mt-4" data-qm="feature-title">Micro Hover System</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Feedback mechanisms built right into DOM attributes (lift, glow, scale).</p>
          </div>
          <div class="min-w-[300px] md:min-w-[380px] snap-start border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm" data-qay-hover="lift">
            <span class="text-xs font-mono text-zinc-450">03 / PERFORMANCE</span>
            <h3 class="text-lg font-bold mt-4" data-qm="feature-title">Layout Shift Proof</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2" data-qm="feature-copy">Fixed sizes on media nodes preserve your layout scores inside Google metrics.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 8. Minimalist stacked list with giant numbers
    `<section id="${vars.idBase}-feat-8" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <div class="max-w-2xl mb-16" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">SYSTEM ARCHITECTURE</p>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">How we deliver speed.</h2>
        </div>
        <div class="divide-y divide-zinc-200 dark:divide-zinc-800" data-qay-animate="stagger-children">
          <div class="py-8 flex flex-col md:flex-row gap-6 justify-between items-start hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors p-4 rounded-xl" data-qay-hover="scale">
            <div class="flex gap-6 items-baseline">
              <span class="text-2xl font-black text-rose-500 font-mono">01</span>
              <div>
                <h3 class="text-xl font-bold" data-qm="feature-title">Layout Parsing</h3>
                <p class="text-sm text-zinc-550 dark:text-zinc-400 mt-2 max-w-xl" data-qm="feature-copy">We break custom DOM components down to raw elements before converting into Tailwind layers.</p>
              </div>
            </div>
          </div>
          <div class="py-8 flex flex-col md:flex-row gap-6 justify-between items-start hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors p-4 rounded-xl" data-qay-hover="scale">
            <div class="flex gap-6 items-baseline">
              <span class="text-2xl font-black text-rose-500 font-mono">02</span>
              <div>
                <h3 class="text-xl font-bold" data-qm="feature-title">Variable Injection</h3>
                <p class="text-sm text-zinc-550 dark:text-zinc-400 mt-2 max-w-xl" data-qm="feature-copy">Your specified terms, icons, image locations, and titles replace mock terms programmatically.</p>
              </div>
            </div>
          </div>
          <div class="py-8 flex flex-col md:flex-row gap-6 justify-between items-start hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors p-4 rounded-xl" data-qay-hover="scale">
            <div class="flex gap-6 items-baseline">
              <span class="text-2xl font-black text-rose-500 font-mono">03</span>
              <div>
                <h3 class="text-xl font-bold" data-qm="feature-title">Motion Binding</h3>
                <p class="text-sm text-zinc-550 dark:text-zinc-400 mt-2 max-w-xl" data-qm="feature-copy">GSAP scroll limits compile directly, giving landing layouts professional responsive flow curves.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 9. Dark Neon Tech Grid with glowing borders
    `<section id="${vars.idBase}-feat-9" class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.06),transparent_65%)]"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-16 text-center" data-qay-animate="fade-in">
          <span class="px-3 py-1 bg-cyan-950 border border-cyan-800 text-[10px] uppercase font-mono tracking-widest text-cyan-400 rounded-full">SYSTEM STACK</span>
          <h2 class="mt-6 text-3xl md:text-5xl font-black" data-qm="features-title">High-density visual layouts.</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="rounded-2xl border border-cyan-500/25 bg-zinc-900/60 p-8 shadow-[0_0_30px_rgba(6,182,212,0.03)]" data-qay-hover="glow">
            <h3 class="text-xl font-mono text-cyan-400" data-qm="feature-title">// 01 SPEED</h3>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed" data-qm="feature-copy">Underlying CSS loads asynchronously without delay triggers, providing immediate mobile page load indexes.</p>
          </div>
          <div class="rounded-2xl border border-cyan-500/25 bg-zinc-900/60 p-8 shadow-[0_0_30px_rgba(6,182,212,0.03)]" data-qay-hover="glow">
            <h3 class="text-xl font-mono text-cyan-400" data-qm="feature-title">// 02 STABILITY</h3>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed" data-qm="feature-copy">Precise block dimension bounds remove layout shifts completely, keeping page alignment indices perfect.</p>
          </div>
          <div class="rounded-2xl border border-cyan-500/25 bg-zinc-900/60 p-8 shadow-[0_0_30px_rgba(6,182,212,0.03)]" data-qay-hover="glow">
            <h3 class="text-xl font-mono text-cyan-400" data-qm="feature-title">// 03 ADAPTABILITY</h3>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed" data-qm="feature-copy">Component style models switch programmatically. Coordinates adapt fluidly based on dark/light status.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 10. Vertical Timeline / Step-by-step service flow
    `<section id="${vars.idBase}-feat-10" class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-4xl">
        <div class="text-center mb-16" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400" data-qm="features-subtitle">ONBOARDING PATHWAY</p>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">How we deploy code.</h2>
        </div>
        <div class="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-32 space-y-12" data-qay-animate="stagger-children">
          <div class="relative pl-8 md:pl-16">
            <span class="absolute -left-3 top-1.5 size-6 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-indigo-600 dark:bg-indigo-400"></span>
            <span class="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Step 01</span>
            <h3 class="text-lg font-bold mt-1" data-qm="feature-title">Template Mapping</h3>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl" data-qm="feature-copy">Your design requirements, variables, images, and content markers get programmatically parsed inside our template layouts.</p>
          </div>
          <div class="relative pl-8 md:pl-16">
            <span class="absolute -left-3 top-1.5 size-6 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-indigo-600 dark:bg-indigo-400"></span>
            <span class="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Step 02</span>
            <h3 class="text-lg font-bold mt-1" data-qm="feature-title">Tailwind Optimization</h3>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl" data-qm="feature-copy">DOM structures convert into clean responsive layers, using clean CSS properties to maximize render speed indexes.</p>
          </div>
          <div class="relative pl-8 md:pl-16">
            <span class="absolute -left-3 top-1.5 size-6 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-indigo-600 dark:bg-indigo-400"></span>
            <span class="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Step 03</span>
            <h3 class="text-lg font-bold mt-1" data-qm="feature-title">Kinetic Binding</h3>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl" data-qm="feature-copy">Entrance transitions and scroll triggers get wired, generating a live browser preview with smooth movement loops.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 11. Style-adaptive features grid
    (() => {
      const s = getStyleForIndex(index);
      return `<section id="${vars.idBase}-feat-11" class="${s.bg} py-24 px-6 transition-colors duration-300">
        <div class="mx-auto max-w-7xl" ${s.animate}>
          <div class="mb-16 max-w-3xl">
            <span class="text-xs font-bold uppercase tracking-[0.3em] ${s.accentText}">THEMATIC PATTERN</span>
            <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">System-matched components.</h2>
          </div>
          <div class="grid gap-6 md:grid-cols-2" ${s.scroll}>
            <div class="p-8 rounded-3xl ${s.bgInner} ${s.border}" ${s.hover}>
              <h3 class="text-xl font-bold" data-qm="feature-title">Matched Typography Presets</h3>
              <p class="text-sm ${s.textMuted} mt-3 leading-relaxed" data-qm="feature-copy">Our framework reads index styles, modifying title sizing, border weights, and hover presets dynamically.</p>
            </div>
            <div class="p-8 rounded-3xl ${s.bgInner} ${s.border}" ${s.hover}>
              <h3 class="text-xl font-bold" data-qm="feature-title">Coordinated Transitions</h3>
              <p class="text-sm ${s.textMuted} mt-3 leading-relaxed" data-qm="feature-copy">micro-interaction paths coordinates seamlessly, ensuring absolute visual symmetry inside template rows.</p>
            </div>
          </div>
        </div>
      </section>`;
    })(),

    // 12. 3D floating cards layout with offset layers
    `<section id="${vars.idBase}-feat-12" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-6" data-qay-animate="slide-right">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">DIMENSIONAL DEPTH</span>
          <h2 class="text-3xl md:text-5xl font-black leading-tight" data-qm="features-title">Offset grid panels that stand out.</h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed" data-qm="features-copy">
            By layering components with different drop shadow offsets, we emulate real-world tactile UI, drawing immediate priority to core details.
          </p>
        </div>
        <div class="relative min-h-[400px]" data-qay-animate="stagger-children">
          <div class="absolute top-0 left-0 w-4/5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 shadow-md" data-qay-hover="scale">
            <h3 class="text-lg font-bold" data-qm="feature-title">Dynamic shadow mapping</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Shadows scale based on mouse positions, mimicking realistic depth shifts.</p>
          </div>
          <div class="absolute bottom-0 right-0 w-4/5 rounded-3xl bg-zinc-900 dark:bg-zinc-850 p-8 text-white shadow-2xl translate-y-6 -translate-x-6" data-qay-hover="glow">
            <h3 class="text-lg font-bold text-rose-400" data-qm="feature-title">Tactile UI elements</h3>
            <p class="text-xs text-zinc-350 mt-2 leading-relaxed" data-qm="feature-copy">Haptic micro-movements align user coordinates, guiding them smoothly down the visual list.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 13. SaaS Dashboard Hero Highlight
    `<section id="${vars.idBase}-feat-13" class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="text-center max-w-2xl mx-auto mb-16" data-qay-animate="fade-in">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">INTERFACE</span>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">Fully integrated workspaces.</h2>
        </div>
        <div class="relative rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-2xl" data-qay-scroll="expand">
          <img src="${vars.galleryImage}" alt="System UI" class="w-full aspect-[16/10] object-cover rounded-[1.8rem] opacity-90" />
          <div class="absolute -bottom-6 left-6 max-w-xs rounded-2xl bg-zinc-950 text-white p-6 shadow-2xl border border-zinc-800 hidden md:block" data-qay-hover="glow">
            <h4 class="font-bold text-sm text-indigo-400" data-qm="feature-title">Live Preview Metrics</h4>
            <p class="text-[10px] text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">See layout updates compile instantly as design variables change inside Qay.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 14. Luxury Editorial Layout (Bespoke line art, High whitespace)
    `<section id="${vars.idBase}-feat-14" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-6xl">
        <div class="border-b border-zinc-200 dark:border-zinc-850 pb-12 mb-16 grid md:grid-cols-2 gap-8 items-end" data-qay-animate="slide-up">
          <div>
            <span class="text-xs font-serif italic text-zinc-400 dark:text-zinc-500">Fine Craft</span>
            <h2 class="text-4xl md:text-5xl font-serif mt-2 tracking-tight" data-qm="features-title">Absolute composition.</h2>
          </div>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed" data-qm="features-copy">
            We target pristine spaces. Using subtle border outlines to align typography weights gives your digital projects an elegant, editorial presence.
          </p>
        </div>
        <div class="grid gap-12 sm:grid-cols-2 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="space-y-4">
            <span class="text-xs font-mono tracking-widest text-zinc-400 block">I / IDENTITY Presets</span>
            <h3 class="text-xl font-serif" data-qm="feature-title">Typography scales</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="feature-copy">Fine-tune headings, body sizes, and heights automatically according to strict brand scales.</p>
          </div>
          <div class="space-y-4">
            <span class="text-xs font-mono tracking-widest text-zinc-400 block">II / GRAPHIC Lines</span>
            <h3 class="text-xl font-serif" data-qm="feature-title">Outline matrices</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="feature-copy">Bespoke border dividers structure your interface elements, avoiding heavy blocks or shapes.</p>
          </div>
          <div class="space-y-4">
            <span class="text-xs font-mono tracking-widest text-zinc-400 block">III / MOTION Physics</span>
            <h3 class="text-xl font-serif" data-qm="feature-title">Viscous easing</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed" data-qm="feature-copy">GSAP easing curves emulate physical weight, creating responsive flow states on scroll.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 15. Bento grid with large features left, smaller columns right
    `<section id="${vars.idBase}-feat-15" class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 lg:grid-cols-12 items-stretch" data-qay-animate="stagger-children">
          <div class="lg:col-span-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 flex flex-col justify-between" data-qay-hover="lift">
            <div>
              <span class="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">CORE FOCUS</span>
              <h2 class="text-3xl md:text-5xl font-black mt-4 leading-tight" data-qm="features-title">Engineered to output clean production templates.</h2>
              <p class="mt-4 text-zinc-500 dark:text-zinc-400 text-sm md:text-base" data-qm="features-copy">
                We bridge the gap between design tools and the web browser. Export components directly as modular layers, maintaining absolute formatting fidelity.
              </p>
            </div>
            <div class="mt-8 overflow-hidden rounded-2xl">
              <img src="${vars.galleryImage}" alt="" class="w-full aspect-video object-cover" />
            </div>
          </div>
          <div class="lg:col-span-4 flex flex-col gap-6">
            <div class="rounded-3xl bg-zinc-900 text-white p-8 flex-1 flex flex-col justify-between border border-zinc-800" data-qay-hover="glow">
              <h3 class="text-lg font-bold" data-qm="feature-title">Variable presets</h3>
              <p class="text-xs text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Inject site titles, terms, color themes, and custom images programmatically in a click.</p>
            </div>
            <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex-1 flex flex-col justify-between" data-qay-hover="lift">
              <h3 class="text-lg font-bold" data-qm="feature-title">Fluid scroll trigger</h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Dynamic scroll tracking matches user speed, adding texture to layouts on scroll.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 16. Accordion-style service layout (expandable items)
    `<section id="${vars.idBase}-feat-16" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <div class="mb-16 text-center" data-qay-animate="fade-in">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">SERVICES MENU</span>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">Specialized design programs.</h2>
        </div>
        <div class="space-y-4" data-qay-animate="stagger-children">
          <div class="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group cursor-pointer" data-qay-hover="scale">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold flex gap-4 items-center" data-qm="service-title"><span class="text-zinc-400">01 /</span> <span>Full-Stack Design</span></h3>
              <span class="text-2xl text-zinc-400 group-hover:translate-x-2 transition-transform">&rarr;</span>
            </div>
            <div class="mt-4 max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-350 ease-in-out">
              <p class="text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed" data-qm="service-copy">Coordinate branding assets, layout coordinates, interactive design presets, and core code structures directly inside Next.js environments.</p>
            </div>
          </div>
          <div class="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group cursor-pointer" data-qay-hover="scale">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold flex gap-4 items-center" data-qm="service-title"><span class="text-zinc-400">02 /</span> <span>Kinetic UX Programs</span></h3>
              <span class="text-2xl text-zinc-400 group-hover:translate-x-2 transition-transform">&rarr;</span>
            </div>
            <div class="mt-4 max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-350 ease-in-out">
              <p class="text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed" data-qm="service-copy">Applying advanced motion engineering principles to landing layers, building custom transitions, loading events, and scroll physics.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 17. Alternating full-width split rows
    `<section id="${vars.idBase}-feat-17" class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl space-y-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center" data-qay-scroll="parallax">
          <div class="space-y-6" data-qay-animate="slide-right">
            <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">DIVERSE STYLING</span>
            <h2 class="text-3xl md:text-5xl font-black" data-qm="features-title">Fully integrated dark mode.</h2>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed" data-qm="features-copy">Every exported component features responsive tailwind classes tuned specifically for dark visual settings. Perfect color coordinates guarantee readability.</p>
          </div>
          <div class="rounded-3xl overflow-hidden shadow-xl">
            <img src="${vars.galleryImage}" alt="Workspace" class="w-full aspect-video object-cover" />
          </div>
        </div>
        <div class="grid lg:grid-cols-2 gap-12 items-center" data-qay-scroll="parallax">
          <div class="rounded-3xl overflow-hidden shadow-xl lg:order-last">
            <img src="${vars.heroImage}" alt="Visual presentation" class="w-full aspect-video object-cover" />
          </div>
          <div class="space-y-6" data-qay-animate="slide-right">
            <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">MOTION LAYERS</span>
            <h2 class="text-3xl md:text-5xl font-black" data-qm="feature-title">Advanced scroll coordination.</h2>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed" data-qm="feature-copy">Our framework monitors scroll status using GSAP curves. Moving layout elements dynamically relative to scroll values guarantees beautiful, fluid visual feedback.</p>
          </div>
        </div>
      </div>
    </section>`,

    // 18. Asymmetric Masonry layout grid
    `<section id="${vars.idBase}-feat-18" class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 max-w-2xl" data-qay-animate="fade-in">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">MASONRY</span>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="features-title">Bespoke spatial distribution.</h2>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-qay-animate="stagger-children">
          <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 h-[320px] flex flex-col justify-between" data-qay-hover="lift">
            <span class="text-xs font-mono text-zinc-400">01 / BRAND</span>
            <div>
              <h3 class="text-xl font-bold" data-qm="feature-title">Corporate Assets</h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Tailor font styling scales, icons, color presets, and primary photography programmatically.</p>
            </div>
          </div>
          <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 h-[380px] flex flex-col justify-between" data-qay-hover="lift">
            <span class="text-xs font-mono text-zinc-400">02 / CODE</span>
            <div>
              <h3 class="text-xl font-bold" data-qm="feature-title">Direct Exporting</h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Export clean, structured DOM components straight into your production-ready Next.js routes.</p>
            </div>
          </div>
          <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 h-[340px] flex flex-col justify-between" data-qay-hover="lift">
            <span class="text-xs font-mono text-zinc-400">03 / DESIGN</span>
            <div>
              <h3 class="text-xl font-bold" data-qm="feature-title">Aesthetic Balance</h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed" data-qm="feature-copy">Maintain exact grid coordinates and whitespace alignments as detailed by your creative manual.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 19. High-Contrast Dark Services Grid with dotted pattern background
    `<section id="${vars.idBase}-feat-19" class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 opacity-15" style="background-image: radial-gradient(circle, #3f3f46 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-16 text-center max-w-2xl mx-auto" data-qay-animate="fade-in">
          <span class="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-400 rounded-full">SERVICES PROGRAM</span>
          <h2 class="mt-6 text-3xl md:text-5xl font-black" data-qm="features-title">Engineered to coordinate visual priorities.</h2>
        </div>
        <div class="grid gap-8 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-850" data-qay-hover="glow">
            <h3 class="text-xl font-bold" data-qm="service-title">Layout diagnostics</h3>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed" data-qm="service-copy">Audit loading delay limits, responsive shifts, and typography preset errors across browser viewports.</p>
          </div>
          <div class="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-850" data-qay-hover="glow">
            <h3 class="text-xl font-bold" data-qm="service-title">GSAP scroll optimization</h3>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed" data-qm="service-copy">Re-engineering dynamic scroll hooks, ensuring haptic response speeds map to desktop mouse paths.</p>
          </div>
          <div class="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-850" data-qay-hover="glow">
            <h3 class="text-xl font-bold" data-qm="service-title">Tailwind preset builds</h3>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed" data-qm="service-copy">Construct custom theme maps programmatically, matching your site typography matrices completely.</p>
          </div>
        </div>
      </div>
    </section>`,
  ];

  return templates[index % templates.length];
}
