import { NextResponse } from 'next/server';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cleanId(value: string) {
  return value.trim().slice(0, 80);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getQayAuthUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (!(await hasQayAdminAccess(user))) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const { id } = await context.params;
  const logId = cleanId(id || '');
  if (!logId) return NextResponse.json({ error: 'Email log id is required.' }, { status: 400 });

  const admin = getQayAdmin();
  const { error } = await admin
    .from('qay_email_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete email log.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
