import enrichMovie from './enrichMovie';

import type { CrawledBoxOfficeMovie } from '../crawl/types';
import type { BoxOfficeMovie, CinemaSource } from './types';

async function transformBoxOffice(
  source: CinemaSource,
  movies: CrawledBoxOfficeMovie[],
): Promise<BoxOfficeMovie[]> {
  return Promise.all(
    movies.map(async (movie) => {
      const info = await enrichMovie(movie.title);
      return {
        source,
        rank: movie.rank,
        title: movie.title,
        rating: movie.rating,
        posterUrl: movie.posterUrl,
        info,
      };
    }),
  );
}

export default transformBoxOffice;
