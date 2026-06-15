import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';
import { UpgradeModal } from '@/qay/components/billing/UpgradeModal';
import { QAY_PLANS, type QayPlanKey } from '@/qay/lib/billing/plan-limits';

const plans = [
  { key: 'free', body: 'Create unlimited draft sites and publish two while you test, learn, and shape your workflow.' },
  { key: 'starter', body: 'For solo builders and small teams shipping real client sites with custom domains, AI generation, and commerce-ready pages.' },
  { key: 'pro', body: 'For serious builders who need more published sites, stronger ecommerce, client flows, auth, analytics, and priority delivery.' },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <QayLogo />
          <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            Back to QAY
          </Link>
        </div>
        <div className="mt-16 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Pricing</p>
          <h1
            className="mt-4 text-5xl font-semibold tracking-normal sm:text-6xl"
          >
            Pricing that stays on your side
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Start at zero, grow when the workflow pays you back, and keep a clear path from solo builder to agency team.
          </p>
        </div>
        <div className="mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
          {plans.map(({ key, body }) => {
            const plan = QAY_PLANS[key as QayPlanKey];
            const unavailable = !plan.isAvailable;

            return (
              <div
                key={plan.key}
                className={`rounded-lg border p-6 ${unavailable ? 'border-border bg-card opacity-65' : 'border-border bg-card'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{plan.name}</div>
                  {unavailable && (
                    <span className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                </div>
                <div
                  className="mt-4 text-5xl font-semibold tracking-normal"
                >
                  {plan.price === 0 ? '$0' : `$${plan.price}/mo`}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
                {plan.key === 'free' ? (
                  <Link
                    href="/signup"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-border text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    Start free
                  </Link>
                ) : unavailable ? (
                  <Link
                    href="/help"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-border text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    Request access
                  </Link>
                ) : (
                  <UpgradeModal plan={plan.key} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
