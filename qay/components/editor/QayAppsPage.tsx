'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type AppWithStatus = {
  id: string;
  name: string;
  description: string;
  logo: { src: string; width: number; height: number };
  implemented: boolean;
  connected: boolean;
};

export function QayAppsPage({ siteId, canManage }: { siteId: string; canManage: boolean }) {
  const [apps, setApps] = useState<AppWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState<AppWithStatus | null>(null);
  const [jsonValue, setJsonValue] = useState('{}');

  const connectedCount = useMemo(() => apps.filter((app) => app.connected).length, [apps]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/qay/apps?site=${encodeURIComponent(siteId)}`);
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setApps(result.data);
        setError(null);
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [siteId]);

  const openApp = async (app: AppWithStatus) => {
    setActiveApp(app);
    const response = await fetch(`/api/qay/apps/${app.id}?site=${encodeURIComponent(siteId)}`);
    const result = await response.json();
    setJsonValue(JSON.stringify(result.data || {}, null, 2));
  };

  const saveApp = async () => {
    if (!activeApp) return;
    const parsed = JSON.parse(jsonValue || '{}');
    await fetch(`/api/qay/apps/${activeApp.id}?site=${encodeURIComponent(siteId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    setActiveApp(null);
    fetchApps();
  };

  const disconnectApp = async () => {
    if (!activeApp) return;
    await fetch(`/api/qay/apps/${activeApp.id}?site=${encodeURIComponent(siteId)}`, { method: 'DELETE' });
    setActiveApp(null);
    fetchApps();
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <header className="pb-6 pt-8">
          <h1 className="text-base font-medium">Site apps</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {connectedCount} app{connectedCount === 1 ? '' : 's'} connected for this site. Settings here are stored per site, not globally.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {apps.map((app) => (
              <button
                key={app.id}
                type="button"
                className="flex items-start gap-3 rounded-lg bg-secondary/20 p-4 text-left transition hover:bg-secondary/30"
                onClick={() => openApp(app)}
              >
                <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-secondary shrink-0">
                  <Image src={app.logo} alt={`${app.name} logo`} width={24} height={24} className="size-6 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{app.name}</span>
                    {app.connected && <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">Connected</span>}
                    {!app.implemented && <span className="rounded border px-1.5 py-0.5 text-[10px]">Coming soon</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!activeApp} onOpenChange={(open) => !open && setActiveApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeApp?.name} settings</DialogTitle>
            <DialogDescription>
              Save JSON settings for this site only. This keeps each app instance isolated per site.
            </DialogDescription>
          </DialogHeader>
          <textarea
            className="min-h-[320px] w-full rounded-md border bg-background p-3 font-mono text-sm"
            value={jsonValue}
            onChange={(e) => setJsonValue(e.target.value)}
            disabled={!canManage}
          />
          <DialogFooter>
            {canManage && activeApp?.connected && (
              <Button variant="secondary" onClick={disconnectApp}>Disconnect</Button>
            )}
            <Button variant="secondary" onClick={() => setActiveApp(null)}>Close</Button>
            {canManage && <Button onClick={saveApp}>Save settings</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
