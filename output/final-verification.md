# 최종 이슈 검증 결과

검증 대상: 배포 커밋 d7581dc2b6b64f13a6c5d029475718be9cfc1e1b / https://dandi-trip.me

## 검증 범위

- 실제 배포 JavaScript를 별도 브라우저에서 실행하고, 데이터 API는 통제된 응답으로 대체했습니다. 실제 계정의 생성·저장·업로드 데이터는 변경하지 않았습니다.
- 로그인하지 않은 운영 사이트의 로그인 이동, 운영 API 공개 OpenAPI의 멤버 imgUrl, Vercel 프로젝트 Node 24.x, 배포 로그 Node 24.19.0을 별도로 확인했습니다.
- 경로 계산은 시간을 줄이지 않고 실제 3초 간격으로 초기 조회 + 재조회 20회 후 실패 안내를 확인했습니다.
- 모의 API의 의도적 400/500 및 이미지 404는 실패 시나리오입니다. 로컬 favicon.ico 404는 테스트 문서 아이콘 요청이며 기능 실패가 아닙니다.
- npm test 99/99 PASS / npm run build PASS / npm run lint PASS.
- 로컬 브라우저 검사 3개 모두 PASS: planner-preferences-regressions.html, issue-batch-regressions.html, planner-member-preference-regressions.html.

GitHub 최종 확인: #62–#76 총 15개 CLOSED / 열린 이슈 0개. 각 이슈에 검증 결과와 한계를 기록한 후 종료했습니다.

## 이슈별 근거

### [#62](https://github.com/Team-PartTrip/part-trip-web/issues/62)

저장된 이동 편의·음식 선택이 배포 화면에 미리 표시되고, 변경 없는 생성 시 편의 설정 PUT을 생략하는 것을 확인했습니다. 계단값 보존·변경·저장 실패 처리는 회귀 테스트로 확인했습니다.

### [#63](https://github.com/Team-PartTrip/part-trip-web/issues/63)

배포 코드에서 생성 요청 1회, 생성 중 사이드바 차단과 beforeunload 핸들러를 확인했습니다. 실제 브라우저에서 이탈 확인 대화상자도 확인했습니다. 로컬 통합 검사에서 뒤로 이동 차단·중복 제출 방지·성공 후 이동이 통과했습니다.

### [#64](https://github.com/Team-PartTrip/part-trip-web/issues/64)

배포 코드의 생성 API를 400 응답으로 재현하여 서버 안내가 그대로 표시되는 것을 확인했습니다. 서버 안내 누락·공백·네트워크 실패 시 기본 문구 테스트도 통과했습니다.

### [#65](https://github.com/Team-PartTrip/part-trip-web/issues/65)

브라우저 회귀 검사에서 복수 사진 선택 시 코멘트 입력 숨김과 안내 표시, 업로드 요청의 코멘트 생략을 확인했습니다. 한 장 업로드는 입력한 코멘트를 보내는 것을 확인했습니다.

### [#66](https://github.com/Team-PartTrip/part-trip-web/issues/66)

배포 코드에서 실제 3초 주기로 초기 조회 + 재조회 20회 후 계산을 중단하고 실패 안내와 재조회 버튼을 표시하는 것을 확인했습니다. 원본 응답·서버 저장 내용을 변경하지 않는 단위 테스트도 통과했습니다.

### [#67](https://github.com/Team-PartTrip/part-trip-web/issues/67)

배포 화면의 홈 당일치기와 플래너의 당일 날짜 1회 표시를 확인했습니다. 기록·여행카드 관리가 공용 기간 함수를 사용하며 날짜 회귀 테스트가 통과했습니다.

### [#68](https://github.com/Team-PartTrip/part-trip-web/issues/68)

모바일 배포 화면과 실제 computed style에서 word-break: keep-all 및 overflow-wrap: anywhere 적용을 확인했습니다.

### [#69](https://github.com/Team-PartTrip/part-trip-web/issues/69)

