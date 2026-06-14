import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'tech-startup',
  themeId: 'venture-signal',
  label: 'Venture Signal',
  brand: 'SignalForge',
  eyebrow: 'Infrastructure for modern teams',
  title: 'A technical product with a clear reason to exist.',
  subtitle: 'A startup site for product positioning, proof metrics, pricing, integrations, investor-friendly detail, and conversion.',
  cta: 'Join the waitlist',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&q=85',
  imageAlt: 'Circuit board and technology hardware',
  keywords: ['startup', 'tech', 'fintech', 'api', 'infrastructure', 'developer tool', 'innovation'],
  palette: { bg: '#070a12', surface: '#101624', text: '#f8fafc', muted: '#a7b0c0', accent: '#7c3aed', accentText: '#ffffff', border: 'rgba(255,255,255,0.12)', dark: true },
});
