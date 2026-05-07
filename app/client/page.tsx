import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientAccessibleSites } from '@/qay/lib/client-content';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';

export default async function ClientDashboardPage() {
  const user = await requireClient();
  const sites = await getClientAccessibleSites(user.id);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar />

        <section className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Shared sites</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Welcome back</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Open any site your developer shared with you, review the draft, and update content without diving into the full builder.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sites.map((site) => (
                <article key={site.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex aspect-video items-center justify-center rounded-md border border-border bg-muted">
                    {site.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={site.thumbnail_url} alt="" className="h-full w-full rounded-md object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{site.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-medium">{site.name}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {site.access_role === 'owner' ? 'Owner access' : 'Shared with you'}
                        </p>
                      </div>
                      <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {site.publish_status || 'draft'}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/client/${site.id}`}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
                      >
                        Open workspace
                        <ArrowRight className="size-4" />
                      </Link>

                      {site.live_url && (
                        <a
                          href={site.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                        >
                          Live site
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {sites.length === 0 && (
              <div className="mt-8 rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
                No client sites are shared with this account yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
