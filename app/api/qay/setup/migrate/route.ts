import { NextResponse } from 'next/server';
import { runQayCoreMigration } from '@/qay/lib/schema';

export const dynamic = 'force-dynamic';

export async function POST() {
  const result = await runQayCoreMigration();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      message: 'QAY core migration completed',
    },
  });
}
