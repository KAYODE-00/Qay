import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';
import { UpgradeModal } from '@/qay/components/billing/UpgradeModal';
import { QAY_PLANS, type QayPlanKey } from '@/qay/lib/billing/plan-limits';

const plans = [
  { key: 'free', body: 'Create unlimited draft sites and publish two while you test, learn, and shape your workflow.' },
  { key: 'starter', body: 'For builders ready to publish client work with custom domains, demo links, and cleaner handoff.' },
  { key: 'pro', body: 'Private access for advanced publishing, deeper client workflows, and features still being prepared for wider release.' },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <QayLogo />
          <Link href="/" className="text-sm text-[#e5e5e5] transition hover:text-white">
            Back to QAY
          </Link>
        </div>
        <div className="mt-16 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">Pricing</p>
          <h1
            className="mt-4 text-5xl sm:text-6xl"
            style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
          >
            Pricing that stays on your side
          </h1>
          <p className="mt-5 text-base leading-8 text-[#e5e5e5]">
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
                className={`rounded-lg border p-6 ${unavailable ? 'border-white/10 bg-white/[0.015] opacity-65' : 'border-white/10 bg-white/[0.03]'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/45">{plan.name}</div>
                  {unavailable && (
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                      Private
                    </span>
                  )}
                </div>
                <div
                  className="mt-4 text-5xl"
                  style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
                >
                  {plan.price === 0 ? '$0' : `$${plan.price}/mo`}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#e5e5e5]">{body}</p>
                <ul className="mt-5 space-y-2 text-sm text-[#e5e5e5]">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
                {plan.key === 'free' ? (
                  <Link
                    href="/signup"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-white/15 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Start free
                  </Link>
                ) : unavailable ? (
                  <Link
                    href="/help"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-white/10 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
