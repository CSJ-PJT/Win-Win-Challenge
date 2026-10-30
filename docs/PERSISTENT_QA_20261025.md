> 2026-10-25 11:59 최신: source722a366/product9c277ce 고정 verifyQa(18c999d1/test42f683a5) 공존설치·공식주소1(14.248s)·DOM1(9.436s) 실기기 통과. 쉬운 ACK COLD279ms 복원/한글큰글씨/불필요한 빈주소안내·비활성설정 제거 직접 확인. 원래 앱/기존.qa 해시 유지. PM 자체QA, 공개release 바이너리/독립승인 아님. 새verifyQa 공식선택주소 process cold 복원은 별도미검증. docs/VERIFYQA_PHYSICAL_20261025.md 우선; 아래 과거 NOT_RUN/서명차단은 해당 예전 동일패키지 업데이트 범위.

## Final local build evidence — 2026-10-25 11:10:46 KST
Source722a366 (product9c277ce): app + instrumentation APK build exit0. Initial raw Android assets build also succeeded, but only6 tracked assets were present. It was never installed. Applied existing release043 workflow bundle + web/*.js/style.css/postcode.html copy + bundled index before rebuilding: final build32s/73tasks(6 executed,67 up-to-date), exit0,8 assets match prepared inputs. Do not use initial345ff161 APK as the final artifact.
Final APK5,170,172bytes SHA18c999d1b3e7969e54d4985eb57224428b5965947d390f00feaad11cd136f21a.
Test816,852bytes SHA42f683a58352037bf8bc910aa8074db6bc29423e7913589015bf2cfcc41e21ef.
Both actual apksigner verify exit0; certificate323cea9877c3cef1cae1692efdbe6638f7355a686181a1991e418cdb1975e08e.
Actual manifest target verified, app non-debuggable, label 안심동행 검증. 19 unchanged source blobs matched remote c94 before web preparation. Final APK is a locally signed verification variant, not CI release binary.
Key generation first PowerShell invocation stopped on native stderr; subsequent guarded generation using existing protected password completed exit0. One persistent key exists; no private key export or existing app operation.
Final private artifacts/result/signature/manifest/build log: IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T1103. Local reusable build helper below repository tools uses same preparation; it requires private signer env and never installs/clears/uninstalls.
Physical tests NOT_RUN, next single owner existingPM: inspect device claim + installed packages, coexist install only exact final bytes then official-picker and DOM separately. No repeat build/new ID/key generation required. Independent QA/external service/final submission checks remain open.

# Persistent local verification variant — 2026-10-25 11시 KST

Base: c94e72191b2541d0ada747b240f5cd928dcd03a4 (product source9c277ce).
Existing Ansim PM is the single implementation/self-QA owner.

Implemented verifyQa build type, fixed applicationId kr.co.ansimdonghaeng.verifyqa, test package kr.co.ansimdonghaeng.verifyqa.test, namespace kr.co.ansimdonghaeng, label 안심동행 검증, version0.4.3-verifyqa. It coexists with original release and installed .qa; no uninstall/clear/update of either is authorized by this variant.
Release/deviceQa settings and BuildConfig.DEBUG WebView policy unchanged. Java/Kotlin/manifest inspection found no provider authorities or hardcoded app data directory; instrumentation class namespace remains unchanged and runner target must be checked in produced APK.

Local signing config uses ANSIM_QA_KEYSTORE and ANSIM_QA_STORE_PASSWORD, alias ansim-qa. Dedicated key created once in restricted user-local storage; password protected by Windows DPAPI. Neither private material nor password is copied into repository, report or command arguments. Only the verifyQa build uses this config. No existing key was recovered; existing .qa cannot be updated by this signer.
JDK17 / SDK35 / BuildTools35.0.0 / Gradle8.11.1 isolated path from previous toolchain receipt.

Actual assembleVerifyQa and assembleVerifyQaAndroidTest started11:05 KST in isolated workspace. Build result and APK metadata pending at this initial record. No app install/device UI action. Do not treat variant implementation/signing preparation as APK build or physical pass.
Exact QA DOM command after package/hash/cert/target inspection:
adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.DomFlowTest kr.co.ansimdonghaeng.verifyqa.test/androidx.test.runner.AndroidJUnitRunner
Official picker class is kr.co.ansimdonghaeng.LiveAddressTest, separately executed.
Only JUnit OK plus stage evidence counts as pass; do not use release harness unchanged.

Latest completed CI remains40127842234/source9c277ce: Android15 emulator release success. Installed341 QA physical official/DOM/cold results remain separate. Submission originals and external API integrations not revalidated here.
