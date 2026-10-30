# dc4dbef CI 산출물 검수 및 Android 주소 시험 stale 조회 보완

2026-10-28 05시 KST 기존 PM, IT13 AS-M1-PM-20261028T0456. CI40566624264/source dc4dbef56917177cad82a2345b561ae4f3838ac9는 04:17:50 KST 최종 failure입니다. verify-build 및 live-address 성공, native-smoke 실패, publish skipped. 과거CI40436119702 성공을 새결과로 합산하지 않습니다.

## 실제 성공 범위
- CI JVM NavigationAdapter retry 계약 OK, Node112/112·fail0, 실제 NaviHelper SDK 의존성 Android release/테스트 및 QA 패키지 빌드 성공.
- PC 실제주소 검색/선택·저장·재조회·지도 및 직접파일 안내7항목 PASS.
- buildZIP12763457030 6055784B SHA70e8d23514db763ffd9904f96cbbff7b8a63e75fece455ba213508a3b1ba1b83, nativeZIP12762864548 346582B SHAd41a815b5568975df99020a6201f45a647580b6bd5b513773a7674a945bc16b9. 실제다운로드SHA/API digest 일치 후 별도경로추출.
- 새 release 5171400B SHA533501c42d60aeb0c115d92992a936155fbd301c09daf920041f26fc46ce2379, cert65e36ac4bef2ff5500c548b1628d159ca49120c07f9c97b783db191ad1d200a0. release-tests SHA6a97ee15dd77396e33f4faa6179fa28837fb03cf193992a3553f98e99e9f28f9. QA c5874b6d...5bab/testfcd4e2ef...8565는 다른 패키지입니다.
- 네 APK를 실제apksigner --verbose --print-certs 검증 exit0/aaptmanifest exit0로 검수. test targetkr.co.ansimdonghaeng 확인. 기존releasec094 서명과 달라 설치/강제교체0. 원래75b5 후보·설치bd와합산안함. sourceZIPSHA1c70e58282e08becc08333cad3e55371afdaef3a1d4408cf6e1b015e405e6750.

## Android 실패 근거
LiveAddressTest JUnit1실패/43.255초, UiAutomator StaleObjectException at visible32→scrollFind52→test126. 공식picker선택/주소반환 후 저장을 누른 다음 주소/시작버튼을 찾는 구간에서 중단했습니다. log ADDRESS_SELECTED, 반환스크린샷02에선택주소/04524, 마지막화면에주소및저장안내가있음을 PNG2개 직접검토했습니다. crash로그0B입니다. 이 화면만으로 cold restore나전체Android시험성공이라고판정하지않습니다. 복원/DOM/UI7후속은 실행되지않았고 LIVE_POSTCODE_ROUNDTRIP_OK도없습니다.

현재release의 web assets8개는기존75b5와전부동일합니다. 이는Android실패가없거나NaviHelper제품수정무관함을입증하지않으며, 실제스택이UI객체조회임을구분할근거입니다.

## 한정 시험 코드 보완
기존visible helper는하나의stale노드만만나도전체조회재시작/150ms×3뒤예외를던졌습니다. 저장이WebView하위트리를교체할때 stale중복노드가뒤의사용가능노드를가릴수있습니다. 바운드조회에서stale가된개별노드는건너뛰고같은조건의다른fresh노드를확인하며,교체중이면3초범위에서전체조건을재조회합니다. 끝까지안정화되지않으면원래StaleObjectException을던집니다. find22초/화면스크롤·주소/pincode·저장·복원assertion 및 본시험본문은모두동일합니다. JS/state주입·예외무시로PASS·무한루프0.

변경은 LiveAddressTest.visible helper에한정하며 제품NavigationAdapter 수정은그대로유지합니다. 새테스트컴파일/실제Android실행의결과는다음기존CI에서별도로확인합니다. 아직보완후통과라고쓰지않습니다. 중복workflow dispatch없이필요한수정커밋의기존CI1회만사용합니다.

## 보존·다음 작업
04:56:45 최신원장/standing승인/배정/03시실패원본·점유확인, lock없음/관련writer0/instrumentation0. 04:59:31 설치5종SHA유지/r2 16체크섬·SUMS465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c불변. 로컬새빌드/설치/폰UI0·실기관전송/권한확대/공개배포/실제제출0. 원본main/easy/address미커밋/앱사용자데이터·공식문서v4·r1r2/제출초안보존. 게시v0.3.0-preview만/PR2 privateDraft open미병합.

SDK실차경로·release자체실기기·독립QA·사용성·유효REST/기관/클라우드·심사접근/서명·실제제출미완료/미확인유지. 야간Slack발송0/기존18시게시읽기만·폰push미확인·새agent/예약/수신자0.

다음단일책임 기존PM: 새CI의LiveAddressTest JUnit결과와cold restore/DOM/native후속실행을확인하고 원본실패·새산출물의소스/해시를분리검수합니다. 새CI중복요청/원본앱교체금지.
