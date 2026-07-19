'use client';

import { useState } from 'react';
import { UploadCloud, Sparkles, X, CheckCircle, ArrowRight } from 'lucide-react';

type SubmitTemplateButtonProps = {
  siteId: string;
  /** When provided, hides the built-in trigger button and uses external state. */
  open?: boolean;
  /** Called when the dialog should close (controlled mode). */
  onOpenChange?: (open: boolean) => void;
};

export default function SubmitTemplateButton({ siteId, open, onOpenChange }: SubmitTemplateButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    name: string;
    category: string;
    status: string;
    message: string;
  } | null>(null);

  // Support both controlled and uncontrolled modes
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  async function handleSubmit() {
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/qay/sites/${siteId}/submit-template`, {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to submit template.');
      }

      setResult({
        name: payload.template?.name || 'Custom Template',
        category: payload.template?.category || 'General',
        status: payload.template?.status || 'pending_review',
        message: payload.template?.message || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit template.');
    } finally {
      setIsScanning(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setError(null);
    setResult(null);
    setIsScanning(false);
  }

  return (
    <>
      {/* Only render built-in trigger when not externally controlled */}
      {!isControlled && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 active:scale-[0.98]"
        >
          <UploadCloud className="size-4" />
          Submit as Template
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500 animate-pulse" />
                Submit as Template
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {isScanning ? (
              <div className="mt-8 mb-4 flex flex-col items-center justify-center gap-3 py-6">
                <div className="size-10 animate-spin rounded-full border-4 border-muted-foreground/30 border-t-amber-500" />
                <p className="text-sm font-medium animate-pulse">AI is scanning your site...</p>
                <p className="text-xs text-muted-foreground text-center">Analyzing pages, extracting metadata, and cataloging features.</p>
              </div>
            ) : result ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-green-500">
                    <CheckCircle className="size-5" />
                    ✓ Submitted!
                  </div>
                  <div className="mt-3 space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">Category detected:</strong> {result.category}</p>
                    <p><strong className="text-foreground">Template name:</strong> {result.name}</p>
                    <p><strong className="text-foreground">Status:</strong> {result.status === 'active' ? 'Active ✓ (Live immediately)' : 'Pending review'}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{result.message}</p>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleClose}
                    className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:bg-accent/80"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI will scan your site layout, pages, and CMS structure to catalog it automatically.
                </p>
 
                <div className="space-y-3 py-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                      ✦
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your design will be available for other QAY users to use as a starting point.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                      ✦
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your business name and personal info will NOT be included. AI replaces all text contextually for each user.
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
                )}

                <div className="flex items-center justify-end gap-3 mt-6 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="h-9 rounded-md border border-input bg-background px-4 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex h-9 items-center gap-1.5 rounded-md bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98]"
                  >
                    Submit for review
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
