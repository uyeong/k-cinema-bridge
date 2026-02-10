import { NextResponse } from 'next/server';

import type { transformBoxOffice } from '@/pipeline/transform';
import { withSharedBrowser } from '@/pipeline/crawl';

import { SOURCES } from '../_lib/crawlers';
import { getCachedBoxOffice } from '../_lib/cached';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const entries: [string, Awaited<ReturnType<typeof transformBoxOffice>>][] = [];
  await withSharedBrowser(async () => {
    for (const source of SOURCES) {
      entries.push([source, await getCachedBoxOffice(source)]);
    }
  });
  return NextResponse.json(Object.fromEntries(entries));
}
