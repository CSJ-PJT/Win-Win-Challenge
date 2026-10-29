# 새 CI와 공식 문서 v6 후보 r5 준비 — 2026-10-29 18시 KST

기존 PM AS-M1이 제품 소스 b37287ef63a164c6eeedd41e6aeb3be9170b2882 / CI40820861095 / 같은 ID 문서 v6를 하나의 별도 검토 후보로 묶었다. **17파일, 체크섬16/16 일치, 불일치0**, ZIP 내부 재읽기와 testzip 정상이다. 실제 제출·공개 배포·IT13 복사 완료가 아니다.

## 입력 근거와 범위
- 최신 PR #2 Draft open/unmerged, HEAD1760786(문서 기록). 실행 중 새 CI 없음. 최신CI40820861095 검증3job success/publish skipped를 새로 조회했다. 게시릴리스는 v0.3.0-preview.
- Actions 원본 ZIP3개 로컬 SHA가 최신API digest와 일치. APK4종도 15시 검사 바이트와 다시 일치. 각 package/target/cert를 별도 manifest로 보존한다.
- 소스ZIP web/app.js와 release APK assets/app.js 바이트 동일, PC ZIP의 dist와 CI dist 동일. 소스 ZIP에 jks/keystore/p12/.env 경로가 없다. 실제 외부 서비스 인증/원격키를 탐색하지 않았다.
- 같은 Library ID의 DOCX/PDF v6를 현재 읽고 실제 바이트로 materialize했다. 문서의 b37287e/CI40820861095/release2ce 및 과거폰 verifyqa930 구분을 확인했다.
- 새 문서 편집·빌드·설치·폰 시험·독립 QA 0건. 이번 checksum 검사를 제품 기능 재시험으로 합산하지 않는다.

## PDF 저장 바이트 정정
17시 PDF SHA ee40ec10…11a0257/736230B는 저장 전 렌더 파일이었다. 현재 공식 v6 저장본은 **894e5bde6487c5c0f8b428c7da3fd18612f90cffebd49783f22e14fc95eafa38 / 761360B**이다. 13쪽 전체 텍스트와 72dpi 페이지 픽셀은 저장 전 원고와 동일하다. C2PA 마커를 확인했으나 서명 유효성 자체는 독립 검증하지 않았다. 17시 기계기록/표를 저장본 기준으로 정정하고 원고 해시도 별도 필드에 보존했다. 공식 문서 버전은 v6 그대로다.

## 후보 고정
- ZIP: ansim-candidate-b37287e-docv6-r5-20261029.zip, 13500733B, SHA256 e94b5c2cd45bd2ed549fa96a16506826da3891a5564ac53195072ab0eb40d630
- SHA256SUMS.txt SHA256 1935ea1e36388ed821f4ad4e3e346278650e9b38fdb81ee49b05e99a51ba8d3e
- 포함: release/QA 및 각 test APK4, sourceZIP/PCZIP, DOCX/PDF2, 원본 CI증거ZIP3, manifest/문서바이트 비교/README/체크섬.
- 공식 원본 ID는 유지했고 별도 공식 DOCX/PDF 복제 항목은 만들지 않았다. ZIP은 바이트를 고정한 사전 검토용 묶음이다. 개인정보가 있는 공식 양식/ZIP 바이트를 공개 Git에 추가하지 않았다.
- 이전 r4/source99/f3b8/docv5, r1–r3, 기존 폰 앱·데이터·서명은 조작하지 않았다. IT13 보존 상태의 마지막 실측은05:07 과거 근거이며 현재 재측정은 아니다.

## 게이트와 전달
새 release 실기기 NOT_RUN, 새 CI QA 실기기 NOT_RUN, 독립 QA NOT_APPROVED, 실제 제출/공개배포 false. 설치본 과거cert74f3b4db와 새cert96c6ed65 차이는 그대로다. 서명 추출은 로컬 암호 검증과 구분한다.
기존 원격 월 사용 한도는 재시도·재연결·우회하지 않았다. 현재 OPS/락/instrumentation/writer/폰 상태·기존 Slack sender/ReportKey 영수증은 접근하지 못했고 IT13 원장·보고큐 미반영. 당일 #asdh 공개검색0건은 전체 발송 실패 증명이 아니다. 직접 Slack 전송/재발송0·폰push미확인. 이번 저장소 보고문은 IT13 큐나 폰 전달이 아니다.

다음 단일 기존 PM AS-M1: CI 릴리스 서명 안내에 기존 앱 삭제 권고가 있는지 실제 소스로 확인하고 보존 원칙에 맞게 필요한 문구만 수정한다. 재빌드·키 변경·설치·배포 없이 검증한다.
