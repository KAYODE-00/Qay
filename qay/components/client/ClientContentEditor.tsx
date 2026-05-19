'use client';

import { useMemo, useState } from 'react';
import { FileText, ImageIcon, LayoutPanelLeft, Redo2, Save, Search, Type, Undo2, Video } from 'lucide-react';
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
  const [undoStack, setUndoStack] = useState<ClientEditableField[][]>([]);
  const [redoStack, setRedoStack] = useState<ClientEditableField[][]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'all' | 'text' | 'images'>('all');
  const [query, setQuery] = useState('');

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? null,
    [pages, selectedPageId]
  );

  const textFields = useMemo(
    () => fields.filter((field) => field.kind === 'text' || field.kind === 'richText'),
    [fields]
  );

  const mediaFields = useMemo(
    () => fields.filter((field) => field.kind === 'image' || field.kind === 'video'),
    [fields]
  );

  const visibleFields = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredByPanel = activePanel === 'images'
      ? mediaFields
      : activePanel === 'text'
        ? textFields
        : fields;

    if (!normalizedQuery) {
      return filteredByPanel;
    }

    return filteredByPanel.filter((field) =>
      field.label.toLowerCase().includes(normalizedQuery)
      || field.value.toLowerCase().includes(normalizedQuery)
    );
  }, [activePanel, fields, mediaFields, query, textFields]);

  const selectedPagePath = selectedPage
    ? selectedPage.is_index
      ? '/'
      : `/${selectedPage.slug.replace(/^\/+/, '')}`
    : '/';

  function commitFields(updater: (current: ClientEditableField[]) => ClientEditableField[]) {
    setFields((current) => {
      const next = updater(current);
      if (next === current) return current;

      setUndoStack((stack) => [...stack.slice(-49), current]);
      setRedoStack([]);
      return next;
    });
    setSuccess(null);
  }

  function updateField(fieldId: string, value: string) {
    commitFields((current) =>
      current.map((item) =>
        item.fieldId === fieldId
          ? { ...item, value }
          : item
      )
    );
  }

  function undo() {
    setUndoStack((currentUndo) => {
      const previous = currentUndo.at(-1);
      if (!previous) return currentUndo;

      setRedoStack((currentRedo) => [...currentRedo.slice(-49), fields]);
      setFields(previous);
      setSuccess(null);
      return currentUndo.slice(0, -1);
    });
  }

  function redo() {
    setRedoStack((currentRedo) => {
      const next = currentRedo.at(-1);
      if (!next) return currentRedo;

      setUndoStack((currentUndo) => [...currentUndo.slice(-49), fields]);
      setFields(next);
      setSuccess(null);
      return currentRedo.slice(0, -1);
    });
  }

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
      setUndoStack([]);
      setRedoStack([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load content');
    } finally {
      setLoadingPage(false);
    }
  }

  async function uploadMedia(field: ClientEditableField, file: File | null) {
    if (!file) return;

    const category = field.kind === 'video' ? 'videos' : 'images';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', 'client-editor');
    formData.append('category', category);

    setUploadingFieldId(field.fieldId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/ycode/api/files/upload?site=${siteId}`, {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to upload file');
        return;
      }

      const publicUrl = payload.data?.public_url;
      if (typeof publicUrl !== 'string' || !publicUrl) {
        setError('This file type cannot be used as a public media URL here.');
        return;
      }

      updateField(field.fieldId, publicUrl);
      setSuccess('File uploaded. Save the draft to apply it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload file');
    } finally {
      setUploadingFieldId(null);
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
          fields: fields.map((field) => ({ fieldId: field.fieldId, layerId: field.layerId, value: field.value })),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Unable to save changes');
        return;
      }

      setFields(payload.data.editableFields ?? []);
      setUndoStack([]);
      setRedoStack([]);
      setSuccess('Draft content saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex min-h-screen flex-col bg-background">
      <div className="border-b border-border bg-card/80 px-5 py-4 backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client editor</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-foreground">
              {selectedPage?.name || 'Shared content'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update page content, media, and CMS entries for this site.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex h-10 rounded-md border border-border bg-background p-1">
              <button
                type="button"
                onClick={undo}
                disabled={undoStack.length === 0 || loadingPage || saving}
                className="inline-flex size-8 items-center justify-center rounded text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Undo"
                title="Undo"
              >
                <Undo2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={redoStack.length === 0 || loadingPage || saving}
                className="inline-flex size-8 items-center justify-center rounded text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Redo"
                title="Redo"
              >
                <Redo2 className="size-4" />
              </button>
            </div>

            <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
              <LayoutPanelLeft className="size-4" />
              <span>{selectedPagePath}</span>
            </div>

            <button
              type="button"
              onClick={saveChanges}
              disabled={saving || loadingPage || !selectedPageId}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" />
              {saving ? 'Saving...' : 'Save draft'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="border-b border-border bg-card/40 xl:border-b-0 xl:border-r">
          <div className="border-b border-border px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Pages</p>
          </div>
          <div className="max-h-64 overflow-auto p-3 xl:max-h-[calc(100vh-9rem)]">
            {pages.map((page) => {
              const active = page.id === selectedPageId;
              const path = page.is_index ? '/' : `/${page.slug.replace(/^\/+/, '')}`;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => loadPage(page.id)}
                  className={`mb-2 flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition ${
                    active
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-transparent text-foreground hover:border-border hover:bg-accent'
                  }`}
                >
                  <FileText className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{page.is_index ? 'Home' : page.name}</span>
                    <span className={`mt-1 block truncate text-xs ${active ? 'text-background/70' : 'text-muted-foreground'}`}>{path}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 px-5 py-5">
          {error && (
            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
              {success}
            </div>
          )}

          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex h-10 w-fit rounded-md border border-border bg-card p-1">
              {[
                { key: 'all', label: 'All', count: fields.length },
                { key: 'text', label: 'Text', count: textFields.length },
                { key: 'images', label: 'Media', count: mediaFields.length },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActivePanel(item.key as typeof activePanel)}
                  className={`rounded px-3 text-sm transition ${
                    activePanel === item.key
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label} {item.count}
                </button>
              ))}
            </div>

            <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 lg:w-72">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search editable content"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          {loadingPage ? (
            <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
              Loading page content...
            </div>
          ) : fields.length > 0 ? (
            <div className="space-y-4">
              {visibleFields.map((field) => (
                <label key={field.fieldId} className="block rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                      {field.kind === 'video'
                        ? <Video className="size-4 shrink-0" />
                        : field.kind === 'image'
                          ? <ImageIcon className="size-4 shrink-0" />
                          : <Type className="size-4 shrink-0" />}
                      <span className="truncate">{field.label}</span>
                    </span>
                    <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {field.kind === 'video' ? 'Video' : field.kind === 'image' ? 'Image' : field.kind === 'richText' ? 'Rich text' : 'Text'}
                    </span>
                  </div>
                  {field.kind === 'image' || field.kind === 'video' ? (
                    <div className="grid gap-3 lg:grid-cols-[190px_1fr]">
                      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                        {field.kind === 'video' ? (
                          <video
                            src={field.value}
                            className="h-full w-full object-cover"
                            controls
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={field.value} alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          value={field.value}
                          onChange={(event) => updateField(field.fieldId, event.target.value)}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                        />
                        <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border bg-background px-3 text-sm font-medium transition hover:bg-accent">
                          {uploadingFieldId === field.fieldId ? 'Uploading...' : `Choose ${field.kind}`}
                          <input
                            type="file"
                            accept={field.kind === 'video' ? 'video/*' : 'image/*'}
                            disabled={uploadingFieldId === field.fieldId}
                            onChange={(event) => uploadMedia(field, event.target.files?.[0] ?? null)}
                            className="sr-only"
                          />
                        </label>
                        <p className="text-xs text-muted-foreground">Paste a public URL or choose a file. Save the draft after upload to apply it.</p>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      rows={field.kind === 'richText' ? 8 : 4}
                      value={field.value}
                      onChange={(event) => updateField(field.fieldId, event.target.value)}
                      className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus:border-ring"
                    />
                  )}
                </label>
              ))}

              {visibleFields.length === 0 && (
                <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
                  No editable fields match this filter.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
              No page content is available for editing yet.
            </div>
          )}
        </main>

        <aside className="border-t border-border bg-card/40 xl:border-l xl:border-t-0">
          <div className="border-b border-border px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Review</p>
          </div>
          <div className="space-y-4 p-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium">Page access</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <p className="text-2xl font-semibold">{textFields.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Text fields</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-2xl font-semibold">{mediaFields.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Media</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium">Preview path</p>
              <p className="mt-2 break-all rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{selectedPagePath}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
