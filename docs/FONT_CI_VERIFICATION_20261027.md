# 글씨 배율 수정 CI·산출물 검수 — 2026-10-27 07시 KST

소스 `899a5a16e747f14cddc92c9805971e5cd4422380`의 [CI40402218901](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40402218901)는06:11:20–06:21:46 KST에 verify-build/live-address/native-smoke 성공, publish skipped로 끝났습니다. 기존 PM이 각 job 원본 로그와 다운로드한3개 artifact ZIP을 읽었습니다. 이번에는 재빌드·재실행을 요청하지 않았습니다.

## 실제 검증 범위

- Node112/112·실패0. 별도 Chromium 글씨 검사:360/412/768 CSS-px 화면폭×100/125/150/200%의12조합에서 root16/20/24/32px,저장 후 재실행 복원,문서 가로넘침 없음 확인. 각 폭의 역할 왕복·100%복귀도 test 성공에 포함됩니다.12조합과Node112를 합산하지 않습니다.
-200% PNG3장을 직접 검토했습니다.360px 안내 제목의 마지막 ‘요’는 단독 줄로 넘어갑니다. 문서 가로넘침 검사가 통과한 것이 사람 가독성·모든 화면/개별문자2배·접근성 전체 승인이라는 의미는 아닙니다.
- PC launcher/HTTP 공식 주소 결과 선택·저장·복원·지도 표시/직접파일 안내7개,networkFailures0입니다. 유효키 REST200 검증은 아닙니다.
- Android15 에뮬레이터 release의 공식주소 JUnit1은76.907초,DOM JUnit1은19.526초에 각각 `OK (1 test)`입니다. APK 실제UI7개 및 instrument/address/flow/dom_process/dom_result exit표식5개0을 함께 확인했습니다. 물리Android16 결과와 합산하지 않습니다.

## 바이트·서명·현재 APK

3개 ZIP의 SHA256은 GitHub artifact digest와 전부 같고 ZIP CRC 오류0입니다. source-sha는899a5a1이며 source ZIP의style.css와 release APK assets/style.css가 바이트동일,root200=32px를 확인했습니다. 정확한 전체 해시는 [결과 JSON](../build-reports/pm-20261027/font-ci-verification.json)을 따릅니다.

| 파일 | SHA256 | 바이트 |
| --- | --- | ---: |
| 새 release APK |53ca596c74675961e426e53ce8db47835b6fcc4129b38b78330d3aae3a74dd2b|5170860|
| 새 deviceQa APK |108f1e213f99f1e3d2c86f22762f27c00d8e8e479c9c03da1bf5424d5a60330c|5170884|
| 새 deviceQa test |eb4ed251f2a29c0f6913d12e2c2a702bafac12d66807d4e94a460b6c4c6f4efc|828960|
| 새 source ZIP |9ae59db5fdfc8ed20943589cccc857771474ce9d75a148d1129e35f0aa46d18a|425709|
| 새 PC ZIP |bc5ed4ff85a5e12e020918c7e80df141e4ce9278f48550dfdea9c1b2f8db9069|28876|

새 release 전체 apksigner 검증exit0/v2true/v3·v3.1false/signers1,인증서SHA256 e5fb2d410035c021f8edb6297e1aea1ca715c253c985e78f9c21f85cc6d70689입니다. 최초JAVA_HOME 상위폴더 지정 실패는 보존했고 실제bin/java.exe의 JDK를 사용한 후속 결과가 우선입니다. CI manifest의 package는release kr.co.ansimdonghaeng,QA .qa,test .qa.test→target .qa입니다. 새 QA와 지속서명verifyqa는 다른 패키지/서명 경로입니다.

새 인증서는 기존 설치release c094/cert74f3와 다릅니다. 기존앱을 보존하는 교체 설치를 시도하지 않았습니다. 기존5개 설치SHA가06시와 같고 기기claim/진행instrumentation이 없음을 확인했습니다. 설치verifyqa4ed에는수정미포함입니다. 기존고정후보35/6a28·원본ZIP은보존하며 새CI 산출물은 검증됐으나 제출후보로 지정하거나 공식문서·게시APK를 교체하지 않았습니다.

IT13 Desktop/Task/Win-Win-Challenge-QA-20261024/AS-M1-PM-20261027T0655에3ZIP/추출본·archive-verification·전체서명실패/후속·설치해시·result/verification을 보존했습니다. 공식DOCX/PDFv3이번재열람/편집없음. 독립QA·사람사용성·새APK물리실행·실차/기관/클라우드·심사접근·실제제출미확인입니다. 야간Slack0/18시기존게시읽기만/폰push미확인입니다.

다음 단일 기존 PM: 소스899a5a1을 기존 지속서명 verifyqa 경로로 한 번 빌드하고 설치 해시·서명을 대조해 수정된 200% 화면을 실기기로 검증합니다. 기존 release/.qa·데이터를 삭제/초기화/강제서명교체하지 않습니다.
