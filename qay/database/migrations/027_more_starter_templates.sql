-- Seed 3 more high-quality starter templates
-- Luxury Beauty Studio, Bold Creative Agency, Crossfit Gym

INSERT INTO qay_ai_templates (
  site_type, theme, label, html, pages,
  industry, color_mood, tags, features, zones, pages_meta, cms_hints,
  source, is_approved, is_active, rank
) VALUES

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 5: Luxury Beauty Studio
-- ══════════════════════════════════════════════════════════════════════
(
  'beauty',
  'warm',
  'Luxury Beauty Studio',
  $tpl5$
<style>
:root {
  --qm-bg: #faf8f5;
  --qm-surface: #fff;
  --qm-text: #1c1209;
  --qm-text-muted: #7a6b59;
  --qm-accent: #9b6c4c;
  --qm-accent-text: #ffffff;
  --qm-border: rgba(28,18,9,0.09);
  --qm-heading-font: 'Cormorant Garamond', serif;
  --qm-body-font: 'Jost', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-8 py-4 backdrop-blur-sm" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-2xl font-light tracking-[0.2em] uppercase" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Lumière</a>
      <div class="hidden md:flex items-center gap-10 text-sm text-[var(--qm-text-muted)] tracking-wider">
        <a href="/services" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-services">Services</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-about">About</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-contact">Contact</a>
        <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-6 py-2.5 text-sm text-white tracking-widest hover:opacity-85 transition-opacity" data-qm="nav-book">Book Now</a>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text-muted)] text-sm" data-qay-click="toggle" data-qay-target="#beauty-mobile-menu" data-qay-class="hidden">Menu</button>
    </div>
  </nav>

  <div id="beauty-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-white px-8 py-5 space-y-3 md:hidden">
    <a href="/services" class="block text-sm text-[var(--qm-text-muted)]" data-qm="mobile-nav-services">Services</a>
    <a href="/about" class="block text-sm text-[var(--qm-text-muted)]">About</a>
    <a href="/contact" class="block text-sm font-semibold text-[var(--qm-accent)]">Book Now</a>
  </div>

  <section class="relative min-h-[88vh] grid md:grid-cols-2" data-qay-animate="fade-in">
    <div class="flex items-center justify-center px-10 py-24 md:py-0">
      <div class="space-y-7 max-w-lg">
        <p class="text-xs font-medium uppercase tracking-[0.45em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Beauty · Wellness · Luxury</p>
        <h1 class="text-[clamp(3rem,6vw,5.5rem)] font-light leading-[1.05]" style="font-family:var(--qm-heading-font)" data-qm="hero-headline">Where Beauty Meets Intention.</h1>
        <p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="hero-subtext">A boutique studio dedicated to enhancing your natural radiance through expert skin, hair, and wellness treatments.</p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-8 py-4 text-sm font-medium tracking-widest text-white hover:opacity-85 transition-opacity" data-qm="hero-cta-primary">Book a Treatment</a>
          <a href="/services" class="rounded-full border border-[var(--qm-border)] px-8 py-4 text-sm font-medium tracking-widest text-[var(--qm-text-muted)] hover:text-[var(--qm-text)] hover:border-[var(--qm-text-muted)] transition-all" data-qm="hero-cta-secondary">Our Services</a>
        </div>
      </div>
    </div>
    <div class="aspect-[4/5] md:aspect-auto overflow-hidden">
      <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=90&auto=format&fit=crop" alt="Beauty studio" class="h-full w-full object-cover" data-qm="hero-image" />
    </div>
  </section>

  <section class="px-8 py-20 bg-[var(--qm-surface)]" data-qay-animate="slide-up">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-14 space-y-3">
        <p class="text-xs font-medium uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="services-eyebrow">What We Offer</p>
        <h2 class="text-4xl font-light" style="font-family:var(--qm-heading-font)" data-qm="services-heading">Signature Treatments</h2>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-4 hover:shadow-sm transition-shadow">
          <div class="aspect-[3/2] overflow-hidden rounded-xl"><img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85&auto=format&fit=crop" alt="Facial" class="h-full w-full object-cover" data-qm="service-image-1" /></div>
          <h3 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="service-title-1">Luxury Facials</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="service-desc-1">Bespoke skin treatments tailored to your unique skin type. From hydration therapy to advanced anti-aging protocols.</p>
          <p class="text-sm font-medium text-[var(--qm-accent)]" data-qm="service-price-1">From ₦25,000</p>
        </article>
        <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-4 hover:shadow-sm transition-shadow">
          <div class="aspect-[3/2] overflow-hidden rounded-xl"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85&auto=format&fit=crop" alt="Hair" class="h-full w-full object-cover" data-qm="service-image-2" /></div>
          <h3 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="service-title-2">Hair Artistry</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="service-desc-2">Cuts, colour, keratin treatments, and protective styling by master stylists with decades of combined experience.</p>
          <p class="text-sm font-medium text-[var(--qm-accent)]" data-qm="service-price-2">From ₦18,000</p>
        </article>
        <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-8 space-y-4 hover:shadow-sm transition-shadow">
          <div class="aspect-[3/2] overflow-hidden rounded-xl"><img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=85&auto=format&fit=crop" alt="Wellness" class="h-full w-full object-cover" data-qm="service-image-3" /></div>
          <h3 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="service-title-3">Body Wellness</h3>
          <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="service-desc-3">Full-body massages, body wraps, and detox rituals designed to restore your body and calm your mind.</p>
          <p class="text-sm font-medium text-[var(--qm-accent)]" data-qm="service-price-3">From ₦30,000</p>
        </article>
      </div>
    </div>
  </section>

  <section class="px-8 py-20" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-5xl grid md:grid-cols-2 gap-14 items-center">
      <div class="space-y-7">
        <p class="text-xs font-medium uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="about-eyebrow">The Studio</p>
        <h2 class="text-4xl font-light leading-tight" style="font-family:var(--qm-heading-font)" data-qm="about-heading">A Space Created for You, and You Alone.</h2>
        <p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="about-body">Lumière was born from a belief that luxury beauty should feel personal, not clinical. Every visit is a ritual. Every treatment is customised. Every client leaves feeling like themselves — only better.</p>
        <a href="/about" class="inline-flex text-sm font-medium text-[var(--qm-accent)] hover:opacity-70 transition-opacity" data-qm="about-link">Meet the team →</a>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="aspect-[3/4] overflow-hidden rounded-3xl"><img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=85&auto=format&fit=crop" alt="Studio" class="h-full w-full object-cover" data-qm="about-image-1" /></div>
        <div class="aspect-[3/4] overflow-hidden rounded-3xl mt-8"><img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85&auto=format&fit=crop" alt="Treatment" class="h-full w-full object-cover" data-qm="about-image-2" /></div>
      </div>
    </div>
  </section>

  <section class="px-8 py-20 bg-[var(--qm-accent)] text-white" data-qay-animate="fade-in">
    <div class="mx-auto max-w-2xl text-center space-y-6">
      <h2 class="text-4xl font-light" style="font-family:var(--qm-heading-font)" data-qm="booking-heading">Ready to Glow?</h2>
      <p class="text-base text-white/80" data-qm="booking-subtext">Book your signature treatment today. New clients receive 15% off their first visit.</p>
      <a href="/contact" class="inline-flex rounded-full bg-white px-8 py-4 text-sm font-medium tracking-widest text-[var(--qm-accent)] hover:opacity-90 transition-opacity" data-qm="booking-cta">Book an Appointment</a>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-8 py-10">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--qm-text-muted)]">
      <span class="text-xl font-light tracking-[0.2em] uppercase" style="font-family:var(--qm-heading-font);color:var(--qm-text)" data-qm="footer-brand">Lumière</span>
      <div class="flex flex-wrap gap-6"><a href="/services" class="hover:text-[var(--qm-text)]">Services</a><a href="/about" class="hover:text-[var(--qm-text)]">About</a><a href="/contact" class="hover:text-[var(--qm-text)]">Book</a></div>
      <p data-qm="footer-copy">© 2025 Lumière Beauty Studio. All rights reserved.</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Services" data-qay-slug="/services">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-8 py-4 backdrop-blur-sm"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-2xl font-light tracking-[0.2em] uppercase" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Lumière</a><a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-6 py-2.5 text-sm text-white tracking-widest hover:opacity-85 transition-opacity" data-qm="nav-book">Book Now</a></div></nav>
  <section class="mx-auto max-w-5xl px-8 py-24" data-qay-animate="fade-in">
    <p class="text-xs font-medium uppercase tracking-[0.4em] text-[var(--qm-accent)] mb-4" data-qm="services-page-eyebrow">Menu</p>
    <h1 class="text-6xl font-light mb-16" style="font-family:var(--qm-heading-font)" data-qm="services-page-heading">Our Treatments</h1>
    <div class="space-y-px">
      <article class="border-t border-[var(--qm-border)] py-8 grid md:grid-cols-[1fr_2fr_auto] gap-8 items-start">
        <h2 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="svc-name-1">Luxury Facial</h2>
        <p class="text-sm leading-8 text-[var(--qm-text-muted)]" data-qm="svc-desc-1">Bespoke 60-minute treatment combining double cleanse, exfoliation, facial massage, mask, and SPF finish. Fully customised to your skin concern.</p>
        <span class="font-medium text-[var(--qm-accent)]" data-qm="svc-price-1">₦25,000</span>
      </article>
      <article class="border-t border-[var(--qm-border)] py-8 grid md:grid-cols-[1fr_2fr_auto] gap-8 items-start">
        <h2 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="svc-name-2">Keratin Treatment</h2>
        <p class="text-sm leading-8 text-[var(--qm-text-muted)]" data-qm="svc-desc-2">Professional keratin smoothing treatment. Results last 3–5 months. Includes blow-dry finish and aftercare consultation.</p>
        <span class="font-medium text-[var(--qm-accent)]" data-qm="svc-price-2">₦55,000</span>
      </article>
      <article class="border-t border-b border-[var(--qm-border)] py-8 grid md:grid-cols-[1fr_2fr_auto] gap-8 items-start">
        <h2 class="text-xl font-light" style="font-family:var(--qm-heading-font)" data-qm="svc-name-3">Full Body Massage</h2>
        <p class="text-sm leading-8 text-[var(--qm-text-muted)]" data-qm="svc-desc-3">90-minute Swedish or deep tissue full-body massage with hot stone therapy. Includes herbal tea ritual.</p>
        <span class="font-medium text-[var(--qm-accent)]" data-qm="svc-price-3">₦30,000</span>
      </article>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-8 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 Lumière Beauty Studio</footer>
</main>
</div>

<div data-qay-page="Contact" data-qay-slug="/contact">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-8 py-4 backdrop-blur-sm"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-2xl font-light tracking-[0.2em] uppercase" style="font-family:var(--qm-heading-font)" data-qm="brand-name">Lumière</a></div></nav>
  <section class="mx-auto max-w-5xl px-8 py-24 grid md:grid-cols-2 gap-14 items-center" data-qay-animate="fade-in">
    <div class="space-y-6"><p class="text-xs font-medium uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="contact-eyebrow">Book With Us</p><h1 class="text-5xl font-light leading-tight" style="font-family:var(--qm-heading-font)" data-qm="contact-heading">Book Your Treatment</h1><p class="text-base leading-9 text-[var(--qm-text-muted)]" data-qm="contact-body">Consultations are free for new clients. We will recommend the perfect treatment plan for you.</p><div class="space-y-2 text-sm text-[var(--qm-text-muted)]"><p data-qm="contact-hours">Tue–Sat: 9am–7pm · Sun: 10am–5pm</p><p data-qm="contact-phone">+234 (0) 812 LUMIERE</p></div></div>
    <form class="space-y-4 rounded-3xl border border-[var(--qm-border)] bg-white p-8">
      <input name="name" placeholder="Your name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" />
      <input name="email" type="email" placeholder="Email address" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" />
      <select name="treatment" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors"><option value="">Select a treatment</option><option>Luxury Facial</option><option>Hair Artistry</option><option>Body Massage</option><option>Keratin Treatment</option></select>
      <input name="date" type="date" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" />
      <textarea name="notes" rows="3" placeholder="Any notes or skin concerns" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors resize-none"></textarea>
      <button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] py-3.5 text-sm font-medium tracking-widest text-white hover:opacity-90 transition-opacity" data-qm="contact-submit">Request Booking</button>
    </form>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-8 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 Lumière Beauty Studio</footer>
</main>
</div>
$tpl5$,
  '[{"name":"Home","slug":"/"},{"name":"Services","slug":"/services"},{"name":"Contact","slug":"/contact"}]'::jsonb,
  'beauty', 'warm-luxury',
  ARRAY['beauty','salon','spa','wellness','luxury','warm','cormorant','serif','booking','skin','hair','massage','feminine','elegant','multi-page'],
  '{"hasCms":false,"hasCommerce":false,"hasAuth":false,"hasMultiPage":true,"pageCount":3}'::jsonb,
  '{"brand-name":"Lumière","hero-eyebrow":"Beauty · Wellness · Luxury","hero-headline":"Where Beauty Meets Intention.","hero-cta-primary":"Book a Treatment","service-title-1":"Luxury Facials","service-price-1":"From ₦25,000"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/services","name":"Services","purpose":"services"},{"slug":"/contact","name":"Contact","purpose":"contact"}]'::jsonb,
  '{"collectionType":"services","sampleItems":[{"title":"Luxury Facial","subtitle":"Bespoke 60-minute skin treatment","price":"₦25,000"},{"title":"Hair Artistry","subtitle":"Cuts, colour & protective styling","price":"₦18,000"},{"title":"Body Massage","subtitle":"90-minute full body wellness","price":"₦30,000"}]}'::jsonb,
  'qay', true, true, 86
),

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 6: Bold Creative Agency
-- ══════════════════════════════════════════════════════════════════════
(
  'agency',
  'dark',
  'Bold Creative Agency',
  $tpl6$
<style>
:root {
  --qm-bg: #050505;
  --qm-surface: #0d0d0d;
  --qm-text: #f2f2f2;
  --qm-text-muted: #888;
  --qm-accent: #ff4d00;
  --qm-accent-text: #ffffff;
  --qm-border: rgba(255,255,255,0.08);
  --qm-heading-font: 'Space Grotesk', sans-serif;
  --qm-body-font: 'Inter', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-xl font-bold tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">VANTA<span style="color:var(--qm-accent)">.</span></a>
      <div class="hidden md:flex items-center gap-8 text-sm text-[var(--qm-text-muted)]">
        <a href="/work" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-work">Work</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-about">About</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-contact">Contact</a>
        <a href="/contact" class="rounded-md bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-85 transition-opacity" data-qm="nav-cta">Start a Project</a>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text-muted)]" data-qay-click="toggle" data-qay-target="#agency-mobile-menu" data-qay-class="hidden">Menu</button>
    </div>
  </nav>

  <div id="agency-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-5 space-y-3 md:hidden">
    <a href="/work" class="block text-sm text-[var(--qm-text-muted)]" data-qm="mobile-nav-work">Work</a>
    <a href="/about" class="block text-sm text-[var(--qm-text-muted)]">About</a>
    <a href="/contact" class="block text-sm font-semibold text-[var(--qm-accent)]">Start a Project</a>
  </div>

  <section class="px-6 py-28 md:py-44" data-qay-animate="fade-in">
    <div class="mx-auto max-w-7xl">
      <p class="text-sm font-medium tracking-[0.3em] uppercase text-[var(--qm-accent)] mb-6" data-qm="hero-eyebrow">Creative Agency — Since 2018</p>
      <h1 class="max-w-5xl text-[clamp(3.5rem,9vw,9rem)] font-bold leading-[0.92] tracking-[-0.04em]" style="font-family:var(--qm-heading-font)" data-qm="hero-headline">We build brands that move people.</h1>
      <div class="mt-14 grid md:grid-cols-[1fr_auto] items-end gap-10">
        <p class="max-w-xl text-xl leading-9 text-[var(--qm-text-muted)]" data-qm="hero-subtext">Strategy, design, and digital execution for brands that refuse to blend in. Based in Lagos. Working everywhere.</p>
        <div class="flex gap-4">
          <a href="/work" class="rounded-md border border-[var(--qm-border)] px-6 py-3.5 text-sm font-semibold hover:border-[var(--qm-text-muted)] hover:text-white transition-all" data-qm="hero-cta-secondary">View Our Work</a>
          <a href="/contact" class="rounded-md bg-[var(--qm-accent)] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-85 transition-opacity" data-qm="hero-cta-primary">Start a Project</a>
        </div>
      </div>
    </div>
  </section>

  <section class="px-6 py-4" data-qay-animate="slide-up">
    <div class="mx-auto max-w-7xl border-t border-[var(--qm-border)] pt-16 grid gap-px md:grid-cols-3">
      <div class="pr-8 space-y-2"><p class="text-5xl font-bold" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="stat-1-number">120+</p><p class="text-sm text-[var(--qm-text-muted)]" data-qm="stat-1-label">Brands transformed</p></div>
      <div class="pr-8 space-y-2 border-t md:border-t-0 md:border-l border-[var(--qm-border)] md:pl-8 pt-8 md:pt-0"><p class="text-5xl font-bold" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="stat-2-number">8</p><p class="text-sm text-[var(--qm-text-muted)]" data-qm="stat-2-label">Cannes Lions shortlists</p></div>
      <div class="space-y-2 border-t md:border-t-0 md:border-l border-[var(--qm-border)] md:pl-8 pt-8 md:pt-0"><p class="text-5xl font-bold" style="font-family:var(--qm-heading-font);color:var(--qm-accent)" data-qm="stat-3-number">7yrs</p><p class="text-sm text-[var(--qm-text-muted)]" data-qm="stat-3-label">In the industry</p></div>
    </div>
  </section>

  <section class="px-6 py-20" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-7xl">
      <p class="text-xs font-medium uppercase tracking-[0.3em] text-[var(--qm-text-muted)] mb-8" data-qm="work-eyebrow">Selected Work</p>
      <div class="grid gap-5 md:grid-cols-2">
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)] relative aspect-[4/3]" data-qay-animate="stagger-children">
          <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&q=85&auto=format&fit=crop" alt="Project 1" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" data-qm="project-image-1" />
          <div class="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
            <p class="text-xs font-medium uppercase tracking-widest text-white/60 mb-2" data-qm="project-tag-1">Brand Identity</p>
            <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="project-title-1">Kora Financial</h3>
          </div>
        </article>
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)] relative aspect-[4/3]">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=85&auto=format&fit=crop" alt="Project 2" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" data-qm="project-image-2" />
          <div class="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
            <p class="text-xs font-medium uppercase tracking-widest text-white/60 mb-2" data-qm="project-tag-2">Digital Campaign</p>
            <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="project-title-2">Farmcrowdy Harvest</h3>
          </div>
        </article>
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)] relative aspect-[4/3]">
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1000&q=85&auto=format&fit=crop" alt="Project 3" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" data-qm="project-image-3" />
          <div class="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
            <p class="text-xs font-medium uppercase tracking-widest text-white/60 mb-2" data-qm="project-tag-3">Web Experience</p>
            <h3 class="text-2xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="project-title-3">Paystack Developer Hub</h3>
          </div>
        </article>
        <article class="group overflow-hidden rounded-2xl bg-[var(--qm-accent)] border border-[var(--qm-accent)] relative aspect-[4/3] flex items-center justify-center p-8">
          <div class="text-center space-y-4">
            <p class="text-white/70 text-sm uppercase tracking-widest">Next up</p>
            <h3 class="text-3xl font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="work-cta-text">Your brand, transformed.</h3>
            <a href="/contact" class="inline-flex rounded-md bg-white px-6 py-3 text-sm font-bold text-[var(--qm-accent)] hover:opacity-90 transition-opacity" data-qm="work-cta-button">Let's talk</a>
          </div>
        </article>
      </div>
      <div class="text-center mt-10"><a href="/work" class="inline-flex rounded-md border border-[var(--qm-border)] px-8 py-4 text-sm font-semibold hover:border-[var(--qm-text-muted)] transition-all" data-qm="work-see-all">See all projects →</a></div>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-6 py-10">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--qm-text-muted)]">
      <a href="/" class="text-xl font-bold text-white" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">VANTA<span style="color:var(--qm-accent)">.</span></a>
      <div class="flex flex-wrap gap-6"><a href="/work" class="hover:text-[var(--qm-text)]">Work</a><a href="/about" class="hover:text-[var(--qm-text)]">About</a><a href="/contact" class="hover:text-[var(--qm-text)]">Contact</a></div>
      <p data-qm="footer-copy">© 2025 VANTA Creative. All rights reserved.</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Work" data-qay-slug="/work">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="brand-name">VANTA<span style="color:var(--qm-accent)">.</span></a><a href="/contact" class="rounded-md bg-[var(--qm-accent)] px-5 py-2.5 text-sm font-semibold text-white" data-qm="nav-cta">Start a Project</a></div></nav>
  <section class="mx-auto max-w-7xl px-6 py-20" data-qay-animate="fade-in">
    <p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-text-muted)] mb-4" data-qm="work-page-eyebrow">Portfolio</p>
    <h1 class="text-6xl font-bold mb-16" style="font-family:var(--qm-heading-font)" data-qm="work-page-heading">All Work</h1>
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article class="overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)] group"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=85&auto=format&fit=crop" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="work-item-image-1" alt="Project" /></div><div class="p-5 space-y-1"><p class="text-xs text-[var(--qm-accent)] uppercase tracking-widest" data-qm="work-item-tag-1">Brand Identity</p><h2 class="font-bold" style="font-family:var(--qm-heading-font)" data-qm="work-item-title-1">Kora Financial</h2></div></article>
      <article class="overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)] group"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="work-item-image-2" alt="Project" /></div><div class="p-5 space-y-1"><p class="text-xs text-[var(--qm-accent)] uppercase tracking-widest" data-qm="work-item-tag-2">Digital Campaign</p><h2 class="font-bold" style="font-family:var(--qm-heading-font)" data-qm="work-item-title-2">Farmcrowdy Harvest</h2></div></article>
      <article class="overflow-hidden rounded-2xl bg-[var(--qm-surface)] border border-[var(--qm-border)] group"><div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85&auto=format&fit=crop" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="work-item-image-3" alt="Project" /></div><div class="p-5 space-y-1"><p class="text-xs text-[var(--qm-accent)] uppercase tracking-widest" data-qm="work-item-tag-3">Web Experience</p><h2 class="font-bold" style="font-family:var(--qm-heading-font)" data-qm="work-item-title-3">Paystack Dev Hub</h2></div></article>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 VANTA Creative</footer>
