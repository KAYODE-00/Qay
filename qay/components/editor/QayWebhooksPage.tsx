'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

type Webhook = {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  generated_secret?: string;
};

const EVENTS = [
  'form.submitted',
  'site.published',
  'collection_item.created',
  'collection_item.updated',
  'collection_item.deleted',
];

export function QayWebhooksPage({ siteId, canManage }: { siteId: string; canManage: boolean }) {
  const [items, setItems] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [created, setCreated] = useState<Webhook | null>(null);
  const [deleteWebhook, setDeleteWebhook] = useState<Webhook | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [event, setEvent] = useState('form.submitted');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/qay/webhooks?site=${encodeURIComponent(siteId)}`);
      const result = await response.json();
      if (result.data) setItems(result.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [siteId]);

  const createWebhook = async () => {
    const response = await fetch('/api/qay/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, name, url, events: [event], generateSecret: true }),
    });
    const result = await response.json();
    if (result.data) {
      setCreated(result.data);
      setShowSecret(Boolean(result.data.generated_secret));
      setShowCreate(false);
      setName('');
      setUrl('');
      fetchItems();
    }
  };

  const toggleWebhook = async (webhook: Webhook) => {
    const response = await fetch(`/api/qay/webhooks/${webhook.id}?site=${encodeURIComponent(siteId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !webhook.enabled }),
    });
    const result = await response.json();
    if (result.data) {
      setItems((prev) => prev.map((item) => (item.id === webhook.id ? result.data : item)));
    }
  };

  const removeWebhook = async () => {
    if (!deleteWebhook) return;
    await fetch(`/api/qay/webhooks/${deleteWebhook.id}?site=${encodeURIComponent(siteId)}`, { method: 'DELETE' });
    setDeleteWebhook(null);
    fetchItems();
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between pb-6 pt-8">
          <div>
            <h1 className="text-base font-medium">Site webhooks</h1>
            <p className="mt-2 text-sm text-muted-foreground">These webhooks send events for this site only.</p>
          </div>
          {canManage && <Button variant="secondary" size="sm" onClick={() => setShowCreate(true)}>Create webhook</Button>}
        </header>

        {loading ? (
          <div className="py-10 text-sm text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-sm text-muted-foreground">No site webhooks yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((webhook) => (
              <div key={webhook.id} className="rounded-lg bg-secondary/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{webhook.name}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">{webhook.events.join(', ')}</span>
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{webhook.url}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {canManage && <Switch checked={webhook.enabled} onCheckedChange={() => toggleWebhook(webhook)} />}
                    {canManage && <Button variant="secondary" size="xs" onClick={() => setDeleteWebhook(webhook)}>Delete</Button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create site webhook</DialogTitle>
            <DialogDescription>This webhook will be used only for this site.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="site-webhook-name">Name</FieldLabel>
            <Input id="site-webhook-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="site-webhook-url">URL</FieldLabel>
            <Input id="site-webhook-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/webhook" />
          </Field>
          <Field>
            <FieldLabel htmlFor="site-webhook-event">Event</FieldLabel>
            <FieldDescription>Start with one event per webhook.</FieldDescription>
            <select id="site-webhook-event" className="h-9 rounded-md border bg-background px-3 text-sm" value={event} onChange={(e) => setEvent(e.target.value)}>
              {EVENTS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={createWebhook} disabled={!name.trim() || !url.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSecret} onOpenChange={setShowSecret}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signing secret</DialogTitle>
            <DialogDescription>Copy this once for your receiving service.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-secondary p-4 text-sm font-mono break-all">{created?.generated_secret}</div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (created?.generated_secret) {
                  await navigator.clipboard.writeText(created.generated_secret);
                }
                setShowSecret(false);
              }}
            >
              Copy and close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteWebhook}
        onOpenChange={(open) => !open && setDeleteWebhook(null)}
        title="Delete webhook?"
        description={`This will permanently delete "${deleteWebhook?.name}".`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onConfirm={removeWebhook}
        onCancel={() => setDeleteWebhook(null)}
      />
    </div>
  );
}
