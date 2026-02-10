import { NextResponse } from 'next/server';

import { transformBoxOffice } from '@/pipeline/transform';

import { crawlers, SOURCES } from '../_lib/crawlers';

export const revalidate = 86400;

export async function GET() {
  const entries = await Promise.all(
    SOURCES.map(async (source) => {
      const movies = await crawlers[source].boxOffice();
      return [source, await transformBoxOffice(source, movies)] as const;
    }),
  );
  return NextResponse.json(Object.fromEntries(entries));
}
