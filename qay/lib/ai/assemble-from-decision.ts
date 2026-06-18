import type { SiteDecision } from './decision-schema';
import { loadLibrary, normalizeDecisionSlot } from '../section-library/manifest';
import type { SectionDesign } from '../section-library/manifest';
import { callWithFallbackDetailed } from './providers';

export async function assembleFromDecision(decision: SiteDecision, prompt?: string): Promise<{
  html: string;
  pages: string[];
}> {
  const lib = await loadLibrary(decision.siteType);
  const colors = decision.brand.colors;
  const fonts = decision.brand.fonts;

  const themeCss = `
<style>
:root {
  --qm-bg: ${safeColor(colors.background, '#ffffff')};
  --qm-surface: ${isDark(colors.background) ? '#111111' : '#ffffff'};
  --qm-primary: ${safeColor(colors.primary, '#111111')};
  --qm-secondary: ${safeColor(colors.secondary, '#555555')};
  --qm-accent: ${safeColor(colors.accent, '#111111')};
  --qm-accent-text: ${isDark(colors.accent) ? '#ffffff' : '#111111'};
  --qm-border: ${isDark(colors.background) ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.14)'};
  --qm-text: ${isDark(colors.background) ? '#f5f5f0' : '#111111'};
  --qm-text-muted: ${isDark(colors.background) ? 'rgba(245,245,240,0.68)' : 'rgba(17,17,17,0.62)'};
  --qm-heading-font: '${escapeCssString(fonts.heading || 'Inter')}', sans-serif;
  --qm-body-font: '${escapeCssString(fonts.body || 'Inter')}', sans-serif;
}
body { background: var(--qm-bg); color: var(--qm-text); font-family: var(--qm-body-font); margin:0; }
h1,h2,h3,h4,h5,h6 { font-family: var(--qm-heading-font); }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.heading || 'Inter')}:wght@400;600;700;800;900&family=${encodeURIComponent(fonts.body || 'Inter')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
`;

  function pickSection(sectionType: string): string {
    const slot = normalizeDecisionSlot(sectionType);
    const pool = lib[slot] as SectionDesign[] | undefined;
    if (!pool?.length) return '';
    const rawIndex = decision.sectionPicks[slot] ?? decision.sectionPicks[sectionType];
    // If AI picked a specific index, try to use it
    if (rawIndex !== undefined && rawIndex !== null) {
      const index = Number.isFinite(Number(rawIndex)) ? Number(rawIndex) : 0;
      const exact = pool.find((item) => item.index === index);
      if (exact) return exact.html;
    }
    // Random fallback — ensures different layouts when regenerating
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex]?.html || pool[0].html;
  }

  function injectContentAndImages(html: string): string {
    let out = html;
    for (const [zone, value] of Object.entries(decision.textContent)) {
      out = out.replace(
        new RegExp(`(data-qm="${escapeRegex(zone)}"[^>]*>)[^<]*(<)`, 'g'),
        `$1${escapeHtml(value)}$2`
      );
    }
    for (const [zone, url] of Object.entries(decision.brand.images)) {
      if (!url) continue;
      out = out.replace(
        new RegExp(`(data-qm="${escapeRegex(zone)}"[^>]*?\\ssrc=")[^"]*(")`, 'g'),
        `$1${escapeAttribute(url)}$2`
      );
    }
    return out;
  }

  let bodyHtml = '';
  let pageNames: string[] = [];

  if (decision.navMode === 'single-page-scroll') {
    const page = decision.pages[0] || { name: 'Homepage', slug: '/', sectionSlots: ['navbar', 'hero', 'footer'] };
    const body = page.sectionSlots.map(pickSection).join('\n\n');
    const homepageHtml = injectContentAndImages(body);
    pageNames = [page.name];

    if (decision.pages.length > 1) {
      const pageBlocks: string[] = [pageWrapper(page.name, page.slug, homepageHtml)];
      for (let i = 1; i < decision.pages.length; i++) {
        const p = decision.pages[i];
        let content = '';
        if (p.slug === 'login') {
          content = buildCustomLoginPage(decision.brand.name, decision.brand.tagline);
        } else if (p.slug === 'register') {
          content = buildCustomRegisterPage(decision.brand.name, decision.brand.tagline);
        } else if (p.slug === 'dashboard') {
          content = buildCustomDashboardPage(decision.brand.name, decision.brand.tagline);
        } else {
          const sectionsHtml = p.sectionSlots.map(pickSection).join('\n\n');
          content = injectContentAndImages(sectionsHtml);
        }
        pageBlocks.push(pageWrapper(p.name, p.slug, content));
        pageNames.push(p.name);
      }
      bodyHtml = pageBlocks.join('\n\n');
    } else {
      bodyHtml = homepageHtml;
    }
  } else {
    const pageBlocks: string[] = [];
    for (const page of decision.pages) {
      let content = '';
      if (page.slug === 'login') {
        content = buildCustomLoginPage(decision.brand.name, decision.brand.tagline);
      } else if (page.slug === 'register') {
        content = buildCustomRegisterPage(decision.brand.name, decision.brand.tagline);
      } else if (page.slug === 'dashboard') {
        content = buildCustomDashboardPage(decision.brand.name, decision.brand.tagline);
      } else {
        const sectionsHtml = page.sectionSlots.map(pickSection).join('\n\n');
        content = injectContentAndImages(sectionsHtml);
      }
      pageBlocks.push(pageWrapper(page.name, page.slug, content));
      pageNames.push(page.name);
    }
    bodyHtml = pageBlocks.join('\n\n');
  }

  const personalizedBody = (prompt && prompt.length > 5) ? await personalizeAssembledHtml(bodyHtml, decision, prompt) : bodyHtml;
  
  // Materialize variables directly in the body HTML to fix Tailwind opacity compiling issues
  const materializedBody = materializeThemeVariables(personalizedBody, colors, fonts);
  const html = `${themeCss}\n${materializedBody}`;

  return { html, pages: pageNames };
}

