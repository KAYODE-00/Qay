import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'church-theme-warm-gold',
    site_type: 'church',
    theme_id: 'warm-gold',
    label: 'Warm Gold',
    keywords: ['church', 'faith', 'warm', 'welcoming', 'community', 'worship', 'gold', 'inviting', 'congregation'],
    css_variables: {
      '--qm-bg': '#faf8f3',
      '--qm-surface': '#ffffff',
      '--qm-text': '#1a1710',
      '--qm-text-muted': '#7a7260',
      '--qm-accent': '#b8860b',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(26,23,16,0.10)',
      '--qm-heading-font': '"Lora", serif',
      '--qm-body-font': '"Source Sans 3", sans-serif',
    },
    google_fonts: ['Lora:wght@400;500;600;700', 'Source+Sans+3:wght@400;500;600;700'],
    is_dark: false,
    rank: 93,
  },
];

export const sections: QmSection[] = [
  /* ── NAV ── */
  {
    id: 'church-nav-warm',
    site_type: 'church',
    section_type: 'nav',
    theme_id: 'warm-gold',
    keywords: ['church', 'navigation', 'warm', 'welcoming', 'visit'],
    preview_description: 'Warm, welcoming church navigation with visit CTA and community-focused links.',
    rank: 94,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur-md" data-qay-animate="fade-in">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-xl font-bold tracking-wide" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Grace Community</a>
    <div class="hidden items-center gap-7 text-sm font-medium md:flex" style="font-family:var(--qm-body-font)">
      <a href="/about" class="transition hover:text-[var(--qm-accent)]">About</a>
      <a href="/sermons" class="transition hover:text-[var(--qm-accent)]">Sermons</a>
      <a href="/ministries" class="transition hover:text-[var(--qm-accent)]">Ministries</a>
      <a href="/events" class="transition hover:text-[var(--qm-accent)]">Events</a>
      <a href="/give" class="transition hover:text-[var(--qm-accent)]">Give</a>
      <a href="/visit" class="rounded-full bg-[var(--qm-accent)] px-6 py-3 text-sm font-semibold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/20 transition hover:opacity-90" data-qay-hover="scale">Plan Your Visit</a>
    </div>
    <button type="button" class="flex size-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-xs md:hidden" data-qay-click="toggle" data-qay-target="#church-mobile-menu" data-qay-class="hidden" aria-controls="church-mobile-menu" aria-expanded="false">Menu</button>
  </div>
  <div id="church-mobile-menu" class="hidden fixed inset-x-4 top-20 z-50 flex flex-col gap-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/about" class="py-2">About</a><a href="/sermons" class="py-2">Sermons</a><a href="/ministries" class="py-2">Ministries</a><a href="/events" class="py-2">Events</a><a href="/give" class="py-2">Give</a>
    <a href="/visit" class="mt-2 rounded-full bg-[var(--qm-accent)] px-5 py-3 text-center font-semibold text-[var(--qm-accent-text)]">Plan Your Visit</a>
  </div>
</nav>`,
  },

  /* ── HERO ── */
  {
    id: 'church-hero-warm',
    site_type: 'church',
    section_type: 'hero',
    theme_id: 'warm-gold',
    keywords: ['church', 'hero', 'welcome', 'worship', 'community', 'warm', 'inviting'],
    preview_description: 'Welcoming church hero with community gathering image, warm serif headline, and service times highlight.',
    rank: 96,
    html: `<section class="relative min-h-[780px] overflow-hidden bg-[var(--qm-bg)] text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:py-24">
    <div data-qay-animate="slide-right" data-qay-duration="1.0">
      <p class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">&#10013; Welcome Home</p>
      <h1 class="mt-7 text-5xl font-bold leading-[1.08] md:text-7xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">A place where faith, family, and community come together.</h1>
      <p class="mt-7 max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" style="font-family:var(--qm-body-font)" data-qm="hero-subtitle">Join us for worship, fellowship, and a warm welcome every Sunday. No matter where you are in your journey, you belong here.</p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <a href="/visit" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-center font-semibold text-[var(--qm-accent-text)] shadow-lg shadow-[var(--qm-accent)]/25 transition hover:shadow-xl" data-qay-hover="scale" data-qm="hero-cta-primary">Plan Your Visit</a>
        <a href="/sermons" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-center font-semibold text-[var(--qm-text)] transition hover:bg-[var(--qm-surface)]" data-qm="hero-cta-secondary">Watch Sermons</a>
      </div>
      <div class="mt-12 grid grid-cols-3 gap-4" data-qay-animate="fade-in" data-qay-delay="0.5">
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-center">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">Sun 9am</p>
          <p class="mt-1 text-xs text-[var(--qm-text-muted)]">First Service</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-center">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">Sun 11am</p>
          <p class="mt-1 text-xs text-[var(--qm-text-muted)]">Main Service</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-center">
          <p class="text-2xl font-bold text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">Wed 7pm</p>
          <p class="mt-1 text-xs text-[var(--qm-text-muted)]">Bible Study</p>
        </div>
      </div>
    </div>
    <div class="relative" data-qay-animate="slide-left" data-qay-delay="0.3">
      <div class="overflow-hidden rounded-3xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1000&auto=format&q=85" alt="Community gathering in church worship" class="h-[560px] w-full object-cover" data-qm="hero-image" />
      </div>
      <div class="absolute -bottom-5 -left-5 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)]/90 p-5 shadow-xl backdrop-blur" data-qay-animate="slide-up" data-qay-delay="0.7">
        <p class="text-sm font-semibold text-[var(--qm-text)]">&#127908; This Week&rsquo;s Sermon</p>
        <p class="mt-1 text-xs text-[var(--qm-text-muted)]" data-qm="hero-sermon-title">&ldquo;Walking in Grace&rdquo; &mdash; Pastor James</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── ABOUT ── */
  {
    id: 'church-about-warm',
    site_type: 'church',
    section_type: 'about',
    theme_id: 'warm-gold',
    keywords: ['about', 'mission', 'values', 'church', 'community', 'faith'],
    preview_description: 'Church about section with split layout, mission statement, and core values in a warm design.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div data-qay-animate="scroll-reveal">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="about-eyebrow">Our Story</p>
        <h2 class="mt-4 text-4xl font-bold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="about-title">Rooted in Faith, Growing in Love</h2>
        <p class="mt-6 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-description">For over 30 years, Grace Community has been a place of hope, healing, and belonging. We believe that everyone deserves a community where they are known, loved, and encouraged to grow in their faith journey.</p>
        <p class="mt-4 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-description-2">Our doors are open wide &mdash; whether you&rsquo;re exploring faith for the first time or deepening a lifelong relationship with God.</p>
        <a href="/about" class="mt-8 inline-flex rounded-full bg-[var(--qm-accent)] px-7 py-3 font-semibold text-[var(--qm-accent-text)] transition hover:opacity-90" data-qay-hover="scale">Learn More About Us &rarr;</a>
      </div>
      <div class="grid grid-cols-2 gap-5" data-qay-animate="stagger-children">
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center" data-qay-hover="luxe-lift">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-2xl">&#128591;</div>
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="value-1-name">Faith</h3>
          <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="value-1-desc">Grounded in Scripture, guided by the Holy Spirit in all we do.</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center" data-qay-hover="luxe-lift">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-2xl">&#10084;&#65039;</div>
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="value-2-name">Love</h3>
          <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="value-2-desc">Showing God&rsquo;s love through every interaction and act of service.</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center" data-qay-hover="luxe-lift">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-2xl">&#129309;</div>
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="value-3-name">Community</h3>
          <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="value-3-desc">Building authentic relationships and walking through life together.</p>
        </div>
        <div class="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 text-center" data-qay-hover="luxe-lift">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--qm-accent)]/10 text-2xl">&#127758;</div>
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="value-4-name">Service</h3>
          <p class="mt-2 text-sm text-[var(--qm-text-muted)]" data-qm="value-4-desc">Making a tangible difference in our neighborhood and beyond.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── SCHEDULE ── */
  {
    id: 'church-schedule-warm',
    site_type: 'church',
    section_type: 'schedule',
    theme_id: 'warm-gold',
    keywords: ['schedule', 'services', 'events', 'times', 'worship', 'calendar'],
    preview_description: 'Church service schedule with weekly events, service times, and upcoming events in a clean card layout.',
    rank: 93,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="schedule-eyebrow">Join Us</p>
      <h2 class="mt-4 text-4xl font-bold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="schedule-title">Service Times &amp; Events</h2>
      <p class="mx-auto mt-5 max-w-xl text-lg text-[var(--qm-text-muted)]" data-qm="schedule-subtitle">Whether it&rsquo;s Sunday worship, midweek study, or a special event &mdash; there&rsquo;s always something happening at Grace.</p>
    </div>
    <div class="grid gap-6 md:grid-cols-3">
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)] text-2xl text-[var(--qm-accent-text)]">&#9728;&#65039;</div>
        <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="schedule-1-name">Sunday Worship</h3>
        <div class="mt-5 space-y-4">
          <div class="flex items-center justify-between border-b border-[var(--qm-border)] pb-3">
            <div>
              <p class="font-semibold" data-qm="schedule-1a-time">First Service</p>
              <p class="text-sm text-[var(--qm-text-muted)]">Traditional worship with hymns</p>
            </div>
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--qm-accent)]">9:00 AM</span>
          </div>
          <div class="flex items-center justify-between border-b border-[var(--qm-border)] pb-3">
            <div>
              <p class="font-semibold" data-qm="schedule-1b-time">Main Service</p>
              <p class="text-sm text-[var(--qm-text-muted)]">Contemporary worship &amp; teaching</p>
            </div>
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--qm-accent)]">11:00 AM</span>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold" data-qm="schedule-1c-time">Sunday School</p>
              <p class="text-sm text-[var(--qm-text-muted)]">All ages welcome</p>
            </div>
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--qm-accent)]">10:00 AM</span>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)] text-2xl text-[var(--qm-accent-text)]">&#128214;</div>
        <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="schedule-2-name">Midweek Gatherings</h3>
        <div class="mt-5 space-y-4">
          <div class="flex items-center justify-between border-b border-[var(--qm-border)] pb-3">
            <div>
              <p class="font-semibold" data-qm="schedule-2a-time">Bible Study</p>
              <p class="text-sm text-[var(--qm-text-muted)]">Deep dive into Scripture</p>
            </div>
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--qm-accent)]">Wed 7 PM</span>
          </div>
          <div class="flex items-center justify-between border-b border-[var(--qm-border)] pb-3">
            <div>
              <p class="font-semibold" data-qm="schedule-2b-time">Prayer Meeting</p>
              <p class="text-sm text-[var(--qm-text-muted)]">Corporate prayer &amp; intercession</p>
            </div>
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--qm-accent)]">Fri 6 PM</span>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold" data-qm="schedule-2c-time">Youth Night</p>
              <p class="text-sm text-[var(--qm-text-muted)]">Ages 13&ndash;18, worship &amp; games</p>
            </div>
            <span class="rounded-full bg-[var(--qm-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--qm-accent)]">Fri 7 PM</span>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8" data-qay-hover="luxe-lift">
        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qm-accent)] text-2xl text-[var(--qm-accent-text)]">&#127881;</div>
        <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="schedule-3-name">Upcoming Events</h3>
        <div class="mt-5 space-y-4">
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4">
            <p class="text-xs font-semibold uppercase text-[var(--qm-accent)]" data-qm="event-1-date">June 28, 2025</p>
            <p class="mt-1 font-semibold" data-qm="event-1-name">Community Outreach Day</p>
            <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="event-1-desc">Serving our neighbors with food, clothing, and love.</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4">
            <p class="text-xs font-semibold uppercase text-[var(--qm-accent)]" data-qm="event-2-date">July 12, 2025</p>
            <p class="mt-1 font-semibold" data-qm="event-2-name">Summer Family Picnic</p>
            <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="event-2-desc">Food, games, and fellowship for the whole family.</p>
          </div>
          <div class="rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-4">
            <p class="text-xs font-semibold uppercase text-[var(--qm-accent)]" data-qm="event-3-date">Aug 2&ndash;5, 2025</p>
            <p class="mt-1 font-semibold" data-qm="event-3-name">Vacation Bible School</p>
            <p class="mt-1 text-sm text-[var(--qm-text-muted)]" data-qm="event-3-desc">A fun-filled week of learning, crafts, and adventure for kids.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── TEAM ── */
  {
    id: 'church-team-warm',
    site_type: 'church',
    section_type: 'team',
    theme_id: 'warm-gold',
    keywords: ['team', 'pastors', 'leaders', 'staff', 'ministry'],
    preview_description: 'Church leadership team with pastoral photos, roles, and brief bios in a warm card layout.',
    rank: 91,
    html: `<section class="bg-[var(--qm-surface)] px-5 py-24 text-[var(--qm-text)]" data-qay-animate="stagger-children">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Our Leadership</p>
      <h2 class="mt-4 text-4xl font-bold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="team-title">Meet Your Pastors &amp; Leaders</h2>
      <p class="mx-auto mt-5 max-w-xl text-lg text-[var(--qm-text-muted)]" data-qm="team-subtitle">Faithful servants who are passionate about guiding our community in faith, hope, and love.</p>
    </div>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&q=85" alt="Senior pastor portrait" class="h-full w-full object-cover" data-qm="team-1-image" /></div>
        <div class="p-6 text-center">
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-1-name">Pastor James Mitchell</h3>
          <p class="mt-1 text-sm font-semibold text-[var(--qm-accent)]" data-qm="team-1-role">Senior Pastor</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-1-bio">Leading Grace Community for 15 years with a heart for discipleship and community transformation.</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&q=85" alt="Associate pastor portrait" class="h-full w-full object-cover" data-qm="team-2-image" /></div>
        <div class="p-6 text-center">
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-2-name">Pastor Rachel Adeyemi</h3>
          <p class="mt-1 text-sm font-semibold text-[var(--qm-accent)]" data-qm="team-2-role">Associate Pastor</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-2-bio">Passionate about women&rsquo;s ministry, counseling, and building bridges across generations.</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&q=85" alt="Youth pastor portrait" class="h-full w-full object-cover" data-qm="team-3-image" /></div>
        <div class="p-6 text-center">
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-3-name">David Okonkwo</h3>
          <p class="mt-1 text-sm font-semibold text-[var(--qm-accent)]" data-qm="team-3-role">Youth Pastor</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-3-bio">Equipping the next generation to live boldly for Christ through mentorship and creative ministry.</p>
        </div>
      </div>
      <div class="group overflow-hidden rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)]" data-qay-hover="luxe-lift">
        <div class="h-72 overflow-hidden" data-qay-hover="img-zoom"><img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&q=85" alt="Worship leader portrait" class="h-full w-full object-cover" data-qm="team-4-image" /></div>
        <div class="p-6 text-center">
          <h3 class="text-lg font-bold" style="font-family:var(--qm-heading-font)" data-qm="team-4-name">Sarah Kim</h3>
          <p class="mt-1 text-sm font-semibold text-[var(--qm-accent)]" data-qm="team-4-role">Worship Director</p>
          <p class="mt-3 text-sm text-[var(--qm-text-muted)]" data-qm="team-4-bio">Leading our worship team with a gift for creating atmospheres of praise and spiritual encounter.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── GALLERY ── */
  {
    id: 'church-gallery-warm',
    site_type: 'church',
    section_type: 'gallery',
    theme_id: 'warm-gold',
    keywords: ['gallery', 'photos', 'community', 'church', 'events', 'worship'],
    preview_description: 'Church life gallery with bento grid showcasing worship, community events, and volunteer moments.',
    rank: 89,
    html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="mb-14 text-center" data-qay-animate="luxe-reveal">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--qm-accent)]">Life at Grace</p>
      <h2 class="mt-4 text-4xl font-bold md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="gallery-title">Moments of Faith &amp; Fellowship</h2>
    </div>
    <div class="grid gap-4 md:grid-cols-4 md:grid-rows-2" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-2xl md:col-span-2 md:row-span-2" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1000&auto=format&q=85" alt="Sunday worship service with congregation" class="h-full min-h-[320px] w-full object-cover" data-qm="gallery-image-1" />
      </div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&auto=format&q=85" alt="Community Bible study group" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-2" />
      </div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1609234656388-0ff363383899?w=600&auto=format&q=85" alt="Church volunteer serving food" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-3" />
      </div>
      <div class="overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&q=85" alt="Youth group fellowship" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-4" />
      </div>
      <div class="relative overflow-hidden rounded-2xl" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&q=85" alt="Outdoor church community event" class="h-full min-h-[200px] w-full object-cover" data-qm="gallery-image-5" />
        <div class="absolute inset-0 flex items-center justify-center bg-[var(--qm-accent)]/30 backdrop-blur-sm">
          <a href="/gallery" class="rounded-full bg-[var(--qm-surface)] px-6 py-3 text-sm font-semibold text-[var(--qm-text)] shadow-xl transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]" data-qay-hover="scale">View All Photos &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── CTA ── */
  {
    id: 'church-cta-warm',
    site_type: 'church',
    section_type: 'cta',
    theme_id: 'warm-gold',
    keywords: ['cta', 'visit', 'welcome', 'join', 'church', 'action'],
    preview_description: 'Warm, inviting CTA section encouraging first-time visitors with dual action buttons and welcoming message.',
    rank: 93,
    html: `<section class="relative overflow-hidden bg-[var(--qm-accent)] px-5 py-28 text-[var(--qm-accent-text)]">
  <div class="absolute inset-0 opacity-15" style="background:radial-gradient(circle at 25% 75%, #fff, transparent 50%), radial-gradient(circle at 75% 25%, #fff, transparent 40%)"></div>
  <div class="relative mx-auto max-w-4xl text-center" data-qay-animate="luxe-reveal">
    <p class="text-3xl">&#128328;</p>
    <h2 class="mt-6 text-4xl font-bold leading-tight md:text-6xl" style="font-family:var(--qm-heading-font)" data-qm="cta-title">You&rsquo;re Invited. Come as You Are.</h2>
    <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80" data-qm="cta-subtitle">Whether you&rsquo;re seeking answers, community, or simply a place to belong &mdash; there&rsquo;s a seat saved for you at Grace Community Church.</p>
    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a href="/visit" class="rounded-full bg-[var(--qm-surface)] px-10 py-4 text-lg font-bold text-[var(--qm-accent)] shadow-2xl transition hover:shadow-xl" data-qay-hover="scale" data-qm="cta-button-primary">Plan Your First Visit</a>
      <a href="/give" class="rounded-full border border-white/30 px-8 py-4 font-semibold text-[var(--qm-accent-text)] transition hover:bg-white/10" data-qm="cta-button-secondary">Give Online &rarr;</a>
    </div>
    <div class="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-6 text-center">
      <div>
        <p class="text-3xl font-bold">2,500+</p>
        <p class="mt-1 text-sm text-white/70">Members</p>
      </div>
      <div>
        <p class="text-3xl font-bold">30+</p>
        <p class="mt-1 text-sm text-white/70">Ministries</p>
      </div>
      <div>
        <p class="text-3xl font-bold">15</p>
        <p class="mt-1 text-sm text-white/70">Years Serving</p>
      </div>
    </div>
  </div>
</section>`,
  },

  /* ── FOOTER ── */
  {
    id: 'church-footer-warm',
    site_type: 'church',
    section_type: 'footer',
    theme_id: 'warm-gold',
    keywords: ['footer', 'links', 'church', 'contact', 'address'],
    preview_description: 'Warm church footer with service times, ministry links, location information, and social connections.',
    rank: 90,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-16 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 md:grid-cols-4">
      <div class="md:col-span-1">
        <a href="/" class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">Grace Community</a>
        <p class="mt-4 text-sm leading-relaxed text-[var(--qm-text-muted)]" data-qm="footer-tagline">A welcoming church rooted in faith, growing in love, and serving our community with the grace of God.</p>
        <div class="mt-5 flex gap-4">
          <a href="/facebook" class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">FB</a>
          <a href="/instagram" class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">IG</a>
          <a href="/youtube" class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--qm-border)] text-sm transition hover:bg-[var(--qm-accent)] hover:text-[var(--qm-accent-text)]">YT</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Quick Links</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <a href="/about" class="transition hover:text-[var(--qm-text)]">About Us</a>
          <a href="/sermons" class="transition hover:text-[var(--qm-text)]">Sermons</a>
          <a href="/ministries" class="transition hover:text-[var(--qm-text)]">Ministries</a>
          <a href="/events" class="transition hover:text-[var(--qm-text)]">Events</a>
          <a href="/give" class="transition hover:text-[var(--qm-text)]">Give</a>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Service Times</p>
        <div class="mt-4 flex flex-col gap-3 text-sm text-[var(--qm-text-muted)]">
          <p>Sunday: 9am &amp; 11am</p>
          <p>Wednesday: 7pm</p>
          <p>Friday: 6pm (Youth)</p>
        </div>
        <a href="/visit" class="mt-5 inline-flex rounded-full bg-[var(--qm-accent)] px-5 py-2 text-sm font-semibold text-[var(--qm-accent-text)]" data-qay-hover="scale">Plan a Visit</a>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-accent)]">Location</p>
        <div class="mt-4 text-sm leading-relaxed text-[var(--qm-text-muted)]">
          <p data-qm="footer-address">1234 Grace Avenue<br/>Riverside, CA 92501</p>
          <p class="mt-3" data-qm="footer-phone">(555) 123-4567</p>
          <p class="mt-1"><a href="mailto:hello@gracecommunity.org" class="text-[var(--qm-accent)] hover:underline" data-qm="footer-email">hello@gracecommunity.org</a></p>
        </div>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--qm-border)] pt-8 text-sm text-[var(--qm-text-muted)] md:flex-row">
      <p data-qm="footer-copyright">&copy; 2025 Grace Community Church. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="/privacy" class="transition hover:text-[var(--qm-text)]">Privacy</a>
        <a href="/terms" class="transition hover:text-[var(--qm-text)]">Terms</a>
      </div>
    </div>
  </div>
</footer>`,
  },
];
