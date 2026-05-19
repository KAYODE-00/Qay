'use client';

import { useEffect, useState } from 'react';

interface UpdateInfo {
  available: boolean;
}

export default function UpdateNotification() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkForUpdates();

    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkForUpdates = async () => {
    try {
      const response = await fetch('/ycode/api/updates/check');
      if (response.ok) {
        const data = await response.json();
        setUpdateInfo(data);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('ycode-update-dismissed', Date.now().toString());
  };

  if (loading || !updateInfo?.available || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Upgrade your QAY plan</p>
              <p className="text-sm text-white/75">
                Unlock custom domains, collaboration, publishing capacity, and client handoff tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/pricing"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 whitespace-nowrap"
            >
              Upgrade
            </a>

            <button
              onClick={handleDismiss}
              className="p-2 text-white transition-colors hover:text-white/75"
              aria-label="Dismiss"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
