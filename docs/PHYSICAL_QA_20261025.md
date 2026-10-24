# 실기기 PM 자체 QA · 2026-10-25 03:13 KST

작업 AS-Q1-PM-SELF-QA-20261025. 기존 안심동행 PM이 OPS-DELEGATION에 따라 임시 AS-Q1을 수신하고 직접 실행했다. 독립 QA/감사 승인이 아니다. PHONE-QA-STANDING-20261025의 직접 사용자 지속 사용 승인 원문/JSON을 읽고 단일 소유권을 생성했다. 다른 QA/관련 프로세스·점유를 발견하지 않았으며 완료 후 자신의 잠금을 해제했다. 새 빌드/에이전트/예약/Slack 전송은 없다.

## 바이트와 설치

Samsung SM-F936N / Android API36. 시리얼은 기록하지 않는다.
준비된 소스341bc88 / CI40076247150의 QA 두 파일을 그대로 사용했다.
- 앱 kr.co.ansimdonghaeng.qa: 5,170,072bytes / SHA256 2903bc1490f5e53c805bcc1f64a08c3a3e44e709d59c8dd011845f01890a2d0d.
- 테스트 kr.co.ansimdonghaeng.qa.test: 816,844bytes / SHA256 c73efa7945d514e3df3154e1f99a77f6eb45713a98c7d0e7745cb0118985cf84. 실제 등록 target=kr.co.ansimdonghaeng.qa.
- 두 APK signing block에서 추출한 인증서 SHA256 faa3357362277ea4e13d7fe0d97e889b67c1610915ecf018b201921bfbd6f133을 기존 CI apksigner 검증 manifest와 대조했다. PC에서 apksigner를 재실행한 것은 아니다. 전체 APK 바이트가 CI 검증 바이트와 같다.
- QA 패키지가 없음을 확인하고 두 APK만 공존 설치했다. 설치 후 기기의 base APK SHA256도 각 파일과 일치했다.
- 원래 kr.co.ansimdonghaeng의 설치 APK SHA256은 전후 모두 c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54. 원래 앱 삭제/초기화/교체/개인 데이터 조작은 수행하지 않았다.

## 별도 시험 결과

명령은 모두 QA runner를 대상으로 했다. release용 native043.sh/android_smoke.py는 실행하지 않았다.

공식 주소:
`adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.LiveAddressTest kr.co.ansimdonghaeng.qa.test/androidx.test.runner.AndroidJUnitRunner`
03:10 실행 14.832초, OK (1 test), LIVE_POSTCODE_ROUNDTRIP_OK(03:10:49). 실제 공식 주소 선택→반환→저장→Home/재시작 복원을 검증했다. 이 테스트의 재시작은 process force-stop cold restore와 같지 않다.

수동 주소 DOM:
`adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.DomFlowTest kr.co.ansimdonghaeng.qa.test/androidx.test.runner.AndroidJUnitRunner`
03:11 실행 9.406초, OK (1 test), PRIMARY_HANDOFF_OK(03:11:31), EASY_ARRIVAL_ACK_OK(03:11:34).
실제 WebView 버튼/입력 이벤트로 수동주소→출발→도착→화면 연결번호→양측인계→보호자→쉬운알림/시설확인을 실행했다. 공식 주소 SDK 검증은 앞 시험으로 분리했다. remote debugging/state injection 미사용.

그 후 QA 앱만 force-stop하고 am start -W로 다시 시작했다(Status ok/317ms). 쉬운 알림의 담당자 확인 상태가 저장·복원된 한글 큰 글씨 화면을 직접 확인했다. **공식 선택 주소의 별도 process cold 복원은 추가 검증 대상**이다. 실제 사용자 물리 입력·사용성 평가는 이 자동 instrumentation 결과와 구분한다.

## 기록과 범위

IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025:
official.txt, dom.txt, qa-markers.txt, official-artifacts(7파일), cold-final.png, result.json, execution-receipt.json.
초기 adb pull의 Unicode Desktop 경로 오류는 ASCII 임시 경로로 회수 후 복사해 해결했다. 앱 시험 실패가 아니다. instrumentation 종료 직후 dom-final.png는 런처를 담았으므로 UI 성공 증거에서 제외하고 비공개로 유지한다. 실제 앱 재시작 후 cold-final.png만 최종 화면으로 사용했다.

