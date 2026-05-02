'use client';

import { createContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { QaySite } from '@/qay/types';

type SiteContextValue = {
  site: QaySite | null;
  siteId: string | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteContextProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');
  const [site, setSite] = useState<QaySite | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!siteId) {
      setSite(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/qay/sites/${siteId}`);
      const payload = await response.json();

      if (!response.ok) {
        setSite(null);
        setError(payload.error || 'Unable to load site');
        return;
      }

      setSite(payload.data);
    } catch (err) {
      setSite(null);
      setError(err instanceof Error ? err.message : 'Unable to load site');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  const value = useMemo(
    () => ({ site, siteId, isLoading, error, refresh }),
    [site, siteId, isLoading, error]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
