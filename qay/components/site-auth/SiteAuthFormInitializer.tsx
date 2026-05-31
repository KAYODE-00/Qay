'use client';

import { useEffect } from 'react';

type SiteAuthFormInitializerProps = {
  siteId: string;
};

function setFormMessage(form: HTMLFormElement, selector: string, message: string | null) {
  const target = form.querySelector(selector) as HTMLElement | null;
  if (!target) return;

  target.textContent = message || '';
  target.hidden = !message;
}

function getPostAuthRedirectUrl() {
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (['auth', 'login', 'signup', 'forgot-password', 'reset-password'].includes(lastSegment || '')) {
    segments.pop();
    url.pathname = segments.length ? `/${segments.join('/')}` : '/';
    url.search = '';
  }

  return url.toString();
}

export function SiteAuthFormInitializer({ siteId }: SiteAuthFormInitializerProps) {
  useEffect(() => {
    const handleSubmit = async (event: SubmitEvent) => {
      const form = event.target instanceof HTMLFormElement
        ? event.target.closest('[data-qay-site-auth-form]') as HTMLFormElement | null
        : null;

      if (!form) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const formMode = form.getAttribute('data-qay-site-auth-form');
      const mode = formMode === 'signup' || formMode === 'forgot-password' || formMode === 'reset-password'
        ? formMode
        : 'signin';
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"], button:not([type])') as HTMLButtonElement | null;
      const originalLabel = submitButton?.textContent || '';

      setFormMessage(form, '[data-qay-site-auth-error]', null);
      setFormMessage(form, '[data-qay-site-auth-success]', null);
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Please wait...';
      }

      try {
        const token = new URLSearchParams(window.location.search).get('token') || '';
        const response = await fetch(`/api/qay/site-auth/${siteId}/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: String(formData.get('fullName') || formData.get('name') || ''),
            email: String(formData.get('email') || ''),
            password: String(formData.get('password') || ''),
            token,
          }),
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok || payload?.error) {
          throw new Error(payload?.error || 'Unable to continue.');
        }

        if (mode === 'forgot-password') {
          const devResetUrl = payload?.data?.devResetUrl;
          setFormMessage(
            form,
            '[data-qay-site-auth-success]',
            devResetUrl
              ? `Reset link created for testing: ${devResetUrl}`
              : 'If an account exists, a reset link has been sent.'
          );
          return;
        }

        window.location.assign(getPostAuthRedirectUrl());
      } catch (error) {
        setFormMessage(form, '[data-qay-site-auth-error]', error instanceof Error ? error.message : 'Unable to continue.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        }
      }
    };

    document.addEventListener('submit', handleSubmit, true);
    return () => document.removeEventListener('submit', handleSubmit, true);
  }, [siteId]);

  return null;
}
