/**
 * Translation Repository
 *
 * Data access layer for translations
 * Supports draft/published workflow with composite primary key (id, is_published)
 */

import { getSupabaseAdmin } from '@/lib/supabase-server';
import type { Translation, CreateTranslationData, UpdateTranslationData } from '@/types';
import { isMissingLocalisationSiteColumnError } from '@/qay/lib/localisation-schema';

/**
 * Get all translations for a locale (draft by default)
 */
export async function getTranslationsByLocale(
  localeId: string,
  isPublished: boolean = false,
  qaySiteId?: string | null
): Promise<Translation[]> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  let query = client
    .from('translations')
    .select('*')
    .eq('locale_id', localeId)
    .eq('is_published', isPublished)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query;

  if (error) {
    if (qaySiteId && isMissingLocalisationSiteColumnError(error)) {
      return [];
    }
    throw new Error(`Failed to fetch translations: ${error.message}`);
  }

  return data || [];
}

/**
 * Get translations by source (draft by default)
 */
export async function getTranslationsBySource(
  sourceType: string,
  sourceId: string,
  isPublished: boolean = false,
  qaySiteId?: string | null
): Promise<Translation[]> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  let query = client
    .from('translations')
    .select('*')
    .eq('source_type', sourceType)
    .eq('source_id', sourceId)
    .eq('is_published', isPublished)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query;

  if (error) {
    if (qaySiteId && isMissingLocalisationSiteColumnError(error)) {
      return [];
    }
    throw new Error(`Failed to fetch translations: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single translation by ID (draft by default)
 */
export async function getTranslationById(
  id: string,
  isPublished: boolean = false,
  qaySiteId?: string | null
): Promise<Translation | null> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  let query = client
    .from('translations')
    .select('*')
    .eq('id', id)
    .eq('is_published', isPublished)
    .is('deleted_at', null);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch translation: ${error.message}`);
  }

  return data;
}

/**
 * Get a translation by locale and key parts (draft by default)
 */
export async function getTranslationByKey(
  localeId: string,
  sourceType: string,
  sourceId: string,
  contentKey: string,
  isPublished: boolean = false,
  qaySiteId?: string | null
): Promise<Translation | null> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  let query = client
    .from('translations')
    .select('*')
    .eq('locale_id', localeId)
    .eq('source_type', sourceType)
    .eq('source_id', sourceId)
    .eq('content_key', contentKey)
    .eq('is_published', isPublished)
    .is('deleted_at', null);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch translation: ${error.message}`);
  }

  return data;
}

/**
 * Create a new translation (draft by default)
 * Uses upsert to handle existing translations
 */
export async function createTranslation(
  translationData: CreateTranslationData,
  qaySiteId?: string | null
): Promise<Translation> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await client
    .from('translations')
    .upsert(
      {
        locale_id: translationData.locale_id,
        qay_site_id: qaySiteId ?? translationData.qay_site_id ?? null,
        source_type: translationData.source_type,
        source_id: translationData.source_id,
        content_key: translationData.content_key,
        content_type: translationData.content_type,
        content_value: translationData.content_value,
        is_completed: translationData.is_completed ?? false,
        is_published: false,
        deleted_at: null, // Restore if previously deleted
      },
      {
        onConflict: 'locale_id,source_type,source_id,content_key,is_published',
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create translation: ${error.message}`);
  }

  return data;
}

/**
 * Update a translation (draft only)
 */
export async function updateTranslation(
  id: string,
  updates: UpdateTranslationData,
  qaySiteId?: string | null
): Promise<Translation> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  let query = client
    .from('translations')
    .update({
      ...updates,
      deleted_at: null, // Restore if previously deleted
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('is_published', false);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query.select().single();

  if (error) {
    throw new Error(`Failed to update translation: ${error.message}`);
  }

  return data;
}

/**
 * Delete a translation (soft delete - sets deleted_at timestamp)
 */
export async function deleteTranslation(id: string, qaySiteId?: string | null): Promise<void> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  let query = client
    .from('translations')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_published', false);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { error } = await query;

  if (error) {
    throw new Error(`Failed to delete translation: ${error.message}`);
  }
}

/**
 * Delete translations in bulk (soft delete - sets deleted_at timestamp)
 * Only deletes draft versions
 *
 * @param sourceType - Type of source (page, folder, component, cms)
 * @param sourceIds - Single source ID or array of source IDs
 * @param contentKeys - Optional. Specific content keys to delete. If not provided, deletes all translations for the source(s).
 */
export async function deleteTranslationsInBulk(
  sourceType: string,
  sourceIds: string | string[],
  contentKeys?: string[],
  qaySiteId?: string | null
): Promise<void> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  // Normalize sourceIds to array
  const sourceIdArray = Array.isArray(sourceIds) ? sourceIds : [sourceIds];

  // If no source IDs, nothing to delete
  if (sourceIdArray.length === 0) {
    return;
  }

  // If contentKeys provided but empty, nothing to delete
  if (contentKeys !== undefined && contentKeys.length === 0) {
    return;
  }

  // Build the base query
  let query = client
    .from('translations')
    .update({ deleted_at: new Date().toISOString() })
    .eq('source_type', sourceType)
    .in('source_id', sourceIdArray)
    .eq('is_published', false);

  // Add content_key filter if specific keys provided
  if (contentKeys !== undefined) {
    query = query.in('content_key', contentKeys);
  }

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { error } = await query;

  if (error) {
    throw new Error(`Failed to delete translations: ${error.message}`);
  }
}

/**
 * Mark translations as incomplete when source content changes
 */
export async function markTranslationsIncomplete(
  sourceType: string,
  sourceId: string,
  contentKeys: string[],
  qaySiteId?: string | null
): Promise<void> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  if (contentKeys.length === 0) {
    return; // Nothing to update
  }

  let query = client
    .from('translations')
    .update({
      is_completed: false,
      updated_at: new Date().toISOString(),
    })
    .eq('source_type', sourceType)
    .eq('source_id', sourceId)
    .in('content_key', contentKeys)
    .eq('is_published', false)
    .is('deleted_at', null);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { error } = await query;

  if (error) {
    throw new Error(`Failed to mark translations as incomplete: ${error.message}`);
  }
}

/**
 * Upsert multiple translations (draft by default)
 * Uses batch upsert for efficiency
 */
export async function upsertTranslations(
  translations: CreateTranslationData[],
  qaySiteId?: string | null
): Promise<Translation[]> {
  const client = await getSupabaseAdmin();

  if (!client) {
    throw new Error('Supabase not configured');
  }

  const translationsToUpsert = translations.map((t) => ({
    locale_id: t.locale_id,
    qay_site_id: qaySiteId ?? t.qay_site_id ?? null,
    source_type: t.source_type,
    source_id: t.source_id,
    content_key: t.content_key,
    content_type: t.content_type,
    content_value: t.content_value,
    is_published: false,
    deleted_at: null, // Restore if previously deleted
  }));

  const { data, error } = await client
    .from('translations')
    .upsert(translationsToUpsert, {
      onConflict: 'locale_id,source_type,source_id,content_key,is_published',
    })
    .select();

  if (error) {
    throw new Error(`Failed to upsert translations: ${error.message}`);
  }

  return data || [];
}
