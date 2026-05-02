import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import RootLayoutShell from '@/components/RootLayoutShell';

export const metadata: Metadata = {
  title: 'QAY',
  description: 'Professional website builder for freelancers and agencies',
};

export default function QayLayout({ children }: { children: ReactNode }) {
  return <RootLayoutShell>{children}</RootLayoutShell>;
}
