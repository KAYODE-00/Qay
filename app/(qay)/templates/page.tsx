import type { Metadata } from 'next';
import Link from 'next/link';
import { listTemplatesWithCategories, type Template } from '@/lib/services/templateService';
import { withQayTemplateDemoUrls } from '@/qay/lib/template-demo-url';
import { QayLogo } from '@/qay/components/QayLogo';
import { listPublicUserTemplates } from '@/qay/lib/user-templates';
import { PublicTemplatesList } from './PublicTemplatesList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Templates - QAY',
  description: 'Browse live QAY template previews and start a new website from a polished design.',
};

type PublicTemplate = Template & {
  categoryName: string;
  source: string;
};

async function getPublicTemplates(): Promise<PublicTemplate[]> {
  const { templates, categories } = await listTemplatesWithCategories();
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  const externalTemplates: PublicTemplate[] = withQayTemplateDemoUrls(templates)
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

  const userTemplates = await listPublicUserTemplates().catch(() => []);
  const qayTemplates: PublicTemplate[] = userTemplates
    .filter((template) => Boolean(template.thumbnail_url || template.preview_url))
    .map((template) => ({
      id: `user-${template.id}`,
      name: template.name,
      description: template.description,
      preview: template.thumbnail_url || template.preview_url || '',
      stats: undefined,
      categoryId: null,
      livePreviewUrl: template.preview_url || null,
      categoryName: template.category || 'Template',
      source: template.source_label || 'QAY',
    }));

  return [...qayTemplates, ...externalTemplates];
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
              Live template previews
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
              Browse live templates before you build.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-white/60 lg:justify-self-end">
            Explore polished starter designs, preview them live, then copy the right one into your own workspace when you are ready.
          </p>
        </div>

        <PublicTemplatesList initialTemplates={templates} initialCategories={categories} />
      </section>
    </main>
  );
}
