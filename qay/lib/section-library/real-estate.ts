import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'real-estate',
  themeId: 'property-premium',
  label: 'Property Premium',
  brand: 'Harbor & Key',
  eyebrow: 'Homes, listings, and local guidance',
  title: 'Find the property that makes the next chapter obvious.',
  subtitle: 'A real estate site for listings, agent proof, neighborhood expertise, property galleries, and lead capture.',
  cta: 'View listings',
  ctaHref: '/services',
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&q=85',
  imageAlt: 'Modern luxury house exterior',
  keywords: ['real estate', 'property', 'homes', 'listing', 'realtor', 'apartment', 'housing'],
  palette: { bg: '#f7f5ef', surface: '#ffffff', text: '#10221b', muted: '#617067', accent: '#214f3a', accentText: '#ffffff', border: 'rgba(16,34,27,0.13)' },
  nav: [{ label: 'Listings', href: '/services' }, { label: 'Agents', href: '/about' }, { label: 'Contact', href: '/contact' }],
});
