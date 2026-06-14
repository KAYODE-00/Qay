import { createPresetLibrary } from './preset-factory';

export const { themes, sections } = createPresetLibrary({
  siteType: 'medical',
  themeId: 'calm-clinic',
  label: 'Calm Clinic',
  brand: 'Aster Health',
  eyebrow: 'Patient-first care',
  title: 'Healthcare that feels clear, calm, and close.',
  subtitle: 'A trustworthy clinic site for services, practitioners, appointments, patient education, and location details.',
  cta: 'Book appointment',
  ctaHref: '/contact',
  image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1400&auto=format&q=85',
  imageAlt: 'Clinician speaking with a patient in a bright clinic',
  keywords: ['medical', 'clinic', 'doctor', 'health', 'patient', 'care', 'wellness'],
  palette: { bg: '#f4fbf9', surface: '#ffffff', text: '#10312d', muted: '#5f7771', accent: '#0f8b7f', accentText: '#ffffff', border: 'rgba(16,49,45,0.12)' },
  nav: [{ label: 'Services', href: '/services' }, { label: 'Doctors', href: '/about' }, { label: 'Location', href: '/contact' }],
});
