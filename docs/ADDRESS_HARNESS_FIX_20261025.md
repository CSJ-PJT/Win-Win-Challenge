# Official address harness start-state fix — 2026-10-25 14시

Confirmed13h defect: previous42f683a5 test assumed 도착지 입력하기 after launch. Restored easy ACK has different controls; one physical run failed25.18s before official picker. That historical failure is preserved in VERIFYQA_OFFICIAL_COLD_20261025.md.

## Change and exact build
Test-only source5188638ef9c72409842c61d0650e99da44a21d54 changes LiveAddressTest.openOfficialDestinationEditor:
normal 방문 변경 → 유치원 등원 → 인계자 → destination action; handles either blank 도착지 입력하기 or saved 도착지 변경. Scrolls action away from bottom toast. No JavaScript/state hook, data clear, release debug/policy or application code changes.
Build only :app:assembleVerifyQaAndroidTest with existing persistent signer, JDK17/SDK35/Gradle8.11.1: BUILD SUCCESSFUL27s/45tasks(4 executed,41 up-to-date)/exit0.
App remains722a366/product9c277ce verifyQa18c999d1b3e7969e54d4985eb57224428b5965947d390f00feaad11cd136f21a.
New test817232bytes/SHAbb17d224e273480e130d66b929fed53a981e4739335d342c6e429dd98ffb7fd5 replaces only previous42f683a5 test. Both actual old/new apksigner verify succeeded with identical323cea98…e08e certificate. Package.verifyqa.test/target.verifyqa and staged deviceSHA inspected before pm install -r Success. No app reinstall, uninstall, data clear or new key.

## Physical regression, bounded and serialized
Existing PM temporary AS-Q1 selfQA, standing approval, exclusive device claim after no other instrumentation/writer. Same Samsung Android16.
- Existing saved visit → official address round trip:13:58:25–13:58:43,JUnit OK1/16.637s.
- DomFlowTest prepares completed easy ACK:13:58:43–13:58:52,JUnit OK1/9.566s; PRIMARY_HANDOFF_OK/EASY_ARRIVAL_ACK_OK. This is setup to reproduce starting state, not an additional product feature.
- Completed easy ACK → fixed official address round trip:13:58:52–13:59:09,JUnit OK1/15.769s.
Both official runs emitted OFFICIAL_TEST_VISIT_READY then LIVE_POSTCODE_ROUNDTRIP_OK. No success inference from process exit alone.
Originalreleasec09449f8, oldQA2903bc14/testc73efa79 and verifyQa18c999d1 installed hashes unchanged. Only isolated test installedhash changed tobb17d224. Synthetic verifyQa visit state changed through normal test controls; prior evidence retained. Claim released.

## Evidence / limits
Private IT13 QAroot AS-Q1-PM-20261025T1355 contains new test APK, previous test copy, old/new signer receipts, target manifest, package-check, build log, three JUnit logs, runs.json, markers.log and result. Public sanitized mapping: build-reports/pm-20261025/address-harness-fix.json. No key, serial, phone number or screen contents posted.
New CI40163763754/source5188638 is in progress at this record; final emulator/release result not inferred from prior40153200618/source722a366 success. Do not combine the freshly generated CI APK with the local existing app/new test pair. Next check reads this CI final logs before rerunning.
Previous13h manual official-selected-address processCOLD273ms remains valid for unchanged app18c999d1, separate from these activity/official harness runs; no new processCOLD test counted.
Physical reported start-state failure is now fixed and checked on both saved/completed states. Independent QA/audit, public release exact binary, external REST/Geocoder/phone/Pleos/AAOS/vehicle/auth/cloud and final DOCX/PDF mapping remain open. Original docs last directreview10/24 14:16, no regenerate. No public release/submission or original source/data overwrite.
