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
  description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
  applicationName: 'QAY',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'QAY',
    title: 'QAY',
    description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'QAY' }],
  },
  twitter: {
    card: 'summary',
    title: 'QAY',
    description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
    images: ['/icon.png'],
  },
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
