interface CrawledMovie {
  title: string;
  rating: string;
  posterUrl: string;
}

interface CrawledBoxOfficeMovie extends CrawledMovie {
  rank: number;
}

interface CrawledUpcomingMovie extends CrawledMovie {
  releaseDate?: string;
}

export type { CrawledMovie, CrawledBoxOfficeMovie, CrawledUpcomingMovie };