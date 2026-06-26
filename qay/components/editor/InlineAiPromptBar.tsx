'use client';

import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

type InlineAiScope = 'text' | 'section' | 'page-append';

type InlineAiPromptBarProps = {
  scope: InlineAiScope;
  currentHtml?: string;
  siteContext?: string;
  onResult: (result: { type: 'text' | 'html'; content: string }) => void;
  onClose?: () => void;
};

export default function InlineAiPromptBar({
  scope,
  currentHtml = '',
  siteContext = '',
  onResult,
  onClose,
}: InlineAiPromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (prompt.trim().length < 3) {
      setStatus('Tell AI what to change.');
      return;
    }

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/qay/ai/inline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          scope,
          currentHtml,
          siteContext,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || 'Inline AI failed.');
      onResult(body.data);
      setPrompt('');
      setStatus('Applied.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Inline AI failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3 text-foreground shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <Icon name="wand-sparkles" className="size-4" />
        </div>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          placeholder={scope === 'text' ? 'Rewrite this headline...' : scope === 'section' ? 'Make this darker and premium...' : 'Add a testimonials section...'}
        />
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Working' : 'Apply'}
        </Button>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close inline AI"
          >
            <Icon name="x" className="size-3.5" />
          </button>
        ) : null}
      </div>
      {status ? (
        <p className="mt-2 text-xs text-muted-foreground">{status}</p>
      ) : null}
    </div>
  );
}
