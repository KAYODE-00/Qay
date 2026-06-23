import 'server-only';

import { randomUUID } from 'crypto';
import type { Knex } from 'knex';
import type { Layer } from '@/types';
import { getKnexClient } from '@/lib/knex-client';
import { generateId } from '@/lib/utils';
import { generatePageLayersHash, generatePageMetadataHash } from '@/lib/hash-utils';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';
import { layersContainPromptLeak } from '@/qay/lib/ai/prompt-leak';
import { getQaySiteBaseUrl } from '@/qay/lib/site-url';

export type QayUserTemplateStatus = 'private' | 'pending_review' | 'approved' | 'rejected';
export type QayUserTemplatePricingMode = 'free' | 'paid';

type TemplatePageSnapshot = {
  id: string;
  name: string;
  slug: string;
  is_index: boolean;
  is_dynamic: boolean;
  error_page: number | null;
  page_folder_id: string | null;
  order: number;
  depth: number;
  settings: Record<string, unknown>;
  layers: Layer[];
};

type TemplatePayload = {
  version: 1;
  pages: TemplatePageSnapshot[];
};

type SubmitTemplateInput = {
  ownerId: string;
  siteId: string;
  name: string;
  description: string;
  category: string;
  pricingMode: QayUserTemplatePricingMode;
  intendedPrice: number | null;
  thumbnailUrl?: string;
  previewUrl?: string;
  sourceLabel?: string;
};

type ApplyTemplateInput = {
  userId: string;
  templateId: string;
  siteId: string;
};

type DeleteTemplateInput = {
  userId: string;
  templateId: string;
};

function normalizeCategory(value: string) {
  const category = value.trim().replace(/\s+/g, ' ').slice(0, 48);
  return category || 'General';
}

function normalizePrice(value: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

async function ensureUserTemplatesTable(knex: Knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS qay_user_templates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      source_site_id uuid REFERENCES qay_sites(id) ON DELETE SET NULL,
      name text NOT NULL,
      description text NOT NULL DEFAULT '',
      category text NOT NULL DEFAULT 'General',
      status text NOT NULL DEFAULT 'private' CHECK (status IN ('private', 'pending_review', 'approved', 'rejected')),
      pricing_mode text NOT NULL DEFAULT 'free' CHECK (pricing_mode IN ('free', 'paid')),
      intended_price numeric(10, 2),
      paid_available boolean NOT NULL DEFAULT false,
      preview_url text,
      thumbnail_url text,
      source_label text NOT NULL DEFAULT 'QAY',
      review_score integer,
      review_notes text,
      template_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await knex.raw('CREATE INDEX IF NOT EXISTS qay_user_templates_owner_id_idx ON qay_user_templates(owner_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS qay_user_templates_status_idx ON qay_user_templates(status)');
  await knex.raw('CREATE INDEX IF NOT EXISTS qay_user_templates_category_idx ON qay_user_templates(category)');
  await knex.raw('ALTER TABLE qay_user_templates ADD COLUMN IF NOT EXISTS thumbnail_url text');
  await knex.raw("ALTER TABLE qay_user_templates ADD COLUMN IF NOT EXISTS source_label text NOT NULL DEFAULT 'QAY'");
}

function normalizeTemplateUrl(value: string) {
  const trimmed = value.trim().slice(0, 1000);
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    return '';
  }

  return '';
}

function normalizeLayers(value: unknown): Layer[] {
  if (Array.isArray(value)) return value as Layer[];
  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as Layer[] : [];
  } catch {
    return [];
  }
}

function ensureBodyLayer(layers: Layer[]): Layer[] {
  if (layers.length === 1 && (layers[0]?.id === 'body' || layers[0]?.name === 'body')) {
    return [
      {
        ...layers[0],
        id: 'body',
        name: 'body',
        children: layers[0].children || [],
      },
    ];
  }

  return [
    {
      id: 'body',
      name: 'body',
      classes: '',
      children: layers,
    } as Layer,
  ];
}

