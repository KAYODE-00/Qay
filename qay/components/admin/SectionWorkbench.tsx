'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  BookOpen,
  FolderOpen,
  Monitor,
  Globe,
  Save,
  Loader2,
  Sparkles,
  Diamond,
  LayoutGrid,
  PenLine,
  ShoppingCart,
  ChevronDown,
  Scroll,
} from 'lucide-react';
import type { AssemblyResult, SectionType, SiteType } from '@/qay/lib/section-library/types';

type SectionWorkbenchProps = {
  initialPrompt: string;
  assembly: AssemblyResult;
  siteTypes: SiteType[];
  sectionTypes: SectionType[];
};

type SaveState = 'idle' | 'saving' | 'success' | 'error';
type ActiveTab = 'editor' | 'reference' | 'catalog';

type CatalogSection = {
  id?: string | null;
  siteType: SiteType;
  sectionType: string;
  index: number;
  label: string;
  manifestLine: string;
  html: string;
};

/* ─── Template Presets ─── */

const SECTION_TEMPLATES: Record<string, { label: string; description: string; html: string }[]> = {
  nav: [
    {
      label: 'Sticky glassmorphism navbar',
      description: 'Frosted glass nav with mobile toggle',
      html: `<nav class="sticky top-0 z-40 border-b border-white/10 bg-white/5 px-5 py-4 text-white backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between">
    <a href="/" class="text-lg font-black tracking-tight" data-qm="brand-name">Brand</a>
    <div class="hidden items-center gap-6 text-sm font-medium md:flex">
      <a href="/about" class="transition hover:text-[var(--qm-accent)]">About</a>
      <a href="/services" class="transition hover:text-[var(--qm-accent)]">Services</a>
      <a href="/contact" class="rounded-full bg-[var(--qm-accent)] px-5 py-2.5 text-[var(--qm-accent-text)]">Contact</a>
    </div>
    <button type="button" class="rounded-lg border border-white/20 px-3 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#mobile-menu" data-qay-class="hidden">Menu</button>
  </div>
  <div id="mobile-menu" class="hidden fixed inset-x-4 top-16 z-50 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/90 p-5 shadow-2xl backdrop-blur-lg md:hidden">
    <a href="/about">About</a>
    <a href="/services">Services</a>
    <a href="/contact">Contact</a>
  </div>
</nav>`,
    },
    {
      label: 'Centered brand nav',
      description: 'Brand centered with links on both sides',
      html: `<nav class="sticky top-0 z-40 border-b border-[var(--qm-border)] bg-[var(--qm-bg)]/95 px-5 py-4 text-[var(--qm-text)] backdrop-blur">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6">
    <div class="hidden gap-5 text-sm md:flex"><a href="/about">About</a><a href="/work">Work</a></div>
    <a href="/" class="text-xl font-black" data-qm="brand-name">Brand</a>
    <div class="hidden gap-5 text-sm md:flex"><a href="/services">Services</a><a href="/contact">Contact</a></div>
    <button type="button" class="border border-[var(--qm-border)] px-3 py-2 text-sm md:hidden" data-qay-click="toggle" data-qay-target="#center-nav-mobile" data-qay-class="hidden">Menu</button>
  </div>
</nav>`,
    },
  ],
  hero: [
    {
      label: 'Full-width hero with overlay',
      description: 'Dramatic full-screen image hero with text overlay',
      html: `<section class="relative flex min-h-[90vh] items-center overflow-hidden bg-black text-white">
  <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&auto=format&q=85" alt="Hero" class="absolute inset-0 size-full object-cover opacity-40" />
  <div class="relative z-10 px-6 py-24 md:px-16" data-qay-animate="slide-up">
    <p class="text-xs font-bold uppercase tracking-[0.3em] text-white/60" data-qm="hero-eyebrow">Premium Brand</p>
    <h1 class="mt-5 max-w-4xl text-6xl font-black leading-[0.95] md:text-8xl" data-qm="hero-title">A bold headline that demands attention.</h1>
    <p class="mt-6 max-w-xl text-lg leading-8 text-white/70" data-qm="hero-subtitle">Supporting copy that tells the story.</p>
    <a href="/contact" class="mt-9 inline-flex rounded-full bg-[var(--qm-accent)] px-8 py-4 font-bold text-[var(--qm-accent-text)]">Get Started</a>
  </div>
</section>`,
    },
    {
      label: 'Split hero with image grid',
      description: '50/50 text and image grid layout',
      html: `<section class="bg-[var(--qm-bg)] px-5 py-24 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
    <div data-qay-animate="slide-up">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--qm-accent)]" data-qm="hero-eyebrow">Welcome</p>
      <h1 class="mt-5 text-5xl font-black leading-[0.95] md:text-7xl" data-qm="hero-title">Your headline here.</h1>
      <p class="mt-6 max-w-lg text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="hero-subtitle">A supporting line of copy.</p>
      <a href="/contact" class="mt-9 inline-flex rounded-xl bg-[var(--qm-accent)] px-7 py-4 font-bold text-[var(--qm-accent-text)]">Start Now</a>
    </div>
    <div class="grid grid-cols-2 gap-4" data-qay-animate="stagger-children">
      <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&q=85" alt="" class="h-64 w-full rounded-2xl object-cover" />
      <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&q=85" alt="" class="mt-8 h-64 w-full rounded-2xl object-cover" />
    </div>
  </div>
</section>`,
    },
  ],
  features: [
    {
      label: 'Bento feature grid',
      description: 'Modern bento box layout for features',
      html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Features</p>
    <h2 class="mt-4 max-w-3xl text-4xl font-black" data-qm="features-title">Everything you need.</h2>
    <div class="mt-10 grid gap-4 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 md:row-span-2" data-qay-hover="lift">
        <p class="text-4xl font-black text-[var(--qm-accent)]">01</p>
        <h3 class="mt-6 text-xl font-bold">Feature One</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">A concrete benefit visitors can understand quickly.</p>
      </article>
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="lift">
        <h3 class="text-xl font-bold">Feature Two</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">Another clear, useful benefit.</p>
      </article>
      <article class="rounded-3xl bg-[var(--qm-accent)] p-6 text-[var(--qm-accent-text)]" data-qay-hover="lift">
        <h3 class="text-xl font-bold">Feature Three</h3>
        <p class="mt-3 text-sm leading-6 opacity-80">A highlighted premium feature.</p>
      </article>
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6 md:col-span-2" data-qay-hover="lift">
        <h3 class="text-xl font-bold">Feature Four</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--qm-text-muted)]">A wider feature card with more room for detail.</p>
      </article>
    </div>
  </div>
</section>`,
    },
  ],
  footer: [
    {
      label: 'Multi-column footer',
      description: 'Brand, links, and social in columns',
      html: `<footer class="border-t border-[var(--qm-border)] bg-[var(--qm-bg)] px-5 py-14 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
    <div>
      <p class="text-xl font-black" data-qm="footer-brand">Brand</p>
      <p class="mt-4 max-w-xs text-sm leading-6 text-[var(--qm-text-muted)]">A brief description of the brand and what it stands for.</p>
    </div>
    <div class="flex flex-col gap-3 text-sm"><p class="font-bold">Pages</p><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a></div>
    <div class="flex flex-col gap-3 text-sm"><p class="font-bold">Legal</p><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
    <div class="flex flex-col gap-3 text-sm"><p class="font-bold">Social</p><a href="#">Twitter</a><a href="#">Instagram</a><a href="#">LinkedIn</a></div>
  </div>
  <div class="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-[var(--qm-border)] pt-6 text-xs text-[var(--qm-text-muted)]">
    <p>&copy; 2025 <span data-qm="footer-brand">Brand</span></p>
    <p>Built with QAY</p>
  </div>
</footer>`,
    },
  ],
  about: [
    {
      label: 'Story split section',
      description: 'Brand story with image and text',
      html: `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center" data-qay-animate="slide-up">
    <div>
      <p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">About</p>
      <h2 class="mt-5 text-4xl font-black" data-qm="about-title">The story behind the brand.</h2>
      <p class="mt-5 text-lg leading-8 text-[var(--qm-text-muted)]" data-qm="about-copy">Share the origin, mission, and values that drive this brand forward.</p>
    </div>
    <div class="overflow-hidden rounded-3xl" data-qay-hover="img-zoom">
      <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&q=85" alt="About" class="h-[480px] w-full object-cover" />
    </div>
  </div>
</section>`,
    },
  ],
  contact: [
    {
      label: 'Contact form with info',
      description: 'Contact form beside info cards',
      html: `<section class="bg-[var(--qm-bg)] px-5 py-20 text-[var(--qm-text)]">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]" data-qay-animate="slide-up">
    <div>
      <p class="text-xs font-bold uppercase tracking-[0.28em] text-[var(--qm-accent)]">Contact</p>
      <h2 class="mt-5 text-5xl font-black" data-qm="contact-title">Get in touch.</h2>
      <p class="mt-5 text-[var(--qm-text-muted)]">We'd love to hear from you.</p>
    </div>
    <form class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-surface)] p-6">
      <input name="name" placeholder="Name" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" />
      <input name="email" placeholder="Email" class="mb-3 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3" />
      <textarea name="message" placeholder="Message" class="h-36 w-full rounded-xl border border-[var(--qm-border)] bg-transparent px-4 py-3"></textarea>
      <button type="submit" class="mt-4 rounded-xl bg-[var(--qm-accent)] px-6 py-4 font-bold text-[var(--qm-accent-text)]">Send message</button>
    </form>
  </div>
