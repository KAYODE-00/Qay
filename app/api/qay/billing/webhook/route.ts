import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import {
  getFlutterwaveWebhookSecret,
  isVerifiedPlanPayment,
  parsePlanFromTxRef,
  verifyFlutterwaveTransaction,
} from '@/qay/lib/billing/flutterwave';
import {
  getLemonWebhookSecret,
  isPaidLemonEvent,
  parseLemonPlanFromPayload,
  parseLemonUserIdFromPayload,
} from '@/qay/lib/billing/lemonsqueezy';
import type { QayPlanKey } from '@/qay/lib/billing/plan-limits';

function isValidWebhookSignature(rawBody: string, request: Request) {
  const lemonSignature = request.headers.get('x-signature');
  const lemonSecret = getLemonWebhookSecret();
  if (lemonSignature && lemonSecret) {
    const expected = createHmac('sha256', lemonSecret).update(rawBody).digest('hex');
    return lemonSignature === expected;
  }

  const secretHash = getFlutterwaveWebhookSecret();
  if (!secretHash) return true;

  const hmacSignature = request.headers.get('flutterwave-signature');
  if (hmacSignature) {
    const expected = createHmac('sha256', secretHash).update(rawBody).digest('base64');
    return hmacSignature === expected;
  }

  return request.headers.get('verif-hash') === secretHash;
}

async function applyPlan(userId: string, plan: QayPlanKey, metadata: Record<string, unknown>) {
  if (!userId || plan === 'free') return;

  const supabase = getQayAdmin() as any;
  const updatedAt = new Date().toISOString();
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);

  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(authUser?.user?.app_metadata || {}),
      qay_plan: plan,
      qay_plan_updated_at: updatedAt,
      ...metadata,
    },
  });

  await supabase
    .from('qay_sites')
    .update({ plan, updated_at: updatedAt })
    .eq('owner_id', userId);
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!isValidWebhookSignature(rawBody, request)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody || '{}');
    if (payload?.meta?.event_name && isPaidLemonEvent(payload)) {
      const plan = parseLemonPlanFromPayload(payload);
      const userId = parseLemonUserIdFromPayload(payload);

      if (userId && plan !== 'free') {
        await applyPlan(userId, plan, {
          qay_billing_provider: 'lemonsqueezy',
          qay_lemon_event: payload.meta.event_name,
          qay_lemon_object_id: payload.data?.id,
        });
      }

      return NextResponse.json({ received: true });
    }

    const transactionId = payload?.id || payload?.data?.id || payload?.transaction_id;

    if (!transactionId) {
      return NextResponse.json({ received: true });
    }

    const transaction = await verifyFlutterwaveTransaction(transactionId);
    const plan = parsePlanFromTxRef(transaction.tx_ref);
    const userId = transaction.meta?.user_id;

    if (userId && plan !== 'free' && isVerifiedPlanPayment(transaction, plan)) {
      await applyPlan(userId, plan, {
        qay_billing_provider: 'flutterwave',
        qay_plan_tx_ref: transaction.tx_ref,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[QAY billing webhook] Error:', error);
    return NextResponse.json({ received: true });
  }
}
