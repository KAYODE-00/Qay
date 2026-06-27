import { NextResponse } from 'next/server';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE() {
  const user = await getQayAuthUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (!(await hasQayAdminAccess(user))) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const admin = getQayAdmin();
  const { error } = await admin
    .from('qay_email_logs')
    .delete()
    .not('id', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message || 'Failed to clear email logs.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
