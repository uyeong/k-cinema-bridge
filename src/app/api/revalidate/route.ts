import { updateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { withSharedBrowser } from '@/pipeline/crawl';

import { SOURCES } from '../_lib/crawlers';
import { getCachedBoxOffice, getCachedUpcoming } from '../_lib/cached';

export const maxDuration = 60;

type RevalidateType = 'boxoffice' | 'upcoming';

const handlers: Record<RevalidateType, (source: string) => Promise<unknown>> = {
  boxoffice: getCachedBoxOffice,
  upcoming: getCachedUpcoming,
};

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type') as RevalidateType | null;
  const types: RevalidateType[] = type ? [type] : ['boxoffice', 'upcoming'];

  // 1. 캐시 즉시 무효화 (같은 요청 내에서 fresh 데이터 반환)
  types.forEach((t) => updateTag(t));

  // 2. 공유 브라우저로 캐시 재생성
  const results: Record<string, 'ok' | string> = {};

  await withSharedBrowser(async () => {
    for (const t of types) {
      for (const source of SOURCES) {
        try {
          await handlers[t](source);
          results[`${t}/${source}`] = 'ok';
        } catch (e) {
          results[`${t}/${source}`] = e instanceof Error ? e.message : String(e);
        }
      }
    }
  });

  return NextResponse.json({ revalidated: types, results });
}
