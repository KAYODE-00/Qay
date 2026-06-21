import { redirect } from 'next/navigation';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { LoginForm } from './LoginForm';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSafeNext(value: string | string[] | undefined) {
  const next = getFirstParam(value);
  if (!next || !next.startsWith('/') || next.startsWith('//')) return null;
  if (next.startsWith('/login') || next.startsWith('/signup')) return null;
  return next;
}

async function getSignedInDestination(userId: string, requestedNext: string | null) {
  if (requestedNext) return requestedNext;

  const supabase = getQayAdmin() as any;
  const { data } = await supabase
    .from('qay_user_profiles')
    .select('account_type')
    .eq('id', userId)
    .maybeSingle();

  return data?.account_type === 'client' ? '/client' : '/dashboard';
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const user = await getQayAuthUser();

  if (user) {
    redirect(await getSignedInDestination(user.id, getSafeNext(params.next)));
  }

  return <LoginForm />;
}
