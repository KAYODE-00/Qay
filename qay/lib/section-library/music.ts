import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'music',
  themeId: 'sound-night',
  label: 'Sound Night',
  brand: 'Kairo Sound',
  eyebrow: 'Shows, releases, and late-night frequencies',
  title: 'A music site with rhythm before the first click.',
  subtitle: 'A music site for artists, tour dates, releases, gallery, newsletter, merch prompts, and press-ready details.',
  cta: 'Listen now',
  ctaHref: '/services',
  image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&q=85',
  imageAlt: 'Musician performing on a dark stage',
  keywords: ['music', 'artist', 'band', 'dj', 'producer', 'album', 'tour'],
  palette: { bg: '#0b0612', surface: '#171022', text: '#f8f4ff', muted: '#b4a7c4', accent: '#e879f9', accentText: '#15051c', border: 'rgba(255,255,255,0.13)', dark: true },
});
