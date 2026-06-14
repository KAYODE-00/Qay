import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'blog',
  themeId: 'magazine-clean',
  label: 'Magazine Clean',
  brand: 'Field Notes',
  eyebrow: 'Essays, interviews, and practical analysis',
  title: 'Readable stories with a strong editorial point of view.',
  subtitle: 'A blog or magazine site for featured articles, categories, newsletter capture, author voice, and issue-style layouts.',
  cta: 'Read latest',
  ctaHref: '/blog',
  image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1400&auto=format&q=85',
  imageAlt: 'Magazine and editorial workspace',
  keywords: ['blog', 'magazine', 'newsletter', 'publication', 'editorial', 'writing'],
  palette: { bg: '#faf9f5', surface: '#ffffff', text: '#161616', muted: '#66615a', accent: '#111111', accentText: '#ffffff', border: 'rgba(22,22,22,0.12)' },
});