</section>`,
    },
  ],
  cta: [
    {
      label: 'Gradient CTA banner',
      description: 'Full-width gradient call to action',
      html: `<section class="bg-gradient-to-br from-[var(--qm-accent)] to-[var(--qm-primary)] px-5 py-20 text-center text-white">
  <div class="mx-auto max-w-3xl" data-qay-animate="scale-in">
    <h2 class="text-4xl font-black md:text-5xl" data-qm="cta-title">Ready to get started?</h2>
    <p class="mt-4 text-lg opacity-80">Join thousands of brands building with QAY.</p>
    <a href="/contact" class="mt-8 inline-flex rounded-full bg-white px-8 py-4 font-bold text-[var(--qm-primary)]">Start your project</a>
  </div>
</section>`,
    },
  ],
  testimonials: [
    {
      label: 'Testimonial cards grid',
      description: 'Grid of testimonial cards with avatars',
      html: `<section class="bg-[var(--qm-surface)] px-5 py-20 text-[var(--qm-text)]">
  <div class="mx-auto max-w-7xl">
    <h2 class="text-center text-3xl font-black">What people say</h2>
    <div class="mt-10 grid gap-5 md:grid-cols-3" data-qay-animate="stagger-children">
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="lift">
        <p class="text-sm leading-7 text-[var(--qm-text-muted)]" data-qm="testimonial-quote">"An incredible experience from start to finish."</p>
        <p class="mt-4 text-sm font-bold">— Jane Doe, CEO</p>
      </article>
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="lift">
        <p class="text-sm leading-7 text-[var(--qm-text-muted)]">"Professional, fast, and beautifully designed."</p>
        <p class="mt-4 text-sm font-bold">— John Smith, Founder</p>
      </article>
      <article class="rounded-3xl border border-[var(--qm-border)] bg-[var(--qm-bg)] p-6" data-qay-hover="lift">
        <p class="text-sm leading-7 text-[var(--qm-text-muted)]">"Exceeded every expectation we had."</p>
        <p class="mt-4 text-sm font-bold">— Sarah Lee, Director</p>
      </article>
    </div>
  </div>
