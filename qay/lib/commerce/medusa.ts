export type QayMedusaCommerceSettings = {
  enabled: boolean;
  backendUrl: string;
  publishableKey: string;
  regionId: string;
  salesChannelId: string;
};

export type QayMedusaProduct = {
  id: string;
  title: string;
  handle: string | null;
  thumbnail: string | null;
  description: string | null;
  price: string | null;
  status?: string | null;
};

export function normalizeMedusaCommerceSettings(value: unknown): QayMedusaCommerceSettings {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};

  return {
    enabled: record.enabled === true,
    backendUrl: typeof record.backendUrl === 'string' ? record.backendUrl.trim().replace(/\/+$/, '') : '',
    publishableKey: typeof record.publishableKey === 'string' ? record.publishableKey.trim() : '',
    regionId: typeof record.regionId === 'string' ? record.regionId.trim() : '',
    salesChannelId: typeof record.salesChannelId === 'string' ? record.salesChannelId.trim() : '',
  };
}

export function mergeMedusaCommerceSettings(siteSettings: QayMedusaCommerceSettings): QayMedusaCommerceSettings {
  return {
    enabled: siteSettings.enabled,
    backendUrl: siteSettings.backendUrl || process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '',
    publishableKey: siteSettings.publishableKey || process.env.MEDUSA_PUBLISHABLE_KEY || '',
    regionId: siteSettings.regionId || process.env.MEDUSA_REGION_ID || '',
    salesChannelId: siteSettings.salesChannelId || process.env.MEDUSA_SALES_CHANNEL_ID || '',
  };
}

export function maskMedusaCommerceSettings(settings: QayMedusaCommerceSettings) {
  return {
    ...settings,
    publishableKey: settings.publishableKey ? 'configured' : '',
    connected: Boolean(settings.enabled && settings.backendUrl && settings.publishableKey),
  };
}

export async function fetchMedusaProducts(settings: QayMedusaCommerceSettings): Promise<QayMedusaProduct[]> {
  const resolved = mergeMedusaCommerceSettings(settings);

  if (!resolved.enabled || !resolved.backendUrl || !resolved.publishableKey) {
    return [];
  }

  const params = new URLSearchParams({
    limit: '24',
    fields: '*variants.calculated_price',
  });
  if (resolved.regionId) params.set('region_id', resolved.regionId);
  if (resolved.salesChannelId) params.set('sales_channel_id', resolved.salesChannelId);

  const response = await fetch(`${resolved.backendUrl}/store/products?${params.toString()}`, {
    headers: {
      'x-publishable-api-key': resolved.publishableKey,
      accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Medusa returned ${response.status}`);
  }

  const result = await response.json();
  const products = Array.isArray(result?.products) ? result.products : [];

  return products.map((product: Record<string, unknown>) => {
    const variants = Array.isArray(product.variants) ? product.variants as Array<Record<string, unknown>> : [];
    const calculated = variants[0]?.calculated_price && typeof variants[0].calculated_price === 'object'
      ? variants[0].calculated_price as Record<string, unknown>
      : null;
    const amount = typeof calculated?.calculated_amount === 'number'
      ? calculated.calculated_amount
      : typeof calculated?.original_amount === 'number'
        ? calculated.original_amount
        : null;
    const currency = typeof calculated?.currency_code === 'string' ? calculated.currency_code.toUpperCase() : '';

    return {
      id: String(product.id || ''),
      title: String(product.title || 'Untitled product'),
      handle: typeof product.handle === 'string' ? product.handle : null,
      thumbnail: typeof product.thumbnail === 'string' ? product.thumbnail : null,
      description: typeof product.description === 'string' ? product.description : null,
      price: amount === null ? null : `${currency ? `${currency} ` : ''}${amount}`,
      status: typeof product.status === 'string' ? product.status : null,
    };
  }).filter((product: QayMedusaProduct) => product.id);
}
