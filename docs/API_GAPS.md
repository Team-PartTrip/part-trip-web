# API 계약 보류 항목

2026-08-27 기준 로컬 Swagger(`http://127.0.0.1:8080/v3/api-docs`)에서 확인되지 않은 endpoint다. 계약이 추가되기 전까지 mock 성공 응답을 만들지 않고, 현재 UI의 명시적인 fallback·비활성 상태를 유지한다.

| 영역 | 현재 프론트 호출 | 현재 동작 |
| --- | --- | --- |
| 메인 부가 정보 | `/main/today-phrase`, `/main/weather`, `/main/exchange-rate`, `/main/population-info`, `/main/food-info` | 해당 카드에 빈 상태를 표시 |
| 메인 검색 | `/main/search/popular`, `/main/search/recent`, `/main/search/travel-change` | 여행지 선택 화면에서 데이터가 없으면 빈 상태를 표시 |
| 커뮤니티 | `/community/**` | API 오류를 화면에 표시하고 가짜 게시글을 만들지 않음 |
| 여행 기록 | `/trips/**` | API 오류를 화면에 표시하고 가짜 기록을 만들지 않음 |
| 여행 카드 | `/community/shared-trips/**` | 공유 카드 삭제만 브라우저에서 숨김 처리하고 서버 성공으로 표시하지 않음 |
| 미션 | `/mission/**` | API 오류를 화면에 표시하고 가짜 완료 응답을 만들지 않음 |

알림(`/notifications/**`)과 플래너(`/planners/**`)의 목록·상세·멤버·투표·확정 endpoint는 현재 Swagger 계약을 기준으로 Entity API에 연결되어 있다.

계약이 추가되거나 경로가 변경되면 다음 순서로 동기화한다.

1. Swagger에 method, path, request, response, 인증 조건이 있는지 확인한다.
2. 관련 Entity의 `api.ts`, `types`, `query-keys`, `queries`, `mutations`를 함께 갱신한다.
3. loading, error, empty, success 상태와 Query cache invalidation을 연결한다.
4. 실제 API 환경에서 주요 사용자 흐름을 확인한다.
