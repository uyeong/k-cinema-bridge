import { describe, it, expect } from 'vitest';

import { transformUpcoming } from './index';

describe('transformUpcoming', () => {
  it('크롤 데이터를 UpcomingMovie로 변환한다', async () => {
    const movies = [
      { title: '기생충', rating: '15세이상관람가', posterUrl: 'https://example.com/poster.jpg', releaseDate: '2019.05.30' },
    ];
    const result = await transformUpcoming('megabox', movies);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('megabox');
    expect(result[0].title).toBe('기생충');
    expect(result[0].releaseDate).toBe('2019.05.30');
    expect(result[0].info).toBeDefined();
    expect(result[0].info!.englishTitle).toBe('PARASITE');
  });

  it('releaseDate가 없으면 빈 문자열로 설정한다', async () => {
    const movies = [
      { title: '존재하지않는영화XYZ', rating: '전체관람가', posterUrl: 'https://example.com/none.jpg' },
    ];
    const result = await transformUpcoming('lotte', movies);
    expect(result).toHaveLength(1);
    expect(result[0].releaseDate).toBe('');
    expect(result[0].info).toBeUndefined();
  });
});
