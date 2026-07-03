import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
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

async function requireAdmin() {
  const user = await getQayAuthUser();
  if (!user || !(await hasQayAdminAccess(user))) return false;
  return true;
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const url = new URL(request.url);
    const siteType = cleanString(url.searchParams.get('siteType'), 40);
    const sectionType = normalizeSectionType(url.searchParams.get('sectionType'));
    const approved = url.searchParams.get('approved');

    const admin = getQayAdmin() as any;
    let query = admin
      .from('qay_section_designs')
      .select('id,site_type,section_type,array_index,label,manifest_line,nav_link_style,html,preview_image_url,is_active,rank,keywords,is_approved,source,created_at,updated_at')
      .order('rank', { ascending: false })
      .order('created_at', { ascending: false });

    if (siteType) query = query.eq('site_type', siteType);
    if (sectionType) query = query.eq('section_type', sectionType);
    if (approved === 'true') query = query.eq('is_approved', true);
    if (approved === 'false') query = query.eq('is_approved', false);

    const { data, error } = await query;
    if (error) {
      console.error('[QAY admin sections] GET failed:', error);
      return NextResponse.json({ error: 'Could not list sections.' }, { status: 503 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('[QAY admin sections] GET error:', error);
    return NextResponse.json({ error: 'Could not list sections.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const siteType = cleanString(body.site_type || body.siteType, 40) as SiteType;
    const sectionType = normalizeSectionType(body.section_type || body.sectionType);
    const manifestLine = cleanString(body.manifest_line || body.manifestLine || body.previewDescription, 300);
    const label = cleanString(body.label || body.manifest_line || body.manifestLine, 120);
    const html = cleanString(body.html, 80000);
    const rank = Number.isFinite(Number(body.rank)) ? Number(body.rank) : 50;
    const keywords = Array.isArray(body.keywords) ? body.keywords.map((k: any) => cleanString(k, 80)).filter(Boolean) : [];
    const source = cleanString(body.source, 40) || 'qay';
    const previewImageUrl = cleanString(body.preview_image_url || body.previewImageUrl, 500) || null;

    if (!siteTypes.has(siteType)) {
      return NextResponse.json({ error: 'Choose a valid site type.' }, { status: 400 });
    }

    if (!sectionTypes.has(sectionType)) {
      return NextResponse.json({ error: 'Choose a valid section type.' }, { status: 400 });
    }

    if (!manifestLine) {
      return NextResponse.json({ error: 'Add a manifest line / description.' }, { status: 400 });
    }

    if (html.length < 80 || !/<[a-z][\s\S]*>/i.test(html)) {
      return NextResponse.json({ error: 'Paste a real HTML section before saving.' }, { status: 400 });
    }

    const admin = getQayAdmin() as any;
    const { data, error } = await admin
      .from('qay_section_designs')
      .insert({
        site_type: siteType,
        section_type: sectionType,
        array_index: 0, // Fallback for old schema constraint if required
        label,
        manifest_line: manifestLine,
        html,
        rank,
        keywords,
        is_active: true,
        is_approved: true,
        source,
        preview_image_url: previewImageUrl,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[QAY admin sections] POST failed:', error);
      return NextResponse.json({ error: 'Could not save section.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('[QAY admin sections] POST error:', error);
    return NextResponse.json({ error: 'Could not save section.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const id = cleanString(body.id, 80);
    if (!id) return NextResponse.json({ error: 'Missing section id.' }, { status: 400 });

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (body.site_type !== undefined) updates.site_type = cleanString(body.site_type, 40);
    if (body.section_type !== undefined) updates.section_type = normalizeSectionType(body.section_type);
    if (body.label !== undefined) updates.label = cleanString(body.label, 120);
    if (body.manifest_line !== undefined) updates.manifest_line = cleanString(body.manifest_line, 300);
    if (body.html !== undefined) updates.html = cleanString(body.html, 80000);
    if (body.rank !== undefined) updates.rank = Number(body.rank);
    if (body.keywords !== undefined) updates.keywords = Array.isArray(body.keywords) ? body.keywords.map((k: any) => cleanString(k, 80)).filter(Boolean) : [];
    if (body.is_approved !== undefined) updates.is_approved = Boolean(body.is_approved);
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
    if (body.preview_image_url !== undefined) updates.preview_image_url = cleanString(body.preview_image_url, 500) || null;

    const admin = getQayAdmin() as any;
    const { error } = await admin.from('qay_section_designs').update(updates).eq('id', id);
    if (error) {
      console.error('[QAY admin sections] PATCH failed:', error);
      return NextResponse.json({ error: 'Could not update section.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, ok: true });
  } catch (error) {
    console.error('[QAY admin sections] PATCH error:', error);
    return NextResponse.json({ error: 'Could not update section.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = cleanString(url.searchParams.get('id'), 80);
    if (!id) return NextResponse.json({ error: 'Missing section id.' }, { status: 400 });

    const admin = getQayAdmin() as any;
    const { error } = await admin
      .from('qay_section_designs')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[QAY admin sections] DELETE failed:', error);
      return NextResponse.json({ error: 'Could not deactivate section.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, ok: true });
  } catch (error) {
    console.error('[QAY admin sections] DELETE error:', error);
    return NextResponse.json({ error: 'Could not deactivate section.' }, { status: 500 });
  }
}
