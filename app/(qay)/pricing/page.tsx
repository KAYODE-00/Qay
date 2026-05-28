import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';
import { UpgradeModal } from '@/qay/components/billing/UpgradeModal';
import { QAY_PLANS, type QayPlanKey } from '@/qay/lib/billing/plan-limits';

const plans = [
  { key: 'free', body: 'Create unlimited draft sites and publish two while you test, learn, and shape your workflow.' },
  { key: 'pro', body: 'Built for freelancers shipping client sites with CMS, collaboration, and custom domains.' },
  { key: 'agency', body: 'For teams juggling multiple sites, reviews, and client handoff without the usual clutter.' },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <QayLogo />
          <Link href="/qay" className="text-sm text-[#e5e5e5] transition hover:text-white">
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
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map(({ key, body }) => {
            const plan = QAY_PLANS[key as QayPlanKey];

            return (
              <div key={plan.key} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-white/45">{plan.name}</div>
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
