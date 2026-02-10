interface Movie {
  title: string;
  rating: string;
  posterUrl: string;
}

interface BoxOfficeMovie extends Movie {
  rank: number;
}

interface UpcomingMovie extends Movie {
  releaseDate: string;
}

export default Movie;
export type { BoxOfficeMovie, UpcomingMovie };