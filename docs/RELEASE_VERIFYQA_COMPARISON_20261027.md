> 01시 후속: 미분석이던DEX/resources를전체디코딩대조했습니다. 파일위치/동일문자열참조번호차이를분류한뒤남은DEX차이는BuildConfig정적상수3개,resource출력차이는package이름1곳입니다. [실제분석·정규화범위](DEX_RESOURCE_ANALYSIS_20261027.md). 후보물리PASS로확대하지않으며아래00시당시판정은보존합니다.

# 최종 후보·현재 검증 앱의 바이트 대조 — 2026-10-27 00시

기존 PM 자체 정적검수다. 후보를 폰에 설치/실행하거나 새 JUnit을 수행하지 않았다. 기존 시험을 같은 수의 새 시험으로 합산하지 않는다.

## 직접 비교한 원본

|항목|release 후보35|현재 설치 verifyqa|
|---|---|---|
|APK SHA256|6a28008a491fb7ece55572cc5c705db88c202acfde12caa98b7336c353e53313|4edaf75caa62c10f7e5f690149725239d602c68ddad428afc787fcc80b68b88c|
|패키지|kr.co.ansimdonghaeng|kr.co.ansimdonghaeng.verifyqa|
|versionCode/name|9/0.4.3|9/0.4.3-verifyqa|
|앱 label|안심동행 플랫폼|안심동행 검증|

00:05:53 KST 비교. 후보는 고정 폴더에서 새 SHA를 계산했다. 현재 .verifyqa base.apk를 ADB로 PC에 읽기 복사하고 기기 SHA·복사 SHA4edaf75c 일치를 확인했다. 두 APK ZIP entry의 비압축 바이트를 SHA256으로 비교했다. 각각60개 entry,57개 동일,양측 전용 entry0이다. 차이는 classes.dex·AndroidManifest.xml·resources.arsc 3개다. APK signing block은 ZIP entry 밖이므로 이57/60에 포함되지 않는다. **57/60은 제품진척률이나 기능동등성 비율이 아니다.**

## assets 전체8개 동일

|파일|SHA256|동일|
|---|---|---|
|assets/address.js|49c8b523f9038ed2d8dbe6509d79b975f930b78b1ef94bd1fb0a8c0905280800|true|
|assets/app.js|6067ad0e9d26e2b426bf5dc42c20eb87abfc82ff325defd7f42abc3b4054541e|true|
|assets/config.js|d2adea2543951444bd6bf8a1624c26ff5f717050938254fe7594b2868fdeac87|true|
|assets/core.js|f1be0a0ed80a4888ed93e3563199231434e4870728587ba461c52c33abd88b65|true|
|assets/index.html|ebb63dfef4c80fcc46e07d274483eb8816a7f1d4512214b63582d0a376dfed95|true|
|assets/postcode.html|60d789933a252a47d6c4b7b2c8188e097b8615e18b87882215618ed1a1680d7f|true|
|assets/style.css|8d25b38d9d649c153fd2f772f406024300a0450b62f73687e397975cfd52efa2|true|
|assets/ui.js|8c924294aea2abd64bd3a8e14cfbe658375bde8e6e8917aba13e647a0b735851|true|

주소·인계·쉬운 알림 등 웹 로직과 스타일의 파일 바이트가 같다는 근거다. Android 패키지/서명·실행환경·WebView/권한/bridge 런타임까지 같다고 입증하지 않는다. 기존 verifyqa 실기기 결과는 해당 APK/환경의 결과로 유지한다.

## manifest 실제 디코딩 비교

SDK35 aapt2 xmltree의59줄 전체에서 차이는 versionName·package·application label 3줄이었다. versionCode9, minSdk28/target35, INTERNET·NAVI_ROUTE_SEARCH 선언, optional automotive/touchscreen/android.car, MainActivity/configChanges/softInput·launcher, Pleos metadata는 같았다. 첫 텍스트가 PowerShell 기본 문자해석으로 한글이 깨져 별도 UTF8 출력으로 재생성했다. 올바른 label은 위 표와 같으며 바이너리/제품 오류가 아니다. 보존된 초기 출력과 최종 UTF8 출력을 구분한다.

classes.dex와 resources.arsc는 실제 해시가 다르다. 이번에 그 내부 원인을 분석하지 않았으므로 BuildConfig/이름만 달라서 로직이 완전히 같다고 단정하지 않는다.

## 별도로 남는 release 검증

|항목|현재 판정·완료에 필요한 근거|
|---|---|
|설치·서명/패키지|[23시 사전검수](RELEASE_INSTALL_PREFLIGHT_20261026.md): 기존release c094/cert74f3 vs 후보6a28/certc421. 동일패키지/버전·다른서명으로 기존앱 보존 업데이트 차단. 재서명/리패키징은 후보바이트 변경|
|native 로직·리소스|DEX/resources 차이 원인 정적 대조 필요. 웹8파일 동일만으로 bridge동등성 판정 불가|
|후보 물리 runtime|충돌없는 별도 호환물리환경에서 동일6a28의 launch·공식주소·저장복원·출발/인계·bridge 실제로그/화면 필요. 현재 가용성 미확인|
|독립판정·실차/실서비스|PM자체 QA·CI Android15·물리 Android16 verifyqa와 구분. 독립QA/사람사용성·실제Pleos/AAOS·유효REST/기관/클라우드 미확인 유지|

공통 위임/배정/상시승인·03시 초기result·23시 최신result·PR6387088890후속부터 읽었다. QAclaim·Java/Gradle/Git writer·진행instrumentation 부재 확인 후 읽기 수행. 5패키지SHA는 직전 고정값과 동일하다. 데이터 내용을 읽거나 전후 저장값 동등성 시험한 것은 아니다. 기기claim/UI/설치·초기화/삭제·키조회/서명변경·새빌드/CI없음. 공식 DOCX/PDFv3·후보35/옛41·원래 앱데이터 보존. PRDraft/미병합·최신CI40252472387success/publishskipped·v0.3.0-preview만게시 상태는 직전동일.

다음 단일 기존 PM: classes.dex/resources.arsc 차이 원인을 정적으로 대조해 variant 상수·이름 차이와 native bridge 로직 차이를 구분한다. 새APK나서명우회로 물리게이트를 덮지 않는다. 야간Slack 미발송·전송기/토큰 읽기없음, 기존18시게시만읽기확인·폰push미확인. 공개/실제제출·권한·비용·새agent/예약/수신자없음.

[기계판독 결과](../build-reports/pm-20261027/release-verifyqa-comparison.json). IT13 QAroot/AS-M1-PM-20261027T0004에 전체entry해시·비교JSON·원본/UTF8manifest·badging·읽기복사APK를 보존한다.
