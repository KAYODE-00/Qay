import { NextResponse } from 'next/server';
import { requireQayAuth } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '@/qay/lib/section-library/types';
import type { SectionType, SiteType } from '@/qay/lib/section-library/types';

const siteTypes = new Set(Object.keys(SITE_TYPE_KEYWORDS));
const sectionTypes = new Set([
  ...Array.from(new Set(Object.values(SECTION_ORDER).flat())),
  'navbar',
  'productGrid',
  'productDetail',
  'cart',
  'checkout',
  'collectionsLanding',
  'brandStory',
  'newsletter',
]);

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

export async function POST(request: Request) {
  try {
    const user = await requireQayAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const siteType = cleanString(body.site_type || body.siteType, 40) as SiteType;
    const sectionType = normalizeSectionType(body.section_type || body.sectionType);
    const manifestLine = cleanString(body.manifest_line || body.manifestLine, 300);
    const html = cleanString(body.html, 80000);
    const keywords = Array.isArray(body.keywords) ? body.keywords.map((k: any) => cleanString(k, 80)).filter(Boolean) : [];

    if (!siteTypes.has(siteType)) {
      return NextResponse.json({ error: 'Choose a valid site type.' }, { status: 400 });
    }

    if (!sectionTypes.has(sectionType)) {
      return NextResponse.json({ error: 'Choose a valid section type.' }, { status: 400 });
    }

    if (!manifestLine) {
      return NextResponse.json({ error: 'Add a manifest line / description.' }, { status: 400 });
    }

    // Validation
    if (html.length < 80 || !/<[a-z][\s\S]*>/i.test(html)) {
      return NextResponse.json({ error: 'Paste a real HTML section.' }, { status: 400 });
    }

    // → Contains no <script> tags
    if (/<script\b[^>]*>([\s\S]*?)<\/script>/gi.test(html)) {
      return NextResponse.json({ error: 'HTML cannot contain <script> tags.' }, { status: 400 });
    }

    // → Contains no onclick handlers (or other on* handlers)
    if (/\bon[a-z]+\s*=/i.test(html)) {
      return NextResponse.json({ error: 'HTML cannot contain inline javascript event handlers (e.g. onclick).' }, { status: 400 });
    }

    // → Has at least one data-qm zone
    if (!/data-qm=/i.test(html)) {
      return NextResponse.json({ error: 'HTML must contain at least one data-qm zone (e.g. data-qm="title").' }, { status: 400 });
    }

    // → Has at least one CSS variable usage (var(--qm-)
    if (!/var\(--qm-/i.test(html)) {
      return NextResponse.json({ error: 'HTML must use QAY CSS variables (e.g. var(--qm-bg) or var(--qm-text)).' }, { status: 400 });
    }

    const admin = getQayAdmin() as any;
    const { data, error } = await admin
      .from('qay_section_designs')
      .insert({
        site_type: siteType,
        section_type: sectionType,
        array_index: 0,
        label: manifestLine.slice(0, 120),
        manifest_line: manifestLine,
        html,
        rank: 30,
        keywords,
        is_active: true,
        is_approved: false,
        source: 'community',
        submitted_by: user.id,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[QAY community submit] POST failed:', error);
      return NextResponse.json({ error: 'Could not submit section.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, message: 'Submitted for review', id: data?.id });
  } catch (error) {
    console.error('[QAY community submit] POST error:', error);
    return NextResponse.json({ error: 'Could not submit section.' }, { status: 500 });
  }
}
