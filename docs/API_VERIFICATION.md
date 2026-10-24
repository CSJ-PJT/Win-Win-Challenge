# 최신 실행 확인 · 2026-10-24 18:25 KST

소스 `5232b81544b4214c14048c7c020d8eac7e639861`, [CI40081102580](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40081102580)(18:13:29–18:23:15 KST)의 verify-build/live-address/native-smoke 모두 성공, publish skipped. Node112/실패0·공식주소 Android instrumentation1·APK조작7·DOM instrumentation1. 실제 MAP_INTENT_OPENED, PRIMARY_HANDOFF_OK, EASY_ARRIVAL_ACK_OK 및 종료코드5개 모두0을 원본 아티팩트에서 확인했다. 시설 양측 확인 완료와 쉬운 도착 알림 화면의 한글·큰 글씨를 직접 확인했다. Android15 에뮬레이터 범위다.

release APK5,170,048바이트 / SHA256 `faf6562113d58c2d4cdc6aadc094eb4fadf8666caf47c5045d8893bc99d4140b`와 QA 앱/테스트의 실제 바이트·해시를 CI manifest에 대조했다. [최신 실행 근거](../build-reports/qa-20261024/map-runtime-5232b81.json), [QA manifest](../build-reports/qa-20261024/qa-package-manifest-5232b81.json). QA variant는 빌드/metadata 검사만이며 이 실행의 native 대상은 release 패키지다.

341bc88/CI40076247150의 잘린 지도 탭 실패, 150cd5f/CI40080392976의 과도한 상단여유로 인한 시설 탭 실패는 수정 전 이력이다. 최신5232b81 전체 성공과 구분한다. 실물 AS-Q1 인계용은 기존341bc88/QA2903bc14·테스트c73efa79 그대로이며 수신/점유/실행 미확인. 신규 APK·QA의 실기기 성공, 외부 API 전체 정상, 공개 릴리스·제출 완료로 합산하지 않는다.

아래 문단은 각 시점의 과거 검증 기록이다. 키 미제공 설명도 해당 시험환경 범위이며 현재 모든 위치에 키가 없다는 판정이 아니다.

# 현재 최신 실행 결과 · 2026-10-24 16시

현재 통과 소스 `4a671e0`, [CI40068462730](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40068462730): Node112·공식주소1·APK조작7·DOM1 통과. APK SHA256 `9a0c311adb35ebebb43a31b8b7ca5e38ad609ebc632212b8c09fcd47ba64f4bb` 바이트 대조 완료. Android15 에뮬레이터 범위이며 실기기 전체 흐름은 미검증. 상세는 [DOM 검증 기록](DOM_VERIFICATION_20261024.md)의 16시 항목과 `build-reports/pm-20261024/dom-runtime-check.json`을 따른다. 아래 38ef02b 및 이전 실행 설명은 해당 시점의 기록이다.

# API 목록과 검증 기록

초기 검증 소스: `38ef02b356f6f1c7edd1c5e8297ccc1e5d0a1e5d`, CI `40063017206` (2026-10-24). Node 22·Android 15 에뮬레이터 결과이며 운영·실차 연동과 구분한다. 최초 로컬 HTTP 검증은 기준 `0f4946b`에 API 본문 수정을 적용한 Linux / Node.js 24.19.0에서 수행했다.

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
| `VehicleBridge.openAddressSearch(query, requestId)` | 공식 주소 dialog → `onPostcodeResult` | CI 40063017206의 실제 주소 선택·저장·복귀 instrumentation 1개 통과. Android 15 에뮬레이터 범위 |
| `VehicleBridge.searchAddress(query, requestId)` | Android Geocoder → `onAddressResults` | 소스 확인. 단말 Geocoder 가용성과 실제 결과 재검증 필요 |
| `VehicleBridge.openMap(value)` | 검증된 지도 URL → 외부 Intent, `onMapStatus` | CI 40063017206 APK 조작에서 저장 주소 지도 열기 통과. 실차 경로는 미검증 |
| `VehicleBridge.openDialer(value)` | 전화번호 → ACTION_DIAL, `onNativeDialerStatus` | 실제 발신은 하지 않음. 전화 앱 유무·주행 제한 재검증 필요 |
| `VehicleBridge.checkNavigation()` | NaviHelper 연결 상태 | Pleos 서비스 환경 필요, 미검증 |
| `VehicleBridge.requestSampleRoute()` | 정차 조건·사용자 확인 → 예제 경로 요청 | Pleos/AAOS 환경 필요, 미검증 |
| 카카오 우편번호 SDK | 주소·우편번호 반환; 좌표 생성 안 함 | CI 40063017206의 PC/HTTP 및 Android 공식 검색·주소/우편번호 왕복 통과 |
| Kakao Local REST | 서버 `/api/places`에서 호출, 5초 제한 | 키 미제공. fixture 성공은 외부 실동작 완료로 계산하지 않음 |
| Google Maps / 카카오맵 URL | 저장한 주소 또는 좌표로 외부 지도 열기 | URL 인코딩 단위시험 통과, 실제 자동차 경로 가용성은 별도 확인 |
| CarUxRestrictionsManager | 차량 주행 제한 → 네이티브 조작 제한 | 실제 차량/AAOS 검증 미수행 |

