import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'nonprofit',
  themeId: 'mission-earth',
  label: 'Mission Earth',
  brand: 'Bridge Mission',
  eyebrow: 'Community impact with transparent action',
  title: 'Turn attention into help that reaches people.',
  subtitle: 'A nonprofit site for mission storytelling, impact stats, volunteers, donations, testimonials, and campaign CTAs.',
  cta: 'Support the mission',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&auto=format&q=85',
  imageAlt: 'Volunteers working together in a community',
  keywords: ['nonprofit', 'charity', 'foundation', 'ngo', 'donate', 'community', 'volunteer'],
  palette: { bg: '#f5fbf1', surface: '#ffffff', text: '#182814', muted: '#64745d', accent: '#3f7d20', accentText: '#ffffff', border: 'rgba(24,40,20,0.12)' },
});
