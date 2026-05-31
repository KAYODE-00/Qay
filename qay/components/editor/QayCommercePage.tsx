'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

type CommerceSettings = {
  enabled: boolean;
  backendUrl: string;
  publishableKey: string;
  regionId: string;
  salesChannelId: string;
  connected?: boolean;
};

type Product = {
  id: string;
  title: string;
  handle: string | null;
  thumbnail: string | null;
  description: string | null;
};

const emptySettings: CommerceSettings = {
  enabled: false,
  backendUrl: '',
  publishableKey: '',
  regionId: '',
  salesChannelId: '',
};

export function QayCommercePage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');
  const [settings, setSettings] = useState<CommerceSettings>(emptySettings);
  const [publishableKeyInput, setPublishableKeyInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/qay/sites/${siteId}/commerce/medusa`)
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(result?.error || 'Failed to load commerce settings');
        }
        return result?.data as CommerceSettings;
      })
      .then((data) => {
        if (cancelled) return;
        setSettings(data);
        setPublishableKeyInput(data.publishableKey === 'configured' ? '' : data.publishableKey || '');
      })
      .catch((error) => {
        if (!cancelled) toast.error(error instanceof Error ? error.message : 'Failed to load commerce settings');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  const updateSettings = (updates: Partial<CommerceSettings>) => {
    setSettings((current) => ({ ...current, ...updates }));
  };

  async function saveSettings() {
    if (!siteId) return;
    setIsSaving(true);

    try {
      const response = await fetch(`/api/qay/sites/${siteId}/commerce/medusa`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: settings.enabled,
          backendUrl: settings.backendUrl,
          regionId: settings.regionId,
          salesChannelId: settings.salesChannelId,
          ...(publishableKeyInput ? { publishableKey: publishableKeyInput } : {}),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to save commerce settings');
      }
      setSettings(result.data);
      setPublishableKeyInput('');
      toast.success('Commerce settings saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save commerce settings');
    } finally {
      setIsSaving(false);
    }
  }

  async function testProducts() {
    if (!siteId) return;
    setIsTesting(true);
    setProducts([]);

    try {
      const response = await fetch(`/api/qay/sites/${siteId}/commerce/products`);
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to fetch products');
      }
      setProducts(result.data || []);
      toast.success(`Loaded ${(result.data || []).length} products`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setIsTesting(false);
    }
  }

  if (!siteId) {
    return (
      <div className="p-8">
        <h1 className="text-base font-medium">Commerce</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Open this from a QAY site editor to connect ecommerce.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Medusa</p>
        <h1 className="mt-2 text-xl font-medium">Commerce</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Connect this QAY site to a Medusa backend. For now this prepares products and storefront blocks; checkout wiring can plug in once your Medusa repo is ready.
        </p>
      </div>

      <section className="rounded-lg border bg-background p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium">Medusa connection</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep disabled until your backend is running and the publishable key is ready.
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
            disabled={isLoading || isSaving}
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-medium">Backend URL</span>
            <Input
              value={settings.backendUrl}
              onChange={(event) => updateSettings({ backendUrl: event.target.value })}
              placeholder="http://localhost:9000"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium">Publishable key</span>
            <Input
              value={publishableKeyInput}
              onChange={(event) => setPublishableKeyInput(event.target.value)}
              placeholder={settings.publishableKey === 'configured' ? 'Already configured' : 'pk_...'}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium">Region ID</span>
            <Input
              value={settings.regionId}
              onChange={(event) => updateSettings({ regionId: event.target.value })}
              placeholder="Optional"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium">Sales channel ID</span>
            <Input
              value={settings.salesChannelId}
              onChange={(event) => updateSettings({ salesChannelId: event.target.value })}
              placeholder="Optional"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={saveSettings} disabled={isSaving || isLoading}>
            {isSaving ? 'Saving...' : 'Save connection'}
          </Button>
          <Button
            type="button" variant="outline"
            onClick={testProducts} disabled={isTesting || !settings.connected}
          >
            {isTesting ? 'Testing...' : 'Test products'}
          </Button>
          <span className="text-xs text-muted-foreground">
            {settings.connected ? 'Connection details are configured.' : 'Not connected yet.'}
          </span>
        </div>
      </section>

      <section className="rounded-lg border bg-background p-5">
        <h2 className="text-sm font-medium">Product preview</h2>
        {products.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Product results will appear here after Medusa is connected.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-md border">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail} alt={product.title}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="h-32 bg-muted" />
                )}
                <div className="p-3">
                  <h3 className="text-sm font-medium">{product.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {product.description || product.handle || product.id}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
