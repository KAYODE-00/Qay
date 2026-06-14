import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'church',
  themeId: 'community-warm',
  label: 'Community Warm',
  brand: 'Grace Harbor',
  eyebrow: 'Worship, community, service',
  title: 'A place to gather, grow, and serve together.',
  subtitle: 'A church or ministry site for service times, community groups, sermons, leadership, and giving CTAs.',
  cta: 'Plan a visit',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1400&auto=format&q=85',
  imageAlt: 'Warm church interior with seating',
  keywords: ['church', 'ministry', 'faith', 'worship', 'community', 'congregation'],
  palette: { bg: '#fbf7ef', surface: '#ffffff', text: '#2c2118', muted: '#75695f', accent: '#8b5e34', accentText: '#ffffff', border: 'rgba(44,33,24,0.12)' },
});
