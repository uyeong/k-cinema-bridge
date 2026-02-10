import { describe, it, expect } from 'vitest';

import { crawlMegaboxBoxOffice, crawlMegaboxUpcoming } from './crawlMegabox';

import type { CrawledBoxOfficeMovie, CrawledUpcomingMovie } from './types';

describe('crawlMegabox', () => {
  it('박스오피스 목록을 반환한다', async () => {
    const movies: CrawledBoxOfficeMovie[] = await crawlMegaboxBoxOffice();
    expect(movies.length).toBeGreaterThan(0);
    console.log(movies);
    const first = movies[0];
    expect(first.rank).toBe(1);
    expect(first.title).toBeTruthy();
    expect(first.rating).toBeTruthy();
    expect(first.posterUrl).toBeTruthy();
  });
  it('상영예정작 목록을 반환한다', async () => {
    const movies: CrawledUpcomingMovie[] = await crawlMegaboxUpcoming();
    expect(movies.length).toBeGreaterThan(0);
    const first = movies[0];
    expect(first.title).toBeTruthy();
    expect(first.rating).toBeTruthy();
    expect(first.posterUrl).toBeTruthy();
    expect(first.releaseDate).toBeTruthy();
  });
});
