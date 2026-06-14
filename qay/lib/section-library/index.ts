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
  return loader ? loader() : genericLibrary(siteType);
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
