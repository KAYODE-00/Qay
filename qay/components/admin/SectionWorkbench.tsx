'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AssemblyResult, SectionType, SiteType } from '@/qay/lib/section-library/types';

type SectionWorkbenchProps = {
  initialPrompt: string;
  assembly: AssemblyResult;
  siteTypes: SiteType[];
  sectionTypes: SectionType[];
};

type SaveState = 'idle' | 'saving' | 'success' | 'error';

type CatalogSection = {
  id?: string | null;
  siteType: SiteType;
  sectionType: string;
  index: number;
  label: string;
  manifestLine: string;
  html: string;
};

export function SectionWorkbench({ initialPrompt, assembly, siteTypes, sectionTypes }: SectionWorkbenchProps) {
  const [html, setHtml] = useState(`<section class="px-6 py-20 bg-[#0f172a] text-white">
  <div class="mx-auto max-w-5xl">
    <p class="text-sm uppercase tracking-[0.24em] text-white/50">Custom section</p>
    <h2 class="mt-4 text-5xl font-bold">A strong section headline goes here.</h2>
    <p class="mt-5 max-w-2xl text-white/70">Add useful copy, a clear layout, and QAY hooks where needed.</p>
  </div>
</section>`);
  const [siteType, setSiteType] = useState<SiteType>(assembly.siteType);
  const [sectionType, setSectionType] = useState<SectionType>('hero');
  const [label, setLabel] = useState('Premium custom section');
  const [manifestLine, setManifestLine] = useState('Premium responsive section with strong hierarchy, useful spacing, and QAY editable zones');
  const [navLinkStyle, setNavLinkStyle] = useState<'routes' | 'anchors' | 'none'>('routes');
  const [state, setState] = useState<SaveState>('idle');
  const [message, setMessage] = useState('');
  const [catalog, setCatalog] = useState<CatalogSection[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogMessage, setCatalogMessage] = useState('');
  const [sectionToDelete, setSectionToDelete] = useState<CatalogSection | null>(null);
  const [isDeletingSection, setIsDeletingSection] = useState(false);

  const fullPreview = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><script src="https://cdn.tailwindcss.com"></script></head><body>${html}</body></html>`, [html]);

  useEffect(() => {
    let cancelled = false;
    setIsCatalogLoading(true);
    setCatalogMessage('');

    fetch(`/api/qay/sections?siteType=${encodeURIComponent(siteType)}&sectionType=${encodeURIComponent(sectionType)}`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.error || 'Could not load section catalog.');
        if (!cancelled) setCatalog(body?.data?.sections || []);
      })
      .catch((error) => {
        if (!cancelled) {
          setCatalog([]);
          setCatalogMessage(error instanceof Error ? error.message : 'Could not load section catalog.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionType, siteType]);

  async function saveSection() {
    setState('saving');
    setMessage('');

    try {
      const response = await fetch('/api/qay/admin/sections', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          siteType,
          sectionType,
          label,
          manifestLine,
          navLinkStyle,
          html,
        }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || 'Could not save section.');
      }

      setState('success');
      setMessage(`Saved section ${body.id || ''}`.trim());
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Could not save section.');
    }
  }

  async function deleteSection() {
    if (!sectionToDelete?.id) return;

    setIsDeletingSection(true);
    setCatalogMessage('');

    try {
      const response = await fetch(`/api/qay/admin/sections?id=${encodeURIComponent(sectionToDelete.id)}`, {
        method: 'DELETE',
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || 'Could not delete section.');
      }

      setCatalog((current) => current.filter((section) => section.id !== sectionToDelete.id));
      setSectionToDelete(null);
      setCatalogMessage('Section deleted. It will no longer be used by AI.');
    } catch (error) {
      setCatalogMessage(error instanceof Error ? error.message : 'Could not delete section.');
    } finally {
      setIsDeletingSection(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="space-y-4">
        <form className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row">
          <input
            name="prompt"
            defaultValue={initialPrompt}
            className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
          />
          <button className="h-12 rounded-md bg-foreground px-5 text-sm font-medium text-background" type="submit">
            Test prompt
          </button>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Detected site type</p><p className="mt-2 font-medium">{assembly.siteType}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Theme</p><p className="mt-2 font-medium">{assembly.theme.label}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Sections</p><p className="mt-2 font-medium">{assembly.sectionsUsed.length}</p></div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-medium">Generated sections</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {assembly.sectionsUsed.map((section) => (
              <span key={`${section.type}-${section.sectionId}`} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {section.type}: {section.sectionId}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium">AI-usable section catalog</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Showing designs for {siteType} / {sectionType}. These are the exact sections the prompt translator can pick.
              </p>
            </div>
            <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
              {isCatalogLoading ? 'Loading' : `${catalog.length} designs`}
            </span>
          </div>
          {catalogMessage && <p className="mt-3 text-xs text-red-500">{catalogMessage}</p>}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {catalog.slice(0, 12).map((section) => (
              <article key={`${section.sectionType}-${section.index}-${section.label}`} className="overflow-hidden rounded-lg border border-border">
                <div className="flex items-start justify-between gap-3 border-b border-border p-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">[{section.index}] {section.label}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{section.manifestLine}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHtml(section.html);
                      setLabel(section.label);
                      setManifestLine(section.manifestLine);
                    }}
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
                  >
                    Load
                  </button>
                  {section.id ? (
                    <button
                      type="button"
                      onClick={() => setSectionToDelete(section)}
                      className="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
                <iframe
                  title={`${section.label} preview`}
                  srcDoc={`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><script src="https://cdn.tailwindcss.com"></script></head><body>${section.html}</body></html>`}
                  className="h-40 w-full bg-white"
                />
              </article>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">Generated page preview</div>
          <iframe
            title="Generated section assembly preview" srcDoc={assembly.html}
            className="h-[640px] w-full bg-white"
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Create section</p>
          <h2 className="mt-2 text-2xl font-semibold">Add a reusable section from your phone</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Paste or write an HTML fragment, preview it, then save it into the AI-pickable section library.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Site type
            <select
              value={siteType} onChange={(event) => setSiteType(event.target.value as SiteType)}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {siteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">
            Section type
            <select
              value={sectionType} onChange={(event) => setSectionType(event.target.value as SectionType)}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {sectionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">
            Label
            <input
              value={label} onChange={(event) => setLabel(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium">
          Manifest line
          <input
            value={manifestLine} onChange={(event) => setManifestLine(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </label>

        {sectionType === 'nav' && (
          <label className="mt-4 block text-sm font-medium">
            Nav link style
            <select
              value={navLinkStyle}
              onChange={(event) => setNavLinkStyle(event.target.value as 'routes' | 'anchors' | 'none')}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="routes">Routes</option>
              <option value="anchors">Anchors</option>
              <option value="none">None</option>
            </select>
          </label>
        )}

        <label className="mt-4 block text-sm font-medium">
          Section HTML
          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            rows={12}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 font-mono text-xs leading-5 outline-none focus:border-foreground"
          />
        </label>

        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">Custom section preview</div>
          <iframe
            title="Custom section preview" srcDoc={fullPreview}
            className="h-[360px] w-full bg-white"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={saveSection}
            disabled={state === 'saving'}
            className="h-11 rounded-md bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === 'saving' ? 'Saving...' : 'Save section'}
          </button>
          {message ? <p className={`text-sm ${state === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>{message}</p> : null}
        </div>
      </section>

      {sectionToDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-red-500">Delete section</p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">Remove this section from AI selection?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This will deactivate <span className="font-medium text-foreground">{sectionToDelete.label}</span> for {sectionToDelete.siteType} / {sectionToDelete.sectionType}.
              Built-in sections cannot be deleted here, only saved admin sections.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSectionToDelete(null)}
                disabled={isDeletingSection}
                className="h-10 rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteSection}
                disabled={isDeletingSection}
                className="h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeletingSection ? 'Deleting...' : 'Delete section'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
