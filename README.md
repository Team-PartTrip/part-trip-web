# parttrip-web

React, TypeScript, Vite 기반의 PartTrip 프론트엔드입니다.

## Scripts

```sh
npm run dev
npm run build
npm run lint
```

## Architecture

구조 원칙은 **TanStack Router + TanStack Query를 사용하는 FSD 기반 route-first 구조**입니다.

```text
routes -> widgets -> features -> entities -> shared
```

```text
src/
├── entities/           # 도메인 API와 서버 상태
├── features/           # 사용자 행동
├── routes/             # TanStack Router route files
├── shared/             # 전역 공통 코드
├── widgets/            # 복합 UI 블록
├── main.tsx            # Provider와 Router 조립
├── index.css
└── routeTree.gen.ts    # TanStack Router 자동 생성 파일
```

실제 slice와 route 이름은 기능이 필요해질 때 정합니다. 고정된 도메인 목록이나 화면별 폴더 목록은 두지 않습니다. 자세한 규칙은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)를 참고합니다.

### 현재 구조 상태

참조 프로젝트로 `dodamdodam-web-v4`의 다음 규칙을 사용합니다.

- `routes`의 directory route와 route group
- Entity 단위의 `api`, `queries`, `mutations`, `types`
- Feature 단위의 사용자 행동 구성
- `main.tsx` 중심의 Provider와 Router 조립
- `@/*` 단일 alias

현재 PartTrip은 위 route group/directory 구조와 `main.tsx` bootstrap을 적용했고, 도메인 endpoint를 Entity별 API로 분리했습니다. 최종 정리 기준과 개선 원칙은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)에 있습니다.

## Layer rules

- `routes`는 URL과 화면을 연결하고 하위 계층을 조합합니다.
- `__root.tsx`는 Outlet, ErrorBoundary, NotFound 정도만 담당합니다.
- `widgets`는 여러 feature/entity를 조합한 큰 UI입니다.
- `features`는 로그인, 생성, 수정, 투표 같은 사용자 행동입니다.
- `entities`는 도메인 API, query, mutation, type을 담당합니다.
- Entity에서 Toast, Navigate 같은 화면 부작용을 직접 처리하지 않습니다.
- `shared`는 도메인에 종속되지 않는 공통 코드만 포함합니다.
- Query Key는 Entity에서 중앙 관리합니다.
- 서버 상태는 TanStack Query가 관리하고, UI 상태와 서버 상태를 별도 취급합니다.

`routeTree.gen.ts`는 자동 생성 파일이므로 직접 수정하지 않습니다.

## Historical documents

`docs/superpowers/` 아래 문서는 과거 작업의 spec과 plan입니다. 당시의 React Router와 `src/pages` 경로가 기록되어 있을 수 있으며, 현재 구조의 기준은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)입니다.
