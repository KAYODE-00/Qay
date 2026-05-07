import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import { closeKnexClient, getKnexClient } from '@/lib/knex-client';

const MISSING_SCHEMA_PATTERNS = [
  'qay_sites',
  'schema cache',
  'relation "public.qay_sites" does not exist',
  'relation "qay_sites" does not exist',
  'could not find the table',
];

export function isMissingQaySchemaError(error: unknown): boolean {
  const message = typeof error === 'string'
    ? error
    : error instanceof Error
      ? error.message
      : typeof (error as { message?: unknown } | null)?.message === 'string'
        ? String((error as { message: string }).message)
        : '';

  const normalized = message.toLowerCase();
  return normalized.includes('qay_sites') && MISSING_SCHEMA_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function allowRuntimeQaySchemaChanges() {
  return process.env.QAY_ENABLE_RUNTIME_SCHEMA_REPAIRS === 'true';
}

export async function runQayCoreMigration() {
  const knex = await getKnexClient();

  try {
    const migrationPath = path.join(process.cwd(), 'qay', 'database', 'migrations', '001_qay_core.sql');
    const sql = await fs.readFile(migrationPath, 'utf8');

    await knex.raw(sql);
    await knex.raw("NOTIFY pgrst, 'reload schema'");
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to run QAY core migration',
    };
  } finally {
    await closeKnexClient();
  }
}

export function qaySchemaSetupMessage(error?: string) {
  return [
    'QAY database tables are not ready yet.',
    'Run the QAY core migration after Ycode setup: qay/database/migrations/001_qay_core.sql.',
    error ? `Details: ${error}` : null,
  ].filter(Boolean).join(' ');
}
