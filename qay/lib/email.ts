import 'server-only';

import nodemailer from 'nodemailer';

export type QayEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string | null;
};

export type QayEmailResult = {
  ok: boolean;
  provider: 'resend' | 'smtp' | 'none';
  messageId?: string;
  error?: string;
};

function clean(value: string | undefined | null) {
  return (value || '').trim().replace(/^["']|["']$/g, '');
}

function fromAddress() {
  const email =
    clean(process.env.QAY_EMAIL_FROM_EMAIL) ||
    clean(process.env.QAY_SITE_AUTH_FROM_EMAIL) ||
    clean(process.env.QAY_INVITE_FROM_EMAIL) ||
    clean(process.env.SMTP_FROM_EMAIL);
  const name =
    clean(process.env.QAY_EMAIL_FROM_NAME) ||
    clean(process.env.QAY_SITE_AUTH_FROM_NAME) ||
    clean(process.env.QAY_INVITE_FROM_NAME) ||
    clean(process.env.SMTP_FROM_NAME) ||
    'QAY';

  return email ? { email, name, formatted: `${name} <${email}>` } : null;
}

function getSmtpSettings() {
  const rawHost =
    clean(process.env.QAY_EMAIL_SMTP_HOST) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_HOST) ||
    clean(process.env.QAY_INVITE_SMTP_HOST) ||
    clean(process.env.SMTP_HOST);
  const port =
    clean(process.env.QAY_EMAIL_SMTP_PORT) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_PORT) ||
    clean(process.env.QAY_INVITE_SMTP_PORT) ||
    clean(process.env.SMTP_PORT) ||
    '587';
  const user =
    clean(process.env.QAY_EMAIL_SMTP_USER) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_USER) ||
    clean(process.env.QAY_INVITE_SMTP_USER) ||
    clean(process.env.SMTP_USER);
  const password =
    clean(process.env.QAY_EMAIL_SMTP_PASSWORD) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_PASSWORD) ||
    clean(process.env.QAY_INVITE_SMTP_PASSWORD) ||
    clean(process.env.SMTP_PASSWORD);
  const from = fromAddress() || (user ? { email: user, name: 'QAY', formatted: `QAY <${user}>` } : null);
  const host = rawHost === 'smtp' && /@gmail\.com$/i.test(user || from?.email || '')
    ? 'smtp.gmail.com'
    : rawHost;

  if (!host || !user || !password || !from) return null;

  return {
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass: password },
    from: from.formatted,
    user,
  };
}

function isGmailSender() {
  const from = fromAddress();
  const smtpUser =
    clean(process.env.QAY_EMAIL_SMTP_USER) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_USER) ||
    clean(process.env.QAY_INVITE_SMTP_USER) ||
    clean(process.env.SMTP_USER);
  return /@gmail\.com$/i.test(from?.email || '') || /@gmail\.com$/i.test(smtpUser);
}

function normalizeRecipients(to: string | string[]) {
  const list = Array.isArray(to) ? to : [to];
  return Array.from(
    new Set(
      list
        .map((item) => clean(item).toLowerCase())
        .filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item))
    )
  );
}

function resendSetupError() {
  const missing: string[] = [];
  if (!(clean(process.env.RESEND_API_KEY) || clean(process.env.QAY_RESEND_API_KEY))) {
    missing.push('RESEND_API_KEY');
  }
  if (!fromAddress()) {
    missing.push('QAY_EMAIL_FROM_EMAIL');
  }
  return missing.length ? `Resend is not configured. Missing: ${missing.join(', ')}.` : null;
}

