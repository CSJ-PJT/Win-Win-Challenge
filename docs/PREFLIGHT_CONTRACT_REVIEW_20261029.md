# 설치 사전검사의 판정 경계 검증 — 2026-10-29 09시 점검

**실제 관측08:58 KST, 로컬 합성 검사8/8 예상대로, 제품/실제 APK/Android 신규 시험0.** 기존 PM이 현재 `tools/qa_update_preflight.py`를 읽고 독립 로컬 Python subprocess에서 경계 사례를 확인했습니다. IT13 원격 제한을 다른 경로로 우회해 실행한 것이 아닙니다. GitHub에서 읽은 코드를 로컬에 그대로 두고 합성 바이트만 사용했습니다.

## 바인딩과 도구 목적

제품소스 `99d5da02f20d3523d55897795d1f4a6b1fb1690a`, PM HEAD `55b1c3d38fb7949553ddf482c81eb92ae162c327`의 도구 blob은 동일 `0d9409a334989a152ef106d653d12f7199407e47`입니다. 실행한 소스 SHA256은 `9767fea05922ff9f6243adef0128eb186f2464e30d26d911ee94b4becb2bd16c`입니다. 도구 원본은 수정하지 않았습니다. [재현 하네스](../build-reports/pm-20261029/preflight-contract-review.py)와 [실행 결과](../build-reports/pm-20261029/preflight-contract-review.json)를 보존합니다.

도구는 signing block에서 leaf 바이트의 SHA 집합을 추출해 비교하는 읽기 전용 gate입니다. 실제 서명의 암호학 검증, leaf의 X.509 유효성, 전체 ZIP/APK 구조, package/version/rotation lineage·설치 정책은 검증하지 않습니다. 합성 fixture는 의도적으로 실제 APK/DER 인증서가 아니며 이것이 인증서 동일성 검사만의 경계를 보여 줍니다. 생성/실행한 앱·APK나 실제 키는 없습니다.

## 실제 로컬 subprocess 결과

| 사례 | exit | JSON status/결과 |
|---|---:|---|
| 같은 합성 입력 | 0 | CERTIFICATES_MATCH_NOT_INSTALL_APPROVAL |
| 다른 바이트·같은 leaf | 0 | 같은 상태; 바이트/서명/설치 검증이 아님 |
| 다른 leaf | 2 | CERTIFICATE_MISMATCH |
| 손상 입력 | 3 | UNREADABLE_OR_UNSUPPORTED_APK |
| 누락 입력 파일 | 3 | 같은 상태 |
| scheme간 다른 leaf | 3 | 같은 상태 |
| CLI 필수 인자 누락 | 2 | JSON 없음·stderr 있음 |
| --output이 디렉터리 | 1 | JSON 없음·stderr 있음 |

JSON을 반환한6개 경우 모두 `signature_verified=false`, `package_version_lineage_verified=false`, `installation_authorized=false`, `device_actions=none`을 확인했습니다. 뒤2개는 거짓 필드를 반환한 것이 아니라 JSON 자체가 없습니다.

인자 파싱은 입력검사 try 밖의 argparse에 있고 output 쓰기도 try 밖입니다. 따라서 **exit2만으로 인증서 불일치로 단정하거나, exit0만으로 설치 승인하면 안 됩니다.** 출력 실패는 입력검사의 exit3 계약에 포함되지 않습니다. 전체 예외 stderr는 공개 기록에 복제하지 않고 존재 여부만 기록했습니다.

소비자는 JSON 파싱·정확한 scope/status·필드 존재·false 경계를 함께 확인하고, JSON 없음/알 수 없는 종료값/모순은 설치 불가·판정 미확인으로 처리해야 합니다. 인증서가 같아도 전체 apksigner, 실제 package/version, 현재 설치 바이트, 사용자 데이터·업데이트 정책·단일 점유 조건을 별도로 검증해야 합니다. 인증서 검사 결과에는 설치 승인 권한이 없습니다.

## 과거 시험과 이번 시험의 분리

[10/25 실제 APK 결과](../build-reports/pm-20261025/qa-update-preflight.json)는 341qa→당시후보 불일치2/같은파일0/손상3/누락3의4건을 기록합니다. 이번 합성8건과 합산하지 않습니다. 추측한 `test/qa_update_preflight_test.py` 경로는404였으며 recursive tree에서 해당 이름의 시험 파일을 발견하지 못했습니다. 이것이 다른 모든 시험 부재의 증명은 아닙니다. 이번 하네스는 별도 검증 기록이며 기존 제품·테스트 소스 변경0입니다.

## 릴리스와 현장 제한

현재 CI40592432776/source99 verify-build/live-address/native-smoke 성공·publish skipped, 게시v0.3.0-preview 유지 상태를 재조회했습니다. 이번 합성 subprocess8건은 Node/JUnit/CI/app acceptance 수에 더하지 않으며 release 물리/독립QA/사람사용성 승인으로 표시하지 않습니다.

원격 월간 제한의 “재시도/재연결 금지”를 따랐습니다. IT13 공통OPS/standing/assignment/lock/process/keyguard·설치5SHA·봉인r4·DOCX/PDF·메일원문을 새로 읽거나 쓰지 못했습니다. 현장 해시 보존은 **05:07 마지막 관측**이며 공통 원장은 미반영입니다. 기존 앱·데이터·키·권한·비용·봉인후보·원본문서 변경0, 새 빌드/설치/폰시험/CI요청/실제제출0입니다. 예약은 변경하지 않았으며 제품 완료와 별개입니다.

## 09시 Slack 전달

기존 IT13 ArchiveOS sender·큐 파일·ReportKey/receipt에 접근하지 못하므로 이번 **기존 봇 전송 성공을 확인하지 못했습니다**. 직접 Slack 대체 전송·테스트·새수신자·새예약은 만들지 않았습니다. JSON에11줄/1200자이하 검토용 상태판을 준비했지만 실제 `report-2026102909.txt` 큐 등록/발송은 아닙니다. 폰push 수신 미검증입니다. 대화방 결과 보고와 GitHub 인계는 별도로 수행합니다.

기존 PM AS-M1: 공식 접수 페이지에서 마감·설명회 다시보기·심사 접근 조건의 신규 공지를 재조회하고 기존 제출 게이트와 대조. 조회 범위/시각을 기록하고 임의 초대·문의 발송·실제 제출 없이 수행. IT13 원격 재시도·재연결·우회 및 공통 원장 동기화는 공식 사용 가능 상태 확인 전 보류.
