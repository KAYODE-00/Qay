import { notFound } from 'next/navigation';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import type { QaySite } from '@/qay/types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SiteSettingsPage({ params }: PageProps) {
  const user = await requireDeveloper();
  const { id } = await params;
  const supabase = getQayAdmin() as any;

  const { data, error } = await supabase
    .from('qay_sites')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  const site = data as QaySite;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-full max-w-3xl">
        <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          Back to dashboard
        </a>

        <section className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-normal">{site.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your site details, publishing, and domain options.</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Slug</dt>
              <dd className="mt-2 text-sm text-foreground">{site.slug}</dd>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-2 text-sm text-foreground">{site.publish_status || 'draft'}</dd>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Custom domain</dt>
              <dd className="mt-2 text-sm text-foreground">{site.custom_domain || 'Not connected'}</dd>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Plan</dt>
              <dd className="mt-2 text-sm text-foreground">{site.plan || 'free'}</dd>
            </div>
          </dl>

          <a
            href={`/dashboard/sites/${site.id}/editor`}
            className="mt-8 inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Open editor
          </a>
        </section>
      </div>
    </main>
  );
}
