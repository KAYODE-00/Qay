import { randomUUID } from 'crypto';
import type { CollectionField, CollectionFieldType, CollectionItemWithValues } from '@/types';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { createCollection } from '@/lib/repositories/collectionRepository';
import { createField, getFieldsByCollectionId } from '@/lib/repositories/collectionFieldRepository';
import { createItem, createItemsBulk, deleteItem, getItemsWithValues, updateItem } from '@/lib/repositories/collectionItemRepository';
import { insertValuesBulk, setValuesByFieldName } from '@/lib/repositories/collectionItemValueRepository';

export type QayProductInput = {
  id?: string;
  name?: string;
  price?: number | string;
  compare_price?: number | string | null;
  description?: string;
  images?: string[] | string;
  sizes?: string[] | string;
  colors?: Array<{ name: string; hex: string }> | string;
  stock?: number | string | null;
  sku?: string;
  handle?: string;
  category?: string;
  tags?: string[] | string;
  is_featured?: boolean | string;
  is_on_sale?: boolean | string;
};

export type QayProductRecord = Required<Omit<QayProductInput, 'id' | 'price' | 'compare_price' | 'stock' | 'is_featured' | 'is_on_sale'>> & {
  id: string;
  price: number;
  compare_price: number | null;
  stock: number;
  is_featured: boolean;
  is_on_sale: boolean;
};

const PRODUCT_COLLECTION_NAME = 'Products';

const STANDARD_PRODUCT_FIELDS: Array<{
  key: keyof Omit<QayProductInput, 'id'>;
  name: string;
  type: CollectionFieldType;
  data?: Record<string, unknown>;
}> = [
  { key: 'name', name: 'Name', type: 'text' },
  { key: 'price', name: 'Price', type: 'number' },
  { key: 'compare_price', name: 'Compare price', type: 'number' },
  { key: 'description', name: 'Description', type: 'rich_text' },
  { key: 'images', name: 'Images', type: 'image', data: { multiple: true } },
  { key: 'sizes', name: 'Sizes', type: 'text' },
  { key: 'colors', name: 'Colors', type: 'text' },
  { key: 'stock', name: 'Stock', type: 'number' },
  { key: 'sku', name: 'SKU', type: 'text' },
  { key: 'handle', name: 'Handle', type: 'text' },
  { key: 'category', name: 'Category', type: 'text' },
  { key: 'tags', name: 'Tags', type: 'text' },
  { key: 'is_featured', name: 'Featured', type: 'boolean' },
  { key: 'is_on_sale', name: 'On sale', type: 'boolean' },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `product-${Date.now()}`;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return toArray(parsed);
    } catch {
      // Comma-separated fallback.
    }
    return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function toColors(value: unknown): Array<{ name: string; hex: string }> {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === 'object') {
        const row = item as Record<string, unknown>;
        return {
          name: String(row.name || row.label || '').trim(),
          hex: String(row.hex || row.color || '#111111').trim(),
        };
      }
      return { name: String(item).trim(), hex: '#111111' };
    }).filter((item) => item.name);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      return toColors(JSON.parse(trimmed));
    } catch {
      return trimmed.split(',').map((item) => ({ name: item.trim(), hex: '#111111' })).filter((item) => item.name);
    }
  }
  return [];
}

function toNumber(value: unknown, fallback = 0) {
  const numberValue = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').trim().toLowerCase();
  return ['true', 'yes', '1', 'featured', 'sale', 'on'].includes(normalized);
}

