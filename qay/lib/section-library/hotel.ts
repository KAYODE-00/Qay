import type { QmSection, QmTheme } from './types';

export const themes: QmTheme[] = [
  {
    id: 'hotel-theme-aura-luxe',
    site_type: 'hotel',
    theme_id: 'aura-luxe',
    label: 'Aura Luxe',
    keywords: ['hotel', 'resort', 'luxury', 'boutique', 'retreat', 'spa', 'villa', 'vacation'],
    css_variables: {
      '--qm-bg': '#fcfaf7',
      '--qm-surface': '#ffffff',
      '--qm-text': '#1e1a15',
      '--qm-text-muted': '#70685e',
      '--qm-accent': '#af8c64',
      '--qm-accent-text': '#ffffff',
      '--qm-border': 'rgba(175,140,100,0.15)',
      '--qm-heading-font': '"Cormorant Garamond", serif',
      '--qm-body-font': '"Outfit", sans-serif',
    },
    google_fonts: ['Cormorant+Garamond:wght@400;500;600;700', 'Outfit:wght@300;400;500;600'],
    is_dark: false,
    rank: 95,
  },
];

export const sections: QmSection[] = [
  {
    id: 'hotel-nav-luxe',
    site_type: 'hotel',
    section_type: 'nav',
    theme_id: 'aura-luxe',
    keywords: ['nav', 'hotel', 'header', 'booking'],
    preview_description: 'Elegant hotel navigation header with quick links and reservation call-to-action.',
    rank: 95,
    html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/85 px-6 py-4 text-[var(--qm-text)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a href="/" class="text-2xl font-semibold uppercase tracking-widest hover:opacity-85 transition" style="font-family:var(--qm-heading-font)" data-qm="brand-name">AURA RESIDENCES</a>
    <div class="hidden items-center gap-8 text-xs font-bold uppercase tracking-widest md:flex">
      <a href="/rooms" class="hover:text-[var(--qm-accent)] transition">Rooms</a>
      <a href="/spa" class="hover:text-[var(--qm-accent)] transition">Wellness</a>
      <a href="/dining" class="hover:text-[var(--qm-accent)] transition">Dining</a>
      <a href="/contact" class="rounded-none bg-[var(--qm-accent)] px-6 py-3 text-xs font-bold text-[var(--qm-accent-text)] tracking-wider hover:opacity-90 transition duration-200">Book Stay</a>
    </div>
    <button type="button" class="border border-[var(--qm-border)] px-4 py-2 text-xs font-bold uppercase md:hidden" data-qay-click="toggle" data-qay-target="#hotel-mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="hotel-mobile-menu" class="hidden fixed inset-x-4 top-24 z-50 flex flex-col gap-4 border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 shadow-2xl md:hidden">
    <a href="/rooms" class="text-sm font-bold uppercase tracking-wider">Rooms</a>
    <a href="/spa" class="text-sm font-bold uppercase tracking-wider">Wellness</a>
    <a href="/dining" class="text-sm font-bold uppercase tracking-wider">Dining</a>
    <a href="/contact" class="rounded-none bg-[var(--qm-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--qm-accent-text)]">Book Stay</a>
  </div>
</nav>`,
  },
  {
    id: 'hotel-hero-luxe',
    site_type: 'hotel',
    section_type: 'hero',
    theme_id: 'aura-luxe',
    keywords: ['hero', 'resort', 'luxury', 'luxe-reveal'],
    preview_description: 'Luxury hotel hero with bento layout, stunning room teaser, and elegant serif typography.',
    rank: 98,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-16 lg:py-24 text-[var(--qm-text)] overflow-hidden">
  <div class="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div class="space-y-8 animate-fade-in" data-qay-animate="luxe-reveal" data-qay-duration="1.2">
      <div class="inline-flex items-center gap-2 border-b border-[var(--qm-border)] pb-2 text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">
        ESTABLISHED 2024 &bull; MALDIVES
      </div>
      <h1 class="text-6xl font-light leading-[0.9] md:text-8xl lg:text-9xl" style="font-family:var(--qm-heading-font)" data-qm="hero-title">
        Your Private<br/>Sanctuary.
      </h1>
      <p class="max-w-lg text-sm md:text-base leading-relaxed text-[var(--qm-text-muted)] font-light" data-qm="hero-subtitle">
        Nestled along the pristine blue reefs of the south coast, Aura Residences offers an intimate architectural hideaway designed to elevate the human spirit.
      </p>
      <div class="pt-4 flex flex-wrap gap-4">
        <a href="/rooms" class="rounded-none bg-[var(--qm-accent)] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] shadow-xl hover:opacity-90 transition duration-200">Explore Suites</a>
        <a href="/gallery" class="rounded-none border border-[var(--qm-border)] px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">View Gallery</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <div class="overflow-hidden rounded-none border border-[var(--qm-border)] col-span-2 aspect-[16/10]" data-qay-hover="img-zoom">
        <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&q=85" alt="Luxury infinity pool overlooking ocean" class="h-full w-full object-cover" />
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">32</p>
        <p class="text-[9px] font-bold uppercase tracking-widest text-[var(--qm-text-muted)]">Ocean Villas</p>
      </div>
      <div class="border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6 space-y-1" data-qay-hover="scale">
        <p class="text-3xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">100%</p>
        <p class="text-[9px] font-bold uppercase tracking-widest text-[var(--qm-text-muted)]">Solar Powered</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'hotel-features-bento',
    site_type: 'hotel',
    section_type: 'features',
    theme_id: 'aura-luxe',
    keywords: ['features', 'amenities', 'bento', 'wellness'],
    preview_description: 'Bento-style grid of premium hotel amenities and services.',
    rank: 92,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="max-w-3xl space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">EXPERIENCE</p>
      <h2 class="text-4xl md:text-5xl font-light tracking-tight" style="font-family:var(--qm-heading-font)">THE LUXURY OF SPACE</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Card 1 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">WELLNESS</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Sanskrit Spa</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light leading-relaxed">Indulge in ancient therapeutic rituals, hot stones, and hydrotherapy treatments tailored by master healers.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">Reserve Ritual &rarr;</span>
      </article>

      <!-- Card 2 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">CULINARY</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">The Dune Pavilion</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light leading-relaxed">Michelin-standard dining featuring locally sourced seafood, organic garden greens, and biodynamic wines.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--qm-accent)]">View Menu &rarr;</span>
      </article>

      <!-- Card 3 -->
      <article class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/30 space-y-6 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="space-y-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">LEISURE</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Ocean Excursions</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light leading-relaxed">Private yacht charters, sunset reef diving, and coral rehabilitation workshops led by marine biologists.</p>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text(--qm-accent)]">Book Charter &rarr;</span>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'hotel-gallery-bento',
    site_type: 'hotel',
    section_type: 'gallery',
    theme_id: 'aura-luxe',
    keywords: ['gallery', 'bento', 'photos', 'rooms'],
    preview_description: 'Visual showcase grid displaying the resort\'s luxury spaces.',
    rank: 94,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div data-qay-animate="slide-up">
        <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">PORTFOLIO</p>
        <h2 class="mt-4 text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">RESORT PERSPECTIVES</h2>
      </div>
      <a href="/gallery" class="border border-[var(--qm-border)] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--qm-surface)] transition duration-200">Explore All Rooms</a>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Image 1 -->
      <article class="overflow-hidden border border-[var(--qm-border)] bg-[var(--qm-surface)] md:col-span-2 flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="overflow-hidden relative group" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&q=85" alt="Luxury suite interior with direct beach access" class="h-80 w-full object-cover" />
        </div>
        <div class="p-6 space-y-2">
          <span class="text-[9px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">ACCOMMODATIONS</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">Beachfront Pavilion Suite</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light">Spacious suites offering custom teak furniture, private pool, and outdoor hot baths directly on the shore.</p>
        </div>
      </article>

      <!-- Image 2 -->
      <article class="overflow-hidden border border-[var(--qm-border)] bg-[var(--qm-surface)] flex flex-col justify-between" data-qay-hover="luxe-lift">
        <div class="overflow-hidden relative group" data-qay-hover="img-zoom">
          <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&q=85" alt="Infinity pool and ocean deck" class="h-80 w-full object-cover" />
        </div>
        <div class="p-6 space-y-2">
          <span class="text-[9px] font-bold uppercase tracking-widest text-[var(--qm-accent)]">OUTDOORS</span>
          <h3 class="text-2xl font-light" style="font-family:var(--qm-heading-font)">The Horizon Deck</h3>
          <p class="text-xs text-[var(--qm-text-muted)] font-light">Watch stunning sunset views over the turquoise waters of the lagoon.</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: 'hotel-pricing-bento',
    site_type: 'hotel',
    section_type: 'pricing',
    theme_id: 'aura-luxe',
    keywords: ['pricing', 'suites', 'booking', 'rooms'],
    preview_description: 'Elegant room categories with amenities list and booking action.',
    rank: 90,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl space-y-12">
    <div class="text-center space-y-4" data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">THE SELECTION</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">ROOM RATES & SUITES</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3" data-qay-animate="stagger-children">
      <!-- Suite 1 -->
      <div class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-6 flex flex-col justify-between" data-qay-hover="scale">
        <div class="space-y-4">
          <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">CLASSIC</p>
          <h3 class="text-3xl font-light" style="font-family:var(--qm-heading-font)">Ocean Breeze Villa</h3>
          <p class="text-4xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$650 <span class="text-xs text-[var(--qm-text-muted)] uppercase tracking-wider">/ night</span></p>
          <ul class="text-xs text-[var(--qm-text-muted)] space-y-2 pt-4 border-t border-[var(--qm-border)]">
            <li>&bull; 120 sqm private pavilion</li>
            <li>&bull; King-size posturepedic bed</li>
            <li>&bull; Direct ocean reef access</li>
            <li>&bull; Complementary airport transfer</li>
          </ul>
        </div>
        <a href="/booking?suite=ocean" class="bg-[var(--qm-accent)] py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] hover:opacity-90 transition">Book Luxury</a>
      </div>

      <!-- Suite 2 -->
      <div class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-6 flex flex-col justify-between" data-qay-hover="scale">
        <div class="space-y-4">
          <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">POPULAR</p>
          <h3 class="text-3xl font-light" style="font-family:var(--qm-heading-font)">Sunset Pool Pavilion</h3>
          <p class="text-4xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$950 <span class="text-xs text-[var(--qm-text-muted)] uppercase tracking-wider">/ night</span></p>
          <ul class="text-xs text-[var(--qm-text-muted)] space-y-2 pt-4 border-t border-[var(--qm-border)]">
            <li>&bull; 180 sqm luxury room</li>
            <li>&bull; Private infinity plunge pool</li>
            <li>&bull; 24/7 dedicated butler service</li>
            <li>&bull; Complimentary spa massage</li>
          </ul>
        </div>
        <a href="/booking?suite=sunset" class="bg-[var(--qm-accent)] py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] hover:opacity-90 transition">Book Luxury</a>
      </div>

      <!-- Suite 3 -->
      <div class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/20 space-y-6 flex flex-col justify-between" data-qay-hover="scale">
        <div class="space-y-4">
          <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">PRESTIGE</p>
          <h3 class="text-3xl font-light" style="font-family:var(--qm-heading-font)">Grand Aura Sanctuary</h3>
          <p class="text-4xl font-light text-[var(--qm-accent)]" style="font-family:var(--qm-heading-font)">$1,600 <span class="text-xs text-[var(--qm-text-muted)] uppercase tracking-wider">/ night</span></p>
          <ul class="text-xs text-[var(--qm-text-muted)] space-y-2 pt-4 border-t border-[var(--qm-border)]">
            <li>&bull; 310 sqm multi-level mansion</li>
            <li>&bull; Dual infinity pool & sun decks</li>
            <li>&bull; Dedicated chef & lounge bar</li>
            <li>&bull; Private airport yacht transfer</li>
          </ul>
        </div>
        <a href="/booking?suite=grand" class="bg-[var(--qm-accent)] py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] hover:opacity-90 transition">Book Luxury</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'hotel-testimonials-luxe',
    site_type: 'hotel',
    section_type: 'testimonials',
    theme_id: 'aura-luxe',
    keywords: ['testimonials', 'reviews', 'quotes'],
    preview_description: 'Minimal editorial layout showcasing luxury client testimonials.',
    rank: 85,
    html: `<section class="bg-[var(--qm-bg)] px-6 py-20 text-[var(--qm-text)] border-t border-b border-[var(--qm-border)]">
  <div class="mx-auto max-w-4xl text-center space-y-8" data-qay-animate="luxe-reveal">
    <blockquote class="text-3xl md:text-5xl font-light leading-snug tracking-tight" style="font-family:var(--qm-heading-font)">
      "A quiet oasis where the architecture merges perfectly with the landscape. The service is incredibly intuitive, leaving you completely at peace."
    </blockquote>
    <div class="space-y-1">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">Charlotte Vandeberg</p>
      <p class="text-[10px] font-semibold text-[var(--qm-text-muted)] uppercase tracking-wider">Conde Nast Traveler</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'hotel-contact-bento',
    site_type: 'hotel',
    section_type: 'contact',
    theme_id: 'aura-luxe',
    keywords: ['contact', 'booking', 'address', 'bento'],
    preview_description: 'Bento-style contact grid with form and reservation coordinates.',
    rank: 82,
    html: `<section class="bg-[var(--qm-surface)] px-6 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2 lg:items-center">
    <div class="space-y-6" data-qay-animate="slide-right">
      <p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]">RESERVATIONS</p>
      <h2 class="text-4xl md:text-5xl font-light" style="font-family:var(--qm-heading-font)">BEGIN YOUR JOURNEY</h2>
      <p class="text-sm font-light text-[var(--qm-text-muted)] leading-relaxed">
        Let us prepare your stay. Fill in your details, and a dedicated curator from our guest relations team will contact you within the hour to coordinate travel.
      </p>
      <div class="space-y-4 pt-4 text-xs font-bold uppercase tracking-wider border-t border-[var(--qm-border)]">
        <div>
          <span class="text-[9px] text-[var(--qm-text-muted)]">COORDINATES</span>
          <p class="mt-1">South Atoll, Maldives, Zone 4</p>
        </div>
        <div>
          <span class="text-[9px] text-[var(--qm-text-muted)]">INQUIRIES</span>
          <p class="mt-1">concierge@auraresidences.com</p>
        </div>
      </div>
    </div>
    <form class="p-8 border border-[var(--qm-border)] bg-[var(--qm-bg)]/50 space-y-4" data-qay-animate="slide-left">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Arrival Date</label>
          <input type="date" class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Guests</label>
          <select class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]">
            <option>1-2 Guests</option>
            <option>3-4 Guests</option>
            <option>5+ Guests</option>
          </select>
        </div>
      </div>
      <div class="space-y-1">
        <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Full Name</label>
        <input type="text" placeholder="John Doe" class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]" />
      </div>
      <div class="space-y-1">
        <label class="text-[9px] font-bold uppercase tracking-wider text-[var(--qm-text-muted)]">Email Address</label>
        <input type="email" placeholder="john@example.com" class="w-full border border-[var(--qm-border)] bg-[var(--qm-surface)] px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--qm-accent)]" />
      </div>
      <button type="submit" class="w-full bg-[var(--qm-accent)] py-3 text-xs font-bold uppercase tracking-wider text-[var(--qm-accent-text)] hover:opacity-90 transition">Request Stay</button>
    </form>
  </div>
</section>`,
  },
  {
    id: 'hotel-footer-luxe',
    site_type: 'hotel',
    section_type: 'footer',
    theme_id: 'aura-luxe',
    keywords: ['footer', 'hotel', 'links'],
    preview_description: 'Elegant hotel footer layout with brand coordinates and quick navigation links.',
    rank: 80,
    html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-6 py-16 text-sm text-[var(--qm-text-muted)]">
  <div class="mx-auto max-w-7xl grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
    <div class="space-y-4">
      <p class="text-2xl font-semibold text-[var(--qm-text)] tracking-widest" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">AURA RESIDENCES</p>
      <p class="max-w-sm text-xs font-light leading-relaxed">Luxury ocean sanctuary and private boutique villa retreat, crafted to harmonize pure design aesthetics with wild tropical nature.</p>
    </div>
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-text)]">DESTINATION</h4>
      <div class="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider">
        <a href="/villas" class="hover:text-[var(--qm-text)] transition">The Villas</a>
        <a href="/wellness" class="hover:text-[var(--qm-text)] transition">Sanskrit Spa</a>
        <a href="/dining" class="hover:text-[var(--qm-text)] transition">Fine Dining</a>
      </div>
    </div>
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold uppercase tracking-widest text-[var(--qm-text)]">PROTOCOL</h4>
      <div class="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider">
        <a href="/terms" class="hover:text-[var(--qm-text)] transition">Stay Policies</a>
        <a href="/privacy" class="hover:text-[var(--qm-text)] transition">Privacy Charter</a>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest">
    <p>&copy; 2026 AURA RESIDENCES. ALL RIGHTS RESERVED.</p>
    <p>DESIGNED &bull; MALDIVES &bull; SINGAPORE</p>
  </div>
</footer>`,
  },
];
