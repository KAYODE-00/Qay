import { NextResponse } from 'next/server';
import { getKnexClient } from '@/lib/knex-client';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const knex = await getKnexClient();
  const template = await knex('qay_ai_templates')
    .select('html', 'label', 'is_active')
    .where('id', id)
    .where('is_active', true)
    .first();

  if (!template?.html) {
    return new NextResponse('Template not found', { status: 404 });
  }

  const rawHtml = String(template.html);

  // Collect head injections
  const headParts: string[] = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>${String(template.label || 'Template Preview').replace(/</g, '&lt;')}</title>`,
    // Tailwind for utility classes used in templates
    '<script src="https://cdn.tailwindcss.com"></script>',
  ];

  // Lift <style> blocks
  const styleMatches = rawHtml.match(/<style[\s\S]*?<\/style>/gi) || [];
  // Lift Google Font <link> tags
  const fontMatches = rawHtml.match(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi) || [];
  headParts.push(...styleMatches, ...fontMatches);

  // Build body: strip style/link tags already moved to head
  const bodyHtml = rawHtml
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headParts.join('\n')}
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; overflow-x: hidden; }
  /* Hide hidden pages so only the active wrapper shows */
  [data-qay-page] { display: none; }
  [data-qay-page]:first-of-type { display: block; }
</style>
</head>
<body>
${bodyHtml}
<script>
  // Show only the home page (first data-qay-page with slug="/")
  const pages = document.querySelectorAll('[data-qay-page]');
  const home = [...pages].find(p => p.getAttribute('data-qay-slug') === '/') || pages[0];
  if (home) home.style.display = 'block';
</script>
</body>
</html>`;

  return new NextResponse(fullHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'SAMEORIGIN',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
