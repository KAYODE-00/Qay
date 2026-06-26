import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { QAY_BACKGROUND_CATEGORIES, QAY_BACKGROUND_PRESETS } from '@/qay/lib/background-presets';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cleanCategory(value: string | null) {
  const category = (value || '').trim().toLowerCase();
  return QAY_BACKGROUND_CATEGORIES.includes(category as any) ? category : '';
}

export async function GET(request: Request) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const url = new URL(request.url);
    const category = cleanCategory(url.searchParams.get('category'));
    const supabase = getQayAdmin() as any;

    let rows = QAY_BACKGROUND_PRESETS;
    const { data, error } = await supabase
      .from('qay_backgrounds')
      .select('id, category, name, css, preview_css, tags, is_dark, rank')
      .order('rank', { ascending: false })
      .limit(300);

    if (!error && Array.isArray(data) && data.length > 0) {
      rows = data;
    } else if (error) {
      console.warn('[QAY backgrounds] Falling back to built-in presets:', error.message || error);
    }

    return NextResponse.json({
      data: {
        categories: QAY_BACKGROUND_CATEGORIES,
        backgrounds: rows.filter((item) => !category || item.category === category),
      },
    });
  } catch (error) {
    console.error('[QAY backgrounds GET] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load backgrounds' },
      { status: 500 }
    );
  }
}
