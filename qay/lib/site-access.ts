import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';
import { getQayAdmin } from './supabase-admin';

type SiteAccess = {
  allowed: boolean;
  user: User | null;
  role: 'owner' | 'member' | null;
};

function getSupabaseProjectUrl(): string {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  const connectionUrl = process.env.SUPABASE_CONNECTION_URL;
  const projectRef = connectionUrl?.match(/postgres\.([^:]+):/)?.[1];
  if (!projectRef) {
    throw new Error('Supabase URL is not configured');
  }

  return `https://${projectRef}.supabase.co`;
}

async function getRequestUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    getSupabaseProjectUrl(),
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components can read cookies but cannot always write refreshed auth cookies.
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getQaySiteAccess(siteId: string): Promise<SiteAccess> {
  const user = await getRequestUser();
  if (!user) {
    return { allowed: false, user: null, role: null };
  }

  const supabase = getQayAdmin() as any;

  const { data: ownedSite, error: ownedSiteError } = await supabase
    .from('qay_sites')
    .select('id')
    .eq('id', siteId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (ownedSiteError) {
    throw new Error(ownedSiteError.message);
  }

  if (ownedSite) {
    return { allowed: true, user, role: 'owner' };
  }

  const { data: membership, error: membershipError } = await supabase
    .from('qay_site_members')
    .select('id')
    .eq('site_id', siteId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  return {
    allowed: Boolean(membership),
    user,
    role: membership ? 'member' : null,
  };
}

export async function canAccessQaySite(siteId: string): Promise<boolean> {
  const access = await getQaySiteAccess(siteId);
  return access.allowed;
}
