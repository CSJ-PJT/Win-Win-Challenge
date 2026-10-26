# 번호5회 오류·재발급 복구 실제기기 검증 — 2026-10-27 02시

기존 PM 자체 QA, 실제 Android16 SM-F936N/verifyqa4ed의 **ADB UI1시나리오**다. 새 JUnit/빌드/설치0이며 최종release6a28물리검증·독립QA와 구분한다. 기존 .verifyqa.test229도 교체하지 않았다.

## 실제로 관찰한 단계

- 초기 기존 시험 방문은 도착·만료번호 상태였다. 주소 서울 중구 세종대로110/우편번호04524를 유지한 채 주요 버튼으로 정차·시설준비를 재확인했다. 방문변경/새방문·설정초기화·저장상태주입·시계변경은 하지 않았다.
- 02:00:02–02:00:32 KST, 실제 화면에서 새번호 발급→인계자 확인→시설 입력란에 확실히 다른6자리 숫자 입력. 같은 잘못된번호를 제출해 1–4회 각 ‘연결번호가 일치하지 않습니다.’와 인계자 확인 표시를 XML로 확인했다.
- 5회째 ‘연결번호5회불일치로번호폐기’ 안내를 확인했고 번호 입력란/인수확인 버튼이 사라졌다. private PNG로 해당 시설 화면을 직접 검토했다.5입력은5독립테스트가 아니라한시나리오내단계다.
- 다시 인계자 화면의 연결번호받기→새6자리번호가 전번호와다름·인계자확인초기화 확인→인계자 재확인→시설에서 새번호 입력·직접 인수. 실제 시설 ‘인수를 완료했어요/양쪽 확인 완료’와 보호자 ‘인계를 마쳤어요’를 XML/PNG로 확인했다.
- 강제종료 후 pidof는 exit1/빈출력(프로세스없음), am start 실제 **LaunchState:COLD/TotalTime282ms**. 첫 UI조회에는 앱 텍스트0개라 완료복원미확정으로 남았다. 같은실행의 후속조회42개 앱행에서 완료·5개확인·주소/우편번호유지를확인, 02:03:45 PNG를직접검토했다. 재시작/데이터주입 없이 안정된같은콜드실행을재관찰한것이다.282ms는Android Activity시작시간이며 완전WebView준비시간/UX지연측정이아니다.

## 실패·부분 기록도 보존

recovery-result.json의 raw success=false/ADB_1은 force-stop 후 pidof의 정상적인 exit1을 범용ADB헬퍼가오류로처리한것이다. 해당파일에새번호·확인초기화/시설·보호자완료관찰은이미true였으며 원본을수정하지않았다. 후속 cold-result는 exit1/빈PID·COLD282를확인했지만 첫앱텍스트0조회로 COMPLETED_NOT_RESTORED를기록했다. 원본유지후 cold-settled-result가같은실행에서42행/완료/확인5/주소우편번호를검증했다. 프로세스exit0만으로성공처리하지않았다. 입력1~5실제안내/입력란폐기/새번호/양측·보호자완료/후속화면증거를근거로범위PASS판정한다.

## 보존·범위

5개설치APK SHA전후모두동일:release c09449f8…, .qa2903bc14…, .qa.testc73efa79…, verifyqa4edaf75c…, test229eefc4…. 기기점유는 CreateNew로획득하고 ownowner확인후02:04:00정상반납·후속claim부재/진행instrumentation매칭없음확인했다. 기존 release/.qa 앱은열지않았고 삭제/초기화/서명변경/재설치없음. 현재검증앱의시험방문상태는UI검증으로도착/만료에서완료로변경됐으며 전체localStorage전후동일을주장하지않는다. 주소·우편번호가유지된범위다. 실제전화/기관전송·외부지도/서비스호출없음.

공통위임/dispatch·standing승인/배정·03시초기result/01시최신result·PR6387088890후속을먼저읽었다. QAclaim/writer/instrumentation부재·잠금해제상태·정확한APK해시를확인후단독수행. 원본사진은상태표시줄포함private로IT13에보존하며게시하지않았다.

다음 단일 기존 PM은 쉬운화면의도착알림중복방지·시설확인의한정실기기회귀를수행한다. 최종release서명충돌·후보물리runtime·독립QA/사람사용성·실차AAOS/Pleos·유효REST/기관/클라우드·심사접근/실제제출은미완료유지. 최신CI40252472387success/publishskipped·PRDraft미병합·v0.3.0-preview만게시상태는직전동일. 공식문서v3/고정후보/원본작업공간보존. 야간Slack미발송·전송기/토큰읽기없음;기존18시게시만읽기확인·폰push미확인. 새agent/예약/수신자·권한/비용·공개/제출없음. 전체%미산정.

[기계판독결과](../build-reports/pm-20261027/code-errors-physical.json). 원본은IT13 QAroot/AS-Q1-PM-20261027T0155: 시간별UI XML/JSON·private PNG·wrong-code/recovery/cold/cold-settled 결과·cold-start.log·설치전후해시·claim반납이다.
