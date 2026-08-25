# PartTrip Frontend Architecture

> 기준: `dodamdodam-web-v4`의 실제 구조
>
> 이 문서는 폴더 이름을 무조건 고정하지 않고, 계층의 책임·확장 기준·의존 방향을 정의한다.

## 1. 구조 방향

PartTrip은 TanStack Router와 TanStack Query를 사용하는 route-first FSD 구조를 따른다.

```text
routes -> widgets -> features -> entities -> shared
```

`main.tsx`는 FSD 계층이라기보다 애플리케이션 bootstrap 지점이다. Provider, Router, ErrorBoundary를 조립하며 도메인 로직은 소유하지 않는다.

## 2. 참조 폴더 구조

아래 `<...>`는 placeholder다. 실제 slice와 route는 기능이 필요해질 때만 만든다.

```text
src/
├── entities/
│   └── <domain>/
│       ├── api.ts
│       ├── queries.ts
│       ├── mutations.ts
│       ├── query-keys.ts
│       └── types.ts
│
├── features/
│   └── <action>/
│       ├── model/
│       ├── ui/
│       └── lib/
│
├── routes/
│   ├── __root.tsx
│   ├── (<group>)/
│   │   └── <domain>/<route>/index.tsx
│   └── (<group>)/_<layout>/route.tsx
│
├── shared/
│   ├── assets/
│   ├── hooks/
│   ├── libs/
│   ├── stores/
│   ├── ui/
│   └── utils/
│
├── widgets/
│   └── <widget-slice>/
│
├── main.tsx
├── index.css
└── routeTree.gen.ts
```

현재 PartTrip은 directory/group route와 `main.tsx` bootstrap을 적용했고, 화면 구현은 route 밖의 widgets/features에 있다. 도메인 endpoint는 Entity별 API에 둔다.

## 3. 계층 책임

### `routes`

- URL과 화면을 연결한다.
- TanStack Router의 route group, directory route, layout, loader, `beforeLoad`를 관리한다.
- 하위 widgets/features/entities를 조립한다.
- 복잡한 API 호출과 화면 비즈니스 로직을 직접 소유하지 않는다.

### `widgets`

- Sidebar, AppShell, 목록, 상세 패널처럼 여러 기능과 도메인을 조합한 큰 UI다.
- 여러 entity와 feature를 사용할 수 있다.
- route나 다른 페이지를 import하지 않는다.

### `features`

- 로그인, 생성, 수정, 삭제, 투표, 작성처럼 사용자의 행동을 표현한다.
- form state, validation, mutation, 사용자 흐름을 조합한다.
- Feature끼리 직접 호출하지 않는다. 함께 움직이는 행동은 하나의 Feature로 묶는다.
- 단순 조회만을 위한 `get-*` Feature는 만들지 않는다.

### `entities`

- 도메인 API, DTO, 타입, Query, Mutation을 관리한다.
- TanStack Query의 query key를 도메인 단위로 관리한다.
- API 호출과 캐시 무효화는 담당하지만 Toast, Navigate 같은 화면 부작용은 직접 처리하지 않는다.
- Entity 간 업무 조합은 Feature 또는 Widget에서 담당한다.

### `shared`

- 특정 도메인을 모르는 공통 코드만 둔다.
- 도메인 endpoint나 사용자 업무를 `shared`에 넣지 않는다.

## 4. Route 규칙

TanStack Router의 파일 기반 구조를 사용한다.

```text
routes/
├── __root.tsx
├── (public)/
│   ├── login/index.tsx
│   └── register/index.tsx
└── (app)/
    └── _authenticated/
        ├── route.tsx
        └── <domain>/
            ├── index.tsx
            └── <action>/index.tsx
```

- `(group)`은 URL에 포함되지 않는 조직용 route group이다.
- `_<layout>/route.tsx`는 인증·역할·공통 layout을 감싼다.
- `__root.tsx`는 `Outlet`, ErrorBoundary, NotFound 중심으로 얇게 유지한다.
- Sidebar, 모바일 navigation, 사용자 조회, 권한별 메뉴 계산은 `widgets/app-shell` 또는 `widgets/sidebar`에서 담당한다.
- `routeTree.gen.ts`는 자동 생성 파일이며 직접 수정하지 않는다.

## 5. Entity 파일 구성

작은 Entity는 flat segment를 사용한다.

