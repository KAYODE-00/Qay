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
);

CREATE INDEX IF NOT EXISTS qay_user_templates_owner_id_idx
  ON qay_user_templates(owner_id);

CREATE INDEX IF NOT EXISTS qay_user_templates_status_idx
  ON qay_user_templates(status);

CREATE INDEX IF NOT EXISTS qay_user_templates_category_idx
  ON qay_user_templates(category);

