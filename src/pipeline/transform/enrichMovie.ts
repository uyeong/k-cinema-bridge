import { searchMovieCode, searchMovieInfo } from '../enrich';

import type { MovieInfo } from './types';

async function enrichMovie(title: string): Promise<MovieInfo | undefined> {
  try {
    const code = await searchMovieCode({ movieNm: title });
    if (!code) return undefined;
    const info = await searchMovieInfo({ movieCd: code.movieCd });
    return {
      code: info.movieCd,
      title: info.movieNm,
      englishTitle: info.movieNmEn,
      originalTitle: info.movieNmOg,
      runtime: info.showTm,
      productionYear: info.prdtYear,
      openDate: info.openDt,
      productionStatus: info.prdtStatNm,
      type: info.typeNm,
      nations: info.nations.map((n) => n.nationNm),
      genres: info.genres.map((g) => g.genreNm),
      directors: info.directors.map((d) => ({ name: d.peopleNm, englishName: d.peopleNmEn })),
      actors: info.actors.map((a) => ({ name: a.peopleNm, englishName: a.peopleNmEn, role: a.cast, roleEnglish: a.castEn })),
      showTypes: info.showTypes.map((s) => ({ group: s.showTypeGroupNm, name: s.showTypeNm })),
      companies: info.companys.map((c) => ({ code: c.companyCd, name: c.companyNm, englishName: c.companyNmEn, part: c.companyPartNm })),
      audits: info.audits.map((a) => ({ number: a.auditNo, grade: a.watchGradeNm })),
      staff: info.staffs.map((s) => ({ name: s.peopleNm, englishName: s.peopleNmEn, role: s.staffRoleNm })),
    };
  } catch {
    return undefined;
  }
}

export default enrichMovie;
