import { getQayAdmin } from './supabase-admin';

export type QayAnalyticsSummary = {
  totalViews: number;
  last7DaysViews: number;
  lastViewedAt: string | null;
  topPages: Array<{ path: string; views: number }>;
};

export async function recordQayPageView(siteId: string | null | undefined, pagePath: string, referrer?: string | null) {
  if (!siteId) return;

  try {
    const supabase = getQayAdmin() as any;
    await supabase
      .from('qay_page_views')
      .insert({
        site_id: siteId,
        page_path: pagePath || '/',
        referrer: referrer || null,
      });
  } catch (error) {
    console.warn('[QAY analytics] Page view was not recorded:', error);
  }
}

export async function getQayAnalyticsSummary(siteId: string): Promise<QayAnalyticsSummary> {
  const supabase = getQayAdmin() as any;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalViews, error: totalError }, { count: last7DaysViews, error: recentError }, { data: recentRows, error: rowsError }] =
    await Promise.all([
      supabase
        .from('qay_page_views')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', siteId),
      supabase
        .from('qay_page_views')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', siteId)
        .gte('viewed_at', sevenDaysAgo),
      supabase
        .from('qay_page_views')
        .select('page_path, viewed_at')
        .eq('site_id', siteId)
        .order('viewed_at', { ascending: false })
        .limit(500),
    ]);

  if (totalError || recentError || rowsError) {
    console.warn('[QAY analytics] Summary unavailable:', totalError || recentError || rowsError);
    return {
      totalViews: 0,
      last7DaysViews: 0,
      lastViewedAt: null,
      topPages: [],
    };
  }

  const pageCounts = new Map<string, number>();
  for (const row of recentRows ?? []) {
    const path = typeof row.page_path === 'string' && row.page_path ? row.page_path : '/';
    pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
  }

  return {
    totalViews: totalViews ?? 0,
    last7DaysViews: last7DaysViews ?? 0,
    lastViewedAt: recentRows?.[0]?.viewed_at ?? null,
    topPages: Array.from(pageCounts.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
  };
}
