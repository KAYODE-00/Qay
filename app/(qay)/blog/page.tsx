import Link from 'next/link';
import { QayLogo } from '@/qay/components/QayLogo';

const posts = [
  {
    title: 'Why site isolation matters in client work',
    body: 'A quiet system is a trustworthy system. QAY keeps each site’s editor, CMS, and collaboration surface from bleeding into the next.',
  },
  {
    title: 'Moving from “just build it” to repeatable delivery',
    body: 'The fastest agencies are not the ones with the flashiest toolchain. They are the ones with fewer surprises between draft and publish.',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <QayLogo />
          <Link href="/qay" className="text-sm text-[#e5e5e5] transition hover:text-white">
            Back to QAY
          </Link>
        </div>
        <div className="mt-16">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">Blog</p>
          <h1
            className="mt-4 text-5xl sm:text-6xl"
            style={{ fontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
          >
            Notes for builders
          </h1>
          <div className="mt-10 grid gap-4">
            {posts.map((post) => (
              <article key={post.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-medium">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#e5e5e5]">{post.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
