# 현재 verifyQa 전화 bridge 실기기 회귀 — 2026-10-28 21시

기존 PM(임시 AS-Q1)이 20:57:28–20:57:36 KST 현재 설치 앱에서 **DialerBridgeTest 1회, OK (1 test), 2.085초 / ADB exit0**를 확인했습니다. 합성 번호의 실제 ACTION_DIAL dispatch와 해결된 전화 앱 패키지의 화면 노출을 관찰하고, 명시적 QA 복귀 뒤 전체 localStorage 키/값 동일성을 검사했습니다. PM 자체 QA이며 실제 발신/주요 연락 버튼 사용성/release 실기기 통과는 아닙니다.

| 구분 | 실제 대상 |
|---|---|
| 소스 | 99d5da02f20d3523d55897795d1f4a6b1fb1690a |
| 앱 | kr.co.ansimdonghaeng.verifyqa / 93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045 |
| 테스트 | kr.co.ansimdonghaeng.verifyqa.test / dacb173a0e729eb0c74613b653697f55fc2adb62c652b477ead7d904cfaa1ae7 |
| class / method | kr.co.ansimdonghaeng.DialerBridgeTest / opensDialScreenWithoutPlacingCall |
| 환경 | 물리 Android16·지속서명 verifyQa |
| 범위 | ACTION_DIAL→실제 dialer package visible→QA 복귀·저장 보존 |

20:57 사전조회 및 실행 직전 lock/활성 instrumentation/관련 writer 없음, keyguard showing=false·inputRestricted=false. CreateNew 독점 claim 후 설치5 SHA·runner target verifyqa 확인. 실제 test 소스를 읽고 ACTION_CALL을 오류로 막는 monitor, 합성번호 ACTION_DIAL 실제 dispatch 관찰(외부 Activity 응답 위조 없음), 전화 앱 패키지 화면 존재검사, finally QA 복귀를 확인했습니다. 전화 앱 컨트롤 입력/화면·XML 수집·연락처/통화기록 조회/실제 발신/실기관 전송은 없습니다.

## 신규 실행 근거

- 20:57:31.942 ACTION_DIAL_OBSERVED DIALER_PACKAGE_VISIBLE NO_CALL_ACTION.
- 20:57:32.273 DIALER_BRIDGE_OK RETURNED_TO_QA SAVED_STATE_UNCHANGED.
- 원시 JUnit numtests1·상태코드0·Time2.085·최종 OK (1 test)를 직접 검수. 프로세스 exit0만으로 성공 처리하지 않음.
- 20:57:36.217 own claim 정상 반납. 21:00:32 후속 lock/활성 instrumentation/관련 writer 없음.

설치 APK5종 SHA 전후 동일. 봉인 후보 r4 체크섬20/20·SUMS419f736a…d31a 유지. 새 제품수정·빌드·설치·다른 JUnit/CI 요청0. main/easy/address·미커밋·원앱데이터·봉인r1–r4·같은ID 공식 DOCX/PDFv5·개인메일 검토초안 보존.

보존 보조스크립트 읽기에 remote internal error가 반환됐는데 이를 검증 없이 스크립트 본문으로 추출해 첫 preserve.ps1 실행이 실패했습니다. 원문 오류 스크립트는 보존했습니다. 수정 helper 쓰기도 원격 timeout/파일없음으로 확인되어, 명시적 PowerShell 후속 검수를 실행해 위 결과를 확보했습니다. **제품/JUnit 실패가 아니며 재설치·시험 반복0.** 이 오케스트레이션 오류를 통과 결과로 덮지 않습니다.

최신 PR2 Private/Draft/open·미병합 HEAD4884769d, CI40592432776/source99d5da0 3검증job성공·publish skipped, 게시 v0.3.0-preview만 재조회. CI Android15 release f3b8와 이번 Android16 verifyQa930을 합산하지 않습니다. 같은 앱 10시주소·11시DOM/cold·19시비차량guard·20시Geocoder는 각각 다른 이전 시험입니다. release 설치본 c094/cert74f3와 후보 f3b8/cert187a 서명 차이·별도 연결 시험기 부재는 그대로입니다.

release 실기기·독립 QA·사람 사용성·실차/Pleos·인증 REST/기관클라우드·심사 접근/실제 제출은 미완료입니다.

다음 단일 기존 PM(AS-M1): **현재930의 저장된 공개 도착지 지도 주요버튼→실제 외부 지도 표시→명시적 QA 복귀** 1회 검증. 소스/최신 점유·잠금/독점 claim을 먼저 확인하고 새 빌드/설치·경로 안내 시작·실전화/기관전송·다른 개인정보 탐색 없이 진행합니다.

원문 IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261028T2055 (run.ps1, result.json, DialerBridgeTest.txt, guard-markers.txt[실제내용Dialer], runner, 설치전후, preservation.json, claim-released.json, 보존검수 원본오류). 공통원장 첫 read internal error는 재조회 후 읽었습니다. 양원장/standing/배정·PR지정/최신후속·03시원본실패/20시최신 QA 선행조회. 기존18시 Slack 게시만 읽었으며 신규·야간 Slack발송0, 폰push수신 미확인입니다.
