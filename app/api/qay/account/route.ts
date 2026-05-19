import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQayAccountProfile, type QayAccountMode } from '@/qay/lib/account';

const accountModes = new Set<QayAccountMode>(['developer', 'client']);

export async function GET() {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return noCache({ error: 'Please sign in first' }, 401);
    }

    return noCache({ data: await getQayAccountProfile(user) });
  } catch (error) {
    console.error('[GET /api/qay/account] Error:', error);
    return noCache({ error: 'Unable to load account settings' }, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return noCache({ error: 'Please sign in first' }, 401);
    }

    const body = await request.json();
    const fullName = typeof body.full_name === 'string' ? body.full_name.trim().slice(0, 120) : null;
    const avatarUrl = typeof body.avatar_url === 'string' ? body.avatar_url.trim().slice(0, 500) : null;
    const company = typeof body.company === 'string' ? body.company.trim().slice(0, 160) : null;
    const website = typeof body.website === 'string' ? body.website.trim().slice(0, 300) : null;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : null;
    const accountType = accountModes.has(body.account_type) ? body.account_type as QayAccountMode : null;

    if (fullName === null && avatarUrl === null && company === null && website === null && email === null && !accountType) {
      return noCache({ error: 'No account changes were provided' }, 400);
    }

    if (email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return noCache({ error: 'Enter a valid email address' }, 400);
    }

    const supabase = getQayAdmin() as any;

    if (email && email !== user.email?.toLowerCase()) {
      const { error: authError } = await supabase.auth.admin.updateUserById(user.id, { email });
      if (authError) {
        throw new Error(authError.message);
      }
    }

    const updates: Record<string, unknown> = {
      id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (fullName !== null) updates.full_name = fullName;
    if (avatarUrl !== null) updates.avatar_url = avatarUrl || null;
    if (company !== null) updates.company = company || null;
    if (website !== null) updates.website = website || null;
    if (accountType) updates.account_type = accountType;

    const { error } = await supabase
      .from('qay_user_profiles')
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      throw new Error(error.message);
    }

    return noCache({ data: await getQayAccountProfile({ ...user, email: email || user.email }) });
  } catch (error) {
    console.error('[PATCH /api/qay/account] Error:', error);
    return noCache({ error: 'Unable to save account settings' }, 500);
  }
}

export async function DELETE() {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return noCache({ error: 'Please sign in first' }, 401);
    }

    const supabase = getQayAdmin() as any;
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      throw new Error(error.message);
    }

    return noCache({ data: { success: true } });
  } catch (error) {
    console.error('[DELETE /api/qay/account] Error:', error);
    return noCache({ error: 'Unable to delete account' }, 500);
  }
}
