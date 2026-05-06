import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/qay/styles/brand.css';
import RootLayoutShell from '@/components/RootLayoutShell';
import { QayBadgeInjector } from '@/qay/components/QayBadgeInjector';

export const metadata: Metadata = {
  title: {
    default: 'QAY',
    template: '%s | QAY',
  },
  description: 'Professional website builder for freelancers and agencies',
};

export default function QayLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayoutShell>
      {children}
      <QayBadgeInjector />
    </RootLayoutShell>
  );
}
