# 데이터 보존형 최신 QA 경로 조사 · 2026-10-25 08:04 KST

작업 AS-Q1-PM-SIGNER-20261025T0800, 단일 담당 기존 안심동행 PM 임시 AS-Q1. 최신 OPS/PHONE-QA-STANDING/배정·07:00 실기기 결과 및 PR#2/CI를 읽고 원본 기기/소스를 조작하지 않는 서명 경로 검수를 수행했다.

## 확인한 원인과 환경

android/app/build.gradle의 deviceQa는 initWith release로 demoRelease 서명을 물려받는다. .github/workflows/release043.yml은 실행마다 runner.temp/preview.jks를 keytool -genkeypair로 새로 만든다. 같은 applicationId라도 반복 CI의 인증서가 달라진다. 설치된341 QA2903bc14의 인증서faa33573…6f133과 최신9c277ce QA25fbaf85의23a3ce03…4a486가 다르다. 인증서 지문이나 APK만으로 이전 비밀키를 복원할 수 있는 경로를 확보한 것이 아니다. 새키 생성·서명 강제교체·앱삭제로 이 문제를 해결했다고 주장하지 않는다.

IT13 도구 메타데이터를 다시 조사했다. PATH의 java/javac는 Oracle javapath이며 keytool/gradle/git/sdkmanager/apksigner는 PATH에서 미발견. 하지만 실제 파일 C:/Program Files/Java/jdk-21.0.11/bin/keytool.exe 및 사용자 .gradle/wrapper/dists 아래 Gradle8.11.1의 bin/gradle.bat는 발견했다. 따라서 ‘keytool/Gradle 자체가 PC에 전혀 없다’고 단정하면 안 된다. 확인한 Program Files/Android·LocalAppData/Android는 없고 .gradle/android에는 FakeDependency.jar만 있다. JDK17/AndroidSDK/이전QA개인키는 이 제한된 경로 조사에서 확보하지 못했다. PC 전체 부재를 뜻하지 않는다. 비밀키·계정 파일 내용은 읽거나 출력하지 않았다. 원본 로컬 미커밋 상태도 여전히 확인하지 못했으며 덮어쓰지 않았다.

## 완료한 코드와 실제 검증

tools/qa_update_preflight.py를 추가했다. 설치 APK의 해시가 일치하는 사본과 후보 APK에서 signing block의 leaf 인증서 집합을 읽어 불일치를 exit2로 차단한다. 일치는 exit0이지만 installation_authorized=false로 출력한다. 누락/손상/미지원 입력은 exit3. APK 경로 내용/인증서 비밀키·원문 예외를 출력하지 않는다. 설치·ADB·APK 변조·권한 변경 기능은 없다.

이 도구는 **인증서 동일성 한정 검사**다. 전체 apksigner 암호학 검증, 실제 package/version/서명 계보·업데이트 정책·데이터 보존 확인을 대신하지 않는다. 인증서 일치만으로 설치 승인을 내리지 않는다. 별도 패키지로 공존할 후보를 무조건 차단하는 용도가 아니라, 같은 패키지 업데이트 사전 검사 중 한 단계로 사용한다.

실제 내려받은341 QA2903bc14와9c277ce QA25fbaf85 바이트에서 불일치/exit2를 확인했다. 동일파일 비교exit0·손상입력exit3·누락입력exit3도 예상대로, 총4검사/실패0. 결과 build-reports/pm-20261025/qa-update-preflight.json. 이는 도구 검증이며 앱 E2E 추가 통과 수치가 아니다. 새 CI/APK 빌드를 만들지 않았다.

## 다음 단일 실행 과제

기존 PM이 확보된 Gradle8.11.1 경로를 사용하되 SDK/JDK17 가용성을 제한된 프로젝트 설정/기존 도구 경로에서 추가 확인한다. 최신 소스의 실물 검증에는 기존 release와 기존.qa를 모두 보존하는 전용 검증 ID를 한 번 정하고 비공개 로컬의 지속 QA 서명키를 유지하는 경로가 필요하다. 그 ID/키는 아직 생성·구현·빌드·설치하지 않았다. 기존 .qa의 개인키를 실제로 확보하면 그 인증서의 일치와 적법한 업데이트 조건부터 재검수한다. 매 CI마다 새 ID를 늘리거나 기존 앱을 삭제하는 방식은 사용하지 않는다.

현재 검증 기준: 코드9c277ce/CI40127842234 전체 성공·publish skipped, 새release95d9ba40/QA25fbaf85 실기기 미검증. 설치된341 QA는 공식주소1/DOM1 및07:00 공식 선택 주소 process cold 복원 확인 완료. 원본 main/easy/address 보존, PRDraft/미병합·게시v0.3.0-preview·0.4.3미게시/공모전미제출. 제출 DOCX/PDF 재열람/수정 없음, 외부실연동/독립QA감사/주간비교/전체진척률 분모 미확인. 야간 Slack·새예약·새에이전트 없음.
