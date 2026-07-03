import { NextResponse } from 'next/server';
import type { Layer } from '@/types';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { generateQayAiHtml, generateQayAiLayers, type AiBuilderMode } from '@/qay/lib/ai/builder';
import { AiProviderFailureError, AiProviderLimitsError } from '@/qay/lib/ai/providers';
import { buildPalettePrompt, enforcePaletteOnHtml, pickPalette } from '@/qay/lib/ai/pick-palette';
import { buildQayPromptFromTemplate, enhancePromptForQay } from '@/qay/lib/ai/prompt-library';
import { detectTemplateChoice } from '@/qay/lib/ai/template-detector';
import { cloneAndPersonalize } from '@/qay/lib/ai/template-clone-engine';
import { type TemplateMeta } from '@/qay/lib/ai/template-ingestor';

export const runtime = 'nodejs';

type GenerateRequestBody = {
  prompt?: string;
  mode?: AiBuilderMode;
  output?: 'layers' | 'html';
  selectedLayers?: Layer[];
  variation?: number;
  promptTemplateId?: string;
};

function detectGenerationCapabilities(prompt: string) {
  const p = prompt.toLowerCase();
  const auth = /\b(auth|login|register|signup|signin|sign-in|sign-up|protect|protected|member|membership|portal|dashboard|account)\b/i.test(p);
  const commerce = /\b(ecommerce|e-commerce|shop|store|cart|checkout|product|sell|commerce)\b/i.test(p);
  const cms = /\b(cms|blog|article|articles|author|authors|category|categories|post|posts|directory|listing|listings|collection|collections)\b/i.test(p);

  return {
    auth,
    commerce,
    cms,
    utilityPages: true,
  };
}

function shouldUseContentPages(prompt: string, siteType?: string) {
  if (siteType === 'blog') return true;
  if (siteType === 'real-estate') return false;
  return /\b(cms|blog|article|articles|author|authors|post|posts|publication|newsletter|editorial|magazine|directory)\b/i.test(prompt);
}

function shouldKeepGeneratedPage(pageName: string, pageSlug: string, prompt: string, siteType?: string) {
  const slug = pageSlug.replace(/^\/+/, '').toLowerCase();
  const name = pageName.toLowerCase();
  const wantsContentPages = shouldUseContentPages(prompt, siteType);
  const wantsPolicyPages = /\b(privacy policy|terms of service|legal pages?|policy pages?)\b/i.test(prompt);

  if (['404', 'not-found', 'error-404'].includes(slug) || /\b404\b|not found/.test(name)) return false;
  if (!wantsContentPages && (['blog', 'article', 'articles', 'categories', 'authors', 'author', 'posts', 'post'].includes(slug) || /\b(blog|article|author|categories|posts)\b/.test(name))) return false;
  if (!wantsPolicyPages && (['privacy', 'privacy-policy', 'terms', 'terms-of-service'].includes(slug) || /\b(privacy|terms)\b/.test(name))) return false;
  if (siteType !== 'ecommerce' && ['shop', 'product', 'cart', 'checkout', 'collections'].includes(slug)) return false;
  return true;
}

function findPageWrapperEnd(html: string, startIndex: number) {
  const tagRegex = /<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = startIndex;
  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[0];
    if (tag.startsWith('</')) {
      depth -= 1;
      if (depth === 0) return tagRegex.lastIndex;
    } else if (!tag.endsWith('/>')) {
      depth += 1;
    }
  }

  return -1;
}

function sanitizeGeneratedHtmlPages(html: string, prompt: string, siteType?: string) {
  const wrapperRegex = /<div\b[^>]*data-qay-page=["']([^"']+)["'][^>]*data-qay-slug=["']([^"']*)["'][^>]*>/gi;
  let result = '';
  let cursor = 0;
  let match: RegExpExecArray | null;
  let removedAny = false;

  while ((match = wrapperRegex.exec(html)) !== null) {
    const start = match.index;
    const end = findPageWrapperEnd(html, start);
    if (end === -1) continue;

    result += html.slice(cursor, start);
    if (shouldKeepGeneratedPage(match[1], match[2], prompt, siteType)) {
      result += html.slice(start, end);
    } else {
      removedAny = true;
    }
    cursor = end;
    wrapperRegex.lastIndex = end;
  }

  if (!removedAny) return html;
  return `${result}${html.slice(cursor)}`.trim();
}

