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

async function nextArrayIndex(admin: any, siteType: string, sectionType: string) {
  const { data } = await admin
    .from('qay_section_designs')
    .select('array_index')
    .eq('site_type', siteType)
    .eq('section_type', sectionType)
    .order('array_index', { ascending: false })
    .limit(1);

  return Number(data?.[0]?.array_index || -1) + 1;
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const url = new URL(request.url);
    const siteType = cleanString(url.searchParams.get('siteType'), 40);
    const sectionType = normalizeSectionType(url.searchParams.get('sectionType'));

    if (siteType && !siteTypes.has(siteType)) {
      return NextResponse.json({ error: 'Choose a valid site type.' }, { status: 400 });
    }

    if (sectionType && !sectionTypes.has(sectionType)) {
      return NextResponse.json({ error: 'Choose a valid section type.' }, { status: 400 });
    }

    const admin = getQayAdmin() as any;
    let query = admin
      .from('qay_section_designs')
      .select('id,site_type,section_type,array_index,label,manifest_line,nav_link_style,html,preview_image_url,is_active,created_at,updated_at')
      .order('site_type', { ascending: true })
      .order('section_type', { ascending: true })
      .order('array_index', { ascending: true });

    if (siteType) query = query.eq('site_type', siteType);
    if (sectionType) query = query.eq('section_type', sectionType);

    const { data, error } = await query;
    if (error) {
      console.error('[QAY admin sections] List failed:', error);
      return NextResponse.json({ error: 'Could not list section designs. Make sure migration 015 is applied.' }, { status: 503 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('[QAY admin sections] GET error:', error);
    return NextResponse.json({ error: 'Could not list section designs.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const siteType = cleanString(body.siteType, 40) as SiteType;
    const sectionType = normalizeSectionType(body.sectionType);
    const label = cleanString(body.label || body.previewDescription, 120);
    const manifestLine = cleanString(body.manifestLine || body.previewDescription || body.keywords, 300);
    const html = cleanString(body.html, 80000);
    const navLinkStyle = sectionType === 'navbar' ? cleanString(body.navLinkStyle, 20) || 'routes' : null;

    if (!siteTypes.has(siteType)) {
      return NextResponse.json({ error: 'Choose a valid site type.' }, { status: 400 });
    }

    if (!sectionTypes.has(sectionType)) {
      return NextResponse.json({ error: 'Choose a valid section type.' }, { status: 400 });
    }

    if (!label || !manifestLine) {
      return NextResponse.json({ error: 'Add a label and manifest line.' }, { status: 400 });
    }

    if (html.length < 80 || !/<[a-z][\s\S]*>/i.test(html)) {
      return NextResponse.json({ error: 'Paste a real HTML section before saving.' }, { status: 400 });
    }

    if (navLinkStyle && !['routes', 'anchors', 'none'].includes(navLinkStyle)) {
      return NextResponse.json({ error: 'Choose a valid nav link style.' }, { status: 400 });
    }

    const admin = getQayAdmin() as any;
    const arrayIndex = Number.isFinite(Number(body.arrayIndex))
      ? Number(body.arrayIndex)
      : await nextArrayIndex(admin, siteType, sectionType);

    const { data, error } = await admin
      .from('qay_section_designs')
      .insert({
        site_type: siteType,
        section_type: sectionType,
        array_index: arrayIndex,
        label,
        manifest_line: manifestLine,
        nav_link_style: navLinkStyle,
        html,
        preview_image_url: cleanString(body.previewImageUrl, 500) || null,
        is_active: true,
      })
      .select('id,array_index')
      .single();

    if (error) {
      console.error('[QAY admin sections] Insert failed:', error);
      return NextResponse.json({ error: 'Could not save section. Make sure migration 015 is applied.' }, { status: 503 });
    }

    return NextResponse.json({ ok: true, id: data?.id, arrayIndex: data?.array_index });
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

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.label !== undefined) updates.label = cleanString(body.label, 120);
    if (body.manifestLine !== undefined) updates.manifest_line = cleanString(body.manifestLine, 300);
    if (body.html !== undefined) updates.html = cleanString(body.html, 80000);
    if (body.navLinkStyle !== undefined) updates.nav_link_style = cleanString(body.navLinkStyle, 20) || null;
    if (body.previewImageUrl !== undefined) updates.preview_image_url = cleanString(body.previewImageUrl, 500) || null;
    if (body.isActive !== undefined) updates.is_active = Boolean(body.isActive);

    const admin = getQayAdmin() as any;
    const { error } = await admin.from('qay_section_designs').update(updates).eq('id', id);
    if (error) {
      console.error('[QAY admin sections] Patch failed:', error);
      return NextResponse.json({ error: 'Could not update section.' }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
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
      console.error('[QAY admin sections] Delete failed:', error);
      return NextResponse.json({ error: 'Could not deactivate section.' }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[QAY admin sections] DELETE error:', error);
    return NextResponse.json({ error: 'Could not deactivate section.' }, { status: 500 });
  }
}
