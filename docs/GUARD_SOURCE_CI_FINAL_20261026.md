# 41c1812 CI 최종 결과와 APK 대조 — 2026-10-26 02시

직전 진행 중이던 [CI40210143323](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40210143323)는 **01:07:04–01:17:16 KST**에 종료했다. 소스 `41c1812013d395b90d9c6ae7a35ccdcee8b377f4`, 이후 HEAD는 문서/근거다. 기존 PM의 원본 로그·실제 아티팩트 검토이며 독립 QA/감사 승인이 아니다.

## 최종 실행 결과

| 작업 | job | 결과 |
|---|---:|---|
| verify-build | 121219415230 | success |
| live-address | 121220396171 | success |
| native-smoke | 121220396101 | success |
| publish | 121221850456 | skipped |

3개 원본 job 로그와 실제 ZIP 내부 결과를 확인했다. Node **112/실패0**, 통신 중 저장 지연 회귀의 dialog 닫힘·새로고침 유지 통과. PC launcher/HTTP server에서 실제 공식 주소 선택·저장·새로고침·지도 표시와 직접파일 launcher 안내를 확인했다.

Android15 release 에뮬레이터는 공식 주소 instrumentation **1개/52.530초**, APK UI **7개**, DOM instrumentation **1개/16.075초** 통과. check-status 종료코드5개 모두0, MAP_INTENT_OPENED/PRIMARY_HANDOFF_OK/EASY_ARRIVAL_ACK_OK를 원본 파일에서 확인했다. PC·HTTP의 검사7개와 APK UI7개는 서로 다른 목록이며 새로운 기능 수로 더하지 않는다.

NavigationGuardTest·GeocoderBridgeTest·DialerBridgeTest는 이 CI의 런타임 대상이 아니다. 새 Guard 클래스가 실제 테스트 APK dex에 포함됐고 source ZIP의 해당 Java blob이 `ddca594e8dd6ea436155939fbe5d8f205821fe4e`와 일치함을 확인했지만, 컴파일·포함을 실행 통과로 표시하지 않는다. 01시 실제 휴대전화 guard1/0.896초는 별도 근거다.

## 실제 다운로드 검수

| ZIP | ID | 바이트 | SHA256 |
|---|---:|---:|---|
| build | 12605595895 | 5643172 | e618061b224de21e3f25e759d105cedf88d40f59e022df6837f3ee5b1282fea1 |
| native | 12605616761 | 1352317 | 52edc506835ff5cfe33655582f3b3b0e94dac25ca207a0c858ddcfbb6efb2526 |
| live-address | 12605795619 | 232030 | 97b27df3bb8622789ebb51abb3b915c331d6e6fbf0e7d4862bebea3adf23fe16 |

3개를 실제 다운로드해 길이/해시를 GitHub digest와 대조했다. QA manifest의 source/run과 원본 source-sha도 해당 커밋/CI와 일치했다.

| CI APK | 바이트 | SHA256 |
|---|---:|---|
| release | 5170796 | 7801e8ffc7e393662ad73c57c3cfb385261b6dcc63405b737359a326504fe8a5 |
| QA | 5170820 | 8d31aedf946bc21d29332eff0bec47d871463973520cadc61a47142fd17949b4 |
| QA test | 828952 | 6dbae80446a49fe2330eea2abf6b7ff9a342e3cc4d871cb3ef1ee5db910f17e0 |

실제 APK 길이·SHA 및 APK Signing Block v2의 인증서 DER 지문 **96f4f72921d8c9d5a2c1d3fab694d2861281e2184f534b85194cd1b2b15e1bd6**이 CI manifest와 일치했다. 이 검토에서 별도 전체 암호학 apksigner 재검증을 실행한 것은 아니다.

CI manifest/검사에 기록된 release `kr.co.ansimdonghaeng`, QA `kr.co.ansimdonghaeng.qa`, test `.qa.test`→대상 `.qa`, debuggable=false를 구분했다. release와 QA의 실제8개 assets가 서로 같고 직전 ec699 CI 제품 assets와도 동일했다. 제품 b227 Java/Kotlin·공개 release 정책은 이번 test 추가로 변경되지 않았다.

CI 인증서는 설치된 지속 검증키323cea98와 다르다. **CI APK를 휴대전화에 설치하지 않았다.** 현재 실제 단말은 앱 c5aad9ee·테스트41900b95이며, CI QA/test의 다른 패키지/해시·인증서와 합산하지 않는다.

## 유지·후속

IT13 최신 위임/상시승인/배정/01시 result·PR2 댓글을 읽었다. claim/관련 writer/진행 instrumentation 일치 항목은 없었으며 읽기 전용으로 유지했다. 새 빌드·설치·폰 UI 시험 없음. 01시 PM 자체 QA의 두 비차량 거절 응답/실제 toast/전체 저장 상태 동일·원본 앱 보존은 유효하다. 독립 AS-Q1/AS-A1 ACK·승인, 실제 AAOS UX 상태 및 서비스 연결/오류/경로 완료는 여전히 미확인이다.

DOCX/PDF version2·17시 13쪽 시각검토 기록 유지, 이번 원본 재편집·재검증 없음. main/easy/address 보존, Draft PR 미병합, v0.3.0-preview만 공개, 0.4.3 미게시·실제 공모전 미제출. [기계 판독 근거](../build-reports/pm-20261026/guard-source-ci-final.json).

다음 단일 기존 PM은 공식 접수 요건·현재 제출본과 남은 실제 환경 검증 조건을 대조한다. 유효 REST 인증·기관/클라우드·실차·독립 QA/사람 사용성은 미완료로 유지한다. 전체 진척률·지난주 비교 미산정. 야간 Slack 미발송, 현재 대화 결과 보고 유지. 새 에이전트/예약/수신자/공개 runner·비용·배포 없음.
