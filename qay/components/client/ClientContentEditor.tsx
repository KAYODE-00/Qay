'use client';

import { useMemo, useState } from 'react';
import type { ClientEditableField, ClientPageSummary } from '@/qay/lib/client-content';

type ClientContentEditorProps = {
  siteId: string;
  initialPages: ClientPageSummary[];
  initialPageId: string | null;
  initialFields: ClientEditableField[];
};

export function ClientContentEditor({
  siteId,
  initialPages,
  initialPageId,
  initialFields,
}: ClientContentEditorProps) {
  const [pages] = useState(initialPages);
  const [selectedPageId, setSelectedPageId] = useState(initialPageId);
  const [fields, setFields] = useState(initialFields);
  const [loadingPage, setLoadingPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? null,
    [pages, selectedPageId]
  );

  async function loadPage(pageId: string) {
    setLoadingPage(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/qay/client/${siteId}/content?pageId=${pageId}`, {
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to load content');
        return;
      }

      setSelectedPageId(payload.data.selectedPage?.id ?? null);
      setFields(payload.data.editableFields ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load content');
    } finally {
      setLoadingPage(false);
    }
  }

  async function saveChanges() {
    if (!selectedPageId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/qay/client/${siteId}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: selectedPageId,
          fields: fields.map((field) => ({ layerId: field.layerId, value: field.value })),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to save changes');
        return;
      }

      setFields(payload.data.editableFields ?? []);
      setSuccess('Draft content saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col">
      <div className="border-b border-border bg-card/70 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client editor</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground">
              {selectedPage?.name || 'Shared content'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review page copy and save updates into the draft without opening the full builder.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={selectedPageId ?? ''}
              onChange={(event) => loadPage(event.target.value)}
              className="h-10 min-w-64 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
            >
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.is_index ? 'Home' : page.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={saveChanges}
              disabled={saving || loadingPage || !selectedPageId}
              className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save draft'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        {loadingPage ? (
          <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
            Loading page content...
          </div>
        ) : fields.length > 0 ? (
          <div className="space-y-4">
            {fields.map((field) => (
              <label key={field.layerId} className="block rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{field.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {field.kind === 'image' ? 'Image URL' : field.kind === 'richText' ? 'Rich text' : 'Text'}
                  </span>
                </div>
                {field.kind === 'image' ? (
                  <div className="grid gap-3 lg:grid-cols-[160px_1fr]">
                    <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={field.value} alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <input
                      value={field.value}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setFields((current) =>
                          current.map((item) =>
                            item.layerId === field.layerId
                              ? { ...item, value: nextValue }
                              : item
                          )
                        );
                      }}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                    />
                  </div>
                ) : (
                  <textarea
                    rows={field.kind === 'richText' ? 6 : 3}
                    value={field.value}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setFields((current) =>
                        current.map((item) =>
                          item.layerId === field.layerId
                            ? { ...item, value: nextValue }
                            : item
                        )
                      );
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                  />
                )}
              </label>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
            This page does not expose any text blocks for the lightweight client editor yet.
          </div>
        )}
      </div>
    </section>
  );
}
