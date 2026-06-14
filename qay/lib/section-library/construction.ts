import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'construction',
  themeId: 'builder-industrial',
  label: 'Builder Industrial',
  brand: 'Ironline Build',
  eyebrow: 'Commercial builds and renovation crews',
  title: 'Built right, documented clearly, delivered on schedule.',
  subtitle: 'A construction site for services, project galleries, safety proof, team, estimates, and trust metrics.',
  cta: 'Request estimate',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&auto=format&q=85',
  imageAlt: 'Construction workers on a building site',
  keywords: ['construction', 'building', 'contractor', 'renovation', 'engineering', 'architecture'],
  palette: { bg: '#111111', surface: '#1b1b1b', text: '#f8fafc', muted: '#a3a3a3', accent: '#f5b21b', accentText: '#111111', border: 'rgba(255,255,255,0.12)', dark: true },
});
