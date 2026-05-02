import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Public API routes that skip authentication.
 */
const PUBLIC_API_PREFIXES = [
  '/ycode/api/supabase/', // Supabase config — needed for browser client init
  '/ycode/api/auth/',     // Auth callbacks and session checks
  '/ycode/api/v1/',       // Public API — has own API key auth
];

/**
 * Patterns for collection item endpoints that must be accessible on published pages
 * (load-more pagination, filter). Matched via regex since the collection ID is dynamic.
 */
const PUBLIC_COLLECTION_ITEM_SUFFIXES = ['/items/filter', '/items/load-more'];

const PUBLIC_API_EXACT = [
  '/ycode/api/revalidate', // Cache revalidation — has own secret token auth
  '/ycode/api/setup/status',
  '/ycode/api/setup/check-email-confirm',
];

const BLOCKED_YCODE_PAGE_PREFIXES = [
  '/ycode/welcome',
  '/ycode/devtools',
];

const BLOCKED_YCODE_SETUP_API_PREFIXES = [
  '/ycode/api/setup/connect',
  '/ycode/api/setup/run-migrations',
  '/ycode/api/setup/complete',
  '/ycode/api/devtools/run-migrations',
  '/ycode/api/devtools/reset-db',
];

/**
 * Derive the Supabase project URL and anon key from environment variables.
 * Returns null if env vars are not set (pre-setup or local dev without .env.local).
 */
function getSupabaseEnvConfig(): { url: string; anonKey: string } | null {
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY
    || process.env.SUPABASE_ANON_KEY;
  const connectionUrl = process.env.SUPABASE_CONNECTION_URL;

  if (!anonKey || !connectionUrl) return null;

  // Extract project ID from connection URL
  // e.g. "postgresql://postgres.abc123:..." → "abc123"
  const match = connectionUrl.match(/\/\/postgres\.([a-z0-9]+):/);
  if (!match) return null;

  return {
    url: `https://${match[1]}.supabase.co`,
    anonKey,
  };
}

function isPublicApiRoute(pathname: string, method: string): boolean {
  // POST to form-submissions is public (website visitors submitting forms)
  if (pathname === '/ycode/api/form-submissions' && method === 'POST') {
    return true;
  }

  if (PUBLIC_API_EXACT.includes(pathname)) return true;
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;

  // Collection item endpoints for published pages (POST only — filter, load-more)
  if (method === 'POST' && pathname.startsWith('/ycode/api/collections/') &&
      PUBLIC_COLLECTION_ITEM_SUFFIXES.some(suffix => pathname.endsWith(suffix))) {
    return true;
  }

  return false;
}

/**
 * Verify Supabase session for protected API routes.
 * Returns a 401 response if not authenticated, or null to continue.
 */
async function verifyApiAuth(request: NextRequest): Promise<NextResponse | null> {
  if (isPublicApiRoute(request.nextUrl.pathname, request.method)) {
    return null;
  }

  const config = getSupabaseEnvConfig();

  // If env vars aren't set (pre-setup or local dev without .env.local), let through
  if (!config) return null;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  return null;
}

async function getRequestUser(request: NextRequest): Promise<{ authenticated: boolean; response: NextResponse }> {
  const config = getSupabaseEnvConfig();
  let response = NextResponse.next({ request });

  if (!config) {
    return { authenticated: false, response };
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return { authenticated: Boolean(user), response };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/ycode')) {
    if (BLOCKED_YCODE_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (BLOCKED_YCODE_SETUP_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.json(
        { error: 'Ycode setup is disabled in QAY' },
        { status: 404 }
      );
    }
  }

  // MCP endpoint uses its own token-based authentication — skip session auth.
  // Cloud overlay proxies MUST also exempt this path to avoid login redirects.
  if (pathname.startsWith('/ycode/mcp/')) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Protect API and preview routes with auth
  if (pathname.startsWith('/ycode/api') || pathname.startsWith('/ycode/preview')) {
    const authResponse = await verifyApiAuth(request);
    if (authResponse) {
      if (pathname.startsWith('/ycode/preview')) {
        return NextResponse.redirect(new URL('/ycode', request.url));
      }
      return authResponse;
    }
  }

  if (
    pathname.startsWith('/ycode')
    && !pathname.startsWith('/ycode/api')
    && !pathname.startsWith('/ycode/preview')
    && !pathname.startsWith('/ycode/mcp/')
  ) {
    const { authenticated, response: authResponse } = await getRequestUser(request);
    if (!authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    authResponse.headers.set('x-pathname', pathname);
    return authResponse;
  }

  const isPublicPage = !pathname.startsWith('/ycode')
    && !pathname.startsWith('/_next')
    && !pathname.startsWith('/api')
    && !pathname.startsWith('/dynamic');
  const hasPaginationParams = Array.from(request.nextUrl.searchParams.keys())
    .some((key) => key.startsWith('p_'));

  if (isPublicPage && hasPaginationParams) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname === '/' ? '/dynamic' : `/dynamic${pathname}`;

    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    rewriteResponse.headers.set('x-pathname', pathname);
    return rewriteResponse;
  }

  // Create response
  const response = NextResponse.next();

  // Add pathname header for layout to determine dark mode
  response.headers.set('x-pathname', pathname);

  // Cache-Control for public pages is configured centrally via next.config.ts headers().

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
