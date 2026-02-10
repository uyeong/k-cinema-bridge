import { NextResponse } from 'next/server';

import { transformBoxOffice } from '@/pipeline/transform';

import { crawlers, SOURCES } from '../_lib/crawlers';

export const revalidate = 86400;

export async function GET() {
  const results = await Promise.all(
    SOURCES.map(async (source) => {
      const movies = await crawlers[source].boxOffice();
      return transformBoxOffice(source, movies);
    }),
  );
  return NextResponse.json(results.flat());
}
