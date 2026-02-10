import { chromium } from 'playwright-core';
import type { Browser } from 'playwright-core';

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