</section>`,
    },
  ],
};

/* ─── Reference Guide Data ─── */

const REFERENCE_SECTIONS = [
  {
    title: 'Entrance Animations',
    icon: 'sparkles',
    description: 'Add scroll-triggered entrance animations to any element.',
    attribute: 'data-qay-animate',
    options: [
      { value: 'fade-in', description: 'Fades from transparent to visible' },
      { value: 'slide-up', description: 'Slides upward from below' },
      { value: 'slide-left', description: 'Slides in from the right' },
      { value: 'slide-right', description: 'Slides in from the left' },
      { value: 'scale-in', description: 'Scales from small to normal' },
      { value: 'scroll-reveal', description: 'Reveals on scroll intersection' },
      { value: 'luxe-reveal', description: 'Premium clip-path reveal' },
      { value: 'luxe-asym-reveal', description: 'Asymmetric clip reveal' },
      { value: 'line-grow', description: 'Line grows from center' },
      { value: 'stagger-children', description: 'Animates child elements one by one' },
      { value: 'sidebar-slide', description: 'Sidebar slide animation' },
      { value: 'luxe-dock-reveal', description: 'Dock-style reveal' },
    ],
    example: `<section data-qay-animate="slide-up" data-qay-duration="0.6" data-qay-y="32" data-qay-ease="power2.out">
  <!-- content slides up on scroll -->
