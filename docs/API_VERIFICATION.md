# API 목록과 검증 기록

기준 소스: `0f4946b5026b109ad9c921328abfd5824ee4376c` + 이 문서와 함께 커밋된 변경. 실행일: 2026-10-24. 환경: Linux, Node.js 24.19.0, 임시 파일 저장소, 실제 로컬 HTTP 서버. 운영·실차 연동 시험과 구분한다.

## HTTP API 전수 목록

| 메서드·경로 | 호출 주체·입력 | 정상 응답 | 검증 결과·오류 |
| --- | --- | --- | --- |
| GET `/api/health` | 실행 상태 확인 | 200, status/version | 실제 호출 200 |
| GET `/api/bootstrap` | 로컬 시연 역할 세션 연결 | 200, 역할 토큰·tripId/version | 실제 세션 발급 후 아래 요청에 사용. 토큰 원문은 기록하지 않음 |
| GET `/api/state` | 역할 Bearer 토큰 | 200, 역할별 state/serverNow | 인계자·시설·보호자·visitor 실제 조회. 미인증 401, 보호자에게 연결번호 비공개 확인 |
| GET `/api/places?query=…` | 역할 토큰, 2~180자 검색어 | 200, 최대 5개 장소 | 미인증 401, 잘못된 검색어 400, 키 없음 503 실제 호출. 200·외부 실패 502는 기존 주입 fixture 검사이며 실제 Kakao REST 성공은 미검증 |
| POST `/api/reset` | simulator, scenario | 200, reset=true; 새 역할 토큰 | 실제 초기화 성공·구 토큰 폐기, guardian 403. 비객체 JSON 400 |
| POST `/api/events` | 역할 토큰, tripId/key/expectedVersion/event | 200, 역할별 state/serverNow | 실제 출발·도착·발급·양측 확인 완료. 입력 400, 역할 403, 상태·중복키·버전 충돌 409, 크기 제한 413은 서버 규칙. 동시성·재시도는 기존 HTTP 시험 포함 |

전체 `/api/` 미등록 경로는 404. Host·Origin 제한, 중복 요청 및 파일 재기동 복원은 `test/server.test.js`로 검증한다. `/api/bootstrap`은 로컬 시연 기능이며 실제 기관 계정 인증을 제공하지 않는다.

이번 실제 HTTP 흐름: `READY` → `VEHICLE` → `DEPART` → `ARRIVE` → `ISSUE_CODE` → `SENDER_CONFIRM` → `RECEIVER_CONFIRM` → 보호자 `COMPLETED` 조회. 한쪽 확인 시에는 `VERIFYING`을 유지한다. 어르신 흐름은 `SELF_CONSENT` → `NOTIFY_ARRIVAL` → 시설 `ACK_ARRIVAL_NOTICE`; 이 흐름이 대면 인계 완료로 바뀌지 않는 것을 확인했다.

## 수정·회귀 검증

`/api/events`에 JSON `null`을 전송하면 기존 서버는 500 INTERNAL을 반환했다. `/api/reset`에도 객체가 아닌 본문을 수용하는 문제가 있었다. 공통 JSON 본문 파서에서 null·배열·문자열·숫자·불리언을 400 JSON_OBJECT로 거절하도록 수정했다. 두 경로에 각각 5종 본문을 전송하고 상태 버전이 바뀌지 않는 것을 검증한다.

`npm test`: 112개 통과, 실패 0개. 기존 109개에 HTTP 계약·전체 인계·쉬운 알림 흐름 3개를 추가했다. `npm run bundle` 성공. 요청별 상태·오류·상태 전이의 비밀값 없는 추적은 `build-reports/pm-20261024/node-tests.txt`에 있다.

## Android bridge와 외부 연계

| 인터페이스 | 연결·결과 | 현재 검증 범위 |
| --- | --- | --- |
| `VehicleBridge.openAddressSearch(query, requestId)` | 공식 주소 dialog → `onPostcodeResult` | 최신 APK 실제 선택·저장·복귀 재검증 필요. UiAutomator 오래된 요소 참조를 재조회하도록 수정 |
| `VehicleBridge.searchAddress(query, requestId)` | Android Geocoder → `onAddressResults` | 소스 확인. 단말 Geocoder 가용성과 실제 결과 재검증 필요 |
| `VehicleBridge.openMap(value)` | 검증된 지도 URL → 외부 Intent, `onMapStatus` | 최신 APK에서 지도 앱 열기 재검증 필요 |
| `VehicleBridge.openDialer(value)` | 전화번호 → ACTION_DIAL, `onNativeDialerStatus` | 실제 발신은 하지 않음. 전화 앱 유무·주행 제한 재검증 필요 |
| `VehicleBridge.checkNavigation()` | NaviHelper 연결 상태 | Pleos 서비스 환경 필요, 미검증 |
| `VehicleBridge.requestSampleRoute()` | 정차 조건·사용자 확인 → 예제 경로 요청 | Pleos/AAOS 환경 필요, 미검증 |
| 카카오 우편번호 SDK | 주소·우편번호 반환; 좌표 생성 안 함 | 이전 CI live-address 성공. 이번 변경 APK 네이티브 재검증 대기 |
| Kakao Local REST | 서버 `/api/places`에서 호출, 5초 제한 | 키 미제공. fixture 성공은 외부 실동작 완료로 계산하지 않음 |
| Google Maps / 카카오맵 URL | 저장한 주소 또는 좌표로 외부 지도 열기 | URL 인코딩 단위시험 통과, 실제 자동차 경로 가용성은 별도 확인 |
| CarUxRestrictionsManager | 차량 주행 제한 → 네이티브 조작 제한 | 실제 차량/AAOS 검증 미수행 |

## 남은 검증

Android 실패 원본: Actions `39951237430`, `LiveAddressTest.visible:26`의 `StaleObjectException`. 새 테스트는 UI 요소의 bounds 조회·클릭 실패 시 최대 3회 새로 조회하며, 지속 실패는 그대로 실패시킨다. 검증을 건너뛰거나 성공으로 강제하지 않는다. 로컬에 Android SDK·에뮬레이터가 없어 최신 APK 재검증은 CI 결과를 기다린다.

CI의 브라우저 캡처에는 한글 글꼴을 설치했다. 새 브라우저 캡처에서 한글 표시를 직접 확인했으며 아래 후속 결과에 기록했다. 게시 릴리스 0.3.0-preview와 개발 0.4.3은 아직 별개이며 모든 API 정상·제출 완료로 표시하지 않는다.

## 후속 CI 결과와 Android 시작 검증

커밋 `a001ec3`, CI `40062463496`: Node 22 검사 112개·브라우저 회귀·서명 APK 빌드 성공. 실제 공식 주소 선택·저장·복원·지도 표시가 PC 실행기와 HTTP 서버에서 각각 통과했다. 내려받은 APK는 5,170,048바이트이며 SHA-256 `c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54`로 CI 기록과 일치했다. 쉬운 화면 브라우저 캡처의 한글 표시도 직접 확인했다.

Android 작업은 첫 `도착지 입력하기`를 찾지 못해 실패했다. 수집된 화면 구조는 앱이 아닌 `com.google.android.apps.nexuslauncher`를 표시했고 주소 로그는 비어 있었다. 앱 내부 주소 동작의 성공·실패로 단정하지 않는다. 테스트 시작/복원 시 Home 전환 완료를 기다리고 `am start -W`로 Activity를 시작한 뒤 대상 앱이 전면에 나타났는지 확인하도록 보완했다. 실패 시 crash log와 Activity 상태도 수집한다. 이 후속 수정의 최신 CI 통과는 아직 확인 전이다.