function sanitizeGeneratedPageList(pages: unknown, prompt: string, siteType?: string) {
  return normalizeTemplatePages(pages).filter((page: any) => {
    const name = typeof page?.name === 'string' ? page.name : '';
    const slug = typeof page?.slug === 'string' ? page.slug : '';
    return shouldKeepGeneratedPage(name, slug, prompt, siteType);
  });
}

function isAiQualityError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('ai response')
    || normalized.includes('qay mobile menu')
    || normalized.includes('required qay')
    || normalized.includes('all ai providers failed')
    || normalized.includes('did not include importable html')
    || normalized.includes('not a usable design')
    || normalized.includes('copy did not match')
    || normalized.includes('missing required')
  );
}

function normalizeTemplatePages(value: unknown) {
  return Array.isArray(value) ? value : [];
}

type GenerationCapabilities = ReturnType<typeof detectGenerationCapabilities>;

type AiTemplateRow = {
  id: string;
  site_type: string;
  theme: string;
  label: string;
  html: string;
  pages: unknown;
  rank?: number | null;
  // New metadata columns (added by migration 025)
  industry?: string | null;
  color_mood?: string | null;
  tags?: string[] | null;
  features?: {
    hasCms?: boolean;
    hasCommerce?: boolean;
    hasAuth?: boolean;
    hasMultiPage?: boolean;
    pageCount?: number;
  } | null;
  zones?: Record<string, string> | null;
  pages_meta?: Array<{ slug: string; name: string; purpose: string }> | null;
  cms_hints?: unknown;
};

