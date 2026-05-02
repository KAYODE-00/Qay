import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQaySiteAccess } from '@/qay/lib/site-access';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, siteId, role = 'client' } = body;

    if (!email || !siteId) {
      return noCache({ error: 'Email and site ID are required' }, 400);
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

    const { data: usersData } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existingUser = usersData?.users?.find((user: any) => user.email?.toLowerCase() === normalizedEmail);

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
    const { data, error } = await client.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo: inviteUrl,
      data: {
        qay_site_id: siteId,
        qay_invite_token: invite.token,
        invited_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('[POST /ycode/api/auth/invite] Supabase invite error:', error);
      return noCache({ error: error.message }, 400);
    }

    return noCache({
      data: {
        invite: {
          id: invite.id,
          email: normalizedEmail,
          invited_at: new Date().toISOString(),
          role,
        },
        user: data.user,
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
