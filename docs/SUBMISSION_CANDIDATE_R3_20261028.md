# 2026-10-28 12시 후보 r3·공식 문서 버전 대조

현재 PM HEAD f47cbdaf, 최신 검증 소스99d5da0/CI40592432776 success·publish skipped를 재조회했다. 게시 릴리스는 v0.3.0-preview만 존재한다. 공통 원장·standing 승인·배정·PR2 지정6387088890/최신6393949101, 03시 원본 실패2건과 11시 실제 결과를 읽었다. claim/진행 instrumentation·관련 writer 없음. 기존 통과한 폰시험·빌드·설치를 반복하지 않았다.

## 새 후보

IT13 Task/Win-Win-Challenge-QA-20261024/AS-M1-PM-20261028T1206/candidate-99d5da0-f3b8c701-docv4-r3. **18파일/17체크섬 오류0**, SHA256SUMS.txt `7e0b9a0334471849166b7b5389b9bda60cf87a4957053191ce0ff2c8ffe7f8b9`.

- release APK `f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f` (5171400B), cert187a401d. 08시 apksigner/manifest 검사 원본 포함, 새 검사를 했다는 주장이 아니다.
- source ZIP `e9a62dfa3cd64e33eb5a3792b366dd94b9c31e176a2f612cd7f9a4a093990217` (483649B), 기존 CI build ZIP digest be0cfdf5와 실제 대조 후 그대로 복사.
- PC ZIP·CI 증거·현재 verifyQa의 10시 공식주소/11시 DOM 실기기 기록을 별개 파일로 포함. CI-verification-historical-0755 installed 배열은 당시 bd/test229 기록이며 현재930/dac 설치본으로 오인하지 않도록 README에 명시.
- 공식 DOCX/PDF 같은 ID의 현재 v4를 전문 재열람했다. v4 바이트는 봉인 r2에서 동일 복사했으며 신규 materialize/렌더를 했다는 주장이 아니다. 후보 17개 파일의 독립 체크섬 목록에 포함.

## 문서 차이와 남은 조건

5쪽은 f1164b0·폰899/bd의 주소17.693초/DOM9.707초, 7쪽은 CI40436119702·release75b53185다. 현재 후보는99d5da0/CI40592432776/f3b8c701, 폰 자체 QA는930/dac 공식주소17.637초/DOM9.678초다. DOCUMENT_VERSION_GAPS.json과 binding/contentMatch=false, manifest/ready=false로 표시했다. 13쪽 b227ca2/CI40167658701 과거 사진 출처는 유지한다.

공식 문서 편집0·중복 생성0·렌더0. 개인정보/서명·선택 빈칸 유지. 실제 제출·공개배포·심사자 초대/권한확대0. 독립QA·사람사용성·release 자체 물리·실차·인증외부API·서명허용/심사접근은 완료로 올리지 않는다.

기존 r2 전후16/16/SUMS465f8212 유지, 현재 설치5 SHA 모두 11시와 일치. 앱UI/빌드/설치0. 준비 스크립트 최초 H 함수명이 PowerShell 기본 alias와 충돌해 후보 생성 전 중단됐고, 전용 함수명으로 고친 후 완료했다. 실패 프로세스를 숨기거나 새 빌드 성공으로 계산하지 않는다.

다음 단일 기존 PM: 공식 DOCX/PDF 같은 ID 5·7쪽을 최신 근거로 갱신하고 해당 스킬의 렌더 검수 후 별도 후보 개정본에 연결한다. 기존 r1/r2/r3 봉인본은 소급 수정하지 않는다.

11시 Slack은 이번 검색에서 실제 게시를 확인했다(중복발송0). 12시 발송은 별도 슬롯 영수증 확인 대상이며 폰푸시 수신은 별개다.
