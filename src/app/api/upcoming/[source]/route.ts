import { NextResponse } from 'next/server';

import { transformUpcoming } from '@/pipeline/transform';

import { crawlers, isValidSource } from '../../_lib/crawlers';

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ source: 'lotte' }, { source: 'cgv' }, { source: 'megabox' }];
}

export async function GET(_: Request, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;
  if (!isValidSource(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 404 });
  }
  const movies = await crawlers[source].upcoming();
  const result = await transformUpcoming(source, movies);
  return NextResponse.json(result);
}