function smtpSetupError() {
  const missing: string[] = [];
  const hasHost = clean(process.env.QAY_EMAIL_SMTP_HOST) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_HOST) ||
    clean(process.env.QAY_INVITE_SMTP_HOST) ||
    clean(process.env.SMTP_HOST);
  const hasUser = clean(process.env.QAY_EMAIL_SMTP_USER) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_USER) ||
    clean(process.env.QAY_INVITE_SMTP_USER) ||
    clean(process.env.SMTP_USER);
  const hasPassword = clean(process.env.QAY_EMAIL_SMTP_PASSWORD) ||
    clean(process.env.QAY_SITE_AUTH_SMTP_PASSWORD) ||
    clean(process.env.QAY_INVITE_SMTP_PASSWORD) ||
    clean(process.env.SMTP_PASSWORD);

  if (!hasHost) missing.push('QAY_EMAIL_SMTP_HOST');
  if (!hasUser) missing.push('QAY_EMAIL_SMTP_USER');
  if (!hasPassword) missing.push('QAY_EMAIL_SMTP_PASSWORD');
  if (!fromAddress()) missing.push('QAY_EMAIL_FROM_EMAIL');

  return missing.length ? `SMTP is not configured. Missing: ${missing.join(', ')}.` : null;
}

async function sendWithResend(input: QayEmailInput, recipients: string[]): Promise<QayEmailResult> {
  const apiKey = clean(process.env.RESEND_API_KEY) || clean(process.env.QAY_RESEND_API_KEY);
  const from = fromAddress();

  if (!apiKey || !from) {
    return { ok: false, provider: 'none', error: resendSetupError() || 'Resend is not configured.' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from.formatted,
        to: recipients,
        subject: input.subject,
        text: input.text,
        html: input.html,
        reply_to: input.replyTo || undefined,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        ok: false,
        provider: 'resend',
        error: data?.message || data?.error || `Resend failed with ${response.status}`,
      };
    }

    return { ok: true, provider: 'resend', messageId: data?.id };
  } catch (error) {
    return {
      ok: false,
      provider: 'resend',
      error: error instanceof Error ? error.message : 'Resend request failed.',
    };
  }
}

async function sendWithSmtp(input: QayEmailInput, recipients: string[]): Promise<QayEmailResult> {
  const settings = getSmtpSettings();
  if (!settings) {
    return { ok: false, provider: 'none', error: smtpSetupError() || 'SMTP is not configured.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: settings.auth,
    });
    const info = await transporter.sendMail({
      from: settings.from,
      to: recipients,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo || undefined,
    });

    return { ok: true, provider: 'smtp', messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SMTP send failed.';
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code || '') : '';
    const isGmail = /@gmail\.com$/i.test(settings.auth.user);
    let friendly = message;

    if (/EBUSY|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT/i.test(`${code} ${message}`)) {
      friendly = `SMTP connection failed for ${settings.host}. If you are using Gmail, set QAY_EMAIL_SMTP_HOST=smtp.gmail.com and QAY_EMAIL_SMTP_PORT=587. ${message}`;
    } else if (isGmail && /auth|credentials|login|username|password|535|534|invalid/i.test(message)) {
      friendly = 'Gmail SMTP rejected the login. Use the full Gmail address as QAY_EMAIL_SMTP_USER and a Google App Password as QAY_EMAIL_SMTP_PASSWORD, not your normal Gmail password.';
    }

    return {
      ok: false,
      provider: 'smtp',
      error: friendly,
    };
  }
}

export function isQayEmailConfigured() {
  const provider = clean(process.env.QAY_EMAIL_PROVIDER).toLowerCase();
  const hasResend = !!((clean(process.env.RESEND_API_KEY) || clean(process.env.QAY_RESEND_API_KEY)) && fromAddress());
  const hasSmtp = !!getSmtpSettings();
  return provider === 'smtp' || isGmailSender() ? hasSmtp : hasResend || hasSmtp;
}

export async function sendQayEmail(input: QayEmailInput): Promise<QayEmailResult> {
  const recipients = normalizeRecipients(input.to);
  if (!recipients.length) {
    return { ok: false, provider: 'none', error: 'No valid recipients.' };
  }

  const provider = clean(process.env.QAY_EMAIL_PROVIDER).toLowerCase();
  if (provider === 'smtp' || isGmailSender()) {
    return sendWithSmtp(input, recipients);
  }

  const resendResult = await sendWithResend(input, recipients);
  if (resendResult.ok || provider === 'resend') return resendResult;

  const smtpResult = await sendWithSmtp(input, recipients);
  if (smtpResult.ok) return smtpResult;

  return {
    ok: false,
    provider: 'none',
    error: `${resendResult.error || 'Resend failed.'} ${smtpResult.error || 'SMTP failed.'}`,
  };
}
