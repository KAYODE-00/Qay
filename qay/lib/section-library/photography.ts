import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'photography',
  themeId: 'gallery-contrast',
  label: 'Gallery Contrast',
  brand: 'Noor Frames',
  eyebrow: 'Portraits, campaigns, and honest light',
  title: 'Photography that gives the moment room to breathe.',
  subtitle: 'A photography site for galleries, services, booking, testimonials, portfolio proof, and contact.',
  cta: 'Book a shoot',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&auto=format&q=85',
  imageAlt: 'Portrait photography scene in natural light',
  keywords: ['photography', 'photo', 'photographer', 'portraits', 'shoots', 'commercial photo'],
  palette: { bg: '#0a0a0a', surface: '#151515', text: '#f7f4ef', muted: '#a19b91', accent: '#ffffff', accentText: '#0a0a0a', border: 'rgba(255,255,255,0.12)', dark: true },
});
