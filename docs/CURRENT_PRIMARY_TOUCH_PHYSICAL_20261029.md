# 현재 verifyQa 실제 주요 버튼 인계·콜드 복원 — 2026-10-29 02시 KST

기존 PM(임시 AS-Q1)이 설치된 **verifyqa930/source99**에서 실제 ADB 탭·스크롤·숫자키 입력으로 유치원 방문 인계 1시나리오를 확인했습니다. **JUnit0·새빌드0·설치0**, DOM/JS/상태 주입0이며 PM 자체 QA입니다.

- 소스 `99d5da02f20d3523d55897795d1f4a6b1fb1690a`
- 앱 `kr.co.ansimdonghaeng.verifyqa` SHA256 `93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045`
- 설치test dacb173a는 이번 미실행. 이전bd 앱10/27 19시 touch·10/28 11시 DOM1/9.678초·공식picker 시험과 별도입니다.

## 실제 관찰

1. 최신양원장/standing/배정·PR2지정6387088890/후속6393949101·03시최초실패·최근22시지도/01시인계 읽음. QA lock/관련writer·현재CI실행없음을 확인하고 CreateNew 독점claim 취득·설치5SHA확인. 정책잠금검사/실제QA전면 확인, 잠금우회0.
2. 최초 상태는 22시 지도검증 뒤 **유치원 준비 상태**였습니다. 저장 공개주소 서울중구세종대로110이 보였습니다. 새방문/주소입력을 반복하지 않고 같은 방문에서 버튼을 완전히 노출한 뒤 방문 시작→이동 표시·편집제한→도착을 확인했습니다.
3. 시설 준비가 유효하지 않아 연결번호 버튼이 비활성이고 준비 안내가 나타났습니다. 실제 '시설에서 준비 확인하기'→'맞이할 준비 완료'→인계자 복귀 뒤 번호 발급 가능 상태로 바뀌었습니다. 시설준비 전 거절이 예상 동작이며 준비시간 경계 재측정은 아닙니다.
4. 6자리 연결번호 발급→직접 인계했어요→시설 탭→같은 번호를 실제 EditText/숫자키로 입력→직접 인수했어요. 시설 '인수를 완료했어요'/'✓ 양쪽 확인 완료', 보호자 '인계를 마쳤어요'와 **확인됨5개**를 실제XML로 확인했습니다. 번호원문은 비공개XML에만 보존합니다.
5. QA만 force-stop→pidof부재→실제 `Status:ok/LaunchState:COLD/TotalTime439ms/Wait445ms`. 첫 cold XML은 준비 전 문구0으로 보존했고 후속에서 완료제목·확인5개를 확인했습니다. 별도 실제 스크롤로 주소를 노출하고 XML/PNG로 복원 확인했습니다.
6. guardian-complete/cold-restored/cold-address-visible PNG를 직접 검수했습니다. **Activity439ms는 전체WebView/UI준비시간·성능PASS가 아닙니다.** 30XML, 비공개PNG/해시·tap시각/실행로그·원본도구오류 보존.
7. 02:04:25.439 ownclaim반납·lock없음,02:05:01 r4체크섬20/20·SUMS419f736a…d31a/설치5SHA전후동일. 원본release/.qa/.qa.test·appdata·main/easy/address/미커밋·봉인후보r1–r4·공식v5문서/비공개메일초안 보존.

QA합성 방문은 준비→완료로 변경됐습니다. 전체 localStorage 키/값 동일성 검사가 아니며 데이터보존과 합성 상태 변경을 혼동하지 않습니다.

## 도구 관찰·한계

초기 screencap의 Multiple displays 경고를 PowerShell이 NativeCommandError로 처리해 첫 helper가 중단됐습니다. adb stderr 처리만 보완했고 이후QA이미지를 직접 확인했습니다. helper 출력함수 경계문자열 편집 실패는 실제동작 전 보완했습니다. 시설준비 첫검색에 잘못된 일본어 라벨을 사용한 TARGET_COUNT_0은 **탭전중단** 후 관찰된 한국어라벨로 수정했습니다. 첫 `dumpsys activity instrumentation`은 이 기기 미지원으로, 전체 dumpsys activity/기기process·hostwriter 조회로 보완했습니다. 이를 제품실패나 모든스크립트첫회통과로 보고하지 않습니다.

원문 IT13 `Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261029T0157`의 result.json·installed-before/after·claim-released·cold-start.log·XML/privatePNG. 사진상태표시줄/연결번호를 GitHub/Slack에 게시하지 않습니다.

CI40592432776/source99 Android15releasef3b8 성공·publishskipped/PR2PrivateDraft미병합·게시v0.3.0-preview만 재조회. 현재930 PM자체QA를 exact release물리·독립QA·사람사용성·유효REST/실차Pleos/AAOS·기관클라우드·실제제출 승인으로 확대하지 않습니다. release c094/cert74f3 vs f3b8/cert187a의 보존설치차단도 유지됩니다.

다음 단일 담당 기존 PM AS-M1: 현재 verifyQa930의 쉬운 화면 도착 알림→시설 ACK→QA 콜드 복원을 실제 주요버튼 1회로 확인. 현재 인계완료 방문과 쉬운 고령자 알림 방문을 분리하며 fresh claim·잠금·동시작업 확인, 원앱보존·실기관전송/새빌드설치0.
야간Slack발송0/이전18시게시읽기만·폰push미검증,새예약·수신자·agent0.
