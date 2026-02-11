import {
  crawlLotteBoxOffice,
  crawlLotteUpcoming,
  crawlCgvBoxOffice,
  crawlCgvUpcoming,
  crawlMegaboxBoxOffice,
  crawlMegaboxUpcoming,
} from './crawl';

import type { CinemaSource } from './transform';

const crawlers = {
  lotte: { boxOffice: crawlLotteBoxOffice, upcoming: crawlLotteUpcoming },
  cgv: { boxOffice: crawlCgvBoxOffice, upcoming: crawlCgvUpcoming },
  megabox: { boxOffice: crawlMegaboxBoxOffice, upcoming: crawlMegaboxUpcoming },
} as const;

const SOURCES = Object.keys(crawlers) as CinemaSource[];

export { crawlers, SOURCES };
