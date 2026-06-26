import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const CATEGORIES = new Set([
  'navigation',
  'hero',
  'cards',
  'accordion',
  'carousel',
  'buttons',
  'forms',
  'testimonials',
  'pricing',
  'gallery',
  'icons',
  'stats',
  'timeline',
  'team',
  'footer',
  'cta',
  'parallax',
  'backgrounds',
  'misc',
]);

function cleanString(value: unknown, max = 120) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function cleanCategory(value: unknown) {
  const category = cleanString(value, 48).toLowerCase();
  return CATEGORIES.has(category) ? category : 'misc';
}

function cleanTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanString(item, 32).toLowerCase()).filter(Boolean).slice(0, 12);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => cleanString(item, 32).toLowerCase()).filter(Boolean).slice(0, 12);
  }
  return [];
}

function validateHtml(html: string) {
  if (html.length < 20) return 'HTML is too short.';
  if (html.length > 50000) return 'HTML is too large.';
  if (/<script\b/i.test(html)) return 'Script tags are not allowed.';
  if (/\son[a-z]+\s*=/i.test(html)) return 'Inline event handlers are not allowed.';
  if (!/\bclass\s*=/i.test(html)) return 'Add Tailwind classes before submitting.';
  return null;
}

async function getOwnedComponent(id: string, userId: string) {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_components')
    .select('id, submitted_by, is_builtin')
    .eq('id', id)
    .eq('submitted_by', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data || data.is_builtin) return null;
  return data;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await context.params;
    const component = await getOwnedComponent(id, user.id);
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const update: Record<string, unknown> = {};

    if ('name' in (body || {})) update.name = cleanString(body.name, 120) || 'Untitled component';
    if ('description' in (body || {})) update.description = cleanString(body.description, 500);
    if ('category' in (body || {})) update.category = cleanCategory(body.category);
    if ('tags' in (body || {})) update.tags = cleanTags(body.tags);
    if ('isPublic' in (body || {})) update.is_public = body.isPublic !== false;

    if (typeof body?.html === 'string') {
      const html = body.html.trim();
      const validationError = validateHtml(html);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
      update.html = html;
      update.is_approved = false;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const supabase = getQayAdmin() as any;
    const { data, error } = await supabase
      .from('qay_components')
      .update(update)
      .eq('id', id)
      .eq('submitted_by', user.id)
      .select('id, category, name, description, html, tags, is_public, is_approved, uses_count, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[QAY component PATCH] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update component' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await context.params;
    const component = await getOwnedComponent(id, user.id);
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    const supabase = getQayAdmin() as any;
    const { error } = await supabase
      .from('qay_components')
      .delete()
      .eq('id', id)
      .eq('submitted_by', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { id, deleted: true } });
  } catch (error) {
    console.error('[QAY component DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete component' },
      { status: 500 }
    );
  }
}
