import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQaySiteAccess } from '@/qay/lib/site-access';

async function getAuthUserSummary(client: any, userId: string) {
  const { data, error } = await client.auth.admin.getUserById(userId);
  if (error || !data?.user) {
    return null;
  }

  const metadata = data.user.user_metadata || {};
  return {
    id: data.user.id,
    email: data.user.email || '',
    display_name: metadata.display_name || metadata.full_name || null,
    avatar_url: metadata.avatar_url || null,
    created_at: data.user.created_at,
    last_sign_in_at: data.user.last_sign_in_at || null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site');

    if (!siteId) {
      return noCache({ error: 'Site ID is required' }, 400);
    }

    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    const client = getQayAdmin() as any;

    const { data: site, error: siteError } = await client
      .from('qay_sites')
      .select('owner_id')
      .eq('id', siteId)
      .maybeSingle();

    if (siteError) {
      throw new Error(siteError.message);
    }

    const { data: members, error: membersError } = await client
      .from('qay_site_members')
      .select('id, user_id, role, accepted_at, invited_at')
      .eq('site_id', siteId)
      .order('invited_at', { ascending: false });

    if (membersError) {
      throw new Error(membersError.message);
    }

    const ownerSummary = site?.owner_id ? await getAuthUserSummary(client, site.owner_id) : null;
    const memberSummaries = await Promise.all(
      (members ?? []).map(async (member: any) => {
        const summary = await getAuthUserSummary(client, member.user_id);
        return summary
          ? {
              ...summary,
              member_id: member.id,
              role: member.role,
              accepted_at: member.accepted_at,
              is_owner: false,
            }
          : null;
      })
    );

    const activeUsers = [
      ownerSummary
        ? {
            ...ownerSummary,
            member_id: null,
            role: 'owner',
            accepted_at: null,
            is_owner: true,
          }
        : null,
      ...memberSummaries,
    ].filter(Boolean);

    const { data: pendingInvites, error: invitesError } = await client
      .from('qay_site_invites')
      .select('id, email, role, status, created_at, expires_at')
      .eq('site_id', siteId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (invitesError) {
      throw new Error(invitesError.message);
    }

    return noCache({
      data: {
        activeUsers,
        pendingInvites: (pendingInvites ?? []).map((invite: any) => ({
          id: invite.id,
          email: invite.email,
          role: invite.role,
          invited_at: invite.created_at,
          expires_at: invite.expires_at,
        })),
      },
    });
  } catch (error) {
    console.error('[GET /ycode/api/auth/users] Error:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch invites' },
      500
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site');
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!siteId || !id || !type) {
      return noCache({ error: 'Site ID, ID, and type are required' }, 400);
    }

    const access = await getQaySiteAccess(siteId);
    if (!access.allowed || access.role !== 'owner') {
      return noCache({ error: 'Only the site owner can manage invites' }, 403);
    }

    const client = getQayAdmin() as any;

    if (type === 'invite') {
      const { error } = await client
        .from('qay_site_invites')
        .update({ status: 'expired' })
        .eq('id', id)
        .eq('site_id', siteId);

      if (error) {
        throw new Error(error.message);
      }
    } else if (type === 'user') {
      const { error } = await client
        .from('qay_site_members')
        .delete()
        .eq('site_id', siteId)
        .eq('user_id', id);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      return noCache({ error: 'Invalid removal type' }, 400);
    }

    return noCache({ data: { success: true } });
  } catch (error) {
    console.error('[DELETE /ycode/api/auth/users] Error:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to update invite access' },
      500
    );
  }
}
