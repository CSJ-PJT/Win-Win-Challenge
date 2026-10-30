#!/usr/bin/env bash
set -euo pipefail
mkdir -p native-results
collect_address() {
  adb logcat -d -b crash > native-results/crash-logcat.txt 2>&1 || true
  adb shell dumpsys activity activities > native-results/activity-state.txt 2>&1 || true
  adb logcat -d -s HandoffAddress:I HandoffMap:I > native-results/address-logcat.txt 2>&1 || true
  adb pull /sdcard/Android/data/kr.co.ansimdonghaeng/files/address-qa native-results/live-address >/dev/null 2>&1 || true
}
trap collect_address EXIT
adb install -r build-input/apk/ansim-platform-0.4.3-preview.apk
adb shell pm clear kr.co.ansimdonghaeng
adb install -r build-input/apk/ansim-address-tests.apk
set +e
timeout -k 5s 240s adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.LiveAddressTest kr.co.ansimdonghaeng.test/androidx.test.runner.AndroidJUnitRunner | tee native-results/live-address-test.txt
instrument_rc=${PIPESTATUS[0]}
grep -F 'OK (1 test)' native-results/live-address-test.txt
address_rc=$?
collect_address
trap - EXIT
adb shell am force-stop kr.co.ansimdonghaeng
if [ "$instrument_rc" -ne 0 ] || [ "$address_rc" -ne 0 ]; then exit 1; fi
python3 -u test/android_smoke.py build-input/apk/ansim-platform-0.4.3-preview.apk --output native-results --reuse-address
flow_rc=$?
printf 'instrument_exit=%s\naddress_exit=%s\nflow_exit=%s\n' "$instrument_rc" "$address_rc" "$flow_rc" > native-results/check-status.txt
if [ "$instrument_rc" -ne 0 ] || [ "$address_rc" -ne 0 ] || [ "$flow_rc" -ne 0 ]; then exit 1; fi


# Independent DOM instrumentation: no accessibility-node dependency, no remote debugger.
timeout -k 5s 180s adb shell am instrument -w -r -e class kr.co.ansimdonghaeng.DomFlowTest kr.co.ansimdonghaeng.test/androidx.test.runner.AndroidJUnitRunner | tee native-results/dom-flow-test.txt
dom_process_rc=${PIPESTATUS[0]}
grep -F 'OK (1 test)' native-results/dom-flow-test.txt
dom_result_rc=$?
adb logcat -d -s HandoffDom:I > native-results/dom-flow-logcat.txt
printf 'dom_process_exit=%s\ndom_result_exit=%s\n' "$dom_process_rc" "$dom_result_rc" >> native-results/check-status.txt
if [ "$dom_process_rc" -ne 0 ] || [ "$dom_result_rc" -ne 0 ]; then exit 1; fi
