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
