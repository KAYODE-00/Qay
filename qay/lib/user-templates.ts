import 'server-only';

import { randomUUID } from 'crypto';
import type { Knex } from 'knex';
import type { Layer } from '@/types';
import { getKnexClient } from '@/lib/knex-client';
import { generateId } from '@/lib/utils';
import { generatePageLayersHash, generatePageMetadataHash } from '@/lib/hash-utils';
import { buildQayIndexSlug } from '@/qay/lib/index-slug';
import { layersContainPromptLeak } from '@/qay/lib/ai/prompt-leak';
import { callWithFallbackDetailed } from '@/qay/lib/ai/providers';
import { withResolvedQayLiveUrl } from '@/qay/lib/site-url';

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
};

type ApplyTemplateInput = {
  userId: string;
  templateId: string;
  siteId: string;
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
      layerMap.set(row.page_id, Array.isArray(row.layers) ? row.layers : []);
    }
  }

  const snapshots = pages.map((page): TemplatePageSnapshot => ({
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
    layers: layerMap.get(page.id) || [],
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

async function reviewTemplateWithAi(payload: TemplatePayload, fallbackScore: number) {
  const pageSummaries = payload.pages.map((page) => ({
    name: page.name,
    slug: page.slug,
    is_index: page.is_index,
    error_page: page.error_page,
    ...collectLayerStats(page.layers),
  }));

  const result = await callWithFallbackDetailed(
    `Review this QAY template summary for gallery readiness. Return JSON only:
${JSON.stringify({ pages: pageSummaries }, null, 2)}`,
    `You review website templates. Return one JSON object only: {"approved": boolean, "score": number, "notes": string}.
Approve only if the template has a meaningful homepage, enough sections, usable layout structure, and no placeholder-only content.`,
    (text) => {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new Error('AI review returned invalid JSON.');
      }
      const parsed = JSON.parse(text.slice(start, end + 1)) as { approved?: boolean; score?: number; notes?: string };
      return {
        approved: parsed.approved === true,
        score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.score))) : fallbackScore,
        notes: typeof parsed.notes === 'string' ? parsed.notes.slice(0, 400) : '',
      };
    }
  );

  return result.value || { approved: false, score: fallbackScore, notes: '' };
}

function cloneLayers(layers: Layer[]) {
  const idMap = new Map<string, string>();

  const firstPass = (items: Layer[]): Layer[] => items.map((layer) => {
    const nextId = generateId('lyr');
    idMap.set(layer.id, nextId);
    return {
      ...layer,
      id: nextId,
      children: layer.children ? firstPass(layer.children) : undefined,
    };
  });

  const cloned = firstPass(layers);

  const secondPass = (items: Layer[]): Layer[] => items.map((layer) => ({
    ...layer,
    interactions: layer.interactions?.map((interaction) => ({
      ...interaction,
      id: generateId('int'),
      tweens: interaction.tweens.map((tween) => ({
        ...tween,
        id: generateId('anm'),
        layer_id: idMap.get(tween.layer_id) || layer.id,
      })),
    })),
    children: layer.children ? secondPass(layer.children) : undefined,
  }));

  return secondPass(cloned);
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
    .first('id', 'slug', 'custom_domain', 'live_url', 'publish_status');

  if (!site) {
    throw new Error('Site not found');
  }

  const payload = await buildTemplatePayload(knex, input.siteId);
  const local = localReview(payload);
  let status: QayUserTemplateStatus = 'pending_review';
  let reviewScore = local.score;
  let reviewNotes = local.notes;

  try {
    const aiReview = await reviewTemplateWithAi(payload, local.score);
    reviewScore = aiReview.score;
    reviewNotes = aiReview.notes || local.notes;
    status = aiReview.approved && aiReview.score >= 75 ? 'approved' : 'pending_review';
  } catch (error) {
    console.warn('[QAY user templates] AI review unavailable, saving as pending:', error);
    status = 'pending_review';
  }

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
      preview_url: withResolvedQayLiveUrl(site).live_url || `/${site.slug}`,
      review_score: reviewScore,
      review_notes: reviewNotes,
      template_payload: payload,
      created_at: now,
      updated_at: now,
    })
    .returning(['id', 'name', 'status', 'review_score', 'review_notes']);

  return created;
}

export async function listUserTemplates(userId: string) {
  const knex = await getKnexClient();
  await ensureUserTemplatesTable(knex);

  const ownTemplates = await knex('qay_user_templates')
    .where('owner_id', userId)
    .select('id', 'name', 'description', 'category', 'status', 'pricing_mode', 'intended_price', 'paid_available', 'preview_url', 'review_score', 'review_notes', 'created_at', 'updated_at')
    .orderBy('updated_at', 'desc');

  const communityTemplates = await knex('qay_user_templates')
    .where('status', 'approved')
    .whereNot('owner_id', userId)
    .select('id', 'name', 'description', 'category', 'status', 'pricing_mode', 'intended_price', 'paid_available', 'preview_url', 'review_score', 'created_at', 'updated_at')
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

  const payload = template.template_payload as TemplatePayload;
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

  await knex.transaction(async (trx) => {
    for (const [index, page] of payload.pages.entries()) {
      const pageId = randomUUID();
      const isRootHomepage = page.error_page === null && page.page_folder_id === null && page.is_index && !hasRootIndex;
      const isIndex = isRootHomepage;
      if (isIndex) {
        hasRootIndex = true;
      }
      const slug = isIndex
        ? buildQayIndexSlug(input.siteId)
        : uniqueSlug(page.slug || page.name, usedSlugs);
      const settings = {
        ...(page.settings || {}),
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
      const layers = cloneLayers(page.layers || []);

      await trx('pages').insert(pageRecord);
      await trx('page_layers').insert({
        page_id: pageId,
        layers,
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
