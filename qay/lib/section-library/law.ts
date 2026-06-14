import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'law',
  themeId: 'navy-authority',
  label: 'Navy Authority',
  brand: 'Sterling & Cole',
  eyebrow: 'Legal counsel with disciplined strategy',
  title: 'Serious counsel for high-stakes decisions.',
  subtitle: 'A precise law firm website for consultations, practice areas, attorney profiles, and trust-building case results.',
  cta: 'Book a consultation',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&auto=format&q=85',
  imageAlt: 'Law library with legal books',
  keywords: ['law', 'legal', 'attorney', 'firm', 'litigation', 'counsel', 'authority'],
  palette: { bg: '#0c1326', surface: '#111b33', text: '#f8fafc', muted: '#a7b0c0', accent: '#c9a227', accentText: '#0c1326', border: 'rgba(255,255,255,0.12)', dark: true },
  nav: [{ label: 'Practice areas', href: '/services' }, { label: 'Attorneys', href: '/about' }, { label: 'Contact', href: '/contact' }],
});
