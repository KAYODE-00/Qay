import type { Metadata } from 'next';
import Link from 'next/link';
import type { Template } from '@/lib/services/templateService';
import { QayLogo } from '@/qay/components/QayLogo';
import { listPublicUserTemplates } from '@/qay/lib/user-templates';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
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

// Fetch AI builder templates from qay_ai_templates
async function getAiTemplates(): Promise<PublicTemplate[]> {
  try {
    const admin = getQayAdmin() as any;
    const { data, error } = await admin
      .from('qay_ai_templates')
      .select('id, label, industry, color_mood, tags, features')
      .eq('is_active', true)
      .eq('is_approved', true)
      .order('rank', { ascending: false })
      .limit(24);

    if (error || !Array.isArray(data)) return [];

    return data.map((t: any) => {
      const industryLabel = (t.industry as string)
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const moodLabel = (t.color_mood as string || 'Clean')
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const featureFlags = t.features as Record<string, boolean | number> | null;
      const featureParts: string[] = [];
      if (featureFlags?.hasCommerce) featureParts.push('E-commerce');
      if (featureFlags?.hasAuth) featureParts.push('Auth');
      if (featureFlags?.hasCms) featureParts.push('CMS');
      const featureStr = featureParts.length ? ` · ${featureParts.join(', ')}` : '';

      return {
        id: `ai-${t.id as string}`,
        name: t.label as string,
        description: `${industryLabel} · ${moodLabel} design${featureStr}. Multi-page template with AI-ready zones.`,
        preview: '',
        stats: undefined,
        categoryId: null,
        livePreviewUrl: `/api/qay/ai-templates/preview/${t.id as string}`,
        categoryName: industryLabel,
        source: 'QAY AI',
      } satisfies PublicTemplate;
    });
  } catch {
    return [];
  }
}

async function getPublicTemplates(): Promise<PublicTemplate[]> {
  const [userTemplates, aiTemplates] = await Promise.all([
    listPublicUserTemplates().catch(() => []),
    getAiTemplates(),
  ]);

  const qayUserTemplates: PublicTemplate[] = userTemplates.map((template) => ({
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

  // AI templates shown first so users see them immediately
  return [...aiTemplates, ...qayUserTemplates];
}

export default async function PublicTemplatesPage() {
  const templates = await getPublicTemplates().catch(() => []);
  const categories = Array.from(new Set(templates.map((template) => template.categoryName))).slice(0, 14);

  return (
    <main className="min-h-screen bg-black text-white">
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
