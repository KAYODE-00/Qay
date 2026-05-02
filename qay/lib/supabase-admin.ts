import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

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

export function getQayAdmin() {
  if (adminClient) return adminClient;

  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error('Supabase secret key is not configured');
  }

  adminClient = createClient(getProjectUrl(), secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return adminClient;
}
