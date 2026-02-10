import { NextResponse } from 'next/server';

import { isValidSource } from '../../_lib/crawlers';
import { getCachedUpcoming } from '../../_lib/cached';

export const maxDuration = 60;

export async function GET(_: Request, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;
  if (!isValidSource(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 404 });
  }
  const result = await getCachedUpcoming(source);
  return NextResponse.json(result);
}
