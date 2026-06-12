'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

type FeedbackState = 'idle' | 'submitting' | 'success' | 'error';

const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read an attachment.'));
    reader.readAsDataURL(file);
  });
}

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
      const files = formData
        .getAll('attachments')
        .filter((file): file is File => file instanceof File && file.size > 0);

      if (files.length > MAX_ATTACHMENTS) {
        throw new Error(`Please upload no more than ${MAX_ATTACHMENTS} files.`);
      }

      const attachments = await Promise.all(
        files.map(async (file) => {
          if (!/^(image|video)\//.test(file.type) || file.size > MAX_ATTACHMENT_BYTES) {
            throw new Error('Please upload only images or videos under 8MB each.');
          }

          return {
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: await readFileAsDataUrl(file),
          };
        })
      );

      const response = await fetch('/api/qay/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || ''),
          email: String(formData.get('email') || ''),
          category: String(formData.get('category') || 'general'),
          message: String(formData.get('message') || ''),
          sourcePath: window.location.pathname,
          attachments,
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

      <label className="mt-4 block text-sm font-medium">
        Screenshots or screen recordings
        <input
          name="attachments"
          type="file"
          multiple
          accept="image/*,video/*"
          className="mt-2 block w-full rounded-md border border-dashed border-border bg-background px-3 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-medium file:text-background hover:border-foreground/40"
        />
        <span className="mt-2 block text-xs font-normal text-muted-foreground">
          Optional. Upload up to 3 images or videos, 8MB each.
        </span>
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