function pageWrapper(name: string, slug: string, html: string) {
  return `<div data-qay-page="${escapeAttribute(name)}" data-qay-slug="${escapeAttribute(slug)}">\n${html.trim()}\n</div>`;
}

function buildCustomLoginPage(brandName: string, tagline: string) {
  return `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">${brandName}</a>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="/register" class="hover:text-[var(--qm-accent)] transition">Register</a>
    </div>
  </div>
</nav>
<main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] flex items-center justify-center py-20 px-5">
  <div class="w-full max-w-md rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 shadow-2xl space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="login-title">Welcome Back</h1>
      <p class="text-xs text-[var(--qm-text-muted)]" data-qm="login-subtitle">Enter your details to access your account dashboard</p>
    </div>
    <form class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
        <input type="email" required placeholder="name@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Password</label>
        <input type="password" required placeholder="••••••••" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div class="flex items-center justify-between text-xs">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="rounded border-[var(--qm-border)] text-[var(--qm-accent)] focus:ring-[var(--qm-accent)]" />
          <span>Remember me</span>
        </label>
        <a href="#" class="text-[var(--qm-accent)] hover:underline font-semibold">Forgot password?</a>
      </div>
      <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-4 text-xs font-black uppercase tracking-wider text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 active:scale-98 transition duration-200">Sign In</button>
    </form>
    <p class="text-center text-xs text-[var(--qm-text-muted)]">
      Don't have an account? <a href="/register" class="text-[var(--qm-accent)] hover:underline font-semibold">Sign up</a>
    </p>
  </div>
</main>
<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <p class="font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">${brandName}</p>
    <p class="text-[10px] uppercase tracking-wider">&copy; 2026 ${brandName}. ALL RIGHTS RESERVED.</p>
  </div>
</footer>`;
}

function buildCustomRegisterPage(brandName: string, tagline: string) {
  return `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">${brandName}</a>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="/login" class="hover:text-[var(--qm-accent)] transition">Login</a>
    </div>
  </div>
</nav>
<main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] flex items-center justify-center py-20 px-5">
  <div class="w-full max-w-md rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 shadow-2xl space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="register-title">Create Account</h1>
      <p class="text-xs text-[var(--qm-text-muted)]" data-qm="register-subtitle">Sign up to get started and manage your member dashboard</p>
    </div>
    <form class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
        <input type="text" required placeholder="John Doe" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
        <input type="email" required placeholder="name@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider mb-2">Password</label>
        <input type="password" required placeholder="••••••••" class="w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3 text-sm focus:border-[var(--qm-accent)] outline-none" />
      </div>
      <div class="flex items-center text-xs">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" required class="rounded border-[var(--qm-border)] text-[var(--qm-accent)]" />
          <span>I agree to the <a href="#" class="text-[var(--qm-accent)] hover:underline">Terms & Privacy Policy</a></span>
        </label>
      </div>
      <button type="button" class="w-full rounded-xl bg-[var(--qm-accent)] py-4 text-xs font-black uppercase tracking-wider text-[var(--qm-accent-text)] shadow-lg hover:opacity-90 active:scale-98 transition duration-200">Create Account</button>
    </form>
    <p class="text-center text-xs text-[var(--qm-text-muted)]">
      Already have an account? <a href="/login" class="text-[var(--qm-accent)] hover:underline font-semibold">Sign in</a>
    </p>
  </div>
</main>
<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <p class="font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">${brandName}</p>
    <p class="text-[10px] uppercase tracking-wider">&copy; 2026 ${brandName}. ALL RIGHTS RESERVED.</p>
  </div>
</footer>`;
}

