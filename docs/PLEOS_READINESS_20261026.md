# Pleos·AAOS 대응 범위 재대조 — 2026-10-28 03시 KST

기존 PM이 최신 HEAD ef6a898/sourcef1164b0, 후보release75b5와 공식 개발 문서를 대조했습니다. 기존10/26 AAR·기기점검 및 비차량 거절 자체QA를 먼저 읽었고, 이번을 새 차량 연동 성공으로 합산하지 않습니다. 조회02:59:00 KST, IT13 AS-M1-PM-20261028T0256.

| 항목 | 현재 실제 근거 | 판정 |
|---|---|---|
| 개발 기준 | app minSdk28/target35/compile35, AGP8.9.2·Java17/Kotlin, release043 workflow Gradle8.11.1 | 공식 API28+/Gradle8+/Java/Kotlin 기준에 해당. 버전 조건 일치가 Pleos 실행/심사 통과는 아님 |
| NaviHelper | Gradle NaviHelper3.0.5 및 공식 Maven, NavigationAdapter 실제 import/initialize/listener/requestRoute/release | SDK 연동 코드 존재. SDK 부재로 보고하지 않음. 연결/요청전달/경로완료 callback은 별도 상태 |
| 배포 APK manifest | aapt exit0, NAVI_ROUTE_SEARCH, automotive/touchscreen required=false, android.car optional, NAVI_START queries, SDK3.0.5·최소서비스2.0.1 메타데이터 | 공식 requestRoute 요구권한과 일치. 권한 선언은 기기 허가·서비스 호환성·실행 성공이 아님 |
| 차량 UX | CarUxRestrictionsManager listener+refresh, unknown/null/예외/끊김은 제한. MainActivity는 automotive && uxKnown && !uxRestricted 조건 | 비기준 UX 제한 시 전체 UI/주소/지도/전화/native경로를 보수적으로 차단하는 소스. DO 선언 없음. 동작 중 차량 상태 변화의 실차 검증은 미실행 |
| 실제 경로 | RouteFactory.sample은 고정 42dot 공식 예제 목적지. UI 확인창도 예제임을 표시하고 실행 직전 조건 재확인 | 저장한 사용자 목적지를 실제 차량 내비로 안내하는 기능이 완료됐다는 증거가 아님. 외부 카카오맵/Google지도 링크 경로와 구분 |
| Vehicle/Fused/TTS/STT | 조회한 앱 모듈의 직접 제품 SDK 의존성은 NaviHelper. CarUxRestrictions는 android.car API이며 Vehicle State SDK가 아님 | 다른 SDK 전체가 없다고 확대하지 않음. 전체5SDK를 구현완료로 표시하지 않음 |
| 현재 휴대전화 | automotive=false; 지정 Navi 패키지 pm path 출력없음/exit1; NAVI_START query No services found; car_service not found; 정확한 route권한선언0 | 이 단말 조회범위에서 실제 Pleos 연결/AAOS 시험을 수행할 근거 없음. 다른 환경·계정·전체PC 부재는 판정하지 않음 |
| SDK 이용 상태 | 공식 프로젝트 안내는 Vehicle State·NaviHelper를 신청 없이 사용가능으로 구분. FusedLocation·TTS·STT·Vehicle Control은 준비중 안내 | NaviHelper 차단을 무조건 SDK 신청대기로 돌리지 않음. 문서/API소개 존재와 실제 사용가능/프로젝트 상태는 별개. 계정로그인/키탐색/신청0 |

공식 Emulator 안내는 Pleos Connect2.1.0/API34 가상차량 환경입니다. 기존CI의 Google APIs Android15/Pixel2 및 현재Android16 휴대전화 QA와 동일 환경이 아닙니다. AAOS Google Play 유통 지침을 Pleos App Market/공모전 제출승인으로 대체하지 않습니다.

## 보존·후속

후보 source ZIP의 관련8파일(Gradle3·manifest·MainActivity·CarRestrictionMonitor·NavigationAdapter·RouteFactory) Gitblob을 현재HEAD와 대조해8/8 일치했습니다. 후보release SHA75b531853370698e198889457fa6a2c6c55e78cd88e3efc3a7ffb0ae864dd100 고정 후 실제 merged manifest를 읽었습니다. 최초 aapt는 한글경로 Illegal byte sequence로 실패, 소유ASCII사본 SHA동일 확인 후 후속exit0/결과원본보존. 한국어label 출력인코딩은 판정범위에서 제외했습니다. 앱설치/권한변경/SDK강제연결/실제경로요청0.

