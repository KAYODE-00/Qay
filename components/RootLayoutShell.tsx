import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DarkModeProvider from '@/components/DarkModeProvider';
import { getMetadataBase } from '@/lib/metadata-utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const defaultMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'QAY - AI Website Builder for Freelancers and Agencies',
    template: '%s | QAY',
  },
  description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
  applicationName: 'QAY',
  keywords: [
    'QAY',
    'AI website builder',
    'visual website builder',
    'client website builder',
    'freelance web design platform',
    'website editor',
  ],
  authors: [{ name: 'QAY' }],
  creator: 'QAY',
  publisher: 'QAY',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'QAY',
    title: 'QAY - AI Website Builder for Freelancers and Agencies',
    description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'QAY' }],
  },
  twitter: {
    card: 'summary',
    title: 'QAY - AI Website Builder for Freelancers and Agencies',
    description: 'Build, import, edit, publish, and hand off client websites from one QAY workspace.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutShellProps {
  children: React.ReactNode;
  headElements?: React.ReactNode[];
}

export default function RootLayoutShell({ children, headElements }: RootLayoutShellProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {headElements}
      </head>
      <body className={`${inter.variable} font-sans antialiased text-xs`} suppressHydrationWarning>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
