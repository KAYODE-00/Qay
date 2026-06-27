'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type AdminEmailUser = {
  id: string;
  email: string;
  lastSignInAt: string | null;
};

type EmailLog = {
  id: string;
  subject: string;
  recipient_count: number;
  provider: string | null;
  status: string;
  created_at: string | null;
  error: string | null;
};

type SendResult = {
  sent: number;
  failed: number;
  provider: string;
  failures?: Array<{ email: string; error: string }>;
};

function formatDate(value: string | null | undefined) {
  if (!value) return 'Never';
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function EmailAdminClient({
  users,
  logs,
  isConfigured,
}: {
  users: AdminEmailUser[];
  logs: EmailLog[];
  isConfigured: boolean;
}) {
  const [mode, setMode] = useState<'all' | 'selected' | 'custom'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  const recipientCount = useMemo(() => {
    if (mode === 'all') return users.length;
    if (mode === 'selected') return selected.length;
    return customEmails.split(/[\s,;]+/).filter(Boolean).length;
  }, [customEmails, mode, selected.length, users.length]);

  const toggleSelected = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const send = async () => {
    setIsSending(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/qay/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          userIds: selected,
          emails: customEmails,
          replyTo,
          subject,
          message,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Failed to send email.');
      setResult(payload.data);
      setSubject('');
      setMessage('');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Send an email</h2>
            <p className="mt-1 text-sm text-muted-foreground">Send real product updates, announcements, and launch messages to QAY users.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${isConfigured ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
            {isConfigured ? 'Email configured' : 'Configure email env'}
          </span>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Recipients</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {(['all', 'selected', 'custom'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm capitalize transition ${mode === item ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-accent'}`}
                >
                  {item === 'all' ? 'All users' : item}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{recipientCount} recipient{recipientCount === 1 ? '' : 's'} selected.</p>
          </div>

          {mode === 'custom' ? (
            <Textarea
              value={customEmails}
              onChange={(event) => setCustomEmails(event.target.value)}
              placeholder="one@email.com, two@email.com"
              className="min-h-24 text-sm"
            />
          ) : null}

          {mode === 'selected' ? (
            <div className="max-h-72 overflow-auto rounded-xl border border-border">
              {users.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-3 border-b border-border p-3 text-sm last:border-b-0 hover:bg-accent">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelected(item.id)}
                    className="size-4"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.email}</span>
                    <span className="block text-xs text-muted-foreground">Last signed in: {formatDate(item.lastSignInAt)}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : null}

          <Input
            size="sm"
            value={replyTo}
            onChange={(event) => setReplyTo(event.target.value)}
            placeholder="Reply-to email, optional"
          />
          <Input
            size="sm"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
          />
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your announcement..."
            className="min-h-52 text-sm"
          />

          {error ? <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
          {result ? (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
              Sent {result.sent} email{result.sent === 1 ? '' : 's'} through {result.provider}. Failed: {result.failed}.
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            disabled={isSending || !subject || !message || recipientCount < 1}
            onClick={send}
          >
            {isSending ? 'Sending...' : `Send to ${recipientCount} recipient${recipientCount === 1 ? '' : 's'}`}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">Recent sends</h2>
        <div className="mt-5 space-y-3">
          {logs.length ? logs.map((log) => (
            <article key={log.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{log.subject}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(log.created_at)}</p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize text-muted-foreground">{log.status}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {log.recipient_count} recipient{log.recipient_count === 1 ? '' : 's'} via {log.provider || 'unknown'}.
              </p>
              {log.error ? <p className="mt-2 line-clamp-2 text-xs text-destructive">{log.error}</p> : null}
            </article>
          )) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">No email sends logged yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
