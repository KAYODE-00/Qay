import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'nonprofit-theme-bridges',
    site_type: 'nonprofit',
    theme_id: 'bridges',
    label: 'Bridges Foundation',
    keywords: ['nonprofit', 'charity', 'foundation', 'ngo', 'donate', 'cause', 'community', 'volunteer', 'mission', 'earthy', 'green'],
    css_variables: {
      '--qm-bg': '#f8f7f2',
      '--qm-surface': '#ffffff',
      '--qm-text': '#1a1c14',
      '--qm-text-muted': '#6a6e58',
      '--qm-accent': '#16a34a',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(26,28,20,0.10)',
      '--qm-heading-font': '"Outfit", sans-serif',
      '--qm-body-font': '"DM Sans", sans-serif',
    },
    google_fonts: ['Outfit:wght@400;500;600;700;800', 'DM+Sans:wght@400;500;600;700'],
    is_dark: false,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ─────────── NAV ─────────── */
  {
    id: 'nonprofit-nav-luxe',
    site_type: 'nonprofit',
    section_type: 'nav',
    theme_id: 'bridges',
    keywords: ['nav', 'nonprofit', 'charity', 'header', 'navigation', 'donate'],
    preview_description: 'Warm nonprofit navigation with donate CTA and clean layout.',
    rank: 94,
    html: `<nav class="sticky top-0 z-50 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/80 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5 hover:opacity-85 transition" data-qm="brand-name">
      <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--qm-accent)] text-sm font-bold text-[var(--qm-accent-text)]">B</span>
      <span class="text-lg font-bold tracking-tight" style="font-family:var(--qm-heading-font)">Bridges Foundation</span>
    </a>
    <div class="hidden items-center gap-8 text-[13px] font-medium md:flex" style="font-family:var(--qm-body-font)">
      <a href="/about" class="hover:text-[var(--qm-accent)] transition">Our Mission</a>
      <a href="/programs" class="hover:text-[var(--qm-accent)] transition">Programs</a>
      <a href="/team" class="hover:text-[var(--qm-accent)] transition">Team</a>
      <a href="/contact" class="hover:text-[var(--qm-accent)] transition">Contact</a>
      <a href="/donate" class="rounded-xl bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--qm-accent-text)] shadow-md hover:shadow-lg hover:scale-105 active:scale-[0.98] transition duration-200">Donate Now &#x2764;&#xFE0F;</a>
    </div>
    <button type="button" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2 text-sm font-semibold md:hidden" data-qay-click="toggle" data-qay-target="#nonprofit-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="nonprofit-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-3 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/about" class="text-sm font-medium py-1">Our Mission</a>
    <a href="/programs" class="text-sm font-medium py-1">Programs</a>
    <a href="/team" class="text-sm font-medium py-1">Team</a>
    <a href="/contact" class="text-sm font-medium py-1">Contact</a>
    <a href="/donate" class="mt-2 rounded-xl bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--qm-accent-text)]">Donate Now</a>
  </div>
</nav>`,
  },

  /* ─────────── HERO ─────────── */
  {
    id: 'nonprofit-hero-luxe',
    site_type: 'nonprofit',
    section_type: 'hero',
    theme_id: 'bridges',
    keywords: ['hero', 'nonprofit', 'charity', 'community', 'impact', 'donate', 'luxe-reveal'],
    preview_description: 'Warm hero section with community imagery, impact tagline, and Bento stat cards with earthy tones.',
    rank: 96,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 lg:py-28 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div class="space-y-7" data-qay-animate="luxe-reveal" data-qay-duration="1.1">
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-accent)]">
        <span class="h-1.5 w-1.5 rounded-full bg-[var(--qm-accent)] animate-pulse"></span>
        Building Stronger Communities
      </div>
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        Small Acts,<br/><span class="text-[var(--qm-accent)]">Big Impact</span>.
      </h1>
      <p class="max-w-lg text-base leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">
        Bridges Foundation empowers underserved communities through education, healthcare access, and sustainable development programs. Together, we build futures.
      </p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a href="/donate" class="rounded-xl bg-[var(--qm-accent)] px-7 py-3.5 text-sm font-bold text-[var(--qm-accent-text)] shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition duration-200">Donate Now &rarr;</a>
        <a href="/about" class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-7 py-3.5 text-sm font-semibold hover:bg-[var(--qm-bg)] transition duration-200">Our Story</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] col-span-2 aspect-[16/10]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&q=85" alt="Community volunteers working together in a sunny garden" class="h-full w-full object-cover" />
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">50k+</p>
        <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Lives Impacted</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-5 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">12</p>
        <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--qm-text-muted)]">Active Programs</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── ABOUT ─────────── */
  {
    id: 'nonprofit-about-luxe',
    site_type: 'nonprofit',
    section_type: 'about',
    theme_id: 'bridges',
    keywords: ['about', 'nonprofit', 'mission', 'story', 'values', 'purpose'],
    preview_description: 'Mission-driven about section with asymmetric image-text layout and value pillars.',
    rank: 88,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
    <div class="space-y-6" data-qay-animate="slide-right">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Our Mission</p>
      <h2 class="text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight" style="font-family:var(--qm-heading-font)">
        Building Bridges,<br/>Not Walls.
      </h2>
      <p class="text-sm md:text-base text-[var(--qm-text-muted)] leading-relaxed max-w-lg" data-qm="about-copy" style="font-family:var(--qm-body-font)">
        Founded in 2015, Bridges Foundation began as a grassroots initiative to provide educational resources to rural communities. Today, we operate across 8 countries, running programs in education, clean water access, maternal healthcare, and youth empowerment. Every dollar donated goes directly toward community impact.
      </p>
      <div class="grid gap-3 sm:grid-cols-3 pt-4" data-qay-animate="stagger-children">
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2" data-qay-hover="scale">
          <p class="text-lg">&#x1F393;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Education</h4>
          <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Schools, scholarships, and literacy programs for underserved youth.</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2" data-qay-hover="scale">
          <p class="text-lg">&#x1F4A7;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Clean Water</h4>
          <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Well construction and water purification in communities without access.</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-5 space-y-2" data-qay-hover="scale">
          <p class="text-lg">&#x1F3E5;</p>
          <h4 class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Healthcare</h4>
          <p class="text-[11px] text-[var(--qm-text-muted)] leading-relaxed">Mobile clinics, maternal care, and health education outreach.</p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3" data-qay-animate="slide-up">
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-[3/4]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&q=85" alt="Children in a classroom smiling and learning" class="h-full w-full object-cover" />
      </div>
      <div class="overflow-hidden rounded-2xl border border-[var(--qm-border)] aspect-[3/4] mt-8" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&q=85" alt="Volunteers distributing supplies in a community" class="h-full w-full object-cover" />
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── STATS ─────────── */
  {
    id: 'nonprofit-stats-luxe',
    site_type: 'nonprofit',
    section_type: 'stats',
    theme_id: 'bridges',
    keywords: ['stats', 'impact', 'nonprofit', 'metrics', 'numbers', 'community'],
    preview_description: 'Community impact metrics with large numbers and descriptive context cards.',
    rank: 86,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-y border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="text-center max-w-2xl mx-auto space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Our Impact</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Numbers That Matter</h2>
      <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed" style="font-family:var(--qm-body-font)">Every metric represents real people, real communities, and real change. Here is what we have accomplished together.</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">50k+</p>
        <h3 class="text-sm font-bold">Lives Impacted</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Across 8 countries through education, health, and development programs.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">120+</p>
        <h3 class="text-sm font-bold">Schools Built</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Community schools and learning centers constructed in rural areas.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">340</p>
        <h3 class="text-sm font-bold">Water Wells</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Clean water sources installed, serving over 200,000 people daily.</p>
      </div>
      <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-7 space-y-2" data-qay-hover="scale">
        <p class="text-5xl font-extrabold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">3k+</p>
        <h3 class="text-sm font-bold">Volunteers</h3>
        <p class="text-xs text-[var(--qm-text-muted)] leading-relaxed">Active volunteers and community advocates driving change on the ground.</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ─────────── TEAM ─────────── */
  {
    id: 'nonprofit-team-bento',
    site_type: 'nonprofit',
    section_type: 'team',
    theme_id: 'bridges',
    keywords: ['team', 'nonprofit', 'leadership', 'staff', 'volunteers', 'portraits'],
    preview_description: 'Leadership team grid with warm portraits, role titles, and rounded card design.',
    rank: 85,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="text-center max-w-2xl mx-auto space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Our People</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Meet the Team Behind the Mission</h2>
      <p class="text-sm text-[var(--qm-text-muted)] leading-relaxed" style="font-family:var(--qm-body-font)">Dedicated leaders and changemakers working to build a more equitable world.</p>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-qay-animate="stagger-children">
      <!-- Member 1 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&q=85" alt="Amina Diallo portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">Amina Diallo</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Executive Director</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">Leading impact strategy since 2015</p>
        </div>
      </article>

      <!-- Member 2 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&q=85" alt="David Mensah portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">David Mensah</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Head of Programs</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">12 years in community development</p>
        </div>
      </article>

      <!-- Member 3 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&q=85" alt="Sarah Okonkwo portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">Sarah Okonkwo</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Director of Outreach</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">Connecting communities globally</p>
        </div>
      </article>

      <!-- Member 4 -->
      <article class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="overflow-hidden aspect-[3/4]" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&q=85" alt="James Nakamura portrait" class="h-full w-full object-cover" />
        </div>
        <div class="p-5 space-y-1">
          <h3 class="text-base font-bold" style="font-family:var(--qm-heading-font)">James Nakamura</h3>
          <p class="text-xs text-[var(--qm-accent)] font-semibold">Finance &amp; Transparency</p>
          <p class="text-[11px] text-[var(--qm-text-muted)]">Ensuring every dollar counts</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ─────────── TESTIMONIALS ─────────── */
  {
    id: 'nonprofit-testimonials-luxe',
    site_type: 'nonprofit',
    section_type: 'testimonials',
    theme_id: 'bridges',
    keywords: ['testimonials', 'stories', 'nonprofit', 'impact', 'donor', 'community'],
    preview_description: 'Community impact stories with donor and beneficiary testimonials in warm card layouts.',
    rank: 84,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-14">
    <div class="text-center max-w-2xl mx-auto space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[var(--qm-accent)]">Impact Stories</p>
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight" style="font-family:var(--qm-heading-font)">Voices From the Ground</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Beneficiary Story -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between md:col-span-2" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="inline-block rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-accent)]">Beneficiary Story</span>
          <p class="text-base md:text-lg leading-relaxed text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">"Because of Bridges Foundation, I was able to complete my education and become the first doctor in my village. The scholarship changed not just my life &mdash; it changed the future of my entire community."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-[var(--qm-border)]">
          <div class="h-10 w-10 rounded-full bg-[var(--qm-accent)]/10 flex items-center justify-center text-sm font-bold text-[var(--qm-accent)]">FK</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Fatima Keita</p>
            <p class="text-[11px] text-[var(--qm-text-muted)]">Scholarship Recipient &bull; Class of 2023</p>
          </div>
        </div>
      </article>

      <!-- Donor Quote -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-accent)] p-8 space-y-5 text-[var(--qm-accent-text)] flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Donor</span>
          <p class="text-sm leading-relaxed opacity-90">"The transparency at Bridges is remarkable. I know exactly where my money goes and can see the impact in real-time through their reports."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-white/20">
          <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">RP</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Rachel Park</p>
            <p class="text-[11px] opacity-75">Monthly Donor since 2020</p>
          </div>
        </div>
      </article>

      <!-- Volunteer Quote -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="inline-block rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-accent)]">Volunteer</span>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"Volunteering with Bridges in Ghana was life-changing. Seeing children light up in classrooms we helped build &mdash; there is nothing like it."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-[var(--qm-border)]">
          <div class="h-10 w-10 rounded-full bg-[var(--qm-accent)]/10 flex items-center justify-center text-sm font-bold text-[var(--qm-accent)]">MC</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">Marcus Chen</p>
            <p class="text-[11px] text-[var(--qm-text-muted)]">Volunteer &bull; Ghana 2024</p>
          </div>
        </div>
      </article>

      <!-- Partner Quote -->
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8 space-y-5 flex flex-col justify-between md:col-span-2" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="inline-block rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--qm-accent)]">Partner Organization</span>
          <p class="text-sm leading-relaxed text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)">"Bridges Foundation is one of the most effective and trustworthy organizations we partner with. Their community-led approach ensures sustainable, lasting impact in every region they serve."</p>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-[var(--qm-border)]">
          <div class="h-10 w-10 rounded-full bg-[var(--qm-accent)]/10 flex items-center justify-center text-sm font-bold text-[var(--qm-accent)]">UN</div>
          <div>
            <p class="text-sm font-bold" style="font-family:var(--qm-heading-font)">UNICEF West Africa</p>
            <p class="text-[11px] text-[var(--qm-text-muted)]">Strategic Partner &bull; Since 2019</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },

  /* ─────────── CTA ─────────── */
  {
    id: 'nonprofit-cta-luxe',
    site_type: 'nonprofit',
    section_type: 'cta',
    theme_id: 'bridges',
    keywords: ['cta', 'donate', 'nonprofit', 'support', 'volunteer', 'action'],
    preview_description: 'Powerful donation CTA with impact messaging, multiple giving options, and warm accent background.',
    rank: 90,
    html: `<section class="relative bg-[var(--qm-accent)] px-6 py-24 text-[var(--qm-accent-text)] overflow-hidden">
  <!-- Decorative elements -->
  <div class="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3"></div>
  <div class="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3"></div>
  <div class="relative z-10 mx-auto max-w-4xl text-center space-y-8" data-qay-animate="luxe-reveal" data-qay-duration="1.1">
    <p class="text-xs font-bold uppercase tracking-[0.3em] opacity-80">Make a Difference Today</p>
    <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]" style="font-family:var(--qm-heading-font)">
      Your Support<br/>Changes Everything.
    </h2>
    <p class="mx-auto max-w-xl text-sm opacity-85 leading-relaxed" style="font-family:var(--qm-body-font)">
      Every contribution &mdash; no matter the size &mdash; directly funds education, clean water, and healthcare for communities that need it most. 92% of all donations go directly to programs.
    </p>
    <div class="flex flex-wrap justify-center gap-4 pt-4">
      <a href="/donate" class="rounded-xl bg-[var(--qm-text)] px-8 py-4 text-sm font-bold text-[var(--qm-bg)] shadow-xl hover:scale-105 active:scale-[0.98] transition duration-200">Donate Now &rarr;</a>
      <a href="/volunteer" class="rounded-xl border-2 border-white/30 px-8 py-4 text-sm font-bold hover:bg-white/10 transition duration-200">Become a Volunteer</a>
    </div>
    <div class="flex flex-wrap justify-center gap-6 pt-4 text-[11px] font-semibold uppercase tracking-wider opacity-70">
      <span>&#x2713; Tax Deductible</span>
      <span>&#x2713; 100% Transparent</span>
      <span>&#x2713; 92% to Programs</span>
    </div>
  </div>
</section>`,
  },

  /* ─────────── FOOTER ─────────── */
  {
    id: 'nonprofit-footer-luxe',
    site_type: 'nonprofit',
    section_type: 'footer',
    theme_id: 'bridges',
    keywords: ['footer', 'nonprofit', 'charity', 'links', 'contact', 'donate'],
    preview_description: 'Multi-column nonprofit footer with brand, programs, contact, and compliance info.',
    rank: 82,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
    <div class="space-y-5">
      <div class="flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--qm-accent)] text-sm font-bold text-[var(--qm-accent-text)]">B</span>
        <p class="text-xl font-bold text-[var(--qm-text)]" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Bridges Foundation</p>
      </div>
      <p class="max-w-sm text-xs leading-relaxed">Empowering underserved communities through education, healthcare, and sustainable development. Together, we build futures.</p>
      <p class="text-xs text-[var(--qm-accent)] font-semibold">EIN: 47-8832190 &bull; 501(c)(3) Registered</p>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Programs</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/programs" class="hover:text-[var(--qm-text)] transition">Education</a>
        <a href="/programs" class="hover:text-[var(--qm-text)] transition">Clean Water</a>
        <a href="/programs" class="hover:text-[var(--qm-text)] transition">Healthcare</a>
        <a href="/programs" class="hover:text-[var(--qm-text)] transition">Youth Empowerment</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Get Involved</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/donate" class="hover:text-[var(--qm-text)] transition">Donate</a>
        <a href="/volunteer" class="hover:text-[var(--qm-text)] transition">Volunteer</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition">Our Story</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition">Contact Us</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--qm-text)]">Legal</h4>
      <div class="flex flex-col gap-2.5 text-xs">
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Privacy Policy</a>
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Terms of Service</a>
        <a href="/reports" class="hover:text-[var(--qm-text)] transition">Annual Reports</a>
        <a href="/financials" class="hover:text-[var(--qm-text)] transition">Financial Transparency</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
    <p>&copy; 2026 Bridges Foundation. All rights reserved.</p>
    <p>Building bridges across communities &bull; Since 2015</p>
  </div>
</footer>`,
  },
];
