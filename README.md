# k-cinema-bridge

한국 3대 멀티플렉스(롯데시네마, CGV, 메가박스)의 영화 데이터를 수집하여 통합 JSON API로 제공하는 정적 데이터 브릿지입니다.

## 데이터 소스

| 소스 | 수집 대상 |
|---|---|
| 롯데시네마 | 박스오피스, 상영예정작 |
| CGV | 박스오피스, 상영예정작 |
| 메가박스 | 박스오피스, 상영예정작 |

## 파이프라인

3단계로 구성됩니다:

1. **Crawl** - Playwright로 각 극장사 웹사이트에서 박스오피스 및 상영예정작 원시 데이터를 수집합니다.
2. **Transform** - 극장사별로 상이한 원시 데이터를 통합 스키마로 변환하고, KOBIS API로 영화 상세 정보를 보강합니다.
3. **Publish** - Next.js Route Handler로 JSON API를 제공합니다. ISR(`revalidate = 86400`)로 24시간 주기 재검증합니다.

## API

| 경로 | 설명 |
|---|---|
| `GET /api/boxoffice` | 3사 종합 박스오피스 |
| `GET /api/boxoffice/lotte` | 롯데시네마 박스오피스 |
| `GET /api/boxoffice/cgv` | CGV 박스오피스 |
| `GET /api/boxoffice/megabox` | 메가박스 박스오피스 |
| `GET /api/upcoming` | 3사 종합 상영예정작 |
| `GET /api/upcoming/lotte` | 롯데시네마 상영예정작 |
| `GET /api/upcoming/cgv` | CGV 상영예정작 |
| `GET /api/upcoming/megabox` | 메가박스 상영예정작 |

종합 엔드포인트는 source별로 그룹핑하여 `{ "lotte": [...], "cgv": [...], "megabox": [...] }` 형태로 반환합니다.

## 스케줄링

Vercel Cron Jobs로 매일 00:00 UTC에 `/api/revalidate`를 호출하여 전체 경로를 갱신합니다.

## 기술 스택

- **Runtime**: Next.js 16 (App Router) + TypeScript
- **Package Manager**: pnpm
- **Hosting**: Vercel