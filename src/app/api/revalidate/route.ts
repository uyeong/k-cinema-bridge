import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const TAGS = ['boxoffice', 'upcoming'];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  TAGS.forEach((tag) => revalidateTag(tag, { expire: 86400 }));
  return NextResponse.json({ revalidated: TAGS });
}