function normalizeTemplatePayload(value: unknown): TemplatePayload | null {
  const parsed = typeof value === 'string'
    ? (() => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    })()
    : value;

  if (!parsed || typeof parsed !== 'object') return null;
  const payload = parsed as Partial<TemplatePayload>;
  if (!Array.isArray(payload.pages)) return null;

  const normalizedPages = payload.pages.map((page) => {
    const rawPage = page && typeof page === 'object' ? page as Partial<TemplatePageSnapshot> : {};
    return {
      id: String(rawPage.id || ''),
      name: String(rawPage.name || 'Page'),
      slug: String(rawPage.slug || ''),
      is_index: Boolean(rawPage.is_index),
      is_dynamic: Boolean(rawPage.is_dynamic),
      error_page: typeof rawPage.error_page === 'number' ? rawPage.error_page : null,
      page_folder_id: typeof rawPage.page_folder_id === 'string' ? rawPage.page_folder_id : null,
      order: Number(rawPage.order ?? 0),
      depth: Number(rawPage.depth ?? 0),
      settings: rawPage.settings && typeof rawPage.settings === 'object' ? rawPage.settings : {},
      layers: normalizeLayers(rawPage.layers),
    };
  });

  return {
    version: 1,
    pages: normalizedPages,
  };
}

function collectLayerStats(layers: Layer[]) {
  const flat: Layer[] = [];
  const walk = (items: Layer[]) => {
    for (const layer of items) {
      flat.push(layer);
      if (layer.children) walk(layer.children);
    }
  };
  walk(layers);

  return {
    totalLayers: flat.length,
    sections: flat.filter((layer) => layer.name === 'section' || layer.settings?.tag === 'section').length,
    textLayers: flat.filter((layer) => ['heading', 'text', 'richText', 'button'].includes(layer.name)).length,
    imageLayers: flat.filter((layer) => layer.name === 'image').length,
    interactionLayers: flat.filter((layer) => layer.interactions?.length).length,
  };
}

function collectAssetVariableIds(value: unknown, ids = new Set<string>()) {
  if (!value) return ids;

  if (Array.isArray(value)) {
    for (const item of value) {
      collectAssetVariableIds(item, ids);
    }
    return ids;
  }

  if (typeof value !== 'object') return ids;

  const record = value as Record<string, unknown>;
  const data = record.data as Record<string, unknown> | undefined;

  if (record.type === 'asset' && typeof data?.asset_id === 'string') {
    ids.add(data.asset_id);
  }

  for (const entry of Object.values(record)) {
    collectAssetVariableIds(entry, ids);
  }

  return ids;
}

async function getPortableAssetUrlMap(knex: Knex, layers: Layer[]) {
  const assetIds = Array.from(collectAssetVariableIds(layers));

  if (assetIds.length === 0) {
    return new Map<string, string>();
  }

  const rows = await knex('assets')
    .whereIn('id', assetIds)
    .whereNull('deleted_at')
    .select('id', 'public_url', 'content');

  return new Map(
    rows
      .map((asset) => {
        const url = asset.public_url
          || (asset.content ? `data:image/svg+xml,${encodeURIComponent(asset.content)}` : '');
        return [asset.id, url] as const;
      })
      .filter(([, url]) => Boolean(url))
  );
}

function makeTemplateAssetsPortable(value: unknown, assetUrlMap: Map<string, string>): unknown {
  if (!value) return value;

  if (Array.isArray(value)) {
    return value.map((item) => makeTemplateAssetsPortable(item, assetUrlMap));
  }

  if (typeof value !== 'object') return value;

  const record = value as Record<string, unknown>;
  const data = record.data as Record<string, unknown> | undefined;

  if (record.type === 'asset' && typeof data?.asset_id === 'string') {
    const url = assetUrlMap.get(data.asset_id);
    if (url) {
      return {
        type: 'dynamic_text',
        data: { content: url },
      };
    }
  }

  return Object.fromEntries(
    Object.entries(record).map(([key, entry]) => [
      key,
      makeTemplateAssetsPortable(entry, assetUrlMap),
    ])
  );
}

