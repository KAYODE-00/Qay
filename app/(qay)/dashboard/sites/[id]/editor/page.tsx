import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeft, LockKeyhole } from 'lucide-react';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import type { QaySite } from '@/qay/types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QaySiteEditorGatePage({ params }: PageProps) {
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
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30">
          <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <LockKeyhole className="size-5 text-white/75" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-normal">{site.name}</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">
            This QAY site is protected from opening the global Ycode workspace. The site record exists, but the isolated
            editor data layer has not been connected yet.
          </p>

          <div className="mt-6 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-200" />
              <div>
                <h2 className="text-sm font-medium text-amber-100">Global editor blocked</h2>
                <p className="mt-1 text-sm leading-6 text-amber-100/70">
                  Opening `/ycode?site={site.id}` currently falls through to Ycode&apos;s flat global pages. QAY will keep
                  you here until the next isolation layer maps site-specific editor data safely.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/dashboard/sites/${site.id}/settings`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Site settings
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Back to sites
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
