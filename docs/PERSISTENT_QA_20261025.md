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
