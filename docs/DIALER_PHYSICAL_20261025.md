# 전화 화면 연결 실기기 검증 · 2026-10-25 21시
기존 PM 자체 QA. 독립 QA·감사 승인이 아니다. [비밀값 없는 결과](../build-reports/pm-20261025/dialer-physical.json).

## 실제 수행·증거
현재지시/상시전화승인/원장/배정/QA lock·관련writer·instrumentation·unlocked를먼저확인했다. 기존결과Geocoder통과와c5COLD복원을읽고중복실행하지않았다. 단일ownclaim취득·반납.
- 소스 `ec6992f40405ce696b063a101745bd6331fe402f`, `android/app/src/androidTest/java/kr/co/ansimdonghaeng/DialerBridgeTest.java`; 실제PC격리파일Gitblob `67430684f582163091b4cf019cfa97c06dc972f3`가repo와일치.
- 제품b227 verifyqa앱SHA `c5aad9eecc70bf0cac07450e414c582720582ee8286f0b255af5ff46e69eda4b` 그대로, 앱새빌드/설치없음.
- test-only빌드53초/exit0/45tasks4executed41uptodate. 새테스트824828B/SHA `3544a4450d1c2fe19ea8032c496d25964c04b8d701c2e60363be36c1c622c655`, package `.verifyqa.test`/target `.verifyqa`.
- 이전test5f7과new354 모두 실제apksigner verify성공/인증서 `323cea9877c3cef1cae1692efdbe6638f7355a686181a1991e418cdb1975e08e`동일. manifest/PC·device stagedSHA확인후test만pm install-r Success.
- **21:07:34.103–21:07:37.375KST, DialerBridgeTest JUnit OK1 /2.775초 /ADBexit0**.
- 실제 WebView `VehicleBridge.openDialer`를합성번호로호출. nonblocking Instrumentation.ActivityMonitor에서실제 `ACTION_DIAL/tel` 전달을관찰하고, resolver전화앱패키지가실제화면에표시됨을UIAutomator의패키지존재만으로확인했다. 외부Activity를가짜응답으로대체하지않았다.
- 실제발신/ACTION_CALL/전화앱버튼클릭없음. 연락처·통화기록·전화화면XML/캡처를읽거나수집하지않았다. 관찰monitor를제거하고검증앱으로복귀,localStorage전체키·값이동일함을메모리비교했다.
- 실제marker `ACTION_DIAL_OBSERVED DIALER_PACKAGE_VISIBLE NO_CALL_ACTION`, `DIALER_BRIDGE_OK RETURNED_TO_QA SAVED_STATE_UNCHANGED`.
- 원래releasec09449f8/옛QA2903bc14/옛testc73efa79/verifyqac5의설치SHA전후동일,삭제/초기화/서명강제교체없음. 바뀐것은검증test하나뿐.
비공개IT13 QAroot `AS-Q1-PM-20261025T2103`: old/newtestAPK,build/oldnewcert/testmanifest/package-check/run/JUnit/markers/installedbeforeafter/result. 저장값/연락처/번호원문을공개하지않았다.

## 범위·재현
```text
adb -d shell am instrument -w -r -e class kr.co.ansimdonghaeng.DialerBridgeTest kr.co.ansimdonghaeng.verifyqa.test/androidx.test.runner.AndroidJUnitRunner
```
이는기존비debuggable검증앱의bridge→실제시스템전화화면연결/복귀 검사다. 주요버튼‘연락하기’의사용성·실제발신·기관연결·차량주행제한/AAOS는검증하지않았다. 전화bridge없음/권한거절분기나실제통화품질완료로확장하지않는다.
Geocoder1.348초/test5f7,공식주소16.944초/COLD264ms/test5f7,16시인계DOM9.410초/testbb17은기존별도결과이며새354 testAPK전체E2E성공으로재명명하지않는다.

## 현재 CI·제출·다음 단일담당
자동CI40191642309/소스ec6992f는마지막verify-build진행중,새전체CI미확정. 새Dialer클래스는CI runtime명시적대상에추가하지않았으므로추후전체CI성공도전화bridge에뮬레이터실행성공으로합산금지. 이전228/CI40182818148전체success는유효하며제품b227원본은변경없음.
17시DOCX/PDF version2/13쪽전체시각검토유지,이번문서원본편집없음. PRDraft미병합/게시v0.3.0-preview만/0.4.3미게시·실제제출없음.
다음단일기존PM은401916최종CI로그확인부터진행하고,남은bridge·서비스별실기기/실차/기관환경격차를정리한다. 유효REST키/PleosAAOS실차/기관인증·클라우드/독립QA·사용성·접수요건은별도미확인. 확정분모/지난주근거없어전체진척률·주간비교미산정. 야간Slack추가전송없음/현재대화방결과보고,새agent/예약/유료·공개배포없음.
