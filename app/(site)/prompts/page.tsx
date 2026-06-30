import type { Metadata } from 'next';
import { qayPromptTemplates } from '@/qay/lib/ai/prompt-library';

export const metadata: Metadata = {
  title: 'QAY Prompt Templates',
  description: 'Browse prompt templates that help QAY generate better multi-page websites, sections, commerce, CMS, and auth-ready sites.',
};

function groupedTemplates() {
  return qayPromptTemplates.reduce<Record<string, typeof qayPromptTemplates>>((acc, template) => {
    const category = template.category || 'General';
    acc[category] ||= [];
    acc[category].push(template);
    return acc;
  }, {});
}

export default function PromptsPage() {
  const groups = groupedTemplates();
  const categories = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <a href="/" className="w-fit text-sm text-white/60 transition hover:text-white">
            QAY
          </a>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Prompt library
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Better prompts for better QAY sites.
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              Use these templates when you want QAY to understand site type, pages, routing, colors, auth, CMS, commerce, copy, and utility-page behavior clearly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8">
          {categories.map((category) => (
            <section
              key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="scroll-mt-10"
            >
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{category}</h2>
                  <p className="mt-1 text-sm text-white/45">
                    {groups[category].length} prompt template{groups[category].length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groups[category].map((template) => (
                  <article
                    key={template.id}
                    className="flex min-h-[360px] flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight">{template.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/56">{template.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/50">
                        {template.category}
                      </span>
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/35">
                      Examples
                    </p>
                    <p className="mt-2 text-sm text-white/72">{template.exampleBusiness}</p>
                    <details className="mt-5 rounded-xl border border-white/10 bg-black/40">
                      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-white/80 transition hover:text-white">
                        View prompt
                      </summary>
                      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap border-t border-white/10 px-4 py-4 text-xs leading-5 text-white/64 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {template.prompt}
                      </pre>
                    </details>
                    <p className="mt-auto pt-5 text-xs leading-5 text-white/40">
                      Replace bracketed fields, then paste into QAY AI Builder. If you choose this template inside the modal, QAY applies the same structure automatically.
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
