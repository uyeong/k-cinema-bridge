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

async function createBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const sparticuzChromium = (await import('@sparticuz/chromium-min')).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await getExecutablePath(),
      headless: true,
    });
  }
  // 로컬: devDep playwright가 설치한 브라우저 바이너리 사용
  const { chromium: localChromium } = await import('playwright');
  return localChromium.launch();
}

// 공유 브라우저: withSharedBrowser 내부에서 launchBrowser를 호출하면
// 새 브라우저를 만들지 않고 공유 인스턴스를 반환하며, close()는 no-op이 된다.
let _shared: Browser | null = null;

export async function launchBrowser(): Promise<Browser> {
  if (_shared?.isConnected()) {
    return new Proxy(_shared, {
      get(target, prop, receiver) {
        if (prop === 'close') return async () => {};
        return Reflect.get(target, prop, receiver);
      },
    }) as Browser;
  }
  return createBrowser();
}

export async function withSharedBrowser<T>(fn: () => Promise<T>): Promise<T> {
  _shared = await createBrowser();
  try {
    return await fn();
  } finally {
    await _shared.close();
    _shared = null;
  }
}
