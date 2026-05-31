import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteQaySiteVisitorSession, getSiteAuthCookieName } from '@/qay/lib/site-auth';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { siteId } = await context.params;
  const cookieName = getSiteAuthCookieName(siteId);
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  await deleteQaySiteVisitorSession(siteId, token);

  const response = NextResponse.json({ data: { ok: true } });
  response.cookies.set(cookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
