# 최종 release 후보 설치 사전검수 — 2026-10-26 23시

기존 PM의 읽기 전용 검수다. **현재 단말의 기존 release 앱을 보존하는 동일 패키지 업데이트는 서명 불일치로 차단** 판정했다. 실제 설치를 시도하거나 실패코드를 받은 것은 아니며, 후보 실행/물리 시험 통과가 아니다.

|직접 검사|설치 release|후보35 release|
|---|---|---|
|패키지|kr.co.ansimdonghaeng|kr.co.ansimdonghaeng|
|versionCode / name|9 / 0.4.3|9 / 0.4.3|
|바이트|5170048|5170856|
|SHA256|c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54|6a28008a491fb7ece55572cc5c705db88c202acfde12caa98b7336c353e53313|
|인증서 SHA256|74f3b4db72749aa904fd281ca45c531b271bd8894a65e2117a6a27e4333dd136|c4210a55903d2ee9a64665b13076f56c50fa7a7a4dc22eb08b6f8e470cf2785c|
|전체 apksigner verify|exit0 / v2 true / signer1|exit0 / v2 true / signer1|
|v3 / v3.1|false / false|false / false|

현재 설치 base.apk를 ADB로 PC에 읽기 복사하고 기기 sha256sum과 복사본 Get-FileHash 일치를 확인했다. 후보도 원래 고정 경로에서 새 SHA 측정 후 전체 apksigner와 aapt2 badging을 실행했다. 두 파일 모두 서명은 유효하지만 서로 다른 서명이다. 검사한 두 APK에 지원되는 v3/v3.1 키 회전 계보도 없어, 같은 버전 번호라는 이유로 업데이트하지 않는다. 검증 앱 .verifyqa는 다른 패키지로, 그 성공으로 release의 서명 충돌이나 물리 실행을 해결한 것으로 볼 수 없다.

상시 승인·공통 원장·배정·03시 초기실패/22시 result·PR 댓글과 후속부터 읽었다. AS_Q1_DEVICE.lock 없음·Java/Gradle/Git writer 매칭 없음·adb dumpsys 진행 instrumentation 매칭 없음 확인 후 읽기만 수행했다. 사용자 화면/잠금/주소·연락처·통화기록·앱 저장 데이터는 열지 않았다. 원래 release/.qa/.qa.test/verifyqa/verifyqa.test 5개 설치 SHA를 조회해 직전 고정값과 동일함을 확인했다. 이번 앱 데이터의 전후 동등성 시험은 아니다.

첫 준비에서 jdk 경로 추정이 실제 하위폴더와 달랐고, adb pull의 진행 stderr가 PowerShell Stop으로 처리됐다. 복사 자체는 완료됐으며 전체 바이트/SHA를 확인 후 기존 jdk17 하위 실제 경로로 후속 검증했다. 원본 APK나 폰 앱의 실패가 아니며 준비 기록과 원본 스크립트를 보존한다. 후속 전체 서명·badging 스크립트는 exit0. 중복 설치·키 읽기·키 생성·서명 재작성은 없다.

## 실행 경로 판정

- 현재 물리 단말: 기존 같은 패키지/다른 인증서 앱을 삭제·초기화·강제 교체하지 않으므로 후보 동일 바이트 설치를 수행하지 않는다.
- 별도 물리 시험 환경: 기존 앱 충돌이 없는 환경에서만 후보 SHA6a28 그대로 검사할 수 있다. 현재 별도 단말의 가용성을 확인한 것은 아니며, 사용자에게 재연결/시간 재승인을 반복 요구하지 않는다.
- 재패키징·재서명·새 verifyqa 빌드: 후보 바이트가 달라지므로 원래 후보의 물리 PASS 근거로 사용하지 않는다. 다른 Android 사용자/업무 프로필도 전역 패키지 서명 충돌의 해결책으로 간주하지 않는다.
- CI Android15 release 성공은 기존 별도 결과다. 이번 새 설치·JUnit·물리 기능 PASS는0이며 최종 release 물리 검증은 미완료다.

다음 단일 기존 PM: 후보와 현재 verifyqa의 manifest·assets 차이를 실제 바이트로 대조해 검증 동등성 범위와 release 전용 항목을 확정한다. 별도 물리 환경 필요성은 남기되 기존 앱 보존 조건을 낮추지 않는다.

현재 PR Draft/미병합·CI40252472387 success/publish skipped·v0.3.0-preview만 게시 상태는 직전 대비 같다. 공식 문서v3·후보35·옛후보41은 유지, 공개 배포·실제 제출·계정 초대·새 비용/예약/agent 없음. 야간 Slack 새전송/전송기/토큰 읽기 없음; 기존18시 게시만 읽기 확인, 폰push 미확인.

[기계 판독 결과](../build-reports/pm-20261026/release-install-preflight.json). IT13 QAroot/AS-M1-PM-20261026T2301에 원본 signature/badging/installed-hashes·복사 APK를 보존하고 binary는 GitHub에 새 업로드하지 않는다.
