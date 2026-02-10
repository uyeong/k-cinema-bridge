import { describe, it, expect } from 'vitest';

import { enrichMovie } from './index';

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
