import { describe, it, expect } from 'vitest';

import { transformBoxOffice } from './index';

describe('transformBoxOffice', () => {
  it('크롤 데이터를 BoxOfficeMovie로 변환한다', async () => {
    const movies = [
      { rank: 1, title: '기생충', rating: '15세이상관람가', posterUrl: 'https://example.com/poster.jpg' },
    ];
    const result = await transformBoxOffice('lotte', movies);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('lotte');
    expect(result[0].rank).toBe(1);
    expect(result[0].title).toBe('기생충');
    expect(result[0].rating).toBe('15세이상관람가');
    expect(result[0].posterUrl).toBe('https://example.com/poster.jpg');
    expect(result[0].info).toBeDefined();
    expect(result[0].info!.code).toBe('20183782');
  });

  it('KOBIS 매칭 실패 시 info는 undefined이고 나머지 필드는 정상이다', async () => {
    const movies = [
      { rank: 1, title: '존재하지않는영화XYZ', rating: '전체관람가', posterUrl: 'https://example.com/none.jpg' },
    ];
    const result = await transformBoxOffice('cgv', movies);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('cgv');
    expect(result[0].rank).toBe(1);
    expect(result[0].title).toBe('존재하지않는영화XYZ');
    expect(result[0].info).toBeUndefined();
  });
});