r2 17파일/16체크섬 일치/SUMS465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c, 설치5종SHA 직전02시와동일/lock없음. 02:56:51 관련writer0/activeinstrumentation0. 새빌드/설치/CI/JUnit/폰UI/새계정·SDK신청/비용/공개배포/실제제출0. main/easy/address·미커밋·기존앱/사용자데이터/공식문서v4·봉인r1/r2/제출초안 보존. 이전CI40436119702 success·publish skipped 및 게시v0.3.0-preview와 별도입니다.

Vehicle/AAOS실행·release75자체물리·독립QA·사람사용성·유효REST/실기관/클라우드·서명/심사접근/실제제출은 계속 미완료/미확인입니다. 제품 전체완성률은 산정하지 않습니다. 야간Slack발송0/기존18게시만읽기확인·휴대폰push미확인,새agent/예약/수신자0.

추가 진단 후보: NavigationAdapter.connect 실패 callback은 connected=false로 처리하지만 initialized는 유지하며, 후속connect는 initialized 분기에서 기다리는 상태를 표시합니다. 이는 소스에서 확인한 경로이며 사용자가 실제 영구대기에 빠졌다는 재현은 아닙니다. 이번에는 제한 수정·재빌드를 하지 않았습니다.

다음 단일 책임: 기존 PM이 NaviHelper 초기 연결 실패 후 재시도 경로를 현재 NavigationAdapter 코드와 공식 콜백 계약으로 진단합니다. initialized 상태 유지의 실제 영향은 미확정으로 두고, 서비스/차량 상태 강제 허용이나 불필요한 빌드 없이 재현 가능한 검증 범위를 정합니다.

## 공식 근거 — 2026-10-28 재조회

- [https://document.pleos.ai/docs/connect/guide/getting-started/application-development/setup-connect-sdk-emulator](https://document.pleos.ai/docs/connect/guide/getting-started/application-development/setup-connect-sdk-emulator): API28+,Gradle8+,Java/Kotlin; Pleos Emulator2.1.0/API34. Generic Android15 phone emulator is separate.
- [https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/importing-sdk](https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/importing-sdk): Maven nexus-playground maven-releases; NaviHelper3.0.5 matches current source.
- [https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/declaring-permissions](https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/declaring-permissions): requestRoute requires NAVI_ROUTE_SEARCH; actual APK declares it.
- [https://document.pleos.ai/docs/pleos-only/create-my-project](https://document.pleos.ai/docs/pleos-only/create-my-project): Vehicle State and NaviHelper are available without SDK usage application; FusedLocation/TTS/STT/Vehicle Control listed as preparing. Account/project status not inspected or changed.
- [https://document.pleos.ai/docs/pleos-only/vehicle-app-developer-guide/driving-restriction-development-guide](https://document.pleos.ai/docs/pleos-only/vehicle-app-developer-guide/driving-restriction-development-guide): Use CarUxRestrictionsManager notifications and actual platform ActiveRestrictions, not guessed gear/speed conditions.
- [https://document.pleos.ai/docs/pleos-only/vehicle-app-planning-guide/driving-restiction-policy](https://document.pleos.ai/docs/pleos-only/vehicle-app-planning-guide/driving-restiction-policy): Without DO declaration, parked available/driving unavailable. App keeps DO absent and conservative blanket UI lock.
- [https://developer.android.com/training/cars/platforms/automotive-os](https://developer.android.com/training/cars/platforms/automotive-os): AAOS differs from generic Android; automotive feature and platform UX restrictions matter; Google Play distribution rules are not Pleos contest approval.
- [https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/initialization-and-release](https://document.pleos.ai/docs/pleos-only/connect-sdk-pleos/NaviHelper/initialization-and-release): Connected/failed callbacks; removeListener then release, recreate/init after release. Actual runtime retry coverage remains separate.

---

## 이전 점검 기록 — 2026-10-26 (당시 버전·상태)
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
