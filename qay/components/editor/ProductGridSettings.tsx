'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

type ProductGridSettingsProps = {
  siteId: string;
  selectedLayerId?: string | null;
  onApply?: (settings: ProductGridSettingsPayload) => void;
  onInsertGridHtml?: (html: string) => void;
  onInsertDetailPageHtml?: (html: string) => void;
};

type ProductGridSettingsPayload = {
  selectedLayerId?: string | null;
  collectionId: string;
  productsPerRow: number;
  showFilters: boolean;
  filters: string[];
};

type ProductApiData = {
  collectionId: string;
  products: Array<{ id: string; name: string; price: number; images: string[] }>;
  productGridHtml: string;
  productDetailPageHtml: string;
};

const FILTERS = ['Category', 'Price', 'Size', 'Color'];

export default function ProductGridSettings({
  siteId,
  selectedLayerId,
  onApply,
  onInsertGridHtml,
  onInsertDetailPageHtml,
}: ProductGridSettingsProps) {
  const [data, setData] = useState<ProductApiData | null>(null);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<string[]>(['Category', 'Price', 'Size']);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('Loading product collection...');
    fetch(`/api/qay/sites/${encodeURIComponent(siteId)}/products`, { cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || 'Could not load products');
        if (cancelled) return;
        setData(body?.data || null);
        setStatus('');
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error instanceof Error ? error.message : 'Could not load products');
      });

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  const previewProducts = useMemo(() => data?.products?.slice(0, 4) || [], [data]);

  function toggleFilter(filter: string) {
    setFilters((current) => (
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    ));
  }

  function applySettings() {
    if (!data?.collectionId) return;
    const payload = {
      selectedLayerId,
      collectionId: data.collectionId,
      productsPerRow,
      showFilters,
      filters,
    };

    if (onApply) {
      onApply(payload);
    } else {
      window.dispatchEvent(new CustomEvent('qay:configure-product-grid', { detail: payload }));
    }

    setMessage('Product grid settings applied');
    window.setTimeout(() => setMessage(''), 2200);
  }

  function insertGrid() {
    if (!data?.productGridHtml) return;
    if (onInsertGridHtml) {
      onInsertGridHtml(data.productGridHtml);
    } else {
      window.dispatchEvent(new CustomEvent('qay:insert-component-html', {
        detail: {
          html: data.productGridHtml,
          componentName: 'CMS Product Grid',
        },
      }));
    }
  }

  function insertDetailPage() {
    if (!data?.productDetailPageHtml) return;
    if (onInsertDetailPageHtml) {
      onInsertDetailPageHtml(data.productDetailPageHtml);
    } else {
      window.dispatchEvent(new CustomEvent('qay:insert-component-html', {
        detail: {
          html: data.productDetailPageHtml,
          componentName: 'Product Detail Page',
        },
      }));
    }
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 border-b border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Commerce CMS</p>
        <h2 className="mt-1 text-lg font-semibold">Product Grid</h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Bind one product card to your Products collection and let QAY repeat it on published pages.
        </p>
      </div>

      {message ? (
        <div className="mx-4 mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
          {message}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar">
        {status ? (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {status}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Bound collection</p>
                  <p className="mt-1 text-sm font-semibold">Products</p>
                </div>
                <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-muted-foreground">
                  {data.products.length} items
                </span>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4">
              <label className="text-xs font-medium text-muted-foreground">
                Products per row
                <select
                  value={productsPerRow}
                  onChange={(event) => setProductsPerRow(Number(event.target.value))}
                  className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                >
                  {[2, 3, 4].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>

              <label className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                Show filters
                <input
                  type="checkbox"
                  checked={showFilters}
                  onChange={(event) => setShowFilters(event.target.checked)}
                  className="size-4 accent-foreground"
                />
              </label>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">Filter by</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => toggleFilter(filter)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        filters.includes(filter)
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Preview items</p>
                <Icon name="filter" className="size-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {previewProducts.length > 0 ? previewProducts.map((product) => (
                  <article key={product.id} className="overflow-hidden rounded-lg border border-border bg-background">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-square bg-muted" />
                    )}
                    <div className="p-2">
                      <p className="truncate text-xs font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">${product.price}</p>
                    </div>
                  </article>
                )) : (
                  <p className="col-span-2 text-xs text-muted-foreground">No products yet. Add products through the API or bulk import.</p>
                )}
              </div>
            </section>

            <div className="grid gap-2">
              <Button type="button" onClick={applySettings}>Apply binding</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={insertGrid}
              >
                Insert product grid
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={insertDetailPage}
              >
                Insert detail page
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}
