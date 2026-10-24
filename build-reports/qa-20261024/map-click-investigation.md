# 지도 클릭 회귀 조사 — 2026-10-24 18:02 KST

대상 소스341bc88, CI40076247150, native artifact12553776343
ZIP SHA256 f94ec55f441ecc046259d58d70e74de3794da2fd84d513f696e26a95066f2c9b를 다운로드 바이트와 대조했다.
공식주소 instrumentation OK(1 test), 주소 저장 유지 후 MAP_INTENT_OPENED assertion 실패.
원본 window.xml의 지도 clickable 노드 bounds=[94,1808][987,1859]로 51px만 남아 있다.
WebView bounds=[0,63][1080,1859], 지도 TextView bounds=[336,1855][745,1859]는 4px다.
01-launch.png를 직접 열어 버튼이 화면 아래에서 잘린 것을 확인했다.
상태 표시 영역은 [315,1716][766,1850]로 기존 중심 탭(540,1833)과 겹친다.
이는 클릭 하네스 결함의 직접 근거이며 앱/외부 지도 자체의 고장 또는 정상 판정은 아니다.

test/android_smoke.py: 클릭은 높이64px 이상이며 WebView 상하 경계 여유를 확보한 대상으로 제한하고, 나머지는 기존 스크롤/재조회한다.
지도 전후 화면과 해당 HandoffMap 로그도 별도 보존한다.
실패 artifact XML에서 기존 대상은 거절하고 동일 노드를 완전히 보이는 위치로 옮긴 fixture는 허용하는 검사를 실제 실행했다. Python 컴파일 성공.
실제 APK 후속 실행은 CI 결과로 별도 판정한다. release/QA 앱 코드는 변경하지 않았다.
AS-Q1 수신/점유/실기기 실행과 AS-A1 독립 감사는 18:00 조회 범위에서 새 근거 미확인.
기존 QA APK2903bc14/c73efa79의 빌드·해시와 IT13 준비는 유효하며 새 시험 커밋용 바이너리와 혼합하지 않는다.


## 後속 결과 2026-10-24 18:12 KST
150cd5f/CI40080392976 verify-build(Node112/실패0·QA metadata)/live-address 성공.
공식주소 instrumentation OK(1 test), 저장유지 및 실제 MAP_INTENT_OPENED(18:10:07 KST) 성공.
그 뒤 시설 탭 접근성 탐색 실패로 native-smoke 실패, 이후 인계/DOM 미실행.
native ZIP12555515596 SHA256 e1404c2a162dbcc162d40ce868d0754c5ece3d0806b3dc5a42777a2d6795e0c5 대조, 원본 XML을 읽었다.
시설 탭은 [543,76][784,246], WebView 상단63으로 실제 가시 상태인데 새 상단여유16px 조건(79)이 제외했다. 이는 이번 검사 수정의 과도한 상단여유로 발생한 하네스 회귀다.
상단여유를 제거하고 하단32px·최소높이64px 조건은 유지한다. 두 실제 실패 XML로 잘린 지도 거절 및 정상 고정탭4개 허용을 재검증했다. Python 컴파일 성공. 실제 새 APK 시험은 후속 CI로 별도 판정한다.
