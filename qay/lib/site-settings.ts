import type { Setting } from '@/types';
import { getQayAdmin } from './supabase-admin';
import { getQaySiteAccess } from './site-access';
import { isMissingQaySchemaError, qaySchemaPublicMessage, qaySchemaSetupMessage } from './schema';

const QAY_SITE_SCOPED_SETTING_KEY_LIST = [
  'sitemap',
  'robots_txt',
  'llms_txt',
  'ga_measurement_id',
  'google_site_verification',
  'global_canonical_url',
  'custom_code_head',
  'custom_code_body',
  'ycode_badge',
  'timezone',
  'favicon_asset_id',
  'web_clip_asset_id',
] as const;

export const QAY_SITE_SCOPED_SETTING_KEYS = new Set<string>(QAY_SITE_SCOPED_SETTING_KEY_LIST);

type SiteSettingRow = {
  id: string;
  site_id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
};

function isSiteSettingsSchemaError(error: { message?: string } | null) {
  return isMissingQaySchemaError(error) || String(error?.message || '').includes('qay_site_settings');
}

async function ensureQaySiteSettingsAccess(siteId: string, requireOwner: boolean) {
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed) {
    throw new Error('Site not found');
  }
  if (requireOwner && access.role !== 'owner') {
    throw new Error('Only the site owner can update settings for this site');
  }
}

export function isQaySiteScopedSettingKey(key: string) {
  return QAY_SITE_SCOPED_SETTING_KEYS.has(key);
}

export async function listQaySiteSettings(siteId: string, keys?: string[]): Promise<Record<string, unknown>> {
  await ensureQaySiteSettingsAccess(siteId, false);

  const supabase = getQayAdmin() as any;
  let query = supabase
    .from('qay_site_settings')
    .select('id, site_id, key, value, created_at, updated_at')
    .eq('site_id', siteId)
    .order('key', { ascending: true });

  if (keys && keys.length > 0) {
    query = query.in('key', keys);
  }

  const { data, error } = await query;
  if (error) {
    if (isSiteSettingsSchemaError(error)) {
      return {};
    }
    throw new Error(`Failed to fetch site settings: ${error.message}`);
  }

  return (data || []).reduce((acc: Record<string, unknown>, row: SiteSettingRow) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function getQaySiteSetting(siteId: string, key: string): Promise<unknown | null> {
  const settings = await listQaySiteSettings(siteId, [key]);
  return settings[key] ?? null;
}

export async function setQaySiteSettings(siteId: string, settings: Record<string, unknown>): Promise<number> {
  await ensureQaySiteSettingsAccess(siteId, true);

  const entries = Object.entries(settings);
  if (entries.length === 0) {
    return 0;
  }

  const supabase = getQayAdmin() as any;
  const toUpsert: Array<{ site_id: string; key: string; value: unknown; updated_at: string }> = [];
  const toDelete: string[] = [];

  for (const [key, value] of entries) {
    if (value === null || value === undefined) {
      toDelete.push(key);
    } else {
      toUpsert.push({
        site_id: siteId,
        key,
        value,
        updated_at: new Date().toISOString(),
      });
    }
  }

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('qay_site_settings')
      .delete()
      .eq('site_id', siteId)
      .in('key', toDelete);

    if (deleteError) {
      if (isSiteSettingsSchemaError(deleteError)) {
        console.error('QAY site settings issue:', qaySchemaSetupMessage(deleteError.message));
        throw new Error(qaySchemaPublicMessage());
      }
      throw new Error(`Failed to delete site settings: ${deleteError.message}`);
    }
  }

  if (toUpsert.length > 0) {
    const { error } = await supabase
      .from('qay_site_settings')
      .upsert(toUpsert, { onConflict: 'site_id,key' });

    if (error) {
      if (isSiteSettingsSchemaError(error)) {
        console.error('QAY site settings issue:', qaySchemaSetupMessage(error.message));
        throw new Error(qaySchemaPublicMessage());
      }
      throw new Error(`Failed to save site settings: ${error.message}`);
    }
  }

  return entries.length;
}

export async function overlaySettingsForQaySite(siteId: string, settings: Setting[]): Promise<Setting[]> {
  const scopedValues = await listQaySiteSettings(siteId, [...QAY_SITE_SCOPED_SETTING_KEYS]);
  if (Object.keys(scopedValues).length === 0) {
    return settings;
  }

  const byKey = new Map(settings.map((setting) => [setting.key, setting] as const));

  for (const [key, value] of Object.entries(scopedValues)) {
    const existing = byKey.get(key);
    if (existing) {
      byKey.set(key, {
        ...existing,
        value,
      });
    } else {
      byKey.set(key, {
        id: `qay-site-${siteId}-${key}`,
        key,
        value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  return Array.from(byKey.values()).sort((a, b) => a.key.localeCompare(b.key));
}
