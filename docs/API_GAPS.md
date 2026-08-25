# API 계약 보류 항목

현재 API 명세에 계약이 없어 UI만 제공하고 실제 요청을 연결하지 않은 항목이다. 백엔드 계약이 추가되기 전까지 mock 성공 응답을 만들지 않는다.

| 화면 | 보류 기능 | 현재 동작 |
| --- | --- | --- |
| 알림 | 목록·상세·읽음 처리·설정 저장 | 빈 상태와 비활성 버튼 표시 |
| 여행 플래너 | 그룹 초대·멤버 관리 | 현재 사용자만 표시 |
| 여행 플래너 | 장소 투표·최종 계획 확정 | 화면 선택 상태만 표시 |
| 여행 카드 | 공유 카드 삭제 | 선택 UI와 비활성 삭제 버튼 표시 |

계약이 추가되면 다음 순서로 연결한다.

1. Swagger/Notion 명세에 method, path, request, response, 인증 조건을 추가한다.
2. 관련 Entity의 `api.ts`, `types.ts`, `query-keys.ts`, `mutations.ts`를 구현한다.
3. loading, error, empty, success 상태와 Query cache invalidation을 연결한다.
4. 실제 API 환경에서 주요 사용자 흐름을 확인한다.
