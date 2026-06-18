import { NextResponse } from 'next/server';
import { applyQayBillingPlan } from '@/qay/lib/billing/apply-plan';
import {
  getFlutterwaveBillingMetadata,
  isSuccessfulFlutterwaveTransaction,
  parseFlutterwavePlan,
  parseFlutterwaveUserId,
  verifyFlutterwaveTransaction,
} from '@/qay/lib/billing/flutterwave';

function redirectToPricing(request: Request, status: 'success' | 'failed', plan?: string) {
  const url = new URL('/pricing', request.url);
  url.searchParams.set('billing', status);
  if (plan) url.searchParams.set('plan', plan);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const planHint = searchParams.get('plan') || undefined;
  const provider = searchParams.get('provider');
  const status = String(searchParams.get('status') || '').toLowerCase();
  const transactionId = searchParams.get('transaction_id') || searchParams.get('tx_id') || '';

  if (provider !== 'flutterwave' || !transactionId || (status && status !== 'successful' && status !== 'completed')) {
    return redirectToPricing(request, 'failed', planHint);
  }

  try {
    const transaction = await verifyFlutterwaveTransaction(transactionId);
    if (!isSuccessfulFlutterwaveTransaction(transaction)) {
      return redirectToPricing(request, 'failed', planHint);
    }

    const plan = parseFlutterwavePlan(transaction);
    const userId = parseFlutterwaveUserId(transaction);
    if (!userId || plan === 'free') {
      return redirectToPricing(request, 'failed', planHint);
    }

    await applyQayBillingPlan({
      userId,
      plan,
      status: 'active',
      metadata: getFlutterwaveBillingMetadata(transaction),
    });

    return redirectToPricing(request, 'success', plan);
  } catch (error) {
    console.error('[QAY Flutterwave verify] Error:', error);
    return redirectToPricing(request, 'failed', planHint);
  }
}

export async function POST() {
  return NextResponse.json({
    error: 'Flutterwave billing is verified by redirect and webhook events.',
  }, { status: 405 });
}
