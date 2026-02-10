import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const PATHS = [
  '/api/boxoffice',
  '/api/boxoffice/lotte',
  '/api/boxoffice/cgv',
  '/api/boxoffice/megabox',
  '/api/upcoming',
  '/api/upcoming/lotte',
  '/api/upcoming/cgv',
  '/api/upcoming/megabox',
];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  PATHS.forEach((path) => revalidatePath(path));
  return NextResponse.json({ revalidated: PATHS });
}
