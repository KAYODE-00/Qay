import type { SectionType } from '../types';
import { getHeroTemplate } from './hero';
import { getAboutTemplate } from './about';
import { getNavTemplate } from './nav';
import { getFooterTemplate } from './footer';
import { getFeaturesTemplate } from './features';
import { getCtaTemplate } from './cta';
import { getTestimonialsTemplate } from './testimonials';
import { getAuthTemplate } from './auth';
import { getProductsTemplate } from './products';
import { getMenuTemplate } from './menu';
import { getCollectionTemplate } from './collection';
import { getGalleryTemplate } from './gallery';
import { getContactTemplate } from './contact';
import { getPricingTemplate } from './pricing';
import { getTeamTemplate } from './team';
import { getStatsTemplate } from './stats';
import { getFaqTemplate } from './faq';
import { getTimelineTemplate } from './timeline';
import { getScheduleTemplate } from './schedule';

import type { TemplateVariables } from './types';

export function getTemplateHtml(
  sectionType: SectionType,
  index: number,
  vars: TemplateVariables
): string | null {
  switch (sectionType) {
    case 'nav':
      return getNavTemplate(index, vars);
    case 'hero':
      return getHeroTemplate(index, vars);
    case 'about':
      return getAboutTemplate(index, vars);
    case 'footer':
      return getFooterTemplate(index, vars);
    case 'features':
    case 'services':
      return getFeaturesTemplate(index, vars);
    case 'cta':
      return getCtaTemplate(index, vars);
    case 'testimonials':
      return getTestimonialsTemplate(index, vars);
    case 'auth':
      return getAuthTemplate(index, vars);
    case 'products':
      return getProductsTemplate(index, vars);
    case 'menu':
      return getMenuTemplate(index, vars);
    case 'collection':
      return getCollectionTemplate(index, vars);
    case 'gallery':
      return getGalleryTemplate(index, vars);
    case 'contact':
      return getContactTemplate(index, vars);
    case 'pricing':
      return getPricingTemplate(index, vars);
    case 'team':
      return getTeamTemplate(index, vars);
    case 'stats':
      return getStatsTemplate(index, vars);
    case 'faq':
      return getFaqTemplate(index, vars);
    case 'timeline':
      return getTimelineTemplate(index, vars);
    case 'schedule':
      return getScheduleTemplate(index, vars);
    default:
      return null;
  }
}
