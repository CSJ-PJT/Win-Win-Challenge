## 현재 앱 주요 지도 버튼·지도 웹 복귀 — 2026-10-26 20시 KST

현재 제품741 verifyqa4ed/test229를 유지한 PM 자체 QA입니다. **20:00:09 KST** 앱의 ‘카카오맵에서 위치 보기’ 주요 버튼을 실제 UI bounds 중심으로 한 번 탭했습니다. device log epoch1793012408.825의 MAP_INTENT_OPENED를 확인했으며 PC/기기 시계차를 지연시간으로 계산하지 않습니다.

이번 외부 호스트는 **네이버 앱 브라우저 com.nhn.android.search**였습니다. 카카오맵의 ‘설치없이 지도보기’→공개 주소 검색 결과의 ‘지도’를 선택했고, 서울 중구 세종대로110/우편번호04524 검색 결과·지도 타일·주소 카드를 실제 PNG/XML로 확인했습니다. 네이티브 카카오맵 앱 실행 성공이나 그 앱의 부재로 판정하지 않습니다. 기존23시c5의 네이티브 지도 결과와 구분합니다.

QA MainActivity를 명시적으로 실행해 복귀한 뒤 주소·우편번호·방문 상태와 **48개 text/content-desc 배열 전후 동일**을 확인했습니다. 전체 localStorage 비교·process COLD·단일 뒤로 복귀 시험은 아닙니다. 원래 앱을 포함한5패키지 설치 SHA가 전후 동일하며 20:02:34 자기 claim 정상반납/후속 부재·진행 instrumentation없음을 확인했습니다.

위치 권한 허용·앱 설치·경로 시작·전화·기관 전송은 하지 않았습니다. 카카오맵 package의 사후 fine/coarse 권한은 모두false이며 브라우저의 기존 권한 전체에 대한 판정은 아닙니다. 새 빌드/설치/JUnit 없음. 실제 UI1시나리오이며 CI35·release6a28의 물리 성공/독립 QA·사람 사용성 승인과 별도입니다. 최초 QA XML은 WebView준비 전 적은 노드였으며 같은 세션의 안정된 재조회/스크롤로 확인했습니다.

[실행 결과·설치 해시·비공개 화면 해시](../build-reports/pm-20261026/map-current-physical.json). 원본 상태표시줄 포함 PNG/XML은 IT13의 AS-Q1-PM-20261026T1955에 보존하고 공개하지 않았습니다. 야간 Slack 새 발송 없음.

다음 단일 기존 PM: 현재 source35의 loopback HTTP 역할·인증·오류 계약을 격리 합성 상태로 대조합니다. 실기관·클라우드·Kakao REST 유효키 성공으로 확대하지 않습니다.

## 최신 비차량 거절 실기기 회귀 · 2026-10-26 19시 KST

19:02:50.640–19:02:51.822 KST, 현재 제품741 verifyqa4edaf75c / test35의229eefc4에서 NavigationGuardTest가 **JUnit OK1/0.814초** 통과했습니다. 실제 비차량 단말에서 checkNavigation·requestSampleRoute를 호출해 각 거절 callback과 화면 안내 문구를 확인했고, navigation adapter가 전후 null인 것과 전체 localStorage key/value 동일을 assertion으로 검증했습니다.

시험은 실제 FEATURE_AUTOMOTIVE=false를 검사하며 차량/UX flag를 바꾸지 않습니다. onNativeNavigationStatus를 일시 감싸 실제 callback을 관찰·원래 함수 호출/복원했으며 응답·저장 상태를 주입하지 않았습니다. **요청의 안전한 거절**을 검증한 것으로 실제 Pleos 연결·서비스 binding·경로 완료나 AAOS UX 제한 runtime 성공이 아닙니다. 01시c5/test419의0.896초와 현재4ed/test229의0.814초는 별도입니다.

실행 전 단일 claim/CreateNew·instrumentation·writer·잠금/입력 제한·설치5APK SHA·test229 class/manifest target을 확인했습니다. 새 빌드/설치/권한변경 없음,5패키지 전후 해시 동일·자기 claim 정상반납·후속 claim부재/instrumentation없음 확인. PM 자체 QA이며 독립 QA/감사·사람 사용성·release6a28 물리 성공과 구분합니다. [실제 결과·해시·시간별 marker](../build-reports/pm-20261026/navigation-guard-current-physical.json).

