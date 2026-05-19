import { NextResponse } from 'next/server';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import {
  isVerifiedPlanPayment,
  parsePlanFromTxRef,
  verifyFlutterwaveTransaction,
  type FlutterwaveVerifiedTransaction,
} from '@/qay/lib/billing/flutterwave';

async function applyBillingPlan(transaction: FlutterwaveVerifiedTransaction) {
  const plan = parsePlanFromTxRef(transaction.tx_ref);
  const userId = transaction.meta?.user_id;

  if (!userId || plan === 'free' || !isVerifiedPlanPayment(transaction, plan)) {
    return { applied: false, plan };
  }

  const supabase = getQayAdmin() as any;
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);

  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(authUser?.user?.app_metadata || {}),
      qay_plan: plan,
      qay_plan_tx_ref: transaction.tx_ref,
      qay_plan_updated_at: new Date().toISOString(),
    },
  });

  await supabase
    .from('qay_sites')
    .update({ plan, updated_at: new Date().toISOString() })
    .eq('owner_id', userId);

  return { applied: true, plan };
}

function redirectToPricing(request: Request, status: 'success' | 'failed', plan?: string) {
  const url = new URL('/pricing', request.url);
  url.searchParams.set('billing', status);
  if (plan) url.searchParams.set('plan', plan);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transaction_id') || searchParams.get('id');

    if (!transactionId) {
      return redirectToPricing(request, 'failed');
    }

    const transaction = await verifyFlutterwaveTransaction(transactionId);
    const result = await applyBillingPlan(transaction);

    return redirectToPricing(request, result.applied ? 'success' : 'failed', result.plan);
  } catch (error) {
    console.error('[QAY billing verify] Error:', error);
    return redirectToPricing(request, 'failed');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const transactionId = body?.transaction_id || body?.id;

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });
    }

    const transaction = await verifyFlutterwaveTransaction(transactionId);
    const result = await applyBillingPlan(transaction);

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to verify payment' },
      { status: 500 }
    );
  }
}
