'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  api_key?: string;
  last_used_at: string | null;
  created_at: string;
};

export function QayApiKeysPage({ siteId, canManage }: { siteId: string; canManage: boolean }) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [generated, setGenerated] = useState<ApiKey | null>(null);
  const [showGenerated, setShowGenerated] = useState(false);
  const [deleteKey, setDeleteKey] = useState<ApiKey | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/qay/api-keys?site=${encodeURIComponent(siteId)}`);
      const result = await response.json();
      if (result.data) setKeys(result.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [siteId]);

  const handleCreate = async () => {
    const response = await fetch('/api/qay/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, name }),
    });
    const result = await response.json();
    if (result.data) {
      setGenerated(result.data);
      setShowGenerated(true);
      setShowCreate(false);
      setName('');
      fetchKeys();
    }
  };

  const handleDelete = async () => {
    if (!deleteKey) return;
    await fetch(`/api/qay/api-keys/${deleteKey.id}?site=${encodeURIComponent(siteId)}`, { method: 'DELETE' });
    setDeleteKey(null);
    fetchKeys();
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between pb-6 pt-8">
          <div>
            <h1 className="text-base font-medium">Site API keys</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              These keys belong only to this site and should never bleed across other QAY projects.
            </p>
          </div>
          {canManage && (
            <Button variant="secondary" size="sm" onClick={() => setShowCreate(true)}>
              Generate API key
            </Button>
          )}
        </header>

        {loading ? (
          <div className="py-10 text-sm text-muted-foreground">Loading...</div>
        ) : keys.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
            No API keys for this site yet.
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center gap-4 rounded-lg bg-secondary/20 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{key.name}</span>
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{key.key_prefix}...</code>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Created {new Date(key.created_at).toLocaleDateString()} · Last used {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                  </div>
                </div>
                {canManage && (
                  <Button variant="secondary" size="xs" onClick={() => setDeleteKey(key)}>
                    <Icon name="trash" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate site API key</DialogTitle>
            <DialogDescription>This key will only belong to the current site.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="site-api-key-name">Name</FieldLabel>
            <Input id="site-api-key-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Production key" />
          </Field>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGenerated} onOpenChange={setShowGenerated}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your key now</DialogTitle>
            <DialogDescription>This value is shown once.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-secondary p-4 text-sm font-mono break-all">{generated?.api_key}</div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (generated?.api_key) {
                  await navigator.clipboard.writeText(generated.api_key);
                }
                setShowGenerated(false);
                setGenerated(null);
              }}
            >
              Copy and close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteKey}
        onOpenChange={(open) => !open && setDeleteKey(null)}
        title="Delete API key?"
        description={`This will permanently delete "${deleteKey?.name}".`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteKey(null)}
      />
    </div>
  );
}