다음 단일 기존 PM은 현재앱 주요 지도 버튼과 저장된 공개 주소/점유 조건부터 확인한 뒤 지도 열기·명시적 QA 복귀/저장 보존을 한 번 확인합니다. 위치 권한 허용·경로 시작·실전화·실기관 전송은 수행하지 않습니다. 이번 19시 Slack 새 게시 없음.

## 최신 전화 bridge 실기기 회귀 · 2026-10-26 18시 KST

18:13:07.958–18:13:10.551 KST, 현재 제품741 verifyqa4edaf75c / test35의229eefc4에서 기존 DialerBridgeTest가 **JUnit OK1/2.210초** 통과했습니다. 합성번호5550100에 대한 실제 ACTION_DIAL 전달, 해석된 전화 앱 패키지의 화면 표시, 명시적 QA 복귀·전체 localStorage key/value 전후 동일을 확인했습니다. 시험 전후 원래 앱을 포함한5패키지 설치 SHA가 동일하며 own claim 정상반납/후속 claim부재·instrumentation없음을 확인했습니다. 새 빌드·설치·권한변경 없음.

시험은 VehicleBridge.openDialer를 직접 호출하며 ACTION_CALL을 금지하는 monitor로 실제 전달을 관찰합니다. 전화 앱 컨트롤을 누르거나 실제 발신하지 않았고 연락처·통화기록·전화화면 캡처를 수집하지 않았습니다. 주요 연락 버튼의 사람 사용성·실제 통화·AAOS 주행 제한 성공은 아닙니다. 이전c5/test354의2.775초와 현재4ed/test229의2.210초는 별도 결과입니다.

현재CI35의 전화 runtime 또는 release6a28 APK의 물리 성공으로 확대하지 않습니다. PM 자체 QA이며 독립 QA/감사 승인이 아닙니다. [원본 결과·패키지 해시·시간별 marker](../build-reports/pm-20261026/dialer-current-physical.json).

다음 단일 기존 PM은 NavigationGuardTest의 비차량 조건·flag 미변경·adapter null·저장 보존 검사와 기기 점유부터 확인한 뒤 한 번의 거절 회귀를 수행합니다. 실제 Pleos 서비스 연결/경로 요청·완료는 수행하지 않습니다.

## 최신 실기기 Geocoder 회귀 · 2026-10-26 17시 KST

17:10:27.844–17:10:30.186 KST, SM-F936N Android16의 **제품741 verifyqa4edaf75c / test35의229eefc4**에서 기존 GeocoderBridgeTest가 **JUnit OK1/1.379초** 통과했습니다. 공개 합성 장소 서울시청을 실제 VehicleBridge.searchAddress로 검색해 결과1개·모든 좌표 유한·오류없음·callback409ms를 확인했습니다. 시험 전후 전체 localStorage key/value 비교가 같고 5패키지 설치 SHA도 전후 동일합니다.

`onAddressResults`를 일시 감싸 실제 callback을 관찰하고 원래 함수를 호출·복원했습니다. 저장값/검색 응답을 주입하지 않았습니다. 주요 검색 버튼을 사람이 사용한 UI 시험, 좌표 정확도 평가, 공식 우편번호 picker 또는 Kakao REST 유효키 검색은 아닙니다. 현재 CI35에는 이 Geocoder runtime이 포함되지 않으며 물리 verifyqa와 release6a28도 별도입니다.

실행 전 claim/CreateNew·instrumentation·writer·잠금 상태와 설치 APK5개 해시, test229 class/manifest target을 확인했습니다. 빌드/설치/삭제/clear/권한변경/실전화/기관전송 없음. own claim 정상 반납과 후속 claim 부재·instrumentation 없음 확인. PM 자체 QA이며 독립 QA/사용성 승인 아님. [원본 결과·현재 패키지 해시](../build-reports/pm-20261026/geocoder-current-physical.json).

다음 단일 기존 PM은 현재 DialerBridgeTest의 발신 없는 ACTION_DIAL·저장보존 검사와 점유부터 확인하고 허용된 단일 회귀를 수행합니다. 기존 통과 공식주소/TTL/Geocoder를 반복하지 않습니다.

## 현재 검증 기준 · 2026-10-26 16시 KST

