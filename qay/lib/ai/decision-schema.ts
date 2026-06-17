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

export interface SiteDecision {
  siteType: SiteType;
  confidence: 'high' | 'medium' | 'low';
  navMode: 'multi-page' | 'single-page-scroll';
  sectionPicks: Record<string, number>;
  pages: Array<{
    name: string;
    slug: string;
    sectionSlots: string[];
  }>;
  brand: {
    name: string;
    tagline: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      isUserSupplied: boolean;
    };
    fonts: {
      heading: string;
      body: string;
      isUserSupplied: boolean;
    };
    images: Record<string, string | null>;
  };
  textContent: Record<string, string>;
  notes: string[];
}