```text
entities/<domain>/
├── api.ts
├── queries.ts
├── mutations.ts
├── query-keys.ts
└── types.ts
```

파일이 커지거나 변경 경계가 생길 때만 확장한다.

```text
entities/<domain>/
├── api/
├── model/
├── ui/
└── index.ts
```

모든 Entity에 `api/`, `model/`, `ui/`, `index.ts`를 미리 만들지 않는다.

### Query와 Mutation

```ts
export const userQueryKeys = {
  all: ['user'] as const,
  me: () => [...userQueryKeys.all, 'me'] as const,
}
```

- Query Key는 `query-keys.ts` 또는 해당 Entity의 query segment에서 중앙 관리한다.
- Query와 Mutation에서 동일한 Query Key 문자열을 반복 작성하지 않는다.
- Entity Mutation은 API 호출과 cache invalidation까지만 담당한다.
- 성공 Toast, redirect, modal close는 Feature 또는 Route에서 처리한다.

## 6. Feature 규칙

Feature는 API 이름이 아니라 사용자 행동으로 이름 짓는다.

```text
좋은 예:
features/login/
features/create-trip/
features/edit-profile/
features/vote-place/

피할 예:
features/get-user/
features/get-trip/
features/call-profile-api/
```

단순 데이터 조회는 Entity Query가 담당한다. 조회 결과를 여러 Entity와 조합하거나 사용자의 행동이 결합될 때만 Widget 또는 Feature를 추가한다.

## 7. `__root.tsx`와 `main.tsx` 경계

### `main.tsx`

- `QueryClient` 생성
- `QueryClientProvider` 구성
- Theme, OAuth, Overlay, Toast Provider 구성
- `ErrorBoundary` 구성
- `RouterProvider` 구성

### `routes/__root.tsx`

- `Outlet` 렌더링
- TanStack Router error/not-found 처리
- 최소한의 root layout

Root에 다음을 넣지 않는다.

- Sidebar 상세 상태
- 사용자 조회와 권한별 메뉴 계산
- 도메인 API 호출
- 특정 화면의 모달·폼 상태

## 8. Shared 분류

```text
shared/hooks/   # 도메인을 모르는 React Hook
shared/libs/    # API client, 날짜·정렬 등 범용 라이브러리
shared/stores/  # 여러 route에서 공유하는 진짜 전역 상태
shared/ui/      # 공통 primitive와 fallback UI
shared/utils/   # 순수 변환·검증 함수
```

PartTrip 디자인 시스템 primitive는 `shared/ui/parttrip`에 둔다.

`shared/stores`에는 서버 상태를 저장하지 않는다. 서버 상태는 TanStack Query가 관리한다.

## 9. API와 타입

- `shared/libs/api-client.ts`는 공통 HTTP client와 transport 처리만 담당한다.
- 도메인 API endpoint는 해당 Entity의 `api.ts`로 이동한다.
- API DTO와 frontend domain type을 분리한다.
- 실제 DTO 변환이 필요할 때만 mapper를 추가한다.
- backend Swagger와 API 명세를 source of truth로 사용한다.
- API 계약이 없는 기능을 mock API나 가짜 성공 응답으로 대체하지 않는다.
- 인증·세션·오류·로딩 처리는 migration 중에도 보존한다.

## 10. PartTrip migration 순서

1. `@/*` 단일 alias와 directory/group route 규칙 유지
2. 남아 있는 도메인 endpoint를 Entity의 `api.ts`로 이동
3. Entity API를 `api.ts`, `queries.ts`, `mutations.ts`, `types.ts`로 정리
4. Query Key를 Entity 단위로 중앙화
5. Entity에서 Toast·Navigate·modal close 같은 UI 부작용 제거
6. 단순 조회 Feature를 Entity Query 또는 Widget으로 통합
7. 주요 URL, 인증, API, loading/error/empty 상태 검증

새 계층과 모든 도메인 slice를 미리 만들지 않는다.

## 11. 검증

```bash
npm run lint
npm run build
git diff --check
```

legacy 검색:

```bash
rg "@pages|src/pages|src/app/router|react-router-dom" src package.json tsconfig.app.json vite.config.ts
```

`docs/superpowers/` 아래 문서는 과거 작업 기록이며 현재 구조의 기준으로 사용하지 않는다.
