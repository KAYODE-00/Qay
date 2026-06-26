'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { QayBackgroundCategory, QayBackgroundPreset } from '@/qay/lib/background-presets';

type BackgroundTarget = 'selected-layer' | 'full-page';

type BackgroundPickerProps = {
  open?: boolean;
  onClose?: () => void;
  selectedLayerId?: string | null;
  onApplyBackground?: (payload: {
    target: BackgroundTarget;
    selectedLayerId?: string | null;
    background: QayBackgroundPreset;
  }) => void;
};

const CATEGORY_LABELS: Record<QayBackgroundCategory, string> = {
  gradient: 'Gradients',
  pattern: 'Patterns',
  animated: 'Animated',
  mesh: 'Mesh',
  spline: 'Spline',
};

const DEFAULT_CATEGORIES: QayBackgroundCategory[] = ['gradient', 'pattern', 'animated', 'mesh', 'spline'];

function cssTextToStyle(cssText: string) {
  return cssText
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((style, declaration) => {
      const separator = declaration.indexOf(':');
      if (separator === -1) return style;
      const key = declaration.slice(0, separator).trim();
      const value = declaration.slice(separator + 1).trim();
      if (!key || !value) return style;
      const camelKey = key.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
      style[camelKey] = value;
      return style;
    }, {});
}

export default function BackgroundPicker({
  open = true,
  onClose,
  selectedLayerId,
  onApplyBackground,
}: BackgroundPickerProps) {
  const [category, setCategory] = useState<QayBackgroundCategory>('gradient');
  const [target, setTarget] = useState<BackgroundTarget>('selected-layer');
  const [backgrounds, setBackgrounds] = useState<QayBackgroundPreset[]>([]);
  const [categories, setCategories] = useState<QayBackgroundCategory[]>(DEFAULT_CATEGORIES);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setStatus('Loading backgrounds...');
    fetch(`/api/qay/backgrounds?category=${encodeURIComponent(category)}`, { cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || 'Could not load backgrounds');
        if (cancelled) return;
        setBackgrounds(body?.data?.backgrounds || []);
        setCategories(body?.data?.categories || DEFAULT_CATEGORIES);
        setStatus('');
      })
      .catch((error) => {
        if (cancelled) return;
        setBackgrounds([]);
        setStatus(error instanceof Error ? error.message : 'Could not load backgrounds');
      });

    return () => {
      cancelled = true;
    };
  }, [category, open]);

  const sortedBackgrounds = useMemo(() => (
    backgrounds.slice().sort((a, b) => (b.rank || 0) - (a.rank || 0))
  ), [backgrounds]);

  function handleApply(background: QayBackgroundPreset) {
    const payload = { target, selectedLayerId, background };
    if (onApplyBackground) {
      onApplyBackground(payload);
    } else {
      window.dispatchEvent(new CustomEvent('qay:apply-background', { detail: payload }));
    }

    setMessage(target === 'full-page'
      ? `Applied ${background.name} to the page`
      : `Applied ${background.name} to the selected layer`);
    window.setTimeout(() => setMessage(''), 2200);
  }

  async function handleCopy(background: QayBackgroundPreset) {
    try {
      await navigator.clipboard.writeText(background.css);
      setMessage(`Copied ${background.name} CSS`);
    } catch {
      setMessage('Could not copy CSS');
    }
    window.setTimeout(() => setMessage(''), 2200);
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">QAY Library</p>
            <h2 className="mt-1 text-lg font-semibold">Backgrounds</h2>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              aria-label="Close background picker"
            >
              <Icon name="x" className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                category === item
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {CATEGORY_LABELS[item] || item}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-xs font-medium text-muted-foreground">
          Apply to
          <select
            value={target}
            onChange={(event) => setTarget(event.target.value as BackgroundTarget)}
            className="mt-2 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="selected-layer">Selected layer</option>
            <option value="full-page">Full page</option>
          </select>
        </label>
      </div>

      {message ? (
        <div className="mx-4 mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
          {message}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-4 no-scrollbar">
        {status ? (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {status}
          </div>
        ) : null}

        {!status && sortedBackgrounds.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium">No backgrounds found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try another category.</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          {sortedBackgrounds.map((background) => (
            <article key={background.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative h-28 border-b border-border" style={cssTextToStyle(background.preview_css)}>
                {background.category === 'spline' ? (
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Soon
                  </span>
                ) : null}
              </div>
              <div className="space-y-3 p-3">
                <div>
                  <h3 className="truncate text-sm font-semibold">{background.name}</h3>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">{background.category}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {background.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApply(background)}
                    disabled={background.category === 'spline'}
                  >
                    Apply
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(background)}
                  >
                    Copy
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
