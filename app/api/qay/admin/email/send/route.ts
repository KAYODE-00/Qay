import { NextResponse } from 'next/server';
import { escapeHtml } from '@/lib/escape-html';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { sendQayEmail } from '@/qay/lib/email';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cleanString(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeEmail(value: unknown) {
  const email = cleanString(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function normalizeEmailList(value: unknown) {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map(normalizeEmail).filter(Boolean)));
  }
  if (typeof value === 'string') {
    return Array.from(new Set(value.split(/[\s,;]+/).map(normalizeEmail).filter(Boolean)));
  }
  return [];
}

async function listAllAuthUsers(admin: ReturnType<typeof getQayAdmin>) {
  const users: any[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const batch = data?.users || [];
    users.push(...batch);
    if (batch.length < 100) break;
  }
  return users;
}

function emailHtml(subject: string, body: string) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 16px;color:#374151;line-height:1.7">${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px;color:#111827;background:#ffffff">
      <div style="border:1px solid #e5e7eb;border-radius:18px;padding:28px;background:#ffffff">
        <p style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase">QAY update</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;letter-spacing:-.03em">${escapeHtml(subject)}</h1>
        ${paragraphs}
      </div>
      <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;line-height:1.6">You received this because you have a QAY account.</p>
    </div>
  `;
}

async function logEmail(admin: any, input: Record<string, unknown>) {
  const { error } = await admin.from('qay_email_logs').insert(input);
  if (error) {
    console.warn('[QAY email] Failed to write email log:', error.message || error);
  }
}

export async function POST(request: Request) {
  const user = await getQayAuthUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (!(await hasQayAdminAccess(user))) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const mode = cleanString(body.mode, 20) || 'all';
  const subject = cleanString(body.subject, 180);
  const message = cleanString(body.message, 12000);
  const replyTo = normalizeEmail(body.replyTo) || null;

  if (!subject) return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
  if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

  const admin = getQayAdmin();
  const users = await listAllAuthUsers(admin);
  const userById = new Map(users.map((item) => [item.id, item]));

  let recipients: string[] = [];
  if (mode === 'selected') {
    const ids: string[] = Array.isArray(body.userIds) ? body.userIds.map((id: unknown) => cleanString(id, 80)).filter(Boolean) : [];
    recipients = ids.map((id) => normalizeEmail(userById.get(id)?.email)).filter(Boolean);
  } else if (mode === 'custom') {
    recipients = normalizeEmailList(body.emails);
  } else {
    recipients = users.map((item) => normalizeEmail(item.email)).filter(Boolean);
  }

  recipients = Array.from(new Set(recipients));
  const maxRecipients = Number(process.env.QAY_EMAIL_MAX_RECIPIENTS || 500);
  if (!recipients.length) return NextResponse.json({ error: 'No valid recipients found.' }, { status: 400 });
  if (recipients.length > maxRecipients) {
    return NextResponse.json({ error: `Too many recipients. Current limit is ${maxRecipients}.` }, { status: 400 });
  }

  const html = emailHtml(subject, message);
  const sent: string[] = [];
  const failed: Array<{ email: string; error: string }> = [];
  let provider = 'none';

  for (const recipient of recipients) {
    const result = await sendQayEmail({
      to: recipient,
      subject,
      text: message,
      html,
      replyTo,
    });
    provider = result.provider;
    if (result.ok) {
      sent.push(recipient);
    } else {
      failed.push({ email: recipient, error: result.error || 'Send failed' });
    }
  }

  await logEmail(admin, {
    sent_by: user.id,
    subject,
    body_text: message,
    body_html: html,
    recipient_count: sent.length,
    recipients: sent,
    provider,
    status: failed.length ? (sent.length ? 'partial' : 'failed') : 'sent',
    error: failed.length ? JSON.stringify(failed.slice(0, 10)) : null,
  });

  return NextResponse.json({
    data: {
      sent: sent.length,
      failed: failed.length,
      provider,
      failures: failed.slice(0, 10),
    },
  });
}
