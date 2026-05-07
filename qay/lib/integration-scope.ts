import { randomBytes } from 'crypto';
import { getAllApps } from '@/lib/apps/registry';
import { hashApiKey, type ApiKey } from '@/lib/repositories/apiKeyRepository';
import type { CreateWebhookData, UpdateWebhookData, Webhook, WebhookEventType, WebhookFilters } from '@/lib/repositories/webhookRepository';
import { canAccessQaySite, getQaySiteAccess } from './site-access';
import { getQayAdmin } from './supabase-admin';
import { isMissingQaySchemaError } from './schema';

type ApiKeyRow = ApiKey & { site_id: string };
type WebhookRow = Omit<Webhook, 'events' | 'filters'> & { site_id: string; events: unknown; filters: unknown };

function integrationSchemaError(error: { message?: string } | null) {
  const details = error?.message || 'Missing QAY integration schema';
  return new Error(
    [
      'QAY integration tables are not ready yet.',
      'Run qay/database/migrations/004_qay_site_integrations.sql after the earlier QAY migrations.',
      `Details: ${details}`,
    ].join(' ')
  );
}

function mapWebhookFromDb(row: WebhookRow): Webhook {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    secret: row.secret,
    events: Array.isArray(row.events) ? (row.events as WebhookEventType[]) : [],
    filters: (row.filters || null) as WebhookFilters | null,
    enabled: row.enabled,
    last_triggered_at: row.last_triggered_at,
    failure_count: row.failure_count || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function ensureQaySiteOwner(siteId: string) {
  const access = await getQaySiteAccess(siteId);
  if (!access.allowed || access.role !== 'owner' || !access.user) {
    throw new Error('Only the site owner can manage integrations for this site');
  }
  return access.user;
}

function isIntegrationTableError(error: { message?: string } | null, table: string) {
  return isMissingQaySchemaError(error) || String(error?.message || '').includes(table);
}

export async function listQaySiteApiKeys(siteId: string): Promise<ApiKey[]> {
  if (!(await canAccessQaySite(siteId))) return [];
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_api_keys')
    .select('id, site_id, name, key_prefix, last_used_at, created_at, updated_at')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });

  if (error) {
    if (isIntegrationTableError(error, 'qay_site_api_keys')) throw integrationSchemaError(error);
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return (data || []).map(({ site_id: _siteId, ...row }: ApiKeyRow) => row);
}

export async function createQaySiteApiKey(siteId: string, name: string) {
  await ensureQaySiteOwner(siteId);
  const apiKey = randomBytes(32).toString('hex');
  const keyHash = hashApiKey(apiKey);
  const keyPrefix = apiKey.substring(0, 8);
  const supabase = getQayAdmin() as any;

  const { data, error } = await supabase
    .from('qay_site_api_keys')
    .insert({
      site_id: siteId,
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id, site_id, name, key_prefix, last_used_at, created_at, updated_at')
    .single();

  if (error) {
    if (isIntegrationTableError(error, 'qay_site_api_keys')) throw integrationSchemaError(error);
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  const { site_id: _siteId, ...row } = data as ApiKeyRow;
  return { ...row, api_key: apiKey };
}

export async function deleteQaySiteApiKey(siteId: string, id: string): Promise<void> {
  await ensureQaySiteOwner(siteId);
  const supabase = getQayAdmin() as any;
  const { error } = await supabase.from('qay_site_api_keys').delete().eq('site_id', siteId).eq('id', id);
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_api_keys')) throw integrationSchemaError(error);
    throw new Error(`Failed to delete API key: ${error.message}`);
  }
}

export async function listQaySiteWebhooks(siteId: string): Promise<Webhook[]> {
  if (!(await canAccessQaySite(siteId))) return [];
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase.from('qay_site_webhooks').select('*').eq('site_id', siteId).order('created_at', { ascending: false });
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_webhooks')) throw integrationSchemaError(error);
    throw new Error(`Failed to fetch webhooks: ${error.message}`);
  }
  return (data || []).map(mapWebhookFromDb);
}

export async function createQaySiteWebhook(siteId: string, input: CreateWebhookData & { generateSecret?: boolean }) {
  await ensureQaySiteOwner(siteId);
  const secret = input.secret || (input.generateSecret ? randomBytes(32).toString('hex') : null);
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_webhooks')
    .insert({
      site_id: siteId,
      name: input.name,
      url: input.url,
      secret,
      events: input.events,
      filters: input.filters || null,
      enabled: true,
      failure_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    if (isIntegrationTableError(error, 'qay_site_webhooks')) throw integrationSchemaError(error);
    throw new Error(`Failed to create webhook: ${error.message}`);
  }

  return {
    ...mapWebhookFromDb(data as WebhookRow),
    generated_secret: input.generateSecret ? secret : undefined,
  };
}

export async function updateQaySiteWebhook(siteId: string, id: string, updates: UpdateWebhookData): Promise<Webhook> {
  await ensureQaySiteOwner(siteId);
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.url !== undefined) payload.url = updates.url;
  if (updates.secret !== undefined) payload.secret = updates.secret;
  if (updates.events !== undefined) payload.events = updates.events;
  if (updates.filters !== undefined) payload.filters = updates.filters;
  if (updates.enabled !== undefined) payload.enabled = updates.enabled;
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_webhooks')
    .update(payload)
    .eq('site_id', siteId)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (isIntegrationTableError(error, 'qay_site_webhooks')) throw integrationSchemaError(error);
    throw new Error(`Failed to update webhook: ${error.message}`);
  }

  return mapWebhookFromDb(data as WebhookRow);
}