</section>`,
    modifiers: [
      { attr: 'data-qay-duration', desc: 'Animation duration in seconds (e.g. "0.6")' },
      { attr: 'data-qay-y', desc: 'Vertical offset in pixels (e.g. "32")' },
      { attr: 'data-qay-x', desc: 'Horizontal offset in pixels (e.g. "48")' },
      { attr: 'data-qay-ease', desc: 'Easing function (e.g. "power2.out", "expo.out", "back.out(1.2)")' },
    ],
  },
  {
    title: 'Hover Effects',
    icon: 'diamond',
    description: 'Add interactive hover micro-animations to cards, buttons, and images.',
    attribute: 'data-qay-hover',
    options: [
      { value: 'lift', description: 'Lifts element up with shadow' },
      { value: 'scale', description: 'Scales element slightly larger' },
      { value: 'scale-btn', description: 'Button-specific scale pulse' },
      { value: 'luxe-lift', description: 'Premium lift with glow' },
      { value: 'img-zoom', description: 'Image zoom on hover' },
      { value: 'border-gold', description: 'Border turns gold on hover' },
      { value: 'glow', description: 'Soft glow around element' },
    ],
    example: `<article data-qay-hover="luxe-lift" data-qay-hover-duration="0.24">
  <!-- card lifts on hover -->
</article>`,
    modifiers: [
      { attr: 'data-qay-hover-duration', desc: 'Hover animation speed (e.g. "0.24")' },
    ],
  },
  {
    title: 'Click / Toggle Actions',
    icon: 'layout-grid',
    description: 'Toggle visibility of elements on click (mobile menus, dropdowns, accordions).',
    attribute: 'data-qay-click',
    options: [
      { value: 'toggle', description: 'Toggles a CSS class on the target element' },
    ],
    example: `<!-- Trigger button -->
<button data-qay-click="toggle" data-qay-target="#mobile-menu" data-qay-class="hidden">
  Menu
</button>

<!-- Target element -->
<div id="mobile-menu" class="hidden">
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</div>`,
    modifiers: [
      { attr: 'data-qay-target', desc: 'CSS selector of the target element (e.g. "#mobile-menu")' },
      { attr: 'data-qay-class', desc: 'CSS class to toggle (e.g. "hidden")' },
    ],
  },
  {
    title: 'Editable Text Zones',
    icon: 'pen-line',
    description: 'Mark text elements for AI content injection and user editing.',
    attribute: 'data-qm',
    options: [
      { value: 'brand-name', description: 'Primary brand/business name' },
      { value: 'hero-title', description: 'Main hero headline' },
      { value: 'hero-subtitle', description: 'Hero supporting text' },
      { value: 'hero-eyebrow', description: 'Small label above hero title' },
      { value: 'about-title', description: 'About section heading' },
      { value: 'about-copy', description: 'About section body text' },
      { value: 'features-title', description: 'Features section heading' },
      { value: 'contact-title', description: 'Contact section heading' },
      { value: 'cta-title', description: 'CTA section heading' },
      { value: 'footer-brand', description: 'Brand name in footer' },
    ],
    example: `<h1 data-qm="hero-title">Your headline here</h1>
