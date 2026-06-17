import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { loadLibrary } from '@/qay/lib/section-library/manifest';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS, type SiteType } from '@/qay/lib/section-library/types';

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeSectionType(value: unknown) {
  const sectionType = cleanString(value, 80);
  if (sectionType === 'nav') return 'navbar';
  if (sectionType === 'products') return 'productGrid';
  if (sectionType === 'collection') return 'collectionsLanding';
  return sectionType;
}

export async function GET(request: Request) {
  const user = await getQayAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedSiteType = cleanString(url.searchParams.get('siteType'), 40);
  const sectionType = normalizeSectionType(url.searchParams.get('sectionType'));
  const siteType = Object.prototype.hasOwnProperty.call(SITE_TYPE_KEYWORDS, requestedSiteType)
    ? requestedSiteType as SiteType
    : 'ecommerce';

  const library = await loadLibrary(siteType);
  const sections = Object.entries(library)
    .filter(([slot, designs]) => slot !== 'siteType' && Array.isArray(designs))
    .flatMap(([slot, designs]) => (designs as any[]).map((design) => ({
      siteType,
      sectionType: slot,
      id: design.id || null,
      index: design.index,
      label: design.label,
      manifestLine: design.manifestLine,
      navLinkStyle: design.navLinkStyle || null,
      html: design.html,
    })))
    .filter((section) => !sectionType || section.sectionType === sectionType)
    .sort((a, b) => a.sectionType.localeCompare(b.sectionType) || a.index - b.index);

  const sectionTypes = Array.from(new Set([
    'navbar',
    ...((SECTION_ORDER[siteType] || SECTION_ORDER.agency).map((slot) => (
      slot === 'nav' ? 'navbar' : slot === 'products' ? 'productGrid' : slot === 'collection' ? 'collectionsLanding' : slot
    ))),
    ...sections.map((section) => section.sectionType),
  ]));

  return NextResponse.json({
    data: {
      siteType,
      siteTypes: Object.keys(SITE_TYPE_KEYWORDS),
      sectionTypes,
      sections,
    },
  });
}
