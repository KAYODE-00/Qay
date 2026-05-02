import { notFound, redirect } from 'next/navigation';
import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QaySiteEditorGatePage({ params }: PageProps) {
  const user = await requireDeveloper();
  const { id } = await params;
  const supabase = getQayAdmin() as any;

  const { data, error } = await supabase
    .from('qay_sites')
    .select('id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  redirect(`/ycode?site=${id}`);
}
