'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

type Template = {
  id: string;
  name: string;
  description: string;
  preview?: string;
  categoryId: string | null;
  livePreviewUrl: string | null;
};

type Category = {
  id: string;
  name: string;
};

type Mirror = {
  id: string;
  source: string;
  source_template_id: string;
  source_template_name: string | null;
  qay_site_id: string | null;
  status: string;
  preview_url: string | null;
  last_error: string | null;
  synced_at: string | null;
};

type Props = {
  templates: Template[];
  categories: Category[];
  mirrors: Mirror[];
};

type SyncState = {
  status: 'idle' | 'syncing' | 'ready' | 'failed';
  message?: string;
  previewUrl?: string | null;
};

function getSource(template: Template) {
  return `${template.id} ${template.name}`.toLowerCase().includes('qay') ? 'qay' : 'ycode';
}

function getMirrorKey(template: Template) {
  return `${getSource(template)}:${template.id}`;
}

function formatDate(value: string | null) {
  if (!value) return 'Not synced';
  try {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

export function TemplateMirrorManager({ templates, categories, mirrors }: Props) {
  const [query, setQuery] = useState('');
  const [syncStateByTemplate, setSyncStateByTemplate] = useState<Record<string, SyncState>>({});

  const categoryNameById = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);
  const mirrorByTemplate = useMemo(
    () => new Map(mirrors.map((mirror) => [`${mirror.source}:${mirror.source_template_id}`, mirror])),
    [mirrors]
  );

  const filteredTemplates = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return templates;

    return templates.filter((template) => {
      const categoryName = template.categoryId ? categoryNameById.get(template.categoryId) || '' : '';
      return `${template.name} ${template.description} ${categoryName} ${template.id}`.toLowerCase().includes(needle);
    });
  }, [categoryNameById, query, templates]);

  async function syncTemplate(template: Template) {
    const key = getMirrorKey(template);
    setSyncStateByTemplate((current) => ({
      ...current,
      [key]: { status: 'syncing', message: 'Syncing template into QAY...' },
    }));

    try {
      const response = await fetch(`/api/qay/admin/template-mirrors/${encodeURIComponent(template.id)}/sync`, {
        method: 'POST',
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || 'Template mirror sync failed');
      }

      setSyncStateByTemplate((current) => ({
        ...current,
        [key]: {
          status: 'ready',
          message: 'QAY demo is ready.',
          previewUrl: payload.previewUrl,
        },
      }));
    } catch (error) {
      setSyncStateByTemplate((current) => ({
        ...current,
        [key]: {
          status: 'failed',
          message: error instanceof Error ? error.message : 'Template mirror sync failed',
        },
      }));
    }
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-normal">Template mirrors</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sync external templates into QAY-owned demo sites so previews do not depend on the original provider.
          </p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search templates"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring sm:w-72"
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => {
          const source = getSource(template);
          const key = getMirrorKey(template);
          const mirror = mirrorByTemplate.get(key);
          const syncState = syncStateByTemplate[key];
          const status = syncState?.status === 'syncing' ? 'syncing' : syncState?.status || mirror?.status || 'pending';
          const previewUrl = syncState?.previewUrl || mirror?.preview_url || null;

          return (
            <article key={key} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[16/10] bg-muted">
                {template.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={template.preview}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-semibold text-muted-foreground/40">
                    {template.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {source === 'qay' ? 'QAY' : 'Ycode'} · {template.categoryId ? categoryNameById.get(template.categoryId) || 'Template' : 'Template'}
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold">{template.name}</h3>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.14em] ${
                      status === 'ready'
                        ? 'border-emerald-500/30 text-emerald-500'
                        : status === 'failed'
                          ? 'border-red-500/30 text-red-500'
                          : 'border-border text-muted-foreground'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{template.description}</p>

                <div className="rounded-lg border border-border bg-background/60 p-3 text-xs text-muted-foreground">
                  <p>Synced: {formatDate(mirror?.synced_at || null)}</p>
                  {(syncState?.message || mirror?.last_error) && (
                    <p className="mt-2 break-words">{syncState?.message || mirror?.last_error}</p>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => syncTemplate(template)}
                    disabled={status === 'syncing'}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw className={`size-4 ${status === 'syncing' ? 'animate-spin' : ''}`} />
                    {status === 'ready' ? 'Resync' : 'Sync'}
                  </button>
                  <a
                    href={previewUrl || `/templates/demo/${encodeURIComponent(template.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    Preview
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
