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

1. **Crawl** - 각 극장사 웹사이트/API에서 박스오피스 및 상영예정작 원시 데이터를 수집합니다.
2. **Transform** - 극장사별로 상이한 원시 데이터를 통합 스키마(unified schema)로 변환합니다.
3. **Publish** - 변환된 JSON 파일을 `public/` 디렉터리에 저장하여 정적 파일로 서빙합니다.

## 출력

`public/` 디렉터리에 JSON 파일로 저장되며, Next.js의 정적 파일 서빙을 통해 외부에서 접근 가능합니다.

```
public/
  boxoffice.json      # 통합 박스오피스 랭킹
  upcoming.json       # 통합 상영예정작 목록
```

## 스케줄링

Crawl-Transform-Publish 파이프라인을 **2~3시간 간격**으로 정기 실행합니다 (cron 또는 Vercel Cron Jobs 등).

## 기술 스택

- **Runtime**: Next.js 16 (App Router) + TypeScript
- **Package Manager**: pnpm
- **Hosting**: Vercel