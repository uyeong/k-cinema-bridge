import enrichMovie from './enrichMovie';

import type { CrawledUpcomingMovie } from '../crawl/types';
import type { CinemaSource, UpcomingMovie } from './types';

async function transformUpcoming(
  source: CinemaSource,
  movies: CrawledUpcomingMovie[],
): Promise<UpcomingMovie[]> {
  return Promise.all(
    movies.map(async (movie) => {
      const info = await enrichMovie(movie.title);
      return {
        source,
        title: movie.title,
        rating: movie.rating,
        posterUrl: movie.posterUrl,
        releaseDate: movie.releaseDate ?? '',
        info,
      };
    }),
  );
}

export default transformUpcoming;
