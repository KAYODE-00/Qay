'use client';

import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';

interface ImportHtmlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (html: string, options?: { pageName?: string; createPage?: boolean }) => void;
  mode?: 'layers' | 'page';
}

type ImportPageDraft = {
  id: string;
  name: string;
  slug: string;
  html: string;
};

function createPageDraft(index: number): ImportPageDraft {
  if (index === 0) {
    return {
      id: `page-${Date.now()}-${index}`,
      name: 'Homepage',
      slug: '/',
      html: '',
    };
  }

  return {
    id: `page-${Date.now()}-${index}`,
    name: `Page ${index + 1}`,
    slug: `page-${index + 1}`,
    html: '',
  };
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractBodyContent(value: string) {
  const trimmed = value.trim();
  const bodyMatch = trimmed.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (bodyMatch?.[1]) {
    return bodyMatch[1].trim();
  }

  return trimmed.replace(/<!doctype[^>]*>/i, '').trim();
}

export default function ImportHtmlDialog({
  open,
  onOpenChange,
  onImport,
  mode = 'layers',
}: ImportHtmlDialogProps) {
  const [html, setHtml] = useState('');
  const [pages, setPages] = useState<ImportPageDraft[]>(() => [createPageDraft(0)]);
  const [activePageId, setActivePageId] = useState(pages[0]?.id || '');

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) || pages[0],
    [activePageId, pages]
  );

  const canImport = mode === 'page'
    ? pages.some((page) => page.html.trim())
    : Boolean(html.trim());

  const resetState = () => {
    setHtml('');
    const nextPages = [createPageDraft(0)];
    setPages(nextPages);
    setActivePageId(nextPages[0].id);
  };

  const updateActivePage = (updates: Partial<ImportPageDraft>) => {
    if (!activePage) return;
    setPages((current) => current.map((page) => (
      page.id === activePage.id ? { ...page, ...updates } : page
    )));
  };

  const addPage = () => {
    const nextPage = createPageDraft(pages.length);
    setPages((current) => [...current, nextPage]);
    setActivePageId(nextPage.id);
  };

  const removeActivePage = () => {
    if (!activePage || pages.length <= 1) return;
    const nextPages = pages.filter((page) => page.id !== activePage.id);
    setPages(nextPages);
    setActivePageId(nextPages[0].id);
  };

  const buildMultiPageHtml = () => pages
    .map((page) => ({ ...page, html: extractBodyContent(page.html) }))
    .filter((page) => page.html)
    .map((page, index) => {
      if (/\sdata-qay-page=/.test(page.html)) {
        return page.html;
      }

      const name = page.name.trim() || (index === 0 ? 'Homepage' : `Page ${index + 1}`);
      const slug = page.slug.trim() || (index === 0 ? '/' : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      return `<div data-qay-page="${escapeAttribute(name)}" data-qay-slug="${escapeAttribute(slug)}">\n${page.html.trim()}\n</div>`;
    })
    .join('\n\n');

  const handleImport = () => {
    if (!canImport) return;
    const importHtml = mode === 'page' ? buildMultiPageHtml() : html.trim();
    const firstPageName = mode === 'page'
      ? pages.find((page) => page.html.trim())?.name.trim()
      : undefined;

    onImport(importHtml, {
      pageName: firstPageName || undefined,
      createPage: mode === 'page',
    });
    resetState();
    onOpenChange(false);
  };

  const handleCancel = () => {
    resetState();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        width={mode === 'page' ? '820px' : '640px'}
        className="gap-0"
      >
        <DialogHeader>
          <DialogTitle>Convert HTML to layers</DialogTitle>
          <DialogDescription>
            Tailwind classes become QAY design settings. Paste the homepage first, add more pages when needed, then import all pages together.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4.5">
          {mode === 'page' ? (
            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <div className="flex items-center justify-between gap-2 px-2 py-1">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Pages</span>
                  <Button type="button" variant="secondary" size="sm" className="h-7 px-2 text-xs" onClick={addPage}>
                    Add page
                  </Button>
                </div>
                <div className="mt-2 space-y-1">
                  {pages.map((page, index) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setActivePageId(page.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                        page.id === activePage?.id
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <span className="block truncate">{page.name.trim() || `Page ${index + 1}`}</span>
                      <span className="block truncate text-[11px] opacity-70">{page.slug.trim() || (index === 0 ? '/' : 'page-slug')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr_auto]">
                  <label className="block space-y-2 text-sm text-muted-foreground">
                    <span>Page name</span>
                    <input
                      value={activePage?.name || ''}
                      onChange={(event) => updateActivePage({ name: event.target.value })}
                      placeholder="Homepage"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
                    />
                  </label>
                  <label className="block space-y-2 text-sm text-muted-foreground">
                    <span>Slug</span>
                    <input
                      value={activePage?.slug || ''}
                      onChange={(event) => updateActivePage({ slug: event.target.value })}
                      placeholder="/"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
                    />
                  </label>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-10"
                      onClick={removeActivePage}
                      disabled={pages.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <CodeEditor
                  value={activePage?.html || ''}
                  onValueChange={(value) => updateActivePage({ html: value })}
                  placeholder={activePage?.slug === '/' ? 'Paste homepage HTML here...' : 'Paste this page HTML here...'}
                  className="min-h-72 max-h-[60vh]"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <CodeEditor
              value={html}
              onValueChange={setHtml}
              placeholder="Enter your HTML code here..."
              className="min-h-72 max-h-[60vh]"
              autoFocus
            />
          )}

          <DialogFooter className="grid grid-cols-2 mt-1">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!canImport}>
              {mode === 'page' && pages.filter((page) => page.html.trim()).length > 1
                ? `Import ${pages.filter((page) => page.html.trim()).length} pages`
                : 'Import'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
