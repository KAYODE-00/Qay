import { SECTION_ORDER } from './types';
import type { QmSection, QmTheme, SectionType, SiteType } from './types';

type Library = { themes: QmTheme[]; sections: QmSection[] };

const loaders: Partial<Record<SiteType, () => Promise<Library>>> = {
  restaurant: () => import('./restaurant'),
  ecommerce: () => import('./ecommerce'),
  portfolio: () => import('./portfolio'),
  agency: () => import('./agency'),
  saas: () => import('./saas'),
  law: () => import('./law'),
  medical: () => import('./medical'),
  education: () => import('./education'),
  event: () => import('./event'),
  'real-estate': () => import('./real-estate'),
  beauty: () => import('./beauty'),
  fitness: () => import('./fitness'),
  church: () => import('./church'),
  blog: () => import('./blog'),
  hotel: () => import('./hotel'),
  nonprofit: () => import('./nonprofit'),
  construction: () => import('./construction'),
  'tech-startup': () => import('./tech-startup'),
  photography: () => import('./photography'),
  music: () => import('./music'),
};

const genericTheme: QmTheme = {
  id: 'generic-theme-editorial',
  site_type: 'agency',
  theme_id: 'editorial-clean',
  label: 'Editorial Clean',
  keywords: ['clean', 'editorial', 'premium', 'modern', 'professional'],
  css_variables: {
    '--qm-bg': '#f8f7f2',
    '--qm-surface': '#ffffff',
    '--qm-text': '#111111',
    '--qm-text-muted': '#63605a',
    '--qm-accent': '#111111',
    '--qm-accent-text': '#ffffff',
    '--qm-border': 'rgba(17,17,17,0.12)',
    '--qm-heading-font': '"Inter", sans-serif',
    '--qm-body-font': '"Inter", sans-serif',
  },
  google_fonts: ['Inter:wght@400;500;600;700;800'],
  is_dark: false,
  rank: 80,
};

const siteImages: Record<SiteType, { hero: string; alt: string; gallery: string }> = {
  restaurant: {
    hero: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&auto=format&q=85',
    alt: 'Beautifully plated restaurant meal',
    gallery: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&q=85',
  },
  ecommerce: {
    hero: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&auto=format&q=85',
    alt: 'Premium products arranged on a clean surface',
    gallery: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&q=85',
  },
  portfolio: {
    hero: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1400&auto=format&q=85',
    alt: 'Creative portfolio work on a studio wall',
    gallery: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&q=85',
  },
  agency: {
    hero: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&auto=format&q=85',
    alt: 'Brand design work in a creative studio',
    gallery: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&auto=format&q=85',
  },
  saas: {
    hero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&q=85',
    alt: 'Analytics dashboard on laptop screen',
    gallery: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&q=85',
  },
  law: {
    hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&auto=format&q=85',
    alt: 'Law library with legal books',
    gallery: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=1200&auto=format&q=85',
  },
  medical: {
    hero: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1400&auto=format&q=85',
    alt: 'Clinician speaking with a patient in a bright clinic',
    gallery: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&q=85',
  },
  education: {
    hero: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&q=85',
    alt: 'Students learning together in a bright room',
    gallery: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&q=85',
  },
  event: {
    hero: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&auto=format&q=85',
    alt: 'Live event audience with stage lights',
    gallery: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&q=85',
  },
  'real-estate': {
    hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&q=85',
    alt: 'Modern luxury home exterior',
    gallery: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&q=85',
  },
  beauty: {
    hero: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&auto=format&q=85',
    alt: 'Polished salon styling station',
    gallery: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&q=85',
  },
  fitness: {
    hero: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&auto=format&q=85',
    alt: 'Fitness class training in a gym',
    gallery: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&q=85',
  },
  church: {
    hero: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1400&auto=format&q=85',
    alt: 'Warm worship gathering in a church',
    gallery: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&auto=format&q=85',
  },
  blog: {
    hero: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1400&auto=format&q=85',
    alt: 'Editorial desk with open magazine and notes',
    gallery: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&q=85',
  },
  hotel: {
    hero: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&q=85',
    alt: 'Luxury hotel pool and resort exterior',
    gallery: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&q=85',
  },
  nonprofit: {
    hero: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&auto=format&q=85',
    alt: 'Community volunteers working together',
    gallery: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&auto=format&q=85',
  },
  construction: {
    hero: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&auto=format&q=85',
    alt: 'Construction team reviewing building plans',
    gallery: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&auto=format&q=85',
  },
  'tech-startup': {
    hero: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&auto=format&q=85',
    alt: 'Startup team working around laptops',
    gallery: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&q=85',
  },
  photography: {
    hero: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&auto=format&q=85',
    alt: 'Photographer capturing a golden outdoor portrait',
    gallery: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&q=85',
  },
  music: {
    hero: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&q=85',
    alt: 'Musician performing on a dramatic stage',
    gallery: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&q=85',
  },
};

