import { QAY_PLANS, normalizeQayPlan, type QayPlanKey } from './plan-limits';

type FlutterwaveCheckoutInput = {
  plan: QayPlanKey;
  userId: string;
  customer: {
    email: string;
    name?: string | null;
  };
  redirectUrl: string;
};

type FlutterwavePaymentResponse = {
  status?: string;
  message?: string;
  data?: {
    link?: string | null;
  } | null;
};

export type FlutterwaveTransaction = {
  id?: number | string;
  tx_ref?: string;
  flw_ref?: string;
  status?: string;
  amount?: number;
  currency?: string;
  meta?: Record<string, unknown> | Array<{ metaname?: string; metavalue?: unknown }> | null;
  customer?: {
    email?: string;
    name?: string;
  } | null;
  created_at?: string;
};

type FlutterwaveVerifyResponse = {
  status?: string;
  message?: string;
  data?: FlutterwaveTransaction | null;
};

export type FlutterwaveWebhookPayload = {
  event?: string;
  data?: FlutterwaveTransaction | null;
};

const FLUTTERWAVE_API_BASE = 'https://api.flutterwave.com/v3';

function getFlutterwaveSecretKey() {
  return process.env.FLUTTERWAVE_SECRET_KEY || process.env.FLW_SECRET_KEY || '';
}

export function getFlutterwaveWebhookSecret() {
  return process.env.FLUTTERWAVE_WEBHOOK_SECRET || process.env.FLW_WEBHOOK_SECRET || '';
}

export function isFlutterwaveConfigured() {
  return !!getFlutterwaveSecretKey();
}

function getFlutterwaveCurrency(plan: QayPlanKey) {
  return process.env.NEXT_PUBLIC_QAY_BILLING_CURRENCY || process.env.FLUTTERWAVE_CURRENCY || QAY_PLANS[plan].currency;
}

function getFlutterwavePaymentPlanId(plan: QayPlanKey) {
  return (
    process.env[`FLUTTERWAVE_${plan.toUpperCase()}_PAYMENT_PLAN_ID`]
    || process.env[`FLW_${plan.toUpperCase()}_PAYMENT_PLAN_ID`]
    || ''
  );
}

function assertFlutterwaveConfig() {
  if (!getFlutterwaveSecretKey()) {
    throw new Error('Flutterwave secret key is not configured');
  }
}

async function flutterwaveFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${FLUTTERWAVE_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getFlutterwaveSecretKey()}`,
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.status === 'error') {
    throw new Error(payload?.message || 'Flutterwave request failed');
  }

  return payload as T;
}

export async function createFlutterwaveCheckout(input: FlutterwaveCheckoutInput) {
  assertFlutterwaveConfig();

  const plan = QAY_PLANS[input.plan];
  const currency = getFlutterwaveCurrency(input.plan);
  const txRef = `qay_${input.plan}_${input.userId.slice(0, 8)}_${Date.now()}`;
  const paymentPlan = getFlutterwavePaymentPlanId(input.plan);
  const payload = await flutterwaveFetch<FlutterwavePaymentResponse>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      tx_ref: txRef,
      amount: plan.price,
      currency,
      redirect_url: input.redirectUrl,
      customer: {
        email: input.customer.email,
        name: input.customer.name || input.customer.email,
      },
      customizations: {
        title: `QAY ${plan.name}`,
        description: `${plan.name} plan - publish up to ${plan.publishedSiteLimit} sites`,
        logo: process.env.NEXT_PUBLIC_QAY_LOGO_URL || undefined,
      },
      meta: {
        user_id: input.userId,
        plan: input.plan,
        billing_cycle: plan.interval,
        source: 'qay_pricing',
      },
      ...(paymentPlan ? { payment_plan: paymentPlan } : {}),
    }),
  });

  const link = payload.data?.link;
  if (!link) {
    throw new Error('Flutterwave did not return a checkout link');
  }

  return {
    provider: 'flutterwave' as const,
    tx_ref: txRef,
    link,
    plan: input.plan,
    currency,
    payment_plan: paymentPlan || null,
    description: `QAY ${plan.name}`,
  };
}

function normalizeFlutterwaveMeta(meta: FlutterwaveTransaction['meta']): Record<string, unknown> {
  if (!meta) return {};
  if (!Array.isArray(meta)) return meta;

  return meta.reduce<Record<string, unknown>>((acc, item) => {
    if (typeof item.metaname === 'string') {
      acc[item.metaname] = item.metavalue;
    }
    return acc;
  }, {});
}

function metaString(meta: FlutterwaveTransaction['meta'], key: string) {
  const value = normalizeFlutterwaveMeta(meta)[key];
  return typeof value === 'string' && value ? value : null;
}

export function verifyFlutterwaveWebhookSignature(signatureHeader: string | null) {
  const secret = getFlutterwaveWebhookSecret();
  if (!secret) return true;
  return signatureHeader === secret;
}

export async function verifyFlutterwaveTransaction(transactionId: string) {
  assertFlutterwaveConfig();
  const payload = await flutterwaveFetch<FlutterwaveVerifyResponse>(`/transactions/${encodeURIComponent(transactionId)}/verify`);
  if (payload.status !== 'success' || !payload.data) {
    throw new Error(payload.message || 'Flutterwave transaction could not be verified');
  }
  return payload.data;
}

export function parseFlutterwavePlan(transaction: FlutterwaveTransaction | null | undefined): QayPlanKey {
  const fromMeta = metaString(transaction?.meta, 'plan');
  if (fromMeta) return normalizeQayPlan(fromMeta);

  const txRef = transaction?.tx_ref || '';
  const matched = txRef.match(/^qay_([a-z]+)_/i)?.[1];
  return normalizeQayPlan(matched);
}

export function parseFlutterwaveUserId(transaction: FlutterwaveTransaction | null | undefined): string | null {
  return metaString(transaction?.meta, 'user_id');
}

export function isSuccessfulFlutterwaveTransaction(transaction: FlutterwaveTransaction | null | undefined) {
  const status = String(transaction?.status || '').toLowerCase();
  return status === 'successful' || status === 'completed';
}

export function getFlutterwaveBillingMetadata(transaction: FlutterwaveTransaction) {
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    qay_billing_provider: 'flutterwave',
    qay_flutterwave_tx_ref: transaction.tx_ref || null,
    qay_flutterwave_tx_id: transaction.id ? String(transaction.id) : null,
    qay_flutterwave_flw_ref: transaction.flw_ref || null,
    qay_flutterwave_billing_cycle: metaString(transaction.meta, 'billing_cycle') || 'month',
    qay_flutterwave_current_period_end: periodEnd,
  };
}
