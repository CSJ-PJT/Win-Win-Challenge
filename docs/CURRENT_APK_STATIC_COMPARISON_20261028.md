# 현재 release·verifyQa APK 정적 비교 — 2026-10-28 17시 KST

기존 PM(AS-M1)이 17:10–17:11 현재 두 바이너리를 직접 분석했습니다. 웹 자산 8/8과 ZIP 항목 57/60이 같고, 남은 DEX 차이는 BuildConfig 상수 3개입니다. **정적 분석이며 release 실기기 통과나 런타임 동등성 증명은 아닙니다.**

| 범위 | release | verifyQa |
|---|---|---|
| 제품/시험 소스 | 99d5da02f20d3523d55897795d1f4a6b1fb1690a | 동일 소스의 로컬 지속서명 빌드 |
| APK SHA256 | f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f | 93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045 |
| 크기 | 5,171,400B | 5,171,440B |
| package | kr.co.ansimdonghaeng | kr.co.ansimdonghaeng.verifyqa |
| versionName / code | 0.4.3 / 9 | 0.4.3-verifyqa / 9 |
| 서명 | 187a401d…5826 | 323cea98…e08e |
| 실제 시험 | CI40592432776 Android15 에뮬레이터 | Android16 폰 PM 자체 QA |

## 실제 비교

- ZIP 각 60항목, 동일 57, 이름 추가/삭제 0. 다른 항목은 classes.dex·AndroidManifest.xml·resources.arsc. 웹 자산 8개는 모두 SHA256 일치.
- dexdump 각각 847,708줄. 원시 차이 334,557줄에서 파일경로·명령 바이트/절대위치·참조 인덱스를 정규화한 잔여는 3줄: BuildConfig APPLICATION_ID, BUILD_TYPE(release/verifyQa), VERSION_NAME. 다른 디코딩 줄의 잔여 차이 0. 줄 수와 문맥을 함께 검사했으며 최적화/전체 실행 동작의 형식적 동등성은 주장하지 않음.
- manifest 59줄 중 3줄 차이: package, versionName, label(안심동행 플랫폼/안심동행 검증). 최초 콘솔 디코딩의 한글 손실을 원문 보존하고 UTF-8 명시 캡처로 다시 확인.
- resources 출력 494줄 중 387줄은 package 이름 차이. 정확한 package 문자열 치환 뒤 잔여 차이 0.
- 두 APK 모두 apksigner 전체 verify exit0/v2true. 서명은 서로 다름. ZIP 항목 비교는 APK Signing Block 동일성 검사가 아님.

## 검증 경계·보존

CI40592432776/source99d5da0의 verify-build/live-address/native-smoke 성공·publish skipped를 새로 조회했습니다. Node112, PC주소7, Android15 release 공식주소1·DOM1·주요UI7의 과거 결과를 이번 신규 시험으로 합산하지 않습니다. 최신 PR2는 Private/Draft·미병합, 게시 릴리스는 v0.3.0-preview만입니다.

현재 폰 verifyQa930/testdac의 10시 공식주소 JUnit1/17.637초·주소 cold, 11시 DOM JUnit1/9.678초·쉬운 ACK cold는 별도 PM 자체 QA입니다. release f3b8의 물리 실행·독립 QA·사람 사용성·실차/인증외부API·기관클라우드·실제 제출은 미완료입니다.

17:10 보존 재검사: 후보 r4 체크섬20/20·SUMS419f736a…d31a, 설치 APK5종 해시 전부 유지. lock/활성 instrumentation/관련 writer 없음. 새 제품수정·빌드·설치·폰UI·JUnit·CI 요청 0. 원본 main/easy/address·미커밋·앱데이터·봉인r1–r4·공식 같은ID DOCX/PDFv5·메일 검토초안 보존. 이번 추가는 근거 문서 1건이며 제품 출시 진척률을 산정하지 않습니다.

다음 단일 담당은 **기존 PM(AS-M1)**입니다. 기존 release와 후보의 서명 차이를 전제로, 연결된 별도 시험기 등 비파괴 release 물리 검증 경로의 실제 가용성을 읽기 전용으로 사전검수하고 가능/차단 근거를 남깁니다. 프로필 생성·권한 확대·삭제·초기화·강제 교체·공개 배포·제출은 실행하지 않습니다.

원본: IT13 Task/Win-Win-Challenge-QA-20261024/AS-M1-PM-20261028T1704 (DEX 전체 덤프, UTF-8 manifest/resources, apksigner, JSON, 스크립트). 요약 JSON: build-reports/pm-20261028/current-apk-static-comparison.json.
