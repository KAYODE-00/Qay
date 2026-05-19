import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { noCache } from '@/lib/api-response';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

function getSupabaseProjectUrl(): string {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  const connectionUrl = process.env.SUPABASE_CONNECTION_URL;
  const projectRef = connectionUrl?.match(/postgres\.([^:]+):/)?.[1];
  if (!projectRef) {
    throw new Error('Supabase URL is not configured');
  }

  return `https://${projectRef}.supabase.co`;
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return noCache({ error: 'Invite token is required' }, 400);
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      getSupabaseProjectUrl(),
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return noCache({ error: 'Please sign in to accept this invite' }, 401);
    }

    const admin = getQayAdmin() as any;
    const { data: invite, error: inviteError } = await admin
      .from('qay_site_invites')
      .select('id, site_id, email, role, status, expires_at')
      .eq('token', token)
      .maybeSingle();

    if (inviteError) {
      throw new Error(inviteError.message);
    }

    if (!invite || invite.status !== 'pending') {
      return noCache({ error: 'This invite is invalid or has already been used' }, 404);
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      await admin
        .from('qay_site_invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);

      return noCache({ error: 'This invite has expired' }, 410);
    }

    if (invite.email.toLowerCase() !== (user.email || '').toLowerCase()) {
      return noCache({ error: 'This invite was sent to a different email address' }, 403);
    }

    const { error: memberError } = await admin
      .from('qay_site_members')
      .upsert(
        {
          site_id: invite.site_id,
          user_id: user.id,
          role: invite.role,
          accepted_at: new Date().toISOString(),
        },
        { onConflict: 'site_id,user_id' }
      );

    if (memberError) {
      throw new Error(memberError.message);
    }

    const { data: existingProfile, error: profileLookupError } = await admin
      .from('qay_user_profiles')
      .select('id, account_type')
      .eq('id', user.id)
      .maybeSingle();

    if (profileLookupError) {
      throw new Error(profileLookupError.message);
    }

    const accountMode = existingProfile?.account_type === 'client' ? 'client' : 'developer';

    if (!existingProfile) {
      const { error: profileInsertError } = await admin
        .from('qay_user_profiles')
        .insert({
          id: user.id,
          account_type: 'client',
          full_name: user.user_metadata?.full_name || user.user_metadata?.display_name || null,
        });

      if (profileInsertError) {
        throw new Error(profileInsertError.message);
      }
    }

    const { error: updateInviteError } = await admin
      .from('qay_site_invites')
      .update({
        status: 'accepted',
      })
      .eq('id', invite.id);

    if (updateInviteError) {
      throw new Error(updateInviteError.message);
    }

    return noCache({
      data: {
        siteId: invite.site_id,
        accountMode: existingProfile ? accountMode : 'client',
        redirectUrl: existingProfile?.account_type === 'client'
          ? `/client/${invite.site_id}`
          : existingProfile
            ? `/dashboard/sites/${invite.site_id}/editor`
            : `/client/${invite.site_id}`,
      },
    });
  } catch (error) {
    console.error('[POST /api/qay/invites/accept] Error:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to accept invite' },
      500
    );
  }
}
