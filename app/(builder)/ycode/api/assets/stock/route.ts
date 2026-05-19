import { NextRequest, NextResponse } from 'next/server';
import { createAsset } from '@/lib/repositories/assetRepository';
import { noCache } from '@/lib/api-response';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { linkAssetToQaySite } from '@/qay/lib/media-isolation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type StockProvider = 'unsplash' | 'istock';

interface StockImage {
  id: string;
  provider: StockProvider;
  title: string;
  description?: string | null;
  thumbnailUrl: string;
  imageUrl: string;
  downloadUrl?: string | null;
  width?: number | null;
  height?: number | null;
  author?: string | null;
  sourceUrl?: string | null;
}

function cleanFilename(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'stock-image';
}

function getUnsplashKey(): string | undefined {
  return process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY;
}

function getIstockKey(): string | undefined {
  return process.env.ISTOCK_API_KEY || process.env.GETTY_IMAGES_API_KEY;
}

async function searchUnsplash(query: string, page: number, limit: number): Promise<StockImage[]> {
  const key = getUnsplashKey();
  if (!key) return [];

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(Math.min(limit, 30)));
  url.searchParams.set('content_filter', 'high');

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${key}`,
      'Accept-Version': 'v1',
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    console.warn(`[stock-media] Unsplash search failed: ${response.status}`);
    return [];
  }

  const json = await response.json();
  return (json.results || []).map((photo: any): StockImage => ({
    id: String(photo.id),
    provider: 'unsplash',
    title: photo.alt_description || photo.description || 'Unsplash image',
    description: photo.description || photo.alt_description || null,
    thumbnailUrl: photo.urls?.small || photo.urls?.thumb || photo.urls?.regular,
    imageUrl: photo.urls?.regular || photo.urls?.full || photo.urls?.raw,
    downloadUrl: photo.links?.download_location || null,
    width: photo.width ?? null,
    height: photo.height ?? null,
    author: photo.user?.name || null,
    sourceUrl: photo.links?.html || null,
  })).filter((image: StockImage) => image.thumbnailUrl && image.imageUrl);
}

async function searchIstock(query: string, page: number, limit: number): Promise<StockImage[]> {
  const key = getIstockKey();
  if (!key) return [];

  const url = new URL('https://api.gettyimages.com/v3/search/images');
  url.searchParams.set('phrase', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(Math.min(limit, 50)));
  url.searchParams.set('fields', 'id,title,caption,display_sizes,artist');

  const response = await fetch(url, {
    headers: {
      'Api-Key': key,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    console.warn(`[stock-media] iStock search failed: ${response.status}`);
    return [];
  }

  const json = await response.json();
  return (json.images || []).map((image: any): StockImage | null => {
    const displaySizes = image.display_sizes || [];
    const preview = displaySizes.find((item: any) => item.name === 'preview') || displaySizes[0];
    const thumb = displaySizes.find((item: any) => item.name === 'thumb') || preview;
    if (!preview?.uri) return null;

    return {
      id: String(image.id),
      provider: 'istock',
      title: image.title || image.caption || 'iStock image',
      description: image.caption || null,
      thumbnailUrl: thumb?.uri || preview.uri,
      imageUrl: preview.uri,
      width: null,
      height: null,
      author: image.artist || null,
      sourceUrl: null,
    };
  }).filter(Boolean) as StockImage[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');
    const query = searchParams.get('query')?.trim();
    const provider = searchParams.get('provider') as StockProvider | 'all' | null;
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.min(60, Math.max(12, Number(searchParams.get('limit') || '30')));

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    if (!query) {
      return noCache({
        data: [],
        providers: {
          unsplash: Boolean(getUnsplashKey()),
          istock: Boolean(getIstockKey()),
        },
      });
    }

    const searches: Array<Promise<StockImage[]>> = [];
    if (!provider || provider === 'all' || provider === 'unsplash') {
      searches.push(searchUnsplash(query, page, limit));
    }
    if (!provider || provider === 'all' || provider === 'istock') {
      searches.push(searchIstock(query, page, limit));
    }

    const results = (await Promise.all(searches)).flat();

    return noCache({
      data: results,
      providers: {
        unsplash: Boolean(getUnsplashKey()),
        istock: Boolean(getIstockKey()),
      },
    });
  } catch (error) {
    console.error('[stock-media] Search failed:', error);
    return noCache({ error: 'Failed to search stock images' }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qaySiteId = searchParams.get('site');

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return noCache({ error: 'Not authorized for QAY site' }, 403);
    }

    const body = await request.json() as {
      provider?: StockProvider;
      imageUrl?: string;
      thumbnailUrl?: string;
      title?: string;
      width?: number | null;
      height?: number | null;
      author?: string | null;
      assetFolderId?: string | null;
    };

    if (!body.provider || !body.imageUrl || !body.title) {
      return noCache({ error: 'provider, imageUrl, and title are required' }, 400);
    }

    const hostname = new URL(body.imageUrl).hostname;
    const isAllowedHost =
      hostname.endsWith('unsplash.com') ||
      hostname.endsWith('images.unsplash.com') ||
      hostname.endsWith('gettyimages.com') ||
      hostname.endsWith('istockphoto.com') ||
      hostname.endsWith('gi-static.com');

    if (!isAllowedHost) {
      return noCache({ error: 'Unsupported stock image host' }, 400);
    }

    const filename = `${cleanFilename(body.title)}-${body.provider}.jpg`;
    const asset = await createAsset({
      filename,
      storage_path: null,
      public_url: body.imageUrl,
      file_size: 0,
      mime_type: 'image/jpeg',
      width: body.width ?? undefined,
      height: body.height ?? undefined,
      source: body.author ? `${body.provider}:${body.author}` : body.provider,
      asset_folder_id: body.assetFolderId ?? null,
    });

    if (qaySiteId) {
      await linkAssetToQaySite(qaySiteId, asset.id);
    }

    return NextResponse.json({ data: asset });
  } catch (error) {
    console.error('[stock-media] Import failed:', error);
    return noCache({ error: 'Failed to add stock image' }, 500);
  }
}
