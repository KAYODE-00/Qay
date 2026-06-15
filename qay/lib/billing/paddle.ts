import { createHmac, timingSafeEqual } from 'crypto';
import { QAY_PLANS, normalizeQayPlan, type QayPlanKey } from './plan-limits';

type PaddleCheckoutInput = {
  plan: QayPlanKey;
  userId: string;
  customer: {
    email: string;
    name?: string | null;
  };
  redirectUrl: string;
};

type PaddleTransactionResponse = {
  data?: {
    id?: string;
    status?: string;
    subscription_id?: string | null;
    custom_data?: Record<string, unknown> | null;
    checkout?: {
      url?: string | null;
    } | null;
    items?: Array<{
      price?: {
        id?: string;
        billing_cycle?: {
          interval?: string;
          frequency?: number;
        } | null;
      };
      quantity?: number;
    }>;
  };
  errors?: Array<{ detail?: string; title?: string }>;
};

export type PaddleWebhookPayload = {
  event_type?: string;
  data?: {
    id?: string;
    status?: string;
    customer_id?: string | null;
    subscription_id?: string | null;
    custom_data?: Record<string, unknown> | null;
    current_billing_period?: {
      starts_at?: string | null;
      ends_at?: string | null;
    } | null;
    billing_period?: {
      starts_at?: string | null;
      ends_at?: string | null;
    } | null;
    items?: Array<{
      price?: {
        id?: string;
        billing_cycle?: {
          interval?: string;
          frequency?: number;
        } | null;
      };
      quantity?: number;
    }>;
  };
};

const PADDLE_API_BASE = {
  production: 'https://api.paddle.com',
  sandbox: 'https://sandbox-api.paddle.com',
} as const;

function getPaddleApiKey() {
  return process.env.PADDLE_API_KEY || process.env.PADDLE_SECRET_KEY || '';
}

function getPaddleEnvironment(): keyof typeof PADDLE_API_BASE {
  return String(process.env.PADDLE_ENVIRONMENT || '').toLowerCase() === 'production'
    ? 'production'
    : 'sandbox';
}

export function getPaddleWebhookSecret() {
  return process.env.PADDLE_WEBHOOK_SECRET || process.env.PADDLE_WEBHOOK_SECRET_KEY || '';
}

export function isPaddleConfigured() {
  return !!getPaddleApiKey();
}

export function getPaddlePriceId(plan: QayPlanKey) {
  return (
    process.env[`PADDLE_${plan.toUpperCase()}_PRICE_ID`]
    || process.env[`PADDLE_PRICE_${plan.toUpperCase()}`]
    || ''
  );
}

function assertPaddleConfig(plan: QayPlanKey) {
  if (!getPaddleApiKey()) {
    throw new Error('Paddle API key is not configured');
  }

  if (!getPaddlePriceId(plan)) {
    throw new Error(`Paddle price id is not configured for ${QAY_PLANS[plan].name}`);
  }
}

async function paddleFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${PADDLE_API_BASE[getPaddleEnvironment()]}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getPaddleApiKey()}`,
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.errors?.[0]?.detail || payload?.errors?.[0]?.title || 'Paddle request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function createPaddleCheckout(input: PaddleCheckoutInput) {
  assertPaddleConfig(input.plan);

  const plan = QAY_PLANS[input.plan];
  const priceId = getPaddlePriceId(input.plan);
  const payload = await paddleFetch<PaddleTransactionResponse>('/transactions', {
    method: 'POST',
    body: JSON.stringify({
      collection_mode: 'automatic',
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: {
        user_id: input.userId,
        plan: input.plan,
        customer_email: input.customer.email,
        customer_name: input.customer.name || input.customer.email,
      },
      checkout: {
        success_url: input.redirectUrl,
      },
    }),
  });

  const link = payload.data?.checkout?.url;
  if (!link) {
    throw new Error('Paddle did not return a checkout link');
  }

  return {
    provider: 'paddle' as const,
    transaction_id: payload.data?.id,
    link,
    plan: input.plan,
    price_id: priceId,
    environment: getPaddleEnvironment(),
    description: `QAY ${plan.name}`,
  };
}

function parsePaddleSignatureHeader(signatureHeader: string) {
  const parts = signatureHeader.split(';').map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith('ts='))?.slice(3);
  const signatures = parts
    .filter((part) => part.startsWith('h1='))
    .map((part) => part.slice(3))
    .filter(Boolean);

  return { timestamp, signatures };
}

export function verifyPaddleWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = getPaddleWebhookSecret();
  if (!secret) return true;
  if (!signatureHeader) return false;

  const { timestamp, signatures } = parsePaddleSignatureHeader(signatureHeader);
  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}:${rawBody}`;
  const expected = createHmac('sha256', secret).update(signedPayload).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  return signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, 'hex');
    return signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer);
  });
}

export function parsePaddlePlan(payload: PaddleWebhookPayload): QayPlanKey {
  return normalizeQayPlan(payload.data?.custom_data?.plan);
}

export function parsePaddleUserId(payload: PaddleWebhookPayload): string | null {
  const userId = payload.data?.custom_data?.user_id;
  return typeof userId === 'string' && userId ? userId : null;
}

export function parsePaddleBillingCycle(payload: PaddleWebhookPayload): string {
  const interval = payload.data?.items?.[0]?.price?.billing_cycle?.interval;
  return typeof interval === 'string' && interval ? interval : 'month';
}

export function parsePaddleCurrentPeriodEnd(payload: PaddleWebhookPayload): string | null {
  return (
    payload.data?.current_billing_period?.ends_at
    || payload.data?.billing_period?.ends_at
    || null
  );
}

export function isActivePaddleEvent(payload: PaddleWebhookPayload) {
  const eventType = payload.event_type;
  const status = String(payload.data?.status || '').toLowerCase();

  if (eventType === 'transaction.completed') return true;
  if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
    return ['active', 'trialing', 'past_due'].includes(status);
  }

  return false;
}

export function isCanceledPaddleEvent(payload: PaddleWebhookPayload) {
  const eventType = payload.event_type;
  const status = String(payload.data?.status || '').toLowerCase();
  return eventType === 'subscription.canceled' || status === 'canceled' || status === 'cancelled';
}