function pageSlugSet(pages: unknown) {
  const slugs = new Set<string>();
  for (const page of normalizeTemplatePages(pages) as Array<{ slug?: unknown; name?: unknown }>) {
    const slug = typeof page.slug === 'string' ? page.slug : '';
    const name = typeof page.name === 'string' ? page.name : '';
    if (slug) slugs.add(slug.replace(/^\/+/, '').toLowerCase() || '/');
    if (name) slugs.add(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }
  return slugs;
}

function requestedTemplateSlugs(prompt: string, capabilities: GenerationCapabilities, siteType: string) {
  const p = prompt.toLowerCase();
  const slugs = new Set<string>(['/']);
  if (/\babout\b/.test(p) || !['saas', 'blog'].includes(siteType)) slugs.add('about');
  if (/\bcontact\b/.test(p) || !['blog'].includes(siteType)) slugs.add('contact');
  if (capabilities.commerce || siteType === 'ecommerce') {
    slugs.add('shop');
    slugs.add('product');
    slugs.add('cart');
    slugs.add('checkout');
  }
  if (capabilities.auth) {
    slugs.add('login');
    slugs.add('signup');
  }
  if (capabilities.cms || siteType === 'blog') {
    slugs.add('blog');
    slugs.add('article');
    slugs.add('categories');
    slugs.add('authors');
  }
  if (siteType === 'education') {
    slugs.add('programs');
    slugs.add('admissions');
  }
  if (siteType === 'real-estate') {
    slugs.add('properties');
    slugs.add('listings');
  }
  return slugs;
}

function templateHasCommerce(html: string) {
  return /data-qay-commerce=|cart-button|checkout-button|product-card/i.test(html);
}

function templateHasAuth(html: string) {
  return /data-qay-site-auth-form=|data-qay-site-auth=|login|sign\s*up|signup|account/i.test(html);
}

function templateHasAuthHooks(html: string) {
  return /data-qay-site-auth-form=|data-qay-site-auth=/i.test(html);
}

function templateHasCms(html: string) {
  return /data-qay-cms|data-qay-collection|blog|article|author|category|post|listing/i.test(html);
}

function promptKeywordScore(prompt: string, haystack: string) {
  const keywords = prompt
    .toLowerCase()
    .replace(/#[0-9a-f]{3,8}/g, ' ')
    .split(/[^a-z0-9-]+/)
    .filter((word) => word.length > 3 && !['with', 'that', 'this', 'site', 'page', 'website', 'build', 'using'].includes(word));
  return keywords.reduce((score, word) => score + (haystack.includes(word) ? 2 : 0), 0);
}

function scoreAiTemplate(
  template: AiTemplateRow,
  prompt: string,
  capabilities: GenerationCapabilities,
  decision: ReturnType<typeof detectTemplateChoice>
) {
  const html = String(template.html || '');
  const haystack = `${template.label || ''} ${template.theme || ''} ${(template.tags || []).join(' ')} ${template.industry || ''} ${html.slice(0, 4000)}`.toLowerCase();
  const pages = pageSlugSet(template.pages);
  let score = Number(template.rank || 0);

  // Industry match (high weight — if metadata exists)
  if (template.industry && template.industry === decision.siteType) score += 60;

  // Color mood match
  const moodKey = decision.isDark && decision.isLuxury ? 'dark-luxury'
    : decision.isDark && decision.isBold ? 'dark-bold'
      : decision.isDark ? 'dark-minimal'
        : decision.isLuxury ? 'light-luxury'
          : decision.isBold ? 'bold-vibrant'
            : decision.theme === 'warm' ? 'warm-classic'
              : decision.theme === 'minimal' ? 'light-minimal'
                : 'fresh-modern';
  if (template.color_mood && template.color_mood === moodKey) score += 30;
  else if (template.theme === decision.theme) score += 16;

  // Style signals
  if (decision.isLuxury && /luxury|premium|editorial|bespoke|exclusive/.test(haystack)) score += 20;
  if (decision.isBold && /bold|street|urban|hype|vibrant|neon/.test(haystack)) score += 20;
  if (decision.isDark && /dark|black|noir|midnight|obsidian/.test(haystack)) score += 14;

  // Keyword overlap with prompt
  score += promptKeywordScore(prompt, haystack);

  // Feature match — use metadata features if available, else scan HTML
  const features = template.features;
  if (capabilities.commerce) {
    const has = features ? !!features.hasCommerce : templateHasCommerce(html);
    score += has ? 120 : -180;
  }
  if (capabilities.auth) {
    const has = features ? !!features.hasAuth : templateHasAuth(html);
    score += has ? 55 : -18;
  }
  if (capabilities.cms) {
    const has = features ? !!features.hasCms : templateHasCms(html);
    score += has ? 55 : -30;
  }

  // Page slug coverage
  for (const slug of requestedTemplateSlugs(prompt, capabilities, decision.siteType)) {
    if (pages.has(slug)) score += 9;
    else if (slug !== '/') score -= 2;
  }

  return score;
}

function selectBestAiTemplate(templates: AiTemplateRow[], prompt: string, capabilities: GenerationCapabilities, decision: ReturnType<typeof detectTemplateChoice>) {
  return templates
    .map((template) => ({ template, score: scoreAiTemplate(template, prompt, capabilities, decision) }))
    .sort((a, b) => b.score - a.score)[0] || null;
}

function authPagesHtml(decision: ReturnType<typeof detectTemplateChoice>) {
  const brand = decision.businessName || 'Your account';
  return `
<div data-qay-page="Login" data-qay-slug="login">
  <main class="min-h-screen bg-[var(--qm-bg)] px-6 py-16 text-[var(--qm-text)]">
    <section class="mx-auto grid max-w-5xl gap-10 rounded-[2rem] border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:grid-cols-[1fr_0.9fr] md:p-10" data-qay-animate="fade-in">
      <div class="flex flex-col justify-between gap-10">
        <a href="/" class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--qm-accent)]">${brand}</a>
        <div class="space-y-5">
          <p class="text-sm text-[var(--qm-text-muted)]">Secure account access</p>
          <h1 class="text-4xl font-semibold tracking-tight md:text-6xl">Welcome back.</h1>
          <p class="max-w-md text-base leading-7 text-[var(--qm-text-muted)]">Sign in to continue managing your account, saved details, and private pages.</p>
        </div>
      </div>
      <form data-qay-site-auth-form="signin" class="space-y-4 rounded-[1.5rem] border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5">
        <label class="block text-sm font-medium">Email</label>
        <input name="email" type="email" placeholder="you@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-[var(--qm-text)]" />
        <label class="block text-sm font-medium">Password</label>
        <input name="password" type="password" placeholder="Password" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-3 text-[var(--qm-text)]" />
        <button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] px-4 py-3 font-semibold text-[var(--qm-accent-text)]">Sign in</button>
        <p data-qay-site-auth-error hidden class="text-sm text-red-500"></p>
        <p data-qay-site-auth-success hidden class="text-sm text-green-500"></p>
        <div class="flex items-center justify-between text-sm text-[var(--qm-text-muted)]">
          <a href="/forgot-password" class="hover:text-[var(--qm-text)]">Forgot password?</a>
          <a href="/signup" class="hover:text-[var(--qm-text)]">Create account</a>
        </div>
      </form>
    </section>
  </main>
</div>
<div data-qay-page="Sign up" data-qay-slug="signup">
  <main class="min-h-screen bg-[var(--qm-bg)] px-6 py-16 text-[var(--qm-text)]">
    <section class="mx-auto max-w-xl rounded-[2rem] border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:p-10" data-qay-animate="slide-up">
      <a href="/" class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--qm-accent)]">${brand}</a>
      <h1 class="mt-8 text-4xl font-semibold tracking-tight">Create your account.</h1>
      <form data-qay-site-auth-form="signup" class="mt-8 space-y-4">
        <input name="name" type="text" placeholder="Full name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-[var(--qm-text)]" />
        <input name="email" type="email" placeholder="you@example.com" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-[var(--qm-text)]" />
        <input name="password" type="password" placeholder="Password" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-[var(--qm-text)]" />
        <button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] px-4 py-3 font-semibold text-[var(--qm-accent-text)]">Create account</button>
        <p data-qay-site-auth-error hidden class="text-sm text-red-500"></p>
        <p data-qay-site-auth-success hidden class="text-sm text-green-500"></p>
      </form>
      <a href="/login" class="mt-5 inline-flex text-sm text-[var(--qm-text-muted)] hover:text-[var(--qm-text)]">Already have an account?</a>
    </section>
  </main>
</div>`;
}

function htmlHasPageSlug(html: string, slug: string) {
  const normalized = slug.replace(/^\/+/, '').toLowerCase() || '/';
  const escaped = normalized === '/' ? '\\/' : normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`data-qay-slug=["']${escaped}["']`, 'i').test(html);
}

function titleFromSlug(slug: string) {
  const clean = slug.replace(/^\/+/, '').replace(/-/g, ' ') || 'Home';
  return clean.replace(/\b\w/g, (char) => char.toUpperCase());
}

function pageShell(slug: string, title: string, body: string, decision: ReturnType<typeof detectTemplateChoice>) {
  const brand = decision.businessName || 'QAY Site';
  return `
<div data-qay-page="${title}" data-qay-slug="${slug}">
  <main class="min-h-screen bg-[var(--qm-bg)] text-[var(--qm-text)]">
    <nav class="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/90 px-6 py-4 backdrop-blur md:px-10" data-qay-animate="fade-in">
      <a href="/" class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--qm-text)]" data-qm="brand-name">${brand}</a>
      <div class="hidden items-center gap-7 text-sm text-[var(--qm-text-muted)] md:flex">
        <a href="/" class="hover:text-[var(--qm-text)]">Home</a>
        <a href="/about" class="hover:text-[var(--qm-text)]">About</a>
        <a href="/contact" class="hover:text-[var(--qm-text)]">Contact</a>
      </div>
      <button type="button" class="md:hidden" data-qay-click="toggle" data-qay-target="#${slug || 'home'}-menu" data-qay-class="hidden">Menu</button>
    </nav>
    <div id="${slug || 'home'}-menu" class="hidden border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-5 md:hidden">
      <a href="/" class="block py-2 text-[var(--qm-text)]">Home</a>
      <a href="/about" class="block py-2 text-[var(--qm-text)]">About</a>
      <a href="/contact" class="block py-2 text-[var(--qm-text)]">Contact</a>
    </div>
    ${body}
    <footer class="border-t border-[var(--qm-border)] px-6 py-10 text-sm text-[var(--qm-text-muted)] md:px-10">
      <div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <p data-qm="footer-brand">${brand}</p>
        <div class="flex gap-5">
          <a href="/about" class="hover:text-[var(--qm-text)]">About</a>
          <a href="/contact" class="hover:text-[var(--qm-text)]">Contact</a>
          <a href="/" class="hover:text-[var(--qm-text)]">Home</a>
        </div>
      </div>
    </footer>
  </main>
</div>`;
}

function builtPageBody(slug: string, title: string, decision: ReturnType<typeof detectTemplateChoice>) {
  const brand = decision.businessName || 'this brand';
  if (slug === 'shop' || slug === 'products' || slug === 'collection' || slug === 'collections') {
    return `
    <section class="px-6 py-16 md:px-10" data-qay-animate="slide-up">
      <p class="text-sm uppercase tracking-[0.22em] text-[var(--qm-accent)]" data-qm="shop-eyebrow">Curated collection</p>
      <h1 class="mt-4 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl" data-qm="shop-title">${brand} Shop</h1>
      <p class="mt-5 max-w-2xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="shop-subtitle">Browse signature products selected for quality, clarity, and everyday use.</p>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-qay-commerce="product-grid" data-qay-animate="stagger-children">
        ${[1, 2, 3].map((item) => `
        <article class="overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-commerce="product-card" data-qay-product-id="template-product-${item}" data-qay-product-handle="template-product-${item}">
          <div class="aspect-[4/5] overflow-hidden" data-qay-commerce="product-image" data-qay-hover="img-zoom">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop" alt="Featured product ${item}" class="h-full w-full object-cover" data-qm="shop-product-image-${item}" />
          </div>
          <div class="space-y-3 p-5">
            <h2 class="text-xl font-semibold" data-qay-commerce="product-title" data-qm="shop-product-title-${item}">Signature Product ${item}</h2>
            <p class="text-sm leading-6 text-[var(--qm-text-muted)]" data-qay-commerce="product-description" data-qm="shop-product-description-${item}">A refined item tailored to the brand promise.</p>
            <div class="flex items-center justify-between gap-4">
              <span class="font-semibold text-[var(--qm-accent)]" data-qay-commerce="product-price" data-qm="shop-product-price-${item}">$${item * 35 + 40}</span>
              <button type="button" class="rounded-full bg-[var(--qm-accent)] px-4 py-2 text-sm font-semibold text-[var(--qm-accent-text)]" data-qay-commerce="add-to-cart" data-qay-product-id="template-product-${item}">Add</button>
            </div>
          </div>
        </article>`).join('')}
      </div>
    </section>`;
  }

  if (slug === 'contact') {
    return `
    <section class="grid min-h-[72vh] gap-10 px-6 py-16 md:grid-cols-[0.8fr_1fr] md:px-10" data-qay-animate="scroll-reveal">
      <div>
        <p class="text-sm uppercase tracking-[0.22em] text-[var(--qm-accent)]" data-qm="contact-eyebrow">Contact</p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight md:text-7xl" data-qm="contact-title">Talk to ${brand}.</h1>
        <p class="mt-5 max-w-xl text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="contact-copy">Send a message, ask a question, or start a conversation about working together.</p>
      </div>
      <form class="space-y-4 rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 md:p-8">
        <input name="name" placeholder="Name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-[var(--qm-text)]" />
        <input name="email" type="email" placeholder="Email" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-[var(--qm-text)]" />
        <textarea name="message" placeholder="Message" rows="5" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-[var(--qm-text)]"></textarea>
        <button type="submit" class="rounded-xl bg-[var(--qm-accent)] px-6 py-3 font-semibold text-[var(--qm-accent-text)]">Send message</button>
      </form>
    </section>`;
  }

  if (slug === 'pricing') {
    return `
    <section class="px-6 py-16 md:px-10" data-qay-animate="slide-up">
      <p class="text-sm uppercase tracking-[0.22em] text-[var(--qm-accent)]" data-qm="pricing-eyebrow">Pricing</p>
      <h1 class="mt-4 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl" data-qm="pricing-title">Simple plans for ${brand} customers.</h1>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        ${['Starter', 'Growth', 'Scale'].map((plan, index) => `
        <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6" data-qay-hover="lift">
          <h2 class="text-2xl font-semibold">${plan}</h2>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]">A focused package for clear next steps.</p>
          <p class="mt-6 text-4xl font-semibold text-[var(--qm-accent)]">$${[19, 49, 99][index]}</p>
          <a href="/signup" class="mt-6 inline-flex rounded-xl bg-[var(--qm-accent)] px-5 py-3 text-sm font-semibold text-[var(--qm-accent-text)]">Choose plan</a>
        </article>`).join('')}
      </div>
    </section>`;
  }

  return `
    <section class="grid min-h-[72vh] gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-10" data-qay-animate="scroll-reveal">
      <div>
        <p class="text-sm uppercase tracking-[0.22em] text-[var(--qm-accent)]" data-qm="${slug}-eyebrow">${title}</p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight md:text-7xl" data-qm="${slug}-title">${title} for ${brand}.</h1>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 md:p-8">
        <p class="text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="${slug}-copy">A focused page shaped for this site, ready for QAY editing and AI personalization.</p>
      </div>
    </section>`;
}

