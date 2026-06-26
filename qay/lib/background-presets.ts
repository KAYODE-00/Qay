export type QayBackgroundCategory = 'gradient' | 'pattern' | 'animated' | 'mesh' | 'spline';

export type QayBackgroundPreset = {
  id: string;
  category: QayBackgroundCategory;
  name: string;
  css: string;
  preview_css: string;
  tags: string[];
  is_dark: boolean;
  rank: number;
  keyframes?: string;
};

const gradientPairs = [
  ['Aurora', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', false],
  ['Sunset', 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)', false],
  ['Ocean Glass', 'linear-gradient(180deg, #0093e9 0%, #80d0c7 100%)', false],
  ['Obsidian', 'linear-gradient(135deg, #050505 0%, #1a1a2e 100%)', true],
  ['Royal Indigo', 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)', true],
  ['Gold Noir', 'linear-gradient(135deg, #080604 0%, #2b2113 55%, #b88a2d 100%)', true],
  ['Fresh Mint', 'linear-gradient(135deg, #d9f99d 0%, #34d399 45%, #0f766e 100%)', false],
  ['Coral Punch', 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)', false],
  ['Velvet', 'linear-gradient(135deg, #2d0611 0%, #7f1d1d 55%, #fb7185 100%)', true],
  ['Skyline', 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 48%, #1d4ed8 100%)', false],
  ['Forest Study', 'linear-gradient(135deg, #052e16 0%, #166534 55%, #bbf7d0 100%)', true],
  ['Cream Editorial', 'linear-gradient(135deg, #fff7ed 0%, #f5e6d3 48%, #d6a96b 100%)', false],
  ['Neon Street', 'linear-gradient(135deg, #030712 0%, #111827 40%, #39ff14 100%)', true],
  ['Berry Cloud', 'linear-gradient(135deg, #fdf2f8 0%, #f9a8d4 48%, #be185d 100%)', false],
  ['Slate Focus', 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', true],
  ['Citrus Pop', 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #ea580c 100%)', false],
  ['Ice Minimal', 'linear-gradient(135deg, #ffffff 0%, #eef2ff 55%, #c7d2fe 100%)', false],
  ['Purple Pulse', 'linear-gradient(135deg, #111827 0%, #581c87 50%, #c084fc 100%)', true],
  ['Lagos Night', 'linear-gradient(135deg, #050505 0%, #0f3d2e 46%, #f59e0b 100%)', true],
  ['Rose Gold', 'linear-gradient(135deg, #fff1f2 0%, #fda4af 48%, #b45309 100%)', false],
  ['Cyber Blue', 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #22d3ee 100%)', true],
  ['Sage Calm', 'linear-gradient(135deg, #f7fee7 0%, #86efac 52%, #15803d 100%)', false],
  ['Ink Paper', 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 52%, #0f172a 100%)', false],
  ['Ruby Stage', 'linear-gradient(135deg, #1f0307 0%, #991b1b 55%, #f97316 100%)', true],
  ['Solar Flare', 'linear-gradient(135deg, #fff7ed 0%, #facc15 45%, #dc2626 100%)', false],
  ['Deep Teal', 'linear-gradient(135deg, #042f2e 0%, #0f766e 55%, #99f6e4 100%)', true],
  ['Lilac Studio', 'linear-gradient(135deg, #faf5ff 0%, #d8b4fe 55%, #7e22ce 100%)', false],
  ['Graphite', 'linear-gradient(135deg, #111111 0%, #2a2a2a 55%, #737373 100%)', true],
  ['Champagne', 'linear-gradient(135deg, #fffbeb 0%, #fde68a 48%, #92400e 100%)', false],
  ['Pacific', 'linear-gradient(135deg, #eff6ff 0%, #38bdf8 50%, #0369a1 100%)', false],
  ['Mono Luxe', 'linear-gradient(135deg, #000000 0%, #171717 45%, #f5f5f5 100%)', true],
  ['Apricot Air', 'linear-gradient(135deg, #fff7ed 0%, #fdba74 50%, #c2410c 100%)', false],
] as const;

const meshPairs = [
  ['Mango Mesh', 'radial-gradient(circle at 15% 20%, #facc15 0, transparent 28%), radial-gradient(circle at 85% 15%, #f97316 0, transparent 30%), radial-gradient(circle at 50% 90%, #ec4899 0, transparent 34%), #111827', true],
  ['Ocean Mesh', 'radial-gradient(circle at 20% 30%, #22d3ee 0, transparent 30%), radial-gradient(circle at 80% 20%, #2563eb 0, transparent 32%), radial-gradient(circle at 55% 80%, #a7f3d0 0, transparent 34%), #061826', true],
  ['Ivory Mesh', 'radial-gradient(circle at 20% 10%, #fde68a 0, transparent 30%), radial-gradient(circle at 75% 25%, #fecaca 0, transparent 32%), radial-gradient(circle at 45% 85%, #bfdbfe 0, transparent 35%), #fffaf0', false],
  ['Noir Gold Mesh', 'radial-gradient(circle at 25% 18%, #b88a2d 0, transparent 26%), radial-gradient(circle at 85% 75%, #3b2f1b 0, transparent 34%), #050505', true],
  ['Forest Mesh', 'radial-gradient(circle at 20% 20%, #86efac 0, transparent 28%), radial-gradient(circle at 78% 30%, #16a34a 0, transparent 32%), radial-gradient(circle at 50% 90%, #052e16 0, transparent 35%), #ecfdf5', false],
  ['Violet Mesh', 'radial-gradient(circle at 25% 25%, #c084fc 0, transparent 28%), radial-gradient(circle at 80% 20%, #4f46e5 0, transparent 30%), radial-gradient(circle at 48% 85%, #f0abfc 0, transparent 36%), #111827', true],
  ['Editorial Mist', 'radial-gradient(circle at 18% 22%, #e5e7eb 0, transparent 28%), radial-gradient(circle at 78% 18%, #c7d2fe 0, transparent 32%), radial-gradient(circle at 48% 84%, #f5f5f4 0, transparent 36%), #ffffff', false],
  ['Street Neon', 'radial-gradient(circle at 16% 18%, #39ff14 0, transparent 25%), radial-gradient(circle at 84% 22%, #06b6d4 0, transparent 30%), radial-gradient(circle at 55% 82%, #f43f5e 0, transparent 35%), #030303', true],
  ['Clinic Calm', 'radial-gradient(circle at 18% 18%, #ccfbf1 0, transparent 32%), radial-gradient(circle at 82% 25%, #bfdbfe 0, transparent 30%), radial-gradient(circle at 52% 82%, #f0fdf4 0, transparent 35%), #ffffff', false],
  ['Law Navy', 'radial-gradient(circle at 22% 20%, #b8922a 0, transparent 24%), radial-gradient(circle at 78% 70%, #1e3a8a 0, transparent 35%), #070b18', true],
  ['Beauty Glow', 'radial-gradient(circle at 15% 20%, #f9a8d4 0, transparent 30%), radial-gradient(circle at 80% 25%, #fef3c7 0, transparent 32%), radial-gradient(circle at 55% 85%, #fde2e4 0, transparent 35%), #fff7fb', false],
  ['Hotel Dawn', 'radial-gradient(circle at 18% 15%, #fed7aa 0, transparent 30%), radial-gradient(circle at 82% 20%, #d6a96b 0, transparent 30%), radial-gradient(circle at 50% 85%, #fef3c7 0, transparent 36%), #1c140d', true],
  ['SaaS Signal', 'radial-gradient(circle at 15% 20%, #6366f1 0, transparent 28%), radial-gradient(circle at 85% 18%, #22d3ee 0, transparent 30%), radial-gradient(circle at 50% 85%, #111827 0, transparent 35%), #020617', true],
  ['Paper Bloom', 'radial-gradient(circle at 20% 15%, #fce7f3 0, transparent 32%), radial-gradient(circle at 80% 25%, #ddd6fe 0, transparent 30%), radial-gradient(circle at 45% 88%, #dcfce7 0, transparent 36%), #ffffff', false],
  ['Amber Night', 'radial-gradient(circle at 15% 20%, #f59e0b 0, transparent 28%), radial-gradient(circle at 78% 30%, #7c2d12 0, transparent 34%), radial-gradient(circle at 45% 88%, #111827 0, transparent 36%), #030712', true],
] as const;

const patternPresets: QayBackgroundPreset[] = [
  {
    id: 'pattern-soft-dots',
    category: 'pattern',
    name: 'Soft Dots',
    css: 'background-color:#ffffff; background-image: radial-gradient(rgba(17,24,39,0.12) 1px, transparent 1px); background-size: 18px 18px;',
    preview_css: 'background-color:#ffffff; background-image: radial-gradient(rgba(17,24,39,0.18) 1px, transparent 1px); background-size: 12px 12px;',
    tags: ['dots', 'light', 'minimal'],
    is_dark: false,
    rank: 88,
  },
  {
    id: 'pattern-graph-grid',
    category: 'pattern',
    name: 'Graph Grid',
    css: 'background-color:#f8fafc; background-image: linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px); background-size: 28px 28px;',
    preview_css: 'background-color:#f8fafc; background-image: linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px); background-size: 14px 14px;',
    tags: ['grid', 'saas'],
    is_dark: false,
    rank: 86,
  },
  {
    id: 'pattern-night-grid',
    category: 'pattern',
    name: 'Night Grid',
    css: 'background-color:#050505; background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 32px 32px;',
    preview_css: 'background-color:#050505; background-image: linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 16px 16px;',
    tags: ['grid', 'dark'],
    is_dark: true,
    rank: 84,
  },
  {
    id: 'pattern-diagonal-lines',
    category: 'pattern',
    name: 'Diagonal Lines',
    css: 'background-color:#ffffff; background-image: repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 14px);',
    preview_css: 'background-color:#ffffff; background-image: repeating-linear-gradient(135deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 10px);',
    tags: ['lines', 'editorial'],
    is_dark: false,
    rank: 82,
  },
  {
    id: 'pattern-checker',
    category: 'pattern',
    name: 'Quiet Checker',
    css: 'background-color:#fafafa; background-image: linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.04) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.04) 75%); background-size: 28px 28px; background-position: 0 0, 0 14px, 14px -14px, -14px 0;',
    preview_css: 'background-color:#fafafa; background-image: linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.06) 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0;',
    tags: ['checker', 'texture'],
    is_dark: false,
    rank: 78,
  },
  {
    id: 'pattern-noise-paper',
    category: 'pattern',
    name: 'Paper Grain',
    css: 'background-color:#fbfaf7; background-image: radial-gradient(rgba(0,0,0,0.08) 0.7px, transparent 0.7px); background-size: 6px 6px;',
    preview_css: 'background-color:#fbfaf7; background-image: radial-gradient(rgba(0,0,0,0.12) 0.7px, transparent 0.7px); background-size: 5px 5px;',
    tags: ['grain', 'paper'],
    is_dark: false,
    rank: 76,
  },
];

const animatedKeyframes = `
@keyframes qayGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes qayAuroraDrift { 0% { filter: hue-rotate(0deg); background-position: 0% 0%; } 50% { filter: hue-rotate(30deg); background-position: 100% 50%; } 100% { filter: hue-rotate(0deg); background-position: 0% 0%; } }
@keyframes qayDotFloat { 0% { background-position: 0 0, 0 0; } 100% { background-position: 80px 80px, 0 0; } }
`.trim();

const animatedPresets: QayBackgroundPreset[] = [
  {
    id: 'animated-gradient-shift',
    category: 'animated',
    name: 'Gradient Shift',
    css: 'background: linear-gradient(120deg, #667eea, #764ba2, #f093fb, #f5576c); background-size: 300% 300%; animation: qayGradientShift 14s ease infinite;',
    preview_css: 'background: linear-gradient(120deg, #667eea, #764ba2, #f093fb, #f5576c); background-size: 300% 300%;',
    tags: ['animated', 'gradient'],
    is_dark: false,
    rank: 95,
    keyframes: animatedKeyframes,
  },
  {
    id: 'animated-aurora',
    category: 'animated',
    name: 'Aurora Bands',
    css: 'background: radial-gradient(circle at 20% 20%, rgba(99,102,241,0.75), transparent 30%), radial-gradient(circle at 80% 25%, rgba(34,211,238,0.65), transparent 32%), radial-gradient(circle at 50% 85%, rgba(236,72,153,0.55), transparent 35%), #020617; background-size: 160% 160%; animation: qayAuroraDrift 18s ease-in-out infinite;',
    preview_css: 'background: radial-gradient(circle at 20% 20%, rgba(99,102,241,0.75), transparent 30%), radial-gradient(circle at 80% 25%, rgba(34,211,238,0.65), transparent 32%), radial-gradient(circle at 50% 85%, rgba(236,72,153,0.55), transparent 35%), #020617;',
    tags: ['animated', 'aurora', 'dark'],
    is_dark: true,
    rank: 94,
    keyframes: animatedKeyframes,
  },
  {
    id: 'animated-floating-dots',
    category: 'animated',
    name: 'Floating Dots',
    css: 'background-color:#0f172a; background-image: radial-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), radial-gradient(rgba(56,189,248,0.18) 1px, transparent 1px); background-size: 26px 26px, 60px 60px; animation: qayDotFloat 24s linear infinite;',
    preview_css: 'background-color:#0f172a; background-image: radial-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), radial-gradient(rgba(56,189,248,0.18) 1px, transparent 1px); background-size: 14px 14px, 34px 34px;',
    tags: ['animated', 'dots', 'dark'],
    is_dark: true,
    rank: 90,
    keyframes: animatedKeyframes,
  },
];

const splinePreset: QayBackgroundPreset = {
  id: 'spline-coming-soon',
  category: 'spline',
  name: 'Spline Scene',
  css: 'background: linear-gradient(135deg, #111827 0%, #312e81 100%);',
  preview_css: 'background: linear-gradient(135deg, #111827 0%, #312e81 100%);',
  tags: ['coming-soon', '3d'],
  is_dark: true,
  rank: 1,
};

export const QAY_BACKGROUND_CATEGORIES: QayBackgroundCategory[] = ['gradient', 'pattern', 'animated', 'mesh', 'spline'];

export const QAY_BACKGROUND_PRESETS: QayBackgroundPreset[] = [
  ...gradientPairs.map(([name, css, isDark], index) => ({
    id: `gradient-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    category: 'gradient' as const,
    name,
    css: `background: ${css};`,
    preview_css: `background: ${css};`,
    tags: ['gradient', isDark ? 'dark' : 'light'],
    is_dark: Boolean(isDark),
    rank: 200 - index,
  })),
  ...patternPresets,
  ...animatedPresets,
  ...meshPairs.map(([name, css, isDark], index) => ({
    id: `mesh-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    category: 'mesh' as const,
    name,
    css: `background: ${css};`,
    preview_css: `background: ${css};`,
    tags: ['mesh', isDark ? 'dark' : 'light'],
    is_dark: Boolean(isDark),
    rank: 170 - index,
  })),
  splinePreset,
];
