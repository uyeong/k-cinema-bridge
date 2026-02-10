type CinemaSource = 'lotte' | 'cgv' | 'megabox';

interface MovieInfo {
  code: string;
  title: string;
  englishTitle: string;
  originalTitle: string;
  runtime: string;
  productionYear: string;
  openDate: string;
  productionStatus: string;
  type: string;
  nations: string[];
  genres: string[];
  directors: { name: string; englishName: string }[];
  actors: { name: string; englishName: string; role: string; roleEnglish: string }[];
  showTypes: { group: string; name: string }[];
  companies: { code: string; name: string; englishName: string; part: string }[];
  audits: { number: string; grade: string }[];
  staff: { name: string; englishName: string; role: string }[];
}

interface BoxOfficeMovie {
  source: CinemaSource;
  rank: number;
  title: string;
  rating: string;
  posterUrl: string;
  info?: MovieInfo;
}

interface UpcomingMovie {
  source: CinemaSource;
  title: string;
  rating: string;
  posterUrl: string;
  releaseDate: string;
  info?: MovieInfo;
}

export type { CinemaSource, MovieInfo, BoxOfficeMovie, UpcomingMovie };
