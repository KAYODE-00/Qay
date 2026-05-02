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
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <a href="/dashboard" className="text-sm text-white/60 hover:text-white">
          Back to dashboard
        </a>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h1 className="text-2xl font-semibold tracking-normal">{site.name}</h1>
          <p className="mt-2 text-sm text-white/55">Site settings are managed through QAY APIs.</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-black p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Slug</dt>
              <dd className="mt-2 text-sm text-white">{site.slug}</dd>
            </div>
            <div className="rounded-md border border-white/10 bg-black p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Status</dt>
              <dd className="mt-2 text-sm text-white">{site.publish_status || 'draft'}</dd>
            </div>
            <div className="rounded-md border border-white/10 bg-black p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Custom domain</dt>
              <dd className="mt-2 text-sm text-white">{site.custom_domain || 'Not connected'}</dd>
            </div>
            <div className="rounded-md border border-white/10 bg-black p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Plan</dt>
              <dd className="mt-2 text-sm text-white">{site.plan || 'free'}</dd>
            </div>
          </dl>

          <a
            href={`/dashboard/sites/${site.id}/editor`}
            className="mt-8 inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Open editor
          </a>
        </section>
      </div>
    </main>
  );
}
