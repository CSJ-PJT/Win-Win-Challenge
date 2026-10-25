> 2026-10-25 13:59 최신: 시험기 시작상태 수정5188638 + 새test bb17d224(817232B), 동일앱18c999d1 보존. 실기기 저장상태→공식주소 OK1/16.637s, DOM완료상태준비 OK1/9.566s, 완료상태→공식주소 OK1/15.769s. 13시옛시험기실패와구분, 새CI40163763754 진행중. docs/ADDRESS_HARNESS_FIX_20261025.md 우선. PM자체QA/공개release실물승인아님.

> 2026-10-25 13:06 최신: 동일verifyQa18c999d1/test42f683a5의 공식 SDK 주소 선택→저장→프로세스 종료(pid없음)→COLD273ms 후 주소/우편번호 복원 확인. 별도 LiveAddressTest는 기존 완료 화면에서 초기버튼을 가정해1회FAIL(25.18s), 시험기 전제조건 수정 미완료. 이전12시통과와 혼합하지 않음. docs/VERIFYQA_OFFICIAL_COLD_20261025.md 참조. PM자체QA/공개release실물승인아님.

# verifyQa physical verification — 2026-10-25 12시 KST

At11:56–11:59 existing Ansim PM temporarily performed AS-Q1 selfQA, with PHONE-QA-STANDING authorization. Read actual common authorization/latest dispatch, prior results, PR/latest CI and device claim. No lock or active instrumentation/writer/build was found; acquired exclusive AS_Q1_DEVICE.lock and released after results. One connected unlocked USB device. This is PM selfQA, not independent QA/audit approval.

## Exact installed bytes
Source722a366 (product9c277ce), dedicated fixed verifyQa package.
- App kr.co.ansimdonghaeng.verifyqa,5,170,172bytes/SHA18c999d1b3e7969e54d4985eb57224428b5965947d390f00feaad11cd136f21a.
- Test kr.co.ansimdonghaeng.verifyqa.test,816,852bytes/SHA42f683a58352037bf8bc910aa8074db6bc29423e7913589015bf2cfcc41e21ef.
- Prepared exact bytes matched local and staged device SHA, both pm install returned Success/exit0. These packages were absent before install; no -r replacement, uninstall or data clear.
- Final installed hashes matched prepared bytes. Original releasec09449f8 and oldQA2903bc14/testc73efa79 hashes unchanged. No original/oldQA screen/data operation.
- Local persistent certificate323cea98…e08e from previous actual apksigner checks; no key copied/published/new build.

## Separate runtime results
Official LiveAddressTest: OK(1test),14.248seconds,11:57:56 LIVE_POSTCODE_ROUNDTRIP_OK.
DomFlowTest: OK(1test),9.436seconds,11:58:24 PRIMARY_HANDOFF_OK and11:58:27 EASY_ARRIVAL_ACK_OK.
DOM uses instrumentation WebView evaluateJavascript button/input events, no remote debugging/state hook. Manual address→departure→arrival→visible connection code→independent sender/receiver confirmation→guardian→senior arrival/facilityACK verified by test stages. It is not a claim of human usability approval or real institution transmission.

After instrumentation finished, force-stopped only verifyQa; pidof empty then am start Statusok/LaunchStateCOLD/279ms. Settled accessibility and actual screenshot directly confirmed Korean large ACK screen, destination summary and 다른 방문 시작하기. No blank destination instruction or disabled setup controls.
Initial immediate WebView accessibility snapshot was incomplete; reread after settling confirmed ACK without repeating cold launch. A conservative focus guard blocked the first screenshot attempt; capture taken only after QA+ACK visible. Automated next_visit_visible check searched different wording(다음 방문), returnedfalse; direct screenshot confirms actual product button text 다른 방문 시작하기. This is not a missing button defect.
This cold check proves easy ACK persistence. Official-selected-address process cold restore for new verifyQa remains separately unverified; old341 official cold success is not transferred.

## Evidence and limits
Private originals: IT13 Task/Win-Win-Challenge-QA-20261024/AS-Q1-PM-20261025T1156/result.json, install.json, official.txt,dom.txt,markers.log,cold-start.txt,settled-ui.xml,easy-cold.png. Sanitized hashes/results in build-reports/pm-20261025/verifyqa-physical.json. Raw capture retained privately; device identifiers/personal notifications not posted.

Fresh CI40153200618/source722a366,11:06:41–11:16:16KST: verify-build/live-address/native-smoke success, publish skipped. Logs directly read: Node112/0 and emulator official/APK UI/DOM success. This CI uses release/emulator and deviceQa build, not these local verifyQa physical APKs. Newly generated CI artifact byte hashes were not re-downloaded this round.

New verified physical flow and fixed completion UI gap closed for exact verifyQa bytes only. Public release exact binary, independent audit, external Kakao/Geocoder/dialer/Pleos/AAOS/real vehicle/institution auth/cloud, final DOCX/PDF-to-latest evidence consistency remain open. Last original document review10/24 14:16, no regeneration. PR Draft/unmerged, original branches preserved; no public deployment/submission/cost.
Next single owner existing PM: new verifyQa official-selected-address process cold restore then final submission evidence mapping. Do not repeat successful tests/build/install without a new reason.
