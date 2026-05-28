'use client';

import { FormEvent, useEffect, useState } from 'react';

export function AdminUnlock() {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keys: string[] = [];
    const handler = (event: KeyboardEvent) => {
      keys.push(event.key.toLowerCase());
      keys.splice(0, Math.max(0, keys.length - 8));

      if (event.ctrlKey && event.altKey && event.shiftKey && event.key.toLowerCase() === 'q') {
        event.preventDefault();
        setVisible((current) => !current);
        return;
      }

      if (keys.join('').endsWith('qayadmin')) {
        setVisible(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/qay/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to unlock');
      }

      setPassword('');
      setMessage('Unlocked');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to unlock');
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <form
      onSubmit={unlock}
      className="fixed bottom-4 right-4 z-[100] flex w-72 flex-col gap-2 rounded-lg border border-border bg-background p-3 text-foreground shadow-xl"
    >
      <label className="text-xs font-medium" htmlFor="qay-admin-unlock">Admin access</label>
      <input
        id="qay-admin-unlock"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-foreground"
        autoFocus
      />
      <button
        type="submit"
        disabled={loading}
        className="h-9 rounded-md bg-foreground text-sm font-medium text-background disabled:opacity-60"
      >
        {loading ? 'Checking...' : 'Unlock'}
      </button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </form>
  );
}
