# COLD 초기 화면 관찰 — 2026-10-27 04시 KST

기존 PM이 SM-F936N Android16의 verifyqa4ed/test229에서 03:56:57–03:57:15 KST에 한정 COLD 실행 1회를 관찰했습니다. 새 빌드·설치·JUnit·방문 생성·알림 재전송은 없습니다.

## 결과

- verifyqa만 force-stop하고 PID 없음(exit1/빈 출력)을 확인한 뒤 명시적 Activity를 실행했습니다. LaunchState COLD/Activity TotalTime307ms, 실행 명령 반환434ms입니다.
- 실행 요청 직전 stopwatch 기준437–737ms의 화면 캡처에는 **‘오늘의 동행을 준비하고 있어요.’** 로딩 안내가 보였습니다. 완전한 빈 화면이라는 해석을 정정합니다.
- 첫 uiautomator dump(812–5024ms)는 앱 문구0개였고, 두 번째(5030–7268ms)는20개 및 담당자 확인 상태/시설 버튼을 확인했습니다. 7273–7636ms 화면 캡처에서도 쉬운 화면과 확인 상태가 보였습니다.
- 7732ms에 실제 시설 탭을 누르고10071ms까지 시설 ACK 표시를 관찰했습니다. 쉬운 화면으로 돌아와 확인 상태·재전송 버튼 부재가 유지됐습니다. 원본 XML/JSON과 private PNG3장을 직접 검토했습니다.

**7268ms는 도구로 본 화면을 확인한 상한 관찰값입니다.** 캡처·dump·전송 시간과 접근성 계층 갱신이 포함됩니다. 첫 dump 문구0만으로 5초 동안 시각적 빈 화면이었다거나 실제 준비시간이7.27초였다고 주장하지 않습니다. Activity307ms도 웹 화면 조작 가능 시간을 뜻하지 않습니다. 표본1회이므로 평균/백분위/성능 목표 통과 판정은 없습니다. 장애가 재현됐다는 근거 없이 제품 코드를 변경하지 않았습니다.

현재 앱 PID14187의 HandoffUI 태그만 한정 조회한 로그에도03:57:03.750 `HANDOFF_UI_READY`가 있습니다. 현재 소스의 기존 표식은 onPageFinished 후2000ms에 branding·main·data-action3개 이상 존재 여부를 검사합니다. 클릭 응답·정밀 TTI의 증거로 확대하지 않습니다. 전체 logcat 수집·로그 삭제는 없었습니다.

## 보존과 현재 상태

기존 release/.qa/.qa.test와 verifyqa/.test 5개 설치 SHA256은 전후 동일합니다. 원본 앱/데이터 삭제·초기화·서명 교체 없이 본인 claim을03:57:15 반납했고, 이후 lock 부재/active instrumentation 부재를 확인했습니다. 일반 역할 설정을 바꿨다가 되돌렸으며 전체 localStorage 동등성 시험은 아닙니다.

정확한 해시·시간·범위는 [결과 JSON](../build-reports/pm-20261027/startup-observation.json)을 따릅니다. IT13 Desktop/Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261027T0355에 result.json/설치 전후 해시/cold-start.log/시간별 XML·JSON/private PNG를 보존했습니다. startup04.ps1은 QAroot에 있습니다.

최신 PR2 HEAD8bc83ecf 기준 Draft/미병합, 실제 CI40252472387 성공/publish skipped, 게시 v0.3.0-preview만 존재합니다. 후보release6a28의 물리 실행은 서명 충돌로 미완료이며 독립 QA·사람 사용성·실차·심사 접근·실제 제출도 미확인입니다. 공식 DOCX/PDFv3 재열람/편집은 이번 범위에 없습니다. 기존18시 Slack 게시만 읽기 확인했고 야간 발송·토큰 읽기는 없습니다.

다음 단일 기존 PM: 쉬운 화면의 큰 글씨 설정에서 주요 버튼 잘림·스크롤 접근성을 한정 실기기 확인합니다.
