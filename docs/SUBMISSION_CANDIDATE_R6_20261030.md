# 2026-10-30 03시 — 검토 후보 r6 준비·저장

기존 PM AS-M1이 새 제품 `8f4aaf93e36e4dd3ab267c09c274dedaca4057a6` / CI40887985855와 같은ID 공식 DOCX/PDF **v7**을 별도 비공개 검토 후보r6로 고정했다. 제품 완료나 실제 제출이 아니라 **PREPARED_NOT_SUBMITTED / ready_for_submission=false**이다.

## 범위와 대조

- 새 CI에서 나온 release/test·QA/test 4종, 소스 ZIP·PC ZIP, 저장된 canonical v7 DOCX/PDF, 원본 CI artifact ZIP3개, 검수/문서해시/현재메타데이터 증거 및 manifest/README/checksums.
- 최종 **17파일 / 체크섬16/16일치 / 실패0**, ZIP CRC 오류0. SHA256SUMS 자신은 목록에서 제외한다.
- GitHub artifact API digest3/3과 기존 내려받은 바이트를 이번에 재대조했고 APK4·공식저장문서2 해시가 검수 기록과 일치한다.
- 공식 문서2개의 현재version7/file_id/크기를 다시 읽어 현재 저장본과 대조했다. PDF는 업로드 전 원고가 아니라761401B/SHA be6cd5e6…d28c214 canonical 저장본을 묶었다.
- source ZIP app.js=release APK asset, PC HTML=CI dist 바이트일치. source ZIP 내 env/keystore 경로 없음 검사. 인증서/manifest 판정은 해시가 같은00시 검수 바이트의 결과이며 새 암호학적 서명·폰 검증을 수행한 것은 아니다.

제품 CI 범위는 Node135/135, Chromium 모의주소10/10, PC공식주소7/7, Android15 x86_64 **release 에뮬레이터** 주소JUnit1·DOM1·주요UI7이다. 새QA/폰/독립QA 통과와 합산하지 않는다.

## 저장 결과

- 파일: `ansim-candidate-8f4aaf9-docv7-r6-20261030.zip`
- bytes: **13542910**
- ZIP SHA256: `37bf2683a4ab547c22a5042420536f3af969ec103fe25c208c769f23c8ab836d`
- SHA256SUMS SHA256: `bae55c1db7a358f666c2a68428d4a0cab94b8d8d400b34e2e280344836d41dbe`
- manifest SHA256: `6760cd3dd7f3b548c54d4ec43ccc412d5e99b3fbf006c745fe0320cdea801584`
- [비공개 검토 후보 r6](https://chatgpt.com/library?file_id=libfile_46458205d1bc819184b1a045cb2e6229&account_id=personal) 저장 성공. Library ID `libfile_46458205d1bc819184b1a045cb2e6229`, file_id `file_0000000019e881fda9b3cce6341a2c18`, version 0.
- 비식별 결과는 [JSON](../build-reports/pm-20261030/submission-candidate-r6.json). 개인 정보가 담긴 문서 바이트나 전체ZIP은 GitHub 증거에 복제하지 않았다.

r5 ZIP SHA `e94b5c2cd45bd2ed549fa96a16506826da3891a5564ac53195072ab0eb40d630`는 로컬 봉인본 재계산으로 동일 확인했다. r4/r5 파일에 쓰지 않았으며 IT13의 r4 상태를 새로 검증했다는 뜻은 아니다. v7 공식 ID를 복제/교체한 것이 아니라 고정 후보 안에 현재 버전 바이트를 포함했다.

## 차단·변화·다음 단일 담당

직전 대비 검토 후보 **1건 준비·저장**. 제품코드/공식문서/빌드/설치/폰시험/독립QA 승인 변화0건. 공개게시 릴리스v0.3.0-preview만 유지, PR#2 Draft/open. 실제 제출·심사자 접근/권한 변경·IT13 복사 없음.

새release 서명은 마지막 관측 폰 설치본과 다르며 원래키 가용성 미조사다. 새source 물리기기·독립QA·실제제출 게이트 미완료. 원격월한도 제한으로 공통OPS/QA lock/진행프로세스/현재설치해시·전송기receipt 미조회, 재시도/재연결/우회 없이 IT13원장/큐 미반영을 유지했다. 휴대폰 재승인 대기로 변경하지 않는다.

야간 Slack **NOT_SENT_NIGHT**,10/30 공개검색0건은 주간송신실패 증거가 아니다. 주간 송신 성공·폰push수신 미확인. 기존일정변경/신규예약/신규agent 없음; 예약활성 자체는 이번 미조회다.

**다음 단일 기존 PM AS-M1:** 제출 게이트 문서의 후보·문서 버전을 r6/source8f4aaf9/v7과 대조해 남은 근거·승인 조건을 정리한다. 실제제출·공개배포·권한확대는 하지 않는다.
