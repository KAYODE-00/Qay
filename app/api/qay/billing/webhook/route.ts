import { NextResponse } from 'next/server';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import {
  isActivePaddleEvent,
  isCanceledPaddleEvent,
  parsePaddleBillingCycle,
  parsePaddleCurrentPeriodEnd,
  parsePaddlePlan,
  parsePaddleUserId,
  verifyPaddleWebhookSignature,
  type PaddleWebhookPayload,
} from '@/qay/lib/billing/paddle';
import type { QayPlanKey } from '@/qay/lib/billing/plan-limits';

async function applyPlan(
  userId: string,
  plan: QayPlanKey,
  status: string,
  metadata: Record<string, unknown>
) {
  if (!userId) return;

  const supabase = getQayAdmin() as any;
  const updatedAt = new Date().toISOString();
  const appliedPlan = status === 'canceled' ? 'free' : plan;
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);

  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(authUser?.user?.app_metadata || {}),
      qay_plan: appliedPlan,
      qay_plan_updated_at: updatedAt,
      ...metadata,
    },
  });

  await supabase
    .from('qay_sites')
    .update({ plan: appliedPlan, updated_at: updatedAt })
    .eq('owner_id', userId);

  await supabase
    .from('qay_subscriptions')
    .upsert({
      user_id: userId,
      plan: appliedPlan,
      status,
      billing_cycle: metadata.qay_paddle_billing_cycle || 'month',
      current_period_end: metadata.qay_paddle_current_period_end || null,
      updated_at: updatedAt,
    }, { onConflict: 'user_id' });
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyPaddleWebhookSignature(rawBody, request.headers.get('paddle-signature'))) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody || '{}') as PaddleWebhookPayload;
    const plan = parsePaddlePlan(payload);
    const userId = parsePaddleUserId(payload);

    if (!userId || plan === 'free') {
      return NextResponse.json({ received: true });
    }

    if (isActivePaddleEvent(payload)) {
      await applyPlan(userId, plan, String(payload.data?.status || 'active'), {
        qay_billing_provider: 'paddle',
        qay_paddle_event: payload.event_type,
        qay_paddle_object_id: payload.data?.id,
        qay_paddle_customer_id: payload.data?.customer_id,
        qay_paddle_subscription_id: payload.data?.subscription_id,
        qay_paddle_billing_cycle: parsePaddleBillingCycle(payload),
        qay_paddle_current_period_end: parsePaddleCurrentPeriodEnd(payload),
      });
    } else if (isCanceledPaddleEvent(payload)) {
      await applyPlan(userId, plan, 'canceled', {
        qay_billing_provider: 'paddle',
        qay_paddle_event: payload.event_type,
        qay_paddle_object_id: payload.data?.id,
        qay_paddle_customer_id: payload.data?.customer_id,
        qay_paddle_subscription_id: payload.data?.subscription_id,
        qay_paddle_billing_cycle: parsePaddleBillingCycle(payload),
        qay_paddle_current_period_end: parsePaddleCurrentPeriodEnd(payload),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[QAY Paddle webhook] Error:', error);
    return NextResponse.json({ received: true });
  }
}
