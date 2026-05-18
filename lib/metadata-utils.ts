import type { Metadata } from 'next';
import { getSiteBaseUrl } from '@/lib/url-utils';

export function getMetadataBase(): Metadata['metadataBase'] {
  let baseUrl =
    getSiteBaseUrl()
    || process.env.NEXT_PUBLIC_SITE_URL
    || 'http://localhost:3002';

  if (process.env.NODE_ENV === 'development') {
    try {
      const parsed = new URL(baseUrl);
      if (parsed.hostname === 'localhost' && parsed.port === '3000') {
        parsed.port = process.env.PORT || '3002';
        baseUrl = parsed.toString().replace(/\/$/, '');
      }
    } catch {
      // Fall through to the normal URL validation below.
    }
  }

  try {
    return new URL(baseUrl);
  } catch {
    return new URL('http://localhost:3002');
  }
}
