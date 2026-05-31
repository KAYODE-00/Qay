import { getQayAdmin } from './supabase-admin';

export type QayAccountMode = 'developer' | 'client';

export type QayAccountProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  website: string | null;
  account_type: QayAccountMode;
  plan: string | null;
};

function normalizeAccountMode(value: unknown): QayAccountMode {
  return value === 'client' ? 'client' : 'developer';
}

export async function getQayAccountProfile(user: { id: string; email?: string | null; app_metadata?: Record<string, unknown> | null }): Promise<QayAccountProfile> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_user_profiles')
    .select('id, full_name, avatar_url, company, website, account_type')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: user.id,
    email: user.email ?? null,
    full_name: typeof data?.full_name === 'string' ? data.full_name : null,
    avatar_url: typeof data?.avatar_url === 'string' ? data.avatar_url : null,
    company: typeof data?.company === 'string' ? data.company : null,
    website: typeof data?.website === 'string' ? data.website : null,
    account_type: normalizeAccountMode(data?.account_type),
    plan: typeof user.app_metadata?.qay_plan === 'string' ? user.app_metadata.qay_plan : 'free',
  };
}
