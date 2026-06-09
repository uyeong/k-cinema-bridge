import { MEGABOX_BOXOFFICE_PAGE_URL, MEGABOX_UPCOMMING_PAGE_URL } from './constants';
import { launchBrowser } from './browser';

import type { CrawledBoxOfficeMovie, CrawledUpcomingMovie } from './types';

const MEGABOX_USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';
const LIST_SELECTOR = 'ol > li';
const PAGE_TIMEOUT_MS = 60_000;
const LIST_TIMEOUT_MS = 15_000;

// 관람등급 클래스명 → 등급 텍스트 매핑
const GRADE_MAP: Record<string, string> = {
  'age-all': '전체 관람가',
  'age-12': '12세 관람가',
  'age-15': '15세 관람가',
  'age-18': '청소년 관람불가',
  'age-19': '청소년 관람불가',
  'age-no': '미정',
};

// 이중 인코딩된 HTML 엔티티를 디코딩한다 (&amp;AMP; → &AMP; → &)
function decodeEntities(text: string): string {
  return text.replace(/&AMP;/gi, '&').replace(/&LT;/gi, '<').replace(/&GT;/gi, '>');
}

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

async function captureMegaboxDebug(page: import('playwright-core').Page, label: string): Promise<string> {
  const title = await page.title().catch(() => '');
  const url = page.url();
  const bodyText = await page
    .locator('body')
    .textContent()
    .then((text) => text?.replace(/\s+/g, ' ').trim().slice(0, 240) ?? '')
    .catch(() => '');
  return `[megabox:${label}] url=${url} title="${title}" body="${bodyText}"`;
}

async function openMegaboxPage(
  page: import('playwright-core').Page,
  url: string,
  label: string,
): Promise<void> {
  try {
    const response = await page.goto(url, {
      timeout: PAGE_TIMEOUT_MS,
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
    await page.waitForSelector(LIST_SELECTOR, { timeout: LIST_TIMEOUT_MS });

    if (!response?.ok()) {
      const debug = await captureMegaboxDebug(page, label);
      throw new Error(`${debug} status=${response?.status() ?? 'unknown'}`);
    }
  } catch (error) {
    const debug = await captureMegaboxDebug(page, label);
    throw new Error(`${debug} cause=${error instanceof Error ? error.message : String(error)}`);
  }
}

// 더보기 버튼이 보이면 클릭하고 목록 갱신을 기다린다 (최대 2회)
async function expandList(page: import('playwright-core').Page): Promise<void> {
  for (let i = 0; i < 2; i++) {
    const moreButton = page.locator('button.btn:not(.btn-more-notice-list)', { hasText: '더보기' });
    if (!(await moreButton.isVisible())) break;
    const countBefore = await page.locator(LIST_SELECTOR).count();
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
  const browser = await launchBrowser();
  const page = await browser.newPage({
    userAgent: MEGABOX_USER_AGENT,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  });
  try {
    await openMegaboxPage(page, MEGABOX_BOXOFFICE_PAGE_URL, 'boxoffice');
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
      title: decodeEntities(title),
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
  const browser = await launchBrowser();
  const page = await browser.newPage({
    userAgent: MEGABOX_USER_AGENT,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  });
  try {
    await openMegaboxPage(page, MEGABOX_UPCOMMING_PAGE_URL, 'comingsoon');
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
      title: decodeEntities(title),
      rating: parseGrade(gradeClass),
      posterUrl,
      releaseDate: parseReleaseDate(dateText),
    }));
  } finally {
    await browser.close();
  }
}

export { crawlMegaboxBoxOffice, crawlMegaboxUpcoming };
