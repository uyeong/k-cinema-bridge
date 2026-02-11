
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
  try {
    return await crawlSource(source);
  } catch (err) {
    console.warn(`[${source}] failed, retrying... (${err})`);
    return crawlSource(source);
  }
}

async function main() {
  mkdirSync(join(OUT_DIR, 'boxoffice'), { recursive: true });
  mkdirSync(join(OUT_DIR, 'upcoming'), { recursive: true });

  console.log('Generating JSON files...');

  const boxofficeAggregate: Record<string, unknown> = {};
  const upcomingAggregate: Record<string, unknown> = {};
  const errors: string[] = [];

  await withSharedBrowser(async () => {
    for (const source of SOURCES) {
      try {
        const { boxofficeData, upcomingData } = await crawlWithRetry(source);
        writeJSON(join(OUT_DIR, 'boxoffice', `${source}.json`), boxofficeData);
        boxofficeAggregate[source] = boxofficeData;
        writeJSON(join(OUT_DIR, 'upcoming', `${source}.json`), upcomingData);
        upcomingAggregate[source] = upcomingData;
      } catch (err) {
        console.error(`[${source}] failed after retry: ${err}`);
        errors.push(source);
      }
    }
  });

  writeJSON(join(OUT_DIR, 'boxoffice.json'), boxofficeAggregate);
  writeJSON(join(OUT_DIR, 'upcoming.json'), upcomingAggregate);

  if (errors.length) {
    console.warn(`\nPartial failure: ${errors.join(', ')}`);
    process.exit(1);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
