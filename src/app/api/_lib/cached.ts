import { unstable_cache } from 'next/cache';

import { transformBoxOffice, transformUpcoming } from '@/pipeline/transform';
import type { CinemaSource } from '@/pipeline/transform/types';

import { crawlers } from './crawlers';

export const getCachedBoxOffice = unstable_cache(
  async (source: string) => {
    const s = source as CinemaSource;
    const movies = await crawlers[s].boxOffice();
    return transformBoxOffice(s, movies);
  },
  ['boxoffice'],
  { revalidate: 86400, tags: ['boxoffice'] },
);

export const getCachedUpcoming = unstable_cache(
  async (source: string) => {
    const s = source as CinemaSource;
    const movies = await crawlers[s].upcoming();
    return transformUpcoming(s, movies);
  },
  ['upcoming'],
  { revalidate: 86400, tags: ['upcoming'] },
);
