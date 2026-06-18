import type { SiteType } from '../types';

export interface TemplateVariables {
  siteType: SiteType;
  idBase: string;
  cta: string;
  navLinks: string;
  mobileLinks: string;
  heroImage: string;
  heroAlt: string;
  galleryImage: string;
}
