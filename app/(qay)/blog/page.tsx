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
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <QayLogo theme="light" />
          <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            Back to QAY
          </Link>
        </div>
        <div className="mt-16">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Blog</p>
          <h1
            className="mt-4 text-5xl font-semibold tracking-normal sm:text-6xl"
          >
            Notes for builders
          </h1>
          <div className="mt-10 grid gap-4">
            {posts.map((post) => (
              <article key={post.title} className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl font-medium">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
