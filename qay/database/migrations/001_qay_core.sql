-- QAY Core Database Migration
-- Run this after Ycode's welcome wizard has completed.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USER PROFILES
-- Extends Supabase auth.users with QAY-specific fields
CREATE TABLE IF NOT EXISTS qay_user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL DEFAULT 'developer',
  -- 'developer' | 'client'
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  website TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE qay_user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own profile" ON qay_user_profiles;
CREATE POLICY "Users manage own profile"
  ON qay_user_profiles FOR ALL USING (auth.uid() = id);

-- SITES
-- Each developer gets isolated sites. This is the multi-tenancy layer.
-- Ycode's existing tables (pages, layers, etc.) are linked via site_id
-- which Ycode already supports through its settings/project system.
CREATE TABLE IF NOT EXISTS qay_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  -- Used for subdomain: slug.qaybuilder.com
  custom_domain TEXT UNIQUE,
  domain_verified BOOLEAN DEFAULT false,
  publish_status TEXT DEFAULT 'draft',
  -- 'draft' | 'published'
  live_url TEXT,
  thumbnail_url TEXT,
  favicon_url TEXT,
  plan TEXT DEFAULT 'free',
  -- mirrors user's subscription plan
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_sites_owner ON qay_sites(owner_id);
CREATE INDEX IF NOT EXISTS idx_qay_sites_slug ON qay_sites(slug);
CREATE INDEX IF NOT EXISTS idx_qay_sites_domain ON qay_sites(custom_domain)
  WHERE custom_domain IS NOT NULL;

ALTER TABLE qay_sites ENABLE ROW LEVEL SECURITY;

-- Owners can do everything
DROP POLICY IF EXISTS "Owners manage own sites" ON qay_sites;
CREATE POLICY "Owners manage own sites"
  ON qay_sites FOR ALL USING (auth.uid() = owner_id);

-- SITE MEMBERS
CREATE TABLE IF NOT EXISTS qay_site_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client',
  -- 'collaborator' | 'viewer' | 'client'
  client_can_publish BOOLEAN DEFAULT false,
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(site_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_qay_members_site ON qay_site_members(site_id);
CREATE INDEX IF NOT EXISTS idx_qay_members_user ON qay_site_members(user_id);

ALTER TABLE qay_site_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site owners manage members" ON qay_site_members;
CREATE POLICY "Site owners manage members"
  ON qay_site_members FOR ALL USING (
    EXISTS (
      SELECT 1 FROM qay_sites
      WHERE id = qay_site_members.site_id
        AND owner_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Members read own membership" ON qay_site_members;
CREATE POLICY "Members read own membership"
  ON qay_site_members FOR SELECT
  USING (auth.uid() = user_id);

-- Members can read sites they're invited to
DROP POLICY IF EXISTS "Members read shared sites" ON qay_sites;
CREATE POLICY "Members read shared sites"
  ON qay_sites FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qay_site_members
      WHERE site_id = qay_sites.id
        AND user_id = auth.uid()
    )
  );

-- SITE INVITES
CREATE TABLE IF NOT EXISTS qay_site_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT DEFAULT 'pending',
  -- 'pending' | 'accepted' | 'expired'
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, email)
);

CREATE INDEX IF NOT EXISTS idx_qay_invites_token ON qay_site_invites(token);

ALTER TABLE qay_site_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site owners manage invites" ON qay_site_invites;
CREATE POLICY "Site owners manage invites"
  ON qay_site_invites FOR ALL USING (
    EXISTS (
      SELECT 1 FROM qay_sites
      WHERE id = qay_site_invites.site_id
        AND owner_id = auth.uid()
    )
  );

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS qay_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  -- 'free' | 'pro' | 'agency'
  billing_cycle TEXT,
  -- 'monthly' | 'yearly'
  status TEXT NOT NULL DEFAULT 'active',
  -- 'active' | 'cancelled' | 'expired'
  flw_tx_ref TEXT UNIQUE,
  flw_tx_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE qay_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own subscription" ON qay_subscriptions;
CREATE POLICY "Users read own subscription"
  ON qay_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS qay_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES qay_sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  -- 'site_published' | 'invite_received' | 'dev_message'
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_notifications_user
  ON qay_notifications(user_id, read, created_at DESC);

ALTER TABLE qay_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own notifications" ON qay_notifications;
CREATE POLICY "Users manage own notifications"
  ON qay_notifications FOR ALL USING (auth.uid() = user_id);

-- PAGE VIEWS (basic analytics)
CREATE TABLE IF NOT EXISTS qay_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_page_views_site_date
  ON qay_page_views(site_id, viewed_at DESC);

-- No RLS on page_views: insert is server-side only via service role

-- HIRE REQUESTS
CREATE TABLE IF NOT EXISTS qay_hire_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  project_type TEXT,
  description TEXT,
  budget TEXT,
  timeline TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LINK YCODE PAGES TO QAY SITES
-- Ycode stores pages with a site_id (TEXT) in settings
-- We map that to our qay_sites.id
-- This table links Ycode's internal project to a QAY site
CREATE TABLE IF NOT EXISTS qay_site_ycode_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qay_site_id UUID UNIQUE NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  -- This is the identifier Ycode uses internally for the project
  -- In Ycode, all pages/layers belong to one "project" per Supabase instance
  -- We use this to scope which pages belong to which QAY site
  created_at TIMESTAMPTZ DEFAULT now()
);
