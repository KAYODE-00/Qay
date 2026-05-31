'use client';

import { useEffect } from 'react';

type SiteAuthLogoutInitializerProps = {
  siteId: string;
};

export function SiteAuthLogoutInitializer({ siteId }: SiteAuthLogoutInitializerProps) {
  useEffect(() => {
    const handleLogoutClick = async (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement
        ? event.target.closest('[data-qay-site-auth="logout"]')
        : null;

      if (!target) return;

      event.preventDefault();
      await fetch(`/api/qay/site-auth/${siteId}/logout`, { method: 'POST' });
      window.location.reload();
    };

    document.addEventListener('click', handleLogoutClick);
    return () => document.removeEventListener('click', handleLogoutClick);
  }, [siteId]);

  return null;
}
