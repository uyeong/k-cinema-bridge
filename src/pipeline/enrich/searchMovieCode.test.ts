import { describe, it, expect } from 'vitest';

import { searchMovieCode } from './index';

describe.skipIf(!!process.env.CI)('enrich', () => {
  it('영화명으로 영화코드를 조회한다', async () => {
    const result = await searchMovieCode({ movieNm: '기생충' });
    expect(result).not.toBeNull();
    expect(result!.movieCd).toBe('20183782');
    expect(result!.movieNmEn).toBe('PARASITE');
    expect(result!.prdtYear).toBe('2019');
    expect(result!.openDt).toBe('20190530');
    expect(result!.nationAlt).toBe('한국');
    expect(result!.genreAlt).toBe('드라마');
    expect(result!.directors).toContainEqual({ peopleNm: '봉준호' });
  });
});
