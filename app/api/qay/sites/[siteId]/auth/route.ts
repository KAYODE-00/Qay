import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayPlanRank, getUserQayPlan } from '@/qay/lib/billing/plan-limits';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { listQaySiteSettings, setQaySiteSettings } from '@/qay/lib/site-settings';
import type { QaySiteAuthSettings } from '@/qay/lib/site-auth';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

function normalizeAuthSettings(value: unknown): QaySiteAuthSettings {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    enabled: record.enabled === true,
    allowSignup: record.allowSignup !== false,
    provider: record.provider === 'connected_supabase' ? 'connected_supabase' : 'qay',
    socialLogin: record.socialLogin === true,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const user = await getQayAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const settings = await listQaySiteSettings(siteId, ['site_auth']);
  return NextResponse.json({ data: normalizeAuthSettings(settings.site_auth) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getQayAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed || access.role !== 'owner') {
    return NextResponse.json({ error: 'Only the site owner can update auth settings.' }, { status: 403 });
  }

  const hasAdmin = await hasQayAdminAccess(user);
  const hasPro = getQayPlanRank(getUserQayPlan(user)) >= getQayPlanRank('pro');
  if (!hasAdmin && !hasPro) {
    return NextResponse.json(
      {
        error: 'Auth protected sites are a private Pro feature.',
        code: 'PRO_PLAN_REQUIRED',
      },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const nextSettings: QaySiteAuthSettings = {
    enabled: body?.enabled === true,
    allowSignup: body?.allowSignup !== false,
    provider: body?.provider === 'connected_supabase' ? 'connected_supabase' : 'qay',
    socialLogin: body?.socialLogin === true,
  };

  await setQaySiteSettings(siteId, { site_auth: nextSettings });

  return NextResponse.json({ data: nextSettings });
}