<p data-qm="hero-subtitle">Your subtitle here</p>`,
    modifiers: [],
  },
  {
    title: 'E-commerce Hooks',
    icon: 'shopping-cart',
    description: 'Commerce-specific attributes for product cards, carts, and checkout flows.',
    attribute: 'data-qay-commerce',
    options: [
      { value: 'product-card', description: 'Wraps a product card' },
      { value: 'product-image', description: 'Product image container' },
      { value: 'product-title', description: 'Product name text' },
      { value: 'product-price', description: 'Product price display' },
      { value: 'product-description', description: 'Product description' },
      { value: 'product-grid', description: 'Grid container of products' },
      { value: 'add-to-cart', description: 'Add to cart button' },
      { value: 'cart-button', description: 'Cart icon/button in nav' },
      { value: 'cart-drawer', description: 'Slide-out cart panel' },
      { value: 'cart-items', description: 'Cart items container' },
      { value: 'cart-close', description: 'Close cart button' },
      { value: 'checkout-button', description: 'Proceed to checkout' },
      { value: 'remove-from-cart', description: 'Remove item from cart' },
    ],
    example: `<article data-qay-commerce="product-card" data-qay-product-id="prod-001">
  <div data-qay-commerce="product-image">
    <img src="..." alt="Product" />
  </div>
  <h3 data-qay-commerce="product-title">Product Name</h3>
  <p data-qay-commerce="product-price">$49</p>
  <button data-qay-commerce="add-to-cart" data-qay-product-id="prod-001">
    Add to Cart
  </button>
</article>`,
    modifiers: [
      { attr: 'data-qay-product-id', desc: 'Unique product identifier' },
      { attr: 'data-qay-product-handle', desc: 'URL-safe product slug' },
      { attr: 'data-qay-cart-label', desc: 'Label text for cart button' },
    ],
  },
  {
    title: 'Scroll-Triggered Animations',
    icon: 'scroll',
    description: 'Add animations that expand, shrink, parallax, or fade in while scrolling.',
    attribute: 'data-qay-scroll',
    options: [
      { value: 'expand', description: 'Scales up slightly as element enters viewport' },
      { value: 'shrink', description: 'Scales down slightly as element enters viewport' },
      { value: 'parallax', description: 'Parallax background offset effect' },
      { value: 'fade-in', description: 'Fades opacity from 0 to 100 while scrolling' },
    ],
    example: `<div data-qay-scroll="expand" data-qay-scroll-start="top bottom" data-qay-scroll-end="center center" data-qay-scale="0.85">
  <img src="..." alt="Scrolling expand image" />
</div>`,
    modifiers: [
      { attr: 'data-qay-scroll-start', desc: 'ScrollTrigger start position (e.g. "top bottom")' },
      { attr: 'data-qay-scroll-end', desc: 'ScrollTrigger end position (e.g. "center center")' },
      { attr: 'data-qay-scroll-scrub', desc: 'Link animation progress to scroll speed ("true", "false", or delay in seconds e.g. "1.5")' },
      { attr: 'data-qay-scale', desc: 'Initial starting scale for expand (e.g. "0.85")' },
      { attr: 'data-qay-y', desc: 'Parallax offset distance in pixels (e.g. "80")' },
    ],
  },
];

/* ─── Component ─── */

export function SectionWorkbench({ initialPrompt, assembly, siteTypes, sectionTypes }: SectionWorkbenchProps) {
  const [html, setHtml] = useState(`<section class="px-6 py-20 bg-[#0f172a] text-white">
  <div class="mx-auto max-w-5xl">
    <p class="text-sm uppercase tracking-[0.24em] text-white/50">Custom section</p>
    <h2 class="mt-4 text-5xl font-bold">A strong section headline goes here.</h2>
    <p class="mt-5 max-w-2xl text-white/70">Add useful copy, a clear layout, and QAY hooks where needed.</p>
  </div>
