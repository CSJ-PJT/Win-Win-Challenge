# API·bridge 근거 표 / 최신 CI · 2026-10-25 22시
기존 PM이 원본3job로그와실제download바이트를조회했다. 배정/전달과시험통과를구분하며독립QA·감사승인으로표시하지않는다. [CI·APK 해시](../build-reports/pm-20261025/api-matrix-ci-final.json).

## 현재 기준
소스ec6992f40405ce696b063a101745bd6331fe402f / [CI40191642309](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40191642309) **21:06:00–21:16:32 KST 전체success**, verify121163688849/live121164477592/native121164477618성공,publishskipped. 직전진행중은종료됐다. Node112/실패0, PC·HTTP실제공식주소·저장/reload/지도,통신중저장회귀,Android15release공식1(64.565초)/APK7/DOM1(17.390초),5exit모두0과3marker직접확인.
GeocoderBridgeTest·DialerBridgeTest는컴파일되지만이CI의실행대상이아니다. 물리Geocoder1.348초/test5f7와전화2.775초/test354를이CI에추가합산하지않는다.

실제buildZIP12598232815/5624486B/SHA768a0a3f3116c3618e24956d81aa1aaf702ae842184dadd36165a629aa1828b2, nativeZIP12597814345/1268422B/SHAcf7d964c7a39465fe70665366fc79226a5dbdcf85b574bee4440c97d08652657을download대조.
|이번CI산출물|바이트|SHA256|
|---|---:|---|
|release|5170796|e7d2ad2d81e3d824ff180889990083be9adebc4c63d0ffc61dd07dbb4ef96435|
|QA|5170820|0f9ef87be7dcf8afefc44f1e809249c1cce4a8baf2ebc6dcb665d8ec570c975e|
|QA test|824820|65ef9e28a646ba5b6565427b6341d5a7136bd688439cfca206876120156aa5ba|
실제3APK bytes/SHA 및v2인증서ee0c203da86f091d85f0091b8ee0545d9fc98450b58d9d3bf46800232536383c를manifest와대조했다. 이검토에서별도전체암호학apksigner재실행은없음. 실제release/QA8assets와옛b227CI8assets동일. CI서명은기존지속검증키323cea98와다르므로현재c5앱의업데이트바이너리로사용하지않았다. 아티팩트다운로드와공개릴리스는별개. 이번CI APK설치/공개게시없음.

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
|openMap|현재CI Android15 MAP_INTENT_OPENED/APK실제조작|c5단말에서현재저장주소→외부지도실제화면·복귀는미검증|
|openDialer|c5/354물리ACTION_DIAL→전화패키지화면→QA복귀2.775초/저장상태유지|실제발신미수행·주요연락버튼사용성/AAOS제한별도|
|checkNavigation|실제NaviHelper연결어댑터소스·CI컴파일|Pleos서비스연결콜백실환경미검증|
|requestSampleRoute|사용자확인·정차guard/SDK호출소스·CI컴파일|실제Pleos경로응답·완료콜백/실차미검증|
**“12개인터페이스모두실서비스정상” 또는“bridge6개실기기완료”로표시할근거는없다.** 전화·Geocoder는별도instrumentation관찰이며사람사용성승인이아니다.

## 유지·차단·다음 단일담당
이번은근거수집/대조작업,신규앱·test빌드/설치/폰UI시험없음. IT13최신result.json을직접읽음: c5앱/test354의21시전화시험통과유지. claim/관련writer·instrumentation일치항목없음,기기화면조작없음. AS-Q1실행은PM자체겸임,전담독립QA/감사ACK는미확인.
기존DOCX/PDFversion2/13쪽17시시각검토유지·이번원본재편집없음. PRDraft미병합/v0.3.0-preview게시만/0.4.3미게시·공모전미제출. main/easy/address원본보존. 지난주비교자료·전체진척률분모없음.
다음단일기존PM: 현재c5의저장주소주요버튼을통한지도열기/복귀를한정확인해남은물리bridge근거격차를줄인다. 새빌드없이가능한UI를우선하고,실차·기관환경/유효REST키/독립QA·사용성·접수요건은별도상태로유지한다. 야간Slack전송없음,대화방결과보고. 새agent/예약/유료·공개배포없음.
