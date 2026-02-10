import { chromium } from 'playwright-core';
import type { Browser } from 'playwright-core';

export async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const sparticuzChromium = (await import('@sparticuz/chromium')).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  }
  return chromium.launch();
}
