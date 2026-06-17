import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'blog-theme-editorial',
    site_type: 'blog',
    theme_id: 'editorial',
    label: 'Editorial',
    keywords: ['editorial', 'magazine', 'clean', 'modern', 'publication', 'blog', 'minimal', 'bold', 'typography'],
    css_variables: {
      '--qm-bg': '#fafaf8',
      '--qm-surface': '#ffffff',
      '--qm-text': '#1a1a1a',
      '--qm-text-muted': '#666666',
      '--qm-accent': '#e63946',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(0,0,0,0.08)',
      '--qm-heading-font': '"Playfair Display", serif',
      '--qm-body-font': '"Inter", sans-serif',
    },
    google_fonts: ['Playfair+Display:wght@400;500;600;700;800;900', 'Inter:wght@400;500;600;700'],
    is_dark: false,
    rank: 94,
  },
];

export const sections: QmSection[] = [
  /* ── NAV ── */
  {
    id: 'blog-nav-editorial',
    site_type: 'blog',
    section_type: 'nav',
    theme_id: 'editorial',
    keywords: ['editorial', 'navigation', 'magazine', 'subscribe', 'minimal'],
    preview_description: 'Clean editorial navigation with bold brand, category links, and subscribe CTA.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur-md" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-2xl font-black tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">The Daily Scroll</a>
    <div class="hidden items-center gap-7 text-sm font-medium md:flex" style="font-family:var(--qm-body-font)">
      <a href="/culture" class="transition hover:text-[var(--qm-accent)]">Culture</a>
      <a href="/tech" class="transition hover:text-[var(--qm-accent)]">Tech</a>
      <a href="/lifestyle" class="transition hover:text-[var(--qm-accent)]">Lifestyle</a>
      <a href="/opinion" class="transition hover:text-[var(--qm-accent)]">Opinion</a>
      <a href="/subscribe" class="bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">Subscribe</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center border border-[var(--qm-border)] text-xs font-semibold md:hidden" data-qay-click="toggle" data-qay-target="#blog-mobile-menu" data-qay-class="hidden" aria-controls="blog-mobile-menu" aria-expanded="false">Menu</button>
  </div>
  <div id="blog-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/culture" class="py-2 font-medium">Culture</a><a href="/tech" class="py-2 font-medium">Tech</a><a href="/lifestyle" class="py-2 font-medium">Lifestyle</a><a href="/opinion" class="py-2 font-medium">Opinion</a>
    <a href="/subscribe" class="mt-2 bg-[var(--qm-accent)] px-5 py-3 text-center font-semibold text-[var(--qm-accent-text)]">Subscribe</a>
  </div>
</nav>`,
  },

  /* ── HERO ── */
  {
    id: 'blog-hero-editorial',
    site_type: 'blog',
    section_type: 'hero',
    theme_id: 'editorial',
    keywords: ['editorial', 'hero', 'featured', 'magazine', 'bold', 'bento', 'articles'],
    preview_description: 'Bold editorial hero with featured article bento grid, dramatic typography, and category tags.',
    rank: 96,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)] md:py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Featured Story</p>
      <h1 class="mt-5 max-w-4xl text-5xl font-black leading-[1.0] md:text-8xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">Stories that shape how we think, live, and create.</h1>
      <p class="mt-6 max-w-2xl text-xl leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">Independent journalism. Bold perspectives. Curated for the curious mind.</p>
    </div>
    <div class="grid gap-5 md:grid-cols-3 md:grid-rows-2" data-qay-animate="stagger-children">
      <article class="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&auto=format&q=85" alt="Journalist at work in modern newsroom" class="h-full min-h-[480px] w-full object-cover" data-qm="featured-image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <span class="inline-block bg-[var(--qm-accent)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)]" data-qm="featured-category">Culture</span>
          <h2 class="mt-4 max-w-lg text-3xl font-bold leading-tight text-white md:text-4xl" style="font-family:var(--qm-heading-font)" data-qm="featured-title">The Renaissance of Independent Publishing in the Digital Age</h2>
          <p class="mt-3 max-w-md text-sm leading-relaxed text-white/70" data-qm="featured-excerpt">How a new generation of writers is reclaiming storytelling from algorithms and building audiences that care.</p>
          <div class="mt-4 flex items-center gap-3 text-xs text-white/50">
            <span data-qm="featured-author">By Elena Vasquez</span>
            <span>&bull;</span>
            <span data-qm="featured-date">Dec 15, 2025</span>
            <span>&bull;</span>
            <span>8 min read</span>
          </div>
        </div>
      </article>
      <article class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="luxe-lift">
        <div class="h-40 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&q=85" alt="Writing desk with notebook and coffee" class="h-full w-full object-cover" data-qm="article-2-image" /></div>
        <div class="p-5">
          <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="article-2-category">Lifestyle</span>
          <h3 class="mt-2 text-lg font-bold leading-snug" style="font-family:var(--qm-heading-font)" data-qm="article-2-title">Morning Routines of the World&rsquo;s Most Creative Minds</h3>
          <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="article-2-date">5 min read</p>
        </div>
      </article>
      <article class="group overflow-hidden rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]" data-qay-hover="luxe-lift">
        <div class="h-40 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&q=85" alt="Tech workspace with multiple screens" class="h-full w-full object-cover" data-qm="article-3-image" /></div>
        <div class="p-5">
          <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]" data-qm="article-3-category">Technology</span>
          <h3 class="mt-2 text-lg font-bold leading-snug" style="font-family:var(--qm-heading-font)" data-qm="article-3-title">Why Open-Source Is Winning the Future of Software</h3>
          <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="article-3-date">7 min read</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ── FEATURES ── */
  {
    id: 'blog-features-editorial',
    site_type: 'blog',
    section_type: 'features',
    theme_id: 'editorial',
    keywords: ['features', 'categories', 'topics', 'editorial', 'sections', 'bento'],
    preview_description: 'Editorial feature highlights with topic categories, reader stats, and a bento-style card layout.',
    rank: 93,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="features-eyebrow">What We Cover</p>
        <h2 class="mt-4 max-w-xl text-4xl font-black md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="features-title">Sections Worth Your Scroll</h2>
      </div>
      <p class="max-w-md text-lg text-[var(--qm-text-muted)]" data-qm="features-subtitle">Deep dives into the topics that matter &mdash; from tech and culture to the ideas reshaping our world.</p>
    </div>
    <div class="grid gap-5 md:grid-cols-3">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 md:row-span-2" data-qay-hover="luxe-lift">
        <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-3xl">&#128218;</div>
        <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-1-name">Long Reads</h3>
        <p class="mt-4 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="feature-1-desc">In-depth investigative pieces and thoughtful essays that go beyond the headline. Stories researched for weeks, written for impact.</p>
        <div class="mt-8 border-t border-[var(--qm-border)] pt-6">
          <p class="text-3xl font-black text-[var(--qm-accent)]">240+</p>
          <p class="mt-1 text-sm text-[var(--qm-text-muted)]">Published stories</p>
        </div>
        <a href="/long-reads" class="mt-6 inline-flex text-sm font-semibold text-[var(--qm-accent)] transition hover:underline">Explore Long Reads &rarr;</a>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#127760;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-2-name">Culture &amp; Society</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="feature-2-desc">Art, music, film, and the movements shaping how we see the world. Fresh perspectives on modern culture.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128187;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-3-name">Tech &amp; Innovation</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="feature-3-desc">The startups, tools, and breakthroughs changing industries. Written for curious minds, not just developers.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#128173;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-4-name">Opinion &amp; Analysis</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="feature-4-desc">Sharp takes from our columnists on politics, economics, and everything in between. Thoughtful, never clickbait.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)]/10 text-2xl">&#127793;</div>
        <h3 class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="feature-5-name">Lifestyle &amp; Wellness</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="feature-5-desc">Guides to living well &mdash; productivity, health, travel, and the small rituals that make life richer.</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── TESTIMONIALS ── */
  {
    id: 'blog-testimonials-editorial',
    site_type: 'blog',
    section_type: 'testimonials',
    theme_id: 'editorial',
    keywords: ['testimonials', 'readers', 'reviews', 'trust', 'subscribers'],
    preview_description: 'Reader testimonials with bold serif quotes, subscriber avatars, and editorial styling.',
    rank: 91,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center" data-qay-animate="luxe-reveal">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Reader Voices</p>
      <h2 class="mt-4 text-4xl font-black md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="testimonials-title">Trusted by 50,000+ Readers</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-5 text-4xl text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">&ldquo;</div>
        <blockquote class="text-lg leading-relaxed" data-qm="testimonial-1-quote">The Daily Scroll is the first thing I read every morning. Their long-form pieces are genuinely some of the best journalism I&rsquo;ve found online.</blockquote>
        <div class="mt-6 flex items-center gap-4 border-t border-[var(--qm-border)] pt-6">
          <div class="h-11 w-11 overflow-hidden rounded-full bg-[var(--qm-accent)]/10"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&q=85" alt="Reader avatar" class="h-full w-full object-cover" /></div>
          <div>
            <p class="font-semibold" data-qm="testimonial-1-name">Marcus Chen</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="testimonial-1-info">Product Designer, San Francisco</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-5 text-4xl text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">&ldquo;</div>
        <blockquote class="text-lg leading-relaxed" data-qm="testimonial-2-quote">Finally, a publication that respects my time. No clickbait, no filler &mdash; just thoughtful writing that actually makes me think differently about the world.</blockquote>
        <div class="mt-6 flex items-center gap-4 border-t border-[var(--qm-border)] pt-6">
          <div class="h-11 w-11 overflow-hidden rounded-full bg-[var(--qm-accent)]/10"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&q=85" alt="Reader avatar" class="h-full w-full object-cover" /></div>
          <div>
            <p class="font-semibold" data-qm="testimonial-2-name">Aisha Johnson</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="testimonial-2-info">Journalist, London</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 md:col-span-2 lg:col-span-1" data-qay-hover="luxe-lift">
        <div class="mb-5 text-4xl text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">&ldquo;</div>
        <blockquote class="text-lg leading-relaxed" data-qm="testimonial-3-quote">I&rsquo;ve shared more articles from The Daily Scroll than any other publication. The culture section alone is worth the subscription.</blockquote>
        <div class="mt-6 flex items-center gap-4 border-t border-[var(--qm-border)] pt-6">
          <div class="h-11 w-11 overflow-hidden rounded-full bg-[var(--qm-accent)]/10"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&q=85" alt="Reader avatar" class="h-full w-full object-cover" /></div>
          <div>
            <p class="font-semibold" data-qm="testimonial-3-name">David Okonkwo</p>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="testimonial-3-info">Startup Founder, Lagos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── CTA ── */
  {
    id: 'blog-cta-editorial',
    site_type: 'blog',
    section_type: 'cta',
    theme_id: 'editorial',
    keywords: ['cta', 'subscribe', 'newsletter', 'action', 'email'],
    preview_description: 'Bold newsletter subscription CTA with dramatic serif headline, email input, and reader count social proof.',
    rank: 94,
    html: `<section class="relative overflow-hidden bg-[var(--qm-text)] px-5 py-28 text-[var(--qm-bg)]">
  <div class="absolute inset-0 opacity-10" style="background:radial-gradient(circle at 70% 30%, var(--qm-accent), transparent 50%)"></div>
  <div class="relative mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal">
    <p class="text-sm font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="cta-eyebrow">Stay Informed</p>
    <h2 class="mt-6 text-4xl font-black leading-tight md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="cta-title">Great writing, delivered. No noise.</h2>
    <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--qm-bg)]/70" data-qm="cta-subtitle">Join 50,000+ readers who get our best stories every week. Thoughtful journalism, straight to your inbox.</p>
    <div class="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
      <input type="email" placeholder="your@email.com" class="flex-1 border border-[var(--qm-bg)]/20 bg-[var(--qm-bg)]/10 px-6 py-4 text-[var(--qm-bg)] placeholder:text-[var(--qm-bg)]/40 focus:border-[var(--qm-accent)] focus:outline-none" />
      <a href="/subscribe" class="bg-[var(--qm-accent)] px-8 py-4 font-bold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale" data-qm="cta-button">Subscribe Free</a>
    </div>
    <p class="mt-6 text-sm text-[var(--qm-bg)]/50" data-qm="cta-note">Free forever &bull; Unsubscribe anytime &bull; No spam, ever</p>
    <div class="mx-auto mt-10 flex items-center justify-center gap-1">
      <div class="flex -space-x-2">
        <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--qm-text)]"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&q=85" alt="" class="h-full w-full object-cover" /></div>
        <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--qm-text)]"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&q=85" alt="" class="h-full w-full object-cover" /></div>
        <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--qm-text)]"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&q=85" alt="" class="h-full w-full object-cover" /></div>
        <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--qm-text)]"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&q=85" alt="" class="h-full w-full object-cover" /></div>
      </div>
      <p class="ml-3 text-sm text-[var(--qm-bg)]/60">Joined by 50k+ readers this year</p>
    </div>
  </div>
