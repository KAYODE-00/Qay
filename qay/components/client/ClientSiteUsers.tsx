'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type ClientSiteUsersProps = {
  siteId: string;
};

type SiteUser = {
  id: string;
  email: string;
  full_name: string | null;
  provider: string;
  created_at: string | null;
  last_sign_in_at: string | null;
};

type Counts = {
  total: number;
  password: number;
  social: number;
  active: number;
};

function formatDate(value: string | null) {
  if (!value) return 'Never';
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

export function ClientSiteUsers({ siteId }: ClientSiteUsersProps) {
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, password: 0, social: 0, active: 0 });
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [messagePanelOpen, setMessagePanelOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) => (
      user.email.toLowerCase().includes(needle)
      || (user.full_name || '').toLowerCase().includes(needle)
      || user.provider.toLowerCase().includes(needle)
    ));
  }, [query, users]);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/qay/sites/${siteId}/auth/users`, { cache: 'no-store' });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to load site users');
      }

      setUsers(result?.data?.users || []);
      setCounts(result?.data?.counts || { total: 0, password: 0, social: 0, active: 0 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load site users');
    } finally {
      setIsLoading(false);
    }
  }

  function toggleSelectedUser(userId: string) {
    setSelectedUserIds((current) => (
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    ));
  }

  async function sendMessage() {
    try {
      setIsSending(true);
      const response = await fetch(`/api/qay/sites/${siteId}/auth/users/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: sendToAll ? 'all' : 'selected',
          userIds: selectedUserIds,
          subject: messageSubject,
          message: messageBody,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to send message');
      }

      const sent = result?.data?.sent || 0;
      const failed = result?.data?.failed || 0;
      if (failed > 0) {
        toast.warning(`Sent to ${sent}; ${failed} failed. Check SMTP settings if failures continue.`);
      } else {
        toast.success(`Message sent to ${sent} site user${sent === 1 ? '' : 's'}.`);
      }
      setMessagePanelOpen(false);
      setMessageSubject('');
      setMessageBody('');
      setSendToAll(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send message');
    } finally {
      setIsSending(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  return (
    <div className="max-w-5xl">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Visitor backend</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal">Site users</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Visitor accounts created on this protected site. These accounts are scoped to this site only.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ['Total users', counts.total],
          ['Password users', counts.password],
          ['Social users', counts.social],
          ['Signed in before', counts.active],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-2xl font-semibold">{value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-medium">Visitor accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Password recovery is handled through the site Forgot password and Reset password pages.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setMessagePanelOpen((open) => !open)}
              disabled={users.length === 0}
            >
              Message users
            </Button>
            <Input
              value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users" className="h-9 w-56"
            />
            <Button
              size="sm" variant="secondary"
              onClick={loadUsers} disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {messagePanelOpen && (
          <div className="border-b border-border bg-muted/20 px-5 py-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr_auto] lg:items-end">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="site-user-email-subject">Subject</label>
                <Input
                  id="site-user-email-subject"
                  value={messageSubject}
                  onChange={(event) => setMessageSubject(event.target.value)}
                  placeholder="Update from this site"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="site-user-email-message">Message</label>
                <Textarea
                  id="site-user-email-message"
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  placeholder="Write the email content..."
                  className="min-h-24"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={sendToAll}
                    onChange={(event) => setSendToAll(event.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  Send to all
                </label>
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={isSending || (!sendToAll && selectedUserIds.length === 0)}
                >
                  {isSending
                    ? 'Sending...'
                    : sendToAll
                      ? `Send to ${users.length}`
                      : `Send to ${selectedUserIds.length || 0}`}
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              QAY sends the email through the configured sender for deliverability. The message template shows your account email as the sender, and replies go back to your email.
            </p>
          </div>
        )}

        {isLoading && users.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            {users.length === 0 ? 'No visitor accounts yet.' : 'No users match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[44px_1.2fr_1.4fr_0.8fr_1fr_1fr] gap-3 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground">
                <span>Select</span>
                <span>Name</span>
                <span>Email</span>
                <span>Provider</span>
                <span>Joined</span>
                <span>Last sign in</span>
              </div>
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-[44px_1.2fr_1.4fr_0.8fr_1fr_1fr] gap-3 border-b border-border px-5 py-3 text-xs last:border-b-0">
                  <span>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleSelectedUser(user.id)}
                      className="h-4 w-4 rounded border-border"
                      aria-label={`Select ${user.email}`}
                    />
                  </span>
                  <span className="truncate font-medium">{user.full_name || 'No name'}</span>
                  <span className="truncate text-muted-foreground">{user.email}</span>
                  <span className="truncate capitalize text-muted-foreground">{user.provider}</span>
                  <span className="truncate text-muted-foreground">{formatDate(user.created_at)}</span>
                  <span className="truncate text-muted-foreground">{formatDate(user.last_sign_in_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
