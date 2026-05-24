'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Layer } from '@/types';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { findLayerById } from '@/lib/layer-utils';
import { useEditorStore } from '@/stores/useEditorStore';
import { usePagesStore } from '@/stores/usePagesStore';
import { readQayEditorSiteIdFromBrowser } from '@/qay/lib/editor-site';

type AiBuilderPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AiMode = 'selected' | 'page';

type HistoryEntry = {
  prompt: string;
  mode: AiMode;
  createdAt: string;
};

type GenerateResponse = {
  data?: {
    layers: Layer[];
    provider: string;
    model: string;
  };
  error?: string;
};

function historyKey(siteId: string | null) {
  return `qay_ai_builder_history:${siteId || 'global'}`;
}

function loadHistory(siteId: string | null): HistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(historyKey(siteId));
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveHistory(siteId: string | null, entries: HistoryEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(historyKey(siteId), JSON.stringify(entries.slice(0, 12)));
}

function prepareReplacement(original: Layer, generated: Layer): Partial<Layer> {
  return {
    ...generated,
    id: original.id,
    customName: original.customName || generated.customName,
    componentId: undefined,
    componentOverrides: undefined,
    styleId: undefined,
    styleOverrides: undefined,
  };
}

function formatHistoryDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

export default function AiBuilderPanel({ open, onOpenChange }: AiBuilderPanelProps) {
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const draftsByPageId = usePagesStore((state) => state.draftsByPageId);
  const updateLayer = usePagesStore((state) => state.updateLayer);
  const setDraftLayers = usePagesStore((state) => state.setDraftLayers);

  const [siteId, setSiteId] = useState<string | null>(null);
  const [mode, setMode] = useState<AiMode>('selected');
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const draft = currentPageId ? draftsByPageId[currentPageId] : null;
  const selectedIds = useMemo(() => {
    if (selectedLayerIds.length > 0) return selectedLayerIds;
    return selectedLayerId ? [selectedLayerId] : [];
  }, [selectedLayerId, selectedLayerIds]);

  const selectedLayers = useMemo(() => {
    if (!draft) return [];
    return selectedIds
      .map((id) => findLayerById(draft.layers, id))
      .filter((layer): layer is Layer => Boolean(layer));
  }, [draft, selectedIds]);

  useEffect(() => {
    if (!open) return;

    const currentSiteId = readQayEditorSiteIdFromBrowser();
    setSiteId(currentSiteId);
    setHistory(loadHistory(currentSiteId));
  }, [open]);

  useEffect(() => {
    if (open && selectedLayers.length === 0 && mode === 'selected') {
      setMode('page');
    }
  }, [mode, open, selectedLayers.length]);

  if (!open) return null;

  const addHistory = (entry: HistoryEntry) => {
    const next = [
      entry,
      ...history.filter((item) => item.prompt !== entry.prompt || item.mode !== entry.mode),
    ].slice(0, 12);
    setHistory(next);
    saveHistory(siteId, next);
  };

  const applyGeneratedLayers = (layers: Layer[]) => {
    if (!currentPageId || !draft) {
      throw new Error('Open a page before generating a design.');
    }

    if (mode === 'page') {
      setDraftLayers(currentPageId, layers);
      return;
    }

    if (selectedLayers.length === 0) {
      throw new Error('Select a layer before using selected-layer mode.');
    }

    selectedLayers.forEach((layer, index) => {
      const generated = layers[index] || layers[0];
      if (!generated) return;
      updateLayer(currentPageId, layer.id, prepareReplacement(layer, generated));
    });
  };

  const generate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError('Describe what you want QAY to design.');
      return;
    }

    setIsGenerating(true);
    setStatus('Generating with AI...');
    setError(null);

    try {
      const response = await fetch('/api/qay/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          mode,
          selectedLayers: mode === 'selected' ? selectedLayers : [],
        }),
      });
      const body = (await response.json()) as GenerateResponse;

      if (!response.ok || !body.data) {
        throw new Error(body.error || 'We could not generate this design.');
      }

      applyGeneratedLayers(body.data.layers);
      setStatus('Applied.');
      setPrompt('');
      addHistory({
        prompt: trimmedPrompt,
        mode,
        createdAt: new Date().toISOString(),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not generate this design.');
      setStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="fixed right-20 top-20 z-[90] flex max-h-[calc(100vh-7rem)] w-[400px] flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-2xl">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">AI Builder</h2>
          <p className="text-xs text-muted-foreground">
            {mode === 'selected' ? `${selectedLayers.length} selected layer${selectedLayers.length === 1 ? '' : 's'}` : 'Whole page'}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close AI Builder"
          title="Close"
          onClick={() => onOpenChange(false)}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Icon name="x" className="size-4" />
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setMode('selected')}
            disabled={selectedLayers.length === 0}
            className={`rounded-md px-3 py-2 text-xs font-medium transition ${
              mode === 'selected'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
            }`}
          >
            Selected layers
          </button>
          <button
            type="button"
            onClick={() => setMode('page')}
            className={`rounded-md px-3 py-2 text-xs font-medium transition ${
              mode === 'page'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Current page
          </button>
        </div>

        <label className="block space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Prompt</span>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={6}
            placeholder={mode === 'selected' ? 'Make the selected hero more premium and conversion-focused...' : 'Create a clean SaaS homepage for project management...'}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-muted-foreground focus:border-foreground"
          />
        </label>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}

        {status ? (
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {status}
          </div>
        ) : null}

        {history.length > 0 ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsHistoryOpen((current) => !current)}
              className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <span>Site history</span>
              <Icon name={isHistoryOpen ? 'chevronUp' : 'chevronDown'} className="size-3" />
            </button>

            {isHistoryOpen ? (
              <div className="space-y-2">
                {history.map((entry) => (
                  <button
                    type="button"
                    key={`${entry.createdAt}-${entry.mode}-${entry.prompt}`}
                    onClick={() => {
                      setPrompt(entry.prompt);
                      setMode(entry.mode);
                    }}
                    className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs transition hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="line-clamp-2 text-foreground">{entry.prompt}</div>
                    <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <span>{entry.mode === 'selected' ? 'Selected' : 'Page'}</span>
                      <span>{formatHistoryDate(entry.createdAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="border-t border-border p-4">
        <Button
          type="button"
          onClick={generate}
          disabled={isGenerating || !currentPageId || (mode === 'selected' && selectedLayers.length === 0)}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : mode === 'selected' ? 'Design selected layers' : 'Build current page'}
        </Button>
      </footer>
    </section>
  );
}
