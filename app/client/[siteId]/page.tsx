import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BarChart3, Database, ExternalLink, ImageIcon, PenSquare } from 'lucide-react';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientSiteContent } from '@/qay/lib/client-content';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';

type PageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function ClientSitePage({ params }: PageProps) {
  const user = await requireClient();
  const { siteId } = await params;
  const content = await getClientSiteContent(user.id, siteId);

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar siteId={siteId} siteName={content.site.name} />

        <section className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">{content.site.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review the site draft page by page, then open the lightweight content editor when you need to update copy.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/client/${siteId}/editor`}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                <PenSquare className="size-4" />
                Edit content
              </Link>

              {content.site.live_url && (
                <a
                  href={content.site.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  <ExternalLink className="size-4" />
                  View live site
                </a>
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Link href={`/client/${siteId}/editor`} className="rounded-lg border border-border bg-card p-4 transition hover:bg-accent">
                <PenSquare className="size-5 text-muted-foreground" />
                <h2 className="mt-4 text-sm font-medium">Text</h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">Update page copy in a focused editor.</p>
              </Link>
              <Link href={`/client/${siteId}/editor`} className="rounded-lg border border-border bg-card p-4 transition hover:bg-accent">
                <ImageIcon className="size-5 text-muted-foreground" />
                <h2 className="mt-4 text-sm font-medium">Images</h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">Review image blocks exposed by the site draft.</p>
              </Link>
              <Link href={`/client/${siteId}/analytics`} className="rounded-lg border border-border bg-card p-4 transition hover:bg-accent">
                <BarChart3 className="size-5 text-muted-foreground" />
                <h2 className="mt-4 text-sm font-medium">Analytics</h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">See visits for this site only.</p>
              </Link>
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-border bg-card/60 p-4">
              <div className="flex items-start gap-3">
                <Database className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <h2 className="text-sm font-medium">CMS access</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    CMS content stays scoped to this site. Collection editing can be added here without giving clients the full builder.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-base font-medium">Available pages</h2>
              </div>

              <div className="divide-y divide-border">
                {content.pages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{page.is_index ? 'Home' : page.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {page.is_index ? '/' : `/${page.slug.replace(/^\/+/, '')}`}
                      </p>
                    </div>
                    <Link
                      href={`/client/${siteId}/editor?pageId=${page.id}`}
                      className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
