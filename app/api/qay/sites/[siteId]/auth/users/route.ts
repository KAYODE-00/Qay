import { NextResponse } from 'next/server';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQaySiteAccess } from '@/qay/lib/site-access';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

type SiteAuthUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  provider: string;
  created_at: string | null;
  last_sign_in_at: string | null;
};

export async function GET(_request: Request, context: RouteContext) {
  const { siteId } = await context.params;
  const access = await getQaySiteAccess(siteId);

  if (!access.allowed) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_auth_users')
    .select('id, email, full_name, provider, created_at, last_sign_in_at')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = (data || []) as SiteAuthUserRow[];
  const passwordUsers = users.filter((user) => user.provider === 'password').length;
  const socialUsers = users.length - passwordUsers;
  const activeUsers = users.filter((user) => user.last_sign_in_at).length;

  return NextResponse.json({
    data: {
      users,
      counts: {
        total: users.length,
        password: passwordUsers,
        social: socialUsers,
        active: activeUsers,
      },
    },
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
