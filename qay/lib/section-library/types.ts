export type SiteType =
  | 'restaurant'
  | 'ecommerce'
  | 'portfolio'
  | 'agency'
  | 'saas'
  | 'law'
  | 'medical'
  | 'education'
  | 'event'
  | 'real-estate'
  | 'beauty'
  | 'fitness'
  | 'church'
  | 'blog'
  | 'hotel'
  | 'nonprofit'
  | 'construction'
  | 'tech-startup'
  | 'photography'
  | 'music';

export type SectionType =
  | 'nav'
  | 'hero'
  | 'features'
  | 'about'
  | 'products'
  | 'menu'
  | 'testimonials'
  | 'pricing'
  | 'team'
  | 'gallery'
  | 'stats'
  | 'faq'
  | 'cta'
  | 'contact'
  | 'footer'
  | 'collection'
  | 'timeline'
  | 'services'
  | 'schedule';

export interface QmTheme {
  id: string;
  site_type: SiteType;
  theme_id: string;
  label: string;
  keywords: string[];
  css_variables: Record<string, string>;
  google_fonts: string[];
  is_dark: boolean;
  rank: number;
}

export interface QmSection {
  id: string;
  site_type: SiteType;
  section_type: SectionType;
  theme_id: string;
  keywords: string[];
  html: string;
  preview_description?: string;
  rank: number;
  is_active?: boolean;
}

export interface AssemblyResult {
  html: string;
  theme: QmTheme;
  sectionsUsed: Array<{ type: SectionType; sectionId: string; keywords: string[] }>;
  provider: string;
  siteType: SiteType;
}

export const SECTION_ORDER: Record<SiteType, SectionType[]> = {
  restaurant: ['nav', 'hero', 'menu', 'about', 'gallery', 'testimonials', 'contact', 'footer'],
  ecommerce: ['nav', 'hero', 'collection', 'products', 'about', 'testimonials', 'cta', 'footer'],
  portfolio: ['nav', 'hero', 'features', 'about', 'gallery', 'testimonials', 'contact', 'footer'],
  agency: ['nav', 'hero', 'features', 'about', 'team', 'testimonials', 'cta', 'footer'],
  saas: ['nav', 'hero', 'features', 'stats', 'testimonials', 'pricing', 'faq', 'cta', 'footer'],
  law: ['nav', 'hero', 'services', 'team', 'stats', 'testimonials', 'contact', 'footer'],
  medical: ['nav', 'hero', 'services', 'team', 'stats', 'testimonials', 'contact', 'footer'],
  education: ['nav', 'hero', 'features', 'pricing', 'team', 'testimonials', 'faq', 'cta', 'footer'],
  event: ['nav', 'hero', 'schedule', 'team', 'gallery', 'stats', 'contact', 'footer'],
  'real-estate': ['nav', 'hero', 'features', 'gallery', 'team', 'testimonials', 'contact', 'footer'],
  beauty: ['nav', 'hero', 'services', 'gallery', 'team', 'testimonials', 'cta', 'footer'],
  fitness: ['nav', 'hero', 'features', 'schedule', 'team', 'testimonials', 'pricing', 'footer'],
  church: ['nav', 'hero', 'about', 'schedule', 'team', 'gallery', 'cta', 'footer'],
  blog: ['nav', 'hero', 'features', 'testimonials', 'cta', 'footer'],
  hotel: ['nav', 'hero', 'features', 'gallery', 'pricing', 'testimonials', 'contact', 'footer'],
  nonprofit: ['nav', 'hero', 'about', 'stats', 'team', 'testimonials', 'cta', 'footer'],
  construction: ['nav', 'hero', 'services', 'gallery', 'stats', 'team', 'contact', 'footer'],
  'tech-startup': ['nav', 'hero', 'features', 'stats', 'pricing', 'testimonials', 'cta', 'footer'],
  photography: ['nav', 'hero', 'gallery', 'about', 'services', 'testimonials', 'contact', 'footer'],
  music: ['nav', 'hero', 'about', 'schedule', 'gallery', 'testimonials', 'cta', 'footer'],
};

export const SITE_TYPE_KEYWORDS: Record<SiteType, string[]> = {
  restaurant: ['restaurant', 'food', 'dining', 'cafe', 'menu', 'chef', 'cuisine', 'bar', 'bistro', 'eatery', 'kitchen', 'meals', 'catering', 'jollof'],
  ecommerce: ['shop', 'store', 'ecommerce', 'sell', 'products', 'cart', 'boutique', 'fashion', 'clothing', 'perfume', 'skincare', 'jewelry', 'collection'],
  portfolio: ['portfolio', 'designer', 'developer', 'photographer', 'artist', 'freelancer', 'creative', 'my work', 'case studies'],
  agency: ['agency', 'studio', 'creative', 'branding', 'marketing', 'consulting', 'design firm', 'digital agency'],
  saas: ['saas', 'software', 'app', 'platform', 'dashboard', 'tool', 'productivity', 'automation', 'workflow', 'subscription'],
  law: ['law', 'legal', 'attorney', 'lawyer', 'firm', 'counsel', 'litigation', 'solicitor', 'barrister'],
  medical: ['clinic', 'hospital', 'medical', 'doctor', 'health', 'dental', 'therapy', 'wellness center', 'pharmacy'],
  education: ['school', 'course', 'academy', 'training', 'university', 'tutor', 'learning', 'coaching', 'education'],
  event: ['event', 'wedding', 'conference', 'concert', 'festival', 'party', 'ceremony', 'venue', 'exhibition'],
  'real-estate': ['real estate', 'property', 'homes', 'listing', 'realty', 'apartment', 'housing', 'mortgage', 'realtor'],
  beauty: ['salon', 'beauty', 'spa', 'hair', 'makeup', 'nail', 'barber', 'aesthetic', 'cosmetic'],
  fitness: ['gym', 'fitness', 'yoga', 'crossfit', 'personal trainer', 'workout', 'sports', 'health club'],
  church: ['church', 'ministry', 'faith', 'chapel', 'mosque', 'temple', 'religious', 'worship', 'congregation'],
  blog: ['blog', 'magazine', 'newsletter', 'publication', 'editorial', 'writing', 'content', 'journalist'],
  hotel: ['hotel', 'resort', 'accommodation', 'rooms', 'booking', 'hospitality', 'lodge', 'inn', 'airbnb'],
  nonprofit: ['nonprofit', 'charity', 'foundation', 'ngo', 'donate', 'cause', 'community', 'volunteer', 'mission'],
  construction: ['construction', 'building', 'contractor', 'architecture', 'engineering', 'renovation', 'real estate development'],
  'tech-startup': ['startup', 'fintech', 'tech', 'innovation', 'venture', 'api', 'developer tool', 'infrastructure', 'b2b'],
  photography: ['photography', 'photo', 'photographer', 'shoots', 'portraits', 'wedding photography', 'commercial photo'],
  music: ['music', 'band', 'artist', 'musician', 'dj', 'producer', 'album', 'tour', 'beats', 'record label'],
};
