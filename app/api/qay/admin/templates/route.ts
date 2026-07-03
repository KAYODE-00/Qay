import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { ingestTemplate, validateTemplateHtml } from '@/qay/lib/ai/template-ingestor';

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function requireAdmin() {
  const user = await getQayAuthUser();
  if (!user || !(await hasQayAdminAccess(user))) return null;
  return user;
}

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });

  const url = new URL(request.url);
  const industry = clean(url.searchParams.get('industry'), 50);
  const colorMood = clean(url.searchParams.get('colorMood'), 50);
  const approved = url.searchParams.get('approved');

  const admin = getQayAdmin() as any;
  let q = admin
    .from('qay_ai_templates')
    .select('id,site_type,theme,label,industry,color_mood,tags,features,pages_meta,is_approved,is_active,rank,source,preview_image_url,created_at')
    .order('rank', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  if (industry) q = q.eq('industry', industry);
  if (colorMood) q = q.eq('color_mood', colorMood);
  if (approved === 'true') q = q.eq('is_approved', true);
  if (approved === 'false') q = q.eq('is_approved', false);

  const { data, error } = await q;
  if (error) {
    console.error('[QAY admin templates] GET failed:', error);
    return NextResponse.json({ error: 'Could not list templates.' }, { status: 503 });
  }

  return NextResponse.json({ data: data || [] });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const html = clean(body.html, 150000);
  const label = clean(body.label, 120);
  const siteType = clean(body.site_type || body.siteType, 40);

  // Validate HTML
  const validation = validateTemplateHtml(html);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }

  if (!label) {
    return NextResponse.json({ error: 'A label/name is required.' }, { status: 400 });
  }

  // Run AI ingestor to extract metadata
  let meta;
  try {
    meta = await ingestTemplate(html);
  } catch (err) {
    console.error('[QAY admin templates] Ingestor failed:', err);
    return NextResponse.json({ error: 'Could not analyze template HTML.' }, { status: 500 });
  }

  const admin = getQayAdmin() as any;
  const { data, error } = await admin
    .from('qay_ai_templates')
    .insert({
      site_type: siteType || meta.industry,
      theme: meta.colorMood,
      label,
      html,
      pages: meta.pagesMeta.map((p) => ({ name: p.name, slug: p.slug })),
      industry: meta.industry,
      color_mood: meta.colorMood,
      tags: meta.tags,
      features: meta.features,
      zones: meta.zones,
      pages_meta: meta.pagesMeta,
      cms_hints: meta.cmsHints || null,
      source: 'admin',
      submitted_by: user.id,
      is_approved: true,
      is_active: true,
      rank: Number(body.rank) || 60,
      preview_image_url: clean(body.preview_image_url, 500) || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[QAY admin templates] INSERT failed:', error);
    return NextResponse.json({ error: 'Could not save template.' }, { status: 503 });
  }

  return NextResponse.json({ success: true, id: data?.id, meta });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const id = clean(body.id, 80);
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (body.label !== undefined) updates.label = clean(body.label, 120);
  if (body.rank !== undefined) updates.rank = Number(body.rank);
  if (body.is_approved !== undefined) updates.is_approved = Boolean(body.is_approved);
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
  if (body.tags !== undefined) updates.tags = Array.isArray(body.tags) ? body.tags.map((t: unknown) => clean(t, 80)) : [];
  if (body.industry !== undefined) updates.industry = clean(body.industry, 50);
  if (body.color_mood !== undefined) updates.color_mood = clean(body.color_mood, 50);

  const admin = getQayAdmin() as any;
  const { error } = await admin.from('qay_ai_templates').update(updates).eq('id', id);
  if (error) {
    console.error('[QAY admin templates] PATCH failed:', error);
    return NextResponse.json({ error: 'Could not update template.' }, { status: 503 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });

  const url = new URL(request.url);
  const id = clean(url.searchParams.get('id'), 80);
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const admin = getQayAdmin() as any;
  const { error } = await admin.from('qay_ai_templates').update({ is_active: false }).eq('id', id);
  if (error) return NextResponse.json({ error: 'Could not deactivate template.' }, { status: 503 });

  return NextResponse.json({ success: true });
}
