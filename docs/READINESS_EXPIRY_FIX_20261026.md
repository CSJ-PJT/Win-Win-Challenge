# 시설 준비 만료 화면 갱신 수정 — 2026-10-26 07시
AS-Q1-PM-20261026T0656 / 기존 PM 자체 QA. source41 고정 후보를 검증하다 화면 갱신 누락을 재현해 최신 PM HEAD82d7978 위 web/app.js만 제한 수정했습니다.

## 재현·수정
- 06:57:27–06:57:40KST 원본 후보의 번호5회 불일치→번호 폐기·기존 인계자 확인 취소→새번호·양측 재확인·reload 완료 유지 통과.
- 같은 실행의 시설 준비 만료 자동 표시 예상은 7초 timeout으로 실패했습니다. 전체 첫 실행을 성공으로 바꾸지 않습니다.
- 06:58:15–06:58:18KST 별도 후속 확인: 가상시계601초 뒤에도 번호 발급 버튼이 활성 상태로 남았습니다. **실제 버튼을 누르면 준비 만료로 번호 발급을 거절하고 UI를 갱신**했습니다. 도메인 안전 규칙을 우회한 성공은 없습니다.
- quiet heartbeat는 화면을 갱신하지 않고 기존 countdown은 번호 시간만 바꿉니다. 마지막 렌더의 준비 유효 여부를 기록해 기존2초 timer에서 달라지면 render()를 호출하도록 수정했습니다.
- 기존 editor/address/codeInput 입력 보호 render guard를 그대로 사용합니다. 매 tick 강제 렌더·새 timer·도메인 TTL/권한/동의·양측확인/차량 guard 변경은 없습니다.

## 수정 후 확인
Windows Chrome155.0.8059.80 headless 격리 context에서:
1. 준비 만료 후 거절 버튼을 먼저 누르지 않아도 번호 발급 비활성·시설 준비 안내가 표시됩니다. 시설이 다시 준비 확인→새번호→양측 확인 완료·reload 유지 통과.
2. 편집 중 만료 시 실제 입력 노드·초점·미저장 상세주소를 유지하는 별도 assertion 통과.
3. 이식한 test/readiness_expiry.cjs를 실제 실행(07:01:41.612–07:01:44.415KST), exit0/pageerror0/외부요청0. 기존 release043 브라우저 회귀 단계에 추가했습니다.
Linux Node24.22.1의 격리 소스 npm test112/통과112/실패0/exit0. 이 수치와 브라우저 시나리오·기존 Android JUnit은 합산하지 않습니다.
가상 시계601000ms로 제어했으므로 실제10분 대기·Android 실물 시간·차량/외부 서비스 시험은 아닙니다. 화면/입력 이벤트로 진행했고 제품 localStorage는 assertion용 읽기만 했습니다.
5회 오류의 한국어 폐기 화면, 수정 후 만료 버튼·시설 준비 안내 화면을 직접 읽었습니다. 시연 정차 신호 또한 만료되는 화면이므로 필요 시 정차 상태 재확인 안내도 보일 수 있습니다. 안전 조건은 유지했습니다.

## 바이트·환경 구분
원본 APK7801e8ff / 원본 HTML c2004a65…e893d1은 변경하지 않았습니다. 수정된 app.js SHA6067ad0e9d26e2b426bf5dc42c20eb87abfc82ff325defd7f42abc3b4054541e, 수정 HTML SHAebb63dfef4c80fcc46e07d274483eb8816a7f1d4512214b63582d0a376dfed95는 별도 검증 소스입니다.
원본 APK의 app.js와 정확히 같은 문자열만 수정본으로 치환해 브라우저 시험했습니다. **새 APK를 로컬에서 빌드·설치하거나 기존 후보를 대체하지 않았습니다.**
raw fixed-result/draft-result의 product_modified=false는 원본 템플릿에서 남은 필드로 수정 소스 여부를 나타내지 못합니다. 원본 receipt는 보존하고 portable 결과에서는 true 및 reference_candidate_apk_sha256로 정정했습니다. 실제 변경·실행 HTML은 위 해시/검증표가 기준입니다.
IT13 QAroot/AS-Q1-PM-20261026T0656의 원본실패/후속/수정/입력보존/이식시험 로그·JSON·화면을 분리 보존했습니다. 실행 스크립트와 해시는 build-reports/pm-20261026/readiness-expiry.json 및 readiness-*.cjs에 있습니다.
새 제품 수정의 전체 CI·Android APK 결과는 후속 run으로 확인해야 합니다. 이전 CI40219456270 성공/기존41 APK·실기기 verifyqa 성공을 이 수정의 Android 통과로 쓰지 않습니다.
다음 단일 기존 PM은 새 CI 최종 로그·새 APK/서명과 회귀 결과를 확인하고, 필요 시 지속 verifyqa 서명을 보존한 실기기 검증으로 이어갑니다.
기존 앱·데이터·main/easy/address·원본 후보 보존, 공식 DOCX/PDF 이번 직접 열기/편집 없음, PR Draft미병합·v0.3.0-preview 게시·0.4.3미게시·실제 제출/초대 없음. 독립 QA·사용성·심사 접근·실차/기관/클라우드·유효 REST 인증 미확인. 야간 Slack 발송 없음.
