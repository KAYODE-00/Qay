import 'server-only';

import { randomBytes } from 'crypto';
import { getQayAdmin } from './supabase-admin';
import { getQayPlan, getUserQayPlan } from './billing/plan-limits';
import type { User } from '@supabase/supabase-js';

export type QayDemoLink = {
  id: string;
  site_id: string;
  owner_id: string;
  token: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string | null;
};

export function getDemoLinkUrl(request: Request, token: string) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}/demo/${token}`;
}

export async function createQayDemoLink(siteId: string, user: User) {
  const supabase = getQayAdmin() as any;
  const planKey = getUserQayPlan(user);
  const plan = getQayPlan(planKey);
  const now = new Date();

  const { data: site, error: siteError } = await supabase
    .from('qay_sites')
    .select('id, owner_id')
    .eq('id', siteId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (siteError) {
    throw new Error(siteError.message);
  }

  if (!site?.id) {
    throw new Error('Site not found');
  }

  const { count, error: countError } = await supabase
    .from('qay_demo_links')
    .select('id', { count: 'exact', head: true })
    .eq('site_id', siteId)
    .eq('owner_id', user.id)
    .is('revoked_at', null)
    .gt('expires_at', now.toISOString());

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) >= plan.demoLinkLimit) {
    const hours = plan.demoLinkTtlHours;
    throw Object.assign(
      new Error(`Your ${plan.name} plan can have ${plan.demoLinkLimit} active demo links. Demo links expire after ${hours < 48 ? `${hours} hours` : `${Math.round(hours / 24)} days`}.`),
      { code: 'DEMO_LINK_LIMIT_REACHED' }
    );
  }

  const expiresAt = new Date(now.getTime() + plan.demoLinkTtlHours * 60 * 60 * 1000).toISOString();
  const token = randomBytes(24).toString('hex');

  const { data, error } = await supabase
    .from('qay_demo_links')
    .insert({
      site_id: siteId,
      owner_id: user.id,
      token,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as QayDemoLink;
}

export async function getQayDemoLinkByToken(token: string): Promise<QayDemoLink | null> {
  const cleanToken = token.trim();
  if (!cleanToken) return null;

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_demo_links')
    .select('*')
    .eq('token', cleanToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as QayDemoLink | null;
}
