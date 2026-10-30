# HTTP 저장 실패 클라이언트 처리 검증 — 2026-10-29 22시 KST

22:07:14 KST, 기존 PM AS-M1이 제품b37287e의 app/core/config/ui/server 5파일을 현재HEAD27235ac와 Git blob·SHA256 **5/5 동일** 확인하고 검사했다. **편집기2종/2 PASS, 실제 로컬 HTTP18요청·70assertion**. 기존 CI Node131/물리QA/20–21시별도HTTP수치에 합산하지 않는다.

## 실제 실행과 관찰 경계
실제 app.js의 saveEditor/send/api 함수를 Node VM에서 실행하고 실제127.0.0.1 임의포트 서버에 연결했다. 새 임시합성 저장소의 .tmp경로를 디렉터리로 만들어 실제EISDIR/HTTP500을 각 편집기에서2번 발생시킨 뒤 장애를 제거하고 저장200을 확인했다. HTTP응답/파일쓰기/도메인상태를 mock하지 않았다.
폼 입력노드·local/sessionStorage는 합성이고 init만 시험 진입점으로 바꿨으며 render함수는 비활성화했다. 그러므로 실제 브라우저 렌더·화면/탭 이동·버튼 터치·픽셀 가독성·Android WebView/폰·사람 사용성 PASS가 아니다.

| 대상 | 500 오류 반복 때 | 복구후200 |
| --- | --- | --- |
| 방문 정보 편집기 | 기존 state/디스크 동일, 주소·상세주소·시설 초안 유지, editor열림, busy/editorSaving해제·저장버튼재활성 | 초안 값 저장·version1회증가·panel닫힘·성공알림 |
| 도착지 편집기 | 같은 보존 계약, 지도/글씨 설정은 저장 전 값 유지 | 지도google/글씨150 설정 커밋·PLANNED 유지·인계완료 오표시 없음 |

서버 실제 일반 실패 문장이 inline error 노드에 설정되고 hidden=false가 되며 editorError 및 실제 editor템플릿 role=alert/문구와 일치했다. HTML생성/노드속성 판정이며 화면에 보였다는 주장은 아니다. 실패 중에는 성공toast/설정·프로필 저장이 없고, 성공 후에만 발생했다. HTTP500은 pending을 지우며 수동 재시도 성공에서 서버 영수증은 setup1+저장1만 있었다. 서버와 클라이언트 최종 상태가 동일했다. listener·임시합성저장소 정리 완료.

최초 비교는 Node/VM의 객체 prototype 차이를 내용 불일치로 판단한 시험 harness 오류였다. JSON값으로 정규화해 비교한 뒤 두 시나리오를 재실행했다. 제품 수정0, 최초오류 설명·최종 결과를 구분한다.

[최종 결과/소스바이트](../build-reports/pm-20261029/client-save-http500/result.json). harness 재현은 새 격리디렉터리에 지정5파일과 harness.cjs를 같은구조로 놓아 수행한다. 실제 사용자 데이터/기기/실서비스를 연결하지 않는다.
새빌드/설치/폰시험/실외부호출/공개배포/실제제출0. 공식v6·봉인r4/r5·기존앱/데이터/서명은 유지된다. 최신CI40820861095/b37287e 성공·PRDraft/open·게시v0.3.0-preview는 새로 읽었고 새CI 실행중 없음. 서명 차이·새release실기기·독립QA 차단 유지.
IT13 원격월한도 재시도/재연결/우회0. 현재OPS/락/instrumentation/writer/기기상태 미관측·원장미반영. 야간Slack미발송, 당일공개검색0건만으로 주간 실패 확정하지 않고 송신영수증/폰push는 미확인이다.

다음 단일 기존 PM AS-M1: 서버 저장 성공 뒤 HTTP응답이 유실됐을 때 pending intent·재연결/재전송이 중복변경을 막는지 합성환경에서 한정 검증한다.
