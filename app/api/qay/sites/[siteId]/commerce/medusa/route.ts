import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayPlanRank, getUserQayPlan } from '@/qay/lib/billing/plan-limits';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { listQaySiteSettings, setQaySiteSettings } from '@/qay/lib/site-settings';
import {
  maskMedusaCommerceSettings,
  mergeMedusaCommerceSettings,
  normalizeMedusaCommerceSettings,
  type QayMedusaCommerceSettings,
} from '@/qay/lib/commerce/medusa';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

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

  const settings = await listQaySiteSettings(siteId, ['commerce_medusa']);
  const normalized = normalizeMedusaCommerceSettings(settings.commerce_medusa);

  return NextResponse.json({
    data: maskMedusaCommerceSettings(mergeMedusaCommerceSettings(normalized)),
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getQayAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { siteId } = await context.params;
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed || access.role !== 'owner') {
    return NextResponse.json({ error: 'Only the site owner can update commerce settings.' }, { status: 403 });
  }

  const hasAdmin = await hasQayAdminAccess(user);
  const hasPro = getQayPlanRank(getUserQayPlan(user)) >= getQayPlanRank('pro');
  if (!hasAdmin && !hasPro) {
    return NextResponse.json(
      {
        error: 'Commerce is a private Pro feature for now.',
        code: 'PRO_PLAN_REQUIRED',
      },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const existingSettings = await listQaySiteSettings(siteId, ['commerce_medusa']);
  const existing = normalizeMedusaCommerceSettings(existingSettings.commerce_medusa);
  const nextSettings: QayMedusaCommerceSettings = {
    enabled: body?.enabled === true,
    backendUrl: typeof body?.backendUrl === 'string' ? body.backendUrl.trim().replace(/\/+$/, '') : '',
    publishableKey: typeof body?.publishableKey === 'string' ? body.publishableKey.trim() : existing.publishableKey,
    regionId: typeof body?.regionId === 'string' ? body.regionId.trim() : '',
    salesChannelId: typeof body?.salesChannelId === 'string' ? body.salesChannelId.trim() : '',
  };

  await setQaySiteSettings(siteId, { commerce_medusa: nextSettings });

  return NextResponse.json({
    data: maskMedusaCommerceSettings(mergeMedusaCommerceSettings(nextSettings)),
  });
}
