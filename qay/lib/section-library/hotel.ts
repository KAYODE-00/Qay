import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'hotel',
  themeId: 'resort-editorial',
  label: 'Resort Editorial',
  brand: 'The Solace House',
  eyebrow: 'Boutique stays and private escapes',
  title: 'A quieter stay, designed around the good hours.',
  subtitle: 'A hospitality site with rooms, amenities, gallery, booking prompts, guest reviews, and location details.',
  cta: 'Check availability',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&q=85',
  imageAlt: 'Luxury hotel pool and resort exterior',
  keywords: ['hotel', 'resort', 'rooms', 'booking', 'hospitality', 'stay', 'travel'],
  palette: { bg: '#fbf6ec', surface: '#ffffff', text: '#24190f', muted: '#766653', accent: '#9b5b2d', accentText: '#ffffff', border: 'rgba(36,25,15,0.13)' },
  nav: [{ label: 'Rooms', href: '/services' }, { label: 'Gallery', href: '/about' }, { label: 'Book', href: '/contact' }],
});
