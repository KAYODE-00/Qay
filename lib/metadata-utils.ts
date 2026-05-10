import type { Metadata } from 'next';
import { getSiteBaseUrl } from '@/lib/url-utils';

export function getMetadataBase(): Metadata['metadataBase'] {
  const baseUrl =
    getSiteBaseUrl()
    || process.env.NEXT_PUBLIC_SITE_URL
    || 'http://localhost:3002';

  try {
    return new URL(baseUrl);
  } catch {
    return new URL('http://localhost:3002');
  }
}
