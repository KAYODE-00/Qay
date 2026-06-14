import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'fitness',
  themeId: 'training-bold',
  label: 'Training Bold',
  brand: 'Forge Fit',
  eyebrow: 'Strength, conditioning, accountability',
  title: 'Training that makes discipline easier to repeat.',
  subtitle: 'A fitness site for programs, class schedules, trainers, pricing, testimonials, and conversion-ready booking.',
  cta: 'Join a class',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&q=85',
  imageAlt: 'Athletes training in a gym',
  keywords: ['gym', 'fitness', 'trainer', 'workout', 'sports', 'yoga', 'health club'],
  palette: { bg: '#0d1117', surface: '#151b23', text: '#f8fafc', muted: '#a6b0bf', accent: '#f97316', accentText: '#111111', border: 'rgba(255,255,255,0.12)', dark: true },
});
