import { noCache } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  return noCache({ error: 'Export is not available.' }, 404);
}
