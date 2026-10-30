# 안심동행 플랫폼

차량 도착부터 양측 대면 인계까지 같은 방문의 진행 상태를 공유하는 돌봄 이동 지원 PoC입니다.

## 리뷰할 버전

| 항목 | 제출 검토 기준 |
| --- | --- |
| 개발 브랜치 | `feature/pm-api-screen-0.4.3` · [PR #2](https://github.com/CSJ-PJT/Win-Win-Challenge/pull/2) |
| 앱·서버 제품 소스 | [8f4aaf93e36e4dd3ab267c09c274dedaca4057a6](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/8f4aaf93e36e4dd3ab267c09c274dedaca4057a6) |
| 제품 CI | [40887985855](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40887985855) · 10/29 23:15 KST 완료, 검증 3개 성공·publish skipped |
| 지정 APK | [apk/안심동행_안심동행플랫폼_release.apk](apk/안심동행_안심동행플랫폼_release.apk) · 0.4.3 · 5,171,848바이트 |
| APK SHA256 | `09e488aa8cf103dffb187ca4fbee6ed72a2fbd100a82c5ba89faa2da173f5e90` |
| APK 고정 링크 | [r6와 정합화한 파일](https://github.com/CSJ-PJT/Win-Win-Challenge/blob/bfaae931cee93d83ce8472a3f9ce819f386f8209/apk/안심동행_안심동행플랫폼_release.apk) |
| 공식 기획서 | 동일 ID DOCX/PDF v8, 13쪽 서명 전 작업본. 본인 서명·작성/서명일은 실제 11/1 확인 후 기입 |
| 봉인 후보 | r6는 제품 8f4aaf9·공식 문서 v7의 과거 검토 묶음. 이후 README·문서 작업본을 포함하지 않음 |

현재 브랜치의 문서·시연 도구 커밋과 앱을 만든 제품 소스 커밋을 구분합니다. 조회 시 `git rev-parse HEAD`로 실제 체크아웃을 기록합니다. 저장소는 Private이며 리뷰어 접근 확인은 별도 절차입니다.

## 실행 환경과 실행법

Node.js **22 이상**과 브라우저가 필요합니다. HTTP PoC와 아래 대표 검증에는 외부 npm 패키지·로그인·실기관 계정이 필요하지 않습니다. 제공되는 시설·이용자·역할 세션은 합성 시연용입니다. 개인 정보나 운영 비밀값을 입력하지 않습니다.

```sh
git clone --branch feature/pm-api-screen-0.4.3 https://github.com/CSJ-PJT/Win-Win-Challenge.git
cd Win-Win-Challenge
node --version
npm start
```

접근 권한이 있는 계정으로 복제한 뒤 `http://127.0.0.1:8080/vehicle`을 엽니다. 같은 서버의 `/facility`, `/guardian`, `/visitor`에서 역할 화면을 나란히 볼 수 있습니다. 서버는 루프백에서만 실행되며 `.data/demo.json`에 방문·시연 세션을 저장합니다. 기존 자료를 지우지 않고 별도 시연을 하려면 시작 전에 `DATA_FILE`에 새 파일 경로를 지정합니다. 종료는 Ctrl+C입니다.

단일 PC 화면을 보려면 `npm run bundle` 후 `node tools/serve-demo.cjs`를 실행하고 `http://127.0.0.1:18420`을 엽니다. Windows에서는 **PC 실행.cmd**를 사용할 수 있습니다. 이 모드는 브라우저 localStorage를 사용하며 다른 브라우저와 상태를 공유하지 않습니다. 소스를 바꾸면 번들을 다시 생성합니다. HTML을 `file://`로 직접 열면 공식 주소 반환이 동작하지 않습니다.

공식 우편번호 검색에는 인터넷이 필요하며 REST 키는 필요하지 않습니다. `/api/places`의 Kakao Local 검색은 별도 REST 키가 필요한 기능입니다. 키가 없으면 503 `MAP_NOT_CONFIGURED`를 반환합니다. 키를 저장소·화면·보고서에 넣지 않습니다.

## 대표 시연과 검증

[시연 진행안](docs/DEMO_SCRIPT.md)의 순서로 방문 정보 저장 → 출발 → 도착 → 연결번호 → 인계자 확인 → 시설 인수 → 보호자 조회 → 재진입을 확인합니다. 이어 쉬운 화면의 본인 동의 → 도착 소식 → 시설 확인 → 재진입을 확인합니다. 보호자 화면 갱신과 도착 소식은 로컬 상태 공유이며 **실제 휴대폰 push 수신은 미검증**입니다.

```sh
node tools/poc-e2e.cjs --output build-reports/poc-e2e-local.json
```

이 명령은 별도 임시 저장소와 실제 루프백 HTTP 서버를 생성해 두 방문 흐름, 잘못된 번호·보호자 권한 거절, 서버 재시작 복원을 검증하고 종료합니다. 기존 `.data`·브라우저·폰을 조작하지 않습니다. **HTTP 서비스 E2E**이며 화면 클릭·Android·외부 발송 시험은 아닙니다. 출력의 `result`, 각 `cases`, assertion 실패와 종료코드를 함께 확인합니다.

기존 제품 전체 검사는 `npm test`입니다. 브라우저 UI 자동시험은 Python 3·Playwright 1.57.0·Chromium이 준비된 환경에서 `python3 test/flow040_http.py`, `python3 test/easy_completion.py`로 구분해 실행합니다. 이번 대표 서비스 검증 결과를 이전 CI 135개와 합산하지 않습니다.

## 구현과 검증 범위

- 구현: 네 역할 UI, 주소 저장·초안 복원, 양측 확인, 번호 만료·오류 처리, HTTP 버전 충돌·중복 요청·파일 저장, 쉬운 알림과 시설 ACK. APK와 웹은 같은 JS 상태 엔진을 사용합니다.
- 모의: 로컬 시연 역할 토큰·시설·이용자, 정차/기어/도착 조건. 운영 기관 인증·실차 신호가 아닙니다.
- 별도 연계: 공식 우편번호 picker, 지도·전화 시스템 화면, AAOS/Pleos 어댑터. 실제 차량·운영 인증/클라우드·실기관 통지·push는 후속 검증입니다.

CI40887985855의 Node135/135, 모의 주소10/10, PC 공식주소7/7, Android15 release 에뮬레이터 주소 JUnit1·DOM1·UI7은 해당 소스/환경의 기존 근거입니다. Android16 verifyQa930의 10/28 PM 자체 QA는 다른 바이너리입니다. 현재 release 자체 물리기기·독립 QA 완료로 확대하지 않습니다.

[화면·API 계약 및 현재 검증](docs/POC_REVIEW_GUIDE.md) · [화면설계 전체와 과거 근거](docs/SCREEN_DESIGN.md) · [후속 앱 개발 계획](docs/PRODUCT_BACKLOG_20261101.md)

## Android와 기존 앱 보존

게시 릴리스는 [v0.3.0-preview](https://github.com/CSJ-PJT/Win-Win-Challenge/releases/tag/v0.3.0-preview)이며 지정 0.4.3 후보와 다릅니다. Android 후보의 패키지·서명·해시·버전을 먼저 확인합니다. 기존 설치 release와 후보의 인증서 차이로 보존 업데이트가 차단되어 있습니다. **기존 앱 삭제·데이터 초기화·서명 강제 교체를 하지 않습니다.** 원래 서명키 가용성은 미확인입니다. [서명 정책](docs/RELEASE_SIGNING_POLICY_REVIEW_20261029.md)을 따릅니다.

## 제출 상태

사용자 내부 목표는 **2026-11-01**, 공식 접수 마감은 **2026-11-15 KST**입니다. 1차 필수는 접수양식(기획서)과 참가자 본인의 동의·서명·날짜이며 Git·APK·영상은 선택 제출입니다. 최종 제품 QA는 후속 단계입니다. 현재는 제출 검토 자료를 준비한 상태로 **본인 서명 및 실제 제출 미완료**입니다. 비공개 Git 선택 제출은 공식 심사계정의 접근 확인도 필요합니다. 이 저장소 변경으로 초대·권한 확대·공개배포·접수를 수행하지 않습니다.

공식 근거: [지원·제출](https://appdevchallenge.auto-hmg.io/guide/submission) · [일정](https://appdevchallenge.auto-hmg.io/guide/schedule)

[11월 1일 제출 목록과 비공개 심사 접근 확인](docs/SUBMISSION_MANIFEST_20261101.md)

[PoC 실제 화면 6장과 검증 범위](docs/POC_VISUAL_EVIDENCE_20261101.md)
