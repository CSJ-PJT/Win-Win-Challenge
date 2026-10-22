# 도착완성: 안심동행

차량이 도착한 시점과 사람이 인수한 시점을 구분하는 돌봄 이동 지원 앱입니다. 어린이집·유치원 등원, 어르신 주야간보호센터 방문과 경로당 자율 방문을 합성 데이터로 시연합니다.

> 공모전용 프로토타입입니다. 실제 개인정보, 시설, GPS, 차량 속도는 사용하지 않습니다. 대면 확인을 대신하거나 안전을 보장하지 않습니다. 실제 차량 신호를 사용한 검증은 별도로 필요합니다.

## 설치 없이 체험

`dist/handoff-demo.html`을 브라우저에서 엽니다. `npm run bundle`로 만들 수 있습니다. 서버 없이 정상 인계와 예외 상황을 체험하는 단일 기기 로컬 시연입니다. 최신 Chrome/Edge/Android WebView를 권장합니다.

## 로컬 서버 실행

Node.js 22 이상이 필요하며 외부 npm 패키지는 사용하지 않습니다.

```bash
npm test
npm start
```

`http://127.0.0.1:8080`을 엽니다. 역할별 창은 `/vehicle`, `/facility`, `/guardian`입니다. 같은 서버의 이동 상태를 공유합니다. 포트가 사용 중이면 `PORT=8081 node server.js`로 변경합니다. Windows PowerShell에서는 `$env:PORT=8081; node server.js`입니다.

기본 저장 위치는 `.data/demo.json`입니다. 원자적 파일 교체, 상태 버전 검사, 역할 검사, 요청 중복 방지를 적용했습니다. 다중 프로세스나 운영용 데이터베이스 구현이 아닙니다.

**인터넷에 공개하지 마세요.** 로컬 시연을 위해 `/api/bootstrap`에서 가상 역할 토큰을 발급합니다. 실사용자 인증·시설 가입·기관 신원 검증을 구현한 것이 아닙니다. 서버는 루프백에만 바인딩하고 공개 Host/교차 Origin을 거부합니다.

## Android APK

GitHub Actions의 `Test and build demonstration APK`가 테스트 후 release 변형을 빌드합니다.

- 저장소 APK 경로: `apk/WinWin_안심동행_release.apk`
- Android API 28 이상, 최신 Android System WebView
- APK는 합성 데이터 기반의 단일 기기 시연이며 웹 서버와 자동 연결되지 않습니다.
- 일반 Android: 내장 웹 화면으로 로컬 시연
- AAOS: CarUxRestrictionsManager 수신 및 상태 불명·주행 제한 시 네이티브 화면 차단
- Pleos: NaviHelper 3.0.5 초기화·연결 결과·공식 예제 경로 요청·완료/오류 콜백 어댑터

실제 Pleos 에뮬레이터/실차에서 SDK가 정상 동작했다는 뜻은 아닙니다. 검증 범위는 `build-reports/`와 `docs/VERIFICATION.md`를 확인하세요.

```bash
adb install apk/WinWin_안심동행_release.apk
```

CI release APK는 시연 전용 임시 키로 서명합니다. 배포용 키가 아니며 빌드마다 인증서가 달라집니다. 이전 시연 앱을 제거한 후 설치해야 할 수 있습니다. 제거하면 기기 내 시연 기록도 삭제됩니다. 앱 마켓 등록 전에는 본인 소유의 안전하게 보관된 서명 키로 다시 빌드해야 합니다. 서명 키를 저장소에 커밋하지 않습니다.

## 시연 순서

1. 시설 화면에서 인수 준비 완료, 제어실에서 P·정차 신호를 누릅니다.
2. 출발 계획 시작, 도착·정차 모의를 누릅니다. 이때 인계는 완료되지 않습니다.
3. 연결번호 발급 후 인계자 확인 체크와 버튼을 누릅니다. 시설에 번호를 입력하고 인수자 확인 체크·버튼을 누르면 완료됩니다.
4. 새 시연에서 담당자를 부재로 두거나 통신 끊김을 선택합니다. 완료가 막히는지 확인합니다.
5. 경로당 자율 방문은 본인 동의 후 도착만 알리며 인계 완료 기능은 제공하지 않습니다.

제어실의 정차·주행·도착·동의는 모두 모의 입력입니다. 실제 인수 사실을 센서나 AI가 판단하지 않습니다. 번호는 대면 연결 수단이며 신원 증명이 아닙니다.

## 구현 범위

| 구분 | 현재 범위 |
| --- | --- |
| 인계 규칙 | 지정 역할, 양측 확인, 2분 코드, 5회 오류 폐기, 차량 신호 30초·담당자 준비 10분 유효기간, 취소·철회·구역 이탈 |
| 서버 | HTTP API, 코드 비노출, 버전 충돌 검사, 요청 중복 방지, 파일 저장·재시작 복원 |
| 화면 | 차량·시설·보호자, 4가지 시나리오, 통신 끊김 모의, 기록 내보내기, 모바일 대응 |
| 네이티브 | Android 앱, AAOS UX 제한 수신/차단, 실제 NaviHelper 호출 어댑터 |
| 모의 | 시설·인물·동의·위치·차량 속도/기어·담당자 신원 |
| 미구현/미검증 | 실제 기관 가입·인증, 실차/GPS/시설 API, SMS/푸시, 현장 실험, 접근성 실사용 평가, 운영 DB·감사 저장소, 법률 검토 |

NavigationAdapter의 시험은 문서의 42dot 예제 목적지이며 가상 유치원 주소가 아닙니다. UX 제한이 해제된 시험용 AAOS/Pleos 환경에서 별도 확인 대화상자를 거칩니다. 요청 반환을 경로 탐색 성공으로 표시하거나 경로 결과로 인계를 자동 완료하지 않습니다.

## 구조와 직접 빌드

```text
web/core.js       공유 상태 규칙
web/app.js        UI와 로컬/서버 어댑터
server.js         표준 라이브러리 HTTP 서버
android/          Android Java 및 AAOS/Pleos 어댑터
test/             도메인·HTTP·권한·충돌·복원 테스트
tools/bundle.js   단일 HTML 생성
docs/official/    공식 빈 양식(개인정보 미기재)
apk/              CI가 생성한 시연 release APK
```

JDK 17, Gradle 8.11.1, Android SDK 35가 필요합니다.

```bash
mkdir -p android/app/src/main/assets
cp web/* android/app/src/main/assets/
gradle -p android assembleDebug
```

release 서명은 `DEMO_KEYSTORE`, `DEMO_STORE_PASSWORD` 환경변수로 키를 지정합니다. 운영 키는 비밀 저장소에서 관리해야 합니다. 출력은 `android/app/build/outputs/apk/`입니다.

## 제출 전

접수양식과 개인정보 동의·서명은 제출자가 직접 확정합니다. 운영용 참가자 정보는 GitHub에 올리지 않습니다. 비공개 저장소는 공식 심사용 계정 확인 후 접근 권한을 부여해야 합니다. 임의 계정을 초대하지 않습니다. APK 파일명은 최종 참가명에 맞게 조정하세요.
