import type { User } from '@supabase/supabase-js';

export type QayPlanKey = 'free' | 'pro' | 'agency';

export type QayPlan = {
  key: QayPlanKey;
  name: string;
  price: number;
  currency: string;
  interval: 'month';
  siteLimit: number;
  features: string[];
};

export const QAY_PLANS: Record<QayPlanKey, QayPlan> = {
  free: {
    key: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    siteLimit: 1,
    features: ['1 site', 'QAY editor', 'CMS basics'],
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    price: 19,
    currency: 'USD',
    interval: 'month',
    siteLimit: 10,
    features: ['10 sites', 'Custom domains', 'Client handoff', 'Collaboration'],
  },
  agency: {
    key: 'agency',
    name: 'Agency',
    price: 79,
    currency: 'USD',
    interval: 'month',
    siteLimit: 50,
    features: ['50 sites', 'Advanced collaboration', 'Priority workflow', 'Agency workspace'],
  },
};

const PLAN_ORDER: QayPlanKey[] = ['free', 'pro', 'agency'];

export function normalizeQayPlan(value: unknown): QayPlanKey {
  return value === 'agency' || value === 'pro' ? value : 'free';
}

export function getQayPlan(value: unknown): QayPlan {
  return QAY_PLANS[normalizeQayPlan(value)];
}

export function getQayPlanRank(plan: unknown) {
  return PLAN_ORDER.indexOf(normalizeQayPlan(plan));
}

export function getHighestQayPlan(plans: unknown[]): QayPlanKey {
  return plans.reduce<QayPlanKey>((highest, current) => (
    getQayPlanRank(current) > getQayPlanRank(highest)
      ? normalizeQayPlan(current)
      : highest
  ), 'free');
}

export function getUserQayPlan(user: Pick<User, 'app_metadata'> | null | undefined): QayPlanKey {
  return normalizeQayPlan(user?.app_metadata?.qay_plan);
}
