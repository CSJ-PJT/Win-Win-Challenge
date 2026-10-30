## 격리 로컬 툴체인 준비 완료 · 2026-10-25 10:07 KST

작업 AS-Q1-PM-TOOLCHAIN-20261025T1002, 담당 기존 안심동행 PM 임시 AS-Q1. 최신 OPS·배정·PHONE-QA-STANDING·07/08/09시 결과·PR#2/CI를 먼저 읽고 관련 writer/QA claim을 발견하지 않은 상태에서 실행했다. 이전 ‘JDK17/SDK 미확보’는 이번 준비로 아래 범위에서 해소했다. 앱 빌드/실기기 검증 차단 전체가 해결됐다는 뜻은 아니다.

원본 프로젝트 밖 %LOCALAPPDATA%/AnsimBuildTools에만 도구를 배치했다. 시스템 PATH/JAVA_HOME/기존 설치·원본 소스·휴대폰 앱/데이터는 변경하지 않았다. 각 명령 프로세스에만 JAVA_HOME을 지정했다.

| 실제 검증 | 결과 |
|---|---|
| 공식 Adoptium API 선택 JDK17 ZIP | 190,817,615bytes, SHA256 e53a79c3c3d86865bd7e787903884331068e71321714ffd44f145785affc7cb0 일치 |
| 추출한 Java 실행 | Temurin17.0.20.1+1, java -version exit0 |
| 기존 Gradle8.11.1 격리 javaToolchains | --offline --no-daemon --max-workers=1, exit0; Current JVM=Temurin17, 기존 Oracle21도 탐색됨 |
| Google 명령행 도구15859902 ZIP | 155,655,386bytes, SHA256 90ae805d20434428bffcb699c290860f19bb5f66a67e6b330067e3de801fb04a 일치 |
| sdkmanager | 22.0 실행 exit0(기존 JDK21 사용) |
| SDK 패키지 설치 | SDK 라이선스 단계 exit0, platforms;android-35·build-tools;35.0.0 설치 exit0 |
| 실제 플랫폼 파일 | android-35/android.jar 및 optional/android.car.jar 존재 |
| 빌드도구 실행 | aapt2 2.19-11948202 / apksigner0.9, 각각 exit0(JDK17) |

출처 https://api.adoptium.net/v3/assets/latest/17/hotspot?architecture=x64&image_type=jdk&os=windows&vendor=eclipse 및 https://adoptium.net/installation/ci-scripts , https://developer.android.com/studio . API 메타데이터/Google 공식 다운로드 표의 해시와 실제 내려받은 바이트를 대조한 뒤 추출했다. 바이너리 GPG/플랫폼별 Authenticode를 별도 검증한 주장은 하지 않는다.

실제 경로: JDK17은 AnsimBuildTools/jdk17/jdk-17.0.20.1+1, SDK는 AnsimBuildTools/android-sdk, CLI는 cmdline-tools/15859902. sdkmanager 최신 CLI 실행은 기존JDK21, 앱용 Gradle은 JDK17을 선택한다. 기존 Android adb 서버는 교체/실행하지 않았다.

PC Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T1002/result.json 및 gradle-java17.txt·sdk-install.txt·sdkmanager-version.txt·sdk-licenses.txt에 실행 근거를 보존했다. 최초 긴 다운로드 명령의 프로세스 시작 오류는 후속 짧은 명령으로 실행했고 공식 ZIP 바이트/해시로 완료를 확인했다. Java 버전 stderr를 PowerShell ErrorRecord로 표시한 부분은 버전 문자열·실제 exit0과 구분했다.

**아직 미수행:** 최신 QA 검증용 ID/지속 비공개 서명키 생성·구현, 최신 소스의 격리 로컬 앱 빌드 및 APK 실기기 설치. 설치된.qa를 새 인증서로 덮어쓰지 않았다. 서명 인증서faa33573 vs23a3ce03 불일치는 여전하다. 다음 단일 담당 기존PM이 최신 원격 HEAD로 격리 소스를 준비하고 기존 release/.qa와 공존하는 하나의 전용 검증ID·지속 로컬QA서명 경로를 구현·빌드·검증한다. SDK라이선스·다운로드 완료를 앱 API/SDK 실연동 성공으로 합산하지 않는다.

소스9c277ce/CI40127842234 성공, 설치341 QA의 official1/DOM1·공식주소 cold 복원은 기존 별도 범위다. 새CI/새APK/기기조작·공개배포/실제제출 없음. 원문 제출 DOCX/PDF 재열람/수정·외부 API 실연동·독립 QA/감사·진척률 분모는 여전히 별도 미확인이다.

---

## 2026-10-25 08:57 KST · 실제 오프라인 Gradle 탐색

기존 PM이 IT13 Temp/asdh-toolchains-2026102509에 java 플러그인만 둔 격리 프로젝트를 만들고, 발견된 Gradle8.11.1/bin/gradle.bat -p <격리경로> --offline --no-daemon --max-workers=1 -q javaToolchains를 실행했다. 프로세스 한정 JAVA_HOME=기존 JDK21.0.11을 사용했고 exit0으로 완료됐다. Auto-detection Enabled, 자동 탐색 JDK는 Oracle21.0.11 하나(Location Program Files/Java/jdk-21.0.11, Is JDK true)였다. 도구 설정의 Auto-download Enabled 표시는 다운로드 실행/성공이 아니다. 실제 JDK/SDK 다운로드나 앱 빌드는 하지 않았다.

사용자 .jdks·.gradle/jdks, C:/Android·C:/AndroidSDK, Program Files/Eclipse Adoptium·Android/Android Studio/jbr도 존재하지 않았다. 이것은 확인한 표준 경로/Gradle 자동 탐색 결과이며 PC 전체 JDK17/SDK 부재 증명이 아니다. 원본 프로젝트·미커밋·앱/데이터·키/계정 내용은 조작하지 않았다. USB/화면 조작/새 APK/CI 없음.

PC 결과 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T0900/result.json 및 java-toolchains.txt에 보존. 다음 단일 담당 기존PM: 최신QA 전용 검증ID/지속 비공개QA서명 및 SDK/JDK17을 갖춘 격리 빌드 경로 확보. 새QA의 서명 불일치는 미해결이며 설치/실기기 통과로 판정하지 않는다. 9시 보고에서는 밤사이341 QA 실기기 공식1/DOM1/cold주소와9c277ce CI성공을 구분한다.

---

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
