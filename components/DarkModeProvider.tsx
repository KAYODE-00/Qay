'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const QAY_THEME_EVENT = 'qay-theme-change';

/**
 * Resolves whether dark mode should be active based on the user's
 * saved theme preference and the system color scheme.
 */
function shouldApplyDark(): boolean {
  const saved = localStorage.getItem('theme') as 'system' | 'light' | 'dark' | null;
  const theme = saved || 'dark';

  if (theme === 'light') return false;
  if (theme === 'dark') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isThemedAppRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith('/ycode/preview')) return false;

  return (
    pathname.startsWith('/ycode') ||
    pathname.startsWith('/qay') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/client') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/invite')
  );
}

/**
 * DarkModeProvider
 * 
 * Client component that applies dark mode class to <html> element
 * based on the current pathname. This avoids using headers() in
 * the root layout which would force all pages to be dynamic.
 * 
 * For QAY app routes and /ycode/* routes (except preview), it
 * respects the user's saved theme preference from localStorage.
 */
export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const applyTheme = () => {
      if (!isThemedAppRoute(pathname)) {
        document.documentElement.classList.remove('dark');
        return;
      }

      if (shouldApplyDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    window.addEventListener('storage', applyTheme);
    window.addEventListener(QAY_THEME_EVENT, applyTheme);

    return () => {
      media.removeEventListener('change', applyTheme);
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener(QAY_THEME_EVENT, applyTheme);
    };
  }, [pathname]);

  return <>{children}</>;
}
