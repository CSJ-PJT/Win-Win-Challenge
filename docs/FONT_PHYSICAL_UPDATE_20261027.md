# 수정 글씨 배율 실기기 검증 — 2026-10-27 08시 KST

기존 PM이 소스899a5a1/CI40402218901의 웹 파일을 기존 지속서명 verifyqa 경로로 패키징해 SM-F936N Android16에서 확인했습니다. 새 설치 앱은 **bd79075fa5140cc8064c41676f5b56ca479ff2caa8da858baf8b1e06db7fa996**,5170904B,기존과동일cert323cea9877c3cef1cae1692efdbe6638f7355a686181a1991e418cdb1975e08e입니다. package kr.co.ansimdonghaeng.verifyqa/namespace kr.co.ansimdonghaeng,version9입니다. 기존 test229는 업데이트하지 않았습니다.

## 준비·설치

초기빌드는성공했으나CI대조에서주소자산 address.js/postcode.html이빠진6자산APK임을발견했습니다. 초기SHA97663d35 APK는미설치로보존했습니다. 격리workspace의assets에검증된CI APK8개자산을바이트동일하게준비한후필요한후속패키징1회를수행했습니다. 총build2회이며첫불완전산출물을통과로합산하지않습니다. 소스ZIP의Android자산준비재현성은추적할항목입니다.

aapt의한글경로열기실패도보존했고바이트동일ASCII경로후속이우선입니다. 기존/새verifyqa 전체apksigner exit0·cert동일/패키지대조·CIrelease와assets8/8동일을확인한뒤ASCII staging→adb push→기기SHA대조→pm install -r Success→설치경로SHA재대조했습니다(08:08:12–08:08:27). 원래release/.qa/.qa.test는건드리지않았습니다. 저장된담당자확인표시가업데이트후에도존재했습니다. 전체localStorage동일검사는아닙니다.

## 실제 화면

08:08:45–08:09:35에일반설정100%→200%저장,확인문구유지,가로스크롤쉬운화면탭[553,402][850,596],세로스크롤하단버튼[42,1410][863,1801]전체노출을확인했습니다. 새방문버튼은누르지않았습니다. force-stop→PID없음→COLD Activity346ms후확인표시복원·설정200%유지를확인했습니다.346ms는웹화면준비시간측정이아닙니다.

100%복귀첫자동탭은TAP_100%_0으로끝났습니다. 당시설정항목이sticky저장footer부근에있었고추가스크롤로선택항목을[47,1714][855,1885]에노출시켜선택·저장을완료했습니다(08:10:45–08:11:10). 원본false/스크린샷/후속true를모두보존합니다. 최종판정은확인한화면·스크롤·설정복원범위이며전체자동스크립트PASS가아닙니다.

privatePNG7장을직접검토했습니다. 확대된시설명/버튼은여러줄로표시됩니다. 전체사용성·모든개별글자2배·스크린리더접근성승인으로확대하지않습니다. CSSroot32px가포함된APK임은CI동일assets로확인했고실기기JS계측은하지않았습니다.

## 보존·남은 범위

기존3패키지release/.qa/.qa.test와verifyqa.test 해시는동일하고verifyqa 앱만4ed→bd79075f로정상업데이트됐습니다. 본인claim반납후lock/activeinstrumentation없음을확인했습니다. 원본삭제·초기화·서명강제교체·실기관전송·새방문/알림·JUnit·새CI요청0입니다.

[전체원장JSON](../build-reports/pm-20261027/font-physical-update.json). IT13 QAroot/AS-Q1-PM-20261027T0802에불완전미설치APK/보완APK/빌드·설치·서명·원본false/후속결과/XMLJSON/privatePNG/설치전후해시/반납을보존합니다.

이verifyqa결과는release53ca 자체물리실행이아닙니다. 새CIrelease53ca·고정제출후보35/6a28·설치verifyqa bd를분리합니다. 후보release서명충돌·독립QA·사람사용성·실차/기관·심사접근·실제제출은미확인입니다. 공식DOCX/PDFv3이번재열람/편집없음. Slack허용시간전이라미발송/폰push미확인입니다.

다음 단일 기존 PM: 새 verifyqa bd79075f와 기존 test229 조합에서 공식 주소 picker·저장·콜드 복원을 한정 실기기 검증합니다.
