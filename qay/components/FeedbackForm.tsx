'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

type FeedbackState = 'idle' | 'submitting' | 'success' | 'error';

export function FeedbackForm() {
  const [state, setState] = useState<FeedbackState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/qay/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || ''),
          email: String(formData.get('email') || ''),
          category: String(formData.get('category') || 'general'),
          message: String(formData.get('message') || ''),
          sourcePath: window.location.pathname,
        }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.error || 'Could not send feedback.');
      }

      form.reset();
      setState('success');
      setMessage('Thank you. Your feedback has been sent.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Could not send feedback.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Name
          <input
            name="name"
            className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="Your name"
          />
        </label>
        <label className="text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium">
        Type
        <select
          name="category"
          className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground"
          defaultValue="general"
        >
          <option value="general">General feedback</option>
          <option value="bug">Bug or broken flow</option>
          <option value="ai">AI builder quality</option>
          <option value="commerce">Ecommerce / Medusa</option>
          <option value="feature">Feature request</option>
        </select>
      </label>

      <label className="mt-4 block text-sm font-medium">
        Feedback
        <textarea
          name="message"
          required
          minLength={8}
          rows={6}
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-foreground"
          placeholder="Tell us what felt good, confusing, broken, or missing."
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'submitting' ? 'Sending...' : 'Send feedback'}
        </button>
        {message && (
          <p className={`text-sm ${state === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
