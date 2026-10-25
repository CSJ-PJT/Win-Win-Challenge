> 2026-10-26 01시 후속: 새419 테스트로 비차량 bridge2개 거절 callback·화면 표시·저장 상태 보존을 실제 검증했다(JUnit1/0.896초). [후속 물리 시험](NAVIGATION_GUARD_PHYSICAL_20261026.md). 아래 “미실행”은 00시 조회 시점이며 실제 Pleos 연결/경로·자동차 UX 상태는 여전히 미검증이다.

# Pleos 서비스 가용성·안전 조건 확인 — 2026-10-26 00시

기존 PM의 소스·SDK 및 단말 읽기 전용 점검이다. 독립 QA/감사 승인이나 두 bridge의 런타임 통과가 아니다. 작업 ID `AS-PM-20261026T0003`, 조회 시각 **00:06:39 KST**. [결과 JSON](../build-reports/pm-20261026/pleos-readiness.json).

## 실제 SDK에서 확인한 연결 대상

격리 빌드에서 사용한 Gradle 캐시의 `ai.pleos.playground:NaviHelper:3.0.5` AAR를 직접 열었다. **65,944바이트**, SHA256 `15fadd11c7c611b1abdf7ebf9ce91f2a6ce2728e60b4e38b4343e11bb9c12e97`. classes.jar SHA256 `1802e8a1f4f68706765133157b170f62b76b0164a528a2f43550a896f7915d31`.
manifest 및 javap(exit0)에서 다음 값을 확인했다. SDK 바이너리·전체 역어셈블 결과는 저장소에 게시하지 않았다.

| 항목 | 실제 값 |
|---|---|
| 서비스 패키지 | ai.pleos.playground.service.navi |
| 명시적 컴포넌트 | ai.pleos.playground.service.navi.NaviService |
| 서비스 action / manifest queries | ai.pleos.playground.intent.action.NAVI_START |
| 경로 요청 권한 | pleos.car.permission.NAVI_ROUTE_SEARCH |
| SDK manifest의 최소 서비스 버전 메타데이터 | 2.0.1 / code11 |
| SDK 현재 버전 메타데이터 | 3.0.5 / code75 |

이 버전 값은 AAR 메타데이터이며, 설치 서비스의 호환성 시험 결과는 아니다. SDK 서비스 관리자의 명시적 컴포넌트 설정 및 경로 요청 권한 검사도 직접 확인했다. 경로 요청·최근 목적지·현재 위치 등의 API는 실행하지 않았다.

## 현재 연결 휴대전화의 실제 조회

| 읽기 전용 명령 | 실제 응답 |
|---|---|
| pm has-feature android.hardware.type.automotive | false |
| pm path ai.pleos.playground.service.navi | 경로 출력 없음, exit1 |
| cmd package query-services --brief --components -a ai.pleos.playground.intent.action.NAVI_START | No services found, exit0 |
| service check car_service | Service car_service: not found, exit0 |
| pm list permissions -f 중 정확한 NAVI_ROUTE_SEARCH 선언 | 0개 |

따라서 **이 단말의 현재 조회 범위에서는 해당 Pleos 서비스를 사용할 근거가 없다**. 전체 PC·다른 단말·모든 Pleos 서비스가 없다고 확대하지 않는다. 앱의 AAOS guard를 우회해 SDK를 강제 연결하거나 권한을 부여하지 않았다.

## 안전 guard 소스 검토

최신 PM HEAD `6c935b48ff03e97416e14915241e9b78de0e4874`의 실제 세 파일과 IT13 격리 작업공간 파일의 Git blob이 일치했다.

| 파일 | Git blob |
|---|---|
| MainActivity.java | 705694f43c830d2976d9bb9d9d35fad99c2538ac |
| NavigationAdapter.java | 32b2246225d0afb3304eee8520e2aed52d21465d |
| CarRestrictionMonitor.java | bb2bb09bafb40a56e195cd7910e259b16b571a85 |

소스상 허용식은 `automotive && uxKnown && !uxRestricted`다. 일반 휴대전화, 차량 상태 미확인·제한 상태에서는 checkNavigation의 초기화와 requestSampleRoute가 거절 경로로 간다. 차량 모니터는 초기/연결 해제/null/예외 상태를 unknown+restricted로 처리하고, baseline이 아닌 UX 제한도 차단한다. 경로는 서비스 연결 후 별도 확인 창을 거치며 확인 시 차량 조건을 다시 검사한다. 경로 요청 전달과 완료 콜백은 구분한다.

이는 **소스 검토**다. 이번에는 두 bridge를 호출하거나 unknown/restricted/baseline을 런타임 주입하지 않았으므로 guard 실행·거절 메시지 표시·SDK 연결/오류/경로 완료 콜백 통과라고 쓰지 않는다. 이전 CI의 컴파일과 에뮬레이터 인계 성공도 이 누락을 대체하지 않는다.

## 유지 상태와 다음 작업

최신 위임/상시 휴대전화 승인/배정 원장·23시 result 및 PR2 댓글을 읽었다. 다른 claim/관련 writer/진행 instrumentation은 확인되지 않았다. 읽기 전용이라 기기 소유권을 취득하거나 UI를 조작하지 않았다. 설치 5패키지 SHA가 직전과 일치했다. 제품 c5aad9ee, 테스트3544a445 유지, 새 빌드·설치·초기화·권한 부여 없음.

제품 b227, 최신 테스트 ec6992f/CI40191642309 전체 성공·publish skipped, 23시 저장 주소→실제 카카오맵 표시·명시적 QA 복귀는 유효한 별도 근거다. DOCX/PDF version2와 17시 13쪽 검토 기록 유지, 이번 재편집 없음. Draft PR 미병합, v0.3.0-preview만 게시, 0.4.3 미게시·실제 공모전 미제출. 독립 QA/감사·사람 사용성 승인 미확인, 전체 진척률/지난주 비교 미산정.

다음 단일 기존 PM: 현재 단말에서 두 bridge의 거절 callback 및 저장 상태 보존을 관찰하는 한정 instrumentation을 준비·검증한다. 안전 조건을 강제로 허용하지 않고 서비스 연결/경로 요청 성공과 분리한다. 실제 Pleos 서비스·UX manager가 있는 시험 환경과 권한이 확보된 뒤 연결/완료 콜백은 별도 검증한다. 유효 REST 인증·실기관/클라우드·독립 QA·사용성·실제 접수 요건은 계속 남아 있다. 야간 Slack 발송, 새 agent/예약/수신자/공개 runner·배포·비용 없음.
