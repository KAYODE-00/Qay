'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

type QayComponent = {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  html: string;
  preview_image_url?: string | null;
  tags?: string[] | null;
  is_builtin?: boolean;
  is_approved?: boolean;
};

type QayComponentsPanelProps = {
  open?: boolean;
  onClose?: () => void;
  onInsertHtml?: (html: string, component: QayComponent) => void;
};

const DEFAULT_CATEGORIES = [
  'navigation',
  'hero',
  'cards',
  'accordion',
  'carousel',
  'buttons',
  'forms',
  'testimonials',
  'pricing',
  'gallery',
  'stats',
  'timeline',
  'team',
  'footer',
  'cta',
  'parallax',
  'backgrounds',
  'misc',
];

function buildPreview(html: string) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><style>html,body{margin:0;overflow:hidden;scrollbar-width:none;background:transparent}::-webkit-scrollbar{display:none}body{font-family:Inter,ui-sans-serif,system-ui,sans-serif}.hidden{display:none}.grid{display:grid}.flex{display:flex}.inline-flex{display:inline-flex}.relative{position:relative}.absolute{position:absolute}.overflow-hidden{overflow:hidden}img{max-width:100%;display:block;object-fit:cover}section,article,nav,footer,div,form{box-sizing:border-box}</style></head><body>${html}</body></html>`;
}

export default function QayComponentsPanel({ open = true, onClose, onInsertHtml }: QayComponentsPanelProps) {
  const [category, setCategory] = useState('hero');
  const [search, setSearch] = useState('');
  const [components, setComponents] = useState<QayComponent[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [status, setStatus] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const params = new URLSearchParams({ category });
    if (search.trim()) params.set('search', search.trim());

    setStatus('Loading components...');
    fetch(`/api/qay/components?${params.toString()}`, { cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || 'Could not load components');
        if (cancelled) return;
        setComponents(body?.data?.components || []);
        setCategories(body?.data?.categories || DEFAULT_CATEGORIES);
        setStatus('');
      })
      .catch((error) => {
        if (cancelled) return;
        setComponents([]);
        setStatus(error instanceof Error ? error.message : 'Could not load components');
      });

    return () => {
      cancelled = true;
    };
  }, [category, search, open]);

  const grouped = useMemo(() => components, [components]);

  function trackUse(componentId: string) {
    fetch(`/api/qay/components/${encodeURIComponent(componentId)}/use`, {
      method: 'POST',
    }).catch(() => { /* best-effort tracking */ });
  }

  function handleInsert(component: QayComponent) {
    trackUse(component.id);

    if (onInsertHtml) {
      onInsertHtml(component.html, component);
      return;
    }

    window.dispatchEvent(new CustomEvent('qay:insert-component-html', {
      detail: {
        html: component.html,
        componentId: component.id,
        componentName: component.name,
      },
    }));
    setCopyMessage(`Ready to insert: ${component.name}`);
    window.setTimeout(() => setCopyMessage(''), 2500);
  }

  async function handleCopy(component: QayComponent) {
    try {
      await navigator.clipboard.writeText(component.html);
      setCopyMessage(`Copied ${component.name}`);
    } catch {
      setCopyMessage('Could not copy component HTML');
    }
    window.setTimeout(() => setCopyMessage(''), 2500);
  }

  // Note: rendering is no longer gated on `open`; the parent (ElementLibrary TabsContent)
  // handles visibility via forceMount + hidden. We still gate API fetches on `open` above.

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">QAY Library</p>
            <h2 className="mt-1 text-lg font-semibold">Components</h2>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              aria-label="Close components panel"
            >
              <Icon name="x" className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              placeholder="Search glass, pricing, animated..."
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
                category === item
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {copyMessage ? (
        <div className="mx-4 mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
          {copyMessage}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-4 no-scrollbar">
        {status ? (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {status}
          </div>
        ) : null}

        {!status && grouped.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium">No components found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different category or search.</p>
          </div>
        ) : null}

        <div className="grid gap-3">
          {grouped.map((component) => (
            <article key={component.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative h-40 border-b border-border bg-white">
                {component.preview_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={component.preview_image_url}
                    alt={component.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <iframe
                    title={`${component.name} preview`}
                    srcDoc={buildPreview(component.html)}
                    scrolling="no"
                    className="pointer-events-none h-full w-full"
                  />
                )}
              </div>
              <div className="space-y-3 p-3">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-sm font-semibold">{component.name}</h3>
                    {component.is_builtin ? (
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Built-in</span>
                    ) : null}
                  </div>
                  {component.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{component.description}</p>
                  ) : null}
                </div>

                {component.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {component.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleInsert(component)}
                  >
                    Insert
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(component)}
                  >
                    Copy HTML
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
