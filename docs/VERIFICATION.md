# 구현·검증 범위

이 문서는 초기 버전의 과거 검증 기록입니다. 아래의 테스트 수·APK 해시·실행 범위는 당시 소스에만 적용됩니다. 현재 개발 0.4.3의 검증 상태는 [API 검증표](API_VERIFICATION.md), 화면 구성은 [화면설계서](SCREEN_DESIGN.md)를 기준으로 확인합니다.

작성 기준: 2026-10-23. 수행한 시험과 앞으로 필요한 검증을 나눕니다.

## 로컬 시험

- Node.js 22.16.0: 도메인 35개, HTTP/API 13개, 합계 48개 통과.
- Chromium 자동 조작: 정상 양측 확인, 잘못된 번호, 담당자 준비 없음, 통신 끊김, 경로당 도착 전용 흐름 통과.
- 1440px 데스크톱과 412px 모바일 화면 확인. 모바일 가로 넘침 없음.
- 브라우저 자동 조작 중 JavaScript 예외 없음.

브라우저 시험은 내장 HTML의 로컬 엔진 대상입니다. HTTP 권한·동시성·저장은 별도 자동 테스트로 확인했습니다. 실차 검증이나 현장 안전성 입증이 아닙니다.

## CI 증거

`build-reports/node-tests.txt`, `gradle-build.txt`, `apk-signature.txt`, `apk-sha256.txt`, `android-launch.png`, `android-runtime.txt`를 확인합니다. 일반 Android 실행도 Pleos 서비스 연결이나 실차 검증을 대신하지 않습니다.

## 인계 완료 조건

지정된 별도 인계·인수 역할, 현재 이동 건의 유효한 번호, 양측 대면 확인, 모의 지정 구역 내부, 30초 이내 모의 정차·UX 허용 신호, 10분 이내 담당자 준비, 대상자 동의가 모두 필요합니다. 성인은 기본 미동의입니다. 번호는 2분 만료, 5회 오류 폐기이며 철회·이탈·주행 시 재확인합니다. 보호자 조회에는 번호를 제공하지 않습니다.

## 한계

로컬 bootstrap은 가상 역할 시연 도구이며 운영 로그인·기관 인증이 아닙니다. 단일 프로세스와 파일 저장을 전제로 합니다. 대면 확인은 사람의 진술을 기록할 뿐 실제 만남을 입증하지 않습니다. 지도는 개념도이며 지리·승하차 위치는 검증하지 않았습니다. 오프라인 확인을 자동 대기열에 쌓지 않으며 복구 후 재입력이 필요합니다. SMS·푸시·카카오 알림은 구현하지 않았습니다. 장애 시 현장 인계 절차를 우선하며 차량 문·시동을 제어하지 않습니다.

## 공식 근거

- https://appdevchallenge.auto-hmg.io/guide/submission
- https://appdevchallenge.auto-hmg.io/guide/judging-awards
- https://document.pleos.ai/en/docs/pleos-only/create-my-project
- https://document.pleos.ai/en/docs/pleos-only/connect-sdk-pleos/NaviHelper/importing-sdk
- https://document.pleos.ai/en/docs/pleos-only/connect-sdk-pleos/NaviHelper/initialization-and-release
- https://document.pleos.ai/en/docs/pleos-only/connect-sdk-pleos/NaviHelper/destinations
- https://document.pleos.ai/en/docs/pleos-only/vehicle-app-developer-guide/driving-restriction-development-guide

문서는 Vehicle State·NaviHelper를 별도 신청 없이 이용 가능한 상태로, FusedLocation·TTS·STT·Vehicle Control은 준비 중으로 안내합니다. 미제공 음성·위치 기능을 구현한 것으로 기재하지 않습니다. 제출 직전에 제공 상태를 재확인합니다.

