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
);

CREATE INDEX IF NOT EXISTS qay_site_components_site_source_idx
  ON public.qay_site_components(site_id, source, category);

CREATE INDEX IF NOT EXISTS qay_site_components_component_idx
  ON public.qay_site_components(component_id);
