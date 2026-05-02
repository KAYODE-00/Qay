export type QaySite = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  domain_verified: boolean | null;
  publish_status: 'draft' | 'published' | string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  favicon_url: string | null;
  plan: string | null;
  created_at: string | null;
  updated_at: string | null;
};
