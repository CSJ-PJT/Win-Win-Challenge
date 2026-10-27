# 공식 제출 문서 최신 검증 기록 반영

2026-10-27 14시 기존 PM이 공식 DOCX·PDF를 같은 Library ID에서 v3→v4로 교체하고 13쪽을 렌더 검수했습니다. 문서 정합성 작업이며 제품·독립 QA·실제 제출 완료는 아닙니다.

## 변경과 검증

- 5쪽: 소스 f1164b0 / CI40436119702의 자동검사112, Android15 release 주소1·UI7·DOM1, PC주소7·글씨12조합과 별도 Android16 verifyqa bd79075f의 주소1(17.693초)·DOM1(9.707초), COLD 복원·200% 스크롤 자체 QA를 구분했습니다. 물리 QA source899a5a1/test229를 새 release75b5 통과로 합산하지 않았습니다. 옛4ed 실제10분 만료시험은 과거 원장에 보존하며 새 앱 결과로 옮기지 않았습니다.
- 7쪽: CI40436119702(10/27 11:12 KST 완료), release75b53185…dd100, 별도 phonebd79075f…b7fa996 및 release 자체 물리 실행 잔여를 반영했습니다. 게시 릴리스 0.3.0-preview 유지.
- 10쪽: 기존 그림이 하단 흐름을 바닥글 아래로 밀던 문제를 비율90%·중앙정렬로 수정했습니다. 그림 원본과 문장은 보존했습니다.
- 13쪽 과거 실제 화면 b227ca2 / CI40167658701 및 모든 이미지·동의·서명·개인정보·빈 항목을 보존했습니다.

DOCX는 document.xml만 변경했고 텍스트 노드3개 및 10쪽 그림 배치만 달라졌습니다. 최종13쪽 PNG 모두 직접 검토. 원PDF 대비 픽셀 변화는5·7·10쪽, 공백 정규화 텍스트 변화는5·7쪽뿐입니다. 초기 렌더의 한글누락은 렌더환경 Noto폰트 경로를 복구해 해결했으며 잘못된 렌더는 업로드하지 않았습니다.

## 같은 파일 ID와 저장된 바이트

| 문서 | 기존 Library ID | 버전 | 저장 바이트 | SHA256 |
|---|---|---|---:|---|
| 공식 DOCX | libfile_412035b073bc8191a3980f378b0df188 | 4 (guard3) | 500068 | ab4145047be92065a7d0a0383d171ad1096f89f68176278e6b8745891dc8192d |
| 공식 PDF | libfile_bed9844c793c8191b486dc00e74925fd | 4 (guard3) | 760964 | 87f1a1745b445bab985eca161dc937e08e3840b8f050f27556254617b70445bc |

순서대로 두 교체 모두 succeeded·local_metadata_applied=true. 실제 저장 v4를 다시 확보해 DOCX는 업로드바이트 동일, PDF는 입력735834B/SHA c7aa604417e51ed8873149a9aa0e4ac2f1e4cc0fc4a84ab3ca6cb22730a71430와 저장바이트는 다르나 13쪽 픽셀·텍스트·페이지박스 모두동일함을 검증했습니다. 원문·개인정보·서명을 Git에 첨부하지 않습니다.

## 보존과 남은 일

IT13 AS-M1-PM-20261027T1403에 installed-hashes.json, evidence.json, verification.md. 14:03 lock없음·진행 instrumentation없음, 5설치SHA 직전동일. 폰UI/설치/새JUnit/빌드/CI요청0. PR2 Private Draft/open/미병합, CI40436119702 작업3 success/publish skipped, 공개 v0.3.0-preview만 재확인했습니다.

13시 봉인 candidate-f1164b0-75b53185는14:08:48 12파일·11체크섬 오류0, SHA256SUMS 1701675e74fe20aff4549821e8230718daab64604dab7830df6ad90683c49fb4 유지. 그 후보의 v3참조·ready=false를 소급 덮어쓰지 않았습니다. 이번 공식 v4의 기록갱신으로 문서의 최신 검증 기록 차이는 해소됐지만 후보 묶음의 새 revision은 아직 필요합니다.

release75b5 자체 실기기 runtime NOT_RUN(설치 원본release와 서명다름), 독립QA·사람사용성·심사접근·실기관/Pleos/AAOS/실차 검증과 실제제출은 별도 미완료입니다. 공개배포·실제제출·새비용·권한확대 없음.

다음 단일 책임자는 기존 PM입니다. 갱신된 공식 DOCX·PDF v4를 별도 후보 revision의 ID·해시로 고정하고 최신 APK·소스 ZIP 및 심사 접근 조건을 대조합니다. 13시 봉인 후보는 보존합니다.

[현재 CI](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40436119702) · [09시 주소 자체QA](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6430353778) · [10시 DOM 자체QA](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6431084850) · [13시 후보](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6433499177)
