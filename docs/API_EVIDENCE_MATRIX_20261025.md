# API·bridge 현재 판정 — 2026-10-28 23시 KST

이번 작업은 **근거표 현재화·소스 동일성 대조**입니다. 신규 HTTP/Android JUnit/폰 UI/빌드/설치/CI 요청은 모두 0입니다. 10/27 23시 표의 f1164·verifyqa bd·문서v4·후보r1 표기를 현재 근거와 구분하도록 갱신했습니다. 아래 이전 전문은 날짜를 붙여 보존합니다.

## 현재 소스·산출물·판정 기준

- 제품/시험 소스: `99d5da02f20d3523d55897795d1f4a6b1fb1690a`. 조회 당시 문서 HEAD `b3b72d5481db13e192caf341dd98bcdf249e6fe9`.
- [CI40592432776](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40592432776) success: verify-build/live-address/native-smoke 성공·publish skipped. Android15 에뮬레이터 release f3b8c701의 공식주소 JUnit1/59.203초·DOM1/18.397초·UI7, Node112·PC주소7은 각각 별도 범위입니다. [CI 검수](CI_NAVIGATION_ADDRESS_VERIFICATION_20261028.md).
- 물리 Android16: `kr.co.ansimdonghaeng.verifyqa` 앱93000752…9045 / test dacb173a…ae7. 지속 QA variant이며 releasef3b8와 다른 패키지/서명입니다. 아래는 **PM 자체 QA**이며 독립 승인·사람 사용성 판단이 아닙니다.
- 비공개 후보 r4: releasef3b8·source99 ZIP·같은ID DOCX/PDF v5. 22:59:58 보존 검수에서 체크섬20/20, SUMS419f736a…d31a 및 설치5패키지 SHA 유지. 공식 문서 내용/렌더 신규 검수는 이번 0입니다.
- PR2 Private/Draft·미병합. 최신 조회 게시 release는 v0.3.0-preview(10/23)만 있으며 0.4.3 공개/실제 제출 0입니다.

## HTTP API6 — 기존 실제 호출과 현재 바이트를 연결

[10/26 21시 실제 실행](HTTP_CONTRACT_20261026.md)은 Linux x64/Node24.22.1, 격리 loopback 합성 저장소의 **40요청/기대상태40일치·31assertion**입니다. 이번에 당시 JSON의 git_blob_sha와 현재 HEAD tree를 비교하여 다음 **3/3 동일**을 확인했습니다. 따라서 이 세 실행 의존 파일은 현재도 같은 바이트지만, 이력을 오늘 재실행한 것으로 바꾸지 않습니다. 현재 배포 환경·다른 환경변수·운영 저장소·외부 인증을 재검증한 것은 아닙니다.

| 파일 | 당시/현재 Git blob 동일 |
|---|---|
| server.js | `7933942c06dc5287b982a22b5296fba3430a5040` |
| web/core.js | `267601ac7c59e2c6e11ab1afd3f0eaea64fc1101` |
| web/config.js | `180907d23bf4fe7f08e0a3e339e27aac963be995` |

현재 server.js의 로컬 의존성은 web/core.js, 해당 core의 config 의존성까지 기존 시험의3파일을 대조했습니다. 표는 실제 과거 요청 결과만 표시합니다.

| API | 실제 실행 근거 | 미검증 경계 |
|---|---|---|
| GET /api/health | 10/26 200·local synthetic/0.4.3 | 운영 서버 상태 아님 |
| GET /api/bootstrap | 10/26 200·5역할 토큰·reset 후 갱신 | 기관 인증 아님 |
| GET /api/state | 10/26 역할200/무인증·구토큰401 | 기관 간 클라우드 동기화 아님 |
| GET /api/places | 10/26 키 제외401/400/503, 외부0; [10/27 설정검사](KAKAO_REST_CONFIGURATION_20261027.md) authenticated-local503/외부dapi0 | **유효 Kakao REST 인증 검색200 미검증**, 현재 키 재탐색/로그인0 |
| POST /api/reset | 10/26 guardian403/simulator200·비객체400/토큰폐기 | 합성 저장소만, 폰 초기화 아님 |
| POST /api/events | 10/26 READY200·동일 재전송/version유지·충돌409·비객체400/크기413 | 실기관 전송·운영DB 아님 |

