import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getPricingTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const checkIcon = ICONS.check(style.accentText);

  const layouts = [
    // 0. Three-Tier Pricing Grid
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="text-center max-w-3xl mx-auto mb-16" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">PRICING PLANS</p>
          <h2 class="mt-4 text-4xl font-black md:text-5xl" data-qm="pricing-title">Simple, flat-rate tiers</h2>
          <p class="mt-4 text-base ${style.textMuted}">Choose a plan that fits the scale of your business. No hidden fees.</p>
        </div>
        <div class="grid gap-6 lg:grid-cols-3">
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <h3 class="text-lg font-bold">Starter</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Perfect for small personal sites.</p>
              <p class="mt-8 text-4xl font-black">$49<span class="text-xs font-medium text-zinc-450">/mo</span></p>
              <ul class="mt-8 space-y-4 text-sm">
                <li class="flex items-center gap-3">${checkIcon} 5 Layout Pages</li>
                <li class="flex items-center gap-3">${checkIcon} Core GSAP Animations</li>
                <li class="flex items-center gap-3">${checkIcon} Standard Support</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-3 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">
              Get Started
            </a>
          </article>
          
          <article class="rounded-3xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-8 flex flex-col justify-between relative" ${style.hover}>
            <span class="absolute -top-3 right-6 rounded-full bg-[var(--qm-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[var(--qm-accent-text)]">Popular</span>
            <div>
              <h3 class="text-lg font-bold">Professional</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Best for growing teams and agencies.</p>
              <p class="mt-8 text-4xl font-black">$99<span class="text-xs font-medium text-zinc-450">/mo</span></p>
              <ul class="mt-8 space-y-4 text-sm">
                <li class="flex items-center gap-3">${checkIcon} Unlimited Layout Pages</li>
                <li class="flex items-center gap-3">${checkIcon} Advanced Scroll Scrub</li>
                <li class="flex items-center gap-3">${checkIcon} 24/7 Priority Support</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md">
              Choose Professional
            </a>
          </article>
          
          <article class="rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <h3 class="text-lg font-bold">Enterprise</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Custom configurations for enterprises.</p>
              <p class="mt-8 text-4xl font-black">Talk</p>
              <ul class="mt-8 space-y-4 text-sm">
                <li class="flex items-center gap-3">${checkIcon} Custom Integrations</li>
                <li class="flex items-center gap-3">${checkIcon} Dedicated Accounts</li>
                <li class="flex items-center gap-3">${checkIcon} SLA Guarantees</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-3 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">
              Contact Us
            </a>
          </article>
        </div>
      </div>
    </section>`,

    // 1. Sleek Two-Column Split Plan List
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-5xl grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">PRICING PLANS</p>
          <h2 class="mt-4 text-3xl font-black sm:text-4xl" data-qm="pricing-title">Flexible pricing built for your pace.</h2>
          <p class="mt-5 text-sm leading-relaxed ${style.textMuted}">
            No long term commitments. Scale up, dial back, or cancel at any time. Get in touch for volume discounts.
          </p>
        </div>
        
        <div class="space-y-4">
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex justify-between items-center gap-4">
            <div>
              <h3 class="font-bold text-base">Monthly billing</h3>
              <p class="text-xs ${style.textMuted} mt-1">Billed month-to-month, cancel anytime.</p>
            </div>
            <p class="text-2xl font-black ${style.accentText}">$99<span class="text-xs font-medium">/mo</span></p>
          </div>
          <div class="rounded-2xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-6 flex justify-between items-center gap-4">
            <div>
              <h3 class="font-bold text-base">Annual billing</h3>
              <p class="text-xs ${style.textMuted} mt-1">Save 20% on yearly plans.</p>
            </div>
            <p class="text-2xl font-black ${style.accentText}">$79<span class="text-xs font-medium">/mo</span></p>
          </div>
        </div>
      </div>
    </section>`,

    // 2. Bento Grid Pricing
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 max-w-3xl" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">PLAN SELECTOR</p>
          <h2 class="mt-3 text-3xl font-black md:text-5xl" data-qm="pricing-title">Engineered for every growth stage</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="md:col-span-2 rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <span class="rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider">Most Value</span>
              <h3 class="text-2xl font-black mt-4">Scale Business Plan</h3>
              <p class="text-sm ${style.textMuted} mt-2">For active teams running high-performance operations and dynamic workflows.</p>
              <div class="grid gap-4 mt-8 sm:grid-cols-2 text-sm">
                <ul class="space-y-3">
                  <li class="flex items-center gap-2">${checkIcon} Custom domain support</li>
                  <li class="flex items-center gap-2">${checkIcon} Unlimited database records</li>
                  <li class="flex items-center gap-2">${checkIcon} API & webhook access</li>
                </ul>
                <ul class="space-y-3">
                  <li class="flex items-center gap-2">${checkIcon} Advanced GSAP staging</li>
                  <li class="flex items-center gap-2">${checkIcon} Multi-region clusters</li>
                  <li class="flex items-center gap-2">${checkIcon} 2hr Support response</li>
                </ul>
              </div>
            </div>
            <div class="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t ${style.border}">
              <div>
                <p class="text-4xl font-black">$149<span class="text-xs font-medium ${style.textMuted}">/mo billed yearly</span></p>
              </div>
              <a href="/contact" class="rounded-xl ${style.accentBg} ${style.accentHoverBg} px-8 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition">
                Start Pro Trial
              </a>
            </div>
          </div>
          <div class="space-y-6 flex flex-col justify-between">
            <article class="rounded-3xl border ${style.border} ${style.bgInner} p-6 flex-1 flex flex-col justify-between" ${style.hover}>
              <div>
                <h3 class="text-lg font-bold">Startup Tier</h3>
                <p class="text-xs ${style.textMuted} mt-1">Get your operations running in minutes.</p>
                <p class="text-3xl font-black mt-4">$39<span class="text-xs font-medium">/mo</span></p>
              </div>
              <a href="/contact" class="mt-6 block w-full rounded-xl border ${style.border} py-2.5 text-center text-xs font-bold transition hover:bg-zinc-150/10">Select Startup</a>
            </article>
            <article class="rounded-3xl border ${style.border} ${style.bgInner} p-6 flex-1 flex flex-col justify-between" ${style.hover}>
              <div>
                <h3 class="text-lg font-bold">Custom Setup</h3>
                <p class="text-xs ${style.textMuted} mt-1">Security, scale, and compliance features.</p>
                <p class="text-3xl font-black mt-4">Quote</p>
              </div>
              <a href="/contact" class="mt-6 block w-full rounded-xl border ${style.border} py-2.5 text-center text-xs font-bold transition hover:bg-zinc-150/10">Inquire Now</a>
            </article>
          </div>
        </div>
      </div>
    </section>`,

    // 3. High-End Glassmorphism Spotlight
    `<section class="${style.bg} px-6 py-28 relative overflow-hidden transition-colors duration-300">
      <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/5 dark:from-indigo-950/20 pointer-events-none"></div>
      <div class="mx-auto max-w-4xl relative z-10">
        <div class="text-center mb-16" ${style.animate}>
          <span class="text-xs font-extrabold uppercase tracking-[0.3em] ${style.accentText}">GLASSMORPHIC PREMIUM</span>
          <h2 class="text-4xl font-black mt-4 tracking-tight sm:text-5xl" data-qm="pricing-title">All-Inclusive Platform Access</h2>
          <p class="text-base ${style.textMuted} mt-4 max-w-xl mx-auto">Get full access to all features, updates, and custom assets with our single-tier glass plan.</p>
        </div>
        <div class="rounded-[2.5rem] border ${style.border} bg-white/20 dark:bg-zinc-900/30 backdrop-blur-xl p-8 md:p-12 shadow-2xl relative" ${style.hover}>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--qm-accent)] to-violet-500 px-6 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">RECOMMENDED</div>
          <div class="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h3 class="text-3xl font-black">Studio Plus</h3>
              <p class="text-sm ${style.textMuted} mt-2">Unlimited dynamic deployments, high bandwidth storage, custom animation timelines, and premium font support.</p>
              <div class="grid gap-3 mt-6 sm:grid-cols-2 text-sm">
                <div class="flex items-center gap-2">${checkIcon} Unlimited projects</div>
                <div class="flex items-center gap-2">${checkIcon} 24/7 Slack channel</div>
                <div class="flex items-center gap-2">${checkIcon} Shared staging assets</div>
                <div class="flex items-center gap-2">${checkIcon} Lifetime core updates</div>
              </div>
            </div>
            <div class="text-center p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 border ${style.border} flex flex-col justify-center">
              <p class="text-xs font-bold uppercase tracking-widest ${style.textMuted}">YEARLY ACCESS</p>
              <p class="text-5xl font-black mt-3 ${style.accentText}">$299</p>
              <p class="text-xs ${style.textMuted} mt-1">Equivalent to $25/month</p>
              <a href="/contact" class="mt-6 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition">
                Secure Seat
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 4. Editorial Split-Screen Pricing
    `<section class="${style.bg} transition-colors duration-300 relative overflow-hidden">
      <div class="grid lg:grid-cols-2 min-h-[600px]">
        <div class="relative bg-zinc-900 flex flex-col justify-end p-8 sm:p-16 min-h-[350px] lg:min-h-full">
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <img src="${vars.heroImage}" alt="${vars.heroAlt}" class="w-full h-full object-cover opacity-60 transition duration-700" data-qay-animate="zoom-out" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/30 to-transparent"></div>
          </div>
          <div class="relative z-10 max-w-md" ${style.animate}>
            <span class="text-xs font-bold uppercase tracking-[0.25em] text-white/80">SELECTIVE VALUE</span>
            <h2 class="text-3xl sm:text-5xl font-black text-white mt-4 leading-tight" data-qm="pricing-title">Direct value, zero fluff.</h2>
            <p class="text-sm text-zinc-300 mt-4 leading-relaxed">We focus on robust delivery systems, elegant visual architectures, and lightning-fast deployment cycles. Choose a path that matches your drive.</p>
          </div>
        </div>
        <div class="p-8 sm:p-16 flex flex-col justify-center border-l ${style.border}">
          <div class="max-w-md w-full mx-auto space-y-6">
            <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 transition hover:shadow-md" ${style.hover}>
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-lg">Personal Account</h3>
                  <p class="text-xs ${style.textMuted} mt-1">For single users and personal portfolios.</p>
                </div>
                <span class="text-xl font-black">$19<span class="text-xs font-normal">/mo</span></span>
              </div>
              <a href="/contact" class="mt-4 block w-full rounded-lg border ${style.border} py-2 text-center text-xs font-bold transition hover:bg-zinc-150/10">Launch Personal</a>
            </div>
            <div class="rounded-2xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-6 transition shadow-md" ${style.hover}>
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-lg">Studio Account</h3>
                  <p class="text-xs ${style.textMuted} mt-1">For dynamic production and agencies.</p>
                </div>
                <span class="text-xl font-black">$59<span class="text-xs font-normal">/mo</span></span>
              </div>
              <a href="/contact" class="mt-4 block w-full rounded-lg ${style.accentBg} ${style.accentHoverBg} py-2 text-center text-xs font-bold text-white transition">Launch Studio</a>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 5. Feature Comparison Matrix
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <div class="text-center mb-16" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">DETAILED DEEP DIVE</p>
          <h2 class="mt-3 text-3xl font-black sm:text-4xl" data-qm="pricing-title">Compare plan features</h2>
        </div>
        <div class="overflow-x-auto border ${style.border} rounded-2xl bg-white dark:bg-zinc-950">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b ${style.border} bg-zinc-50/50 dark:bg-zinc-900/30">
                <th class="p-4 text-xs font-bold uppercase tracking-wider">Features</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-center">Free</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-center text-[var(--qm-accent)]">Pro</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody class="divide-y ${style.border} text-sm">
              <tr>
                <td class="p-4 font-medium">Page Deployments</td>
                <td class="p-4 text-center ${style.textMuted}">Up to 3</td>
                <td class="p-4 text-center font-bold">Unlimited</td>
                <td class="p-4 text-center">Custom</td>
              </tr>
              <tr>
                <td class="p-4 font-medium">GSAP Animation Engine</td>
                <td class="p-4 text-center text-emerald-500">✔</td>
                <td class="p-4 text-center text-emerald-500">✔</td>
                <td class="p-4 text-center text-emerald-500">✔</td>
              </tr>
              <tr>
                <td class="p-4 font-medium">Analytics & Data</td>
                <td class="p-4 text-center ${style.textMuted}">Basic</td>
                <td class="p-4 text-center text-emerald-500">✔</td>
                <td class="p-4 text-center text-emerald-500">✔</td>
              </tr>
              <tr>
                <td class="p-4 font-medium">SLA Guarantee</td>
                <td class="p-4 text-center ${style.textMuted}">—</td>
                <td class="p-4 text-center ${style.textMuted}">—</td>
                <td class="p-4 text-center text-emerald-500">✔</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>`,

    // 6. The Single-Product Spotlight
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300 relative">
      <div class="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-[0.03] pointer-events-none"></div>
      <div class="mx-auto max-w-4xl relative z-10 text-center">
        <div class="max-w-2xl mx-auto mb-12" ${style.animate}>
          <span class="rounded-full bg-[var(--qm-accent)]/10 text-[var(--qm-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-widest">Single Subscription</span>
          <h2 class="text-4xl font-black mt-4 sm:text-5xl" data-qm="pricing-title">One simple rate for everything.</h2>
          <p class="mt-4 text-sm ${style.textMuted}">No tiered restrictions. No complex matrices. Pay once and get full, unfettered access to the entire studio platform.</p>
        </div>
        <div class="rounded-3xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-8 max-w-md mx-auto shadow-xl" ${style.hover}>
          <h3 class="text-xl font-bold uppercase tracking-wider">All-Access Pass</h3>
          <p class="mt-4 text-5xl font-black ${style.accentText}">$79<span class="text-sm font-medium ${style.textMuted}">/month</span></p>
          <p class="mt-2 text-xs ${style.textMuted}">Billed monthly. Cancel instantly with one-click.</p>
          <ul class="mt-8 space-y-3.5 text-left text-sm border-t ${style.border} pt-6">
            <li class="flex items-center gap-3">${checkIcon} Unlimited client websites</li>
            <li class="flex items-center gap-3">${checkIcon} Access to 100+ layouts</li>
            <li class="flex items-center gap-3">${checkIcon} Custom code export plugins</li>
            <li class="flex items-center gap-3">${checkIcon} Continuous feature updates</li>
          </ul>
          <a href="/contact" class="mt-8 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition">
            Get Instant Access
          </a>
        </div>
      </div>
    </section>`,

    // 7. Dark Premium Theme (Glow style)
    `<section class="bg-zinc-950 text-white px-6 py-24 transition-colors duration-300 relative overflow-hidden">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-16" ${style.animate}>
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">DEVELOPER LICENSE</span>
          <h2 class="mt-4 text-4xl font-extrabold md:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400" data-qm="pricing-title">Build without boundaries.</h2>
          <p class="mt-4 text-base text-zinc-400">Deploy high-performance web templates that scale. Clean syntax, absolute speed.</p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <article class="rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-8 flex flex-col justify-between" data-qay-hover="glow">
            <div>
              <h3 class="text-lg font-bold">Standard Dev</h3>
              <p class="mt-2 text-xs text-zinc-400">Perfect for freelance developers and hobbyists.</p>
              <p class="mt-8 text-4xl font-black text-white">$69<span class="text-xs font-medium text-zinc-500">/mo</span></p>
              <ul class="mt-8 space-y-4 text-sm text-zinc-350">
                <li class="flex items-center gap-3"><span class="text-indigo-400">✔</span> Up to 10 project directories</li>
                <li class="flex items-center gap-3"><span class="text-indigo-400">✔</span> Next.js starter configs</li>
                <li class="flex items-center gap-3"><span class="text-indigo-400">✔</span> Basic Tailwind compiler</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border border-zinc-800 py-3 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-800 text-white">
              Acquire Standard
            </a>
          </article>
          <article class="rounded-3xl border-2 border-indigo-500 bg-zinc-900/90 backdrop-blur-md p-8 flex flex-col justify-between relative" data-qay-hover="glow">
            <span class="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">PRO GRADE</span>
            <div>
              <h3 class="text-lg font-bold">Team Lead</h3>
              <p class="mt-2 text-xs text-zinc-400">Optimized for agency workflows and visual hubs.</p>
              <p class="mt-8 text-4xl font-black text-white">$149<span class="text-xs font-medium text-zinc-500">/mo</span></p>
              <ul class="mt-8 space-y-4 text-sm text-zinc-350">
                <li class="flex items-center gap-3"><span class="text-indigo-400">✔</span> Unlimited developer nodes</li>
                <li class="flex items-center gap-3"><span class="text-indigo-400">✔</span> Advanced Custom components</li>
                <li class="flex items-center gap-3"><span class="text-indigo-400">✔</span> Priority CDN caching</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg transition">
              Acquire Pro
            </a>
          </article>
        </div>
      </div>
    </section>`,

    // 8. Stacked Alternating Cards
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-4xl">
        <div class="text-center mb-16" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">MEMBERSHIPS</p>
          <h2 class="mt-3 text-3xl font-black sm:text-4xl" data-qm="pricing-title">Tailored subscription tiers</h2>
        </div>
        <div class="space-y-6">
          <div class="rounded-3xl border ${style.border} ${style.bgInner} p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" ${style.hover}>
            <div class="max-w-md">
              <span class="text-xs font-bold uppercase tracking-widest ${style.accentText}">FREELANCE</span>
              <h3 class="text-xl font-bold mt-1">Creator Tier</h3>
              <p class="text-xs ${style.textMuted} mt-1">Perfect for single projects or simple freelance deployment setups.</p>
            </div>
            <div class="flex items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 ${style.border}">
              <div class="text-left md:text-right">
                <p class="text-3xl font-black">$29<span class="text-xs font-medium">/mo</span></p>
                <p class="text-[10px] ${style.textMuted}">Billed monthly</p>
              </div>
              <a href="/contact" class="rounded-xl border ${style.border} px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">Select Creator</a>
            </div>
          </div>
          <div class="rounded-3xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" ${style.hover}>
            <div class="max-w-md">
              <span class="text-xs font-bold uppercase tracking-widest ${style.accentText}">MOST POPULAR</span>
              <h3 class="text-xl font-bold mt-1">Agency Tier</h3>
              <p class="text-xs ${style.textMuted} mt-1">Designed for growing design teams building high quality client hubs.</p>
            </div>
            <div class="flex items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 ${style.border}">
              <div class="text-left md:text-right">
                <p class="text-3xl font-black">$89<span class="text-xs font-medium">/mo</span></p>
                <p class="text-[10px] ${style.textMuted}">Billed monthly</p>
              </div>
              <a href="/contact" class="rounded-xl ${style.accentBg} ${style.accentHoverBg} px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition">Select Agency</a>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 9. Asymmetric Magazine Style Layout
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div ${style.animate}>
            <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}">MAGAZINE DESIGN</p>
            <h2 class="mt-4 text-4xl font-black sm:text-5xl leading-tight" data-qm="pricing-title">Flexible options for leaders.</h2>
            <p class="mt-6 text-sm ${style.textMuted} leading-relaxed">We think billing should mirror direct project scales. Select the option that aligns with your active development requirements.</p>
            <div class="mt-8 border-t ${style.border} pt-6 space-y-4">
              <div class="flex items-start gap-3 text-xs">
                <span class="text-emerald-500 font-bold">✓</span>
                <div>
                  <p class="font-bold">Instant updates</p>
                  <p class="${style.textMuted} mt-0.5">Code pulls down automatically.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 items-start">
            <article class="rounded-2xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between min-h-[360px]" ${style.hover}>
              <div>
                <h3 class="text-xl font-bold">Standard Tier</h3>
                <p class="text-xs ${style.textMuted} mt-1">Excellent for custom portfolios and startups.</p>
                <p class="text-5xl font-black mt-8">$49<span class="text-xs font-medium">/mo</span></p>
              </div>
              <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-3 text-center text-xs font-bold uppercase tracking-widest transition hover:bg-zinc-150/10">Configure Plan</a>
            </article>
            <article class="rounded-2xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between min-h-[400px] lg:mt-8" ${style.hover}>
              <div>
                <h3 class="text-xl font-bold">Studio Tier</h3>
                <p class="text-xs ${style.textMuted} mt-1">Ideal for production scale sites and portals.</p>
                <p class="text-5xl font-black mt-8">$119<span class="text-xs font-medium">/mo</span></p>
              </div>
              <a href="/contact" class="mt-8 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-3 text-center text-xs font-bold uppercase tracking-widest text-white shadow-md transition">Configure Plan</a>
            </article>
          </div>
        </div>
      </div>
    </section>`,

    // 10. Vertical Usage Tiers
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-4xl">
        <div class="text-center max-w-2xl mx-auto mb-16" ${style.animate}>
          <span class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">USAGE SCALE</span>
          <h2 class="text-3xl font-black mt-3 sm:text-4xl" data-qm="pricing-title">Select by monthly site views</h2>
        </div>
        <div class="divide-y ${style.border} border-t border-b ${style.border}">
          <div class="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="font-bold text-lg">Under 25,000 views</p>
              <p class="text-xs ${style.textMuted}">Perfect for early stages, local projects.</p>
            </div>
            <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <p class="text-2xl font-black">$29<span class="text-xs font-medium">/mo</span></p>
              <a href="/contact" class="rounded-lg border ${style.border} px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">Select</a>
            </div>
          </div>
          <div class="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="font-bold text-lg">25,000 to 100,000 views</p>
              <p class="text-xs ${style.textMuted}">Standard business scale, basic dynamic loads.</p>
            </div>
            <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <p class="text-2xl font-black">$59<span class="text-xs font-medium">/mo</span></p>
              <a href="/contact" class="rounded-lg border ${style.border} px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">Select</a>
            </div>
          </div>
          <div class="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="font-bold text-lg">100,000 to 500,000 views</p>
              <p class="text-xs ${style.textMuted}">Premium staging, multi-node replication.</p>
            </div>
            <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <p class="text-2xl font-black">$129<span class="text-xs font-medium">/mo</span></p>
              <a href="/contact" class="rounded-lg border ${style.border} px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">Select</a>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    // 11. Horizontal Scroll Card Rail
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300 overflow-hidden">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12" ${style.animate}>
          <span class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">PORTFOLIO CARD DECK</span>
          <h2 class="text-3xl font-black mt-3 sm:text-5xl" data-qm="pricing-title">Flexible pricing structures</h2>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          <div class="w-[300px] shrink-0 snap-align-start rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <h3 class="text-lg font-bold">Standard Node</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Run a basic static portal.</p>
              <p class="mt-6 text-4xl font-black">$19<span class="text-xs font-medium">/mo</span></p>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-2.5 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">Initiate</a>
          </div>
          <div class="w-[300px] shrink-0 snap-align-start rounded-3xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <h3 class="text-lg font-bold">Studio Node</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Perfect for dynamic production teams.</p>
              <p class="mt-6 text-4xl font-black">$59<span class="text-xs font-medium">/mo</span></p>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition">Initiate</a>
          </div>
          <div class="w-[300px] shrink-0 snap-align-start rounded-3xl border ${style.border} ${style.bgInner} p-8 flex flex-col justify-between" ${style.hover}>
            <div>
              <h3 class="text-lg font-bold">Regional Cluster</h3>
              <p class="mt-2 text-xs ${style.textMuted}">Full edge staging, custom API access.</p>
              <p class="mt-6 text-4xl font-black">$139<span class="text-xs font-medium">/mo</span></p>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-2.5 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-150/10">Initiate</a>
          </div>
        </div>
      </div>
    </section>`,

    // 12. Floating Glass Overlay Panels
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/5 dark:from-purple-950/20 pointer-events-none"></div>
      <div class="mx-auto max-w-5xl relative z-10">
        <div class="text-center max-w-2xl mx-auto mb-16" ${style.animate}>
          <span class="text-xs font-extrabold uppercase tracking-[0.3em] ${style.accentText}">GLASS FLOATING CARD</span>
          <h2 class="text-4xl font-black mt-3" data-qm="pricing-title">Modern subscription model</h2>
        </div>
        <div class="grid gap-8 md:grid-cols-2">
          <div class="rounded-3xl border border-white/20 bg-white/10 dark:bg-zinc-900/20 backdrop-blur-md p-8 shadow-xl flex flex-col justify-between" ${style.hover}>
            <div>
              <h3 class="text-xl font-bold">Standard Sandbox</h3>
              <p class="text-xs ${style.textMuted} mt-1.5">For individuals staging custom Next.js portfolios.</p>
              <p class="text-4xl font-black mt-6">$39<span class="text-xs font-medium">/mo</span></p>
              <ul class="mt-6 space-y-3.5 text-sm">
                <li class="flex items-center gap-2">${checkIcon} Unlimited database keys</li>
                <li class="flex items-center gap-2">${checkIcon} Custom Tailwind setups</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl border ${style.border} py-3 text-center text-xs font-bold uppercase tracking-wider transition hover:bg-white/20">Launch Sandbox</a>
          </div>
          <div class="rounded-3xl border border-white/25 bg-white/25 dark:bg-zinc-800/20 backdrop-blur-lg p-8 shadow-2xl flex flex-col justify-between relative" ${style.hover}>
            <div class="absolute -top-3 right-6 rounded-full bg-[var(--qm-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">POPULAR CHOICE</div>
            <div>
              <h3 class="text-xl font-bold">Scale Production</h3>
              <p class="text-xs ${style.textMuted} mt-1.5">For client production sites needing instant loads.</p>
              <p class="text-4xl font-black mt-6">$89<span class="text-xs font-medium">/mo</span></p>
              <ul class="mt-6 space-y-3.5 text-sm">
                <li class="flex items-center gap-2">${checkIcon} Priority SLA uptime</li>
                <li class="flex items-center gap-2">${checkIcon} Global CDN asset delivery</li>
              </ul>
            </div>
            <a href="/contact" class="mt-8 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg transition">Launch Production</a>
          </div>
        </div>
      </div>
    </section>`,

    // 13. Minimalist Whitespace Heavy layout
    `<section class="${style.bg} px-6 py-28 transition-colors duration-300">
      <div class="mx-auto max-w-4xl">
        <div class="text-left mb-20" ${style.animate}>
          <span class="text-xs uppercase tracking-[0.3em] font-extrabold ${style.accentText}">MINIMAL EDITION</span>
          <h2 class="text-4xl font-black mt-4 tracking-tight" data-qm="pricing-title">Flat simple plans.</h2>
        </div>
        <div class="grid gap-12 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${style.border}">
          <div class="pt-8 sm:pt-0 sm:pr-8">
            <h3 class="font-bold text-lg uppercase tracking-wider">Independent</h3>
            <p class="text-xs ${style.textMuted} mt-1">Single site setup, unlimited static pages.</p>
            <p class="text-5xl font-black mt-8">$19<span class="text-sm font-medium">/mo</span></p>
            <a href="/contact" class="mt-8 block w-full rounded-none border ${style.border} py-3 text-center text-xs font-bold uppercase tracking-widest transition hover:bg-zinc-150/10">Configure</a>
          </div>
          <div class="pt-8 sm:pt-0 sm:pl-8">
            <h3 class="font-bold text-lg uppercase tracking-wider ${style.accentText}">Collaborative</h3>
            <p class="text-xs ${style.textMuted} mt-1">Multi-domain management, team accounts.</p>
            <p class="text-5xl font-black mt-8">$69<span class="text-sm font-medium">/mo</span></p>
            <a href="/contact" class="mt-8 block w-full rounded-none ${style.accentBg} ${style.accentHoverBg} py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition">Configure</a>
          </div>
        </div>
      </div>
    </section>`,

    // 14. Modern Dual-Column Tier with Accordion Features
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto max-w-5xl">
        <div class="text-center mb-16" ${style.animate}>
          <span class="text-xs font-bold uppercase tracking-[0.25em] ${style.accentText}">ACCORDION EXPANSION</span>
          <h2 class="text-3xl font-black mt-3 sm:text-4xl" data-qm="pricing-title">Flexible pricing structures</h2>
        </div>
        <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="space-y-4">
            <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 flex justify-between items-center">
              <div>
                <h3 class="font-bold">Standard Cloud Node</h3>
                <p class="text-xs ${style.textMuted} mt-0.5">Includes automatic backup, custom CSS compiler</p>
              </div>
              <p class="text-2xl font-black">$49<span class="text-xs font-medium">/mo</span></p>
            </div>
            <div class="rounded-2xl border-2 border-[var(--qm-accent)] ${style.bgInner} p-6 flex justify-between items-center">
              <div>
                <h3 class="font-bold">Pro Scale Network</h3>
                <p class="text-xs ${style.textMuted} mt-0.5">Includes advanced staging clusters, API configurations</p>
              </div>
              <p class="text-2xl font-black text-[var(--qm-accent)]">$129<span class="text-xs font-medium">/mo</span></p>
            </div>
          </div>
          <div class="rounded-2xl border ${style.border} ${style.bgInner} p-6 space-y-4">
            <h4 class="font-bold text-xs uppercase tracking-wider ${style.accentText}">Included with all plans</h4>
            <div class="space-y-3 text-xs">
              <p class="flex items-center gap-2">${checkIcon} SSL certifications</p>
              <p class="flex items-center gap-2">${checkIcon} Global load balancers</p>
              <p class="flex items-center gap-2">${checkIcon} GSAP timelines</p>
              <p class="flex items-center gap-2">${checkIcon} Git integration & deploy hooks</p>
            </div>
            <a href="/contact" class="mt-6 block w-full rounded-xl ${style.accentBg} ${style.accentHoverBg} py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition">Contact Support</a>
          </div>
        </div>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
