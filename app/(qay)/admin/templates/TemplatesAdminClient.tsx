'use client';

import { useState, useCallback, useRef } from 'react';

interface TemplateRow {
  id: string;
  label: string;
  industry: string;
  color_mood: string;
  tags: string[];
  features: { hasCms?: boolean; hasCommerce?: boolean; hasAuth?: boolean; pageCount?: number };
  is_approved: boolean;
  is_active: boolean;
  rank: number;
  source: string;
  preview_image_url?: string;
  created_at: string;
}

const INDUSTRY_OPTIONS = [
  'ecommerce', 'restaurant', 'saas', 'agency', 'portfolio', 'law', 'medical',
  'blog', 'beauty', 'fitness', 'hotel', 'real-estate', 'church', 'education',
  'event', 'music', 'photography', 'nonprofit', 'construction', 'tech-startup',
];

const MOOD_OPTIONS = [
  'dark-luxury', 'dark-bold', 'dark-minimal', 'light-minimal',
  'light-luxury', 'warm-classic', 'bold-vibrant', 'fresh-modern',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'green' | 'yellow' | 'blue' | 'default' }) {
  const colors = {
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    default: 'bg-white/5 text-white/60 border-white/10',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

function FeatureDots({ features }: { features: TemplateRow['features'] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {features?.hasCommerce && <Badge variant="green">🛒 Commerce</Badge>}
      {features?.hasCms && <Badge variant="blue">📝 CMS</Badge>}
      {features?.hasAuth && <Badge variant="yellow">🔐 Auth</Badge>}
      {features?.pageCount && features.pageCount > 1 && <Badge>{features.pageCount} pages</Badge>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TemplatesAdminClient() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState<TemplateRow | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [html, setHtml] = useState('');
  const [label, setLabel] = useState('');
  const [siteType, setSiteType] = useState('');
  const [rank, setRank] = useState('70');
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  // Filter state
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterApproved, setFilterApproved] = useState('');

  // Edit state
  const [editRank, setEditRank] = useState('');
  const [editApproved, setEditApproved] = useState(false);
  const [editActive, setEditActive] = useState(true);
  const [editTags, setEditTags] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (filterIndustry) params.set('industry', filterIndustry);
    if (filterApproved) params.set('approved', filterApproved);
    const res = await fetch(`/api/qay/admin/templates?${params}`);
    const json = await res.json();
    if (json.error) setError(json.error);
    else setTemplates(json.data || []);
    setLoading(false);
    setFetched(true);
  }, [filterIndustry, filterApproved]);

  const submitTemplate = async () => {
    if (!html.trim() || !label.trim()) {
      setError('Label and HTML are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/qay/admin/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, label, site_type: siteType, rank: Number(rank) || 70 }),
    });
    const json = await res.json();
    if (json.error) {
      setError(json.error);
    } else {
      setSuccess(`✓ Template "${label}" submitted and analyzed successfully! ID: ${json.id}`);
      setHtml('');
      setLabel('');
      fetchTemplates();
    }
    setSubmitting(false);
  };

  const patchTemplate = async (id: string, updates: Record<string, unknown>) => {
    const res = await fetch('/api/qay/admin/templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    const json = await res.json();
    if (json.error) setError(json.error);
    else {
      setSuccess('Updated.');
      fetchTemplates();
      setEditMode(false);
      setSelected(null);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Deactivate this template?')) return;
    await fetch(`/api/qay/admin/templates?id=${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  const openEdit = (t: TemplateRow) => {
    setSelected(t);
    setEditRank(String(t.rank));
    setEditApproved(t.is_approved);
    setEditActive(t.is_active);
    setEditTags((t.tags || []).join(', '));
    setEditMode(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0a0a0a]/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">AI Template Library</h1>
            <p className="text-sm text-white/40">Submit, review and manage site templates</p>
          </div>
          <a href="/admin" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white transition">
            ← Admin
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">

        {/* Status messages */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
            <button onClick={() => setError('')} className="ml-4 opacity-60 hover:opacity-100">✕</button>
          </div>
        )}
        {success && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
            {success}
            <button onClick={() => setSuccess('')} className="ml-4 opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Submit a template */}
        <section className="rounded-3xl border border-white/8 bg-white/3 p-6 space-y-5">
          <h2 className="text-base font-semibold">Submit New Template</h2>
          <p className="text-sm text-white/50">Paste complete multi-page HTML below. The AI will analyze it and extract metadata automatically.</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Template Label *</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Urban Streetwear Shop"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm placeholder:text-white/30 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Site Type (optional — AI will detect)</label>
              <select
                value={siteType}
                onChange={(e) => setSiteType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white/80 focus:border-white/30 focus:outline-none"
              >
                <option value="">Auto-detect</option>
                {INDUSTRY_OPTIONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Rank (higher = preferred)</label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                min="0"
                max="200"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              Template HTML *
              <span className="ml-2 text-white/30">Must use var(--qm-...) variables and data-qm zones</span>
            </label>
            <textarea
              ref={htmlRef}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={12}
              placeholder="Paste your full multi-page HTML here..."
              spellCheck={false}
              className="w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-5 py-4 text-xs font-mono text-white/70 placeholder:text-white/20 focus:border-white/20 focus:outline-none resize-y"
            />
            <p className="mt-1.5 text-xs text-white/30">{html.length.toLocaleString()} characters</p>
          </div>

          <button
            onClick={submitTemplate}
            disabled={submitting || !html.trim() || !label.trim()}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Analyzing template…' : 'Submit & Analyze'}
          </button>
        </section>

        {/* Browse templates */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <h2 className="text-base font-semibold mr-auto">Template Library</h2>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111] px-4 py-2 text-sm text-white/70 focus:outline-none"
            >
              <option value="">All industries</option>
              {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111] px-4 py-2 text-sm text-white/70 focus:outline-none"
            >
              <option value="">All status</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
            <button
              onClick={fetchTemplates}
              disabled={loading}
              className="rounded-xl border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5 disabled:opacity-50 transition"
            >
              {loading ? 'Loading…' : fetched ? 'Refresh' : 'Load Templates'}
            </button>
          </div>

          {fetched && templates.length === 0 && !loading && (
            <div className="rounded-2xl border border-white/8 bg-white/3 px-6 py-12 text-center">
              <p className="text-white/40">No templates found. Submit one above to get started.</p>
            </div>
          )}

          {templates.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((t) => (
                <article
                  key={t.id}
                  className={`rounded-3xl border bg-white/3 p-5 space-y-3.5 transition ${t.is_active ? 'border-white/8' : 'border-red-500/20 opacity-50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{t.label}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{t.industry} · {t.color_mood}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {t.is_approved ? <Badge variant="green">Approved</Badge> : <Badge variant="yellow">Pending</Badge>}
                      {!t.is_active && <Badge variant="yellow">Inactive</Badge>}
                    </div>
                  </div>

                  <FeatureDots features={t.features || {}} />

                  {t.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {t.tags.slice(0, 6).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-white/40">{tag}</span>
                      ))}
                      {t.tags.length > 6 && <span className="text-[10px] text-white/25">+{t.tags.length - 6}</span>}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/6 pt-3">
                    <span className="text-xs text-white/30">Rank: {t.rank} · {t.source}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/5 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTemplate(t.id)}
                        className="rounded-lg border border-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Edit modal */}
        {editMode && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-3xl border border-white/12 bg-[#111] p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Edit: {selected.label}</h2>
                <button onClick={() => { setEditMode(false); setSelected(null); }} className="text-white/40 hover:text-white text-xl leading-none">✕</button>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Rank</label>
                  <input
                    type="number"
                    value={editRank}
                    onChange={(e) => setEditRank(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Tags (comma-separated)</label>
                  <input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex gap-5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox" checked={editApproved}
                      onChange={(e) => setEditApproved(e.target.checked)} className="rounded"
                    />
                    <span>Approved</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox" checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)} className="rounded"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => patchTemplate(selected.id, {
                    rank: Number(editRank),
                    is_approved: editApproved,
                    is_active: editActive,
                    tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
                  })}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 transition"
                >
                  Save changes
                </button>
                <button
                  onClick={() => { setEditMode(false); setSelected(null); }}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
