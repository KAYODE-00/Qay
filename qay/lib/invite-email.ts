import { escapeHtml } from '@/lib/escape-html';
import { sendQayEmail } from './email';

type InviteEmailInput = {
  to: string;
  inviteUrl: string;
  siteName: string;
  inviterEmail?: string | null;
};

export async function sendQayInviteEmail(input: InviteEmailInput): Promise<boolean> {
  try {
    const siteName = escapeHtml(input.siteName);
    const inviter = input.inviterEmail ? escapeHtml(input.inviterEmail) : 'A QAY user';
    const inviteUrl = escapeHtml(input.inviteUrl);

    const result = await sendQayEmail({
      to: input.to,
      subject: `You're invited to ${input.siteName}`,
      text: `${input.inviterEmail || 'A QAY user'} invited you to work on ${input.siteName}.\n\nAccept invite: ${input.inviteUrl}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#111827">
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2">You're invited to ${siteName}</h1>
          <p style="margin:0 0 24px;color:#4b5563;line-height:1.6">${inviter} invited you to work on this site in QAY.</p>
          <a href="${inviteUrl}" style="display:inline-block;border-radius:8px;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;font-weight:600">Accept invite</a>
          <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.5">If the button does not work, open this link:<br>${inviteUrl}</p>
        </div>
      `,
    });

    if (!result.ok) {
      console.error('[QAY invite email] Failed to send invite email:', result.error);
    }

    return result.ok;
  } catch (error) {
    console.error('[QAY invite email] Failed to send invite email:', error);
    return false;
  }
}
