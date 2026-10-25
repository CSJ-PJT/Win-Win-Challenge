# 준비 만료 수정 CI 최종 검수 — 2026-10-26 08시
작업 AS-PM-20261026T0756 / 기존 PM 증거 검수. 수정 소스 `741869b3f7ce8d954cc7d267a69bdfe85b338e9b`의 [CI40238360125](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40238360125)를 실제 job로그·다운로드 파일로 확인했습니다.
**07:03:17–07:13:51 KST verify-build/live-address/native-smoke 모두 success, publish skipped.** 직전 ‘진행 중’을 이 결과로 대체합니다.

## 실제 시험 범위
- Node112/통과112/실패0.
- 새 준비 만료 브라우저 회귀1: 자동 버튼 비활성·시설 준비 재확인·새 번호 양측 완료/reload 유지, 가상시계601초·pageerror0/외부요청0.
- 실제 PC 실행기·HTTP 공식주소 선택/저장/reload/지도·직접파일 안내7개. 유효 Kakao REST 인증 검색 성공과 별개입니다.
- 실제3초 전송지연 저장 경합: 편집창 닫힘·reload 주소 유지.
- Android15 **release** 공식주소 instrumentation JUnit1·67.029초, APK UI7개, DOM JUnit1·19.780초.
- check-status 종료코드5개0, 실제 MAP_INTENT_OPENED/PRIMARY_HANDOFF_OK/EASY_ARRIVAL_ACK_OK 로그 존재.
이들은 다른 시험 분모이며 합산한 제품 기능 수/전체 진척률을 만들지 않습니다. 준비 만료 회귀는 브라우저 가상 시계 시험이며 Android에서10분 대기한 시험이 아닙니다.
회귀 JSON의 Windows 환경 문자열/0656 작업ID는 이식 전 메타데이터가 남은 것입니다. 실제 CI runner job로그는 Ubuntu24.04, Chrome155.0.8059.0, source_sha741이며 이 판정이 우선합니다. 과거 Windows 시험을 CI에서 재실행한 것으로 쓰지 않습니다.

## 다운로드·서명 검수
ZIP3개는 실제 다운로드·CRC검사 및 API/log digest 대조 통과:
| artifact | bytes | SHA256 |
|---|---:|---|
| build12615873301 | 5807429 | 03eb9468e4e98f694a4ef1999bbc0426b8840d24c34cd2d692997ca42ff9d4a5 |
| native12615179689 | 1247425 | 97d8772fa657fe44f12c0a703090d619797355a9b4001b89667b6780281555d9 |
| live12616150207 | 245365 | 2251d086712d419a4a3ffcb99288a67142e50abbfcfe7145e22f8afd0ec5c3b7 |

| APK | bytes | SHA256 |
|---|---:|---|
| release kr.co.ansimdonghaeng | 5170856 | bf9c98fee4bb2a4b87b75a3df10e7c5f5f5f9444316a5cff03d3597974aa7ae0 |
| QA kr.co.ansimdonghaeng.qa | 5170880 | fb7809d26a451736ed072fef12d71e3eb88cf89fb8bd6522d08086cfba762fed |
| test kr.co.ansimdonghaeng.qa.test → .qa | 828952 | e54d2ede6864b510a89cc860df98477047ccebd8f03531f570ee332b1fd53445 |

IT13 원본 buildZIP도 별도 다운로드/동일SHA 후 실제 apksigner 전체verify를 release/QA/test 모두 exit0/v2true/signer1로 확인했습니다.
세 인증서 SHA256 `1425a2a147a18f1c4a9497ecd15de5d0c8d35d38c612c35c92883e7fe4bb5706`. aapt2 actual package/versionCode9/0.4.3 및 QA0.4.3-qa, nondebug 일치. test target은 원본 manifest 검사 결과와 바이트 일치로 대조했습니다. DER 지문만 대조한 검사와 구분합니다.
일회 다운로드 스크립트는 삭제 확인. 키/비밀번호 읽기·생성·공개 없음.
소스 ZIP380043B/SHA52dd5b52c3f4d5e589f42c843aab2f3e5b08ca28fcb96153cd2f453a56765fe7. 실제 sourceZIP app.js와 APK assets/app.js SHA6067ad0e…4541e 일치, assets/index.html SHAebb63dfe…fed95는 앞선 수정 검증 HTML과 일치.
release/QA assets8개는 동일. 이전 source41 후보와는 app.js/index.html2개가 달라 이제 제품 내용까지 같다고 쓰지 않습니다.

## 보존·다음 단계
새 CI APK의 인증서는 설치된 지속 verifyqa 인증서323cea98…e08e와 다릅니다. 기존 release/.qa/verifyqa를 삭제·초기화·강제 교체하거나 이 CI APK를 덮어 설치하지 않았습니다.
고정 제출 후보41/7801e8ff와 원본 공식 DOCX/PDF는 그대로이며, 새 수정 APK로 임의 대체하지 않았습니다. 이번 공식 원문 재열람/편집·재렌더/제출·배포·초대 없음.
GitHub Draft미병합/Private·v0.3.0-preview 게시·0.4.3 미게시 유지. 독립QA/사람사용성/심사접근/실차·기관·클라우드/유효REST인증은 미확인입니다.
다음 단일 기존 PM은 지속 verifyqa 서명·설치 바이트/잠금·활성 작업을 재확인해 새 소스의 데이터 보존 업데이트와 실기기 한정 회귀를 진행합니다. **이번 전체 CI 성공은 아직 새 소스의 실기기 성공이 아닙니다.**
근거 build-reports/pm-20261026/readiness-ci-final.json 및 IT13 QAroot/AS-PM-20261026T0756의 원본ZIP·실제 서명/badging 로그. 새 수동 빌드·휴대전화 UI 조작 없음, 야간 Slack 발송 없음.
