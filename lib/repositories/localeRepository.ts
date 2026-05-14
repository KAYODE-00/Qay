/**
 * Locale Repository
 *
 * Data access layer for locales (language/region configurations)
 * Supports draft/published workflow with composite primary key (id, is_published)
 */

import { getSupabaseAdmin } from '@/lib/supabase-server';
import type { Locale, CreateLocaleData, UpdateLocaleData } from '@/types';
import { isMissingLocalisationSiteColumnError } from '@/qay/lib/localisation-schema';

function pickSafeDefaultLocale(locales: Locale[]): Locale[] {
  const fallback = locales.find((locale) => locale.is_default)
    || locales.find((locale) => locale.code === 'en')
    || locales[0];

  return fallback ? [fallback] : [];
}

async function getAllLocalesWithoutSiteFilter(isPublished: boolean, safeDefaultOnly = false): Promise<Locale[]> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  const { data, error } = await client
    .from('locales')
    .select('*')
    .eq('is_published', isPublished)
    .is('deleted_at', null)
    .order('is_default', { ascending: false })
    .order('label', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch locales: ${error.message}`);
  }

  const locales = data || [];
  return safeDefaultOnly ? pickSafeDefaultLocale(locales) : locales;
}

/**
 * Get all locales (draft by default)
 */
export async function getAllLocales(isPublished: boolean = false, qaySiteId?: string | null): Promise<Locale[]> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  let query = client
    .from('locales')
    .select('*')
    .eq('is_published', isPublished)
    .is('deleted_at', null)
    .order('is_default', { ascending: false })
    .order('label', { ascending: true });

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query;

  if (error) {
    if (isMissingLocalisationSiteColumnError(error)) {
      return getAllLocalesWithoutSiteFilter(isPublished, Boolean(qaySiteId));
    }
    throw new Error(`Failed to fetch locales: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single locale by ID (draft by default)
 * With composite primary key, we need to specify is_published to get a single row
 */
export async function getLocaleById(id: string, isPublished: boolean = false, qaySiteId?: string | null): Promise<Locale | null> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  let query = client
    .from('locales')
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
    throw new Error(`Failed to fetch locale: ${error.message}`);
  }

  return data;
}

/**
 * Get locale by code (draft by default)
 */
export async function getLocaleByCode(code: string, isPublished: boolean = false, qaySiteId?: string | null): Promise<Locale | null> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  let query = client
    .from('locales')
    .select('*')
    .eq('code', code)
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
    throw new Error(`Failed to fetch locale: ${error.message}`);
  }

  return data;
}

/**
 * Get the default locale (draft by default)
 */
export async function getDefaultLocale(isPublished: boolean = false, qaySiteId?: string | null): Promise<Locale | null> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  let query = client
    .from('locales')
    .select('*')
    .eq('is_default', true)
    .eq('is_published', isPublished)
    .is('deleted_at', null);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No default locale set
    }
    throw new Error(`Failed to fetch default locale: ${error.message}`);
  }

  return data;
}

/**
 * Create a new locale (draft by default)
 * If a locale with the same code exists (including soft-deleted), it will be updated instead
 * Returns both the created/updated locale and all locales
 */
export async function createLocale(
  localeData: CreateLocaleData,
  qaySiteId?: string | null
): Promise<{ locale: Locale; locales: Locale[] }> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  // Check if a locale with this code already exists (including soft-deleted)
  const effectiveSiteId = qaySiteId ?? localeData.qay_site_id ?? null;
  let existingQuery = client
    .from('locales')
    .select('*')
    .eq('code', localeData.code)
    .eq('is_published', false);

  existingQuery = effectiveSiteId
    ? existingQuery.eq('qay_site_id', effectiveSiteId)
    : existingQuery.is('qay_site_id', null);

  const { data: existingLocale } = await existingQuery.maybeSingle();

  // If this is set as default, unset any existing default
  if (localeData.is_default) {
    let unsetQuery = client
      .from('locales')
      .update({ is_default: false })
      .eq('is_default', true)
      .eq('is_published', false);
    unsetQuery = effectiveSiteId
      ? unsetQuery.eq('qay_site_id', effectiveSiteId)
      : unsetQuery.is('qay_site_id', null);
    await unsetQuery;
  }

  let data: Locale;

  if (existingLocale) {
    // Update existing locale (restore if soft-deleted)
    const { data: updatedData, error } = await client
      .from('locales')
      .update({
        label: localeData.label,
        is_default: localeData.is_default || false,
        qay_site_id: effectiveSiteId,
        deleted_at: null, // Restore if soft-deleted
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingLocale.id)
      .eq('is_published', false)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update locale: ${error.message}`);
    }

    data = updatedData;
  } else {
    // Create new locale
    const { data: newData, error } = await client
      .from('locales')
      .insert({
        code: localeData.code,
        label: localeData.label,
        is_default: localeData.is_default || false,
        qay_site_id: effectiveSiteId,
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create locale: ${error.message}`);
    }

    data = newData;
  }

  // Always return all locales so client can update all is_default flags
  const allLocales = await getAllLocales(false, effectiveSiteId);

  return { locale: data, locales: allLocales };
}

