'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import type { ClientPendingInvite } from '@/qay/lib/client-content';

type PendingInvitesProps = {
  invites: ClientPendingInvite[];
};

export function PendingInvites({ invites }: PendingInvitesProps) {
  const router = useRouter();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (invites.length === 0) {
    return null;
  }

  async function acceptInvite(invite: ClientPendingInvite) {
    setAcceptingId(invite.id);
    setError(null);

    try {
      const response = await fetch('/api/qay/invites/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: invite.token }),
      });
      const payload = await response.json();

      if (!response.ok || payload.error) {
        setError(payload.error || 'Unable to accept invite');
        return;
      }

      router.push(payload.data.redirectUrl || `/client/${payload.data.siteId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to accept invite');
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <section className="mb-8 rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-medium">Pending invitations</h2>
        <p className="mt-1 text-sm text-muted-foreground">Accept shared sites directly from your dashboard.</p>
      </div>

      {error && <div className="mx-5 mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</div>}

      <div className="divide-y divide-border">
        {invites.map((invite) => (
          <div key={invite.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-md border border-border bg-muted text-xs font-medium text-muted-foreground">
                {(invite.site?.name || 'QAY').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{invite.site?.name || 'Shared site'}</p>
                <p className="text-xs text-muted-foreground">Role: {invite.role}</p>
                {invite.site?.live_url && (
                  <a
                    href={invite.site.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex max-w-[240px] truncate text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:max-w-md"
                  >
                    {invite.site.live_url}
                  </a>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => acceptInvite(invite)}
              disabled={acceptingId === invite.id}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" />
              {acceptingId === invite.id ? 'Accepting...' : 'Accept invite'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
