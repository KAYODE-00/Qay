import { NextResponse } from 'next/server';

function redirectToPricing(request: Request, status: 'success' | 'failed', plan?: string) {
  const url = new URL('/pricing', request.url);
  url.searchParams.set('billing', status);
  if (plan) url.searchParams.set('plan', plan);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan') || undefined;

  if (searchParams.get('provider') === 'paddle') {
    return redirectToPricing(request, 'success', plan);
  }

  return redirectToPricing(request, 'failed', plan);
}

export async function POST() {
  return NextResponse.json({
    error: 'Paddle billing is verified by webhook events.',
  }, { status: 405 });
}