function buildCustomDashboardPage(brandName: string, tagline: string) {
  return `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-extrabold tracking-tight hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">${brandName}</a>
    <div class="flex items-center gap-4 text-xs font-semibold">
      <a href="/login" class="hover:text-[var(--qm-accent)] transition">Log Out</a>
    </div>
  </div>
</nav>
<main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)] py-10 px-5">
  <div class="mx-auto max-w-7xl space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--qm-border)] pb-6">
      <div class="space-y-1">
        <h1 class="text-4xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="dashboard-title">Workspace Console</h1>
        <p class="text-xs text-[var(--qm-text-muted)]" data-qm="dashboard-subtitle">Real-time control panel, membership state, and activity logs.</p>
      </div>
      <div class="flex gap-3">
        <button class="rounded-xl border border-[var(--qm-border)] px-4 py-2 text-xs font-bold hover:bg-[var(--qm-surface)] transition">Settings</button>
        <button class="rounded-xl bg-[var(--qm-accent)] px-4 py-2 text-xs font-bold text-[var(--qm-accent-text)] shadow hover:opacity-90 transition">New Action</button>
      </div>
    </div>
    
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-1-val">2,480</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-1-lbl">Active Members</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-2-val">$14,820</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-2-lbl">Monthly Revenue</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-3-val">99.98%</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-3-lbl">System Health</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-2">
        <p class="text-3xl font-black text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)" data-qm="stat-4-val">3 Active</p>
        <p class="text-[10px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]" data-qm="stat-4-lbl">API Binders</p>
      </div>
    </div>
    
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 lg:col-span-2 space-y-4">
        <h3 class="font-bold text-lg" data-qm="logs-title">Activity Logs</h3>
        <div class="divide-y divide-[var(--qm-border)]">
          <div class="py-3 flex justify-between text-xs">
            <span class="font-mono text-[var(--qm-text-muted)]">03:22:19</span>
            <span data-qm="log-1">User authentication success</span>
            <span class="text-emerald-500 font-bold">OK</span>
          </div>
          <div class="py-3 flex justify-between text-xs">
            <span class="font-mono text-[var(--qm-text-muted)]">02:54:11</span>
            <span data-qm="log-2">Payment provider sync success</span>
            <span class="text-emerald-500 font-bold">OK</span>
          </div>
          <div class="py-3 flex justify-between text-xs">
            <span class="font-mono text-[var(--qm-text-muted)]">02:08:44</span>
            <span data-qm="log-3">Auto-deploy trigger</span>
            <span class="text-[var(--qm-accent)] font-bold">PENDING</span>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-4">
        <h3 class="font-bold text-lg" data-qm="profile-title">Account Profile</h3>
        <div class="flex items-center gap-4">
          <div class="size-12 rounded-full bg-[var(--qm-accent)] text-[var(--qm-accent-text)] flex items-center justify-center font-black">AD</div>
          <div>
            <p class="text-sm font-bold" data-qm="profile-name">Admin Member</p>
            <p class="text-xs text-[var(--qm-text-muted)]" data-qm="profile-email">admin@qay.studio</p>
          </div>
        </div>
        <div class="pt-4 border-t border-[var(--qm-border)]">
          <span class="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider" data-qm="subscription-badge">Active Subscription</span>
        </div>
      </div>
    </div>
  </div>
</main>
<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-12 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <p class="font-black text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">${brandName}</p>
    <p class="text-[10px] uppercase tracking-wider">&copy; 2026 ${brandName}. ALL RIGHTS RESERVED.</p>
  </div>
</footer>`;
}

