import {
  crawlLotteBoxOffice,
  crawlLotteUpcoming,
  crawlCgvBoxOffice,
  crawlCgvUpcoming,
  crawlMegaboxBoxOffice,
  crawlMegaboxUpcoming,
} from '@/pipeline/crawl';

import type { CinemaSource } from '@/pipeline/transform';

const crawlers = {
  lotte: { boxOffice: crawlLotteBoxOffice, upcoming: crawlLotteUpcoming },
  cgv: { boxOffice: crawlCgvBoxOffice, upcoming: crawlCgvUpcoming },
  megabox: { boxOffice: crawlMegaboxBoxOffice, upcoming: crawlMegaboxUpcoming },
} as const;

const SOURCES = Object.keys(crawlers) as CinemaSource[];

function isValidSource(s: string): s is CinemaSource {
  return s in crawlers;
}

export { crawlers, SOURCES, isValidSource };
