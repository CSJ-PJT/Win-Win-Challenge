# v4 문서 실제 첨부 후보 r2 검수

2026-10-28 01:02:03 KST 기존 PM이 IT13 AS-M1-PM-20261028T0055에 candidate-f1164b0-75b53185-docv4-r2를 만들었습니다. 제품/문서 내용 변경과 실제 제출은 수행하지 않았습니다.

- 기존 같은ID DOCX/PDF 현재 v4를 다시 확인하고 실제 바이트를 가져왔습니다. DOCX500068B SHA ab4145047be92065a7d0a0383d171ad1096f89f68176278e6b8745891dc8192d, PDF760964B SHA87f1a1745b445bab985eca161dc937e08e3840b8f050f27556254617b70445bc. 원본 ID/버전/내용/서명 불변·새 Library 문서 생성0.
- 새 후보에는 official-application-v4.docx 및 .pdf 실제 파일 포함. manifest·DOCUMENT_VERSION_BINDINGS에 후보 상대경로·ID·버전·바이트·해시를 연결했습니다. 17파일/16체크섬 모두 일치. SHA256SUMS.txt SHA465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c.
- 원래 r1은 변경 전후13체크섬 모두 일치, SUMS e7544d063b4091d26b0483125be939a447b53ff7b0304a098b0f105b6023a10a 유지. r1의 checksum은 r2에서 HISTORY_R1_SHA256SUMS.txt로 보존. r1을 덮어쓰지 않았습니다.
- 원문 개인정보/서명 포함 문서 바이트는 IT13 비공개 후보에만 두고 GitHub에는 이 검수문과 메타데이터만 등록합니다. 과거 ACCESS_REVIEW/README는 당시 이력이며 r2 README 상단에 현재 상태/지정APK 정합화 후속 우선/실제발송 없음 설명을 붙였습니다.
- 전송 중 exec transport 단절 후 복구, 최초 디렉터리 없음 ENOENT 보존. 미완료/실패 전달을 성공으로 처리하지 않았습니다. 소유 폴더 생성 후 stage2 별도14조각 전송 완료를 회수·검증하고 재조립 전체SHA/크기를 확인했습니다. 파일 내용 수정·PDF/DOCX 재생성/새 렌더0; 이전13쪽 렌더검수는 과거 근거입니다.
- 설치5종 SHA는00시와 전부 동일, QA lock없음/관련writer0/activeinstrumentation0. 읽기전용ADB만 수행. 원본앱/사용자데이터·main/easy/address미커밋 보존. 새빌드/설치/JUnit/폰UI/CI요청/공개배포/권한변경/발송/실제제출/새비용0.
- PR2 private Draft/open미병합 기준HEAD8a1f28c, 제품sourcef1164b0/CI40436119702 success 유지/게시v0.3.0-preview만 재조회. 새 후보의 ready=false 유지: 기명서명허용/심사계정접근/독립QA·사람사용성/release75자체물리/유효외부서비스 검증은 별도입니다. 문서 실제 첨부 준비 완료가 제품완료나 실제 접수는 아닙니다.
- 야간 Slack 발송0. 기존18시게시만 읽기확인, 휴대폰push미확인. 새예약/수신자/agent0.

다음 단일 책임자 기존 PM: r2의 실행안내·소스ZIP/APK·저장소 지정경로·문서 참조를 대조하고 제출용 메일 제목·본문·필수/선택 첨부 목록의 검토 가능한 최종 초안을 준비합니다. 발송·제출·권한 확대는 별도 승인 전 수행하지 않습니다.