function materializeThemeVariables(html: string, colors: SiteDecision['brand']['colors'], fonts: SiteDecision['brand']['fonts']) {
  const cssVariables: Record<string, string> = {
    '--qm-bg': safeColor(colors.background, '#ffffff'),
    '--qm-surface': isDark(colors.background) ? '#111111' : '#ffffff',
    '--qm-primary': safeColor(colors.primary, '#111111'),
    '--qm-secondary': safeColor(colors.secondary, '#555555'),
    '--qm-accent': safeColor(colors.accent, '#111111'),
    '--qm-accent-text': isDark(colors.accent) ? '#ffffff' : '#111111',
    '--qm-border': isDark(colors.background) ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.14)',
    '--qm-text': isDark(colors.background) ? '#f5f5f0' : '#111111',
    '--qm-text-muted': isDark(colors.background) ? 'rgba(245,245,240,0.68)' : 'rgba(17,17,17,0.62)',
    '--qm-heading-font': `'${escapeCssString(fonts.heading || 'Inter')}', sans-serif`,
    '--qm-body-font': `'${escapeCssString(fonts.body || 'Inter')}', sans-serif`,
  };

  return Object.entries(cssVariables).reduce((current, [key, value]) => (
    current.replaceAll(`var(${key})`, value)
  ), html);
}

async function personalizeAssembledHtml(html: string, decision: SiteDecision, prompt: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert copywriter and content personalization engine for the QAY website builder.
You will receive the user's original website prompt, the site type, brand details, and a fully styled HTML template.
Your ONLY job is to rewrite ALL visible text content to make it hyper-specific to the user's brand and industry.

## What to Personalize
- ALL headings (h1-h6): Make them compelling, specific, and on-brand
- ALL paragraphs: Write real, detailed copy — no placeholder text
- ALL button/link text: Use action-oriented, industry-specific CTAs
- ALL list items, table cells, card titles, card descriptions
- ALL prices: Use realistic prices for the industry
- ALL product/service names: Use specific, believable names
- ALL menu items (for restaurants): Use real dish names with descriptions
- ALL team member names and roles: Use realistic names and titles
- ALL testimonial quotes and attribution: Write believable, specific reviews
- ALL image alt attributes: Make them descriptive and relevant
- Copyright year and company references: Use the brand name

## Industry-Specific Copy Guidelines
- **Restaurant**: Use appetizing food descriptions, real dish names, cooking techniques, ingredient details
- **E-commerce**: Use product-focused copy, collection names, shopping CTAs ("Shop Now", "Add to Cart")
- **SaaS/Tech**: Use feature-benefit language, metrics, integration mentions
- **Law/Medical**: Use professional, trustworthy language with credentials
- **Portfolio/Agency**: Use creative, confident language about capabilities
- **Hotel**: Use hospitality language about experiences, amenities, bookings
- **Fitness**: Use motivational, energetic language about programs and results

## STRICT Rules
- NEVER change ANY HTML tags, CSS classes, inline styles, IDs, or data-* attributes
- NEVER alter any data-qay-*, data-qm, data-qay-commerce, or structural attributes
- NEVER change image src URLs
- Keep text length roughly similar to the template to preserve layout
- Return ONLY the final HTML. No markdown code fences, no explanations, no commentary.`;

    const userMessage = `User prompt: "${prompt}"
Site type: ${decision.siteType}
Brand name: ${decision.brand.name}
Tagline: ${decision.brand.tagline}

HTML template to personalize:
"""
${html}
"""`;

    const result = await callWithFallbackDetailed<string>(
      userMessage,
      systemPrompt,
      (text) => {
        const cleaned = text.trim().replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim();
        if (!/<[a-z][\s\S]*>/i.test(cleaned)) {
          throw new Error('Invalid HTML returned');
        }
        return cleaned;
      }
    );

    return result.value || html;
  } catch (err) {
    console.warn('[QAY AI] Assembled HTML copy personalization failed, using raw template:', err);
    return html;
  }
}

function safeColor(value: string | undefined, fallback: string) {
  return /^#[0-9a-f]{3,8}$/i.test(value || '') ? value as string : fallback;
}

function isDark(hex: string): boolean {
  const c = safeColor(hex, '#ffffff').replace('#', '');
  const normalized = c.length === 3 ? c.split('').map((char) => `${char}${char}`).join('') : c;
  const r = parseInt(normalized.substring(0, 2), 16) || 0;
  const g = parseInt(normalized.substring(2, 4), 16) || 0;
  const b = parseInt(normalized.substring(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function escapeCssString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
