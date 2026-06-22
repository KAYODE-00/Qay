import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { TemplateMirrorManager } from '@/qay/components/admin/TemplateMirrorManager';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { listTemplatesWithCategories } from '@/lib/services/templateService';

export const metadata: Metadata = {
  title: 'Template Mirrors Admin',
  robots: { index: false, follow: false },
};

export default async function AdminTemplateMirrorsPage() {
  const user = await getQayAuthUser();
  if (!user) redirect('/login?next=/admin/templates');
  if (!(await hasQayAdminAccess(user))) redirect('/admin/access?next=/admin/templates');

  const admin = getQayAdmin() as any;
  const [{ templates, categories }, { data: mirrors }] = await Promise.all([
    listTemplatesWithCategories(),
    admin
      .from('qay_template_mirrors')
      .select('*')
      .order('updated_at', { ascending: false }),
  ]);

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <QayLogo imageClassName="h-10 w-auto" />
            <p className="mt-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin only</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Template mirror sync</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Prepare source templates as QAY-hosted live previews. Once a preview is ready, visitors open the QAY version directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
              Admin
            </Link>
            <Link href="/templates" className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:bg-foreground/90">
              Public templates
            </Link>
          </div>
        </header>

        <TemplateMirrorManager
          templates={templates}
          categories={categories}
          mirrors={(mirrors || []) as any}
        />
      </div>
    </main>
  );
}
