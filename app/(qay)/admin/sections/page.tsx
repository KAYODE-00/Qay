import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { assembleSiteFromSections } from '@/qay/lib/ai/section-assembler';

export const metadata: Metadata = {
  title: 'QAY Section Test',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SectionTestPage({ searchParams }: PageProps) {
  const user = await getQayAuthUser();
  if (!user) redirect('/login?next=/admin/sections');
  if (!(await hasQayAdminAccess(user))) redirect('/dashboard');

  const params = searchParams ? await searchParams : {};
  const prompt = first(params.prompt) || 'A premium law firm for business litigation';
  const assembly = await assembleSiteFromSections(prompt);

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-border pb-8">
          <QayLogo imageClassName="h-10 w-auto" />
          <p className="mt-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin only</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Section assembly test</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Submit a prompt and preview the exact section-library HTML before it reaches the importer.
          </p>
        </header>

        <form className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row">
          <input
            name="prompt"
            defaultValue={prompt}
            className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
          />
          <button className="h-12 rounded-md bg-foreground px-5 text-sm font-medium text-background" type="submit">
            Test prompt
          </button>
        </form>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Site type</p><p className="mt-2 font-medium">{assembly.siteType}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Theme</p><p className="mt-2 font-medium">{assembly.theme.label}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Sections</p><p className="mt-2 font-medium">{assembly.sectionsUsed.length}</p></div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-medium">Sections used</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {assembly.sectionsUsed.map((section) => (
              <span key={`${section.type}-${section.sectionId}`} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {section.type}: {section.sectionId}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">Preview</div>
          <iframe title="Section assembly preview" srcDoc={assembly.html} className="h-[760px] w-full bg-white" />
        </section>
      </div>
    </main>
  );
}
