import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { createPaddleCheckout, isPaddleConfigured } from '@/qay/lib/billing/paddle';
import { normalizeQayPlan, QAY_PLANS } from '@/qay/lib/billing/plan-limits';

function getRequestOrigin(request: Request) {
  const url = new URL(request.url);
  return process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;
}

function isBillingTestMode() {
  return String(process.env.QAY_BILLING_TEST_MODE || '').toLowerCase() === 'true';
}

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const plan = normalizeQayPlan(body?.plan);

    if (plan === 'free') {
      return NextResponse.json({ error: 'Choose a paid plan to upgrade.' }, { status: 400 });
    }

    if (!QAY_PLANS[plan].isAvailable) {
      return NextResponse.json({ error: 'This plan is not available yet.' }, { status: 400 });
    }

    const origin = getRequestOrigin(request);

    if (isBillingTestMode()) {
      return NextResponse.json({
        data: {
          provider: 'test',
          link: `${origin}/pricing?billing=test&plan=${plan}`,
          plan,
          test_mode: true,
        },
      });
    }

    if (!isPaddleConfigured()) {
      return NextResponse.json(
        { error: 'Paddle billing is not configured yet.' },
        { status: 503 }
      );
    }

    const checkout = await createPaddleCheckout({
      plan,
      userId: user.id,
      customer: {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.display_name || user.email,
      },
      redirectUrl: `${origin}/api/qay/billing/verify?provider=paddle&plan=${plan}`,
    });

    return NextResponse.json({ data: checkout });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start checkout' },
      { status: 500 }
    );
  }
}
