#!/usr/bin/env bash
set -euo pipefail
mkdir -p native-results
cleanup() {
  adb logcat -d -s HandoffAddress:I HandoffMap:I > native-results/address-logcat.txt 2>&1 || true
  adb pull /sdcard/Android/data/kr.co.ansimdonghaeng/files/address-qa native-results/live-address >/dev/null 2>&1 || true
}
trap cleanup EXIT
python3 -u test/android_smoke.py build-input/apk/ansim-platform-0.4.2-preview.apk --output native-results
adb shell am force-stop kr.co.ansimdonghaeng
adb shell pm clear kr.co.ansimdonghaeng
adb install -r build-input/apk/ansim-address-tests.apk
adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.LiveAddressTest kr.co.ansimdonghaeng.test/androidx.test.runner.AndroidJUnitRunner | tee native-results/live-address-test.txt
grep -F 'OK (1 test)' native-results/live-address-test.txt
