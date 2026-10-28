# 릴리스 서명 지속 정책 대조 — 2026-10-29 07시 KST

**현재 코드에서 CI 릴리스 인증서의 실행 간 지속성이 보장되지 않는 원인을 확인했습니다.** 현재 후보와 설치본의 보존 업데이트 차단을 해소한 것은 아닙니다. 검토 기준 source `99d5da02f20d3523d55897795d1f4a6b1fb1690a`, PM HEAD `1733c93115e9e843d133ed184373ce0d5f73c61e`, 관측07:05 KST입니다.

## 코드에서 확인한 경로

| 경로 | 현재 코드 | 의미 |
|---|---|---|
| CI release | release043.yml:65–75에서 runner.temp/preview.jks를 keytool -genkeypair로 생성하고 assembleRelease/AndroidTest에 사용 | 매 verify-build 실행의 새 키쌍. 동일한 경로/alias/CN은 동일 개인키·인증서를 뜻하지 않음 |
| CI deviceQa | Gradle deviceQa는 release를 initWith하고 .qa suffix 사용. 같은 CI job의 preview.jks 환경으로 빌드 | 동일 job의 release/QA 공유 서명과 실행 간 지속성은 별개 |
| 로컬 verifyQa | Gradle persistentQa·.verifyqa suffix, ANSIM_QA_KEYSTORE 지정. build_verifyqa.ps1는 필수 환경/키 파일 존재를 확인 | 제공된 QA 지속 키 사용 경로. 이번에 키 내용을 읽거나 존재를 재확인한 것은 아님 |
| 게시 | feature/address-ux-0.4.3에서만 publish, 검증3job을 필요로 함 | 현재 PM branch CI 성공은 자동 게시 성공이 아님 |

대조한 세 파일의 Git blob은 source99와 현재 HEAD에서 **3/3 동일**합니다.

- `.github/workflows/release043.yml`: `3e733478780c30988014aedfdfac65812724efda`
- `android/app/build.gradle`: `17a5a98fe098a600008349672b4796b4a9a6653b`
- `tools/build_verifyqa.ps1`: `a255c513b653e151e004666814401ae4bafb2ba6`

코드의 환경변수 이름·비밀이 아닌 경로 정책만 검토했습니다. 비밀키·credential 파일·GitHub Secrets 내용은 읽지 않았고 키 생성·업로드·수정·권한 확대도 없습니다. 이번 범위의 구성은 지속 release 키를 로드하지 않지만, 다른 보관 장소에 원래 릴리스 개인키가 없다고 단정할 수는 없습니다.

## 실제 인증서 근거와 적용 범위

[10/28 18시 설치 경로 검수](../build-reports/pm-20261028/release-physical-route.json)의 전체 apksigner·manifest 결과를 다시 읽었습니다. 아래는 **그때의 APK 관측**, 이번 새 APK 검증이 아닙니다.

| 구분 | APK SHA-256 | 인증서 SHA-256 |
|---|---|---|
| 기존 설치 release | `c09449f878f70690495b8925d69294bea58889d17b91fe4afdba3231e0dbde54` | `74f3b4db72749aa904fd281ca45c531b271bd8894a65e2117a6a27e4333dd136` |
| 후보 release | `f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f` | `187a401de35e4a9ecc5f8630ab4912c4e4884a9106bdf6b1b76c7ceb97bc5826` |

두 APK는 같은 applicationId `kr.co.ansimdonghaeng`·versionCode9/0.4.3이지만 인증서가 다릅니다. 기존 근거에는 양쪽 v2=true·v3/v3.1=false·1 signer가 기록돼 있으며, 이 APK들에서 회전 계보 증거를 확보한 것이 아닙니다. 현재 쌍의 일반 보존 업데이트는 차단돼 있고 설치 시도는 없었습니다.

CI의 새 키 생성 코드는 재실행 간 인증서가 달라지는 구조를 설명합니다. 다만 이 검토만으로 기존 설치본의 원래 비밀키 생성·보관 이력을 모두 확인한 것은 아닙니다. verifyQa 지속 서명 `323cea98…`을 사용했다는 사실도 원본 release 서명 `74f3b4db…`의 대체 허가나 호환성을 뜻하지 않습니다.

