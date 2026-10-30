import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import type { Page } from 'playwright-core';

const DIAGNOSTICS_DIR = join(process.cwd(), 'diagnostics');

// 크롤 실패 시 원인 판별용 화면 상태를 남긴다
// 공개 페이지의 상태만 기록하며 자격증명·쿠키·환경변수는 수집하지 않는다
async function captureCrawlFailure(page: Page, label: string, status?: number): Promise<void> {
  try {
    mkdirSync(DIAGNOSTICS_DIR, { recursive: true });
    const url = page.url();
    const title = await page.title().catch(() => '');
    const bodyExcerpt = await page
      .evaluate(() => document.body?.innerText?.slice(0, 500) ?? '')
      .catch(() => '');
    const screenshotPath = join(DIAGNOSTICS_DIR, `${label}-${Date.now()}.png`);
    const screenshot = await page
      .screenshot({ path: screenshotPath })
      .then(() => screenshotPath)
      .catch(() => 'failed');
    console.warn(
      `[diagnostics] ${label} status=${status ?? 'unknown'} url=${url} title=${JSON.stringify(title)} body=${JSON.stringify(bodyExcerpt)} screenshot=${screenshot}`,
    );
  } catch {
    // 진단 수집 실패가 원래 오류를 가리지 않게 한다
  }
}

export { captureCrawlFailure };
