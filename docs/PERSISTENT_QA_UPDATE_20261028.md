# Current persistent-signature QA update preflight — 2026-10-28 09시 KST

Existing installed verifyqa bd79075f was prepared from899a5a1 with8 CI web assets. Git899a5a1→3969ed2 shows no web source changes; the only main Java change is NavigationAdapter retry fix. Other relevant changes are asset Gradle/helper reproducibility, LiveAddressTest and JVM regression fixture. CurrentPM3969ed2 differs from tested99d5da0 only by2 documentation records. SourceZIPe9a62dfa3cd64e33eb5a3792b366dd94b9c31e176a2f612cd7f9a4a093990217 was verified and extracted into a new isolated workspace; no original main/easy/address/uncommitted changes.

Read installed verifyqa via pm path→device SHA→pull→local SHA→full apksigner. Existing protected persistent QA certificate exported as PUBLIC certificate only with the designated Windows protected password (never printed/exported). SHA323cea9877c3cef1cae1692efdbe6638f7355a686181a1991e418cdb1975e08e equals installed signer. No new key/no .qa signing workaround.
First preflight wrapper stopped on successful adb pull's stderr, reused exact locally hashed bytes in followup. A second password parsing attempt hit trailing newline FormatException; Trim() corrected parsing without modifying the protected file. Final signer preflight success09:05:05. Transient MCP connection failure recovered; no quota bypass.

Necessary one offline persistent verifyQa app+instrumentation build09:05:33–09:06:39, BUILD SUCCESSFUL1m5s/exit0. Gradle prepares8 web assets directly, no manual copy from CI. No new release build or CI requested.
App kr.co.ansimdonghaeng.verifyqa/version9/0.4.3-verifyqa:
5171440B SHA93000752f021cad53d6ec8d05329e372a3e69988bbbb3483f150a33a3f809045.
Test kr.co.ansimdonghaeng.verifyqa.test/targetkr.co.ansimdonghaeng.verifyqa:
829252B SHAdacb173a0e729eb0c74613b653697f55fc2adb62c652b477ead7d904cfaa1ae7.
Both actual apksigner verbose exit0/cert323cea.../aapt manifest exit0. Namespace/test classes remainkr.co.ansimdonghaeng/AndroidJUnitRunner. Normal same-package same-certificate update is eligible for further device preflight; this is not actual install success or runtimePASS. APKs are staged under owned ASCII checks path and copied byte-identically to evidence folder.
New APK assets8/8 SHA equal installedbd APK AND verified CIf3b8c701 release assets. This proves web byte equality only, not native runtime equivalence or vehicleSDK success. New native retry code must not be attributed to the old installedbd phone results.

09:06:58 all5 installed APK SHA unchanged, sealedr2 16/16/SUMS465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c unchanged. No device lock/activeinstrumentation/other project writer at start. No install/phoneUI/appdata clear/delete/signatureforce/real calls/newcost/publication/submission. Formalv4 DOCX/PDF and sealedcandidates/reviewmail preserved. Existing greenCI40592432776 remains verified99d5da0 emulator release, not new verifyQa physical.
Evidence IT13 QAroot/AS-M1-PM-20261028T0902: scripts, publiccert verification, build/rawlogs, app.apk/test.apk, signatures/manifests,8assets/5installedSHA/candidateverification. No private key/password in reports.
Next single owner existing PM: claim/recheck conflict and exact installed hash/cert, normal-r update only verifyqa/test (no-d/noreset), then official-address physical JUnit1 and separate saved-address cold followup. Release original/.qa/.qa.test are never replaced. Human usability/independentQA/physicalrelease/vehicleSDK/liveREST/institution/cloud/judgingaccess/signaturevalidity/actualsubmission remain separate incomplete/unverified.