제품 소스는 `741869b3f7ce8d954cc7d267a69bdfe85b338e9b`, 주소 시험 수정 소스는 `35e30651a259251cc652c66acca43eafdff33b78`입니다. [CI40252472387](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40252472387)는 10:05:27–10:16:02 KST에 verify-build/live-address/native-smoke 성공, publish skipped로 종료했습니다. 이번 16시 작업은 문서·소스·기존 실행 근거 대조이며 신규 제품 시험이 아닙니다.

| 환경·바이너리 | 확인한 범위 | 근거 |
| --- | --- | --- |
| CI35 Android15 release `6a28008a…e53313` | 공식 주소 JUnit1/62.605초, APK UI7, DOM JUnit1/17.692초. Node112/실패0·PC/HTTP 공식 주소7은 별도 실행 | [11시 최종 검수](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6406563089) |
| Android16 물리 verifyqa `4edaf75c…b88c` / 이전 test419 | 09시 공식 주소 JUnit1/16.665초, 수동 주소·양측 인계·보호자·쉬운 알림/시설 ACK DOM JUnit1/9.330초 | [09시 기록](READINESS_PHYSICAL_20261026.md) |
| 같은 물리 앱 / 수정 test `229eefc4…6d4f` | 10시 공식 주소 JUnit1/16.709초. 별도 force-stop→PID 없음→COLD302ms 후 같은 세션에서 주소·우편번호 복원. 새 테스트의 DOM 재시험은 없음 | [실패·수정·콜드 복원](COLD_PHYSICAL_20261026.md) |
| 같은 물리 앱/test229의 실제 UI | 12시 시설 준비 후 실제610.595초 무입력 대기→버튼 비활성·재준비 안내→시설 재준비·새6자리 번호 발급. ADB UI1시나리오이며 JUnit 추가나 양측 인계 재시험이 아님 | [12시 실제 시간 검증](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6407453978) |

CI release와 물리 verifyqa는 APK·인증서가 다릅니다. 공개 release 후보의 실기기 통과, 독립 QA/감사·사람 사용성, 09시 업데이트 전 저장값 동일성을 위 결과로 확정하지 않습니다. 실제600초 경계 지연이나 2초 갱신 지연의 측정 결과도 아닙니다.

HTTP6개·bridge6개별 현재 판정은 [API·bridge 근거 표](API_EVIDENCE_MATRIX_20261025.md)를 우선합니다. 현재 소스의 실제 route/인터페이스 목록과 CI35 원본 source ZIP의 바이트를 대조했습니다. HTTP 로컬 계약, 주입 fixture, 실제 외부 요청, 에뮬레이터, 물리 단말을 합산하지 않습니다.

## 이전 실행 이력

아래의 '현재/최신/미검증/다음'은 각 기록 시점의 표현입니다. 최신 범위는 위 표를 따르며 원본 실패·시험 버전은 보존합니다.

> 2026-10-26 02시: 41c1812/CI40210143323 최종 verify/live/native success(01:07:04–01:17:16KST),publish skipped. 3원본로그·3실제ZIP·APK해시/v2인증서/8assets 대조 완료. [최신 CI 결과](GUARD_SOURCE_CI_FINAL_20261026.md). Guard/Geocoder/Dialer는 CI runtime 미포함, 01시 c5/419 물리거절1/0.896초와 별도. 아래 진행중 표기는 과거 시점 기록.

> 2026-10-26 01시: c5제품/새419test에서 실제 NavigationGuardTest JUnit1/0.896초 통과. 두 비차량 거절 callback·화면 toast·전체 localStorage동일·adapter null 확인, native flag 미변경/서비스·경로 요청 없음. [정확한 범위](NAVIGATION_GUARD_PHYSICAL_20261026.md). 새41c1812/CI40210143323 진행 중, 아래 ec6992f 전체성공과 분리.

> 2026-10-26 00시: 실제 NaviHelper3.0.5 AAR 연결 대상/권한과 단말 서비스 조회를 대조했다. automotive=false, 정확한 서비스 패키지 경로 없음/action 서비스0/car_service없음. 두 bridge 안전 guard는 소스만 검토했으며 연결·거절·완료 callback 런타임은 미실행. [조회 근거](PLEOS_READINESS_20261026.md). 새 빌드/설치/UI시험 없음.

