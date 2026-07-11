'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Layer } from '@/types';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { htmlToLayers, htmlToPageImports } from '@/lib/html-layer-converter';
import { findLayerById } from '@/lib/layer-utils';
import { useEditorStore } from '@/stores/useEditorStore';
import { usePagesStore } from '@/stores/usePagesStore';
import { readQayEditorSiteIdFromBrowser } from '@/qay/lib/editor-site';
import { qayPromptTemplates } from '@/qay/lib/ai/prompt-library';

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

type GenerateCapabilities = {
  auth?: boolean;
  commerce?: boolean;
  cms?: boolean;
  utilityPages?: boolean;
};

type GenerateResponse = {
  data?: {
    layers?: Layer[];
    html?: string;
    provider: string;
    model: string;
    siteId?: string;
    siteType?: string;
    cmsCollections?: Array<{ name: string; id: string }>;
    theme?: {
      label: string;
      theme_id: string;
      css_variables?: Record<string, string>;
    };
    sectionsUsed?: Array<{
      type: string;
      sectionId: string;
    }>;
    navMode?: string;
    pages?: string[];
    sectionPicks?: Record<string, number>;
    stats?: {
      fromLibrary?: number;
      generated?: number;
    };
    capabilities?: GenerateCapabilities;
  };
  error?: string;
  details?: string;
  code?: string;
  providers?: Array<{
    provider: string;
    message: string;
  }>;
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
  const loadPages = usePagesStore((state) => state.loadPages);

  const [siteId, setSiteId] = useState<string | null>(null);
  const [mode, setMode] = useState<AiMode>('selected');
  const [prompt, setPrompt] = useState('');
  const [promptTemplateId, setPromptTemplateId] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBusyDialogOpen, setIsBusyDialogOpen] = useState(false);
  const [busyDialogDetails, setBusyDialogDetails] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState<GenerateResponse['data'] | null>(null);

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

  const selectedPromptTemplate = useMemo(
    () => qayPromptTemplates.find((template) => template.id === promptTemplateId) || null,
    [promptTemplateId]
  );

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

  const activateGeneratedSiteCapabilities = async (capabilities?: GenerateCapabilities) => {
    if (!siteId || !capabilities || typeof capabilities !== 'object') return;

    const caps = capabilities as NonNullable<GenerateResponse['data']>['capabilities'];
    if (!caps?.auth) return;

    const response = await fetch(`/api/qay/sites/${siteId}/auth`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        enabled: true,
        allowSignup: true,
        provider: 'qay',
        socialLogin: false,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || 'AI built auth pages, but QAY could not enable site auth settings.');
    }
  };

  const generate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError('Describe what you want QAY to design.');
      return;
    }

    setIsGenerating(true);
    setStatus(mode === 'page' ? 'Selecting design from section library...' : 'Generating with AI...');
    setError(null);
    setGenerationMeta(null);

    try {
      const response = await fetch('/api/qay/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          promptTemplateId: promptTemplateId || undefined,
          mode,
          output: mode === 'selected' ? 'layers' : 'html',
          selectedLayers: mode === 'selected' ? selectedLayers : [],
        }),
      });
      const body = (await response.json()) as GenerateResponse;

      if (!response.ok || !body.data) {
        console.error('[QAY AI Builder] AI generate failed response:', body);

        if (body.providers?.length) {
          console.error('[QAY AI Builder] AI provider failure details:', body.providers);
        }

        if (body.code === 'AI_PROVIDER_LIMITS_REACHED' || body.code === 'AI_PROVIDERS_FAILED') {
          setBusyDialogDetails(body.error || body.details || null);
          setIsBusyDialogOpen(true);
          throw new Error(body.error || 'AI is currently busy. Please try again shortly.');
        }

        throw new Error(body.details || body.error || 'We could not generate this design.');
      }

      console.log('[QAY AI Builder] Provider:', body.data.provider, body.data.model);
      setGenerationMeta(body.data);
      if (body.data.html) {
        console.log('[QAY AI Builder] Generated import HTML:', body.data.html);
      }
      if (body.data.layers) {
        console.log('[QAY AI Builder] Generated layer JSON:', body.data.layers);
      }

      if (mode === 'page' && body.data.siteId) {
        setStatus('Created a new AI template project. Opening it now...');
        window.location.assign(`/dashboard/sites/${body.data.siteId}/editor`);
        return;
      }

      const generatedPages = body.data.html ? htmlToPageImports(body.data.html, 'Homepage') : [];
      if (generatedPages.length > 0) {
        console.log('[QAY AI Builder] Parsed import pages:', generatedPages.map((page) => ({
          name: page.name,
          slug: page.slug,
          layerCount: page.layers.length,
        })));
      }

      if (mode === 'page' && generatedPages.length > 0 && siteId) {
        const importResponse = await fetch(`/api/qay/sites/${siteId}/import-html`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pages: generatedPages, pageName: generatedPages[0]?.name || 'Homepage' }),
        });
        const importPayload = await importResponse.json().catch(() => null);

        if (!importResponse.ok) {
          throw new Error(importPayload?.error || 'AI generated pages, but QAY could not create them.');
        }

        await activateGeneratedSiteCapabilities(body.data.capabilities);
        await loadPages();
        setStatus(body.data.capabilities?.auth
          ? `${generatedPages.length === 1 ? 'Imported 1 AI-generated page' : `Imported ${generatedPages.length} AI-generated pages`} and enabled site auth.`
          : generatedPages.length === 1 ? 'Imported 1 AI-generated page.' : `Imported ${generatedPages.length} AI-generated pages.`);
        setPrompt('');
        setPromptTemplateId('');
        setGenerationMeta(body.data);
        addHistory({
          prompt: trimmedPrompt,
          mode,
          createdAt: new Date().toISOString(),
        });
        return;
      }

      const generatedLayers = generatedPages[0]?.layers || (body.data.html
        ? htmlToLayers(body.data.html)
        : body.data.layers || []);

      if (generatedLayers.length === 0) {
        throw new Error('AI generated a design QAY could not import. Try again shortly.');
      }

      applyGeneratedLayers(generatedLayers);
      setStatus('Applied.');
      setPrompt('');
      setPromptTemplateId('');
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
    <>
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

        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label htmlFor="qay-prompt-template" className="block text-xs font-semibold text-foreground">
                Prompt template
              </label>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                Helps QAY plan pages, sections, colors, routes, auth, CMS, and commerce.
              </p>
            </div>
            <a
              href="/prompts"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Browse
            </a>
          </div>
          <select
            id="qay-prompt-template"
            value={promptTemplateId}
            onChange={(event) => {
              const nextId = event.target.value;
              const nextTemplate = qayPromptTemplates.find((template) => template.id === nextId);
              setPromptTemplateId(nextId);
              if (nextTemplate) {
                setPrompt((current) => current.trim() || `Brand name: ${nextTemplate.exampleBusiness.split(',')[0]}\nColors: \nAudience: \nTone: \nExtra details: `);
              }
            }}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground outline-none transition focus:border-foreground"
          >
            <option value="">No template - use my prompt only</option>
            {qayPromptTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.category} - {template.title}
              </option>
            ))}
          </select>
          {selectedPromptTemplate ? (
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-[11px] leading-4 text-muted-foreground">
              <span className="font-semibold text-foreground">{selectedPromptTemplate.title}: </span>
              {selectedPromptTemplate.description}
            </div>
          ) : null}
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

        {generationMeta?.provider === 'section-library' || generationMeta?.provider === 'section-library-v2' || generationMeta?.provider === 'hybrid-section-assembler' ? (
          <div className="rounded-lg border border-border bg-card p-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">
                  {generationMeta.stats
                    ? `Built using ${generationMeta.stats.fromLibrary || 0} pre-designed sections + ${generationMeta.stats.generated || 0} AI-generated sections`
                    : 'Assembled from sections'}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {generationMeta.theme?.label || generationMeta.model} system
                  {generationMeta.siteType ? ` for ${generationMeta.siteType}` : ''}
                  {generationMeta.navMode ? ` · ${generationMeta.navMode}` : ''}
                </p>
                <p className="mt-2 text-muted-foreground">
                  To replace a section, open the left sidebar, choose Sections, then pick the same website type and section type.
                </p>
              </div>
              <div className="flex gap-1">
                {['--qm-bg', '--qm-surface', '--qm-accent'].map((key) => {
                  const color = generationMeta.theme?.css_variables?.[key];
                  return color ? (
                    <span
                      key={key}
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ) : null;
                })}
              </div>
            </div>
            {generationMeta.sectionsUsed?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {generationMeta.sectionsUsed.map((section) => (
                  <span key={`${section.type}-${section.sectionId}`} className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                    {section.type}
                  </span>
                ))}
              </div>
            ) : null}
            {generationMeta.sectionPicks && Object.keys(generationMeta.sectionPicks).length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.entries(generationMeta.sectionPicks).map(([slot, index]) => (
                  <span key={`${slot}-${index}`} className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                    {slot} [{index}]
                  </span>
                ))}
              </div>
            ) : null}
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
    <Dialog open={isBusyDialogOpen} onOpenChange={setIsBusyDialogOpen}>
      <DialogContent className="border-border bg-background text-foreground shadow-2xl">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <Icon name="wand-sparkles" className="size-5" />
          </div>
          <DialogTitle>AI is currently unavailable</DialogTitle>
          <DialogDescription className="leading-6">
            Sorry about that. QAY tried the configured AI providers, but they are out of quota, rate limited, or temporarily unavailable right now.
          </DialogDescription>
        </DialogHeader>
        {busyDialogDetails ? (
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
            {busyDialogDetails}
          </div>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setBusyDialogDetails(null);
              setIsBusyDialogOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              setBusyDialogDetails(null);
              setIsBusyDialogOpen(false);
            }}
          >
            Try again shortly
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
