import type { TemplateVariables } from './types';

// Palette definitions (modern tailwind colors)
export interface SectionStyle {
  bg: string;          // Main background classes
  bgInner: string;     // Inner container/card background
  text: string;        // Text colors
  textMuted: string;   // Secondary text colors
  accentText: string;  // Accent text color (e.g. text-indigo-600 dark:text-indigo-400)
  accentBg: string;    // Accent background (e.g. bg-indigo-600 dark:bg-indigo-500)
  accentHoverBg: string; // Accent hover background
  border: string;      // Border classes
  rounded: string;     // Roundness modifier
  hover: string;       // Hover interaction attributes
  animate: string;     // Entrance animation attributes
  scroll: string;      // Scroll interaction attributes
  iconColor: string;   // Icon fill/stroke colors
}

const PALETTES = [
  { name: 'indigo', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600', hoverBg: 'hover:bg-indigo-700 dark:hover:bg-indigo-600', icon: 'text-indigo-500' },
  { name: 'emerald', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600', hoverBg: 'hover:bg-emerald-700 dark:hover:bg-emerald-600', icon: 'text-emerald-500' },
  { name: 'amber', text: 'text-amber-600 dark:text-amber-500', bg: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600', hoverBg: 'hover:bg-amber-600 dark:hover:bg-amber-600', icon: 'text-amber-500' },
  { name: 'rose', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600', hoverBg: 'hover:bg-rose-700 dark:hover:bg-rose-600', icon: 'text-rose-500' },
  { name: 'violet', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600', hoverBg: 'hover:bg-violet-700 dark:hover:bg-violet-600', icon: 'text-violet-500' },
  { name: 'sky', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600', hoverBg: 'hover:bg-sky-700 dark:hover:bg-sky-600', icon: 'text-sky-500' },
  { name: 'zinc', text: 'text-zinc-900 dark:text-zinc-100', bg: 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200', hoverBg: 'hover:bg-zinc-800 dark:hover:bg-zinc-200', icon: 'text-zinc-500' }
];

const BACKGROUNDS = [
  // 0. Light primary
  { bg: 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white', bgInner: 'bg-zinc-50 dark:bg-zinc-900', text: 'text-zinc-900 dark:text-white', muted: 'text-zinc-500 dark:text-zinc-400', border: 'border-zinc-200/50 dark:border-zinc-800/50' },
  // 1. Sleek grey/dark primary
  { bg: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white', bgInner: 'bg-white dark:bg-zinc-950', text: 'text-zinc-900 dark:text-white', muted: 'text-zinc-500 dark:text-zinc-400', border: 'border-zinc-200/60 dark:border-zinc-800/80' },
  // 2. High-contrast premium dark
  { bg: 'bg-zinc-950 text-white', bgInner: 'bg-zinc-900/50 border border-zinc-800/60', text: 'text-white', muted: 'text-zinc-400', border: 'border-zinc-850' },
  // 3. Futuristic glassmorphic tint
  { bg: 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white', bgInner: 'bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md', text: 'text-zinc-900 dark:text-white', muted: 'text-zinc-500 dark:text-zinc-400', border: 'border-zinc-200/50 dark:border-zinc-800/50' }
];

const ROUNDNESS = ['rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-[2rem]', 'rounded-none'];
const HOVERS = [
  'data-qay-hover="lift"',
  'data-qay-hover="glow"',
  'data-qay-hover="scale"',
  'data-qay-hover="luxe-lift"'
];

const ENTRANCE_ANIMS = [
  'data-qay-animate="slide-up" data-qay-duration="0.75" data-qay-y="32"',
  'data-qay-animate="fade-in" data-qay-duration="0.6"',
  'data-qay-animate="scale-in" data-qay-duration="0.8" data-qay-ease="back.out(1.1)"',
  'data-qay-animate="luxe-reveal" data-qay-duration="1.2" data-qay-y="60"'
];

const SCROLL_ANIMS = [
  'data-qay-scroll="expand" data-qay-scroll-start="top bottom" data-qay-scroll-end="center center" data-qay-scale="0.85"',
  'data-qay-scroll="parallax" data-qay-y="50"',
  'data-qay-scroll="shrink" data-qay-scroll-start="top bottom" data-qay-scroll-end="bottom top"',
  'data-qay-scroll="fade-in" data-qay-scroll-start="top 90%"'
];

export function getStyleForIndex(index: number): SectionStyle {
  const pal = PALETTES[index % PALETTES.length];
  const bg = BACKGROUNDS[index % BACKGROUNDS.length];
  const rounded = ROUNDNESS[index % ROUNDNESS.length];
  const hover = HOVERS[index % HOVERS.length];
  const animate = ENTRANCE_ANIMS[index % ENTRANCE_ANIMS.length];
  const scroll = SCROLL_ANIMS[index % SCROLL_ANIMS.length];

  return {
    bg: bg.bg,
    bgInner: bg.bgInner,
    text: bg.text,
    textMuted: bg.muted,
    accentText: pal.text,
    accentBg: pal.bg,
    accentHoverBg: pal.hoverBg,
    border: bg.border,
    rounded,
    hover,
    animate,
    scroll,
    iconColor: pal.icon
  };
}

// Inline SVG Icons mapped for reuse
export const ICONS = {
  check: (colorClass = 'text-indigo-500') => 
    `<svg class="size-5 shrink-0 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
  
  arrowRight: (colorClass = 'size-4') => 
    `<svg class="${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  
  star: (colorClass = 'text-amber-400') => 
    `<svg class="size-5 ${colorClass}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`,
  
  lock: (colorClass = 'text-zinc-500') => 
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  
  user: (colorClass = 'text-zinc-500') => 
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,

  quote: (colorClass = 'text-indigo-500/20') =>
    `<svg class="${colorClass}" fill="currentColor" viewBox="0 0 24 24" width="48" height="48"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>`,

  mail: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,

  phone: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1.3 1.3 0 01-.321 1.09l-1.3 1.3a10.515 10.515 0 004.877 4.877l1.3-1.3a1.15 1.15 0 011.09-.321l2.2.55a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,

  mapPin: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  globe: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10m0-20a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10M2 12h20"/></svg>`,

  calendar: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>`,

  clock: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>`,

  shield: (colorClass = 'text-zinc-400') =>
    `<svg class="size-5 ${colorClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`
};
