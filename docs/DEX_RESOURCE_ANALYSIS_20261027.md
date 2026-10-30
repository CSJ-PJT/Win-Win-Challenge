# release·verifyqa DEX/리소스 차이 분석 — 2026-10-27 01시

기존 PM 자체 정적검수다. 후보 APK를 설치/실행하거나 새 JUnit을 수행하지 않았다. 00시의 미분석 DEX/resources 차이를 실제 디코딩 결과로 좁혔다.

- 후보 APK6a28008a491fb7ece55572cc5c705db88c202acfde12caa98b7336c353e53313 및 현재verifyqa 읽기복사4edaf75caa62c10f7e5f690149725239d602c68ddad428afc787fcc80b68b88c의 전체SHA를 다시 확인했다.
- SDK35 dexdump -d 전체 출력은 각각847551줄/3750클래스다. 프로젝트 namespace는42클래스(내부·합성클래스 포함)이며 실제기능 시험 수가 아니다.
- 입력 파일명·절대 파일위치 표시만 제외하면136줄 차이다. 그중133줄은 opcode/register word·상대위치·해석된 문자열 값이 같은 const-string 참조의 테이블 번호 이동이다. 비교기는 두쪽 해석된 명령 전체가 같은 경우에만 해당 번호/피연산자 차이를 분류했고, 임의로 다른 명령이나 문자열을 제거하지 않았다.
- 남은3줄은 모두 BuildConfig의 정적상수 값이다. 다른 disassembled 클래스/명령 차이는 이 비교 범위에서0이다. MainActivity/Bridge·AddressPickerDialog·NavigationAdapter·CarRestrictionMonitor도 전체 출력 대조 범위에 포함된다.

|BuildConfig 필드|후보 release|verifyqa|
|---|---|---|
|APPLICATION_ID|kr.co.ansimdonghaeng|kr.co.ansimdonghaeng.verifyqa|
|BUILD_TYPE|release|verifyQa|
|VERSION_NAME|0.4.3|0.4.3-verifyqa|

|실제 추출DEX|SHA256|
|---|---|
|후보|1db85ddffe7a8948f9839b985567bc99654b7e6b05c3eec9d49b2d19bebe239e|
|verifyqa|689d3a4a9bce214deaae0360159a6e2c0581dd3b4158e596f67befbe40b75ef4|

전체 DEX 바이트가 같다는 뜻은 아니다. 문자열 풀이 달라지면서 절대주소·참조번호·파일 크기가 달라졌고 상수3개도 다르다. 디코더가 표시한 코드/정적값 범위의 차이 분석이며 모든 binary metadata의 동등성이나 형식적 실행동등성을 증명한 것은 아니다.

## 리소스 판정

SDK35 aapt2 dump resources 출력은 각각412줄(마지막 빈줄 포함)이며 차이는 package name=kr.co.ansimdonghaeng ↔ kr.co.ansimdonghaeng.verifyqa 한 줄이다. 디코딩한 resource ID/타입/값 차이는 찾지 못했다. 원래 resources.arsc 바이트는 다르고, aapt가 출력하지 않는 전역 문자열/메타데이터까지 동일하다고 확대하지 않는다. 앱 label 차이는 [00시 manifest 비교](RELEASE_VERIFYQA_COMPARISON_20261027.md)의 실제 manifest 값이다.

## 재현·보존

먼저 공통위임·dispatch·standing승인·배정·03시 초기 result/00시 최신result·PR6387088890후속을 읽었다. QAclaim·Java/Gradle/Git writer·진행instrumentation 부재 확인 후 PC 정적분석만 수행했다. 마지막 ADB 읽기로5패키지 SHA가 직전 고정값과 같음을 확인했다. 저장 데이터 내용이나 개인화면은 열지 않았다.

첫 dexdump는 한글 PC경로에서 ReadFileToString으로 중단됐다. 새 ASCII TEMP폴더에 동일 APK entry를 추출해 두 전체출력을 끝까지 생성했고 exit0을 확인했다. 원래 추출본/실패138B출력/두 후속dump·분류스크립트/전체133참조목록을 IT13 QAroot/AS-M1-PM-20261027T0103에 보존했다. APK를 다시 빌드/재서명/변형하거나 설치하지 않았다. 이 준비오류는 제품 실행실패가 아니다.

## 실행 판정과 다음 담당

웹assets8/8동일(00시), manifest3표시항목차이(00시), DEX 상수3개·주소/참조번호차이와 resource decoded package이름차이(이번)를 구분한다. 기존verifyqa물리결과를 후보6a28의 물리PASS로 합산하지 않는다. 실제패키지/서명·설치/저장영역·Android환경은 다르며 [23시 서명충돌](RELEASE_INSTALL_PREFLIGHT_20261026.md)은 여전히 차단이다.

다음 단일 기존 PM은 현재verifyqa에서 번호오류5회차단·재발급후양측확인복구의 한정 실기기 시나리오를 점유·저장보존 조건 하에 검증한다. 이 시험도 후보release물리runtime이나 독립QA로 확대하지 않는다. 별도물리환경의 후보검증·독립QA/사람사용성·실차AAOS/Pleos·유효REST/기관/클라우드·심사접근·실제제출은 남는다.

PRDraft/미병합·CI40252472387success/publishskipped·v0.3.0-preview만게시 상태는 직전동일, 새CI/빌드/설치/UI/JUnit없음. 공식문서v3·고정후보35/옛41·원본앱데이터 보존. 야간Slack미발송·전송기/토큰읽기없음,18시기존게시만readonly확인/폰push미확인. 새agent/GPT/예약/수신자·권한/비용·공개/제출없음. 전체%미산정.

[기계판독 요약](../build-reports/pm-20261027/dex-resource-analysis.json).
