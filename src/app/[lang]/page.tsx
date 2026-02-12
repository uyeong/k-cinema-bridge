import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const t = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">k-cinema-bridge</h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {t.header.subtitle}
          </p>
        </div>
        <LanguageSwitcher current={locale} />
      </header>

      {/* Overview */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.overview.title}</h2>
        <p className="mt-3 leading-7 text-zinc-700 dark:text-zinc-300">
          {t.overview.description}
        </p>

        <h3 className="mt-8 text-xl font-semibold">
          {t.overview.usageTitle}
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
          {t.overview.usageItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-8 text-xl font-semibold">
          {t.overview.agentTitle}
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
          {t.overview.agentItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-100 p-4 text-sm leading-relaxed dark:bg-zinc-800">
          <code>{t.overview.agentCases}</code>
        </pre>
      </section>

      {/* API Endpoints */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.endpoints.title}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">
                  {t.endpoints.thMethod}
                </th>
                <th className="pb-2 pr-4 font-semibold">
                  {t.endpoints.thPath}
                </th>
                <th className="pb-2 font-semibold">
                  {t.endpoints.thDescription}
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              {(
                [
                  ["/api/boxoffice.json", t.endpoints.allBoxoffice],
                  ["/api/boxoffice/lotte.json", t.endpoints.lotteBoxoffice],
                  ["/api/boxoffice/cgv.json", t.endpoints.cgvBoxoffice],
                  ["/api/boxoffice/megabox.json", t.endpoints.megaboxBoxoffice],
                  ["/api/upcoming.json", t.endpoints.allUpcoming],
                  ["/api/upcoming/lotte.json", t.endpoints.lotteUpcoming],
                  ["/api/upcoming/cgv.json", t.endpoints.cgvUpcoming],
                  ["/api/upcoming/megabox.json", t.endpoints.megaboxUpcoming],
                ] as const
              ).map(([path, desc], i, arr) => (
                <tr
                  key={path}
                  className={
                    i < arr.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }
                >
                  <td className="py-2 pr-4 font-mono">GET</td>
                  <td className="py-2 pr-4 font-mono">{path}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Response Examples */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.responses.title}</h2>

        <h3 className="mt-6 text-xl font-semibold">
          {t.responses.boxofficeSingleTitle}
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

        <h3 className="mt-8 text-xl font-semibold">
          {t.responses.boxofficeCombinedTitle}
        </h3>
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
          {t.responses.upcomingSingleTitle}
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

      {/* Field Reference */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.fields.title}</h2>

        <h3 className="mt-6 text-xl font-semibold">BoxOfficeMovie</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">{t.fields.thField}</th>
                <th className="pb-2 pr-4 font-semibold">{t.fields.thType}</th>
                <th className="pb-2 font-semibold">
                  {t.fields.thDescription}
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              {(
                [
                  ["source", "CinemaSource", t.fields.boxoffice.source],
                  ["rank", "number", t.fields.boxoffice.rank],
                  ["title", "string", t.fields.boxoffice.title],
                  ["rating", "string", t.fields.boxoffice.rating],
                  ["posterUrl", "string", t.fields.boxoffice.posterUrl],
                  ["info", "MovieInfo?", t.fields.boxoffice.info],
                ] as const
              ).map(([field, type, desc], i, arr) => (
                <tr
                  key={field}
                  className={
                    i < arr.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }
                >
                  <td className="py-2 pr-4 font-mono">{field}</td>
                  <td className="py-2 pr-4 font-mono">{type}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">UpcomingMovie</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">{t.fields.thField}</th>
                <th className="pb-2 pr-4 font-semibold">{t.fields.thType}</th>
                <th className="pb-2 font-semibold">
                  {t.fields.thDescription}
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              {(
                [
                  ["source", "CinemaSource", t.fields.upcoming.source],
                  ["title", "string", t.fields.upcoming.title],
                  ["rating", "string", t.fields.upcoming.rating],
                  ["posterUrl", "string", t.fields.upcoming.posterUrl],
                  ["releaseDate", "string", t.fields.upcoming.releaseDate],
                  ["info", "MovieInfo?", t.fields.upcoming.info],
                ] as const
              ).map(([field, type, desc], i, arr) => (
                <tr
                  key={field}
                  className={
                    i < arr.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }
                >
                  <td className="py-2 pr-4 font-mono">{field}</td>
                  <td className="py-2 pr-4 font-mono">{type}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">MovieInfo</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-700">
                <th className="pb-2 pr-4 font-semibold">{t.fields.thField}</th>
                <th className="pb-2 pr-4 font-semibold">{t.fields.thType}</th>
                <th className="pb-2 font-semibold">
                  {t.fields.thDescription}
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300">
              {(
                [
                  ["code", "string", t.fields.movieInfo.code],
                  ["title", "string", t.fields.movieInfo.title],
                  ["englishTitle", "string", t.fields.movieInfo.englishTitle],
                  ["originalTitle", "string", t.fields.movieInfo.originalTitle],
                  ["runtime", "string", t.fields.movieInfo.runtime],
                  [
                    "productionYear",
                    "string",
                    t.fields.movieInfo.productionYear,
                  ],
                  ["openDate", "string", t.fields.movieInfo.openDate],
                  [
                    "productionStatus",
                    "string",
                    t.fields.movieInfo.productionStatus,
                  ],
                  ["type", "string", t.fields.movieInfo.type],
                  ["nations", "string[]", t.fields.movieInfo.nations],
                  ["genres", "string[]", t.fields.movieInfo.genres],
                  [
                    "directors",
                    "{name, englishName}[]",
                    t.fields.movieInfo.directors,
                  ],
                  [
                    "actors",
                    "{name, englishName, role, roleEnglish}[]",
                    t.fields.movieInfo.actors,
                  ],
                  [
                    "showTypes",
                    "{group, name}[]",
                    t.fields.movieInfo.showTypes,
                  ],
                  [
                    "companies",
                    "{code, name, englishName, part}[]",
                    t.fields.movieInfo.companies,
                  ],
                  [
                    "audits",
                    "{number, grade}[]",
                    t.fields.movieInfo.audits,
                  ],
                  [
                    "staff",
                    "{name, englishName, role}[]",
                    t.fields.movieInfo.staff,
                  ],
                ] as const
              ).map(([field, type, desc], i, arr) => (
                <tr
                  key={field}
                  className={
                    i < arr.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }
                >
                  <td className="py-2 pr-4 font-mono">{field}</td>
                  <td className="py-2 pr-4 font-mono">{type}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Agent Skill Setup */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.skillSetup.title}</h2>
        <p className="mt-3 leading-7 text-zinc-700 dark:text-zinc-300">
          {t.skillSetup.description}
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
          <p className="font-semibold">SKILL_URL</p>
          <code>https://uyeong.github.io/k-cinema-bridge/SKILL.md</code>
        </div>

        <h3 className="mt-6 text-lg font-semibold">Claude Code</h3>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          {t.skillSetup.claudeCodeDesc[0]}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            .claude/settings.json
          </code>
          {t.skillSetup.claudeCodeDesc[1]}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            CLAUDE.md
          </code>
          {t.skillSetup.claudeCodeDesc[2]}
        </p>

        <h3 className="mt-6 text-lg font-semibold">OpenClaw</h3>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          {t.skillSetup.openClawDesc}
        </p>
      </section>

      {/* Additional Information */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.supplementary.title}</h2>
        <dl className="mt-4 space-y-4 text-zinc-700 dark:text-zinc-300">
          <div>
            <dt className="font-semibold">{t.supplementary.refreshTerm}</dt>
            <dd className="mt-1">{t.supplementary.refreshDesc}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t.supplementary.sourceTerm}</dt>
            <dd className="mt-1">
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                lotte
              </code>
              {t.supplementary.sourceDesc[0]}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                cgv
              </code>
              {t.supplementary.sourceDesc[1]}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                megabox
              </code>
              {t.supplementary.sourceDesc[2]}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">{t.supplementary.infoTerm}</dt>
            <dd className="mt-1">
              {t.supplementary.infoDesc[0]}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                null
              </code>
              {t.supplementary.infoDesc[1]}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">
              {t.supplementary.validSourceTerm}
            </dt>
            <dd className="mt-1">{t.supplementary.validSourceDesc}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
