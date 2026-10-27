# 제출 메일·첨부 목록 검토 초안 대조

기존 PM, 2026-10-28 02:05:41 KST. 비공개 IT13 AS-M1-PM-20261028T0203에 SUBMISSION_EMAIL_REVIEW_ONLY.txt 및 ATTACHMENT_REVIEW.json을 준비했습니다. 메일함 초안 생성·실제 발송·제출은 0이며 문서/후보 내용 변경도 없습니다.

## 검토용 초안

- 수신 주소는 공식 appdevchallenge@hyundai-partners.com. 제목은 공식 개인 참가 형식으로 접수양식의 신청자 성명을 사용하고, 발신 후보는 접수양식의 이메일로 연결했습니다. 실제 발신계정 접근이나 과거 제출 여부를 조사하지 않았으므로 신규 제출용 초안입니다. 개인정보 값은 GitHub에 복제하지 않습니다.
- 본문은 안심동행 플랫폼 소개, 원본 DOCX/열람용 PDF, 선택 개발자료 링크, 버전0.4.3·APK SHA256, 검증환경별 한계를 포함합니다. 영상·숏폼은 초안에서 제외했으며 전체 부재라고 단정하지 않습니다.
- 필수 첨부 후보: official-application-v4.docx 500068B SHAab4145047be92065a7d0a0383d171ad1096f89f68176278e6b8745891dc8192d. 선택 열람용 동일내용 PDF: official-application-v4.pdf 760964B SHA87f1a1745b445bab985eca161dc937e08e3840b8f050f27556254617b70445bc. 둘 다 기존ID/v4이고 실제 후보 파일의 크기/해시를 다시 확인했습니다.
- 선택 개발자료는 [현재 PM 소스/안내](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/2694957b9db4b9e6706ff6c6a942c37ab08913e0)와 apk/안심동행_안심동행플랫폼_release.apk의 커밋 고정 경로입니다. 현재 README와 해당 경로 존재/크기/완전한 Git blob 주소를 대조했습니다. 앱 내용 SHA75b53185…dd100,5170860B,Gitblob70e9c7735818bacf9937b3b0a6ac959cb0a5add8. 독립 HTTP 재다운로드·심사자 실제 접근 성공은 아닙니다.
- 초안SHA256 80b1450914833d6b9ae214127ed2a3fb97eb8633c707af0d61b5d2f9c0e9a858. 제목 개인성명 반복형식/미입력표식 없음/공식수신/본문구간/검토메모를 직접 읽어 확인했습니다. 원문초안은 개인정보가 포함되어 IT13 비공개에만 보존합니다.

## 실행안내·산출물 대조

소스 ZIP917ea321…4d18은139항목, PC ZIPd387260b…c365는4항목입니다. 두 ZIP 모두 PC 실행.cmd 및 tools/serve-demo.cjs 존재, PC ZIP에 dist/handoff-demo.html 존재를 확인했습니다. 런처는 Node 존재 확인→HTML이 없으면 bundle→정적서버 순서이며, 소스 package.json은 Node>=22·npm start/node server.js를 지정합니다. 정적서버 기본18420과 별도 상태서버8080을 구분하고 파일 직접열기 대신런처 사용을 안내합니다. 이번은 ZIP 내부 정적열람이며 재실행/새 성능·외부주소 성공 시험은 아닙니다.

소스ZIP README는 당시41c1812/CI40210143323 이력을 담고, 현재 PM README는f1164b0/CI40436119702·지정APK75b5로 갱신되어 있습니다. 봉인 ZIP을 수정하지 않고 현재 초안의 링크를 현 PM 커밋으로 고정해 과거 설명과 현재 근거를 구분했습니다.

## 보존·차단

r2 17파일/16체크섬 모두일치, SUMS465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c 전후불변. 설치5종 SHA 직전01시동일·QA lock없음. 02:04:04 관련writer0/진행instrumentation표식0 선확인. 읽기전용ADB만 수행, 원본앱데이터/main/easy/address미커밋·공식문서v4·r1/r2봉인후보 불변. 새 빌드/설치/CI요청/JUnit/폰UI/권한변경/공개배포/실기관발신/새비용0.

기명서명 허용·본인서명 유효성, 정확한 심사용계정/접근 및 실제 발송 승인은 미확인/미완료이므로 readyToSend=false입니다. release75 자체물리·독립QA·사람사용성·유효실서비스/실차 검증도 별도 유지합니다. 1차 필수요건과 제품 품질 승인을 합산하지 않습니다. PR2 private Draft/open미병합, 최신CI40436119702/sourcef1164b0 success·게시v0.3.0-preview만 재확인. 야간Slack발송0/기존18시게시읽기만·휴대폰push미확인. 새agent/예약/수신자0.

공식 근거(2026-10-28 재조회): [지원/첨부/제목/동의](https://appdevchallenge.auto-hmg.io/guide/submission). [설명회 공지](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000005)는 오늘14:00유지/이번조회에서접속URL미확인입니다.

다음 단일 책임: 기존 PM이 Pleos/AAOS 차량 대응 범위를 현재 소스의 SDK 의존성·Android manifest와 공식 개발 문서로 대조합니다. 실제 차량·기관 연동 성공 여부와 구분하고 새 빌드·권한 확대 없이 조사합니다.
