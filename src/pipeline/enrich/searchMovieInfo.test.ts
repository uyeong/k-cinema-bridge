import { describe, it, expect } from 'vitest';

import { searchMovieInfo } from './index';

describe('enrich', () => {
  it('영화코드로 상세정보를 조회한다', async () => {
    const info = await searchMovieInfo({ movieCd: '20183782' });
    expect(info.movieNm).toBe('기생충');
    expect(info.movieNmEn).toBe('PARASITE');
    expect(info.showTm).toBe('131');
    expect(info.openDt).toBe('20190530');
    expect(info.prdtYear).toBe('2019');
    expect(info.typeNm).toBe('장편');
    expect(info.nations).toContainEqual({ nationNm: '한국' });
    expect(info.genres).toContainEqual({ genreNm: '드라마' });
    expect(info.directors).toContainEqual(
      expect.objectContaining({ peopleNm: '봉준호' }),
    );
    expect(info.audits).toContainEqual(
      expect.objectContaining({ watchGradeNm: '15세이상관람가' }),
    );
  });
});
