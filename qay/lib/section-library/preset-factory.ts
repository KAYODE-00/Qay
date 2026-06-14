import { SECTION_ORDER } from './types';
import type { QmSection, QmTheme, SectionType, SiteType } from './types';

type Library = { themes: QmTheme[]; sections: QmSection[] };

export type PresetConfig = {
  siteType: SiteType;
  themeId: string;
  label: string;
  brand: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  palette: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentText: string;
    border: string;
    dark?: boolean;
  };
  nav?: Array<{ label: string; href: string }>;
};

function themeFromConfig(config: PresetConfig): QmTheme {
  return {
    id: `${config.siteType}-theme-${config.themeId}`,
    site_type: config.siteType,
    theme_id: config.themeId,
    label: config.label,
    keywords: config.keywords,
    css_variables: {
      '--qm-bg': config.palette.bg,
      '--qm-surface': config.palette.surface,
      '--qm-text': config.palette.text,
      '--qm-text-muted': config.palette.muted,
      '--qm-accent': config.palette.accent,
      '--qm-accent-text': config.palette.accentText,
      '--qm-border': config.palette.border,
      '--qm-heading-font': '"Inter", sans-serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Inter:wght@400;500;600;700;800'],
    is_dark: Boolean(config.palette.dark),
    rank: 88,
  };
}

function navItems(config: PresetConfig) {
  return config.nav || [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];
}

function section(config: PresetConfig, section_type: SectionType, rank: number, html: string): QmSection {
  return {
    id: `${config.siteType}-${section_type}-${config.themeId}`,
    site_type: config.siteType,
    section_type,
    theme_id: config.themeId,
    keywords: [...config.keywords, section_type],
    preview_description: `${config.label} ${section_type} for ${config.siteType}.`,
    rank,
    html,
  };
}

