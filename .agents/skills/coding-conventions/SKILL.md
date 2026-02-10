---
name: coding-conventions
description: 이 프로젝트의 코딩 컨벤션과 스타일 가이드. 새 파일 생성, 코드 수정, 리팩토링 시 참조.
---

# Seconds Out - Coding Conventions

## 개행 규칙 (Compact Style)

- useEffect, 함수 선언 등 관련 코드 블록 사이에 **빈 줄 없이** 연결
- 논리적으로 다른 섹션만 빈 줄로 구분
```typescript
// Good
useEffect(() => { ... }, [deps1]);
useEffect(() => { ... }, [deps2]);

// Bad
useEffect(() => { ... }, [deps1]);

useEffect(() => { ... }, [deps2]);
```

## Import 순서 (그룹별 빈 줄 구분)

```typescript
// 1) 외부 라이브러리
import { useEffect, useState } from 'react';

// 2) 내부 절대 경로 (~/)
import { useEventCallback } from '~/hooks';

// 3) 상대 경로 (컴포넌트, 훅, 유틸)
import Controls from './components/Controls';
import { useTimerSequence } from './hooks';

// 4) 스타일
import css from './Component.module.scss';

// 5) 타입 (import type)
import type { TimerConfig } from './types';
import type { FC } from 'react';
```

## Export 규칙

**배럴 파일 (index.ts):**
```typescript
// 컴포넌트 default re-export
export { default } from './Component';

// 모듈 named re-export
export { default as moduleName } from './moduleName';

// 타입 re-export
export type { TypeName } from './types';
```

**개별 파일:** 파일 끝에 `export default`

**타입 파일:**
```typescript
// types/TimerConfig.ts
interface TimerConfig { ... }
export default TimerConfig;
export type { ThemeName, BellName };

// types/index.ts
export type { default as TimerConfig, ThemeName } from './TimerConfig';
```

## 기타

- 주석은 **한국어** 사용