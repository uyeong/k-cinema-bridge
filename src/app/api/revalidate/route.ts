import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { SOURCES } from '../_lib/crawlers';

export const maxDuration = 60;

type RevalidateType = 'boxoffice' | 'upcoming';

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type') as RevalidateType | null;
  const types: RevalidateType[] = type ? [type] : ['boxoffice', 'upcoming'];

  // 1. 캐시 무효화
  types.forEach((t) => revalidateTag(t, { expire: 86400 }));

  // 2. 각 route를 직접 fetch하여 캐시 재생성
  //    각 route가 자신의 번들 컨텍스트에서 unstable_cache를 채움
  const baseUrl = getBaseUrl();
  const results: Record<string, 'ok' | string> = {};

  for (const t of types) {
    const fetches = SOURCES.map(async (source) => {
      try {
        const res = await fetch(`${baseUrl}/api/${t}/${source}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        results[`${t}/${source}`] = 'ok';
      } catch (e) {
        results[`${t}/${source}`] = e instanceof Error ? e.message : String(e);
      }
    });
    await Promise.all(fetches);
  }

  return NextResponse.json({ revalidated: types, results });
}
