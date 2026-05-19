'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { QayAccountMode, QayAccountProfile } from '@/qay/lib/account';

type AccountSettingsFormProps = {
  profile: QayAccountProfile;
  role?: QayAccountMode;
};

const modes: Array<{ value: QayAccountMode; title: string; body: string }> = [
  {
    value: 'developer',
    title: 'Developer mode',
    body: 'Full builder access, publishing, settings, integrations, and client handoff.',
  },
  {
    value: 'client',
    title: 'Client mode',
    body: 'A focused dashboard for content, CMS updates, media review, and analytics.',
  },
];

export function AccountSettingsForm({ profile, role = profile.account_type }: AccountSettingsFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveSettings() {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/qay/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName }),
      });
      const payload = await response.json();

      if (!response.ok || payload.error) {
        setError(payload.error || 'Unable to save account settings');
        return;
      }

      setMessage('Account settings saved');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save account settings');
    } finally {
      setSaving(false);
    }
  }

  const helperText = role === 'client'
    ? 'These details appear across your client dashboard and shared site access.'
    : 'These details appear across your QAY dashboard and collaboration tools.';

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-xl font-semibold tracking-normal">Account details</h2>
        <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
        <p className="mt-2 text-sm text-muted-foreground">{helperText}</p>
      </div>

      <div className="mt-6 space-y-6">
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-foreground">Full name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
          />
        </label>

        {message && <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">{message}</p>}
        {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}

type AccountModeSettingsFormProps = {
  profile: QayAccountProfile;
};

export function AccountModeSettingsForm({ profile }: AccountModeSettingsFormProps) {
  const router = useRouter();
  const [accountType, setAccountType] = useState<QayAccountMode>(profile.account_type);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveSettings() {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/qay/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_type: accountType }),
      });
      const payload = await response.json();

      if (!response.ok || payload.error) {
        setError(payload.error || 'Unable to save account settings');
        return;
      }

      setMessage('Account settings saved');
      router.refresh();

      if (accountType !== profile.account_type) {
        window.location.assign(accountType === 'client' ? '/client' : '/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save account settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-xl font-semibold tracking-normal">Workspace mode</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which dashboard opens first when you sign in. You can change this when your workflow changes.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-foreground">Account mode</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {modes.map((mode) => {
              const selected = accountType === mode.value;

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setAccountType(mode.value)}
                  className={`rounded-lg border p-4 text-left transition ${
                    selected
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-foreground hover:bg-accent'
                  }`}
                >
                  <span className="block text-sm font-medium">{mode.title}</span>
                  <span className={`mt-2 block text-sm leading-5 ${selected ? 'text-background/70' : 'text-muted-foreground'}`}>
                    {mode.body}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {message && <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">{message}</p>}
        {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