async function buildTemplatePayload(knex: Knex, siteId: string): Promise<TemplatePayload> {
  const pages = await knex('pages')
    .whereNull('deleted_at')
    .where('is_published', false)
    .whereRaw("coalesce(settings->>'qay_site_id', '') = ?", [siteId])
    .select(
      'id',
      'name',
      'slug',
      'is_index',
      'is_dynamic',
      'error_page',
      'page_folder_id',
      'order',
      'depth',
      'settings'
    )
    .orderBy('order', 'asc')
    .orderBy('created_at', 'asc');

  if (pages.length === 0) {
    throw new Error('Add at least one page before saving this as a template.');
  }

  const pageIds = pages.map((page) => page.id);
  const layerRows = await knex('page_layers')
    .whereNull('deleted_at')
    .where('is_published', false)
    .whereIn('page_id', pageIds)
    .select('page_id', 'layers', 'created_at')
    .orderBy('created_at', 'desc');

  const layerMap = new Map<string, Layer[]>();
  for (const row of layerRows) {
    if (!layerMap.has(row.page_id)) {
      layerMap.set(row.page_id, normalizeLayers(row.layers));
    }
  }

  const snapshots = await Promise.all(pages.map(async (page): Promise<TemplatePageSnapshot> => {
    const layers = ensureBodyLayer(layerMap.get(page.id) || []);
    const assetUrlMap = await getPortableAssetUrlMap(knex, layers);
    const portableLayers = makeTemplateAssetsPortable(layers, assetUrlMap) as Layer[];

    return {
      id: page.id,
      name: page.name || 'Page',
      slug: page.slug || '',
      is_index: Boolean(page.is_index),
      is_dynamic: Boolean(page.is_dynamic),
      error_page: page.error_page ?? null,
      page_folder_id: page.page_folder_id ?? null,
      order: Number(page.order ?? 0),
      depth: Number(page.depth ?? 0),
      settings: page.settings || {},
      layers: portableLayers,
    };
  }));

  if (snapshots.every((page) => page.layers.length === 0)) {
    throw new Error('Add page content before saving this as a template.');
  }

  if (snapshots.some((page) => layersContainPromptLeak(page.layers))) {
    throw new Error('This template still contains prompt text. Replace it with real page content first.');
  }

  return { version: 1, pages: snapshots };
}

function localReview(payload: TemplatePayload) {
  const regularPages = payload.pages.filter((page) => page.error_page === null);
  const homepage = regularPages.find((page) => page.is_index) || regularPages[0];
  const stats = homepage ? collectLayerStats(homepage.layers) : null;

  if (!homepage || !stats) {
    return { score: 20, notes: 'No previewable page was found.' };
  }

  let score = 35;
  if (regularPages.length > 0) score += 10;
  if (stats.totalLayers >= 12) score += 15;
  if (stats.sections >= 2) score += 15;
  if (stats.textLayers >= 5) score += 10;
  if (stats.imageLayers > 0) score += 5;
  if (stats.interactionLayers > 0) score += 5;

  return {
    score: Math.min(score, 100),
    notes: score >= 75 ? 'Template has enough structure for the gallery.' : 'Template needs more structure before gallery approval.',
  };
}

function remapTemplateReferences(value: unknown, layerIdMap: Map<string, string>, pageIdMap: Map<string, string>): unknown {
  if (typeof value === 'string') {
    return layerIdMap.get(value) || pageIdMap.get(value) || value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => remapTemplateReferences(item, layerIdMap, pageIdMap));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      remapTemplateReferences(entry, layerIdMap, pageIdMap),
    ])
  );
}

function cloneLayers(layers: Layer[], pageIdMap = new Map<string, string>()) {
  const idMap = new Map<string, string>();

  const firstPass = (items: Layer[]): Layer[] => items.map((layer) => {
    const isBodyLayer = layer.id === 'body' || layer.name === 'body';
    const nextId = isBodyLayer ? 'body' : generateId('lyr');
    idMap.set(layer.id, nextId);
    return {
      ...layer,
      id: nextId,
      name: isBodyLayer ? 'body' : layer.name,
      children: layer.children ? firstPass(layer.children) : undefined,
    };
  });

  const cloned = firstPass(layers);

  const secondPass = (items: Layer[]): Layer[] => items.map((layer) => ({
    ...(remapTemplateReferences(layer, idMap, pageIdMap) as Layer),
    interactions: layer.interactions?.map((interaction) => ({
      ...(remapTemplateReferences(interaction, idMap, pageIdMap) as typeof interaction),
      id: generateId('int'),
      tweens: interaction.tweens.map((tween) => ({
        ...(remapTemplateReferences(tween, idMap, pageIdMap) as typeof tween),
        id: generateId('anm'),
        layer_id: idMap.get(tween.layer_id) || layer.id,
      })),
    })),
    children: layer.children ? secondPass(layer.children) : undefined,
  }));

  return secondPass(cloned);
}

