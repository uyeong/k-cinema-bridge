import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

import { transformUpcoming } from '@/pipeline/transform';

import type { CinemaSource } from '@/pipeline/transform/types';

import { crawlers, SOURCES } from '../_lib/crawlers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const getCachedUpcoming = unstable_cache(
  async (source: string) => {
    const s = source as CinemaSource;
    const movies = await crawlers[s].upcoming();
    return transformUpcoming(s, movies);
  },
  ['upcoming'],
  { revalidate: 86400 },
);

export async function GET() {
  const entries: [string, Awaited<ReturnType<typeof transformUpcoming>>][] = [];
  for (const source of SOURCES) {
    entries.push([source, await getCachedUpcoming(source)]);
  }
  return NextResponse.json(Object.fromEntries(entries));
}
