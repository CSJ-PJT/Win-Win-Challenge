> 23시 후속: 설치 release와 후보는 동일패키지/버전·서명불일치로 현재 단말의 보존 업데이트 경로가 차단됨을 직접 확인했습니다. 설치시도 없음. [서명·바이트 실제 검수](RELEASE_INSTALL_PREFLIGHT_20261026.md). 다음 단일 기존 PM은 manifest/assets 차이 대조로 동등성 범위·release 전용 검증 항목을 확정합니다. 아래22시 표는 당시 판정을 보존합니다.

# 제출 조건·현재 근거와 완료 조건 — 2026-10-26 22시

기존 PM 자체 대조다. 이 표는 공식 요건과 내부 제품 검증의 분류표이며 전체 제품 acceptance 분모나 진척률이 아니다. 실제 제출·권한 변경·공개 배포를 수행하지 않았다.

## 이번에 직접 확인한 변화

공통 위임·standing 승인·배정·03시 실패 원본과 최신21시 결과를 먼저 읽었다. PR2 HEAD ead1162047f7b4d89c9d0d3196f35d93b93ccf7e Draft/open/미병합, 최신 CI40252472387/source35 success와 v0.3.0-preview만 게시 상태는 직전 대비 같다. claim 부재·관련 Java/Gradle/Git writer 부재 및 실제 adb dumpsys 조회 exit0/진행 instrumentation 매칭 없음을 확인했다. 폰 UI·설치·새 시험은 없다. 광범위 adb 경로 탐색 중 옛 build 하위 장경로 오류가 있었고, 확인한 SDK 절대경로의 adb로 후속 읽기 조회했다. 가용 도구/제품 실패로 판정하지 않는다.

후보35 기존 원본12파일에서 SHA256SUMS의11개를 다시 계산해11/11 일치·실패0을 확인했다. 새 빌드·다운로드·파일 교체 없이 수행했다. 공식 문서는15시 저장본 검수 result를 읽었으며 이번에 Library 원문을 새로 읽거나 서명 유효성을 인증한 것은 아니다.

## 공식 요건 재조회

