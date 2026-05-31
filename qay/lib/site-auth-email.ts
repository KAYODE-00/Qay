import 'server-only';

import nodemailer from 'nodemailer';

type PasswordResetEmailInput = {
  to: string;
  resetUrl: string;
  siteName?: string | null;
};

function getSmtpSettings() {
  const host = process.env.QAY_SITE_AUTH_SMTP_HOST || process.env.QAY_INVITE_SMTP_HOST || process.env.SMTP_HOST;
  const port = process.env.QAY_SITE_AUTH_SMTP_PORT || process.env.QAY_INVITE_SMTP_PORT || process.env.SMTP_PORT || '587';
  const user = process.env.QAY_SITE_AUTH_SMTP_USER || process.env.QAY_INVITE_SMTP_USER || process.env.SMTP_USER;
  const password = process.env.QAY_SITE_AUTH_SMTP_PASSWORD || process.env.QAY_INVITE_SMTP_PASSWORD || process.env.SMTP_PASSWORD;
  const fromEmail = process.env.QAY_SITE_AUTH_FROM_EMAIL || process.env.QAY_INVITE_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || user;
  const fromName = process.env.QAY_SITE_AUTH_FROM_NAME || process.env.QAY_INVITE_FROM_NAME || process.env.SMTP_FROM_NAME || 'QAY';

  if (!host || !user || !password || !fromEmail) {
    return null;
  }

  return {
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass: password },
    from: `${fromName} <${fromEmail}>`,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendQaySitePasswordResetEmail(input: PasswordResetEmailInput) {
  const settings = getSmtpSettings();
  if (!settings) {
    return false;
  }

  const siteName = input.siteName?.trim() || 'this site';
  const safeSiteName = escapeHtml(siteName);
  const safeResetUrl = escapeHtml(input.resetUrl);

  try {
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: settings.auth,
    });

    await transporter.sendMail({
      from: settings.from,
      to: input.to,
      subject: `Reset your password for ${siteName}`,
      text: `Use this link to reset your password for ${siteName}: ${input.resetUrl}\n\nThis link expires in 1 hour.`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111827">
          <h1 style="font-size:20px;margin:0 0 12px">Reset your password</h1>
          <p style="margin:0 0 16px">Use the secure link below to reset your password for ${safeSiteName}. This link expires in 1 hour.</p>
          <p style="margin:0 0 20px">
            <a href="${safeResetUrl}" style="display:inline-block;background:#111827;color:#ffffff;padding:12px 16px;border-radius:10px;text-decoration:none">Reset password</a>
          </p>
          <p style="margin:0;color:#6b7280;font-size:13px">If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[QAY site auth] Failed to send password reset email:', error);
    return false;
  }
}
