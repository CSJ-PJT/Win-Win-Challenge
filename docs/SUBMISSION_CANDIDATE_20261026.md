# 고정한 비공개 제출 후보 — 2026-10-26 04시

기존 PM의 준비 작업 `AS-M1-PM-20261026T0355`. 실제 배포·제출·계정 초대나 휴대전화 설치를 수행하지 않았다. 기존 APK/소스/앱 데이터를 덮어쓰지 않았다.

## 선택한 소스와 바이트

단순히 최신 실행마다 바뀌는 CI 서명을 따라 새 빌드하지 않고, 이미 원본 로그·ZIP/APK를 검수한 **41c1812013d395b90d9c6ae7a35ccdcee8b377f4 / CI40210143323**을 후보로 고정했다. 제품 코드는 b227이며 이후6e640cd는 README/문서/근거만 달라진 것을 실제 compare 파일 목록에서 확인했다.

| 파일 | 바이트 | SHA256 |
|---|---:|---|
| CI build 원본 ZIP / artifact12605595895 | 5643172 | e618061b224de21e3f25e759d105cedf88d40f59e022df6837f3ee5b1282fea1 |
| release 후보 APK | 5170796 | 7801e8ffc7e393662ad73c57c3cfb385261b6dcc63405b737359a326504fe8a5 |
| 원본 소스 ZIP | 355544 | 5c8afd0564ce0683b5edbd91669048a7302c7d5fd0496a730479f0d73995d15a |

IT13의 별도 새 디렉터리 `Task/Win-Win-Challenge-QA-20261024/AS-M1-PM-20261026T0355/candidate-41c1812-7801e8ff`에 실제 다운로드했다. 이미 있으면 덮어쓰지 않도록 거절하고, ZIP·APK·소스 길이와 해시 일치를 확인했다. APK는 후보임을 드러내는 ASCII 파일명 `ansim-platform-0.4.3-release-candidate.apk`로만 바꿨고 바이트는 변형하지 않았다. 이 이름이 공식 최종 제출 파일명으로 확정된 것은 아니다.

원본 CI ZIP·APK·소스의 ZIP CRC 검사도 통과했다. 소스에는112개 entry, MainActivity/NavigationGuardTest와 Gradle 설정/기존 workflow가 포함된다. 파일명 검사에서 .jks/.p12/.pfx/.keystore/.pem/.key/.env 매칭은 없었다. 이는 파일명 검사이며 전체 비밀값 내용 감사로 확대하지 않는다.

## 새로 완료한 실제 APK 검증

IT13의 SDK35 apksigner로 **전체 verify exit0 / v2 signature=true / signer1개**를 확인했다. 02시 인증서 DER 지문 비교만 했던 검토와 구분한다.

- 인증서 SHA256: `96f4f72921d8c9d5a2c1d3fab694d2861281e2184f534b85194cd1b2b15e1bd6`.
- 실제 aapt2 badging: `kr.co.ansimdonghaeng`, versionCode9, versionName0.4.3, targetSdk35, debuggable 표시 없음.
- 서명키·비밀번호를 읽거나 생성하지 않았다. 인증서 지문만 기록했고 임시 다운로드 주소를 담은 스크립트는 종료 후 제거했다.
- 후보를 휴대전화에 설치하지 않았다. 원본 설치 release c09449f8 및 검증앱 c5/test419 결과·서명과 후보의 결과를 혼합하지 않는다.

## 준비된 동반 기록

후보 디렉터리에는 실제 파일10개를 준비했다: 원본 CI ZIP, 원본 소스 ZIP, release APK, CI QA manifest, actual apksigner log, actual aapt2 badging, candidate-manifest.json, SHA256SUMS.txt, README-candidate.md, README-project-6e640cd.md. 개별 길이/해시 inventory도 상위 작업 디렉터리에 저장했다.

실행 안내는 공식주소 선택·저장→출발→도착→연결번호→양측 인계→보호자 조회·쉬운 알림과 검증 환경을 구분한다. source ZIP README는41시점의 원문이고, 함께 둔 README는6e640cd 최신 설명 사본이다. 상대적인 저장소 링크는 해당 소스/저장소 문맥에서 확인해야 하며 이 폴더를 전체 오프라인 웹사이트라고 표시하지 않는다.

소스 ZIP에는 Gradle wrapper가 없음을 확인했다. 소스 빌드에는 별도 JDK17/Gradle8.11.1/Android SDK·BuildTools35와 SDK 의존성이 필요하다고 안내했다. APK 실행 준비와 소스 재빌드 가능 조건을 구분하며, 비공개 서명키를 포함하지 않았으므로 재빌드가 같은 서명·전체 해시를 재현한다고 쓰지 않는다.

## 최신 CI 및 현재 상태

새로 조회된 **CI40219456270 / 문서 HEAD6e640cd9d48c5bd6120c927c83bf887fe0376331**도 **03:03:55–03:14:33 KST verify-build/live-address/native-smoke success, publish skipped**였다. 이번에 그 run의 job 최종 메타데이터와 소스 compare는 읽었지만 새 run의 원본 로그·새 APK 바이트까지 재검수한 것은 아니다. 후보는 위의41/402101 바이트이며 새6e run의 인증서·해시를 붙이지 않는다. 기존01시 물리 guard1/0.896초는 c5/419의 별도 PM 자체 QA다.

최신 위임·상시승인·배정/직전03시 result/PR댓글을 읽고 claim/관련 writer/진행 instrumentation 없음 확인. 단말 화면·USB 설치/시험 소유권을 취득하지 않았다. 이번 새 수동 빌드·앱 설치/초기화·코드 변경·원본 문서 편집/교체 없음. 문서 원문 마지막 직접 재검토는03시 기록으로 유지한다.

저장소는 Private이며 심사계정 접근·계정 초대·공개 전환·실제 APK 업로드·메일 제출은 미수행이다. 0.3.0-preview 기존 게시 상태, 0.4.3 미게시·공모전 미제출, Draft PR 미병합/main·easy·address 보존. 독립 QA/감사·사람 사용성·실제 AAOS/Pleos·기관/클라우드·유효 REST 인증은 미완료. 후보 준비와 최종 제출 승인/제품 완성은 다르다.

다음 단일 기존 PM은 심사용 실행 시나리오·필수 입력·오류 복구를 이 후보의 실제 검증 로그/화면에 맞춰 정리한다. 접근 및 제출/배포 승인은 계속 별도 범위로 유지한다. 전체 진척률/지난주 비교 미산정, 야간 Slack·새 agent/예약/수신자·공개 runner·비용 없음.

[기계 판독 manifest](../build-reports/pm-20261026/submission-candidate.json). 이 저장소에는 후보 바이너리를 새로 업로드하지 않았으며 실제 바이트는 IT13의 위 비공개 작업 폴더에 준비했다.
