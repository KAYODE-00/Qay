import { NextResponse } from 'next/server';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const MAX_DATA_URL_LENGTH = Math.ceil(MAX_ATTACHMENT_BYTES * 1.5) + 1000;

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanAttachment(value: unknown) {
  if (!value || typeof value !== 'object') return null;

  const attachment = value as Record<string, unknown>;
  const name = cleanString(attachment.name, 180) || 'attachment';
  const type = cleanString(attachment.type, 120);
  const dataUrl = cleanString(attachment.dataUrl, MAX_DATA_URL_LENGTH);
  const size = typeof attachment.size === 'number' ? attachment.size : 0;

  if (!type || !/^(image|video)\//.test(type)) return null;
  if (!dataUrl || !/^data:(image|video)\//.test(dataUrl)) return null;
  if (size <= 0 || size > MAX_ATTACHMENT_BYTES) return null;

  return { name, type, size, dataUrl };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = cleanString(body?.message, 5000);
    const rawAttachments = Array.isArray(body?.attachments) ? body.attachments : [];
    const attachments = rawAttachments
      .slice(0, MAX_ATTACHMENTS)
      .map(cleanAttachment)
      .filter(Boolean);

    if (message.length < 8) {
      return NextResponse.json({ error: 'Please write a little more feedback.' }, { status: 400 });
    }

    if (rawAttachments.length > MAX_ATTACHMENTS) {
      return NextResponse.json({ error: `Please upload no more than ${MAX_ATTACHMENTS} files.` }, { status: 400 });
    }

    if (rawAttachments.length !== attachments.length) {
      return NextResponse.json({ error: 'Please upload only images or videos under 8MB each.' }, { status: 400 });
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
        attachments,
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
