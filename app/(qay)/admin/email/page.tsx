import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { isQayEmailConfigured } from '@/qay/lib/email';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { EmailAdminClient } from './EmailAdminClient';

export const metadata: Metadata = {
  title: 'QAY Email Admin',
  robots: { index: false, follow: false },
};

export default async function QayAdminEmailPage() {
  const user = await getQayAuthUser();
  if (!user) redirect('/login?next=/admin/email');
  if (!(await hasQayAdminAccess(user))) redirect('/admin/access?next=/admin/email');

  const admin = getQayAdmin() as any;
  const [{ data: authUsers }, { data: logs }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin
      .from('qay_email_logs')
      .select('id,subject,recipient_count,provider,status,created_at,error')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const users = (authUsers?.users || [])
    .filter((item: any) => item.email)
    .map((item: any) => ({
      id: item.id,
      email: item.email,
      lastSignInAt: item.last_sign_in_at || null,
    }));

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <QayLogo imageClassName="h-10 w-auto" />
            <p className="mt-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin email system</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Message QAY users</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Send real email announcements to all users, selected users, or a custom recipient list.
            </p>
          </div>
          <Link href="/admin" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
            Back to admin
          </Link>
        </header>

        <EmailAdminClient
          users={users}
          logs={(logs || []) as any}
          isConfigured={isQayEmailConfigured()}
        />
      </div>
    </main>
  );
}
