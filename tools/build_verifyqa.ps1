# Requires a prepared private QA signer and JDK17/Android SDK in this process.
$ErrorActionPreference = 'Stop'
if (!$env:ANSIM_QA_KEYSTORE -or !$env:ANSIM_QA_STORE_PASSWORD) { throw 'Private QA signer environment is required' }
if (!(Test-Path $env:ANSIM_QA_KEYSTORE)) { throw 'QA keystore missing' }
if (!$env:ANSIM_GRADLE -or !(Test-Path $env:ANSIM_GRADLE)) { throw 'Set ANSIM_GRADLE to the Gradle executable' }
$root = Split-Path $PSScriptRoot
Push-Location $root
try {
  & node tools/bundle.js
  if ($LASTEXITCODE -ne 0) { throw 'Bundle failed' }
  Copy-Item web/*.js,web/style.css,web/postcode.html android/app/src/main/assets/
  Copy-Item dist/handoff-demo.html android/app/src/main/assets/index.html
  Set-Location android
  & $env:ANSIM_GRADLE --no-daemon --max-workers=1 -PansimTestBuildType=verifyQa :app:assembleVerifyQa :app:assembleVerifyQaAndroidTest
  if ($LASTEXITCODE -ne 0) { throw 'QA APK build failed' }
} finally { Pop-Location }
# Verify APK package, target, signature, debug policy, assets and SHA before install.
# This script never installs, clears or uninstalls an app.