> 2026-10-25 23시: 현재 c5 검증 앱의 저장 주소 주요 지도 버튼→카카오맵 실제 주소/지도 타일 표시→명시적 QA 복귀를 확인했다. 위치 권한 미허용, 주소·우편번호/5패키지 SHA 유지. 뒤로 한 번은 외부 위치 권한 창으로 이어져 직접 복귀 성공은 아님. 새 빌드·설치·JUnit 없음. [정확한 물리 지도 범위](MAP_PHYSICAL_20261025.md). 아래 기록은 시점별 이력이다.

> 2026-10-25 22시: ec6992f/CI40191642309 21:06–21:16KST verify/live/native최종success,publishskipped。실제ZIP/APK/v2인증서/8assets대조. [현재HTTP6·bridge6근거표](API_EVIDENCE_MATRIX_20261025.md). Geocoder·전화는CIruntime미포함/기존c5실물별도결과,실차·기관·Kakao REST인증검색미완료. 아래pending은과거시점기록.

> 2026-10-25 21시: 기존c5앱/새354test에서 실제전화bridge ACTION_DIAL→전화앱패키지화면→QA복귀/저장상태동일 JUnit1/2.775초통과. 발신/전화앱버튼클릭/연락처·기록·전화화면캡처수집없음. [전화bridge실기기근거](DIALER_PHYSICAL_20261025.md). 새test소스ec6992f/CI40191642309 마지막verify-build진행중,CI전화runtime미포함. 아래18시resolver만확인은당시이력.

> 2026-10-25 20시: 소스2284016/CI40182818148은18:58:07–19:08:56 전체verify/live/native성공·publishskipped, ZIP/APK실제바이트확인. 기존c5앱/5f7test에서공식주소JUnit1/16.944초 후 processCOLD264ms/안정화재조회주소·우편번호복원확인. [최신CI·c5 COLD근거](CI_AND_COLD_FINAL_20261025.md). Geocoder는19시실기기별도통과,CI runtime에는미포함. 아래진행중/미검증표현은과거시점기록.

> 2026-10-25 19시: Geocoder실제bridge 호출이 c5검증앱/신규5f7test에서 JUnit1/1(1.348초) 통과. isPresent=true/공개장소결과1개/유한좌표/409ms/저장상태동일. [Geocoder실기기근거](GEOCODER_PHYSICAL_20261025.md). 새test소스2284016/CI40182818148 마지막verify-build진행중, 기존b227전체CI/공식주소·DOM과분리. 아래18시Geocoder미실행은그시점이력.

> 2026-10-25 18시: 실제 loopback 서버8계약요청 확인(키없음503/미인증401/잘못된query·본문400), 외부 Kakao 무인증GET1회401. 인증성공아님. 전화resolver확인/미실행, automotive=false/Pleos패키지0, Geocoder실호출미검증. [새 외부연동 점검](EXTERNAL_API_CHECK_20261025.md). 17시 제출DOCX/PDF version2 갱신·13쪽시각검토 완료, 아래는각시점기록.

> 2026-10-25 16시 최신: b227/CI40167658701 verify/live/native 최종성공(15:02:05–15:11:48), ZIP/APK/cert바이트대조. 동일서명 localverifyQa c5aad9ee(5170840B) 데이터보존업데이트·기존주소/우편번호유지,공식주소1/16.281s·DOM1/9.410s 실물통과. CIrelease와localverifyQa구분. docs/B227_FINAL_VERIFICATION_20261025.md 우선. 제출DOCX/PDF는 후속17시 같은ID version2로 갱신/13쪽 전체시각검토 완료. docs/SUBMISSION_REVIEW_20261025.md 참조.

> 2026-10-25 15시 최신: CI40163763754/source518는 verify/native성공·live-address HTTP저장FAILURE로 최종실패. pending상태아님. 저장busy경합을 실제로컬HTTP 지연조건에서 재현/수정b227ca2 후 저장·reload 및Node112/0통과. 새CI40167658701진행중, 새수정APK/실기기미검증. docs/EDITOR_SAVE_BUSY_20261025.md 우선; 기존518 실기기주소시험통과는 유지하되환경별구분.

