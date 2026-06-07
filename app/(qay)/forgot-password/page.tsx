'use client';

import { FormEvent, useState } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';
import { createClient } from '@/lib/supabase-browser';
import { buildPublicAppUrl } from '@/qay/lib/public-app-url';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = await createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: buildPublicAppUrl('/reset-password'),
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage('Check your email for a reset link.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset link');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <QayLogo theme="light" />
        </div>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-center text-2xl font-semibold tracking-normal">Reset password</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Enter your email and we will send a reset link.</p>

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

            {message && <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{message}</p>}
            {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered it?{' '}
            <a href="/login" className="text-foreground hover:text-muted-foreground">
              Sign in
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
