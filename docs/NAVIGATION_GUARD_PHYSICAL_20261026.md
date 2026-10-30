## 최신 비차량 거절 실기기 회귀 · 2026-10-26 19시 KST

19:02:50.640–19:02:51.822 KST, 현재 제품741 verifyqa4edaf75c / test35의229eefc4에서 NavigationGuardTest가 **JUnit OK1/0.814초** 통과했습니다. 실제 비차량 단말에서 checkNavigation·requestSampleRoute를 호출해 각 거절 callback과 화면 안내 문구를 확인했고, navigation adapter가 전후 null인 것과 전체 localStorage key/value 동일을 assertion으로 검증했습니다.

시험은 실제 FEATURE_AUTOMOTIVE=false를 검사하며 차량/UX flag를 바꾸지 않습니다. onNativeNavigationStatus를 일시 감싸 실제 callback을 관찰·원래 함수 호출/복원했으며 응답·저장 상태를 주입하지 않았습니다. **요청의 안전한 거절**을 검증한 것으로 실제 Pleos 연결·서비스 binding·경로 완료나 AAOS UX 제한 runtime 성공이 아닙니다. 01시c5/test419의0.896초와 현재4ed/test229의0.814초는 별도입니다.

실행 전 단일 claim/CreateNew·instrumentation·writer·잠금/입력 제한·설치5APK SHA·test229 class/manifest target을 확인했습니다. 새 빌드/설치/권한변경 없음,5패키지 전후 해시 동일·자기 claim 정상반납·후속 claim부재/instrumentation없음 확인. PM 자체 QA이며 독립 QA/감사·사람 사용성·release6a28 물리 성공과 구분합니다. [실제 결과·해시·시간별 marker](../build-reports/pm-20261026/navigation-guard-current-physical.json).

다음 단일 기존 PM은 현재앱 주요 지도 버튼과 저장된 공개 주소/점유 조건부터 확인한 뒤 지도 열기·명시적 QA 복귀/저장 보존을 한 번 확인합니다. 위치 권한 허용·경로 시작·실전화·실기관 전송은 수행하지 않습니다. 이번 19시 Slack 새 게시 없음.

## 이전 제품 c5 실행 이력

> 2026-10-26 02시 후속: 이 소스의 CI40210143323은 verify/live/native 최종 success, publish skipped로 종료했다. [새 최종 결과·정확한 APK/환경](GUARD_SOURCE_CI_FINAL_20261026.md). 아래 진행중은 01시 시점 기록이며 GuardTest CI runtime 미실행 경계는 유지한다.

# 실제 비차량 내비게이션 거절 시험 — 2026-10-26 01시

기존 PM이 AS-Q1을 겸임한 자체 QA다. 독립 QA·감사 승인, 실제 Pleos 서비스 연결 또는 경로 완료 시험이 아니다.

## 대상·준비

- 소스 `41c1812013d395b90d9c6ae7a35ccdcee8b377f4`, 새 `NavigationGuardTest.java` Git blob `ddca594e8dd6ea436155939fbe5d8f205821fe4e`와 IT13 격리 파일 바이트가 일치했다.
- 제품 소스 b227과 설치 verifyqa 앱 **c5aad9eecc70bf0cac07450e414c582720582ee8286f0b255af5ff46e69eda4b**는 유지했다.
- 테스트만 빌드: **40초 / exit0 / 45 tasks 중4 실행·41 up-to-date**. 새 테스트 **828956B**, SHA256 **41900b95a4ef2a1dafb4af45259c95cde5e6cdec2d728ca265af93a1900f7bc2**.
- 기존3544a445 테스트를 기기에서 읽어 보존하고 기존/신규 APK의 실제 apksigner verify(exit0), 동일 인증서 **323cea9877c3cef1cae1692efdbe6638f7355a686181a1991e418cdb1975e08e**, manifest 패키지 `kr.co.ansimdonghaeng.verifyqa.test`·대상 `kr.co.ansimdonghaeng.verifyqa`, PC/staging 기기 SHA를 확인했다. 테스트만 pm install -r Success로 갱신했다.
- 최신 위임/상시 승인/원장/직전 result·PR2 후속 댓글을 읽고 claim/관련 writer/진행 instrumentation 없음과 잠금 해제를 확인했다. 단일 claim을 CreateNew로 확보하고 종료 후 자신의 claim만 반납했다.

