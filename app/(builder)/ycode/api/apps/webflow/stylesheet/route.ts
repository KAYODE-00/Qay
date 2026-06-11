import { lookup } from 'dns/promises';
import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const FETCH_TIMEOUT_MS = 8_000;
const MAX_BYTES = 3 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const site = request.nextUrl.searchParams.get('site');

  if (!site) {
    return noCache({ error: 'Provide a `site` parameter' }, 400);
  }

  try {
    const pageUrl = normalizeSiteUrl(site);
    if (!pageUrl) {
      return noCache({ error: 'Enter a valid published site URL' }, 400);
    }

    if (!(await isPublicHost(pageUrl.hostname))) {
      return noCache({ error: 'That site host is not allowed' }, 400);
    }

    const html = await fetchText(pageUrl.toString());
    const stylesheetUrl = findStylesheetUrl(html);
    if (!stylesheetUrl) {
      return noCache(
        { error: 'No Webflow stylesheet found. Make sure the site is published and the URL is correct.' },
        404,
      );
    }

    const css = await fetchText(stylesheetUrl);
    return noCache({ data: { css, stylesheetUrl } });
  } catch (error) {
    console.error('Error fetching Webflow stylesheet:', error);
    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to fetch stylesheet' },
      502,
    );
  }
}

function normalizeSiteUrl(input: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  parsed.protocol = 'https:';
  if (parsed.port && parsed.port !== '443') return null;

  return parsed;
}

async function isPublicHost(hostname: string): Promise<boolean> {
  const host = hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) {
    return false;
  }
  if (isPrivateIp(host)) return false;

  try {
    const addresses = await lookup(host, { all: true });
    if (addresses.length === 0) return false;
    return addresses.every((a) => !isPrivateIp(a.address));
  } catch {
    return false;
  }
}

function isPrivateIp(ip: string): boolean {
  const v6 = ip.toLowerCase();
  if (v6 === '::1' || v6 === '::') return true;
  if (v6.startsWith('fe80') || v6.startsWith('fc') || v6.startsWith('fd')) return true;

  const mapped = v6.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  const v4 = mapped ? mapped[1] : ip;

  const m = v4.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function findStylesheetUrl(html: string): string | null {
  const matches = html.match(
    /https?:\/\/[^"'\s)]*website-files\.com\/[^"'\s)]+\.css/gi,
  );
  if (!matches || matches.length === 0) return null;
  return matches.find((m) => /\.webflow\.shared\.[^/]*\.css$/i.test(m)) ?? matches[0];
}

async function fetchText(target: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(target, { redirect: 'follow', signal: controller.signal });
    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
    return await readCapped(res, MAX_BYTES);
  } finally {
    clearTimeout(timer);
  }
}

async function readCapped(res: Response, maxBytes: number): Promise<string> {
  if (!res.body) {
    const text = await res.text();
    if (byteLength(text) > maxBytes) throw new Error('Upstream response too large');
    return text;
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > maxBytes) throw new Error('Upstream response too large');
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return new TextDecoder().decode(concat(chunks, total));
}

function concat(chunks: Uint8Array[], total: number): Uint8Array {
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}
