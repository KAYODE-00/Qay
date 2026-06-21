import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  getTemplate,
  listTemplatesWithCategories,
  type Template,
  type TemplateDetails,
} from '@/lib/services/templateService';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayTemplateMirror, getReadyMirrorUrl, queueQayTemplateMirror } from '@/qay/lib/template-mirrors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ id?: string[] }>;
};

type ResolvedTemplateDemo = (Template | TemplateDetails) & {
  categoryName?: string;
};

function getTemplateSource(template: ResolvedTemplateDemo | null) {
  const text = `${template?.id || ''} ${template?.categoryName || ''} ${template?.name || ''}`.toLowerCase();
  return text.includes('qay') ? 'QAY' : 'Ycode';
}

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
  if (detail) return detail;

  return findTemplateFromList(requestedId).catch(() => null);
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
  const source = getTemplateSource(template);
  const mirror = await getQayTemplateMirror(templateId, source.toLowerCase());
  const readyMirrorUrl = getReadyMirrorUrl(mirror);

  if (readyMirrorUrl) {
    redirect(readyMirrorUrl);
  }

  if (template) {
    await queueQayTemplateMirror({
      sourceTemplateId: templateId,
      sourceTemplateName: template.name,
      source: source.toLowerCase(),
    });
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#050505] text-white">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#050505]/92 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur md:px-6">
        <a
          href="/templates"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Templates
        </a>
        <div className="min-w-0 text-center">
          <div className="mx-auto flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            <QayLogo theme="light" imageClassName="h-5 w-auto" />
            QAY demo
          </div>
          <h1 className="mt-1 truncate text-sm font-semibold text-white md:text-base">{template?.name || 'Template preview'}</h1>
        </div>
        <a href="/signup?next=/dashboard/templates" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
          Use template
        </a>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl shadow-black/40 md:p-12">
          <QayLogo theme="light" imageClassName="mx-auto h-9 w-auto" />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            {source === 'QAY' ? 'QAY template demo' : 'QAY mirror demo'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">Preview is being prepared</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/60">
            This template is being converted into a permanent QAY-hosted demo, so users are not sent to the original provider preview.
            You can still apply the template to a project from the template library.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/templates" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
              Browse templates
            </a>
            <a href="/" className="rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Back to QAY
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
