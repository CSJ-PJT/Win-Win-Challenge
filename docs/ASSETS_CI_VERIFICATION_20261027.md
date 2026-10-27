# 자산 준비 수정 CI·배포 ZIP 재현성 검수 — 2026-10-27 12시 KST

기존PM이소스f1164b04dc267260771ce3ffcc674247053f56e7의CI40436119702(11:02:41–11:12:56KST)를직접읽었습니다. verify-build/live-address/native-smoke success,publish skipped. 이전899/CI40402218901과별도판정입니다. 빌드로그에서bundleAndroidWeb→prepareAndroidAssets의실제실행을확인했습니다.

Node112/실패0,글씨12조합(root16/20/24/32px·3화면폭/저장재실행·문서가로넘침없음),PC/HTTP공식주소7/networkFailures0. Android15에뮬레이터release의공식주소JUnit OK1/54.05초·DOM OK1/15.355초/UI7/exit표식5개0을원본아티팩트로확인했습니다. CI로그의중복OK출력은시험건수로합산하지않습니다. 시설인수/양측확인화면PNG1직접검토. PM의실기기09·10시bd/test229결과는합산하지않습니다.

3개ZIP의API digest/다운로드SHA일치·CRC오류0을확인하고IT13와격리분석폴더에원본을보존했습니다. buildZIP17ad41a5…/6017117B,liveZIPf78d1c21…/231309B,nativeZIP26a4c029…/1281084B. release APK **75b531853370698e198889457fa6a2c6c55e78cd88e3efc3a7ffb0ae864dd100**,5170860B. 전체apksigner exit0/v2true/1signer/cert7573330d2f0123a50c4f947e6fe986cccb434f8cd5aba1c2324209dbddbd6831. qa85a57a96/testfb90d81e target.qa/8assets동일도CImanifest와대조했습니다. 새release8자산은직전release53ca와바이트동일하지만서명/APK해시는다릅니다.

## 배포 소스 ZIP 재현

새 sourceZIP **917ea32121adf6a6d739a1102f243a46cd001208c200172ec86ff2efbc664d18**,436508B를LOCALAPPDATA/AnsimBuildTools/workspaces/f1164b0-source-repro에새로풀었습니다. 수동copy/패치없이12:05:59–12:06:23 offline Gradle :app:prepareAndroidAssets 성공23초/exit0. 생성된8개SHA와새release75b5 APK의assets8개가모두같습니다. 원본ZIP의준비전Androidsnapshot이6개인것과Gradle생성산출물8개는구분합니다. 이번로컬전체APK패키징·서명·설치0. 필요한준비단계1회이며CI재요청/전체재빌드가아닙니다.

[전체원장](../build-reports/pm-20261027/assets-ci-verification.json). IT13 QAroot/AS-M1-PM-20261027T1203에3ZIP/원본시험로그와JSON·전체서명/새ZIP준비로그·8SHA/기존설치5SHA보존. 원래5설치SHA동일/claim·activeinstrumentation없음/폰UI0. 기존main/easy/address·미커밋·앱데이터보존.

새release75b5는실기기설치releasec094와서명이다르며보존교체설치를시도하지않았습니다. 물리QA앱bd·기존고정제출후보35/6a28·공식문서v3를새release로소급교체하지않습니다. 공식DOCX/PDF이번재열람편집없음/독립QA·사람사용성·실차·유효REST·기관·심사접근·실제제출미확인. PrivateDraft미병합/게시v0.3.0-preview만유지합니다.

다음 단일 기존 PM: 최신 검증 소스 f1164b0·release75b53185 기준 비공개 제출 후보 목록을 별도 구성하고 기존 후보·공식 문서v3와 버전 차이를 대조합니다. 비공개준비와실제제출승인을분리합니다.
