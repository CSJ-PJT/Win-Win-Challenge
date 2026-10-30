> 2026-10-25 21시: 기존c5앱/새354test에서 실제전화bridge ACTION_DIAL→전화앱패키지화면→QA복귀/저장상태동일 JUnit1/2.775초통과. 발신/전화앱버튼클릭/연락처·기록·전화화면캡처수집없음. [전화bridge실기기근거](DIALER_PHYSICAL_20261025.md). 새test소스ec6992f/CI40191642309 마지막verify-build진행중,CI전화runtime미포함. 아래18시resolver만확인은당시이력.

> 2026-10-25 19시: Geocoder실제bridge 호출이 c5검증앱/신규5f7test에서 JUnit1/1(1.348초) 통과. isPresent=true/공개장소결과1개/유한좌표/409ms/저장상태동일. [Geocoder실기기근거](GEOCODER_PHYSICAL_20261025.md). 새test소스2284016/CI40182818148 마지막verify-build진행중, 기존b227전체CI/공식주소·DOM과분리. 아래18시Geocoder미실행은그시점이력.

# 외부 연동 실제 호출·가용성 점검 · 2026-10-25 18시
기존 안심동행 PM이 임시 자체 점검을 수행했다. **독립 AS-A1 감사 승인이 아니다.** 확인 시각17:58–17:59 KST, 소스b227ca2/조회HEAD7ba3734. [비밀값 없는 실제 응답](../build-reports/pm-20261025/external-api-check.json).

## 실제 수행
최신 PR2/지시댓글6387088890과후속댓글, IT13 위임·재연결·상시휴대전화승인·배정원장, 최근16시result를 읽었다. QA lock없음/관련Java·Node·Gradle writer없음. 처음 `dumpsys activity instrumentation`은 지원되지 않아 실패했으며 그출력을 점유없음으로 취급하지 않았다. 올바른 `dumpsys activity processes`에서 ActiveInstrumentation/test 일치항목이 없음을 재조회했다. 이번은 읽기전용ADB뿐이며 화면/설치/앱상태를 변경하지 않았다.

원격의 PM 소유 격리 workspace `AnsimBuildTools/checks/live-save-2026102515`의 server.js와web/core.js Gitblob이 현재 소스와 일치함을 먼저 확인했다. 별도임시파일/임의 loopback포트로 실제 서버를 기동하고 아래8요청을 실제 전송, 토큰원문을 저장/출력하지 않고 종료했다. mapFetch fixture 주입없음. 기존사용자저장소/앱 데이터는 읽거나초기화하지 않았다.
|요청|실제응답|
|---|---|
|health/bootstrap/state|각200|
|인증된places, 실제 시험환경에 REST키없음|503 MAP_NOT_CONFIGURED|
|미인증places|401 UNAUTHORIZED|
|한글자query|400 QUERY|
|events JSON null|400 JSON_OBJECT|
|reset JSON null|400 JSON_OBJECT|
이는 **8개계약요청**이며 새8개기능완료나Node112추가통과로 합산하지 않는다. reset은잘못된본문거절만검사, 기존앱리셋없음. 시험프로세스종료/임시합성파일없음 확인.

공식 Kakao endpoint에 키없이 서울시청이라는 공개합성검색어로 한 번 GET: **401 AccessDeniedError/35ms**. DNS/TLS/HTTP인증오류응답 수신을 확인한 것으로 인증된장소검색성공이나카카오서비스전체가용성 판정이 아니다. 시험프로세스/User/Machine의 정확한환경변수명 KAKAO_REST_API_KEY는 모두없음. 다른파일·다른이름의키/계정전체부재를뜻하지 않는다. [공식 REST 인증 명세](https://developers.kakao.com/docs/ko/local/dev-guide)를 확인했다.

## 외부 서비스별 범위
|연동|현재 소스/실행 근거|남은 확인|
|---|---|---|
|공식우편번호SDK|AddressPickerDialog/web/postcode; CI401676와16시verifyqa공식주소 JUnit|키워드REST와다른API이며좌표검색성공으로확장금지|
|Kakao Local REST|server.js /api/places; 실제키없음503/외부무인증401|유효키의안전한주입·정상200/결과/외부실패응답|
|Android Geocoder|MainActivity.searchAddress: isPresent→getFromLocationName(query,5),오류UIcallback|이번service list의geocode문자열검색무결과는isPresent=false증거가아님. 실제isPresent/한정검색결과아직미실행|
|전화bridge|openDialer는ACTION_DIAL/예외callback; 실제resolve-activity가Samsung전화앱반환|resolver만확인. 앱bridge UI호출·주행제한미시험. 전화실행/실제발신없음|
|외부지도|openMap https허용목록과ACTION_VIEW; 기존b227CI MAP_INTENT_OPENED|실차경로·지도경로완료미검증, 이번추가실행없음|
|Pleos NaviHelper|NavigationAdapter.initialize성공콜백·requestRoute/완료콜백을구분한소스|현재USB단말 automotive feature=false/Pleos패키지0. 실제AAOS서비스/경로콜백·실차미검증|
|차량UX제한|CarRestrictionMonitor 및manifest android.car optional|실차속도/기어·UX변경수신미검증|
|기관인증/클라우드|server는loopbackHost/Origin제한·로컬역할토큰·파일저장;bootstrap은기관인증아님|실기관계정·권한·원격DB/동기화검증없음. 로컬200을클라우드성공으로표시하지않음|

## 상태·다음 단일 담당
제품소스/CI는직전과동일: b227/CI40167658701 success, 새빌드·폰기능시험없음. 현재검증앱c5aad9ee/테스트bb17d224의16시주소16.281초/DOM9.410초는재조회한기존결과다. [기존제출DOCX/PDF version2](SUBMISSION_REVIEW_20261025.md)는17시갱신/13쪽시각검토완료, 이번재생성없음. API검증표의오래된“문서v1갱신미수행”은현재상태가아니다.
PRDraft미병합/v0.3.0-preview게시유지/0.4.3미게시·공모전미제출. 전체진척률/주간비교미산정. 기존PM이 다음으로 실제 Geocoder 한정호출을 검증할 수 있는 instrumentation을 검토하고 기존검증앱/데이터보존조건을 유지한다. REST유효키/실차환경확보와독립QA/사용성/접수요건은별도. 새agent/예약/비용/권한확대없음.
