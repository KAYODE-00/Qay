'use client';

import { useEffect } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';
import { QAY_EDITOR_SITE_COOKIE, QAY_EDITOR_SITE_STORAGE_KEY } from '@/qay/lib/editor-site';

type HardReloadToYcodeProps = {
  siteId: string;
  targetUrl: string;
};

export function HardReloadToYcode({ siteId, targetUrl }: HardReloadToYcodeProps) {
  useEffect(() => {
    try {
      window.sessionStorage.setItem(QAY_EDITOR_SITE_STORAGE_KEY, siteId);
    } catch {
      // Session storage is a fallback; the server cookie is canonical.
    }

    document.cookie = `${QAY_EDITOR_SITE_COOKIE}=${encodeURIComponent(siteId)}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax`;
    window.location.replace(targetUrl);
  }, [siteId, targetUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <QayLogo />
        </div>
        <h1 className="text-xl font-semibold tracking-normal">Opening editor</h1>
        <p className="mt-2 text-sm text-white/55">Reloading the builder for this site.</p>
        <a
          href={targetUrl}
          className="mt-6 inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Continue
        </a>
      </div>
    </main>
  );
}
