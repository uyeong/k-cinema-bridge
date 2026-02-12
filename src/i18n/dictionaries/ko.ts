const ko = {
  meta: {
    title: "k-cinema-bridge",
    description: "한국 멀티플렉스 영화 데이터 통합 JSON API",
  },
  header: {
    subtitle: "한국 멀티플렉스 영화 데이터 통합 JSON API",
  },
  overview: {
    title: "개요",
    description:
      "이 API는 한국 3대 멀티플렉스(롯데시네마, CGV, 메가박스)의 박스오피스 및 상영예정작 데이터를 크롤링하고, KOBIS(영화진흥위원회) 영화 정보로 보강하여 통합 JSON 형태로 제공합니다.",
    usageTitle: "데이터 활용 예시",
    usageItems: [
      "현재 상영 중인 영화의 멀티플렉스별 순위 비교 및 추천",
      "개봉 예정작 안내 및 알림",
      "장르, 감독, 배우 기반 영화 검색 및 필터링",
      "멀티플렉스 간 상영작 차이 분석",
    ],
    agentTitle: "AI 에이전트용 지침 (AGENT INSTRUCTIONS)",
    agentItems: [
      "BASE_URL: https://uyeong.github.io/k-cinema-bridge",
      "OPENAPI_SPEC: https://uyeong.github.io/k-cinema-bridge/openapi.json",
      "모든 엔드포인트는 인증 없이 GET 요청만으로 사용 가능",
      "info 필드가 null일 수 있으므로 반드시 null 체크 필요",
    ],
    agentCases: `## 인기 영화 추천

사용자가 영화 추천이나 인기 영화를 물어볼 때:

1. GET {BASE_URL}/api/boxoffice.json으로 전체 소스 박스오피스 데이터를 가져온다.
2. 여러 소스에 공통으로 등장하며 rank 값이 낮은 영화를 파악한다 — rank가 낮을수록 상위.
3. 제목, 관람 등급, info.genres의 장르 정보를 포함하여 상위 영화를 안내한다.

## 개봉 예정작 안내

사용자가 곧 개봉하거나 상영 예정인 영화를 물어볼 때:

1. GET {BASE_URL}/api/upcoming.json으로 전체 소스 상영예정작 데이터를 가져온다.
2. releaseDate(YYYY-MM-DD)로 사용자가 요청한 기간에 맞게 필터링한다.
3. info 필드가 있으면 장르, 감독, 배우 등의 상세 정보를 제공한다.

## 장르/감독/배우 기반 검색

사용자가 특정 장르, 감독, 배우를 물어볼 때:

1. GET {BASE_URL}/api/boxoffice.json과 GET {BASE_URL}/api/upcoming.json을 모두 가져온다.
2. info 필드로 필터링한다:
   - 장르: info.genres에서 매칭
   - 감독: info.directors[].name에서 매칭
   - 배우: info.actors[].name에서 매칭
3. 중첩 속성 접근 전에 반드시 info 필드의 null 체크를 수행한다.

## 관람 등급 기반 필터링

사용자가 연령에 적합한 영화를 물어볼 때:

1. rating 필드로 필터링한다. 이 필드는 항상 존재하며 info 필드가 필요하지 않다.
2. 알려진 등급 값: "전체 관람가", "12세 관람가", "15세 관람가", "청소년 관람불가"

## 특정 멀티플렉스 조회

사용자가 특정 극장 체인을 물어볼 때:

1. GET {BASE_URL}/api/boxoffice/{source}.json 또는 GET {BASE_URL}/api/upcoming/{source}.json을 가져온다.
2. 유효한 source 값: lotte, cgv, megabox

## 멀티플렉스 간 비교

사용자가 극장 체인 간 순위 비교를 요청할 때:

1. GET {BASE_URL}/api/boxoffice.json으로 종합 데이터를 가져온다.
2. 서로 다른 소스에서 같은 title을 가진 영화를 찾아 rank 값을 비교한다.

## 응답 가이드라인

- 사용자가 사용하는 언어와 동일한 언어로 응답한다.
- 영화 목록을 제시할 때 제목, 순위 또는 개봉일, 관람 등급, 가능하면 장르를 포함한다.
- info가 null인 영화는 기본 필드(title, rank, rating, posterUrl)만 안내하고 누락된 정보를 추측하지 않는다.
- 멀티플렉스 간 비교 시 표 형식을 사용한다.`,
  },
  endpoints: {
    title: "API 엔드포인트",
    thMethod: "메서드",
    thPath: "경로",
    thDescription: "설명",
    allBoxoffice: "전체 소스 박스오피스 종합 ({lotte, cgv, megabox})",
    lotteBoxoffice: "롯데시네마 박스오피스 (BoxOfficeMovie[])",
    cgvBoxoffice: "CGV 박스오피스 (BoxOfficeMovie[])",
    megaboxBoxoffice: "메가박스 박스오피스 (BoxOfficeMovie[])",
    allUpcoming: "전체 소스 상영예정작 종합 ({lotte, cgv, megabox})",
    lotteUpcoming: "롯데시네마 상영예정작 (UpcomingMovie[])",
    cgvUpcoming: "CGV 상영예정작 (UpcomingMovie[])",
    megaboxUpcoming: "메가박스 상영예정작 (UpcomingMovie[])",
  },
  responses: {
    title: "응답 예시",
    boxofficeSingleTitle: "개별 박스오피스 (BoxOfficeMovie[])",
    boxofficeCombinedTitle: "종합 박스오피스",
    upcomingSingleTitle: "개별 상영예정작 (UpcomingMovie[])",
  },
  fields: {
    title: "필드 설명",
    thField: "필드",
    thType: "타입",
    thDescription: "설명",
    boxoffice: {
      source: '데이터 출처 ("lotte" | "cgv" | "megabox")',
      rank: "박스오피스 순위 (1부터 시작)",
      title: "영화 제목",
      rating: "관람 등급",
      posterUrl: "포스터 이미지 URL",
      info: "KOBIS 상세 정보 (null일 수 있음)",
    },
    upcoming: {
      source: '데이터 출처 ("lotte" | "cgv" | "megabox")',
      title: "영화 제목",
      rating: "관람 등급",
      posterUrl: "포스터 이미지 URL",
      releaseDate: "개봉 예정일 (YYYY-MM-DD, 빈 문자열일 수 있음)",
      info: "KOBIS 상세 정보 (null일 수 있음)",
    },
    movieInfo: {
      code: "KOBIS 영화 코드",
      title: "영화 제목 (한글)",
      englishTitle: "영문 제목",
      originalTitle: "원제",
      runtime: "상영 시간 (분)",
      productionYear: "제작 연도",
      openDate: "개봉일 (YYYYMMDD)",
      productionStatus: "제작 상태",
      type: "영화 유형 (장편, 단편 등)",
      nations: "제작 국가",
      genres: "장르",
      directors: "감독",
      actors: "출연 배우",
      showTypes: "상영 형태 (2D, IMAX 등)",
      companies: "관련 회사 (배급사, 제작사 등)",
      audits: "심의 정보",
      staff: "스태프",
    },
  },
  skillSetup: {
    title: "AI 에이전트 스킬 설정",
    description:
      "AI 에이전트가 이 API를 활용할 수 있도록 스킬 파일을 제공합니다. 아래 URL의 내용을 에이전트 설정에 추가하면 한국 영화 데이터를 자동으로 조회하고 활용할 수 있습니다.",
    claudeCodeDesc: [
      "SKILL.md 내용을 프로젝트의 ",
      " 에 skill로 등록하거나, ",
      " 에 SKILL_URL을 참조하도록 지침을 추가합니다.",
    ],
    openClawDesc:
      "에이전트 프롬프트 또는 스킬 설정에서 위 URL을 fetch하여 컨텍스트에 포함시킵니다.",
  },
  supplementary: {
    title: "보충 정보",
    refreshTerm: "데이터 갱신 주기",
    refreshDesc: "GitHub Actions로 매일 00:00 UTC에 자동 갱신됩니다.",
    sourceTerm: "source 값",
    sourceDesc: [" (롯데시네마), ", " (CGV), ", " (메가박스)"],
    infoTerm: "info 필드",
    infoDesc: [
      "KOBIS 영화 데이터베이스와 제목 매칭에 실패하면 ",
      "이 반환됩니다. 응답 처리 시 null 체크가 필요합니다.",
    ],
    validSourceTerm: "유효한 source 값",
    validSourceDesc:
      "lotte, cgv, megabox만 사용할 수 있습니다. 해당하는 JSON 파일이 없으면 404 응답이 반환됩니다.",
  },
};

export type Dictionary = typeof ko;
export default ko;
