import { NextResponse } from 'next/server';
import {
  createQayAdminAccessCookieValue,
  isConfiguredQayAdmin,
  isQayAdminPassword,
  QAY_ADMIN_ACCESS_COOKIE,
} from '@/qay/lib/admin-access';
import { getQayAuthUser } from '@/qay/lib/auth-guard';

export async function POST(request: Request) {
  const user = await getQayAuthUser();

  if (!user || !isConfiguredQayAdmin(user)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  if (!isQayAdminPassword(body?.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
  }

  const cookieValue = createQayAdminAccessCookieValue(user.id);
  if (!cookieValue) {
    return NextResponse.json({ error: 'Admin access is not configured' }, { status: 503 });
  }

  const response = NextResponse.json({ data: { unlocked: true } });
  response.cookies.set(QAY_ADMIN_ACCESS_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
