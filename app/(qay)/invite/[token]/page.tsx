'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { createClient } from '@/lib/supabase-browser';

export default function QayInviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('Checking invitation...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepareInvite() {
      try {
        const supabase = await createClient();
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'invite' && accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setError('This invite link is invalid or expired.');
            setLoading(false);
            return;
          }

          setNeedsPassword(true);
          setMessage('Create a password to join this site.');
          setLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.replace(`/login?invite=${encodeURIComponent(token)}`);
          return;
        }

        await acceptInvite();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to open invitation.');
        setLoading(false);
      }
    }

    prepareInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function acceptInvite() {
    const response = await fetch('/api/qay/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || 'Unable to accept invitation.');
    }

    window.location.replace(result.data.redirectUrl || `/client/${result.data.siteId}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = await createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        throw updateError;
      }

      await acceptInvite();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to accept invitation.');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-sm flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <QayLogo theme="light" />
        </div>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-center text-2xl font-semibold tracking-normal">Site invitation</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>

          {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Please wait...</p>}

          {needsPassword && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

              <button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Joining...' : 'Join site'}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-6 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {error && (
            <a href="/login" className="mt-5 block text-center text-sm text-foreground hover:text-muted-foreground">
              Go to login
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
