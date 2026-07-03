import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { SectionsAdminClient } from './SectionsAdminClient';

export const metadata: Metadata = {
  title: 'QAY Section Submissions',
  robots: { index: false, follow: false },
};

export default async function SectionsAdminPage() {
  const user = await getQayAuthUser();
  if (!user) redirect('/login?next=/admin/sections');
  if (!(await hasQayAdminAccess(user))) redirect('/admin/access?next=/admin/sections');

  return <SectionsAdminClient />;
}