</main>
</div>

<div data-qay-page="Contact" data-qay-slug="/contact">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-xl font-bold" style="font-family:var(--qm-heading-font)" data-qm="brand-name">VANTA<span style="color:var(--qm-accent)">.</span></a></div></nav>
  <section class="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-14 items-center" data-qay-animate="fade-in">
    <div class="space-y-6"><p class="text-xs uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="contact-eyebrow">New Project</p><h1 class="text-5xl font-bold leading-tight" style="font-family:var(--qm-heading-font)" data-qm="contact-heading">Let's Build Something Remarkable.</h1><p class="text-base leading-8 text-[var(--qm-text-muted)]" data-qm="contact-body">Tell us about your project. We'll respond within 48 hours with a tailored proposal.</p><div class="text-sm text-[var(--qm-text-muted)] space-y-1"><p data-qm="contact-email">hello@vantacreative.com</p></div></div>
    <form class="space-y-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8"><input name="name" placeholder="Your name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="email" type="email" placeholder="Email address" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><select name="type" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors"><option>Brand Identity</option><option>Website Design</option><option>Digital Campaign</option><option>Full-service Retainer</option></select><textarea name="message" rows="4" placeholder="Tell us about your project and goals" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors resize-none"></textarea><button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] py-3.5 text-sm font-bold text-white hover:opacity-85 transition-opacity" data-qm="contact-submit">Send Brief</button></form>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 VANTA Creative</footer>
