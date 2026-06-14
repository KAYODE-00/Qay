import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { AdminAccessForm } from '@/qay/components/admin/AdminAccessForm';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess, isConfiguredQayAdmin } from '@/qay/lib/admin-access';

export const metadata: Metadata = {
  title: 'QAY Admin Access',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAccessPage({ searchParams }: PageProps) {
  const user = await getQayAuthUser();
  const params = searchParams ? await searchParams : {};
  const next = first(params.next) || '/admin';

  if (!user) redirect(`/login?next=/admin/access?next=${encodeURIComponent(next)}`);
  if (!isConfiguredQayAdmin(user)) redirect('/dashboard');
  if (await hasQayAdminAccess(user)) redirect(next.startsWith('/') ? next : '/admin');

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <QayLogo imageClassName="h-10 w-auto" />
        <p className="mt-8 text-sm uppercase tracking-[0.24em] text-muted-foreground">Private admin gate</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Unlock QAY admin</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          Your email is allowed for admin access. Enter the admin password to create a secure admin session on this device.
        </p>
        <AdminAccessForm />
      </div>
    </main>
  );
}