공식 주소 picker 성공·Android Geocoder 결과·외부 지도웹 표시와 server /api/places 인증은 서로 다른 경로입니다. 현재 주소 주요 버튼이 Kakao REST를 호출했다고 주장하지 않습니다.

## Android bridge6 — 현재930 앱별 실제 범위

현재 MainActivity의 @JavascriptInterface 메서드 **6개를 직접 열거**했습니다. 아래 실행 시각/앱/시험을 유지하며 같은 JUnit을 메서드 수만큼 중복 계산하지 않습니다.

| bridge | 현재 verifyqa930 실제 근거 | 남은 범위 |
|---|---|---|
| openAddressSearch | 10/28 10시 공식주소 JUnit1/17.637초·ROUNDTRIP, 별도 COLD255ms 뒤 주소 UI 복원. [근거](CURRENT_QA_OFFICIAL_PHYSICAL_20261028.md) | cold우편번호 추가assert·기관승인/사람사용성 별도 |
| searchAddress | 20시 Geocoder JUnit1/1.283초·실제공개질의 결과1·finite좌표·callback408ms·전체 저장값동일. [근거](CURRENT_GEOCODER_PHYSICAL_20261028.md) | 지리정확성·오류/없음 UI·REST 인증 별도 |
| openMap | 22시 실제 지도 버튼→Naver 브라우저 Kakao 지도웹의 공개주소/지도타일→QA 복귀·주소 UI유지. ADB UI1/JUnit0. [근거](CURRENT_MAP_PHYSICAL_20261028.md) | native지도앱·경로안내·전체localStorage 동일성 미검증. QA새방문 상태변경/최초 로그필터 불완전 결과 보존 |
| openDialer | 21시 JUnit1/2.085초·ACTION_DIAL 실제전화앱 package노출→QA복귀·전체 저장값동일. [근거](CURRENT_DIALER_PHYSICAL_20261028.md) | 실제발신/전화화면제어·개인정보조회0, 주요연락버튼 사용성 별도 |
| checkNavigation | 19시 두 메서드 공통 NavigationGuardTest **1건**/0.985초·비차량거절/callback·안내/adapter null | 실제 SDK 연결·실차·UX 제한 미검증 |
| requestSampleRoute | 같은19시 JUnit1건에 포함·비차량거절·전체저장값동일. [근거](CURRENT_NAVIGATION_GUARD_PHYSICAL_20261028.md) | 실제경로/완료callback·차량 연결 재시도 미검증 |

별도11시 [DOM JUnit1/9.678초·쉬운ACK 콜드복원](CURRENT_QA_DOM_COLD_PHYSICAL_20261028.md)은 공식picker나 bridge6의 추가 통과 수로 합산하지 않습니다. 링크 유효성은 현재 tree로 검수합니다. 04시 NavigationAdapter 재시도 JVM 대역 시험은 실제 Pleos SDK/차량 연결 성공과 구분합니다.

## 제출 차단·다음 단일 담당

릴리스 설치본c094/cert74f3와 후보f3b8/cert187a는 서명이 달라 현재폰 데이터 보존 업데이트 경로가 차단되어 있습니다. 18시 연결범위에서 별도 시험기는 미확보이며 전체 장소의 부재를 뜻하지 않습니다. [사전검수](RELEASE_PHYSICAL_ROUTE_20261028.md).
release 실기기·독립 QA·사람사용성·유효REST·실차/Pleos/AAOS·기관클라우드·심사자 접근/기명서명 허용·실제 제출은 미완료/미확인입니다. **인터페이스12개 실서비스 정상·전체 출시완성률**로 환산하지 않습니다.

다음 단일 기존 PM(AS-M1): 공식 접수 안내 최신 변경과 심사 접근·서명·첨부 조건을 현재 후보r4/v5에 대조해 제출 게이트를 현재화합니다. 공개배포/권한확대/실제제출/새비용 없이 읽기·대조하며 기존 문서ID와 봉인후보를 보존합니다.
야간 Slack 발송0, 이전18시 게시 읽기만·폰push미검증. 아래는 과거 날짜/바이너리별 원문이며 현재성을 소급하지 않습니다.

---

## 보존 이력 — 2026-10-27 23시 이하 원문

# API·bridge 현재 판정 — 2026-10-27 23시 KST

