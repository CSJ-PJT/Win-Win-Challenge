> 10/27 03시 물리 verifyqa 후속: 쉬운 화면 도착 알림 1회 뒤 재전송 제어 부재·역할 복귀 유지, 시설 ACK/재확인 제어 부재·쉬운 화면 확인 표시와 COLD 복원을 확인했습니다. 실제 스크롤 후속으로 최초 화면밖 버튼 조작 실패를 해결했고 원본 실패를 보존했습니다. 강제 중복 API 시험·인계 완료·전체 저장값 동일·후보 release 물리 PASS가 아닙니다. [범위·근거](EASY_NOTICE_PHYSICAL_20261027.md). 다음 단일 기존 PM은 콜드 실행 후 초기 빈 화면에서 실제 앱 문구·조작 가능한 화면까지의 준비시간을 한정 측정합니다.

> 10/27 02시 물리verifyqa후속: 잘못된번호1~4거절·5회폐기/입력란제거→새번호/양측재확인→보호자완료·같은COLD282ms후완료/주소/우편번호복원을실제UI로확인했습니다. ADB UI1시나리오/JUnit0,전체저장값동일·후보release물리PASS아님. [실행·부분실패기록](CODE_ERRORS_PHYSICAL_20261027.md).

# API·bridge 근거 표 — 2026-10-26 21시

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