현재 CI [40592432776](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40592432776)는 verify-build/live-address/native-smoke 성공, publish skipped를 재조회했습니다. 게시 릴리스는 기존 v0.3.0-preview(10/23)뿐입니다. 새 CI나 빌드는 요청하지 않았습니다.

## 해소 조건과 금지된 단축 경로

- **현재 봉인 후보 f3b8의 물리 검증:** 기존 앱을 삭제하지 않는 별도 적합한 프로젝트 시험 단말 등 실제 사용 가능한 경로가 확인돼야 합니다. 10/28 조사에서 보인 IT13 ADB 단말1개는 그 범위의 과거 관측이며 다른 기기 전체 부재 주장은 아닙니다. 에뮬레이터 결과를 실제폰 PASS로 대체하지 않습니다.
- **기존 설치 release의 보존 업데이트:** 권한 있는 원래 서명키와 인증서 일치 또는 실제 지원되는 서명 계보·업데이트 조건을 검증해야 합니다. 원래 키 가용성은 미확인입니다. 새로 서명/재빌드하면 기존 봉인 f3b8과 바이트가 달라져 별도 후보·해시·검증이 필요합니다. 이번에는 실행하지 않았습니다.
- **향후 지속 release 서명:** 소유·보관·백업·접근 범위와 기존 인증서 관계가 정해진 뒤 별도로 검토할 사안입니다. 새 키/Secrets·클라우드·권한·비용·배포 정책은 이번 검토로 변경하지 않습니다.
- **기존 앱 삭제·초기화·강제 서명 교체:** 승인된 해결책이 아닙니다. 새 applicationId의 앱이 통과해도 원본 release 바이너리 자체의 물리 PASS로 계산하지 않습니다.

### 게시 안내의 남은 위험

현재 release043.yml의 future publish notes에는 서명이 다르면 삭제 후 설치해야 하며 저장 기록이 지워진다는 안내가 있습니다. 이는 현재 사용자의 앱·데이터 보존 조건에서 실행할 수 있는 경로가 아닙니다. publish는 skipped이며 이 안내를 실제 배포하거나 설치하지 않았습니다. 이번 workflow 문구/코드도 수정하지 않았습니다. 실제 게시 전에는 보존 경로와 안내의 일치를 별도 게이트로 유지해야 합니다.

## 현장·문서·보고 경계

06시 Desktop Commander의 월간 사용량 소진/“do not retry or reconnect” 결과를 GitHub 기록에서 확인했습니다. 이번에는 해당 원격 도구를 다시 호출하거나 다른 경로로 우회하지 않았습니다. IT13 공통 OPS·standing·assignment·점유/프로세스/잠금을 새로 읽지 못했고 공통 원장 동기화도 미수행입니다. GitHub PR #2 지정/최신후속 댓글과 직전 인계는 읽었습니다. 현장 무점유·기기 연결 상태·새 해시 검증을 주장하지 않습니다.

설치5SHA·후보 r4 20/20은 **10/29 05:07:07 마지막 관측**으로만 유지합니다. DOCX/PDF 동일ID v5는 이번에 새로 읽거나 편집·생성하지 않았습니다. 원본 main/easy/address·미커밋·앱데이터·봉인후보를 조작하지 않았습니다.

신규 제품 코드·키·권한·비용·빌드·설치·실기기/JUnit·공개게시·실제제출은 모두0. 릴리스 물리·독립 QA·사람 사용성·AAOS/실차·실제 제출은 여전히 미완료입니다. 야간 Slack 발송0, 10/28 18:11:31 기존 ArchiveOS 게시 검색만 확인했으며 실제 폰 push 수신은 미검증입니다. 기존 예약 변경0이며 제품 완료와 구분합니다.

기존 PM AS-M1: GitHub에 등록된 후보 r4·제출 게이트·메일 검토 기록이 릴리스 서명 지속성 및 release 물리 미실행 차단을 일관되게 표시하는지 대조. 원격 호출·키/권한/비용/배포·실제 제출 변경 없이 수행. IT13 원장 동기화·큰 글씨 물리 시험은 공식 사용 가능 상태 확인까지 보류하고 재시도/재연결/우회 금지.

[기계 판정·바인딩](../build-reports/pm-20261029/release-signing-policy-review.json)
