import { connection } from 'next/server';
import { NextResponse } from 'next/server';

import type { transformUpcoming } from '@/pipeline/transform';

import { SOURCES } from '../_lib/crawlers';
import { getCachedUpcoming } from '../_lib/cached';

export const maxDuration = 60;

export async function GET() {
  await connection();
  const entries: [string, Awaited<ReturnType<typeof transformUpcoming>>][] = [];
  for (const source of SOURCES) {
    entries.push([source, await getCachedUpcoming(source)]);
  }
  return NextResponse.json(Object.fromEntries(entries));
}