export function normalizeProductInput(input: QayProductInput): Omit<QayProductRecord, 'id'> {
  const name = String(input.name || 'Untitled product').trim();
  const price = toNumber(input.price);
  const comparePrice = input.compare_price === null || input.compare_price === undefined || input.compare_price === ''
    ? null
    : toNumber(input.compare_price, price);
  const handle = String(input.handle || slugify(name)).trim();

  return {
    name,
    price,
    compare_price: comparePrice,
    description: String(input.description || '').trim(),
    images: toArray(input.images),
    sizes: toArray(input.sizes),
    colors: toColors(input.colors),
    stock: Math.max(0, Math.round(toNumber(input.stock, 0))),
    sku: String(input.sku || '').trim(),
    handle: slugify(handle),
    category: String(input.category || '').trim(),
    tags: toArray(input.tags),
    is_featured: toBoolean(input.is_featured),
    is_on_sale: toBoolean(input.is_on_sale) || (comparePrice !== null && comparePrice > price),
  };
}

function serializeProductValue(field: CollectionField, product: Omit<QayProductRecord, 'id'>) {
  const key = field.key as keyof Omit<QayProductRecord, 'id'> | null;
  if (!key) return null;
  const value = product[key];
  if (Array.isArray(value) || (value && typeof value === 'object')) return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === null || value === undefined) return null;
  return String(value);
}

function parseProductValue(field: CollectionField, raw: unknown) {
  const value = raw == null ? '' : String(raw);
  if (['images', 'sizes', 'tags'].includes(field.key || '')) return toArray(value);
  if (field.key === 'colors') return toColors(value);
  if (['price', 'compare_price', 'stock'].includes(field.key || '')) {
    if (!value && field.key === 'compare_price') return null;
    return toNumber(value);
  }
  if (['is_featured', 'is_on_sale'].includes(field.key || '')) return toBoolean(value);
  return value;
}

export async function ensureQayProductCollection(siteId: string, userId: string | null) {
  const supabase = getQayAdmin() as any;
  const { data: links, error: linkError } = await supabase
    .from('qay_site_collections')
    .select('collection_id')
    .eq('site_id', siteId);

  if (linkError) throw new Error(linkError.message);

  const collectionIds = (links || []).map((row: { collection_id: string }) => row.collection_id);
  let collectionId: string | null = null;

  if (collectionIds.length > 0) {
    const { data: collections, error } = await supabase
      .from('collections')
      .select('id, name')
      .in('id', collectionIds)
      .eq('is_published', false)
      .is('deleted_at', null);
    if (error) throw new Error(error.message);
    collectionId = (collections || []).find((collection: { name: string }) => (
      collection.name?.toLowerCase() === PRODUCT_COLLECTION_NAME.toLowerCase()
    ))?.id || null;
  }

  if (!collectionId) {
    const collection = await createCollection({
      name: PRODUCT_COLLECTION_NAME,
      sorting: { field: 'manual_order', direction: 'manual' },
      order: 0,
      is_published: false,
    });
    collectionId = collection.id;
    const { error } = await supabase
      .from('qay_site_collections')
      .insert({ site_id: siteId, collection_id: collectionId, created_by: userId });
    if (error) throw new Error(error.message);
  }

  const fields = await ensureProductFields(collectionId);
  return { collectionId, fields };
}

export async function ensureProductFields(collectionId: string) {
  const currentFields = await getFieldsByCollectionId(collectionId, false);
  const currentByKey = new Map(currentFields.map((field) => [field.key, field]));
  const created: CollectionField[] = [];

  for (const [index, definition] of STANDARD_PRODUCT_FIELDS.entries()) {
    if (currentByKey.has(definition.key)) continue;
    const field = await createField({
      collection_id: collectionId,
      name: definition.name,
      key: definition.key,
      type: definition.type,
      order: index,
      data: definition.data || {},
      is_published: false,
    });
    created.push(field);
  }

  return [...currentFields, ...created].sort((a, b) => a.order - b.order);
}

export async function listQayProducts(siteId: string, userId: string) {
  const { collectionId, fields } = await ensureQayProductCollection(siteId, userId);
  const { items, total } = await getItemsWithValues(collectionId, false, { limit: 200 });
  return {
    collectionId,
    fields,
    total,
    products: items.map((item) => productFromItem(item, fields)),
  };
}

