# API·bridge 근거 표 — 2026-10-26 02시

## 현재 기준
소스41c1812013d395b90d9c6ae7a35ccdcee8b377f4 / CI40210143323 **01:07:04–01:17:16 KST verify-build/live-address/native-smoke success, publish skipped**. Node112/실패0, PC·HTTP 실제 공식 주소/저장/reload/지도, 저장 지연 회귀, Android15 release 공식1/52.530초·APK UI7·DOM1/16.075초, 종료코드5개0·3marker 확인. [최종 CI·실제 ZIP/APK 검수](GUARD_SOURCE_CI_FINAL_20261026.md).
NavigationGuard/Geocoder/Dialer는 CI 컴파일·포함만 확인했고 런타임 대상이 아니다. 01시 c5/419 물리 guard1/0.896초·2거절/화면·저장상태 동일과 분리한다.

## HTTP API 6개
현재server.js의실제route6개를직접읽고기존실행근거와연결했다. 로컬역할session/파일저장을기관인증·클라우드성공으로확장하지않는다.
|경로|실제근거|현재판정/미검증|
|---|---|---|
|GET /api/health|18시격리실제200·현재CI서버시험|로컬서버상태만|
|GET /api/bootstrap|18시실제200/토큰출력없음·CI|합성역할세션발급,실기관신원인증아님|
|GET /api/state|18시실제200·현재CI112역할조회/번호비공개검사|로컬역할조회통과,원격기관동기화별도|
|GET /api/places|18시인증된키없음503/미인증401/짧은query400·외부무인증401|유효키로실제Kakao REST정상검색미검증. fixture200을성공으로대체금지|
|POST /api/reset|기존실제합성새상태/권한검사·현재CI서버시험;18시null400|로컬시연reset만,기존폰/사용자데이터초기화없음|
|POST /api/events|현재CI인계/동시성·충돌시험·18시null400|로컬상태전이통과. 실기관전송·운영DB연동아님|
계약·전체흐름의범위는 [API원장](API_VERIFICATION.md) 및 [18시실호출](EXTERNAL_API_CHECK_20261025.md). 이번신규HTTP시험은실행하지않았고과거범위가현재소스에서통과하는지CI원본로그로확인했다.

## Android bridge 6개
MainActivity의실제JavascriptInterface6개를직접읽었다.
|bridge|확인한실행|남은범위|
|---|---|---|
|openAddressSearch|현재CI공식주소1, c5/5f7물리16.944초+COLD264ms|기관주소승인/실차UX는별도|
|searchAddress|c5/5f7물리실제Geocoder1.348초/isPresenttrue/결과1·유한좌표|위치정확도·차량환경·오류/없음분기와UI검색사용성별도|
|openMap|현재 CI Android15 MAP_INTENT_OPENED 및 23시 c5 주요 버튼→카카오맵 실제 주소·지도 표시→명시적 QA 복귀, 저장 주소 유지|단일 뒤로 복귀는 외부 권한 창으로 이어짐. 현재 위치 권한 미허용, 경로 시작·실차 미검증|
|openDialer|c5/354물리ACTION_DIAL→전화패키지화면→QA복귀2.775초/저장상태유지|실제발신미수행·주요연락버튼사용성/AAOS제한별도|
|checkNavigation|실제 SDK 컴포넌트/권한·소스 guard 대조, 현재 단말 정확한 서비스 조회 불가|비차량 거절 callback/화면 c5/419 통과. AAOS UX/실제 Pleos 연결 콜백 미검증|
|requestSampleRoute|확인 창/조건 재검사·SDK 권한 검사를 소스/실제 AAR에서 확인|비차량 거절 callback/화면 c5/419 통과. AAOS UX·실제 경로/완료 콜백·실차 미검증|
**“12개인터페이스모두실서비스정상” 또는“bridge6개실기기완료”로표시할근거는없다.** 전화·Geocoder는별도instrumentation관찰이며사람사용성승인이아니다.

## 유지·차단·다음 단일담당
23시에는 새 빌드/설치 없이 현재 c5/354 패키지로 주요 지도 버튼 UI를 시험했다. 5패키지 설치 SHA와 QA 전후 표시 텍스트 동일, 주소/우편번호 유지, own claim 반납 확인. 전체 localStorage 비교나 새 JUnit/전체 E2E는 실행하지 않았다. 단일 뒤로 복귀는 미통과이고 명시적 QA 실행으로 복귀했다.
기존 DOCX/PDF version2/13쪽 17시 시각검토 유지·이번 편집 없음. PR Draft 미병합/v0.3.0-preview만 게시/0.4.3 미게시·공모전 미제출. main/easy/address 보존. 독립 QA/감사 ACK·사람 사용성 미확인, 전체 진척률·지난주 근거 없음.
다음 단일 기존 PM: 공식 접수 요건·현재 제출본과 남은 실제 환경 검증 조건을 대조한다. 실제 Pleos/AAOS 연결·완료/UX, 유효 REST 인증·기관/클라우드·실차·독립 QA/사용성은 별도 미검증이다.
