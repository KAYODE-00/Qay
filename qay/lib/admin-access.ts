import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const QAY_ADMIN_ACCESS_COOKIE = 'qay_admin_access';

function normalizeSecret(value: string | undefined) {
  return (value || '').trim().replace(/^["']|["']$/g, '');
}

function adminPassword() {
  return normalizeSecret(process.env.QAY_ADMIN_ACCESS_PASSWORD);
}

function adminSigningSecret() {
  return normalizeSecret(process.env.QAY_ADMIN_ACCESS_SECRET) || adminPassword();
}

function configuredAdminEmails() {
  return (process.env.QAY_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredQayAdmin(user: Pick<User, 'email'> | null | undefined) {
  const emails = configuredAdminEmails();
  if (!emails.length) return false;
  return !!user?.email && emails.includes(user.email.toLowerCase());
}

export function isQayAdminPassword(value: unknown) {
  const password = adminPassword();
  return typeof value === 'string' && !!password && value.trim() === password;
}

function signAdminCookie(userId: string) {
  const secret = adminSigningSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(userId).digest('hex');
}

function constantEquals(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createQayAdminAccessCookieValue(userId: string) {
  const signature = signAdminCookie(userId);
  return signature ? `${userId}.${signature}` : null;
}

export function verifyQayAdminAccessCookie(value: string | undefined | null, userId: string) {
  if (!value) return false;
  const [cookieUserId, signature] = value.split('.');
  if (!cookieUserId || !signature || cookieUserId !== userId) return false;

  const expected = signAdminCookie(userId);
  return !!expected && constantEquals(signature, expected);
}

export async function hasQayAdminAccess(user: Pick<User, 'id' | 'email'> | null | undefined) {
  if (!user || !isConfiguredQayAdmin(user)) return false;
  const cookieStore = await cookies();
  return verifyQayAdminAccessCookie(cookieStore.get(QAY_ADMIN_ACCESS_COOKIE)?.value, user.id);
}

export function hasQayAdminAccessFromRequest(
  request: NextRequest,
  user: Pick<User, 'id' | 'email'> | null | undefined
) {
  if (!user || !isConfiguredQayAdmin(user)) return false;
  return verifyQayAdminAccessCookie(request.cookies.get(QAY_ADMIN_ACCESS_COOKIE)?.value, user.id);
}
