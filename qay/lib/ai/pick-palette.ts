export interface ColorPalette {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  border: string;
}

export interface PaletteChoice {
  palette: ColorPalette;
  paletteKey: string;
  googleFont: { heading: string; body: string; url: string };
}

const PALETTES: Record<string, ColorPalette> = {
  'dark-luxury': {
    bg: '#0a0905',
    surface: '#14120d',
    text: '#f5ede0',
    textMuted: '#9b8a75',
    accent: '#c9a84c',
    accentText: '#0a0905',
    border: 'rgba(201,168,76,0.12)',
  },
  'dark-bold': {
    bg: '#0a0a0a',
    surface: '#111111',
    text: '#ffffff',
    textMuted: '#888888',
    accent: '#39ff14',
    accentText: '#000000',
    border: 'rgba(57,255,20,0.15)',
  },
  'dark-purple': {
    bg: '#0d0a14',
    surface: '#130f1c',
    text: '#e8e0f5',
    textMuted: '#7a6a9b',
    accent: '#8b5cf6',
    accentText: '#ffffff',
    border: 'rgba(139,92,246,0.15)',
  },
  'dark-blue': {
    bg: '#080c14',
    surface: '#0d1220',
    text: '#e0eaff',
    textMuted: '#5a7aaa',
    accent: '#3b82f6',
    accentText: '#ffffff',
    border: 'rgba(59,130,246,0.15)',
  },
  'dark-red': {
    bg: '#0c0808',
    surface: '#150d0d',
    text: '#f5e8e8',
    textMuted: '#9b7575',
    accent: '#ef4444',
    accentText: '#ffffff',
    border: 'rgba(239,68,68,0.15)',
  },
  'dark-minimal': {
    bg: '#0d0d0d',
    surface: '#1a1a1a',
    text: '#e8e8e8',
    textMuted: '#666666',
    accent: '#ffffff',
    accentText: '#0d0d0d',
    border: 'rgba(255,255,255,0.08)',
  },
  'dark-green': {
    bg: '#080e0a',
    surface: '#0f1a12',
    text: '#e0f5e8',
    textMuted: '#5a8a6a',
    accent: '#22c55e',
    accentText: '#ffffff',
    border: 'rgba(34,197,94,0.15)',
  },
  'light-minimal': {
    bg: '#ffffff',
    surface: '#f8f8f6',
    text: '#111111',
    textMuted: '#888888',
    accent: '#111111',
    accentText: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
  },
  'light-luxury': {
    bg: '#faf9f7',
    surface: '#f3f0ea',
    text: '#1a1a0a',
    textMuted: '#8a7a5a',
    accent: '#b8922a',
    accentText: '#ffffff',
    border: 'rgba(26,26,10,0.08)',
  },
  'light-blue': {
    bg: '#ffffff',
    surface: '#f0f4ff',
    text: '#111827',
    textMuted: '#6b7280',
    accent: '#4f46e5',
    accentText: '#ffffff',
    border: 'rgba(79,70,229,0.12)',
  },
  'light-green': {
    bg: '#ffffff',
    surface: '#f0fdf4',
    text: '#111827',
    textMuted: '#6b7280',
    accent: '#16a34a',
    accentText: '#ffffff',
    border: 'rgba(22,163,74,0.12)',
  },
  'light-red': {
    bg: '#ffffff',
    surface: '#fff5f5',
    text: '#1a0a0a',
    textMuted: '#888888',
    accent: '#dc2626',
    accentText: '#ffffff',
    border: 'rgba(220,38,38,0.12)',
  },
  'light-purple': {
    bg: '#ffffff',
    surface: '#faf5ff',
    text: '#1a0a2e',
    textMuted: '#7c6b9b',
    accent: '#7c3aed',
    accentText: '#ffffff',
    border: 'rgba(124,58,237,0.12)',
  },
  'warm-terracotta': {
    bg: '#fdf6ec',
    surface: '#fff9f0',
    text: '#2c1810',
    textMuted: '#8a6a5a',
    accent: '#c2601f',
    accentText: '#ffffff',
    border: 'rgba(44,24,16,0.08)',
  },
  'warm-sage': {
    bg: '#f8faf5',
    surface: '#f0f5eb',
    text: '#1a2a14',
    textMuted: '#6a8a5a',
    accent: '#3d6b4f',
    accentText: '#ffffff',
    border: 'rgba(26,42,20,0.08)',
  },
  'warm-cream': {
    bg: '#fefcf5',
    surface: '#f8f4e8',
    text: '#2a2015',
    textMuted: '#8a7a60',
    accent: '#8b6914',
    accentText: '#ffffff',
    border: 'rgba(42,32,21,0.08)',
  },
  'warm-rose': {
    bg: '#fff8f8',
    surface: '#fff0f0',
    text: '#2a1515',
    textMuted: '#8a6060',
    accent: '#c2185b',
    accentText: '#ffffff',
    border: 'rgba(42,21,21,0.08)',
  },
  'editorial-ink': {
    bg: '#fafaf8',
    surface: '#f2f1ee',
    text: '#111110',
    textMuted: '#6b6a65',
    accent: '#111110',
    accentText: '#fafaf8',
    border: 'rgba(17,17,16,0.1)',
  },
  'editorial-dark': {
    bg: '#111110',
    surface: '#1c1c1a',
    text: '#fafaf8',
    textMuted: '#8a8a80',
    accent: '#fafaf8',
    accentText: '#111110',
    border: 'rgba(250,250,248,0.1)',
  },
};

