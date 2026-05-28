import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { addDomainToVercelProject } from '@/qay/lib/vercel-domains';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const supabase = getQayAdmin() as any;
  const { data: site, error } = await supabase
    .from('qay_sites')
    .select('id, custom_domain')
    .eq('id', siteId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!site?.custom_domain) {
    return NextResponse.json({ error: 'Add a custom domain first.' }, { status: 400 });
  }

  const result = await addDomainToVercelProject(site.custom_domain);

  if (result.configured && result.error) {
    return NextResponse.json({ error: result.error, data: result }, { status: 502 });
  }

  if (result.verified) {
    await supabase
      .from('qay_sites')
      .update({ domain_verified: true, updated_at: new Date().toISOString() })
      .eq('id', siteId)
      .eq('owner_id', user.id);
  }

  return NextResponse.json({ data: result });
}
