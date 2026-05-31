'use client';

import { useState } from 'react';

type SiteAuthGateProps = {
  siteId: string;
  allowSignup: boolean;
  variant?: 'page' | 'panel';
  defaultMode?: 'signin' | 'signup' | 'forgot-password' | 'reset-password';
};

function getPostAuthRedirectUrl() {
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (['auth', 'login', 'signup', 'forgot-password', 'reset-password'].includes(lastSegment || '')) {
    segments.pop();
    url.pathname = segments.length ? `/${segments.join('/')}` : '/';
    url.search = '';
  }

  return url.toString();
}

export function SiteAuthGate({ siteId, allowSignup, variant = 'page', defaultMode = 'signin' }: SiteAuthGateProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password' | 'reset-password'>(defaultMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSignup = allowSignup;
  const activeMode = !canSignup && mode === 'signup' ? 'signin' : mode;

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = new URLSearchParams(window.location.search).get('token') || '';
      const response = await fetch(`/api/qay/site-auth/${siteId}/${activeMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, token }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.error) {
        throw new Error(payload?.error || 'Unable to continue.');
      }

      if (activeMode === 'forgot-password') {
        setSuccess(
          payload?.data?.devResetUrl
            ? `Reset link created for testing: ${payload.data.devResetUrl}`
            : 'If an account exists, a reset link has been sent.'
        );
        return;
      }

      window.location.assign(getPostAuthRedirectUrl());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const Wrapper = variant === 'page' ? 'main' : 'section';

  return (
    <Wrapper className={`${variant === 'page' ? 'min-h-screen bg-[#090909]' : ''} flex items-center justify-center px-6 py-12 text-white`}>
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/40">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">Protected site</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            {activeMode === 'signup'
              ? 'Create access'
              : activeMode === 'forgot-password'
                ? 'Recover your account'
                : activeMode === 'reset-password'
                  ? 'Set a new password'
                  : 'Sign in to continue'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/58">
            {activeMode === 'forgot-password'
              ? 'Enter the email you used for this site. If it exists, a reset link will be sent.'
              : activeMode === 'reset-password'
                ? 'Choose a fresh password for this visitor account.'
                : 'This site requires a visitor account. Your login is scoped only to this site.'}
          </p>
        </div>

        {canSignup && (
          <div className="mt-6 grid grid-cols-2 rounded-md border border-white/10 bg-black/30 p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`h-9 rounded ${activeMode === 'signin' ? 'bg-white text-black' : 'text-white/60'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`h-9 rounded ${activeMode === 'signup' ? 'bg-white text-black' : 'text-white/60'}`}
            >
              Sign up
            </button>
          </div>
        )}

        <form onSubmit={submitAuth} className="mt-6 space-y-4">
          {activeMode === 'signup' && (
            <label className="block space-y-2 text-sm">
              <span className="text-white/70">Name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-white outline-none transition focus:border-white/40"
                placeholder="Jane Doe"
              />
            </label>
          )}

          {activeMode !== 'reset-password' && (
            <label className="block space-y-2 text-sm">
              <span className="text-white/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-white outline-none transition focus:border-white/40"
                placeholder="you@example.com"
                required
              />
            </label>
          )}

          {activeMode !== 'forgot-password' && (
            <label className="block space-y-2 text-sm">
              <span className="text-white/70">{activeMode === 'reset-password' ? 'New password' : 'Password'}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-white outline-none transition focus:border-white/40"
                placeholder="At least 8 characters"
                required
              />
            </label>
          )}

          {error && (
            <p className="rounded-md border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-md border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-md bg-white text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Please wait...'
              : activeMode === 'signup'
                ? 'Create account'
                : activeMode === 'forgot-password'
                  ? 'Send reset link'
                  : activeMode === 'reset-password'
                    ? 'Set new password'
                    : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/58">
          {activeMode === 'signin' && (
            <button
              type="button" className="transition hover:text-white"
              onClick={() => setMode('forgot-password')}
            >
              Forgot password?
            </button>
          )}
          {(activeMode === 'forgot-password' || activeMode === 'reset-password') && (
            <button
              type="button" className="transition hover:text-white"
              onClick={() => setMode('signin')}
            >
              Back to sign in
            </button>
          )}
        </div>
      </section>
    </Wrapper>
  );
}