function appendMissingRegularPages(html: string, pages: unknown, capabilities: GenerationCapabilities, decision: ReturnType<typeof detectTemplateChoice>) {
  const required = new Map<string, string>();
  for (const page of normalizeTemplatePages(pages) as Array<{ slug?: unknown; name?: unknown }>) {
    const slug = typeof page.slug === 'string' ? page.slug.replace(/^\/+/, '').toLowerCase() : '';
    const name = typeof page.name === 'string' ? page.name : titleFromSlug(slug);
    if (slug && slug !== '/') required.set(slug, name);
  }
  if (capabilities.auth) {
    required.delete('login');
    required.delete('signup');
  }

  let next = html;
  for (const [slug, name] of required.entries()) {
    if (!htmlHasPageSlug(next, slug)) {
      next = `${next.trim()}\n${pageShell(slug, name, builtPageBody(slug, name, decision), decision)}`;
    }
  }
  return next;
}

function extendTemplateHtml(html: string, pages: unknown, capabilities: GenerationCapabilities, decision: ReturnType<typeof detectTemplateChoice>) {
  let next = appendMissingRegularPages(html, pages, capabilities, decision);
  if (capabilities.auth && !templateHasAuthHooks(next)) {
    next = `${next.trim()}\n${authPagesHtml(decision)}`;
  }
  return next;
}

