import { notFound } from 'next/navigation';
import { FileText, Inbox } from 'lucide-react';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientSiteForms } from '@/qay/lib/client-content';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';

type PageProps = {
  params: Promise<{ siteId: string }>;
};

function formatDate(value: string | null) {
  if (!value) return 'No submissions yet';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default async function ClientSiteFormsPage({ params }: PageProps) {
  const user = await requireClient();
  const { siteId } = await params;
  const data = await getClientSiteForms(user.id, siteId);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar siteId={siteId} siteName={data.site.name} />

        <section className="flex-1 px-5 py-6 lg:px-8">
          <div className="mb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client forms</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Site forms</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              See the forms that exist on this site and their submission activity.
            </p>
          </div>

          {data.forms.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.forms.map((form) => (
                <article key={`${form.pageSlug}:${form.formId}`} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold">{form.name}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{form.pageName} / {form.pageSlug || 'home'}</p>
                    </div>
                    <Inbox className="size-5 text-muted-foreground" />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-border bg-background p-3">
                      <p className="text-2xl font-semibold">{form.submissionCount}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Submissions</p>
                    </div>
                    <div className="rounded-md border border-border bg-background p-3">
                      <p className="text-2xl font-semibold">{form.newCount}</p>
                      <p className="mt-1 text-xs text-muted-foreground">New</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Latest: {formatDate(form.latestSubmission)}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
              <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-muted">
                <FileText className="size-5" />
              </div>
              No forms were found on this site yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
