import { NextRequest, NextResponse } from 'next/server';
import { getComponentById } from '@/lib/repositories/componentRepository';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PART_TYPES = new Set([
  'section',
  'navbar',
  'footer',
  'slider',
  'parallax',
  'hero',
  'card',
  'form',
  'gallery',
  'commerce',
  'auth',
  'other',
]);

function cleanString(value: unknown, max = 120) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function normalizePartType(value: unknown) {
  const partType = cleanString(value, 48).toLowerCase();
  return PART_TYPES.has(partType) ? partType : 'section';
}

export async function POST(request: NextRequest) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const siteId = getQaySiteIdFromRequest(request) || cleanString(new URL(request.url).searchParams.get('site'), 80);
    if (!siteId) {
      return NextResponse.json({ error: 'site is required' }, { status: 400 });
    }

    if (!(await canAccessQaySite(siteId))) {
      return NextResponse.json({ error: 'Not authorized for QAY site' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const componentId = cleanString(body?.componentId, 80);
    if (!componentId) {
      return NextResponse.json({ error: 'componentId is required' }, { status: 400 });
    }

    const component = await getComponentById(componentId, false);
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    const supabase = getQayAdmin() as any;
    const { data: existingLink, error: linkError } = await supabase
      .from('qay_site_components')
      .select('site_id, component_id, category')
      .eq('site_id', siteId)
      .eq('component_id', componentId)
      .maybeSingle();

    if (linkError) {
      return NextResponse.json({ error: linkError.message }, { status: 500 });
    }

    let link = existingLink;
    if (!link) {
      const repairedCategory = cleanString(body?.category, 80) || 'Sections';
      const { data: repairedLink, error: repairError } = await supabase
        .from('qay_site_components')
        .upsert(
          {
            site_id: siteId,
            component_id: componentId,
            source: 'user',
            category: repairedCategory,
          },
          { onConflict: 'site_id,component_id' }
        )
        .select('site_id, component_id, category')
        .single();

      if (repairError) {
        return NextResponse.json({ error: repairError.message }, { status: 500 });
      }

      link = repairedLink;
    }

    const category = cleanString(body?.category, 80) || link.category || 'Sections';
    const description = cleanString(body?.description, 500);
    const partType = normalizePartType(body?.partType);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('qay_public_component_submissions')
      .upsert(
        {
          owner_id: user.id,
          site_id: siteId,
          component_id: componentId,
          name: cleanString(body?.name, 120) || component.name,
          category,
          description,
          part_type: partType,
          layers: component.layers || [],
          variables: component.variables || [],
          thumbnail_url: component.thumbnail_url || null,
          status: 'pending_review',
          review_notes: null,
          updated_at: now,
        },
        { onConflict: 'owner_id,component_id' }
      )
      .select('id, status, name, category, part_type')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[QAY public component submission] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit component' },
      { status: 500 }
    );
  }
}
