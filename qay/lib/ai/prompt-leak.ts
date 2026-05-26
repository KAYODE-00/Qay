import type { Layer } from '@/types';

function decodeBasicHtmlEntities(value: string) {
  return value
    .replace(/&amp;/gi, ' and ')
    .replace(/&quot;|&#034;|&#34;/gi, ' ')
    .replace(/&#039;|&#39;|&apos;/gi, ' ')
    .replace(/&nbsp;/gi, ' ');
}

export function normalizePromptLeakText(value: string) {
  return decodeBasicHtmlEntities(value)
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .replace(/[#*_`>"'’“”.,:;!?()[\]{}-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectStrings(value: unknown, results: string[] = []) {
  if (typeof value === 'string') {
    results.push(value);
    return results;
  }

  if (!value || typeof value !== 'object') return results;

  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, results));
    return results;
  }

  Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
    if (['id', 'class', 'classes', 'style', 'design'].includes(key)) return;
    collectStrings(entry, results);
  });

  return results;
}

export function getLayerTextForPromptLeakCheck(layers: Layer[]) {
  return collectStrings(layers).join(' ');
}

export function hasInstructionPromptLeak(value: string) {
  const normalized = normalizePromptLeakText(value);
  const blockedPhrases = [
    'act as an elite frontend engineer',
    'visual and aesthetic guidelines',
    'visual aesthetic guidelines',
    'core architecture and sections',
    'core architecture sections',
    'technical and engineering requirements',
    'technical engineering requirements',
    'build a high level production ready',
    'theme minimalist ultra high contrast',
    'placeholder project a',
    'placeholder project b',
    'ensure the layout is flawlessly responsive',
    'the entire template should be self contained',
  ];

  return blockedPhrases.some((phrase) => normalized.includes(phrase));
}

function promptOverlapScore(promptText: string, combinedText: string) {
  const promptWords = Array.from(new Set(promptText.split(' ').filter((word) => word.length > 5)));
  if (promptWords.length === 0) return 0;

  const matchedWords = promptWords.filter((word) => combinedText.includes(word));
  return matchedWords.length / promptWords.length;
}

export function layersContainPromptLeak(layers: Layer[], userPrompt?: string) {
  const layerText = getLayerTextForPromptLeakCheck(layers);

  if (hasInstructionPromptLeak(layerText)) return true;
  if (!userPrompt) return false;

  const promptText = normalizePromptLeakText(userPrompt);
  const combinedText = normalizePromptLeakText(layerText);

  return (
    (promptText.length > 300 && combinedText.includes(promptText.slice(0, 180))) ||
    (promptText.length > 500 && promptOverlapScore(promptText, combinedText) > 0.62)
  );
}
