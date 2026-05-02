import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { credentials } from '@/lib/credentials';
import { cookies } from 'next/headers';

type PublicSupabaseConfig = {
  url: string;
  anonKey: string;
};

async function getPublicSupabaseConfig(): Promise<PublicSupabaseConfig | null> {
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (anonKey) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey,
      };
    }

    const projectRef = process.env.SUPABASE_CONNECTION_URL?.match(/postgres\.([^:]+):/)?.[1];
    if (projectRef) {
      return {
        url: `https://${projectRef}.supabase.co`,
        anonKey,
      };
    }
  }

  const config = await credentials.get<{
    url?: string;
    anonKey?: string;
  }>('supabase_config');

  if (!config?.url || !config?.anonKey) {
    return null;
  }

  return {
    url: config.url,
    anonKey: config.anonKey,
  };
}

/**
 * GET /ycode/api/auth/callback
 * 
 * Handle OAuth callback from Supabase Auth
 * (For future OAuth implementation)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = requestUrl.searchParams.get('next') || '/ycode';
  const safeNextPath = nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/ycode';

  if (code) {
    try {
      const config = await getPublicSupabaseConfig();

      if (!config) {
        return NextResponse.redirect(
          new URL('/login?error=config', request.url)
        );
      }

      const cookieStore = await cookies();

      // Create Supabase client
      const supabase = createServerClient(
        config.url,
        config.anonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            },
          },
        }
      );

      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(
          new URL('/login?error=auth', request.url)
        );
      }

      return NextResponse.redirect(new URL(safeNextPath, request.url));
    } catch (error) {
      console.error('Auth callback failed:', error);
      return NextResponse.redirect(
        new URL('/login?error=server', request.url)
      );
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
