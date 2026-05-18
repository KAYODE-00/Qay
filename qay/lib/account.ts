import { getQayAdmin } from './supabase-admin';

export type QayAccountMode = 'developer' | 'client';

export type QayAccountProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  account_type: QayAccountMode;
};

function normalizeAccountMode(value: unknown): QayAccountMode {
  return value === 'client' ? 'client' : 'developer';
}

export async function getQayAccountProfile(user: { id: string; email?: string | null }): Promise<QayAccountProfile> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_user_profiles')
    .select('id, full_name, account_type')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: user.id,
    email: user.email ?? null,
    full_name: typeof data?.full_name === 'string' ? data.full_name : null,
    account_type: normalizeAccountMode(data?.account_type),
  };
}