function remapPageSettings(settings: Record<string, unknown>, pageIdMap: Map<string, string>) {
  return remapTemplateReferences(settings, new Map<string, string>(), pageIdMap) as Record<string, unknown>;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/g, '') || 'page';
}

function uniqueSlug(base: string, used: Set<string>) {
  const clean = slugify(base);
  let candidate = clean;
  let counter = 2;
  while (used.has(candidate)) {
    candidate = `${clean}-${counter++}`;
  }
  used.add(candidate);
  return candidate;
}

export async function submitUserTemplate(input: SubmitTemplateInput) {
  const knex = await getKnexClient();
  await ensureUserTemplatesTable(knex);

  const site = await knex('qay_sites')
    .where({ id: input.siteId, owner_id: input.ownerId })
    .first('id', 'slug', 'custom_domain', 'domain_verified', 'live_url', 'publish_status', 'thumbnail_url');

  if (!site) {
    throw new Error('Site not found');
  }

  const payload = await buildTemplatePayload(knex, input.siteId);
  const local = localReview(payload);
  const status: QayUserTemplateStatus = 'approved';
  const reviewScore = Math.max(local.score, 90);
  const reviewNotes = local.notes || 'Template was automatically approved for publishing.';

  const pricingMode = input.pricingMode === 'paid' ? 'paid' : 'free';
  const intendedPrice = pricingMode === 'paid' ? normalizePrice(input.intendedPrice) : null;
  const now = new Date().toISOString();
  const [created] = await knex('qay_user_templates')
    .insert({
      id: randomUUID(),
      owner_id: input.ownerId,
      source_site_id: input.siteId,
      name: input.name.trim().slice(0, 80),
      description: input.description.trim().slice(0, 500),
      category: normalizeCategory(input.category),
      status,
      pricing_mode: pricingMode,
      intended_price: intendedPrice,
      paid_available: false,
      preview_url: input.previewUrl ? normalizeTemplateUrl(input.previewUrl) : (getQaySiteBaseUrl(site) || site.live_url || `/${site.slug}`),
      thumbnail_url: normalizeTemplateUrl(input.thumbnailUrl || '') || site.thumbnail_url || null,
      source_label: input.sourceLabel?.trim().replace(/\s+/g, ' ').slice(0, 40) || 'QAY',
      review_score: reviewScore,
      review_notes: reviewNotes,
      template_payload: payload,
      created_at: now,
      updated_at: now,
    })
    .returning(['id', 'name', 'status', 'review_score', 'review_notes']);

  return created;
}

export async function listPublicUserTemplates() {
  const knex = await getKnexClient();
  await ensureUserTemplatesTable(knex);

  return knex('qay_user_templates')
    .where('status', 'approved')
    .select('id', 'name', 'description', 'category', 'preview_url', 'thumbnail_url', 'source_label', 'updated_at')
    .orderBy('updated_at', 'desc')
    .limit(72);
}

export async function listUserTemplates(userId: string) {
  const knex = await getKnexClient();
  await ensureUserTemplatesTable(knex);

  const ownTemplates = await knex('qay_user_templates')
    .where('owner_id', userId)
    .select('id', 'name', 'description', 'category', 'status', 'pricing_mode', 'intended_price', 'paid_available', 'preview_url', 'thumbnail_url', 'source_label', 'review_score', 'review_notes', 'created_at', 'updated_at')
    .orderBy('updated_at', 'desc');

  const communityTemplates = await knex('qay_user_templates')
    .where('status', 'approved')
    .whereNot('owner_id', userId)
    .select('id', 'name', 'description', 'category', 'status', 'pricing_mode', 'intended_price', 'paid_available', 'preview_url', 'thumbnail_url', 'source_label', 'review_score', 'created_at', 'updated_at')
    .orderBy('updated_at', 'desc')
    .limit(48);

  return {
    templates: ownTemplates,
    communityTemplates,
    counts: {
      total: ownTemplates.length,
      pending: ownTemplates.filter((template) => template.status === 'pending_review').length,
      approved: ownTemplates.filter((template) => template.status === 'approved').length,
    },
  };
}

