# Android official-address test initial picker — 2026-10-28 07시 KST

CI40574317929 attempt2/source6a8143ef completed failure at06:07:14KST. verify-build and PC live-address succeeded; native-smoke failed; publish skipped. Node112/0, controlled JVM NavigationAdapter retry and actual SDK Android builds succeeded. PC real postcode/map7 checks/networkFailures0 are separate from Android.

Android JUnit ran1/failed1/48.489s, AssertionError Missing visible control: 인계자 at openOfficialDestinationEditor line92 (first role tap). The actual failure.png and last-screen.png directly show the initial '방문 유형 선택' dialog; window.xml exposes android.app.Dialog and the clickable android.widget.Button '유치원 등원 햇살유치원', no role tab. address-logcat.txt empty. This is a clean-start setup mismatch before any official address request, not evidence that address return/save worked. Cold restore/DOM/UI7 were not reached. Previous stale failure and attempt1 apt timeout remain separate preserved evidence.

Limited change: wait bounded22s for initial picker or role; when initial picker already open, select its real button directly. Restored visit still uses 인계자→방문 변경 first. Use Button class plus textContains to avoid clicking the Dialog aggregate text; wait for role after picker dismissal. @Test body/address/postcode/save/restore assertions remain byte-identical. Product source, permissions, persistence, UX and phone installs unchanged. No JS/state injection, ignored assertions, clearing phone data or retry loop.

Three attempt2 ZIPs downloaded with API digest equality:
build12771130122 6061896B SHA3dca6592d9bab0d888035f1e2d8fa6014a3e87a71fe5e46ecd8380f0fc7bc4c2
native12770134729 194058B SHA8859cc43210a07492360661d098cfd9174219268d1f1532a57e0fb16977b11c8
live12770836973 225416B SHAfd2cd5c88f73e3594c795c26e467f76fecd81ad73a92b8d87417b2b77390818d
Do not merge attempt1 artifact12766027572 with the full build artifact.

All four APKs apksigner verbose and aapt manifest exit0, certificate9bfeeeb3ff8c3c158a2a9a4052800f025072d978adb594218855685e633ca09b:
release ad5dedd0c15a56a8befc172f3e7917fa02c12a05c7a975b5d10ac0c3b44b8a11/5171400B
release-test4c63ad424381a5ff00945ac06c0488faf30fd7e9820f280322db2f13beca5450/828972B
QA fbeb49639d21d0ad10b39f7fc6376b10aed76f4c7aaaf165db6dfc18c4c5a2ae/5171420B
QA-test f307057a603d2419ec27ce0b35c3b057f41790287a927efc2988239772af154c/829000B
SourceZIP8ae14c04f0c71fa7cd97520431f471a54fbdb4b5f7e934c420a0d80d840b4704/480862B.

IT13 isolated workspace from this sourceZIP only. First local compile wrapper stopped on native stderr SDK XML warning due PowerShell ErrorActionPreference Stop; log preserved, not Java failure. Follow-up uses normal native exit handling. Compilation is not instrumentation/runtime PASS.
Evidence QAroot/AS-M1-PM-20261028T0704 includes original job logs, ZIPs, screenshots/XML, metadata, compile log and preservation JSON.

07:06:30KST sealed candidate r2 16/16/SUMS465f8212 unchanged; installed5 SHA unchanged. No lock/active instrumentation/project writer before work. No original main/easy/address/uncommitted change, app deletion/reset/replacement. Formal v4 DOCX/PDF and sealedr1/r2/private mail draft preserved. Product completion, physical release, independent QA/human usability, live REST/Pleos vehicle/institution/cloud, signature validity/judging access/submission remain separate. No public distribution/submission/permission change/new cost, new agent/schedule/recipient. Night Slack not sent; previous18h post read only; phonepush unverified.

Next single owner existing PM: inspect the necessary one new CI for this bounded test setup change; read actual JUnit/address save+cold restore/DOM outcomes and resulting byte hashes. Do not replace preserved phone apps or report old green CI as the new fix pass.

Local follow-up compileReleaseAndroidTestJavaWithJavac: BUILD SUCCESSFUL in19s/exit0; no APK packaging/install/runtime test. New CI pending after source push, no separate dispatch.
