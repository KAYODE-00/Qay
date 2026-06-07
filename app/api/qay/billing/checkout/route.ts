import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { createFlutterwaveCheckout, isFlutterwaveConfigured } from '@/qay/lib/billing/flutterwave';
import { createLemonCheckout, isLemonSqueezyConfigured } from '@/qay/lib/billing/lemonsqueezy';
import { normalizeQayPlan, QAY_PLANS } from '@/qay/lib/billing/plan-limits';

const AFRICAN_COUNTRIES = new Set([
  'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG',
  'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML',
  'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
  'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW',
]);

function getRequestOrigin(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function isBillingTestMode() {
  return String(process.env.QAY_BILLING_TEST_MODE || '').toLowerCase() === 'true';
}

function getHeader(request: Request, name: string) {
  return request.headers.get(name)?.trim().toUpperCase() || '';
}

function isAfricanRequest(request: Request) {
  const continent =
    getHeader(request, 'x-vercel-ip-continent')
    || getHeader(request, 'cf-ipcontinent')
    || getHeader(request, 'x-continent-code');

  if (continent === 'AF') return true;

  const country =
    getHeader(request, 'x-vercel-ip-country')
    || getHeader(request, 'cf-ipcountry')
    || getHeader(request, 'x-country-code');

  return AFRICAN_COUNTRIES.has(country);
}

function chooseBillingProvider(request: Request): 'flutterwave' | 'lemonsqueezy' {
  const preferFlutterwave = isAfricanRequest(request);
  const flutterwaveReady = isFlutterwaveConfigured();
  const lemonReady = isLemonSqueezyConfigured();

  if (preferFlutterwave && flutterwaveReady) return 'flutterwave';
  if (!preferFlutterwave && lemonReady) return 'lemonsqueezy';
  if (lemonReady) return 'lemonsqueezy';
  return 'flutterwave';
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

    const provider = chooseBillingProvider(request);
    const checkoutInput = {
      plan,
      userId: user.id,
      customer: {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.display_name || user.email,
      },
      redirectUrl: provider === 'lemonsqueezy'
        ? `${origin}/api/qay/billing/verify?provider=lemonsqueezy&plan=${plan}`
        : `${origin}/api/qay/billing/verify`,
    };

    const checkout = provider === 'lemonsqueezy'
      ? await createLemonCheckout(checkoutInput)
      : await createFlutterwaveCheckout(checkoutInput);

    return NextResponse.json({ data: checkout });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start checkout' },
      { status: 500 }
    );
  }
}
