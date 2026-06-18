import type { TemplateVariables } from './types';
import { getStyleForIndex, ICONS } from './generator-utils';

export function getContactTemplate(index: number, vars: TemplateVariables): string {
  const style = getStyleForIndex(index);
  const mailIcon = ICONS.mail(style.accentText);
  const phoneIcon = ICONS.phone(style.accentText);
  const pinIcon = ICONS.mapPin(style.accentText);

  const layouts = [
    // 0. Split Form with Sidebar Address
    `<section class="${style.bg} px-6 py-24 transition-colors duration-300">
      <div class="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div class="space-y-8" ${style.animate}>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.28em] ${style.accentText}">LET'S TALK</p>
            <h2 class="mt-4 text-4xl font-black md:text-5xl lg:text-6xl leading-tight" data-qm="contact-title">Start a project</h2>
            <p class="mt-4 text-base ${style.textMuted}">
              Have an idea, inquiry, or looking to collaborate? Send a note and the team will get back to you within 24 hours.
            </p>
          </div>
          
          <div class="space-y-6 pt-6 border-t ${style.border}">
            <div class="flex items-center gap-4">
              <span class="flex size-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border ${style.border}">${mailIcon}</span>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider ${style.textMuted}">Email Us</p>
                <p class="font-bold text-sm">hello@qaystudio.com</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="flex size-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border ${style.border}">${phoneIcon}</span>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider ${style.textMuted}">Call Us</p>
                <p class="font-bold text-sm">+234 (80) 1234 5678</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="flex size-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border ${style.border}">${pinIcon}</span>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider ${style.textMuted}">Studio</p>
                <p class="font-bold text-sm">Lekki Phase 1, Lagos, NG</p>
              </div>
            </div>
          </div>
        </div>
        
        <form class="rounded-3xl border ${style.border} ${style.bgInner} p-8 shadow-sm flex flex-col justify-between">
          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider ${style.textMuted}">First Name</label>
                <input type="text" placeholder="John" class="mt-1.5 w-full rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider ${style.textMuted}">Last Name</label>
                <input type="text" placeholder="Doe" class="mt-1.5 w-full rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-wider ${style.textMuted}">Email Address</label>
              <input type="email" placeholder="name@company.com" class="mt-1.5 w-full rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" required />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-wider ${style.textMuted}">Your Message</label>
              <textarea placeholder="Tell us about the project..." class="mt-1.5 w-full h-32 rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition resize-none" required></textarea>
            </div>
          </div>
          <button type="submit" class="mt-6 w-full h-12 rounded-xl ${style.accentBg} ${style.accentHoverBg} text-sm font-bold text-white transition-all shadow-md">
            Send Message
          </button>
        </form>
      </div>
    </section>`,

    // 1. Centered Card Form
    `<section class="${style.bg} px-6 py-20 transition-colors duration-300">
      <div class="mx-auto max-w-3xl text-center">
        <div class="mb-12" ${style.animate}>
          <p class="text-xs font-bold uppercase tracking-[0.3em] ${style.accentText}">CONTACT US</p>
          <h2 class="mt-4 text-3xl font-black sm:text-4xl md:text-5xl" data-qm="contact-title">Let's connect</h2>
          <p class="mt-4 text-base ${style.textMuted}">
            Fill out the form below or email hello@qaystudio.com directly.
          </p>
        </div>
        <form class="rounded-3xl border ${style.border} ${style.bgInner} p-8 text-left shadow-lg">
          <div class="space-y-4">
            <input type="text" placeholder="Name" class="w-full rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-450 transition" required />
            <input type="email" placeholder="Email" class="w-full rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-450 transition" required />
            <textarea placeholder="Message" class="w-full h-32 rounded-xl border ${style.border} bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-450 transition resize-none" required></textarea>
          </div>
          <button type="submit" class="mt-6 w-full h-12 rounded-xl ${style.accentBg} ${style.accentHoverBg} text-sm font-bold text-white transition-all shadow-md">
            Submit
          </button>
        </form>
      </div>
    </section>`
  ];

  return layouts[index % layouts.length];
}
