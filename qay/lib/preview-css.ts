import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { compile } from 'tailwindcss';
import type { Component, Layer } from '@/types';
import { DEFAULT_TEXT_STYLES } from '@/lib/text-format-utils';

function extractClassesFromValue(value: string | string[] | undefined, classes: Set<string>) {
  if (!value) return;

  if (Array.isArray(value)) {
    value.forEach((entry) => extractClassesFromValue(entry, classes));
    return;
  }

  value.split(/\s+/).forEach((className) => {
    const trimmed = className.trim();
    if (trimmed) {
      classes.add(trimmed);
    }
  });
}

function extractClassesFromLayers(layers: Layer[]): Set<string> {
  const classes = new Set<string>();
  const processedComponentIds = new Set<string>();

  function visit(layer: Layer) {
    if (layer.settings?.hidden) return;

    if (layer.componentId) {
      if (processedComponentIds.has(layer.componentId)) return;
      processedComponentIds.add(layer.componentId);
    }

    extractClassesFromValue(layer.classes, classes);

    if (layer.textStyles) {
      Object.values(layer.textStyles).forEach((style: { classes?: string | string[] }) => {
        extractClassesFromValue(style.classes, classes);
      });
    }

    if (layer.variables?.text) {
      Object.values(DEFAULT_TEXT_STYLES).forEach((style) => {
        extractClassesFromValue(style.classes, classes);
      });
    }

    if (Array.isArray(layer.children)) {
      layer.children.forEach(visit);
    }
  }

  layers.forEach(visit);
  return classes;
}

let compilerCache: { build: (candidates: string[]) => string } | null = null;

async function getCompiler() {
  if (compilerCache) return compilerCache;

  const tailwindEntry = join(process.cwd(), 'node_modules/tailwindcss/index.css');
  const input = await readFile(tailwindEntry, 'utf-8');

  compilerCache = await compile(input, {
    base: process.cwd(),
    async loadStylesheet(id: string, base: string) {
      const fullPath = join(dirname(base), id);
      const content = await readFile(fullPath, 'utf-8');
      return { path: fullPath, content, base: dirname(fullPath) };
    },
  });

  return compilerCache;
}

export async function generatePreviewCss(
  pageLayers: Layer[],
  components: Component[] = []
): Promise<string | undefined> {
  const componentLayers = components.flatMap((component) =>
    Array.isArray(component.layers) ? component.layers : []
  );

  const classes = extractClassesFromLayers([...pageLayers, ...componentLayers]);
  const classNames = Array.from(classes);

  if (classNames.length === 0) {
    return undefined;
  }

  const compiler = await getCompiler();
  return compiler.build(classNames);
}