최신5232b81/CI40081102580의 release faf65621…4140b 에뮬레이터 성공 및 최신 QA2ca2f36f/testd6be68d2와 이번341bc88 QA 실기기 성공은 별도다. APK/서명이 다르며 최신 release 실기기 성공으로 확대하지 않는다.
API/DOM 문서의5232b81 근거는 Android15 에뮬레이터, 공식 제출 검토 docs/SUBMISSION_REVIEW_20261024.md는14:16의38ef02b/112+1+7 문서 검토다. 원문 DOCX/PDF는 이번에 다시 읽거나 수정하지 않았다. 제출판 연결·외부 Kakao REST/Pleos/AAOS/실차·기관 인증/클라우드, 독립 감사는 남아 있다. PR미병합·공개 배포/공모전 제출 없음.


## 실기기 상태 전환 후속 · 2026-10-25 04:00 KST

작업 AS-Q1-PM-STATE-20261025T0355 / 기존 PM 임시 AS-Q1 자체 검증. 앞선 공식주소1·DOM1의 성공 로그와 별도 총괄의03:31 시각 검토를 먼저 읽었다. 재설치·instrumentation 재실행·새 빌드 없이 동일341bc88 QA 바이트의 화면 전환 한 가지를 확인했다.

다른 QA claim/활성 instrumentation을 발견하지 않은 뒤 AS_Q1_DEVICE.lock을 독점 생성했다. QA 앱 전면을 XML로 확인하고 캡처한 다음 실제 터치 입력으로 시설 탭→쉬운 화면 탭을 전환했다. 시설의 ‘알림 확인 완료’와 쉬운 화면의 ‘담당자가 확인했어요’가 유지됐다. 설치 앱/test 해시는2903bc14…a2d0d/c73efa79…5cf84, 원래 앱 해시는c09449f8…de54 그대로다. 기존 앱 삭제/초기화/교체, 개인정보 탐색, 실제 전화/기관 전송은 하지 않았다. 완료 후 자신의 잠금을 반납했다.

**재현된 UI 정리 항목:** 도착 알림 확인 완료 화면에 ‘도착지를 지정해 주세요.’와 사용할 수 없는 ‘정보 수정’/‘도착지 설정’이 함께 남는다. 역할 전환 후에도 동일하다. web/app.js의 easyView arrivalNotice 분기가 locationCard()를 그대로 삽입하며, locationCard는 빈 주소 안내와 canWrite()=false 버튼을 렌더링한다. 이는 실제 화면의 문구/비활성 조작 혼선을 확인한 것이며 도착 알림 ACK 실패, 위치 검증 완료, 실기관 수신 성공을 뜻하지 않는다. 이번에는 원인을 확인·기록했고 **앱 코드를 수정하거나 수정 검증을 완료하지 않았다**.

이전03:13 캡처의 로컬 연결 토스트는 새 before/after 화면에서 보이지 않았다. XML에 toast 텍스트가 남아 있다는 사실만으로 겹침이 계속된다고 판정하지 않았다. 실제 사용자 전체 사용성 승인은 여전히 별도다.

IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T0355/result.json, before/after.png·XML·facility.xml에 상세 기록. 화면은 상태바 등 개인 정보 노출 가능성이 있어 로컬 비공개로 보존하고 저장소에는 해시와 비식별 결과만 남긴다.
- before.png SHA256 4ea68758eb56f221d50aba476df81300e9509872b2779a51a6becd69641b3171
- after.png SHA256 17c4de03eddb5066a788d926be16a1d56fa96bcce2891c3702619a9c8f28ce6a
- before/after.xml SHA256 63701efa29a9655fd1f6065a9704e42550889a2076e635253fce0d3ed2697e41
- facility.xml SHA256 e96fd0242aff04dc25ade70af543e059d15a893a446b99a45070fe3bba88fc48

다음 단일 담당은 기존 PM 임시 AS-Q1. 쉬운 화면 완료 상태의 불필요한 주소 설정 안내/비활성 버튼 정리가 다음 수정 대상이다. 공식 선택 주소의 process cold 복원은 이번에도 실행하지 않았다. 독립 QA/감사, 최신5232b81 release 실기기 바이트 검증, 외부 API 실연동과 최종 제출 문서 버전 대조는 남아 있다.

04:00 최신 조회: PM HEAD76bd5ff, CI40081102580/5232b81 성공 유지·새 실행 없음, PR Draft/미병합, 공개 게시 v0.3.0-preview만 존재. main/easy/address 원본은 이전 기준 SHA 그대로다. 원문 DOCX/PDF 재열람/수정 없음, 마지막 직접 검토14:16 기준 유지. 지난주 비교 근거와 전체 진척률 분모 없음. 야간 Slack 전송 없음.
