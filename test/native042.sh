#!/usr/bin/env bash
set -euo pipefail
mkdir -p native-results
collect_address() {
  adb logcat -d -s HandoffAddress:I HandoffMap:I > native-results/address-logcat.txt 2>&1 || true
  adb pull /sdcard/Android/data/kr.co.ansimdonghaeng/files/address-qa native-results/live-address >/dev/null 2>&1 || true
}
trap collect_address EXIT
adb install -r build-input/apk/ansim-platform-0.4.2-preview.apk
adb shell pm clear kr.co.ansimdonghaeng
adb install -r build-input/apk/ansim-address-tests.apk
set +e
timeout -k 5s 150s adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.LiveAddressTest kr.co.ansimdonghaeng.test/androidx.test.runner.AndroidJUnitRunner | tee native-results/live-address-test.txt
instrument_rc=${PIPESTATUS[0]}
grep -F 'OK (1 test)' native-results/live-address-test.txt
address_rc=$?
collect_address
trap - EXIT
adb shell am force-stop kr.co.ansimdonghaeng
adb shell pm clear kr.co.ansimdonghaeng
python3 -u test/android_smoke.py build-input/apk/ansim-platform-0.4.2-preview.apk --output native-results
flow_rc=$?
printf 'instrument_exit=%s\naddress_exit=%s\nflow_exit=%s\n' "$instrument_rc" "$address_rc" "$flow_rc" > native-results/check-status.txt
if [ "$instrument_rc" -ne 0 ] || [ "$address_rc" -ne 0 ] || [ "$flow_rc" -ne 0 ]; then exit 1; fi
