'use client';

import { useMemo, useState } from 'react';
import type { AssemblyResult, SectionType, SiteType } from '@/qay/lib/section-library/types';

type SectionWorkbenchProps = {
  initialPrompt: string;
  assembly: AssemblyResult;
  siteTypes: SiteType[];
  sectionTypes: SectionType[];
};

type SaveState = 'idle' | 'saving' | 'success' | 'error';

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
  const [themeId, setThemeId] = useState(assembly.theme.theme_id);
  const [keywords, setKeywords] = useState('custom, premium, editorial');
  const [previewDescription, setPreviewDescription] = useState('Custom admin-created section');
  const [state, setState] = useState<SaveState>('idle');
  const [message, setMessage] = useState('');

  const fullPreview = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><script src="https://cdn.tailwindcss.com"></script></head><body>${html}</body></html>`, [html]);

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
          themeId,
          keywords,
          previewDescription,
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
            Paste or write an HTML fragment, preview it, then save it into the section library table.
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
            Theme ID
            <input
              value={themeId} onChange={(event) => setThemeId(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          </label>
          <label className="text-sm font-medium">
            Keywords
            <input
              value={keywords} onChange={(event) => setKeywords(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium">
          Preview description
          <input
            value={previewDescription} onChange={(event) => setPreviewDescription(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </label>

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
    </div>
  );
}
