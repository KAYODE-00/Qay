import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const metadata: Metadata = {
  title: 'QAY Admin',
  robots: { index: false, follow: false },
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  company: string | null;
  website: string | null;
  created_at: string | null;
};

type SubscriptionRow = {
  user_id: string;
  plan: string | null;
  status: string | null;
  billing_cycle: string | null;
  current_period_end: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return 'Never';
  try {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function QayAdminPage() {
  const user = await getQayAuthUser();
  if (!user) redirect('/login?next=/admin');
  if (!(await hasQayAdminAccess(user))) redirect('/admin/access?next=/admin');

  const admin = getQayAdmin() as any;
  const [{ data: authUsers }, { data: profiles }, { data: subscriptions }, { count: siteCount }, { count: feedbackCount }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from('qay_user_profiles').select('id,full_name,company,website,created_at'),
    admin.from('qay_subscriptions').select('user_id,plan,status,billing_cycle,current_period_end'),
    admin.from('qay_sites').select('id', { count: 'exact', head: true }),
    admin.from('qay_feedback').select('id', { count: 'exact', head: true }),
  ]);

  const users = authUsers?.users || [];
  const profileById = new Map<string, ProfileRow>(
    ((profiles || []) as ProfileRow[]).map((profile) => [profile.id, profile])
  );
  const subscriptionByUser = new Map<string, SubscriptionRow>(
    ((subscriptions || []) as SubscriptionRow[]).map((subscription) => [subscription.user_id, subscription])
  );
  const payingUsers = users.filter((item: any) => {
    const sub = subscriptionByUser.get(item.id);
    const plan = String(sub?.plan || item.app_metadata?.qay_plan || 'free').toLowerCase();
    return plan !== 'free' && (sub?.status || 'active') === 'active';
  });

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <QayLogo imageClassName="h-10 w-auto" />
            <p className="mt-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">Manual admin URL</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">QAY admin dashboard</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Users, plans, recent sign-ins, feedback, and section-library testing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/feedback/admin" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Feedback</Link>
            <Link href="/admin/email" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Email users</Link>
            <Link href="/admin/templates" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Template mirrors</Link>
            <Link href="/admin/sections" className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:bg-foreground/90">Test sections</Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Users</p><p className="mt-2 text-3xl font-semibold">{users.length}</p></div>
          <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Paying</p><p className="mt-2 text-3xl font-semibold">{payingUsers.length}</p></div>
          <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Sites</p><p className="mt-2 text-3xl font-semibold">{siteCount || 0}</p></div>
          <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Feedback</p><p className="mt-2 text-3xl font-semibold">{feedbackCount || 0}</p></div>
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[1.2fr_1fr_0.7fr_1fr] border-b border-border bg-muted/40 p-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <div>User</div><div>Plan</div><div>Status</div><div>Last signed in</div>
          </div>
          {users.map((item: any) => {
            const profile = profileById.get(item.id);
            const sub = subscriptionByUser.get(item.id);
            const plan = sub?.plan || item.app_metadata?.qay_plan || 'free';
            return (
              <div key={item.id} className="grid gap-3 border-b border-border p-4 text-sm last:border-b-0 md:grid-cols-[1.2fr_1fr_0.7fr_1fr]">
                <div>
                  <p className="font-medium">{profile?.full_name || item.email || item.id}</p>
                  <p className="mt-1 break-all text-xs text-muted-foreground">{item.email || 'No email'}{profile?.company ? ` · ${profile.company}` : ''}</p>
                </div>
                <div className="capitalize text-muted-foreground">{plan}</div>
                <div className="capitalize text-muted-foreground">{sub?.status || 'active'}</div>
                <div className="text-muted-foreground">{formatDate(item.last_sign_in_at)}</div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
