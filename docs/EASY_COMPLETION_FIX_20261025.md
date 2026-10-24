# 쉬운 화면 알림 완료 요약 수정 · 2026-10-25

04:00 실기기341bc88 QA에서 알림 ACK 후 빈 주소 설정 안내와 비활성 수정/설정/연락처 등록 버튼이 남는 것을 재현했다. 근거 docs/PHYSICAL_QA_20261025.md, PR2 댓글6388275466.

최신 PM HEAD0c4e442b 기반 격리 작업공간에서 locationCard에 완료 요약 모드를 추가했다. 쉬운 화면의 arrivalNotice 분기에만 적용해 빈 주소의 설정 지시와 편집/지도 조작을 생략하고 시설/실제 주소/우편번호/승하차 장소는 유지한다. 연락처가 있을 때만 전화 앱 링크를 남긴다. 새 방문 버튼은 유지하며 도착 알림 전 입력/동의/알림·ACK 도메인 규칙은 변경하지 않는다.

검증: 로컬 Node112개/실패0, app.js 문법검사, Python 회귀검사 문법검사와 bundle 생성 성공. 로컬 Chromium 다운로드는 ZIP 전송 오류로 실행 불가이므로 브라우저 통과로 기록하지 않는다. 기존 CI Browser input and role regressions에 test/easy_completion.py를 추가했다. 실제 버튼으로 빈주소 알림 전송→시설ACK→역할왕복→브라우저reload→새방문을 검사하고, 제공된 주소/연락처는 별도 렌더 fixture로 검사한다. 실제 전화/기관 알림/Android 성공 주장이 아니다.

새 소스의 CI/Android 빌드·에뮬레이터 및 실기기 결과는 새 실행 근거로 별도 확인한다. 기존5232b81 CI 성공이나341bc88 QA 실물 성공을 이 변경 소스에 합산하지 않는다. 설치된 QA/기존 앱을 교체하지 않았으며 사용자 데이터 조작·공개배포·제출·야간 Slack은 없다. 공식주소 process cold 복원/외부API/독립감사/최종제출판 대조는 남아 있다.

## 후속 확인 · 2026-10-25 05:04 KST

수정 소스9c277ce5bcb1c7b79b2a5ce5871a8302343dd4fe / CI40127842234 / verify-build job120972993090: Domain and service tests 및 Browser input and role regressions 단계 success를 도구로 확인했다. Android 빌드는 마지막 조회 시 진행 중이며 전체 CI 성공으로 판정하지 않았다. 브라우저 원본 로그/산출물의 후속 수집, 새 APK 해시/서명 및 Android 실행 확인이 남아 있다. 로컬 Node112/0 전체 로그는 build-reports/pm-20261025/easy-fix-node-tests.txt. web/app.js SHA256 c1540eb35ee8b39667834ae7ba0049fd71677d81474caac3b747999ad21be047, bundle SHA256 b91ad4a052114ed20d3736bac68be1b4c7a096105178d9762e6def4335eefa59. 기존 설치 QA2903bc14의 실물 성공은 변경 전 기록이다.
