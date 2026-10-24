## 최신 확인 · 2026-10-25 06:05 KST

소스9c277ce5bcb1c7b79b2a5ce5871a8302343dd4fe / CI40127842234(05:00:29–05:11:15 KST)는 verify-build/live-address/native-smoke 전체 success, publish skipped. 원본 로그/실제 ZIP 바이트를 다시 읽어 Node112/실패0·쉬운 완료 화면 Chromium회귀5개·공식주소 Android instrumentation1·APK조작7·DOM instrumentation1 및 종료코드5개=0을 확인했다. 수정된 빈주소 완료 화면에서 설정 지시/비활성 버튼 없이 시설 요약과 ‘다른 방문 시작하기’가 표시됨을 Chromium 캡처로 직접 확인했다.

release APK SHA256 95d9ba4085b2e64d28241267303ed5fec037a729a10ba268fa7e1b7c0e5b1a6c(5,170,128bytes), QA25fbaf85…21827(5,170,152bytes)/testaf091cdb…34634(816,844bytes). 실제 APK 바이트 및 signing block 인증서23a3ce03…4a486를 CI manifest와 대조하고 release/QA assets8개 동일을 확인했다. 이 검토의 인증서 추출은 별도 전체 암호학 서명 검증 실행이 아니며 CI apksigner 성공과 구분한다.

**새 소스는 Android15 에뮬레이터 release 결과이며 실기기 성공은 아니다.** 06:05 읽기 전용 ADB에서 설치된341bc88 QA2903bc14/testc73efa79 및 원래c09449f8 해시 그대로를 재확인했다. 설치된QA 인증서faa33573…6f133과 새QA23a3ce03…4a486가 달라 데이터 보존 업데이트 조건을 만족하지 않는다. 설치 실패를 실행한 것은 아니며 재설치/삭제/데이터초기화/강제교체하지 않았다. 후속 실제 기기 검증에는 동일 서명의 안전한 빌드 경로 또는 기존QA와도 공존하는 한정 검증 패키지 방안 검토가 먼저 필요하다. 이번에는 새 빌드를 만들지 않았다.

상세 근거 build-reports/pm-20261025/easy-fix-final-check.json 및 easy-fix-final-log.txt. 이전375e325의 ‘진행 중’과 아래5232b81/341bc88 기록은 당시 범위다. 공식 선택 주소 process cold 복원/실서비스 API/독립QA·감사/최종 제출판 대조는 계속 별도 검증 대상이며 원문 DOCX/PDF를 이번에 다시 읽거나 수정하지 않았다. 게시v0.3.0-preview·PRDraft 미병합·공모전미제출, 지난주 비교/전체진척률 근거 없음. 야간 Slack 없음.

---

# 쉬운 화면 알림 완료 요약 수정 · 2026-10-25

04:00 실기기341bc88 QA에서 알림 ACK 후 빈 주소 설정 안내와 비활성 수정/설정/연락처 등록 버튼이 남는 것을 재현했다. 근거 docs/PHYSICAL_QA_20261025.md, PR2 댓글6388275466.

최신 PM HEAD0c4e442b 기반 격리 작업공간에서 locationCard에 완료 요약 모드를 추가했다. 쉬운 화면의 arrivalNotice 분기에만 적용해 빈 주소의 설정 지시와 편집/지도 조작을 생략하고 시설/실제 주소/우편번호/승하차 장소는 유지한다. 연락처가 있을 때만 전화 앱 링크를 남긴다. 새 방문 버튼은 유지하며 도착 알림 전 입력/동의/알림·ACK 도메인 규칙은 변경하지 않는다.

검증: 로컬 Node112개/실패0, app.js 문법검사, Python 회귀검사 문법검사와 bundle 생성 성공. 로컬 Chromium 다운로드는 ZIP 전송 오류로 실행 불가이므로 브라우저 통과로 기록하지 않는다. 기존 CI Browser input and role regressions에 test/easy_completion.py를 추가했다. 실제 버튼으로 빈주소 알림 전송→시설ACK→역할왕복→브라우저reload→새방문을 검사하고, 제공된 주소/연락처는 별도 렌더 fixture로 검사한다. 실제 전화/기관 알림/Android 성공 주장이 아니다.

새 소스의 CI/Android 빌드·에뮬레이터 및 실기기 결과는 새 실행 근거로 별도 확인한다. 기존5232b81 CI 성공이나341bc88 QA 실물 성공을 이 변경 소스에 합산하지 않는다. 설치된 QA/기존 앱을 교체하지 않았으며 사용자 데이터 조작·공개배포·제출·야간 Slack은 없다. 공식주소 process cold 복원/외부API/독립감사/최종제출판 대조는 남아 있다.

## 후속 확인 · 2026-10-25 05:04 KST

수정 소스9c277ce5bcb1c7b79b2a5ce5871a8302343dd4fe / CI40127842234 / verify-build job120972993090: Domain and service tests 및 Browser input and role regressions 단계 success를 도구로 확인했다. Android 빌드는 마지막 조회 시 진행 중이며 전체 CI 성공으로 판정하지 않았다. 브라우저 원본 로그/산출물의 후속 수집, 새 APK 해시/서명 및 Android 실행 확인이 남아 있다. 로컬 Node112/0 전체 로그는 build-reports/pm-20261025/easy-fix-node-tests.txt. web/app.js SHA256 c1540eb35ee8b39667834ae7ba0049fd71677d81474caac3b747999ad21be047, bundle SHA256 b91ad4a052114ed20d3736bac68be1b4c7a096105178d9762e6def4335eefa59. 기존 설치 QA2903bc14의 실물 성공은 변경 전 기록이다.
