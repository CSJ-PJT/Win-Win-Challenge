# 최신 실행 확인 · 2026-10-24 18:25 KST

소스 `5232b81544b4214c14048c7c020d8eac7e639861`, [CI40081102580](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40081102580)(18:13:29–18:23:15 KST)의 verify-build/live-address/native-smoke 모두 성공, publish skipped. Node112/실패0·공식주소 Android instrumentation1·APK조작7·DOM instrumentation1. 실제 MAP_INTENT_OPENED, PRIMARY_HANDOFF_OK, EASY_ARRIVAL_ACK_OK 및 종료코드5개 모두0을 원본 아티팩트에서 확인했다. 시설 양측 확인 완료와 쉬운 도착 알림 화면의 한글·큰 글씨를 직접 확인했다. Android15 에뮬레이터 범위다.

release APK5,170,048바이트 / SHA256 `faf6562113d58c2d4cdc6aadc094eb4fadf8666caf47c5045d8893bc99d4140b`와 QA 앱/테스트의 실제 바이트·해시를 CI manifest에 대조했다. [최신 실행 근거](../build-reports/qa-20261024/map-runtime-5232b81.json), [QA manifest](../build-reports/qa-20261024/qa-package-manifest-5232b81.json). QA variant는 빌드/metadata 검사만이며 이 실행의 native 대상은 release 패키지다.

341bc88/CI40076247150의 잘린 지도 탭 실패, 150cd5f/CI40080392976의 과도한 상단여유로 인한 시설 탭 실패는 수정 전 이력이다. 최신5232b81 전체 성공과 구분한다. 실물 AS-Q1 인계용은 기존341bc88/QA2903bc14·테스트c73efa79 그대로이며 수신/점유/실행 미확인. 신규 APK·QA의 실기기 성공, 외부 API 전체 정상, 공개 릴리스·제출 완료로 합산하지 않는다.

아래 문단은 각 시점의 과거 검증 기록이다. 키 미제공 설명도 해당 시험환경 범위이며 현재 모든 위치에 키가 없다는 판정이 아니다.

# DOM 조작 검증 보완 · 2026-10-24 15시

대상 커밋: `4a671e033ca504da2229526656039b5b61e025a2`. [CI 40068462730](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40068462730), 시작 2026-10-24 15:00:18 KST.

## 저장한 변경

- `DomFlowTest.java`: Android instrumentation에서 MainActivity의 WebView에 접근하고 UI 스레드에서 evaluateJavascript 결과를 기다린다. 화면의 DOM 버튼 클릭과 입력 이벤트만 사용한다. core 상태를 직접 변경하거나 결과를 주입하지 않고 릴리스 WebView 원격 디버깅도 켜지 않는다.
- 주요 화면의 방문 선택·주소 수동 입력·출발·도착·시설 준비·연결번호 읽기·인계자 확인·시설 번호 직접 입력·인수 완료·보호자 조회, 쉬운 알림·시설 확인까지 검사한다. 이 테스트의 수동 주소 입력은 공식 주소 검색 SDK 검증으로 계산하지 않는다.
- `android_smoke.py`: 시연 도구의 번호 자동입력을 제거하고 표시된 번호를 읽어 시설 입력란에 실제 ADB 키 입력을 수행한다. 번호를 찾지 못하거나 입력란이 모호하면 실패한다.
- `native043.sh`: 기존 공식 주소·접근성 스모크와 별도로 DOM instrumentation의 종료코드와 JUnit OK를 확인한다. 실패를 건너뛰거나 통과로 바꾸지 않는다.

## 15시 최초 확인 (이후 결과는 아래 16시 기록 참고)

Python `py_compile`, 셸 `bash -n` 통과. 새 CI의 Node 단계 성공을 확인했으며 Android 빌드/실행 결과는 대기 중이다. Java 컴파일 또는 새 APK 설치/실행 통과를 아직 주장하지 않는다. 마지막 완전 통과는 소스38ef02b / CI40063017206이며 새 소스에 그대로 합산하지 않는다.

IT13에서 안심동행 관련 실행 프로세스와 Task 하위 RUN.lock을 검색했으나 발견하지 못했다. 원본 프로젝트의 git은 PATH·표준 설치 경로에서 찾지 못해 미커밋 변경 상태는 확인 불가다. 원본 파일을 덮어쓰지 않고 원격 HEAD 기준 테스트 파일만 변경했다.