현재 제품 소스는 f1164b04dc267260771ce3ffcc674247053f56e7 / CI40436119702 성공(publish skipped)입니다. 설치 verifyqa bd79075f/test229의19시 실제 주요버튼 인계·콜드,20시 쉬운알림/시설ACK·콜드,21시 이름2필드 저장/콜드/복귀,22시 잘못된연락처 거절·편집취소·콜드를 PM 자체QA로 구분합니다. [19시](PRIMARY_TOUCH_PHYSICAL_20261027.md) · [20시](EASY_TOUCH_PHYSICAL_20261027.md) · [21시](SETTINGS_TOUCH_PHYSICAL_20261027.md) · [22시](SETTINGS_CANCEL_PHYSICAL_20261027.md). 이것은 bridge6개 최신폰 재시험·release 자체물리·독립QA/사람사용성 승인 전체가 아닙니다.

23시 REST 경로 직접조사: server.js/API/places는 키워드 REST를 구현하지만 현재 주소버튼은 official postcode picker 경로입니다. 현재 프로세스/User/Machine의 정확한 KAKAO_REST_API_KEY 미설정·소유 격리workspace .env/.env.local 없음 확인. 다른위치/이름/계정의키전체부재 아님. 최신소스동일 server/core/config 격리 실제HTTP3요청 health200/bootstrap200/authenticatedplaces503 MAP_NOT_CONFIGURED, 외부 dapi 요청0·서버종료·데이터파일미생성. 유효인증REST200은 여전히 미검증입니다. [현재 조사와 범위](KAKAO_REST_CONFIGURATION_20261027.md).

서버6route의 최신코드검수와 실제외부호출, DOM/SDK/Geocoder를 합산하지 않습니다. 아래 날짜·옛APK·문서v3 기록은 당시 이력이며 현재 기준으로 소급하지 않습니다. 공식문서 현재v4/봉인후보 doc-v4-r1, 지정release75b5, 공개v0.3.0-preview·PR2 private Draft/미병합·실제제출미완료입니다.

---

> 10/27 08시 물리앱갱신: 지속서명verifyqa4ed→bd79075f로보존업데이트,CI899release와assets8/8동일.200%실제UI/가로·세로스크롤/COLD설정·확인유지/추가스크롤후100%복귀한정확인. 원본false보존/전체자동시험PASS아님. 기존release/.qa/.qa.test/test229보존. [최신물리근거](FONT_PHYSICAL_UPDATE_20261027.md). 아래4ed물리기록은해당옛바이너리의역사근거입니다.

> 10/27 07시 최신 CI: 소스899a5a1/CI40402218901 verify-build·live-address·native-smoke성공/publishskipped. Node112·별도글씨12조합·PC주소7·Android15공식주소JUnit1/76.907초·DOM1/19.526초·UI7범위. 새release53ca/cert e5fb/원본3ZIP검수완료,물리4ed·고정후보35/6a28과구분. 아래과거표는해당시간·바이너리의역사근거입니다. [최신검수](FONT_CI_VERIFICATION_20261027.md).

> 10/27 03시 물리 verifyqa 후속: 쉬운 화면 도착 알림 1회 뒤 재전송 제어 부재·역할 복귀 유지, 시설 ACK/재확인 제어 부재·쉬운 화면 확인 표시와 COLD 복원을 확인했습니다. 실제 스크롤 후속으로 최초 화면밖 버튼 조작 실패를 해결했고 원본 실패를 보존했습니다. 강제 중복 API 시험·인계 완료·전체 저장값 동일·후보 release 물리 PASS가 아닙니다. [범위·근거](EASY_NOTICE_PHYSICAL_20261027.md). 다음 단일 기존 PM은 콜드 실행 후 초기 빈 화면에서 실제 앱 문구·조작 가능한 화면까지의 준비시간을 한정 측정합니다.

> 10/27 02시 물리verifyqa후속: 잘못된번호1~4거절·5회폐기/입력란제거→새번호/양측재확인→보호자완료·같은COLD282ms후완료/주소/우편번호복원을실제UI로확인했습니다. ADB UI1시나리오/JUnit0,전체저장값동일·후보release물리PASS아님. [실행·부분실패기록](CODE_ERRORS_PHYSICAL_20261027.md).

