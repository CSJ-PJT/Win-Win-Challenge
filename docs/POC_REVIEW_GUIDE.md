# 11월 1일 제출용 PoC 검토 안내

현재 앱·서버 제품은 8f4aaf9/0.4.3, CI40887985855입니다. 아래 표는 현재 `web/app.js`, `web/core.js`, `server.js`, `web/config.js`를 읽어 화면 조작과 API를 연결한 것입니다. 공식 기획서의 문제·목표·개발계획·별첨 화면설계와 같은 범위입니다. 시연 계정은 없으며 로컬 bootstrap이 생성한 합성 역할 토큰만 사용합니다. 실제 기관·보호자 계정으로 로그인하지 않습니다.

## 화면과 계약

HTTP 모드에서 조회는 GET /api/state, 변경은 POST /api/events입니다. APK·단일 HTML에서는 같은 event를 기기 내 상태 엔진으로 적용합니다. API 응답이 실제 push 발송을 뜻하지 않습니다.

| 화면 ID | 버튼·흐름 | 이벤트·API | 역할·오류 |
| --- | --- | --- | --- |
| V01 / D01 | 도착지 입력·저장 → 방문 준비 | CONFIGURE_VISIT, 주소·상세주소·우편번호 patch | vehicle; 시작 후 VISIT_STARTED, 입력 SETTINGS, 저장 실패시 초안 유지 |
| A01 | 주소 검색·선택·닫기·재시도 → D01 | Android openAddressSearch / 웹 AddressPicker.mount; 공식 주소 반환 | 네트워크 실패시 수동 입력 복귀; REST /api/places와 별개 |
| V02 | 방문 시작하기 → 도착했어요 | DEPART(vehicle), ARRIVE(simulator); 정차 조건 VEHICLE(simulator) | 모의 차량/구역 입력, VEHICLE_UNSAFE·STATE |
| V03 | 연결번호 받기 → 직접 인계했어요 | ISSUE_CODE → SENDER_CONFIRM {inPerson:true} | vehicle; NOT_READY·EXPIRED; 한쪽 확인은 완료 아님 |
| F01 / F02 | 맞이할 준비 완료 → 번호 입력 → 직접 인수했어요 | READY {ready:true} → RECEIVER_CONFIRM {code,inPerson:true} | facility/지정 staff; WRONG_CODE·EXPIRED·NOT_READY; 번호 자동 노출 없음 |
| G01 | 보호자 진행 조회·완료 시각 | GET /api/state (guardian), HTTP 주기 조회 | 직접 확인은 403 FORBIDDEN; 연결번호 비공개. 운영 개인정보 최소화는 후속 과제 |
| E01 / E02 | 쉬운 화면 방문 선택 → 동의하고 계속 | 새 시연은 /api/reset(simulator), SELF_CONSENT(visitor) | 합성 시연 제어; 성인 본인 동의 없으면 CONSENT |
| E03 / E04 | 도착 알리기 → 도착 소식 결과 | NOTIFY_ARRIVAL(visitor), 조회 | 자기 신고 알림; ALREADY_NOTIFIED, 양측 인계 완료와 별도 |
| F01 | 도착 알림 확인 → 쉬운 화면 확인 표시 | ACK_ARRIVAL_NOTICE(facility) | 지정 staff; NO_NOTICE·ALREADY_ACKNOWLEDGED |
| R01 / S01 | 결과 재진입·새 방문·정보 설정 | 저장된 상태 조회 / 새 시연 reset / CONFIGURE_VISIT | 진행 방문 대상 변경 금지, 새 방문만 변경 |

시설·보호자는 시연 역할이며 서버 bootstrap이 모든 역할 세션을 제공하므로 운영 인증/접근통제 완료가 아닙니다. Guardian projection은 연결번호를 숨기지만 모든 개인 필드를 제거하지 않습니다. 실제 개인정보는 입력하지 않습니다. 차량 정차 신호 30초·시설 준비 10분·번호 2분의 유효 조건을 core에서 검사합니다.

| HTTP 계약 | 응답·인증·주의 |
| --- | --- |
| GET /api/health | 공개 로컬 상태 200, LOCAL_SYNTHETIC_DEMO |
| GET /api/bootstrap | 공개 로컬 시연 세션·tripId 200, 운영 로그인 아님. 토큰 저장/게시 금지 |
| GET /api/state | Bearer 역할 토큰; state·serverNow, 무인증401 |
| POST /api/events | Bearer + {tripId,expectedVersion,key,event:{type,payload}}; state·serverNow/error·message. key는 역할별 8~80자, 동일 의도 재전송은 영수증 재사용 |
| POST /api/reset | simulator만 새 합성 방문, 기존 세션 무효화; 다른 역할403 |
| GET /api/places?query=... | Bearer, 2~180자; key 미설정503, 외부 실패502, 5초 제한; 실제 유효 키 호출 성공 미확인 |

