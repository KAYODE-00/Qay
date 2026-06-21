import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, LayoutTemplate } from 'lucide-react';
import {
  getTemplate,
  listTemplatesWithCategories,
  type Template,
  type TemplateDetails,
} from '@/lib/services/templateService';
import { QayLogo } from '@/qay/components/QayLogo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ id?: string[] }>;
};

type ResolvedTemplateDemo = (Template | TemplateDetails) & {
  categoryName?: string;
};

function getTemplateId(parts: string[] | undefined) {
  const rawId = (parts || []).join('/').trim();
  if (!rawId) return '';

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

function templateIdMatches(templateId: string, requestedId: string) {
  const candidates = new Set([requestedId]);

  try {
    candidates.add(decodeURIComponent(requestedId));
  } catch {
    // Keep the original id if decoding is not possible.
  }

  candidates.add(encodeURIComponent(requestedId));
  return candidates.has(templateId) || candidates.has(encodeURIComponent(templateId));
}

async function findTemplateFromList(requestedId: string): Promise<ResolvedTemplateDemo | null> {
  const { templates, categories } = await listTemplatesWithCategories();
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  const template = templates.find((item) => templateIdMatches(item.id, requestedId));

  if (!template) return null;

  return {
    ...template,
    categoryName: template.categoryId ? categoryNameById.get(template.categoryId) || 'Template' : 'Template',
  };
}

async function resolveTemplateDemo(requestedId: string): Promise<ResolvedTemplateDemo | null> {
  if (!requestedId) return null;

  const detail = await getTemplate(requestedId).catch(() => null);
  if (detail?.livePreviewUrl) {
    return detail;
  }

  const listedTemplate = await findTemplateFromList(requestedId).catch(() => null);
  if (listedTemplate?.livePreviewUrl) {
    return listedTemplate;
  }

  return detail || listedTemplate;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const templateId = getTemplateId(id);
  const template = await resolveTemplateDemo(templateId).catch(() => null);

  return {
    title: template ? `${template.name} template demo - QAY` : 'Template demo - QAY',
    robots: { index: false, follow: false },
  };
}

export default async function QayTemplateDemoPage({ params }: Props) {
  const { id } = await params;
  const templateId = getTemplateId(id);
  const template = await resolveTemplateDemo(templateId);

  if (!template?.livePreviewUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40">
          <QayLogo theme="light" imageClassName="mx-auto h-8 w-auto" />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Template demo</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Preview is being prepared</h1>
          <p className="mt-4 text-sm leading-6 text-white/60">
            This template is in the QAY catalog, but its live preview URL is not available from the template service yet.
            Browse the template library to choose another live demo or apply a template to your project.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/dashboard/templates" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
              Browse templates
            </a>
            <a href="/" className="rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Back to QAY
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#050505] text-white">
      <header className="z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#050505]/92 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur md:px-6">
        <a href="/dashboard/templates" className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Templates
        </a>
        <div className="min-w-0 text-center">
          <div className="mx-auto flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            <QayLogo theme="light" imageClassName="h-5 w-auto" />
            QAY demo
          </div>
          <h1 className="mt-1 truncate text-sm font-semibold text-white md:text-base">{template.name}</h1>
        </div>
        <a href="/dashboard/templates" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
          Use
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </header>
      <section className="relative min-h-0 flex-1">
        <iframe
          src={template.livePreviewUrl}
          title={`${template.name} template preview`}
          className="h-full min-h-[calc(100vh-65px)] w-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute left-4 top-4 hidden rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur md:flex">
          <LayoutTemplate className="mr-2 size-3.5" aria-hidden="true" />
          Permanent template demo
        </div>
      </section>
    </main>
  );
}
