import 'server-only';

import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { getQayAdmin } from './supabase-admin';
import { listPublicQaySiteSettings } from './site-settings';

export type QaySiteAuthSettings = {
  enabled: boolean;
  allowSignup: boolean;
  provider: 'qay' | 'connected_supabase';
  socialLogin: boolean;
};

export type QaySiteAuthUser = {
  id: string;
  site_id: string;
  email: string;
  full_name: string | null;
  provider: string;
};

const SESSION_DAYS = 30;
const TOKEN_BYTES = 32;
const PASSWORD_RESET_MINUTES = 60;

export function getSiteAuthCookieName(siteId: string) {
  return `qay_site_auth_${siteId.replace(/-/g, '')}`;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string | null | undefined) {
  if (!stored) return false;
  const [scheme, salt, hash] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const nextHash = crypto.scryptSync(password, salt, 64);
  const storedHash = Buffer.from(hash, 'hex');
  return storedHash.length === nextHash.length && crypto.timingSafeEqual(storedHash, nextHash);
}

function normalizeAuthSettings(value: unknown): QaySiteAuthSettings {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    enabled: record.enabled === true,
    allowSignup: record.allowSignup !== false,
    provider: record.provider === 'connected_supabase' ? 'connected_supabase' : 'qay',
    socialLogin: record.socialLogin === true,
  };
}

export async function getQaySiteAuthSettings(siteId: string): Promise<QaySiteAuthSettings> {
  const settings = await listPublicQaySiteSettings(siteId, ['site_auth']);
  return normalizeAuthSettings(settings.site_auth);
}

export async function getQaySiteVisitor(siteId: string): Promise<QaySiteAuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSiteAuthCookieName(siteId))?.value;
  if (!token) return null;

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_auth_sessions')
    .select('id, expires_at, user:qay_site_auth_users(id, site_id, email, full_name, provider)')
    .eq('site_id', siteId)
    .eq('token_hash', hashToken(token))
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data?.user) {
    return null;
  }

  return Array.isArray(data.user) ? data.user[0] : data.user;
}

export async function createQaySiteVisitorSession(siteId: string, userId: string) {
  const token = crypto.randomBytes(TOKEN_BYTES).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const supabase = getQayAdmin() as any;

  const { error } = await supabase
    .from('qay_site_auth_sessions')
    .insert({
      site_id: siteId,
      user_id: userId,
      token_hash: hashToken(token),
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }

  return { token, expiresAt };
}

export async function createQaySiteAuthUser(siteId: string, input: { email: string; password: string; fullName?: string }) {
  const email = normalizeEmail(input.email);
  if (!email || !email.includes('@')) {
    throw new Error('Enter a valid email address.');
  }
  if (input.password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_auth_users')
    .insert({
      site_id: siteId,
      email,
      password_hash: hashPassword(input.password),
      full_name: input.fullName?.trim() || null,
      provider: 'password',
      last_sign_in_at: new Date().toISOString(),
    })
    .select('id, site_id, email, full_name, provider')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('An account already exists for this email on this site.');
    }
    throw new Error(error.message);
  }

  return data as QaySiteAuthUser;
}

export async function requestQaySitePasswordReset(siteId: string, input: { email: string }) {
  const email = normalizeEmail(input.email);
  if (!email || !email.includes('@')) {
    throw new Error('Enter a valid email address.');
  }

  const supabase = getQayAdmin() as any;
  const { data: user, error } = await supabase
    .from('qay_site_auth_users')
    .select('id, site_id, email, full_name, provider')
    .eq('site_id', siteId)
    .eq('email', email)
    .eq('provider', 'password')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    return { email, token: null, expiresAt: null };
  }

  await supabase
    .from('qay_site_auth_password_resets')
    .update({ used_at: new Date().toISOString() })
    .eq('site_id', siteId)
    .eq('user_id', user.id)
    .is('used_at', null);

  const token = crypto.randomBytes(TOKEN_BYTES).toString('base64url');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_MINUTES * 60 * 1000);
  const { error: insertError } = await supabase
    .from('qay_site_auth_password_resets')
    .insert({
      site_id: siteId,
      user_id: user.id,
      token_hash: hashToken(token),
      expires_at: expiresAt.toISOString(),
    });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return { email, token, expiresAt };
}

export async function resetQaySitePassword(siteId: string, input: { token: string; password: string }) {
  const token = input.token?.trim();
  if (!token) {
    throw new Error('Reset link is missing or invalid.');
  }
  if (input.password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const supabase = getQayAdmin() as any;
  const { data: reset, error } = await supabase
    .from('qay_site_auth_password_resets')
    .select('id, user_id, expires_at')
    .eq('site_id', siteId)
    .eq('token_hash', hashToken(token))
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!reset) {
    throw new Error('Reset link is invalid or expired.');
  }

  const { data: user, error: updateError } = await supabase
    .from('qay_site_auth_users')
    .update({
      password_hash: hashPassword(input.password),
      updated_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    })
    .eq('site_id', siteId)
    .eq('id', reset.user_id)
    .select('id, site_id, email, full_name, provider')
    .single();

  if (updateError || !user) {
    throw new Error(updateError?.message || 'Unable to reset password.');
  }

  await Promise.all([
    supabase
      .from('qay_site_auth_password_resets')
      .update({ used_at: new Date().toISOString() })
      .eq('id', reset.id),
    supabase
      .from('qay_site_auth_sessions')
      .delete()
      .eq('site_id', siteId)
      .eq('user_id', reset.user_id),
  ]);

  return user as QaySiteAuthUser;
}

export async function verifyQaySiteAuthUser(siteId: string, input: { email: string; password: string }) {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_auth_users')
    .select('id, site_id, email, full_name, provider, password_hash')
    .eq('site_id', siteId)
    .eq('email', normalizeEmail(input.email))
    .eq('provider', 'password')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data || !verifyPassword(input.password, data.password_hash)) {
    throw new Error('Email or password is incorrect.');
  }

  await supabase
    .from('qay_site_auth_users')
    .update({ last_sign_in_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', data.id);

  return {
    id: data.id,
    site_id: data.site_id,
    email: data.email,
    full_name: data.full_name,
    provider: data.provider,
  } as QaySiteAuthUser;
}

export async function deleteQaySiteVisitorSession(siteId: string, token: string | undefined) {
  if (!token) return;
  const supabase = getQayAdmin() as any;
  await supabase
    .from('qay_site_auth_sessions')
    .delete()
    .eq('site_id', siteId)
    .eq('token_hash', hashToken(token));
}
