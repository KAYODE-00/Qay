import Link from 'next/link';
import { LockKeyhole, ShieldAlert } from 'lucide-react';

type SiteIsolationNoticeProps = {
  title: string;
  body: string;
  href?: string;
  ctaLabel?: string;
};

export function SiteIsolationNotice({
  title,
  body,
  href,
  ctaLabel = 'Back to dashboard',
}: SiteIsolationNoticeProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <LockKeyhole className="size-3.5" />
            Site isolation
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-normal">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{body}</p>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <p>
                This area is temporarily blocked inside QAY editor mode because the shared QAY implementation
                still reads project-wide data. Blocking it here prevents one site from seeing another site&apos;s
                integrations or shared configuration.
              </p>
            </div>
          </div>

          {href && (
            <div className="mt-5">
              <Link
                href={href}
                className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