export async function createQayProduct(siteId: string, userId: string, input: QayProductInput) {
  const { collectionId, fields } = await ensureQayProductCollection(siteId, userId);
  const product = normalizeProductInput(input);
  const item = await createItem({ collection_id: collectionId, is_publishable: true });
  await setProductValues(collectionId, item.id, fields, product);
  return { collectionId, product: { id: item.id, ...product } };
}

export async function updateQayProduct(siteId: string, userId: string, productId: string, input: QayProductInput) {
  const { collectionId, fields } = await ensureQayProductCollection(siteId, userId);
  await assertProductBelongsToCollection(collectionId, productId);
  await updateItem(productId, { is_publishable: true }, false);
  const product = normalizeProductInput(input);
  await setProductValues(collectionId, productId, fields, product);
  return { collectionId, product: { id: productId, ...product } };
}

export async function deleteQayProduct(siteId: string, userId: string, productId: string) {
  const { collectionId } = await ensureQayProductCollection(siteId, userId);
  await assertProductBelongsToCollection(collectionId, productId);
  await deleteItem(productId, false);
}

export async function bulkCreateQayProducts(siteId: string, userId: string, inputs: QayProductInput[]) {
  const { collectionId, fields } = await ensureQayProductCollection(siteId, userId);
  const normalized = inputs.map(normalizeProductInput);
  const items = await createItemsBulk(normalized.map((_, index) => ({
    id: randomUUID(),
    collection_id: collectionId,
    manual_order: index,
    is_publishable: true,
  })));

  const values = items.flatMap((item, itemIndex) => (
    fields.map((field) => ({
      item_id: item.id,
      field_id: field.id,
      value: serializeProductValue(field, normalized[itemIndex]),
      is_published: false,
    }))
  ));
  await insertValuesBulk(values);

  return {
    collectionId,
    products: items.map((item, index) => ({ id: item.id, ...normalized[index] })),
  };
}

async function setProductValues(
  collectionId: string,
  itemId: string,
  fields: CollectionField[],
  product: Omit<QayProductRecord, 'id'>
) {
  const values = Object.fromEntries(
    fields.map((field) => [field.id, serializeProductValue(field, product)])
  ) as Record<string, string | null>;
  const fieldTypes = Object.fromEntries(fields.map((field) => [field.id, field.type]));
  await setValuesByFieldName(itemId, collectionId, values, fieldTypes, false);
}

async function assertProductBelongsToCollection(collectionId: string, productId: string) {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('collection_items')
    .select('id')
    .eq('id', productId)
    .eq('collection_id', collectionId)
    .eq('is_published', false)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Product not found in this site');
}

function productFromItem(item: CollectionItemWithValues, fields: CollectionField[]): QayProductRecord {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    if (!field.key) continue;
    values[field.key] = parseProductValue(field, item.values[field.id]);
  }
  const normalized = normalizeProductInput(values as QayProductInput);
  return { id: item.id, ...normalized };
}

export function buildProductGridElementHtml(collectionId: string) {
  return `<section class="bg-white px-6 py-16 text-black dark:bg-[#090909] dark:text-white" data-qay-product-grid="cms" data-qay-collection-id="${collectionId}">
  <div class="mx-auto max-w-7xl">
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.28em] text-black/45 dark:text-white/45">Shop</p>
        <h2 class="mt-3 text-4xl font-black tracking-tight md:text-6xl">Latest products</h2>
      </div>
      <div class="flex flex-wrap gap-2 text-xs font-semibold">
        <button type="button" class="rounded-full border border-black/10 px-4 py-2 dark:border-white/15">Category</button>
        <button type="button" class="rounded-full border border-black/10 px-4 py-2 dark:border-white/15">Size</button>
        <button type="button" class="rounded-full border border-black/10 px-4 py-2 dark:border-white/15">Price</button>
      </div>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-qay-commerce="product-grid" data-qay-cms-repeat="products">
      <article class="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5" data-qay-commerce="product-card" data-qay-cms-template="product-card">
        <div class="overflow-hidden bg-black/5" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&q=85" alt="Product" class="aspect-[4/5] w-full object-cover" data-qay-commerce="product-image" data-qay-bind="images.0" />
        </div>
        <div class="space-y-3 p-4">
          <h3 class="text-lg font-bold" data-qay-commerce="product-title" data-qay-bind="name">Product name</h3>
          <p class="text-sm text-black/60 dark:text-white/60" data-qay-commerce="product-description" data-qay-bind="description">Product description</p>
          <div class="flex items-center justify-between gap-3">
            <span class="font-black" data-qay-commerce="product-price" data-qay-bind="price">$0</span>
            <button type="button" class="rounded-full bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black" data-qay-commerce="add-to-cart">Add to cart</button>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`;
}

