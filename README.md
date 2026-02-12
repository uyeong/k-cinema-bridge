# k-cinema-bridge

A static data bridge that collects movie data from Korea's three major multiplex chains (Lotte Cinema, CGV, Megabox) and serves it as a unified JSON API.

- [English](#data-sources)
- [한국어](#데이터-소스)

## Data Sources

| Source | Collected Data |
|---|---|
| Lotte Cinema | Box office, Upcoming movies |
| CGV | Box office, Upcoming movies |
| Megabox | Box office, Upcoming movies |

## Pipeline

The pipeline consists of three stages:

1. **Crawl** - Collects raw box office and upcoming movie data from each cinema chain's website using Playwright.
2. **Transform** - Converts the different raw data formats into a unified schema and enriches them with detailed movie information from the KOBIS API.
3. **Publish** - Generates static JSON files and deploys them to GitHub Pages.

## API

| Path | Description |
|---|---|
| `GET /api/boxoffice.json` | Combined box office from all sources |
| `GET /api/boxoffice/lotte.json` | Lotte Cinema box office |
| `GET /api/boxoffice/cgv.json` | CGV box office |
| `GET /api/boxoffice/megabox.json` | Megabox box office |
| `GET /api/upcoming.json` | Combined upcoming movies from all sources |
| `GET /api/upcoming/lotte.json` | Lotte Cinema upcoming movies |
| `GET /api/upcoming/cgv.json` | CGV upcoming movies |
| `GET /api/upcoming/megabox.json` | Megabox upcoming movies |

Combined endpoints return data grouped by source: `{ "lotte": [...], "cgv": [...], "megabox": [...] }`.

## Scheduling

Data is collected and deployed to GitHub Pages daily at 00:00 UTC via GitHub Actions.

## Tech Stack

- **Runtime**: Next.js 16 (App Router) + TypeScript
- **Package Manager**: pnpm
- **Hosting**: GitHub Pages

---

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
3. **Publish** - 정적 JSON 파일을 생성하여 GitHub Pages로 배포합니다.

## API

| 경로 | 설명 |
|---|---|
| `GET /api/boxoffice.json` | 3사 종합 박스오피스 |
| `GET /api/boxoffice/lotte.json` | 롯데시네마 박스오피스 |
| `GET /api/boxoffice/cgv.json` | CGV 박스오피스 |
| `GET /api/boxoffice/megabox.json` | 메가박스 박스오피스 |
| `GET /api/upcoming.json` | 3사 종합 상영예정작 |
| `GET /api/upcoming/lotte.json` | 롯데시네마 상영예정작 |
| `GET /api/upcoming/cgv.json` | CGV 상영예정작 |
| `GET /api/upcoming/megabox.json` | 메가박스 상영예정작 |

종합 엔드포인트는 source별로 그룹핑하여 `{ "lotte": [...], "cgv": [...], "megabox": [...] }` 형태로 반환합니다.

## 스케줄링

GitHub Actions로 매일 00:00 UTC에 데이터를 수집하고 GitHub Pages에 배포합니다.

## 기술 스택

- **Runtime**: Next.js 16 (App Router) + TypeScript
- **Package Manager**: pnpm
- **Hosting**: GitHub Pages
