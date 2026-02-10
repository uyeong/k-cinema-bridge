import { NextResponse } from 'next/server';

import type { transformUpcoming } from '@/pipeline/transform';
import { withSharedBrowser } from '@/pipeline/crawl';

import { SOURCES } from '../_lib/crawlers';
import { getCachedUpcoming } from '../_lib/cached';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const entries: [string, Awaited<ReturnType<typeof transformUpcoming>>][] = [];
  await withSharedBrowser(async () => {
    for (const source of SOURCES) {
      entries.push([source, await getCachedUpcoming(source)]);
    }
  });
  const response = NextResponse.json(Object.fromEntries(entries));
  response.headers.set(
    'CDN-Cache-Control',
    'public, max-age=86400, stale-while-revalidate=86400',
  );
  return response;
}