배포 화면에서 예정 기본 선택, 날짜 미정 계획의 예정 포함, 예정·여행 중·완료 탭 간 배타성을 확인했습니다. 날짜·상태 조합 단위 테스트도 통과했습니다.

### [#70](https://github.com/Team-PartTrip/part-trip-web/issues/70)

배포 화면의 계획 확정·축제 · 이벤트 문구와 대상 파일의 여행카드·일정 만드는 중·출발·말투 변경을 확인했습니다. 대상 경로의 이전 문구 검색 및 빌드·린트가 통과했습니다.

### [#71](https://github.com/Team-PartTrip/part-trip-web/issues/71)

배포 화면에서 여러 날 축제의 시작–종료 날짜 전체 표시와 분류 1개일 때 필터 숨김을 확인했습니다. 단일 날짜·시간 포함 테스트도 통과했습니다.

### [#72](https://github.com/Team-PartTrip/part-trip-web/issues/72)

배포 화면에서 홈 정원 표시 제거 및 플래너·일정·기록·기록 지도·여행카드·보호자 실패 후 다시 시도 버튼의 재조회 요청을 확인했습니다. 로컬 통합 검사에서 보호자 양쪽 목록도 확인했습니다.

### [#73](https://github.com/Team-PartTrip/part-trip-web/issues/73)

Node v24.19.0에서 npm test 99개·빌드·린트가 통과했습니다. .nvmrc=24.19.0, engines=24.x, GitHub 배포 로그의 Node v24.19.0 및 Vercel 실제 프로젝트 nodeVersion=24.x를 확인했습니다. ICU 날짜 표기 회귀 테스트도 통과했습니다.

### [#74](https://github.com/Team-PartTrip/part-trip-web/issues/74)

배포된 데스크톱 사이드바에서 한글 단디 SVG 워드마크와 role=img·aria-label=단디를 확인했습니다. 앱과 같은 viewBox 및 path를 사용하는 구현을 확인했습니다.

### [#75](https://github.com/Team-PartTrip/part-trip-web/issues/75)

배포 화면에서 하루 일정 개수 입력이 없고 저장 요청이 기존 값 4를 보존하는 것을 확인했습니다. 로컬 브라우저 검사에서 값 누락 시 기본 3과 일정 밀도 유지도 확인했습니다.

### [#76](https://github.com/Team-PartTrip/part-trip-web/issues/76)

배포 코드에서 목록·함께할 사람·멤버 관리 및 내 프로필 사진 표시를 확인했습니다. 사진 null·필드 누락·로딩 실패 시 첫 글자 대체가 통과했습니다. 운영 API 공개 OpenAPI에도 PlannerMemberResponseDto.imgUrl이 반영되어 있습니다.

## 화면 증거

- `output/playwright/final-production-desktop.png`: 운영 번들 / 모의 축제 데이터 / 데스크톱
- `output/playwright/final-production-mobile.png`: 운영 번들 / 모의 축제 데이터 / 모바일 (화면 밖 content-visibility 영역은 스크롤 전 캡처)
- `output/playwright/final-route-timeout.png`: 운영 번들 / 실제 1분 후 경로 실패 안내

대상 이슈 재현 검사에서 추가 소스 수정이 필요한 실패는 발견되지 않았습니다. 실제 로그인 계정의 서버 쓰기 동작은 미검증입니다.

## 계단 단독 저장 사례 후속 수정

이전 검증에서 usesWheelchair·limitedWalking이 모두 null 또는 누락이고 canUseStairs=false인 조합을 놓쳤습니다. 848a113 커밋에서 미응답 판별 조건을 수정했습니다. 수정 전 실패·수정 후 99개 테스트, 빌드, 린트, 브라우저 회귀 검사 모두 통과했습니다. 운영 배포 38916146349 성공 후 운영 JavaScript+모의 API로 미리 선택·그대로 두면 저장 생략·괜찮아요 선택 시 canUseStairs=true 전송을 확인했습니다. 실제 계정 쓰기는 미검증입니다.
