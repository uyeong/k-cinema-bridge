
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

async function main() {
  mkdirSync(join(OUT_DIR, 'boxoffice'), { recursive: true });
  mkdirSync(join(OUT_DIR, 'upcoming'), { recursive: true });

  console.log('Generating JSON files...');

  const boxofficeAggregate: Record<string, unknown> = {};
  const upcomingAggregate: Record<string, unknown> = {};

  await withSharedBrowser(async () => {
    for (const source of SOURCES) {
      const { boxOffice, upcoming } = crawlers[source];

      const boxofficeData = await transformBoxOffice(source, await boxOffice());
      writeJSON(join(OUT_DIR, 'boxoffice', `${source}.json`), boxofficeData);
      boxofficeAggregate[source] = boxofficeData;

      const upcomingData = await transformUpcoming(source, await upcoming());
      writeJSON(join(OUT_DIR, 'upcoming', `${source}.json`), upcomingData);
      upcomingAggregate[source] = upcomingData;
    }
  });

  writeJSON(join(OUT_DIR, 'boxoffice.json'), boxofficeAggregate);
  writeJSON(join(OUT_DIR, 'upcoming.json'), upcomingAggregate);

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
