import { NextResponse } from 'next/server';
import { applyQayBillingPlan } from '@/qay/lib/billing/apply-plan';
import {
  getFlutterwaveBillingMetadata,
  isSuccessfulFlutterwaveTransaction,
  parseFlutterwavePlan,
  parseFlutterwaveUserId,
  verifyFlutterwaveWebhookSignature,
  type FlutterwaveWebhookPayload,
} from '@/qay/lib/billing/flutterwave';

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyFlutterwaveWebhookSignature(request.headers.get('verif-hash'))) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody || '{}') as FlutterwaveWebhookPayload;
    const transaction = payload.data;

    if (!isSuccessfulFlutterwaveTransaction(transaction)) {
      return NextResponse.json({ received: true });
    }

    const plan = parseFlutterwavePlan(transaction);
    const userId = parseFlutterwaveUserId(transaction);

    if (!userId || plan === 'free' || !transaction) {
      return NextResponse.json({ received: true });
    }

    await applyQayBillingPlan({
      userId,
      plan,
      status: 'active',
      metadata: {
        qay_flutterwave_event: payload.event || 'charge.completed',
        ...getFlutterwaveBillingMetadata(transaction),
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[QAY Flutterwave webhook] Error:', error);
    return NextResponse.json({ received: true });
  }
}
