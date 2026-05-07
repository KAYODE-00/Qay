import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/qay/styles/brand.css';
import RootLayoutShell from '@/components/RootLayoutShell';
import { fetchGlobalPageSettings } from '@/lib/generate-page-metadata';
import { renderRootLayoutHeadCode } from '@/lib/parse-head-html';

export const metadata: Metadata = {
  title: {
    default: 'Client Dashboard',
    template: '%s | QAY',
  },
  description: 'Review and update shared client site content in QAY.',
};

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headElements: React.ReactNode[] = [];

  if (process.env.SKIP_SETUP !== 'true') {
    try {
      const globalSettings = await fetchGlobalPageSettings();
      if (globalSettings.globalCustomCodeHead) {
        headElements = renderRootLayoutHeadCode(globalSettings.globalCustomCodeHead);
      }
    } catch {
      // Ignore setup-related failures for the client shell.
    }
  }

  return <RootLayoutShell headElements={headElements}>{children}</RootLayoutShell>;
}
