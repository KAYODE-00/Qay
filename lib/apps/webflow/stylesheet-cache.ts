'use client';

import { webflowApi } from './client';
import { WEBFLOW_SETTINGS } from './constants';

const TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  css: string | undefined;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

export interface StylesheetResult {
  css?: string;
  reason?: 'no-site' | 'failed';
}

export function clearStylesheetCache(): void {
  cache.clear();
}

export async function loadSiteStylesheetCss(): Promise<StylesheetResult> {
  try {
    const settings = await webflowApi
      .getSettings()
      .catch(() => ({} as Record<string, string>));
    const site = settings?.[WEBFLOW_SETTINGS.publishedUrl]?.trim();
    if (!site) return { reason: 'no-site' };

    const hit = cache.get(site);
    if (hit && Date.now() - hit.fetchedAt < TTL_MS) {
      return hit.css ? { css: hit.css } : { reason: 'failed' };
    }

    const { css } = await webflowApi.resolveStylesheet(site);
    cache.set(site, { css, fetchedAt: Date.now() });
    return css ? { css } : { reason: 'failed' };
  } catch (error) {
    console.warn('[webflow] global stylesheet load failed:', error);
    return { reason: 'failed' };
  }
}