</section>`,
  },

  /* ── FOOTER ── */
  {
    id: 'blog-footer-editorial',
    site_type: 'blog',
    section_type: 'footer',
    theme_id: 'editorial',
    keywords: ['footer', 'links', 'blog', 'publication', 'editorial'],
    preview_description: 'Clean editorial footer with publication branding, category links, and social proof.',
    rank: 90,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-4">
      <div class="md:col-span-2">
        <a href="/" class="text-3xl font-black" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">The Daily Scroll</a>
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="footer-tagline">Independent digital publication covering culture, technology, and ideas that shape the modern world. Thoughtful journalism for curious minds.</p>
        <div class="mt-6 flex gap-4">
          <a href="/twitter" class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">X</a>
          <a href="/instagram" class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">IG</a>
          <a href="/linkedin" class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">LI</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Sections</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/culture" class="transition hover:text-[var(--qm-text)]">Culture &amp; Society</a>
          <a href="/tech" class="transition hover:text-[var(--qm-text)]">Tech &amp; Innovation</a>
          <a href="/lifestyle" class="transition hover:text-[var(--qm-text)]">Lifestyle</a>
          <a href="/opinion" class="transition hover:text-[var(--qm-text)]">Opinion</a>
          <a href="/long-reads" class="transition hover:text-[var(--qm-text)]">Long Reads</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Company</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/about" class="transition hover:text-[var(--qm-text)]">About Us</a>
          <a href="/write" class="transition hover:text-[var(--qm-text)]">Write for Us</a>
          <a href="/advertise" class="transition hover:text-[var(--qm-text)]">Advertise</a>
          <a href="/contact" class="transition hover:text-[var(--qm-text)]">Contact</a>
          <a href="/subscribe" class="transition hover:text-[var(--qm-text)]">Subscribe</a>
        </div>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-sm text-[var(--qm-text-muted)] md:flex-row">
      <p data-qm="footer-copyright">&copy; 2025 The Daily Scroll. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="/privacy" class="transition hover:text-[var(--qm-text)]">Privacy Policy</a>
        <a href="/terms" class="transition hover:text-[var(--qm-text)]">Terms of Use</a>
        <a href="/rss" class="transition hover:text-[var(--qm-text)]">RSS Feed</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
