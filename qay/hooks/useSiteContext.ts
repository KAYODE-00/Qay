import { useContext } from 'react';
import { SiteContext } from '@/qay/components/SiteContext';

export function useSiteContext() {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error('useSiteContext must be used inside SiteContextProvider');
  }

  return context;
}
