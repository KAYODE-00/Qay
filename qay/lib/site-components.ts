import type { Knex } from 'knex';
import type { Component } from '@/types';
import { getKnexClient } from '@/lib/knex-client';

export type QaySiteComponentSource = 'user' | 'template';

export type QayScopedComponent = Component & {
  qay_site_category?: string | null;
  qay_component_source?: QaySiteComponentSource | string | null;
  qay_template_id?: string | null;
};

type KnexClient = Knex<any, unknown[]>;

export async function ensureQaySiteComponentsTable(knex: KnexClient) {
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS public.qay_site_components (
      site_id uuid NOT NULL REFERENCES public.qay_sites(id) ON DELETE CASCADE,
      component_id uuid NOT NULL,
      source text NOT NULL DEFAULT 'user',
      category text,
      template_id text,
      source_page_id uuid,
      source_layer_id text,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (site_id, component_id)
    )
  `);

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS qay_site_components_site_source_idx
    ON public.qay_site_components(site_id, source, category)
  `);

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS qay_site_components_component_idx
    ON public.qay_site_components(component_id)
  `);
}

export async function linkComponentToQaySite(
  siteId: string,
  componentId: string,
  options: {
    source?: QaySiteComponentSource;
    category?: string | null;
    templateId?: string | null;
    sourcePageId?: string | null;
    sourceLayerId?: string | null;
  } = {}
) {
  const knex = await getKnexClient();
  await ensureQaySiteComponentsTable(knex);

  await knex('qay_site_components')
    .insert({
      site_id: siteId,
      component_id: componentId,
      source: options.source || 'user',
      category: options.category || null,
      template_id: options.templateId || null,
      source_page_id: options.sourcePageId || null,
      source_layer_id: options.sourceLayerId || null,
    })
    .onConflict(['site_id', 'component_id'])
    .merge({
      source: options.source || 'user',
      category: options.category || null,
      template_id: options.templateId || null,
      source_page_id: options.sourcePageId || null,
      source_layer_id: options.sourceLayerId || null,
    });
}

export async function filterComponentsForQaySite(
  siteId: string,
  components: Component[]
): Promise<QayScopedComponent[]> {
  if (components.length === 0) return [];

  const knex = await getKnexClient();
  await ensureQaySiteComponentsTable(knex);

  const links = await knex('qay_site_components')
    .where('site_id', siteId)
    .whereIn('component_id', components.map((component) => component.id))
    .select('component_id', 'source', 'category', 'template_id');

  const linkByComponentId = new Map(
    links.map((link) => [link.component_id, link])
  );

  return components
    .filter((component) => linkByComponentId.has(component.id))
    .map((component) => {
      const link = linkByComponentId.get(component.id);
      return {
        ...component,
        qay_site_category: link?.category || null,
        qay_component_source: link?.source || null,
        qay_template_id: link?.template_id || null,
      };
    });
}