</main>
</div>
$tpl6$,
  '[{"name":"Home","slug":"/"},{"name":"Work","slug":"/work"},{"name":"Contact","slug":"/contact"}]'::jsonb,
  'agency', 'dark-bold',
  ARRAY['agency','creative','branding','portfolio','dark','bold','orange-accent','space-grotesk','multi-page','work','design','digital','marketing','startup','tech'],
  '{"hasCms":false,"hasCommerce":false,"hasAuth":false,"hasMultiPage":true,"pageCount":3}'::jsonb,
  '{"brand-name":"VANTA.","hero-eyebrow":"Creative Agency — Since 2018","hero-headline":"We build brands that move people.","hero-cta-primary":"Start a Project","stat-1-number":"120+","project-title-1":"Kora Financial"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/work","name":"Work","purpose":"portfolio"},{"slug":"/contact","name":"Contact","purpose":"contact"}]'::jsonb,
  null,
  'qay', true, true, 84
),

-- ══════════════════════════════════════════════════════════════════════
-- TEMPLATE 7: Crossfit / Functional Fitness Gym
-- ══════════════════════════════════════════════════════════════════════
(
  'fitness',
  'dark',
  'Crossfit Functional Gym',
  $tpl7$
<style>
:root {
  --qm-bg: #0a0a0a;
  --qm-surface: #111111;
  --qm-text: #f5f5f5;
  --qm-text-muted: #888;
  --qm-accent: #e8ff00;
  --qm-accent-text: #0a0a0a;
  --qm-border: rgba(255,255,255,0.08);
  --qm-heading-font: 'Barlow Condensed', sans-serif;
  --qm-body-font: 'Inter', sans-serif;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">

<div data-qay-page="Home" data-qay-slug="/">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">

  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl" data-qay-animate="fade-in">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <a href="/" class="text-3xl font-black uppercase tracking-tight" style="font-family:var(--qm-heading-font)" data-qm="brand-name">IRON<span style="color:var(--qm-accent)">FORGE</span></a>
      <div class="hidden md:flex items-center gap-8 text-sm text-[var(--qm-text-muted)] uppercase tracking-widest font-medium">
        <a href="/classes" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-classes">Classes</a>
        <a href="/about" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-about">About</a>
        <a href="/contact" class="hover:text-[var(--qm-text)] transition-colors" data-qm="nav-contact">Contact</a>
        <a href="/contact" class="rounded-md bg-[var(--qm-accent)] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="nav-cta">Free Trial</a>
      </div>
      <button type="button" class="md:hidden text-[var(--qm-text-muted)]" data-qay-click="toggle" data-qay-target="#gym-mobile-menu" data-qay-class="hidden">☰</button>
    </div>
  </nav>

  <div id="gym-mobile-menu" class="hidden border-b border-[var(--qm-border)] bg-[var(--qm-surface)] px-6 py-5 space-y-3 md:hidden">
    <a href="/classes" class="block text-sm uppercase tracking-widest text-[var(--qm-text-muted)]" data-qm="mobile-nav-classes">Classes</a>
    <a href="/about" class="block text-sm uppercase tracking-widest text-[var(--qm-text-muted)]">About</a>
    <a href="/contact" class="block text-sm font-black uppercase text-[var(--qm-accent)]">Free Trial</a>
  </div>

  <section class="relative min-h-[90vh] flex items-center" data-qay-animate="fade-in">
    <div class="absolute inset-0">
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=90&auto=format&fit=crop" alt="Gym hero" class="h-full w-full object-cover opacity-40" data-qm="hero-image" />
      <div class="absolute inset-0 bg-gradient-to-r from-[var(--qm-bg)] via-[var(--qm-bg)]/80 to-transparent"></div>
    </div>
    <div class="relative px-6 max-w-5xl mx-auto space-y-6">
      <p class="text-xs font-black uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Lagos Island · Est. 2020</p>
      <h1 class="text-[clamp(5rem,15vw,14rem)] font-black uppercase leading-[0.88] tracking-[-0.03em]" style="font-family:var(--qm-heading-font)" data-qm="hero-headline">BUILT<br/>DIFFER<span style="color:var(--qm-accent)">ENT.</span></h1>
      <p class="max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtext">No machines. No excuses. Just functional fitness, expert coaching, and a community that pushes you beyond what you thought possible.</p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a href="/contact" class="rounded-md bg-[var(--qm-accent)] px-8 py-4 text-sm font-black uppercase tracking-widest text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="hero-cta-primary">Claim Free Trial</a>
        <a href="/classes" class="rounded-md border border-[var(--qm-border)] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:border-[var(--qm-text-muted)] transition-all" data-qm="hero-cta-secondary">See Classes</a>
      </div>
    </div>
  </section>

  <section class="px-6 py-4 bg-[var(--qm-accent)]" data-qay-animate="fade-in">
    <div class="mx-auto max-w-7xl flex flex-wrap justify-around gap-4 py-5">
      <div class="text-center"><p class="text-4xl font-black text-[var(--qm-accent-text)]" style="font-family:var(--qm-heading-font)" data-qm="badge-1-number">500+</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent-text)]/70" data-qm="badge-1-label">Active Members</p></div>
      <div class="text-center"><p class="text-4xl font-black text-[var(--qm-accent-text)]" style="font-family:var(--qm-heading-font)" data-qm="badge-2-number">30+</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent-text)]/70" data-qm="badge-2-label">Classes Per Week</p></div>
      <div class="text-center"><p class="text-4xl font-black text-[var(--qm-accent-text)]" style="font-family:var(--qm-heading-font)" data-qm="badge-3-number">12</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent-text)]/70" data-qm="badge-3-label">Expert Coaches</p></div>
    </div>
  </section>

  <section class="px-6 py-20" data-qay-animate="slide-up">
    <div class="mx-auto max-w-7xl">
      <p class="text-xs font-black uppercase tracking-[0.4em] text-[var(--qm-accent)] mb-3" data-qm="classes-eyebrow">Training</p>
      <h2 class="text-5xl font-black uppercase mb-12" style="font-family:var(--qm-heading-font)" data-qm="classes-heading">What We Train</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] overflow-hidden group hover:border-[var(--qm-accent)] transition-colors">
          <div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85&auto=format&fit=crop" alt="CrossFit" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="class-image-1" /></div>
          <div class="p-6 space-y-2"><h3 class="text-2xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="class-name-1">CrossFit WOD</h3><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="class-desc-1">Daily Workout of the Day. Varied functional movements at high intensity. Scales for all levels.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="class-schedule-1">Mon–Sat · 6am, 9am, 6pm</p></div>
        </article>
        <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] overflow-hidden group hover:border-[var(--qm-accent)] transition-colors">
          <div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=85&auto=format&fit=crop" alt="Olympic lifting" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="class-image-2" /></div>
          <div class="p-6 space-y-2"><h3 class="text-2xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="class-name-2">Olympic Lifting</h3><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="class-desc-2">Snatch and clean & jerk technique. Build explosive power and perfect your mechanics.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="class-schedule-2">Tue & Thu · 7am, 7pm</p></div>
        </article>
        <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] overflow-hidden group hover:border-[var(--qm-accent)] transition-colors">
          <div class="aspect-[4/3] overflow-hidden"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=85&auto=format&fit=crop" alt="Gymnastics" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-qm="class-image-3" /></div>
          <div class="p-6 space-y-2"><h3 class="text-2xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="class-name-3">Gymnastics Skills</h3><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="class-desc-3">Handstands, muscle-ups, ring work. Master bodyweight strength and control.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="class-schedule-3">Sat · 8am, 10am</p></div>
        </article>
      </div>
      <div class="text-center mt-10"><a href="/classes" class="inline-flex rounded-md border border-[var(--qm-border)] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)] transition-all" data-qm="classes-see-all">Full Schedule →</a></div>
    </div>
  </section>

  <section class="px-6 py-20 bg-[var(--qm-surface)]" data-qay-animate="scroll-reveal">
    <div class="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <p class="text-xs font-black uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="membership-eyebrow">Membership</p>
        <h2 class="text-5xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="membership-heading">Pick Your Plan</h2>
        <div class="space-y-4">
          <div class="rounded-xl border border-[var(--qm-border)] p-5 hover:border-[var(--qm-accent)] transition-colors space-y-1">
            <div class="flex justify-between"><h3 class="font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="plan-1-name">Starter</h3><span class="font-black text-[var(--qm-accent)]" data-qm="plan-1-price">₦35,000/mo</span></div>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="plan-1-desc">8 classes per month. Access to WOD and gymnastics.</p>
          </div>
          <div class="rounded-xl border-2 border-[var(--qm-accent)] bg-[var(--qm-accent)]/5 p-5 space-y-1">
            <div class="flex justify-between"><h3 class="font-bold uppercase" style="font-family:var(--qm-heading-font)" data-qm="plan-2-name">Unlimited <span style="color:var(--qm-accent)">★</span></h3><span class="font-black text-[var(--qm-accent)]" data-qm="plan-2-price">₦60,000/mo</span></div>
            <p class="text-sm text-[var(--qm-text-muted)]" data-qm="plan-2-desc">Unlimited classes. All disciplines. Open gym access. Nutrition coaching included.</p>
          </div>
        </div>
        <a href="/contact" class="inline-flex rounded-md bg-[var(--qm-accent)] px-8 py-4 text-sm font-black uppercase tracking-widest text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="membership-cta">Get Started Free</a>
      </div>
      <div class="aspect-[4/5] overflow-hidden rounded-2xl"><img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1000&q=85&auto=format&fit=crop" alt="Member training" class="h-full w-full object-cover" data-qm="membership-image" /></div>
    </div>
  </section>

  <footer class="border-t border-[var(--qm-border)] px-6 py-10">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--qm-text-muted)]">
      <a href="/" class="text-2xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="footer-brand">IRON<span style="color:var(--qm-accent)">FORGE</span></a>
      <div class="flex flex-wrap gap-6"><a href="/classes" class="hover:text-[var(--qm-text)]">Classes</a><a href="/about" class="hover:text-[var(--qm-text)]">About</a><a href="/contact" class="hover:text-[var(--qm-text)]">Join</a></div>
      <p data-qm="footer-copy">© 2025 IronForge. Lagos Island. All rights reserved.</p>
    </div>
  </footer>
