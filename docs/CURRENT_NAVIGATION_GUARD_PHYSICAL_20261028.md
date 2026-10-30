# 현재 검증 앱 비차량 Navigation guard 실기기 회귀 — 2026-10-28 19시

기존 PM(임시 AS-Q1)이 18:59:21–18:59:27 KST 현재 설치 앱을 그대로 사용해 **NavigationGuardTest 1회, OK (1 test), 0.985초 / ADB exit0**를 확인했습니다. 두 실제 bridge 호출의 거절·callback·안내 문구·adapter null과 localStorage 전체 키/값 동일성이 통과했습니다. PM 자체 QA이며 실제 차량 연결이나 release 자체 실행 통과는 아닙니다.

| 구분 | 이번 실제 대상 |
|---|---|
| 소스 | 99d5da02f20d3523d55897795d1f4a6b1fb1690a |
| 앱 | kr.co.ansimdonghaeng.verifyqa / 93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045 |
| 테스트 | kr.co.ansimdonghaeng.verifyqa.test / dacb173a0e729eb0c74613b653697f55fc2adb62c652b477ead7d904cfaa1ae7 |
| class | kr.co.ansimdonghaeng.NavigationGuardTest |
| 방법 | nonAutomotiveBridgeRefusalsPreserveState |
| 실제 환경 | 물리 Android16 비차량 휴대폰, 기존 지속서명 verifyQa |

## 신규 실행 근거

- 18:58 사전조회에서 lock/활성 instrumentation/관련 writer 없음, keyguard showing=false·inputRestricted=false. 실행 직전 재검사 후 CreateNew 독점 claim 취득. 매번 시험시간 재승인은 요구하지 않음.
- 설치5종 전체 SHA를 기준과 대조하고 runner target이 verifyqa임을 확인. 같은 소스의 NavigationGuardTest 실제 내용을 읽었으며 새 빌드·설치 없이 실행.
- 18:59:23.470 CHECK_NAVIGATION_DENIED CALLBACK_AND_TOAST_OK ADAPTER_NULL.
- 18:59:23.488 SAMPLE_ROUTE_DENIED CALLBACK_AND_TOAST_OK ADAPTER_NULL.
- 18:59:23.489 NAVIGATION_GUARD_OK NON_AUTOMOTIVE_ACTUAL SAVED_STATE_UNCHANGED.
- 원시 JUnit에 numtests=1, 상태코드0, 최종 OK (1 test), Time0.985 확인. 프로세스 exit0만으로 판정하지 않음.
- 시험은 실제 FEATURE_AUTOMOTIVE=false를 확인하고 두 안내 문구가 WebView 본문에 표시되는지 검사. 임시 callback 관찰 함수를 finally에서 복원. native UX flag·저장값·응답을 주입하지 않음. 실제 물리 터치/PNG 육안 검수·인간 사용성 승인은 이번 범위가 아님.
- 18:59:27.809 own claim 정상 반납. 19:00:00 후속조회 lock/활성 instrumentation/관련 writer 없음.

## 보존·경계

설치5 APK 전체 SHA 전후 동일. 봉인 후보 r4 체크섬20/20·SUMS419f736a…d31a 유지. 새 제품코드/빌드/설치/주소시험/DOM시험/CI 요청0. 원본 release/.qa/.qa.test 데이터 삭제·초기화·서명 강제교체0. main/easy/address·미커밋·봉인r1–r4·같은ID 공식 DOCX/PDFv5·개인메일 검토초안 보존.

최신 PR2 Private/Draft/open·미병합 HEAD854d1b63, CI40592432776/source99d5da0 3검증job성공·publish skipped, 게시 v0.3.0-preview만 재조회. CI Android15 release f3b8와 이번 Android16 verifyQa930을 합산하지 않습니다. 10시 공식주소1/17.637초·11시 DOM1/9.678초 및 각각 cold는 같은 현재 설치본의 다른 시험 범위이며 이번 신규 통과 건수에 넣지 않습니다.

이번 결과는 비차량 guard만 확인합니다. NaviHelper 실제 초기화/바인딩·연결 retry 경로·AAOS/실차 경로 완료·인증 REST/기관클라우드·사람사용성·독립QA·release물리·실제제출은 미완료입니다. 18시 조사한 release 설치본 c094/cert74f3와 후보f3b8/cert187a의 서명 차이 및 별도 연결 시험기 부재 차단은 그대로입니다.

다음 단일 기존 PM(AS-M1): **현재930/testdac GeocoderBridgeTest 공개장소 질의1회**로 실제 callback/결과·전체 localStorage 동일성 검증. 이전 다른 APK의 Geocoder 통과를 현재 앱에 전용하지 않으며 새 빌드/설치·실기관전송 없이 독점 claim 선행.

18시 기존 Slack 게시를 이번 별도 검색에서 확인했습니다. 새 Slack 발송0·야간 추가 발송0, 폰 push 수신은 미확인. 이 대화방 보고는 별도로 유지합니다.

원문: IT13 IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261028T1857 (run.ps1, result.json, NavigationGuardTest.txt, guard-markers.txt, instrumentation-target.txt, installed-before.json, preservation.json, claim-released.json). 선행 양원장·standing·배정·PR지정/최신후속·03시 최초 실패/11시 후속 결과를 직접 읽었습니다.
