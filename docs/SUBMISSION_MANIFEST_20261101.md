# 2026년 11월 1일 제출 자료 및 발송 확인

이 목록은 2026-11-01 19:55 KST 독립 감사 지원에서 확인한 제출 자료와 메일 상태를 기록합니다. 과거 13쪽 서명 전 작업본 및 `feature/pm-api-screen-0.4.3` 안내를 최종 제출본과 구분하도록 정정했습니다. 개인정보·서명 PDF 원문과 메일 인증정보는 저장소에 복제하지 않습니다.

## 발송 상태

- 발신 계정: `csj@archiveos.kr`
- 수신처: `appdevchallenge@hyundai-partners.com`
- 최종 보완 메일 생성 시각: **2026-11-01 15:19:34 KST**
- 제목: **[수정제출] [차량용 앱 개발 공모전] 최성준_최성준**
- 메일 제공자 ID: `01a195c3-61a0-7499-9231-4d8441ff0f97`
- 19:55 KST 제공자 GET 조회 결과: **`last_event=delivered`**. 수신 메일 서버 전달 상태이며 주최 측의 접수 등록·내용 검토·심사 수락을 의미하지 않습니다.
- 제공자에서 첨부파일 4개와 파일명·바이트 크기를 조회했습니다. 제목·본문에 Unicode 대체문자(U+FFFD)가 없고 제출 브랜치 안내가 포함된 것을 확인했습니다.
- 이전 15:13 발송분보다 이 보완 메일을 최종 기준으로 삼습니다. 중복 제출을 방지하기 위해 감사 지원 과정에서 새 메일을 보내지 않았습니다.
- **주최 측 공식 접수 확인: 미확인.** 단순 발송 준비 상태가 아니며, 접수 확인 답신은 별도로 보존해야 합니다.

## 보완 메일에 첨부된 자료

| 구분 | 제공자에서 확인한 첨부파일명 | 바이트 |
| --- | --- | ---: |
| 접수 문서 | 안심동행플랫폼_서명완료_접수양식.pdf | 260,513 |
| 시연 영상 | 안심동행플랫폼_실제조작_33초.mp4 | 419,299 |
| Android APK | 안심동행_안심동행플랫폼_release.apk | 5,171,848 |
| 소스 코드 | 안심동행플랫폼_0.4.3_소스코드.zip | 581,267 |

접수 PDF는 기존 감사·제출 기록에서 확인한 **8쪽 서명 완료 최종본**입니다. DOCX는 이번 메일 첨부에 포함되지 않았습니다. 과거 v7/v9 13쪽 문서는 작업 이력이며 최종 서명 PDF의 대체물이 아닙니다. 과거 r4/r5/r6 ZIP은 보존하며 최종 메일 첨부로 오인하지 않습니다. 추가 69초 영상·숏폼·전체 자료 ZIP의 존재와 이번 네 개 첨부는 별개입니다.

### 제출 준비 폴더 원본의 SHA-256

다음 값은 19:55 KST 제출 담당자의 IT13 준비 폴더 파일을 읽어 계산한 값입니다. 제공자에서 조회한 파일 크기와 동일합니다. 제공자 첨부 바이트의 별도 다운로드 해시 검증 여부는 독립 감사 readback에 구분해 기록합니다.

- 서명 PDF: `cec8f69475d3907f9dbce24d60a512226696bac1c728232f8ac09d939cb85502`
- 33초 영상: `5c7cc5a0a0103a82d2ea234b4bff766ef403ca7151b34777f3984cdfdebc4843`
- APK: `09e488aa8cf103dffb187ca4fbee6ed72a2fbd100a82c5ba89faa2da173f5e90`
- 소스 ZIP: `611c81f4a5cdb08abab4fd74be3fe4887e3abe9594893e4c3a309acc0608af58`

## 저장소 및 실행 기준

- 검토 브랜치: [`submission/2026-11-01`](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/submission/2026-11-01)
- 검증 제품 소스: [`8f4aaf93e36e4dd3ab267c09c274dedaca4057a6`](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/8f4aaf93e36e4dd3ab267c09c274dedaca4057a6)
- 지정 APK: [`apk/안심동행_안심동행플랫폼_release.apk`](https://github.com/CSJ-PJT/Win-Win-Challenge/blob/bfaae931cee93d83ce8472a3f9ce819f386f8209/apk/안심동행_안심동행플랫폼_release.apk)
- 제품 검증 이력: [CI 40887985855](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40887985855), verify-build/live-address/native-smoke 성공, publish skipped. 이후 문서 수정이 새 제품 검증이라는 의미는 아닙니다.
- README·PoC 검토 도구 기준: [`08c28a3`](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/08c28a37067510cadd8a38fa198124ce3bb99ea8). 기존 서비스 PoC 결과는 2/2 흐름·39 HTTP 요청·54 assertion이며 Android 실기기·운영 push 검증과 구분합니다.

Node.js 22 이상에서 `npm start` 후 `http://127.0.0.1:8080/vehicle`, `/facility`, `/guardian`, `/visitor`를 엽니다. 대표 서비스 재현은 `node tools/poc-e2e.cjs`입니다. HTTP 모드는 로컬 파일 저장·역할별 상태 공유, 단일 HTML/APK 모드는 기기 내 저장입니다. 합성 사람·시설·차량 신호를 사용하며 운영 인증·클라우드·실기관 전송 완료를 주장하지 않습니다.

## 남은 확인

1. **주최 측 접수 등록 확인**: 메일 서버 전달과 공식 접수 확인 답신을 구분합니다. 반송 또는 보완 요청이 오면 기존 제출 담당자가 처리합니다.
2. **Private GitHub 심사 접근**: 공식 심사 계정 ID 및 실제 접근 성공은 아직 독립 확인하지 못했습니다. 저장소 공개·임의 계정 초대는 수행하지 않았습니다. 첨부 소스 ZIP의 제공과 Private 저장소 접근 성공은 별개입니다.
3. **후속 제품 검증**: 최종 release APK의 전체 독립 실기기 QA와 실제 기관·차량 연계는 후속 단계로 유지합니다. 이미 확보된 제출 문서·PoC의 메일 전송 사실을 취소하는 조건으로 사용하지 않습니다.
4. **ArchiveOS 운영 연동**: 기존 API 502 기록은 메일 발송 경로와 별개입니다. 이번 감사 지원에서 서버 복구·DB 변경·재배포를 하지 않았으며 ArchiveOS 운영 정상화를 주장하지 않습니다.

## 변경 이력과 범위

이번 정정은 제출 목록 문서 한 개에 한정됩니다. 이미 보낸 서명 PDF·영상·APK·소스 ZIP, 기존 제품 코드·서명·공개 범위·자동화·실행 프로세스는 변경하지 않았습니다. 따라서 이 문서 정정 커밋이 이미 발송된 소스 ZIP에 들어 있다고 주장하지 않습니다. 과거 문서 검수는 [v9 이력](OFFICIAL_DOCUMENT_V9_20261030.md)과 Git 이력으로 보존됩니다.

로컬 증거: 기존 제출 작업 폴더의 `mail-staging/resend-submission-corrected-receipt.json`, `submission-status.json`, 독립 GET 조회 `AUDIT_PROVIDER_READBACK_20261101.json`. API 키·서명 문서 원문·서명된 다운로드 URL은 GitHub에 기록하지 않습니다.
