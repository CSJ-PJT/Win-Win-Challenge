# Android 주소 자산 준비 재현성 수정 — 2026-10-27 11시 KST

기존 PM이08시첫6자산미설치APK의원인을추적했습니다. CI release043은bundle뒤web/*.js/style.css/postcode.html와standalone index를Androidassets에복사합니다. 그러나소스ZIP은git ls-files목록으로작성되어새address.js/postcode.html이트래킹되지않은Androidassets에는6개과거파일만들어갔습니다. tools/build_verifyqa.ps1은이미복사를수행하지만08시로컬준비는이를우회하고Gradle을직접실행한것이직접원인입니다. 배포된CI release53ca/현재폰bd가누락됐다는뜻이아닙니다.

## 수정

android/app/build.gradle에bundleAndroidWeb→prepareAndroidAssets→preBuild 의존성을추가했습니다. Node로web소스의standalone index를생성하고build/generated/ansimAssets에5개JS·CSS·postcode·index총8개를Sync합니다. 이름집합검사로누락시빌드를실패시킵니다. 모든variant의assets소스를이generated경로로고정해과거추적스냅샷을사용하지않습니다. 기존PS/CI에서중복bundle·수동copy를제거하고Gradle을통한동일경로로통합했습니다. CI앞단npm bundle은브라우저·PC산출물에필요하여유지합니다. Node22+/기존JDK17·SDK35전제는유지합니다. UI/도메인/앱ID/서명정책변경없음.

## 실제 검증

IT13 LOCALAPPDATA/AnsimBuildTools/workspaces/fc032ea-assets-direct에SHA9ae59db5fdfc8ed20943589cccc857771474ce9d75a148d1129e35f0aa46d18a 기존소스ZIP을새로풀고현재PM HEAD의빌드수정을적용했습니다. GitHub899a5a1→fc032ea 비교에서제품web/android/tools/test변경0(문서만10파일)을확인하여기존ZIP제품바이트가현재제품과같음을확인했습니다. 원본main/easy/address·미커밋작업폴더는수정하지않았습니다.

11:00:22–11:00:53 offline Gradle :app:mergeVerifyQaAssets 실행,BUILD SUCCESSFUL29초/exit0. bundleAndroidWeb/prepareAndroidAssets/preBuild/mergeVerifyQaAssets실제의존성실행확인. 생성8개와병합8개SHA동일,현재서명된verifyqa bd APK의자산8/8과동일. address.js49c8b523…/postcode.html60d78993…포함. 새APK전체패키징/서명/설치/기기UI시험은0이며merge단계검증을전체APK성공으로확대하지않습니다. [원장](../build-reports/pm-20261027/android-assets-reproducibility.json).

읽기전용설치5SHA대조모두동일,QAclaim/activeinstrumentation없음. 기존verifyqa bd/test229의09시공식주소·10시DOM결과는그바이너리범위로유지합니다. 원래release/.qa데이터삭제/초기화/서명강제교체0,새agent/상시작업/실기관전송/비용/공개배포/실제제출0.

이번빌드경로변경에는새CI1회가필요합니다. 직전CI40402218901은이전소스899a5a1의성공이며새수정통과로대체하지않습니다. PMbranch의publish조건은불일치하여공개대상이아닙니다. 새CI완료/산출물은직접읽기전미판정. 고정후보35/6a28·CIrelease53ca·폰bd·공식문서v3미교체/공식DOCX/PDF이번미열람미편집. release자체물리·독립QA·사람사용성·심사접근·실제제출미완료.

다음 단일 기존 PM: 새 CI의빌드/주소/native결과와sourceZIP에서직접준비한8자산·APK내부동일성을확인합니다.
