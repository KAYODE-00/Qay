import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'event',
  themeId: 'stage-electric',
  label: 'Stage Electric',
  brand: 'Summit Night',
  eyebrow: 'Live event, limited seats',
  title: 'A night built for momentum, people, and memorable moments.',
  subtitle: 'An event site for schedules, speakers, venue details, RSVP/tickets, gallery, and sponsor proof.',
  cta: 'Reserve a seat',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&q=85',
  imageAlt: 'Crowd at a live event with stage lights',
  keywords: ['event', 'conference', 'concert', 'festival', 'wedding', 'venue', 'tickets'],
  palette: { bg: '#080c18', surface: '#11182a', text: '#f8fafc', muted: '#aab3c2', accent: '#38bdf8', accentText: '#06111f', border: 'rgba(255,255,255,0.13)', dark: true },
});
