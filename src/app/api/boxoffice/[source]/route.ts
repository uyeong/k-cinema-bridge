import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

import { transformBoxOffice } from '@/pipeline/transform';

import type { CinemaSource } from '@/pipeline/transform/types';

import { crawlers, isValidSource } from '../../_lib/crawlers';

export const maxDuration = 60;

const getCachedBoxOffice = unstable_cache(
  async (source: string) => {
    const s = source as CinemaSource;
    const movies = await crawlers[s].boxOffice();
    return transformBoxOffice(s, movies);
  },
  ['boxoffice'],
  { revalidate: 86400 },
);

export async function GET(_: Request, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;
  if (!isValidSource(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 404 });
  }
  const result = await getCachedBoxOffice(source);
  return NextResponse.json(result);
}
