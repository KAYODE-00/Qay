import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getQayAdmin } from './supabase-admin';

type QayProfileRole = {
  account_type: string | null;
};

function getProjectUrl() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  const connectionUrl = process.env.SUPABASE_CONNECTION_URL;
  const match = connectionUrl?.match(/\/\/postgres\.([a-z0-9]+):/);

  if (!match) {
    throw new Error('Supabase URL is not configured');
  }

  return `https://${match[1]}.supabase.co`;
}

function getAnonKey() {
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!anonKey) {
    throw new Error('Supabase publishable key is not configured');
  }

  return anonKey;
}

export async function requireQayAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(getProjectUrl(), getAnonKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return user;
}

export async function requireDeveloper() {
  const user = await requireQayAuth();
  const supabase = getQayAdmin();

  const { data } = await supabase
    .from('qay_user_profiles')
    .select('account_type')
    .eq('id', user.id)
    .single();

  const profile = data as QayProfileRole | null;

  if (profile?.account_type === 'client') {
    redirect('/client');
  }

  return user;
}

export async function requireClient() {
  const user = await requireQayAuth();
  return user;
}
