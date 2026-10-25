# 최신 CI 완료·c5 공식 주소 process COLD · 2026-10-25 20시
기존 PM 단일 실행, 자체 QA이며 독립 QA/감사·공개release실물승인과 구분한다. [구조화 근거](../build-reports/pm-20261025/ci-and-cold-final.json).

## 새 CI 최종결과
소스22840169f99feeb64c22cdeba48a9707505eb0bc / [CI40182818148](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40182818148) **10/25 18:58:07–19:08:56 KST success**, verify-build121137290442/native-smoke121138220734/live-address121138220783 성공, publish skipped. 원본3job로그직접확인: Node112/실패0, 실제PC/HTTP 공식주소선택·저장·reload·지도, 통신중저장회귀 통과. native ZIP actual check-status5exit모두0/공식instrumentation1/APK7/DOM1, MAP_INTENT_OPENED/PRIMARY_HANDOFF_OK/EASY_ARRIVAL_ACK_OK 확인. Android15 release패키지 에뮬레이터 범위다.
새GeocoderBridgeTest는 컴파일에포함되지만CI명시적runtime대상은LiveAddressTest/DomFlowTest뿐이다. **Geocoder의에뮬레이터실행통과로 합산금지**; 19시물리Geocoder1/1.348s는별도다.
실제ZIPdownload크기/SHA를GitHubdigest와대조:
- build12594637997 /5613319B /fe2df836f9fd23c62f38ab56a556e8b5f4039ae1041e949dd41ff79d1806e85d
- native12594588779 /1283241B /163487b18e67efe6254bac1f780e3f46b6d6996537451fe15f960f10ad8226da
실제APK와manifest 대조:
- release5170796B /8397b33aed91a51cbef0cd8407873e1518dcc0643f3f0085600d796d8f94d1c2
- CI.qa5170820B /27ae278b3b8a162bf5badd761c36c02c23654d8da2a2e337838db4191bd861b9
- CI.qa.test821260B /5761e13ce761461560f33804e50752f16d2fc3750083b35ad44dd58fc8a83ed3
signing-block-v2에서 추출한3인증서SHA e2122eed50d98e37143ef85e12311f7a480c4ae4315baa2d74e928a8ba055539가manifest와일치. 이는이검토에서추가 apksigner 전체암호검증을실행한것은아님. actualrelease/QA8assets동일,이전b227CIrelease8assets와도동일. CI바이너리 물리설치/공개게시없음,아티팩트만존재(11/8만료).

## 최신 설치 c5 물리 검증
IT13 SamsungAndroid16: 최신상시승인/원장/QA lock·writer·instrumentation·잠금해제 확인후ownclaim생성.
기존verifyqa앱 SHA c5aad9eecc70bf0cac07450e414c582720582ee8286f0b255af5ff46e69eda4b /제품b227와test5f7ecaa3bd9253af916104f916623b7dbea1454d02d348eee2bcb98dfa90a840/소스228를 그대로 사용, **빌드·설치·삭제·초기화없음**.
- 현재5f7test의 LiveAddressTest가 공식주소SDK 결과 실제선택→반환·저장·재열기 **JUnitOK1/16.944초**. 원래13시초기화면전제실패나16시bb17통과와별도 실행.
- verifyqa만 am force-stop→pidof없음 확인→am start-W **Statusok/LaunchStateCOLD/Total264ms/Wait268ms**. 한 번만종료/시작했다.
- 최초즉시XML823B에는WebView자식준비가안돼주소/우편번호를관찰하지못했다. 이를통과로처리하지않고19:59:02안정후조회만재시도: QA64노드에서주소·우편번호04524·방문시작버튼확인. 추가저장/재시작없음. 안정화지연관측을보존하며전체접근성문제해결로확장하지않음.
- 실제화면에서한글준비상태와저장한공식주소를직접확인했다. 우편번호는XML실행증거. 스크린샷은상태바포함비공개로보존,저장소에게시하지않았다.
- 원래releasec09449f8/oldQA2903bc14/oldtestc73efa79/verifyqac5/test5f7 **5패키지설치SHA전후모두동일**, ownclaim반납완료.
비공개 QAroot AS-Q1-PM-20261025T1956/result.json,official-test/run,cold-start,초기/안정XML·스크린샷,전후해시. 옛18c앱의273ms복원결과를c5에합산하지않고이번c5의264ms로구분했다. 완료상태새E2E/실차/독립사용성검증은아니다.

## 유지·다음 단일담당
PRDraft미병합/게시v0.3.0-preview/0.4.3미게시·실제접수없음. 기존DOCX/PDFversion2/17시13쪽시각검토유지,이번재편집없음. 전체진척률/지난주비교분모없음. 역할배정/자체검증통과와독립QA/감사수신미확인을구분.
남은우선순위는 실제전화bridge의안전한화면연결(발신금지),Kakao REST유효키,Pleos·AAOS/실차/기관인증·클라우드/독립QA·사용성/접수요건. 기존PM이앞선검증을중복하지않고다음한정범위를진행한다. 야간Slack추가전송없음,현재대화방결과보고. 새agent/예약/공개배포/비용없음.