기존 `PHYSICAL_ANDROID_QA.md` 원문을 읽어 이전 a001ec3 APK의 실기기 주소/저장/복원 관측과 UIAutomator 탐색 실패를 확인했다. 원본 스크린샷의 시각 재검증은 수행하지 않았다. 읽기 전용 ADB 확인에서 연결 단말은 automotive feature 및 pleos 패키지가 없어 Pleos/AAOS 실동작 근거로 사용할 수 없다. 프로젝트 루트 설정 파일명과 현재 프로세스 환경변수 이름 범위에서 Kakao/Pleos 키를 확인하지 못했으며, 다른 위치에도 키가 없다고 단정하지 않는다.

## 남은 차단

- 새 DOM 검사의 Android 컴파일·CI 통과, 동일 APK 해시의 물리 단말 전체 흐름 검증.
- 기존 LiveAddressTest의 공식 주소 picker는 UIAutomator 의존성을 유지한다. 실기기의 공식 주소 왕복 자동화 문제 전체가 해결됐다고 판단하지 않는다.
- 실기기에는 이전 APK가 설치돼 있다. 새 CI는 매번 서명 키를 생성하므로 기존 앱과 인증서가 다른 APK로 `install -r`가 거절될 수 있다. 이 점검에서는 데이터 삭제·앱 제거·실기기 재설치를 하지 않았다. 실제 설치 전에 인증서 일치와 데이터 보존 경로를 확인해야 한다.
- Kakao REST 실키·Pleos/AAOS 서비스, 실제 기관 인증/클라우드 동기화는 미검증/후속 범위.
- 기존 13쪽 제출 문서의 확인된 시험 수치는 그대로 보존한다. 새 검사를 통과 전까지 완료 수치로 추가하지 않는다.

## 16시 확인: 실행 통과와 APK 대조

확인: 2026-10-24 16:05 KST. CI40068462730은 15:00:18~15:09:05 KST에 소스 `4a671e0`를 검증했다. verify-build/live-address/native-smoke 성공, publish skipped. Node112, 공식 주소 instrumentation1, APK 조작7, 별도 DOM instrumentation1이 통과했다. 두 instrumentation은 서로 다른 검사이며 중복 집계하지 않는다. `PRIMARY_HANDOFF_OK`, `EASY_ARRIVAL_ACK_OK`와 JUnit OK, 모든 종료코드0을 아티팩트에서 직접 확인했다.

APK 다운로드: 5,170,048바이트 / SHA256 `9a0c311adb35ebebb43a31b8b7ca5e38ad609ebc632212b8c09fcd47ba64f4bb`. 실제 바이트의 해시가 CI apk-sha256.txt와 일치한다. build ZIP e6d3183439be329dd0d0803de9eae5956ad06c00ec27ce518bb8df63dd57f81f, native ZIP ca06faa465d5091d54780a750d74e2eb2c3ecb6c9c2c7be724baa7ed2ac98278도 실제 다운로드 바이트와 일치한다. build artifact12549593786/native12550418021은 11/7까지 보존 예정이다. 이 결과는 Android15 에뮬레이터 설치·실행 근거다.

16:05 읽기 전용 ADB로 실기기에 설치된 APK 해시가 이전 a001ec3의 c09449f8…de54임을 확인했다. 그 APK의 CI 인증서 SHA256은 74f3b4db…dd136, 새 APK 인증서는 8354bc78…ac366으로 다르다. 따라서 기존 앱을 덮어쓰는 업데이트의 서명 조건이 맞지 않는 것으로 판단한다. 실제 설치 시도/삭제/데이터 초기화는 하지 않았다. 같은 해시의 실기기 E2E는 여전히 미검증이다. 데이터 보존을 위해 다음 단계는 기존 앱과 다른 applicationId의 격리 QA 패키지를 빌드·검증하는 방법을 우선 검토한다.

기계 판독 근거: `build-reports/pm-20261024/dom-runtime-check.json`, 실행 로그 발췌 `dom-runtime-log.txt`. 기존 LiveAddressTest의 실기기 공식주소 UIAutomator 의존, 실키/Pleos/AAOS 검증은 남아 있다.
