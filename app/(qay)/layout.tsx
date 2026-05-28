import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/qay/styles/brand.css';
import RootLayoutShell from '@/components/RootLayoutShell';
import { QayBadgeInjector } from '@/qay/components/QayBadgeInjector';
import { AdminUnlock } from '@/qay/components/admin/AdminUnlock';
import { fetchGlobalPageSettings } from '@/lib/generate-page-metadata';
import { getMetadataBase } from '@/lib/metadata-utils';
import { renderRootLayoutHeadCode } from '@/lib/parse-head-html';

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'QAY',
    template: '%s | QAY',
  },
  description: 'Professional website builder for freelancers and agencies',
};

export default async function QayLayout({ children }: { children: ReactNode }) {
  let headElements: React.ReactNode[] = [];

  if (process.env.SKIP_SETUP !== 'true') {
    try {
      const globalSettings = await fetchGlobalPageSettings();
      if (globalSettings.globalCustomCodeHead) {
        headElements = renderRootLayoutHeadCode(globalSettings.globalCustomCodeHead);
      }
    } catch {
      // Supabase not configured or head code unavailable.
    }
  }

  return (
    <RootLayoutShell headElements={headElements}>
      {children}
      <QayBadgeInjector />
      <AdminUnlock />
    </RootLayoutShell>
  );
}
