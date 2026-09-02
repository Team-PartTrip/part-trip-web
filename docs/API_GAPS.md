# API 계약 보류·미구현 항목

2026-09-01 기준 최신 CSV 명세서를 계약의 source of truth로 사용한다. CSV의 구현완료 API만 실제 Entity API에서 호출하고, 보류·미구현·CSV 미수록 기능은 성공 mock을 만들지 않는다.

## CSV에 있지만 아직 사용할 수 없는 API

- `GET /api/trips/history`: 보류. 기록 화면은 구현완료인 `/api/travel-cards` 목록·상세를 사용한다.
- `POST /api/travel-cards/{cardId}/report`: 보류. 리포트 화면은 생성 버튼 없이 준비 중 상태를 표시한다.
- `/api/world-map/**`: 미구현. 관련 API 함수는 명시적 미지원 오류를 반환하며 mock 데이터를 만들지 않는다.

## 최신 CSV에 없는 기존 기능

커뮤니티·공유 여행·미션·촬영 분석·메인 여행지 저장/최근 검색·프로필 테마 API는 최신 명세서에 없어 프론트에서 노출하지 않는다. 알림 설정 API는 최신 명세서에 없어 미지원 화면으로 유지한다. 해당 기능에서 2xx 성공이나 가짜 데이터를 표시하지 않는다.

계약이 추가되거나 경로가 변경되면 다음을 함께 갱신한다.

1. method, path, query/path parameter, request body, response DTO, 인증 조건을 CSV와 대조한다.
2. 관련 Entity의 `api.ts`, `queries`, `mutations`, query key를 갱신한다.
3. 영향을 받는 UI의 loading, error, empty, success 상태와 cache invalidation을 연결한다.
4. 인증된 실제 API 환경에서 주요 흐름을 확인한다.
