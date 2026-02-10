import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { SOURCES } from '../_lib/crawlers';
import { getCachedBoxOffice, getCachedUpcoming } from '../_lib/cached';

const TAGS = ['boxoffice', 'upcoming'];

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 기존 캐시 무효화
  TAGS.forEach((tag) => revalidateTag(tag, { expire: 86400 }));

  // 2. 캐시 재생성 (순차 실행으로 메모리 절약)
  for (const source of SOURCES) {
    await getCachedBoxOffice(source);
    await getCachedUpcoming(source);
  }

  return NextResponse.json({ revalidated: TAGS });
}