export function buildProductDetailPageHtml(collectionId: string) {
  return `<div data-qay-page="Product Detail" data-qay-slug="products/[handle]" data-qay-dynamic-collection-id="${collectionId}">
  <main class="bg-white text-black dark:bg-[#090909] dark:text-white">
    <section class="grid min-h-screen gap-10 px-6 py-10 lg:grid-cols-2 lg:px-12">
      <div class="grid gap-4 sm:grid-cols-[96px_1fr]">
        <div class="hidden gap-3 sm:grid">
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&auto=format&q=85" alt="Product thumbnail" class="aspect-square rounded-xl object-cover" data-qay-bind="images.0" />
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&q=85" alt="Product thumbnail" class="aspect-square rounded-xl object-cover" data-qay-bind="images.1" />
        </div>
        <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&auto=format&q=85" alt="Product image" class="aspect-[4/5] w-full rounded-3xl object-cover" data-qay-commerce="product-image" data-qay-bind="images.0" />
      </div>
      <div class="flex items-center">
        <div class="w-full max-w-xl space-y-7">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-black/45 dark:text-white/45" data-qay-bind="category">Category</p>
          <h1 class="text-5xl font-black tracking-tight md:text-7xl" data-qay-commerce="product-title" data-qay-bind="name">Product name</h1>
          <div class="flex items-center gap-4">
            <span class="text-3xl font-black" data-qay-commerce="product-price" data-qay-bind="price">$0</span>
            <span class="text-lg text-black/35 line-through dark:text-white/35" data-qay-bind="compare_price">$0</span>
          </div>
          <p class="text-base leading-8 text-black/65 dark:text-white/65" data-qay-commerce="product-description" data-qay-bind="description">Product description.</p>
          <div>
            <p class="mb-3 text-sm font-bold">Size</p>
            <div class="flex flex-wrap gap-2" data-qay-bind-list="sizes"><button type="button" class="rounded-full border border-black/15 px-4 py-2 text-sm dark:border-white/15">M</button></div>
          </div>
          <div>
            <p class="mb-3 text-sm font-bold">Color</p>
            <div class="flex flex-wrap gap-2" data-qay-bind-list="colors"><button type="button" class="size-9 rounded-full border border-black/15 bg-black dark:border-white/15" aria-label="Black"></button></div>
          </div>
          <div class="grid gap-3 sm:grid-cols-[120px_1fr_1fr]">
            <input type="number" min="1" value="1" class="rounded-xl border border-black/10 bg-transparent px-4 py-3 dark:border-white/15" />
            <button type="button" class="rounded-xl bg-black px-5 py-3 font-bold text-white dark:bg-white dark:text-black" data-qay-commerce="add-to-cart">Add to cart</button>
            <button type="button" class="rounded-xl border border-black/10 px-5 py-3 font-bold dark:border-white/15" data-qay-commerce="checkout-button">Buy now</button>
          </div>
          <div class="grid gap-3 text-sm text-black/60 dark:text-white/60 sm:grid-cols-2">
            <p class="rounded-2xl border border-black/10 p-4 dark:border-white/10">Delivery: Ships in 2-5 business days.</p>
            <p class="rounded-2xl border border-black/10 p-4 dark:border-white/10">Returns: 14-day exchange window.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>`;
}
