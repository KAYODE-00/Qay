'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';
import { createClient } from '@/lib/supabase-browser';
import { useAuthStore } from '@/stores/useAuthStore';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const { signIn, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function routeByProfile(userId: string) {
    if (inviteToken) {
      router.push(`/invite/${inviteToken}`);
      return;
    }

    const supabase = await createClient();
    const { data } = await supabase
      .from('qay_user_profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();

    router.push(data?.account_type === 'client' ? '/client' : '/dashboard');
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
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (oauthError) setError(oauthError.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <QayLogo />
        </div>

        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30">
          <h1 className="text-center text-2xl font-semibold tracking-normal">Welcome back</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm text-white/75">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
              />
            </label>

            <label className="block space-y-2 text-sm text-white/75">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
              />
            </label>

            {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-3 h-11 w-full rounded-md border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/5"
          >
            Continue with Google
          </button>

          <div className="mt-6 space-y-3 text-center text-sm text-white/60">
            <Link href="/forgot-password" className="block text-white hover:text-white/80">
              Forgot password?
            </Link>
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-white hover:text-white/80">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginPageContent />
    </Suspense>
  );
}