const FONT_PAIRINGS: Record<string, { heading: string; body: string; url: string }> = {
  luxury: { heading: 'Cormorant Garamond', body: 'DM Sans', url: 'Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500' },
  bold: { heading: 'Bebas Neue', body: 'Inter', url: 'Bebas+Neue&family=Inter:wght@300;400;500;600' },
  minimal: { heading: 'Inter', body: 'Inter', url: 'Inter:wght@300;400;500;600;700;800;900' },
  warm: { heading: 'Playfair Display', body: 'Lato', url: 'Playfair+Display:wght@400;700&family=Lato:wght@300;400;700' },
  modern: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', url: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  editorial: { heading: 'Libre Baskerville', body: 'Source Sans 3', url: 'Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600' },
  street: { heading: 'Barlow Condensed', body: 'Barlow', url: 'Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500' },
  professional: { heading: 'Montserrat', body: 'Open Sans', url: 'Montserrat:wght@400;600;700&family=Open+Sans:wght@300;400;600' },
  friendly: { heading: 'Nunito', body: 'Nunito', url: 'Nunito:wght@400;500;600;700;800' },
  tech: { heading: 'Space Grotesk', body: 'Inter', url: 'Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500' },
};

function isColorDark(hex: string) {
  const c = hex.replace('#', '');
  const normalized = c.length === 3 ? c.split('').map((char) => `${char}${char}`).join('') : c.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return false;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function pickFont(prompt: string) {
  const p = prompt.toLowerCase();
  if (/luxury|fine dining|upscale|editorial|perfume|jewelry/.test(p)) return FONT_PAIRINGS.luxury;
  if (/streetwear|hype|bold|urban|fashion/.test(p)) return FONT_PAIRINGS.street;
  if (/minimal|clean|simple|linear|notion|apple/.test(p)) return FONT_PAIRINGS.minimal;
  if (/warm|rustic|classic|traditional|restaurant|cafe/.test(p)) return FONT_PAIRINGS.warm;
  if (/tech|saas|software|startup/.test(p)) return FONT_PAIRINGS.tech;
  if (/agency|creative|studio|magazine|blog|publication/.test(p)) return FONT_PAIRINGS.editorial;
  if (/law|medical|professional|corporate/.test(p)) return FONT_PAIRINGS.professional;
  if (/education|school|course|friendly/.test(p)) return FONT_PAIRINGS.friendly;
  return FONT_PAIRINGS.modern;
}

const PROMPT_COLOR_NAMES: Record<string, string> = {
  'neon green': '#39ff14',
  'neon pink': '#ff6ec7',
  'neon blue': '#3b82ff',
  'deep grey': '#171717',
  'deep gray': '#171717',
  charcoal: '#111111',
  black: '#050505',
  white: '#ffffff',
  cream: '#fff7ed',
  ivory: '#fffaf0',
  gold: '#d4af37',
  champagne: '#f7e7ce',
  amber: '#f59e0b',
  yellow: '#eab308',
  green: '#22c55e',
  emerald: '#10b981',
  forest: '#14532d',
  blue: '#2563eb',
  navy: '#0f172a',
  indigo: '#4f46e5',
  purple: '#7c3aed',
  violet: '#8b5cf6',
  red: '#ef4444',
  crimson: '#dc143c',
  pink: '#ec4899',
  orange: '#f97316',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  gray: '#6b7280',
  grey: '#6b7280',
  slate: '#475569',
  beige: '#f5f5dc',
  brown: '#92400e',
  burgundy: '#800020',
};

function findNamedColor(value: string) {
  const lower = value.toLowerCase();
  const hex = lower.match(/#[0-9a-f]{3,8}/i)?.[0];
  if (hex) return hex;
  const name = Object.keys(PROMPT_COLOR_NAMES)
    .sort((a, b) => b.length - a.length)
    .find((item) => new RegExp(`\\b${item.replace(/\s+/g, '\\s+')}\\b`, 'i').test(lower));
  return name ? PROMPT_COLOR_NAMES[name] : undefined;
}

function colorMentions(prompt: string) {
  const mentions: Array<{ color: string; index: number }> = [];
  for (const match of prompt.matchAll(/#[0-9a-fA-F]{3,8}/g)) {
    mentions.push({ color: match[0], index: match.index || 0 });
  }
  for (const [name, color] of Object.entries(PROMPT_COLOR_NAMES)) {
    const regex = new RegExp(`\\b${name.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    for (const match of prompt.matchAll(regex)) {
      mentions.push({ color, index: match.index || 0 });
    }
  }

  return mentions
    .sort((a, b) => a.index - b.index)
    .filter((item, index, list) => list.findIndex((other) => other.color.toLowerCase() === item.color.toLowerCase()) === index);
}

function promptAllowsLightDarkSupport(prompt: string) {
  return /\b(white\s*\/\s*dark|light\s*\/\s*dark|dark mode toggle|dark mode support|both light and dark|light and dark mode)\b/i.test(prompt);
}

function extractPromptPaletteColors(prompt: string) {
  const colors: { primary?: string; accent?: string; bg?: string } = {};
  const mentions = colorMentions(prompt);
  const primary = prompt.match(/\bprimary\s*:\s*([^\n.;]+)/i)?.[1];
  const accent = prompt.match(/\baccent\s*:\s*([^\n.;]+)/i)?.[1];
  const background = prompt.match(/\b(?:background|bg)\s*:\s*([^\n.;]+)/i)?.[1];
  const paletteLine = prompt.match(/\b(?:palette|colors?|colour palette)\s*:\s*([^\n]+)/i)?.[1] || '';

  colors.primary = primary ? findNamedColor(primary) : undefined;
  colors.accent = accent ? findNamedColor(accent) : undefined;
  colors.bg = background ? findNamedColor(background) : undefined;

  if (!colors.bg && mentions.length >= 2) {
    const darkMention = mentions.find((item) => isColorDark(item.color));
    if (darkMention && !promptAllowsLightDarkSupport(prompt)) {
      colors.bg = darkMention.color;
    }
  }

  if (!colors.accent) {
    const colorPhrase = prompt.match(/\b(neon green|neon pink|neon blue|gold|burgundy|crimson|emerald|purple|violet|orange|teal|cyan|red|blue|green|pink|amber)\b/i)?.[1];
    colors.accent = colorPhrase
      ? findNamedColor(colorPhrase)
      : mentions.find((item) => item.color.toLowerCase() !== colors.bg?.toLowerCase())?.color || findNamedColor(paletteLine);
  }

  if (!colors.bg && /\b(black|dark|midnight|obsidian|noir|deep grey|deep gray)\b/i.test(prompt) && !promptAllowsLightDarkSupport(prompt)) {
    colors.bg = findNamedColor(/\b(deep grey|deep gray)\b/i.test(prompt) ? 'deep grey' : 'black');
  }

  if (!colors.primary && paletteLine) {
    colors.primary = findNamedColor(paletteLine);
  }

  if (!colors.primary && colors.bg) {
    colors.primary = isColorDark(colors.bg) ? '#f8fafc' : '#111111';
  }

  return colors.primary || colors.accent || colors.bg ? colors : null;
}

function softenSurface(accent: string, dark: boolean) {
  if (dark) return '#141414';
  const lower = accent.toLowerCase();
  if (lower === '#39ff14' || lower === '#22c55e' || lower === '#10b981') return '#f3fff0';
  if (lower === '#d4af37' || lower === '#f59e0b' || lower === '#eab308') return '#fff9e8';
  if (lower === '#ef4444' || lower === '#dc143c') return '#fff5f5';
  if (lower === '#7c3aed' || lower === '#8b5cf6') return '#faf5ff';
  if (lower === '#2563eb' || lower === '#3b82ff') return '#f0f6ff';
  return '#f8f8f6';
}

function deriveSurface(bg: string, accent: string) {
  return isColorDark(bg) ? '#141414' : softenSurface(accent, false);
}

export function pickPalette(prompt: string, userColors?: { primary?: string; accent?: string; bg?: string }): PaletteChoice {
  const p = prompt.toLowerCase();
  const extractedColors = extractPromptPaletteColors(prompt);
  const explicitColors = { ...(extractedColors || {}), ...(userColors || {}) };
  const isDark = /dark|black|obsidian|midnight|noir|moody|shadow|deep grey|deep gray/.test(p) && !promptAllowsLightDarkSupport(prompt);

  if (explicitColors.accent || explicitColors.primary || explicitColors.bg) {
    const accent = explicitColors.accent || explicitColors.primary || '#111111';
    const bg = explicitColors.bg || (isDark ? '#0a0a0a' : '#ffffff');
    const dark = isColorDark(bg);
    const custom: ColorPalette = {
      bg,
      surface: deriveSurface(bg, accent),
      text: dark ? '#f8fafc' : '#111111',
      textMuted: dark ? 'rgba(248,250,252,0.72)' : 'rgba(17,17,17,0.64)',
      accent,
      accentText: isColorDark(accent) ? '#ffffff' : '#000000',
      border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    };
    return { palette: custom, paletteKey: 'custom', googleFont: pickFont(prompt) };
  }

  const isLuxury = /luxury|premium|gold|fine dining|upscale|elite|bespoke|sophisticated/.test(p);
  const isBold = /bold|neon|vibrant|streetwear|hype|urban|energetic/.test(p);
  const isWarm = /warm|cozy|rustic|terracotta|organic|natural|earthy/.test(p);
  const isMinimal = /minimal|clean|white|simple|stripped|airy|linear|notion|apple|medium/.test(p);
  const isPurple = /purple|violet|lavender|mystical|creative/.test(p);
  const isBlue = /blue|ocean|tech|professional|corporate|trust/.test(p);
  const isGreen = /green|nature|eco|organic|health|growth|forest/.test(p);
  const isRed = /red|passion|fire|energy|sport/.test(p);
  const isRose = /pink|rose|feminine|beauty|floral|romantic/.test(p);
  const isSage = /sage|botanical|wellness|spa|meditation|calm/.test(p);

  let paletteKey = 'light-minimal';
  if (isDark && isLuxury) paletteKey = 'dark-luxury';
  else if (isDark && isBold) paletteKey = 'dark-bold';
  else if (isDark && isPurple) paletteKey = 'dark-purple';
  else if (isDark && isBlue) paletteKey = 'dark-blue';
  else if (isDark && isGreen) paletteKey = 'dark-green';
  else if (isDark && isRed) paletteKey = 'dark-red';
  else if (isDark) paletteKey = 'dark-minimal';
  else if (isLuxury && isWarm) paletteKey = 'warm-cream';
  else if (isLuxury) paletteKey = 'light-luxury';
  else if (isBold && isRed) paletteKey = 'light-red';
  else if (isBold && isPurple) paletteKey = 'light-purple';
  else if (isWarm && isRose) paletteKey = 'warm-rose';
  else if (isWarm && isSage) paletteKey = 'warm-sage';
  else if (isWarm) paletteKey = 'warm-terracotta';
  else if (isBlue) paletteKey = 'light-blue';
  else if (isGreen || isSage) paletteKey = 'light-green';
  else if (isPurple) paletteKey = 'light-purple';
  else if (isRose) paletteKey = 'warm-rose';
  else if (isMinimal) paletteKey = 'editorial-ink';

  if (/restaurant|cafe|food|dining|kitchen/.test(p) && !isDark) paletteKey = 'warm-terracotta';
  if (/law|attorney|legal|corporate/.test(p) && !isDark) paletteKey = 'light-minimal';
  if (/medical|clinic|health|doctor/.test(p) && !isDark) paletteKey = 'light-blue';
  if (/spa|wellness|yoga|meditation/.test(p)) paletteKey = 'warm-sage';
  if (/church|ministry|worship/.test(p)) paletteKey = isDark ? 'dark-purple' : 'light-purple';
  if (/beauty|salon|makeup/.test(p) && !isDark) paletteKey = 'warm-rose';
  if (/tech|startup|saas|software/.test(p) && !isDark) paletteKey = 'light-blue';
  if (/streetwear|hype|urban/.test(p)) paletteKey = isDark ? 'dark-bold' : 'dark-bold';
  if (/blog|publication|magazine|metric|medium|notion|linear/.test(p) && !isDark) paletteKey = 'editorial-ink';

  return {
    palette: PALETTES[paletteKey] || PALETTES['light-minimal'],
    paletteKey,
    googleFont: pickFont(prompt),
  };
}

export function paletteToCssVariables(choice: PaletteChoice): Record<string, string> {
  const { palette, googleFont } = choice;
  return {
    '--qm-bg': palette.bg,
    '--qm-surface': palette.surface,
    '--qm-text': palette.text,
    '--qm-text-muted': palette.textMuted,
    '--qm-accent': palette.accent,
    '--qm-accent-text': palette.accentText,
    '--qm-border': palette.border,
    '--qm-heading-font': `'${googleFont.heading}', serif`,
    '--qm-body-font': `'${googleFont.body}', sans-serif`,
  };
}

export function buildThemeBlock(choice: PaletteChoice): string {
  const css = paletteToCssVariables(choice);
  const lines = Object.entries(css).map(([key, value]) => `  ${key}: ${value};`).join('\n');

  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${choice.googleFont.url}&display=swap" rel="stylesheet">
<style data-qay-theme="palette">
:root {
${lines}
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background-color: var(--qm-bg);
  color: var(--qm-text);
  font-family: var(--qm-body-font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1, h2, h3, h4, h5, h6 { font-family: var(--qm-heading-font); }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
</style>`;
}

function normalizeColorClasses(className: string) {
  const normalized = (` ${className} `)
    .replace(/\s(?:dark:)?bg-\[#(?:[0-9a-fA-F]{3,8})\](?:\/\d+)?\b/g, ' bg-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?text-\[#(?:[0-9a-fA-F]{3,8})\](?:\/\d+)?\b/g, ' text-[var(--qm-text)]')
    .replace(/\s(?:dark:)?border-\[#(?:[0-9a-fA-F]{3,8})\](?:\/\d+)?\b/g, ' border-[var(--qm-border)]')
    .replace(/\s(?:dark:)?bg-\[#(?:[0-9a-fA-F]{3,8})\](?:\/\[[^\]]+\])?\b/g, ' bg-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?text-\[#(?:[0-9a-fA-F]{3,8})\](?:\/\[[^\]]+\])?\b/g, ' text-[var(--qm-text)]')
    .replace(/\s(?:dark:)?border-\[#(?:[0-9a-fA-F]{3,8})\](?:\/\[[^\]]+\])?\b/g, ' border-[var(--qm-border)]')
    .replace(/\s(?:dark:)?bg-\[(?:rgba?|hsla?)\([^\]]+\)\](?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' bg-[var(--qm-surface)]')
    .replace(/\s(?:dark:)?text-\[(?:rgba?|hsla?)\([^\]]+\)\](?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' text-[var(--qm-text)]')
    .replace(/\s(?:dark:)?border-\[(?:rgba?|hsla?)\([^\]]+\)\](?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' border-[var(--qm-border)]')
    .replace(/\s(?:dark:)?from-\[(?:rgba?|hsla?)\([^\]]+\)\](?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' from-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?via-\[(?:rgba?|hsla?)\([^\]]+\)\](?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' via-[var(--qm-surface)]')
    .replace(/\s(?:dark:)?to-\[(?:rgba?|hsla?)\([^\]]+\)\](?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' to-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?bg-(?:white|black|zinc|neutral|slate|gray|stone)-(?:50|100|200|800|900|950)\b/g, ' bg-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?bg-(?:white|black|zinc|neutral|slate|gray|stone)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' bg-[var(--qm-surface)]')
    .replace(/\s(?:dark:)?from-(?:white|black|zinc|neutral|slate|gray|stone)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' from-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?via-(?:white|black|zinc|neutral|slate|gray|stone)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' via-[var(--qm-surface)]')
    .replace(/\s(?:dark:)?to-(?:white|black|zinc|neutral|slate|gray|stone)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' to-[var(--qm-bg)]')
    .replace(/\s(?:dark:)?text-(?:white|black|zinc|neutral|slate|gray|stone)-(?:50|100|200|800|900|950)\b/g, ' text-[var(--qm-text)]')
    .replace(/\s(?:dark:)?text-(?:white|black)(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' text-[var(--qm-text)]')
    .replace(/\s(?:dark:)?text-(?:zinc|neutral|slate|gray|stone)-(?:300|400|500|600|700)(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' text-[var(--qm-text-muted)]')
    .replace(/\s(?:dark:)?border-(?:zinc|neutral|slate|gray|stone|black|white)(?:-\d{2,3})?(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' border-[var(--qm-border)]')
    .replace(/\s(?:dark:)?text-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' text-[var(--qm-accent)]')
    .replace(/\s(?:dark:)?bg-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' bg-[var(--qm-accent)]')
    .replace(/\s(?:dark:)?from-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' from-[var(--qm-accent)]')
    .replace(/\s(?:dark:)?via-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' via-[var(--qm-surface)]')
    .replace(/\s(?:dark:)?to-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}(?:\/(?:\d+|\[[^\]]+\]))?\b/g, ' to-[var(--qm-bg)]')
    .replace(/\sring-(?:indigo|emerald|rose|cyan|blue|purple|amber|orange|green|pink|red|yellow)-\d{3}\b/g, ' ring-[var(--qm-accent)]')
    .replace(/\sprose-(?:neutral|zinc|slate|gray|stone|invert)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.includes('text-[var(--qm-accent-text)]') && !normalized.includes('bg-[var(--qm-accent)]')) {
    return normalized.replace(/\btext-\[var\(--qm-accent-text\)\]\b/g, 'text-[var(--qm-text)]');
  }

  return normalized;
}

export function enforcePaletteOnHtml(html: string, choice: PaletteChoice): string {
  let out = html
    .replace(/<link[^>]*fonts\.googleapis\.com[^>]*>\s*/gi, '')
    .replace(/<link[^>]*fonts\.gstatic\.com[^>]*>\s*/gi, '')
    .replace(/<style data-qay-theme="palette">[\s\S]*?<\/style>\s*/gi, '')
    .replace(/(style="[^"]*?background(?:-color)?:\s*)#[0-9a-fA-F]{3,8}([^"]*")/gi, '$1var(--qm-bg)$2')
    .replace(/(style="[^"]*?color:\s*)#[0-9a-fA-F]{3,8}([^"]*")/gi, '$1var(--qm-text)$2')
    .replace(/(style="[^"]*?border-color:\s*)#[0-9a-fA-F]{3,8}([^"]*")/gi, '$1var(--qm-border)$2')
    .replace(/(style="[^"]*?background(?:-color)?:\s*)(?:rgba?|hsla?)\([^)]+\)([^"]*")/gi, '$1var(--qm-bg)$2')
    .replace(/(style="[^"]*?color:\s*)(?:rgba?|hsla?)\([^)]+\)([^"]*")/gi, '$1var(--qm-text)$2')
    .replace(/(style="[^"]*?border-color:\s*)(?:rgba?|hsla?)\([^)]+\)([^"]*")/gi, '$1var(--qm-border)$2')
    .replace(/:root\s*\{[\s\S]*?\}/gi, `:root {\n${Object.entries(paletteToCssVariables(choice)).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`);

  out = out.replace(/class="([^"]*)"/g, (_match, className: string) => `class="${normalizeColorClasses(className)}"`);

  if (/^<!doctype html/i.test(out) || /<html[\s>]/i.test(out)) {
    if (/<head[^>]*>/i.test(out)) {
      return out.replace(/<head([^>]*)>/i, `<head$1>\n${buildThemeBlock(choice)}`);
    }
    return `${buildThemeBlock(choice)}\n${out}`;
  }

  return `${buildThemeBlock(choice)}\n${out}`;
}

export function buildPalettePrompt(prompt: string, choice: PaletteChoice) {
  const { palette, googleFont } = choice;
  return `PALETTE ASSIGNED (USE ONLY THESE CSS VARIABLES):
--qm-bg: ${palette.bg}
--qm-surface: ${palette.surface}
--qm-text: ${palette.text}
--qm-text-muted: ${palette.textMuted}
--qm-accent: ${palette.accent}
--qm-accent-text: ${palette.accentText}
--qm-border: ${palette.border}
--qm-heading-font: '${googleFont.heading}'
--qm-body-font: '${googleFont.body}'

Use ONLY var(--qm-*) for all colors and fonts. No hardcoded color classes, no arbitrary hex colors, and no inline hex color styles.

USER REQUEST:
${prompt}`;
}
