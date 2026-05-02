import { credentials } from '@/lib/credentials';
import { parseSupabaseConfig } from '@/lib/supabase-config-parser';
import { noCache } from '@/lib/api-response';
import type { SupabaseConfig } from '@/types';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getPublicSupabaseConfigFromEnv() {
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!anonKey) {
    return null;
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey,
    };
  }

  const projectRef = process.env.SUPABASE_CONNECTION_URL?.match(/postgres\.([^:]+):/)?.[1];

  if (!projectRef) {
    return null;
  }

  return {
    url: `https://${projectRef}.supabase.co`,
    anonKey,
  };
}

/**
 * GET /ycode/api/supabase/config
 *
 * Returns public Supabase configuration (URL and anon key only)
 * Used by browser client for authentication
 */
export async function GET() {
  try {
    const envConfig = getPublicSupabaseConfigFromEnv();

    if (envConfig) {
      return noCache({
        data: envConfig,
      });
    }

    const config = await credentials.get<SupabaseConfig>('supabase_config');

    if (!config) {
      // Config not found - return 404 (expected during setup)
      return noCache(
        { error: 'Supabase not configured. Please complete the setup wizard first.' },
        404
      );
    }

    // Parse config to get the full credentials including projectUrl
    // If parsing fails, treat it as not configured (return 404 instead of 500)
    let parsed;
    try {
      parsed = parseSupabaseConfig(config);
    } catch (parseError) {
      console.error('Failed to parse Supabase config:', parseError);
      return noCache(
        { error: 'Supabase not configured. Please complete the setup wizard first.' },
        404
      );
    }

    return noCache({
      data: {
        url: parsed.projectUrl,
        anonKey: parsed.anonKey,
      },
    });
  } catch (error) {
    // Unexpected errors - log but return 404 to prevent breaking the app
    console.error('Failed to get Supabase config:', error);

    return noCache(
      { error: 'Supabase not configured. Please complete the setup wizard first.' },
      404
    );
  }
}
