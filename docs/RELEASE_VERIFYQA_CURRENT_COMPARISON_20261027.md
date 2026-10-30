# Current release and installed verifyqa comparison — 2026-10-27 18시 KST

The designated private-branch release APK and installed verifyqa contain identical web assets. Static differences were classified; release physical execution remains unverified.

| Item | Release | verifyqa |
|---|---|---|
| SHA-256 | `75b531853370698e198889457fa6a2c6c55e78cd88e3efc3a7ffb0ae864dd100` | `bd79075fa5140cc8064c41676f5b56ca479ff2caa8da858baf8b1e06db7fa996` |
| Package | kr.co.ansimdonghaeng | kr.co.ansimdonghaeng.verifyqa |
| Version name | 0.4.3 | 0.4.3-verifyqa |
| Label | 안심동행 플랫폼 | 안심동행 검증 |
| ZIP file entries | 60 | 60 |

At 2026-10-27T18:06:43.8024256+09:00, all five installed package hashes match the prior baseline. The archived verifyqa compared here matches the currently installed verifyqa SHA-256. Original release, .qa, .qa.test and .verifyqa.test remain distinct binaries; no install, reset, uninstall, build or instrumentation was performed. Device lock absent, host Java/Gradle writers absent. The unsupported instrumentation subcommand failed; a subsequent activity-dump inspection found 0 active instrumentation markers.

## Comparison result

- All 8 assets entries are byte-identical. 57 of 60 ZIP entries match. The three differing entries are AndroidManifest.xml, classes.dex and resources.arsc. ZIP entries do not cover APK signing blocks.
- Manifest dumps: 59 lines each; exactly 3 different lines, package/versionName/label shown above.
- Resource dumps: 494 lines each; 387 raw differing lines. Replacing only the verifyqa package qualifier with the release qualifier leaves 0 differing lines.
- DEX dumps: 847,550 lines each; 334,495 raw differing lines. After the normalization below, exactly 3 differing values remain, all in kr.co.ansimdonghaeng.BuildConfig: APPLICATION_ID, BUILD_TYPE (release/verifyQa), VERSION_NAME.
- Normalize input-path banner lines, absolute code byte offsets/raw instruction bytes, bracketed method byte offsets and numeric string/method/type/field reference indices. Resolved text and decoded operations remain compared. This is a lexical decoded-dump comparison, not a proof of runtime or formal equivalence.
- Prior certificate observations belong to these same APK hashes but were not rerun here: release certificate 7573330d…bd6831; verifyqa 323cea98…e08e; original installed release 74f3b4db…d136. No forced signature replacement is authorized.

## Execution evidence and limitations

IT13 evidence: AS-M1-PM-20261027T1757, comparison-final.json, zip-comparison.json, normalized-followup.json, manifest/resources dumps and both DEX dumps. The initial Compare-Object stalled after extraction; only its verified own PID44348 was stopped. A linear C# follow-up completed. Incomplete offset normalization initially left 25,546 differences; the corrected normalization leaves the 3 BuildConfig values. Inventory save and JSON code-page errors were corrected with explicit UTF-8 reads/writes. These intermediate failures are not app/JUnit failures or whole-script PASS claims.

Sealed doc-v4-r1 candidate: 14 files, all 13 checksum entries match; SHA256SUMS e7544d063b4091d26b0483125be939a447b53ff7b0304a098b0f105b6023a10a unchanged. Formal DOCX/PDF were not edited or duplicated. New server/external-service calls: 0.

Latest source CI40436119702/f1164b0 remains successful, publish skipped. PR2 remains private Draft/open/unmerged; only v0.3.0-preview is published. This documentation commit does not require a rebuild and does not extend emulator or verifyqa results to the release APK.

## Next single owner and action

Existing PM, temporary AS-Q1 owner: perform one primary-flow E2E through actual ADB UI touches on the already installed verifyqa bd79075f, covering departure, arrival, connection number, both-side handoff and guardian completion. Inspect the current claim/process and preserve original apps/data first. This is PM self-QA, not independent QA or human usability approval. Release physical execution, independent approval, valid external REST/institution/car integrations, judge access, signed-document attachment and actual submission remain uncompleted or unverified as separately recorded.