## 남은 검증

Android 실패 원본: Actions `39951237430`, `LiveAddressTest.visible:26`의 `StaleObjectException`. 새 테스트는 UI 요소의 bounds 조회·클릭 실패 시 최대 3회 새로 조회하며, 지속 실패는 그대로 실패시킨다. 검증을 건너뛰거나 성공으로 강제하지 않는다. 당시 로컬에는 Android SDK·에뮬레이터가 없었으며, 이후 CI 40063017206에서 최신 APK 재검증이 통과했다.

CI의 브라우저 캡처에는 한글 글꼴을 설치했다. 새 브라우저 캡처에서 한글 표시를 직접 확인했으며 아래 후속 결과에 기록했다. 게시 릴리스 0.3.0-preview와 개발 0.4.3은 아직 별개이며 모든 API 정상·제출 완료로 표시하지 않는다.

## 후속 CI 결과와 Android 시작 검증

커밋 `a001ec3`, CI `40062463496`: Node 22 검사 112개·브라우저 회귀·서명 APK 빌드 성공. 실제 공식 주소 선택·저장·복원·지도 표시가 PC 실행기와 HTTP 서버에서 각각 통과했다. 내려받은 APK는 5,170,048바이트이며 SHA-256 `c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54`로 CI 기록과 일치했다. 쉬운 화면 브라우저 캡처의 한글 표시도 직접 확인했다.

Android 작업은 첫 `도착지 입력하기`를 찾지 못해 실패했다. 수집된 화면 구조는 앱이 아닌 `com.google.android.apps.nexuslauncher`를 표시했고 주소 로그는 비어 있었다. 앱 내부 주소 동작의 성공·실패로 단정하지 않는다. 테스트 시작/복원 시 Home 전환 완료를 기다리고 `am start -W`로 Activity를 시작한 뒤 대상 앱이 전면에 나타났는지 확인하도록 보완했다. 실패 시 crash log와 Activity 상태도 수집한다. 이 후속 수정은 아래 CI 40063017206에서 통과했다. 이 문단의 실패는 과거 실행 기록이다.

## 최신 APK 재검증 완료

커밋 `38ef02b356f6f1c7edd1c5e8297ccc1e5d0a1e5d`, [CI 40063017206](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40063017206)의 verify-build, live-address, native-smoke가 모두 성공했다. 공식 주소 왕복 instrumentation `OK (1 test)`와 APK 실제 조작 7개를 로그·아티팩트로 확인했다. `instrument_exit=0`, `address_exit=0`, `flow_exit=0`이다.

APK에서 확인한 흐름은 공식 주소 선택·저장·복원, 저장 주소의 지도 열기, 독립 인계자 확인, 시설 화면 인수, 보호자 완료 조회, 큰 버튼 도착 알림이다. 내려받은 최신 APK는 5,170,048바이트, SHA-256 `1264da0e1faadf0be1f97341b0f36aaa3f016ea58117c0706eb018f91d35d39d`이며 CI의 apk-sha256.txt와 일치한다. Android 쉬운 화면 결과 캡처의 한글도 직접 확인했다.

publish는 검증 브랜치 정책에 따라 건너뛰었다. 최신 APK는 이 CI의 `ansim-0.4.3-build` 아티팩트이며 게시 릴리스로 간주하지 않는다. Kakao REST 실키, 실제 기관 인증·클라우드 동기화, Pleos/AAOS·실차 및 단말 전화 앱 호출은 별도 검증이 남아 있다. 모든 외부 API 정상이나 공모전 최종 제출 완료를 의미하지 않는다.

## 실물 Android QA 추가 기록 · 2026-10-24 14:09 KST

별도 QA의 [PR 댓글](https://github.com/CSJ-PJT/Win-Win-Challenge/pull/2#issuecomment-6380210313)에서 Samsung Android 16의 설치·콜드 실행·실제 주소 선택/저장/복원·출발/도착/번호 발급까지 보고됐다. 대상 APK는 이전 CI 40062463496의 a001ec3, SHA-256 `c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54`이다. 최신 에뮬레이터 검증 APK 해시와 다르므로 동일 바이트의 실기기 통과로 합산하지 않는다.

실기기의 UIAutomator는 WebView 하위 HTML 컨트롤을 찾지 못해 `Missing visible control: 도착지 입력하기`로 실패했다. 같은 화면의 ADB 터치는 동작했다는 QA 기록이다. 이 문서 수정에서는 실물 기기를 재조작하거나 원본 캡처를 직접 재검증하지 않았다. 시설의 최종 양측 확인·쉬운 알림 전체 흐름은 미검증이다. DOM 기반 instrumentation 보강 후 동일 APK 해시로 실기기 E2E를 검증해야 한다. 릴리스 WebView 원격 디버깅을 무조건 활성화하지 않는다.
