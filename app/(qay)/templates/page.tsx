import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, LayoutTemplate } from 'lucide-react';
import { listTemplatesWithCategories, type Template } from '@/lib/services/templateService';
import { withQayTemplateDemoUrls } from '@/qay/lib/template-demo-url';
import { QayLogo } from '@/qay/components/QayLogo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Templates - QAY',
  description: 'Browse public QAY template demos and start a new website from a polished design.',
};

type PublicTemplate = Template & {
  categoryName: string;
  source: 'QAY' | 'Ycode';
};

async function getPublicTemplates(): Promise<PublicTemplate[]> {
  const { templates, categories } = await listTemplatesWithCategories();
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return withQayTemplateDemoUrls(templates)
    .filter((template) => Boolean(template.preview && template.livePreviewUrl))
    .map((template) => {
      const categoryName = template.categoryId ? categoryNameById.get(template.categoryId) || 'Template' : 'Template';
      const source = `${template.id} ${categoryName} ${template.name}`.toLowerCase().includes('qay') ? 'QAY' : 'Ycode';

      return {
        ...template,
        categoryName,
        source,
      };
    });
}

export default async function PublicTemplatesPage() {
  const templates = await getPublicTemplates().catch(() => []);
  const categories = Array.from(new Set(templates.map((template) => template.categoryName))).slice(0, 14);

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-16">
          <Link href="/" aria-label="QAY home">
            <QayLogo theme="light" imageClassName="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-white/55 md:flex">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
            <Link href="/login" className="transition hover:text-white">Sign in</Link>
          </nav>
          <Link href="/signup?next=/dashboard/templates" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
            Use a template
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
              <LayoutTemplate className="size-4" aria-hidden="true" />
              Public template demos
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
              Browse live templates before you build.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-white/60 lg:justify-self-end">
            These template demo URLs are permanent and public. When you are ready to use one, sign in and QAY will copy the design into your own workspace.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-2">
            <a href="#all" className="shrink-0 rounded-full border border-white/15 bg-white text-black px-4 py-2 text-sm font-semibold">
              All
            </a>
            {categories.map((category) => (
              <a key={category} href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/65 transition hover:border-white/25 hover:text-white">
                {category}
              </a>
            ))}
          </div>
        )}

        {templates.length > 0 ? (
          <div id="all" className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <article key={template.id} id={template.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
                <Link href={template.livePreviewUrl || '/templates'} className="block">
                  <div className="aspect-[4/3] overflow-hidden bg-white/5">
                    <img src={template.preview} alt={`${template.name} template preview`} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/55">{template.categoryName}</span>
                    <a href="/" className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/12 hover:text-white">
                      Made from {template.source}
                    </a>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{template.name}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{template.description}</p>
                  <div className="mt-5 flex gap-3">
                    <Link href={template.livePreviewUrl || '/templates'} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
                      View demo
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                    <Link href="/signup?next=/dashboard/templates" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                      Use
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-white/65">
            Template demos are temporarily unavailable. Please check again shortly.
          </div>
        )}
      </section>
    </main>
  );
}
