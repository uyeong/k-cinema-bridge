import qs from 'fast-querystring';

interface Params {
  movieCd: string;
}

interface Result {
  movieCd: string;       // 영화코드
  movieNm: string;       // 영화명(국문)
  movieNmEn: string;     // 영화명(영문)
  movieNmOg: string;     // 영화명(원문)
  showTm: string;        // 러닝타임(분)
  prdtYear: string;      // 제작연도
  openDt: string;        // 개봉일(YYYYMMDD)
  prdtStatNm: string;    // 제작상태(개봉, 기타 등)
  typeNm: string;        // 영화유형(장편, 단편 등)
  nations: { nationNm: string }[];
  genres: { genreNm: string }[];
  directors: { peopleNm: string; peopleNmEn: string }[];
  actors: { peopleNm: string; peopleNmEn: string; cast: string; castEn: string }[];
  showTypes: { showTypeGroupNm: string; showTypeNm: string }[];
  companys: { companyCd: string; companyNm: string; companyNmEn: string; companyPartNm: string }[];
  audits: { auditNo: string; watchGradeNm: string }[];
  staffs: { peopleNm: string; peopleNmEn: string; staffRoleNm: string }[];
}

const cache = new Map<string, Result>();

// 영화코드로 KOBIS 상세정보를 조회한다
async function searchMovieInfo({ movieCd }: Params): Promise<Result> {
  if (cache.has(movieCd)) return cache.get(movieCd)!;
  const query = qs.stringify({ key: process.env.KOBIS_API_KEY!, movieCd });
  const res = await fetch(`${process.env.KOBIS_API_URL}/searchMovieInfo.json?${query}`);
  const data = await res.json();
  const result = data.movieInfoResult.movieInfo;
  cache.set(movieCd, result);
  return result;
}

export default searchMovieInfo;
export type { Params, Result }