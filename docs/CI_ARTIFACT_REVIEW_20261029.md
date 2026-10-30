# b37287e CI·산출물 검수 — 2026-10-29 15시 KST

[CI40820861095](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40820861095)는 source `b37287ef63a164c6eeedd41e6aeb3be9170b2882`에서 14:10 KST 완료했습니다. verify-build/live-address/native-smoke 성공, publish skipped입니다. 15:05 산출물 검수는 새 시험 실행이 아닙니다.

| 범위 | 확인 결과 |
| --- | --- |
| Node | 131/131 PASS, CI 로그 확인 |
| 브라우저 주소 회귀 | 10/10, 실제 Chromium·모의 SDK. 오프라인 오류/재시도·초안 보존 포함 |
| PC 공식 주소 | 실제 네트워크 7/7, launcher/HTTP 각각 검색·저장·재조회·지도 확인. 실패 목록0 |
| Android15 release | 주소 JUnit OK1/66.281초, DOM OK1/19.444초, 주요 UI7. x86_64 에뮬레이터 |
| 산출물 ZIP | 3개 다운로드 SHA-256이 Actions digest와 일치 |
| APK | 4종 실제 SHA·binary manifest·v2 인증서 추출. release/QA 웹 자산8/8 동일·새 취소 코드 포함 |

원본 JUnit의 OK와 instrumentation status를 직접 읽었습니다. exit0만으로 판정하지 않았습니다. 복원 화면 PNG의 서울 주소·우편번호·방문 시작 버튼도 확인했습니다. 경합6개는 기존 Node VM 상태 경계 검사이며, CI의 일반 주소 브라우저10개를 경합 화면 재현6개로 바꾸어 계산하지 않습니다.

## 새 바이트와 설치 경계

- release `2ce05b85013b25291131267343e3f1b692d79b874de47137f99ff1dc45006752`, 5,171,460B.
- QA `c6a9686fe193fb5a75b17d781b1996ea87d625c8ebf6b0977ac30626f574f470`, 5,171,480B.
- release test `3c090252e00141efb83ec54a82d8163082d4cf9aa5375438b74e4b2eed2221a0`, 829,220B.
- QA test `7c53f0c8fa80b93f5005d4d5cc9161271241b6ec10125a7be976c50e8a98e2e1`, 829,244B.
- 추출 인증서 4개 모두 `96c6ed6561653a9466ffcfbc22ed5500f837bae201e2a31c7a5c48cec2a69784`.
- source ZIP `9169e4d18bc09764504cb70d4c2ba8db29e59c45e8fbef69b2d9be5affd578e6`.

로컬 검수는 인증서 추출·manifest 읽기이며 새 암호학적 서명 검증은 아닙니다. CI의 성공한 apksigner/패키지 검사와 digest를 별도로 대조했습니다. 설치 release c09449f8의 과거 인증서74f3b4db와 새96c6ed65는 다릅니다. 같은 package/version이므로 일반 보존 업데이트 차단을 해소하지 않았습니다. 키/서명계보 확인·삭제/초기화·설치 시도는 없습니다.

## 후보·문서 보존

봉인 r4/source99·APKf3b8, 저장소 지정 APK, 동일ID DOCX/PDFv5·비공개 메일은 바꾸지 않았습니다. 새 sourceZIP에는 서버6d0eb5와 편집기b372 수정이 들어 있지만 기존r4에는 없습니다. 새 build/qa를 현재폰 verifyqa930/testdac 성공으로 합산하지 않습니다.

원격 월간 제한 재시도/재연결/우회0, 현재 lock/process/keyguard 미관측·IT13 원장 미반영. 설치5SHA/r4 20/20은05:07 과거 관측입니다. 오늘 Slack 검색0건, sender queue/receipt 미확인·대체전송0·폰push미검증입니다. 예약/수신자 변경 없음.

다음 단일 기존 PM AS-M1: 동일ID 공식 DOCX/PDFv5를 먼저 읽고 새 source/CI/APK 근거 반영 범위를 검수. r4 보존·실기기/독립 QA 미완료를 유지하고 실제 제출/공개배포는 하지 않습니다.

[기계 결과·범위](../build-reports/pm-20261029/ci40820861095-review/result.json)
