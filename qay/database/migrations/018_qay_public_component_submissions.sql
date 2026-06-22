CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_public_component_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES qay_sites(id) ON DELETE SET NULL,
  component_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sections',
  description TEXT NOT NULL DEFAULT '',
  part_type TEXT NOT NULL DEFAULT 'section',
  layers JSONB NOT NULL DEFAULT '[]'::jsonb,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'approved', 'rejected')),
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_public_component_submissions_status
  ON qay_public_component_submissions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qay_public_component_submissions_owner
  ON qay_public_component_submissions(owner_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_qay_public_component_submissions_once
  ON qay_public_component_submissions(owner_id, component_id);

ALTER TABLE qay_public_component_submissions ENABLE ROW LEVEL SECURITY;

-- Server routes write with the service role.
