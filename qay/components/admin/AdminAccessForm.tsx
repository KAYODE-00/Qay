'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AdminAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/qay/admin/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || 'Could not unlock admin access.');
      }

      router.replace(next.startsWith('/') ? next : '/admin');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not unlock admin access.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={unlock} className="mt-8 max-w-md rounded-xl border border-border bg-card p-5 shadow-sm">
      <label className="block text-sm font-medium">
        Admin password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
          placeholder="Enter admin access password"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting || !password.trim()}
        className="mt-4 h-12 w-full rounded-md bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Unlocking...' : 'Unlock admin'}
      </button>
      {message ? <p className="mt-3 text-sm text-red-500">{message}</p> : null}
    </form>
  );
}
