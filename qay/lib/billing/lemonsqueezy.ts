import { QAY_PLANS, normalizeQayPlan, type QayPlanKey } from './plan-limits';

const LEMON_API_BASE = 'https://api.lemonsqueezy.com/v1';

type LemonCheckoutInput = {
  plan: QayPlanKey;
  userId: string;
  customer: {
    email: string;
    name?: string | null;
  };
  redirectUrl: string;
};

type LemonCheckoutResponse = {
  data?: {
    id?: string;
    attributes?: {
      url?: string;
    };
  };
  errors?: Array<{ detail?: string; title?: string }>;
};

function getLemonApiKey() {
  return process.env.LEMON_SQUEEZY_API_KEY || process.env.LEMONSQUEEZY_API_KEY || '';
}

function getLemonStoreId() {
  return process.env.LEMON_SQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_STORE_ID || '';
}

export function getLemonWebhookSecret() {
  return process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
}

export function isLemonSqueezyConfigured() {
  return !!getLemonApiKey() && !!getLemonStoreId();
}

export function getLemonVariantId(plan: QayPlanKey) {
  return (
    process.env[`LEMON_SQUEEZY_${plan.toUpperCase()}_VARIANT_ID`]
    || process.env[`LEMONSQUEEZY_${plan.toUpperCase()}_VARIANT_ID`]
    || ''
  );
}

function assertLemonConfig(plan: QayPlanKey) {
  if (!getLemonApiKey()) {
    throw new Error('Lemon Squeezy API key is not configured');
  }

  if (!getLemonStoreId()) {
    throw new Error('Lemon Squeezy store id is not configured');
  }

  if (!getLemonVariantId(plan)) {
    throw new Error(`Lemon Squeezy variant id is not configured for ${QAY_PLANS[plan].name}`);
  }
}

async function lemonFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${LEMON_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${getLemonApiKey()}`,
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.errors?.[0]?.detail || payload?.errors?.[0]?.title || 'Lemon Squeezy request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function createLemonCheckout(input: LemonCheckoutInput) {
  assertLemonConfig(input.plan);

  const plan = QAY_PLANS[input.plan];
  const variantId = getLemonVariantId(input.plan);
  const payload = await lemonFetch<LemonCheckoutResponse>('/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: input.customer.email,
            name: input.customer.name || input.customer.email,
            custom: {
              user_id: input.userId,
              plan: input.plan,
            },
          },
          product_options: {
            name: `QAY ${plan.name}`,
            description: `${plan.name} plan billing`,
            redirect_url: input.redirectUrl,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: getLemonStoreId(),
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  });

  const link = payload.data?.attributes?.url;
  if (!link) {
    throw new Error('Lemon Squeezy did not return a checkout link');
  }

  return {
    provider: 'lemonsqueezy' as const,
    checkout_id: payload.data?.id,
    link,
    plan: input.plan,
    variant_id: variantId,
  };
}

export function parseLemonPlanFromPayload(payload: any): QayPlanKey {
  return normalizeQayPlan(
    payload?.meta?.custom_data?.plan
    || payload?.data?.attributes?.custom_data?.plan
    || payload?.data?.attributes?.checkout_data?.custom?.plan
  );
}

export function parseLemonUserIdFromPayload(payload: any): string | null {
  const userId =
    payload?.meta?.custom_data?.user_id
    || payload?.data?.attributes?.custom_data?.user_id
    || payload?.data?.attributes?.checkout_data?.custom?.user_id;

  return typeof userId === 'string' && userId ? userId : null;
}

export function isPaidLemonEvent(payload: any) {
  const eventName = payload?.meta?.event_name;
  const status = payload?.data?.attributes?.status;

  return (
    eventName === 'subscription_created'
    || eventName === 'subscription_updated'
    || eventName === 'order_created'
  ) && (!status || ['paid', 'active'].includes(String(status).toLowerCase()));
}