## 실제 실행

```text
adb -d shell am instrument -w -r -e class kr.co.ansimdonghaeng.NavigationGuardTest kr.co.ansimdonghaeng.verifyqa.test/androidx.test.runner.AndroidJUnitRunner
```

**2026-10-26 01:08:49.306–01:08:50.694 KST**, JUnit **OK (1 test), 0.896초**, ADB exit0. 1개 JUnit 안에서 실제 bridge 거절2개를 검증했으며 테스트2개로 합산하지 않는다.

| 호출 | 실제 관찰 |
|---|---|
| VehicleBridge.checkNavigation() | 비차량 환경 거절 callback과 동일 메시지의 실제 화면 toast 표시 |
| VehicleBridge.requestSampleRoute() | 차량 UX 상태 거절 callback과 실제 화면 toast 표시 |

PackageManager의 실제 automotive=false를 먼저 검사했다. native UX/차량 flag를 바꾸거나 가상 응답을 주입하지 않았다. WebView callback 관찰자는 원래 callback에 위임하고 finally에서 복원했다. reflection은 navigation 필드 읽기에만 사용했고 호출 전·각 호출 후 null을 확인했다. 실제 SDK 어댑터를 만들거나 서비스 연결/경로 요청을 시도하지 않았다.

전체 localStorage의 정렬된 키·값을 메모리에서 전후 비교해 동일함을 확인했다. 내용은 로그에 출력하지 않았다. 실제 logcat:
- CHECK_NAVIGATION_DENIED CALLBACK_AND_TOAST_OK ADAPTER_NULL
- SAMPLE_ROUTE_DENIED CALLBACK_AND_TOAST_OK ADAPTER_NULL
- NAVIGATION_GUARD_OK NON_AUTOMOTIVE_ACTUAL SAVED_STATE_UNCHANGED

원본 release/.qa/.qa.test 및 제품 c5 설치 SHA는 보존했고 신규 설치 테스트 SHA도 대조했다. 앱 빌드·앱 교체·삭제·초기화·새 키·권한 부여·실제 전화/기관 전송은 없다.

## 판정 경계와 후속

이번 결과는 **비차량의 실제 거절 응답·화면 표시·저장 상태 보존** 통과다. 자동차 단말의 unknown/restricted/baseline 상태, 연결 해제·조건 변경·SDK 연결/오류/경로 완료 callback은 런타임 미검증이다. 00시 현재 폰의 Pleos 서비스 부재 조회와 별도이며, 서비스 성공으로 표시하지 않는다.

[기계 판독 결과](../build-reports/pm-20261026/navigation-guard-physical.json). IT13 QA 폴더 `AS-Q1-PM-20261026T0104`에 소스 대조, build/JUnit/run/markers, 기존·신규 테스트 APK/인증서/manifest, 설치 전후 SHA/result를 보존했다.

새 소스의 CI **40210143323**는 마지막 조회 시 **진행 중**이다. 이전 ec6992f/CI40191642309 전체 성공을 새 소스 성공으로 합산하지 않는다. 기존 CI 런타임은 LiveAddressTest/DOM 및 APK 흐름이고 이 NavigationGuardTest는 실행 대상이 아니다. CI 통과하더라도 새 guard 에뮬레이터 성공으로 세지 않는다.

기존 c5의 공식 주소/COLD/Geocoder/전화/지도/DOM 결과는 각 당시 테스트 APK·환경별로 유지한다. 새419 테스트로 전체 E2E를 다시 통과했다고 쓰지 않는다. DOCX/PDF version2·17시 13쪽 검토 기록 유지, 이번 편집 없음. Draft PR 미병합/v0.3.0-preview만 공개/0.4.3미게시·공모전 미제출. 독립 QA/감사·사람 사용성·실기관/클라우드·유효 REST 인증은 미완료다.

다음 단일 기존 PM은 CI40210143323 최종 job/로그를 먼저 확인한다. 실패가 있으면 해당 원본 근거로 한정 수정한다. 실제 AAOS/Pleos 서비스와 UX manager·권한이 있는 환경의 연결/완료 callback은 별도 준비 조건으로 유지한다. 전체 진척률·지난주 비교는 미산정. 야간 Slack·새 agent/예약/수신자·공개 runner·배포·비용 없음.