> 2026-10-25 13:59 최신: 시험기 시작상태 수정5188638 + 새test bb17d224(817232B), 동일앱18c999d1 보존. 실기기 저장상태→공식주소 OK1/16.637s, DOM완료상태준비 OK1/9.566s, 완료상태→공식주소 OK1/15.769s. 13시옛시험기실패와구분, 새CI40163763754 진행중. docs/ADDRESS_HARNESS_FIX_20261025.md 우선. PM자체QA/공개release실물승인아님.

> 2026-10-25 13:06 최신: 동일verifyQa18c999d1/test42f683a5의 공식 SDK 주소 선택→저장→프로세스 종료(pid없음)→COLD273ms 후 주소/우편번호 복원 확인. 별도 LiveAddressTest는 기존 완료 화면에서 초기버튼을 가정해1회FAIL(25.18s), 시험기 전제조건 수정 미완료. 이전12시통과와 혼합하지 않음. docs/VERIFYQA_OFFICIAL_COLD_20261025.md 참조. PM자체QA/공개release실물승인아님.

> 2026-10-25 11:59 최신: source722a366/product9c277ce 고정 verifyQa(18c999d1/test42f683a5) 공존설치·공식주소1(14.248s)·DOM1(9.436s) 실기기 통과. 쉬운 ACK COLD279ms 복원/한글큰글씨/불필요한 빈주소안내·비활성설정 제거 직접 확인. 원래 앱/기존.qa 해시 유지. PM 자체QA, 공개release 바이너리/독립승인 아님. 새verifyQa 공식선택주소 process cold 복원은 별도미검증. docs/VERIFYQA_PHYSICAL_20261025.md 우선; 아래 과거 NOT_RUN/서명차단은 해당 예전 동일패키지 업데이트 범위.

## 공식 주소 process cold 복원 실기기 확인 · 2026-10-25 07:00 KST

작업 AS-Q1-PM-COLD-20261025T0656, 기존 PM 임시 AS-Q1 자체 QA. 최신 지시·PHONE-QA-STANDING·기존 결과와 점유를 읽고 AS_Q1_DEVICE.lock을 독점 생성했다. 설치된341bc88 QA2903bc14/testc73efa79에서 주요 화면 버튼으로 새 합성 유치원 방문을 만들고, 도착지 편집→주소 검색→공식 SDK의 서울시청 도로명 결과 실제 선택→주소/우편번호 반환→저장을 수행했다. JS/상태 주입·개발자 도구·재설치 없이 실제 터치로 실행했다.

QA 패키지만 am force-stop하고 pidof가 비어 있음을 확인한 뒤 am start -W로 시작했다. Status ok / LaunchState COLD / TotalTime347ms / WaitTime358ms. 안정된 메인 화면에서 선택 주소를 직접 확인하고 편집창에서 동일 주소와 우편번호04524 복원을 확인했다. 편집창은 추가 저장 없이 닫았다. 최초 즉시 접근성 조회는 WebView 자식 노드가 없었으며 준비된 뒤 재조회해 성공했다. 한 번의 선택·cold 실행 뒤 화면 조회만 재시도한 것으로 앱 검증 실패를 숨긴 것이 아니다. 이 한정된 준비 시점 사례만으로 전체 접근성/기동 속도 문제가 해결됐다고 판단하지 않는다.

**설치된341bc88 QA의 공식 선택 주소 process cold 복원은 이번에 확인 완료. 최신 수정9c277ce/새QA25fbaf85 및 release95d9ba40의 실기기 성공은 계속 미검증이다.** 새/기존 QA 서명 불일치와 데이터 보존 업데이트 차단은 그대로다. 원래 앱c09449f8·QA2903bc14·testc73efa79 설치 SHA 전후 동일. 원래 앱 삭제/초기화/교체/force-stop·개인정보 탐색·실전화/기관 전송 없음. QA의 현재 합성 방문 상태는 정상 제품 버튼으로 새 방문/주소 저장했으며 이전 시험 기록·캡처는 보존했다. 완료 후 자신의 잠금을 반납했다. 독립 QA/감사 승인은 아니다.

IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T0656/result.json 및 00~11단계 비공개 캡처/XML·cold-start.txt 보존. 상태바 포함 화면은 게시하지 않는다. 중요 해시:
- 공식 picker05-picker.png:2368bc0249ceab73ec8cf54cb418091290676cd43fae3a3894c7085a8e77546d
- 안정된 cold 메인10-cold-settled.png:0004164b8d0dd6574c1554c642918f460303fa20e05c7640966ebf1c336e7cff
- cold 편집창11-cold-editor.xml:fa6a6fb7781131de31a00a57699207e028ff00639cacb87dca16dbe36367c621
- cold-start.txt:ded8821a16e3e0042f71906c979037d66156338d29420884eeec54b78e2d6afb

다음 단일 책임자는 기존 PM. 최신 수정 APK의 데이터 보존 가능한 실물 검증 경로가 다음 우선순위이며 외부 실연동·최종 제출판 대조·독립 감사는 남아 있다. CI40127842234/9c277ce 성공 유지·새 빌드 없음, PRDraft/미병합·미배포·미제출, DOCX/PDF 재열람/수정 없음. 지난주 비교/전체진척률 분모 없음. 야간 Slack/일반 정기 알림 없음.

---

## 최신 확인 · 2026-10-25 06:05 KST

소스9c277ce5bcb1c7b79b2a5ce5871a8302343dd4fe / CI40127842234(05:00:29–05:11:15 KST)는 verify-build/live-address/native-smoke 전체 success, publish skipped. 원본 로그/실제 ZIP 바이트를 다시 읽어 Node112/실패0·쉬운 완료 화면 Chromium회귀5개·공식주소 Android instrumentation1·APK조작7·DOM instrumentation1 및 종료코드5개=0을 확인했다. 수정된 빈주소 완료 화면에서 설정 지시/비활성 버튼 없이 시설 요약과 ‘다른 방문 시작하기’가 표시됨을 Chromium 캡처로 직접 확인했다.

release APK SHA256 95d9ba4085b2e64d28241267303ed5fec037a729a10ba268fa7e1b7c0e5b1a6c(5,170,128bytes), QA25fbaf85…21827(5,170,152bytes)/testaf091cdb…34634(816,844bytes). 실제 APK 바이트 및 signing block 인증서23a3ce03…4a486를 CI manifest와 대조하고 release/QA assets8개 동일을 확인했다. 이 검토의 인증서 추출은 별도 전체 암호학 서명 검증 실행이 아니며 CI apksigner 성공과 구분한다.

**새 소스는 Android15 에뮬레이터 release 결과이며 실기기 성공은 아니다.** 06:05 읽기 전용 ADB에서 설치된341bc88 QA2903bc14/testc73efa79 및 원래c09449f8 해시 그대로를 재확인했다. 설치된QA 인증서faa33573…6f133과 새QA23a3ce03…4a486가 달라 데이터 보존 업데이트 조건을 만족하지 않는다. 설치 실패를 실행한 것은 아니며 재설치/삭제/데이터초기화/강제교체하지 않았다. 후속 실제 기기 검증에는 동일 서명의 안전한 빌드 경로 또는 기존QA와도 공존하는 한정 검증 패키지 방안 검토가 먼저 필요하다. 이번에는 새 빌드를 만들지 않았다.

상세 근거 build-reports/pm-20261025/easy-fix-final-check.json 및 easy-fix-final-log.txt. 이전375e325의 ‘진행 중’과 아래5232b81/341bc88 기록은 당시 범위다. 공식 선택 주소 process cold 복원/실서비스 API/독립QA·감사/최종 제출판 대조는 계속 별도 검증 대상이며 원문 DOCX/PDF를 이번에 다시 읽거나 수정하지 않았다. 게시v0.3.0-preview·PRDraft 미병합·공모전미제출, 지난주 비교/전체진척률 근거 없음. 야간 Slack 없음.

---

# 실기기 후속 · 2026-10-25 03:13 KST

준비된341bc88 QA 앱2903bc14/testc73efa79를 공존 설치해 공식주소 instrumentation1과 수동주소 DOM 인계/쉬운알림 instrumentation1이 실기기에서 각각 통과했다. PM이 임시 AS-Q1을 수신·직접 수행한 자체 QA이며 독립 승인이나5232b81 release 실기기 성공이 아니다. 쉬운 알림 ACK의 process cold 복원 화면 확인, 공식 선택 주소의 별도 cold 복원은 추가검증. [실기기 근거/정확한 명령](PHYSICAL_QA_20261025.md). 아래는 각 시점의 이전 기록이다.

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

