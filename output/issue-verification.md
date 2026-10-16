# PartTrip 이슈 재검증 결과

기존 #62–#74의 검증에 이어 #75–#76도 수정하고 로컬 회귀 검증을 통과했다. 배포 완료를 의미하지 않는다.

## 실행 결과

- Node v24.19.0
- `npm test`: 99 / 99 PASS
- `npm run build`: PASS (Vite + TypeScript)
- `npm run lint`: PASS
- `git diff --check`: PASS
- `tests/planner-preferences-regressions.html`: PASS
- `tests/issue-batch-regressions.html`: PASS
- 명령 출력: `output/verify-tests.log`, `output/verify-build.log`, `output/verify-lint.log`.

## 이슈별 결과

| 이슈 | 상태 | 확인 항목 |
|---|---|---|
| [#62](https://github.com/Team-PartTrip/part-trip-web/issues/62) | 로컬 통과 | 편의 미리 선택 / 변경 없는 저장 생략 / 계단 설정 보존 |
| [#63](https://github.com/Team-PartTrip/part-trip-web/issues/63) | 로컬 통과 | 생성 중 라우터·사이드바·뒤로 가기 차단 / beforeunload 핸들러 / 중복 제출 / 성공 후 이동 |
| [#64](https://github.com/Team-PartTrip/part-trip-web/issues/64) | 로컬 통과 | 서버 안내와 기본 오류 안내 분리 |
| [#65](https://github.com/Team-PartTrip/part-trip-web/issues/65) | 로컬 통과 | 한 장 코멘트 유지 / 여러 장 공통 코멘트 생략 |
| [#66](https://github.com/Team-PartTrip/part-trip-web/issues/66) | 로컬 통과 | 20회 경로 재조회 후 화면의 CALCULATING을 API_ERROR로 변환 / 캐시 원본 보존 |
| [#67](https://github.com/Team-PartTrip/part-trip-web/issues/67) | 로컬 통과 | 당일치기 / 동일 날짜 한 번 표시 / 공통 날짜 포맷 사용 |
| [#68](https://github.com/Team-PartTrip/part-trip-web/issues/68) | 로컬 통과 | 전역 keep-all + overflow-wrap 적용 및 모바일 가로 넘침 확인 |
| [#69](https://github.com/Team-PartTrip/part-trip-web/issues/69) | 로컬 통과 | 예정·여행 중·완료 탭 분류 / 각 계획이 한 탭에만 포함되는 조합 검사 |
| [#70](https://github.com/Team-PartTrip/part-trip-web/issues/70) | 로컬 통과 | 여행카드·계획 확정·일정 만드는 중·출발·축제 · 이벤트 명칭과 대상 화면 말투 |
| [#71](https://github.com/Team-PartTrip/part-trip-web/issues/71) | 로컬 통과 | 축제 시작~종료일 / 하루 행사 / 분류 2개 이상일 때만 필터 |
| [#72](https://github.com/Team-PartTrip/part-trip-web/issues/72) | 로컬 통과 | 홈 정원 인원 표시 제거 / 기록·지도·여행카드·플래너·보호자 재시도 버튼 |
| [#73](https://github.com/Team-PartTrip/part-trip-web/issues/73) | 로컬 통과 | Node 24.19.0 테스트 / .nvmrc·engines·배포 workflow 정합 / ICU AM·PM 정규화 |
| [#74](https://github.com/Team-PartTrip/part-trip-web/issues/74) | 로컬 통과 | 앱 원본 SVG 경로와 동일한 단디 워드마크 / 색상 및 접근성 이름 |
| [#75](https://github.com/Team-PartTrip/part-trip-web/issues/75) | 로컬 통과 | UI·override 제거 / 저장 시 기존 4 보존 / 누락 시 기본 3 |
| [#76](https://github.com/Team-PartTrip/part-trip-web/issues/76) | 로컬 통과 | DTO imgUrl 추가 / 세 화면 공통 사진 / 누락·실패 시 한 글자 / 내 사진 |

## 이번 검증에서 재현하고 수정한 회귀

동행을 선택하지 않고 최종 생성을 누르면 동행 질문으로 이동한다. 이때 '혼자'를 골라 다음 질문으로 넘어가도 기존 오류가 남았다.

- 수정: `src/widgets/planner/ui/PlannerCriteriaStep.tsx`의 공통 블록 선택 처리에서 이전 오류 안내를 지운다.
- 재현 검사를 기존 브라우저 회귀 테스트에 추가했다. 수정 전 FAIL, 수정 후 PASS를 확인했다.
- 기존 통합 검사에 실제 Sidebar Link와 router history back 차단 검사를 추가했다.
- 브라우저 도구의 실제 뒤로 가기도 별도로 실행했다. 생성 중 URL과 화면이 유지됐고, 모의 실패 응답 후 버튼이 다시 활성화됨을 확인했다.

## 추가 수정 및 검증 (#75–#76)

- `tests/planner-member-preference-regressions.html`: 브라우저 PASS. 모든 API는 모의 응답이다.
- 저장 요청에서 기존 하루 일정 개수 4 보존 및 값 누락 시 기본 3을 확인했다.
- 목록·함께할 사람·멤버 관리에서 정상 사진, null, 필드 누락, 이미지 실패 대체 표시와 내 사진을 확인했다.
- 최종 소스로 자동 테스트 99개, 빌드, 린트, diff check 통과.
- 로그: `output/remaining-issues-tests.log`, `output/remaining-issues-build.log`, `output/remaining-issues-lint.log`.

## 검증의 한계

- API는 로컬 mock이다. 실제 로그인 계정의 저장·업로드, 운영 서버·배포 상태는 재검증하지 않았다.
- 경로 시간 초과는 3초 간격을 테스트에서 단축해 20회 제한을 검사했다. 실제 서버에서 1분 이상 장애를 만들지는 않았다.
- beforeunload는 취소 가능한 합성 이벤트로 핸들러가 막는지 검사했다. 실제 탭 종료·새로고침 확인 창을 승인하거나 탭을 닫지 않았다.
- 지원 대상으로 설정한 Node 24만 실행했다. Node 20·22·26을 각각 설치해 실행하지 않았다.
- GitHub 이슈 상태와 체크리스트를 수정하거나 커밋·푸시·배포하지 않았다.
