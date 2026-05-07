'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BADGE_ID = 'qay-site-badge';

function shouldShowBadge(pathname: string | null) {
  return pathname?.startsWith('/qay/preview') ?? false;
}

export function QayBadgeInjector() {
  const pathname = usePathname();

  useEffect(() => {
    const existingBadge = document.getElementById(BADGE_ID);

    if (!shouldShowBadge(pathname)) {
      existingBadge?.remove();
      return;
    }

    if (existingBadge) {
      return;
    }

    const badge = document.createElement('a');
    badge.id = BADGE_ID;
    badge.href = 'https://qaybuilder.com';
    badge.target = '_blank';
    badge.rel = 'noreferrer noopener';
    badge.setAttribute('aria-label', 'Built with QAY');
    badge.style.cssText = [
      'position: fixed',
      'bottom: 16px',
      'right: 16px',
      'z-index: 9999',
      'display: flex',
      'align-items: center',
      'gap: 7px',
      'padding: 8px 14px',
      'background: #0a0a0a',
      'border: 1px solid rgba(255,255,255,0.12)',
      'border-radius: 9999px',
      'text-decoration: none',
      'font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'font-size: 12px',
      'font-weight: 500',
      'line-height: 1',
      'color: #ffffff',
      'box-shadow: 0 10px 30px rgba(0,0,0,0.22)',
    ].join(';');
    badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 2L7 7M7 7L12 12M7 7L12 2M7 7L2 12" stroke="white" stroke-width="2" stroke-linecap="round"/></svg><span>Built with QAY</span>`;

    document.body.appendChild(badge);

    return () => {
      if (document.getElementById(BADGE_ID) === badge) {
        badge.remove();
      }
    };
  }, [pathname]);

  return null;
}
