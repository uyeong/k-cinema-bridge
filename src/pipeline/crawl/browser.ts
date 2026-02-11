import type { Browser } from 'playwright-core';

async function createBrowser(): Promise<Browser> {
  const { chromium } = await import('playwright');
  return chromium.launch();
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
