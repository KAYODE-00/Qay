import { NextRequest, NextResponse } from 'next/server';
import { setSettings } from '@/lib/repositories/settingsRepository';
import { clearAllCache } from '@/lib/services/cacheService';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';
import { isQaySiteScopedSettingKey, setQaySiteSettings } from '@/qay/lib/site-settings';

/**
 * PUT /ycode/api/settings/batch
 *
 * Update multiple settings at once.
 * Invalidates the public page cache so ISR pages pick up the new values.
 * Request body: { settings: { key1: value1, key2: value2, ... } }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;
    const siteId = getQaySiteIdFromRequest(request);

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid settings object in request body' },
        { status: 400 }
      );
    }

    let count = 0;

    if (siteId) {
      const scopedEntries = Object.fromEntries(
        Object.entries(settings).filter(([key]) => isQaySiteScopedSettingKey(key))
      );
      const globalEntries = Object.fromEntries(
        Object.entries(settings).filter(([key]) => !isQaySiteScopedSettingKey(key))
      );

      if (Object.keys(scopedEntries).length > 0) {
        count += await setQaySiteSettings(siteId, scopedEntries);
      }

      if (Object.keys(globalEntries).length > 0) {
        count += await setSettings(globalEntries);
      }
    } else {
      count = await setSettings(settings);
    }

    await clearAllCache();

    return NextResponse.json({
      data: { count },
      message: `Updated ${count} setting(s) successfully`,
    });
  } catch (error) {
    console.error('[API] Error updating settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    );
  }
}
