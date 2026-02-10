import { connection } from 'next/server';
import { NextResponse } from 'next/server';

import type { transformBoxOffice } from '@/pipeline/transform';

import { SOURCES } from '../_lib/crawlers';
import { getCachedBoxOffice } from '../_lib/cached';

export const maxDuration = 60;

export async function GET() {
  await connection();
  const entries: [string, Awaited<ReturnType<typeof transformBoxOffice>>][] = [];
  for (const source of SOURCES) {
    entries.push([source, await getCachedBoxOffice(source)]);
  }
  return NextResponse.json(Object.fromEntries(entries));
}
