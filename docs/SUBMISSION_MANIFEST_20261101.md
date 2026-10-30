# 11월 1일 제출 목록

사용자 내부 목표는 2026-11-01, 공식 접수 기간은 2026-10-21~11-15 KST입니다. 공식 필수 서류와 선택 Git PoC를 함께 준비합니다. 이 목록은 검토용이며 접수·발송·계정초대 기록이 아닙니다.

## 실제 제출할 자료

| 구분 | 자료와 현재 고정 기준 | 제출 전에 필요한 일 |
| --- | --- | --- |
| 필수 | 공식 접수양식(기획서)·개인정보 동의서: 동일 ID DOCX/PDF v8, 13쪽. [기존 문서 검수 기록](OFFICIAL_DOCUMENT_V8_20261030.md) | 실제 11/1 본인 확인·서명, 작성일·서명일 기입 후 최종 파일 확인. 현재는 서명 전 작업본 |
| 선택 Git | Private 저장소 https://github.com/CSJ-PJT/Win-Win-Challenge, 검토 브랜치 feature/pm-api-screen-0.4.3 | 공지된 심사계정 ID의 공식 출처 확인 → 별도 권한변경 승인 → 실제 접근 확인. 이번 초대0 |
| 선택 Git 소스 | [제품 8f4aaf9](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/8f4aaf93e36e4dd3ab267c09c274dedaca4057a6), [README·PoC 검토 도구 08c28a3](https://github.com/CSJ-PJT/Win-Win-Challenge/tree/08c28a37067510cadd8a38fa198124ce3bb99ea8) | 제출 시 브랜치뿐 아니라 고정 커밋 링크를 함께 명시 |
| 선택 Git APK | [apk/안심동행_안심동행플랫폼_release.apk](https://github.com/CSJ-PJT/Win-Win-Challenge/blob/bfaae931cee93d83ce8472a3f9ce819f386f8209/apk/안심동행_안심동행플랫폼_release.apk) | r6와 정합화한 release09e488aa, 5,171,848B. 심사자 다운로드·기동 확인은 별도. 기존 폰 삭제/교체 금지 |
| 선택 시연 자료 | [시연 진행안](https://github.com/CSJ-PJT/Win-Win-Challenge/blob/08c28a37067510cadd8a38fa198124ce3bb99ea8/docs/DEMO_SCRIPT.md), [화면·API·오류·권한](https://github.com/CSJ-PJT/Win-Win-Challenge/blob/08c28a37067510cadd8a38fa198124ce3bb99ea8/docs/POC_REVIEW_GUIDE.md) | 저장소 문서를 영상 제출로 계산하지 않음. 실제 제출할 영상 URL은 이 목록에 없음 |
| 선택 숏폼 | 공식 기획서 해당 칸 공란 | 이번 미선택. 임의 링크 생성·공개게시0 |

DOCX와 PDF는 같은 양식의 편집본·열람본입니다. 공식 안내가 두 형식 모두 제출을 필수로 요구한다고 해석하지 않습니다. 본인 서명한 양식에 개인정보 동의서가 포함되어 있으므로 별도 기획서를 중복 생성하지 않습니다. r6 ZIP에는 **v7**이 들어 있어 v8/11월1일 서명본의 대체물로 보내면 안 됩니다. r4/r5/r6는 수정하지 않습니다.

문서 작업본의 사용자 열람 위치: [DOCX](https://chatgpt.com/library?file_id=libfile_412035b073bc8191a3980f378b0df188&account_id=personal) · [PDF](https://chatgpt.com/library?file_id=libfile_bed9844c793c8191b486dc00e74925fd&account_id=personal). 이 링크는 소유자 검토용이며 공모전 심사자에게 접근 가능한 공개 제출 링크라고 주장하지 않습니다. 실제 접수에는 본인 서명한 파일 첨부가 필요합니다. 개인정보 문서 바이트는 GitHub에 복제하지 않습니다.

## Git 리뷰에 함께 제공할 실행 정보

Node.js22 이상에서 저장소를 복제하고 npm start로 http://127.0.0.1:8080/vehicle, /facility, /guardian, /visitor를 열 수 있습니다. HTTP 모드는 로컬 파일 저장·역할별 상태 공유, 단일 HTML/APK 모드는 기기 내 저장입니다. 합성 사람·시설·차량 신호이며 운영 인증/클라우드·실기관 전송과 구분합니다.

대표 서비스 재현: node tools/poc-e2e.cjs. **기존 10/30 12:02KST 결과**는 2/2흐름·39HTTP요청·54assertion PASS입니다. 이번에 재실행하지 않았습니다. 화면 클릭/Android/push 검증이 아닙니다. [기존 실행JSON](https://github.com/CSJ-PJT/Win-Win-Challenge/blob/08c28a37067510cadd8a38fa198124ce3bb99ea8/build-reports/pm-20261030/poc-service-e2e.json).

제품 CI는 [40887985855](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40887985855), source8f4aaf9, verify-build/live-address/native-smoke 성공·publish skipped입니다. 이후 문서/목록 커밋이 해당 CI로 새 검증됐다고 표시하지 않습니다. 게시 v0.3.0-preview를 지정 0.4.3 후보로 연결하지 않습니다.

## 심사 접근 확인 결과

2026-10-30 13시 실행에서 공식 지원·제출, FAQ, 공지목록과 공지3개, 도움말·문의 본문 및 공식 도메인 검색 2개를 확인했습니다.

- Private 저장소 허용, 공지된 심사계정 Collaborator 초대와 마감 전 정상 접근 확인 요구는 확인했습니다.
- 조회한 공개 범위에서는 **정확한 심사계정 ID를 찾지 못했습니다**. 비공개 안내·후속 공지까지 계정이 없다는 판정은 아닙니다. 무작위 사용자명·주최측 조직명을 심사계정으로 추정하지 않습니다.
- 기명만으로 서명 요건을 충족하는지, 허용 전자서명 방식과 정확한 마감시각도 이번 본문에서 확정하지 못했습니다.
- 공식 문의처는 appdevchallenge@hyundai-partners.com입니다. 문의 초안을 아래에 준비했지만 이메일 발송·메일함 초안 등록은 하지 않았습니다.

검토할 문의 내용:
> 11월 1일 1차 접수를 준비 중입니다. Private GitHub 저장소 심사용 계정의 정확한 ID와 공식 안내 위치, 접근 확인 절차를 알려주시기 바랍니다. 개인정보 동의서의 허용 서명 방식과 접수 마감의 정확한 KST 시각도 확인 부탁드립니다.

원래 제출 제목 형식은 공식 지원 페이지의 “[차량용 앱 개발 공모전] 팀명(개인은 성명)_대표자명”입니다. 위 문의는 접수메일이 아니며 사용자 성명·연락처·개인 파일을 포함하지 않습니다. 발송 및 권한변경은 별도 승인 범위입니다.

## 현재 판정과 다음 작업

| 준비 완료 | 미완료 | 제출됨 |
| --- | --- | --- |
| 공식 문서 본문·화면설계의 기존 v8 검수, PoC README/계약/후속 계획, 이번 고정 링크 제출목록 | 11/1 본인 확인·서명; 선택 Git의 공식 심사계정 ID·접근 확인 | 0건 |

**필수 서류의 ONE blocker는 실제 본인 확인·서명 전이라는 점입니다.** 선택 Git 접근 문제로 기획서 내용 준비를 중지하지 않습니다. 최종 release 물리·독립 QA는 후속 제품 단계입니다.

다음 단일 기존 PM AS-M1: 기존 source8f4aaf9 CI의 실제 화면 자료를 사용해 대표 시연 순서에 맞는 최신 증거 캡션을 준비합니다. 새 테스트·새 촬영으로 표시하지 않으며, 공식 문서 편집은 실제 보완 필요가 확인될 때만 수행합니다. 서명·문의 발송·접수·초대는 대행하지 않습니다.

공식 확인 출처:
- [지원·제출](https://appdevchallenge.auto-hmg.io/guide/submission)
- [FAQ](https://appdevchallenge.auto-hmg.io/faq)
- [공지목록](https://appdevchallenge.auto-hmg.io/notice)
- [출품 유의](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000006)
- [모집 공고](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000001)
- [설명회](https://appdevchallenge.auto-hmg.io/notice/c0a1a000-2026-4923-8000-000000000005)
- [문의 안내](https://appdevchallenge.auto-hmg.io/guide/help)
