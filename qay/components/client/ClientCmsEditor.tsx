'use client';

import { useState } from 'react';
import { Database, Save } from 'lucide-react';
import type { ClientCmsSummary } from '@/qay/lib/client-content';

type ClientCmsEditorProps = {
  siteId: string;
  initialCollections: ClientCmsSummary[];
};

export function ClientCmsEditor({ siteId, initialCollections }: ClientCmsEditorProps) {
  const [collections, setCollections] = useState(initialCollections);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateValue(collectionId: string, itemId: string, fieldId: string, value: string) {
    setCollections((current) =>
      current.map((collection) =>
        collection.collectionId === collectionId
          ? {
              ...collection,
              items: collection.items.map((item) =>
                item.itemId === itemId
                  ? { ...item, values: { ...item.values, [fieldId]: value } }
                  : item
              ),
            }
          : collection
      )
    );
    setSuccess(null);
  }

  async function saveItem(collectionId: string, itemId: string, values: Record<string, string | null>) {
    setSavingItemId(itemId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/qay/client/${siteId}/cms`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId,
          itemId,
          values,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to save CMS item');
        return;
      }

      setCollections(payload.data.collections ?? collections);
      setSuccess('CMS item saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save CMS item');
    } finally {
      setSavingItemId(null);
    }
  }

  if (collections.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
        <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-muted">
          <Database className="size-5" />
        </div>
        No CMS collections are connected to this site yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
          {success}
        </div>
      )}

      {collections.map((collection) => (
        <section key={collection.collectionId} className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">{collection.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {collection.itemCount} items · {collection.fieldCount} fields
                </p>
              </div>
              <Database className="size-5 text-muted-foreground" />
            </div>
          </div>

          <div className="divide-y divide-border">
            {collection.items.length > 0 ? collection.items.map((item, index) => (
              <article key={item.itemId} className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Item {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => saveItem(collection.collectionId, item.itemId, item.values)}
                    disabled={savingItemId === item.itemId}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="size-4" />
                    {savingItemId === item.itemId ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                  {collection.fields.map((field) => (
                    <label key={field.id} className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">{field.name}</span>
                      <textarea
                        rows={field.type === 'rich_text' ? 5 : 2}
                        value={item.values[field.id] ?? ''}
                        onChange={(event) => updateValue(collection.collectionId, item.itemId, field.id, event.target.value)}
                        className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                      />
                    </label>
                  ))}
                </div>
              </article>
            )) : (
              <div className="px-5 py-8 text-sm text-muted-foreground">
                This collection has no items yet.
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
