'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Portfolio');
  const [pricingMode, setPricingMode] = useState<'free' | 'paid'>('free');
  const [intendedPrice, setIntendedPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const currentSiteId = readQayEditorSiteIdFromBrowser();
    setSiteId(currentSiteId);
    setTemplateUrl('');
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

  const paidNotice = useMemo(() => {
    if (pricingMode !== 'paid') return null;
    return 'Paid template selling is not live yet. We will save the amount and keep this template free for now.';
  }, [pricingMode]);

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
          description,
          category,
          pricingMode,
          intendedPrice: pricingMode === 'paid' ? Number(intendedPrice) : null,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to save template');
      }

      const status = payload?.data?.status;
      setMessage(status === 'approved'
        ? 'Template saved and published to the template gallery.'
        : 'Template saved. It is waiting for review.');
      setName('');
      setDescription('');
      setIntendedPrice('');
      setPricingMode('free');
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

          {templateUrl && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">Template URL</span>
              <span className="mt-1 block break-all text-muted-foreground">{templateUrl}</span>
            </div>
          )}

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none transition focus:border-foreground"
              placeholder="A clean homepage for studios, consultants, or service brands."
            />
          </label>

          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
            QAY will use this site&apos;s generated preview image for the template card.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Pricing</span>
              <select
                value={pricingMode}
                onChange={(event) => setPricingMode(event.target.value as 'free' | 'paid')}
                className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none transition focus:border-foreground"
              >
                <option value="free">Free</option>
                <option value="paid">Paid later</option>
              </select>
            </label>
          </div>

          {pricingMode === 'paid' && (
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Intended price</span>
              <input
                value={intendedPrice}
                onChange={(event) => setIntendedPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none transition focus:border-foreground"
                placeholder="29"
              />
            </label>
          )}

          {paidNotice && (
            <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {paidNotice}
            </p>
          )}

          {(message || error) && (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${
                error ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200' : 'border-border bg-muted/40 text-muted-foreground'
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