function appendMissingCapabilityPageList(pages: unknown, capabilities: GenerationCapabilities, html: string) {
  const next = [...normalizeTemplatePages(pages)];
  const slugs = pageSlugSet(next);
  if (capabilities.auth && templateHasAuthHooks(html)) {
    if (!slugs.has('login')) next.push({ name: 'Login', slug: 'login' });
    if (!slugs.has('signup')) next.push({ name: 'Sign up', slug: 'signup' });
  }
  return next;
}

async function generateFromAiTemplate(prompt: string, variation?: number, capabilities?: GenerationCapabilities) {
  const decision = detectTemplateChoice(prompt, variation);
  const requestedCapabilities = capabilities || detectGenerationCapabilities(prompt);
  const admin = getQayAdmin() as any;
  const { data, error } = await admin
    .from('qay_ai_templates')
    .select('id, site_type, theme, label, html, pages, rank, industry, color_mood, tags, features, zones, pages_meta, cms_hints')
    .eq('is_active', true)
    .eq('is_approved', true)
    .or(`site_type.eq.${decision.siteType},industry.eq.${decision.siteType}`)
    .order('rank', { ascending: false })
    .limit(12);

  if (error) {
    console.warn('[QAY AI generate] Template lookup failed, falling back:', error.message || error);
    return null;
  }

  const templates = Array.isArray(data) ? data : [];
  const selected = selectBestAiTemplate(templates, prompt, requestedCapabilities, decision);
  const template = selected?.template;

  if (!template?.html) return null;

  if (requestedCapabilities.commerce && !templateHasCommerce(String(template.html))) {
    return null;
  }

  // Build TemplateMeta from stored metadata columns
  const templateMeta: TemplateMeta | undefined = template.features ? {
    industry: template.industry || decision.siteType,
    colorMood: template.color_mood || 'light-minimal',
    tags: template.tags || [],
    features: {
      hasCms: !!template.features.hasCms,
      hasCommerce: !!template.features.hasCommerce,
      hasAuth: !!template.features.hasAuth,
      hasMultiPage: !!template.features.hasMultiPage,
      pageCount: template.features.pageCount || 1,
    },
    zones: template.zones || {},
    pagesMeta: template.pages_meta || [],
    cmsHints: template.cms_hints as TemplateMeta['cmsHints'] || undefined,
  } : undefined;

  const modifiedHtml = await cloneAndPersonalize(String(template.html), prompt, decision, templateMeta);
  const html = extendTemplateHtml(modifiedHtml, template.pages, requestedCapabilities, decision);
  const pages = appendMissingCapabilityPageList(template.pages, requestedCapabilities, html);
  return {
    html,
    pages,
    siteType: decision.siteType,
    theme: decision.theme,
    templateId: template.id,
    templateLabel: template.label,
    templateScore: selected?.score || 0,
    provider: 'template-clone',
    model: 'qay-template-clone-engine',
  };
}

