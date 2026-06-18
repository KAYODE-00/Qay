import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getTestimonialsTemplate(index: number, vars: TemplateVariables): string {
  const templates = [
    // 0. Clean single testimonial quote (high impact, Dribbble style layout)
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-4xl text-center space-y-8" data-qay-animate="fade-in" data-qay-duration="1.0">
        <span class="text-7xl font-serif text-indigo-500 leading-none select-none">&ldquo;</span>
        <blockquote class="text-2xl font-bold leading-relaxed sm:text-3xl md:text-4xl text-zinc-800 dark:text-zinc-100" data-qm="testimonial-quote">
          "The layout quality and responsive scaling is absolutely class. Rebuilding layouts inside QAY feels incredibly premium."
        </blockquote>
        <div class="pt-6">
          <p class="font-extrabold text-base" data-qm="testimonial-author">Tolu Adewale</p>
          <p class="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-1" data-qm="testimonial-company">Design Lead, Apex Systems</p>
        </div>
      </div>
    </section>`,

    // 1. 3-Column Testimonial Cards Grid with hover lifts
    `<section class="bg-white dark:bg-zinc-900 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-center text-3xl font-black mb-16" data-qay-animate="fade-in" data-qm="testimonials-title">Trusted by modern brands</h2>
        <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
          <article class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 shadow-sm" data-qay-hover="lift">
            <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="testimonial-quote">
              "Simple setup that yielded highly professional pages right out of the generator. Exceeded every expectation."
            </p>
            <p class="mt-6 text-xs font-bold uppercase tracking-wider text-zinc-400" data-qm="testimonial-author">&mdash; Jessica Miller, Founder</p>
          </article>
          <article class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 shadow-sm" data-qay-hover="lift">
            <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="testimonial-quote">
              "The animation parser is brilliant. GSAP triggers reverse perfectly on scroll, making the sites feel extremely alive."
            </p>
            <p class="mt-6 text-xs font-bold uppercase tracking-wider text-zinc-400" data-qm="testimonial-author">&mdash; Alex Chen, Product Architect</p>
          </article>
          <article class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 shadow-sm" data-qay-hover="lift">
            <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="testimonial-quote">
              "We deployed multiple pages in under an hour. Personalization was fully respected, from terms to tech images."
            </p>
            <p class="mt-6 text-xs font-bold uppercase tracking-wider text-zinc-400" data-qm="testimonial-author">&mdash; Sophia K., Project Manager</p>
          </article>
        </div>
      </div>
    </section>`,

    // 2. Asymmetric Split Column (Large quote + 2 subcards)
    `<section class="bg-zinc-950 text-white px-6 py-24 transition-colors duration-300 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-12 relative z-10">
        <div class="lg:col-span-7 space-y-6" data-qay-animate="slide-right">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">SUCCESS STORY</span>
          <h2 class="text-4xl md:text-5xl font-black leading-tight" data-qm="testimonials-title">Loved by creative builders.</h2>
          <div class="relative pl-6 border-l-2 border-indigo-500 italic text-zinc-300">
            ${ICONS.quote('absolute -left-2 -top-4 size-10 text-indigo-500/10')}
            <blockquote class="text-xl md:text-2xl leading-relaxed relative z-10" data-qm="testimonial-quote">
              "We migrated all client marketing landing pages to the Qay framework. Our speed-to-market quadrupled, and custom animations took brand aesthetics to the next level."
            </blockquote>
          </div>
          <div class="pt-2">
            <p class="text-base font-bold" data-qm="testimonial-author">Emeka Nwachukwu</p>
            <p class="text-xs text-zinc-500" data-qm="testimonial-company">Director of Engineering, Delta-V Labs</p>
          </div>
        </div>
        <div class="lg:col-span-5 flex flex-col justify-center gap-4" data-qay-animate="stagger-children">
          <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800" data-qay-hover="lift">
            <p class="text-xs text-zinc-450 font-medium">"Smooth GSAP bindings, clean responsive structures. Highly recommended."</p>
            <p class="mt-4 text-[10px] uppercase font-bold tracking-widest text-indigo-400">&mdash; T. Peters, Indie Maker</p>
          </div>
          <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800" data-qay-hover="lift">
            <p class="text-xs text-zinc-450 font-medium">"Dark mode is native. Designing clean interfaces has never been this fluid."</p>
            <p class="mt-4 text-[10px] uppercase font-bold tracking-widest text-indigo-400">&mdash; Lisa R., UI Consultant</p>
          </div>
        </div>
      </div>
    </section>`,

    // 3. Bento Grid testimonial layout
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 text-center max-w-2xl mx-auto" data-qay-animate="fade-in">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400" data-qm="testimonials-subtitle">FEEDBACK</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="testimonials-title">What people are saying.</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm md:col-span-2 flex flex-col justify-between" data-qay-hover="lift">
            <div class="flex gap-1 mb-6">${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}</div>
            <blockquote class="text-lg md:text-xl font-bold leading-relaxed text-zinc-800 dark:text-zinc-100" data-qm="testimonial-quote">
              "Working with Qay templates saved us countless hours of tweaking styles. Layouts adapt programmatically to desktop and mobile screen limits without breaking visual hierarchies."
            </blockquote>
            <div class="mt-8 flex items-center gap-4">
              <span class="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">AM</span>
              <div>
                <p class="font-bold text-sm" data-qm="testimonial-author">Adebayo Martins</p>
                <p class="text-xs text-zinc-400" data-qm="testimonial-company">Product Lead, SwiftPay</p>
              </div>
            </div>
          </div>
          <div class="rounded-3xl bg-zinc-900 dark:bg-zinc-800 p-8 text-white shadow-sm flex flex-col justify-between" data-qay-hover="glow">
            <p class="text-sm leading-relaxed text-zinc-300" data-qm="testimonial-quote">
              "We migrated and got immediate results. Page speed indexes hit 99% in lighthouse, conversions grew by 15%."
            </p>
            <div>
              <p class="mt-6 font-bold text-sm" data-qm="testimonial-author">Jessica O.</p>
              <p class="text-xs text-zinc-400" data-qm="testimonial-company">Growth VP, SparkCorp</p>
            </div>
          </div>
          <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm" data-qay-hover="lift">
            <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="testimonial-quote">
              "Highly clean code structure. Absolutely straightforward, modular export capabilities."
            </p>
            <p class="mt-6 text-xs font-bold uppercase tracking-wider text-zinc-450" data-qm="testimonial-author">&mdash; Liam H., Frontend dev</p>
          </div>
          <div class="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm md:col-span-2" data-qay-hover="lift">
            <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" data-qm="testimonial-quote">
              "The design precision is unmatched. Layout details, fine border lines, typography scaling matrices are exactly what we wanted for our agency portfolio."
            </p>
            <p class="mt-6 text-xs font-bold uppercase tracking-wider text-zinc-450" data-qm="testimonial-author">&mdash; Maya V., Creative Director</p>
          </div>
        </div>
      </div>
    </section>`,

    // 4. Horizontal Scroll / Rail reviews layout
    `<section class="bg-white dark:bg-zinc-900 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4" data-qay-animate="fade-in">
          <div>
            <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">REVIEWS</span>
            <h2 class="text-3xl md:text-5xl font-black mt-2" data-qm="testimonials-title">Feedback on the rail.</h2>
          </div>
          <span class="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest hidden sm:inline-block">Scroll horizontally &rarr;</span>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-none" data-qay-animate="stagger-children">
          <div class="min-w-[300px] md:min-w-[400px] snap-start border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl" data-qay-hover="lift">
            <div class="flex gap-1 mb-4">${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}</div>
            <p class="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">"The modular blocks have completely transformed how our layout engineers work. No more messy inline override classes."</p>
            <p class="mt-6 text-xs font-bold text-zinc-900 dark:text-white">— Clara Jenkins, Web Architect</p>
          </div>
          <div class="min-w-[300px] md:min-w-[400px] snap-start border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl" data-qay-hover="lift">
            <div class="flex gap-1 mb-4">${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}</div>
            <p class="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">"Incredibly fast and responsive templates. GSAP dynamic scroll triggers work flawlessly on touch screen displays."</p>
            <p class="mt-6 text-xs font-bold text-zinc-900 dark:text-white">— Noah Patel, UI Lead</p>
          </div>
          <div class="min-w-[300px] md:min-w-[400px] snap-start border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl" data-qay-hover="lift">
            <div class="flex gap-1 mb-4">${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}</div>
            <p class="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">"Outstanding design quality. Our landing page conversion spiked from 2% to 6.5% inside the first month."</p>
            <p class="mt-6 text-xs font-bold text-zinc-900 dark:text-white">— Sarah Woods, Founder</p>
          </div>
        </div>
      </div>
    </section>`,

    // 5. Glassmorphic Review Cards Grid over subtle radial gradient
    `<section class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden transition-colors duration-300">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <h2 class="text-center text-3xl md:text-5xl font-black mb-16" data-qay-animate="fade-in" data-qm="testimonials-title">Premium reviews</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-qay-animate="stagger-children">
          <div class="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-xl" data-qay-hover="glow">
            <blockquote class="text-sm text-zinc-300 leading-relaxed" data-qm="testimonial-quote">
              "We appreciate the absolute dedication to details. Using CSS variables for typography limits custom override errors."
            </blockquote>
            <div class="mt-6">
              <p class="font-bold text-xs" data-qm="testimonial-author">David K.</p>
              <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5" data-qm="testimonial-company">CTO, Vertex</p>
            </div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-xl" data-qay-hover="glow">
            <blockquote class="text-sm text-zinc-300 leading-relaxed" data-qm="testimonial-quote">
              "It's like having a premium design team built into Next.js. Absolute perfection in alignment and hover states."
            </blockquote>
            <div class="mt-6">
              <p class="font-bold text-xs" data-qm="testimonial-author">Rachel M.</p>
              <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5" data-qm="testimonial-company">Design Lead, PixelArt</p>
            </div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-xl" data-qay-hover="glow">
            <blockquote class="text-sm text-zinc-300 leading-relaxed" data-qm="testimonial-quote">
              "The speed increase was immediate. We went from slow theme templates to clean responsive DOM components."
            </blockquote>
            <div class="mt-6">
              <p class="font-bold text-xs" data-qm="testimonial-author">Femi A.</p>
              <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5" data-qm="testimonial-company">Product VP, Zest</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 6. High-impact Editorial Split (Image Left, Big Quote Right)
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-16 items-center">
        <div class="lg:col-span-5 relative" data-qay-scroll="parallax" data-qay-y="25">
          <img src="${vars.heroImage}" alt="Executive profile" class="aspect-[3/4] w-full object-cover rounded-[2.5rem] shadow-2xl" />
          <div class="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-indigo-650 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xl">
            <span class="text-3xl font-black">5★</span>
          </div>
        </div>
        <div class="lg:col-span-7 space-y-8" data-qay-animate="slide-right">
          <span class="text-xs font-bold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-400">FEATURED VOICE</span>
          <blockquote class="text-2xl md:text-4xl font-extrabold tracking-tight leading-relaxed italic text-zinc-800 dark:text-zinc-150" data-qm="testimonial-quote">
            "Qay provided the layout structure we needed to pitch our tech to top-tier investors. The responsiveness combined with micro-animations made our startup feel mature and premium."
          </blockquote>
          <div>
            <h4 class="text-lg font-black" data-qm="testimonial-author">Tamarah Vance</h4>
            <p class="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-1" data-qm="testimonial-company">Co-Founder, LeapMetric</p>
          </div>
        </div>
      </div>
    </section>`,

    // 7. Dark Tech Neon Rating Cards
    `<section class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-16 text-center" data-qay-animate="fade-in">
          <p class="text-xs font-mono text-cyan-400 uppercase tracking-widest">PERFORMANCE REPORT</p>
          <h2 class="mt-4 text-3xl md:text-5xl font-black" data-qm="testimonials-title">Engineered to excel.</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
          <div class="p-8 rounded-2xl border border-cyan-500/20 bg-zinc-900/40" data-qay-hover="glow">
            <span class="text-xs font-mono text-cyan-400">CORE METRIC: 99/100</span>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed">"The layout framework parses templates cleanly. Dynamic Next.js bundles show massive speed improvement."</p>
            <p class="mt-6 text-xs font-bold text-white">— Marcus Vance, Lead Eng.</p>
          </div>
          <div class="p-8 rounded-2xl border border-cyan-500/20 bg-zinc-900/40 shadow-[0_0_30px_rgba(6,182,212,0.05)]" data-qay-hover="glow">
            <span class="text-xs font-mono text-cyan-400">SEO RATING: +45%</span>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed">"Search rankings spiked after migrating. The clean semantic HTML sections helped index items perfectly."</p>
            <p class="mt-6 text-xs font-bold text-white">— Alicia Thorne, Marketing Dir.</p>
          </div>
          <div class="p-8 rounded-2xl border border-cyan-500/20 bg-zinc-900/40" data-qay-hover="glow">
            <span class="text-xs font-mono text-cyan-400">UX SCORE: 5.0/5.0</span>
            <p class="text-sm text-zinc-400 mt-4 leading-relaxed">"Haptic hover responses and gorgeous typography layers make navigating our site an absolute delight."</p>
            <p class="mt-6 text-xs font-bold text-white">— Kyle Reese, UX Lead</p>
          </div>
        </div>
      </div>
    </section>`,

    // 8. Minimal whitespace-heavy single card timeline quote
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-4xl border-y border-zinc-200 dark:border-zinc-800 py-16" data-qay-animate="slide-up">
        <div class="flex items-center gap-2 mb-8">
          ${ICONS.star('size-4 text-amber-500')}
          ${ICONS.star('size-4 text-amber-500')}
          ${ICONS.star('size-4 text-amber-500')}
          ${ICONS.star('size-4 text-amber-500')}
          ${ICONS.star('size-4 text-amber-500')}
        </div>
        <blockquote class="text-xl md:text-3xl leading-relaxed text-zinc-800 dark:text-zinc-150" data-qm="testimonial-quote">
          "Qay templates offer a fantastic balance of minimal layout styles and premium motion design. The code parses into exact React structures, yielding zero styling conflicts."
        </blockquote>
        <div class="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-8">
          <div>
            <p class="font-extrabold text-base" data-qm="testimonial-author">Dominik Szabo</p>
            <p class="text-xs text-zinc-450 mt-1" data-qm="testimonial-company">Frontend Architect, Budapest Codehouse</p>
          </div>
          <span class="text-xs uppercase font-mono tracking-widest text-zinc-400">VERIFIED CUSTOMER</span>
        </div>
      </div>
    </section>`,

    // 9. Style-adaptive programmatic testimonials block
    (() => {
      const s = getStyleForIndex(index);
      return `<section class="${s.bg} px-6 py-24 transition-colors duration-300">
        <div class="mx-auto max-w-7xl rounded-3xl ${s.bgInner} ${s.border} p-8 md:p-16" ${s.animate}>
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-[0.3em] ${s.accentText}">CLIENT LOG</span>
            <h2 class="text-3xl md:text-5xl font-black mt-4" data-qm="testimonials-title">Adaptive feedback systems.</h2>
          </div>
          <div class="grid gap-6 md:grid-cols-2">
            <div class="p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border ${s.border}">
              <p class="text-sm ${s.textMuted} leading-relaxed">"The transition-colors and theme configurations coordinate automatically. High conversion layouts."</p>
              <p class="mt-4 font-bold text-xs">J. Carter, Product Owner</p>
            </div>
            <div class="p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border ${s.border}">
              <p class="text-sm ${s.textMuted} leading-relaxed">"Highly modular. It's incredibly straightforward to build pages matching corporate guidelines."</p>
              <p class="mt-4 font-bold text-xs">K. Visser, Agency Lead</p>
            </div>
          </div>
        </div>
      </section>`;
    })(),

    // 10. Left headline sidebar, right masonry testimonial blocks
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-4 lg:sticky lg:top-10 space-y-4" data-qay-animate="slide-right">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-650 dark:text-indigo-400">VOICES</span>
          <h2 class="text-3xl md:text-5xl font-black leading-tight" data-qm="testimonials-title">What modern teams say.</h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed" data-qm="testimonials-subtitle">
            Feedback from development agencies, independent designers, and global directors.
          </p>
        </div>
        <div class="lg:col-span-8 grid gap-6 sm:grid-cols-2" data-qay-animate="stagger-children">
          <div class="p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/50 dark:border-zinc-800" data-qay-hover="lift">
            <p class="text-sm text-zinc-550 dark:text-zinc-350 leading-relaxed">"Deploying landing systems used to take us a week. Now we generate full layout pages in under 30 minutes. Absolute design gamechanger."</p>
            <div class="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
              <span class="text-xs font-bold">— Liam Cooper</span>
              <span class="text-[10px] text-zinc-450">Creative Architect</span>
            </div>
          </div>
          <div class="p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/50 dark:border-zinc-800" data-qay-hover="lift">
            <p class="text-sm text-zinc-550 dark:text-zinc-350 leading-relaxed">"The hover states and GSAP triggers are perfect. Micro-interactions add high-end texture without causing user lag."</p>
            <div class="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
              <span class="text-xs font-bold">— Elena Rostova</span>
              <span class="text-[10px] text-zinc-450">UX Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 11. 2-column testimonial cards with conversion metrics highlight
    `<section class="bg-white dark:bg-zinc-900 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-center text-3xl md:text-5xl font-black mb-16" data-qay-animate="fade-in" data-qm="testimonials-title">Proven value delivery</h2>
        <div class="grid gap-8 lg:grid-cols-2" data-qay-animate="stagger-children">
          <div class="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800/80 flex flex-col md:flex-row gap-6 items-start" data-qay-hover="lift">
            <div class="shrink-0 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xl rounded-xl">+150%</div>
            <div>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">"We migrated our SaaS signup landing page. Conversion rates grew by 150% in the first two weeks due to faster layout render speed."</p>
              <p class="mt-4 text-xs font-bold text-zinc-800 dark:text-zinc-200">— Raymond Vance, Product VP</p>
            </div>
          </div>
          <div class="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800/80 flex flex-col md:flex-row gap-6 items-start" data-qay-hover="lift">
            <div class="shrink-0 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xl rounded-xl">-50%</div>
            <div>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">"Page speed limits fell by 50%. The layout elements are lightweight, loading inline styles cleanly without bulky libraries."</p>
              <p class="mt-4 text-xs font-bold text-zinc-800 dark:text-zinc-200">— Sarah Chen, Technical Director</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 12. Minimalist listed reviews with active rating highlight
    `<section class="bg-zinc-50 dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-3xl font-black mb-12 text-center" data-qay-animate="fade-in" data-qm="testimonials-title">Endorsed by industry leaders</h2>
        <div class="space-y-4" data-qay-animate="stagger-children">
          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4" data-qay-hover="lift">
            <div class="flex items-center gap-4">
              <span class="text-xs font-mono text-zinc-400">01</span>
              <div>
                <p class="text-sm font-bold">"Clean grid structures, pixel-perfect alignment. Elite design execution."</p>
                <p class="text-xs text-zinc-450 mt-1">Arthur Pendelton, Lead Architect</p>
              </div>
            </div>
            <div class="flex gap-1 shrink-0">${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}</div>
          </div>
          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4" data-qay-hover="lift">
            <div class="flex items-center gap-4">
              <span class="text-xs font-mono text-zinc-400">02</span>
              <div>
                <p class="text-sm font-bold">"Responsive features look stunning on modern tablet and mobile displays."</p>
                <p class="text-xs text-zinc-450 mt-1">Min-Jae Park, Freelance Developer</p>
              </div>
            </div>
            <div class="flex gap-1 shrink-0">${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}${ICONS.star()}</div>
          </div>
        </div>
      </div>
    </section>`,

    // 13. Elegant luxury/serif editorial review panel
    `<section class="bg-white dark:bg-zinc-950 px-6 py-24 text-zinc-900 dark:text-white transition-colors duration-300">
      <div class="mx-auto max-w-4xl text-center border border-zinc-250/80 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-16">
        <span class="text-xs font-serif italic text-zinc-400 dark:text-zinc-500">Editorial Endorsement</span>
        <blockquote class="text-2xl md:text-3xl font-serif mt-6 leading-relaxed text-zinc-850 dark:text-zinc-100" data-qm="testimonial-quote">
          "Qay manages to bridge the gap between design freedom and lightweight coding. Highly structured grids that frame brand typography beautifully."
        </blockquote>
        <div class="mt-8 flex justify-center items-center gap-3">
          <span class="h-px w-8 bg-zinc-300 dark:bg-zinc-750"></span>
          <p class="text-xs uppercase tracking-[0.25em] font-bold text-zinc-500" data-qm="testimonial-author">Claire Dupont</p>
          <span class="h-px w-8 bg-zinc-300 dark:bg-zinc-750"></span>
        </div>
        <p class="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest font-mono" data-qm="testimonial-company">Design Lead, Atelier Paris</p>
      </div>
    </section>`,

    // 14. Dark premium grid with multiple client logo badges
    `<section class="bg-zinc-950 text-white px-6 py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.06),transparent_50%)]"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <h2 class="text-center text-3xl font-black mb-16" data-qay-animate="fade-in" data-qm="testimonials-title">Trusted by industry leaders worldwide</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-qay-animate="stagger-children">
          <div class="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-850" data-qay-hover="glow">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold tracking-widest uppercase rounded">TECH CORP</span>
            </div>
            <p class="text-sm text-zinc-400 leading-relaxed">"Migrating layout blocks resolved all of our mobile fluid shift issues. Page speed score remains a perfect 100."</p>
            <p class="mt-6 text-xs font-bold text-zinc-300">— Steve Miller, Tech Architect</p>
          </div>
          <div class="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-850" data-qay-hover="glow">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold tracking-widest uppercase rounded">GROWTH LAB</span>
            </div>
            <p class="text-sm text-zinc-400 leading-relaxed">"Micro hover interactions look incredible. Highly customizable system, allowing easy brand preset integration."</p>
            <p class="mt-6 text-xs font-bold text-zinc-300">— Fiona Gallagher, UX Lead</p>
          </div>
          <div class="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-850" data-qay-hover="glow">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold tracking-widest uppercase rounded">CREATIVE CO</span>
            </div>
            <p class="text-sm text-zinc-400 leading-relaxed">"Excellent typographic layouts. Our visual assets fit in perfectly. Definitely a premium addition."</p>
            <p class="mt-6 text-xs font-bold text-zinc-300">— James Sterling, Creative VP</p>
          </div>
        </div>
      </div>
    </section>`,
  ];

  return templates[index % templates.length];
}
