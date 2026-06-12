import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { getQayAdmin } from '@/qay/lib/supabase-admin';

export const metadata: Metadata = {
  title: 'Feedback Admin',
  robots: { index: false, follow: false },
};

type FeedbackAttachment = {
  name?: string;
  type?: string;
  size?: number;
  dataUrl?: string;
};

type FeedbackRow = {
  id: string;
  name: string | null;
  email: string | null;
  category: string;
  message: string;
  source_path: string | null;
  user_agent: string | null;
  status: string;
  created_at: string | null;
  attachments: FeedbackAttachment[] | null;
};

function formatDate(value: string | null) {
  if (!value) return 'Unknown date';

  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatSize(value: number | undefined) {
  if (!value) return '';
  if (value < 1024 * 1024) return `${Math.round(value / 1024)}KB`;
  return `${(value / 1024 / 1024).toFixed(1)}MB`;
}

export default async function FeedbackAdminFeedPage() {
  const user = await getQayAuthUser();

  if (!user) {
    redirect('/login?next=/feedback/adminfeed');
  }

  const isAdmin = await hasQayAdminAccess(user);

  if (!isAdmin) {
    redirect('/dashboard');
  }

  const admin = getQayAdmin() as any;
  const { data, error } = await admin
    .from('qay_feedback')
    .select('id,name,email,category,message,source_path,user_agent,status,created_at,attachments')
    .order('created_at', { ascending: false })
    .limit(200);

  const feedback = (data || []) as FeedbackRow[];

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <QayLogo imageClassName="h-10 w-auto" />
            <p className="mt-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin only</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Feedback feed</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Private feedback submitted from QAY, including screenshots and screen recordings when users attach them.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{feedback.length}</span> latest items
          </div>
        </header>

        {error ? (
          <section className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
            Could not load feedback. Make sure the feedback migrations are applied.
          </section>
        ) : null}

        {!error && feedback.length === 0 ? (
          <section className="mt-8 rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
            No feedback has been submitted yet.
          </section>
        ) : null}

        <section className="mt-8 space-y-5">
          {feedback.map((item) => {
            const attachments = Array.isArray(item.attachments) ? item.attachments : [];

            return (
              <article key={item.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium capitalize text-foreground">
                        {item.category || 'general'}
                      </span>
                      <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {item.status || 'new'}
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">
                      {item.name || 'Anonymous'}
                      {item.email ? <span className="font-normal text-muted-foreground"> · {item.email}</span> : null}
                    </h2>
                  </div>
                  <time className="text-xs text-muted-foreground">{formatDate(item.created_at)}</time>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">{item.message}</p>

                {attachments.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {attachments.map((attachment, index) => {
                      const isVideo = attachment.type?.startsWith('video/');
                      const label = `${attachment.name || `Attachment ${index + 1}`} ${formatSize(attachment.size)}`.trim();

                      return (
                        <figure key={`${item.id}-${index}`} className="overflow-hidden rounded-lg border border-border bg-background">
                          {isVideo ? (
                            <video
                              src={attachment.dataUrl} controls
                              className="max-h-[360px] w-full bg-black"
                            />
                          ) : (
                            <img
                              src={attachment.dataUrl} alt={attachment.name || `Feedback attachment ${index + 1}`}
                              className="max-h-[360px] w-full object-contain"
                            />
                          )}
                          <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                            {label}
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                ) : null}

                <dl className="mt-5 grid gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-foreground">Source</dt>
                    <dd className="mt-1 break-all">{item.source_path || 'Unknown'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">User agent</dt>
                    <dd className="mt-1 break-all">{item.user_agent || 'Unknown'}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