## 과거 API·bridge 근거 표 — 2026-10-26 21시

## 현재 검증 기준 · 2026-10-26 16시 KST

제품 소스는 `741869b3f7ce8d954cc7d267a69bdfe85b338e9b`, 주소 시험 수정 소스는 `35e30651a259251cc652c66acca43eafdff33b78`입니다. [CI40252472387](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40252472387)는 10:05:27–10:16:02 KST에 verify-build/live-address/native-smoke 성공, publish skipped로 종료했습니다. 이번 16시 작업은 문서·소스·기존 실행 근거 대조이며 신규 제품 시험이 아닙니다.

| 환경·바이너리 | 확인한 범위 | 근거 |
| --- | --- | --- |
| CI35 Android15 release `6a28008a…e53313` | 공식 주소 JUnit1/62.605초, APK UI7, DOM JUnit1/17.692초. Node112/실패0·PC/HTTP 공식 주소7은 별도 실행 | [11시 최종 검수](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6406563089) |
| Android16 물리 verifyqa `4edaf75c…b88c` / 이전 test419 | 09시 공식 주소 JUnit1/16.665초, 수동 주소·양측 인계·보호자·쉬운 알림/시설 ACK DOM JUnit1/9.330초 | [09시 기록](READINESS_PHYSICAL_20261026.md) |
| 같은 물리 앱 / 수정 test `229eefc4…6d4f` | 10시 공식 주소 JUnit1/16.709초. 별도 force-stop→PID 없음→COLD302ms 후 같은 세션에서 주소·우편번호 복원. 새 테스트의 DOM 재시험은 없음 | [실패·수정·콜드 복원](COLD_PHYSICAL_20261026.md) |
| 같은 물리 앱/test229의 실제 UI | 12시 시설 준비 후 실제610.595초 무입력 대기→버튼 비활성·재준비 안내→시설 재준비·새6자리 번호 발급. ADB UI1시나리오이며 JUnit 추가나 양측 인계 재시험이 아님 | [12시 실제 시간 검증](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6407453978) |

CI release와 물리 verifyqa는 APK·인증서가 다릅니다. 공개 release 후보의 실기기 통과, 독립 QA/감사·사람 사용성, 09시 업데이트 전 저장값 동일성을 위 결과로 확정하지 않습니다. 실제600초 경계 지연이나 2초 갱신 지연의 측정 결과도 아닙니다.

## HTTP API 6개

현재 server.js에서 확인한 route6개는 아래와 같습니다. CI35 source ZIP의 server.js가 문서 작업 전 HEAD e0f256f와 바이트 동일합니다. 21시 Linux/Node24.22.1의 격리 loopback에서 HTTP40요청·31assertion을 직접 확인했습니다. server/core/config 3파일은 CI35 원본 ZIP 및 작업 전 현재 HEAD와 동일합니다. [실행 결과](HTTP_CONTRACT_20261026.md).

| 경로 | 실제 실행 근거 | 판정·남은 범위 |
| --- | --- | --- |
| GET /api/health | 21시 격리 loopback 실제200, local synthetic mode/0.4.3 확인 | 로컬 서버 상태 |
| GET /api/bootstrap | 21시 실제200·합성5역할 토큰, reset 후 새토큰 | 기관 계정 인증 아님. 토큰 원문 비기록 |
| GET /api/state | 21시4역할200·무인증/구토큰401·reset 후version0; 번호 공개 전체흐름은 기존CI 범위 | 로컬 역할 상태, 기관 간 클라우드 동기화 별도 |
| GET /api/places | 21시 키를 명시적으로 제외한503/무인증401/query400·외부요청0;18시 외부 무인증401은 과거별도 | 유효키 Kakao REST 검색200은 미검증. fixture200·공식 우편번호 SDK 성공과 구분 |
| POST /api/reset | 21시 guardian403/simulator200·비객체5종400·구토큰폐기 | 로컬 시연 계약. 폰 데이터 초기화와 무관 |
| POST /api/events | 21시 READY200·동일재전송버전동일·키/버전/trip409·비객체5종400/크기413; 전체인계는기존CI | 로컬 전이. 실기관 전송·운영 DB 성공 아님 |

[HTTP 원장](API_VERIFICATION.md) · [실제 외부 호출 당시 조건](EXTERNAL_API_CHECK_20261025.md). Node112 전체를 신규 HTTP 실호출112개로 계산하지 않습니다.

