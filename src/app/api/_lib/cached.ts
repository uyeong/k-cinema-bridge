import { cacheLife, cacheTag } from 'next/cache';

import { transformBoxOffice, transformUpcoming } from '@/pipeline/transform';
import type { CinemaSource } from '@/pipeline/transform/types';

import { crawlers } from './crawlers';

export async function getCachedBoxOffice(source: string) {
  'use cache';
  cacheTag('boxoffice');
  cacheLife('days');
  const s = source as CinemaSource;
  const movies = await crawlers[s].boxOffice();
  return transformBoxOffice(s, movies);
}

export async function getCachedUpcoming(source: string) {
  'use cache';
  cacheTag('upcoming');
  cacheLife('days');
  const s = source as CinemaSource;
  const movies = await crawlers[s].upcoming();
  return transformUpcoming(s, movies);
}
