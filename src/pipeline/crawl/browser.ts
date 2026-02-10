import { chromium } from 'playwright-core';
import type { Browser, Page } from 'playwright-core';

const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar';

let executablePathPromise: Promise<string> | null = null;

function getExecutablePath(): Promise<string> {
  if (!executablePathPromise) {
    executablePathPromise = import('@sparticuz/chromium-min').then((mod) =>
      mod.default.executablePath(CHROMIUM_PACK_URL),
    );
  }
  return executablePathPromise;
}

const BLOCKED_TYPES = new Set(['image', 'stylesheet', 'font', 'media']);

export async function blockHeavyResources(page: Page): Promise<void> {
  await page.route('**/*', (route) =>
    BLOCKED_TYPES.has(route.request().resourceType()) ? route.abort() : route.continue(),
  );
}

export async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const sparticuzChromium = (await import('@sparticuz/chromium-min')).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await getExecutablePath(),
      headless: true,
    });
  }
  return chromium.launch();
}
