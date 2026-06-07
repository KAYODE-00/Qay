import type { User } from '@supabase/supabase-js';

export type QayPlanKey = 'free' | 'starter' | 'pro' | 'studio' | 'agency';

export type QayPlan = {
  key: QayPlanKey;
  name: string;
  price: number;
  currency: string;
  interval: 'month';
  siteLimit: number;
  publishedSiteLimit: number;
  demoLinkLimit: number;
  demoLinkTtlHours: number;
  isAvailable: boolean;
  features: string[];
};

export const QAY_PLANS: Record<QayPlanKey, QayPlan> = {
  free: {
    key: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    siteLimit: Number.MAX_SAFE_INTEGER,
    publishedSiteLimit: 2,
    demoLinkLimit: 5,
    demoLinkTtlHours: 24,
    isAvailable: true,
    features: ['Unlimited draft sites', 'Publish 2 sites', '5 demo links', 'QAY editor', 'CMS basics', 'QAY badge'],
  },
  starter: {
    key: 'starter',
    name: 'Starter',
    price: 19,
    currency: 'USD',
    interval: 'month',
    siteLimit: Number.MAX_SAFE_INTEGER,
    publishedSiteLimit: 5,
    demoLinkLimit: 20,
    demoLinkTtlHours: 72,
    isAvailable: true,
    features: ['Unlimited draft sites', 'Publish 5 sites', '20 demo links', 'Custom domains', 'Remove QAY badge', 'Medusa commerce blocks'],
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    price: 30,
    currency: 'USD',
    interval: 'month',
    siteLimit: Number.MAX_SAFE_INTEGER,
    publishedSiteLimit: 15,
    demoLinkLimit: 100,
    demoLinkTtlHours: 168,
    isAvailable: true,
    features: ['Everything in Starter', 'Publish 15 sites', '100 demo links', 'Advanced commerce runtime', 'Per-site auth', 'Client invites', 'Advanced CMS and forms', 'Site analytics'],
  },
  studio: {
    key: 'studio',
    name: 'Studio',
    price: 49,
    currency: 'USD',
    interval: 'month',
    siteLimit: Number.MAX_SAFE_INTEGER,
    publishedSiteLimit: 50,
    demoLinkLimit: 500,
    demoLinkTtlHours: 336,
    isAvailable: false,
    features: ['Publish 50 sites', 'Team workflows', 'Template publishing', 'Advanced analytics', 'Coming soon'],
  },
  agency: {
    key: 'agency',
    name: 'Agency',
    price: 99,
    currency: 'USD',
    interval: 'month',
    siteLimit: Number.MAX_SAFE_INTEGER,
    publishedSiteLimit: 100,
    demoLinkLimit: 1000,
    demoLinkTtlHours: 720,
    isAvailable: false,
    features: ['Publish 100 sites', 'White-label direction', 'Priority support', 'Agency workspace', 'Coming soon'],
  },
};

const PLAN_ORDER: QayPlanKey[] = ['free', 'starter', 'pro', 'studio', 'agency'];

export function normalizeQayPlan(value: unknown): QayPlanKey {
  return value === 'agency' || value === 'studio' || value === 'pro' || value === 'starter' ? value : 'free';
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
