import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'beauty',
  themeId: 'soft-salon',
  label: 'Soft Salon',
  brand: 'Luma Beauty',
  eyebrow: 'Salon care with a polished finish',
  title: 'Beauty appointments that feel personal from the first hello.',
  subtitle: 'A salon and spa site for services, gallery, team, testimonials, booking prompts, and packages.',
  cta: 'Book a session',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&auto=format&q=85',
  imageAlt: 'Hair salon styling station',
  keywords: ['salon', 'beauty', 'spa', 'hair', 'makeup', 'nail', 'aesthetic'],
  palette: { bg: '#fff7f8', surface: '#ffffff', text: '#351821', muted: '#8a6670', accent: '#c85578', accentText: '#ffffff', border: 'rgba(53,24,33,0.12)' },
});
