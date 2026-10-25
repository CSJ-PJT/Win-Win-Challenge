# Official selected address process cold restore — 2026-10-25 13:06 KST

Existing PM single temporary AS-Q1 / PHONE-QA-STANDING, physical Samsung Android16. Read latest instructions, claim/active instrumentation/writer/CI/results and exact installed APK hashes. Acquired claim and released after bounded run. No new build/install/key/ID or original app/old QA actions.
Source722a366, verifyQa18c999d1/test42f683a5, exact previous12h installed bytes. This is not published release or independent QA approval.

## Actual completed check
With normal product touch controls: 방문 변경 → 유치원 등원 → 인계자 → 도착지 변경 → 주소 검색 → official Kakao postcode road result 서울 중구 세종대로110 → 도착지 저장. Official SDK result and returned postcode04524 observed in XML.
Force-stop only kr.co.ansimdonghaeng.verifyqa, pidof empty, am start Statusok/LaunchStateCOLD/TotalTime273ms/Wait276ms. Initial WebView child snapshot incomplete; settled reread confirmed main address. Opened editor without resaving; field-address and postcode04524 restored. Restored address also directly reviewed in original screenshot; postcode assertion uses accessibility XML, not a claim it was visible above the screenshot fold. Closed editor without save.
New synthetic verifyQa visit changed through normal buttons; previous ACK evidence retained. Originalreleasec09449f8 / oldQA2903bc14/testc73efa79 and new app/test hashes unchanged after check.

## Separate automation failure, not hidden
Before the normal UI route, one LiveAddressTest invocation failed25.18s: Tests1/Failures1, Missing visible control: 도착지 입력하기. ADB exit0 and INSTRUMENTATION_CODE-1 did not count as pass. Instrumentation final XML showed persisted easy ACK/다른 방문 시작하기 instead of the test's blank initial setup. Source directly inspected: launchApp then unconditional tap 도착지 입력하기 at line89.
This is a confirmed harness starting-state assumption. It failed before official picker invocation; not evidence the address service call failed. The normal UI official selection/cold restore completed afterward, without rerunning or changing that test APK. Test harness fix still NOT_IMPLEMENTED, and previous12h OK1/DOM1 is not substituted for this current failed invocation.
Next single PM task: make official instrumentation navigate an existing completed/saved visit safely through normal new-visit/address controls before asserting picker, then build/update only isolated test package with the existing persistent signer and verify once. Preserve app data and no release debug change.

## Diagnostics / retained evidence
Initial shell accessibility snapshots did not expose app nodes despite QA Activity/window focus; content from non-QA packages was not inspected and those local snapshot files were discarded. After instrumentation, compressed/settled dump exposed correct QA controls. Exact cause of initial discrepancy not established; no product rendering defect inferred.
Private originals under IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T1300: failed official log, SDK/returned/saved/cold/editor XML, pid-empty/cold-start logs, screenshots and result. Sanitized hashes in build-reports/pm-20261025/verifyqa-official-cold.json. No screen/phone identity/credentials posted.
Latest app CI remains40153200618/source722a366 success, publish skipped (11:06:41–11:16:16). No CI rerun this round. Its emulator success is separate from current physical harness failure and successful manual product cold check.
DOCX/PDF originals not reread/regenerated, last direct review10/24 14:16. External API/auth/cloud/vehicle availability and final submission mapping remain open; no overall percentage/weekly inference.
