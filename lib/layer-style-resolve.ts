import type { Layer } from '@/types';

export function getStyleIds(layer: Pick<Layer, 'styleId' | 'styleIds'>): string[] {
  if (Array.isArray(layer.styleIds) && layer.styleIds.length > 0) {
    return layer.styleIds.filter(Boolean);
  }
  return layer.styleId ? [layer.styleId] : [];
}

export function splitVariant(className: string): { variant: string; prefix: string; base: string } {
  const index = className.lastIndexOf(':');
  if (index === -1) return { variant: '', prefix: '', base: className };
  const prefix = className.slice(0, index + 1);
  return {
    variant: prefix,
    prefix,
    base: className.slice(index + 1),
  };
}

function conflictKey(className: string): string {
  const { variant, base } = splitVariant(className);
  const negative = base.startsWith('-') ? '-' : '';
  const normalized = negative ? base.slice(1) : base;
  const prefix = normalized.includes('-') ? normalized.slice(0, normalized.indexOf('-')) : normalized;
  return `${variant}${negative}${prefix}`;
}

export function mergeClassStack(stack: Array<string | string[] | undefined | null>): string[] {
  const ordered: string[] = [];
  const byKey = new Map<string, string>();

  for (const item of stack) {
    const classes = Array.isArray(item) ? item : String(item ?? '').split(/\s+/);
    for (const className of classes) {
      const trimmed = className.trim();
      if (!trimmed) continue;
      const key = conflictKey(trimmed);
      if (!byKey.has(key)) ordered.push(key);
      byKey.set(key, trimmed);
    }
  }

  return ordered.map((key) => byKey.get(key)).filter(Boolean) as string[];
}
