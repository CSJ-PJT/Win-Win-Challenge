# 공식 v4 문서와 비공개 후보 개정본 대조

2026-10-27 15시 기존 PM이 candidate-f1164b0-75b53185-docv4-r1을 별도로 준비했습니다. 14:59:56 KST 14파일·체크섬13개 모두 일치, 기존13시후보12파일 변화0. 공식 파일을 중복 생성하지 않고 **동일 ID·버전4·저장 해시의 참조**를 연결했습니다. DOCX·PDF 실제 바이트는 후보 폴더에 복제하지 않았으므로 이 폴더만으로 첨부 완료를 주장하지 않습니다.

## 고정한 버전

- 소스 f1164b04dc267260771ce3ffcc674247053f56e7 / CI40436119702 작업3 success·publish skipped를 새로 읽었습니다. PR2 Private Draft/open/미병합, 이번 시작 HEAD5e2504d, 공개 릴리스 v0.3.0-preview만 유지.
- APK 5170860B / SHA75b531853370698e198889457fa6a2c6c55e78cd88e3efc3a7ffb0ae864dd100, source ZIP436508B / SHA917ea32121adf6a6d739a1102f243a46cd001208c200172ec86ff2efbc664d18, PC ZIP28876B / SHAd387260b36f9d6430332e72425fc0a265f8a5f2d49cd68604ed9ec1d544ec365. 기존 CI 산출물 바이트 그대로 복사했고 새 빌드0.
- 공식 DOCX libfile_412035b073bc8191a3980f378b0df188 v4 /500068B/SHAab4145047be92065a7d0a0383d171ad1096f89f68176278e6b8745891dc8192d.
- 공식 PDF libfile_bed9844c793c8191b486dc00e74925fd v4 /760964B/SHA87f1a1745b445bab985eca161dc937e08e3840b8f050f27556254617b70445bc.

두 공식 파일을 현재 Library에서 전문 읽고 v4·파일ID를 확인했습니다. 직전 저장 바이트의 Library ID 메타데이터·해시·크기도 재확인했습니다. 5·7쪽은 f1164b0·75b5와 별도폰bd/test229의 주소17.693초·DOM9.707초를 구분하고, 13쪽은 과거b227ca2/CI40167658701화면을 출처와 함께 유지합니다. 이번에는 문서 편집/재렌더/저장0이며14시13쪽렌더 검수와 별도입니다.

## 후보 무결성 및 보존

IT13 QAroot/AS-M1-PM-20261027T1456 하위 개정본14파일/13체크섬오류0, SHA256SUMS **e7544d063b4091d26b0483125be939a447b53ff7b0304a098b0f105b6023a10a**. DOCUMENT_VERSION_BINDINGS.json과 ACCESS_REVIEW.json을 추가했고, 13시 문서차이 JSON은 HISTORY_DOCUMENT_VERSION_GAPS_V3.json으로 바이트 그대로 보존했습니다. manifest/README만 현재 기준으로 수정했습니다. 13시후보12개와 SHA256SUMS1701675e…c49fb4는 불변입니다. 원본 소스ZIP 내부 과거 README도 보존합니다.

기기 claim없음·진행instrumentation/관련Java·Gradle없음을 선행 확인했고 설치5SHA를 재조회해 전부 동일했습니다. 폰UI·설치·JUnit·새CI0, 원본 앱·데이터와main/easy/address/미커밋 경로 보존. PM 자체검수이며 독립QA승인이 아닙니다.

## 심사 접근 대조

저장소 API의 private=true/visibility=private를 확인했습니다. PM 인증 API 읽기 성공은 심사자 접근 성공을 뜻하지 않습니다. 최초 PowerShell 비로그인 두 요청은 REQUEST_FAILED였으며 실패를 보존했습니다. 후속 curl.exe 비로그인 저장소 HEAD는 HTTP404/exit0입니다. 비로그인 접근은 불가하며 특정 심사자 계정의 실제 접근은 아직 미확인입니다. 공개 전환·초대·권한 확대0.

현재 PM HEAD의 지정 apk/안심동행_안심동행플랫폼_release.apk는 blob fd64e80f7c82712806bebefb221b45457b15b246/5131231B입니다. 최신후보5170860B와 바이트 길이부터 다릅니다. 이번 지정파일 덮어쓰기·게시·실제제출0. 공식 Library ID 역시 외부 심사자 공유 성공을 확인한 링크가 아닙니다.

새 후보는 ready=false입니다. release75b5자체물리NOT_RUN(기존설치release와서명다름), 독립QA·사람사용성·심사접근·실기관/Pleos/AAOS실차 및실제제출은별도미완료입니다. 1차필수기획서/동의/서명과 선택개발산출물·제품검증 조건을 혼동하지 않으며 공식요건은 다음작업에서 최신원문으로 다시 대조합니다.

다음 단일 책임자: 기존 PM이 공식 접수 안내의 최신 원문을 다시 읽고 필수 첨부·본인 서명·제출 수신 경로와 비공개 개발 산출물의 심사 접근 요건을 대조한다. 실제 제출·초대·공개 전환은 수행하지 않는다.

[14시 문서 검수](https://github.com/CSJ-PJT/Win-Win-Challenge/issues/1#issuecomment-6434316354) · [CI](https://github.com/CSJ-PJT/Win-Win-Challenge/actions/runs/40436119702)
