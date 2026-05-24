import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { sendQayInviteEmail } from '@/qay/lib/invite-email';

async function findAuthUserByEmail(client: any, email: string) {
  let page = 1;
  const perPage = 1000;

  while (page <= 20) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(error.message);
    }

    const users = data?.users || [];
    const match = users.find((user: any) => user.email?.toLowerCase() === email);
    if (match || users.length < perPage) {
      return match || null;
    }

    page += 1;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, siteId, role = 'client' } = body;

    if (!email || !siteId) {
      return noCache({ error: 'Email and site are required' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return noCache({ error: 'Invalid email format' }, 400);
    }

    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || access.role !== 'owner' || !access.user) {
      return noCache({ error: 'Only the site owner can send invites' }, 403);
    }

    const client = getQayAdmin() as any;
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === access.user.email?.toLowerCase()) {
      return noCache({ error: 'This user already has access to the site' }, 400);
    }

    const existingUser = await findAuthUserByEmail(client, normalizedEmail);

    if (existingUser) {
      const { data: existingMember, error: memberError } = await client
        .from('qay_site_members')
        .select('id')
        .eq('site_id', siteId)
        .eq('user_id', existingUser.id)
        .maybeSingle();

      if (memberError) {
        throw new Error(memberError.message);
      }

      if (existingMember) {
        return noCache({ error: 'This user already has access to the site' }, 400);
      }
    }

    const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: site, error: siteError } = await client
      .from('qay_sites')
      .select('id, name, slug')
      .eq('id', siteId)
      .maybeSingle();

    if (siteError) {
      throw new Error(siteError.message);
    }

    const { data: invite, error: inviteError } = await client
      .from('qay_site_invites')
      .upsert(
        {
          site_id: siteId,
          invited_by: access.user.id,
          email: normalizedEmail,
          role,
          token,
          status: 'pending',
          expires_at: expiresAt,
        },
        { onConflict: 'site_id,email' }
      )
      .select('id, token')
      .single();

    if (inviteError) {
      throw new Error(inviteError.message);
    }

    const inviteUrl = `${request.nextUrl.origin}/invite/${invite.token}`;
    let mailSent = await sendQayInviteEmail({
      to: normalizedEmail,
      inviteUrl,
      siteName: site?.name || 'QAY site',
      inviterEmail: access.user.email,
    });

    if (existingUser) {
      await client
        .from('qay_notifications')
        .insert({
          user_id: existingUser.id,
          site_id: siteId,
          type: 'invite_received',
          title: 'Site invitation',
          body: `${access.user.email || 'Someone'} invited you to ${site?.name || 'a QAY site'}.`,
        });
    } else if (!mailSent) {
      const { error } = await client.auth.admin.inviteUserByEmail(normalizedEmail, {
        redirectTo: inviteUrl,
        data: {
          qay_site_id: siteId,
          qay_invite_token: invite.token,
          invited_at: new Date().toISOString(),
        },
      });

      if (error) {
        const message = String(error.message || '');
        const alreadyRegistered = /already|registered|exists/i.test(message);
        if (!alreadyRegistered) {
          console.error('[POST /ycode/api/auth/invite] Supabase invite error:', error);
          return noCache({ error: message }, 400);
        }
      } else {
        mailSent = true;
      }
    }

    return noCache({
      data: {
        invite: {
          id: invite.id,
          email: normalizedEmail,
          invited_at: new Date().toISOString(),
          role,
        },
        inviteUrl,
        mailSent,
        existingAccount: Boolean(existingUser),
        message: `Invitation sent to ${normalizedEmail}`,
      },
    });
  } catch (error) {
    console.error('[POST /ycode/api/auth/invite] Error:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to send invitation' },
      500
    );
  }
}
