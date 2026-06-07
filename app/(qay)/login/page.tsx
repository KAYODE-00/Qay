'use client';

import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';
import { createClient } from '@/lib/supabase-browser';
import { useAuthStore } from '@/stores/useAuthStore';
import { buildPublicAppUrl } from '@/qay/lib/public-app-url';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const { signIn, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function routeByProfile(userId: string) {
    if (inviteToken) {
      window.location.assign(`/invite/${inviteToken}`);
      return;
    }

    const supabase = await createClient();
    const { data } = await supabase
      .from('qay_user_profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();

    window.location.assign(data?.account_type === 'client' ? '/client' : '/dashboard');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Unable to load your account.');
      return;
    }

    await routeByProfile(user.id);
  }

  async function handleGoogleSignIn() {
    setError(null);

    try {
      const supabase = await createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildPublicAppUrl('/ycode/api/auth/callback?next=/dashboard'),
        },
      });

      if (oauthError) setError(oauthError.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <QayLogo theme="light" />
        </div>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-center text-2xl font-semibold tracking-normal">Welcome back</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm text-muted-foreground">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
              />
            </label>

            <label className="block space-y-2 text-sm text-muted-foreground">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
              />
            </label>

            {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-3 h-11 w-full rounded-md border border-border px-4 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Continue with Google
          </button>

          <div className="mt-4 space-y-3 text-center text-sm text-muted-foreground">
            <a
              href="/forgot-password"
              className="flex h-10 w-full items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
            >
              Forgot password?
            </a>
            <p>
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-foreground hover:text-muted-foreground">
                Sign up
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginPageContent />
    </Suspense>
  );
}
