import { NextResponse } from 'next/server';

import { transformUpcoming } from '@/pipeline/transform';

import { crawlers, SOURCES } from '../_lib/crawlers';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  const entries: [string, Awaited<ReturnType<typeof transformUpcoming>>][] = [];
  for (const source of SOURCES) {
    const movies = await crawlers[source].upcoming();
    entries.push([source, await transformUpcoming(source, movies)]);
  }
  return NextResponse.json(Object.fromEntries(entries));
}
