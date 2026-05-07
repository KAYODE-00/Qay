import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/icon.svg', request.url), {
    status: 308,
  });
}
