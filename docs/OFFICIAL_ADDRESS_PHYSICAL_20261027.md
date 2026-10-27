# 새 QA 공식 주소·COLD 복원 — 2026-10-27 09시 KST

기존 PM 자체QA입니다. 앱 bd79075fa5140cc8064c41676f5b56ca479ff2caa8da858baf8b1e06db7fa996 / 시험229eefc4b328c310cdf5f8fca63af65485ee40cbd80263de2a11688228c56d4f, source899a5a1, CI40402218901 성공 유지. 두 설치 패키지와 기존release/.qa/.qa.test의 SHA를 실행 전후 대조했고 변경0입니다. 새빌드·설치·CI요청0.

## 실행과 판정

09:05:32–09:05:52 실제 LiveAddressTest 한 번, JUnit OK(1 test)/17.693초. 인계자→합성 유치원 방문→공식picker에서 세종대로110 검색·서울 중구 세종대로110/04524 선택·앱 복귀·저장·다시 열기까지 확인했습니다. 실제09:05 로그 OFFICIAL_TEST_VISIT_READY→ADDRESS_PICKER_READY→ADDRESS_SELECTED→LIVE_POSTCODE_ROUNDTRIP_OK, 당일스크린샷01/03 직접검토. 기존test229로 새앱bd를 시험했으며 옛앱결과와 합산하지 않습니다.

JUnit 후 PC 증거회수에서 한글경로 adb pull 오류가 발생해 result.json은 false로 보존했습니다. ASCII C:/Windows/Temp/asdh-address09에8파일 회수 후 원본결과폴더로 복사했습니다. failure.png는2026-10-26 09:59의 잔존파일로 이번실패 증거에서 제외합니다. 나머지00–04/last-screen/window는10/27 09:05 실제파일입니다.

09:06:28–35 별도 force-stop/PID없음→COLD 실행(Activity322ms)을 수행했으나 PC스크립트의 UTF8무BOM 한글정규식 오류로 cold-followup.json false. 원본을 보존하고 BOM을 명시한 후 재시험/재종료 없이 같은 실제화면을 다시 관찰했습니다.09:07:01–08 cold-observation.json true, XML 주소와04524 복원·당일coldPNG 주소표시 직접검토.322ms는Activity시간이며 웹준비TTI가 아닙니다. 전체 저장값 동등성·전체 자동스크립트PASS는 주장하지 않습니다.

공식picker 통과 중 stat.tiara.kakao.com 추적요청 CORS경고가3건 있습니다. 주소선택/저장을 차단하지 않았으며 네트워크오류없음으로 보고하지 않습니다. 유효Kakao REST검색·실기관·Pleos/AAOS와별개입니다.

## 보존·인계

본인claim09:07:08반납/존재false, activeinstrumentation없음. 원래앱/데이터삭제·초기화·서명강제교체0. 합성방문을 제품컨트롤로 새로선택하여 QA방문상태는변경됐습니다. 실제전화/시설전송0. 원본main/easy/address·미커밋 보존. privatePNG는Git공개첨부하지않습니다.

IT13 QAroot/AS-Q1-PM-20261027T0904에JUnit/시간표식/해시/원본false2개/후속true/스크립트/XML/PNG/반납 보존. [기계원장](../build-reports/pm-20261027/official-address-physical.json).

release53ca 자체물리실행·독립QA·사람사용성·심사접근·실제제출은 미완료입니다. 고정후보35/6a28과분리/공식DOCX·PDF이번재열람편집없음. PrivateDraft/미병합·v0.3.0-preview만게시 유지.

다음 단일 기존 PM: 새 verifyqa bd/test229에서 출발→도착→연결번호→양측인계→보호자·쉬운알림 전체 DOM 흐름 단일 회귀.