</main>
</div>

<div data-qay-page="Classes" data-qay-slug="/classes">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="brand-name">IRON<span style="color:var(--qm-accent)">FORGE</span></a><a href="/contact" class="rounded-md bg-[var(--qm-accent)] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--qm-accent-text)]" data-qm="nav-cta">Free Trial</a></div></nav>
  <section class="mx-auto max-w-6xl px-6 py-24" data-qay-animate="fade-in">
    <p class="text-xs font-black uppercase tracking-[0.4em] text-[var(--qm-accent)] mb-4" data-qm="schedule-eyebrow">Class Schedule</p>
    <h1 class="text-6xl font-black uppercase mb-16" style="font-family:var(--qm-heading-font)" data-qm="schedule-heading">What We Train</h1>
    <div class="grid gap-4 md:grid-cols-2">
      <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] p-6 space-y-3 hover:border-[var(--qm-accent)] transition-colors"><h2 class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="full-class-1">CrossFit WOD</h2><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="full-class-desc-1">Varied functional movements at high intensity. Every day is different. All fitness levels welcome — coaches scale every workout.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="full-class-schedule-1">Mon–Sat · 6am · 9am · 12pm · 6pm</p></article>
      <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] p-6 space-y-3 hover:border-[var(--qm-accent)] transition-colors"><h2 class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="full-class-2">Olympic Lifting</h2><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="full-class-desc-2">Technique-focused sessions for snatch and clean & jerk. Suitable for intermediate and advanced athletes.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="full-class-schedule-2">Tue & Thu · 7am & 7pm</p></article>
      <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] p-6 space-y-3 hover:border-[var(--qm-accent)] transition-colors"><h2 class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="full-class-3">Gymnastics Skills</h2><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="full-class-desc-3">Handstands, pull-ups, muscle-ups, ring dips. Master your bodyweight. Open to all levels with progressions for beginners.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="full-class-schedule-3">Sat · 8am & 10am</p></article>
      <article class="rounded-xl bg-[var(--qm-surface)] border border-[var(--qm-border)] p-6 space-y-3 hover:border-[var(--qm-accent)] transition-colors"><h2 class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="full-class-4">Open Gym</h2><p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="full-class-desc-4">Unlimited membership holders get unrestricted access to the gym floor. Train on your terms, any time we are open.</p><p class="text-xs font-bold uppercase tracking-widest text-[var(--qm-accent)]" data-qm="full-class-schedule-4">Mon–Sun · 5am–10pm</p></article>
    </div>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 IronForge · Lagos Island</footer>
