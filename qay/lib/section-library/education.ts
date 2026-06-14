import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'education',
  themeId: 'academy-bright',
  label: 'Academy Bright',
  brand: 'Northstar Academy',
  eyebrow: 'Courses built for measurable progress',
  title: 'Learn the skill, prove the outcome, move forward.',
  subtitle: 'An education site for courses, instructors, enrollment, pricing, student results, and FAQs.',
  cta: 'Explore courses',
  ctaHref: '/services',
  image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1400&auto=format&q=85',
  imageAlt: 'Students learning together on campus',
  keywords: ['school', 'course', 'academy', 'training', 'learning', 'education', 'students'],
  palette: { bg: '#f7fbff', surface: '#ffffff', text: '#10213f', muted: '#61708a', accent: '#1d4ed8', accentText: '#ffffff', border: 'rgba(16,33,63,0.12)' },
});
