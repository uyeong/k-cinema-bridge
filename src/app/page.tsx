export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 font-[family-name:var(--font-geist-sans)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">k-cinema-bridge</h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          한국 멀티플렉스 영화 데이터 통합 JSON API
        </p>
      </header>

      {/* 지침 영역 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">개요</h2>
        <p className="mt-3 leading-7 text-zinc-700 dark:text-zinc-300">
          이 API는 한국 3대 멀티플렉스(롯데시네마, CGV, 메가박스)의 박스오피스 및
          상영예정작 데이터를 크롤링하고, KOBIS(영화진흥위원회) 영화 정보로
          보강하여 통합 JSON 형태로 제공합니다.
        </p>

        <h3 className="mt-8 text-xl font-semibold">데이터 활용 예시</h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>현재 상영 중인 영화의 멀티플렉스별 순위 비교 및 추천</li>
          <li>개봉 예정작 안내 및 알림</li>
          <li>장르, 감독, 배우 기반 영화 검색 및 필터링</li>
          <li>멀티플렉스 간 상영작 차이 분석</li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">AI 에이전트용 지침 (AGENT INSTRUCTIONS)</h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>BASE_URL: https://uyeong.github.io/k-cinema-bridge</li>
          <li>OPENAPI_SPEC: https://uyeong.github.io/k-cinema-bridge/openapi.json</li>
          <li>모든 엔드포인트는 인증 없이 GET 요청만으로 사용 가능</li>
          <li>info 필드가 null일 수 있으므로 반드시 null 체크 필요</li>
        </ul>

        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-100 p-4 text-sm leading-relaxed dark:bg-zinc-800">
          <code>{`## Case 1: 현재 인기 영화 추천
트리거: "요즘 뭐 볼만해?", "영화 추천해줘"
엔드포인트: GET /api/boxoffice.json
설명: 전체 멀티플렉스 박스오피스를 가져와 공통 상위권 영화를 파악한다.
- data.lotte, data.cgv, data.megabox 각각 BoxOfficeMovie[]
- rank가 낮을수록 상위, info.genres로 장르 안내 가능

## Case 2: 개봉 예정작 안내
트리거: "곧 개봉하는 영화 뭐 있어?", "다음 달 영화"
엔드포인트: GET /api/upcoming.json
설명: 전체 멀티플렉스 상영예정작을 가져온다.
- releaseDate(YYYY-MM-DD)로 날짜 필터링
- info.genres, info.directors, info.actors로 상세 정보 제공

## Case 3: 장르/감독/배우 기반 검색
트리거: "액션 영화 뭐 해?", "봉준호 신작 나왔어?", "마동석 영화"
엔드포인트: GET /api/boxoffice.json + GET /api/upcoming.json
설명: 박스오피스와 상영예정작을 모두 조회 후 info 필드로 필터링한다.
- 장르: movie.info?.genres.includes("액션")
- 감독: movie.info?.directors.some(d => d.name === "봉준호")
- 배우: movie.info?.actors.some(a => a.name === "마동석")

## Case 4: 관람 등급 기반 필터링
트리거: "아이랑 볼만한 영화", "전체관람가 영화 뭐 있어?"
엔드포인트: GET /api/boxoffice.json 또는 GET /api/upcoming.json
설명: rating 필드로 필터링한다. info 없이도 가능.
- "전체 관람가" | "12세 관람가" | "15세 관람가" | "청소년 관람불가"
- 예: movies.filter(m => m.rating === "전체 관람가")

## Case 5: 특정 멀티플렉스 조회
트리거: "CGV에서 뭐 해?", "롯데시네마 상영작"
엔드포인트: GET /api/boxoffice/{source}.json 또는 GET /api/upcoming/{source}.json
설명: source는 "lotte" | "cgv" | "megabox"
- rank 순으로 정렬되어 있음, posterUrl로 포스터 표시 가능

## Case 6: 멀티플렉스 간 비교
트리거: "CGV랑 메가박스 순위 차이 알려줘"
엔드포인트: GET /api/boxoffice.json
설명: 종합 데이터에서 같은 title을 가진 영화의 rank를 비교한다.
- 특정 멀티플렉스에만 있는 영화 파악 가능`}</code>
        </pre>
      </section>

      {/* API 엔드포인트 테이블 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">API 엔드포인트</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">메서드</th>
                <th className="pb-2 pr-4 font-semibold">경로</th>
                <th className="pb-2 font-semibold">설명</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/boxoffice.json</td>
                <td className="py-2">전체 소스 박스오피스 종합</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/boxoffice/lotte.json</td>
                <td className="py-2">롯데시네마 박스오피스</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/boxoffice/cgv.json</td>
                <td className="py-2">CGV 박스오피스</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/boxoffice/megabox.json</td>
                <td className="py-2">메가박스 박스오피스</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/upcoming.json</td>
                <td className="py-2">전체 소스 상영예정작 종합</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/upcoming/lotte.json</td>
                <td className="py-2">롯데시네마 상영예정작</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/upcoming/cgv.json</td>
                <td className="py-2">CGV 상영예정작</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">GET</td>
                <td className="py-2 pr-4 font-mono">/api/upcoming/megabox.json</td>
                <td className="py-2">메가박스 상영예정작</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 응답 payload 예시 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">응답 예시</h2>

        <h3 className="mt-6 text-xl font-semibold">
          개별 박스오피스 (BoxOfficeMovie[])
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          GET /api/boxoffice/cgv.json
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
          <code>{`[
  {
    "source": "cgv",
    "rank": 1,
    "title": "위키드",
    "rating": "전체관람가",
    "posterUrl": "https://...",
    "info": {
      "code": "20247282",
      "title": "위키드",
      "englishTitle": "Wicked",
      "originalTitle": "",
      "runtime": "160",
      "productionYear": "2024",
      "openDate": "20241120",
      "productionStatus": "개봉",
      "type": "장편",
      "nations": ["미국"],
      "genres": ["뮤지컬", "판타지"],
      "directors": [{ "name": "존 추", "englishName": "Jon M. Chu" }],
      "actors": [
        {
          "name": "신시아 에리보",
          "englishName": "Cynthia Erivo",
          "role": "엘파바",
          "roleEnglish": ""
        }
      ],
      "showTypes": [{ "group": "2D", "name": "디지털" }],
      "companies": [
        {
          "code": "20100141",
          "name": "유니버설 픽처스",
          "englishName": "",
          "part": "배급사"
        }
      ],
      "audits": [{ "number": "2024-MF02644", "grade": "전체관람가" }],
      "staff": []
    }
  }
]`}</code>
        </pre>

        <h3 className="mt-8 text-xl font-semibold">종합 박스오피스</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          GET /api/boxoffice.json
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
          <code>{`{
  "lotte": [{ "source": "lotte", "rank": 1, "title": "...", ... }],
  "cgv": [{ "source": "cgv", "rank": 1, "title": "...", ... }],
  "megabox": [{ "source": "megabox", "rank": 1, "title": "...", ... }]
}`}</code>
        </pre>

        <h3 className="mt-8 text-xl font-semibold">
          개별 상영예정작 (UpcomingMovie[])
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          GET /api/upcoming/lotte.json
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
          <code>{`[
  {
    "source": "lotte",
    "title": "미키 17",
    "rating": "15세이상관람가",
    "posterUrl": "https://...",
    "releaseDate": "2025.03.06",
    "info": {
      "code": "20243782",
      "title": "미키 17",
      "englishTitle": "Mickey 17",
      "runtime": "137",
      ...
    }
  }
]`}</code>
        </pre>
      </section>

      {/* 필드 설명 테이블 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">필드 설명</h2>

        <h3 className="mt-6 text-xl font-semibold">BoxOfficeMovie</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">필드</th>
                <th className="pb-2 pr-4 font-semibold">타입</th>
                <th className="pb-2 font-semibold">설명</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">source</td>
                <td className="py-2 pr-4 font-mono">CinemaSource</td>
                <td className="py-2">
                  데이터 출처 (&quot;lotte&quot; | &quot;cgv&quot; |
                  &quot;megabox&quot;)
                </td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">rank</td>
                <td className="py-2 pr-4 font-mono">number</td>
                <td className="py-2">박스오피스 순위</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">title</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">영화 제목</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">rating</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">관람 등급</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">posterUrl</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">포스터 이미지 URL</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">info</td>
                <td className="py-2 pr-4 font-mono">MovieInfo?</td>
                <td className="py-2">KOBIS 영화 상세 정보 (매칭 실패 시 null)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">UpcomingMovie</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">필드</th>
                <th className="pb-2 pr-4 font-semibold">타입</th>
                <th className="pb-2 font-semibold">설명</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">source</td>
                <td className="py-2 pr-4 font-mono">CinemaSource</td>
                <td className="py-2">
                  데이터 출처 (&quot;lotte&quot; | &quot;cgv&quot; |
                  &quot;megabox&quot;)
                </td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">title</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">영화 제목</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">rating</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">관람 등급</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">posterUrl</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">포스터 이미지 URL</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">releaseDate</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">개봉 예정일</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">info</td>
                <td className="py-2 pr-4 font-mono">MovieInfo?</td>
                <td className="py-2">KOBIS 영화 상세 정보 (매칭 실패 시 null)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">MovieInfo</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">필드</th>
                <th className="pb-2 pr-4 font-semibold">타입</th>
                <th className="pb-2 font-semibold">설명</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">code</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">KOBIS 영화 코드</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">title</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">영화 제목 (한글)</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">englishTitle</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">영문 제목</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">originalTitle</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">원제</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">runtime</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">상영 시간 (분)</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">productionYear</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">제작 연도</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">openDate</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">개봉일 (YYYYMMDD)</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">productionStatus</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">제작 상태</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">type</td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2">영화 유형 (장편, 단편 등)</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">nations</td>
                <td className="py-2 pr-4 font-mono">string[]</td>
                <td className="py-2">제작 국가</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">genres</td>
                <td className="py-2 pr-4 font-mono">string[]</td>
                <td className="py-2">장르</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">directors</td>
                <td className="py-2 pr-4 font-mono">
                  {`{name, englishName}[]`}
                </td>
                <td className="py-2">감독</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">actors</td>
                <td className="py-2 pr-4 font-mono">
                  {`{name, englishName, role, roleEnglish}[]`}
                </td>
                <td className="py-2">출연 배우</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">showTypes</td>
                <td className="py-2 pr-4 font-mono">{`{group, name}[]`}</td>
                <td className="py-2">상영 형태 (2D, IMAX 등)</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">companies</td>
                <td className="py-2 pr-4 font-mono">
                  {`{code, name, englishName, part}[]`}
                </td>
                <td className="py-2">관련 회사 (배급사, 제작사 등)</td>
              </tr>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4 font-mono">audits</td>
                <td className="py-2 pr-4 font-mono">
                  {`{number, grade}[]`}
                </td>
                <td className="py-2">심의 정보</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">staff</td>
                <td className="py-2 pr-4 font-mono">
                  {`{name, englishName, role}[]`}
                </td>
                <td className="py-2">스태프</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AI 에이전트 스킬 설정 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">AI 에이전트 스킬 설정</h2>
        <p className="mt-3 leading-7 text-zinc-700 dark:text-zinc-300">
          AI 에이전트가 이 API를 활용할 수 있도록 스킬 파일을 제공합니다.
          아래 URL의 내용을 에이전트 설정에 추가하면 한국 영화 데이터를
          자동으로 조회하고 활용할 수 있습니다.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
          <p className="font-semibold">SKILL_URL</p>
          <code>https://uyeong.github.io/k-cinema-bridge/SKILL.md</code>
        </div>

        <h3 className="mt-6 text-lg font-semibold">Claude Code</h3>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          SKILL.md 내용을 프로젝트의{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            .claude/settings.json
          </code>
          에 skill로 등록하거나,{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            CLAUDE.md
          </code>
          에 SKILL_URL을 참조하도록 지침을 추가합니다.
        </p>

        <h3 className="mt-6 text-lg font-semibold">OpenClaw</h3>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          에이전트 프롬프트 또는 스킬 설정에서 위 URL을 fetch하여
          컨텍스트에 포함시킵니다.
        </p>
      </section>

      {/* 보충 정보 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">보충 정보</h2>
        <dl className="mt-4 space-y-4 text-zinc-700 dark:text-zinc-300">
          <div>
            <dt className="font-semibold">데이터 갱신 주기</dt>
            <dd className="mt-1">
              GitHub Actions로 매일 00:00 UTC에 자동 갱신됩니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">source 값</dt>
            <dd className="mt-1">
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                lotte
              </code>{" "}
              (롯데시네마),{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                cgv
              </code>{" "}
              (CGV),{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                megabox
              </code>{" "}
              (메가박스)
            </dd>
          </div>
          <div>
            <dt className="font-semibold">info 필드</dt>
            <dd className="mt-1">
              KOBIS 영화 데이터베이스와 제목 매칭에 실패하면{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                null
              </code>
              이 반환됩니다. 응답 처리 시 null 체크가 필요합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">유효한 source 값</dt>
            <dd className="mt-1">
              lotte, cgv, megabox만 사용할 수 있습니다.
              해당하는 JSON 파일이 없으면 404 응답이 반환됩니다.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