const variantNames = ['split', 'magazine', 'bento', 'sidebar', 'immersive'];

function linkSet(siteType: SiteType) {
  if (siteType === 'ecommerce') return [{ label: 'Shop', href: '/shop' }, { label: 'Story', href: '/about' }, { label: 'Support', href: '/contact' }];
  if (siteType === 'restaurant') return [{ label: 'Menu', href: '/menu' }, { label: 'Story', href: '/about' }, { label: 'Reserve', href: '/contact' }];
  if (siteType === 'saas' || siteType === 'tech-startup') return [{ label: 'Features', href: '/features' }, { label: 'Pricing', href: '/pricing' }, { label: 'Login', href: '/login' }];
  if (siteType === 'portfolio' || siteType === 'photography') return [{ label: 'Work', href: '/work' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }];
  return [{ label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Contact', href: '/contact' }];
}

function ctaFor(siteType: SiteType) {
  if (siteType === 'ecommerce') return 'Shop now';
  if (siteType === 'restaurant') return 'Book a table';
  if (siteType === 'saas' || siteType === 'tech-startup') return 'Start free trial';
  if (siteType === 'hotel') return 'Check availability';
  if (siteType === 'event') return 'Get tickets';
  if (siteType === 'law') return 'Book consultation';
  if (siteType === 'medical' || siteType === 'beauty' || siteType === 'fitness') return 'Book appointment';
  return 'Start a conversation';
}

function makeVariantSection(siteType: SiteType, theme: QmTheme, sectionType: SectionType, index: number): QmSection {
  const variant = variantNames[index - 1] || `variant-${index}`;
  const image = siteImages[siteType] || siteImages.agency;
  const idBase = `${siteType}-${sectionType}-${theme.theme_id}-${variant}`;
  const links = linkSet(siteType);
  const navLinks = links.map((item) => `<a href="${item.href}" class="transition hover:text-[var(--qm-accent)]">${item.label}</a>`).join('');
  const mobileLinks = links.map((item) => `<a href="${item.href}" class="rounded-lg border border-[var(--qm-border)] px-4 py-3">${item.label}</a>`).join('');
  const cta = ctaFor(siteType);

  const base = {
    id: idBase,
    site_type: siteType,
    section_type: sectionType,
    theme_id: theme.theme_id,
    keywords: [variant, sectionType, siteType, theme.label.toLowerCase(), ...(theme.keywords || [])],
    preview_description: `${variant} ${sectionType} variant for ${siteType}.`,
    rank: 72 - index,
    is_active: true,
  };

  if (sectionType === 'nav') {
    const navs = [
      `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5"><a href="/" class="text-lg font-extrabold" data-qm="brand-name">QAY Studio</a><div class="hidden items-center gap-7 text-sm font-semibold md:flex">${navLinks}<a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-5 py-3 text-[var(--qm-accent-text)]">${cta}</a></div><button type="button" class="rounded-full border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#${idBase}-menu" data-qay-class="hidden">Menu</button></div><div id="${idBase}-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden">${mobileLinks}<a href="/contact" class="rounded-lg bg-[var(--qm-accent)] px-4 py-3 text-center text-[var(--qm-accent-text)]">${cta}</a></div></nav>`,
      `<nav class="sticky top-0 z-40 bg-[var(--qm-bg)] px-5 py-5 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center"><div class="hidden gap-6 text-sm md:flex">${navLinks}</div><a href="/" class="text-center text-xl font-black tracking-[0.18em]" data-qm="brand-name">QAY Studio</a><div class="flex justify-end"><button type="button" class="rounded-lg border border-[var(--qm-border)] px-4 py-2 text-sm" data-qay-click="toggle" data-qay-target="#${idBase}-menu" data-qay-class="hidden">Menu</button></div></div><div id="${idBase}-menu" class="hidden fixed right-4 top-20 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl">${mobileLinks}<a href="/contact" class="rounded-lg bg-[var(--qm-accent)] px-4 py-3 text-center text-[var(--qm-accent-text)]">${cta}</a></div></nav>`,
      `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-5 py-3 text-[var(--qm-text)]"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="rounded-full bg-[var(--qm-bg)] px-4 py-2 font-bold" data-qm="brand-name">QAY Studio</a><div class="hidden rounded-full border border-[var(--qm-border)] px-2 py-2 text-sm md:flex">${links.map((item) => `<a href="${item.href}" class="rounded-full px-4 py-2 transition hover:bg-[var(--qm-bg)]">${item.label}</a>`).join('')}</div><button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-sm text-[var(--qm-accent-text)]" data-qay-click="toggle" data-qay-target="#${idBase}-menu" data-qay-class="hidden">Menu</button></div><div id="${idBase}-menu" class="hidden fixed inset-x-5 top-20 z-50 grid gap-3 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl sm:grid-cols-3">${mobileLinks}</div></nav>`,
      `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-4 text-[var(--qm-text)]"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-sm font-black uppercase tracking-[0.28em]" data-qm="brand-name">QAY Studio</a><button type="button" class="border border-[var(--qm-border)] px-5 py-3 text-sm font-semibold" data-qay-click="toggle" data-qay-target="#${idBase}-menu" data-qay-class="hidden">Open menu</button></div><div id="${idBase}-menu" class="hidden fixed inset-4 z-50 flex flex-col justify-between rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl"><div class="flex items-center justify-between"><p class="font-bold" data-qm="brand-name">QAY Studio</p><button type="button" data-qay-click="toggle" data-qay-target="#${idBase}-menu" data-qay-class="hidden">Close</button></div><div class="grid gap-3 text-4xl font-black">${mobileLinks}</div><a href="/contact" class="rounded-xl bg-[var(--qm-accent)] px-5 py-4 text-center text-[var(--qm-accent-text)]">${cta}</a></div></nav>`,
      `<nav class="sticky top-0 z-40 bg-[var(--qm-bg)] px-5 py-5 text-[var(--qm-text)]"><div class="mx-auto flex max-w-7xl items-center justify-between gap-5 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3"><a href="/" class="font-extrabold" data-qm="brand-name">QAY Studio</a><div class="hidden gap-5 text-sm md:flex">${navLinks}</div><button type="button" class="rounded-xl bg-[var(--qm-accent)] px-4 py-2 text-sm text-[var(--qm-accent-text)]" data-qay-click="toggle" data-qay-target="#${idBase}-menu" data-qay-class="hidden">Menu</button></div><div id="${idBase}-menu" class="hidden fixed left-4 top-24 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl">${mobileLinks}</div></nav>`,
    ];
    return { ...base, html: navs[index - 1] };
  }

  if (sectionType === 'hero') {
    const heroes = [
      `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div data-qay-animate="slide-up" data-qay-duration="0.9"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Built with intention</p><h1 class="mt-5 text-5xl font-extrabold leading-[0.95] md:text-7xl" data-qm="hero-title">A sharper website for the next move.</h1><p class="mt-6 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Specific copy, polished sections, and a visual direction matched to the prompt.</p><a href="/contact" class="mt-9 inline-flex rounded-xl bg-[var(--qm-accent)] px-7 py-4 font-bold text-[var(--qm-accent-text)]">${cta}</a></div><div class="overflow-hidden rounded-3xl border border-[var(--qm-border)]" data-qay-hover="img-zoom"><img src="${image.hero}" alt="${image.alt}" class="h-[560px] w-full object-cover" /></div></div></section>`,
      `<section class="relative min-h-[720px] overflow-hidden bg-[var(--qm-bg)] text-[var(--qm-text)]"><img src="${image.hero}" alt="${image.alt}" class="absolute inset-0 h-full w-full object-cover opacity-45" /><div class="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-end px-5 py-16"><div class="max-w-4xl" data-qay-animate="luxe-reveal" data-qay-duration="1.1"><p class="text-xs font-bold uppercase tracking-[0.32em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Designed to stand apart</p><h1 class="mt-5 text-6xl font-black leading-[0.9] md:text-8xl" data-qm="hero-title">A site with presence, not a template.</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Strong imagery, real language, and a layout that fits the exact business.</p></div></div></section>`,
      `<section class="bg-[var(--qm-surface)] px-5 py-16 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3"><div class="rounded-3xl bg-[var(--qm-bg)] p-8 md:col-span-2" data-qay-animate="slide-up"><h1 class="text-5xl font-black leading-none md:text-7xl" data-qm="hero-title">A composed first impression with useful depth.</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Built from section blocks that can be edited, rearranged, and imported cleanly.</p></div><div class="overflow-hidden rounded-3xl" data-qay-hover="img-zoom"><img src="${image.hero}" alt="${image.alt}" class="h-full min-h-[420px] w-full object-cover" /></div></div></section>`,
      `<section class="grid bg-[var(--qm-bg)] text-[var(--qm-text)] lg:grid-cols-[320px_1fr]"><aside class="border-b border-[var(--qm-border)] p-6 lg:border-b-0 lg:border-r"><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Selected direction</p><a href="/contact" class="mt-8 inline-flex rounded-xl border border-[var(--qm-border)] px-5 py-3">${cta}</a></aside><div class="grid gap-8 px-6 py-16 lg:grid-cols-2 lg:items-center"><div data-qay-animate="slide-right"><h1 class="text-5xl font-black leading-none md:text-7xl" data-qm="hero-title">Clear structure. Strong taste. Better output.</h1><p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">A layout system that matches the prompt instead of recycling the same page.</p></div><img src="${image.hero}" alt="${image.alt}" class="h-[520px] w-full rounded-3xl object-cover" /></div></section>`,
      `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><div class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><div class="overflow-hidden rounded-[2rem]" data-qay-hover="img-zoom"><img src="${image.hero}" alt="${image.alt}" class="h-[620px] w-full object-cover" /></div><div class="flex flex-col justify-between rounded-[2rem] border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8"><h1 class="text-5xl font-black leading-none" data-qm="hero-title">A premium site, assembled with taste.</h1><p class="text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Every section carries the business story, not placeholder language.</p><a href="/contact" class="rounded-xl bg-[var(--qm-accent)] px-6 py-4 text-center font-bold text-[var(--qm-accent-text)]">${cta}</a></div></div></div></section>`,
    ];
    return { ...base, html: heroes[index - 1] };
  }

  if (sectionType === 'gallery' || sectionType === 'products' || sectionType === 'collection' || sectionType === 'menu') {
    return {
      ...base,
      html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><div class="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><h2 class="max-w-3xl text-4xl font-black md:text-6xl" data-qm="features-title">A visual edit that fits the offer</h2><p class="max-w-md text-sm leading-6 text-[var(--qm-text-muted)]">Real imagery, balanced spacing, and cards that are easy to edit in QAY.</p></div><div class="grid gap-5 md:grid-cols-4" data-qay-animate="stagger-children"><article class="overflow-hidden rounded-3xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom"><img src="${image.gallery}" alt="${image.alt}" class="h-full min-h-[520px] w-full object-cover" /></article><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="lift"><p class="text-3xl font-black">01</p><p class="mt-4 text-sm leading-6 text-[var(--qm-text-muted)]">A hero item with room for story, product, or service detail.</p></article><article class="overflow-hidden rounded-3xl" data-qay-hover="img-zoom"><img src="${image.hero}" alt="${image.alt}" class="h-64 w-full object-cover" /></article><article class="rounded-3xl bg-[var(--qm-accent)] p-6 text-[var(--qm-accent-text)]"><p class="text-sm font-bold uppercase tracking-[0.2em]">Featured</p><p class="mt-12 text-2xl font-black">Built to look complete before editing.</p></article><article class="rounded-3xl border border-[var(--qm-border)] p-6"><p class="text-3xl font-black">02</p><p class="mt-4 text-sm leading-6 text-[var(--qm-text-muted)]">A secondary tile for details, proof, or category notes.</p></article></div></div></section>`,
    };
  }

  if (sectionType === 'contact') {
    return {
      ...base,
      html: `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Contact</p><h2 class="mt-5 text-4xl font-black md:text-6xl" data-qm="contact-title">Tell us what you need next.</h2><p class="mt-5 text-[var(--qm-text-muted)]">Use the form for inquiries, bookings, quotes, appointments, or partnerships.</p></div><form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6"><div class="grid gap-3 sm:grid-cols-2"><input name="name" placeholder="Name" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /><input name="email" placeholder="Email" class="rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" /></div><textarea name="message" placeholder="Message" class="mt-3 h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea><button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button></form></div></section>`,
    };
  }

  if (sectionType === 'footer') {
    return {
      ...base,
      html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-12 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]"><div><p class="text-2xl font-black" data-qm="footer-brand">QAY Studio</p><p class="mt-4 max-w-sm text-sm leading-6 text-[var(--qm-text-muted)]">A polished website system with editable sections, real copy, and prompt-aware design.</p></div><div class="flex flex-col gap-3 text-sm">${navLinks}</div><div class="rounded-2xl bg-[var(--qm-surface)] p-5 text-sm text-[var(--qm-text-muted)]">Built with QAY. Ready to edit, publish, and improve.</div></div></footer>`,
    };
  }

  return {
    ...base,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-7xl"><div class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">${sectionType}</p><h2 class="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl" data-qm="${sectionType === 'about' ? 'about-title' : 'features-title'}">A section with clear hierarchy and useful content.</h2><p class="mt-5 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="${sectionType === 'about' ? 'about-copy' : 'section-copy'}">Purposeful copy, strong spacing, motion, and details that match the site type.</p></div><div class="grid gap-4 sm:grid-cols-2" data-qay-animate="stagger-children"><article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="lift"><p class="text-3xl font-black">01</p><h3 class="mt-8 text-xl font-bold">Specific promise</h3><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">A concrete benefit visitors can understand quickly.</p></article><article class="rounded-3xl bg-[var(--qm-accent)] p-6 text-[var(--qm-accent-text)]"><p class="text-3xl font-black">02</p><h3 class="mt-8 text-xl font-bold">Premium rhythm</h3><p class="mt-3 text-sm leading-6 opacity-80">Contrast, spacing, and hierarchy built for a stronger page.</p></article><article class="overflow-hidden rounded-3xl sm:col-span-2" data-qay-hover="img-zoom"><img src="${image.gallery}" alt="${image.alt}" class="h-72 w-full object-cover" /></article></div></div></div></section>`,
  };
}

function ensureSectionVariants(siteType: SiteType, library: Library): Library {
  const sections = [...library.sections];
  const sectionOrder = SECTION_ORDER[siteType] || SECTION_ORDER.agency;

  for (const theme of library.themes) {
    for (const sectionType of sectionOrder) {
      const existing = sections.filter((section) => (
        section.theme_id === theme.theme_id
        && section.section_type === sectionType
        && section.is_active !== false
      ));

      for (let index = existing.length + 1; index <= 5; index += 1) {
        sections.push(makeVariantSection(siteType, theme, sectionType, index));
      }
    }
  }

  return { themes: library.themes, sections };
}

function genericLibrary(siteType: SiteType): Library {
  const theme = { ...genericTheme, id: `${siteType}-theme-editorial`, site_type: siteType };
  const section = (section_type: SectionType, rank: number, html: string): QmSection => ({
    id: `${siteType}-${section_type}-editorial`,
    site_type: siteType,
    section_type,
    theme_id: theme.theme_id,
    keywords: ['editorial', 'clean', 'premium', section_type],
    preview_description: `Editorial ${section_type} section for ${siteType}.`,
    rank,
    html,
  });

  return {
    themes: [theme],
    sections: [
      section('nav', 90, `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="font-bold" data-qm="brand-name">QAY Studio</a><div class="hidden gap-6 text-sm md:flex"><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a></div><button type="button" class="border border-[var(--qm-border)] px-4 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#site-mobile-menu" data-qay-class="hidden">Menu</button></div><div id="site-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 shadow-2xl md:hidden"><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a></div></nav>`),
      section('hero', 95, `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div data-qay-animate="slide-up"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-text-muted)]" data-qm="hero-eyebrow">Built with intention</p><h1 class="mt-5 text-5xl font-extrabold leading-[0.95] md:text-7xl" data-qm="hero-title">A sharp website for a serious brand.</h1><p class="mt-6 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Clear positioning, useful sections, and polished visuals assembled for the exact business.</p><a href="/contact" class="mt-9 inline-flex bg-[var(--qm-accent)] px-7 py-4 font-bold text-[var(--qm-accent-text)]">Start a conversation</a></div><div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&auto=format&q=85" alt="Premium workspace interior" class="h-[560px] w-full object-cover" /></div></div></section>`),
      section('features', 85, `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3"><article class="border border-[var(--qm-border)] p-6"><h2 class="text-xl font-semibold">Strategy</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">A clear message, audience fit, and conversion path.</p></article><article class="border border-[var(--qm-border)] p-6"><h2 class="text-xl font-semibold">Design</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Visual rhythm, strong imagery, and editable sections.</p></article><article class="border border-[var(--qm-border)] p-6"><h2 class="text-xl font-semibold">Launch</h2><p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">A complete page ready to refine inside QAY.</p></article></div></section>`),
      section('about', 80, `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2"><h2 class="text-4xl font-bold" data-qm="about-title">Made for teams that care about the details.</h2><p class="text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">This site balances clear copy, practical conversion points, and a visual system the owner can keep editing.</p></div></section>`),
      section('testimonials', 75, `<section class="bg-[var(--qm-surface)] px-5 py-16 text-[var(--qm-text)]"><blockquote class="mx-auto max-w-4xl text-center text-3xl font-semibold leading-tight" data-qm="testimonial-quote">A confident first impression with enough structure to grow.</blockquote></section>`),
      section('contact', 75, `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]"><div class="mx-auto max-w-4xl rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8"><h2 class="text-3xl font-bold">Let us talk</h2><p class="mt-3 text-[var(--qm-text-muted)]">Send a note and we will map the next step.</p><a href="/contact" class="mt-6 inline-flex bg-[var(--qm-accent)] px-6 py-3 text-[var(--qm-accent-text)]">Contact us</a></div></section>`),
      section('cta', 70, `<section class="bg-[var(--qm-surface)] px-5 py-16 text-center text-[var(--qm-text)]"><h2 class="text-4xl font-bold">Ready to move?</h2><a href="/contact" class="mt-6 inline-flex bg-[var(--qm-accent)] px-6 py-3 text-[var(--qm-accent-text)]">Get started</a></section>`),
      section('footer', 80, `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-10 text-sm text-[var(--qm-text-muted)]"><div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between"><p data-qm="footer-brand">QAY Studio</p><div class="flex gap-5"><a href="/about">About</a><a href="/contact">Contact</a></div></div></footer>`),
    ],
  };
}

export async function getLibraryForType(siteType: SiteType): Promise<Library> {
  const loader = loaders[siteType];
  const library = loader ? await loader() : genericLibrary(siteType);
  return ensureSectionVariants(siteType, library);
}

export async function getThemesForType(siteType: SiteType): Promise<QmTheme[]> {
  const { themes } = await getLibraryForType(siteType);
  return themes.sort((a, b) => b.rank - a.rank);
}

export async function getSectionsForType(siteType: SiteType, themeId: string, sectionType: SectionType): Promise<QmSection[]> {
  const { sections } = await getLibraryForType(siteType);
  return sections
    .filter((section) => section.theme_id === themeId && section.section_type === sectionType && section.is_active !== false)
    .sort((a, b) => b.rank - a.rank);
}
