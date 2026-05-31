'use client';

import { useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { QayAccountMode, QayAccountProfile } from '@/qay/lib/account';
import { getQayPlan } from '@/qay/lib/billing/plan-limits';

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
  const currentPlan = getQayPlan(profile.plan);
  const displayPlan = currentPlan;
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [email, setEmail] = useState(profile.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');
  const [company, setCompany] = useState(profile.company ?? '');
  const [website, setWebsite] = useState(profile.website ?? '');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
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
        body: JSON.stringify({
          full_name: fullName,
          email,
          avatar_url: avatarUrl,
          company,
          website,
        }),
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

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/ycode/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || payload.error) {
        setError(payload.error || 'Unable to upload profile photo');
        return;
      }

      const nextAvatarUrl = payload.data?.avatar_url;
      if (typeof nextAvatarUrl === 'string') {
        setAvatarUrl(nextAvatarUrl);
        setMessage('Profile photo ready. Save settings to keep it on your QAY account.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload profile photo');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm('Delete this account? This permanently removes your QAY access.');
    if (!confirmed) return;

    const typed = window.prompt('Type DELETE to confirm account deletion.');
    if (typed !== 'DELETE') return;

    setDeletingAccount(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/qay/account', { method: 'DELETE' });
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.error) {
        setError(payload?.error || 'Unable to delete account');
        return;
      }

      window.location.assign('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete account');
    } finally {
      setDeletingAccount(false);
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-xl font-semibold text-muted-foreground">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl} alt=""
                className="size-full object-cover"
              />
            ) : (
              (fullName || profile.email || 'Q').slice(0, 1).toUpperCase()
            )}
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition hover:bg-accent">
            {uploadingAvatar ? 'Uploading...' : 'Set profile photo'}
            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploadingAvatar}
              className="sr-only"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-medium text-foreground">Full name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium text-foreground">Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-foreground">Company</span>
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-foreground">Website</span>
            <input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://example.com"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
            />
          </label>
        </div>

        {message && <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">{message}</p>}
        {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving || uploadingAvatar || deletingAccount}
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>

        <div className="border-t border-border pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Current plan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You are on <span className="font-medium text-foreground">{displayPlan.name}</span>
                {displayPlan.price > 0 ? ` at $${displayPlan.price}/month` : ''}.
              </p>
              {!displayPlan.isAvailable && displayPlan.key === 'pro' && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Pro is private access for now, so payment is disabled while these features are being prepared.
                </p>
              )}
            </div>
            <span className="inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {displayPlan.name}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade when you need more publishing, collaboration, or custom domain features.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Upgrade plan
          </Link>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-sm font-medium text-foreground">Delete account</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently remove your QAY account access.
          </p>
          <button
            type="button"
            onClick={deleteAccount}
            disabled={saving || uploadingAvatar || deletingAccount}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-md border border-red-500/40 px-4 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingAccount ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
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
  const [canEditMode, setCanEditMode] = useState(false);
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
          <button
            type="button"
            onClick={() => setCanEditMode(true)}
            className="mt-3 inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium transition hover:bg-accent"
          >
            Edit workspace mode
          </button>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {modes.map((mode) => {
              const selected = accountType === mode.value;

              return (
                <button
                  key={mode.value}
                  type="button"
                  disabled={!canEditMode || saving}
                  onClick={() => setAccountType(mode.value)}
                  className={`rounded-lg border p-4 text-left transition ${
                    selected
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-foreground hover:bg-accent'
                  } disabled:cursor-not-allowed disabled:opacity-70`}
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
          disabled={saving || !canEditMode}
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