## Android bridge 6개

현재 MainActivity의 JavascriptInterface6개를 직접 대조했고 CI35 source ZIP과 HEAD의 바이트가 같습니다.

| bridge | 확인한 실행·대상 | 남은 범위 |
| --- | --- | --- |
| openAddressSearch | CI35 공식주소1 및 물리4ed/test229 공식1/16.709초·COLD302ms 후 복원 | 현재 test229 DOM 전체 재시험·기관 주소 승인·실차 UX 별도 |
| searchAddress | 현재4ed/test229 물리 JUnit1/1.379초·실제 결과1·유한 좌표·callback409ms·전체 localStorage 동일. [17시 근거](GEOCODER_PHYSICAL_20261025.md) | 위치 정확도·차량 환경·오류/없음 UI 분기·주요 버튼 사람 사용성 별도 |
| openMap | 현재4ed 주요지도버튼→네이버 앱 브라우저의 카카오 지도웹 선택→공개 주소·지도 타일·주소 카드 확인→명시적 QA복귀,48문구 동일. [20시 근거](MAP_PHYSICAL_20261025.md) | 네이티브 지도앱 실행·단일 뒤로 복귀·전체 localStorage 비교·경로 시작·실차는 이번 미검증 |
| openDialer | 현재4ed/test229 ACTION_DIAL→전화 앱 패키지 화면→QA 복귀 JUnit1/2.210초·전체 localStorage 동일. [18시 근거](DIALER_PHYSICAL_20261025.md) | 발신·전화컨트롤 조작 없음. 주요 연락버튼 사람 사용성·AAOS 제한 별도 |
| checkNavigation | 현재4ed/test229에서 실제 비차량 거절 callback·화면 안내·adapter null, 두 메서드를 포함한 JUnit1/0.814초 | 실제 Pleos 연결 callback·AAOS UX·실차 미검증 |
| requestSampleRoute | 같은 현재4ed/test229 비차량 거절·안내·adapter null·전체 localStorage 동일. [19시 근거](NAVIGATION_GUARD_PHYSICAL_20261026.md) | 실제 경로·완료 callback·실차 미검증 |

Geocoder·Dialer·NavigationGuard는 현재CI35의 런타임 대상이 아닙니다. Geocoder17시·Dialer18시·NavigationGuard19시는 현재4ed/test229의 물리 단일 회귀를 추가했습니다. 나머지 과거 실물 성공을 최신4ed의 재시험으로 소급하지 않습니다. [Geocoder](GEOCODER_PHYSICAL_20261025.md) · [전화](DIALER_PHYSICAL_20261025.md) · [지도](MAP_PHYSICAL_20261025.md) · [SDK 환경](PLEOS_READINESS_20261026.md) · [비차량 거절](NAVIGATION_GUARD_PHYSICAL_20261026.md).

**12개 인터페이스 전체 실서비스 정상 또는 bridge6개 최신 실기기 완료로 판정할 근거는 없습니다.** 공식 우편번호 SDK, Android Geocoder, Kakao Local REST는 서로 다른 경로입니다.

## 제출·보존·다음 단일 담당

공식 DOCX/PDF 동일ID version3의 최종 저장 바이트와 후보35 목록은 [15시 검수](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6409441254)를 따릅니다. 저장 PDF SHA946f9f60과 업로드 입력52f0bab6를 구분합니다. source ZIP README의 옛41 안내는 보존된 원본이며 [14시 후보](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6408608062)의 별도 README_KO가 현재35 기준을 명시합니다. 이번 문서 변경은 고정한 후보 ZIP/APK나 공식 파일을 교체하지 않습니다.

PR2는 Draft/미병합, v0.3.0-preview만 게시되어 있고 0.4.3 공개·실제 제출·심사 접근·독립 QA/감사·사람 사용성·실차/기관/클라우드·유효 REST 인증은 미확인입니다. 기존 앱·데이터·후보를 보존했습니다.

다음 단일 기존 PM: 기존 제출 게이트/판정 기준을 후보35·문서v3·환경별 실제 근거와 대조하고 남은 책임·완료조건을 정리합니다. 임의의 전체 진척률이나 실서비스 완료를 주장하지 않습니다.
