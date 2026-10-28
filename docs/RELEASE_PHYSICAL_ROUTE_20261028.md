# release 실기기 경로 사전검수 — 2026-10-28 18시 KST

기존 PM(AS-M1)이 18:05–18:07 읽기 전용으로 조사했습니다. **현재 연결된 물리기기는 1대이며 별도 시험기는 없습니다. 기존 release와 후보는 같은 패키지·버전이지만 서명이 달라, 기존 앱을 보존하는 정상 업데이트 경로가 차단됩니다. 설치는 시도하지 않았습니다.** 이 판단은 현재 IT13 ADB 서버 범위이며 다른 장소의 기기 부재나 향후 가용성을 뜻하지 않습니다.

| 항목 | 현재 설치 release | 현재 후보 release |
|---|---|---|
| 패키지 | kr.co.ansimdonghaeng | kr.co.ansimdonghaeng |
| versionCode / versionName | 9 / 0.4.3 | 9 / 0.4.3 |
| 크기 | 5,170,048B | 5,171,400B |
| SHA256 | c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54 | f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f |
| 서명 SHA256 | 74f3b4db72749aa904fd281ca45c531b271bd8894a65e2117a6a27e4333dd136 | 187a401de35e4a9ecc5f8630ab4912c4e4884a9106bdf6b1b76c7ceb97bc5826 |
| 전체 apksigner | verify exit0 / v2 true / v3·v3.1 false | 동일 검사 결과 |

설치된 base.apk를 읽기 전용 pull로 ASCII 로컬 경로에 회수하고 전체 SHA·apksigner·aapt package/version을 직접 대조했습니다. 휴대폰 데이터·화면에는 접근하지 않았습니다. 두 APK의 서명 인증서가 다르고 회전 증거가 없어 보존 업데이트에 적합하다고 볼 수 없습니다. 서명 오류를 재현하려고 설치/삭제/초기화/강제교체하지 않았습니다. 새 프로필 생성·기기 권한 확대·추가 원격 접속도 없습니다.

ADB 연결 목록에는 물리1/에뮬레이터0/offline·unauthorized0. 별도 물리기기에서 현재 후보를 실행하는 경로는 가용하지 않습니다. 에뮬레이터를 새로 가동하거나 QA package로 다시 빌드해도 동일 release의 물리 검증이 되지 않으므로 수행하지 않았습니다. 후보를 재서명하는 것도 f3b8 원본 바이트 검증과 구분해야 합니다.

## 실제 검증·보존 범위

18:07:17 후보 r4 체크섬20/20·SUMS419f736a…d31a, 설치 APK5종 전체 SHA가 직전17시와 동일합니다. AS_Q1_DEVICE.lock/활성 instrumentation/관련 writer 없음. 새 제품수정·빌드·설치·폰UI·JUnit·CI 요청0. 원본 main/easy/address·미커밋·앱데이터·봉인r1–r4·공식 같은ID DOCX/PDFv5·개인메일 검토초안 보존.

PR2 Private/Draft/open·미병합, HEAD4d1c8005. 최신 CI40592432776/source99d5da0의 verify-build/live-address/native-smoke 성공·publish skipped와 v0.3.0-preview만 게시된 상태를 재조회했습니다. 10시 verifyQa930/testdac 공식주소1/17.637초·주소cold, 11시 DOM1/9.678초·쉬운ACKcold는 별도 PM 자체 QA의 과거 결과입니다. 17시 release f3b8와 verifyQa930의 정적 비교도 release 물리 PASS를 대신하지 않습니다.

release 실기기·독립 QA·사람 사용성·실차/Pleos routing·유효 REST/기관클라우드·심사 접근/서명 허용·실제 제출은 미완료입니다. 다음 업무가 가능한 QA 범위이므로 반복 관제 전체가 차단된 것은 아닙니다.

## 다음 단일 작업

**기존 PM(AS-M1): 현재 설치 verifyQa930/testdac에서 NavigationGuardTest 1회.** source99의 실제 class를 읽었으며 비차량 단말의 checkNavigation/requestSampleRoute 거절·callback/안내·adapter null·localStorage 동일성을 검사하고 임시 관찰 callback을 복원합니다. 최신 APK의 비차량 guard 회귀이며 연결 성공·재연결 retry 실행·실차 경로 완료를 증명하지 않습니다. 기기 점유/잠금/동시작업을 다시 확인한 뒤 독점 claim으로 시행하고 기존 통과 주소/DOM 시험은 중복하지 않습니다.

원문: IT13 Task/Win-Win-Challenge-QA-20261024/AS-M1-PM-20261028T1804 (private 기기목록, APK 회수 로그, 서명/manifest, 결과 JSON). 기기 serial은 GitHub·Slack에 게시하지 않습니다. 원격 write/start 최초 시간초과는 get_tool_result 및 프로세스/결과 부재 확인 후 이어 실행했으며 설치 재시도나 제품 실패로 합산하지 않습니다.