[지원·제출](https://appdevchallenge.auto-hmg.io/guide/submission)·[FAQ](https://appdevchallenge.auto-hmg.io/faq)·[일정](https://appdevchallenge.auto-hmg.io/guide/schedule)·[설명회 공지](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000005)를 10/26 22시에 다시 읽었다. 작성·서명한 접수양식은 필수이며 개발 산출물은1차 선택이다. 독립 QA·실차·클라우드 미검증을1차 기획서 접수 불가와 동일시하지 않는다. 실제 동작 앱은2차 PT 전 필요하다. 접수 마감은11/15, 설명회는10/28오후이며 정확한 시각·접속 링크는 조회한 공지에서 아직 안내되지 않았다. 실제 발송과 참가자 서명 유효성은 미확인이다.

## 현재 고정 기준

- 제품741869b/시험35e3065, CI40252472387. 후보 APK SHA256 6a28008a491fb7ece55572cc5c705db88c202acfde12caa98b7336c353e53313, certificate c4210a55…, 5170856B.
- source ZIP db8322f11733f983772f8e6f31eb1ce9e8f74447d0db06126329f664bef512c2. 별도 README_KO가 원본 ZIP 속 과거 README의 현재 기준을 보완한다. 후속 문서 commit은 고정 ZIP에 소급 포함되지 않는다.
- 공식 DOCX/PDF 동일ID v3,15시 확인 저장 SHA: DOCX a31f72589c8948eea136d3ef26a2035c6c5366f0d90c1334af54f46d1176ad2d, PDF 946f9f60033c3e6dfd7a5179523927e8e238b795c868c18836fd38241d316762. PDF 업로드 입력과 저장 바이트의 차이 및13쪽 비교는 [15시 근거](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6409441254)를 따른다.
- 현재 tracked apk/안심동행_안심동행플랫폼_release.apk는 tree blob fd64e80f7c82712806bebefb221b45457b15b246/5131231B로 후보와 다르다. 이번 binary를 다운로드·서명/실행 재검증하거나 교체하지 않았다.

## 항목별 담당·완료 조건

|ID/범위|항목·현재 판정|단일 담당|완료 조건·근거 경계|
|---|---|---|---|
|F1 1차 필수|기획서·동의·서명·날짜: PREPARED_VALIDITY_NOT_CONFIRMED|기존 PM|제출 직전 동일 원본의 필수 작성·본인 동의/서명/날짜와 참가 인원·CC 조건을 확인. PM 대리서명 금지. 15시 v3 저장본 검수6409441254; 이번에는 원본 재열람·편집 없음|
|F2 1차 필수|접수 발송·수신 증거: NOT_SUBMITTED|기존 PM|별도 실제 제출 승인 후 최종 첨부/수신자/제목 확인 및 실제 발송·접수 근거 보존 메일 발송/접수 없음|
|D1 선택 개발 산출물|후보35 바이트·실행 안내: PRIVATE_CANDIDATE_PREPARED|기존 PM|고정 source35/APK6a28/README_KO를 동일 제출 목록으로 연결하고 최종 제출 경로를 명시 14시 원본result 재조회;22시 SHA256SUMS 11/11 재측정 일치, 원본12파일 유지|
|D2 선택 개발 산출물|GitHub 지정 APK 경로: OLD_TRACKED_BINARY_DIFFERS|기존 PM|승인된 제출 branch/commit의 apk/팀명_앱이름_release.apk가 후보6a28과 동일 SHA임을 확인 현재 tree 지정 APK blob fd64e80/5131231B, 후보5170856B와 다름; 이번 binary 교체/게시 없음|
|D3 선택 개발 산출물|Private 심사 계정 접근: ACCESS_UNVERIFIED|기존 PM|공식 계정 신원·쓰기권한 영향 확인 및 별도 권한 승인 후 초대 수락·정확한 소스/APK 접근을 실제 확인 Private 유지; 초대/비로그인 또는 심사자 접근 성공을 확인하지 않음|
|Q1 제품 검증|후보 release의 물리 실행: NOT_VERIFIED|기존 PM|기존 앱/데이터·서명을 보존하는 경로를 먼저 검수한 뒤 후보6a28 실제 바이트의 주소·출발·인계·복원 로그/화면 확보 CI Android15 release와 물리 Android16 verifyqa4ed는 다른 APK/서명|
|Q2 제품 검증|현재 verifyqa 및 로컬 API 범위: SCOPED_PM_SELF_QA|기존 PM|환경별 성공/실패 원장을 유지; 09시 업데이트 전 값 동일성은 당시 before 증거 없이는 소급 PASS 금지 09~20시 물리 한정검증/21시 Linux40HTTP·31assertion; 새 시험 아님|
|Q3 품질 승인|독립 QA·감사·사람 사용성: ACK_NOT_VERIFIED|기존 전담 QA/감사 역할(실제 ACK 전 PM이 인계 관리)|기존 담당의 실제 수신·독립 시험·판정 기록 확인; 자체 QA 기록을 독립 승인으로 대체하지 않음 신규 agent/GPT/메시지 발송 없음|
|Q4 실서비스/차량|유효 REST·기관/클라우드·Pleos/AAOS/실차: SUCCESS_UNVERIFIED|기존 PM|각 환경의 가용성·권한을 조사하고 허용된 실제 호출/SDK 연결·경로 완료·차량 UX 근거 확보; 비용/실기관 전송 별도 승인 공식picker/Geocoder/지도웹/guard 거절/키제외503은 각각 별도 범위|
|O1 공식 일정|설명회·마감: OFFICIAL_PAGE_RECHECKED|기존 PM|기존 점검에서 공지된 정확한 접속시간·링크를 확인; 새 예약 생성 없음 10/26 22시 공식3안내+설명회 공지 확인:접수11/15까지,설명회10/28오후/정확시간·링크 미공개|

## 기록의 현재성 보완

SUBMISSION_REQUIREMENTS_20261026과 SUBMISSION_CANDIDATE_20261026은 각각03/04시의 v2·후보41 역사 기록이었다. 기존 해시·실행 사실을 지우지 않고 상단에 현재 후보35·v3 및 본 표 링크를 추가했다. 과거 JSON도 역사 기록으로 보존하고 [현재 판정 JSON](../build-reports/pm-20261026/submission-gates-current.json)을 별도 명시한다. 제품·시험·워크플로·고정 후보·공식 문서 원본은 변경하지 않는다.

다음 단일 기존 PM: 후보6a28 release의 실기기 검증을 위한 기존 앱 보존·설치 서명 경로 사전검수. 기존 앱 삭제·초기화·서명 강제교체는 금지한다. 독립 QA ACK·권한/공개·실제 제출 승인은 계속 별도이며 새 GPT/agent/예약/수신자를 만들지 않는다. 야간 Slack 미발송,18시 기존 게시만 읽기 확인·폰 푸시 미확인.
