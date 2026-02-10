import { chromium } from 'playwright';

import { MEGABOX_BOXOFFICE_PAGE_URL, MEGABOX_UPCOMMING_PAGE_URL } from './constants';

import type { CrawledBoxOfficeMovie, CrawledUpcomingMovie } from './types';

// 관람등급 클래스명 → 등급 텍스트 매핑
const GRADE_MAP: Record<string, string> = {
  'age-all': '전체 관람가',
  'age-12': '12세 관람가',
  'age-15': '15세 관람가',
  'age-18': '청소년 관람불가',
};

function parseGrade(className: string): string {
  const key = className.split(' ').find((c) => c.startsWith('age-')) ?? '';
  return GRADE_MAP[key] ?? '';
}

// "개봉일 2026.02.11" 형식에서 날짜를 추출한다
function parseReleaseDate(text: string): string {
  const match = text.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!match) return '';
  return `${match[1]}-${match[2]}-${match[3]}`;
}

// 더보기 버튼이 보이면 클릭하고 목록 갱신을 기다린다 (최대 2회)
async function expandList(page: import('playwright').Page): Promise<void> {
  for (let i = 0; i < 2; i++) {
    const moreButton = page.locator('button.btn:not(.btn-more-notice-list)', { hasText: '더보기' });
    if (!(await moreButton.isVisible())) break;
    const countBefore = await page.locator('ol > li').count();
    await moreButton.click();
    await page
      .waitForFunction(
        (before) => document.querySelectorAll('ol > li').length > before,
        countBefore,
        { timeout: 10_000 },
      )
      .catch(() => {});
  }
}

interface RawMegaboxBoxOfficeItem {
  title: string;
  posterUrl: string;
  gradeClass: string;
}

// 메가박스 박스오피스 목록을 크롤링한다
async function crawlMegaboxBoxOffice(): Promise<CrawledBoxOfficeMovie[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(MEGABOX_BOXOFFICE_PAGE_URL, { timeout: 30_000 });
    await page.waitForSelector('ol > li', { timeout: 15_000 });
    await expandList(page);
    const rawItems = await page.evaluate(() => {
      const items = document.querySelectorAll('ol > li');
      const results: { title: string; posterUrl: string; gradeClass: string }[] = [];
      items.forEach((li) => {
        const title = li.querySelector('.tit-area .tit')?.textContent?.trim() ?? '';
        if (!title) return;
        const posterUrl = li.querySelector('img.poster')?.getAttribute('src') ?? '';
        const gradeClass = li.querySelector('.movie-grade')?.getAttribute('class') ?? '';
        results.push({ title, posterUrl, gradeClass });
      });
      return results;
    }) as RawMegaboxBoxOfficeItem[];
    return rawItems.map(({ title, posterUrl, gradeClass }, i) => ({
      rank: i + 1,
      title,
      rating: parseGrade(gradeClass),
      posterUrl,
    }));
  } finally {
    await browser.close();
  }
}

interface RawMegaboxUpcomingItem {
  title: string;
  posterUrl: string;
  gradeClass: string;
  dateText: string;
}

// 메가박스 상영예정작 목록을 크롤링한다
async function crawlMegaboxUpcoming(): Promise<CrawledUpcomingMovie[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(MEGABOX_UPCOMMING_PAGE_URL, { timeout: 30_000 });
    await page.waitForSelector('ol > li', { timeout: 15_000 });
    await expandList(page);
    const rawItems = await page.evaluate(() => {
      const items = document.querySelectorAll('ol > li');
      const results: { title: string; posterUrl: string; gradeClass: string; dateText: string }[] =
        [];
      items.forEach((li) => {
        const title = li.querySelector('.tit-area .tit')?.textContent?.trim() ?? '';
        if (!title) return;
        const posterUrl = li.querySelector('img.poster')?.getAttribute('src') ?? '';
        const gradeClass = li.querySelector('.movie-grade')?.getAttribute('class') ?? '';
        const dateText = li.querySelector('.rate-date .date')?.textContent?.trim() ?? '';
        results.push({ title, posterUrl, gradeClass, dateText });
      });
      return results;
    }) as RawMegaboxUpcomingItem[];
    return rawItems.map(({ title, posterUrl, gradeClass, dateText }) => ({
      title,
      rating: parseGrade(gradeClass),
      posterUrl,
      releaseDate: parseReleaseDate(dateText),
    }));
  } finally {
    await browser.close();
  }
}

export { crawlMegaboxBoxOffice, crawlMegaboxUpcoming };