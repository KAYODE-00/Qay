import type { Metadata } from 'next';
import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';
import { FeedbackForm } from '@/qay/components/FeedbackForm';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Send feedback about QAY, the AI builder, ecommerce, imports, client mode, and publishing flows.',
};

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-6">
          <Link href="/" aria-label="QAY home">
            <QayLogo theme="dark" imageClassName="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/compare" className="transition hover:text-foreground">Compare</Link>
            <Link href="/pricing" className="transition hover:text-foreground">Pricing</Link>
            <Link href="/dashboard" className="transition hover:text-foreground">Dashboard</Link>
          </nav>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Feedback</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Tell QAY what to fix, sharpen, or build next.
            </h1>
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              Use this for AI design quality, imports, ecommerce, Medusa, editor UX, client mode, pricing, bugs, and feature requests. Short notes are fine.
            </p>
          </div>
          <FeedbackForm />
        </section>
      </div>
    </main>
  );
}