function buildSection(config: PresetConfig, sectionType: SectionType): QmSection {
  const items = navItems(config);
  const links = items.map((item) => `<a href="${item.href}" class="transition hover:text-[var(--qm-accent)]">${item.label}</a>`).join('');
  const mobileLinks = items.map((item) => `<a href="${item.href}">${item.label}</a>`).join('');
  const idPrefix = config.siteType.replace(/[^a-z0-9]+/g, '-');

  if (sectionType === 'nav') {
    return section(config, sectionType, 92, `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="font-extrabold tracking-tight" data-qm="brand-name">${config.brand}</a><div class="hidden items-center gap-7 text-sm font-medium text-[var(--qm-text-muted)] md:flex">${links}<a href="${config.ctaHref}" class="rounded-lg bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]">${config.cta}</a></div><button type="button" class="rounded-lg border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#${idPrefix}-mobile-menu" data-qay-class="hidden">Menu</button></div><div id="${idPrefix}-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden">${mobileLinks}<a href="${config.ctaHref}" class="rounded-lg bg-[var(--qm-accent)] px-4 py-3 text-center text-[var(--qm-accent-text)]">${config.cta}</a></div></nav>`);
  }

  if (sectionType === 'hero') {
    return section(config, sectionType, 96, `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">${config.eyebrow}</p><h1 class="mt-5 text-5xl font-extrabold leading-[0.95] md:text-7xl" data-qm="hero-title">${config.title}</h1><p class="mt-6 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">${config.subtitle}</p><a href="${config.ctaHref}" class="mt-9 inline-flex rounded-lg bg-[var(--qm-accent)] px-7 py-4 font-bold text-[var(--qm-accent-text)]">${config.cta}</a></div><div class="overflow-hidden rounded-2xl border border-[var(--qm-border)]" data-qay-hover="img-zoom"><img src="${config.image}" alt="${config.imageAlt}" class="h-[560px] w-full object-cover" /></div></div></section>`);
  }

  if (sectionType === 'features' || sectionType === 'services') {
    return section(config, sectionType, 86, `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><h2 class="max-w-3xl text-4xl font-extrabold md:text-6xl" data-qm="features-title">What ${config.brand} does best</h2><div class="mt-10 grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children"><article class="rounded-xl border border-[var(--qm-border)] p-6" data-qay-hover="lift"><h3 class="text-xl font-bold">Focused guidance</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Clear recommendations, practical next steps, and a process shaped for the audience.</p></article><article class="rounded-xl border border-[var(--qm-border)] p-6" data-qay-hover="lift"><h3 class="text-xl font-bold">Reliable delivery</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">A polished experience from first touch to final handoff.</p></article><article class="rounded-xl border border-[var(--qm-border)] p-6" data-qay-hover="lift"><h3 class="text-xl font-bold">Measurable outcomes</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Proof points, useful details, and calls to action that help visitors move.</p></article></div></div></section>`);
  }

  if (sectionType === 'gallery') {
    return section(config, sectionType, 84, `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3"><div class="overflow-hidden rounded-2xl md:col-span-2" data-qay-hover="img-zoom"><img src="${config.image}" alt="${config.imageAlt}" class="h-[460px] w-full object-cover" /></div><div class="grid gap-5"><div class="rounded-2xl border border-[var(--qm-border)] p-6"><p class="text-4xl font-extrabold">01</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">A visual system matched to the market.</p></div><div class="rounded-2xl border border-[var(--qm-border)] p-6"><p class="text-4xl font-extrabold">02</p><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Details that make the page feel finished.</p></div></div></div></section>`);
  }

  if (sectionType === 'pricing') {
    return section(config, sectionType, 84, `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><h2 class="text-4xl font-extrabold">Simple options to start.</h2><div class="mt-10 grid gap-4 md:grid-cols-3"><article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h3 class="font-bold">Starter</h3><p class="mt-4 text-4xl font-extrabold">$99</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">A focused first step.</p></article><article class="rounded-2xl border-2 border-[var(--qm-accent)] bg-[var(--qm-surface)] p-6"><h3 class="font-bold">Core</h3><p class="mt-4 text-4xl font-extrabold">$249</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">The recommended path.</p></article><article class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><h3 class="font-bold">Custom</h3><p class="mt-4 text-4xl font-extrabold">Talk</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Built around the full scope.</p></article></div></div></section>`);
  }

  if (sectionType === 'team') {
    return section(config, sectionType, 80, `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><h2 class="text-4xl font-extrabold">People behind the work</h2><div class="mt-8 grid gap-4 md:grid-cols-3"><article class="rounded-xl border border-[var(--qm-border)] p-6"><h3 class="font-bold">Lead specialist</h3><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Strategy and client outcomes.</p></article><article class="rounded-xl border border-[var(--qm-border)] p-6"><h3 class="font-bold">Operations lead</h3><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Scheduling, support, and quality.</p></article><article class="rounded-xl border border-[var(--qm-border)] p-6"><h3 class="font-bold">Client success</h3><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Clear communication from start to finish.</p></article></div></div></section>`);
  }

  if (sectionType === 'stats') {
    return section(config, sectionType, 82, `<section class="bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-4 md:grid-cols-4"><div class="rounded-xl bg-[var(--qm-surface)] p-6"><p class="text-4xl font-extrabold">10+</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">years experience</p></div><div class="rounded-xl bg-[var(--qm-surface)] p-6"><p class="text-4xl font-extrabold">250+</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">clients helped</p></div><div class="rounded-xl bg-[var(--qm-surface)] p-6"><p class="text-4xl font-extrabold">4.9</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">average rating</p></div><div class="rounded-xl bg-[var(--qm-surface)] p-6"><p class="text-4xl font-extrabold">24h</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">response window</p></div></div></section>`);
  }

  if (sectionType === 'schedule' || sectionType === 'timeline') {
    return section(config, sectionType, 80, `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-5xl"><h2 class="text-4xl font-extrabold">How it works</h2><div class="mt-8 space-y-4"><div class="rounded-xl border border-[var(--qm-border)] p-5"><p class="font-bold">01 Discovery</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Understand the goal, audience, and best next step.</p></div><div class="rounded-xl border border-[var(--qm-border)] p-5"><p class="font-bold">02 Plan</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Agree on scope, timing, and responsibilities.</p></div><div class="rounded-xl border border-[var(--qm-border)] p-5"><p class="font-bold">03 Deliver</p><p class="mt-2 text-sm text-[var(--qm-text-muted)]">Execute with clear updates and polished handoff.</p></div></div></div></section>`);
  }

  if (sectionType === 'faq') {
    return section(config, sectionType, 78, `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-4xl"><h2 class="text-4xl font-extrabold">Common questions</h2><div class="mt-8 space-y-3"><details class="rounded-xl border border-[var(--qm-border)] p-5"><summary class="font-bold">How do we start?</summary><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Send a short note and the team will recommend the right path.</p></details><details class="rounded-xl border border-[var(--qm-border)] p-5"><summary class="font-bold">Can this be customized?</summary><p class="mt-3 text-sm text-[var(--qm-text-muted)]">Yes. The page is designed to be edited and refined in QAY.</p></details></div></div></section>`);
  }

  if (sectionType === 'testimonials') {
    return section(config, sectionType, 78, `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><blockquote class="mx-auto max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl" data-qm="testimonial-quote">Clear, professional, and exactly what we needed to trust the next step.</blockquote><p class="mx-auto mt-6 max-w-5xl text-sm uppercase tracking-[0.25em] text-[var(--qm-accent)]">Client review</p></section>`);
  }

  if (sectionType === 'cta') {
    return section(config, sectionType, 80, `<section class="bg-[var(--qm-accent)] px-5 py-20 text-center text-[var(--qm-accent-text)]"><h2 class="mx-auto max-w-3xl text-4xl font-extrabold md:text-6xl">Ready to make the next move?</h2><a href="${config.ctaHref}" class="mt-8 inline-flex rounded-lg bg-[var(--qm-accent-text)] px-7 py-4 font-bold text-[var(--qm-accent)]">${config.cta}</a></section>`);
  }

  if (sectionType === 'contact') {
    return section(config, sectionType, 82, `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2"><div><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Contact</p><h2 class="mt-4 text-4xl font-extrabold" data-qm="contact-title">Tell us what you need.</h2><p class="mt-4 text-[var(--qm-text-muted)]">A short message is enough to start.</p></div><form class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><input name="name" placeholder="Name" class="mb-3 w-full rounded-lg border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="mb-3 w-full rounded-lg border border-[var(--qm-border)] bg-transparent px-4 py-3" /><textarea name="message" placeholder="Message" class="h-28 w-full rounded-lg border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-lg bg-[var(--qm-accent)] px-6 py-3 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section>`);
  }

  return section(config, sectionType, 78, `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-10 text-sm text-[var(--qm-text-muted)]"><div class="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between"><p class="font-bold text-[var(--qm-text)]" data-qm="footer-brand">${config.brand}</p><div class="flex gap-5">${links}</div></div></footer>`);
}

export function createPresetLibrary(config: PresetConfig): Library {
  const theme = themeFromConfig(config);
  const sections = SECTION_ORDER[config.siteType].map((sectionType) => buildSection(config, sectionType));
  return { themes: [theme], sections };
}
