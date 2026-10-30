# 새 준비 만료 소스 실기기 QA — 2026-10-26 09시
AS-Q1-PM-20261026T0905 / 기존 PM 자체 QA. 제품 소스741869b, 문서 HEAD18cc24a를 기준으로 별도 격리 빌드 후 기존 지속 verifyqa 앱에 동일 서명 업데이트했습니다. 공개 release/.qa는 보존했습니다.

## 빌드·바이트
- 실제 JDK17/Gradle8.11.1/SDK35 offline 빌드 exit0,64초,73tasks. 기존 원본 작업공간을 덮어쓰지 않았습니다.
- 새 verifyqa 5,170,900B SHA256 `4edaf75caa62c10f7e5f690149725239d602c68ddad428afc787fcc80b68b88c`.
- verifyqa.test 828,956B SHA256 `41900b95a4ef2a1dafb4af45259c95cde5e6cdec2d728ca265af93a1900f7bc2`, target verifyqa. 이전 설치 테스트와 바이트 동일합니다. 동일 서명 테스트를 한 번 재설치했으며 새 테스트 버전으로 계산하지 않습니다.
- 이전/새 앱·테스트의 실제 apksigner 검증과 지속 인증서 `323cea9877c3cef1cae1692efdbe6638f7355a686181a1991e418cdb1975e08e` 일치, manifest package/target 확인.
- ASCII staging→adb push→기기 sha256sum 대조→pm install-r Success. 삭제/초기화/서명 강제교체 없음.
- 새 APK assets/app.js SHA6067ad0e…4541e, index.html SHAebb63dfe…fed95는 실제 CI741 release 내용과 일치합니다. 전체 APK·서명은 CI bf9c98fe/1425와 다릅니다.

## 실제 실행
단독 claim을 CreateNew로 확보한 뒤 09:10:14.655–09:11:15.401KST 설치/시험·검수를 수행하고 자신의 claim만 반납했습니다. 실행 전 다른 claim·active instrumentation·java/gradle writer 없음, 기기 unlocked 확인.
| 시험 | 실제 결과 |
|---|---|
| 공식 주소 LiveAddressTest | JUnit OK1 /16.665초, 실제 공식 검색·선택·저장/재실행, LIVE_POSTCODE_ROUNDTRIP_OK09:11:04.084 |
| 수동 주소 DomFlowTest | JUnit OK1 /9.330초, 출발→도착→화면6자리→양측인계→보호자→쉬운알림/시설ACK |
| 실제 markers | PRIMARY_HANDOFF_OK09:11:11.041, EASY_ARRIVAL_ACK_OK09:11:13.925 |

JUnit assertion·marker를 확인했으며 adb 종료코드만으로 통과 처리하지 않았습니다. 이 실행은 synthetic QA 방문이며 실제 기관 전송·전화/실차 경로를 실행하지 않았습니다.
새 준비 만료 코드가 설치된 APK에서 위 흐름이 통과한 결과입니다. **실기기10분 준비 만료/자동 갱신을 직접 재현한 시험은 아닙니다.** 그 전용 검증은 기존 브라우저 가상 시계+CI 근거로 유지합니다.

## 보존 판정의 경계
원래 release c09449f8, .qa2903bc14, .qa.testc73efa79의 설치 SHA는 전후 동일했습니다. 사용자 원래 앱을 열거나 데이터를 삭제하지 않았습니다.
업데이트 전후 verifyqa XML은 각6nodes로 주소/우편번호 값이 드러나지 않았고 XML SHA는 같았습니다. 따라서 **기존 저장 주소·전체 localStorage 값이 업데이트를 넘어 같았다는 판정은 미확인**입니다. 동일 서명/pm-r 조건과 이후 새 synthetic 방문의 주소 통과를 서로 구분합니다.
테스트는 방문을 새로 선택하므로 이 후속 성공으로 업데이트 전 저장값 보존을 소급 증명하지 않습니다. 별도 process COLD 검증도 이번에는 하지 않았습니다.
최초 빌드 준비는 DPAPI 파일 끝 공백 때문에 중단됐고 Trim 읽기로 해결했습니다. 키 재생성/노출 없음. 최초 물리 wrapper는 인수 배열 전달 오류로 첫 package조회 전 실패, claim 반납 후 named array 호출로 수정했습니다. 앱 결함·설치 실패 재현으로 계산하지 않습니다.

## 다음 단계
기존 PM 단일 담당이 새 앱의 공식 주소 process COLD와 아직 남은 보존 관찰 범위를 구분해 확인합니다. 독립QA/사람사용성/실차·기관·클라우드/유효REST인증·실제 제출은 미완료입니다.
PR Draft미병합/Private/v0.3.0-preview 게시/0.4.3미게시, 제출 후보41/7801e8ff와 공식 DOCX/PDF 원본은 유지했습니다. 이번 원문 열람/편집/재렌더 없음.
근거 IT13 QAroot/AS-Q1-PM-20261026T0905의 build/manifest/이전오류/result/JUnit/marker/비공개XML 및 build-reports/pm-20261026/readiness-physical.json. 개인정보·시리얼·키는 저장소에 올리지 않았습니다.