export async function applyUserTemplate(input: ApplyTemplateInput) {
  const knex = await getKnexClient();
  await ensureUserTemplatesTable(knex);

  const site = await knex('qay_sites')
    .where({ id: input.siteId, owner_id: input.userId })
    .first('id');

  if (!site) {
    throw new Error('Site not found');
  }

  const template = await knex('qay_user_templates')
    .where('id', input.templateId)
    .andWhere((builder) => {
      builder.where('owner_id', input.userId).orWhere('status', 'approved');
    })
    .first('id', 'name', 'template_payload');

  if (!template) {
    throw new Error('Template not found');
  }

  const payload = normalizeTemplatePayload(template.template_payload);
  if (!payload?.pages?.length) {
    throw new Error('Template has no pages to apply.');
  }

  const existingPages = await knex('pages')
    .whereNull('deleted_at')
    .where('is_published', false)
    .whereRaw("coalesce(settings->>'qay_site_id', '') = ?", [input.siteId])
    .select('slug', 'is_index', 'page_folder_id', 'error_page');
  const usedSlugs = new Set(existingPages.map((page) => page.slug || '').filter(Boolean));
  let hasRootIndex = existingPages.some((page) => page.is_index && page.page_folder_id === null && page.error_page === null);
  const now = new Date().toISOString();
  const pageIdMap = new Map(payload.pages.map((page) => [page.id, randomUUID()]));

  await knex.transaction(async (trx) => {
    for (const [index, page] of payload.pages.entries()) {
      const pageId = pageIdMap.get(page.id) || randomUUID();
      const isRootHomepage = page.error_page === null
        && page.page_folder_id === null
        && !hasRootIndex
        && (page.is_index || index === 0);
      const isIndex = isRootHomepage;
      if (isIndex) {
        hasRootIndex = true;
      }
      const slug = isIndex
        ? buildQayIndexSlug(input.siteId)
        : uniqueSlug(page.slug || page.name, usedSlugs);
      const settings = {
        ...remapPageSettings(page.settings || {}, pageIdMap),
        qay_site_id: input.siteId,
        source_user_template_id: input.templateId,
      };
      const pageRecord = {
        id: pageId,
        name: isIndex ? 'Home' : page.name,
        slug,
        is_published: false,
        page_folder_id: null,
        order: page.order ?? index,
        depth: 0,
        is_index: isIndex,
        is_dynamic: false,
        error_page: page.error_page,
        settings,
        content_hash: generatePageMetadataHash({
          name: isIndex ? 'Home' : page.name,
          slug,
          settings,
          is_index: isIndex,
          is_dynamic: false,
          error_page: page.error_page,
        }),
        created_at: now,
        updated_at: now,
      };
      const rawLayers = ensureBodyLayer(normalizeLayers(page.layers));
      const assetUrlMap = await getPortableAssetUrlMap(trx, rawLayers);
      const portableLayers = makeTemplateAssetsPortable(rawLayers, assetUrlMap) as Layer[];
      const layers = cloneLayers(portableLayers, pageIdMap);

      await trx('pages').insert(pageRecord);
      await trx('page_layers').insert({
        page_id: pageId,
        layers: JSON.stringify(layers),
        is_published: false,
        content_hash: generatePageLayersHash({ layers, generated_css: null }),
        created_at: now,
        updated_at: now,
      });
    }

    await trx('qay_sites')
      .where('id', input.siteId)
      .update({ updated_at: now });
  });

  return { success: true, templateName: template.name };
}

export async function deleteUserTemplate(input: DeleteTemplateInput) {
  const knex = await getKnexClient();
  await ensureUserTemplatesTable(knex);

  const deleted = await knex('qay_user_templates')
    .where({ id: input.templateId, owner_id: input.userId })
    .delete();

  if (!deleted) {
    throw new Error('Template not found');
  }

  return { success: true };
}
