# 서버 API6 실제 로컬 HTTP 검증 — 2026-10-29 20시 KST

20:05:48 KST, 기존 PM AS-M1이 제품 b37287e의 server.js/web/core.js/web/config.js를 현재 PM HEAD d2269ec와 **Git blob·SHA256 3/3 일치** 확인하고 Linux/Node24.22.1 새 격리 합성 저장소에서 실행했다. 서버는127.0.0.1 임의 포트만 사용했고 최종 **6route/6 PASS, HTTP74요청, assertion120개** 통과 후 listener를 종료하고 합성 저장소를 제거했다. 제품 결함 재현 없음·제품 코드 수정 없음.

| 경로 | 실제 확인 |
| --- | --- |
| GET /api/health | 200/status/version/no-store, 외부Host·Origin403 |
| GET /api/bootstrap | 로컬 합성 세션200, 역할5종 토큰 분리. 운영 인증 성공 아님 |
| GET /api/state | 각 역할200, 무인증/잘못된토큰401, 보호자 연결번호 비공개, 재기동 후 전체 상태 동일 |
| GET /api/places | 무인증401/잘못된검색어400/키명시적제외503, 별도 fixture 응답200·잘못된좌표 제외, upstream오류502 |
| POST /api/events | 비객체5종400/잘못된JSON400/크기413, 역할위조403, 동일요청 replay·버전동일, 키재사용/버전/trip409. READY→VEHICLE→출발→도착→번호→인계자확인 시 VERIFYING→시설확인 COMPLETED→보호자조회 |
| POST /api/reset | guardian403, 비객체5종400·기존완료유지, simulator200·구토큰401/신토큰유효. 어르신동의→쉬운알림→시설ACK가 대면인계완료로 바뀌지 않음 |

지도 fixture3회는 주입 함수의 합성 응답이다. 실제 외부 HTTP·Kakao REST·기관·클라우드 호출0건이며 유효 실키를 읽거나 탐색하지 않았다. 전화/기기/AAOS/실차 검증이 아니다. 시험 토큰과 연결번호는 메모리/임시 합성 저장소에만 두고 요청 로그/GitHub에 기록하지 않았다.

## 시험 준비 오류 보존
첫 fetch클라이언트는 custom Host를 실제로 보내지 않아 expected403에200으로 중단했다. node:http로 실제 Host를 보내도록 시험 클라이언트만 수정했다. 두 번째는 저장 이전 서버 재기동 후 이전 role token을 재사용해401로 중단했다. bootstrap을 갱신했다. 최초 준비 소스 staging에 추가됐던 trailing LF1개도 제거하고 Git blob3/3 확인 후 최종74/120을 다시 실행했다. 이 과정은 제품 수정이 아니며 초기실패 JSON과 최종 결과를 모두 보존한다.

[기계 결과](../build-reports/pm-20261029/http-six/result.json). 재현은 새 격리디렉터리에 지정소스의 server.js/web/core.js/web/config.js와 harness.cjs를 같은 구조로 배치해 수행한다. 실제 사용자 저장소/키/기기를 연결하지 않는다. 최종 숫자를 과거 초기실패·CI Node131·Android JUnit·물리QA와 합산하지 않는다.

최신 CI40820861095/b37287e 성공, PR2 Draft/open·게시 v0.3.0-preview는 새로 읽었으며 새 빌드/설치/CI/공개배포/실제제출0건이다. 공식v6·봉인r4/r5·원래 앱/데이터/서명 보존. 설치본과 후보 서명 차이/새release 실기기/독립QA 차단은 유지된다.
기존 원격 월 한도 재시도·재연결·우회0. 현재 OPS/락/instrumentation/writer/기기상태 미관측·IT13 원장 미반영. 야간 Slack 미발송, 주간 송신 영수증/폰push 미확인(당일공개검색0건만으로 실패확정 안 함).

다음 단일 기존 PM AS-M1: 합성 저장소 쓰기 실패 시 상태·중복요청 영수증 보존/완료 오표시 방지와 복구 후 재시도를 한정 검증한다.