</section>`);
  const [siteType, setSiteType] = useState<SiteType>(assembly.siteType);
  const [sectionType, setSectionType] = useState<SectionType>('hero');
  const [label, setLabel] = useState('Premium custom section');
  const [manifestLine, setManifestLine] = useState('Premium responsive section with strong hierarchy, useful spacing, and QAY editable zones');
  const [navLinkStyle, setNavLinkStyle] = useState<'routes' | 'anchors' | 'none'>('routes');
  const [state, setState] = useState<SaveState>('idle');
  const [message, setMessage] = useState('');
  const [catalog, setCatalog] = useState<CatalogSection[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogMessage, setCatalogMessage] = useState('');
  const [sectionToDelete, setSectionToDelete] = useState<CatalogSection | null>(null);
  const [isDeletingSection, setIsDeletingSection] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [openRefSection, setOpenRefSection] = useState<number | null>(0);

  const fullPreview = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><script src="https://cdn.tailwindcss.com"></script></head><body>${html}</body></html>`, [html]);

  const fullAssemblyPreview = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><script src="https://cdn.tailwindcss.com"></script></head><body>${assembly.html}</body></html>`, [assembly.html]);

  useEffect(() => {
    let cancelled = false;
    setIsCatalogLoading(true);
    setCatalogMessage('');

    fetch(`/api/qay/sections?siteType=${encodeURIComponent(siteType)}&sectionType=${encodeURIComponent(sectionType)}`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.error || 'Could not load section catalog.');
        if (!cancelled) setCatalog(body?.data?.sections || []);
      })
      .catch((error) => {
        if (!cancelled) {
          setCatalog([]);
          setCatalogMessage(error instanceof Error ? error.message : 'Could not load section catalog.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionType, siteType]);

  async function saveSection() {
    setState('saving');
    setMessage('');

    try {
      const response = await fetch('/api/qay/admin/sections', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          siteType,
          sectionType,
          label,
          manifestLine,
          navLinkStyle,
          html,
        }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || 'Could not save section.');
      }

      setState('success');
      setMessage(`Saved section ${body.id || ''}`.trim());
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Could not save section.');
    }
  }

  async function deleteSection() {
    if (!sectionToDelete?.id) return;

    setIsDeletingSection(true);
    setCatalogMessage('');

    try {
      const response = await fetch(`/api/qay/admin/sections?id=${encodeURIComponent(sectionToDelete.id)}`, {
        method: 'DELETE',
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || 'Could not delete section.');
      }

      setCatalog((current) => current.filter((section) => section.id !== sectionToDelete.id));
      setSectionToDelete(null);
      setCatalogMessage('Section deleted. It will no longer be used by AI.');
    } catch (error) {
      setCatalogMessage(error instanceof Error ? error.message : 'Could not delete section.');
    } finally {
      setIsDeletingSection(false);
    }
  }

  function loadTemplate(template: { label: string; html: string }) {
    setHtml(template.html);
    setLabel(template.label);
    setManifestLine(`${template.label} — responsive section with QAY editable zones`);
  }

  const availableTemplates = SECTION_TEMPLATES[sectionType] || [];

  /* ─── Tab Definitions ─── */

  const REFERENCE_ICONS: Record<string, React.ReactNode> = {
    'sparkles': <Sparkles className="size-4" />,
    'diamond': <Diamond className="size-4" />,
    'layout-grid': <LayoutGrid className="size-4" />,
    'pen-line': <PenLine className="size-4" />,
    'shopping-cart': <ShoppingCart className="size-4" />,
    'scroll': <Scroll className="size-4" />,
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'editor', label: 'Code Editor', icon: <Keyboard className="size-4" /> },
    { id: 'reference', label: 'Reference Guide', icon: <BookOpen className="size-4" /> },
    { id: 'catalog', label: 'AI Catalog', icon: <FolderOpen className="size-4" /> },
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* ─── Header Stats ─── */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
          <div className="absolute -right-6 -top-6 size-20 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Site Type</p>
          <p className="mt-2 text-xl font-bold">{assembly.siteType}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
          <div className="absolute -right-6 -top-6 size-20 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Theme</p>
          <p className="mt-2 text-xl font-bold">{assembly.theme.label}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
          <div className="absolute -right-6 -top-6 size-20 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Sections Built</p>
          <p className="mt-2 text-xl font-bold">{assembly.sectionsUsed.length}</p>
        </div>
      </div>

      {/* ─── Generated Sections Tags ─── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Generated Sections</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {assembly.sectionsUsed.map((section) => (
            <span
              key={`${section.type}-${section.sectionId}`}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {section.type}: {section.sectionId}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Tab Navigation ─── */}
      <div className="flex gap-1 rounded-2xl border border-border bg-card p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Left Panel */}
        <div className="space-y-5">
          {activeTab === 'editor' && (
            <>
              {/* ─── Template Loader ─── */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Template Starter</p>
                    <p className="mt-1 text-sm text-muted-foreground">Load a pre-built section template to customize.</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Site type
                    <select
                      value={siteType} onChange={(event) => setSiteType(event.target.value as SiteType)}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    >
                      {siteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium">
                    Section type
                    <select
                      value={sectionType} onChange={(event) => setSectionType(event.target.value as SectionType)}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    >
                      {sectionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </label>
                </div>

                {availableTemplates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground">Quick templates</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {availableTemplates.map((template) => (
                        <button
                          key={template.label}
                          type="button"
                          onClick={() => loadTemplate(template)}
                          className="group/tmpl flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5"
                        >
                          <span className="text-muted-foreground transition-colors group-hover/tmpl:text-foreground">{template.label}</span>
                          <span className="rounded bg-foreground/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">{template.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Code Editor ─── */}
              <div className="rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <p className="text-sm font-semibold">Section HTML</p>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400" />
                    <span className="size-2.5 rounded-full bg-yellow-400" />
                    <span className="size-2.5 rounded-full bg-green-400" />
                  </div>
                </div>
                <textarea
                  value={html}
                  onChange={(event) => setHtml(event.target.value)}
                  rows={16}
                  spellCheck={false}
                  className="w-full resize-none bg-[#0d1117] px-5 py-4 font-mono text-xs leading-6 text-emerald-300 outline-none placeholder:text-white/20"
                  placeholder="Paste or write your section HTML here..."
                />
              </div>

              {/* ─── Meta Fields ─── */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Label
                    <input
                      value={label} onChange={(event) => setLabel(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                    />
                  </label>
                  {sectionType === 'nav' && (
                    <label className="text-sm font-medium">
                      Nav link style
                      <select
                        value={navLinkStyle}
                        onChange={(event) => setNavLinkStyle(event.target.value as 'routes' | 'anchors' | 'none')}
                        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      >
                        <option value="routes">Routes</option>
                        <option value="anchors">Anchors</option>
                        <option value="none">None</option>
                      </select>
                    </label>
                  )}
                </div>
                <label className="mt-3 block text-sm font-medium">
                  Manifest line
                  <input
                    value={manifestLine} onChange={(event) => setManifestLine(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                  />
                </label>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={saveSection}
                    disabled={state === 'saving'}
                    className="h-12 rounded-xl bg-foreground px-6 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === 'saving' ? (<><Loader2 className="mr-2 inline size-4 animate-spin" />Saving...</>) : (<><Save className="mr-2 inline size-4" />Save to Library</>)}
                  </button>
                  {message ? <p className={`text-sm ${state === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>{message}</p> : null}
                </div>
              </div>
            </>
          )}

          {activeTab === 'reference' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Developer Reference</p>
                <h2 className="mt-2 text-2xl font-bold">QAY Attribute Guide</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use these <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-xs font-medium text-foreground">data-qay-*</code> and{' '}
                  <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-xs font-medium text-foreground">data-qm</code> attributes to hook into the QAY runtime for animations, toggle interactions, editable content zones, and e-commerce features.
                </p>
              </div>

              {REFERENCE_SECTIONS.map((ref, refIndex) => (
                <div key={ref.title} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpenRefSection(openRefSection === refIndex ? null : refIndex)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-foreground/3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-foreground/5 text-base">{REFERENCE_ICONS[ref.icon] || ref.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{ref.title}</p>
                        <p className="text-xs text-muted-foreground">{ref.description}</p>
                      </div>
                    </div>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${openRefSection === refIndex ? 'rotate-180' : ''}`} />
                  </button>

                  {openRefSection === refIndex && (
                    <div className="border-t border-border px-5 pb-5 pt-4">
                      {/* Attribute */}
                      <div className="flex items-center gap-2">
                        <code className="rounded-lg bg-foreground/5 px-2.5 py-1.5 text-xs font-bold text-foreground">{ref.attribute}</code>
                      </div>

                      {/* Options */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Values</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {ref.options.map((opt) => (
                            <div
                              key={opt.value}
                              className="group/opt cursor-default rounded-xl border border-border bg-background px-3 py-2 transition-colors hover:border-foreground/20"
                              title={opt.description}
                            >
                              <code className="text-xs font-medium text-foreground">{opt.value}</code>
                              <p className="mt-0.5 text-[10px] text-muted-foreground">{opt.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Modifiers */}
                      {ref.modifiers.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modifiers</p>
                          <div className="mt-2 space-y-1.5">
                            {ref.modifiers.map((mod) => (
                              <div key={mod.attr} className="flex items-start gap-2 text-xs">
                                <code className="shrink-0 rounded bg-foreground/5 px-1.5 py-0.5 font-medium text-foreground">{mod.attr}</code>
                                <span className="text-muted-foreground">{mod.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Example */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Example</p>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-[#0d1117] p-4 text-xs leading-6 text-emerald-300">
                          <code>{ref.example}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">AI-Usable Section Catalog</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Showing designs for <strong>{siteType}</strong> / <strong>{sectionType}</strong>. These are the sections the prompt translator picks from.
                  </p>
                </div>
                <span className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {isCatalogLoading ? (<><Loader2 className="mr-1 inline size-3 animate-spin" />Loading</>) : `${catalog.length} designs`}
                </span>
              </div>

              {/* Filters */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <select
                  value={siteType} onChange={(event) => setSiteType(event.target.value as SiteType)}
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                >
                  {siteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <select
                  value={sectionType} onChange={(event) => setSectionType(event.target.value as SectionType)}
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                >
                  {sectionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {catalogMessage && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-500">
                  <svg
                    className="size-3.5 shrink-0" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                    />
                  </svg>
                  {catalogMessage}
                </div>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {catalog.slice(0, 20).map((section) => (
                  <article
                    key={`${section.sectionType}-${section.index}-${section.label}`}
                    className="group/card relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow-md"
                  >
                    <div className="relative">
                      <iframe
                        title={`${section.label} preview`}
                        srcDoc={`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><script src="https://cdn.tailwindcss.com"></script><style>html,body{margin:0;overflow:hidden;scrollbar-width:none}::-webkit-scrollbar{display:none}</style></head><body>${section.html}</body></html>`}
                        scrolling="no"
                        className="pointer-events-none h-36 w-full bg-white"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{section.label}</p>
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{section.sectionType} · #{section.index}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setHtml(section.html);
                            setLabel(section.label);
                            setManifestLine(section.manifestLine);
                            setActiveTab('editor');
                          }}
                          className="rounded-lg bg-foreground/5 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors duration-200 hover:bg-foreground hover:text-background"
                        >
                          Load
                        </button>
                        {section.id ? (
                          <button
                            type="button"
                            onClick={() => setSectionToDelete(section)}
                            className="rounded-lg bg-red-500/8 p-1.5 text-red-500/70 transition-colors duration-200 hover:bg-red-500 hover:text-white"
                            title="Delete section"
                          >
                            <svg
                              className="size-3" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round" strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel — Preview */}
        <div className="space-y-5">
          {/* Custom Section Preview */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Monitor className="size-4" />
                {activeTab === 'editor' ? 'Section Preview' : 'Generated Page Preview'}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <iframe
              title="Section preview"
              srcDoc={activeTab === 'editor' ? fullPreview : fullAssemblyPreview}
              className="h-[560px] w-full bg-white"
            />
          </div>

          {/* Full Page Preview */}
          {activeTab === 'editor' && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <p className="flex items-center gap-2 text-sm font-semibold"><Globe className="size-4" />Full Page Preview</p>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-yellow-400" />
                  <span className="size-2.5 rounded-full bg-green-400" />
                </div>
              </div>
              <iframe
                title="Generated page assembly preview"
                srcDoc={fullAssemblyPreview}
                className="h-[560px] w-full bg-white"
              />
            </div>
          )}

          {/* Test Prompt (always visible) */}
          <form className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:flex-row">
            <input
              name="prompt"
              defaultValue={initialPrompt}
              className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
              placeholder="Test a prompt..."
            />
            <button className="h-12 rounded-xl bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90" type="submit">
              Test prompt
            </button>
          </form>
        </div>
      </div>

      {/* ─── Delete Modal ─── */}
      {sectionToDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />
            <div className="p-6">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-full bg-red-500/10">
                  <svg
                    className="size-4 text-red-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round" strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-red-500">Delete section</p>
                </div>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">Remove this section from AI selection?</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This will deactivate <span className="font-medium text-foreground">{sectionToDelete.label}</span> for {sectionToDelete.siteType} / {sectionToDelete.sectionType}.
                Built-in sections cannot be deleted here, only saved admin sections.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSectionToDelete(null)}
                  disabled={isDeletingSection}
                  className="h-10 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteSection}
                  disabled={isDeletingSection}
                  className="h-10 rounded-xl bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md disabled:opacity-60"
                >
                  {isDeletingSection ? 'Deleting...' : 'Delete section'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
