import { randomUUID } from 'crypto';
import { QAY_PLANS, normalizeQayPlan, type QayPlanKey } from './plan-limits';

const FLUTTERWAVE_API_BASE = 'https://api.flutterwave.com/v3';

type FlutterwaveCustomer = {
  email: string;
  name?: string | null;
};

type FlutterwaveCheckoutInput = {
  plan: QayPlanKey;
  userId: string;
  customer: FlutterwaveCustomer;
  redirectUrl: string;
};

type FlutterwavePaymentResponse = {
  status: string;
  message?: string;
  data?: {
    link?: string;
  };
};

export type FlutterwaveVerifiedTransaction = {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  currency: string;
  customer?: {
    email?: string;
  };
  meta?: {
    user_id?: string;
    plan?: string;
  };
};

type FlutterwaveVerifyResponse = {
  status: string;
  message?: string;
  data?: FlutterwaveVerifiedTransaction;
};

function getFlutterwaveSecretKey() {
  return process.env.FLUTTERWAVE_SECRET_KEY || process.env.FLW_SECRET_KEY || '';
}

export function getFlutterwaveWebhookSecret() {
  return process.env.FLUTTERWAVE_WEBHOOK_SECRET || process.env.FLW_SECRET_HASH || '';
}

export function getBillingCurrency() {
  return (process.env.NEXT_PUBLIC_QAY_BILLING_CURRENCY || process.env.QAY_BILLING_CURRENCY || 'USD').toUpperCase();
}

export function getBillingAmount(plan: QayPlanKey) {
  return Number(process.env[`QAY_${plan.toUpperCase()}_PRICE`] || QAY_PLANS[plan].price);
}

function assertFlutterwaveConfig() {
  if (!getFlutterwaveSecretKey()) {
    throw new Error('Flutterwave secret key is not configured');
  }
}

async function flutterwaveFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  assertFlutterwaveConfig();

  const response = await fetch(`${FLUTTERWAVE_API_BASE}${path}`, {
    ...init,
    headers: {
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

export function createFlutterwaveTxRef(plan: QayPlanKey, userId: string) {
  return `qay_${plan}_${userId.slice(0, 8)}_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

export function parsePlanFromTxRef(txRef: string | null | undefined): QayPlanKey {
  const match = txRef?.match(/^qay_(free|starter|pro|studio|agency)_/);
  return normalizeQayPlan(match?.[1]);
}

export async function createFlutterwaveCheckout(input: FlutterwaveCheckoutInput) {
  const plan = QAY_PLANS[input.plan];
  const txRef = createFlutterwaveTxRef(input.plan, input.userId);
  const currency = getBillingCurrency();
  const amount = getBillingAmount(input.plan);

  const payload = await flutterwaveFetch<FlutterwavePaymentResponse>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: input.redirectUrl,
      customer: {
        email: input.customer.email,
        name: input.customer.name || input.customer.email,
      },
      customizations: {
        title: `QAY ${plan.name}`,
        description: `${plan.name} plan billing`,
        logo: process.env.NEXT_PUBLIC_QAY_LOGO_URL || undefined,
      },
      meta: {
        user_id: input.userId,
        plan: input.plan,
      },
    }),
  });

  if (!payload.data?.link) {
    throw new Error(payload.message || 'Flutterwave did not return a checkout link');
  }

  return {
    tx_ref: txRef,
    link: payload.data.link,
    amount,
    currency,
    plan: input.plan,
  };
}

export async function verifyFlutterwaveTransaction(transactionId: string | number) {
  const payload = await flutterwaveFetch<FlutterwaveVerifyResponse>(`/transactions/${transactionId}/verify`);

  if (!payload.data) {
    throw new Error(payload.message || 'Unable to verify transaction');
  }

  return payload.data;
}

export function isVerifiedPlanPayment(transaction: FlutterwaveVerifiedTransaction, plan: QayPlanKey) {
  return transaction.status === 'successful'
    && transaction.amount >= getBillingAmount(plan)
    && transaction.currency?.toUpperCase() === getBillingCurrency();
}