상태 충돌·다른 trip·key 재사용은409, 입력 오류400, 저장 실패500입니다. 번호 오류409도 실패 시도 횟수를 저장하므로 응답 state를 읽고 최신 버전으로 재시도합니다. 완료 실패를 성공으로 덮지 않습니다. 응답이 유실된 저장은 기존 pending key를 먼저 해결합니다.

## 한 명의 리뷰어가 재현하는 순서

1. 새 합성 DATA_FILE로 `npm start`. /vehicle·/facility·/guardian를 각각 열고 공개장소 주소만 저장합니다.
2. 인계자에서 방문 시작하기 → 도착했어요 → 연결번호 받기 → 직접 인계했어요. 기본 정차·시설 준비는 시연 초기 조건입니다.
3. 시설에서 틀린 번호가 거절되는지 확인한 뒤 인계자가 보여준 번호로 직접 인수했어요. 보호자는 양쪽 확인·완료 시각을 조회합니다. 이 단계의 보호자 알림은 화면 갱신입니다.
4. 브라우저 새로고침과 서버 종료/재시작 후 같은 DATA_FILE로 주소·완료 상태를 조회합니다.
5. 방문 변경으로 주야간보호센터를 선택해 새 합성 방문을 시작하고 쉬운 화면에서 동의 → 도착 알리기를 누릅니다.
6. 시설의 도착 알림 확인 후 쉬운 화면에 담당자가 확인했어요가 표시되는지, 재진입해 유지되는지 확인합니다. 대면 인계 완료로 바뀌면 실패입니다.

전화·지도는 시스템 화면 연결이며 이 대표 시연에 실전화나 실제 기관 통지를 포함하지 않습니다.

## 자동 재현과 근거

`node tools/poc-e2e.cjs --output build-reports/poc-e2e-local.json`

Node 22 이상만 필요합니다. 임시 파일·임의 loopback 포트와 실제 HTTP를 사용하고 종료 시 자체 임시 자료를 삭제합니다. 제품 서버/상태 엔진을 그대로 사용하며 성공 응답을 fixture로 대체하지 않습니다. 정차·구역·사람은 합성입니다.

2026-10-30 12:02 KST 실행 (현재 제품 blob 5개를 원본과 일치시킨 실행): **2개 흐름/2 PASS, HTTP39요청·54assertion**, Node24.22.1. 원문은 [poc-service-e2e.json](../build-reports/pm-20261030/poc-service-e2e.json). 브라우저·APK·외부서비스 호출0이며 기존 CI135와 합산하지 않습니다. 이 실행환경에는 Chromium이 없어 새 UI 캡처/클릭 검사를 실행하지 않았습니다.

화면 클릭 근거는 기존 CI40887985855의 브라우저 회귀 및 Android15 release DOM JUnit1·UI7, 주소 JUnit1입니다. 공식 기획서13쪽 화면은 b227ca2/CI40167658701의 과거 실제 APK 화면으로 출처를 유지했습니다. 최신 스크린샷으로 바꾸거나 새 촬영으로 표시하지 않습니다.

## 공식 서류와 대조

| 요구·검토 항목 | 현재 자료·판정 |
| --- | --- |
| 기획 배경·문제·목표·차별성 | 공식 기획서2~4쪽: 도착과 인수의 확인 공백, 양측 직접 확인·역할별 화면 |
| 검증·개발 계획 | 5쪽: 제품8f4aaf9/CI40887985855와 과거 물리 verifyQa 분리, 기관·차량 후속 계획 |
| 기대효과 | 6쪽: 2시설/50계정·유지율60%는 목표이며 실적 아님 |
| 화면설계·오류·API | 10~13쪽과 위 ID/권한 표; 설계도와 과거 실제 캡처 구분 |
| 서명·확인일 | 새 작업본의 서명·작성일·서명일 공란. 이전v7 기명/10.23은 버전 이력·r6에 보존. 11/1 본인 확인 후 기입 |
| 첨부 | 필수 접수양식·개인정보 동의/서명. 선택 Private Git 소스+apk/ release·영상·숏폼 |
| 공식 기간 | 10/21~11/15 KST, 정확한 마감시각은 현재 안내에서 미확인. 내부 목표11/1 유지 |
| 선택 Git 접근 | Private 허용, 공지된 심사계정 초대/실접근 확인 필요. 이번 초대/권한변경0 |

10/30 직접 읽은 공식 [지원·제출](https://appdevchallenge.auto-hmg.io/guide/submission), [일정](https://appdevchallenge.auto-hmg.io/guide/schedule), [출품 유의](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000006)를 기준으로 합니다. 필수 서명은 사용자가 수행합니다. Git 접근 확인은 선택 제출의 별도 미완료 항목입니다. release 물리/독립 QA를 1차 기획서 준비 차단으로 확대하지 않습니다.

**현재 ONE blocker: 11/1 실제 본인 확인·서명 전이므로 서명된 필수 서류는 미완료.** 준비한 문서 내용·PoC 근거와 실제 제출은 구분합니다. 최종 제품 항목은 [후속 개발 계획](PRODUCT_BACKLOG_20261101.md)으로 관리합니다.
