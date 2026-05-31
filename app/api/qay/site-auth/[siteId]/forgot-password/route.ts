import { NextResponse } from 'next/server';
import { getQaySiteAuthSettings, requestQaySitePasswordReset } from '@/qay/lib/site-auth';
import { sendQaySitePasswordResetEmail } from '@/qay/lib/site-auth-email';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

function buildResetUrl(request: Request, token: string) {
  const sourceUrl = request.headers.get('referer') || request.url;
  const url = new URL(sourceUrl);
  const segments = url.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (['auth', 'login', 'signup', 'forgot-password', 'reset-password'].includes(lastSegment || '')) {
    segments.pop();
  }

  segments.push('reset-password');
  url.pathname = `/${segments.join('/')}`;
  url.search = '';
  url.searchParams.set('token', token);
  return url.toString();
}

export async function POST(request: Request, context: RouteContext) {
  const { siteId } = await context.params;
  const settings = await getQaySiteAuthSettings(siteId);

  if (!settings.enabled) {
    return NextResponse.json({ error: 'Password recovery is not available for this site.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email : '';

  try {
    const reset = await requestQaySitePasswordReset(siteId, { email });
    let mailSent = false;
    let devResetUrl: string | undefined;

    if (reset.token) {
      const resetUrl = buildResetUrl(request, reset.token);
      mailSent = await sendQaySitePasswordResetEmail({ to: reset.email, resetUrl });

      if (!mailSent) {
        console.warn(`[QAY site auth] Password reset link for ${reset.email}: ${resetUrl}`);
        if (process.env.NODE_ENV !== 'production') {
          devResetUrl = resetUrl;
        }
      }
    }

    return NextResponse.json({
      data: {
        ok: true,
        mailSent,
        devResetUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start password recovery.' },
      { status: 400 }
    );
  }
}
