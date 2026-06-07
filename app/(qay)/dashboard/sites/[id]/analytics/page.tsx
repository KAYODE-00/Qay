import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQayAnalyticsSummary } from '@/qay/lib/analytics';

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string | null) {
  if (!value) return 'No visits yet';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function DeveloperSiteAnalyticsPage({ params }: PageProps) {
  const user = await requireDeveloper();
  const { id } = await params;
  const supabase = getQayAdmin() as any;
  const { data: site, error } = await supabase
    .from('qay_sites')
    .select('id, name, slug, live_url')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error || !site) {
    notFound();
  }

  const summary = await getQayAnalyticsSummary(id);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm text-muted-foreground transition hover:text-foreground">
          Back to dashboard
        </Link>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Analytics</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">{site.name}</h1>
            {site.live_url && (
              <a
                href={site.live_url} target="_blank"
                rel="noreferrer" className="mt-3 inline-flex text-sm text-muted-foreground hover:text-foreground"
              >
                {site.live_url}
              </a>
            )}
          </div>
        </div>

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

        <section className="mt-8 rounded-lg border border-border bg-card">
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
        </section>
      </div>
    </main>
  );
}
