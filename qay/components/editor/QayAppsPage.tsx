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

type IntegrationField = {
  key: string;
  label: string;
  type?: 'text' | 'password' | 'url';
  placeholder: string;
  description: string;
  required?: boolean;
};

const APP_FIELDS: Record<string, IntegrationField[]> = {
  airtable: [
    {
      key: 'api_token',
      label: 'Airtable personal access token',
      type: 'password',
      placeholder: 'pat...',
      description: 'Required. Needs access to the bases and tables you want to sync.',
      required: true,
    },
  ],
  webflow: [
    {
      key: 'api_token',
      label: 'Webflow API token',
      type: 'password',
      placeholder: 'Webflow site API token',
      description: 'Required. Needs sites:read and cms:read access for the selected Webflow site.',
      required: true,
    },
    {
      key: 'site_live_url',
      label: 'Webflow live site URL',
      type: 'url',
      placeholder: 'https://your-site.webflow.io',
      description: 'Required. Used as the source live URL for imports, checks, and future Webflow-to-QAY mapping.',
      required: true,
    },
  ],
  mailerlite: [
    {
      key: 'api_key',
      label: 'MailerLite API key',
      type: 'password',
      placeholder: 'Enter your MailerLite API key',
      description: 'Required to send QAY form submissions to MailerLite groups.',
      required: true,
    },
  ],
  mapbox: [
    {
      key: 'access_token',
      label: 'Mapbox access token',
      type: 'password',
      placeholder: 'pk.eyJ1Ijo...',
      description: 'Required for Map elements using Mapbox.',
      required: true,
    },
  ],
  'google-maps-embed': [
    {
      key: 'api_key',
      label: 'Google Maps API key',
      type: 'password',
      placeholder: 'AIzaSy...',
      description: 'Required for Google embedded map elements. Enable Maps Embed API and Places API in Google Cloud.',
      required: true,
    },
  ],
};

function toFriendlyErrorMessage(message: string) {
  if (!message) return 'Something went wrong. Please try again.';
  if (message.includes('Not authenticated')) return 'Please sign in again.';
  if (message.includes('Not authorized')) return 'You do not have access to this page.';
  if (message.includes('still being set up')) return 'This area is still being set up. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

export function QayAppsPage({ siteId, canManage }: { siteId: string; canManage: boolean }) {
  const [apps, setApps] = useState<AppWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState<AppWithStatus | null>(null);
  const [settingsValue, setSettingsValue] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const connectedCount = useMemo(() => apps.filter((app) => app.connected).length, [apps]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/qay/apps?site=${encodeURIComponent(siteId)}`);
      const result = await response.json();
      if (result.error) {
        setError(toFriendlyErrorMessage(result.error));
      } else if (result.data) {
        setApps(result.data);
        setError(null);
      }
    } catch (fetchError) {
      setError(toFriendlyErrorMessage(fetchError instanceof Error ? fetchError.message : ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [siteId]);

  const openApp = async (app: AppWithStatus) => {
    setActiveApp(app);
    setFormError(null);
    const response = await fetch(`/api/qay/apps/${app.id}?site=${encodeURIComponent(siteId)}`);
    const result = await response.json();
    const nextSettings = result.data || {};
    const fields = APP_FIELDS[app.id] || [];
    setSettingsValue(Object.fromEntries(fields.map((field) => [field.key, String(nextSettings[field.key] || '')])));
  };

  const updateSettingValue = (key: string, value: string) => {
    setSettingsValue((current) => ({ ...current, [key]: value }));
  };

  const validateSettings = (app: AppWithStatus, settings: Record<string, string>) => {
    const fields = APP_FIELDS[app.id] || [];
    for (const field of fields) {
      if (field.required && !settings[field.key]?.trim()) {
        return `${field.label} is required.`;
      }
      if (field.type === 'url' && settings[field.key]?.trim()) {
        try {
          const url = new URL(settings[field.key].trim());
          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return `${field.label} must start with http:// or https://.`;
          }
        } catch {
          return `${field.label} must be a valid URL.`;
        }
      }
    }
    return null;
  };

  const saveApp = async () => {
    if (!activeApp) return;
    const validationError = validateSettings(activeApp, settingsValue);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    const payload = Object.fromEntries(
      Object.entries(settingsValue).map(([key, value]) => [key, value.trim()])
    );
    const response = await fetch(`/api/qay/apps/${activeApp.id}?site=${encodeURIComponent(siteId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (result.error) {
      setFormError(String(result.error));
      return;
    }
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
            {connectedCount} app{connectedCount === 1 ? '' : 's'} connected for this site.
          </p>
        </header>

        <section className="mb-5 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-sm font-medium">Import from Figma or Webflow</h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
                Copy frames or elements from Figma/Webflow, open the QAY editor canvas, then paste. QAY reads the external clipboard data and converts supported layout, text, images, and styles into editable layers.
              </p>
            </div>
            <div className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              Paste workflow
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-4">
              <h3 className="text-xs font-medium text-foreground">Figma</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Select the frame, section, or component in Figma, copy it, then paste directly onto the QAY canvas. No API key is required for clipboard import.
              </p>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <h3 className="text-xs font-medium text-foreground">Webflow</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Copy elements from the Webflow Designer and paste them into QAY. For site-level checks and future Webflow mapping, connect Webflow below with an API token and live site URL.
              </p>
            </div>
          </div>
        </section>

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
              <div
                key={app.id}
                className={[
                  'flex items-start gap-3 rounded-lg bg-secondary/20 p-4 text-left',
                  app.implemented ? 'transition hover:bg-secondary/30' : 'cursor-not-allowed opacity-70',
                ].join(' ')}
              >
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={app.logo} alt={`${app.name} logo`}
                    width={24} height={24}
                    className="size-6 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{app.name}</span>
                    {app.connected && <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">Connected</span>}
                    {!app.implemented && <span className="rounded border px-1.5 py-0.5 text-[10px]">Coming soon</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
                  {app.implemented && (
                    <div className="mt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => openApp(app)}
                        disabled={!canManage}
                      >
                        {app.connected ? 'Manage' : 'Connect'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!activeApp} onOpenChange={(open) => !open && setActiveApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeApp?.name} settings</DialogTitle>
            <DialogDescription>
              Save the required credentials for this site only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {(activeApp ? APP_FIELDS[activeApp.id] : [])?.map((field) => (
              <label key={field.key} className="block text-sm font-medium">
                <span className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </span>
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
                  value={settingsValue[field.key] || ''}
                  onChange={(event) => updateSettingValue(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  disabled={!canManage}
                />
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  {field.description}
                </span>
              </label>
            ))}

            {activeApp && !APP_FIELDS[activeApp.id] && (
              <p className="rounded-md border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                This app does not have a supported settings form yet.
              </p>
            )}

            {formError && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                {formError}
              </p>
            )}
          </div>
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