/**
 * Update a locale (draft only)
 * Returns both the updated locale and all locales
 */
export async function updateLocale(
  id: string,
  updates: UpdateLocaleData,
  qaySiteId?: string | null
): Promise<{ locale: Locale; locales: Locale[] }> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  // If this is being set as default, unset any existing default
  if (updates.is_default) {
    let unsetQuery = client
      .from('locales')
      .update({ is_default: false })
      .eq('is_default', true)
      .eq('is_published', false)
      .neq('id', id);
    unsetQuery = qaySiteId
      ? unsetQuery.eq('qay_site_id', qaySiteId)
      : unsetQuery.is('qay_site_id', null);
    await unsetQuery;
  }

  let updateQuery = client
    .from('locales')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('is_published', false);

  updateQuery = qaySiteId
    ? updateQuery.eq('qay_site_id', qaySiteId)
    : updateQuery.is('qay_site_id', null);

  const { data, error } = await updateQuery.select().single();

  if (error) {
    throw new Error(`Failed to update locale: ${error.message}`);
  }

  // Always return all locales so client can update all is_default flags
  const allLocales = await getAllLocales(false, qaySiteId);

  return { locale: data, locales: allLocales };
}

/**
 * Delete a locale (soft delete - sets deleted_at timestamp)
 */
export async function deleteLocale(id: string, qaySiteId?: string | null): Promise<void> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  // Check if this is the default locale
  const locale = await getLocaleById(id, false, qaySiteId);
  if (locale?.is_default) {
    throw new Error('Cannot delete the default locale');
  }

  let query = client
    .from('locales')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_published', false);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { error } = await query;

  if (error) {
    throw new Error(`Failed to delete locale: ${error.message}`);
  }
}

/**
 * Set a locale as the default
 */
export async function setDefaultLocale(id: string, qaySiteId?: string | null): Promise<Locale> {
  const client = await getSupabaseAdmin();
  if (!client) {
    throw new Error('Failed to initialize Supabase client');
  }

  // Unset current default
  let unsetQuery = client
    .from('locales')
    .update({ is_default: false })
    .eq('is_default', true)
    .eq('is_published', false);
  unsetQuery = qaySiteId
    ? unsetQuery.eq('qay_site_id', qaySiteId)
    : unsetQuery.is('qay_site_id', null);
  await unsetQuery;

  // Set new default
  let query = client
    .from('locales')
    .update({
      is_default: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('is_published', false);

  query = qaySiteId
    ? query.eq('qay_site_id', qaySiteId)
    : query.is('qay_site_id', null);

  const { data, error } = await query.select().single();

  if (error) {
    throw new Error(`Failed to set default locale: ${error.message}`);
  }

  return data;
}

export async function ensureDefaultLocaleForQaySite(qaySiteId: string): Promise<Locale> {
  const locales = await getAllLocales(false, qaySiteId);
  const existingDefault = locales.find((locale) => locale.is_default) || locales[0];
  if (existingDefault) {
    return existingDefault;
  }

  const { locale } = await createLocale({
    code: 'en',
    label: 'English',
    is_default: true,
    qay_site_id: qaySiteId,
  }, qaySiteId);

  return locale;
}
