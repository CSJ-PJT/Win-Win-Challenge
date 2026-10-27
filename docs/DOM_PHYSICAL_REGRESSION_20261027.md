# 새 QA 양측 인계·쉬운 알림 DOM 회귀 — 2026-10-27 10시 KST

기존 PM 자체QA이며 실기기 Android16의 verifyqa 앱bd79075fa5140cc8064c41676f5b56ca479ff2caa8da858baf8b1e06db7fa996 / 기존시험229eefc4b328c310cdf5f8fca63af65485ee40cbd80263de2a11688228c56d4f 조합입니다. 제품source899a5a1,최신CI40402218901 성공 유지. 기존release/.qa/.qa.test와두verifyqa패키지총5설치SHA실행전후동일/새빌드·설치·CI요청0.

09:58:23–40 DomFlowTest 단1회 JUnit OK(1 test),9.707초. 실제Android WebView 내 DOM click/input 방식으로 합성유치원방문·수동주소입력→출발→도착→시설준비→6자리연결번호→인계자확인→시설인수→보호자완료→쉬운고령자방문·동의→도착알림→시설ACK를확인했습니다.09:58:30.478 PRIMARY_HANDOFF_OK /09:58:33.364 EASY_ARRIVAL_ACK_OK. 사람터치전체사용성/독립QA승인아닙니다. 공식picker는09시별도시험이며이번DOM수동주소와합산하지않습니다.

시험직후후속화면검사시QA패키지가전면에없어 ACK_NOT_VISIBLE 원본result.json false를보존했습니다. QA패키지가아닌초기스냅샷은QA판정/공유근거에서제외하고다른앱조작은수행하지않았습니다. 후속부터스크린샷전에QA패키지존재를검사했습니다.

09:59:36–45 재점유후JUnit재실행없이verifyqa만force-stop/PID없음→COLD launch(Activity256ms). 첫관찰미확정,둘째실제XML·PNG에'도착소식을남겼어요'·'담당자가확인했어요'복원확인. cold-followup.json true,당일cold-1-private.png직접검토.256ms는Activity시간이며웹준비TTI아닙니다. 저장상태는마지막쉬운고령자ACK이며시험중확인한유치원인계완료와마지막방문을구분합니다. 전체localStorage동일·전체스크립트PASS주장하지않습니다.

09:59:45.3624770본인claim반납/존재false·activeinstrumentation없음. QA합성방문상태만변경,원래앱·데이터삭제/초기화/서명강제교체·실전화/실기관전송0. 원본main/easy/address미커밋보존.

IT13 QAroot/AS-Q1-PM-20261027T0957에원본JUnit/표식/false·후속true/XML·privatePNG/5해시/claim보존. [원장](../build-reports/pm-20261027/dom-physical-regression.json). release53ca 자체물리실행·독립QA·사람사용성·유효REST/Pleos/AAOS·기관·심사접근·실제제출은미확인. 고정후보35/6a28과새CIrelease53ca/폰bd분리. 공식DOCX/PDF이번재열람·편집없음/게시v0.3.0-preview만유지/PR2PrivateDraft미병합.

다음 단일 기존 PM: 소스 ZIP의 Android 주소 자산 준비 경로를 점검해, 수동 복사 없이 8개 자산을 포함하도록 재현성을 보완합니다.08시미설치6자산APK와보완8자산APK를근거로중복설치·불필요한빌드없이원인을좁힙니다.
