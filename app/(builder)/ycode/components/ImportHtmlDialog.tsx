'use client';

import React, { useState } from 'react';
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

export default function ImportHtmlDialog({
  open,
  onOpenChange,
  onImport,
  mode = 'layers',
}: ImportHtmlDialogProps) {
  const [html, setHtml] = useState('');
  const [pageName, setPageName] = useState('');

  const handleImport = () => {
    if (!html.trim()) return;
    onImport(html.trim(), {
      pageName: pageName.trim() || undefined,
      createPage: mode === 'page',
    });
    setHtml('');
    setPageName('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setHtml('');
    setPageName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        width="640px"
        className="gap-0"
      >
        <DialogHeader>
          <DialogTitle>Convert HTML to layers</DialogTitle>
          <DialogDescription>
            Tailwind classes become QAY design settings. Normal scripts are ignored, but QAY interaction metadata can be imported safely.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4.5">
          {mode === 'page' && (
            <label className="block space-y-2 text-sm text-muted-foreground">
              <span>Page name</span>
              <input
                value={pageName}
                onChange={(event) => setPageName(event.target.value)}
                placeholder="Homepage"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-ring"
              />
            </label>
          )}

          <CodeEditor
            value={html}
            onValueChange={setHtml}
            placeholder="Enter your HTML code here..."
            className="min-h-72 max-h-[60vh]"
            autoFocus
          />

          <DialogFooter className="grid grid-cols-2 mt-1">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!html.trim()}>
              Import
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