</main>
</div>

<div data-qay-page="Contact" data-qay-slug="/contact">
<main class="bg-[var(--qm-bg)] text-[var(--qm-text)]" style="font-family:var(--qm-body-font)">
  <nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-6 py-4 backdrop-blur-xl"><div class="mx-auto flex max-w-7xl items-center justify-between"><a href="/" class="text-3xl font-black uppercase" style="font-family:var(--qm-heading-font)" data-qm="brand-name">IRON<span style="color:var(--qm-accent)">FORGE</span></a></div></nav>
  <section class="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-14 items-center" data-qay-animate="fade-in">
    <div class="space-y-6"><p class="text-xs font-black uppercase tracking-[0.4em] text-[var(--qm-accent)]" data-qm="join-eyebrow">Join Us</p><h1 class="text-5xl font-black uppercase leading-tight" style="font-family:var(--qm-heading-font)" data-qm="join-heading">Start Your Free Trial Today.</h1><p class="text-base leading-8 text-[var(--qm-text-muted)]" data-qm="join-body">First class is always free. No sign-up fee. No long-term commitment required. Just show up and we'll take care of the rest.</p><div class="space-y-2 text-sm text-[var(--qm-text-muted)]"><p data-qm="join-address">14 Kofo Abayomi St, Victoria Island, Lagos</p><p data-qm="join-phone">+234 (0) 812 IRONFORGE</p></div></div>
    <form class="space-y-4 rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-8"><input name="name" placeholder="Your name" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text)] placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="email" type="email" placeholder="Email address" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><input name="phone" type="tel" placeholder="Phone number" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm placeholder:text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors" /><select name="class" class="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-bg)] px-4 py-3 text-sm text-[var(--qm-text-muted)] focus:border-[var(--qm-accent)] focus:outline-none transition-colors"><option>CrossFit WOD</option><option>Olympic Lifting</option><option>Gymnastics Skills</option><option>Open Gym Tour</option></select><button type="submit" class="w-full rounded-xl bg-[var(--qm-accent)] py-4 text-sm font-black uppercase tracking-widest text-[var(--qm-accent-text)] hover:opacity-85 transition-opacity" data-qm="join-submit">Book My Free Class</button></form>
  </section>
  <footer class="border-t border-[var(--qm-border)] px-6 py-8 text-sm text-center text-[var(--qm-text-muted)]" data-qm="footer-copy">© 2025 IronForge · Lagos Island</footer>