export async function deleteQaySiteWebhook(siteId: string, id: string): Promise<void> {
  await ensureQaySiteOwner(siteId);
  const supabase = getQayAdmin() as any;
  const { error } = await supabase.from('qay_site_webhooks').delete().eq('site_id', siteId).eq('id', id);
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_webhooks')) throw integrationSchemaError(error);
    throw new Error(`Failed to delete webhook: ${error.message}`);
  }
}

export async function listQaySiteApps(siteId: string) {
  if (!(await canAccessQaySite(siteId))) return [];
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase.from('qay_site_app_settings').select('app_id').eq('site_id', siteId);
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_app_settings')) throw integrationSchemaError(error);
    throw new Error(`Failed to fetch app settings: ${error.message}`);
  }
  const connectedIds = new Set((data || []).map((row: { app_id: string }) => row.app_id));
  return getAllApps().map((app) => ({ ...app, connected: connectedIds.has(app.id) }));
}

export async function getQaySiteAppSettings(siteId: string, appId: string) {
  if (!(await canAccessQaySite(siteId))) throw new Error('Site not found');
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_app_settings')
    .select('key, value')
    .eq('site_id', siteId)
    .eq('app_id', appId)
    .order('key', { ascending: true });
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_app_settings')) throw integrationSchemaError(error);
    throw new Error(`Failed to fetch app settings: ${error.message}`);
  }
  return (data || []).reduce((acc: Record<string, unknown>, row: { key: string; value: unknown }) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function saveQaySiteAppSettings(siteId: string, appId: string, settings: Record<string, unknown>) {
  await ensureQaySiteOwner(siteId);
  const supabase = getQayAdmin() as any;
  const { error: deleteError } = await supabase.from('qay_site_app_settings').delete().eq('site_id', siteId).eq('app_id', appId);
  if (deleteError) {
    if (isIntegrationTableError(deleteError, 'qay_site_app_settings')) throw integrationSchemaError(deleteError);
    throw new Error(`Failed to clear app settings: ${deleteError.message}`);
  }

  const entries = Object.entries(settings);
  if (entries.length === 0) return {};
  const { error } = await supabase.from('qay_site_app_settings').insert(
    entries.map(([key, value]) => ({
      site_id: siteId,
      app_id: appId,
      key,
      value,
      updated_at: new Date().toISOString(),
    }))
  );
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_app_settings')) throw integrationSchemaError(error);
    throw new Error(`Failed to save app settings: ${error.message}`);
  }
  return getQaySiteAppSettings(siteId, appId);
}

export async function deleteQaySiteAppSettings(siteId: string, appId: string): Promise<void> {
  await ensureQaySiteOwner(siteId);
  const supabase = getQayAdmin() as any;
  const { error } = await supabase.from('qay_site_app_settings').delete().eq('site_id', siteId).eq('app_id', appId);
  if (error) {
    if (isIntegrationTableError(error, 'qay_site_app_settings')) throw integrationSchemaError(error);
    throw new Error(`Failed to delete app settings: ${error.message}`);
  }
}
