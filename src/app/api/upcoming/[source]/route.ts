import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

import { transformUpcoming } from '@/pipeline/transform';

import type { CinemaSource } from '@/pipeline/transform/types';

import { crawlers, isValidSource } from '../../_lib/crawlers';

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

export async function GET(_: Request, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;
  if (!isValidSource(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 404 });
  }
  const result = await getCachedUpcoming(source);
  return NextResponse.json(result);
}
