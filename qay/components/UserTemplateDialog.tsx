'use client';

import { FormEvent, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { readQayEditorSiteIdFromBrowser } from '@/qay/lib/editor-site';

type UserTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CATEGORIES = ['Portfolio', 'Business', 'SaaS', 'Landing', 'Blog', 'Ecommerce', 'Personal', 'Other'];

export default function UserTemplateDialog({ open, onOpenChange }: UserTemplateDialogProps) {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [templateUrl, setTemplateUrl] = useState('');
  const [sourceLabel, setSourceLabel] = useState('QAY');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Portfolio');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const currentSiteId = readQayEditorSiteIdFromBrowser();
    setSiteId(currentSiteId);
    setTemplateUrl('');
    setSourceLabel('QAY');
    setMessage(null);
    setError(null);

    if (!currentSiteId) return;

    let cancelled = false;
    fetch(`/api/qay/sites/${currentSiteId}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const nextUrl = payload?.data?.qay_url || payload?.data?.live_url;
        if (!cancelled && nextUrl) {
          setTemplateUrl(nextUrl);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!siteId) {
      setError('Open a site before saving it as a template.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/qay/templates/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          name,
          previewUrl: templateUrl,
          sourceLabel,
          description,
          category,
          pricingMode: 'free',
          intendedPrice: null,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to save template');
      }

      const status = payload?.data?.status;
      setMessage(status === 'approved'
        ? 'Template saved successfully. It is now available in the template gallery.'
        : 'Template saved. It is waiting for review.');
      setName('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl border border-border bg-background p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Make template</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Save this site as a reusable template for your dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Close"
          >
            <Icon name="x" className="size-3" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Template name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={80}
              className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none transition focus:border-foreground"
              placeholder="Agency homepage"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Live preview URL</span>
            <input
              value={templateUrl}
              onChange={(event) => setTemplateUrl(event.target.value)}
              type="url"
              className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none transition focus:border-foreground"
              placeholder="https://qay-theta.vercel.app/my-template"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Source label</span>
            <input
              value={sourceLabel}
              onChange={(event) => setSourceLabel(event.target.value)}
              maxLength={40}
              className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none transition focus:border-foreground"
              placeholder="QAY, Ycode, Webflow"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">About template</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none transition focus:border-foreground"
              placeholder="A clean homepage for studios, consultants, or service brands."
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none transition focus:border-foreground"
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          {(message || error) && (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${
                error ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
              }`}
            >
              {error || message}
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save template'}
          </Button>
        </div>
      </form>
    </div>
  );
}
