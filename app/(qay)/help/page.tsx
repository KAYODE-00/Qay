import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';

const items = [
  'Get your Supabase project connected and migrations applied.',
  'Create a site, open its editor, and keep media, pages, and CMS isolated per site.',
  'Invite clients when you want review or content edits without exposing your full builder workflow.',
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <QayLogo />
          <Link href="/" className="text-sm text-[#e5e5e5] transition hover:text-white">
            Back to QAY
          </Link>
        </div>
        <div className="mt-16">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">Help</p>
          <h1
            className="mt-4 text-5xl sm:text-6xl"
            style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
          >
            A calmer place to get unblocked
          </h1>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-[#e5e5e5]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
