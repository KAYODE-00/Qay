import { NextResponse } from 'next/server';
import {
  createQaySiteAuthUser,
  createQaySiteVisitorSession,
  getQaySiteAuthSettings,
  getSiteAuthCookieName,
} from '@/qay/lib/site-auth';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { siteId } = await context.params;
  const settings = await getQaySiteAuthSettings(siteId);

  if (!settings.enabled || !settings.allowSignup) {
    return NextResponse.json({ error: 'Signup is not available for this site.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const fullName = typeof body?.fullName === 'string' ? body.fullName : '';

  try {
    const user = await createQaySiteAuthUser(siteId, { email, password, fullName });
    const session = await createQaySiteVisitorSession(siteId, user.id);
    const response = NextResponse.json({ data: { user } });

    response.cookies.set(getSiteAuthCookieName(siteId), session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: session.expiresAt,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create account.' },
      { status: 400 }
    );
  }
}
