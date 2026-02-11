# Agent Instructions

Rules for contributing to this repository.

## Project Overview

Static site generator that crawls Korean multiplex cinemas (Lotte Cinema, CGV, Megabox) and produces JSON data files.

- `next build` generates the landing page (`out/index.html`)
- `tsx scripts/generate.ts` crawls all sources and writes JSON files to `out/api/`
- GitHub Actions runs the build daily and deploys to GitHub Pages

## Key Directories

| Path | Description |
|------|-------------|
| `src/app/` | Next.js pages (landing page only) |
| `src/pipeline/crawl/` | Playwright crawlers per cinema source |
| `src/pipeline/transform/` | KOBIS enrichment and data transformation |
| `src/pipeline/sources.ts` | Crawler registry and SOURCES list |
| `scripts/generate.ts` | Static JSON file generator |

## Style Guidelines

- **No emojis** in any markdown files or code comments
- Use `Yes/No` in tables instead of checkmarks or emoji
- Keep examples concise and focused
- Use `// Bad:` and `// Good:` comments in code examples
- Follow existing file patterns

## Code Examples

```tsx
// Bad: description of the problem
<problematic code>

// Good: description of the solution
<correct code>
```
