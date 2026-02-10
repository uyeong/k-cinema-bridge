import qs from 'fast-querystring';

interface Params {
  movieNm: string;
}

interface Result {
  movieCd: string;       // 영화코드
  movieNm: string;       // 영화명(국문)
  movieNmEn: string;     // 영화명(영문)
  prdtYear: string;      // 제작연도
  openDt: string;        // 개봉일(YYYYMMDD)
  typeNm: string;        // 영화유형(장편, 단편 등)
  prdtStatNm: string;    // 제작상태(개봉, 기타 등)
  nationAlt: string;     // 제작국가(전체)
  genreAlt: string;      // 장르(전체)
  repNationNm: string;   // 대표국적
  repGenreNm: string;    // 대표장르
  directors: { peopleNm: string }[];
  companys: { companyCd: string; companyNm: string }[];
}

// 영화명으로 KOBIS 영화코드를 조회한다
// 동명 영화가 여러 개일 수 있으므로 개봉일 기준 최신 선택
async function searchMovieCode({ movieNm }: Params): Promise<Result | null> {
  const query = qs.stringify({ key: process.env.KOBIS_API_KEY!, movieNm });
  const res = await fetch(`${process.env.KOBIS_API_URL}/searchMovieList.json?${query}`);
  const data = await res.json();
  const matches = data.movieListResult.movieList
    .filter((m: Result) => m.movieNm === movieNm)
    .sort((a: Result, b: Result) => b.openDt.localeCompare(a.openDt));
  return matches[0] ?? null;
}

export default searchMovieCode;
export type { Params, Result };