import { describe, it, expect } from 'vitest';

import { enrichMovie, transformBoxOffice, transformUpcoming } from './index';

describe('enrichMovie', () => {
  it('KOBIS에서 영화 정보를 조회한다', async () => {
    const info = await enrichMovie('기생충');
    expect(info).toBeDefined();
    expect(info!.code).toBe('20183782');
    expect(info!.title).toBe('기생충');
    expect(info!.englishTitle).toBe('PARASITE');
    expect(info!.runtime).toBe('131');
    expect(info!.productionYear).toBe('2019');
    expect(info!.openDate).toBe('20190530');
    expect(info!.productionStatus).toBeTruthy();
    expect(info!.type).toBe('장편');
    expect(info!.genres).toContain('드라마');
    expect(info!.nations).toContain('한국');
    expect(info!.directors).toContainEqual(expect.objectContaining({ name: '봉준호' }));
    expect(info!.audits).toContainEqual(expect.objectContaining({ grade: '15세이상관람가' }));
  });

  it('존재하지 않는 영화는 undefined를 반환한다', async () => {
    const info = await enrichMovie('존재하지않는영화제목XYZ123');
    expect(info).toBeUndefined();
  });
});

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
