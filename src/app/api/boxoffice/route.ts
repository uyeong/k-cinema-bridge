import { NextResponse } from 'next/server';

import { transformBoxOffice } from '@/pipeline/transform';

import { crawlers, SOURCES } from '../_lib/crawlers';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  const entries: [string, Awaited<ReturnType<typeof transformBoxOffice>>][] = [];
  for (const source of SOURCES) {
    const movies = await crawlers[source].boxOffice();
    entries.push([source, await transformBoxOffice(source, movies)]);
  }
  return NextResponse.json(Object.fromEntries(entries));
}
