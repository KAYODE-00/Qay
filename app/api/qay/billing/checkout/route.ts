import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { createFlutterwaveCheckout } from '@/qay/lib/billing/flutterwave';
import { normalizeQayPlan } from '@/qay/lib/billing/plan-limits';

function getRequestOrigin(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
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

    const origin = getRequestOrigin(request);
    const checkout = await createFlutterwaveCheckout({
      plan,
      userId: user.id,
      customer: {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.display_name || user.email,
      },
      redirectUrl: `${origin}/api/qay/billing/verify`,
    });

    return NextResponse.json({ data: checkout });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start checkout' },
      { status: 500 }
    );
  }
}
