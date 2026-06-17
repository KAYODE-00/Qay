import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getLibraryForType } from '@/qay/lib/section-library';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS, type QmSection, type SiteType } from './types';

export interface SectionDesign {
  index: number;
  label: string;
  manifestLine: string;
  navLinkStyle?: 'routes' | 'anchors' | 'none';
  html: string;
}

export interface SiteTypeLibrary {
  siteType: SiteType;
  navbar: SectionDesign[];
  hero: SectionDesign[];
  footer: SectionDesign[];
  [sectionType: string]: SectionDesign[] | SiteType;
}

type DbSectionDesign = {
  id: string;
  site_type: string;
  section_type: string;
  array_index: number;
  label: string;
  manifest_line: string;
  nav_link_style: 'routes' | 'anchors' | 'none' | null;
  html: string;
  is_active: boolean | null;
};

const cache = new Map<string, { expiresAt: number; library: SiteTypeLibrary }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeSlot(sectionType: string) {
  if (sectionType === 'nav') return 'navbar';
  if (sectionType === 'products') return 'productGrid';
  if (sectionType === 'collection') return 'collectionsLanding';
  return sectionType;
}

function denormalizeSlot(slot: string) {
  if (slot === 'navbar') return 'nav';
  if (slot === 'productGrid') return 'products';
  if (slot === 'collectionsLanding') return 'collection';
  return slot;
}

function labelFromSection(section: QmSection, index: number) {
  return section.preview_description || `${section.section_type} design ${index}`;
}

function manifestLineFromSection(section: QmSection, index: number) {
  const keywords = section.keywords?.slice(0, 7).join(', ');
  return `${labelFromSection(section, index)}${keywords ? `; keywords: ${keywords}` : ''}`;
}

function pushDesign(library: SiteTypeLibrary, slot: string, design: SectionDesign) {
  const normalized = normalizeSlot(slot);
  const pool = Array.isArray(library[normalized]) ? library[normalized] as SectionDesign[] : [];
  pool.push(design);
  library[normalized] = pool;
}

async function loadDbDesigns(siteType: SiteType): Promise<DbSectionDesign[]> {
  try {
    const admin = getQayAdmin() as any;
    const { data, error } = await admin
      .from('qay_section_designs')
      .select('id,site_type,section_type,array_index,label,manifest_line,nav_link_style,html,is_active')
      .eq('site_type', siteType)
      .eq('is_active', true)
      .order('section_type', { ascending: true })
      .order('array_index', { ascending: true });

    if (error) return [];
    return (data || []) as DbSectionDesign[];
  } catch {
    return [];
  }
}

function sortPools(library: SiteTypeLibrary) {
  for (const [key, value] of Object.entries(library)) {
    if (key === 'siteType' || !Array.isArray(value)) continue;
    value.sort((a, b) => a.index - b.index);
  }
}

export async function loadLibrary(siteType: SiteType | string): Promise<SiteTypeLibrary> {
  const resolvedType = Object.prototype.hasOwnProperty.call(SITE_TYPE_KEYWORDS, siteType)
    ? siteType as SiteType
    : 'agency';
  const cached = cache.get(resolvedType);
  if (cached && cached.expiresAt > Date.now()) return cached.library;

  const [{ sections }, dbDesigns] = await Promise.all([
    getLibraryForType(resolvedType),
    loadDbDesigns(resolvedType),
  ]);

  const library: SiteTypeLibrary = {
    siteType: resolvedType,
    navbar: [],
    hero: [],
    footer: [],
  };
  const order = SECTION_ORDER[resolvedType] || SECTION_ORDER.agency;

  for (const sectionType of order) {
    const pool = sections
      .filter((section) => section.section_type === sectionType && section.is_active !== false)
      .slice(0, 10);

    pool.forEach((section, index) => pushDesign(library, sectionType, {
      index,
      label: labelFromSection(section, index),
      manifestLine: manifestLineFromSection(section, index),
      navLinkStyle: sectionType === 'nav' ? 'routes' : undefined,
      html: section.html,
    }));
  }

  for (const design of dbDesigns) {
    pushDesign(library, design.section_type, {
      index: design.array_index,
      label: design.label,
      manifestLine: design.manifest_line,
      navLinkStyle: design.nav_link_style || undefined,
      html: design.html,
    });
  }

  for (const slot of ['productGrid', 'collectionsLanding']) {
    const normalized = denormalizeSlot(slot);
    if (!Array.isArray(library[slot]) && Array.isArray(library[normalized])) {
      library[slot] = library[normalized] as SectionDesign[];
    }
  }

  sortPools(library);
  cache.set(resolvedType, { expiresAt: Date.now() + CACHE_TTL_MS, library });
  return library;
}

export async function getLibraryManifest(siteType: SiteType | string): Promise<string> {
  const library = await loadLibrary(siteType);
  const lines: string[] = [];

  for (const [sectionType, designs] of Object.entries(library)) {
    if (!Array.isArray(designs) || !designs.length) continue;
    lines.push(`\n${sectionType}:`);
    designs.forEach((design) => {
      lines.push(`  [${design.index}] ${design.manifestLine}`);
    });
  }

  return lines.join('\n');
}

export function normalizeDecisionSlot(slot: string) {
  return normalizeSlot(denormalizeSlot(slot));
}
