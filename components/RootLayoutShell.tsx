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

const preHydrationThemeScript = `
(function () {
  try {
    var path = window.location.pathname || '';
    var isPreview = path.indexOf('/ycode/preview') === 0 || path.indexOf('/qay/preview') === 0;
    var themed =
      path === '/' ||
      path.indexOf('/ycode') === 0 ||
      path.indexOf('/qay') === 0 ||
      path.indexOf('/dashboard') === 0 ||
      path.indexOf('/client') === 0 ||
      path.indexOf('/login') === 0 ||
      path.indexOf('/signup') === 0 ||
      path.indexOf('/forgot-password') === 0 ||
      path.indexOf('/reset-password') === 0 ||
      path.indexOf('/invite') === 0 ||
      path.indexOf('/pricing') === 0 ||
      path.indexOf('/compare') === 0 ||
      path.indexOf('/feedback') === 0;

    if (!themed || isPreview) {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      return;
    }

    var saved = localStorage.getItem('theme') || 'dark';
    var useDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', useDark);
    document.documentElement.style.colorScheme = useDark ? 'dark' : 'light';
  } catch (error) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`;

export default function RootLayoutShell({ children, headElements }: RootLayoutShellProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preHydrationThemeScript }} />
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
