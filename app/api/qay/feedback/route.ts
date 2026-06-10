import { NextResponse } from 'next/server';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = cleanString(body?.message, 5000);

    if (message.length < 8) {
      return NextResponse.json({ error: 'Please write a little more feedback.' }, { status: 400 });
    }

    const admin = getQayAdmin() as any;
    const { error } = await admin
      .from('qay_feedback')
      .insert({
        name: cleanString(body?.name, 120) || null,
        email: cleanString(body?.email, 180) || null,
        category: cleanString(body?.category, 40) || 'general',
        message,
        source_path: cleanString(body?.sourcePath, 240) || null,
        user_agent: cleanString(request.headers.get('user-agent'), 500) || null,
      });

    if (error) {
      console.error('[QAY feedback] Insert failed:', error);
      return NextResponse.json({ error: 'Feedback storage is not ready. Please run the feedback migration.' }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[QAY feedback] Error:', error);
    return NextResponse.json({ error: 'Could not send feedback.' }, { status: 500 });
  }
}
