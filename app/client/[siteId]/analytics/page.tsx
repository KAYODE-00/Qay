import { notFound } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientSiteContent } from '@/qay/lib/client-content';
import { getQayAnalyticsSummary } from '@/qay/lib/analytics';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';

type PageProps = {
  params: Promise<{ siteId: string }>;
};

function formatDate(value: string | null) {
  if (!value) return 'Not published yet';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function ClientAnalyticsPage({ params }: PageProps) {
  const user = await requireClient();
  const { siteId } = await params;
  const content = await getClientSiteContent(user.id, siteId);

  if (!content) {
    notFound();
  }

  const summary = await getQayAnalyticsSummary(siteId);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar siteId={siteId} siteName={content.site.name} />

        <section className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">{content.site.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              A lightweight analytics flow is ready now. Umami can replace or enrich this later without changing the client dashboard shape.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Total views</p>
                <p className="mt-3 text-3xl font-semibold">{summary.totalViews}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Last 7 days</p>
                <p className="mt-3 text-3xl font-semibold">{summary.last7DaysViews}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Last visit</p>
                <p className="mt-3 text-sm font-medium">{formatDate(summary.lastViewedAt)}</p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <BarChart3 className="size-5 text-muted-foreground" />
                <h2 className="text-base font-medium">Top pages</h2>
              </div>

              <div className="divide-y divide-border">
                {summary.topPages.length > 0 ? summary.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm font-medium">{page.path}</span>
                    <span className="text-sm text-muted-foreground">{page.views} views</span>
                  </div>
                )) : (
                  <div className="px-5 py-8 text-sm text-muted-foreground">
                    No visits have been recorded for this site yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
