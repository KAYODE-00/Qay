'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Eye, ShieldAlert, Sparkles, Filter, 
  Edit, RefreshCw, FileCode, CheckCircle2, AlertCircle, Check
} from 'lucide-react';
import { SITE_TYPE_KEYWORDS, SECTION_ORDER } from '@/qay/lib/section-library/types';

const siteTypesList = Object.keys(SITE_TYPE_KEYWORDS);
const sectionTypesList = Array.from(new Set(Object.values(SECTION_ORDER).flat()));

export function SectionsAdminClient() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterSiteType, setFilterSiteType] = useState<string>('');
  const [filterSectionType, setFilterSectionType] = useState<string>('');
  const [filterApproved, setFilterApproved] = useState<string>('all');

  // Form States
  const [editId, setEditId] = useState<string | null>(null);
  const [formSiteType, setFormSiteType] = useState<string>('ecommerce');
  const [formSectionType, setFormSectionType] = useState<string>('hero');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [manifestLine, setManifestLine] = useState('');
  const [rank, setRank] = useState<number>(85);
  const [html, setHtml] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  // Preview / Validation
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [validation, setValidation] = useState<{
    noScripts: boolean;
    noOnClicks: boolean;
    hasDataQm: boolean;
    hasCssVars: boolean;
    hasTailwind: boolean;
    isValid: boolean;
  } | null>(null);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/qay/admin/sections?`;
      if (filterSiteType) url += `siteType=${filterSiteType}&`;
      if (filterSectionType) url += `sectionType=${filterSectionType}&`;
      if (filterApproved !== 'all') url += `approved=${filterApproved === 'approved' ? 'true' : 'false'}&`;

      const res = await fetch(url);
      const resData = await res.json();
      if (resData.data) {
        setSections(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setLoading(false);
    }
  }, [filterSiteType, filterSectionType, filterApproved]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleValidate = () => {
    if (!html) {
      setValidation(null);
      return;
    }

    const noScripts = !/<script\b[^>]*>([\s\S]*?)<\/script>/gi.test(html);
    const noOnClicks = !/\bon[a-z]+\s*=/i.test(html);
    const hasDataQm = /data-qm=/i.test(html);
    const hasCssVars = /var\(--qm-/i.test(html);
    const hasTailwind = /class=/i.test(html);

    const isValid = noScripts && noOnClicks && hasDataQm && hasCssVars && hasTailwind;

    setValidation({
      noScripts,
      noOnClicks,
      hasDataQm,
      hasCssVars,
      hasTailwind,
      isValid
    });
  };

  const handlePreview = () => {
    if (!html) return;
    const fullPreview = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            :root {
              --qm-bg: #0d0d0d;
              --qm-surface: #151515;
              --qm-text: #f8f4ec;
              --qm-text-muted: #a79f91;
              --qm-accent: #c9a84c;
              --qm-accent-text: #0d0d0d;
              --qm-border: rgba(255,255,255,0.1);
              --qm-primary: #c9a84c;
              --qm-secondary: #a79f91;
              --qm-heading-font: sans-serif;
              --qm-body-font: sans-serif;
            }
            body {
              background-color: var(--qm-bg);
              color: var(--qm-text);
              font-family: var(--qm-body-font);
              margin: 0;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    setPreviewHtml(fullPreview);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!html || !manifestLine) {
      setMessage({ text: 'Please fill out all required fields.', type: 'error' });
      return;
    }

    try {
      const payload = {
        id: editId,
        site_type: formSiteType,
        section_type: formSectionType,
        keywords,
        manifest_line: manifestLine,
        html,
        rank,
        preview_image_url: previewImageUrl,
        is_approved: true,
        is_active: true,
        source: 'qay'
      };

      const method = editId ? 'PATCH' : 'POST';
      const res = await fetch('/api/qay/admin/sections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success || resData.ok) {
        setMessage({ text: editId ? 'Section updated successfully.' : 'Section saved & approved!', type: 'success' });
        resetForm();
        fetchSections();
      } else {
        setMessage({ text: resData.error || 'Failed to save section.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'An error occurred.', type: 'error' });
    }
  };

  const handleEdit = (section: any) => {
    setEditId(section.id);
    setFormSiteType(section.site_type);
    setFormSectionType(section.section_type);
    setKeywords(section.keywords || []);
    setManifestLine(section.manifest_line || '');
    setRank(section.rank || 50);
    setHtml(section.html || '');
    setPreviewImageUrl(section.preview_image_url || '');
    setValidation(null);
    setPreviewHtml(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/qay/admin/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      if (res.ok) {
        fetchSections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/qay/admin/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_approved: true }),
      });
      if (res.ok) {
        fetchSections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setKeywords([]);
    setManifestLine('');
    setRank(85);
    setHtml('');
    setPreviewImageUrl('');
    setValidation(null);
    setPreviewHtml(null);
  };

  const pendingCount = sections.filter(s => !s.is_approved).length;

  return (
    <div className="space-y-10 text-foreground pb-20">
      {message && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-70">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold">Section Submissions Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-1">Submit new designs or review sections submitted by the community.</p>
        </div>
        <button 
          onClick={() => {
            setFilterApproved(filterApproved === 'pending' ? 'all' : 'pending');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
            filterApproved === 'pending'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
        >
          <ShieldAlert className="size-4" />
          <span>View Pending ({pendingCount})</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* Submit Form */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="size-5 text-amber-400" />
              {editId ? 'Edit Section Design' : 'Submit New Section'}
            </h3>
            {editId && (
              <button onClick={resetForm} className="text-xs font-bold text-red-400 hover:underline">
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Site Type</label>
                <select 
                  value={formSiteType} 
                  onChange={(e) => setFormSiteType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground outline-none transition"
                >
                  {siteTypesList.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Section Type</label>
                <select 
                  value={formSectionType} 
                  onChange={(e) => setFormSectionType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground outline-none transition"
                >
                  {sectionTypesList.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Keywords</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {keywords.map(kw => (
                  <span key={kw} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-xs font-medium border border-border">
                    {kw}
                    <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="e.g. dark, luxury, sticky" 
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground outline-none transition"
                />
                <button 
                  type="button" 
                  onClick={handleAddKeyword}
                  className="bg-accent hover:bg-accent border border-border px-4 rounded-xl text-xs font-bold transition"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-[1fr_120px] gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Manifest Line (Description)</label>
                <input 
                  type="text" 
                  value={manifestLine}
                  onChange={(e) => setManifestLine(e.target.value)}
                  placeholder="e.g. Dark sticky nav, centered logo, minimalist" 
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Rank</label>
                <input 
                  type="number" 
                  value={rank}
                  onChange={(e) => setRank(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Preview Image URL (Optional)</label>
              <input 
                type="text" 
                value={previewImageUrl}
                onChange={(e) => setPreviewImageUrl(e.target.value)}
                placeholder="https://..." 
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-foreground outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                <span>HTML Code Content</span>
                <span className="text-[10px] text-muted-foreground normal-case">Use var(--qm-*) vars & data-qm zones</span>
              </label>
              <textarea 
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={12}
                required
                placeholder='<section style="background:var(--qm-bg)...">\n  <h1 data-qm="hero-title">...</h1>\n</section>'
                className="w-full font-mono text-xs rounded-xl border border-border bg-background p-4 focus:border-foreground outline-none transition"
              />
            </div>

            {/* Validation Feedback */}
            {validation && (
              <div className="p-4 rounded-xl border bg-accent border-border space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Validation checklist:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {validation.noScripts ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-red-500" />}
                    <span>No script tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validation.noOnClicks ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-red-500" />}
                    <span>No inline scripts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validation.hasDataQm ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-red-500" />}
                    <span>Has data-qm zones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validation.hasCssVars ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-red-500" />}
                    <span>Has var(--qm-)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validation.hasTailwind ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-red-500" />}
                    <span>Has Tailwind classes</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-3">
              <button 
                type="button" 
                onClick={handlePreview}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 border border-border hover:bg-accent rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition"
              >
                <Eye className="size-4" />
                Preview
              </button>
              <button 
                type="button" 
                onClick={handleValidate}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 border border-border hover:bg-accent rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition"
              >
                <FileCode className="size-4" />
                Validate
              </button>
              <button 
                type="submit"
                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition"
              >
                <Check className="size-4" />
                Save & Approve
              </button>
            </div>
          </form>

          {/* Sandboxed Iframe Preview */}
          {previewHtml && (
            <div className="border border-border rounded-2xl overflow-hidden mt-6">
              <div className="bg-accent px-4 py-2 text-xs font-bold border-b border-border flex items-center justify-between">
                <span>Sandbox Frame Preview</span>
                <button onClick={() => setPreviewHtml(null)} className="hover:text-red-400 text-xs font-bold">Close Preview</button>
              </div>
              <iframe 
                srcDoc={previewHtml}
                className="w-full h-80 bg-background border-none"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>

        {/* Existing Sections List */}
        <div className="space-y-6">
          {/* List Filters */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3 uppercase tracking-wider">
              <Filter className="size-4 text-muted-foreground" />
              Filter Existing Sections
            </h4>
            <div className="grid gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Site Type</label>
                <select 
                  value={filterSiteType} 
                  onChange={(e) => setFilterSiteType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-foreground outline-none transition"
                >
                  <option value="">All Site Types</option>
                  {siteTypesList.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Section Type</label>
                <select 
                  value={filterSectionType} 
                  onChange={(e) => setFilterSectionType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-foreground outline-none transition"
                >
                  <option value="">All Section Types</option>
                  {sectionTypesList.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Approval State</label>
                <select 
                  value={filterApproved} 
                  onChange={(e) => setFilterApproved(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-foreground outline-none transition"
                >
                  <option value="all">All States</option>
                  <option value="approved">Approved Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center justify-between">
              <span>Section Library ({sections.length})</span>
              <button onClick={fetchSections} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <RefreshCw className="size-3" />
                Reload
              </button>
            </h4>

            {loading ? (
              <div className="text-center py-10 text-xs text-muted-foreground">Loading sections...</div>
            ) : sections.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-2xl">No sections found.</div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {sections.map(section => (
                  <div 
                    key={section.id} 
                    className={`p-4 border rounded-2xl bg-card transition ${
                      !section.is_active ? 'opacity-50 border-dashed border-border' : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${section.is_approved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-xs font-black uppercase tracking-wider">{section.site_type}/{section.section_type}</span>
                          <span className="text-[10px] bg-accent border border-border px-2 py-0.5 rounded-full font-medium">Rank: {section.rank}</span>
                        </div>
                        <p className="text-xs font-semibold mt-2">{section.manifest_line}</p>
                        {section.keywords && section.keywords.length > 0 && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Keywords: {section.keywords.join(', ')}
                          </p>
                        )}
                        <p className="text-[9px] text-muted-foreground/60 mt-1">Source: {section.source || 'qay'}</p>
                      </div>

                      <div className="flex flex-col gap-1.5 items-end">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleEdit(section)}
                            className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition"
                            title="Edit"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button 
                            onClick={() => handleToggleActive(section.id, !!section.is_active)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold border transition ${
                              section.is_active 
                                ? 'border-amber-500/20 text-amber-500 hover:bg-amber-500/10' 
                                : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                          >
                            {section.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                        {!section.is_approved && (
                          <button 
                            onClick={() => handleApprove(section.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-md text-[10px] font-bold transition flex items-center gap-1 mt-1"
                          >
                            <Check className="size-3" />
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
