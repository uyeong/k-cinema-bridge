import { LOTTE_CINEMA_BOXOFFICE_PAGE_URL, LOTTE_CINEMA_UPCOMING_PAGE_URL } from './constants';
import { blockHeavyResources, launchBrowser } from './browser';

import type { CrawledBoxOfficeMovie, CrawledUpcomingMovie } from './types';

// 관람등급 클래스명 → 등급 텍스트 매핑
const GRADE_MAP: Record<string, string> = {
  gr_all: '전체 관람가',
  gr_12: '12세 관람가',
  gr_15: '15세 관람가',
  gr_18: '청소년 관람불가',
};

interface RawBoxOfficeItem {
  title: string;
  posterUrl: string;
  gradeClass: string;
}

// 롯데시네마 박스오피스 목록을 크롤링한다
async function crawlLotteBoxOffice(): Promise<CrawledBoxOfficeMovie[]> {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await blockHeavyResources(page);
  try {
    await page.goto(LOTTE_CINEMA_BOXOFFICE_PAGE_URL, { timeout: 30_000 });
    await page.waitForSelector('ul.movie_list.type2 > li', { timeout: 15_000 });
    // 펼쳐보기 버튼이 있으면 클릭 후 새 항목 로드 대기
    const moreButton = page.locator('button.btn_txt_more');
    if (await moreButton.isVisible()) {
      const countBefore = await page.locator('ul.movie_list.type2 > li').count();
      await moreButton.click();
      await page.waitForFunction(
        (before) => document.querySelectorAll('ul.movie_list.type2 > li').length > before,
        countBefore,
      );
    }
    // DOM에서 한번에 추출하여 타임아웃 방지
    const rawItems = await page.evaluate(() => {
      const items = document.querySelectorAll('ul.movie_list.type2 > li');
      const results: { title: string; posterUrl: string; gradeClass: string }[] = [];
      items.forEach((li) => {
        const titEl = li.querySelector('.tit_info');
        if (!titEl) return;
        const title = titEl.textContent?.trim() ?? '';
        if (!title) return;
        const posterUrl = li.querySelector('.poster_info img')?.getAttribute('src') ?? '';
        const gradeClass = li.querySelector('.ic_grade')?.getAttribute('class') ?? '';
        results.push({ title, posterUrl, gradeClass });
      });
      return results;
    }) as RawBoxOfficeItem[];
    return rawItems.map(({ title, posterUrl, gradeClass }, i) => {
      const gradeKey = gradeClass.split(' ').find((c) => c.startsWith('gr_')) ?? '';
      const rating = GRADE_MAP[gradeKey] ?? '';
      return { rank: i + 1, title: title.replace(rating, '').trim(), rating, posterUrl };
    });
  } finally {
    await browser.close();
  }
}

// D-day 텍스트로부터 개봉일을 계산한다 (한국 시간 기준)
function resolveReleaseDate(dDay: string): string {
  const match = dDay.match(/D-(\d+)/);
  if (!match) return '';
  const days = Number(match[1]);
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  kst.setUTCDate(kst.getUTCDate() + days);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface RawUpcomingItem {
  title: string;
  posterUrl: string;
  gradeClass: string;
  dDay: string;
}

// 롯데시네마 상영예정작 목록을 크롤링한다
async function crawlLotteUpcoming(): Promise<CrawledUpcomingMovie[]> {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await blockHeavyResources(page);
  try {
    await page.goto(LOTTE_CINEMA_UPCOMING_PAGE_URL, { timeout: 30_000 });
    await page.waitForSelector('ul.movie_list.type2 > li', { timeout: 15_000 });
    // 펼쳐보기 버튼이 있으면 클릭 후 새 항목 로드 대기
    const moreButton = page.locator('button.btn_txt_more');
    if (await moreButton.isVisible()) {
      const countBefore = await page.locator('ul.movie_list.type2 > li').count();
      await moreButton.click();
      await page.waitForFunction(
        (before) => document.querySelectorAll('ul.movie_list.type2 > li').length > before,
        countBefore,
      );
    }
    // DOM에서 한번에 추출하여 타임아웃 방지
    const rawItems = await page.evaluate(() => {
      const items = document.querySelectorAll('ul.movie_list.type2 > li');
      const results: { title: string; posterUrl: string; gradeClass: string; dDay: string }[] = [];
      items.forEach((li) => {
        const titEl = li.querySelector('.tit_info');
        if (!titEl) return;
        const title = titEl.textContent?.trim() ?? '';
        if (!title) return;
        const posterUrl = li.querySelector('.poster_info img')?.getAttribute('src') ?? '';
        const gradeClass = li.querySelector('.ic_grade')?.getAttribute('class') ?? '';
        const dDay = li.querySelector('.remain_info')?.textContent?.trim() ?? '';
        results.push({ title, posterUrl, gradeClass, dDay });
      });
      return results;
    }) as RawUpcomingItem[];
    return rawItems.map(({ title, posterUrl, gradeClass, dDay }) => {
      const gradeKey = gradeClass.split(' ').find((c) => c.startsWith('gr_')) ?? '';
      const rating = GRADE_MAP[gradeKey] ?? '';
      const releaseDate = resolveReleaseDate(dDay);
      return { title: title.replace(rating, '').trim(), rating, posterUrl, releaseDate };
    });
  } finally {
    await browser.close();
  }
}

export { crawlLotteBoxOffice, crawlLotteUpcoming };