</main>
</div>
$tpl7$,
  '[{"name":"Home","slug":"/"},{"name":"Classes","slug":"/classes"},{"name":"Contact","slug":"/contact"}]'::jsonb,
  'fitness', 'dark-vibrant',
  ARRAY['fitness','gym','crossfit','sports','dark','yellow-accent','barlow','bold','multi-page','classes','membership','training','health','workout','athletic'],
  '{"hasCms":false,"hasCommerce":false,"hasAuth":false,"hasMultiPage":true,"pageCount":3}'::jsonb,
  '{"brand-name":"IRONFORGE","hero-eyebrow":"Lagos Island · Est. 2020","hero-headline":"BUILT DIFFERENT.","hero-cta-primary":"Claim Free Trial","class-name-1":"CrossFit WOD","plan-2-price":"₦60,000/mo"}'::jsonb,
  '[{"slug":"/","name":"Home","purpose":"homepage"},{"slug":"/classes","name":"Classes","purpose":"services"},{"slug":"/contact","name":"Contact","purpose":"contact"}]'::jsonb,
  '{"collectionType":"classes","sampleItems":[{"title":"CrossFit WOD","subtitle":"Functional movements at high intensity","price":"Included"},{"title":"Olympic Lifting","subtitle":"Snatch & clean and jerk technique","price":"Included"},{"title":"Gymnastics Skills","subtitle":"Handstands, muscle-ups, ring work","price":"Included"}]}'::jsonb,
  'qay', true, true, 82
);
