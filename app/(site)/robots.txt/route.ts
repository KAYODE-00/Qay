/**
 * Dynamic Robots.txt Route
 *
 * Generates robots.txt with configurable content and sitemap reference
 */

import { NextResponse } from 'next/server';
import { getSettingsByKeys } from '@/lib/repositories/settingsRepository';
import { credentials } from '@/lib/credentials';
import { getSiteBaseUrl } from '@/lib/url-utils';
import { getQayRenderSiteBaseUrl, getQayRenderSiteId } from '@/qay/lib/render-site';
import { listPublicQaySiteSettings } from '@/qay/lib/site-settings';
import type { SitemapSettings } from '@/types';

function getQayAppBaseUrl() {
  return getSiteBaseUrl() || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
}

async function getRenderRobotsSettings(qaySiteId: string | null) {
  if (qaySiteId) {
    return listPublicQaySiteSettings(qaySiteId, ['robots_txt', 'sitemap', 'global_canonical_url']);
  }

  return getSettingsByKeys(['robots_txt', 'sitemap', 'global_canonical_url']);
}

export async function GET() {
  try {
    const hasSupabaseCredentials = await credentials.exists();
    if (!hasSupabaseCredentials) {
      const baseUrl = await getQayRenderSiteBaseUrl() || getSiteBaseUrl() || '';
      const fallback = `# Default robots.txt
User-agent: *
Allow: /
Disallow: /ycode/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;

      return new NextResponse(fallback, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }

    const qaySiteId = await getQayRenderSiteId();
    if (!qaySiteId) {
      const baseUrl = getQayAppBaseUrl();
      const content = `User-agent: *
Allow: /

# Internal app routes
Disallow: /api/
Disallow: /dashboard/
Disallow: /client/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /invite/
Disallow: /ycode/
Disallow: /qay/editor/
Disallow: /qay/preview/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;

      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }

    const allSettings = await getRenderRobotsSettings(qaySiteId);
    const sitemapSettings = allSettings.sitemap as SitemapSettings | null;
    const sitemapEnabled = sitemapSettings?.mode && sitemapSettings.mode !== 'none';
    const baseUrl = await getQayRenderSiteBaseUrl() || getSiteBaseUrl({ globalCanonicalUrl: allSettings.global_canonical_url }) || '';

    let content: string;

    const customRobots = allSettings.robots_txt;
    if (customRobots && typeof customRobots === 'string' && customRobots.trim()) {
      content = customRobots.trim();

      if (sitemapEnabled && !content.toLowerCase().includes('sitemap:')) {
        content += `\n\nSitemap: ${baseUrl}/sitemap.xml`;
      }
    } else {
      content = `# Default robots.txt
User-agent: *
Allow: /

# Disallow admin/editor paths
Disallow: /ycode/`;

      if (sitemapEnabled) {
        content += `\n\n# Sitemap\nSitemap: ${baseUrl}/sitemap.xml`;
      }
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('[robots.txt] Error generating robots.txt:', error);

    // Return default on error
    const fallback = `User-agent: *
Allow: /
Disallow: /ycode/`;

    return new NextResponse(fallback, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
