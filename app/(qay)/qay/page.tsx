import Link from 'next/link';
import { ArrowRight, Bot, Globe, LayoutGrid, Sparkles, Users, Workflow } from 'lucide-react';
import { QayLogo } from '@/qay/components/QayLogo';

const stats = [
  { label: 'Sites built', value: '2,400+' },
  { label: 'Typical load', value: '< 2s' },
  { label: 'Getting started', value: '$0' },
];

const features = [
  { icon: LayoutGrid, title: 'Visual Editor', body: 'Design pages with precision, speed, and zero template lock-in.' },
  { icon: Workflow, title: 'CMS Built-in', body: 'Collections, dynamic pages, and publishing without bolting on another tool.' },
  { icon: Bot, title: 'AI Builder', body: 'Bring AI into your workflow without giving up control of the final result.' },
  { icon: Globe, title: 'Custom Domains', body: 'Go live on your own domain when the site is ready for the world.' },
  { icon: Users, title: 'Collaboration', body: 'Invite teammates and clients while keeping each site isolated.' },
  { icon: Sparkles, title: 'Client Mode', body: 'Let clients review and edit the right content without touching your builder setup.' },
];

const steps = [
  { number: '01', title: 'Build', body: 'Start with a blank canvas, a template, or imported HTML.' },
  { number: '02', title: 'Publish', body: 'Ship fast with hosting, CMS, and performance already in the workflow.' },
  { number: '03', title: 'Share with clients', body: 'Hand over previews, invite collaborators, and keep feedback organized.' },
];

const plans = [
  { name: 'Free', price: '$0', note: 'Perfect for getting your first site moving.' },
  { name: 'Pro', price: '$19/mo', note: 'For freelancers shipping polished client work every week.' },
  { name: 'Agency', price: '$79/mo', note: 'For teams running multiple sites and client collaborations.' },
];

export const metadata = {
  title: 'QAY',
  description: 'QAY gives freelancers and agencies a professional website builder without the Webflow price tag.',
};

export default function QayLandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.2))',
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <QayLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#e5e5e5] transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e5e5e5]"
            >
              Start for free
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm uppercase tracking-[0.28em] text-white/55">For freelancers and agencies</p>
            <h1
              className="max-w-4xl text-6xl leading-[0.95] sm:text-7xl lg:text-8xl"
              style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
            >
              Build websites that move.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#e5e5e5]">
              QAY gives freelancers and agencies a professional website builder without the Webflow price tag.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-[#e5e5e5]"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/5"
              >
                See demo
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">Used by freelancers in 30+ countries</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-6">
                <div
                  className="text-4xl"
                  style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-[#e5e5e5]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/45">Capabilities</p>
            <h2
              className="mt-4 text-4xl sm:text-5xl"
              style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
            >
              A focused builder for modern client work
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-3">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#e5e5e5]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">How it works</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm tracking-[0.24em] text-white/45">{step.number}</div>
                <h3 className="mt-5 text-xl font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#e5e5e5]">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">Pricing preview</p>
              <h2
                className="mt-4 text-4xl sm:text-5xl"
                style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
              >
                Start lean, scale clean
              </h2>
            </div>
            <Link href="/pricing" className="text-sm text-[#e5e5e5] transition hover:text-white">
              See full pricing →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-white/45">{plan.name}</div>
                <div
                  className="mt-4 text-5xl"
                  style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
                >
                  {plan.price}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#e5e5e5]">{plan.note}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-auto flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-[#e5e5e5] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <QayLogo />
            <span>© 2026 QAY. For builders.</span>
          </div>
          <nav className="flex items-center gap-5">
            <Link href="/pricing" className="transition hover:text-white">/pricing</Link>
            <Link href="/help" className="transition hover:text-white">/help</Link>
            <Link href="/blog" className="transition hover:text-white">/blog</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
