'use client';

import { useEffect } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';

type HardReloadToYcodeProps = {
  targetUrl: string;
};

export function HardReloadToYcode({ targetUrl }: HardReloadToYcodeProps) {
  useEffect(() => {
    window.location.replace(targetUrl);
  }, [targetUrl]);

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
