# 테스트 시작 역할 수정·주소 콜드 복원 — 2026-10-26 10시
AS-Q1-PM-20261026T0957 / 기존 PM 자체 QA. 제품741/app4edaf75c는 유지하고 테스트 시작 상태만 수정했습니다.

## 이번 실제 실패와 수정
09:58:58–09:59:24KST 설치 테스트419의 LiveAddressTest가25.171초/실패1로 ‘방문 변경’을 찾지 못했습니다. 콜드 단계 전에 중단됐으며 원본 실패는 baseline-result/official 로그·비공개PNG/XML로 보존했습니다.
실패PNG는 정상 **시설** 역할 화면, XML100nodes/own35/방문변경없음입니다. 앱의 시설 화면은 방문 변경을 제공하지 않는데 시험은 역할 전환 전에 그 버튼을 찾았습니다. WebView 전체 접근성 부재나 주소 서비스 장애로 확대하지 않습니다.
최신88392b2 기준 별도 격리 소스에서 LiveAddressTest 시작에 **인계자 탭 선택→방문 변경** 순서를 추가했습니다. 기존 실제 UI 동작만 사용하며 저장소/앱 상태 주입·clear·앱 코드 수정은 없습니다.
테스트 소스 commit35e30651a259251cc652c66acca43eafdff33b78 / Java SHAecd4565ca7be2bf1cb7fe9b3f69c12e2b3c6256380a26ab0d807358b299b30d9.
test-only offline 빌드54초/45tasks/exit0. 새 테스트828964B SHA229eefc4b328c310cdf5f8fca63af65485ee40cbd80263de2a11688228c56d4f, 실제 전체 apksigner verify/지속인증서323cea98…e08e 및 manifest .verifyqa.test→.verifyqa 확인 후 staging기기SHA/pm-r Success.
앱APK4edaf75c·원래releasec094/.qa2903/testc73는 전후 동일. **앱 빌드/재설치는 없고 테스트 APK만 수정·갱신**했습니다.

## 공식 주소·COLD
단독 claim10:02:48.519–10:03:34.467KST, 자신의 claim 반납.
수정 테스트에서 공식 검색→공개 주소 선택/저장/재실행 JUnit OK1·16.709초 확인.
그 뒤 **verifyqa만 force-stop→pidof 빈 값 확인→am start-W**:
- 10:03:13.921KST LaunchState COLD /TotalTime302ms/WaitTime304ms.
- COLD는 한 번만 실행했습니다. 최초 XML6nodes는 준비 전 상태, 후속67nodes에서 주소/우편번호 항목이 존재했습니다.
- 최초 수집 스크립트의 한글 literal이 Windows PowerShell의 BOM없는UTF8 처리로 잘못 읽혀 raw복원판정이false였습니다. 또 우편번호/시작 버튼은 스크롤 전 bounds높이0이었습니다. 이 raw결과는 보존하고 그대로 통과로 쓰지 않았습니다.
- 같은 COLD 세션에서 올바른 Unicode로 XML 재검증, 실제 스크롤1회 후 10:04:56.504KST 주소·우편번호04524·방문 시작하기를 정상 bounds와 PNG로 직접 확인했습니다. 앱 재종료/재실행·주소 재입력 없이 확인했습니다.
- 주소bounds94,543–808,690 및94,1543–808,1612 / 우편번호94,1627–808,1693 / 시작버튼94,1063–808,1213.

이는 **현재 앱에서 이번 공식 선택 주소가 process COLD 후 복원됨**을 확인한 결과입니다. 09시 업데이트 전 저장값과 비교한 검증으로 소급하지 않습니다.
새229테스트의 DOM 전체 흐름·다른bridge는 이번에 재실행하지 않았습니다. 이전419/9.330초 결과는 이전 테스트 버전으로 유지합니다. 실제10분 준비 만료·독립QA/사용성·release바이너리 실물·실차/기관/클라우드/REST인증은 미확인입니다.

## 후속 상태
새 테스트 소스 [CI40252472387](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40252472387)는 진행 중이며 전체성공은 아직 미확정입니다. 제품741 CI40238360125의 기존 성공과 별도입니다.
다음 단일 기존 PM은 이 CI 최종 로그·산출물부터 확인합니다. 앱 재빌드·동일 테스트 중복설치는 하지 않습니다.
기존 제출 후보41/원본DOCX·PDF는 이번에 열거나 수정하지 않았고 PR Draft미병합/Private/v0.3.0-preview 게시/0.4.3미게시·미제출 유지.
원본 실패/후속 raw판정/정정 관찰을 구분한 근거는 IT13 QAroot/AS-Q1-PM-20261026T0957와 build-reports/pm-20261026/cold-physical.json입니다. 비공개 화면/개인 식별정보는 저장소에 게시하지 않았습니다.
