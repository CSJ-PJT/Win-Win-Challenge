# 현재 verifyQa Geocoder 실기기 회귀 — 2026-10-28 20시

기존 PM(임시 AS-Q1)이 19:58:03–19:58:10 KST 현재 설치 앱에서 **GeocoderBridgeTest 1회, OK (1 test), 1.283초 / ADB exit0**를 확인했습니다. 공개장소 검색의 실제 callback은 408ms, 결과1·유효 좌표·오류없음이며 전체 localStorage 키/값이 같습니다. PM 자체 QA이며 release 실기기나 독립 QA 승인은 아닙니다.

| 범위 | 실제 대상 |
|---|---|
| 소스 | 99d5da02f20d3523d55897795d1f4a6b1fb1690a |
| 앱 | kr.co.ansimdonghaeng.verifyqa / 93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045 |
| 테스트 | kr.co.ansimdonghaeng.verifyqa.test / dacb173a0e729eb0c74613b653697f55fc2adb62c652b477ead7d904cfaa1ae7 |
| class / method | kr.co.ansimdonghaeng.GeocoderBridgeTest / publicPlaceThroughActualBridge |
| 환경 | 물리 Android16, 기존 지속서명 verifyQa |
| 요청 | 서울시청 공개장소 질의1회, VehicleBridge.searchAddress→Android Geocoder |

## 실제 실행과 증거

19:57 사전조회에서 lock/활성 instrumentation/관련 writer 없음, keyguard showing=false·inputRestricted=false. 실제 소스의 test 내용을 읽었으며 직전 재검사→CreateNew 단일 claim→설치5 SHA·runner target verifyqa 확인 후 1회 실행했습니다. 매번 시험시간 재승인을 요청하지 않았습니다.

- 19:58:05.968 GEOCODER_PRESENT=true.
- 19:58:06.376 GEOCODER_REAL_CALLBACK count=1 valid=true elapsedMs=408 error=false.
- 19:58:06.390 GEOCODER_BRIDGE_OK SAVED_STATE_UNCHANGED.
- 원시 JUnit numtests1·상태코드0·Time1.283·최종 OK (1 test) 확인. 프로세스 exit0만으로 성공처리하지 않음.
- 임시 onAddressResults 관찰 함수가 실제 응답을 기록하고 원래 callback을 호출합니다. finally에서 관찰 함수를 복원합니다. 응답/저장값 주입·위치 권한 확대·개인정보 탐색·실기관 전송 없음. 주소/좌표 결과 원문은 보고에 게시하지 않음.
- 19:58:10.703 own claim 정상 반납, 19:58:32 후속 lock/활성 instrumentation/관련 writer 없음.

이 검사는 실제 Android Geocoder provider와 bridge callback 범위입니다. 지도 좌표의 지리적 정확도·주요 검색 버튼 사용성·공식 postcode picker·Kakao REST 인증·실차/Pleos 경로·기관클라우드의 성공은 증명하지 않습니다. 물리 터치/PNG 육안 검수·사람 사용성 승인은 이번 범위가 아닙니다.

## 보존과 최신 상태

설치 APK5종 SHA 전후 동일. 봉인 후보 r4 체크섬20/20·SUMS419f736a…d31a 유지. 새 제품수정·빌드·설치·주소/DOM/NavigationGuard 재시험·CI 요청0. 원래 release/.qa/.qa.test와 데이터를 삭제·초기화·서명 강제교체하지 않았습니다. main/easy/address·미커밋·봉인r1–r4·같은ID 공식 DOCX/PDFv5·개인메일 검토초안 보존.

최신 PR2 Private/Draft/open·미병합 HEADd1e32dd4, CI40592432776/source99d5da0의 verify-build/live-address/native-smoke 성공·publish skipped, 게시 v0.3.0-preview만 재조회. CI Android15 release f3b8와 이번 Android16 verifyQa930 시험을 합산하지 않습니다. 현재 앱 10시 공식주소1/17.637초·11시DOM1/9.678초+cold·19시guard1/0.985초는 각각 다른 범위의 이전 시험입니다. 이전 다른 APK의 Geocoder 성공을 이번 결과로 대체하지 않습니다.

release 설치본 c094/cert74f3와 후보 f3b8/cert187a의 서명 차이·별도 연결 시험기 부재는 유지됩니다. release 실기기·독립 QA·사람 사용성·실차·인증외부API·기관클라우드·심사 접근·실제 제출은 미완료입니다.

다음 단일 기존 PM(AS-M1): **현재930/testdac DialerBridgeTest 1회**. 실제 소스·잠금·동시작업·단일 claim을 확인하고 발신 없는 ACTION_DIAL 연결→명시적 QA 복귀·전체 localStorage 보존을 검증합니다. 실제전화/전화화면제어·연락처/통화기록 수집은 금지하고 새 빌드/설치 없이 시행합니다.

원본 IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261028T1957 (run.ps1, result.json, GeocoderBridgeTest.txt, guard-markers.txt[파일명은 공통 실행기 유지·내용은 Geocoder], instrumentation-target.txt, installed-before.json, preservation.json, claim-released.json). 선행 양원장/standing/배정·PR지정/최신후속·03시 원본 실패/19시 최신 QA를 읽었습니다. 18시 Slack 기존 게시만 조회, 신규·야간 Slack 발송0·폰 push 수신 미확인입니다.
