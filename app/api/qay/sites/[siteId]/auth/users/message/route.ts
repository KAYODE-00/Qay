import { NextResponse } from 'next/server';
import { escapeHtml } from '@/lib/escape-html';
import { sendQayEmail } from '@/qay/lib/email';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

type SiteUser = {
  id: string;
  email: string;
  full_name: string | null;
};

function cleanString(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeEmail(value: unknown) {
  const email = cleanString(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function siteMessageHtml(input: {
  subject: string;
  message: string;
  siteName: string;
  senderEmail: string;
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_QAY_SITE_URL || 'https://qay-theta.vercel.app')
    .trim()
    .replace(/\/$/, '');
  const paragraphs = input.message
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 16px;line-height:1.7">${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;padding:28px;color:#111827;background:#ffffff">
      <p style="margin:0 0 12px;color:#6b7280;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Message from ${escapeHtml(input.senderEmail)} via QAY</p>
      <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25">${escapeHtml(input.subject)}</h1>
      <div style="color:#1f2937">${paragraphs || `<p style="margin:0 0 16px;line-height:1.7">${escapeHtml(input.subject)}</p>`}</div>
      <div style="margin:24px 0 0;padding:16px;border-radius:12px;background:#f9fafb;color:#4b5563;font-size:13px;line-height:1.6">
        This message was sent by ${escapeHtml(input.senderEmail)} to users of ${escapeHtml(input.siteName)}. Reply to this email to contact them.
      </div>
      <p style="margin:24px 0 0;line-height:1.7">
        <a href="${escapeHtml(siteUrl)}" style="color:#111827;text-decoration:underline">${escapeHtml(siteUrl)}</a>
      </p>
    </div>
  `;
}

export async function POST(request: Request, context: RouteContext) {
  const { siteId } = await context.params;
  const access = await getQaySiteAccess(siteId);

  if (!access.allowed || !access.user) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const mode = cleanString(body.mode, 20) || 'selected';
  const subject = cleanString(body.subject, 180);
  const message = cleanString(body.message, 12000);
  const selectedIds = Array.isArray(body.userIds)
    ? Array.from(new Set(body.userIds.map((id: unknown) => cleanString(id, 80)).filter(Boolean)))
    : [];

  if (!subject) return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
  if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  if (mode === 'selected' && !selectedIds.length) {
    return NextResponse.json({ error: 'Select at least one site user, or choose all users.' }, { status: 400 });
  }

  const admin = getQayAdmin() as any;
  const { data: site, error: siteError } = await admin
    .from('qay_sites')
    .select('name')
    .eq('id', siteId)
    .maybeSingle();

  if (siteError) return NextResponse.json({ error: siteError.message }, { status: 500 });

  let query = admin
    .from('qay_site_auth_users')
    .select('id, email, full_name')
    .eq('site_id', siteId);

  if (mode === 'selected') {
    query = query.in('id', selectedIds);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = ((data || []) as SiteUser[])
    .map((user) => ({ ...user, email: normalizeEmail(user.email) }))
    .filter((user) => user.email);
  const recipients = Array.from(new Set(users.map((user) => user.email)));
  const maxRecipients = Number(process.env.QAY_EMAIL_MAX_RECIPIENTS || 500);

  if (!recipients.length) return NextResponse.json({ error: 'No valid site users found.' }, { status: 400 });
  if (recipients.length > maxRecipients) {
    return NextResponse.json({ error: `Too many recipients. Current limit is ${maxRecipients}.` }, { status: 400 });
  }

  const senderEmail = access.user.email || 'site owner';
  const siteName = site?.name || 'this site';
  const html = siteMessageHtml({ subject, message, siteName, senderEmail });
  const sent: string[] = [];
  const failed: Array<{ email: string; error: string }> = [];
  let provider = 'none';

  for (const recipient of recipients) {
    const result = await sendQayEmail({
      to: recipient,
      subject,
      text: `${message}\n\nSent by ${senderEmail} via QAY for ${siteName}.`,
      html,
      replyTo: access.user.email || undefined,
    });
    provider = result.provider;

    if (result.ok) {
      sent.push(recipient);
    } else {
      failed.push({ email: recipient, error: result.error || 'Send failed' });
    }
  }

  return NextResponse.json({
    data: {
      sent: sent.length,
      failed: failed.length,
      provider,
      failures: failed.slice(0, 10),
    },
  });
}
