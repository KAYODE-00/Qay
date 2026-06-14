import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { SITE_TYPE_KEYWORDS, SECTION_ORDER } from '@/qay/lib/section-library/types';
import type { SectionType, SiteType } from '@/qay/lib/section-library/types';

const siteTypes = new Set(Object.keys(SITE_TYPE_KEYWORDS));
const sectionTypes = new Set(Array.from(new Set(Object.values(SECTION_ORDER).flat())));

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanKeywords(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanString(item, 40)).filter(Boolean).slice(0, 16);
  }

  return cleanString(value, 400)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 16);
}

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();
    if (!user || !(await hasQayAdminAccess(user))) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const siteType = cleanString(body.siteType, 40) as SiteType;
    const sectionType = cleanString(body.sectionType, 40) as SectionType;
    const themeId = cleanString(body.themeId, 80) || 'custom-admin';
    const html = cleanString(body.html, 40000);
    const keywords = cleanKeywords(body.keywords);

    if (!siteTypes.has(siteType)) {
      return NextResponse.json({ error: 'Choose a valid site type.' }, { status: 400 });
    }

    if (!sectionTypes.has(sectionType)) {
      return NextResponse.json({ error: 'Choose a valid section type.' }, { status: 400 });
    }

    if (html.length < 80 || !/<[a-z][\s\S]*>/i.test(html)) {
      return NextResponse.json({ error: 'Paste a real HTML section before saving.' }, { status: 400 });
    }

    const admin = getQayAdmin() as any;
    const { data, error } = await admin
      .from('qm_sections')
      .insert({
        site_type: siteType,
        section_type: sectionType,
        theme_id: themeId,
        keywords: keywords.length ? keywords : ['custom', sectionType],
        html,
        preview_description: cleanString(body.previewDescription, 240) || `Custom ${sectionType} section`,
        rank: Number.isFinite(Number(body.rank)) ? Number(body.rank) : 70,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[QAY admin sections] Insert failed:', error);
      return NextResponse.json({ error: 'Could not save section. Make sure migration 014 is applied.' }, { status: 503 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error('[QAY admin sections] Error:', error);
    return NextResponse.json({ error: 'Could not save section.' }, { status: 500 });
  }
}
