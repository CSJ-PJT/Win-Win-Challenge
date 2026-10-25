# 후보 오류 표시·복구 검증 — 2026-10-26 06시
작업 AS-Q1-PM-20261026T0605 / 기존 PM 자체 QA. source41c1812·CI40210143323·release APK7801e8ff 고정 후보의 실제 assets/index.html을 추출해 Windows Chrome155.0.8059.80 격리 headless context에서 실행했습니다. 제품 수정·APK 재빌드·설치·휴대전화 UI 조작은 없습니다.

## 결과
실행 06:08:18.195–06:08:21.084 KST, Node exit0, 아래 **시나리오4개 통과**, pageerror0/외부요청0. 기존 Node112/Android JUnit 수치에 더하지 않습니다.
| 실제 UI 시나리오 | 판정 |
|---|---|
| 빈 도착지 저장 | ‘주소를 입력하거나 검색 결과를 선택해 주세요’ 표시, 편집창 유지. 공개 주소 직접 입력 후 저장·편집창 닫힘 확인 |
| 빈 번호·잘못된 번호 | 6자리 입력/불일치 오류 표시, receiverConfirmed=false, 잘못된 시도1회 기록 |
| 번호 재발급 | 기존 인계자 확인·인수 확인 false, 시도 횟수0으로 초기화 |
| 만료→복구 | 가상시계121초 이동 뒤 실제 인수 버튼: 만료 오류·challenge=null·양측확인false·완료거절. 새 번호·양측 재확인 뒤 완료, reload 후도 완료 유지 |

화면 버튼·입력 이벤트로 진행하고 앱의 localStorage는 판정용으로 읽기만 했습니다. 새 격리 context의 합성 방문이며 기존 사용자 저장소는 접근하지 않았습니다. 공식주소 picker 성공은 주장하지 않습니다.
만료 시간은 **Playwright 가상 시계**로 제어했습니다. 2분 실시간 대기·Android 런타임·실차 신호 시험이 아닙니다. 외부 요청은 모두 차단하고 발생0을 확인했으며 외부 서비스 성공을 합성하지 않았습니다.
추출 HTML 89,335B SHA256 `c2004a65d27ffc601cad796f22c539105ced3db9b58b0d02e68bd5fa36e893d1`, 원본 release APK SHA `7801e8ffc7e393662ad73c57c3cfb385261b6dcc63405b737359a326504fe8a5`를 실행 전 확인했습니다.
테스트 스크립트는 build-reports/pm-20261026/candidate-errors.cjs에 실행한 그대로 보존합니다. Windows 기존 Playwright 위치를 참조하는 증거용 스크립트이며 CI에 등록하지 않았습니다. 같은 디렉터리에 이 APK의 candidate-index.html을 두고 Node로 실행했습니다.

## 기존 시험과의 연결·누락
- 원본 source41 CI Node 로그에서 domain.test: wrong-code31, 5회불일치32, 만료33, 재발급34, settings030.test 전화입력 거절103의 실제 ok를 확인했습니다. 단위 규칙 검증과 화면 오류·복구 검증을 구분합니다.
- 저장 경합은 기존 b227 실 HTTP3초 전송 지연/CI editor_save_busy 회귀의 저장·reload 성공 근거를 유지합니다. 이번에 반복하지 않았습니다.
- source ZIP의 test/demo_flow.py는 구 UI action 이름을 사용하며 release043 workflow의 실행 대상으로 연결되지 않습니다. 그 오래된 ‘빈 번호’ 검사 코드를 현재0.4.3 통과 근거로 쓰지 않았습니다.
- 이번 화면 시험은 5회 오류 폐기·시설 준비10분 만료까지 포함하지 않았습니다. 해당 규칙은 기존 Node 근거만 있고 현재 후보 UI/실물 판정은 별도입니다.

## 화면·로그
IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261026T0605에 exact candidate-index.html, 스크립트, run.log, result.json, expired-error.png, recovered-complete.png 보존.
만료 화면의 실제 한국어 오류와 복구 화면의 ‘인수를 완료했어요/양쪽 확인 완료’를 직접 읽었습니다. Playwright 가상 시각이 화면 완료 시각에도 반영되므로 실제 완료 벽시계로 쓰지 않습니다. 스크롤 위치가 유지된 full-page 캡처이며 사람 사용성 승인 근거가 아닙니다.
최초 PowerShell 명령은 .ToString 앞 공백의 파서 오류로 실행 전 거절됐습니다. 셸 표기만 고친 후 실행됐으며 제품 결함/시험 실패로 계산하지 않습니다. 후속 Node exit0·실제 assertion4통과가 최종 결과입니다.
정확한 파일 해시는 candidate-errors.json에 있습니다.

기존 PR Draft/미병합·Private·v0.3.0-preview 게시·0.4.3 미게시/공모전 미제출, 최신 CI40219456270 success 메타데이터 상태는 유지했습니다.
공식 DOCX/PDF 원본은 이번에 열거나 수정·재검증하지 않았습니다. 마지막03시 직접 확인 상태와 구분합니다.
다음 단일 담당 기존 PM: 남은 5회 오류 폐기/시설 준비 만료의 화면 복구를 좁게 확인하고, 확인된 누락·결함만 수정합니다. 독립 QA/사용성/심사 접근/실차·기관·클라우드/유효 REST 인증은 여전히 미확인입니다. 야간 Slack은 발송하지 않았습니다.
