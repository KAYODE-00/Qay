'use client';

import { FormEvent, useState } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';
import { createClient } from '@/lib/supabase-browser';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const supabase = await createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      window.location.assign('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password');
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
          <h1 className="text-center text-2xl font-semibold tracking-normal">Choose a new password</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm text-muted-foreground">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
              />
            </label>

            <label className="block space-y-2 text-sm text-muted-foreground">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
              {loading ? 'Saving...' : 'Save password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Back to{' '}
            <a href="/login" className="text-foreground hover:text-muted-foreground">
              sign in
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
