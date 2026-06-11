import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';

type ComparisonItem = {
  label: string;
  qay: string;
  competitor: string;
};

type ComparisonPageProps = {
  competitor: string;
  headline: string;
  intro: string;
  bestFor: string[];
  competitorBestFor: string[];
  rows: ComparisonItem[];
};

export function ComparisonPage({
  competitor,
  headline,
  intro,
  bestFor,
  competitorBestFor,
  rows,
}: ComparisonPageProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-6">
          <Link href="/" aria-label="QAY home">
            <QayLogo imageClassName="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/compare/framer" className="transition hover:text-foreground">Framer</Link>
            <Link href="/compare/wix" className="transition hover:text-foreground">Wix</Link>
            <Link href="/pricing" className="transition hover:text-foreground">Pricing</Link>
          </nav>
        </header>

        <section className="py-16">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Comparison</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-foreground/90">
              Start free
            </Link>
            <Link href="/feedback" className="rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-accent">
              Send feedback
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-medium">QAY is strongest for</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              {bestFor.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </article>
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-medium">{competitor} is strongest for</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              {competitorBestFor.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </article>
        </section>

        <section className="py-12">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-border bg-muted/30 p-4 text-sm font-medium">
              <div>Area</div>
              <div>QAY</div>
              <div>{competitor}</div>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-1 gap-3 border-b border-border p-4 text-sm last:border-b-0 md:grid-cols-[0.8fr_1fr_1fr]">
                <div className="font-medium text-foreground">{row.label}</div>
                <div className="leading-6 text-muted-foreground">{row.qay}</div>
                <div className="leading-6 text-muted-foreground">{row.competitor}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
