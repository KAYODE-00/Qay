import 'server-only';

import { sendQayEmail } from './email';

type PasswordResetEmailInput = {
  to: string;
  resetUrl: string;
  siteName?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendQaySitePasswordResetEmail(input: PasswordResetEmailInput) {
  const siteName = input.siteName?.trim() || 'this site';
  const safeSiteName = escapeHtml(siteName);
  const safeResetUrl = escapeHtml(input.resetUrl);

  try {
    const result = await sendQayEmail({
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

    if (!result.ok) {
      console.error('[QAY site auth] Failed to send password reset email:', result.error);
    }

    return result.ok;
  } catch (error) {
    console.error('[QAY site auth] Failed to send password reset email:', error);
    return false;
  }
}
