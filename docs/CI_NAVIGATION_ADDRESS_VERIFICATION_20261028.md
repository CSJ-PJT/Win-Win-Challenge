# NaviHelper retry and Android address CI verification — 2026-10-28 08시 KST

Tested source99d5da02f20d3523d55897795d1f4a6b1fb1690a / CI40592432776 completed **success at07:17:53KST**. verify-build/live-address/native-smoke success; publish skipped. This source includes dc4dbef NavigationAdapter manual retry fix and the two bounded address test-helper/setup fixes. Earlier failed runs remain failures and are not added to this run's counts.

Original logs and actual artifacts verified:
- Node112/0; browser regressions; controlled-JVM NavigationAdapter retry success. Actual SDK release/QA build success, not real Navi service initialization or vehicle routing.
- PC real postcode selection/save/reload/Kakao map7 checks success.
- Android15 generic emulator release: official-address JUnit **OK1/59.203s**, ADDRESS_SELECTED and LIVE_POSTCODE_ROUNDTRIP_OK. Saved address Seoul 중구 세종대로110 and04524 seen in restored PNG.
- The JUnit launchApp uses Home→am start: that is a relaunch, not independently a process-cold restart. The following native043.sh and android_smoke.py explicitly force-stop/start before reuse-address assertion, and01-launch.png actually shows saved 세종대로110. This cold check asserts the address, not an additional cold-postcode assertion.
- Android UI7 checks pass; facility-complete PNG directly viewed. DOM **OK1/18.397s**, PRIMARY_HANDOFF_OK and EASY_ARRIVAL_ACK_OK. Distinct JUnit cases; duplicate console grep echoes are not extra tests. Five process/check exit markers0 supplement JUnit/markers/screenshots, never substitute them.
- crash log0B. Kakao analytics tiara CORS errors exist in address log; actual picker returned/saved successfully. Do not call all network logs error-free or infer REST API credentials work.

3 actual ZIP downloads match API digest, native25/build42/live9 files:
native12774992889/1291149B/b8d0d3c26e439c4e150e3fbb2e1c8e025f94507be8c7c5ae7bd39f3a8ac8b935
build12774967132/6062763B/be0cfdf5fe234b3212a7822a347a93279e31589324e232465403a4f785cc0687
live12773934880/248086B/c649473d75bb273543032e00708523e9f96df10d15b8f9ebc7bf0d4232ed450a

All4 APKs apksigner verbose and aapt manifest exit0. Certificate187a401de35e4a9ecc5f8630ab4912c4e4884a9106bdf6b1b76c7ceb97bc5826.
release f3b8c7012f243161a1acd9c1394b29f9849839c0219eb4ad24722ad90e87df3f/5171400B
release-test d1956125f1601727f89ee4c6dd8efcf7fc43b17a2d0b71b736cdc6b238cbce1f/829220B
QA5d34a20aa71be2442b2811b8265ffeb2ce5ec783ca760a75fddbaf8ea06eb486/5171420B
QA-test b1b2977204d7fac108e3f870bd78281ac2137a92131d31db7ef07d49295d16b2/829244B
sourceZIP e9a62dfa3cd64e33eb5a3792b366dd94b9c31e176a2f612cd7f9a4a093990217/483649B.

07:57:01KST installed5 SHA unchanged; sealedr2 16/16 SUMS465f8212d5417f15700e656544b12c547662353c40e717dc43228699a7886e9c unchanged, lockabsent. No local APK build/install/phoneUI/instrumentation/retry/newCI. Source review only; phone release/.qa/bd, oldcandidate75b5/r1/r2, formalv4 DOCX/PDF and private review-only submission draft preserved. New CI release signature differs from installed release: do not replace/reset. No public release/submission/mail/permission expansion/new cost/new recipients/agents/schedules. Slack night send0; previous18h channel post read only, phonepush unverified.
Physical release verification, independent QA/human usability, validREST/Pleos-AAOSvehicle/institution/cloud, consent-signature validity and judging access remain pending/unverified. Documentv4 and submitted version are not automatically updated by this code CI.
IT13 QAroot/AS-M1-PM-20261028T0755 contains raw logs/ZIPs/signatures/manifests/results/privatePNG/XML. Signed transient transfer URLs remain private and are not reproduced here.
Next single owner existing PM: compare verified source/current installed verifyqa and prepare the existing persistent-signature coexisting QA update, preserving original apps/data. Do not rebuild or replay already-passed tests without a concrete new scope.
