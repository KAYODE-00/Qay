import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/qay/components/[id]/use
 * Increments the uses_count for a QAY library component.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Component ID is required' }, { status: 400 });
    }

    const supabase = getQayAdmin() as any;

    if (id.startsWith('builtin-qay-')) {
      return NextResponse.json({ data: { uses_count: 0, html: null } });
    }

    const { data: component, error: selectError } = await supabase
      .from('qay_components')
      .select('id, submitted_by, html, uses_count, is_public, is_approved')
      .eq('id', id)
      .single();

    if (selectError || !component) {
      return NextResponse.json({ error: selectError?.message || 'Component not found' }, { status: 404 });
    }

    const canUse = component.submitted_by === user.id || (component.is_public && component.is_approved);
    if (!canUse) {
      return NextResponse.json({ error: 'Component is not available' }, { status: 403 });
    }

    const usesCount = Number(component.uses_count || 0) + 1;
    const { error: updateError } = await supabase
      .from('qay_components')
      .update({ uses_count: usesCount })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        uses_count: usesCount,
        html: component.html,
      },
    });
  } catch (error) {
    console.error('[QAY component use] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track usage' },
      { status: 500 }
    );
  }
}
