# 2026-10-28 11시 현재 verifyQa 실기기 DOM·쉬운 알림 콜드 복원

2026-10-28 11:06:43–11:07:06 KST, 총괄 PM 자체 QA. 현재 설치된 verifyQa에서 DOM instrumentation 1회만 실행했고 빌드/설치는 0회다. 독립 QA 승인·사람의 터치 사용성·release 실기기 검증으로 확대하지 않는다.

- 제품/시험 소스: `99d5da02f20d3523d55897795d1f4a6b1fb1690a`. 직전 문서 HEAD `001c2a5`.
- 앱 SHA-256: `93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045`.
- 테스트 SHA-256: `dacb173a0e729eb0c74613b653697f55fc2adb62c652b477ead7d904cfaa1ae7`.
- 패키지: `kr.co.ansimdonghaeng.verifyqa` / `.verifyqa.test`, runner/target 실제 조회.

## 실제 증거

`DomFlowTest.txt` 원문: `Time: 9.678`, `OK (1 test)`, instrumentation exit 0. 현재 실행 시간에 속하는 `PRIMARY_HANDOFF_OK` (11:06:51.523), `EASY_ARRIVAL_ACK_OK` (11:06:54.401)를 원본 로그에서 확인했다. 수동 주소 입력, 출발·도착, 연결번호, 인계자/시설 인수자, 보호자 완료 및 쉬운 알림/시설 확인은 DOM 클릭/입력 시험 범위다. 공식 주소 picker 시험과 별개다.

verifyQa만 force-stop → pid 부재 → MainActivity start. `cold-launch.txt` COLD/Status ok. Activity TotalTime 344ms는 WebView 준비 시간으로 해석하지 않는다. 후속 XML 및 `cold-private.png`에서 “도착 소식을 남겼어요 / 담당자가 확인했어요”를 직접 확인했다. 최종 쉬운 알림 방문 상태의 복원이며 앞선 유치원 양측 인계 상태까지 동일 저장 상태로 콜드 검증한 것은 아니다.

5개 설치 APK 해시 모두 전후 동일. 기존 release/qa/qa.test 삭제·초기화·교체 0회. QA 합성 방문 데이터만 시험 과정에서 변경했다. r2 봉인 16개 체크섬 재검사 모두 일치, SHA256SUMS.txt `465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c`. 자기 claim 11:07:06 해제, 11:09:12 lock/활성 instrumentation 없음.

## 직전 대비·남은 차단

10시 현재 verifyQa 공식 주소 JUnit 1건(17.637초) 및 주소 콜드 복원에 더해, 이번에 현재 verifyQa DOM 1건과 쉬운 알림 시설 확인 콜드 복원이 추가됐다. 이전 실패 로그와 10시 PC 한글 경로 이미지 pull 실패는 삭제하지 않는다. 최신 CI40592432776 성공은 Android15 에뮬레이터 release 범위이며 이번 실기기 verifyQa와 합산하지 않는다.

봉인 r2/문서 v4는 이전 f1164b0·75b53185 기준이며 최신 CI release f3b8c701과 버전 대조가 남아 있다. release 실기기, 독립 QA/사람 사용성, 실차 경로, 인증 외부 API, 실제 제출은 완료로 판정하지 않는다. 공개 배포/제출은 별도 승인 대상이다.

다음 단일 책임자: **총괄 PM (AS-M1)**. 다음 작업: 기존 r1/r2·문서 v4 보존 후 최신 source99d5da0/CI40592432776/release f3b8c701의 별도 후보 r3 및 문서 버전 대조. 동일 폰 시험/설치/빌드 반복 불필요.
