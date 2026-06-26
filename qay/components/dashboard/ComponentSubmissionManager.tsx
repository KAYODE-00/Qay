'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { QayPlanKey } from '@/qay/lib/billing/plan-limits';

type ComponentRow = {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  html: string;
  preview_image_url?: string | null;
  tags?: string[] | null;
  is_public?: boolean;
  is_builtin?: boolean;
  is_approved?: boolean;
  uses_count?: number;
  created_at?: string;
};

type ComponentSubmissionManagerProps = {
  plan: QayPlanKey;
};

const CATEGORIES = [
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
  'icons',
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

function validateHtml(html: string) {
  if (html.trim().length < 20) return 'HTML is too short.';
  if (/<script\b/i.test(html)) return 'Script tags are not allowed.';
  if (/\son[a-z]+\s*=/i.test(html)) return 'Inline event handlers are not allowed.';
  if (!/\bclass\s*=/i.test(html)) return 'Add Tailwind classes before submitting.';
  return '';
}

export default function ComponentSubmissionManager({ plan }: ComponentSubmissionManagerProps) {
  const [activeTab, setActiveTab] = useState<'mine' | 'submit'>('mine');
  const [components, setComponents] = useState<ComponentRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ComponentRow | null>(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: 'cards',
    description: '',
    tags: '',
    html: '',
    isPublic: true,
  });

  const editingComponent = useMemo(() => (
    components.find((component) => component.id === editingId) || null
  ), [components, editingId]);

  useEffect(() => {
    loadComponents();
  }, []);

  function loadComponents() {
    setStatus('Loading components...');
    fetch('/api/qay/components?category=misc', { cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || 'Could not load components');
        setComponents(body?.data?.components || []);
        setStatus('');
      })
      .catch((error) => {
        setComponents([]);
        setStatus(error instanceof Error ? error.message : 'Could not load components');
      });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      name: '',
      category: 'cards',
      description: '',
      tags: '',
      html: '',
      isPublic: true,
    });
  }

  function editComponent(component: ComponentRow) {
    setEditingId(component.id);
    setForm({
      name: component.name,
      category: component.category,
      description: component.description || '',
      tags: (component.tags || []).join(', '),
      html: component.html,
      isPublic: component.is_public !== false,
    });
    setActiveTab('submit');
  }

  async function submitComponent() {
    const validationError = validateHtml(form.html);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      tags: form.tags,
      html: form.html,
      isPublic: form.isPublic,
    };

    const url = editingId ? `/api/qay/components/${encodeURIComponent(editingId)}` : '/api/qay/components';
    const response = await fetch(url, {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(body?.error || 'Could not save component');
      return;
    }

    setMessage(editingId ? 'Component updated and queued for review.' : 'Component submitted.');
    resetForm();
    setActiveTab('mine');
    loadComponents();
  }

  async function togglePublic(component: ComponentRow) {
    const response = await fetch(`/api/qay/components/${encodeURIComponent(component.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: component.is_public === false }),
    });
    if (!response.ok) {
      setMessage('Could not update visibility');
      return;
    }
    loadComponents();
  }

  async function deleteComponent() {
    if (!pendingDelete) return;
    const response = await fetch(`/api/qay/components/${encodeURIComponent(pendingDelete.id)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setMessage(body?.error || 'Could not delete component');
      return;
    }
    setMessage('Component deleted.');
    setPendingDelete(null);
    loadComponents();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Components</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Submit reusable QAY components, preview them safely, and manage visibility after review.
            </p>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {plan} plan
          </span>
        </div>

        {message ? (
          <div className="mt-5 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
            {message}
          </div>
        ) : null}

        <div className="mt-6 flex gap-2 rounded-xl border border-border bg-card p-1">
          {(['mine', 'submit'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab === 'mine' ? 'My Components' : editingComponent ? 'Edit Component' : 'Submit New'}
            </button>
          ))}
        </div>

        {activeTab === 'mine' ? (
          <section className="mt-6">
            {status ? (
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                {status}
              </div>
            ) : null}

            {!status && components.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="font-medium">No components yet</p>
                <p className="mt-2 text-sm text-muted-foreground">Submit your first component for the QAY library.</p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {components.map((component) => (
                <article key={component.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="h-44 border-b border-border bg-white">
                    <iframe
                      title={`${component.name} preview`}
                      srcDoc={buildPreview(component.html)}
                      scrolling="no"
                      className="pointer-events-none h-full w-full"
                    />
                  </div>
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold">{component.name}</h2>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">{component.category}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          component.is_approved
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {component.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    {component.description ? (
                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{component.description}</p>
                    ) : null}
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{component.uses_count || 0} uses</span>
                      <span>{component.is_public === false ? 'Private' : 'Public'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => editComponent(component)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => togglePublic(component)}
                      >
                        {component.is_public === false ? 'Public' : 'Private'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => setPendingDelete(component)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium">
                  Name
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                    placeholder="Glassmorphism Pricing Card"
                  />
                </label>
                <label className="text-sm font-medium">
                  Category
                  <select
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                  >
                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 block text-sm font-medium">
                Description
                <input
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                  placeholder="A premium animated card for pricing sections."
                />
              </label>

              <label className="mt-4 block text-sm font-medium">
                Tags
                <input
                  value={form.tags}
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                  placeholder="glass, pricing, animated"
                />
              </label>

              <label className="mt-4 block text-sm font-medium">
                HTML
                <textarea
                  value={form.html}
                  onChange={(event) => setForm((current) => ({ ...current, html: event.target.value }))}
                  className="mt-2 min-h-72 w-full rounded-lg border border-border bg-background px-3 py-3 font-mono text-xs outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                  placeholder="<section class=&quot;...&quot; data-qay-animate=&quot;slide-up&quot;>...</section>"
                />
              </label>

              <label className="mt-4 flex items-center justify-between rounded-lg border border-border px-3 py-3 text-sm">
                Public after approval
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(event) => setForm((current) => ({ ...current, isPublic: event.target.checked }))}
                  className="size-4 accent-foreground"
                />
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button type="button" onClick={submitComponent}>
                  {editingId ? 'Save changes' : 'Submit for review'}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                  >
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </div>

            <aside className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Icon name="preview" className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Preview</h2>
              </div>
              <div className="h-80 overflow-hidden rounded-lg border border-border bg-white">
                <iframe
                  title="Component preview"
                  srcDoc={buildPreview(form.html || '<div class="flex h-screen items-center justify-center text-sm text-zinc-500">Preview appears here</div>')}
                  sandbox=""
                  scrolling="no"
                  className="h-full w-full"
                />
              </div>
              <div className="mt-5 rounded-lg border border-border bg-background p-4 text-xs leading-6 text-muted-foreground">
                <p className="font-semibold text-foreground">Community guidelines</p>
                <p>- Use Tailwind classes.</p>
                <p>- Do not include script tags.</p>
                <p>- Do not use inline event handlers.</p>
                <p>- Use data-qay-animate for motion where useful.</p>
              </div>
            </aside>
          </section>
        )}
      </div>

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Delete component</p>
            <h2 className="mt-2 text-xl font-semibold">Remove {pendingDelete.name}?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This removes the component from your submissions. Existing sites that already used its HTML are not changed.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={deleteComponent}
              >
                Delete
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
