
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { withSharedBrowser } from '@/pipeline/crawl';
import { transformBoxOffice, transformUpcoming } from '@/pipeline/transform';
import { crawlers, SOURCES } from '@/pipeline/sources';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'out', 'api');

function writeJSON(filePath: string, data: unknown): void {
  writeFileSync(filePath, JSON.stringify(data));
  console.log(`  ${filePath}`);
}

async function crawlSource(source: (typeof SOURCES)[number]) {
  const { boxOffice, upcoming } = crawlers[source];
  const boxofficeData = await transformBoxOffice(source, await boxOffice());
  const upcomingData = await transformUpcoming(source, await upcoming());
  return { boxofficeData, upcomingData };
}

async function crawlWithRetry(source: (typeof SOURCES)[number]) {
  const maxAttempts = source === 'megabox' ? 3 : 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[${source}] crawl attempt ${attempt}/${maxAttempts}`);
      return await crawlSource(source);
    } catch (err) {
      lastError = err;
      const prefix = `[${source}] attempt ${attempt}/${maxAttempts} failed`;
      if (attempt === maxAttempts) {
        break;
      }
      console.warn(`${prefix}, retrying... (${err})`);
    }
  }

  throw lastError;
}

async function main() {
  mkdirSync(join(OUT_DIR, 'boxoffice'), { recursive: true });
  mkdirSync(join(OUT_DIR, 'upcoming'), { recursive: true });

  console.log('Generating JSON files...');

  const boxofficeAggregate: Record<string, unknown> = {};
  const upcomingAggregate: Record<string, unknown> = {};
  const errors: string[] = [];
  const succeededSources: string[] = [];

  await withSharedBrowser(async () => {
    for (const source of SOURCES) {
      try {
        const { boxofficeData, upcomingData } = await crawlWithRetry(source);
        writeJSON(join(OUT_DIR, 'boxoffice', `${source}.json`), boxofficeData);
        boxofficeAggregate[source] = boxofficeData;
        writeJSON(join(OUT_DIR, 'upcoming', `${source}.json`), upcomingData);
        upcomingAggregate[source] = upcomingData;
        succeededSources.push(source);
      } catch (err) {
        console.error(`[${source}] failed after retry: ${err}`);
        errors.push(source);
      }
    }
  });

  writeJSON(join(OUT_DIR, 'boxoffice.json'), boxofficeAggregate);
  writeJSON(join(OUT_DIR, 'upcoming.json'), upcomingAggregate);
  writeJSON(join(OUT_DIR, 'crawl-status.json'), {
    generatedAt: new Date().toISOString(),
    succeededSources,
    failedSources: errors,
  });

  if (errors.length === SOURCES.length) {
    console.error(`\nAll sources failed: ${errors.join(', ')}`);
    process.exit(1);
  }

  if (errors.length) {
    console.warn(`\nPartial failure: ${errors.join(', ')}`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
