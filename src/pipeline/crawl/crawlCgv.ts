import { CGV_BOXOFFICE_PAGE_URL, CGV_UPCOMMING_PAGE_URL } from './constants';
import { launchBrowser } from './browser';

import type { CrawledBoxOfficeMovie, CrawledUpcomingMovie } from './types';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';

// CGV 관람등급 이미지 alt 텍스트 → 등급 텍스트 정규화
const RATING_MAP: Record<string, string> = {
  '전체 관람가': '전체 관람가',
  '전체관람가': '전체 관람가',
  '12세 관람가': '12세 관람가',
  '12세관람가': '12세 관람가',
  '15세 관람가': '15세 관람가',
  '15세관람가': '15세 관람가',
  '청소년 관람불가': '청소년 관람불가',
  '청소년관람불가': '청소년 관람불가',
};

function normalizeRating(alt: string): string {
  return RATING_MAP[alt] ?? alt;
}

interface RawCgvBoxOfficeItem {
  title: string;
  posterUrl: string;
  ratingAlt: string;
}

// CGV 박스오피스 목록을 크롤링한다
async function crawlCgvBoxOffice(): Promise<CrawledBoxOfficeMovie[]> {
  const browser = await launchBrowser();
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();
  try {
    await page.goto(CGV_BOXOFFICE_PAGE_URL, { timeout: 30_000 });
    await page.waitForSelector('li[class*="bestChartList_chartItem"]', { timeout: 15_000 });
    const rawItems = await page.evaluate(() => {
      const items = document.querySelectorAll('li[class*="bestChartList_chartItem"]');
      const results: { title: string; posterUrl: string; ratingAlt: string }[] = [];
      items.forEach((li) => {
        const title = li.querySelector('[class*="bestChartList_name"]')?.textContent?.trim() ?? '';
        if (!title) return;
        const posterUrl =
          li.querySelector('img[class*="bestChartList_poster"]')?.getAttribute('src') ?? '';
        const ratingAlt =
          li.querySelector('img[class*="bestChartList_age"]')?.getAttribute('alt') ?? '';
        results.push({ title, posterUrl, ratingAlt });
      });
      return results;
    }) as RawCgvBoxOfficeItem[];
    return rawItems.map(({ title, posterUrl, ratingAlt }, i) => ({
      rank: i + 1,
      title,
      rating: normalizeRating(ratingAlt),
      posterUrl,
    }));
  } finally {
    await browser.close();
  }
}

// "2026.02.11 개봉" 형식에서 날짜를 추출한다
function parseReleaseDate(text: string): string {
  const match = text.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!match) return '';
  return `${match[1]}-${match[2]}-${match[3]}`;
}

interface RawCgvUpcomingItem {
  title: string;
  posterUrl: string;
  ratingAlt: string;
  infoText: string;
}

// CGV 상영예정작 목록을 크롤링한다
async function crawlCgvUpcoming(): Promise<CrawledUpcomingMovie[]> {
  const browser = await launchBrowser();
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();
  try {
    await page.goto(CGV_UPCOMMING_PAGE_URL, { timeout: 30_000 });
    await page.waitForSelector('li[class*="bestChartList_chartItem"]', { timeout: 15_000 });
    const rawItems = await page.evaluate(() => {
      const items = document.querySelectorAll('li[class*="bestChartList_chartItem"]');
      const results: { title: string; posterUrl: string; ratingAlt: string; infoText: string }[] =
        [];
      items.forEach((li) => {
        const title = li.querySelector('[class*="bestChartList_name"]')?.textContent?.trim() ?? '';
        if (!title) return;
        const posterUrl =
          li.querySelector('img[class*="bestChartList_poster"]')?.getAttribute('src') ?? '';
        const ratingAlt =
          li.querySelector('img[class*="bestChartList_age"]')?.getAttribute('alt') ?? '';
        const infoText =
          li.querySelector('p[class*="bestChartList_info"] span')?.textContent?.trim() ?? '';
        results.push({ title, posterUrl, ratingAlt, infoText });
      });
      return results;
    }) as RawCgvUpcomingItem[];
    return rawItems.map(({ title, posterUrl, ratingAlt, infoText }) => ({
      title,
      rating: normalizeRating(ratingAlt),
      posterUrl,
      releaseDate: parseReleaseDate(infoText),
    }));
  } finally {
    await browser.close();
  }
}

export { crawlCgvBoxOffice, crawlCgvUpcoming };