export async function POST(request: Request) {
  try {
    await getQayAuthUser();

    const body = (await request.json()) as GenerateRequestBody;
    const rawPrompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const prompt = enhancePromptForQay(buildQayPromptFromTemplate(body.promptTemplateId || '', rawPrompt));
    const capabilities = detectGenerationCapabilities(prompt);

    if (rawPrompt.length < 4 && !body.promptTemplateId) {
      return NextResponse.json({ error: 'Describe the design you want.' }, { status: 400 });
    }

    const mode = body.mode === 'selected' ? 'selected' : 'page';
    const selectedLayers = Array.isArray(body.selectedLayers) ? body.selectedLayers : [];
    const hexMatches = prompt.match(/#[0-9a-fA-F]{6}/g) || [];
    const paletteChoice = pickPalette(prompt, hexMatches.length
      ? { primary: hexMatches[0], accent: hexMatches[1], bg: hexMatches[2] }
      : undefined);
    const enhancedPrompt = buildPalettePrompt(prompt, paletteChoice);

    if (mode === 'selected' && selectedLayers.length === 0) {
      return NextResponse.json({ error: 'Select a layer before asking AI to redesign it.' }, { status: 400 });
    }

    if (body.output === 'html' && mode === 'page') {
      try {
        const templateResult = await generateFromAiTemplate(prompt, body.variation, capabilities);
        if (templateResult) {
          const sanitized = sanitizeGeneratedHtmlPages(templateResult.html, prompt, templateResult.siteType);
          const html = enforcePaletteOnHtml(sanitized, paletteChoice);
          const pages = sanitizeGeneratedPageList(templateResult.pages, prompt, templateResult.siteType);
          console.log('[QAY AI generate] Generated template-modifier HTML:', html);
          return NextResponse.json({
            data: {
              ...templateResult,
              html,
              pages,
              palette: paletteChoice.paletteKey,
              capabilities,
            },
          });
        }
      } catch (templateError) {
        console.warn('[QAY AI generate] Template modifier unavailable, falling back:', templateError);
      }
    }

    const result = body.output === 'html'
      ? await generateQayAiHtml({ prompt: enhancedPrompt, mode, selectedLayers })
      : await generateQayAiLayers({ prompt, mode, selectedLayers });

    if (body.output === 'html' && 'html' in result) {
      result.html = enforcePaletteOnHtml(sanitizeGeneratedHtmlPages(result.html, prompt), paletteChoice);
      (result as typeof result & { palette?: string }).palette = paletteChoice.paletteKey;
      (result as typeof result & { capabilities?: ReturnType<typeof detectGenerationCapabilities> }).capabilities = capabilities;
      console.log('[QAY AI generate] Generated HTML:', result.html);
    } else if ('layers' in result) {
      (result as typeof result & { capabilities?: ReturnType<typeof detectGenerationCapabilities> }).capabilities = capabilities;
      console.log('[QAY AI generate] Generated layer JSON:', JSON.stringify(result.layers, null, 2));
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not generate this design.';
    const isProviderLimits = error instanceof AiProviderLimitsError;
    const isProviderFailure = error instanceof AiProviderFailureError;
    const isQualityError = isAiQualityError(message);
    const status = message.includes('No AI provider is configured') || isProviderLimits || isProviderFailure
      ? 503
      : isQualityError
        ? 422
        : 500;
    const isDev = process.env.NODE_ENV !== 'production';

    if (isProviderLimits || isProviderFailure) {
      console.error('[QAY AI generate] AI provider failures:', error.failures);
    } else {
      console.error('[QAY AI generate] Error:', error);
    }

    return NextResponse.json(
      {
        error: message.includes('No AI provider is configured')
          ? 'AI is not configured yet. Add at least one AI provider key to use this.'
          : isProviderLimits
            ? 'All AI providers are out of usable quota or rate limited. Add credits, wait for limits to reset, or add another provider key.'
            : isProviderFailure
              ? 'All configured AI providers failed. Check the browser console or server logs for provider details.'
              : isQualityError
                ? message
                : 'AI is busy. Try again shortly.',
        ...(isProviderLimits || isProviderFailure ? {
          code: isProviderLimits ? 'AI_PROVIDER_LIMITS_REACHED' : 'AI_PROVIDERS_FAILED',
          providers: error.failures.map((failure) => ({
            provider: failure.provider,
            message: failure.message,
          })),
        } : {}),
        ...(isDev ? { details: message } : {}),
      },
      { status }
    );
  }
}
